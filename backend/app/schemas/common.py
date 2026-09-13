from typing import Any, Dict, List, Literal, Optional, Union
from pydantic import BaseModel, Field

UserRole = Literal["farmer", "officer", "admin", "researcher"]
RiskLevel = Literal["normal", "low", "moderate", "high", "severe", "advisory", "warning", "critical"]
ConfidenceLevel = Literal["high", "moderate", "low"]
Language = Literal["en", "hi"]

class GeoJSONGeometry(BaseModel):
    type: str = "Polygon"
    coordinates: List[List[List[float]]]

class GeoJSONFeature(BaseModel):
    type: str = "Feature"
    properties: Dict[str, Any]
    geometry: GeoJSONGeometry

class GeoJSONFeatureCollection(BaseModel):
    type: str = "FeatureCollection"
    features: List[GeoJSONFeature]

class GenericMessageResponse(BaseModel):
    success: bool = True
    message: str
    data: Optional[Any] = None
