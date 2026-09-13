import numpy as np
import pandas as pd
from typing import Dict, Any, Tuple, Optional
from sklearn.linear_model import Ridge
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor

class HistoricalAverageBaseline:
    """
    Baseline 1: Historical Day-of-Year (DOY) Climatological Average.
    Computes multi-year empirical mean per calendar day on training set.
    """
    def __init__(self, target_variable: str):
        self.target_variable = target_variable
        self.doy_means: Dict[int, float] = {}
        self.global_mean: float = 0.0

    def fit(self, train_df: pd.DataFrame):
        self.global_mean = float(train_df[self.target_variable].mean())
        grouped = train_df.groupby(train_df["date"].dt.dayofyear)[self.target_variable].mean()
        self.doy_means = grouped.to_dict()

    def predict_df(self, eval_df: pd.DataFrame) -> np.ndarray:
        doys = eval_df["date"].dt.dayofyear.values
        return np.array([self.doy_means.get(d, self.global_mean) for d in doys])


class PersistenceBaseline:
    """
    Baseline 2: Persistence (Yesterday's value: y_t = y_{t-1}).
    """
    def __init__(self, target_variable: str):
        self.target_variable = target_variable

    def fit(self, train_df: pd.DataFrame):
        pass  # Non-parametric

    def predict_df(self, eval_df: pd.DataFrame) -> np.ndarray:
        # Predict the lag-1 value within each panchayat
        preds = []
        for _, group in eval_df.groupby("panchayat_id"):
            lag1 = group[self.target_variable].shift(1).bfill().values
            preds.extend(lag1)
        return np.array(preds)


class RidgeLinearModel:
    """
    Model 1: Ridge Linear Regression (L2 regularized).
    """
    def __init__(self, alpha: float = 1.0):
        self.alpha = alpha
        self.model = Ridge(alpha=alpha, random_state=42)

    def fit(self, X: np.ndarray, y: np.ndarray):
        self.model.fit(X, y)

    def predict(self, X: np.ndarray) -> np.ndarray:
        preds = self.model.predict(X)
        return preds


class RandomForestModel:
    """
    Model 2: Random Forest Ensemble Regressor with variance-based confidence estimation.
    """
    def __init__(self, n_estimators: int = 100, max_depth: int = 12):
        self.n_estimators = n_estimators
        self.max_depth = max_depth
        self.model = RandomForestRegressor(
            n_estimators=n_estimators,
            max_depth=max_depth,
            min_samples_split=4,
            random_state=42,
            n_jobs=-1
        )

    def fit(self, X: np.ndarray, y: np.ndarray):
        self.model.fit(X, y)

    def predict(self, X: np.ndarray) -> np.ndarray:
        return self.model.predict(X)

    def predict_with_intervals(self, X: np.ndarray, z: float = 1.645) -> Tuple[np.ndarray, np.ndarray, np.ndarray, np.ndarray]:
        """
        Computes 90% prediction intervals based on individual tree estimators' variance.
        """
        # (n_estimators, n_samples)
        tree_preds = np.array([tree.predict(X) for tree in self.model.estimators_])
        mean_preds = np.mean(tree_preds, axis=0)
        std_preds = np.std(tree_preds, axis=0)
        
        lower = mean_preds - z * std_preds
        upper = mean_preds + z * std_preds
        # Confidence score % (inverse of relative coefficient of variation)
        cv = np.clip(std_preds / (np.abs(mean_preds) + 1.0), 0.05, 0.5)
        confidence_pct = (1.0 - cv) * 100.0

        return mean_preds, lower, upper, confidence_pct


class GradientBoostingModel:
    """
    Model 3: Gradient Boosted Trees Regressor.
    """
    def __init__(self, n_estimators: int = 100, learning_rate: float = 0.08, max_depth: int = 5):
        self.n_estimators = n_estimators
        self.learning_rate = learning_rate
        self.max_depth = max_depth
        self.model = GradientBoostingRegressor(
            n_estimators=n_estimators,
            learning_rate=learning_rate,
            max_depth=max_depth,
            random_state=42
        )

    def fit(self, X: np.ndarray, y: np.ndarray):
        self.model.fit(X, y)

    def predict(self, X: np.ndarray) -> np.ndarray:
        return self.model.predict(X)
