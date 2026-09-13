import type { RiskLevel } from './common';
import type { CropId } from './crop';

export type AlertCategory =
  | 'heavy_rainfall'
  | 'heatwave'
  | 'pest_outbreak'
  | 'thunderstorm_wind'
  | 'dry_spell';

export interface WeatherAlert {
  id: string;
  panchayatIds: string[];
  panchayatsAffectedEn: string[];
  panchayatsAffectedHi: string[];
  cropsAffected?: CropId[];
  level: RiskLevel;
  category: AlertCategory;
  headlineEn: string;
  headlineHi: string;
  descriptionEn: string;
  descriptionHi: string;
  recommendedActionEn: string;
  recommendedActionHi: string;
  effectiveFrom: string;
  expiresAt: string;
  issuedBy: string;
  issuedAt: string;
  isActive: boolean;
  channel: 'in_app' | 'sms_mock' | 'whatsapp_mock';
}
