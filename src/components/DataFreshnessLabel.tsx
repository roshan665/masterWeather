import React from 'react';
import { Clock, Database } from 'lucide-react';
import { useTranslation } from '../i18n/useTranslation';

export interface DataFreshnessLabelProps {
  minutesAgo?: number;
  awsStationId?: string;
  isDemo?: boolean;
  className?: string;
}

export const DataFreshnessLabel: React.FC<DataFreshnessLabelProps> = ({
  minutesAgo = 10,
  awsStationId,
  isDemo = true,
  className = ''
}) => {
  const { language } = useTranslation();

  return (
    <div className={`inline-flex flex-wrap items-center gap-2 text-[11px] font-medium text-slate-400 ${className}`}>
      <span className="inline-flex items-center gap-1 bg-slate-800/80 px-2 py-0.5 rounded-md border border-slate-700/50">
        <Clock className="w-3 h-3 text-emerald-400 animate-pulse" />
        <span>
          {language === 'hi'
            ? `${minutesAgo} मिनट पहले अपडेट`
            : `Updated ${minutesAgo}m ago`}
        </span>
      </span>

      {awsStationId && (
        <span className="inline-flex items-center gap-1 bg-slate-800/80 px-2 py-0.5 rounded-md border border-slate-700/50 text-slate-300">
          <Database className="w-3 h-3 text-sky-400" />
          <span>{awsStationId}</span>
        </span>
      )}

      {isDemo && (
        <span className="inline-flex items-center gap-1 bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-md font-semibold tracking-wider uppercase text-[10px]">
          Demo Data
        </span>
      )}
    </div>
  );
};
