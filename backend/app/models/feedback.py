from sqlalchemy import Column, String, Integer, Text, Boolean, DateTime
from sqlalchemy.sql import func
from ..core.database import Base

class FeedbackSubmissionModel(Base):
    __tablename__ = "feedbacks"

    id = Column(String(64), primary_key=True, index=True)
    advisory_id = Column(String(64), nullable=True)
    panchayat_id = Column(String(64), nullable=True)
    farmer_name = Column(String(128), default="Anonymous Farmer")
    phone = Column(String(32), nullable=True)
    
    rating = Column(Integer, default=5) # 1 - 5
    is_useful = Column(Boolean, default=True)
    is_understandable = Column(Boolean, default=True)
    is_relevant = Column(Boolean, default=True)
    
    comments = Column(Text, nullable=True)
    submitted_at = Column(DateTime(timezone=True), server_default=func.now())

class AuditLogModel(Base):
    __tablename__ = "audit_logs"

    id = Column(String(64), primary_key=True, index=True)
    timestamp = Column(DateTime(timezone=True), server_default=func.now(), index=True)
    user_id = Column(String(64), nullable=False)
    user_name = Column(String(128), nullable=False)
    user_role = Column(String(32), nullable=False)
    action = Column(String(64), nullable=False)
    target_entity = Column(String(64), nullable=False)
    target_id = Column(String(64), nullable=False)
    details = Column(Text, nullable=False)
    status = Column(String(32), default="success")
