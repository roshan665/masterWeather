import type { User, Permission } from '../types/auth';
import type { UserRole } from '../types/common';

const FARMER_PERMISSIONS: Permission[] = [
  'view_farmer_dashboard',
  'submit_observation',
];

const OFFICER_PERMISSIONS: Permission[] = [
  'view_farmer_dashboard',
  'submit_observation',
  'manage_advisories',
  'approve_advisories',
  'broadcast_alerts',
];

const ADMIN_PERMISSIONS: Permission[] = [
  'view_farmer_dashboard',
  'submit_observation',
  'manage_advisories',
  'approve_advisories',
  'broadcast_alerts',
  'manage_users',
  'edit_rules',
  'view_telemetry_audit',
];

const RESEARCHER_PERMISSIONS: Permission[] = [
  'view_farmer_dashboard',
  'run_models',
  'calibrate_benchmarks',
  'view_telemetry_audit',
];

export const DEMO_USERS: User[] = [
  {
    id: 'usr_farmer_01',
    username: 'farmer',
    nameEn: 'Rameshwar Patidar',
    nameHi: 'रामेश्वर पाटीदार',
    role: 'farmer',
    email: 'rameshwar.patidar@kisan.mp.gov.in',
    phone: '+91 98260 12345',
    panchayatId: 'acharpura',
    panchayatNameEn: 'Acharpura',
    panchayatNameHi: 'आचारपुरा',
    villageNameEn: 'Acharpura Kalan',
    villageNameHi: 'आचारपुरा कलां',
    designationEn: 'Progressive Farmer (Soybean & Wheat)',
    designationHi: 'प्रगतिशील कृषक (सोयाबीन एवं गेहूं)',
    organizationEn: 'Phanda Farmers Collective',
    organizationHi: 'फंदा कृषक समूह',
    permissions: FARMER_PERMISSIONS,
    token: 'mock_jwt_token_farmer_phanda_2026',
    lastLoginAt: '2026-09-13T07:30:00+05:30',
  },
  {
    id: 'usr_officer_01',
    username: 'officer',
    nameEn: 'Dr. R. K. Sharma',
    nameHi: 'डॉ. आर. के. शर्मा',
    role: 'officer',
    email: 'rk.sharma@agri.mp.gov.in',
    phone: '+91 94250 87654',
    panchayatId: 'acharpura',
    panchayatNameEn: 'Acharpura (Phanda Command HQ)',
    panchayatNameHi: 'आचारपुरा (फंदा कमांड मुख्यालय)',
    designationEn: 'Senior Agricultural Extension Officer',
    designationHi: 'वरिष्ठ कृषि विस्तार अधिकारी (RAEO Phanda)',
    organizationEn: 'Directorate of Farmer Welfare & Agriculture, MP',
    organizationHi: 'किसान कल्याण एवं कृषि विकास संचालनालय, म.प्र.',
    permissions: OFFICER_PERMISSIONS,
    token: 'mock_jwt_token_officer_phanda_2026',
    lastLoginAt: '2026-09-13T07:45:00+05:30',
  },
  {
    id: 'usr_admin_01',
    username: 'admin',
    nameEn: 'Anand Verma',
    nameHi: 'आनंद वर्मा',
    role: 'admin',
    email: 'anand.verma@nic.mp.gov.in',
    phone: '+91 98930 54321',
    designationEn: 'District Agromet Systems Administrator',
    designationHi: 'जिला कृषि मौसम प्रणाली प्रशासक',
    organizationEn: 'Bhopal District E-Governance & NIC Portal',
    organizationHi: 'भोपाल जिला ई-गवर्नेंस एवं एनआईसी पोर्टल',
    permissions: ADMIN_PERMISSIONS,
    token: 'mock_jwt_token_admin_phanda_2026',
    lastLoginAt: '2026-09-13T07:15:00+05:30',
  },
  {
    id: 'usr_researcher_01',
    username: 'researcher',
    nameEn: 'Dr. Neha Deshmukh',
    nameHi: 'डॉ. नेहा देशमुख',
    role: 'researcher',
    email: 'neha.deshmukh@icar.res.in',
    phone: '+91 97550 99887',
    designationEn: 'Principal Agrometeorologist & Modeler',
    designationHi: 'प्रधान कृषि मौसम वैज्ञानिक एवं मॉडलर',
    organizationEn: 'ICAR-CIAE / JNKVV Research Affiliate',
    organizationHi: 'भाकृअनुप-सीआईएई / जेएनकेवीवी संबद्ध अनुसंधान',
    permissions: RESEARCHER_PERMISSIONS,
    token: 'mock_jwt_token_researcher_phanda_2026',
    lastLoginAt: '2026-09-13T06:50:00+05:30',
  },
];

export const getDemoUserByRole = (role: UserRole): User => {
  const found = DEMO_USERS.find((u) => u.role === role);
  return found || DEMO_USERS[0];
};

export const getDemoUserById = (id: string): User | undefined => {
  return DEMO_USERS.find((u) => u.id === id);
};

export const getDemoUserByUsername = (username: string): User | undefined => {
  return DEMO_USERS.find((u) => u.username.toLowerCase() === username.toLowerCase());
};
