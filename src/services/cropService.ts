import type { CropInfo, CropGrowthStage, CropId } from '../types';
import { CROPS } from '../mock';

export const cropService = {
  async getCrops(): Promise<CropInfo[]> {
    await new Promise((r) => setTimeout(r, 50));
    return CROPS;
  },

  async getCropById(cropId: CropId): Promise<CropInfo | undefined> {
    await new Promise((r) => setTimeout(r, 50));
    return CROPS.find((c) => c.id === cropId);
  },

  calculateCurrentStage(crop: CropInfo, sowingDate: string): { currentStage: CropGrowthStage; daysElapsed: number; progressPercent: number } {
    const sowing = new Date(sowingDate);
    const now = new Date('2026-09-12');
    const diffTime = Math.max(0, now.getTime() - sowing.getTime());
    const daysElapsed = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    let accumulatedDays = 0;
    let currentStage = crop.stages[0];

    for (const stage of crop.stages) {
      accumulatedDays += stage.typicalDurationDays;
      if (daysElapsed <= accumulatedDays) {
        currentStage = stage;
        break;
      }
      currentStage = stage;
    }

    const progressPercent = Math.min(100, Math.round((daysElapsed / crop.totalDurationDays) * 100));

    return {
      currentStage,
      daysElapsed,
      progressPercent
    };
  }
};
