import uuid
from datetime import datetime, timezone
from typing import List, Optional
from sqlalchemy.orm import Session
from ..models.observation import FarmerObservationModel
from ..repositories.observation_repo import ObservationRepository
from ..schemas.observation import ObservationCreate, ObservationReviewRequest, FarmerObservationResponse

class ObservationService:
    def __init__(self, db: Session):
        self.db = db
        self.repo = ObservationRepository(db)

    def _model_to_schema(self, m: FarmerObservationModel) -> FarmerObservationResponse:
        return FarmerObservationResponse(
            id=m.id,
            panchayat_id=m.panchayat_id,
            panchayat_name_en=m.panchayat_name_en,
            panchayat_name_hi=m.panchayat_name_hi,
            village_name_en=m.village_name_en,
            village_name_hi=m.village_name_hi,
            farmer_name=m.farmer_name,
            farmer_phone=m.farmer_phone,
            crop_id=m.crop_id,
            crop_name_en=m.crop_name_en,
            crop_name_hi=m.crop_name_hi,
            stage_id=m.stage_id,
            stage_name_en=m.stage_name_en,
            stage_name_hi=m.stage_name_hi,
            category=m.category,
            description_en=m.description_en,
            description_hi=m.description_hi,
            latitude=m.latitude,
            longitude=m.longitude,
            image_url=m.image_url,
            status=m.status or "pending",
            reviewed_by=m.reviewed_by,
            review_notes_en=m.review_notes_en,
            review_notes_hi=m.review_notes_hi,
            submitted_at=m.submitted_at.isoformat() if m.submitted_at else datetime.now(timezone.utc).isoformat(),
            reviewed_at=m.reviewed_at.isoformat() if m.reviewed_at else None,
        )

    def list_observations(self, panchayat_id: Optional[str] = None, status: Optional[str] = None) -> List[FarmerObservationResponse]:
        models = self.repo.get_all(panchayat_id=panchayat_id, status=status)
        return [self._model_to_schema(m) for m in models]

    def create_observation(self, data: ObservationCreate) -> FarmerObservationResponse:
        obs_id = f"obs_{uuid.uuid4().hex[:8]}"
        model = FarmerObservationModel(
            id=obs_id,
            panchayat_id=data.panchayat_id,
            panchayat_name_en=data.panchayat_name_en,
            panchayat_name_hi=data.panchayat_name_hi,
            village_name_en=data.village_name_en,
            village_name_hi=data.village_name_hi,
            farmer_name=data.farmer_name,
            farmer_phone=data.farmer_phone,
            crop_id=data.crop_id,
            crop_name_en=data.crop_name_en,
            crop_name_hi=data.crop_name_hi,
            stage_id=data.stage_id,
            stage_name_en=data.stage_name_en,
            stage_name_hi=data.stage_name_hi,
            category=data.category,
            description_en=data.description_en,
            description_hi=data.description_hi,
            latitude=data.latitude,
            longitude=data.longitude,
            image_url=data.image_url,
            status="pending",
        )
        saved = self.repo.create(model)
        return self._model_to_schema(saved)

    def review_observation(self, obs_id: str, data: ObservationReviewRequest) -> Optional[FarmerObservationResponse]:
        m = self.repo.get_by_id(obs_id)
        if not m:
            return None
        m.status = data.status
        m.reviewed_by = data.reviewer_name
        m.review_notes_en = data.notes_en
        m.review_notes_hi = data.notes_hi
        m.reviewed_at = datetime.now(timezone.utc)
        saved = self.repo.update(m)
        return self._model_to_schema(saved)
