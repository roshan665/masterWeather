import json
import uuid
from datetime import datetime, timezone
from typing import List, Optional
from sqlalchemy.orm import Session
from ..models.advisory import AdvisoryRuleModel
from ..repositories.rule_repo import RuleRepository
from ..schemas.knowledge_base import (
    AdvisoryRuleCreate,
    AdvisoryRuleUpdate,
    AdvisoryRuleReview,
    AdvisoryRuleResponse,
    RuleThresholdSchema,
    RuleVersionRecordSchema,
)

class RuleService:
    def __init__(self, db: Session):
        self.db = db
        self.repo = RuleRepository(db)

    def _model_to_schema(self, m: AdvisoryRuleModel) -> AdvisoryRuleResponse:
        thresholds = [RuleThresholdSchema(**t) for t in json.loads(m.thresholds_json)] if m.thresholds_json else []
        history = [RuleVersionRecordSchema(**h) for h in json.loads(m.version_history_json)] if m.version_history_json else []
        
        return AdvisoryRuleResponse(
            id=m.id,
            rule_code=m.rule_code,
            crop_id=m.crop_id,
            crop_name_en=m.crop_name_en,
            crop_name_hi=m.crop_name_hi,
            stage_id=m.stage_id,
            stage_name_en=m.stage_name_en,
            stage_name_hi=m.stage_name_hi,
            weather_trigger_en=m.weather_trigger_en,
            weather_trigger_hi=m.weather_trigger_hi,
            thresholds=thresholds,
            threshold_description_en=m.threshold_description_en,
            threshold_description_hi=m.threshold_description_hi,
            risk_category=m.risk_category,
            severity=m.severity,
            short_summary_en=m.short_summary_en,
            short_summary_hi=m.short_summary_hi,
            recommended_action_en=m.recommended_action_en,
            recommended_action_hi=m.recommended_action_hi,
            source_org_en=m.source_org_en,
            source_org_hi=m.source_org_hi,
            source_ref_en=m.source_ref_en,
            source_ref_hi=m.source_ref_hi,
            version=m.version or "v1.0",
            approval_status=m.approval_status or "draft",
            effective_from=m.effective_from,
            effective_until=m.effective_until,
            created_by=m.created_by,
            created_at=m.created_at.isoformat() if m.created_at else datetime.now(timezone.utc).isoformat(),
            reviewer=m.reviewer,
            reviewed_at=m.reviewed_at.isoformat() if m.reviewed_at else None,
            review_notes=m.review_notes,
            version_history=history,
        )

    def list_rules(self, crop_id: Optional[str] = None, status: Optional[str] = None) -> List[AdvisoryRuleResponse]:
        models = self.repo.get_all(crop_id=crop_id, status=status)
        return [self._model_to_schema(m) for m in models]

    def get_rule(self, rule_id: str) -> Optional[AdvisoryRuleResponse]:
        m = self.repo.get_by_id(rule_id)
        return self._model_to_schema(m) if m else None

    def create_rule(self, data: AdvisoryRuleCreate) -> AdvisoryRuleResponse:
        rule_id = f"rule_{uuid.uuid4().hex[:8]}"
        initial_ver = data.initial_version or "v1.0"
        now_iso = datetime.now(timezone.utc).isoformat()
        
        thresholds_json = json.dumps([t.model_dump() for t in data.thresholds])
        history_json = json.dumps([
            {
                "version": initial_ver,
                "modified_by": data.created_by or "Agromet Admin",
                "modified_at": now_iso,
                "change_summary": "Initial rule draft created.",
                "status": data.approval_status or "draft",
            }
        ])

        model = AdvisoryRuleModel(
            id=rule_id,
            rule_code=data.rule_code,
            crop_id=data.crop_id,
            crop_name_en=data.crop_name_en,
            crop_name_hi=data.crop_name_hi,
            stage_id=data.stage_id,
            stage_name_en=data.stage_name_en,
            stage_name_hi=data.stage_name_hi,
            weather_trigger_en=data.weather_trigger_en,
            weather_trigger_hi=data.weather_trigger_hi,
            thresholds_json=thresholds_json,
            threshold_description_en=data.threshold_description_en,
            threshold_description_hi=data.threshold_description_hi,
            risk_category=data.risk_category,
            severity=data.severity,
            short_summary_en=data.short_summary_en,
            short_summary_hi=data.short_summary_hi,
            recommended_action_en=data.recommended_action_en,
            recommended_action_hi=data.recommended_action_hi,
            source_org_en=data.source_org_en,
            source_org_hi=data.source_org_hi,
            source_ref_en=data.source_ref_en,
            source_ref_hi=data.source_ref_hi,
            version=initial_ver,
            approval_status=data.approval_status or "draft",
            effective_from=data.effective_from,
            effective_until=data.effective_until,
            created_by=data.created_by or "Agromet Admin",
            version_history_json=history_json,
        )

        saved = self.repo.create(model)
        return self._model_to_schema(saved)

    def update_rule(self, rule_id: str, data: AdvisoryRuleUpdate) -> Optional[AdvisoryRuleResponse]:
        m = self.repo.get_by_id(rule_id)
        if not m:
            return None

        now_iso = datetime.now(timezone.utc).isoformat()
        curr_history = json.loads(m.version_history_json) if m.version_history_json else []

        # Version bump e.g. v1.0 -> v1.1
        try:
            ver_num = float(m.version.replace("v", ""))
            next_ver = f"v{round(ver_num + 0.1, 1)}"
        except Exception:
            next_ver = f"{m.version}.1"

        new_history_record = {
            "version": next_ver,
            "modified_by": data.modifier_name or "Agromet Admin",
            "modified_at": now_iso,
            "change_summary": data.change_summary or "Updated rule parameters",
            "status": data.approval_status or m.approval_status,
            "reviewed_by": m.reviewer,
        }
        curr_history.insert(0, new_history_record)

        if data.crop_id is not None: m.crop_id = data.crop_id
        if data.crop_name_en is not None: m.crop_name_en = data.crop_name_en
        if data.crop_name_hi is not None: m.crop_name_hi = data.crop_name_hi
        if data.stage_id is not None: m.stage_id = data.stage_id
        if data.stage_name_en is not None: m.stage_name_en = data.stage_name_en
        if data.stage_name_hi is not None: m.stage_name_hi = data.stage_name_hi
        if data.weather_trigger_en is not None: m.weather_trigger_en = data.weather_trigger_en
        if data.weather_trigger_hi is not None: m.weather_trigger_hi = data.weather_trigger_hi
        if data.thresholds is not None:
            m.thresholds_json = json.dumps([t.model_dump() for t in data.thresholds])
        if data.risk_category is not None: m.risk_category = data.risk_category
        if data.severity is not None: m.severity = data.severity
        if data.short_summary_en is not None: m.short_summary_en = data.short_summary_en
        if data.short_summary_hi is not None: m.short_summary_hi = data.short_summary_hi
        if data.recommended_action_en is not None: m.recommended_action_en = data.recommended_action_en
        if data.recommended_action_hi is not None: m.recommended_action_hi = data.recommended_action_hi
        if data.source_org_en is not None: m.source_org_en = data.source_org_en
        if data.source_org_hi is not None: m.source_org_hi = data.source_org_hi
        if data.source_ref_en is not None: m.source_ref_en = data.source_ref_en
        if data.source_ref_hi is not None: m.source_ref_hi = data.source_ref_hi
        if data.effective_from is not None: m.effective_from = data.effective_from
        if data.effective_until is not None: m.effective_until = data.effective_until

        m.version = next_ver
        m.version_history_json = json.dumps(curr_history)

        saved = self.repo.update(m)
        return self._model_to_schema(saved)

    def review_rule(self, rule_id: str, review_data: AdvisoryRuleReview) -> Optional[AdvisoryRuleResponse]:
        m = self.repo.get_by_id(rule_id)
        if not m:
            return None

        now_iso = datetime.now(timezone.utc).isoformat()
        curr_history = json.loads(m.version_history_json) if m.version_history_json else []

        new_record = {
            "version": m.version,
            "modified_by": review_data.reviewer_name,
            "modified_at": now_iso,
            "change_summary": f"Status updated to '{review_data.status}': {review_data.review_notes or 'Review completed.'}",
            "status": review_data.status,
            "reviewed_by": review_data.reviewer_name,
        }
        curr_history.insert(0, new_record)

        m.approval_status = review_data.status
        m.reviewer = review_data.reviewer_name
        m.reviewed_at = datetime.now(timezone.utc)
        m.review_notes = review_data.review_notes
        m.version_history_json = json.dumps(curr_history)

        saved = self.repo.update(m)
        return self._model_to_schema(saved)

    def delete_rule(self, rule_id: str) -> bool:
        m = self.repo.get_by_id(rule_id)
        if not m:
            return False
        self.repo.delete(m)
        return True
