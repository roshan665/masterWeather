import type { CurrentWeather, ForecastDay, SprayWindowHour } from '../types';
import { PANCHAYATS } from '../data/panchayats';
import { fetchRealtimeWeather } from './openMeteoService';
import { MOCK_CURRENT_WEATHER, MOCK_FORECASTS_7DAY, MOCK_HOURLY_SPRAY_WINDOWS } from '../mock';

export const weatherService = {
  async getCurrentWeather(panchayatId: string): Promise<CurrentWeather> {
    const panchayat = PANCHAYATS.find((p) => p.id === panchayatId) || PANCHAYATS[0];
    try {
      const live = await fetchRealtimeWeather(panchayat);
      return live.current;
    } catch {
      return MOCK_CURRENT_WEATHER[panchayatId] || MOCK_CURRENT_WEATHER['acharpura'];
    }
  },

  async get7DayForecast(panchayatId: string): Promise<ForecastDay[]> {
    const panchayat = PANCHAYATS.find((p) => p.id === panchayatId) || PANCHAYATS[0];
    try {
      const live = await fetchRealtimeWeather(panchayat);
      return live.daily7d;
    } catch {
      return MOCK_FORECASTS_7DAY[panchayatId] || MOCK_FORECASTS_7DAY['acharpura'];
    }
  },

  async getSprayWindows(panchayatId: string): Promise<SprayWindowHour[]> {
    const panchayat = PANCHAYATS.find((p) => p.id === panchayatId) || PANCHAYATS[0];
    try {
      const live = await fetchRealtimeWeather(panchayat);
      return live.hourlyNext24h;
    } catch {
      return MOCK_HOURLY_SPRAY_WINDOWS;
    }
  }
};
