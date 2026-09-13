from sqlalchemy import Column, String, Float, Text, ForeignKey, DateTime
from sqlalchemy.sql import func
from ..core.database import Base

class FarmerObservationModel(Base):
    __tablename__ = "farmer_observations"

    id = Column(String(64), primary_key=True, index=True)
    panchayat_id = Column(String(64), ForeignKey("panchayats.id"), nullable=False, index=True)
    panchayat_name_en = Column(String(128), nullable=False)
    panchayat_name_hi = Column(String(128), nullable=False)
    village_name_en = Column(String(128), nullable=False)
    village_name_hi = Column(String(128), nullable=False)
    
    farmer_name = Column(String(128), nullable=False)
    farmer_phone = Column(String(32), nullable=True)
    
    crop_id = Column(String(64), ForeignKey("crops.id"), nullable=False, index=True)
    crop_name_en = Column(String(128), nullable=False)
    crop_name_hi = Column(String(128), nullable=False)
    stage_id = Column(String(64), nullable=True)
    stage_name_en = Column(String(128), nullable=True)
    stage_name_hi = Column(String(128), nullable=True)
    
    category = Column(String(64), nullable=False) # "pest_infestation", "crop_disease", "waterlogging", etc.
    description_en = Column(Text, nullable=False)
    description_hi = Column(Text, nullable=False)
    
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    image_url = Column(String(256), nullable=True)
    
    status = Column(String(32), default="pending") # "pending", "verified", "rejected", "suspicious"
    reviewed_by = Column(String(128), nullable=True)
    review_notes_en = Column(Text, nullable=True)
    review_notes_hi = Column(Text, nullable=True)
    
    submitted_at = Column(DateTime(timezone=True), server_default=func.now())
    reviewed_at = Column(DateTime(timezone=True), nullable=True)
