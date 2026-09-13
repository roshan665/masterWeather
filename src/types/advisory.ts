import type { ConfidenceLevel, RiskLevel } from './common';
import type { CropId } from './crop';

export type AdvisoryType =
  | 'irrigation'
  | 'pest_management'
  | 'nutrient_application'
  | 'sowing_harvest'
  | 'weather_protection';

export type AdvisoryApprovalStatus = 'approved' | 'pending_review' | 'rejected' | 'draft';

export interface AgrometAdvisory {
  id: string;
  panchayatId: string;
  panchayatNameEn: string;
  panchayatNameHi: string;
  cropId: CropId;
  stageId: string;
  stageNameEn: string;
  stageNameHi: string;
  type: AdvisoryType;
  riskLevel: RiskLevel;
  titleEn: string;
  titleHi: string;
  shortSummaryEn: string;
  shortSummaryHi: string;
  detailedActionEn: string;
  detailedActionHi: string;
  audioScriptEn: string;
  audioScriptHi: string;
  weatherTriggerEn: string;
  weatherTriggerHi: string;
  sourceAuthorityEn: string;
  sourceAuthorityHi: string;
  confidence: ConfidenceLevel;
  approvalStatus: AdvisoryApprovalStatus;
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
  validUntil: string;
  helpfulCount: number;
  unhelpfulCount: number;
}
