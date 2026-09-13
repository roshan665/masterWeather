from sqlalchemy import Column, String, Float, Integer, Text, ForeignKey, DateTime
from sqlalchemy.sql import func
from ..core.database import Base

class WeatherReadingModel(Base):
    __tablename__ = "weather_readings"

    id = Column(String(64), primary_key=True, index=True)
    panchayat_id = Column(String(64), ForeignKey("panchayats.id"), nullable=False, index=True)
    station_id = Column(String(64), nullable=False)
    timestamp = Column(DateTime(timezone=True), nullable=False, index=True)
    
    temp_c = Column(Float, nullable=False)
    temp_max_c = Column(Float, nullable=False)
    temp_min_c = Column(Float, nullable=False)
    feels_like_c = Column(Float, nullable=False)
    dew_point_c = Column(Float, nullable=False)
    
    rainfall_mm = Column(Float, nullable=False)
    rainfall_rate_mm_hr = Column(Float, default=0.0)
    humidity_pct = Column(Float, nullable=False)
    wind_speed_kmh = Column(Float, nullable=False)
    wind_direction_deg = Column(Float, nullable=False)
    wind_direction_cardinal = Column(String(8), default="NW")
    pressure_hpa = Column(Float, default=1010.0)
    solar_radiation_wm2 = Column(Float, default=550.0)
    et0_mm_day = Column(Float, default=4.2)
    leaf_wetness_pct = Column(Float, default=20.0)
    soil_moisture_pct = Column(Float, default=42.0)
    soil_temp_c = Column(Float, default=26.5)
    
    confidence_pct = Column(Float, default=95.0)
    data_source = Column(String(64), default="AWS Sensor")

class HourlyForecastModel(Base):
    __tablename__ = "hourly_forecasts"

    id = Column(String(64), primary_key=True, index=True)
    panchayat_id = Column(String(64), ForeignKey("panchayats.id"), nullable=False, index=True)
    forecast_time = Column(DateTime(timezone=True), nullable=False, index=True)
    
    temp_c = Column(Float, nullable=False)
    rain_probability_pct = Column(Float, nullable=False)
    rain_amount_mm = Column(Float, default=0.0)
    rh_pct = Column(Float, nullable=False)
    wind_speed_kmh = Column(Float, nullable=False)
    spray_feasibility = Column(String(32), default="optimal") # "optimal", "marginal", "unfavourable"
    spray_advice_en = Column(Text, nullable=True)
    spray_advice_hi = Column(Text, nullable=True)

class DailyForecastModel(Base):
    __tablename__ = "daily_forecasts"

    id = Column(String(64), primary_key=True, index=True)
    panchayat_id = Column(String(64), ForeignKey("panchayats.id"), nullable=False, index=True)
    forecast_date = Column(String(16), nullable=False, index=True) # "2026-09-13"
    
    temp_max_c = Column(Float, nullable=False)
    temp_min_c = Column(Float, nullable=False)
    rainfall_mm = Column(Float, nullable=False)
    rain_probability_pct = Column(Float, nullable=False)
    condition_code = Column(String(32), default="partly_cloudy")
    condition_text_en = Column(String(128), default="Partly Cloudy")
    condition_text_hi = Column(String(128), default="आंशिक रूप से बादल")
    wind_speed_kmh = Column(Float, default=10.0)
    rh_avg_pct = Column(Float, default=65.0)
    confidence_level = Column(String(16), default="high")
    confidence_pct = Column(Float, default=90.0)
