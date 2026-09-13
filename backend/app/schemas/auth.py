from typing import List, Optional
from pydantic import BaseModel, EmailStr
from .common import UserRole

class LoginRequest(BaseModel):
    username: str
    password: str

class DemoLoginRequest(BaseModel):
    role: UserRole

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: "UserResponse"

class UserBase(BaseModel):
    username: str
    name_en: str
    name_hi: str
    role: UserRole
    email: str
    phone: Optional[str] = None
    avatar_url: Optional[str] = None
    panchayat_id: Optional[str] = None
    panchayat_name_en: Optional[str] = None
    panchayat_name_hi: Optional[str] = None
    village_name_en: Optional[str] = None
    village_name_hi: Optional[str] = None
    designation_en: Optional[str] = None
    designation_hi: Optional[str] = None
    organization_en: Optional[str] = None
    organization_hi: Optional[str] = None
    permissions: List[str] = []

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: str
    last_login_at: Optional[str] = None

    class Config:
        from_attributes = True

TokenResponse.model_rebuild()
