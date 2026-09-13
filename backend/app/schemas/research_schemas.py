from typing import List, Optional, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field

class ModelComparisonTableRow(BaseModel):
    model_id: str
    algorithm_name: str
    algorithm_type: str
    target_variable: str
    is_champion: bool
    mae: float
    rmse: float
    r2_score: float
    precision: float
    recall: float
    f1_score: float
    sample_count: int
    provenance: str = "real_measured"
    notes_en: str
    notes_hi: str


class ConfusionMatrixData(BaseModel):
    target_name: str
    threshold_label: str
    true_positive: int
    false_positive: int
    true_negative: int
    false_negative: int
    accuracy_pct: float
    sensitivity_recall_pct: float
    specificity_pct: float
    precision_pct: float
    f1_score_pct: float
    sample_count: int
    provenance: str = "real_measured"


class HorizonPerformanceItem(BaseModel):
    horizon_days: int
    horizon_label: str
    rainfall_mae_mm: float
    temp_max_mae_c: float
    temp_min_mae_c: float
    humidity_mae_pct: float
    wind_mae_kmh: float
    forecast_skill_score_pct: float
    confidence_decay_factor: float
    provenance: str = "real_measured"


class PanchayatPerformanceItem(BaseModel):
    panchayat_id: str
    panchayat_name_en: str
    panchayat_name_hi: str
    elevation_m: float
    station_id: str
    temp_mae_c: float
    temp_rmse_c: float
    rainfall_mae_mm: float
    rainfall_f1: float
    rh_mae_pct: float
    overall_skill_score_pct: float
    provenance: str = "demonstration"


class VariablePerformanceItem(BaseModel):
    variable_id: str
    name_en: str
    name_hi: str
    unit: str
    champion_algorithm: str
    best_mae: float
    best_rmse: float
    best_r2: float
    baseline_lift_pct: float
    provenance: str = "real_measured"


class AblationStudyItem(BaseModel):
    experiment_id: str
    title_en: str
    title_hi: str
    description_en: str
    features_used_en: str
    features_excluded_en: str
    mae_delta_pct: float
    rmse_delta_pct: float
    r2_delta: float
    attribution_rank: int
    provenance: str = "demonstration"


class DataQualityTelemetryItem(BaseModel):
    metric_id: str
    name_en: str
    name_hi: str
    value: float
    unit: str
    status: str  # "optimal", "acceptable", "warning"
    target_threshold: float
    provenance: str = "real_measured"
    description_en: str


class AdvisoryUsefulnessData(BaseModel):
    total_feedback_count: int
    average_helpfulness_rating: float  # out of 5.0
    thumbs_up_count: int
    thumbs_down_count: int
    satisfaction_rate_pct: float
    observation_agreement_rate_pct: float
    action_adoption_rate_pct: float
    provenance: str = "demonstration"


class FutureExperimentItem(BaseModel):
    experiment_id: str
    title_en: str
    title_hi: str
    category: str
    target_milestone: str
    status: str  # "planned", "data_collection", "in_design"
    hypothesis_en: str
    hypothesis_hi: str
    architecture_en: str
    provenance: str = "future_placeholder"


class ResearchDashboardResponse(BaseModel):
    generated_at: datetime
    active_ml_version: str
    total_models_benchmarked: int
    evaluation_split_description: str
    
    # Core Sections
    model_comparisons: List[ModelComparisonTableRow]
    confusion_matrices: List[ConfusionMatrixData]
    horizon_performance: List[HorizonPerformanceItem]
    panchayat_performance: List[PanchayatPerformanceItem]
    variable_performance: List[VariablePerformanceItem]
    ablation_studies: List[AblationStudyItem]
    data_quality_telemetry: List[DataQualityTelemetryItem]
    advisory_usefulness: AdvisoryUsefulnessData
    future_experiments: List[FutureExperimentItem]
