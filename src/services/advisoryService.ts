import type { AgrometAdvisory, CropId } from '../types';
import { MOCK_ADVISORIES } from '../mock';

export const advisoryService = {
  async getApprovedAdvisories(cropId?: CropId | string, panchayatId?: string): Promise<AgrometAdvisory[]> {
    await new Promise((r) => setTimeout(r, 80));
    return MOCK_ADVISORIES.filter((adv) => {
      const isApproved = adv.approvalStatus === 'approved';
      const matchesCrop = !cropId || adv.cropId === cropId;
      const matchesPanchayat = !panchayatId || adv.panchayatId === panchayatId;
      return isApproved && matchesCrop && matchesPanchayat;
    });
  },

  async getPendingReviewAdvisories(): Promise<AgrometAdvisory[]> {
    await new Promise((r) => setTimeout(r, 60));
    return MOCK_ADVISORIES.filter((adv) => adv.approvalStatus === 'pending_review');
  },

  async approveAdvisory(advisoryId: string, officerName: string): Promise<boolean> {
    const adv = MOCK_ADVISORIES.find((a) => a.id === advisoryId);
    if (adv) {
      adv.approvalStatus = 'approved';
      adv.approvedBy = officerName;
      adv.approvedAt = new Date().toISOString();
      return true;
    }
    return false;
  },

  async voteFeedback(advisoryId: string, isHelpful: boolean): Promise<{ helpful: number; unhelpful: number }> {
    const adv = MOCK_ADVISORIES.find((a) => a.id === advisoryId);
    if (adv) {
      if (isHelpful) {
        adv.helpfulCount = (adv.helpfulCount || 0) + 1;
      } else {
        adv.unhelpfulCount = (adv.unhelpfulCount || 0) + 1;
      }
      return { helpful: adv.helpfulCount, unhelpful: adv.unhelpfulCount };
    }
    return { helpful: 0, unhelpful: 0 };
  }
};
