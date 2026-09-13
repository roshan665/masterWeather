from typing import Any, List, Optional, Union
from pydantic import BaseModel

class RuleThresholdSchema(BaseModel):
    parameter: str
    operator: str
    value: Union[float, int, str]
    unit: str

class RuleVersionRecordSchema(BaseModel):
    version: str
    modified_by: str
    modified_at: str
    change_summary: str
    status: str
    reviewed_by: Optional[str] = None

class AdvisoryRuleBase(BaseModel):
    rule_code: str
    crop_id: str
    crop_name_en: str
    crop_name_hi: str
    stage_id: str
    stage_name_en: str
    stage_name_hi: str
    
    weather_trigger_en: str
    weather_trigger_hi: str
    thresholds: List[RuleThresholdSchema]
    threshold_description_en: Optional[str] = None
    threshold_description_hi: Optional[str] = None
    
    risk_category: str
    severity: str
    
    short_summary_en: str
    short_summary_hi: str
    recommended_action_en: str
    recommended_action_hi: str
    
    source_org_en: str
    source_org_hi: str
    source_ref_en: str
    source_ref_hi: str
    
    effective_from: str
    effective_until: str

class AdvisoryRuleCreate(AdvisoryRuleBase):
    approval_status: Optional[str] = "draft"
    initial_version: Optional[str] = "v1.0"
    created_by: Optional[str] = "Agromet Admin"

class AdvisoryRuleUpdate(BaseModel):
    crop_id: Optional[str] = None
    crop_name_en: Optional[str] = None
    crop_name_hi: Optional[str] = None
    stage_id: Optional[str] = None
    stage_name_en: Optional[str] = None
    stage_name_hi: Optional[str] = None
    weather_trigger_en: Optional[str] = None
    weather_trigger_hi: Optional[str] = None
    thresholds: Optional[List[RuleThresholdSchema]] = None
    risk_category: Optional[str] = None
    severity: Optional[str] = None
    short_summary_en: Optional[str] = None
    short_summary_hi: Optional[str] = None
    recommended_action_en: Optional[str] = None
    recommended_action_hi: Optional[str] = None
    source_org_en: Optional[str] = None
    source_org_hi: Optional[str] = None
    source_ref_en: Optional[str] = None
    source_ref_hi: Optional[str] = None
    approval_status: Optional[str] = None
    effective_from: Optional[str] = None
    effective_until: Optional[str] = None
    change_summary: str = "Updated rule parameters"
    modifier_name: Optional[str] = "Agromet Admin"

class AdvisoryRuleReview(BaseModel):
    status: str # "approved", "rejected", "published"
    reviewer_name: str
    review_notes: Optional[str] = None

class AdvisoryRuleResponse(AdvisoryRuleBase):
    id: str
    version: str
    approval_status: str
    created_by: str
    created_at: str
    reviewer: Optional[str] = None
    reviewed_at: Optional[str] = None
    review_notes: Optional[str] = None
    version_history: List[RuleVersionRecordSchema] = []

    class Config:
        from_attributes = True
