import type { RiskCategory } from './risk';
import type { RiskLevel } from './common';
import type { CropId } from './crop';

export type RuleApprovalStatus =
  | 'draft'
  | 'pending_review'
  | 'approved'
  | 'published'
  | 'rejected'
  | 'archived';

export interface RuleThreshold {
  parameter: 'rainfall' | 'temp_max' | 'temp_min' | 'rh' | 'wind_speed' | 'soil_moisture' | 'leaf_wetness';
  operator: '>' | '<' | '>=' | '<=' | 'between';
  value: number | string;
  unit: string;
}

export interface RuleVersionRecord {
  version: string;
  modifiedBy: string;
  modifiedAt: string;
  changeSummary: string;
  status: RuleApprovalStatus;
  reviewedBy?: string;
}

export interface AdvisoryRule {
  id: string;
  ruleCode: string; // e.g. "RULE-SOY-POD-001"
  cropId: CropId;
  cropNameEn: string;
  cropNameHi: string;
  stageId: string;
  stageNameEn: string;
  stageNameHi: string;
  weatherTriggerEn: string;
  weatherTriggerHi: string;
  thresholds: RuleThreshold[];
  thresholdDescriptionEn: string;
  thresholdDescriptionHi: string;
  riskCategory: RiskCategory;
  severity: RiskLevel;
  shortSummaryEn: string;
  shortSummaryHi: string;
  recommendedActionEn: string;
  recommendedActionHi: string;
  sourceOrganizationEn: string;
  sourceOrganizationHi: string;
  sourceReferenceEn: string;
  sourceReferenceHi: string;
  version: string; // e.g. "v1.2"
  approvalStatus: RuleApprovalStatus;
  effectiveFrom: string; // ISO date "2026-06-15"
  effectiveUntil: string; // ISO date "2026-10-31"
  createdBy: string;
  createdAt: string;
  reviewer?: string;
  reviewedAt?: string;
  reviewNotes?: string;
  versionHistory: RuleVersionRecord[];
}
