import React from 'react';
import type { RiskLevel } from '../../types/common';
import { ShieldCheck, AlertCircle, AlertTriangle, Flame } from 'lucide-react';

interface RiskBadgeProps {
  level: RiskLevel;
  score?: number;
  language?: 'hi' | 'en';
  size?: 'sm' | 'md' | 'lg';
  showScore?: boolean;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({
  level,
  score,
  language = 'hi',
  size = 'md',
  showScore = true,
}) => {
  const getBadgeConfig = () => {
    switch (level) {
      case 'normal':
        return {
          bg: 'bg-emerald-50 border-emerald-200 text-emerald-800',
          dot: 'bg-emerald-500',
          icon: ShieldCheck,
          textEn: 'Normal',
          textHi: 'सामान्य',
          range: '0-24',
        };
      case 'advisory':
        return {
          bg: 'bg-amber-50 border-amber-200 text-amber-800',
          dot: 'bg-amber-500',
          icon: AlertCircle,
          textEn: 'Advisory',
          textHi: 'सलाह स्तर',
          range: '25-49',
        };
      case 'warning':
        return {
          bg: 'bg-orange-50 border-orange-200 text-orange-800',
          dot: 'bg-orange-500',
          icon: AlertTriangle,
          textEn: 'Warning',
          textHi: 'चेतावनी',
          range: '50-74',
        };
      case 'critical':
        return {
          bg: 'bg-red-50 border-red-200 text-red-800 animate-pulse',
          dot: 'bg-red-500',
          icon: Flame,
          textEn: 'Critical Risk',
          textHi: 'गंभीर जोखिम',
          range: '75-100',
        };
    }
  };

  const config = getBadgeConfig();
  const Icon = config.icon;

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-2.5 py-1 text-xs md:text-sm gap-1.5 font-medium',
    lg: 'px-3.5 py-1.5 text-sm md:text-base gap-2 font-semibold',
  };

  const iconSizes = {
    sm: 12,
    md: 15,
    lg: 18,
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border ${config.bg} ${sizeStyles[size]} transition-all shadow-xs`}
    >
      <Icon size={iconSizes[size]} className="shrink-0" />
      <span>{language === 'hi' ? config.textHi : config.textEn}</span>
      {showScore && score !== undefined && (
        <span className="font-bold opacity-90">({score}/100)</span>
      )}
    </span>
  );
};
