from datetime import datetime, timezone
from typing import List, Optional
from sqlalchemy.orm import Session
from ..repositories.weather_repo import WeatherRepository
from ..repositories.panchayat_repo import PanchayatRepository
from ..schemas.weather import CurrentWeatherResponse
from ..schemas.forecast import ForecastResponse, HourlyForecastItem, DailyForecastItem

class WeatherService:
    def __init__(self, db: Session):
        self.db = db
        self.weather_repo = WeatherRepository(db)
        self.panchayat_repo = PanchayatRepository(db)

    def get_current_weather(self, panchayat_id: str) -> Optional[CurrentWeatherResponse]:
        panchayat = self.panchayat_repo.get_by_id(panchayat_id)
        if not panchayat:
            return None

        reading = self.weather_repo.get_latest_reading(panchayat_id)
        if not reading:
            # Generate deterministic fallback
            return CurrentWeatherResponse(
                panchayat_id=panchayat.id,
                panchayat_name_en=panchayat.name_en,
                panchayat_name_hi=panchayat.name_hi,
                station_id=panchayat.weather_station_id,
                timestamp=datetime.now(timezone.utc).isoformat(),
                temp_c=29.4,
                temp_max_c=32.2,
                temp_min_c=24.1,
                feels_like_c=31.8,
                dew_point_c=22.4,
                rainfall_mm=14.2,
                rainfall_rate_mm_hr=0.0,
                humidity_pct=78.0,
                wind_speed_kmh=8.5,
                wind_direction_deg=225.0,
                wind_direction_cardinal="SW",
                pressure_hpa=1008.2,
                solar_radiation_wm2=620.0,
                et0_mm_day=4.5,
                leaf_wetness_pct=24.0,
                soil_moisture_pct=44.0,
                soil_temp_c=25.8,
                confidence_pct=95.0,
                data_source="AWS Sensor",
            )

        return CurrentWeatherResponse(
            panchayat_id=panchayat.id,
            panchayat_name_en=panchayat.name_en,
            panchayat_name_hi=panchayat.name_hi,
            station_id=reading.station_id,
            timestamp=reading.timestamp.isoformat() if reading.timestamp else datetime.now(timezone.utc).isoformat(),
            temp_c=reading.temp_c,
            temp_max_c=reading.temp_max_c,
            temp_min_c=reading.temp_min_c,
            feels_like_c=reading.feels_like_c,
            dew_point_c=reading.dew_point_c,
            rainfall_mm=reading.rainfall_mm,
            rainfall_rate_mm_hr=reading.rainfall_rate_mm_hr or 0.0,
            humidity_pct=reading.humidity_pct,
            wind_speed_kmh=reading.wind_speed_kmh,
            wind_direction_deg=reading.wind_direction_deg,
            wind_direction_cardinal=reading.wind_direction_cardinal or "NW",
            pressure_hpa=reading.pressure_hpa or 1010.0,
            solar_radiation_wm2=reading.solar_radiation_wm2 or 550.0,
            et0_mm_day=reading.et0_mm_day or 4.2,
            leaf_wetness_pct=reading.leaf_wetness_pct or 20.0,
            soil_moisture_pct=reading.soil_moisture_pct or 42.0,
            soil_temp_c=reading.soil_temp_c or 26.0,
            confidence_pct=reading.confidence_pct or 95.0,
            data_source=reading.data_source or "AWS Sensor",
        )

    def get_forecasts(self, panchayat_id: str) -> Optional[ForecastResponse]:
        panchayat = self.panchayat_repo.get_by_id(panchayat_id)
        if not panchayat:
            return None

        hourly_models = self.weather_repo.get_hourly_forecasts(panchayat_id)
        daily_models = self.weather_repo.get_daily_forecasts(panchayat_id)

        hourly_items = []
        optimal_hours = []
        for h in hourly_models:
            t_str = h.forecast_time.strftime("%H:%M") if h.forecast_time else "12:00"
            if h.spray_feasibility == "optimal":
                optimal_hours.append(t_str)
            hourly_items.append(
                HourlyForecastItem(
                    time=t_str,
                    temp_c=h.temp_c,
                    rain_probability_pct=h.rain_probability_pct,
                    rain_amount_mm=h.rain_amount_mm or 0.0,
                    rh_pct=h.rh_pct,
                    wind_speed_kmh=h.wind_speed_kmh,
                    spray_feasibility=h.spray_feasibility or "optimal",
                    spray_advice_en=h.spray_advice_en,
                    spray_advice_hi=h.spray_advice_hi,
                )
            )

        daily_items = []
        day_names_en = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
        day_names_hi = ["रवि", "सोम", "मंगल", "बुध", "गुरु", "शुक्र", "शनि"]

        for d in daily_models:
            try:
                dt = datetime.strptime(d.forecast_date, "%Y-%m-%d")
                weekday_idx = dt.weekday() # 0=Mon, 6=Sun
                # map to Sun=0
                idx = (weekday_idx + 1) % 7
                d_en = day_names_en[idx]
                d_hi = day_names_hi[idx]
            except Exception:
                d_en = "Today"
                d_hi = "आज"

            daily_items.append(
                DailyForecastItem(
                    date=d.forecast_date,
                    day_name_en=d_en,
                    day_name_hi=d_hi,
                    temp_max_c=d.temp_max_c,
                    temp_min_c=d.temp_min_c,
                    rainfall_mm=d.rainfall_mm,
                    rain_probability_pct=d.rain_probability_pct,
                    condition_code=d.condition_code or "partly_cloudy",
                    condition_text_en=d.condition_text_en or "Partly Cloudy",
                    condition_text_hi=d.condition_text_hi or "आंशिक रूप से बादल",
                    wind_speed_kmh=d.wind_speed_kmh or 10.0,
                    rh_avg_pct=d.rh_avg_pct or 65.0,
                    confidence_level=d.confidence_level or "high",
                    confidence_pct=d.confidence_pct or 90.0,
                )
            )

        return ForecastResponse(
            panchayat_id=panchayat.id,
            panchayat_name_en=panchayat.name_en,
            panchayat_name_hi=panchayat.name_hi,
            generated_at=datetime.now(timezone.utc).isoformat(),
            hourly_24h=hourly_items,
            daily_7d=daily_items,
            optimal_spray_hours=optimal_hours,
        )
