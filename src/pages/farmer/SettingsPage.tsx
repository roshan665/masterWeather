import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useTranslation } from '../../i18n/useTranslation';
import { PANCHAYATS } from '../../data/panchayats';
import { CROPS } from '../../data/crops';
import { isBackendApiEnabled, setBackendApiEnabled, API_CONFIG } from '../../config/api';
import { backendApi } from '../../services/backendApi';
import {
  Languages,
  MapPin,
  Sprout,
  RotateCcw,
  Server,
  Activity,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const {
    language,
    setLanguage,
    activePanchayat,
    selectPanchayatById,
    activeCrop,
    selectCropById,
    sowingDate,
    setSowingDate,
  } = useApp();
  const { t } = useTranslation(language);

  const [useBackend, setUseBackend] = useState<boolean>(isBackendApiEnabled());
  const [backendStatus, setBackendStatus] = useState<'checking' | 'connected' | 'disconnected' | 'idle'>('idle');
  const [statusMessage, setStatusMessage] = useState<string>('');

  const testBackendConnection = async () => {
    setBackendStatus('checking');
    setStatusMessage('Testing connection to FastAPI backend at ' + API_CONFIG.BASE_URL + '...');
    try {
      const res = await backendApi.checkHealth();
      if (res && res.status === 'healthy') {
        setBackendStatus('connected');
        setStatusMessage(`Connected to ${res.app_name} (Database: ${res.database})`);
      } else {
        setBackendStatus('connected');
        setStatusMessage('Connected to FastAPI backend service.');
      }
    } catch (err: any) {
      setBackendStatus('disconnected');
      setStatusMessage('Backend offline or unreachable: ' + (err?.message || 'Connection refused'));
    }
  };

  useEffect(() => {
    if (useBackend) {
      testBackendConnection();
    }
  }, [useBackend]);

  const handleToggleBackend = (enabled: boolean) => {
    setUseBackend(enabled);
    setBackendApiEnabled(enabled);
  };

  const handleReset = () => {
    if (confirm(language === 'hi' ? 'क्या आप सभी डिफ़ॉल्ट सेटिंग्स पुनर्स्थापित करना चाहते हैं?' : 'Reset to default settings?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900">
          {t.navSettings}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          {language === 'hi'
            ? 'अपनी पंचायत, फसल, बुवाई तिथि, भाषा एवं बैकएंड एपीआई प्राथमिकताएं अनुकूलित करें'
            : 'Configure your default Gram Panchayat, crop profile, language, and backend API preferences'}
        </p>
      </div>

      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-xs space-y-5 max-w-3xl">
        {/* Backend Integration Switcher (Phase 6 Requirement) */}
        <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                <Server size={18} />
              </div>
              <div>
                <h3 className="font-bold text-xs sm:text-sm text-slate-900 flex items-center gap-2">
                  <span>{language === 'hi' ? 'बैकएंड डेटा स्रोत (FastAPI REST API)' : 'Backend API Data Source'}</span>
                  <span className="px-2 py-0.5 bg-purple-100 text-purple-800 text-[10px] font-bold rounded-full">
                    Phase 6
                  </span>
                </h3>
                <p className="text-[11px] text-slate-500">
                  {language === 'hi'
                    ? 'एकल कॉन्फ़िगरेशन सेटिंग द्वारा मॉक डेटा और लाइव फास्टएपीआई बैकएंड के बीच स्विच करें।'
                    : 'Single configuration toggle to switch between local mock data and live FastAPI backend.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleToggleBackend(false)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  !useBackend
                    ? 'bg-slate-800 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {language === 'hi' ? 'मॉक मोड' : 'Mock Mode'}
              </button>
              <button
                onClick={() => handleToggleBackend(true)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  useBackend
                    ? 'bg-purple-600 text-white shadow-xs shadow-purple-600/20'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {language === 'hi' ? 'लाइव फास्टएपीआई' : 'FastAPI Backend'}
              </button>
            </div>
          </div>

          {/* Backend Connection Diagnostics */}
          <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-slate-500 font-medium">{language === 'hi' ? 'एपीआई बेस यूआरएल:' : 'Endpoint Base URL:'}</span>
                <span className="font-mono text-[11px] bg-slate-100 px-2 py-0.5 rounded text-slate-800 font-semibold">
                  {API_CONFIG.BASE_URL}
                </span>
              </div>
              <button
                onClick={testBackendConnection}
                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-colors"
              >
                <RefreshCw size={12} className={backendStatus === 'checking' ? 'animate-spin' : ''} />
                <span>{language === 'hi' ? 'कनेक्शन जांचें' : 'Test Health'}</span>
              </button>
            </div>

            {statusMessage && (
              <div
                className={`p-2 rounded-lg text-[11px] font-semibold flex items-center gap-1.5 ${
                  backendStatus === 'connected'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : backendStatus === 'disconnected'
                    ? 'bg-rose-50 text-rose-800 border border-rose-200'
                    : 'bg-slate-50 text-slate-700'
                }`}
              >
                {backendStatus === 'connected' ? (
                  <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                ) : backendStatus === 'disconnected' ? (
                  <AlertCircle size={13} className="text-rose-600 shrink-0" />
                ) : (
                  <Activity size={13} className="text-purple-600 shrink-0" />
                )}
                <span>{statusMessage}</span>
              </div>
            )}
          </div>
        </div>

        {/* Language Selection */}
        <div className="space-y-2 pb-4 border-b border-slate-100">
          <label className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-2">
            <Languages size={18} className="text-emerald-700" />
            <span>{language === 'hi' ? 'पसंदीदा भाषा (Language)' : 'Preferred Interface Language'}</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setLanguage('hi')}
              className={`p-3 rounded-xl border text-xs sm:text-sm font-bold flex items-center justify-between cursor-pointer transition-all ${
                language === 'hi'
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-2 ring-emerald-200'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <span>हिंदी (Hindi - Default for Farmers)</span>
              {language === 'hi' && <span className="text-emerald-700 font-black">✓</span>}
            </button>

            <button
              onClick={() => setLanguage('en')}
              className={`p-3 rounded-xl border text-xs sm:text-sm font-bold flex items-center justify-between cursor-pointer transition-all ${
                language === 'en'
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-2 ring-emerald-200'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <span>English (Default for Officers)</span>
              {language === 'en' && <span className="text-emerald-700 font-black">✓</span>}
            </button>
          </div>
        </div>

        {/* Primary Panchayat Selection */}
        <div className="space-y-2 pb-4 border-b border-slate-100">
          <label className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-2">
            <MapPin size={18} className="text-emerald-700" />
            <span>{t.selectPanchayat} (Phanda Block, Bhopal)</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {PANCHAYATS.map((gp) => (
              <button
                key={gp.id}
                onClick={() => selectPanchayatById(gp.id)}
                className={`p-3 rounded-xl border text-xs font-semibold text-left flex items-center justify-between cursor-pointer transition-all ${
                  gp.id === activePanchayat.id
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-2 ring-emerald-200'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div>
                  <div className="font-bold">{language === 'hi' ? gp.nameHi : gp.nameEn}</div>
                  <div className="text-[11px] text-slate-400">{gp.weatherStationName}</div>
                </div>
                {gp.id === activePanchayat.id && <span className="text-emerald-700 font-bold">✓</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Primary Crop & Sowing Date */}
        <div className="space-y-3 pb-4 border-b border-slate-100">
          <label className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-2">
            <Sprout size={18} className="text-emerald-700" />
            <span>{t.selectCrop} & {t.sowingDate}</span>
          </label>
          
          <div className="grid grid-cols-3 gap-2">
            {CROPS.map((c) => (
              <button
                key={c.id}
                onClick={() => selectCropById(c.id as any)}
                className={`p-3 rounded-xl border text-xs font-bold text-center cursor-pointer transition-all ${
                  c.id === activeCrop.id
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-2 ring-emerald-200'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="text-xl mb-1">{c.icon}</div>
                <div>{language === 'hi' ? c.nameHi.split(' ')[0] : c.nameEn.split(' ')[0]}</div>
              </button>
            ))}
          </div>

          <div className="pt-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {t.sowingDate}
            </label>
            <input
              type="date"
              value={sowingDate}
              onChange={(e) => setSowingDate(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Local Storage & Reset */}
        <div className="flex items-center justify-between pt-2">
          <div className="text-xs text-slate-500">
            {language === 'hi' ? 'सभी प्राथमिकताएं आपके उपकरण में सुरक्षित हैं।' : 'Preferences persist in local browser storage.'}
          </div>
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-700 border border-rose-300 hover:bg-rose-50 rounded-xl cursor-pointer"
          >
            <RotateCcw size={13} />
            <span>{language === 'hi' ? 'डेटा रीसेट करें' : 'Reset All State'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

