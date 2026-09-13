import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useMockData } from '../../context/MockDataContext';
import { useTranslation } from '../../i18n/useTranslation';
import { PANCHAYATS } from '../../data/panchayats';
import { Modal } from '../common/Modal';
import { RiskBadge } from '../common/RiskBadge';
import type { AlertCategory } from '../../types/alert';
import type { RiskLevel } from '../../types/common';
import {
  Radio,
  Check,
  MessageSquare,
  Smartphone,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';

interface AlertComposerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AlertComposerModal: React.FC<AlertComposerModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { language } = useApp();
  const { broadcastAlert } = useMockData();
  const { t } = useTranslation(language);

  const [step, setStep] = useState<'draft' | 'confirm'>('draft');

  const [selectedPanchayatIds, setSelectedPanchayatIds] = useState<string[]>(
    PANCHAYATS.map((p) => p.id)
  );
  const [level, setLevel] = useState<RiskLevel>('warning');
  const [category, setCategory] = useState<AlertCategory>('thunderstorm_wind');
  const [headlineEn, setHeadlineEn] = useState('Orange Alert: Severe Thunderstorm & Gusty Winds (40-50 km/h) Expected');
  const [headlineHi, setHeadlineHi] = useState('ऑरेंज अलर्ट: तीव्र गरज-चमक एवं 40-50 किमी/घंटा तेज आंधी की चेतावनी');
  const [descriptionEn, setDescriptionEn] = useState('Doppler radar shows convective squall line moving towards Phanda block. High risk of crop lodging in soybean and physical damage.');
  const [descriptionHi, setDescriptionHi] = useState('डॉप्लर रडार से ज्ञात होता है कि फंदा ब्लॉक की ओर तीव्र मेघ गर्जन प्रणाली अग्रसर है। सोयाबीन में फसल गिरने एवं नुकसान की आशंका।');
  const [recommendedActionEn, setRecommendedActionEn] = useState('1. Postpone all chemical spraying immediately.\n2. Open field drainage channels to prevent water stagnation.\n3. Secure livestock in covered shelters.');
  const [recommendedActionHi, setRecommendedActionHi] = useState('1. सभी कीटनाशक छिड़काव तत्काल स्थगित करें।\n2. जलभराव रोकने हेतु खेत की जलनिकासी नालियां खोलें।\n3. पशुओं को सुरक्षित बाड़ों में रखें।');

  // Multi-channel delivery toggles
  const [channelInApp, setChannelInApp] = useState(true);
  const [channelSms, setChannelSms] = useState(true);
  const [channelWhatsApp, setChannelWhatsApp] = useState(true);

  // Officer Confirmation checklist
  const [confirmedRadar, setConfirmedRadar] = useState(true);
  const [confirmedScope, setConfirmedScope] = useState(true);
  const [confirmedProtocol, setConfirmedProtocol] = useState(true);

  const togglePanchayat = (id: string) => {
    setSelectedPanchayatIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleNextToConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedPanchayatIds.length === 0) {
      alert('Please select at least one affected Gram Panchayat.');
      return;
    }
    setStep('confirm');
  };

  const handleFinalBroadcast = () => {
    if (!confirmedRadar || !confirmedScope || !confirmedProtocol) {
      alert('Please confirm all officer validation checklist items before publishing.');
      return;
    }

    const affectedGps = PANCHAYATS.filter((p) => selectedPanchayatIds.includes(p.id));

    broadcastAlert({
      panchayatIds: selectedPanchayatIds,
      panchayatsAffectedEn: affectedGps.map((p) => p.nameEn),
      panchayatsAffectedHi: affectedGps.map((p) => p.nameHi),
      cropsAffected: ['soybean', 'wheat', 'chickpea'],
      level,
      category,
      headlineEn,
      headlineHi: headlineHi || headlineEn,
      descriptionEn,
      descriptionHi: descriptionHi || descriptionEn,
      recommendedActionEn,
      recommendedActionHi: recommendedActionHi || recommendedActionEn,
      effectiveFrom: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 36 * 3600 * 1000).toISOString(),
      issuedBy: 'Dr. R. K. Sharma (Senior Agromet Officer, Phanda Command)',
      channel: channelInApp ? 'in_app' : 'sms_mock',
    });

    onClose();
    setStep('draft');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        onClose();
        setStep('draft');
      }}
      title={
        step === 'draft'
          ? (language === 'hi' ? 'आपातकालीन मौसम चेतावनी तैयार करें (ड्राफ़्ट)' : 'Compose Emergency Weather Alert (Draft)')
          : (language === 'hi' ? 'अधिकारी सत्यापन एवं प्रसारण पुष्टि' : 'Officer Verification & Broadcast Confirmation')
      }
      maxWidth="xl"
    >
      {step === 'draft' ? (
        <form onSubmit={handleNextToConfirm} className="space-y-3.5 text-xs sm:text-sm">
          {/* Affected Panchayats Checkbox grid */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700">
                {language === 'hi' ? 'प्रभावित ग्राम पंचायतें (चुनें)' : 'Target Gram Panchayats'}
              </label>
              <button
                type="button"
                onClick={() => setSelectedPanchayatIds(PANCHAYATS.map((p) => p.id))}
                className="text-[11px] text-emerald-700 hover:underline font-semibold"
              >
                {language === 'hi' ? 'सभी 5 चुनें' : 'Select All 5'}
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {PANCHAYATS.map((gp) => {
                const isChecked = selectedPanchayatIds.includes(gp.id);
                return (
                  <button
                    type="button"
                    key={gp.id}
                    onClick={() => togglePanchayat(gp.id)}
                    className={`p-2 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                      isChecked
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-900 shadow-xs'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className="truncate">{gp.nameEn} ({gp.nameHi})</span>
                    {isChecked && <Check size={14} className="text-emerald-700 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Severity Level & Category */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">{t.alertSeverity}</label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value as any)}
                className="w-full p-2 border border-slate-300 rounded-xl text-xs bg-white focus:ring-2 focus:ring-emerald-500 font-semibold"
              >
                <option value="advisory">Advisory Level (Yellow / Watch)</option>
                <option value="warning">Warning Level (Orange / Alert)</option>
                <option value="critical">Critical Emergency (Red / Take Action)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Alert Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full p-2 border border-slate-300 rounded-xl text-xs bg-white focus:ring-2 focus:ring-emerald-500 font-semibold"
              >
                <option value="thunderstorm_wind">Thunderstorm & High Winds</option>
                <option value="heavy_rainfall">Heavy Precipitation / Inundation</option>
                <option value="pest_outbreak">Pest & Disease Outbreak Alert</option>
                <option value="heatwave">Heatwave / Thermal Shock</option>
                <option value="dry_spell">Dry Spell / Prolonged Moisture Deficit</option>
              </select>
            </div>
          </div>

          {/* Headlines (Bilingual) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Alert Headline (English & Hindi)
            </label>
            <input
              type="text"
              required
              placeholder="English Headline"
              value={headlineEn}
              onChange={(e) => setHeadlineEn(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs mb-1.5 focus:ring-2 focus:ring-emerald-500"
            />
            <input
              type="text"
              placeholder="हिंदी शीर्षक"
              value={headlineHi}
              onChange={(e) => setHeadlineHi(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Meteorological Rationale & Scope</label>
            <textarea
              rows={2}
              required
              value={descriptionEn}
              onChange={(e) => setDescriptionEn(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 mb-1"
            />
            <textarea
              rows={2}
              value={descriptionHi}
              onChange={(e) => setDescriptionHi(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Recommended Actions */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">{t.immediateAction}</label>
            <textarea
              rows={2}
              required
              value={recommendedActionEn}
              onChange={(e) => setRecommendedActionEn(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 mb-1"
            />
            <textarea
              rows={2}
              value={recommendedActionHi}
              onChange={(e) => setRecommendedActionHi(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Delivery Channels */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Dissemination Channels</label>
            <div className="grid grid-cols-3 gap-2">
              <label className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 cursor-pointer ${
                channelInApp ? 'bg-emerald-50 border-emerald-500 text-emerald-900' : 'bg-slate-50 border-slate-200 text-slate-500'
              }`}>
                <input
                  type="checkbox"
                  checked={channelInApp}
                  onChange={(e) => setChannelInApp(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <Smartphone size={14} />
                <span>In-App Banner</span>
              </label>

              <label className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 cursor-pointer ${
                channelSms ? 'bg-emerald-50 border-emerald-500 text-emerald-900' : 'bg-slate-50 border-slate-200 text-slate-500'
              }`}>
                <input
                  type="checkbox"
                  checked={channelSms}
                  onChange={(e) => setChannelSms(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <Radio size={14} />
                <span>Krishi SMS Push</span>
              </label>

              <label className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 cursor-pointer ${
                channelWhatsApp ? 'bg-emerald-50 border-emerald-500 text-emerald-900' : 'bg-slate-50 border-slate-200 text-slate-500'
              }`}>
                <input
                  type="checkbox"
                  checked={channelWhatsApp}
                  onChange={(e) => setChannelWhatsApp(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <MessageSquare size={14} />
                <span>WhatsApp Bot</span>
              </label>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <span>{language === 'hi' ? 'समीक्षा एवं पुष्टि हेतु आगे बढ़ें' : 'Proceed to Confirmation'}</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </form>
      ) : (
        /* STEP 2: OFFICER CONFIRMATION */
        <div className="space-y-4 text-xs sm:text-sm">
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-300 space-y-2">
            <div className="flex items-center justify-between">
              <RiskBadge level={level} language={language} size="md" />
              <span className="text-[11px] text-amber-900 font-bold uppercase tracking-wider">
                Pre-Broadcast Preview
              </span>
            </div>
            <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
              {language === 'hi' ? headlineHi : headlineEn}
            </h3>
            <p className="text-xs text-slate-700">
              {language === 'hi' ? descriptionHi : descriptionEn}
            </p>
            <div className="text-[11px] font-semibold text-amber-950 pt-1 border-t border-amber-200">
              Impacted Panchayats: {selectedPanchayatIds.map((id) => PANCHAYATS.find((p) => p.id === id)?.nameEn).join(', ')}
            </div>
          </div>

          {/* Estimated Farmer Audience Delivery Placeholder */}
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-2">
            <span className="font-bold text-xs text-slate-800 block">
              Estimated Dissemination Audience in Phanda:
            </span>
            <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
              <div className="bg-white p-2 rounded-xl border border-slate-200">
                <span className="text-slate-400 block">In-App Active</span>
                <span className="font-bold text-emerald-800 text-sm">~1,840</span>
              </div>
              <div className="bg-white p-2 rounded-xl border border-slate-200">
                <span className="text-slate-400 block">SMS Gateway</span>
                <span className="font-bold text-blue-800 text-sm">~4,920</span>
              </div>
              <div className="bg-white p-2 rounded-xl border border-slate-200">
                <span className="text-slate-400 block">WhatsApp Reach</span>
                <span className="font-bold text-purple-800 text-sm">~3,150</span>
              </div>
            </div>
          </div>

          {/* Officer Verification Checklist */}
          <div className="space-y-2">
            <span className="font-bold text-xs text-slate-800 block">
              Officer Verification & Sign-off Checklist:
            </span>
            <label className="flex items-start gap-2 cursor-pointer text-xs text-slate-700 bg-white p-2 rounded-xl border border-slate-200">
              <input
                type="checkbox"
                checked={confirmedRadar}
                onChange={(e) => setConfirmedRadar(e.target.checked)}
                className="mt-0.5 rounded text-emerald-600"
              />
              <span>1. Verified with IMD Bhopal Doppler Radar velocity & reflectivity sweep.</span>
            </label>
            <label className="flex items-start gap-2 cursor-pointer text-xs text-slate-700 bg-white p-2 rounded-xl border border-slate-200">
              <input
                type="checkbox"
                checked={confirmedScope}
                onChange={(e) => setConfirmedScope(e.target.checked)}
                className="mt-0.5 rounded text-emerald-600"
              />
              <span>2. Confirmed target Gram Panchayat boundaries and vulnerable crop stages.</span>
            </label>
            <label className="flex items-start gap-2 cursor-pointer text-xs text-slate-700 bg-white p-2 rounded-xl border border-slate-200">
              <input
                type="checkbox"
                checked={confirmedProtocol}
                onChange={(e) => setConfirmedProtocol(e.target.checked)}
                className="mt-0.5 rounded text-emerald-600"
              />
              <span>3. Authorized under KVK / District Agricultural Emergency Dissemination Protocol.</span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setStep('draft')}
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer flex items-center gap-1.5"
            >
              <ArrowLeft size={14} />
              <span>{language === 'hi' ? 'वापस (ड्राफ़्ट संपादित करें)' : 'Back to Draft'}</span>
            </button>
            <button
              type="button"
              onClick={handleFinalBroadcast}
              className="px-5 py-2 text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white rounded-xl shadow-md flex items-center gap-2 cursor-pointer"
            >
              <Radio size={16} className="animate-pulse" />
              <span>{language === 'hi' ? 'सत्यापित करें व अभी प्रसारित करें' : 'Confirm & Broadcast Alert'}</span>
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
};

