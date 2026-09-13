from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api.deps import get_db_session
from app.schemas.panchayat import PanchayatResponse, PanchayatListResponse
from app.services.panchayat_service import PanchayatService

router = APIRouter(prefix="/panchayats", tags=["Panchayats & Geographic Boundaries"])

@router.get("", response_model=PanchayatListResponse)
def list_panchayats(db: Session = Depends(get_db_session)):
    service = PanchayatService(db)
    return service.list_panchayats()

@router.get("/boundaries/geojson")
def get_panchayat_boundaries_geojson(db: Session = Depends(get_db_session)):
    service = PanchayatService(db)
    return service.get_boundaries_geojson()

@router.get("/{panchayat_id}", response_model=PanchayatResponse)
def get_panchayat(panchayat_id: str, db: Session = Depends(get_db_session)):
    service = PanchayatService(db)
    result = service.get_panchayat(panchayat_id)
    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Panchayat '{panchayat_id}' not found"
        )
    return result
