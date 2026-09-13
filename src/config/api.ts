/**
 * PanchayatMausam AI API Configuration
 * 
 * Single Configuration Setting to switch between Mock Services and Live FastAPI Backend:
 * - Controlled by environment variable `VITE_USE_BACKEND_API=true`
 * - Or dynamically toggled via `localStorage.getItem('panchayatmausam_use_backend') === 'true'`
 */

export const API_CONFIG = {
  // Base URL for FastAPI Backend
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1',
  
  // Single setting to switch between Mock data and Live Backend
  get USE_BACKEND_API(): boolean {
    const envVal = import.meta.env.VITE_USE_BACKEND_API;
    const localVal = typeof window !== 'undefined' ? localStorage.getItem('panchayatmausam_use_backend') : null;
    
    if (localVal !== null) {
      return localVal === 'true';
    }
    return envVal === 'true';
  },

  set USE_BACKEND_API(enabled: boolean) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('panchayatmausam_use_backend', enabled ? 'true' : 'false');
    }
  },

  ENDPOINTS: {
    AUTH_LOGIN: '/auth/login',
    AUTH_DEMO_LOGIN: '/auth/demo-login',
    AUTH_ME: '/auth/me',
    PANCHAYATS: '/panchayats',
    PANCHAYAT_BOUNDARIES: '/panchayats/boundaries/geojson',
    CROPS: '/crops',
    CALCULATE_SOWING: '/crops/calculate-sowing-stage',
    WEATHER_CURRENT: '/weather/current',
    WEATHER_STATIONS: '/weather/stations',
    FORECASTS: '/forecasts',
    RISKS_ASSESSMENT: '/risks/assessment',
    RISKS_MATRIX: '/risks/matrix',
    RISKS_EVALUATE: '/risks/evaluate',
    ADVISORIES: '/advisories',
    RULES: '/rules',
    OBSERVATIONS: '/observations',
    ALERTS: '/alerts',
    FEEDBACK: '/feedback',
    FEEDBACK_STATS: '/feedback/stats',
    ANALYTICS_HEALTH: '/analytics/telemetry-health',
    ANALYTICS_RESEARCH: '/analytics/research',
    WEATHER_PIPELINE_STATUS: '/weather/pipeline/status',
    WEATHER_PIPELINE_INGEST: '/weather/pipeline/ingest',
    WEATHER_PIPELINE_QUALITY_REPORT: '/weather/pipeline/quality-report',
    ML_TRAIN: '/ml/train',
    ML_COMPARE: '/ml/compare',
    ML_MODELS: '/ml/models',
    ML_FORECAST: '/ml/forecast',
  },
};

export const isBackendApiEnabled = () => API_CONFIG.USE_BACKEND_API;
export const setBackendApiEnabled = (enabled: boolean) => {
  API_CONFIG.USE_BACKEND_API = enabled;
};
