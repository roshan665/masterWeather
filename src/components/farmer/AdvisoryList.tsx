import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useMockData } from '../../context/MockDataContext';
import { useTranslation } from '../../i18n/useTranslation';
import { RiskBadge } from '../common/RiskBadge';
import { AudioReader } from '../common/AudioReader';
import {
  BookOpen,
  ThumbsUp,
  ThumbsDown,
  ShieldCheck,
  Sparkles,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Clock
} from 'lucide-react';

export const AdvisoryList: React.FC = () => {
  const { language, activePanchayat } = useApp();
  const { advisories, voteAdvisoryHelpful } = useMockData();
  const { t } = useTranslation(language);

  const [expandedAdvisoryId, setExpandedAdvisoryId] = useState<string | null>(null);
  const [votedMap, setVotedMap] = useState<Record<string, 'helpful' | 'unhelpful'>>({});

  // Filter approved advisories for active panchayat and crop (or general ones)
  const filteredAdvisories = advisories.filter(
    (adv) =>
      adv.approvalStatus === 'approved' &&
      (adv.panchayatId === activePanchayat.id || adv.panchayatId === 'acharpura')
  );

  const handleVote = (id: string, isHelpful: boolean) => {
    if (votedMap[id]) return;
    voteAdvisoryHelpful(id, isHelpful);
    setVotedMap((prev) => ({ ...prev, [id]: isHelpful ? 'helpful' : 'unhelpful' }));
  };

  const toggleExpand = (id: string) => {
    setExpandedAdvisoryId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <BookOpen size={22} className="text-emerald-700 shrink-0" />
          <div>
            <h2 className="font-bold text-base sm:text-lg text-slate-900 leading-tight">
              {language === 'hi' ? 'आज की अनुमोदित कृषि सलाह' : 'Approved Agromet Advisories'}
            </h2>
            <p className="text-xs text-slate-500">
              {language === 'hi' ? 'ICAR-IISR एवं KVK भोपाल द्वारा प्रमाणित' : 'Certified by ICAR-IISR & KVK Bhopal'}
            </p>
          </div>
        </div>
        <div className="text-xs text-emerald-800 font-bold bg-emerald-100 px-2.5 py-1 rounded-full shrink-0">
          {filteredAdvisories.length} {language === 'hi' ? 'सक्रिय' : 'Active'}
        </div>
      </div>

      {filteredAdvisories.length === 0 ? (
        <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300 space-y-2">
          <BookOpen size={40} className="mx-auto text-slate-400" />
          <p className="text-sm font-bold text-slate-700">
            {language === 'hi' ? 'इस पंचायत हेतु वर्तमान में कोई विशेष सलाह नहीं है।' : 'No active advisories for this selection.'}
          </p>
          <p className="text-xs text-slate-500">
            {language === 'hi' ? 'सामान्य मौसमी कृषि दिशा-निर्देशों का पालन करें।' : 'Follow standard seasonal crop management practices.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3.5">
          {filteredAdvisories.map((adv) => {
            const isExpanded = expandedAdvisoryId === adv.id;
            const hasVoted = votedMap[adv.id];

            return (
              <div
                key={adv.id}
                className="p-4 rounded-3xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition-all space-y-3 shadow-xs"
              >
                {/* Advisory Top Meta: Crop Stage, Risk Level & Audio Button */}
                <div className="flex flex-wrap items-center justify-between gap-2.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <RiskBadge level={adv.riskLevel} language={language} size="sm" showScore={false} />
                    <span className="text-xs font-bold px-2.5 py-1 bg-emerald-100 text-emerald-950 rounded-xl">
                      {language === 'hi' ? adv.stageNameHi : adv.stageNameEn}
                    </span>
                  </div>

                  {/* Prominent Audio Reader Button */}
                  <AudioReader
                    textToRead={language === 'hi' ? adv.audioScriptHi : adv.audioScriptEn}
                    language={language}
                    compact
                  />
                </div>

                {/* Advisory Title & 1-Sentence Summary */}
                <div className="space-y-1">
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900 leading-snug">
                    {language === 'hi' ? adv.titleHi : adv.titleEn}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                    {language === 'hi' ? adv.shortSummaryHi : adv.shortSummaryEn}
                  </p>
                </div>

                {/* Structured Action Box: What to do & When to do it */}
                <div className="grid grid-cols-1 gap-2 text-xs">
                  {/* What to do */}
                  <div className="bg-emerald-50/90 border border-emerald-200/80 p-3 rounded-2xl space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-emerald-950">
                      <CheckCircle2 size={16} className="text-emerald-700 shrink-0" />
                      <span>{language === 'hi' ? 'क्या करें (आवश्यक कार्रवाई):' : 'What to do (Action):'}</span>
                    </div>
                    <p className="text-emerald-950 font-medium leading-relaxed pl-5">
                      {language === 'hi' ? adv.detailedActionHi.split('.')[0] + '.' : adv.detailedActionEn.split('.')[0] + '.'}
                    </p>
                  </div>

                  {/* Trigger Condition */}
                  <div className="bg-amber-50/80 border border-amber-200/70 p-2.5 rounded-2xl flex items-center gap-2 text-amber-950">
                    <Clock size={15} className="text-amber-700 shrink-0" />
                    <span className="font-semibold">
                      {language === 'hi' ? `मौसम कारण: ${adv.weatherTriggerHi}` : `Trigger: ${adv.weatherTriggerEn}`}
                    </span>
                  </div>
                </div>

                {/* Expandable Detailed Guidance */}
                {isExpanded && (
                  <div className="p-3.5 rounded-2xl bg-white border border-slate-200 text-xs sm:text-sm text-slate-800 space-y-2.5 animate-in fade-in duration-150">
                    <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                      <Sparkles size={16} className="text-emerald-600" />
                      <span>{language === 'hi' ? 'सम्पूर्ण कृषि-वैज्ञानिक दिशा-निर्देश' : 'Full Scientific Recommendations'}</span>
                    </div>
                    <p className="leading-relaxed font-normal text-slate-700">
                      {language === 'hi' ? adv.detailedActionHi : adv.detailedActionEn}
                    </p>

                    <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 font-medium">
                      <div className="flex items-center gap-1 text-emerald-800">
                        <ShieldCheck size={15} />
                        <span>{language === 'hi' ? adv.sourceAuthorityHi : adv.sourceAuthorityEn}</span>
                      </div>
                      {adv.approvedBy && (
                        <div className="italic">
                          {language === 'hi' ? 'स्वीकृतकर्ता:' : 'Approved by:'} {adv.approvedBy}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Action Bar: Read More + Feedback Voting with large touch targets */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200/70 text-xs">
                  <button
                    type="button"
                    onClick={() => toggleExpand(adv.id)}
                    className="min-h-[44px] flex items-center gap-1.5 font-bold text-emerald-700 hover:text-emerald-900 cursor-pointer"
                  >
                    <span>{isExpanded ? (language === 'hi' ? 'कम विवरण' : 'Show Less') : (language === 'hi' ? 'विस्तृत दिशा-निर्देश देखें' : 'View Full Guidance')}</span>
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>

                  {/* Feedback rating with accessible targets */}
                  <div className="flex items-center gap-2 text-slate-500">
                    <span className="text-[11px] hidden sm:inline">{language === 'hi' ? 'उपयोगी थी?' : 'Helpful?'}</span>
                    
                    <button
                      type="button"
                      onClick={() => handleVote(adv.id, true)}
                      disabled={Boolean(hasVoted)}
                      className={`min-h-[44px] min-w-[44px] flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                        hasVoted === 'helpful'
                          ? 'bg-emerald-100 border-emerald-400 text-emerald-900 font-bold'
                          : 'border-slate-300 hover:bg-slate-100 text-slate-700'
                      }`}
                      title={t.helpfulYes}
                    >
                      <ThumbsUp size={15} className={hasVoted === 'helpful' ? 'text-emerald-600' : ''} />
                      <span className="font-bold">{adv.helpfulCount}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleVote(adv.id, false)}
                      disabled={Boolean(hasVoted)}
                      className={`min-h-[44px] min-w-[44px] flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                        hasVoted === 'unhelpful'
                          ? 'bg-rose-100 border-rose-400 text-rose-900 font-bold'
                          : 'border-slate-300 hover:bg-slate-100 text-slate-700'
                      }`}
                      title={t.helpfulNo}
                    >
                      <ThumbsDown size={15} className={hasVoted === 'unhelpful' ? 'text-rose-600' : ''} />
                      <span className="font-bold">{adv.unhelpfulCount}</span>
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
