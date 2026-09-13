import { useState, useEffect } from 'react';
import type { Advisory } from '../types';
import { advisoryService } from '../services';

export function useAdvisories(cropId?: string, panchayatId?: string) {
  const [advisories, setAdvisories] = useState<Advisory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    advisoryService.getApprovedAdvisories(cropId, panchayatId).then((data) => {
      setAdvisories(data);
      setLoading(false);
    });
  }, [cropId, panchayatId]);

  return { advisories, loading };
}
