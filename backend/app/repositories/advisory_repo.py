from typing import List, Optional
from sqlalchemy.orm import Session
from ..models.advisory import AgrometAdvisoryModel

class AdvisoryRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self, panchayat_id: Optional[str] = None, crop_id: Optional[str] = None) -> List[AgrometAdvisoryModel]:
        query = self.db.query(AgrometAdvisoryModel)
        if panchayat_id and panchayat_id != "all":
            query = query.filter(AgrometAdvisoryModel.panchayat_id == panchayat_id)
        if crop_id and crop_id != "all":
            query = query.filter(AgrometAdvisoryModel.crop_id == crop_id)
        return query.order_by(AgrometAdvisoryModel.created_at.desc()).all()

    def get_by_id(self, advisory_id: str) -> Optional[AgrometAdvisoryModel]:
        return self.db.query(AgrometAdvisoryModel).filter(AgrometAdvisoryModel.id == advisory_id).first()

    def create(self, advisory: AgrometAdvisoryModel) -> AgrometAdvisoryModel:
        self.db.add(advisory)
        self.db.commit()
        self.db.refresh(advisory)
        return advisory

    def update(self, advisory: AgrometAdvisoryModel) -> AgrometAdvisoryModel:
        self.db.commit()
        self.db.refresh(advisory)
        return advisory
