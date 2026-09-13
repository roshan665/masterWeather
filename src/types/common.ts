export type Language = 'hi' | 'en';

export type UserRole = 'farmer' | 'officer' | 'admin' | 'researcher';

export type ConfidenceLevel = 'high' | 'medium' | 'low';

export type RiskLevel = 'normal' | 'advisory' | 'warning' | 'critical';

export interface PanchayatLocation {
  id: string;
  nameEn: string;
  nameHi: string;
  block: string;
  district: string;
  state: string;
  latitude: number;
  longitude: number;
  elevationM: number;
  populationApprox: number;
  villages: string[];
  primarySoilType: string;
  weatherStationId: string;
  weatherStationName: string;
  stationStatus: 'active' | 'degraded' | 'fallback';
}

export interface FeedbackSubmission {
  id: string;
  advisoryId: string;
  panchayatId: string;
  cropId: string;
  isHelpful: boolean;
  rating: number; // 1 to 5
  feedbackCategory: 'accuracy' | 'timeliness' | 'clarity' | 'actionability' | 'other';
  comment: string;
  farmerName?: string;
  submittedAt: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  targetEntity: string;
  targetId: string;
  details: string;
  status: 'success' | 'warning' | 'error';
}
