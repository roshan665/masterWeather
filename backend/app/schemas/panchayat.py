from typing import Any, Dict, List, Optional
from pydantic import BaseModel
from .common import GeoJSONGeometry, GeoJSONFeature

class PanchayatBase(BaseModel):
    id: str
    name_en: str
    name_hi: str
    district_en: str = "Bhopal"
    district_hi: str = "भोपाल"
    block_en: str = "Phanda"
    block_hi: str = "फंदा"
    state_en: str = "Madhya Pradesh"
    state_hi: str = "मध्य प्रदेश"
    latitude: float
    longitude: float
    elevation_m: float = 500.0
    weather_station_id: str
    soil_type_en: str = "Deep Black Soil (Vertisols)"
    soil_type_hi: str = "गहरी काली मिट्टी (वर्टिसोल)"
    bbox: Optional[List[float]] = None

class PanchayatResponse(PanchayatBase):
    boundary_geojson: Optional[Dict[str, Any]] = None

    class Config:
        from_attributes = True

class PanchayatListResponse(BaseModel):
    total: int
    items: List[PanchayatResponse]
