import numpy as np
from typing import Dict, Any, Tuple
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score, precision_recall_fscore_support

class ModelEvaluator:
    """
    Computes continuous regression metrics (MAE, RMSE, R²) and
    domain-specific classification metrics for agricultural risk categories.
    """

    @staticmethod
    def _categorize_rainfall(val: float) -> int:
        # 0: None, 1: Light (0.1-7.5mm), 2: Moderate (7.5-35.5mm), 3: Heavy (>35.5mm)
        if val < 0.1:
            return 0
        elif val <= 7.5:
            return 1
        elif val <= 35.5:
            return 2
        return 3

    @staticmethod
    def _categorize_temp_max(val: float) -> int:
        # 0: Normal (<33°C), 1: Warm (33-38°C), 2: Heat Stress (>38°C)
        if val < 33.0:
            return 0
        elif val <= 38.0:
            return 1
        return 2

    @staticmethod
    def _categorize_humidity(val: float) -> int:
        # 0: Dry (<40%), 1: Optimal (40-75%), 2: Saturated / High Disease Risk (>75%)
        if val < 40.0:
            return 0
        elif val <= 75.0:
            return 1
        return 2

    @staticmethod
    def _categorize_wind(val: float) -> int:
        # 0: Gentle (<15 km/h, optimal spray), 1: Moderate (15-25 km/h), 2: High Wind (>25 km/h, no spray)
        if val < 15.0:
            return 0
        elif val <= 25.0:
            return 1
        return 2

    @classmethod
    def evaluate_predictions(
        cls,
        y_true: np.ndarray,
        y_pred: np.ndarray,
        target_variable: str
    ) -> Dict[str, float]:
        """
        Calculates MAE, RMSE, R² and risk category Macro Precision/Recall/F1.
        """
        # Ensure non-negative predictions for rainfall and wind speed
        if target_variable in ("rainfall_mm", "wind_speed_kmh", "humidity_pct"):
            y_pred_clipped = np.clip(y_pred, 0.0, None)
            if target_variable == "humidity_pct":
                y_pred_clipped = np.clip(y_pred_clipped, 0.0, 100.0)
        else:
            y_pred_clipped = y_pred

        mae = float(mean_absolute_error(y_true, y_pred_clipped))
        rmse = float(np.sqrt(mean_squared_error(y_true, y_pred_clipped)))
        r2 = float(r2_score(y_true, y_pred_clipped))

        # Risk Classification Categorization
        if target_variable == "rainfall_mm":
            cat_true = [cls._categorize_rainfall(v) for v in y_true]
            cat_pred = [cls._categorize_rainfall(v) for v in y_pred_clipped]
        elif target_variable == "temp_max_c":
            cat_true = [cls._categorize_temp_max(v) for v in y_true]
            cat_pred = [cls._categorize_temp_max(v) for v in y_pred_clipped]
        elif target_variable == "humidity_pct":
            cat_true = [cls._categorize_humidity(v) for v in y_true]
            cat_pred = [cls._categorize_humidity(v) for v in y_pred_clipped]
        elif target_variable == "wind_speed_kmh":
            cat_true = [cls._categorize_wind(v) for v in y_true]
            cat_pred = [cls._categorize_wind(v) for v in y_pred_clipped]
        else:
            cat_true = [0 for _ in y_true]
            cat_pred = [0 for _ in y_pred_clipped]

        prec, rec, f1, _ = precision_recall_fscore_support(
            cat_true,
            cat_pred,
            average="macro",
            zero_division=0
        )

        return {
            "mae": round(mae, 2),
            "rmse": round(rmse, 2),
            "r2_score": round(max(-1.0, r2), 3),
            "risk_precision": round(float(prec), 3),
            "risk_recall": round(float(rec), 3),
            "risk_classification_f1": round(float(f1), 3),
        }
