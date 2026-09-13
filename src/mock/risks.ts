import type { CropRiskAssessment, CropId } from '../types';
import { calculateRiskAssessment } from '../data/mockRisks';

export const getRiskAssessment = (
  panchayatId: string,
  cropId: CropId = 'soybean',
  stageId: string = 'soy_pod_dev'
): CropRiskAssessment => {
  return calculateRiskAssessment(panchayatId, cropId, stageId);
};
