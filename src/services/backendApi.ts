import { apiClient } from './apiClient';
import { API_CONFIG } from '../config/api';
import type { PanchayatLocation } from '../types/common';
import type { CropInfo } from '../types/crop';
import type { DailyForecast, HourlyForecast, CurrentWeather } from '../types/weather';
import type { CropRiskAssessment } from '../types/risk';
import type { AgrometAdvisory } from '../types/advisory';
import type { AdvisoryRule } from '../types/knowledgeBase';
import type { FarmerObservation } from '../types/observation';
import type { WeatherAlert } from '../types/alert';
import type { FeedbackSubmission } from '../types/common';
import type { User } from '../types/auth';

export const backendApi = {
  // Health
  checkHealth: () => apiClient.get<{ status: string; app_name: string; version?: string; database?: string; block?: string; active_panchayats_count?: number }>('/health'),

  // Auth
  login: (username: string, password: string) =>
    apiClient.post<{ access_token: string; user: User }>(API_CONFIG.ENDPOINTS.AUTH_LOGIN, {
      username,
      password,
    }),

  demoLogin: (role: string) =>
    apiClient.post<{ access_token: string; user: User }>(API_CONFIG.ENDPOINTS.AUTH_DEMO_LOGIN, {
      role,
    }),

  getProfile: () => apiClient.get<User>(API_CONFIG.ENDPOINTS.AUTH_ME),

  // Panchayats
  getPanchayats: () =>
    apiClient.get<{ total: number; items: PanchayatLocation[] }>(API_CONFIG.ENDPOINTS.PANCHAYATS),

  getPanchayatBoundariesGeoJSON: () =>
    apiClient.get<any>(API_CONFIG.ENDPOINTS.PANCHAYAT_BOUNDARIES),

  getPanchayatById: (id: string) =>
    apiClient.get<PanchayatLocation>(`${API_CONFIG.ENDPOINTS.PANCHAYATS}/${id}`),

  // Crops
  getCrops: () => apiClient.get<CropInfo[]>(API_CONFIG.ENDPOINTS.CROPS),

  calculateSowingStage: (cropId: string, sowingDate: string, currentDate?: string) =>
    apiClient.post<any>(API_CONFIG.ENDPOINTS.CALCULATE_SOWING, {
      crop_id: cropId,
      sowing_date: sowingDate,
      current_date: currentDate,
    }),

  // Weather & Forecasts
  getCurrentWeather: (panchayatId: string) =>
    apiClient.get<CurrentWeather>(API_CONFIG.ENDPOINTS.WEATHER_CURRENT, { panchayatId }),

  getWeatherStations: () =>
    apiClient.get<any[]>(API_CONFIG.ENDPOINTS.WEATHER_STATIONS),

  getForecasts: (panchayatId: string) =>
    apiClient.get<{
      panchayat_id: string;
      panchayat_name_en: string;
      panchayat_name_hi: string;
      generated_at: string;
      hourly_24h: HourlyForecast[];
      daily_7d: DailyForecast[];
      optimal_spray_hours: string[];
    }>(API_CONFIG.ENDPOINTS.FORECASTS, { panchayatId }),

  // Risk Analytics
  getRiskAssessment: (panchayatId?: string, cropId?: string) =>
    apiClient.get<CropRiskAssessment>(API_CONFIG.ENDPOINTS.RISKS_ASSESSMENT, {
      panchayatId,
      cropId,
    }),

  getRiskMatrix: () => apiClient.get<any[]>(API_CONFIG.ENDPOINTS.RISKS_MATRIX),

  evaluateCropRisk: (input: {
    crop_id: string;
    stage_id?: string;
    forecast_variables: {
      rainfall_mm: number;
      rainfall_rate_mm_hr?: number;
      rain_probability_pct?: number;
      temp_max_c: number;
      temp_min_c: number;
      humidity_pct: number;
      relative_humidity_pct?: number;
      wind_speed_kmh: number;
      wind_gusts_kmh?: number;
      pressure_hpa?: number;
      soil_moisture_pct?: number;
      leaf_wetness_pct?: number;
      consecutive_wet_days?: number;
      consecutive_dry_days?: number;
    };
    forecast_horizon_days?: number;
    confidence_score?: number;
    event_duration_hours?: number;
    panchayat_id?: string;
  }) => apiClient.post<any>(API_CONFIG.ENDPOINTS.RISKS_EVALUATE, input),

  // Advisories (Operational)
  getAdvisories: (panchayatId?: string, cropId?: string) =>
    apiClient.get<AgrometAdvisory[]>(API_CONFIG.ENDPOINTS.ADVISORIES, {
      panchayatId,
      cropId,
    }),

  getAdvisoryById: (id: string) =>
    apiClient.get<AgrometAdvisory>(`${API_CONFIG.ENDPOINTS.ADVISORIES}/${id}`),

  createAdvisory: (data: Partial<AgrometAdvisory>) =>
    apiClient.post<AgrometAdvisory>(API_CONFIG.ENDPOINTS.ADVISORIES, data),

  approveAdvisory: (id: string, status: string, officerName: string) =>
    apiClient.post<AgrometAdvisory>(`${API_CONFIG.ENDPOINTS.ADVISORIES}/${id}/approve`, {
      status,
      officer_name: officerName,
    }),

  voteAdvisory: (id: string, isHelpful: boolean) =>
    apiClient.post<AgrometAdvisory>(`${API_CONFIG.ENDPOINTS.ADVISORIES}/${id}/vote`, {
      is_helpful: isHelpful,
    }),

  // Knowledge Base Advisory Rules
  getRules: (cropId?: string, status?: string) =>
    apiClient.get<AdvisoryRule[]>(API_CONFIG.ENDPOINTS.RULES, {
      cropId,
      status,
    }),

  getRuleById: (id: string) =>
    apiClient.get<AdvisoryRule>(`${API_CONFIG.ENDPOINTS.RULES}/${id}`),

  createRule: (data: Partial<AdvisoryRule>) =>
    apiClient.post<AdvisoryRule>(API_CONFIG.ENDPOINTS.RULES, data),

  updateRule: (id: string, data: Partial<AdvisoryRule>) =>
    apiClient.put<AdvisoryRule>(`${API_CONFIG.ENDPOINTS.RULES}/${id}`, data),

  reviewRule: (id: string, status: string, reviewerName: string, notes?: string) =>
    apiClient.post<AdvisoryRule>(`${API_CONFIG.ENDPOINTS.RULES}/${id}/review`, {
      status,
      reviewer_name: reviewerName,
      review_notes: notes,
    }),

  deleteRule: (id: string) =>
    apiClient.delete<{ success: boolean; message: string }>(`${API_CONFIG.ENDPOINTS.RULES}/${id}`),

  // Observations
  getObservations: (panchayatId?: string, status?: string) =>
    apiClient.get<FarmerObservation[]>(API_CONFIG.ENDPOINTS.OBSERVATIONS, {
      panchayatId,
      status,
    }),

  submitObservation: (data: Partial<FarmerObservation>) =>
    apiClient.post<FarmerObservation>(API_CONFIG.ENDPOINTS.OBSERVATIONS, data),

  verifyObservation: (
    id: string,
    status: string,
    reviewerName: string,
    notesEn?: string,
    notesHi?: string
  ) =>
    apiClient.post<FarmerObservation>(`${API_CONFIG.ENDPOINTS.OBSERVATIONS}/${id}/verify`, {
      status,
      reviewer_name: reviewerName,
      notes_en: notesEn,
      notes_hi: notesHi,
    }),

  // Alerts
  getAlerts: (activeOnly: boolean = false) =>
    apiClient.get<WeatherAlert[]>(API_CONFIG.ENDPOINTS.ALERTS, { activeOnly }),

  broadcastAlert: (data: Partial<WeatherAlert>) =>
    apiClient.post<WeatherAlert>(`${API_CONFIG.ENDPOINTS.ALERTS}/broadcast`, data),

  toggleAlert: (id: string) =>
    apiClient.post<WeatherAlert>(`${API_CONFIG.ENDPOINTS.ALERTS}/${id}/toggle`),

  // Feedback
  getFeedbacks: () =>
    apiClient.get<FeedbackSubmission[]>(API_CONFIG.ENDPOINTS.FEEDBACK),

  submitFeedback: (data: Partial<FeedbackSubmission>) =>
    apiClient.post<FeedbackSubmission>(API_CONFIG.ENDPOINTS.FEEDBACK, data),

  getFeedbackStats: () =>
    apiClient.get<any>(API_CONFIG.ENDPOINTS.FEEDBACK_STATS),

  // Audit Logs & Analytics
  getAuditLogs: () =>
    apiClient.get<any[]>('/audit-logs').catch(() => []),

  getTelemetryHealth: () =>
    apiClient.get<any>(API_CONFIG.ENDPOINTS.ANALYTICS_HEALTH),

  // Phase 7: Weather Data Ingestion Pipeline
  triggerWeatherIngestion: (panchayatId?: string, forceRefresh: boolean = true, dryRun: boolean = false) =>
    apiClient.post<any>(API_CONFIG.ENDPOINTS.WEATHER_PIPELINE_INGEST, {
      panchayat_id: panchayatId,
      force_refresh: forceRefresh,
      dry_run: dryRun,
    }),

  getPipelineStatus: () =>
    apiClient.get<any>(API_CONFIG.ENDPOINTS.WEATHER_PIPELINE_STATUS),

  getPipelineQualityReport: () =>
    apiClient.get<any>(API_CONFIG.ENDPOINTS.WEATHER_PIPELINE_QUALITY_REPORT),

  getNormalizedRecords: (panchayatId?: string, limit: number = 24) =>
    apiClient.get<any[]>(`${API_CONFIG.ENDPOINTS.WEATHER_PIPELINE_STATUS.replace('/status', '/normalized-records')}`, {
      panchayatId,
      limit,
    }),

  // Phase 8: Machine Learning Forecasting Pipeline
  trainMLModels: (versionTag: string = 'v1.0.0', forceRetrain: boolean = false) =>
    apiClient.post<any>(API_CONFIG.ENDPOINTS.ML_TRAIN, {
      version_tag: versionTag,
      force_retrain: forceRetrain,
    }),

  getMLComparisonMatrix: (version: string = 'v1.0.0') =>
    apiClient.get<any>(API_CONFIG.ENDPOINTS.ML_COMPARE, { version }),

  getMLModels: (version?: string) =>
    apiClient.get<any[]>(API_CONFIG.ENDPOINTS.ML_MODELS, { version }),

  getMLForecast: (panchayatId: string = 'panchayat_acharpura') =>
    apiClient.get<any>(API_CONFIG.ENDPOINTS.ML_FORECAST, { panchayatId }),

  // Phase 10: Research Analytics Dashboard
  getResearchAnalytics: (version: string = 'v1.0.0') =>
    apiClient.get<any>(API_CONFIG.ENDPOINTS.ANALYTICS_RESEARCH, { version }),
};
