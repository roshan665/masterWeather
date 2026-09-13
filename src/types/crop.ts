export type CropId = 'soybean' | 'wheat' | 'chickpea';

export interface CropGrowthStage {
  stageId: string;
  stageOrder: number;
  nameEn: string;
  nameHi: string;
  typicalDurationDays: number;
  criticalWeatherTriggers: string[];
  waterSensitivity: 'low' | 'moderate' | 'high' | 'critical';
  thermalSensitivity: 'low' | 'moderate' | 'high' | 'critical';
  descriptionEn: string;
  descriptionHi: string;
}

export interface CropInfo {
  id: CropId;
  nameEn: string;
  nameHi: string;
  botanicalName: string;
  season: 'kharif' | 'rabi' | 'zaid';
  seasonNameEn: string;
  seasonNameHi: string;
  typicalSowingWindowEn: string;
  typicalSowingWindowHi: string;
  totalDurationDays: number;
  stages: CropGrowthStage[];
  icon: string;
  primaryRisksEn: string[];
  primaryRisksHi: string[];
}

export interface CropActiveState {
  cropId: CropId;
  sowingDate: string; // ISO date "2026-06-25"
  daysAfterSowing: number;
  currentStage: CropGrowthStage;
  progressPct: number;
  estimatedHarvestDate: string;
}
