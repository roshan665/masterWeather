import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useTranslation } from '../../i18n/useTranslation';
import { useMockData } from '../../context/MockDataContext';
import { AdvisoryApprovalTable } from '../../components/officer/AdvisoryApprovalTable';
import { AdvisoryList } from '../../components/farmer/AdvisoryList';
import { Sliders, ArrowRight, ShieldCheck } from 'lucide-react';

export const OfficerAdvisoriesPage: React.FC = () => {
  const { language } = useApp();
  const { t } = useTranslation(language);
  const { advisoryRules } = useMockData();
  const publishedCount = advisoryRules.filter((r) => r.approvalStatus === 'published').length;

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            {t.navOfficerAdvisories}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            {language === 'hi'
              ? 'कृषि मौसम सलाह निर्माण, समीक्षा, अनुमोदन एवं किसान ऐप प्रसारण'
              : 'Formulate, review, validate, and broadcast agromet advisories across Phanda block'}
          </p>
        </div>

        <Link
          to="/officer/rules"
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-2 transition-colors self-start sm:self-auto"
        >
          <Sliders size={15} />
          <span>{language === 'hi' ? 'सलाह ज्ञानकोष एवं नियम इंजन' : 'Advisory Knowledge Base Rules'}</span>
          <span className="bg-purple-800 px-1.5 py-0.2 rounded text-[10px]">{publishedCount} Live</span>
          <ArrowRight size={13} />
        </Link>
      </div>

      <div className="bg-purple-50/60 p-3.5 rounded-2xl border border-purple-200/80 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-purple-900 font-medium">
          <ShieldCheck size={16} className="text-purple-700 shrink-0" />
          <span>
            {language === 'hi'
              ? 'ज्ञानकोष के नियम आईसीएआर-आईआईएसआर इंदौर एवं केवीके भोपाल (सीआईएई) के स्वीकृत पैकेज ऑफ प्रैक्टिस के अनुरूप हैं।'
              : 'Advisories are automatically synthesized from verified ICAR-IISR Indore & KVK Bhopal agromet rules.'}
          </span>
        </div>
        <Link
          to="/officer/rules"
          className="text-purple-700 font-bold hover:underline shrink-0 text-[11px]"
        >
          {language === 'hi' ? 'नियम देखें →' : 'View Rules Engine →'}
        </Link>
      </div>

      <AdvisoryApprovalTable />
      <AdvisoryList />
    </div>
  );
};
