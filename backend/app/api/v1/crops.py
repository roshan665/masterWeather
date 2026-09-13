from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api.deps import get_db_session
from app.schemas.crop import CropResponse, SowingCalculationRequest, SowingCalculationResponse
from app.services.crop_service import CropService

router = APIRouter(prefix="/crops", tags=["Crops & Phenology"])

@router.get("", response_model=List[CropResponse])
def list_crops(db: Session = Depends(get_db_session)):
    service = CropService(db)
    return service.list_crops()

@router.post("/calculate-sowing-stage", response_model=SowingCalculationResponse)
def calculate_sowing_stage(data: SowingCalculationRequest, db: Session = Depends(get_db_session)):
    service = CropService(db)
    result = service.calculate_sowing_stage(data)
    if not result:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid crop ID or invalid sowing date format"
        )
    return result
