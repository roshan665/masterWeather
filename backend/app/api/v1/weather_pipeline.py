import time
from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from app.api.deps import get_db_session
from app.schemas.weather_pipeline import (
    IngestionJobRequest,
    IngestionJobResult,
    DataQualityReport,
    PipelineStatusResponse,
    RawWeatherPayloadSchema,
    NormalizedWeatherRecordSchema
)
from app.services.weather_ingestion_service import WeatherIngestionService
from app.repositories.weather_pipeline_repo import WeatherPipelineRepository

router = APIRouter(prefix="/weather/pipeline", tags=["Weather Ingestion Pipeline"])

@router.post("/ingest", response_model=IngestionJobResult)
def trigger_weather_ingestion(
    request: IngestionJobRequest = IngestionJobRequest(),
    db: Session = Depends(get_db_session)
):
    """
    Manually triggers meteorological ingestion from Open-Meteo API.
    Can ingest for all 5 Panchayats or a specific targeted Panchayat.
    """
    service = WeatherIngestionService(db)
    if request.panchayat_id:
        job_id = f"job-manual-{int(time.time())}"
        res = service.ingest_panchayat_weather(
            request.panchayat_id,
            job_id,
            force_refresh=request.force_refresh,
            dry_run=request.dry_run
        )
        return IngestionJobResult(
            job_id=job_id,
            provider="open-meteo",
            started_at=res.get("retrieved_at") or time.strftime("%Y-%m-%dT%H:%M:%SZ"),
            completed_at=time.strftime("%Y-%m-%dT%H:%M:%SZ"),
            total_panchayats=1,
            successful_panchayats=1 if "success" in res["status"] else 0,
            failed_panchayats=0 if "success" in res["status"] else 1,
            total_records_ingested=res["records_ingested"],
            average_quality_score_pct=res["quality_score_pct"],
            accuracy_disclaimer=WeatherIngestionService.ACCURACY_DISCLAIMER,
            panchayat_results=[res]
        )
    else:
        result = service.ingest_all_panchayats(
            force_refresh=request.force_refresh,
            dry_run=request.dry_run
        )
        return result


@router.get("/status", response_model=PipelineStatusResponse)
def get_pipeline_status(db: Session = Depends(get_db_session)):
    """
    Returns pipeline operating status, last ingestion run, and data source metadata.
    """
    service = WeatherIngestionService(db)
    return service.get_pipeline_status()


@router.get("/quality-report", response_model=DataQualityReport)
def get_quality_report(db: Session = Depends(get_db_session)):
    """
    Returns data quality validation summary, outlier statistics, and accuracy tier disclaimer.
    """
    service = WeatherIngestionService(db)
    return service.get_quality_report()


@router.get("/raw-payloads", response_model=List[RawWeatherPayloadSchema])
def get_raw_payloads(
    limit: int = Query(10, ge=1, le=50),
    db: Session = Depends(get_db_session)
):
    """
    Inspect raw source API payloads and metadata hashes.
    """
    repo = WeatherPipelineRepository(db)
    return repo.get_latest_raw_payloads(limit=limit)


@router.get("/normalized-records", response_model=List[NormalizedWeatherRecordSchema])
def get_normalized_records(
    panchayatId: Optional[str] = Query(None, alias="panchayatId"),
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db_session)
):
    """
    Retrieve normalized weather records with quality flags.
    """
    repo = WeatherPipelineRepository(db)
    return repo.get_latest_normalized_records(panchayat_id=panchayatId, limit=limit)
