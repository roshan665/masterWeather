import type { CropId } from './crop';

export type SoilMoistureStatus = 'dry' | 'optimal' | 'wet' | 'waterlogged';

export type ObservationVerificationStatus = 'verified' | 'pending' | 'flagged' | 'rejected';

export interface FarmerObservation {
  id: string;
  panchayatId: string;
  panchayatNameEn: string;
  panchayatNameHi: string;
  villageNameEn: string;
  villageNameHi: string;
  farmerName: string;
  contactNumber?: string;
  cropId: CropId;
  cropStageEn: string;
  cropStageHi: string;
  soilCondition: SoilMoistureStatus;
  observedRainfallMm?: number;
  observedRainfallCategory: 'none' | 'light' | 'moderate' | 'heavy';
  pestSymptomsEn?: string;
  pestSymptomsHi?: string;
  cropStressNotesEn?: string;
  cropStressNotesHi?: string;
  photoUrl?: string;
  latitude?: number;
  longitude?: number;
  submittedAt: string;
  status: ObservationVerificationStatus;
  reviewedBy?: string;
  reviewNotesEn?: string;
  reviewNotesHi?: string;
  reviewedAt?: string;
}
