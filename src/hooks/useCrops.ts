import { useState, useEffect } from 'react';
import type { Crop, CropStage } from '../types';
import { cropService } from '../services';

export function useCrops(selectedCropId: string, sowingDate: string) {
  const [crops, setCrops] = useState<Crop[]>([]);
  const [selectedCrop, setSelectedCrop] = useState<Crop | null>(null);
  const [stageInfo, setStageInfo] = useState<{ currentStage: CropStage; daysElapsed: number; progressPercent: number } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    cropService.getCrops().then((data) => {
      setCrops(data);
      const active = data.find((c) => c.id === selectedCropId) || data[0];
      setSelectedCrop(active);
      if (active) {
        setStageInfo(cropService.calculateCurrentStage(active, sowingDate));
      }
      setLoading(false);
    });
  }, [selectedCropId, sowingDate]);

  return { crops, selectedCrop, stageInfo, loading };
}
