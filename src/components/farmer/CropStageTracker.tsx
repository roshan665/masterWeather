import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useTranslation } from '../../i18n/useTranslation';
import { CROPS } from '../../data/crops';
import type { CropId } from '../../types/crop';
import { Sprout, Calendar, Clock, CheckCircle2, Edit3, Satellite, User, CalendarDays } from 'lucide-react';
import { Modal } from '../common/Modal';

export type StageSourceType = 'calendar_estimated' | 'farmer_entered' | 'satellite_supported';

export const CropStageTracker: React.FC = () => {
  const {
    language,
    activeCrop,
    selectCropById,
    sowingDate,
    setSowingDate,
    cropActiveState,
  } = useApp();
  const { t } = useTranslation(language);

  const [isEditSowingModalOpen, setIsEditSowingModalOpen] = useState(false);
  const [tempSowingDate, setTempSowingDate] = useState(sowingDate);
  const [stageSource, setStageSource] = useState<StageSourceType>('calendar_estimated');

  const handleSaveSowingDate = (e: React.FormEvent) => {
    e.preventDefault();
    setSowingDate(tempSowingDate);
    setIsEditSowingModalOpen(false);
  };

  const getSourceBadge = () => {
    switch (stageSource) {
      case 'farmer_entered':
        return {
          icon: User,
          labelHi: 'किसान द्वारा दर्ज',
          labelEn: 'Farmer Entered',
          color: 'bg-blue-100 text-blue-800 border-blue-200'
        };
      case 'satellite_supported':
        return {
          icon: Satellite,
          labelHi: 'उपग्रह समर्थित (आगामी)',
          labelEn: 'Satellite Supported (Beta)',
          color: 'bg-purple-100 text-purple-800 border-purple-200'
        };
      case 'calendar_estimated':
      default:
        return {
          icon: CalendarDays,
          labelHi: 'कैलेंडर अनुमानित',
          labelEn: 'Calendar Estimated',
          color: 'bg-emerald-100 text-emerald-800 border-emerald-200'
        };
    }
  };

  const sourceBadge = getSourceBadge();
  const SourceIcon = sourceBadge.icon;

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs space-y-4">
      {/* Header: Crop Selector & Stage Source */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{activeCrop.icon}</span>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-base sm:text-lg text-slate-900">
                {language === 'hi' ? activeCrop.nameHi : activeCrop.nameEn}
              </h2>
              <span className="text-xs px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-medium">
                {language === 'hi' ? activeCrop.seasonNameHi : activeCrop.seasonNameEn}
              </span>
            </div>
            <p className="text-xs text-slate-500 italic">
              {activeCrop.botanicalName} • {language === 'hi' ? activeCrop.typicalSowingWindowHi : activeCrop.typicalSowingWindowEn}
            </p>
          </div>
        </div>

        {/* Crop Switcher Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 custom-scrollbar">
          {CROPS.map((c) => (
            <button
              key={c.id}
              onClick={() => selectCropById(c.id as CropId)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                c.id === activeCrop.id
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {c.icon} {language === 'hi' ? c.nameHi.split(' ')[0] : c.nameEn.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Sowing Date, Stage Tracker Info Bar & Stage Source Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 bg-emerald-50/60 p-3 rounded-xl border border-emerald-100 text-xs">
        <div className="flex items-center gap-2">
          <Calendar size={18} className="text-emerald-700 shrink-0" />
          <div>
            <span className="text-slate-500 block text-[11px]">{t.sowingDate}</span>
            <div className="flex items-center gap-1">
              <span className="font-bold text-slate-800">{sowingDate}</span>
              <button
                onClick={() => {
                  setTempSowingDate(sowingDate);
                  setIsEditSowingModalOpen(true);
                }}
                className="text-emerald-700 hover:text-emerald-900 p-0.5 cursor-pointer"
                title={t.updateSowingDate}
              >
                <Edit3 size={13} />
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Clock size={18} className="text-emerald-700 shrink-0" />
          <div>
            <span className="text-slate-500 block text-[11px]">{t.daysAfterSowing}</span>
            <span className="font-extrabold text-emerald-800 text-sm">
              {cropActiveState.daysAfterSowing} {language === 'hi' ? 'दिन' : 'Days'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Sprout size={18} className="text-emerald-700 shrink-0" />
          <div>
            <span className="text-slate-500 block text-[11px]">{t.currentStageLabel}</span>
            <span className="font-bold text-slate-800 truncate block max-w-[120px]">
              {language === 'hi' ? cropActiveState.currentStage.nameHi : cropActiveState.currentStage.nameEn}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <CheckCircle2 size={18} className="text-emerald-700 shrink-0" />
          <div>
            <span className="text-slate-500 block text-[11px]">{t.estimatedHarvest}</span>
            <span className="font-bold text-slate-800">{cropActiveState.estimatedHarvestDate}</span>
          </div>
        </div>
      </div>

      {/* Stage Source Selector */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-slate-500 text-[11px] font-medium">
            {language === 'hi' ? 'अवस्था निर्धारण स्रोत:' : 'Stage Source:'}
          </span>
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[11px] font-semibold ${sourceBadge.color}`}>
            <SourceIcon size={12} />
            <span>{language === 'hi' ? sourceBadge.labelHi : sourceBadge.labelEn}</span>
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setStageSource('calendar_estimated')}
            className={`px-2 py-1 rounded-lg text-[11px] font-medium transition-all ${
              stageSource === 'calendar_estimated'
                ? 'bg-emerald-600 text-white font-bold'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            {language === 'hi' ? 'कैलेंडर' : 'Calendar'}
          </button>
          <button
            type="button"
            onClick={() => setStageSource('farmer_entered')}
            className={`px-2 py-1 rounded-lg text-[11px] font-medium transition-all ${
              stageSource === 'farmer_entered'
                ? 'bg-emerald-600 text-white font-bold'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            {language === 'hi' ? 'किसान इनपुट' : 'Farmer Entered'}
          </button>
          <button
            type="button"
            onClick={() => setStageSource('satellite_supported')}
            className={`px-2 py-1 rounded-lg text-[11px] font-medium transition-all ${
              stageSource === 'satellite_supported'
                ? 'bg-emerald-600 text-white font-bold'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
            title="Satellite remote sensing NDVI stage estimator (Feature in pilot development)"
          >
            {language === 'hi' ? 'उपग्रह (Satellite)' : 'Satellite'}
          </button>
        </div>
      </div>

      {/* Visual Crop Stage Pipeline */}
      <div>
        <div className="flex items-center justify-between text-xs text-slate-600 mb-2">
          <span className="font-semibold">{language === 'hi' ? 'फसल विकास अवस्था चक्र' : 'Crop Growth Stages Timeline'}</span>
          <span className="text-emerald-700 font-bold">{cropActiveState.progressPct}% {language === 'hi' ? 'पूर्ण' : 'Progress'}</span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-3">
          <div
            className="bg-gradient-to-r from-emerald-500 to-teal-600 h-full rounded-full transition-all duration-500"
            style={{ width: `${cropActiveState.progressPct}%` }}
          />
        </div>

        {/* Stage Pills Scrollable */}
        <div className="flex items-stretch gap-2 overflow-x-auto pb-2 custom-scrollbar">
          {activeCrop.stages.map((stage) => {
            const isCurrent = stage.stageId === cropActiveState.currentStage.stageId;
            const isCompleted = stage.stageOrder < cropActiveState.currentStage.stageOrder;

            return (
              <div
                key={stage.stageId}
                className={`flex-1 min-w-[140px] max-w-[200px] p-2.5 rounded-xl border text-xs transition-all ${
                  isCurrent
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-md ring-2 ring-emerald-200'
                    : isCompleted
                    ? 'bg-emerald-50/80 text-emerald-900 border-emerald-200'
                    : 'bg-slate-50 text-slate-600 border-slate-200 opacity-75'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                    isCurrent ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {stage.stageOrder}
                  </span>
                  <span className="text-[10px] opacity-80">
                    ~{stage.typicalDurationDays} {language === 'hi' ? 'दिन' : 'd'}
                  </span>
                </div>

                <div className="font-bold truncate" title={language === 'hi' ? stage.nameHi : stage.nameEn}>
                  {language === 'hi' ? stage.nameHi : stage.nameEn}
                </div>

                <div className={`text-[11px] line-clamp-2 mt-1 ${isCurrent ? 'text-emerald-100' : 'text-slate-500'}`}>
                  {language === 'hi' ? stage.descriptionHi : stage.descriptionEn}
                </div>

                {isCurrent && (
                  <div className="mt-2 pt-1 border-t border-white/20 flex items-center gap-1 text-[10px] font-semibold text-emerald-100">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-300 animate-pulse" />
                    <span>{language === 'hi' ? 'सक्रिय अवस्था' : 'Active Stage'}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Sowing Date Edit Modal */}
      <Modal
        isOpen={isEditSowingModalOpen}
        onClose={() => setIsEditSowingModalOpen(false)}
        title={language === 'hi' ? 'बुवाई की तारीख दर्ज करें' : 'Set Crop Sowing Date'}
        maxWidth="sm"
      >
        <form onSubmit={handleSaveSowingDate} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {language === 'hi' ? 'वास्तविक बुवाई की तारीख' : 'Actual Sowing Date'}
            </label>
            <input
              type="date"
              value={tempSowingDate}
              onChange={(e) => setTempSowingDate(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              required
            />
            <p className="text-xs text-slate-500 mt-1">
              {language === 'hi'
                ? 'बुवाई तिथि के आधार पर प्रणाली स्वचालित रूप से वर्तमान फसल अवस्था और मौसम संवेदनशीलता का विश्लेषण करती है।'
                : 'The system automatically computes the current phenological growth stage and weather vulnerability based on this date.'}
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsEditSowingModalOpen(false)}
              className="px-3.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg cursor-pointer shadow-xs"
            >
              {t.save}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
