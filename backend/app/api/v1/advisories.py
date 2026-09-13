from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.api.deps import get_db_session, require_role
from app.models.user import UserModel
from app.schemas.advisory import AdvisoryCreate, AdvisoryApprovalRequest, AdvisoryVoteRequest, AgrometAdvisoryResponse
from app.services.advisory_service import AdvisoryService

router = APIRouter(prefix="/advisories", tags=["Agromet Advisories"])

@router.get("", response_model=List[AgrometAdvisoryResponse])
def list_advisories(
    panchayatId: Optional[str] = Query(None, alias="panchayatId"),
    cropId: Optional[str] = Query(None, alias="cropId"),
    db: Session = Depends(get_db_session)
):
    service = AdvisoryService(db)
    return service.list_advisories(panchayat_id=panchayatId, crop_id=cropId)

@router.get("/{advisory_id}", response_model=AgrometAdvisoryResponse)
def get_advisory(advisory_id: str, db: Session = Depends(get_db_session)):
    service = AdvisoryService(db)
    result = service.get_advisory(advisory_id)
    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Advisory '{advisory_id}' not found"
        )
    return result

@router.post("", response_model=AgrometAdvisoryResponse, status_code=status.HTTP_201_CREATED)
def create_advisory(
    data: AdvisoryCreate,
    db: Session = Depends(get_db_session),
    current_user: UserModel = Depends(require_role(["officer", "admin"]))
):
    service = AdvisoryService(db)
    return service.create_advisory(data)

@router.post("/{advisory_id}/approve", response_model=AgrometAdvisoryResponse)
def approve_advisory(
    advisory_id: str,
    data: AdvisoryApprovalRequest,
    db: Session = Depends(get_db_session),
    current_user: UserModel = Depends(require_role(["officer", "admin"]))
):
    service = AdvisoryService(db)
    result = service.approve_advisory(advisory_id, data.status, data.officer_name)
    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Advisory '{advisory_id}' not found"
        )
    return result

@router.post("/{advisory_id}/vote", response_model=AgrometAdvisoryResponse)
def vote_advisory_helpful(
    advisory_id: str,
    data: AdvisoryVoteRequest,
    db: Session = Depends(get_db_session)
):
    service = AdvisoryService(db)
    result = service.vote_helpful(advisory_id, data.is_helpful)
    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Advisory '{advisory_id}' not found"
        )
    return result
