import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class ModelBenchmarkMetric(BaseModel):
    model_id: str
    model_name: str
    target_variable: str
    algorithm_type: str
    version_tag: str
    is_active_champion: bool
    mae: float
    rmse: float
    r2_score: float
    risk_classification_f1: float
    risk_precision: float
    risk_recall: float
    train_samples_count: int
    test_samples_count: int
    trained_at: datetime.datetime

    class Config:
        from_attributes = True


class TargetComparisonBenchmark(BaseModel):
    target_variable: str
    display_name_en: str
    display_name_hi: str
    unit: str
    champion_algorithm: str
    champion_mae: float
    champion_rmse: float
    champion_r2: float
    champion_f1: float
    models: List[ModelBenchmarkMetric]


class ModelComparisonMatrixResponse(BaseModel):
    generated_at: datetime.datetime
    total_models_evaluated: int
    evaluation_split: str  # "70% Train / 15% Val / 15% Test (Strict Chronological)"
    targets: List[TargetComparisonBenchmark]


class MLTrainRequest(BaseModel):
    version_tag: str = Field("v1.0.0", description="Model semantic version tag")
    force_retrain: bool = Field(False, description="Force retrain models even if active")


class MLTrainResponse(BaseModel):
    job_id: str
    version_tag: str
    status: str
    training_started_at: datetime.datetime
    training_completed_at: datetime.datetime
    total_models_trained: int
    champions_selected: Dict[str, str]  # {target: algorithm}
    summary: List[ModelBenchmarkMetric]


class PredictionInterval(BaseModel):
    predicted: float
    lower_90: float
    upper_90: float
    confidence_pct: float
    unit: str


class DailyMLForecastItem(BaseModel):
    date: str
    horizon_day: int
    rainfall_mm: PredictionInterval
    temp_max_c: PredictionInterval
    temp_min_c: PredictionInterval
    humidity_pct: PredictionInterval
    wind_speed_kmh: PredictionInterval
    overall_confidence_pct: float
    risk_category: str  # "normal", "advisory", "warning", "critical"
    risk_summary_en: str
    risk_summary_hi: str


class MLPanchayatForecastResponse(BaseModel):
    panchayat_id: str
    panchayat_name_en: str
    panchayat_name_hi: str
    model_version: str
    generated_at: datetime.datetime
    baseline_comparison_lift_pct: float
    daily_forecasts: List[DailyMLForecastItem]
