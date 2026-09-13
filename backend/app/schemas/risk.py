from typing import List, Optional
from pydantic import BaseModel

class SubRiskDetailSchema(BaseModel):
    id: str
    category: str
    name_en: str
    name_hi: str
    score: float
    level: str
    trigger_condition_en: str
    trigger_condition_hi: str
    mitigation_en: str
    mitigation_hi: str

class StageSensitivitySchema(BaseModel):
    stage_id: str
    stage_name_en: str
    stage_name_hi: str
    water_sensitivity: str
    thermal_sensitivity: str
    pest_vulnerability: str

class CropRiskResponse(BaseModel):
    panchayat_id: str
    panchayat_name_en: str
    panchayat_name_hi: str
    crop_id: str
    crop_name_en: str
    crop_name_hi: str
    stage_id: str
    stage_name_en: str
    stage_name_hi: str
    
    assessment_date: str
    overall_risk_score: float # 0 - 100
    overall_risk_level: str
    
    sub_risks: List[SubRiskDetailSchema] = []
    stage_sensitivities: List[StageSensitivitySchema] = []
    
    summary_en: str
    summary_hi: str

class RiskMatrixItem(BaseModel):
    panchayat_id: str
    panchayat_name_en: str
    crop_id: str
    crop_name_en: str
    overall_score: float
    level: str
    primary_threat_en: str
