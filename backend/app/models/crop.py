from sqlalchemy import Column, String, Integer, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..core.database import Base

class CropModel(Base):
    __tablename__ = "crops"

    id = Column(String(64), primary_key=True, index=True) # e.g. "soybean", "wheat", "chickpea"
    name_en = Column(String(128), nullable=False)
    name_hi = Column(String(128), nullable=False)
    botanical_name = Column(String(128), nullable=False)
    season = Column(String(32), nullable=False) # "kharif" / "rabi"
    season_name_en = Column(String(64), nullable=False)
    season_name_hi = Column(String(64), nullable=False)
    typical_sowing_window_en = Column(String(128), nullable=False)
    typical_sowing_window_hi = Column(String(128), nullable=False)
    total_duration_days = Column(Integer, nullable=False)
    icon = Column(String(16), default="🌱")
    
    primary_risks_en_json = Column(Text, nullable=True) # JSON list
    primary_risks_hi_json = Column(Text, nullable=True) # JSON list

    stages = relationship("CropStageModel", back_populates="crop", cascade="all, delete-orphan", order_by="CropStageModel.stage_order")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class CropStageModel(Base):
    __tablename__ = "crop_stages"

    stage_id = Column(String(64), primary_key=True, index=True)
    crop_id = Column(String(64), ForeignKey("crops.id"), nullable=False, index=True)
    stage_order = Column(Integer, nullable=False)
    name_en = Column(String(128), nullable=False)
    name_hi = Column(String(128), nullable=False)
    typical_duration_days = Column(Integer, nullable=False)
    water_sensitivity = Column(String(32), default="moderate") # "low", "moderate", "high", "critical"
    thermal_sensitivity = Column(String(32), default="moderate")
    critical_triggers_json = Column(Text, nullable=True) # JSON list
    description_en = Column(Text, nullable=True)
    description_hi = Column(Text, nullable=True)

    crop = relationship("CropModel", back_populates="stages")
