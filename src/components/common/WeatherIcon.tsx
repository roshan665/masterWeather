import React from 'react';
import type { WeatherCondition } from '../../types/weather';
import {
  Sun,
  CloudSun,
  Cloud,
  CloudRain,
  CloudLightning,
  CloudDrizzle,
  CloudFog,
} from 'lucide-react';

interface WeatherIconProps {
  condition: WeatherCondition;
  size?: number;
  className?: string;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({
  condition,
  size = 24,
  className = '',
}) => {
  switch (condition) {
    case 'clear':
      return <Sun size={size} className={`text-amber-500 animate-spin-slow ${className}`} />;
    case 'partly-cloudy':
      return <CloudSun size={size} className={`text-amber-400 ${className}`} />;
    case 'cloudy':
      return <Cloud size={size} className={`text-slate-400 ${className}`} />;
    case 'light-rain':
      return <CloudDrizzle size={size} className={`text-sky-500 ${className}`} />;
    case 'heavy-rain':
      return <CloudRain size={size} className={`text-blue-600 ${className}`} />;
    case 'thunderstorm':
      return <CloudLightning size={size} className={`text-purple-600 ${className}`} />;
    case 'drizzle':
      return <CloudDrizzle size={size} className={`text-sky-400 ${className}`} />;
    case 'fog':
    case 'haze':
      return <CloudFog size={size} className={`text-slate-400 ${className}`} />;
    default:
      return <Sun size={size} className={`text-amber-500 ${className}`} />;
  }
};
