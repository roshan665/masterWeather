from typing import List, Optional
from sqlalchemy.orm import Session
from ..models.weather import WeatherReadingModel, HourlyForecastModel, DailyForecastModel

class WeatherRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_latest_reading(self, panchayat_id: str) -> Optional[WeatherReadingModel]:
        return self.db.query(WeatherReadingModel).filter(
            WeatherReadingModel.panchayat_id == panchayat_id
        ).order_by(WeatherReadingModel.timestamp.desc()).first()

    def get_hourly_forecasts(self, panchayat_id: str) -> List[HourlyForecastModel]:
        return self.db.query(HourlyForecastModel).filter(
            HourlyForecastModel.panchayat_id == panchayat_id
        ).order_by(HourlyForecastModel.forecast_time.asc()).limit(24).all()

    def get_daily_forecasts(self, panchayat_id: str) -> List[DailyForecastModel]:
        return self.db.query(DailyForecastModel).filter(
            DailyForecastModel.panchayat_id == panchayat_id
        ).order_by(DailyForecastModel.forecast_date.asc()).limit(7).all()
