import { useState, useEffect } from 'react';
import type { WeatherAlert } from '../types';
import { alertService } from '../services';

export function useAlerts(panchayatId?: string) {
  const [alerts, setAlerts] = useState<WeatherAlert[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    alertService.getActiveAlerts(panchayatId).then((data) => {
      setAlerts(data);
      setLoading(false);
    });
  }, [panchayatId]);

  return { alerts, loading };
}
