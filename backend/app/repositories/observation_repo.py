from typing import List, Optional
from sqlalchemy.orm import Session
from ..models.observation import FarmerObservationModel

class ObservationRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self, panchayat_id: Optional[str] = None, status: Optional[str] = None) -> List[FarmerObservationModel]:
        query = self.db.query(FarmerObservationModel)
        if panchayat_id and panchayat_id != "all":
            query = query.filter(FarmerObservationModel.panchayat_id == panchayat_id)
        if status and status != "all":
            query = query.filter(FarmerObservationModel.status == status)
        return query.order_by(FarmerObservationModel.submitted_at.desc()).all()

    def get_by_id(self, obs_id: str) -> Optional[FarmerObservationModel]:
        return self.db.query(FarmerObservationModel).filter(FarmerObservationModel.id == obs_id).first()

    def create(self, obs: FarmerObservationModel) -> FarmerObservationModel:
        self.db.add(obs)
        self.db.commit()
        self.db.refresh(obs)
        return obs

    def update(self, obs: FarmerObservationModel) -> FarmerObservationModel:
        self.db.commit()
        self.db.refresh(obs)
        return obs
