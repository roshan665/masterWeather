from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.api.deps import get_db_session
from app.schemas.analytics import TelemetryHealthResponse
from app.schemas.research_schemas import ResearchDashboardResponse
from app.services.analytics_service import AnalyticsService
from app.services.research_service import ResearchService

router = APIRouter(prefix="/analytics", tags=["Verification & Telemetry Analytics"])

@router.get("/telemetry-health", response_model=TelemetryHealthResponse)
def get_telemetry_health(db: Session = Depends(get_db_session)):
    service = AnalyticsService(db)
    return service.get_telemetry_health()

@router.get("/research", response_model=ResearchDashboardResponse)
def get_research_dashboard(
    version: str = Query("v1.0.0", description="Model version tag"),
    db: Session = Depends(get_db_session)
):
    """
    Returns comprehensive Research Analytics Dashboard metrics including:
    - Model comparison table (MAE, RMSE, R², Precision, Recall, F1)
    - Confusion matrices for rain and heat events
    - Lead time forecast performance by horizon (1–7 days)
    - Spatial error decomposition by Panchayat
    - Target variable champion performance
    - Controlled ablation study benchmarks
    - Data quality telemetry
    - Advisory usefulness & farmer satisfaction metrics
    - Future experimental roadmap placeholders
    """
    service = ResearchService(db)
    return service.get_research_dashboard_data(version_tag=version)
