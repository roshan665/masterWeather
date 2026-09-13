import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useMockData } from '../../context/MockDataContext';
import { useTranslation } from '../../i18n/useTranslation';
import { AlertComposerModal } from '../../components/officer/AlertComposerModal';
import { RiskBadge } from '../../components/common/RiskBadge';
import { PermissionGate } from '../../components/auth/PermissionGate';
import {
  ShieldAlert,
  Radio,
  ToggleLeft,
  ToggleRight,
  MapPin,
  Smartphone,
  MessageSquare
} from 'lucide-react';

export const OfficerAlertsPage: React.FC = () => {
  const { language } = useApp();
  const { alerts, toggleAlertActive } = useMockData();
  const { t } = useTranslation(language);

  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');

  const filteredAlerts = alerts.filter((a) => {
    if (filter === 'active') return a.isActive;
    if (filter === 'inactive') return !a.isActive;
    return true;
  });

  const activeCount = alerts.filter((a) => a.isActive).length;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            {t.navOfficerAlerts}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            {language === 'hi'
              ? 'आपातकालीन मौसम चेतावनी निर्माण, अधिकारी सत्यापन एवं बहु-माध्यम प्रसारण नियंत्रण'
              : 'Emergency weather broadcast composer, officer validation, and multi-channel delivery status'}
          </p>
        </div>

        <PermissionGate permission="broadcast_alerts" disabledMode disabledTooltip="Only Authorized Officers or Admins can broadcast emergency alerts">
          <button
            onClick={() => setIsComposerOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all cursor-pointer shrink-0"
          >
            <Radio size={16} className="animate-pulse" />
            <span>{t.btnBroadcastAlert}</span>
          </button>
        </PermissionGate>
      </div>

      {/* Delivery Channels KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>In-App Banner</span>
            <Smartphone size={16} className="text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">1,840</div>
          <span className="text-[11px] text-emerald-700 font-semibold block">
            ● Active Live Stream
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Krishi SMS Gateway</span>
            <Radio size={16} className="text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">4,920</div>
          <span className="text-[11px] text-blue-700 font-semibold block">
            C-DAC Fast Delivery (99.1%)
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>WhatsApp Bot Reach</span>
            <MessageSquare size={16} className="text-green-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">3,150</div>
          <span className="text-[11px] text-green-700 font-semibold block">
            94.8% Open Rate
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Broadcasting Status</span>
            <ShieldAlert size={16} className="text-amber-600" />
          </div>
          <div className="text-2xl font-black text-amber-700">{activeCount} Active</div>
          <span className="text-[11px] text-amber-800 font-semibold block">
            {activeCount > 0 ? 'Live in Phanda Block' : 'No Emergency Active'}
          </span>
        </div>
      </div>

      {/* Alert Feed Section */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <h2 className="font-bold text-base text-slate-900 flex items-center gap-2">
            <ShieldAlert size={18} className="text-amber-600" />
            <span>{language === 'hi' ? 'प्रसारित चेतावनियां एवं प्रसारण इतिहास' : 'Broadcasted Alerts & Delivery Lifecycle'}</span>
          </h2>

          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                filter === 'all' ? 'bg-white shadow-xs text-slate-900 font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({alerts.length})
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                filter === 'active' ? 'bg-emerald-700 text-white shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Active ({activeCount})
            </button>
            <button
              onClick={() => setFilter('inactive')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                filter === 'inactive' ? 'bg-white shadow-xs text-slate-900 font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Archived ({alerts.length - activeCount})
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {filteredAlerts.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs">
              {language === 'hi' ? 'कोई चेतावनी उपलब्ध नहीं है।' : 'No alerts found for this filter.'}
            </div>
          ) : (
            filteredAlerts.map((alt) => (
              <div
                key={alt.id}
                className={`p-4 rounded-2xl border transition-all space-y-2.5 ${
                  alt.isActive
                    ? 'bg-amber-50/50 border-amber-300'
                    : 'bg-slate-50 border-slate-200 opacity-70'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <RiskBadge level={alt.level} language={language} size="sm" showScore={false} />
                    <span className="font-bold text-slate-900 text-sm">
                      {language === 'hi' ? alt.headlineHi : alt.headlineEn}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleAlertActive(alt.id)}
                      className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer text-slate-700 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-xs"
                      title="Toggle active status"
                    >
                      {alt.isActive ? (
                        <span className="flex items-center gap-1 text-emerald-700 font-bold">
                          <ToggleRight size={20} />
                          <span>Active Broadcast</span>
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-slate-400">
                          <ToggleLeft size={20} />
                          <span>Muted / Inactive</span>
                        </span>
                      )}
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-600">
                  {language === 'hi' ? alt.descriptionHi : alt.descriptionEn}
                </p>

                {alt.recommendedActionEn && (
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-xs text-slate-700">
                    <span className="font-bold text-slate-900 block mb-0.5">Recommended Action:</span>
                    <span>{language === 'hi' ? alt.recommendedActionHi : alt.recommendedActionEn}</span>
                  </div>
                )}

                <div className="pt-2 border-t border-slate-200/60 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
                  <div className="flex items-center gap-1">
                    <MapPin size={13} className="text-emerald-700" />
                    <span className="font-semibold text-slate-700">Affected Panchayats:</span>
                    <span>{language === 'hi' ? alt.panchayatsAffectedHi.join(', ') : alt.panchayatsAffectedEn.join(', ')}</span>
                  </div>
                  <div className="italic">
                    Issued: {alt.issuedAt.slice(0, 16)} • {alt.issuedBy}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <AlertComposerModal
        isOpen={isComposerOpen}
        onClose={() => setIsComposerOpen(false)}
      />
    </div>
  );
};

