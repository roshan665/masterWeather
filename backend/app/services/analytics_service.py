from sqlalchemy.orm import Session
from ..schemas.analytics import (
    TelemetryHealthResponse,
    VerificationKPIs,
    RainfallVerificationDay,
    TelemetrySourceStatus,
)

class AnalyticsService:
    def __init__(self, db: Session):
        self.db = db

    def get_telemetry_health(self) -> TelemetryHealthResponse:
        kpis = VerificationKPIs(
            forecast_skill_score_24h_pct=88.4,
            data_completeness_pct=99.46,
            false_alarm_ratio_pct=12.5,
            avg_alert_lead_time_hours=18.4,
        )

        rainfall_days = [
            RainfallVerificationDay(date="09-07", predicted_mm=12.0, observed_aws_mm=14.5),
            RainfallVerificationDay(date="09-08", predicted_mm=25.0, observed_aws_mm=22.0),
            RainfallVerificationDay(date="09-09", predicted_mm=0.0, observed_aws_mm=0.0),
            RainfallVerificationDay(date="09-10", predicted_mm=4.0, observed_aws_mm=2.5),
            RainfallVerificationDay(date="09-11", predicted_mm=18.0, observed_aws_mm=19.2),
            RainfallVerificationDay(date="09-12", predicted_mm=30.0, observed_aws_mm=28.0),
            RainfallVerificationDay(date="09-13", predicted_mm=8.0, observed_aws_mm=9.1),
        ]

        sources = [
            TelemetrySourceStatus(name="Phanda Block AWS Sensor Mesh (5 Nodes)", type="In-situ AWS", status="Healthy (5/5)", uptime_pct=99.8, latency_sec=42.0),
            TelemetrySourceStatus(name="IMD Doppler Weather Radar (Bhopal Station)", type="Radar / Nowcasting", status="Operational", uptime_pct=99.2, latency_sec=120.0),
            TelemetrySourceStatus(name="NCMRWF Unified 4km Model (NCUM)", type="NWP Gridded Model", status="Synchronized (00/12 UTC)", uptime_pct=98.9, latency_sec=600.0),
            TelemetrySourceStatus(name="INSAT-3DR Geostationary Imager", type="Satellite Cloud / VHRR", status="Online", uptime_pct=99.5, latency_sec=180.0),
            TelemetrySourceStatus(name="IMD Global Forecast System (GFS T1534)", type="Global NWP", status="Online", uptime_pct=99.9, latency_sec=900.0),
        ]

        return TelemetryHealthResponse(
            verification_kpis=kpis,
            rainfall_verification=rainfall_days,
            upstream_sources=sources,
        )
