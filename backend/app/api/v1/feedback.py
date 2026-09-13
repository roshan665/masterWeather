from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.api.deps import get_db_session
from app.schemas.feedback import FeedbackCreate, FeedbackResponse, FeedbackStatsResponse
from app.services.feedback_service import FeedbackService

router = APIRouter(prefix="/feedback", tags=["Farmer & Extension Feedback"])

@router.post("", response_model=FeedbackResponse, status_code=status.HTTP_201_CREATED)
def submit_feedback(data: FeedbackCreate, db: Session = Depends(get_db_session)):
    service = FeedbackService(db)
    return service.submit_feedback(data)

@router.get("/stats", response_model=FeedbackStatsResponse)
def get_feedback_stats(db: Session = Depends(get_db_session)):
    service = FeedbackService(db)
    return service.get_stats()
