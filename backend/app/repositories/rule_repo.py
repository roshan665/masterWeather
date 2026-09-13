import json
from typing import List, Optional
from sqlalchemy.orm import Session
from ..models.advisory import AdvisoryRuleModel

class RuleRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self, crop_id: Optional[str] = None, status: Optional[str] = None) -> List[AdvisoryRuleModel]:
        query = self.db.query(AdvisoryRuleModel)
        if crop_id and crop_id != "all":
            query = query.filter(AdvisoryRuleModel.crop_id == crop_id)
        if status and status != "all":
            query = query.filter(AdvisoryRuleModel.approval_status == status)
        return query.order_by(AdvisoryRuleModel.created_at.desc()).all()

    def get_by_id(self, rule_id: str) -> Optional[AdvisoryRuleModel]:
        return self.db.query(AdvisoryRuleModel).filter(AdvisoryRuleModel.id == rule_id).first()

    def get_by_code(self, code: str) -> Optional[AdvisoryRuleModel]:
        return self.db.query(AdvisoryRuleModel).filter(AdvisoryRuleModel.rule_code == code).first()

    def create(self, rule: AdvisoryRuleModel) -> AdvisoryRuleModel:
        self.db.add(rule)
        self.db.commit()
        self.db.refresh(rule)
        return rule

    def update(self, rule: AdvisoryRuleModel) -> AdvisoryRuleModel:
        self.db.commit()
        self.db.refresh(rule)
        return rule

    def delete(self, rule: AdvisoryRuleModel) -> None:
        self.db.delete(rule)
        self.db.commit()
