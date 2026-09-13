from typing import List, Optional
from pydantic import BaseModel

class AlertBroadcastRequest(BaseModel):
    severity: str # "normal", "advisory", "warning", "critical"
    category: str # "thunderstorm", "heavy_rain", "heatwave", "pest_outbreak"
    headline_en: str
    headline_hi: str
    detailed_instruction_en: str
    detailed_instruction_hi: str
    target_panchayat_ids: List[str]
    valid_from: str
    valid_until: str
    issued_by: Optional[str] = "District Agromet Command"

class WeatherAlertResponse(BaseModel):
    id: str
    alert_code: str
    severity: str
    category: str
    headline_en: str
    headline_hi: str
    detailed_instruction_en: str
    detailed_instruction_hi: str
    target_panchayat_ids: List[str]
    target_panchayat_names_en: str
    target_panchayat_names_hi: str
    is_active: bool
    issued_by: str
    issued_at: str
    valid_from: str
    valid_until: str
    sms_delivery_status: str
    push_delivery_status: str

    class Config:
        from_attributes = True
