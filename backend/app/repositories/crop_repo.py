import json
from typing import List, Optional
from sqlalchemy.orm import Session
from ..models.crop import CropModel, CropStageModel

class CropRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self) -> List[CropModel]:
        return self.db.query(CropModel).all()

    def get_by_id(self, crop_id: str) -> Optional[CropModel]:
        item = self.db.query(CropModel).filter(CropModel.id == crop_id).first()
        if item:
            return item
        normalized = crop_id.lower().replace('crop-', '').replace('crop_', '').replace('-', '_')
        return self.db.query(CropModel).filter(
            (CropModel.id.ilike(f"%{normalized}%")) |
            (CropModel.name_en.ilike(f"%{normalized}%"))
        ).first()

    def get_stages_for_crop(self, crop_id: str) -> List[CropStageModel]:
        crop = self.get_by_id(crop_id)
        target_id = crop.id if crop else crop_id
        return self.db.query(CropStageModel).filter(CropStageModel.crop_id == target_id).order_by(CropStageModel.stage_order).all()
