import datetime
from sqlalchemy import Column, String, Float, Integer, Boolean, Text, DateTime, ForeignKey
from ..core.database import Base

class RawWeatherPayloadModel(Base):
    """
    Stores raw unmodified API response payloads and metadata from public weather providers.
    """
    __tablename__ = "raw_weather_payloads"

    id = Column(String(64), primary_key=True, index=True)
    provider_name = Column(String(64), nullable=False, index=True)  # e.g., 'open-meteo', 'imd_gridded'
    source_url = Column(Text, nullable=False)
    retrieval_timestamp = Column(DateTime(timezone=True), default=datetime.datetime.utcnow, nullable=False, index=True)
    panchayat_id = Column(String(64), ForeignKey("panchayats.id"), nullable=False, index=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    http_status_code = Column(Integer, default=200)
    response_time_ms = Column(Float, default=0.0)
    payload_hash_sha256 = Column(String(64), nullable=False, index=True)
    raw_payload_json = Column(Text, nullable=False)  # JSON text
    license_attribution = Column(String(256), default="Open-Meteo (CC-BY 4.0 / WMO Open Data)")


class NormalizedWeatherRecordModel(Base):
    """
    Stores validated, standardized meteorological readings with quality flags and accuracy tier tags.
    """
    __tablename__ = "normalized_weather_records"

    id = Column(String(64), primary_key=True, index=True)
    panchayat_id = Column(String(64), ForeignKey("panchayats.id"), nullable=False, index=True)
    grid_cell_id = Column(String(64), nullable=False, index=True)  # e.g. 'GRID-PHANDA-23.33-77.34'
    reading_timestamp = Column(DateTime(timezone=True), nullable=False, index=True)
    retrieved_at = Column(DateTime(timezone=True), default=datetime.datetime.utcnow, nullable=False)
    raw_payload_id = Column(String(64), ForeignKey("raw_weather_payloads.id"), nullable=True)

    source_provider = Column(String(64), default="open-meteo")
    source_model = Column(String(64), default="ECMWF-IFS-0.1deg / GFS")
    spatial_resolution_km = Column(Float, default=11.0)
    accuracy_tier = Column(String(64), default="provisional_gridded_estimate")  # Note: NOT claimed hyper-local until AWS calibrated

    # Standardized Physical Parameters (Normalized units)
    temp_c = Column(Float, nullable=True)                  # °C
    temp_max_c = Column(Float, nullable=True)              # °C
    temp_min_c = Column(Float, nullable=True)              # °C
    feels_like_c = Column(Float, nullable=True)            # °C
    dew_point_c = Column(Float, nullable=True)             # °C
    humidity_pct = Column(Float, nullable=True)            # %
    rainfall_mm = Column(Float, default=0.0)               # mm (accumulation)
    rainfall_rate_mm_hr = Column(Float, default=0.0)       # mm/hr
    rain_probability_pct = Column(Float, default=0.0)      # %
    wind_speed_kmh = Column(Float, nullable=True)          # km/h
    wind_direction_deg = Column(Float, nullable=True)      # degrees
    wind_gusts_kmh = Column(Float, nullable=True)          # km/h
    pressure_hpa = Column(Float, nullable=True)            # hPa
    solar_radiation_wm2 = Column(Float, nullable=True)     # W/m²
    et0_mm_day = Column(Float, nullable=True)              # mm/day (Reference Evapotranspiration)
    soil_moisture_0_7cm_pct = Column(Float, nullable=True) # %
    soil_temp_0cm_c = Column(Float, nullable=True)         # °C
    cloud_cover_pct = Column(Float, nullable=True)         # %
    weather_code = Column(Integer, default=0)              # WMO weather interpretation code

    # Data Quality & Validation Flags
    is_valid = Column(Boolean, default=True)
    is_outlier = Column(Boolean, default=False)
    is_duplicate = Column(Boolean, default=False)
    data_quality_flags = Column(String(256), default="VALID")  # Comma-separated tags e.g. "VALID,PROVISIONAL_GRIDDED"
    quality_score_pct = Column(Float, default=95.0)            # 0.0 - 100.0%
    validation_notes = Column(Text, nullable=True)


class DataQualityLogModel(Base):
    """
    Audit log for pipeline validation checks (bounds checks, spike detection, duplicate checks).
    """
    __tablename__ = "data_quality_logs"

    id = Column(String(64), primary_key=True, index=True)
    job_id = Column(String(64), nullable=False, index=True)
    timestamp = Column(DateTime(timezone=True), default=datetime.datetime.utcnow, nullable=False)
    panchayat_id = Column(String(64), nullable=False, index=True)
    check_type = Column(String(64), nullable=False)  # 'bounds_check', 'spike_check', 'timestamp_check', 'completeness'
    status = Column(String(32), nullable=False)      # 'passed', 'warning', 'failed'
    details_json = Column(Text, nullable=False)
