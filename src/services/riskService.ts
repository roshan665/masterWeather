import type { CropRiskAssessment, CropId } from '../types';
import { calculateRiskAssessment } from '../data/mockRisks';
import { PANCHAYATS } from '../data/panchayats';

export const riskService = {
  async getRiskSummary(panchayatId: string, cropId: CropId = 'soybean', stageId: string = 'soy_pod_dev'): Promise<CropRiskAssessment> {
    await new Promise((r) => setTimeout(r, 80));
    return calculateRiskAssessment(panchayatId, cropId, stageId);
  },

  async getAllPanchayatRiskScores(): Promise<Record<string, { maxScore: number; severity: string }>> {
    await new Promise((r) => setTimeout(r, 60));
    const result: Record<string, { maxScore: number; severity: string }> = {};
    for (const gp of PANCHAYATS) {
      const assessment = calculateRiskAssessment(gp.id, 'soybean', 'soy_pod_dev');
      result[gp.id] = { maxScore: assessment.overallScore, severity: assessment.overallLevel };
    }
    return result;
  }
};
