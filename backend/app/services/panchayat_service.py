import json
from typing import Dict, List, Optional
from sqlalchemy.orm import Session
from ..repositories.panchayat_repo import PanchayatRepository
from ..schemas.panchayat import PanchayatResponse, PanchayatListResponse

class PanchayatService:
    def __init__(self, db: Session):
        self.db = db
        self.repo = PanchayatRepository(db)

    def list_panchayats(self) -> PanchayatListResponse:
        models = self.repo.get_all()
        items = []
        for m in models:
            bbox = json.loads(m.bbox_json) if m.bbox_json else None
            boundary = json.loads(m.boundary_geojson) if m.boundary_geojson else None
            items.append(
                PanchayatResponse(
                    id=m.id,
                    name_en=m.name_en,
                    name_hi=m.name_hi,
                    district_en=m.district_en,
                    district_hi=m.district_hi,
                    block_en=m.block_en,
                    block_hi=m.block_hi,
                    state_en=m.state_en,
                    state_hi=m.state_hi,
                    latitude=m.latitude,
                    longitude=m.longitude,
                    elevation_m=m.elevation_m,
                    weather_station_id=m.weather_station_id,
                    soil_type_en=m.soil_type_en,
                    soil_type_hi=m.soil_type_hi,
                    bbox=bbox,
                    boundary_geojson=boundary,
                )
            )
        return PanchayatListResponse(total=len(items), items=items)

    def get_panchayat(self, panchayat_id: str) -> Optional[PanchayatResponse]:
        m = self.repo.get_by_id(panchayat_id)
        if not m:
            return None
        bbox = json.loads(m.bbox_json) if m.bbox_json else None
        boundary = json.loads(m.boundary_geojson) if m.boundary_geojson else None
        return PanchayatResponse(
            id=m.id,
            name_en=m.name_en,
            name_hi=m.name_hi,
            district_en=m.district_en,
            district_hi=m.district_hi,
            block_en=m.block_en,
            block_hi=m.block_hi,
            state_en=m.state_en,
            state_hi=m.state_hi,
            latitude=m.latitude,
            longitude=m.longitude,
            elevation_m=m.elevation_m,
            weather_station_id=m.weather_station_id,
            soil_type_en=m.soil_type_en,
            soil_type_hi=m.soil_type_hi,
            bbox=bbox,
            boundary_geojson=boundary,
        )

    def get_boundaries_geojson(self) -> Dict:
        models = self.repo.get_all()
        features = []
        for m in models:
            if m.boundary_geojson:
                geom = json.loads(m.boundary_geojson)
                features.append({
                    "type": "Feature",
                    "properties": {
                        "id": m.id,
                        "nameEn": m.name_en,
                        "nameHi": m.name_hi,
                        "stationId": m.weather_station_id,
                        "latitude": m.latitude,
                        "longitude": m.longitude,
                    },
                    "geometry": geom,
                })
        return {
            "type": "FeatureCollection",
            "features": features
        }
