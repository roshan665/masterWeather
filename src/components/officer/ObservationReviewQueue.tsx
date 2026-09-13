import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useMockData } from '../../context/MockDataContext';
import { useTranslation } from '../../i18n/useTranslation';
import { PANCHAYATS } from '../../data/panchayats';
import { CROPS } from '../../data/crops';
import type { FarmerObservation } from '../../types/observation';
import { Modal } from '../common/Modal';
import {
  Eye,
  CheckCircle,
  XCircle,
  Flag,
  Clock,
  Filter,
  AlertTriangle,
  MapPin,
  Calendar,
  Search,
  CheckCheck
} from 'lucide-react';

export const ObservationReviewQueue: React.FC = () => {
  const { language } = useApp();
  const { observations, updateObservationStatus } = useMockData();
  const { t } = useTranslation(language);

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [panchayatFilter, setPanchayatFilter] = useState<string>('all');
  const [cropFilter, setCropFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [selectedObs, setSelectedObs] = useState<FarmerObservation | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reviewNote, setReviewNote] = useState('');

  const handleAction = (status: 'verified' | 'flagged' | 'rejected') => {
    if (!selectedObs) return;
    updateObservationStatus(
      selectedObs.id,
      status,
      'Shri Manoj Patidar (Agricultural Extension Officer, Phanda)',
      reviewNote || (status === 'verified' ? 'Ground observation verified against AWS telemetry.' : status === 'flagged' ? 'Flagged for on-site inspection due to AWS anomaly.' : 'Outlier or inconsistent report rejected.'),
      reviewNote || (status === 'verified' ? 'जमीनी अवलोकन एडब्ल्यूएस डेटा से सत्यापित।' : status === 'flagged' ? 'संदेहास्पद / क्षेत्रीय निरीक्षण हेतु चिह्नित।' : 'असंगत रिपोर्ट अस्वीकृत।')
    );
    setIsModalOpen(false);
    setReviewNote('');
  };

  const filteredObservations = observations.filter((obs) => {
    if (statusFilter !== 'all' && obs.status !== statusFilter) return false;
    if (panchayatFilter !== 'all' && obs.panchayatId !== panchayatFilter) return false;
    if (cropFilter !== 'all' && obs.cropId !== cropFilter) return false;
    
    if (dateFilter === 'today') {
      const today = new Date().toISOString().slice(0, 10);
      if (!obs.submittedAt.startsWith(today)) return false;
    } else if (dateFilter === '3days') {
      const threeDaysAgo = new Date(Date.now() - 3 * 86400000).toISOString().slice(0, 10);
      if (obs.submittedAt.slice(0, 10) < threeDaysAgo) return false;
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const matchName = obs.farmerName?.toLowerCase().includes(query);
      const matchVillage = obs.villageNameEn?.toLowerCase().includes(query) || obs.villageNameHi?.toLowerCase().includes(query);
      const matchPanchayat = obs.panchayatNameEn?.toLowerCase().includes(query) || obs.panchayatNameHi?.toLowerCase().includes(query);
      const matchNotes = obs.pestSymptomsEn?.toLowerCase().includes(query) || obs.cropStressNotesEn?.toLowerCase().includes(query);
      if (!matchName && !matchVillage && !matchPanchayat && !matchNotes) return false;
    }

    return true;
  });

  const pendingCount = observations.filter((o) => o.status === 'pending').length;
  const verifiedCount = observations.filter((o) => o.status === 'verified').length;
  const flaggedCount = observations.filter((o) => o.status === 'flagged').length;

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
        <div>
          <h2 className="font-bold text-base sm:text-lg text-slate-900 flex items-center gap-2">
            <Eye size={20} className="text-emerald-700" />
            <span>{language === 'hi' ? 'किसान खेत अवलोकन समीक्षा एवं सत्यापन' : 'Farmer Field Observation Review & Verification'}</span>
          </h2>
          <p className="text-xs text-slate-500">
            {language === 'hi'
              ? 'किसानों द्वारा दर्ज वर्षा, मृदा नमी एवं कीट प्रकोप रिपोर्ट का सत्यापन एवं संदेहास्पद रिपोर्ट फ़्लैगिंग'
              : 'Review citizen-science ground reports, cross-verify against AWS telemetry, and flag suspicious anomalies'}
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg font-semibold flex items-center gap-1.5">
            <Clock size={13} />
            <span>{pendingCount} {language === 'hi' ? 'लंबित' : 'Pending'}</span>
          </span>
          <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg font-semibold flex items-center gap-1.5">
            <CheckCheck size={13} />
            <span>{verifiedCount} {language === 'hi' ? 'सत्यापित' : 'Verified'}</span>
          </span>
        </div>
      </div>

      {/* Filter Control Bar */}
      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2.5 text-xs">
        <div className="flex flex-wrap items-center justify-between gap-2">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 custom-scrollbar">
            {[
              { id: 'all', label: language === 'hi' ? 'सभी रिपोर्ट' : 'All', count: observations.length },
              { id: 'pending', label: language === 'hi' ? 'लंबित' : 'Pending', count: pendingCount },
              { id: 'verified', label: language === 'hi' ? 'सत्यापित' : 'Verified', count: verifiedCount },
              { id: 'flagged', label: language === 'hi' ? 'फ़्लैग्ड / निरीक्षण' : 'Flagged / Inspect', count: flaggedCount },
              { id: 'rejected', label: language === 'hi' ? 'अस्वीकृत' : 'Rejected', count: observations.filter((o) => o.status === 'rejected').length },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer whitespace-nowrap border ${
                  statusFilter === tab.id
                    ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`ml-1.5 text-[10px] px-1.5 py-0.2 rounded-full ${
                  statusFilter === tab.id ? 'bg-emerald-900 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[200px] flex-1 sm:flex-initial">
            <Search size={14} className="absolute left-2.5 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder={language === 'hi' ? 'किसान, गांव या लक्षण खोजें...' : 'Search farmer, village, notes...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Dropdowns for Panchayat, Crop, and Date */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 border-t border-slate-200/80">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium shrink-0 flex items-center gap-1">
              <MapPin size={12} className="text-emerald-700" />
              <span>{language === 'hi' ? 'पंचायत:' : 'Panchayat:'}</span>
            </span>
            <select
              value={panchayatFilter}
              onChange={(e) => setPanchayatFilter(e.target.value)}
              className="w-full p-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-800"
            >
              <option value="all">{language === 'hi' ? 'सभी 5 ग्राम पंचायतें' : 'All 5 Panchayats'}</option>
              {PANCHAYATS.map((gp) => (
                <option key={gp.id} value={gp.id}>
                  {language === 'hi' ? gp.nameHi : gp.nameEn}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium shrink-0 flex items-center gap-1">
              <Filter size={12} className="text-emerald-700" />
              <span>{language === 'hi' ? 'फसल:' : 'Crop:'}</span>
            </span>
            <select
              value={cropFilter}
              onChange={(e) => setCropFilter(e.target.value)}
              className="w-full p-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-800"
            >
              <option value="all">{language === 'hi' ? 'सभी फसलें (All Crops)' : 'All Crops'}</option>
              {CROPS.map((c) => (
                <option key={c.id} value={c.id}>
                  {language === 'hi' ? c.nameHi : c.nameEn}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium shrink-0 flex items-center gap-1">
              <Calendar size={12} className="text-emerald-700" />
              <span>{language === 'hi' ? 'समय अवधि:' : 'Timeframe:'}</span>
            </span>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full p-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-800"
            >
              <option value="all">{language === 'hi' ? 'सभी तिथियां (All Time)' : 'All Time'}</option>
              <option value="today">{language === 'hi' ? 'आज (Today)' : 'Today'}</option>
              <option value="3days">{language === 'hi' ? 'पिछले 3 दिन (Past 3 Days)' : 'Past 3 Days'}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Mobile Observations Cards (< md) */}
      <div className="md:hidden space-y-3">
        {filteredObservations.length === 0 ? (
          <div className="py-8 text-center text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-xs">
            {language === 'hi' ? 'कोई अवलोकन रिपोर्ट नहीं मिली।' : 'No observation reports found.'}
          </div>
        ) : (
          filteredObservations.map((obs) => (
            <div
              key={obs.id}
              className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5"
            >
              <div className="flex items-center justify-between gap-2">
                <div>
                  <span className="font-bold text-slate-900 text-xs sm:text-sm block">{obs.farmerName}</span>
                  <span className="text-[11px] text-slate-500">{obs.villageNameEn}, GP {obs.panchayatNameEn}</span>
                </div>
                {obs.status === 'verified' && (
                  <span className="inline-flex items-center gap-1 text-[11px] text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded-md">
                    <CheckCircle size={12} />
                    Verified
                  </span>
                )}
                {obs.status === 'pending' && (
                  <span className="inline-flex items-center gap-1 text-[11px] text-amber-800 font-bold bg-amber-100 px-2 py-0.5 rounded-md">
                    <Clock size={12} />
                    Pending
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs bg-white p-2.5 rounded-xl border border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-400 block">Rain / Soil</span>
                  <span className="font-bold text-slate-800">{obs.observedRainfallMm || 0}mm • {obs.soilCondition}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Crop / Stage</span>
                  <span className="font-bold text-slate-800 capitalize">{obs.cropId} ({obs.cropStageEn})</span>
                </div>
              </div>

              <p className="text-xs text-slate-700 font-medium">
                {obs.pestSymptomsEn || obs.cropStressNotesEn || (language === 'hi' ? 'सामान्य फसल स्थिति' : 'Normal crop condition')}
              </p>

              <div className="flex items-center justify-between pt-1 border-t border-slate-200 text-xs text-slate-400 font-mono">
                <span>{obs.submittedAt.slice(0, 16)}</span>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedObs(obs);
                    setIsModalOpen(true);
                  }}
                  className="px-3 py-1.5 min-h-[38px] bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl"
                >
                  {language === 'hi' ? 'समीक्षा करें' : 'Review'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Observations Desktop Table (>= md) */}
      <div className="hidden md:block overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
              <th className="py-3 px-3">Date / ID</th>
              <th className="py-3 px-3">{language === 'hi' ? 'किसान व स्थान' : 'Farmer & Village'}</th>
              <th className="py-3 px-3">{language === 'hi' ? 'फसल अवस्था' : 'Crop Stage'}</th>
              <th className="py-3 px-3">{language === 'hi' ? 'दर्ज वर्षा / नमी' : 'Rainfall / Soil'}</th>
              <th className="py-3 px-3">{language === 'hi' ? 'कीट लक्षण / टिप्पणी' : 'Pest Symptoms / Notes'}</th>
              <th className="py-3 px-3">{language === 'hi' ? 'स्थिति' : 'Status'}</th>
              <th className="py-3 px-3 text-right">{language === 'hi' ? 'कार्रवाई' : 'Action'}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {filteredObservations.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-400">
                  {language === 'hi' ? 'चयनित फ़िल्टर के अनुसार कोई अवलोकन रिपोर्ट उपलब्ध नहीं है।' : 'No observations found matching the selected filters.'}
                </td>
              </tr>
            ) : (
              filteredObservations.map((obs) => {
                const isRainAnomaly = (obs.observedRainfallMm || 0) > 40; // >40mm when AWS was low
                return (
                  <tr key={obs.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                      <span className="font-bold text-slate-800">{obs.submittedAt.slice(0, 10)}</span>
                      <span className="block text-[10px] text-slate-400">{obs.submittedAt.slice(11, 16)}</span>
                      <span className="text-[9px] text-slate-400">#{obs.id.slice(-6)}</span>
                    </td>

                    <td className="py-3 px-3">
                      <span className="font-bold text-slate-900 block">{obs.farmerName}</span>
                      <span className="text-[11px] text-slate-500">
                        {obs.villageNameEn}, GP {obs.panchayatNameEn}
                      </span>
                    </td>

                    <td className="py-3 px-3">
                      <span className="font-semibold text-slate-800 block capitalize">{obs.cropId}</span>
                      <span className="text-[11px] text-slate-500">{obs.cropStageEn}</span>
                    </td>

                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-sky-700 block">{obs.observedRainfallMm || 0} mm</span>
                        {isRainAnomaly && (
                          <span className="px-1.5 py-0.2 bg-amber-100 text-amber-900 rounded text-[9px] font-bold" title="Higher than local AWS reading">
                            AWS Spike
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-500 capitalize">Soil: {obs.soilCondition}</span>
                    </td>

                    <td className="py-3 px-3 max-w-[220px]">
                      <span className="line-clamp-1 font-medium text-slate-800">
                        {obs.pestSymptomsEn || obs.cropStressNotesEn || (language === 'hi' ? 'सामान्य स्थिति' : 'Normal conditions')}
                      </span>
                      {obs.reviewNotesEn && (
                        <span className="text-[10px] text-emerald-700 block italic line-clamp-1">
                          AEO: {obs.reviewNotesEn}
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-3 whitespace-nowrap">
                      {obs.status === 'verified' && (
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          <CheckCircle size={12} />
                          Verified
                        </span>
                      )}
                      {obs.status === 'pending' && (
                        <span className="inline-flex items-center gap-1 text-[11px] text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded border border-amber-200 animate-pulse">
                          <Clock size={12} />
                          Pending Review
                        </span>
                      )}
                      {obs.status === 'flagged' && (
                        <span className="inline-flex items-center gap-1 text-[11px] text-orange-700 font-semibold bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                          <Flag size={12} />
                          Field Visit / Suspicious
                        </span>
                      )}
                      {obs.status === 'rejected' && (
                        <span className="inline-flex items-center gap-1 text-[11px] text-rose-700 font-semibold bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                          <XCircle size={12} />
                          Rejected
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-3 text-right whitespace-nowrap">
                      <button
                        onClick={() => {
                          setSelectedObs(obs);
                          setReviewNote(obs.reviewNotesEn || '');
                          setIsModalOpen(true);
                        }}
                        className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-semibold rounded-lg cursor-pointer transition-colors"
                      >
                        {language === 'hi' ? 'समीक्षा करें' : 'Review'}
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Observation Modal */}
      {selectedObs && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={language === 'hi' ? 'किसान अवलोकन सत्यापन एवं फ़्लैगिंग' : 'Validate / Flag Citizen Agromet Report'}
          maxWidth="lg"
        >
          <div className="space-y-4 text-xs sm:text-sm">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 grid grid-cols-2 gap-3">
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Farmer Name</span>
                <span className="font-bold text-slate-800">{selectedObs.farmerName}</span>
                <span className="text-xs text-slate-500 block">{selectedObs.contactNumber || 'Ph: +91 98260 XXXXX'}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Location & Stamp</span>
                <span className="font-bold text-slate-800">{selectedObs.villageNameEn}, GP {selectedObs.panchayatNameEn}</span>
                <span className="text-xs text-slate-500 block">Submitted: {selectedObs.submittedAt.slice(0, 16)}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 bg-emerald-50/70 p-3 rounded-xl border border-emerald-100 text-center">
              <div>
                <span className="text-[10px] text-slate-500 block">Reported Rainfall</span>
                <span className="font-bold text-sky-800 text-base">{selectedObs.observedRainfallMm || 0} mm</span>
                <span className="text-[10px] text-slate-500 block capitalize">({selectedObs.observedRainfallCategory})</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Soil Moisture</span>
                <span className="font-bold text-emerald-900 text-base capitalize">{selectedObs.soilCondition}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Crop & Phenology</span>
                <span className="font-bold text-slate-800 text-xs truncate block capitalize">{selectedObs.cropId}</span>
                <span className="text-[10px] text-slate-500">{selectedObs.cropStageEn}</span>
              </div>
            </div>

            {selectedObs.pestSymptomsEn && (
              <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 text-purple-950">
                <span className="font-bold block text-xs mb-0.5">Observed Pest / Disease Symptoms:</span>
                <p>{selectedObs.pestSymptomsEn}</p>
              </div>
            )}

            {selectedObs.cropStressNotesEn && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-800">
                <span className="font-bold block text-xs mb-0.5">Farmer Field Notes:</span>
                <p>{selectedObs.cropStressNotesEn}</p>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'hi' ? 'कृषि अधिकारी सत्यापन / निरीक्षण निर्देश टिप्पणी' : 'Agronomist Validation / Field Inspection Note'}
              </label>
              <textarea
                rows={2}
                value={reviewNote}
                onChange={(e) => setReviewNote(e.target.value)}
                placeholder="e.g. Observation aligns with radar sweep. Advised neem oil spray and field drainage clearance."
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => handleAction('rejected')}
                className="px-3 py-1.5 border border-rose-300 text-rose-700 hover:bg-rose-50 rounded-xl font-semibold cursor-pointer text-xs"
              >
                {language === 'hi' ? 'अस्वीकृत करें (Reject)' : 'Reject Report'}
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleAction('flagged')}
                  className="px-3.5 py-1.5 bg-orange-100 text-orange-900 hover:bg-orange-200 border border-orange-300 rounded-xl font-semibold cursor-pointer text-xs flex items-center gap-1.5"
                >
                  <AlertTriangle size={14} className="text-orange-700" />
                  <span>{language === 'hi' ? 'संदेहास्पद / स्थल निरीक्षण फ़्लैग करें' : 'Flag Suspicious / Field Visit'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleAction('verified')}
                  className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-xs cursor-pointer text-xs flex items-center gap-1.5"
                >
                  <CheckCircle size={14} />
                  <span>{t.btnVerifyObservation}</span>
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

