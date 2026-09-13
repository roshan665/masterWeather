import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class RawWeatherPayloadSchema(BaseModel):
    id: str
    provider_name: str
    source_url: str
    retrieval_timestamp: datetime.datetime
    panchayat_id: str
    latitude: float
    longitude: float
    http_status_code: int
    response_time_ms: float
    payload_hash_sha256: str
    license_attribution: str

    class Config:
        from_attributes = True


class NormalizedWeatherRecordSchema(BaseModel):
    id: str
    panchayat_id: str
    grid_cell_id: str
    reading_timestamp: datetime.datetime
    retrieved_at: datetime.datetime
    source_provider: str
    source_model: str
    spatial_resolution_km: float
    accuracy_tier: str  # "provisional_gridded_estimate"

    # Normalized parameters
    temp_c: Optional[float] = None
    temp_max_c: Optional[float] = None
    temp_min_c: Optional[float] = None
    feels_like_c: Optional[float] = None
    dew_point_c: Optional[float] = None
    humidity_pct: Optional[float] = None
    rainfall_mm: float = 0.0
    rainfall_rate_mm_hr: float = 0.0
    rain_probability_pct: float = 0.0
    wind_speed_kmh: Optional[float] = None
    wind_direction_deg: Optional[float] = None
    wind_gusts_kmh: Optional[float] = None
    pressure_hpa: Optional[float] = None
    solar_radiation_wm2: Optional[float] = None
    et0_mm_day: Optional[float] = None
    soil_moisture_0_7cm_pct: Optional[float] = None
    soil_temp_0cm_c: Optional[float] = None
    cloud_cover_pct: Optional[float] = None
    weather_code: int = 0

    # Data Quality
    is_valid: bool = True
    is_outlier: bool = False
    is_duplicate: bool = False
    data_quality_flags: str = "VALID"
    quality_score_pct: float = 95.0
    validation_notes: Optional[str] = None

    class Config:
        from_attributes = True


class IngestionJobRequest(BaseModel):
    panchayat_id: Optional[str] = Field(None, description="Optional single Panchayat ID or all 5 if omitted")
    force_refresh: bool = Field(False, description="Bypass duplicate cache")
    dry_run: bool = Field(False, description="Run validation without persisting")


class IngestionPanchayatResult(BaseModel):
    panchayat_id: str
    panchayat_name: str
    status: str  # "success", "skipped_duplicate", "failed"
    records_ingested: int
    quality_score_pct: float
    outliers_detected: int
    data_quality_flags: List[str]
    retrieval_latency_ms: float
    message: str


class IngestionJobResult(BaseModel):
    job_id: str
    provider: str
    started_at: datetime.datetime
    completed_at: datetime.datetime
    total_panchayats: int
    successful_panchayats: int
    failed_panchayats: int
    total_records_ingested: int
    average_quality_score_pct: float
    accuracy_disclaimer: str
    panchayat_results: List[IngestionPanchayatResult]


class DataQualityReport(BaseModel):
    total_records: int
    valid_records_count: int
    suspect_outliers_count: int
    duplicate_records_count: int
    missing_value_rate_pct: float
    average_quality_score_pct: float
    validation_checks_performed: List[str]
    accuracy_tier: str
    accuracy_notice: str
    last_ingestion_timestamp: Optional[datetime.datetime]
    provider_source: str


class PipelineStatusResponse(BaseModel):
    pipeline_active: bool
    scheduler_status: str
    last_run_timestamp: Optional[datetime.datetime]
    last_run_status: str
    default_provider: str
    spatial_resolution: str
    accuracy_tier: str
    attribution: str
    total_raw_payloads_stored: int
    total_normalized_records_stored: int
