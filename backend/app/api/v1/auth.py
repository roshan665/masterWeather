import json
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api.deps import get_db_session, require_current_user
from app.models.user import UserModel
from app.schemas.auth import LoginRequest, DemoLoginRequest, TokenResponse, UserResponse
from app.services.auth_service import AuthService

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/login", response_model=TokenResponse)
def login(data: LoginRequest, db: Session = Depends(get_db_session)):
    auth_service = AuthService(db)
    result = auth_service.authenticate(data)
    if not result:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password"
        )
    return result

@router.post("/demo-login", response_model=TokenResponse)
def demo_login(data: DemoLoginRequest, db: Session = Depends(get_db_session)):
    auth_service = AuthService(db)
    result = auth_service.demo_login(data.role)
    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Demo account for role '{data.role}' not found"
        )
    return result

@router.get("/me", response_model=UserResponse)
def get_current_user_profile(user: UserModel = Depends(require_current_user)):
    permissions = json.loads(user.permissions_json) if user.permissions_json else []
    return UserResponse(
        id=user.id,
        username=user.username,
        name_en=user.name_en,
        name_hi=user.name_hi,
        role=user.role, # type: ignore
        email=user.email,
        phone=user.phone,
        avatar_url=user.avatar_url,
        panchayat_id=user.panchayat_id,
        panchayat_name_en=user.panchayat_name_en,
        panchayat_name_hi=user.panchayat_name_hi,
        village_name_en=user.village_name_en,
        village_name_hi=user.village_name_hi,
        designation_en=user.designation_en,
        designation_hi=user.designation_hi,
        organization_en=user.organization_en,
        organization_hi=user.organization_hi,
        permissions=permissions,
        last_login_at=user.last_login_at.isoformat() if user.last_login_at else None
    )
