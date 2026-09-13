from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.api.deps import get_db_session, require_role
from app.models.user import UserModel
from app.schemas.observation import ObservationCreate, ObservationReviewRequest, FarmerObservationResponse
from app.services.observation_service import ObservationService

router = APIRouter(prefix="/observations", tags=["Farmer Ground Observations"])

@router.get("", response_model=List[FarmerObservationResponse])
def list_observations(
    panchayatId: Optional[str] = Query(None, alias="panchayatId"),
    status: Optional[str] = Query(None),
    db: Session = Depends(get_db_session)
):
    service = ObservationService(db)
    return service.list_observations(panchayat_id=panchayatId, status=status)

@router.post("", response_model=FarmerObservationResponse, status_code=status.HTTP_201_CREATED)
def submit_observation(data: ObservationCreate, db: Session = Depends(get_db_session)):
    service = ObservationService(db)
    return service.create_observation(data)

@router.post("/{obs_id}/verify", response_model=FarmerObservationResponse)
def verify_observation(
    obs_id: str,
    data: ObservationReviewRequest,
    db: Session = Depends(get_db_session),
    current_user: UserModel = Depends(require_role(["officer", "admin"]))
):
    service = ObservationService(db)
    result = service.review_observation(obs_id, data)
    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Observation '{obs_id}' not found"
        )
    return result
