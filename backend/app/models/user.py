from sqlalchemy import Column, String, Text, DateTime
from sqlalchemy.sql import func
from ..core.database import Base

class UserModel(Base):
    __tablename__ = "users"

    id = Column(String(64), primary_key=True, index=True)
    username = Column(String(64), unique=True, index=True, nullable=False)
    password_hash = Column(String(256), nullable=False)
    name_en = Column(String(128), nullable=False)
    name_hi = Column(String(128), nullable=False)
    role = Column(String(32), nullable=False) # "farmer", "officer", "admin", "researcher"
    email = Column(String(128), nullable=False)
    phone = Column(String(32), nullable=True)
    avatar_url = Column(String(256), nullable=True)
    
    panchayat_id = Column(String(64), nullable=True)
    panchayat_name_en = Column(String(128), nullable=True)
    panchayat_name_hi = Column(String(128), nullable=True)
    village_name_en = Column(String(128), nullable=True)
    village_name_hi = Column(String(128), nullable=True)
    
    designation_en = Column(String(128), nullable=True)
    designation_hi = Column(String(128), nullable=True)
    organization_en = Column(String(128), nullable=True)
    organization_hi = Column(String(128), nullable=True)
    
    permissions_json = Column(Text, nullable=True) # JSON array of permission strings
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    last_login_at = Column(DateTime(timezone=True), nullable=True)
