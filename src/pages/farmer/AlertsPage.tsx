import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useMockData } from '../../context/MockDataContext';
import { useTranslation } from '../../i18n/useTranslation';
import { RiskBadge } from '../../components/RiskBadge';
import {
  Calendar,
  MapPin,
  CheckCircle2,
  Bell,
  Check,
  ShieldAlert,
  AlertTriangle,
  Info
} from 'lucide-react';

export const AlertsPage: React.FC = () => {
  const { language, activePanchayat } = useApp();
  const { alerts } = useMockData();
  const { t } = useTranslation(language);

  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [readAlertIds, setReadAlertIds] = useState<Set<string>>(new Set());

  const activeAlerts = alerts.filter(
    (a) => a.isActive && a.panchayatIds.includes(activePanchayat.id)
  );

  const filteredAlerts = activeAlerts.filter((a) => {
    if (selectedSeverity === 'all') return true;
    return a.level === selectedSeverity;
  });

  const toggleReadStatus = (id: string) => {
    setReadAlertIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const markAllAsRead = () => {
    setReadAlertIds(new Set(activeAlerts.map((a) => a.id)));
  };

  const severityLevels: { id: string; labelHi: string; labelEn: string; icon: any; color: string }[] = [
    { id: 'all', labelHi: 'सभी अलर्ट', labelEn: 'All Alerts', icon: Bell, color: 'bg-slate-800 text-slate-200' },
    { id: 'normal', labelHi: 'सामान्य (Normal)', labelEn: 'Normal', icon: Info, color: 'bg-emerald-950 text-emerald-300 border-emerald-500/30' },
    { id: 'advisory', labelHi: 'सलाह (Advisory)', labelEn: 'Advisory', icon: Info, color: 'bg-sky-950 text-sky-300 border-sky-500/30' },
    { id: 'warning', labelHi: 'चेतावनी (Warning)', labelEn: 'Warning', icon: AlertTriangle, color: 'bg-amber-950 text-amber-300 border-amber-500/30' },
    { id: 'critical', labelHi: 'अति गंभीर (Critical)', labelEn: 'Critical', icon: ShieldAlert, color: 'bg-rose-950 text-rose-300 border-rose-500/30' }
  ];

  return (
    <div className="space-y-5">
      {/* Header & Mark all as read */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            {t.activeAlertsTitle}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            {language === 'hi'
              ? 'आपातकालीन मौसम चेतावनियां, अंधड़, भारी वर्षा एवं कीट अलर्ट'
              : 'Early warning emergency notifications, squalls, heavy rainfall, and pest spikes'}
          </p>
        </div>

        {activeAlerts.length > 0 && (
          <button
            type="button"
            onClick={markAllAsRead}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition-all cursor-pointer self-start sm:self-auto shrink-0"
          >
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span>{language === 'hi' ? 'सभी को पढ़ा हुआ चिह्नित करें' : 'Mark All as Read'}</span>
          </button>
        )}
      </div>

      {/* Severity Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
        {severityLevels.map((lvl) => {
          const isSelected = selectedSeverity === lvl.id;
          const count = lvl.id === 'all'
            ? activeAlerts.length
            : activeAlerts.filter((a) => a.level === lvl.id).length;

          return (
            <button
              key={lvl.id}
              type="button"
              onClick={() => setSelectedSeverity(lvl.id)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer shrink-0 border ${
                isSelected
                  ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm shadow-emerald-950/20'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <lvl.icon className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? lvl.labelHi : lvl.labelEn}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                isSelected ? 'bg-emerald-800 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Alert List */}
      {filteredAlerts.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 shadow-xs space-y-2">
          <CheckCircle2 size={40} className="mx-auto text-emerald-600" />
          <h2 className="text-base font-bold text-slate-800">
            {t.noActiveAlerts}
          </h2>
          <p className="text-xs text-slate-500">
            {language === 'hi'
              ? 'इस श्रेणी में कोई सक्रिय चेतावनी नहीं है। मौसम सामान्य और अनुकूल है।'
              : 'No alerts active in this category. Weather conditions are stable and normal across this Panchayat.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAlerts.map((alt) => {
            const isRead = readAlertIds.has(alt.id);

            return (
              <div
                key={alt.id}
                className={`bg-white rounded-2xl p-4 sm:p-5 border-2 transition-all space-y-3 ${
                  isRead
                    ? 'border-slate-200 opacity-80'
                    : alt.level === 'critical'
                    ? 'border-rose-400 bg-rose-50/20 shadow-md ring-1 ring-rose-300'
                    : alt.level === 'warning'
                    ? 'border-amber-300 shadow-md ring-1 ring-amber-200'
                    : 'border-slate-200 shadow-xs'
                }`}
              >
                {/* Alert Header & Read Toggle */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <RiskBadge severity={alt.level} size="sm" />
                    <span className="text-xs font-bold text-amber-950 px-2 py-0.5 bg-amber-100 rounded uppercase">
                      {alt.category.replace('_', ' ')}
                    </span>
                    {!isRead && (
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" title="Unread" />
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-xs text-slate-400 flex items-center gap-1">
                      <Calendar size={13} />
                      <span>{alt.effectiveFrom.slice(0, 10)} - {alt.expiresAt.slice(0, 10)}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleReadStatus(alt.id)}
                      className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition-all ${
                        isRead
                          ? 'bg-slate-100 text-slate-600 border-slate-200'
                          : 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                      }`}
                    >
                      {isRead
                        ? (language === 'hi' ? 'पढ़ा गया ✓' : 'Read ✓')
                        : (language === 'hi' ? 'पढ़ा चिह्नित करें' : 'Mark as Read')}
                    </button>
                  </div>
                </div>

                {/* Headline & Description */}
                <div>
                  <h2 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
                    {language === 'hi' ? alt.headlineHi : alt.headlineEn}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-700 mt-1 leading-relaxed">
                    {language === 'hi' ? alt.descriptionHi : alt.descriptionEn}
                  </p>
                </div>

                {/* Recommended Immediate Actions */}
                <div className="bg-amber-50 p-3.5 rounded-xl border border-amber-200 text-amber-950 text-xs sm:text-sm space-y-1">
                  <span className="font-bold block uppercase text-[11px] tracking-wide text-amber-900">
                    {t.immediateAction}:
                  </span>
                  <p className="font-medium whitespace-pre-line leading-relaxed">
                    {language === 'hi' ? alt.recommendedActionHi : alt.recommendedActionEn}
                  </p>
                </div>

                {/* Affected Panchayats & Issuer info */}
                <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                  <div className="flex items-center gap-1">
                    <MapPin size={13} className="text-emerald-700" />
                    <span>{t.affectedPanchayats}: </span>
                    <span className="font-semibold text-slate-700">
                      {language === 'hi' ? alt.panchayatsAffectedHi.join(', ') : alt.panchayatsAffectedEn.join(', ')}
                    </span>
                  </div>

                  <div className="italic text-[11px]">
                    Issued by: {alt.issuedBy}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
