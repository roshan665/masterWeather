from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import func
from ..models.feedback import FeedbackSubmissionModel

class FeedbackRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self) -> List[FeedbackSubmissionModel]:
        return self.db.query(FeedbackSubmissionModel).order_by(FeedbackSubmissionModel.submitted_at.desc()).all()

    def create(self, feedback: FeedbackSubmissionModel) -> FeedbackSubmissionModel:
        self.db.add(feedback)
        self.db.commit()
        self.db.refresh(feedback)
        return feedback

    def get_stats(self):
        total = self.db.query(FeedbackSubmissionModel).count()
        if total == 0:
            return {
                "total_feedbacks": 0,
                "average_rating": 5.0,
                "satisfaction_pct": 100.0,
                "useful_pct": 100.0,
                "understandable_pct": 100.0,
                "relevant_pct": 100.0,
            }
        
        avg_rating = self.db.query(func.avg(FeedbackSubmissionModel.rating)).scalar() or 5.0
        useful_cnt = self.db.query(FeedbackSubmissionModel).filter(FeedbackSubmissionModel.is_useful == True).count()
        understandable_cnt = self.db.query(FeedbackSubmissionModel).filter(FeedbackSubmissionModel.is_understandable == True).count()
        relevant_cnt = self.db.query(FeedbackSubmissionModel).filter(FeedbackSubmissionModel.is_relevant == True).count()
        
        return {
            "total_feedbacks": total,
            "average_rating": round(float(avg_rating), 1),
            "satisfaction_pct": round((float(avg_rating) / 5.0) * 100, 1),
            "useful_pct": round((useful_cnt / total) * 100, 1),
            "understandable_pct": round((understandable_cnt / total) * 100, 1),
            "relevant_pct": round((relevant_cnt / total) * 100, 1),
        }
