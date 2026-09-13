import numpy as np
import pandas as pd
from typing import List, Tuple, Dict, Any, Optional
from sklearn.preprocessing import StandardScaler

TARGET_VARIABLES = ["rainfall_mm", "temp_max_c", "temp_min_c", "humidity_pct", "wind_speed_kmh"]

class WeatherFeatureEngineer:
    """
    Transforms raw meteorological time-series into predictive lag, rolling,
    and cyclical features with strict isolation against future-data leakage.
    """

    def __init__(self):
        self.scaler = StandardScaler()
        self.feature_columns: List[str] = []
        self.is_fitted: bool = False

    def build_raw_feature_matrix(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        Constructs lag features, rolling windows, and seasonal signals.
        Computations are performed strictly within each Panchayat grouping.
        """
        df_sorted = df.sort_values(by=["panchayat_id", "date"]).copy()
        engineered = []

        for p_id, group in df_sorted.groupby("panchayat_id"):
            g = group.copy()

            # 1. Cyclical Calendar Encodings (Day of Year & Month)
            doy = g["date"].dt.dayofyear
            g["doy_sin"] = np.sin(2 * np.pi * doy / 365.25)
            g["doy_cos"] = np.cos(2 * np.pi * doy / 365.25)
            g["month_sin"] = np.sin(2 * np.pi * g["date"].dt.month / 12.0)
            g["month_cos"] = np.cos(2 * np.pi * g["date"].dt.month / 12.0)

            # 2. Lag Features (t-1, t-2, t-3, t-7)
            for target in TARGET_VARIABLES:
                g[f"{target}_lag1"] = g[target].shift(1)
                g[f"{target}_lag2"] = g[target].shift(2)
                g[f"{target}_lag3"] = g[target].shift(3)
                g[f"{target}_lag7"] = g[target].shift(7)

            # 3. Rolling Window Aggregations (Past 3 and 7 days, excluding current day)
            for target in ["temp_max_c", "temp_min_c", "rainfall_mm", "humidity_pct", "wind_speed_kmh"]:
                g[f"{target}_roll3_mean"] = g[target].shift(1).rolling(3, min_periods=1).mean()
                g[f"{target}_roll7_mean"] = g[target].shift(1).rolling(7, min_periods=1).mean()
                g[f"{target}_roll7_std"] = g[target].shift(1).rolling(7, min_periods=1).std().fillna(0.0)
                g[f"{target}_roll7_max"] = g[target].shift(1).rolling(7, min_periods=1).max()
                g[f"{target}_roll7_min"] = g[target].shift(1).rolling(7, min_periods=1).min()

            # 4. Domain & Differential Features
            # Diurnal Temperature Range lag: (Tmax - Tmin) of yesterday
            g["diurnal_range_lag1"] = g["temp_max_c_lag1"] - g["temp_min_c_lag1"]
            g["temp_diff_lag1_2"] = g["temp_max_c_lag1"] - g["temp_max_c_lag2"]
            g["rh_diff_lag1_2"] = g["humidity_pct_lag1"] - g["humidity_pct_lag2"]

            # 5. Consecutive Wet Days Counter (Antecedent Precipitation)
            rain_lag = g["rainfall_mm"].shift(1).fillna(0.0)
            g["antecedent_rain_3d"] = g["rainfall_mm"].shift(1).rolling(3, min_periods=1).sum()
            g["antecedent_rain_7d"] = g["rainfall_mm"].shift(1).rolling(7, min_periods=1).sum()

            engineered.append(g)

        result_df = pd.concat(engineered).sort_values(by=["date", "panchayat_id"]).reset_index(drop=True)
        # Drop initial rows where lag-7 is NaN
        clean_df = result_df.dropna(subset=[f"{t}_lag7" for t in TARGET_VARIABLES]).reset_index(drop=True)
        return clean_df

    def fit_transform_train(self, train_df: pd.DataFrame, target: str) -> Tuple[np.ndarray, np.ndarray, List[str]]:
        """
        Builds feature matrix and fits the standard scaler ONLY on training data.
        """
        train_feat_df = self.build_raw_feature_matrix(train_df)
        
        # Exclude non-feature identifiers and target labels
        non_feature_cols = {"date", "panchayat_id", "panchayat_name", "soil_type", *TARGET_VARIABLES}
        self.feature_columns = [c for c in train_feat_df.columns if c not in non_feature_cols]

        X_raw = train_feat_df[self.feature_columns].values
        y = train_feat_df[target].values

        X_scaled = self.scaler.fit_transform(X_raw)
        self.is_fitted = True
        return X_scaled, y, self.feature_columns

    def transform_eval(self, eval_df: pd.DataFrame, target: str) -> Tuple[np.ndarray, np.ndarray]:
        """
        Transforms validation or test dataset using the pre-fitted training scaler.
        """
        assert self.is_fitted, "Scaler must be fitted on train dataset first!"
        eval_feat_df = self.build_raw_feature_matrix(eval_df)
        
        X_raw = eval_feat_df[self.feature_columns].values
        y = eval_feat_df[target].values
        X_scaled = self.scaler.transform(X_raw)
        return X_scaled, y
