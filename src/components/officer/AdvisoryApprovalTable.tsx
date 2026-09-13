import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useMockData } from '../../context/MockDataContext';
import { useTranslation } from '../../i18n/useTranslation';
import type { AgrometAdvisory } from '../../types/advisory';
import { RiskBadge } from '../RiskBadge';
import { Modal } from '../common/Modal';
import { PermissionGate } from '../auth/PermissionGate';
import {
  CheckCircle2,
  XCircle,
  Clock,
  PlusCircle,
  FileCheck,
} from 'lucide-react';

export const AdvisoryApprovalTable: React.FC = () => {
  const { language } = useApp();
  const { advisories, updateAdvisoryStatus, createAdvisory } = useMockData();
  const { t } = useTranslation(language);

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedAdvisory, setSelectedAdvisory] = useState<AgrometAdvisory | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // New advisory form state
  const [newTitleEn, setNewTitleEn] = useState('');
  const [newTitleHi, setNewTitleHi] = useState('');
  const [newSummaryEn, setNewSummaryEn] = useState('');
  const [newSummaryHi, setNewSummaryHi] = useState('');
  const [newDetailedEn, setNewDetailedEn] = useState('');
  const [newDetailedHi, setNewDetailedHi] = useState('');
  const [newPanchayatId, setNewPanchayatId] = useState('acharpura');
  const [newCropId, setNewCropId] = useState<'soybean' | 'wheat' | 'chickpea'>('soybean');
  const [newRiskLevel, setNewRiskLevel] = useState<'normal' | 'advisory' | 'warning' | 'critical'>('warning');
  const [newSourceAuthority, setNewSourceAuthority] = useState('KVK Bhopal Agromet Advisory Bulletin #42');

  const filteredAdvisories = advisories.filter((adv) => {
    if (statusFilter === 'all') return true;
    if (statusFilter === 'published') return adv.approvalStatus === 'approved';
    return adv.approvalStatus === statusFilter;
  });

  const handleApprove = (id: string) => {
    updateAdvisoryStatus(id, 'approved', 'Dr. R. K. Sharma (Senior Agromet Officer, Phanda Command)');
    if (selectedAdvisory?.id === id) {
      setIsReviewModalOpen(false);
    }
  };

  const handleReject = (id: string) => {
    updateAdvisoryStatus(id, 'rejected', 'Dr. R. K. Sharma (Senior Agromet Officer, Phanda Command)');
    if (selectedAdvisory?.id === id) {
      setIsReviewModalOpen(false);
    }
  };

  const handleCreateSubmit = (e: React.FormEvent, asDraft = false) => {
    e.preventDefault();
    createAdvisory({
      panchayatId: newPanchayatId,
      panchayatNameEn: newPanchayatId === 'acharpura' ? 'Acharpura' : newPanchayatId === 'bangrasia' ? 'Bangrasia' : newPanchayatId === 'ratibad' ? 'Ratibad' : newPanchayatId === 'samasgarh' ? 'Samasgarh' : 'Sukhi Sewaniya',
      panchayatNameHi: newPanchayatId === 'acharpura' ? 'आचारपुरा' : newPanchayatId === 'bangrasia' ? 'बंगरसिया' : newPanchayatId === 'ratibad' ? 'रातीबड़' : newPanchayatId === 'samasgarh' ? 'समसगढ़' : 'सूखी सेवनिया',
      cropId: newCropId,
      stageId: 'soy_pod_dev',
      stageNameEn: 'Pod Development',
      stageNameHi: 'फली विकास',
      type: 'pest_management',
      riskLevel: newRiskLevel,
      titleEn: newTitleEn,
      titleHi: newTitleHi || newTitleEn,
      shortSummaryEn: newSummaryEn,
      shortSummaryHi: newSummaryHi || newSummaryEn,
      detailedActionEn: newDetailedEn,
      detailedActionHi: newDetailedHi || newDetailedEn,
      audioScriptEn: newSummaryEn,
      audioScriptHi: newSummaryHi || newSummaryEn,
      weatherTriggerEn: 'Officer verified agromet conditions.',
      weatherTriggerHi: 'अधिकारी द्वारा सत्यापित मौसम दशाएं।',
      sourceAuthorityEn: newSourceAuthority || 'KVK Bhopal & Directorate of Agriculture',
      sourceAuthorityHi: 'कृषि विज्ञान केंद्र भोपाल एवं कृषि विभाग',
      confidence: 'high',
      approvalStatus: asDraft ? 'draft' as any : 'approved',
      approvedBy: asDraft ? undefined : 'Dr. R. K. Sharma',
      approvedAt: asDraft ? undefined : new Date().toISOString(),
      validUntil: '2026-09-20T23:59:59+05:30',
    });

    setIsCreateModalOpen(false);
    setNewTitleEn('');
    setNewTitleHi('');
    setNewSummaryEn('');
    setNewSummaryHi('');
    setNewDetailedEn('');
    setNewDetailedHi('');
  };

  const statusTabs = [
    { id: 'all', labelHi: 'सभी सलाह', labelEn: 'All Advisories' },
    { id: 'pending_review', labelHi: 'समीक्षाधीन (Pending)', labelEn: 'Pending Review' },
    { id: 'approved', labelHi: 'स्वीकृत एवं प्रकाशित', labelEn: 'Approved / Published' },
    { id: 'draft', labelHi: 'ड्राफ़्ट (Drafts)', labelEn: 'Drafts' },
    { id: 'rejected', labelHi: 'अस्वीकृत (Rejected)', labelEn: 'Rejected' },
  ];

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-4">
      {/* Header & New Advisory Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <h2 className="font-bold text-base sm:text-lg text-slate-900 flex items-center gap-2">
            <FileCheck size={20} className="text-emerald-700" />
            <span>{language === 'hi' ? 'कृषि मौसम सलाह अनुमोदन एवं प्रकाशन नियंत्रण' : 'Agromet Advisory Review & Approval Workflow'}</span>
          </h2>
          <p className="text-xs text-slate-500">
            {language === 'hi' ? 'सलाह प्रकाशित करने से पूर्व वैज्ञानिक सत्यापन सुनिश्चित करें।' : 'Strict validation required before broadcasting advice to farmer app channels.'}
          </p>
        </div>

        <PermissionGate permission="manage_advisories" disabledMode disabledTooltip="Requires Officer or Admin advisory management privileges">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs transition-all shadow-xs cursor-pointer shrink-0"
          >
            <PlusCircle size={15} />
            <span>{language === 'hi' ? 'नई सलाह तैयार करें' : 'Create New Advisory'}</span>
          </button>
        </PermissionGate>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
        {statusTabs.map((tab) => {
          const isSelected = statusFilter === tab.id;
          const count = tab.id === 'all'
            ? advisories.length
            : advisories.filter((a) => a.approvalStatus === tab.id).length;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 border ${
                isSelected
                  ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <span>{language === 'hi' ? tab.labelHi : tab.labelEn}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                isSelected ? 'bg-emerald-900 text-white' : 'bg-slate-200 text-slate-700'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Advisory Queue Table */}
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
              <th className="py-3 px-3">ID / Ver</th>
              <th className="py-3 px-3">{language === 'hi' ? 'पंचायत / फसल' : 'Panchayat / Crop'}</th>
              <th className="py-3 px-3">{language === 'hi' ? 'सलाह शीर्षक' : 'Advisory Title'}</th>
              <th className="py-3 px-3">{language === 'hi' ? 'स्रोत संदर्भ' : 'Source Reference'}</th>
              <th className="py-3 px-3">{language === 'hi' ? 'जोखिम' : 'Risk'}</th>
              <th className="py-3 px-3">{language === 'hi' ? 'स्थिति' : 'Status'}</th>
              <th className="py-3 px-3">{language === 'hi' ? 'प्रतिक्रिया' : 'Farmer Votes'}</th>
              <th className="py-3 px-3 text-right">{language === 'hi' ? 'कार्रवाई' : 'Actions'}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {filteredAdvisories.map((adv) => (
              <tr key={adv.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3 px-3 font-mono text-[11px] text-slate-500">
                  <div className="font-bold text-slate-900">{adv.id}</div>
                  <span className="text-[10px] bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200">
                    v1.2
                  </span>
                </td>

                <td className="py-3 px-3">
                  <span className="font-bold text-slate-900 block">
                    {language === 'hi' ? adv.panchayatNameHi : adv.panchayatNameEn}
                  </span>
                  <span className="text-[11px] text-slate-500 capitalize">
                    {adv.cropId} • {language === 'hi' ? adv.stageNameHi : adv.stageNameEn}
                  </span>
                </td>

                <td className="py-3 px-3 max-w-[240px]">
                  <span className="font-semibold text-slate-900 line-clamp-1">
                    {language === 'hi' ? adv.titleHi : adv.titleEn}
                  </span>
                  <span className="text-[11px] text-slate-500 line-clamp-1">
                    {language === 'hi' ? adv.shortSummaryHi : adv.shortSummaryEn}
                  </span>
                </td>

                <td className="py-3 px-3 max-w-[160px]">
                  <span className="text-[11px] font-medium text-slate-700 truncate block">
                    {language === 'hi' ? adv.sourceAuthorityHi : adv.sourceAuthorityEn}
                  </span>
                  {adv.approvedBy && (
                    <span className="text-[10px] text-emerald-700 block truncate">
                      ✓ {adv.approvedBy}
                    </span>
                  )}
                </td>

                <td className="py-3 px-3">
                  <RiskBadge severity={adv.riskLevel} size="sm" />
                </td>

                <td className="py-3 px-3">
                  {adv.approvalStatus === 'approved' && (
                    <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                      <CheckCircle2 size={12} />
                      {language === 'hi' ? 'स्वीकृत' : 'Approved'}
                    </span>
                  )}
                  {adv.approvalStatus === 'pending_review' && (
                    <span className="inline-flex items-center gap-1 text-[11px] text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded animate-pulse">
                      <Clock size={12} />
                      {language === 'hi' ? 'समीक्षाधीन' : 'Pending Review'}
                    </span>
                  )}
                  {adv.approvalStatus === 'rejected' && (
                    <span className="inline-flex items-center gap-1 text-[11px] text-rose-700 font-semibold bg-rose-50 px-2 py-0.5 rounded">
                      <XCircle size={12} />
                      {language === 'hi' ? 'अस्वीकृत' : 'Rejected'}
                    </span>
                  )}
                </td>

                <td className="py-3 px-3">
                  <span className="text-emerald-700 font-semibold">+{adv.helpfulCount}</span>
                  <span className="text-slate-400 mx-1">/</span>
                  <span className="text-rose-700 font-semibold">-{adv.unhelpfulCount}</span>
                </td>

                <td className="py-3 px-3 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => {
                        setSelectedAdvisory(adv);
                        setIsReviewModalOpen(true);
                      }}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium cursor-pointer"
                    >
                      {language === 'hi' ? 'समीक्षा' : 'Review'}
                    </button>
                    {adv.approvalStatus === 'pending_review' && (
                      <PermissionGate permission="approve_advisories" disabledMode disabledTooltip="Only Officer or Admin can approve advisories">
                        <button
                          onClick={() => handleApprove(adv.id)}
                          className="p-1 text-emerald-700 hover:bg-emerald-50 rounded-lg cursor-pointer"
                          title={t.btnApproveAdvisory}
                        >
                          <CheckCircle2 size={16} />
                        </button>
                      </PermissionGate>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Review Modal */}
      {selectedAdvisory && (
        <Modal
          isOpen={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
          title={language === 'hi' ? 'कृषि सलाह विस्तृत समीक्षा' : 'Advisory Detailed Review'}
          maxWidth="xl"
        >
          <div className="space-y-3 text-xs sm:text-sm">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="font-bold text-slate-800">
                {selectedAdvisory.panchayatNameEn} • {selectedAdvisory.cropId.toUpperCase()} ({selectedAdvisory.stageNameEn})
              </span>
              <RiskBadge severity={selectedAdvisory.riskLevel} size="sm" />
            </div>

            <div>
              <span className="font-bold text-slate-900 block text-sm">
                {language === 'hi' ? selectedAdvisory.titleHi : selectedAdvisory.titleEn}
              </span>
              <p className="text-slate-600 mt-1">
                {language === 'hi' ? selectedAdvisory.shortSummaryHi : selectedAdvisory.shortSummaryEn}
              </p>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
              <span className="font-bold text-slate-700 block text-xs">{t.detailedGuidance}:</span>
              <p className="text-slate-700 leading-relaxed">
                {language === 'hi' ? selectedAdvisory.detailedActionHi : selectedAdvisory.detailedActionEn}
              </p>
            </div>

            <div className="bg-amber-50 p-2.5 rounded-xl border border-amber-200 text-amber-950 text-xs">
              <span className="font-bold">{t.weatherTrigger}: </span>
              <span>{language === 'hi' ? selectedAdvisory.weatherTriggerHi : selectedAdvisory.weatherTriggerEn}</span>
            </div>

            {selectedAdvisory.approvedBy && (
              <div className="text-xs text-slate-500 italic">
                {t.approvedByOfficer}: {selectedAdvisory.approvedBy} ({selectedAdvisory.approvedAt?.slice(0, 10)})
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => handleReject(selectedAdvisory.id)}
                className="px-3.5 py-2 rounded-xl border border-rose-300 text-rose-700 hover:bg-rose-50 font-semibold cursor-pointer"
              >
                {t.btnRejectAdvisory}
              </button>
              <button
                type="button"
                onClick={() => handleApprove(selectedAdvisory.id)}
                className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold shadow-xs cursor-pointer"
              >
                {t.btnApproveAdvisory}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Create New Advisory Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title={language === 'hi' ? 'नई अधिकृत कृषि सलाह जारी करें' : 'Create & Publish Approved Advisory'}
        maxWidth="lg"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-3 text-xs sm:text-sm">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Panchayat</label>
              <select
                value={newPanchayatId}
                onChange={(e) => setNewPanchayatId(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-xl text-xs bg-white"
              >
                <option value="acharpura">Acharpura</option>
                <option value="bangrasia">Bangrasia</option>
                <option value="ratibad">Ratibad</option>
                <option value="samasgarh">Samasgarh</option>
                <option value="sukhi_sewaniya">Sukhi Sewaniya</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Crop & Risk Level</label>
              <div className="grid grid-cols-2 gap-1">
                <select
                  value={newCropId}
                  onChange={(e) => setNewCropId(e.target.value as any)}
                  className="p-2 border border-slate-300 rounded-xl text-xs bg-white"
                >
                  <option value="soybean">Soybean</option>
                  <option value="wheat">Wheat</option>
                  <option value="chickpea">Chickpea</option>
                </select>
                <select
                  value={newRiskLevel}
                  onChange={(e) => setNewRiskLevel(e.target.value as any)}
                  className="p-2 border border-slate-300 rounded-xl text-xs bg-white"
                >
                  <option value="advisory">Advisory</option>
                  <option value="warning">Warning</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Title (English / Hindi)</label>
            <input
              type="text"
              required
              placeholder="e.g. Pod borer control measures in chickpea"
              value={newTitleEn}
              onChange={(e) => setNewTitleEn(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs mb-1.5"
            />
            <input
              type="text"
              placeholder="उदा. चने में फली छेदक इल्ली नियंत्रण सलाह"
              value={newTitleHi}
              onChange={(e) => setNewTitleHi(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Short Summary</label>
            <input
              type="text"
              required
              placeholder="Summary for mobile card preview"
              value={newSummaryEn}
              onChange={(e) => setNewSummaryEn(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Source Authority Reference</label>
            <input
              type="text"
              placeholder="e.g. KVK Bhopal Agromet Bulletin #42 / ICAR-IISR Package of Practices"
              value={newSourceAuthority}
              onChange={(e) => setNewSourceAuthority(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Detailed Technical Guidance</label>
            <textarea
              rows={3}
              required
              placeholder="Detailed crop stage mitigation recommendations based on approved ICAR/KVK package of practices."
              value={newDetailedEn}
              onChange={(e) => setNewDetailedEn(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="px-3.5 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
            >
              {t.cancel}
            </button>
            <button
              type="button"
              onClick={(e) => handleCreateSubmit(e, true)}
              className="px-3.5 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl cursor-pointer border border-slate-300"
            >
              {language === 'hi' ? 'ड्राफ़्ट के रूप में सहेजें' : 'Save as Draft'}
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl cursor-pointer shadow-xs"
            >
              {language === 'hi' ? 'स्वीकृत करें व प्रकाशित करें' : 'Publish Advisory'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
