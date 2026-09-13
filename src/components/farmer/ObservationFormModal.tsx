import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useMockData } from '../../context/MockDataContext';
import { useTranslation } from '../../i18n/useTranslation';
import { Modal } from '../common/Modal';
import type { SoilMoistureStatus } from '../../types/observation';
import {
  CheckCircle2,
  Droplets,
  Bug,
  FileText,
  User,
  Phone,
  CloudRain,
  Navigation,
  Camera,
  Calendar,
  Layers,
  Sprout
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
  const { t } = useTranslation(language);

  const [obsType, setObsType] = useState<string>('pest');
  const [farmerName, setFarmerName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [villageName, setVillageName] = useState(activePanchayat.villages[0] || activePanchayat.nameEn);
  const [selectedCropStage, setSelectedCropStage] = useState(cropActiveState.currentStage.nameHi);
  const [dateTime, setDateTime] = useState<string>(new Date().toISOString().slice(0, 16));
  const [gpsLocation, setGpsLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isGpsDetecting, setIsGpsDetecting] = useState(false);
  const [hasPhoto, setHasPhoto] = useState(false);

  const [observedRainfallCategory, setObservedRainfallCategory] = useState<'none' | 'light' | 'moderate' | 'heavy'>('light');
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
    { id: 'general', labelHi: 'सामान्य फसल स्थिति', labelEn: 'Normal Crop Condition', icon: '🌱' },
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
          <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
            <CheckCircle2 size={32} />
          </div>
          <h3 className="text-base font-bold text-slate-800">
            {language === 'hi' ? 'अवलोकन सफलतापूर्वक दर्ज किया गया!' : 'Observation Successfully Logged!'}
          </h3>
          <p className="text-xs text-slate-600 max-w-sm mx-auto">
            {t.observationSuccess}
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
          {/* Observation Type Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Layers size={14} className="text-emerald-700" />
              <span>{language === 'hi' ? 'अवलोकन प्रकार (Observation Type)' : 'Observation Type'}</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {observationTypes.map((item) => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => setObsType(item.id)}
                  className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                    obsType === item.id
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  <span className="truncate">{language === 'hi' ? item.labelHi : item.labelEn}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Panchayat, Village & Date/Time */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t.selectPanchayat}
              </label>
              <div className="p-2.5 rounded-xl bg-slate-100 font-semibold text-slate-800 text-xs">
                {language === 'hi' ? activePanchayat.nameHi : activePanchayat.nameEn} (Phanda)
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {language === 'hi' ? 'गांव / मजरा चुनें' : 'Village / Hamlet'}
              </label>
              <select
                value={villageName}
                onChange={(e) => setVillageName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                {activePanchayat.villages.map((v, i) => (
                  <option key={i} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Calendar size={13} className="text-slate-500" />
                <span>{language === 'hi' ? 'दिनांक एवं समय' : 'Date & Time'}</span>
              </label>
              <input
                type="datetime-local"
                value={dateTime}
                onChange={(e) => setDateTime(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-xl text-xs bg-white focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Crop & Crop Stage Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Sprout size={13} className="text-emerald-700" />
                <span>{t.selectCrop}</span>
              </label>
              <div className="p-2.5 rounded-xl bg-slate-100 font-semibold text-slate-800 text-xs flex items-center gap-2">
                <span>{activeCrop.icon}</span>
                <span>{language === 'hi' ? activeCrop.nameHi : activeCrop.nameEn}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {language === 'hi' ? 'फसल अवस्था (वैकल्पिक)' : 'Crop Stage (Optional)'}
              </label>
              <select
                value={selectedCropStage}
                onChange={(e) => setSelectedCropStage(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-emerald-500"
              >
                {activeCrop.stages.map((st) => (
                  <option key={st.stageId} value={language === 'hi' ? st.nameHi : st.nameEn}>
                    {language === 'hi' ? st.nameHi : st.nameEn}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Farmer Contact Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t.farmerNameLabel}
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder={language === 'hi' ? 'उदा. रमेश पाटीदार' : 'e.g. Ramesh Patidar'}
                  value={farmerName}
                  onChange={(e) => setFarmerName(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
                <User size={14} className="absolute left-2.5 top-2.5 text-slate-400" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t.contactNumberLabel}
              </label>
              <div className="relative">
                <input
                  type="tel"
                  placeholder="98XXXXXXXX"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
                <Phone size={14} className="absolute left-2.5 top-2.5 text-slate-400" />
              </div>
            </div>
          </div>

          {/* Location GPS Stamp & Photo Attachment */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div>
              <span className="block text-xs font-semibold text-slate-700 mb-1">
                {language === 'hi' ? 'खेत जीपीएस स्थिति' : 'Field GPS Coordinates'}
              </span>
              <button
                type="button"
                onClick={handleDetectGps}
                disabled={isGpsDetecting}
                className="w-full p-2 bg-white border border-slate-300 hover:border-emerald-500 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Navigation size={14} className={`text-emerald-600 ${isGpsDetecting ? 'animate-spin' : ''}`} />
                <span>
                  {gpsLocation
                    ? `Lat: ${gpsLocation.lat}, Lng: ${gpsLocation.lng}`
                    : isGpsDetecting
                    ? (language === 'hi' ? 'जीपीएस खोज रहे हैं...' : 'Detecting GPS...')
                    : (language === 'hi' ? 'वर्तमान स्थान जोड़ें' : 'Stamp Current Location')}
                </span>
              </button>
            </div>

            <div>
              <span className="block text-xs font-semibold text-slate-700 mb-1">
                {language === 'hi' ? 'खेत की फोटो जोड़ें' : 'Attach Field Photo'}
              </span>
              <button
                type="button"
                onClick={() => setHasPhoto(!hasPhoto)}
                className={`w-full p-2 border rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  hasPhoto
                    ? 'bg-emerald-100 border-emerald-500 text-emerald-900'
                    : 'bg-white border-slate-300 text-slate-700 hover:border-emerald-500'
                }`}
              >
                <Camera size={14} className="text-emerald-600" />
                <span>
                  {hasPhoto
                    ? (language === 'hi' ? 'फोटो संलग्न की गई ✓' : 'Photo Attached ✓')
                    : (language === 'hi' ? 'कैमरा / फोटो चुनें' : 'Take / Select Photo')}
                </span>
              </button>
            </div>
          </div>

          {/* Observed Rainfall */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <CloudRain size={14} className="text-sky-600" />
              <span>{t.observedRainfallLabel}</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
              {[
                { id: 'none', label: t.observedRainNone },
                { id: 'light', label: t.observedRainLight },
                { id: 'moderate', label: t.observedRainModerate },
                { id: 'heavy', label: t.observedRainHeavy },
              ].map((item) => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => setObservedRainfallCategory(item.id as any)}
                  className={`p-2 rounded-xl border text-xs font-medium transition-all text-center cursor-pointer ${
                    observedRainfallCategory === item.id
                      ? 'bg-sky-50 border-sky-400 text-sky-900 font-bold ring-1 ring-sky-300'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div>
              <input
                type="number"
                step="0.1"
                placeholder="Approximate mm (optional)"
                value={observedRainfallMm}
                onChange={(e) => setObservedRainfallMm(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-xl text-xs"
              />
            </div>
          </div>

          {/* Soil Moisture Condition */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Droplets size={14} className="text-teal-600" />
              <span>{t.soilMoistureLabel}</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'dry', label: t.soilDry },
                { id: 'optimal', label: t.soilOptimal },
                { id: 'wet', label: t.soilWet },
                { id: 'waterlogged', label: t.soilWaterlogged },
              ].map((item) => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => setSoilCondition(item.id as any)}
                  className={`p-2 rounded-xl border text-xs font-medium transition-all text-center cursor-pointer ${
                    soilCondition === item.id
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-900 font-bold ring-1 ring-emerald-300'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Pest Symptoms & Field Notes */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <Bug size={14} className="text-purple-600" />
                <span>{t.pestObservedLabel}</span>
              </label>
              <input
                type="text"
                placeholder={language === 'hi' ? 'उदा. पत्तियों पर सफेद मक्खी या इल्ली' : 'e.g. Whitefly or caterpillars on lower leaves'}
                value={pestSymptoms}
                onChange={(e) => setPestSymptoms(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <FileText size={14} className="text-slate-600" />
                <span>{language === 'hi' ? 'विस्तृत विवरण एवं खेत की स्थिति' : 'Detailed Description & Field Notes'}</span>
              </label>
              <textarea
                rows={2}
                placeholder={language === 'hi' ? 'खेत की कोई अन्य समस्या या अवलोकन लिखें...' : 'Any other field condition notes...'}
                value={cropStressNotes}
                onChange={(e) => setCropStressNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl shadow-md shadow-emerald-700/20 cursor-pointer"
            >
              {language === 'hi' ? 'अवलोकन जमा करें' : 'Submit Observation'}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};
