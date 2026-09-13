from typing import List, Optional
from pydantic import BaseModel

class CurrentWeatherResponse(BaseModel):
    panchayat_id: str
    panchayat_name_en: str
    panchayat_name_hi: str
    station_id: str
    timestamp: str
    
    temp_c: float
    temp_max_c: float
    temp_min_c: float
    feels_like_c: float
    dew_point_c: float
    
    rainfall_mm: float
    rainfall_rate_mm_hr: float
    humidity_pct: float
    wind_speed_kmh: float
    wind_direction_deg: float
    wind_direction_cardinal: str
    pressure_hpa: float
    solar_radiation_wm2: float
    et0_mm_day: float
    leaf_wetness_pct: float
    soil_moisture_pct: float
    soil_temp_c: float
    
    confidence_pct: float
    data_source: str
    is_sensor_offline: bool = False
    fallback_mode: str = "primary_aws"

class WeatherStationStatus(BaseModel):
    station_id: str
    panchayat_id: str
    panchayat_name: str
    status: str # "online", "degraded", "offline"
    last_sync: str
    battery_v: float
    missing_pct: float
