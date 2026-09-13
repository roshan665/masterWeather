from typing import Optional
from pydantic import BaseModel

class ObservationCreate(BaseModel):
    panchayat_id: str
    panchayat_name_en: str
    panchayat_name_hi: str
    village_name_en: str
    village_name_hi: str
    
    farmer_name: str
    farmer_phone: Optional[str] = None
    
    crop_id: str
    crop_name_en: str
    crop_name_hi: str
    stage_id: Optional[str] = None
    stage_name_en: Optional[str] = None
    stage_name_hi: Optional[str] = None
    
    category: str
    description_en: str
    description_hi: str
    
    latitude: float
    longitude: float
    image_url: Optional[str] = None

class ObservationReviewRequest(BaseModel):
    status: str # "verified", "rejected", "suspicious"
    reviewer_name: str
    notes_en: Optional[str] = None
    notes_hi: Optional[str] = None

class FarmerObservationResponse(BaseModel):
    id: str
    panchayat_id: str
    panchayat_name_en: str
    panchayat_name_hi: str
    village_name_en: str
    village_name_hi: str
    
    farmer_name: str
    farmer_phone: Optional[str] = None
    
    crop_id: str
    crop_name_en: str
    crop_name_hi: str
    stage_id: Optional[str] = None
    stage_name_en: Optional[str] = None
    stage_name_hi: Optional[str] = None
    
    category: str
    description_en: str
    description_hi: str
    
    latitude: float
    longitude: float
    image_url: Optional[str] = None
    
    status: str
    reviewed_by: Optional[str] = None
    review_notes_en: Optional[str] = None
    review_notes_hi: Optional[str] = None
    
    submitted_at: str
    reviewed_at: Optional[str] = None

    class Config:
        from_attributes = True
