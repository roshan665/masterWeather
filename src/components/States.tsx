import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { Inbox, AlertTriangle, RefreshCw } from 'lucide-react';
import { useTranslation } from '../i18n/useTranslation';

export interface EmptyStateProps {
  title?: string;
  titleHi?: string;
  description?: string;
  descriptionHi?: string;
  icon?: LucideIcon;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No records found',
  titleHi = 'कोई जानकारी उपलब्ध नहीं है',
  description = 'There is currently no data to display for this selection.',
  descriptionHi = 'वर्तमान में इस चयन के लिए कोई डेटा उपलब्ध नहीं है।',
  icon: Icon = Inbox,
  actionLabel,
  onAction,
  className = ''
}) => {
  const { language } = useTranslation();

  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center bg-slate-900/50 rounded-2xl border border-slate-800/80 ${className}`}>
      <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-400 mb-4 border border-slate-700/50">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-base font-semibold text-slate-200 mb-1">
        {language === 'hi' ? titleHi : title}
      </h3>
      <p className="text-sm text-slate-400 max-w-sm mb-4">
        {language === 'hi' ? descriptionHi : description}
      </p>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-emerald-900/30 transition-all"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export interface LoadingStateProps {
  message?: string;
  messageHi?: string;
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading agromet data...',
  messageHi = 'कृषि मौसम डेटा लोड हो रहा है...',
  className = ''
}) => {
  const { language } = useTranslation();

  return (
    <div className={`flex flex-col items-center justify-center p-8 space-y-3 ${className}`}>
      <div className="relative">
        <div className="w-10 h-10 border-3 border-emerald-500/20 border-t-emerald-400 rounded-full animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
        </div>
      </div>
      <p className="text-xs font-medium text-slate-400 animate-pulse">
        {language === 'hi' ? messageHi : message}
      </p>
    </div>
  );
};

export interface ErrorStateProps {
  title?: string;
  titleHi?: string;
  message?: string;
  messageHi?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Unable to fetch data',
  titleHi = 'डेटा लोड करने में असमर्थ',
  message = 'Please check your connection or try again shortly.',
  messageHi = 'कृपया अपना इंटरनेट कनेक्शन जांचें या पुनः प्रयास करें।',
  onRetry,
  className = ''
}) => {
  const { language } = useTranslation();

  return (
    <div className={`flex flex-col items-center justify-center p-6 text-center bg-rose-950/20 border border-rose-500/30 rounded-2xl ${className}`}>
      <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center mb-3">
        <AlertTriangle className="w-5 h-5" />
      </div>
      <h3 className="text-sm font-semibold text-rose-200 mb-1">
        {language === 'hi' ? titleHi : title}
      </h3>
      <p className="text-xs text-rose-300/80 mb-4 max-w-xs">
        {language === 'hi' ? messageHi : message}
      </p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-rose-600/80 hover:bg-rose-500 text-white rounded-lg text-xs font-medium transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>{language === 'hi' ? 'पुनः प्रयास करें' : 'Retry'}</span>
        </button>
      )}
    </div>
  );
};
