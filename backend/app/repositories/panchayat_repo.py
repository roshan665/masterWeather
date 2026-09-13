import json
from typing import List, Optional
from sqlalchemy.orm import Session
from ..models.panchayat import PanchayatModel

class PanchayatRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self) -> List[PanchayatModel]:
        return self.db.query(PanchayatModel).all()

    def get_by_id(self, panchayat_id: str) -> Optional[PanchayatModel]:
        item = self.db.query(PanchayatModel).filter(PanchayatModel.id == panchayat_id).first()
        if item:
            return item
        # Normalize alternative formats (e.g. gp-acharpura <-> panchayat_acharpura)
        normalized = panchayat_id.lower().replace('gp-', '').replace('panchayat_', '').replace('-', '_')
        return self.db.query(PanchayatModel).filter(
            (PanchayatModel.id.ilike(f"%{normalized}%")) | 
            (PanchayatModel.name_en.ilike(f"%{normalized}%"))
        ).first()

    def create(self, panchayat: PanchayatModel) -> PanchayatModel:
        self.db.add(panchayat)
        self.db.commit()
        self.db.refresh(panchayat)
        return panchayat
