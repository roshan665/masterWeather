import datetime
from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from ..models.weather_pipeline import RawWeatherPayloadModel, NormalizedWeatherRecordModel, DataQualityLogModel

class WeatherPipelineRepository:
    def __init__(self, db: Session):
        self.db = db

    def find_duplicate_payload(self, panchayat_id: str, payload_hash: str) -> Optional[RawWeatherPayloadModel]:
        """Check if an identical raw payload hash was ingested in the last 30 minutes."""
        threshold_time = datetime.datetime.utcnow() - datetime.timedelta(minutes=30)
        return self.db.query(RawWeatherPayloadModel).filter(
            RawWeatherPayloadModel.panchayat_id == panchayat_id,
            RawWeatherPayloadModel.payload_hash_sha256 == payload_hash,
            RawWeatherPayloadModel.retrieval_timestamp >= threshold_time
        ).first()

    def find_duplicate_record(self, panchayat_id: str, reading_timestamp: datetime.datetime, source_provider: str) -> Optional[NormalizedWeatherRecordModel]:
        """Check for existing record at the same timestamp."""
        return self.db.query(NormalizedWeatherRecordModel).filter(
            NormalizedWeatherRecordModel.panchayat_id == panchayat_id,
            NormalizedWeatherRecordModel.reading_timestamp == reading_timestamp,
            NormalizedWeatherRecordModel.source_provider == source_provider
        ).first()

    def save_raw_payload(self, payload: RawWeatherPayloadModel) -> RawWeatherPayloadModel:
        self.db.add(payload)
        self.db.commit()
        self.db.refresh(payload)
        return payload

    def save_normalized_record(self, record: NormalizedWeatherRecordModel) -> NormalizedWeatherRecordModel:
        self.db.merge(record)
        self.db.commit()
        return record

    def save_normalized_records_batch(self, records: List[NormalizedWeatherRecordModel]):
        for rec in records:
            self.db.merge(rec)
        self.db.commit()

    def save_quality_log(self, log: DataQualityLogModel):
        self.db.add(log)
        self.db.commit()

    def get_latest_normalized_records(self, panchayat_id: Optional[str] = None, limit: int = 50) -> List[NormalizedWeatherRecordModel]:
        query = self.db.query(NormalizedWeatherRecordModel)
        if panchayat_id:
            query = query.filter(NormalizedWeatherRecordModel.panchayat_id == panchayat_id)
        return query.order_by(desc(NormalizedWeatherRecordModel.reading_timestamp)).limit(limit).all()

    def get_quality_summary(self) -> Dict[str, Any]:
        total_records = self.db.query(NormalizedWeatherRecordModel).count()
        valid_records = self.db.query(NormalizedWeatherRecordModel).filter(NormalizedWeatherRecordModel.is_valid == True).count()
        outliers_count = self.db.query(NormalizedWeatherRecordModel).filter(NormalizedWeatherRecordModel.is_outlier == True).count()
        duplicates_count = self.db.query(NormalizedWeatherRecordModel).filter(NormalizedWeatherRecordModel.is_duplicate == True).count()
        
        avg_score_res = self.db.query(func.avg(NormalizedWeatherRecordModel.quality_score_pct)).scalar()
        avg_score = float(avg_score_res) if avg_score_res is not None else 95.0

        latest_record = self.db.query(NormalizedWeatherRecordModel).order_by(desc(NormalizedWeatherRecordModel.retrieved_at)).first()
        last_ingestion = latest_record.retrieved_at if latest_record else None

        raw_count = self.db.query(RawWeatherPayloadModel).count()

        return {
            "total_records": total_records,
            "valid_records_count": valid_records,
            "suspect_outliers_count": outliers_count,
            "duplicate_records_count": duplicates_count,
            "missing_value_rate_pct": round(max(0.0, 100.0 - (valid_records / max(1, total_records) * 100.0)), 2),
            "average_quality_score_pct": round(avg_score, 1),
            "total_raw_payloads": raw_count,
            "last_ingestion_timestamp": last_ingestion,
        }

    def get_latest_raw_payloads(self, limit: int = 10) -> List[RawWeatherPayloadModel]:
        return self.db.query(RawWeatherPayloadModel).order_by(desc(RawWeatherPayloadModel.retrieval_timestamp)).limit(limit).all()
