import type { ConfidenceLevel, RiskLevel } from './common';
import type { CropId } from './crop';

export type RiskCategory =
  | 'pest_disease'
  | 'thermal_stress'
  | 'excess_water'
  | 'moisture_deficit'
  | 'spray_window'
  | 'harvest_disruption';

export interface SubRiskDetail {
  id: string;
  category: RiskCategory;
  nameEn: string;
  nameHi: string;
  score: number;
  level: RiskLevel;
  triggerConditionEn: string;
  triggerConditionHi: string;
  mitigationEn: string;
  mitigationHi: string;
}

export interface CropRiskAssessment {
  panchayatId: string;
  cropId: CropId;
  stageId: string;
  overallScore: number;
  overallLevel: RiskLevel;
  confidence: ConfidenceLevel;
  generatedAt: string;
  validUntil: string;
  subRisks: SubRiskDetail[];
  spraySuitabilityNext48h: {
    status: 'optimal' | 'marginal' | 'unfavourable';
    summaryEn: string;
    summaryHi: string;
    bestWindowEn: string;
    bestWindowHi: string;
  };
}
