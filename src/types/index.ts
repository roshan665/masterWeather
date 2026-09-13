export * from './common';
export * from './weather';
export * from './crop';
export * from './risk';
export * from './advisory';
export * from './observation';
export * from './alert';
export * from './user';
export * from './auth';
export * from './knowledgeBase';

// Convenience Type Aliases for Phase 1 & 2 interoperability
import type { PanchayatLocation } from './common';
import type { CropInfo, CropGrowthStage } from './crop';
import type { CropRiskAssessment, SubRiskDetail } from './risk';
import type { AgrometAdvisory } from './advisory';
import type { DailyForecast, HourlyForecast } from './weather';

export type Panchayat = PanchayatLocation;
export type Crop = CropInfo;
export type CropStage = CropGrowthStage;
export type CropRiskSummary = CropRiskAssessment;
export type SubRiskFactor = SubRiskDetail;
export type Advisory = AgrometAdvisory;
export type ForecastDay = DailyForecast;
export type SprayWindowHour = HourlyForecast;
export type RiskSeverity = 'normal' | 'low' | 'moderate' | 'high' | 'severe' | 'advisory' | 'warning' | 'critical';
