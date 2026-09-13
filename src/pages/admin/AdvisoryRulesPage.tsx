import React, { useState, useMemo } from 'react';
import { useMockData } from '../../context/MockDataContext';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import type { AdvisoryRule, RuleApprovalStatus } from '../../types/knowledgeBase';
import type { CropId } from '../../types/crop';
import type { RiskCategory } from '../../types/risk';
import { RuleEditorModal } from '../../components/admin/RuleEditorModal';
import { RuleReviewModal } from '../../components/admin/RuleReviewModal';
import { RuleVersionHistoryModal } from '../../components/admin/RuleVersionHistoryModal';
import {
  Sliders,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  FileEdit,
  History,
  ShieldCheck,
  Building2,
  Trash2,
  Flame,
  AlertTriangle,
  RotateCcw,
  BookOpen,
  LayoutGrid,
  List,
  Sparkles,
} from 'lucide-react';

export const AdvisoryRulesPage: React.FC = () => {
  const {
    advisoryRules,
    createRule,
    updateRule,
    reviewRule,
    publishRule,
    rejectRule,
    deleteRule,
    resetRulesToDefault,
  } = useMockData();

  const { language } = useApp();
  const { user } = useAuth();
  const isHi = language === 'hi';

  const currentUser = {
    name: user ? (isHi ? user.nameHi : user.nameEn) : 'Dr. R. K. Sharma (Senior Agromet Officer)',
    role: user?.role || 'admin',
  };

  // State for search and filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCrop, setSelectedCrop] = useState<CropId | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<RuleApprovalStatus | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<RiskCategory | 'all'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Modals state
  const [editorModalOpen, setEditorModalOpen] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [activeRule, setActiveRule] = useState<AdvisoryRule | null>(null);

  // Filtered rules
  const filteredRules = useMemo(() => {
    return advisoryRules.filter((rule) => {
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesCode = rule.ruleCode.toLowerCase().includes(q);
        const matchesCrop =
          rule.cropNameEn.toLowerCase().includes(q) || rule.cropNameHi.includes(q);
        const matchesStage =
          rule.stageNameEn.toLowerCase().includes(q) || rule.stageNameHi.includes(q);
        const matchesTrigger =
          rule.weatherTriggerEn.toLowerCase().includes(q) ||
          rule.weatherTriggerHi.toLowerCase().includes(q);
        const matchesAction =
          rule.recommendedActionEn.toLowerCase().includes(q) ||
          rule.recommendedActionHi.includes(q);
        const matchesSource =
          rule.sourceOrganizationEn.toLowerCase().includes(q) ||
          rule.sourceReferenceEn.toLowerCase().includes(q);

        if (
          !matchesCode &&
          !matchesCrop &&
          !matchesStage &&
          !matchesTrigger &&
          !matchesAction &&
          !matchesSource
        ) {
          return false;
        }
      }

      // Crop filter
      if (selectedCrop !== 'all' && rule.cropId !== selectedCrop) {
        return false;
      }

      // Status filter
      if (selectedStatus !== 'all' && rule.approvalStatus !== selectedStatus) {
        return false;
      }

      // Category filter
      if (selectedCategory !== 'all' && rule.riskCategory !== selectedCategory) {
        return false;
      }

      return true;
    });
  }, [advisoryRules, searchQuery, selectedCrop, selectedStatus, selectedCategory]);

  // KPI Calculations
  const totalCount = advisoryRules.length;
  const publishedCount = advisoryRules.filter((r) => r.approvalStatus === 'published').length;
  const pendingCount = advisoryRules.filter((r) => r.approvalStatus === 'pending_review').length;
  const draftCount = advisoryRules.filter((r) => r.approvalStatus === 'draft').length;

  const handleOpenCreate = () => {
    setActiveRule(null);
    setEditorModalOpen(true);
  };

  const handleOpenEdit = (rule: AdvisoryRule) => {
    setActiveRule(rule);
    setEditorModalOpen(true);
  };

  const handleOpenReview = (rule: AdvisoryRule) => {
    setActiveRule(rule);
    setReviewModalOpen(true);
  };

  const handleOpenHistory = (rule: AdvisoryRule) => {
    setActiveRule(rule);
    setHistoryModalOpen(true);
  };

  const handleSaveRule = (ruleData: any, changeSummary: string) => {
    if (activeRule) {
      updateRule(activeRule.id, ruleData, changeSummary, currentUser.name);
    } else {
      createRule({
        ...ruleData,
        createdBy: currentUser.name,
      });
    }
  };

  const handleDeleteRule = (rule: AdvisoryRule) => {
    const confirmText = isHi
      ? `क्या आप वास्तव में नियम [${rule.ruleCode}] को हटाना चाहते हैं?`
      : `Are you sure you want to delete rule [${rule.ruleCode}]?`;
    if (window.confirm(confirmText)) {
      deleteRule(rule.id, currentUser.name);
    }
  };

  const getStatusBadge = (status: RuleApprovalStatus) => {
    switch (status) {
      case 'published':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
            {isHi ? 'लाइव प्रकाशित' : 'Published'}
          </span>
        );
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
            <CheckCircle2 size={12} />
            {isHi ? 'अनुमोदित' : 'Approved'}
          </span>
        );
      case 'pending_review':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
            <Clock size={12} />
            {isHi ? 'समीक्षाधीन' : 'Pending Review'}
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
            {isHi ? 'अस्वीकृत' : 'Rejected'}
          </span>
        );
      case 'archived':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
            {isHi ? 'संग्रहीत' : 'Archived'}
          </span>
        );
      case 'draft':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-200 text-slate-800 border border-slate-300">
            {isHi ? 'प्रारूप' : 'Draft'}
          </span>
        );
    }
  };

  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case 'critical':
      case 'severe':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 uppercase flex items-center gap-1">
            <Flame size={10} /> Critical
          </span>
        );
      case 'warning':
      case 'high':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 uppercase flex items-center gap-1">
            <AlertTriangle size={10} /> Warning
          </span>
        );
      case 'moderate':
      case 'advisory':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 uppercase">
            Advisory
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 uppercase">
            Normal
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Top Banner & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
              <BookOpen className="text-emerald-700" size={26} />
              <span>{isHi ? 'कृषि सलाह ज्ञानकोष एवं नियम इंजन' : 'Advisory Knowledge Base & Rules Engine'}</span>
            </h1>
            <span className="px-2.5 py-0.5 bg-purple-100 text-purple-800 text-xs font-bold rounded-full border border-purple-200">
              Phase 5
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-3xl">
            {isHi
              ? 'फंदा विकासखंड (भोपाल) हेतु मौसम ट्रिगर, फसल चरण उपयुक्तता एवं आईसीएआर-केवीके प्रमाणित कृषि सलाह नियम प्रबंधन।'
              : 'Rule-based parametric agromet decision system for Phanda block (Bhopal) aligned with ICAR-IISR, KVK Bhopal & JNKVV institutional guidelines.'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={resetRulesToDefault}
            title="Reset to initial seed rules"
            className="px-3 py-2 border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw size={14} />
            <span className="hidden sm:inline">{isHi ? 'पुनः सेट करें' : 'Reset Defaults'}</span>
          </button>

          <button
            onClick={handleOpenCreate}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-600/20 flex items-center gap-1.5 transition-colors"
          >
            <Plus size={16} />
            <span>{isHi ? 'नया नियम बनाएं' : 'Create Draft Rule'}</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase block">
              {isHi ? 'कुल नियम' : 'Total Rules'}
            </span>
            <span className="text-2xl font-black text-slate-900">{totalCount}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
            <Sliders size={20} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-emerald-200 shadow-xs flex items-center justify-between bg-linear-to-br from-white to-emerald-50/40">
          <div>
            <span className="text-[11px] font-bold text-emerald-800 uppercase block">
              {isHi ? 'सक्रिय प्रकाशित' : 'Published & Live'}
            </span>
            <span className="text-2xl font-black text-emerald-800">{publishedCount}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            <CheckCircle2 size={20} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-amber-200 shadow-xs flex items-center justify-between bg-linear-to-br from-white to-amber-50/40">
          <div>
            <span className="text-[11px] font-bold text-amber-800 uppercase block">
              {isHi ? 'समीक्षाधीन' : 'Pending Review'}
            </span>
            <span className="text-2xl font-black text-amber-800">{pendingCount}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
            <Clock size={20} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase block">
              {isHi ? 'प्रारूप नियम' : 'Drafts'}
            </span>
            <span className="text-2xl font-black text-slate-700">{draftCount}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
            <FileEdit size={20} />
          </div>
        </div>
      </div>

      {/* Compliance / Safeguards Alert */}
      <div className="bg-linear-to-r from-emerald-50 via-teal-50 to-blue-50 p-4 rounded-2xl border border-emerald-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5">
            <ShieldCheck size={18} />
          </div>
          <div>
            <h4 className="font-bold text-emerald-950 text-sm">
              {isHi ? 'संस्थागत संदर्भ एवं सुरक्षा दिशानिर्देश' : 'Institutional Safeguards & Compliance Notice'}
            </h4>
            <p className="text-slate-600 mt-0.5 leading-relaxed">
              {isHi
                ? 'सिस्टम में कोई भी स्वतंत्र अनधिकृत रासायनिक सलाह दर्ज नहीं की जा सकती। सभी नियम आईसीएआर-आईआईएसआर इंदौर, केवीके भोपाल व जेएनकेवीवी जबलपुर के अधिकृत पैकेज ऑफ प्रैक्टिस से संदर्भित हैं।'
                : 'PanchayatMausam AI strictly restricts unverified chemical treatment advice. All rules derive from verified ICAR-IISR Indore, KVK Bhopal (CIAE), and JNKVV package of practices.'}
            </p>
          </div>
        </div>
        <div className="shrink-0 flex items-center gap-1.5 text-emerald-800 font-semibold text-[11px] bg-white/80 px-3 py-1.5 rounded-xl border border-emerald-200">
          <Sparkles size={14} className="text-emerald-600" />
          <span>ICAR / KVK Aligned</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3.5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                isHi
                  ? 'नियम कोड, फसल, मौसम ट्रिगर, संस्थान या सारांश खोजें...'
                  : 'Search by rule code, crop, trigger keywords, source citation...'
              }
              className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
            />
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-2 self-end md:self-auto">
            <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Grid Card View"
              >
                <LayoutGrid size={15} />
                <span className="hidden sm:inline">Grid</span>
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                  viewMode === 'table'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Tabular View"
              >
                <List size={15} />
                <span className="hidden sm:inline">Table</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
          {/* Crop Filters */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase mr-1">
              {isHi ? 'फसल:' : 'Crop:'}
            </span>
            {(['all', 'soybean', 'wheat', 'chickpea'] as const).map((crop) => (
              <button
                key={crop}
                onClick={() => setSelectedCrop(crop)}
                className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                  selectedCrop === crop
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {crop === 'all'
                  ? isHi
                    ? 'सभी फसलें'
                    : 'All Crops'
                  : crop === 'soybean'
                  ? isHi
                    ? 'सोयाबीन'
                    : 'Soybean'
                  : crop === 'wheat'
                  ? isHi
                    ? 'गेहूं'
                    : 'Wheat'
                  : isHi
                  ? 'चना'
                  : 'Chickpea'}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase mr-1">
              {isHi ? 'स्थिति:' : 'Status:'}
            </span>
            {(['all', 'published', 'pending_review', 'approved', 'draft'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-colors capitalize ${
                  selectedStatus === st
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st === 'all'
                  ? isHi
                    ? 'सभी'
                    : 'All'
                  : st === 'published'
                  ? isHi
                    ? 'प्रकाशित'
                    : 'Published'
                  : st === 'pending_review'
                  ? isHi
                    ? 'समीक्षाधीन'
                    : 'Pending'
                  : st === 'approved'
                  ? isHi
                    ? 'अनुमोदित'
                    : 'Approved'
                  : isHi
                  ? 'प्रारूप'
                  : 'Draft'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Rules Count & Active Filters Indicator */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>
          {isHi
            ? `कुल ${filteredRules.length} नियम प्रदर्शित (कुल ${totalCount})`
            : `Showing ${filteredRules.length} of ${totalCount} rules`}
        </span>
        {(searchQuery || selectedCrop !== 'all' || selectedStatus !== 'all' || selectedCategory !== 'all') && (
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCrop('all');
              setSelectedStatus('all');
              setSelectedCategory('all');
            }}
            className="text-emerald-700 hover:underline font-bold"
          >
            {isHi ? 'सभी फ़िल्टर साफ़ करें' : 'Clear all filters'}
          </button>
        )}
      </div>

      {/* Empty State */}
      {filteredRules.length === 0 && (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
            <Search size={28} />
          </div>
          <h3 className="font-bold text-base text-slate-800">
            {isHi ? 'कोई नियम नहीं मिला' : 'No Advisory Rules Found'}
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {isHi
              ? 'आपके वर्तमान खोज या फ़िल्टर मानदंडों से कोई नियम मेल नहीं खाता।'
              : 'No parametric advisory rules match your search or filter selections.'}
          </p>
          <button
            onClick={handleOpenCreate}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors inline-flex items-center gap-1.5"
          >
            <Plus size={15} />
            <span>{isHi ? 'नया नियम बनाएं' : 'Create New Rule'}</span>
          </button>
        </div>
      )}

      {/* Grid Mode View */}
      {viewMode === 'grid' && filteredRules.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRules.map((rule) => (
            <div
              key={rule.id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group hover:border-emerald-300"
            >
              {/* Card Header */}
              <div className="p-4 border-b border-slate-100 bg-slate-50/60 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-black text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200 shadow-2xs">
                      {rule.ruleCode}
                    </span>
                    <span className="font-mono text-[11px] font-bold text-purple-800 bg-purple-100 px-1.5 py-0.2 rounded">
                      {rule.version}
                    </span>
                  </div>
                  <div>{getStatusBadge(rule.approvalStatus)}</div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <div className="font-bold text-slate-800">
                    {isHi ? rule.cropNameHi : rule.cropNameEn} •{' '}
                    <span className="text-slate-600 font-medium">
                      {isHi ? rule.stageNameHi : rule.stageNameEn}
                    </span>
                  </div>
                  <div>{getSeverityBadge(rule.severity)}</div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 space-y-3 text-xs flex-1">
                {/* Weather Trigger */}
                <div className="bg-amber-50/60 p-2.5 rounded-xl border border-amber-200/60 space-y-1">
                  <span className="text-[10px] font-bold text-amber-900 uppercase block">
                    {isHi ? 'मौसम ट्रिगर:' : 'Weather Trigger:'}
                  </span>
                  <p className="text-slate-800 font-medium leading-relaxed">
                    {isHi ? rule.weatherTriggerHi : rule.weatherTriggerEn}
                  </p>
                  {rule.thresholds && rule.thresholds.length > 0 && (
                    <div className="pt-1 flex flex-wrap gap-1">
                      {rule.thresholds.map((t, idx) => (
                        <span
                          key={idx}
                          className="font-mono text-[10px] font-bold px-1.5 py-0.5 bg-amber-100 text-amber-900 rounded"
                        >
                          {t.parameter.toUpperCase()} {t.operator} {t.value} {t.unit}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Recommended Action excerpt */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">
                    {isHi ? 'संस्तुत कार्यवाही:' : 'Action Guidelines:'}
                  </span>
                  <p className="text-slate-700 leading-relaxed line-clamp-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    {isHi ? rule.recommendedActionHi : rule.recommendedActionEn}
                  </p>
                </div>

                {/* Institutional Source Reference */}
                <div className="pt-2 border-t border-slate-100 flex items-start gap-1.5 text-[11px] text-slate-500">
                  <Building2 size={13} className="shrink-0 mt-0.5 text-slate-400" />
                  <div className="truncate">
                    <span className="font-semibold text-slate-700 block truncate">
                      {isHi ? rule.sourceOrganizationHi : rule.sourceOrganizationEn}
                    </span>
                    <span className="font-mono text-[10px] text-slate-400 block truncate">
                      {isHi ? rule.sourceReferenceHi : rule.sourceReferenceEn}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="px-4 py-2.5 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenHistory(rule)}
                    className="p-1.5 text-slate-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors"
                    title={isHi ? 'संस्करण इतिहास देखें' : 'View Version History'}
                  >
                    <History size={16} />
                  </button>
                  <button
                    onClick={() => handleOpenEdit(rule)}
                    className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                    title={isHi ? 'नियम संपादित करें' : 'Edit Rule'}
                  >
                    <FileEdit size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteRule(rule)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title={isHi ? 'नियम हटाएं' : 'Delete Rule'}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <button
                  onClick={() => handleOpenReview(rule)}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center gap-1 shadow-xs transition-colors"
                >
                  <ShieldCheck size={14} />
                  <span>{isHi ? 'समीक्षा / नियंत्रण' : 'Review & Publish'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Table Mode View */}
      {viewMode === 'table' && filteredRules.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                  <th className="py-3 px-3.5">Rule Code & Ver</th>
                  <th className="py-3 px-3.5">Crop & Stage</th>
                  <th className="py-3 px-3.5">Weather Trigger & Thresholds</th>
                  <th className="py-3 px-3.5">Severity</th>
                  <th className="py-3 px-3.5">Institutional Source</th>
                  <th className="py-3 px-3.5">Status</th>
                  <th className="py-3 px-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredRules.map((rule) => (
                  <tr key={rule.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Code & Version */}
                    <td className="py-3 px-3.5 font-mono text-xs whitespace-nowrap">
                      <div className="font-bold text-slate-900">{rule.ruleCode}</div>
                      <span className="text-[10px] text-purple-700 font-semibold bg-purple-50 px-1.5 py-0.2 rounded border border-purple-100">
                        {rule.version}
                      </span>
                    </td>

                    {/* Crop & Stage */}
                    <td className="py-3 px-3.5 whitespace-nowrap">
                      <div className="font-bold text-slate-900">
                        {isHi ? rule.cropNameHi : rule.cropNameEn}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {isHi ? rule.stageNameHi : rule.stageNameEn}
                      </div>
                    </td>

                    {/* Weather Trigger */}
                    <td className="py-3 px-3.5 max-w-[280px]">
                      <p className="line-clamp-2 text-slate-800 font-medium">
                        {isHi ? rule.weatherTriggerHi : rule.weatherTriggerEn}
                      </p>
                      {rule.thresholds && rule.thresholds.length > 0 && (
                        <div className="pt-1 flex flex-wrap gap-1">
                          {rule.thresholds.map((t, idx) => (
                            <span
                              key={idx}
                              className="font-mono text-[9px] font-bold px-1.5 py-0.2 bg-amber-50 text-amber-900 rounded border border-amber-200"
                            >
                              {t.parameter.toUpperCase()} {t.operator} {t.value} {t.unit}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>

                    {/* Severity */}
                    <td className="py-3 px-3.5 whitespace-nowrap">
                      {getSeverityBadge(rule.severity)}
                    </td>

                    {/* Source */}
                    <td className="py-3 px-3.5 max-w-[200px] truncate">
                      <span className="font-semibold text-slate-800 block truncate">
                        {isHi ? rule.sourceOrganizationHi : rule.sourceOrganizationEn}
                      </span>
                      <span className="font-mono text-[10px] text-slate-400 block truncate">
                        {isHi ? rule.sourceReferenceHi : rule.sourceReferenceEn}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-3.5 whitespace-nowrap">
                      {getStatusBadge(rule.approvalStatus)}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenHistory(rule)}
                          className="p-1.5 text-slate-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors"
                          title="Version History"
                        >
                          <History size={15} />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(rule)}
                          className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                          title="Edit Rule"
                        >
                          <FileEdit size={15} />
                        </button>
                        <button
                          onClick={() => handleOpenReview(rule)}
                          className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors text-[11px] flex items-center gap-1"
                        >
                          <ShieldCheck size={13} />
                          <span>Review</span>
                        </button>
                        <button
                          onClick={() => handleDeleteRule(rule)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete Rule"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Editor Modal */}
      {editorModalOpen && (
        <RuleEditorModal
          rule={activeRule}
          isOpen={editorModalOpen}
          onClose={() => setEditorModalOpen(false)}
          onSave={handleSaveRule}
          currentUser={currentUser}
          language={language}
        />
      )}

      {/* Review Modal */}
      {reviewModalOpen && activeRule && (
        <RuleReviewModal
          rule={activeRule}
          isOpen={reviewModalOpen}
          onClose={() => setReviewModalOpen(false)}
          onApprove={(id, reviewer, notes) => reviewRule(id, 'approved', reviewer, notes)}
          onReject={(id, reviewer, reason) => rejectRule(id, reviewer, reason)}
          onPublish={(id, publisher, notes) => publishRule(id, publisher, notes)}
          currentUser={currentUser}
          language={language}
        />
      )}

      {/* Version History Modal */}
      {historyModalOpen && activeRule && (
        <RuleVersionHistoryModal
          rule={activeRule}
          isOpen={historyModalOpen}
          onClose={() => setHistoryModalOpen(false)}
          language={language}
        />
      )}
    </div>
  );
};

export default AdvisoryRulesPage;
