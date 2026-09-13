import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useApp } from './AppContext';
import { fetchRealtimeWeather, type LiveWeatherData } from '../services/openMeteoService';
import type { CurrentWeather, DailyForecast, HourlyForecast } from '../types/weather';
import { MOCK_CURRENT_WEATHER, getForecastForPanchayat } from '../data/mockWeather';

export interface LiveWeatherContextType {
  weather: CurrentWeather;
  hourly24h: HourlyForecast[];
  daily7d: DailyForecast[];
  daily15d: DailyForecast[];
  isLoading: boolean;
  isRefreshing: boolean;
  isLive: boolean;
  lastUpdated: Date;
  refreshWeather: () => Promise<void>;
  error: string | null;
}

const LiveWeatherContext = createContext<LiveWeatherContextType | undefined>(undefined);

export const LiveWeatherProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { activePanchayat } = useApp();

  const initialCurrent = MOCK_CURRENT_WEATHER[activePanchayat?.id] || MOCK_CURRENT_WEATHER['acharpura'];
  const initialForecast = getForecastForPanchayat(activePanchayat?.id || 'acharpura');

  const [weather, setWeather] = useState<CurrentWeather>(initialCurrent);
  const [hourly24h, setHourly24h] = useState<HourlyForecast[]>(initialForecast.hourlyNext24h);
  const [daily7d, setDaily7d] = useState<DailyForecast[]>(initialForecast.daily1to3d.concat(initialForecast.daily4to7d));
  const [daily15d, setDaily15d] = useState<DailyForecast[]>(initialForecast.daily1to3d.concat(initialForecast.daily4to7d));
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isLive, setIsLive] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [error, setError] = useState<string | null>(null);

  const loadWeather = useCallback(async (isManualRefresh = false) => {
    if (!activePanchayat) return;

    if (isManualRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setError(null);

    try {
      const liveData: LiveWeatherData = await fetchRealtimeWeather(activePanchayat);
      setWeather(liveData.current);
      setHourly24h(liveData.hourlyNext24h);
      setDaily7d(liveData.daily7d);
      setDaily15d(liveData.daily15d);
      setIsLive(liveData.isRealtime);
      setLastUpdated(new Date());
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch live weather');
      setIsLive(false);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [activePanchayat]);

  // Re-fetch when active Panchayat changes
  useEffect(() => {
    loadWeather(false);
  }, [loadWeather]);

  // Periodic real-time background sync (every 5 minutes)
  useEffect(() => {
    const interval = setInterval(() => {
      loadWeather(false);
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [loadWeather]);

  const refreshWeather = async () => {
    await loadWeather(true);
  };

  return (
    <LiveWeatherContext.Provider
      value={{
        weather,
        hourly24h,
        daily7d,
        daily15d,
        isLoading,
        isRefreshing,
        isLive,
        lastUpdated,
        refreshWeather,
        error
      }}
    >
      {children}
    </LiveWeatherContext.Provider>
  );
};

export function useLiveWeather(): LiveWeatherContextType {
  const context = useContext(LiveWeatherContext);
  if (!context) {
    throw new Error('useLiveWeather must be used within a LiveWeatherProvider');
  }
  return context;
}
