import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useMockData } from '../../context/MockDataContext';
import { useTranslation } from '../../i18n/useTranslation';
import { PanchayatRiskMap } from '../../components/officer/PanchayatRiskMap';
import { GPWeatherMatrix } from '../../components/officer/GPWeatherMatrix';
import { AdvisoryApprovalTable } from '../../components/officer/AdvisoryApprovalTable';
import { ObservationReviewQueue } from '../../components/officer/ObservationReviewQueue';
import { AlertComposerModal } from '../../components/officer/AlertComposerModal';
import { PermissionGate } from '../../components/auth/PermissionGate';
import {
  Building2,
  ShieldAlert,
  BookOpen,
  Eye,
  Radio,
  MapPin,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const OfficerDashboard: React.FC = () => {
  const { language } = useApp();
  const { advisories, observations, alerts } = useMockData();
  const { t } = useTranslation(language);

  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);

  const pendingAdvisories = advisories.filter((a) => a.approvalStatus === 'pending_review').length;
  const pendingObservations = observations.filter((o) => o.status === 'pending').length;
  const activeAlertsCount = alerts.filter((a) => a.isActive).length;

  return (
    <div className="space-y-5">
      {/* Officer Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-blue-100 text-blue-800 rounded-lg">
              <Building2 size={20} />
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              {t.officerOverview}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {language === 'hi'
              ? 'फंदा विकासखंड, भोपाल (मध्य प्रदेश) - 5 ग्राम पंचायतें, 3 फसल चक्र'
              : 'Phanda Block Agromet Command Center - 5 Gram Panchayats, 3 Core Crops'}
          </p>
        </div>

        <PermissionGate permission="broadcast_alerts" disabledMode disabledTooltip="Only Authorized Officers or Admins can broadcast emergency alerts">
          <button
            onClick={() => setIsAlertModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all cursor-pointer shrink-0"
          >
            <Radio size={16} className="animate-pulse" />
            <span>{t.btnBroadcastAlert}</span>
          </button>
        </PermissionGate>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        
        {/* Monitored Panchayats */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>{t.totalPanchayatsMonitored}</span>
            <MapPin size={16} className="text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">5</div>
          <span className="text-[11px] text-emerald-700 font-semibold block">
            Acharpura, Bangrasia, Ratibad, Samasgarh, Sukhi Sewaniya
          </span>
        </div>

        {/* Pending Advisories */}
        <Link
          to="/officer/advisories"
          className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1 hover:border-emerald-300 transition-all block"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>{t.pendingAdvisoriesCount}</span>
            <BookOpen size={16} className="text-blue-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">{pendingAdvisories}</div>
          <span className="text-[11px] text-blue-700 font-semibold block">
            {pendingAdvisories > 0 ? (language === 'hi' ? 'सत्यापन आवश्यक' : 'Awaiting Sign-off') : (language === 'hi' ? 'सभी स्वीकृत' : 'All Clear')}
          </span>
        </Link>

        {/* Pending Observations */}
        <Link
          to="/officer/observations"
          className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1 hover:border-emerald-300 transition-all block"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>{t.pendingObservationsCount}</span>
            <Eye size={16} className="text-purple-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">{pendingObservations}</div>
          <span className="text-[11px] text-purple-700 font-semibold block">
            {language === 'hi' ? 'खेत अवलोकन रिपोर्ट' : 'Citizen Science Reports'}
          </span>
        </Link>

        {/* Active Alerts */}
        <Link
          to="/officer/alerts"
          className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1 hover:border-emerald-300 transition-all block"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>{language === 'hi' ? 'सक्रिय आपात चेतावनी' : 'Active Emergency Alerts'}</span>
            <ShieldAlert size={16} className="text-amber-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">{activeAlertsCount}</div>
          <span className="text-[11px] text-amber-700 font-semibold block">
            {language === 'hi' ? 'प्रसारण सक्रिय' : 'Broadcasting on In-App'}
          </span>
        </Link>

      </div>

      {/* 1. Spatial Interactive Map */}
      <PanchayatRiskMap />

      {/* 2. Comparative Weather Matrix across 5 GPs */}
      <GPWeatherMatrix />

      {/* 3. Advisory Approval Workflow Table */}
      <AdvisoryApprovalTable />

      {/* 4. Farmer Observations Validation Queue */}
      <ObservationReviewQueue />

      {/* Broadcast Modal */}
      <AlertComposerModal
        isOpen={isAlertModalOpen}
        onClose={() => setIsAlertModalOpen(false)}
      />
    </div>
  );
};
