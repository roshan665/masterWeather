import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useMockData } from '../../context/MockDataContext';
import { Modal } from '../common/Modal';
import type { SoilMoistureStatus } from '../../types/observation';
import {
  CheckCircle2,
  User,
  Phone,
  CloudRain,
  Navigation,
  Camera,
  Calendar,
  Layers,
  Check
} from 'lucide-react';

interface ObservationFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ObservationFormModal: React.FC<ObservationFormModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { language, activePanchayat, activeCrop, cropActiveState } = useApp();
  const { addObservation } = useMockData();

  const [obsType, setObsType] = useState<string>('pest');
  const [farmerName, setFarmerName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [villageName, setVillageName] = useState(activePanchayat.villages[0] || activePanchayat.nameEn);
  const selectedCropStage = cropActiveState.currentStage.nameHi;
  const [dateTime, setDateTime] = useState<string>(new Date().toISOString().slice(0, 16));
  const [gpsLocation, setGpsLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isGpsDetecting, setIsGpsDetecting] = useState(false);
  const [hasPhoto, setHasPhoto] = useState(false);

  const observedRainfallCategory: 'none' | 'light' | 'moderate' | 'heavy' = 'light';
  const [observedRainfallMm, setObservedRainfallMm] = useState<string>('8.0');
  const [soilCondition, setSoilCondition] = useState<SoilMoistureStatus>('optimal');
  const [pestSymptoms, setPestSymptoms] = useState('');
  const [cropStressNotes, setCropStressNotes] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const observationTypes = [
    { id: 'pest', labelHi: 'कीट प्रकोप', labelEn: 'Pest Infestation', icon: '🐛' },
    { id: 'disease', labelHi: 'फसल रोग', labelEn: 'Crop Disease', icon: '🍄' },
    { id: 'waterlogging', labelHi: 'जलभराव', labelEn: 'Waterlogging', icon: '🌊' },
    { id: 'drought', labelHi: 'सूखा तनाव', labelEn: 'Moisture Deficit', icon: '☀️' },
    { id: 'hail', labelHi: 'ओलावृष्टि / अंधड़', labelEn: 'Hail / Wind Damage', icon: '⛈️' },
    { id: 'general', labelHi: 'सामान्य स्थिति', labelEn: 'Normal Status', icon: '🌱' },
  ];

  const handleDetectGps = () => {
    setIsGpsDetecting(true);
    setTimeout(() => {
      setGpsLocation({
        lat: +(activePanchayat.latitude + (Math.random() - 0.5) * 0.01).toFixed(4),
        lng: +(activePanchayat.longitude + (Math.random() - 0.5) * 0.01).toFixed(4),
      });
      setIsGpsDetecting(false);
    }, 600);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    addObservation({
      panchayatId: activePanchayat.id,
      panchayatNameEn: activePanchayat.nameEn,
      panchayatNameHi: activePanchayat.nameHi,
      villageNameEn: villageName,
      villageNameHi: villageName,
      farmerName: farmerName.trim() || (language === 'hi' ? 'स्थानीय किसान' : 'Local Farmer'),
      contactNumber: contactNumber.trim() || undefined,
      cropId: activeCrop.id,
      cropStageEn: `${cropActiveState.currentStage.nameEn} (${cropActiveState.daysAfterSowing} DAS)`,
      cropStageHi: `${selectedCropStage || cropActiveState.currentStage.nameHi} (${cropActiveState.daysAfterSowing} दिन)`,
      soilCondition,
      observedRainfallCategory,
      observedRainfallMm: parseFloat(observedRainfallMm) || 0,
      pestSymptomsEn: pestSymptoms.trim() || undefined,
      pestSymptomsHi: pestSymptoms.trim() || undefined,
      cropStressNotesEn: cropStressNotes.trim() ? `[Type: ${obsType}] ${cropStressNotes.trim()}` : undefined,
      cropStressNotesHi: cropStressNotes.trim() ? `[प्रकार: ${obsType}] ${cropStressNotes.trim()}` : undefined,
      latitude: gpsLocation?.lat || activePanchayat.latitude,
      longitude: gpsLocation?.lng || activePanchayat.longitude,
      photoUrl: hasPhoto ? 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9' : undefined
    });

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
      // Reset form
      setFarmerName('');
      setContactNumber('');
      setPestSymptoms('');
      setCropStressNotes('');
      setHasPhoto(false);
      setGpsLocation(null);
    }, 1800);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={language === 'hi' ? 'खेत अवलोकन प्रपत्र' : 'Field Observation Form'}
      maxWidth="lg"
    >
      {isSuccess ? (
        <div className="py-8 text-center space-y-3">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
            <CheckCircle2 size={36} />
          </div>
          <h3 className="text-lg font-black text-slate-900">
            {language === 'hi' ? 'अवलोकन सफलतापूर्वक दर्ज किया गया!' : 'Observation Successfully Logged!'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto">
            {language === 'hi'
              ? 'आपकी रिपोर्ट कृषि अधिकारियों एवं मौसम प्रणाली द्वारा सत्यापित की जाएगी।'
              : 'Your field observation has been sent to agricultural officers for validation.'}
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
          {/* Section 1: Observation Type */}
          <div className="space-y-2 bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200/80">
            <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Layers size={16} className="text-emerald-700 shrink-0" />
              <span>1. {language === 'hi' ? 'अवलोकन का प्रकार चुनें' : 'Select Observation Type'}</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {observationTypes.map((item) => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => setObsType(item.id)}
                  className={`min-h-[44px] p-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                    obsType === item.id
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm shadow-emerald-950/20'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="truncate">{language === 'hi' ? item.labelHi : item.labelEn}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Section 2: Location & Timing */}
          <div className="space-y-3 bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200/80">
            <div className="font-bold text-xs text-slate-800">
              2. {language === 'hi' ? 'स्थान एवं फसल विवरण' : 'Location & Crop Details'}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  {language === 'hi' ? 'ग्राम पंचायत' : 'Gram Panchayat'}
                </label>
                <div className="min-h-[44px] px-3 py-2.5 rounded-xl bg-white border border-slate-200 font-bold text-slate-800 text-xs flex items-center">
                  {language === 'hi' ? activePanchayat.nameHi : activePanchayat.nameEn} (Phanda)
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  {language === 'hi' ? 'गांव / मजरा चुनें' : 'Village / Hamlet'}
                </label>
                <select
                  value={villageName}
                  onChange={(e) => setVillageName(e.target.value)}
                  className="w-full min-h-[44px] px-3 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm bg-white font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  {activePanchayat.villages.map((v, i) => (
                    <option key={i} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  {language === 'hi' ? 'सक्रिय फसल' : 'Active Crop'}
                </label>
                <div className="min-h-[44px] px-3 py-2.5 rounded-xl bg-white border border-slate-200 font-bold text-slate-800 text-xs flex items-center gap-2">
                  <span className="text-base">{activeCrop.icon}</span>
                  <span>{language === 'hi' ? activeCrop.nameHi : activeCrop.nameEn}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1 flex items-center gap-1">
                  <Calendar size={14} className="text-slate-500" />
                  <span>{language === 'hi' ? 'दिनांक एवं समय' : 'Date & Time'}</span>
                </label>
                <input
                  type="datetime-local"
                  value={dateTime}
                  onChange={(e) => setDateTime(e.target.value)}
                  className="w-full min-h-[44px] px-3 py-2 border border-slate-300 rounded-xl text-xs sm:text-sm bg-white font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Weather & Soil Condition */}
          <div className="space-y-3 bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200/80">
            <div className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
              <CloudRain size={16} className="text-sky-600 shrink-0" />
              <span>3. {language === 'hi' ? 'खेत में वर्षा एवं मृदा स्थिति' : 'Rainfall & Soil Condition'}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  {language === 'hi' ? 'वर्षा की मात्रा (मिमी)' : 'Observed Rainfall (mm)'}
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={observedRainfallMm}
                  onChange={(e) => setObservedRainfallMm(e.target.value)}
                  className="w-full min-h-[44px] px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm bg-white font-medium focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  {language === 'hi' ? 'खेत की नमी स्थिति' : 'Soil Moisture Condition'}
                </label>
                <select
                  value={soilCondition}
                  onChange={(e) => setSoilCondition(e.target.value as SoilMoistureStatus)}
                  className="w-full min-h-[44px] px-3 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm bg-white font-medium focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="optimal">{language === 'hi' ? 'पर्याप्त / अनुकूल नमी (Optimal)' : 'Optimal Moisture'}</option>
                  <option value="dry">{language === 'hi' ? 'सूखी / नमी की कमी (Dry)' : 'Dry Soil'}</option>
                  <option value="wet">{language === 'hi' ? 'अत्यधिक गीली (Excess Wet)' : 'Wet'}</option>
                  <option value="waterlogged">{language === 'hi' ? 'जलभराव (Waterlogged)' : 'Waterlogged'}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 4: Farmer Details & GPS */}
          <div className="space-y-3 bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200/80">
            <div className="font-bold text-xs text-slate-800">
              4. {language === 'hi' ? 'विवरण एवं किसान संपर्क' : 'Notes & Contact'}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  {language === 'hi' ? 'किसान का नाम' : 'Farmer Name'}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder={language === 'hi' ? 'उदा. रमेश पाटीदार' : 'e.g. Ramesh Patidar'}
                    value={farmerName}
                    onChange={(e) => setFarmerName(e.target.value)}
                    className="w-full min-h-[44px] pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm bg-white font-medium focus:ring-2 focus:ring-emerald-500"
                  />
                  <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  {language === 'hi' ? 'मोबाइल नंबर (वैकल्पिक)' : 'Mobile Number (Optional)'}
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    placeholder="9876543210"
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    className="w-full min-h-[44px] pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm bg-white font-medium focus:ring-2 focus:ring-emerald-500"
                  />
                  <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                {language === 'hi' ? 'लक्षण या समस्या का विवरण' : 'Symptoms or Field Notes'}
              </label>
              <textarea
                rows={2}
                placeholder={language === 'hi' ? 'उदा. सोयाबीन की पत्तियों पर पीले धब्बे दिख रहे हैं...' : 'e.g. Yellow spots visible on lower soybean leaves...'}
                value={pestSymptoms}
                onChange={(e) => setPestSymptoms(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-300 text-xs sm:text-sm bg-white font-medium focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* GPS & Photo Toggles */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              <button
                type="button"
                onClick={handleDetectGps}
                disabled={isGpsDetecting}
                className="min-h-[44px] px-3.5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
              >
                <Navigation size={14} className={isGpsDetecting ? 'animate-spin text-emerald-600' : ''} />
                <span>
                  {gpsLocation
                    ? `GPS: ${gpsLocation.lat}, ${gpsLocation.lng}`
                    : (language === 'hi' ? 'खेत GPS स्थान जोड़ें' : 'Add Field GPS Location')}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setHasPhoto(!hasPhoto)}
                className={`min-h-[44px] px-3.5 py-2 rounded-xl border font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                  hasPhoto
                    ? 'bg-emerald-100 border-emerald-400 text-emerald-900'
                    : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Camera size={14} className={hasPhoto ? 'text-emerald-700' : ''} />
                <span>{hasPhoto ? (language === 'hi' ? 'फोटो संलग्न ✓' : 'Photo Attached ✓') : (language === 'hi' ? 'फोटो जोड़ें' : 'Attach Photo')}</span>
              </button>
            </div>
          </div>

          {/* Sticky Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full min-h-[50px] py-3 bg-emerald-700 hover:bg-emerald-600 active:scale-98 text-white font-black text-sm sm:text-base rounded-2xl shadow-lg shadow-emerald-950/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Check size={18} />
              <span>{language === 'hi' ? 'अवलोकन सबमिट करें' : 'Submit Observation'}</span>
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};
