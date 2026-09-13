from typing import Optional
from pydantic import BaseModel

class FeedbackCreate(BaseModel):
    advisory_id: Optional[str] = None
    panchayat_id: Optional[str] = None
    farmer_name: Optional[str] = "Anonymous Farmer"
    phone: Optional[str] = None
    rating: int = 5
    is_useful: bool = True
    is_understandable: bool = True
    is_relevant: bool = True
    comments: Optional[str] = None

class FeedbackResponse(BaseModel):
    id: str
    advisory_id: Optional[str] = None
    panchayat_id: Optional[str] = None
    farmer_name: str
    phone: Optional[str] = None
    rating: int
    is_useful: bool
    is_understandable: bool
    is_relevant: bool
    comments: Optional[str] = None
    submitted_at: str

    class Config:
        from_attributes = True

class FeedbackStatsResponse(BaseModel):
    total_feedbacks: int
    average_rating: float
    satisfaction_pct: float
    useful_pct: float
    understandable_pct: float
    relevant_pct: float
