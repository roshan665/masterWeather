import { useState, useEffect } from 'react';
import type { CropRiskAssessment, CropId } from '../types';
import { riskService } from '../services';

export function useRisks(panchayatId: string, cropId: string) {
  const [riskSummary, setRiskSummary] = useState<CropRiskAssessment | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    riskService.getRiskSummary(panchayatId, (cropId as CropId) || 'soybean').then((data) => {
      setRiskSummary(data);
      setLoading(false);
    });
  }, [panchayatId, cropId]);

  return { riskSummary, loading };
}
