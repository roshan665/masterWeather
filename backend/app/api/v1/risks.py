from typing import List
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.api.deps import get_db_session
from app.schemas.risk import CropRiskResponse, RiskMatrixItem
from app.schemas.risk_engine import CropRiskEvaluationInput, CropRiskEvaluationOutput
from app.services.risk_service import RiskService
from app.services.crop_risk_engine import CropRiskEngine

router = APIRouter(prefix="/risks", tags=["Crop-Weather Risk Analytics"])

@router.post("/evaluate", response_model=CropRiskEvaluationOutput)
def evaluate_custom_crop_risk(
    request: CropRiskEvaluationInput,
    db: Session = Depends(get_db_session)
):
    """
    Evaluates dynamic, rule-based agricultural crop-risk against active Knowledge Base rules.
    Accepts custom forecast variables, crop, growth stage, horizon, confidence, and event duration.
    """
    engine = CropRiskEngine(db)
    return engine.evaluate_risk(request)


@router.get("/assessment", response_model=CropRiskResponse)
def get_risk_assessment(
    panchayatId: str = Query(..., alias="panchayatId"),
    cropId: str = Query(..., alias="cropId"),
    stageId: str = Query(None, alias="stageId"),
    horizonDays: int = Query(1, alias="horizonDays", ge=1, le=14),
    durationHours: float = Query(24.0, alias="durationHours", ge=1.0),
    db: Session = Depends(get_db_session)
):
    """
    Returns live rule-based agricultural risk assessment for a specific Panchayat and Crop.
    """
    service = RiskService(db)
    result = service.get_crop_risk(panchayatId, cropId)
    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Risk assessment for Panchayat '{panchayatId}' and Crop '{cropId}' not found"
        )
    return result


@router.get("/matrix", response_model=List[RiskMatrixItem])
def get_risk_matrix(db: Session = Depends(get_db_session)):
    """
    Returns the complete 5-Panchayat × 3-Crop risk monitoring matrix for officers and admins.
    """
    service = RiskService(db)
    return service.get_risk_matrix()
