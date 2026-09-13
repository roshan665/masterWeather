from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.api.deps import get_db_session, require_role
from app.models.user import UserModel
from app.schemas.knowledge_base import (
    AdvisoryRuleCreate,
    AdvisoryRuleUpdate,
    AdvisoryRuleReview,
    AdvisoryRuleResponse,
)
from app.schemas.common import GenericMessageResponse
from app.services.rule_service import RuleService

router = APIRouter(prefix="/rules", tags=["Knowledge Base & Parametric Advisory Rules"])

@router.get("", response_model=List[AdvisoryRuleResponse])
def list_rules(
    cropId: Optional[str] = Query(None, alias="cropId"),
    status: Optional[str] = Query(None),
    db: Session = Depends(get_db_session)
):
    service = RuleService(db)
    return service.list_rules(crop_id=cropId, status=status)

@router.get("/{rule_id}", response_model=AdvisoryRuleResponse)
def get_rule(rule_id: str, db: Session = Depends(get_db_session)):
    service = RuleService(db)
    result = service.get_rule(rule_id)
    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Rule '{rule_id}' not found"
        )
    return result

@router.post("", response_model=AdvisoryRuleResponse, status_code=status.HTTP_201_CREATED)
def create_rule(
    data: AdvisoryRuleCreate,
    db: Session = Depends(get_db_session),
    current_user: UserModel = Depends(require_role(["officer", "admin"]))
):
    service = RuleService(db)
    return service.create_rule(data)

@router.put("/{rule_id}", response_model=AdvisoryRuleResponse)
def update_rule(
    rule_id: str,
    data: AdvisoryRuleUpdate,
    db: Session = Depends(get_db_session),
    current_user: UserModel = Depends(require_role(["officer", "admin"]))
):
    service = RuleService(db)
    result = service.update_rule(rule_id, data)
    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Rule '{rule_id}' not found"
        )
    return result

@router.post("/{rule_id}/review", response_model=AdvisoryRuleResponse)
def review_rule(
    rule_id: str,
    data: AdvisoryRuleReview,
    db: Session = Depends(get_db_session),
    current_user: UserModel = Depends(require_role(["officer", "admin"]))
):
    service = RuleService(db)
    result = service.review_rule(rule_id, data)
    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Rule '{rule_id}' not found"
        )
    return result

@router.delete("/{rule_id}", response_model=GenericMessageResponse)
def delete_rule(
    rule_id: str,
    db: Session = Depends(get_db_session),
    current_user: UserModel = Depends(require_role(["admin"]))
):
    service = RuleService(db)
    success = service.delete_rule(rule_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Rule '{rule_id}' not found"
        )
    return GenericMessageResponse(success=True, message=f"Rule '{rule_id}' deleted successfully")
