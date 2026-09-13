from typing import List
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.api.deps import get_db_session
from app.schemas.weather import CurrentWeatherResponse, WeatherStationStatus
from app.services.weather_service import WeatherService

router = APIRouter(prefix="/weather", tags=["Weather & Sensor Telemetry"])

@router.get("/current", response_model=CurrentWeatherResponse)
def get_current_weather(
    panchayatId: str = Query(..., alias="panchayatId", description="Gram Panchayat identifier"),
    db: Session = Depends(get_db_session)
):
    service = WeatherService(db)
    result = service.get_current_weather(panchayatId)
    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Weather data for Panchayat '{panchayatId}' not found"
        )
    return result

@router.get("/stations", response_model=List[WeatherStationStatus])
def get_station_status(db: Session = Depends(get_db_session)):
    return [
        WeatherStationStatus(station_id="AWS-ACH-01", panchayat_id="panchayat_acharpura", panchayat_name="Acharpura", status="online", last_sync="2 mins ago", battery_v=12.6, missing_pct=0.2),
        WeatherStationStatus(station_id="AWS-BNG-02", panchayat_id="panchayat_bangrasia", panchayat_name="Bangrasia", status="online", last_sync="1 min ago", battery_v=12.4, missing_pct=0.1),
        WeatherStationStatus(station_id="AWS-RTB-03", panchayat_id="panchayat_ratibad", panchayat_name="Ratibad", status="online", last_sync="4 mins ago", battery_v=12.8, missing_pct=0.5),
        WeatherStationStatus(station_id="AWS-SMS-04", panchayat_id="panchayat_samasgarh", panchayat_name="Samasgarh", status="online", last_sync="2 mins ago", battery_v=12.5, missing_pct=0.3),
        WeatherStationStatus(station_id="AWS-SKH-05", panchayat_id="panchayat_sukhi_sewaniya", panchayat_name="Sukhi Sewaniya", status="online", last_sync="3 mins ago", battery_v=12.7, missing_pct=0.4),
    ]
