from typing import List, Optional
from sqlalchemy.orm import Session
from ..models.risk import CropRiskAssessmentModel

class RiskRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_latest_assessment(self, panchayat_id: str, crop_id: str) -> Optional[CropRiskAssessmentModel]:
        return self.db.query(CropRiskAssessmentModel).filter(
            CropRiskAssessmentModel.panchayat_id == panchayat_id,
            CropRiskAssessmentModel.crop_id == crop_id
        ).order_by(CropRiskAssessmentModel.created_at.desc()).first()

    def get_matrix_for_panchayats(self) -> List[CropRiskAssessmentModel]:
        return self.db.query(CropRiskAssessmentModel).order_by(CropRiskAssessmentModel.created_at.desc()).limit(15).all()
