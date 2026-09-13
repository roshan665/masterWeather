import json
from sqlalchemy import Column, String, Float, Integer, Text, Boolean, DateTime
from sqlalchemy.sql import func
from ..core.database import Base

class PanchayatModel(Base):
    __tablename__ = "panchayats"

    id = Column(String(64), primary_key=True, index=True)
    name_en = Column(String(128), nullable=False)
    name_hi = Column(String(128), nullable=False)
    district_en = Column(String(64), default="Bhopal")
    district_hi = Column(String(64), default="भोपाल")
    block_en = Column(String(64), default="Phanda")
    block_hi = Column(String(64), default="फंदा")
    state_en = Column(String(64), default="Madhya Pradesh")
    state_hi = Column(String(64), default="मध्य प्रदेश")
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    elevation_m = Column(Float, default=500.0)
    weather_station_id = Column(String(64), nullable=False)
    soil_type_en = Column(String(128), default="Deep Black Soil (Vertisols)")
    soil_type_hi = Column(String(128), default="गहरी काली मिट्टी (वर्टिसोल)")
    
    # Stored as GeoJSON string for cross-database compatibility (PostGIS/SQLite)
    bbox_json = Column(Text, nullable=True)
    boundary_geojson = Column(Text, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
