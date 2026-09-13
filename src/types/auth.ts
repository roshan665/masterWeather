import type { UserRole } from './common';

export type Permission =
  | 'view_farmer_dashboard'
  | 'submit_observation'
  | 'manage_advisories'
  | 'approve_advisories'
  | 'broadcast_alerts'
  | 'manage_users'
  | 'edit_rules'
  | 'view_telemetry_audit'
  | 'run_models'
  | 'calibrate_benchmarks';

export interface User {
  id: string;
  username: string;
  nameEn: string;
  nameHi: string;
  role: UserRole;
  email: string;
  phone?: string;
  avatarUrl?: string;
  panchayatId?: string;
  panchayatNameEn?: string;
  panchayatNameHi?: string;
  villageNameEn?: string;
  villageNameHi?: string;
  designationEn?: string;
  designationHi?: string;
  organizationEn?: string;
  organizationHi?: string;
  permissions: Permission[];
  token?: string;
  lastLoginAt?: string;
}

export interface AuthCredentials {
  username: string;
  password?: string;
  rememberMe?: boolean;
}

export interface AuthContextType {
  user: User | null;
  role: UserRole;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: AuthCredentials) => Promise<{ success: boolean; error?: string }>;
  loginAsDemoUser: (role: UserRole) => void;
  logout: () => void;
  hasPermission: (permission: Permission) => boolean;
  hasRole: (roles: UserRole | UserRole[]) => boolean;
  switchDemoUser: (userId: string) => void;
}
