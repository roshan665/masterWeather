import json
from datetime import datetime, timezone
from typing import Optional
from sqlalchemy.orm import Session
from ..repositories.user_repo import UserRepository
from ..core.security import create_access_token, verify_password
from ..schemas.auth import LoginRequest, TokenResponse, UserResponse

class AuthService:
    def __init__(self, db: Session):
        self.db = db
        self.user_repo = UserRepository(db)

    def authenticate(self, login_data: LoginRequest) -> Optional[TokenResponse]:
        user = self.user_repo.get_by_username(login_data.username)
        if not user:
            return None
        
        if not verify_password(login_data.password, user.password_hash):
            return None
        
        user.last_login_at = datetime.now(timezone.utc)
        self.db.commit()

        token = create_access_token(
            subject=user.id,
            extra_claims={"role": user.role, "username": user.username}
        )

        permissions = json.loads(user.permissions_json) if user.permissions_json else []

        user_resp = UserResponse(
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

        return TokenResponse(access_token=token, user=user_resp)

    def demo_login(self, role: str) -> Optional[TokenResponse]:
        user = self.user_repo.get_by_role(role)
        if not user:
            return None
        
        user.last_login_at = datetime.now(timezone.utc)
        self.db.commit()

        token = create_access_token(
            subject=user.id,
            extra_claims={"role": user.role, "username": user.username}
        )

        permissions = json.loads(user.permissions_json) if user.permissions_json else []

        user_resp = UserResponse(
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

        return TokenResponse(access_token=token, user=user_resp)
