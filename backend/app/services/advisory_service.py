import uuid
from datetime import datetime, timezone
from typing import List, Optional
from sqlalchemy.orm import Session
from ..models.advisory import AgrometAdvisoryModel
from ..repositories.advisory_repo import AdvisoryRepository
from ..schemas.advisory import AdvisoryCreate, AgrometAdvisoryResponse

class AdvisoryService:
    def __init__(self, db: Session):
        self.db = db
        self.repo = AdvisoryRepository(db)

    def _model_to_schema(self, m: AgrometAdvisoryModel) -> AgrometAdvisoryResponse:
        return AgrometAdvisoryResponse(
            id=m.id,
            advisory_code=m.advisory_code,
            panchayat_id=m.panchayat_id,
            panchayat_name_en=m.panchayat_name_en,
            panchayat_name_hi=m.panchayat_name_hi,
            crop_id=m.crop_id,
            crop_name_en=m.crop_name_en,
            crop_name_hi=m.crop_name_hi,
            stage_id=m.stage_id,
            stage_name_en=m.stage_name_en,
            stage_name_hi=m.stage_name_hi,
            headline_en=m.headline_en,
            headline_hi=m.headline_hi,
            detailed_advice_en=m.detailed_advice_en,
            detailed_advice_hi=m.detailed_advice_hi,
            action_type=m.action_type or "monitoring",
            risk_category=m.risk_category or "pest_disease",
            severity=m.severity or "advisory",
            approval_status=m.approval_status or "published",
            helpful_count=m.helpful_count or 0,
            unhelpful_count=m.unhelpful_count or 0,
            author_name=m.author_name or "KVK Bhopal Agronomist",
            approved_by=m.approved_by,
            approved_at=m.approved_at.isoformat() if m.approved_at else None,
            source_citation_en=m.source_citation_en,
            source_citation_hi=m.source_citation_hi,
            created_at=m.created_at.isoformat() if m.created_at else datetime.now(timezone.utc).isoformat(),
        )

    def list_advisories(self, panchayat_id: Optional[str] = None, crop_id: Optional[str] = None) -> List[AgrometAdvisoryResponse]:
        models = self.repo.get_all(panchayat_id=panchayat_id, crop_id=crop_id)
        return [self._model_to_schema(m) for m in models]

    def get_advisory(self, advisory_id: str) -> Optional[AgrometAdvisoryResponse]:
        m = self.repo.get_by_id(advisory_id)
        return self._model_to_schema(m) if m else None

    def create_advisory(self, data: AdvisoryCreate) -> AgrometAdvisoryResponse:
        adv_id = f"adv_{uuid.uuid4().hex[:8]}"
        code = f"ADV-{data.crop_id[:3].upper()}-{uuid.uuid4().hex[:4].upper()}"
        
        model = AgrometAdvisoryModel(
            id=adv_id,
            advisory_code=code,
            panchayat_id=data.panchayat_id,
            panchayat_name_en=data.panchayat_name_en,
            panchayat_name_hi=data.panchayat_name_hi,
            crop_id=data.crop_id,
            crop_name_en=data.crop_name_en,
            crop_name_hi=data.crop_name_hi,
            stage_id=data.stage_id,
            stage_name_en=data.stage_name_en,
            stage_name_hi=data.stage_name_hi,
            headline_en=data.headline_en,
            headline_hi=data.headline_hi,
            detailed_advice_en=data.detailed_advice_en,
            detailed_advice_hi=data.detailed_advice_hi,
            action_type=data.action_type or "monitoring",
            risk_category=data.risk_category or "pest_disease",
            severity=data.severity or "advisory",
            approval_status="published",
            author_name=data.author_name or "KVK Bhopal Agronomist",
            source_citation_en=data.source_citation_en,
            source_citation_hi=data.source_citation_hi,
        )

        saved = self.repo.create(model)
        return self._model_to_schema(saved)

    def approve_advisory(self, advisory_id: str, status: str, officer_name: str) -> Optional[AgrometAdvisoryResponse]:
        m = self.repo.get_by_id(advisory_id)
        if not m:
            return None
        m.approval_status = status
        m.approved_by = officer_name
        m.approved_at = datetime.now(timezone.utc)
        saved = self.repo.update(m)
        return self._model_to_schema(saved)

    def vote_helpful(self, advisory_id: str, is_helpful: bool) -> Optional[AgrometAdvisoryResponse]:
        m = self.repo.get_by_id(advisory_id)
        if not m:
            return None
        if is_helpful:
            m.helpful_count = (m.helpful_count or 0) + 1
        else:
            m.unhelpful_count = (m.unhelpful_count or 0) + 1
        saved = self.repo.update(m)
        return self._model_to_schema(saved)
