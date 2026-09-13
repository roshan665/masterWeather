import uuid
from datetime import datetime, timezone
from typing import List
from sqlalchemy.orm import Session
from ..models.feedback import FeedbackSubmissionModel
from ..repositories.feedback_repo import FeedbackRepository
from ..schemas.feedback import FeedbackCreate, FeedbackResponse, FeedbackStatsResponse

class FeedbackService:
    def __init__(self, db: Session):
        self.db = db
        self.repo = FeedbackRepository(db)

    def submit_feedback(self, data: FeedbackCreate) -> FeedbackResponse:
        fb_id = f"fb_{uuid.uuid4().hex[:8]}"
        model = FeedbackSubmissionModel(
            id=fb_id,
            advisory_id=data.advisory_id,
            panchayat_id=data.panchayat_id,
            farmer_name=data.farmer_name or "Anonymous Farmer",
            phone=data.phone,
            rating=data.rating,
            is_useful=data.is_useful,
            is_understandable=data.is_understandable,
            is_relevant=data.is_relevant,
            comments=data.comments,
        )
        saved = self.repo.create(model)
        return FeedbackResponse(
            id=saved.id,
            advisory_id=saved.advisory_id,
            panchayat_id=saved.panchayat_id,
            farmer_name=saved.farmer_name,
            phone=saved.phone,
            rating=saved.rating,
            is_useful=bool(saved.is_useful),
            is_understandable=bool(saved.is_understandable),
            is_relevant=bool(saved.is_relevant),
            comments=saved.comments,
            submitted_at=saved.submitted_at.isoformat() if saved.submitted_at else datetime.now(timezone.utc).isoformat(),
        )

    def get_stats(self) -> FeedbackStatsResponse:
        stats = self.repo.get_stats()
        return FeedbackStatsResponse(**stats)
