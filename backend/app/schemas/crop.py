from typing import List, Optional
from pydantic import BaseModel

class CropStageResponse(BaseModel):
    stage_id: str
    crop_id: str
    stage_order: int
    name_en: str
    name_hi: str
    typical_duration_days: int
    water_sensitivity: str
    thermal_sensitivity: str
    critical_weather_triggers: List[str] = []
    description_en: Optional[str] = None
    description_hi: Optional[str] = None

    class Config:
        from_attributes = True

class CropResponse(BaseModel):
    id: str
    name_en: str
    name_hi: str
    botanical_name: str
    season: str
    season_name_en: str
    season_name_hi: str
    typical_sowing_window_en: str
    typical_sowing_window_hi: str
    total_duration_days: int
    icon: str
    primary_risks_en: List[str] = []
    primary_risks_hi: List[str] = []
    stages: List[CropStageResponse] = []

    class Config:
        from_attributes = True

class SowingCalculationRequest(BaseModel):
    crop_id: str
    sowing_date: str # "YYYY-MM-DD"
    current_date: Optional[str] = None

class SowingCalculationResponse(BaseModel):
    crop_id: str
    sowing_date: str
    days_after_sowing: int
    current_stage: CropStageResponse
    stage_progress_pct: float
    total_crop_progress_pct: float
    estimated_harvest_date: str
