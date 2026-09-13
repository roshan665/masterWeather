from typing import List, Optional
from pydantic import BaseModel

class HourlyForecastItem(BaseModel):
    time: str
    temp_c: float
    rain_probability_pct: float
    rain_amount_mm: float
    rh_pct: float
    wind_speed_kmh: float
    spray_feasibility: str # "optimal", "marginal", "unfavourable"
    spray_advice_en: Optional[str] = None
    spray_advice_hi: Optional[str] = None

class DailyForecastItem(BaseModel):
    date: str
    day_name_en: str
    day_name_hi: str
    temp_max_c: float
    temp_min_c: float
    rainfall_mm: float
    rain_probability_pct: float
    condition_code: str
    condition_text_en: str
    condition_text_hi: str
    wind_speed_kmh: float
    rh_avg_pct: float
    confidence_level: str
    confidence_pct: float

class ForecastResponse(BaseModel):
    panchayat_id: str
    panchayat_name_en: str
    panchayat_name_hi: str
    generated_at: str
    hourly_24h: List[HourlyForecastItem] = []
    daily_7d: List[DailyForecastItem] = []
    optimal_spray_hours: List[str] = []
