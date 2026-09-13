from typing import List
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.api.deps import get_db_session, require_role
from app.models.user import UserModel
from app.schemas.alert import AlertBroadcastRequest, WeatherAlertResponse
from app.services.alert_service import AlertService

router = APIRouter(prefix="/alerts", tags=["Emergency Weather Alerts & Broadcasts"])

@router.get("", response_model=List[WeatherAlertResponse])
def list_alerts(
    activeOnly: bool = Query(False, alias="activeOnly"),
    db: Session = Depends(get_db_session)
):
    service = AlertService(db)
    return service.list_alerts(active_only=activeOnly)

@router.post("/broadcast", response_model=WeatherAlertResponse, status_code=status.HTTP_201_CREATED)
def broadcast_alert(
    data: AlertBroadcastRequest,
    db: Session = Depends(get_db_session),
    current_user: UserModel = Depends(require_role(["officer", "admin"]))
):
    service = AlertService(db)
    return service.broadcast_alert(data)

@router.post("/{alert_id}/toggle", response_model=WeatherAlertResponse)
def toggle_alert_active(
    alert_id: str,
    db: Session = Depends(get_db_session),
    current_user: UserModel = Depends(require_role(["officer", "admin"]))
):
    service = AlertService(db)
    result = service.toggle_active(alert_id)
    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Alert '{alert_id}' not found"
        )
    return result
