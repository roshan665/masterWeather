import { useState, useEffect } from 'react';
import type { CurrentWeather, ForecastDay, SprayWindowHour } from '../types';
import { weatherService } from '../services';

export function useWeather(panchayatId: string) {
  const [current, setCurrent] = useState<CurrentWeather | null>(null);
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [sprayWindows, setSprayWindows] = useState<SprayWindowHour[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    Promise.all([
      weatherService.getCurrentWeather(panchayatId),
      weatherService.get7DayForecast(panchayatId),
      weatherService.getSprayWindows(panchayatId)
    ])
      .then(([curData, forecastData, sprayData]) => {
        if (isMounted) {
          setCurrent(curData);
          setForecast(forecastData);
          setSprayWindows(sprayData);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message || 'Failed to fetch weather data');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [panchayatId]);

  return { current, forecast, sprayWindows, loading, error };
}
