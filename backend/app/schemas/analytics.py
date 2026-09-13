from typing import List
from pydantic import BaseModel

class VerificationKPIs(BaseModel):
    forecast_skill_score_24h_pct: float
    data_completeness_pct: float
    false_alarm_ratio_pct: float
    avg_alert_lead_time_hours: float

class RainfallVerificationDay(BaseModel):
    date: str
    predicted_mm: float
    observed_aws_mm: float

class TelemetrySourceStatus(BaseModel):
    name: str
    type: str
    status: str
    uptime_pct: float
    latency_sec: float

class TelemetryHealthResponse(BaseModel):
    verification_kpis: VerificationKPIs
    rainfall_verification: List[RainfallVerificationDay] = []
    upstream_sources: List[TelemetrySourceStatus] = []
