from sqlalchemy import Column, String, Float, Integer, Text, ForeignKey, DateTime
from sqlalchemy.sql import func
from ..core.database import Base

class CropRiskAssessmentModel(Base):
    __tablename__ = "crop_risk_assessments"

    id = Column(String(64), primary_key=True, index=True)
    panchayat_id = Column(String(64), ForeignKey("panchayats.id"), nullable=False, index=True)
    crop_id = Column(String(64), ForeignKey("crops.id"), nullable=False, index=True)
    stage_id = Column(String(64), nullable=False)
    
    assessment_date = Column(String(16), nullable=False, index=True) # "2026-09-13"
    overall_risk_score = Column(Float, nullable=False) # 0 - 100
    overall_risk_level = Column(String(32), nullable=False) # "normal", "low", "moderate", "high", "severe"
    
    sub_risks_json = Column(Text, nullable=True) # Array of SubRiskDetail
    stage_sensitivities_json = Column(Text, nullable=True)
    
    summary_en = Column(Text, nullable=False)
    summary_hi = Column(Text, nullable=False)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
