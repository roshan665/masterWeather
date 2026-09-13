import type { CurrentWeather, ForecastDay, SprayWindowHour } from '../types';
import { MOCK_CURRENT_WEATHER, MOCK_FORECASTS_7DAY, MOCK_HOURLY_SPRAY_WINDOWS } from '../mock';

export const weatherService = {
  async getCurrentWeather(panchayatId: string): Promise<CurrentWeather> {
    await new Promise((r) => setTimeout(r, 80));
    return MOCK_CURRENT_WEATHER[panchayatId] || MOCK_CURRENT_WEATHER['acharpura'];
  },

  async get7DayForecast(panchayatId: string): Promise<ForecastDay[]> {
    await new Promise((r) => setTimeout(r, 100));
    return MOCK_FORECASTS_7DAY[panchayatId] || MOCK_FORECASTS_7DAY['acharpura'];
  },

  async getSprayWindows(_panchayatId: string): Promise<SprayWindowHour[]> {
    await new Promise((r) => setTimeout(r, 60));
    return MOCK_HOURLY_SPRAY_WINDOWS;
  }
};
