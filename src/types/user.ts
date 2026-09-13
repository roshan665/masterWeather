import type { Language, UserRole } from './common';

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  designationEn: string;
  designationHi: string;
  departmentEn: string;
  departmentHi: string;
  preferredLanguage: Language;
  assignedPanchayats: string[];
  phoneNumber: string;
  avatarUrl?: string;
}
