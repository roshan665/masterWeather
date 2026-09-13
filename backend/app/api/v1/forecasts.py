from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.api.deps import get_db_session
from app.schemas.forecast import ForecastResponse
from app.services.weather_service import WeatherService

router = APIRouter(prefix="/forecasts", tags=["Agromet Forecasts & Spray Windows"])

@router.get("", response_model=ForecastResponse)
def get_forecasts(
    panchayatId: str = Query(..., alias="panchayatId", description="Gram Panchayat identifier"),
    db: Session = Depends(get_db_session)
):
    service = WeatherService(db)
    result = service.get_forecasts(panchayatId)
    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Forecast data for Panchayat '{panchayatId}' not found"
        )
    return result
