from sqlalchemy import Column, String, Integer, Text, ForeignKey, DateTime
from sqlalchemy.sql import func
from ..core.database import Base

class AdvisoryRuleModel(Base):
    __tablename__ = "advisory_rules"

    id = Column(String(64), primary_key=True, index=True)
    rule_code = Column(String(64), unique=True, index=True, nullable=False)
    crop_id = Column(String(64), ForeignKey("crops.id"), nullable=False, index=True)
    crop_name_en = Column(String(128), nullable=False)
    crop_name_hi = Column(String(128), nullable=False)
    stage_id = Column(String(64), nullable=False)
    stage_name_en = Column(String(128), nullable=False)
    stage_name_hi = Column(String(128), nullable=False)
    
    weather_trigger_en = Column(Text, nullable=False)
    weather_trigger_hi = Column(Text, nullable=False)
    thresholds_json = Column(Text, nullable=False) # JSON list of RuleThreshold
    threshold_description_en = Column(String(256), nullable=True)
    threshold_description_hi = Column(String(256), nullable=True)
    
    risk_category = Column(String(64), nullable=False)
    severity = Column(String(32), nullable=False)
    
    short_summary_en = Column(String(256), nullable=False)
    short_summary_hi = Column(String(256), nullable=False)
    recommended_action_en = Column(Text, nullable=False)
    recommended_action_hi = Column(Text, nullable=False)
    
    source_org_en = Column(String(256), nullable=False)
    source_org_hi = Column(String(256), nullable=False)
    source_ref_en = Column(String(256), nullable=False)
    source_ref_hi = Column(String(256), nullable=False)
    
    version = Column(String(32), default="v1.0")
    approval_status = Column(String(32), default="draft") # "draft", "pending_review", "approved", "published", "rejected", "archived"
    
    effective_from = Column(String(16), nullable=False)
    effective_until = Column(String(16), nullable=False)
    
    created_by = Column(String(128), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    reviewer = Column(String(128), nullable=True)
    reviewed_at = Column(DateTime(timezone=True), nullable=True)
    review_notes = Column(Text, nullable=True)
    
    version_history_json = Column(Text, nullable=True) # JSON list of RuleVersionRecord

class AgrometAdvisoryModel(Base):
    __tablename__ = "agromet_advisories"

    id = Column(String(64), primary_key=True, index=True)
    advisory_code = Column(String(64), unique=True, index=True, nullable=False)
    panchayat_id = Column(String(64), ForeignKey("panchayats.id"), nullable=False, index=True)
    panchayat_name_en = Column(String(128), nullable=False)
    panchayat_name_hi = Column(String(128), nullable=False)
    crop_id = Column(String(64), ForeignKey("crops.id"), nullable=False, index=True)
    crop_name_en = Column(String(128), nullable=False)
    crop_name_hi = Column(String(128), nullable=False)
    stage_id = Column(String(64), nullable=False)
    stage_name_en = Column(String(128), nullable=False)
    stage_name_hi = Column(String(128), nullable=False)
    
    headline_en = Column(String(256), nullable=False)
    headline_hi = Column(String(256), nullable=False)
    detailed_advice_en = Column(Text, nullable=False)
    detailed_advice_hi = Column(Text, nullable=False)
    
    action_type = Column(String(64), default="monitoring")
    risk_category = Column(String(64), default="pest_disease")
    severity = Column(String(32), default="advisory")
    approval_status = Column(String(32), default="published")
    
    helpful_count = Column(Integer, default=0)
    unhelpful_count = Column(Integer, default=0)
    
    author_name = Column(String(128), default="KVK Bhopal Agronomist")
    approved_by = Column(String(128), nullable=True)
    approved_at = Column(DateTime(timezone=True), nullable=True)
    
    source_citation_en = Column(String(256), nullable=True)
    source_citation_hi = Column(String(256), nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
