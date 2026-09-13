import type { FarmerObservation } from '../types';
import { MOCK_OBSERVATIONS } from '../mock';

export const observationService = {
  async getObservations(panchayatId?: string): Promise<FarmerObservation[]> {
    await new Promise((r) => setTimeout(r, 70));
    if (!panchayatId) return MOCK_OBSERVATIONS;
    return MOCK_OBSERVATIONS.filter((obs) => obs.panchayatId === panchayatId);
  },

  async submitObservation(observation: Omit<FarmerObservation, 'id' | 'submittedAt' | 'status'>): Promise<FarmerObservation> {
    await new Promise((r) => setTimeout(r, 120));
    const newObs: FarmerObservation = {
      ...observation,
      id: `obs-${Date.now().toString().slice(-4)}`,
      submittedAt: new Date().toISOString(),
      status: 'pending'
    };
    MOCK_OBSERVATIONS.unshift(newObs);
    return newObs;
  },

  async verifyObservation(observationId: string, officerName: string, notes?: string): Promise<boolean> {
    const obs = MOCK_OBSERVATIONS.find((o) => o.id === observationId);
    if (obs) {
      obs.status = 'verified';
      obs.reviewedBy = officerName;
      obs.reviewedAt = new Date().toISOString();
      if (notes) obs.reviewNotesEn = notes;
      return true;
    }
    return false;
  }
};
