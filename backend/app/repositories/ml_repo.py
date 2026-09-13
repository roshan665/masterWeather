import datetime
from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import desc
from ..models.ml_models import MLModelRegistryModel, MLForecastPredictionModel

class MLRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all_models(self, version_tag: Optional[str] = None) -> List[MLModelRegistryModel]:
        query = self.db.query(MLModelRegistryModel)
        if version_tag:
            query = query.filter(MLModelRegistryModel.version_tag == version_tag)
        return query.order_by(MLModelRegistryModel.target_variable, MLModelRegistryModel.rmse).all()

    def get_champions(self, version_tag: Optional[str] = None) -> List[MLModelRegistryModel]:
        query = self.db.query(MLModelRegistryModel).filter(MLModelRegistryModel.is_active_champion == True)
        if version_tag:
            query = query.filter(MLModelRegistryModel.version_tag == version_tag)
        return query.all()

    def get_target_models(self, target_variable: str, version_tag: Optional[str] = None) -> List[MLModelRegistryModel]:
        query = self.db.query(MLModelRegistryModel).filter(MLModelRegistryModel.target_variable == target_variable)
        if version_tag:
            query = query.filter(MLModelRegistryModel.version_tag == version_tag)
        return query.order_by(MLModelRegistryModel.rmse).all()
