import datetime
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session

from ..repositories.ml_repo import MLRepository
from ..ml.pipeline import MLForecastingPipeline
from ..ml.features import TARGET_VARIABLES

TARGET_DISPLAY_METADATA = {
    "rainfall_mm": {"en": "Rainfall (24h)", "hi": "वर्षा (२४ घंटे)", "unit": "mm"},
    "temp_max_c": {"en": "Maximum Temperature", "hi": "अधिकतम तापमान", "unit": "°C"},
    "temp_min_c": {"en": "Minimum Temperature", "hi": "न्यूनतम तापमान", "unit": "°C"},
    "humidity_pct": {"en": "Relative Humidity", "hi": "सापेक्ष आर्द्रता", "unit": "%"},
    "wind_speed_kmh": {"en": "Wind Speed", "hi": "हवा की गति", "unit": "km/h"},
}

class MLService:
    def __init__(self, db: Session):
        self.db = db
        self.repo = MLRepository(db)
        self.pipeline = MLForecastingPipeline(db)

    def train_models(self, version_tag: str = "v1.0.0", force_retrain: bool = False) -> Dict[str, Any]:
        existing_models = self.repo.get_all_models(version_tag=version_tag)
        if existing_models and not force_retrain:
            champions = {m.target_variable: m.algorithm_type for m in existing_models if m.is_active_champion}
            return {
                "job_id": f"ml-cached-{version_tag}",
                "version_tag": version_tag,
                "status": "cached",
                "training_started_at": existing_models[0].trained_at,
                "training_completed_at": existing_models[0].trained_at,
                "total_models_trained": len(existing_models),
                "champions_selected": champions,
                "summary": [
                    {
                        "model_id": m.id,
                        "model_name": m.model_name,
                        "target_variable": m.target_variable,
                        "algorithm_type": m.algorithm_type,
                        "version_tag": m.version_tag,
                        "is_active_champion": m.is_active_champion,
                        "mae": m.mae,
                        "rmse": m.rmse,
                        "r2_score": m.r2_score,
                        "risk_classification_f1": m.risk_classification_f1,
                        "risk_precision": m.risk_precision,
                        "risk_recall": m.risk_recall,
                        "train_samples_count": m.train_samples_count,
                        "test_samples_count": m.test_samples_count,
                        "trained_at": m.trained_at,
                    }
                    for m in existing_models
                ]
            }

        return self.pipeline.train_and_evaluate_all(version_tag=version_tag)

    def get_comparison_matrix(self, version_tag: str = "v1.0.0") -> Dict[str, Any]:
        models = self.repo.get_all_models(version_tag=version_tag)
        if not models:
            # Auto train initial benchmark if none exist
            self.train_models(version_tag=version_tag)
            models = self.repo.get_all_models(version_tag=version_tag)

        target_benchmarks = []
        for target in TARGET_VARIABLES:
            meta = TARGET_DISPLAY_METADATA.get(target, {"en": target, "hi": target, "unit": ""})
            target_models = [m for m in models if m.target_variable == target]
            champion = next((m for m in target_models if m.is_active_champion), (target_models[0] if target_models else None))

            target_benchmarks.append({
                "target_variable": target,
                "display_name_en": meta["en"],
                "display_name_hi": meta["hi"],
                "unit": meta["unit"],
                "champion_algorithm": champion.algorithm_type if champion else "random_forest",
                "champion_mae": champion.mae if champion else 0.0,
                "champion_rmse": champion.rmse if champion else 0.0,
                "champion_r2": champion.r2_score if champion else 0.0,
                "champion_f1": champion.risk_classification_f1 if champion else 0.0,
                "models": [
                    {
                        "model_id": m.id,
                        "model_name": m.model_name,
                        "target_variable": m.target_variable,
                        "algorithm_type": m.algorithm_type,
                        "version_tag": m.version_tag,
                        "is_active_champion": m.is_active_champion,
                        "mae": m.mae,
                        "rmse": m.rmse,
                        "r2_score": m.r2_score,
                        "risk_classification_f1": m.risk_classification_f1,
                        "risk_precision": m.risk_precision,
                        "risk_recall": m.risk_recall,
                        "train_samples_count": m.train_samples_count,
                        "test_samples_count": m.test_samples_count,
                        "trained_at": m.trained_at,
                    }
                    for m in target_models
                ]
            })

        return {
            "generated_at": datetime.datetime.utcnow(),
            "total_models_evaluated": len(models),
            "evaluation_split": "70% Train / 15% Val / 15% Test (Strict Chronological)",
            "targets": target_benchmarks
        }

    def get_forecast(self, panchayat_id: str) -> Dict[str, Any]:
        return self.pipeline.generate_panchayat_ml_forecast(panchayat_id)
