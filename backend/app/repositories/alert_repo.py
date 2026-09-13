from typing import List, Optional
from sqlalchemy.orm import Session
from ..models.alert import WeatherAlertModel

class AlertRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self, active_only: bool = False) -> List[WeatherAlertModel]:
        query = self.db.query(WeatherAlertModel)
        if active_only:
            query = query.filter(WeatherAlertModel.is_active == True)
        return query.order_by(WeatherAlertModel.issued_at.desc()).all()

    def get_by_id(self, alert_id: str) -> Optional[WeatherAlertModel]:
        return self.db.query(WeatherAlertModel).filter(WeatherAlertModel.id == alert_id).first()

    def create(self, alert: WeatherAlertModel) -> WeatherAlertModel:
        self.db.add(alert)
        self.db.commit()
        self.db.refresh(alert)
        return alert

    def update(self, alert: WeatherAlertModel) -> WeatherAlertModel:
        self.db.commit()
        self.db.refresh(alert)
        return alert
