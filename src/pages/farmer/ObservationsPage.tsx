import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useMockData } from '../../context/MockDataContext';
import { useTranslation } from '../../i18n/useTranslation';
import { ObservationFormModal } from '../../components/farmer/ObservationFormModal';
import {
  Eye,
  PlusCircle,
  CheckCircle,
  Clock,
  MapPin,
  CloudRain,
  Droplets,
  ShieldCheck,
} from 'lucide-react';

export const ObservationsPage: React.FC = () => {
  const { language } = useApp();
  const { observations } = useMockData();
  const { t } = useTranslation(language);

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            {t.navObservations}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            {language === 'hi'
              ? 'किसान खेत मौसम, वर्षा, मृदा नमी और कीट लक्षण अवलोकन'
              : 'Citizen science field observations for local ground truth calibration'}
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm transition-all shadow-md shadow-emerald-700/20 cursor-pointer shrink-0"
        >
          <PlusCircle size={17} />
          <span>{language === 'hi' ? 'नया अवलोकन दर्ज करें' : 'Submit Field Observation'}</span>
        </button>
      </div>

      {/* Community Observations Timeline */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-4">
        <h2 className="font-bold text-base text-slate-900 flex items-center gap-2">
          <Eye size={18} className="text-emerald-700" />
          <span>{t.recentCommunityObservations}</span>
        </h2>

        <div className="space-y-3">
          {observations.map((obs) => (
            <div
              key={obs.id}
              className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-all space-y-2.5"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-slate-900">{obs.farmerName}</span>
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <MapPin size={12} className="text-emerald-700" />
                    <span>{obs.villageNameEn}, GP {obs.panchayatNameEn}</span>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {obs.status === 'verified' && (
                    <span className="inline-flex items-center gap-1 text-[11px] text-emerald-800 font-bold bg-emerald-100 px-2.5 py-0.5 rounded-full">
                      <CheckCircle size={12} />
                      {language === 'hi' ? 'कृषि अधिकारी द्वारा सत्यापित' : 'AEO Verified'}
                    </span>
                  )}
                  {obs.status === 'pending' && (
                    <span className="inline-flex items-center gap-1 text-[11px] text-amber-800 font-bold bg-amber-100 px-2.5 py-0.5 rounded-full">
                      <Clock size={12} />
                      {language === 'hi' ? 'समीक्षाधीन' : 'Pending Review'}
                    </span>
                  )}
                  <span className="text-[11px] text-slate-400 font-mono">
                    {obs.submittedAt.slice(0, 10)}
                  </span>
                </div>
              </div>

              {/* Observation data badges */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                <div className="bg-white p-2.5 rounded-xl border border-slate-200 flex items-center gap-2">
                  <CloudRain size={16} className="text-sky-600 shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 block">{t.observedRainfallLabel}</span>
                    <span className="font-bold text-slate-800">{obs.observedRainfallMm || 0} mm ({obs.observedRainfallCategory})</span>
                  </div>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-slate-200 flex items-center gap-2">
                  <Droplets size={16} className="text-teal-600 shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 block">{t.soilMoistureLabel}</span>
                    <span className="font-bold text-slate-800 capitalize">{obs.soilCondition}</span>
                  </div>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-slate-200 flex items-center gap-2 col-span-2 sm:col-span-1">
                  <span className="text-base shrink-0">🌱</span>
                  <div>
                    <span className="text-[10px] text-slate-400 block">{t.currentStageLabel}</span>
                    <span className="font-bold text-slate-800 truncate block">{obs.cropStageEn}</span>
                  </div>
                </div>
              </div>

              {/* Notes or pest symptoms */}
              {obs.pestSymptomsEn && (
                <div className="text-xs text-purple-950 bg-purple-50 p-2.5 rounded-xl border border-purple-200">
                  <span className="font-bold">{language === 'hi' ? 'कीट लक्षण: ' : 'Pest Symptoms: '}</span>
                  <span>{language === 'hi' ? (obs.pestSymptomsHi || obs.pestSymptomsEn) : obs.pestSymptomsEn}</span>
                </div>
              )}

              {obs.cropStressNotesEn && (
                <div className="text-xs text-slate-700 bg-white p-2.5 rounded-xl border border-slate-200">
                  <span className="font-bold">{language === 'hi' ? 'टिप्पणी: ' : 'Field Note: '}</span>
                  <span>{language === 'hi' ? (obs.cropStressNotesHi || obs.cropStressNotesEn) : obs.cropStressNotesEn}</span>
                </div>
              )}

              {/* AEO validation note if present */}
              {obs.reviewNotesEn && (
                <div className="text-xs text-emerald-900 bg-emerald-50/80 p-2.5 rounded-xl border border-emerald-200 flex items-start gap-1.5">
                  <ShieldCheck size={15} className="text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">{language === 'hi' ? 'कृषि अधिकारी टिप्पणी: ' : 'Agronomist Verification: '}</span>
                    <span>{language === 'hi' ? (obs.reviewNotesHi || obs.reviewNotesEn) : obs.reviewNotesEn}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <ObservationFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};
