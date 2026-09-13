/**
 * DEMO OFFICER REVIEW ITEMS
 * Items requiring agronomist review, moderation, or field dispatch.
 */

export interface OfficerReviewItem {
  id: string;
  type: 'advisory_approval' | 'farmer_observation_verification' | 'anomaly_alert';
  title: string;
  titleHi: string;
  panchayatId: string;
  cropId?: string;
  source: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'in_review' | 'resolved';
  submittedAt: string;
  payload: Record<string, unknown>;
  isDemoData: boolean;
}

export const MOCK_REVIEW_ITEMS: OfficerReviewItem[] = [
  {
    id: 'rev-001',
    type: 'advisory_approval',
    title: 'AI Draft: High Canopy Wetness & Anthracnose Warning for Samasgarh',
    titleHi: 'एआई प्रारूप: समसगढ़ हेतु एंथ्रेक्नोज़ रोग चेतावनी समीक्षा',
    panchayatId: 'samasgarh',
    cropId: 'soybean',
    source: 'Agromet Rules Engine v2.4',
    severity: 'high',
    status: 'pending',
    submittedAt: '2026-09-12T12:00:00+05:30',
    payload: {
      advisoryId: 'adv-005',
      trigger: 'Leaf Wetness > 12h, RH 86%'
    },
    isDemoData: true
  },
  {
    id: 'rev-002',
    type: 'farmer_observation_verification',
    title: 'Field Report: Severe Waterlogging in Ratibad (Kailash Meena)',
    titleHi: 'फील्ड रिपोर्ट: रातीबड़ में गंभीर जलभराव (कैलाश मीणा)',
    panchayatId: 'ratibad',
    cropId: 'soybean',
    source: 'Farmer Ground Report (obs-002)',
    severity: 'medium',
    status: 'pending',
    submittedAt: '2026-09-12T09:30:00+05:30',
    payload: {
      observationId: 'obs-002',
      reportedDepth: '1 foot'
    },
    isDemoData: true
  },
  {
    id: 'rev-003',
    type: 'anomaly_alert',
    title: 'AWS Telemetry Node AWS-BPL-SMG-04 Sensor Drift Check',
    titleHi: 'समसगढ़ एडब्ल्यूएस स्टेशन सेंसर विचलन जांच',
    panchayatId: 'samasgarh',
    source: 'Telemetry Data Quality Sentinel',
    severity: 'low',
    status: 'in_review',
    submittedAt: '2026-09-12T07:00:00+05:30',
    payload: {
      sensor: 'Soil Moisture 20cm',
      qualityFlag: 'warning_spike'
    },
    isDemoData: true
  }
];
