import type { ConfidenceLevel } from './common';

export type WeatherCondition =
  | 'clear'
  | 'partly-cloudy'
  | 'cloudy'
  | 'light-rain'
  | 'heavy-rain'
  | 'thunderstorm'
  | 'drizzle'
  | 'fog'
  | 'haze';

export type DataSourceType =
  | 'aws_ground_sensor'
  | 'gridded_numerical_estimate'
  | 'satellite_radar_composite'
  | 'historical_climatology_fallback';

export interface CurrentWeather {
  panchayatId: string;
  timestamp: string;
  tempC: number;
  feelsLikeC: number;
  tempMaxC: number;
  tempMinC: number;
  relativeHumidityPct: number;
  rainfallMm24h: number;
  rainfallRateMmH: number;
  windSpeedKmh: number;
  windDirectionDeg: number;
  windDirectionCompass: string;
  solarRadiationWm2: number;
  et0MmDay: number;
  dewPointC: number;
  uvIndex: number;
  pressureHpa: number;
  condition: WeatherCondition;
  conditionTextEn: string;
  conditionTextHi: string;
  dataSource: DataSourceType;
  dataSourceLabelEn: string;
  dataSourceLabelHi: string;
  confidence: ConfidenceLevel;
  isFallback: boolean;
  fallbackReason?: string;
}

export interface HourlyForecast {
  time: string;
  isoTimestamp: string;
  tempC: number;
  rainfallMm: number;
  popPct: number;
  relativeHumidityPct: number;
  windSpeedKmh: number;
  condition: WeatherCondition;
  conditionTextEn: string;
  conditionTextHi: string;
  spraySuitability: 'optimal' | 'marginal' | 'unfavourable';
  spraySuitabilityReasonEn: string;
  spraySuitabilityReasonHi: string;
}

export interface DailyForecast {
  date: string;
  dayNameEn: string;
  dayNameHi: string;
  tempMaxC: number;
  tempMinC: number;
  rainfallExpectedMm: number;
  popPct: number;
  relativeHumidityPct: number;
  windSpeedMaxKmh: number;
  condition: WeatherCondition;
  conditionTextEn: string;
  conditionTextHi: string;
  confidence: ConfidenceLevel;
  summaryEn: string;
  summaryHi: string;
}

export interface WeatherForecastCollection {
  panchayatId: string;
  generatedAt: string;
  hourlyNext24h: HourlyForecast[];
  daily1to3d: DailyForecast[];
  daily4to7d: DailyForecast[];
}
