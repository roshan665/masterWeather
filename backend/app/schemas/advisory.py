from typing import List, Optional
from pydantic import BaseModel

class AdvisoryCreate(BaseModel):
    panchayat_id: str
    panchayat_name_en: str
    panchayat_name_hi: str
    crop_id: str
    crop_name_en: str
    crop_name_hi: str
    stage_id: str
    stage_name_en: str
    stage_name_hi: str
    
    headline_en: str
    headline_hi: str
    detailed_advice_en: str
    detailed_advice_hi: str
    
    action_type: Optional[str] = "monitoring"
    risk_category: Optional[str] = "pest_disease"
    severity: Optional[str] = "advisory"
    author_name: Optional[str] = "KVK Bhopal Agronomist"
    source_citation_en: Optional[str] = None
    source_citation_hi: Optional[str] = None

class AdvisoryApprovalRequest(BaseModel):
    status: str # "approved", "rejected", "published"
    officer_name: str

class AdvisoryVoteRequest(BaseModel):
    is_helpful: bool

class AgrometAdvisoryResponse(BaseModel):
    id: str
    advisory_code: str
    panchayat_id: str
    panchayat_name_en: str
    panchayat_name_hi: str
    crop_id: str
    crop_name_en: str
    crop_name_hi: str
    stage_id: str
    stage_name_en: str
    stage_name_hi: str
    
    headline_en: str
    headline_hi: str
    detailed_advice_en: str
    detailed_advice_hi: str
    
    action_type: str
    risk_category: str
    severity: str
    approval_status: str
    
    helpful_count: int
    unhelpful_count: int
    
    author_name: str
    approved_by: Optional[str] = None
    approved_at: Optional[str] = None
    
    source_citation_en: Optional[str] = None
    source_citation_hi: Optional[str] = None
    created_at: str

    class Config:
        from_attributes = True
