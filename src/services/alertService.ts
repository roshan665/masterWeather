import type { WeatherAlert } from '../types';
import { MOCK_ALERTS } from '../mock';

export const alertService = {
  async getActiveAlerts(panchayatId?: string): Promise<WeatherAlert[]> {
    await new Promise((r) => setTimeout(r, 60));
    if (!panchayatId) return MOCK_ALERTS;
    return MOCK_ALERTS.filter(
      (alert) =>
        alert.panchayatIds.includes(panchayatId) ||
        alert.panchayatIds.includes('all')
    );
  }
};
