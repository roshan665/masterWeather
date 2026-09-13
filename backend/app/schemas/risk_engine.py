from typing import List, Optional, Dict, Any, Union
from pydantic import BaseModel, Field

class ForecastVariablesInput(BaseModel):
    rainfall_mm: float = Field(0.0, description="Expected precipitation (mm)")
    rainfall_rate_mm_hr: Optional[float] = Field(0.0, description="Precipitation rate (mm/hr)")
    rain_probability_pct: Optional[float] = Field(0.0, description="Precipitation probability (%)")
    temp_max_c: float = Field(30.0, description="Maximum temperature (°C)")
    temp_min_c: float = Field(22.0, description="Minimum temperature (°C)")
    humidity_pct: float = Field(70.0, description="Relative humidity (%)")
    relative_humidity_pct: Optional[float] = Field(None, description="Relative humidity alias (%)")
    wind_speed_kmh: float = Field(10.0, description="Wind speed (km/h)")
    wind_gusts_kmh: Optional[float] = Field(15.0, description="Wind gusts (km/h)")
    pressure_hpa: Optional[float] = Field(960.0, description="Surface pressure (hPa)")
    solar_radiation_wm2: Optional[float] = Field(500.0, description="Solar radiation (W/m²)")
    soil_moisture_pct: Optional[float] = Field(40.0, description="Soil moisture (0-7cm %)")
    leaf_wetness_pct: Optional[float] = Field(20.0, description="Leaf wetness (%)")
    consecutive_wet_days: Optional[int] = Field(0, description="Consecutive rainy days")
    consecutive_dry_days: Optional[int] = Field(0, description="Consecutive dry days")

    def get_effective_humidity(self) -> float:
        return self.relative_humidity_pct if self.relative_humidity_pct is not None else self.humidity_pct


class CropRiskEvaluationInput(BaseModel):
    crop_id: str = Field(..., description="Crop identifier (e.g. crop-soybean, crop-wheat, crop-chickpea)")
    stage_id: Optional[str] = Field(None, description="Crop growth stage ID (e.g. stage-soy-pod, stage-wht-cri)")
    forecast_variables: ForecastVariablesInput
    forecast_horizon_days: int = Field(1, ge=1, le=14, description="Forecast horizon in days ahead (1-14)")
    confidence_score: float = Field(90.0, ge=0.0, le=100.0, description="Forecast source confidence rating (0-100%)")
    event_duration_hours: float = Field(24.0, ge=1.0, description="Estimated duration of weather event in hours")
    panchayat_id: Optional[str] = Field(None, description="Optional Gram Panchayat ID")


class SubRiskEvaluationItem(BaseModel):
    category_id: str
    category_name_en: str
    category_name_hi: str
    score: int  # 0 to 100
    severity: str  # "normal", "advisory", "warning", "critical"
    severity_label_en: str
    severity_label_hi: str
    is_triggered: bool
    trigger_summary_en: str
    trigger_summary_hi: str
    triggered_rule_code: Optional[str] = None
    triggered_rule_version: Optional[str] = None


class CropRiskEvaluationOutput(BaseModel):
    crop_id: str
    crop_name_en: str
    crop_name_hi: str
    stage_id: str
    stage_name_en: str
    stage_name_hi: str
    
    # Composite Risk Summary
    composite_risk_score: int  # 0 to 100
    severity: str  # "normal", "advisory", "warning", "critical"
    severity_label_en: str
    severity_label_hi: str
    primary_risk_category: str
    
    # Agronomic Explanations & Approved Actions
    explanation_en: str
    explanation_hi: str
    recommended_action_en: str
    recommended_action_hi: str
    
    # Provenance & Source Metadata
    triggered_rule_id: Optional[str] = None
    rule_code: Optional[str] = None
    rule_version: Optional[str] = None
    source_organization_en: str
    source_organization_hi: str
    source_reference: str
    
    # Confidence & Horizon Dynamics
    forecast_horizon_days: int
    event_duration_hours: float
    adjusted_confidence_pct: float
    
    # Sub-Risk Breakdown (5 dimensions)
    sub_risks: List[SubRiskEvaluationItem]
