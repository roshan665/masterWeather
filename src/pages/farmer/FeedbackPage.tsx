import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useMockData } from '../../context/MockDataContext';
import { useTranslation } from '../../i18n/useTranslation';
import {
  MessageSquareQuote,
  Star,
  CheckCircle2,
  ThumbsUp,
  ThumbsDown,
  Send,
  HelpCircle,
  Clock,
  Sparkles,
  BookOpen
} from 'lucide-react';

export const FeedbackPage: React.FC = () => {
  const { language, activePanchayat, activeCrop } = useApp();
  const { submitFeedback } = useMockData();
  const { t } = useTranslation(language);

  const [rating, setRating] = useState<number>(5);
  const [isUseful, setIsUseful] = useState<boolean>(true);
  const [isUnderstandable, setIsUnderstandable] = useState<boolean>(true);
  const [isRelevant, setIsRelevant] = useState<boolean>(true);
  const [category] = useState<'accuracy' | 'timeliness' | 'clarity' | 'actionability' | 'other'>('accuracy');
  const [comment, setComment] = useState<string>('');
  const [farmerName, setFarmerName] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitFeedback({
      advisoryId: 'adv-001',
      panchayatId: activePanchayat.id,
      cropId: activeCrop.id,
      isHelpful: isUseful,
      rating,
      feedbackCategory: category,
      comment: comment.trim() || `Useful: ${isUseful}, Understandable: ${isUnderstandable}, Relevant: ${isRelevant}`,
      farmerName: farmerName.trim() || undefined,
    });

    setIsSubmitted(true);
    setComment('');
    setTimeout(() => {
      setIsSubmitted(false);
    }, 4000);
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900">
          {t.navFeedback}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          {language === 'hi'
            ? 'कृषि सलाह की सटीकता, भाषा एवं उपयोगिता पर अपनी राय साझा करें'
            : 'Share your feedback on weather prediction accuracy, advisory clarity and timeliness'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Feedback Form */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-4">
          <h2 className="font-bold text-base text-slate-900 flex items-center gap-2">
            <MessageSquareQuote size={18} className="text-emerald-700" />
            <span>{language === 'hi' ? 'सलाह मूल्यांकन प्रपत्र' : 'Advisory Evaluation Form'}</span>
          </h2>

          {isSubmitted ? (
            <div className="p-8 text-center bg-emerald-50 rounded-2xl border border-emerald-200 space-y-2">
              <CheckCircle2 size={40} className="mx-auto text-emerald-600 animate-bounce" />
              <h3 className="font-bold text-base text-emerald-950">
                {language === 'hi' ? 'आपकी प्रतिक्रिया सफलतापूर्वक दर्ज हो गई है!' : 'Thank you for your valuable feedback!'}
              </h3>
              <p className="text-xs text-emerald-800">
                {language === 'hi'
                  ? 'आपके सुझावों से मौसम पूर्वानुमान एवं सलाह गुणवत्ता में सुधार किया जाएगा।'
                  : 'Your ground input helps fine-tune our weather rules and field advisories.'}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
              
              {/* 1. Useful / Not Useful */}
              <div className="space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <label className="block text-xs font-bold text-slate-800">
                  1. {language === 'hi' ? 'क्या कृषि सलाह उपयोगी थी?' : 'Was the advisory useful?'}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setIsUseful(true)}
                    className={`p-2 rounded-lg border font-bold flex items-center justify-center gap-1.5 transition-all ${
                      isUseful
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                        : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <ThumbsUp size={14} />
                    <span>{language === 'hi' ? 'उपयोगी (Useful)' : 'Useful'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsUseful(false)}
                    className={`p-2 rounded-lg border font-bold flex items-center justify-center gap-1.5 transition-all ${
                      !isUseful
                        ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                        : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <ThumbsDown size={14} />
                    <span>{language === 'hi' ? 'अनुपयोगी (Not Useful)' : 'Not Useful'}</span>
                  </button>
                </div>
              </div>

              {/* 2. Understandable / Not Understandable */}
              <div className="space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <label className="block text-xs font-bold text-slate-800">
                  2. {language === 'hi' ? 'क्या भाषा व सलाह समझने में सरल थी?' : 'Was the advice understandable?'}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setIsUnderstandable(true)}
                    className={`p-2 rounded-lg border font-bold flex items-center justify-center gap-1.5 transition-all ${
                      isUnderstandable
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                        : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <BookOpen size={14} />
                    <span>{language === 'hi' ? 'समझने में आसान' : 'Understandable'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsUnderstandable(false)}
                    className={`p-2 rounded-lg border font-bold flex items-center justify-center gap-1.5 transition-all ${
                      !isUnderstandable
                        ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                        : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <HelpCircle size={14} />
                    <span>{language === 'hi' ? 'कठिन / अस्पष्ट' : 'Not Understandable'}</span>
                  </button>
                </div>
              </div>

              {/* 3. Relevant / Not Relevant */}
              <div className="space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <label className="block text-xs font-bold text-slate-800">
                  3. {language === 'hi' ? 'क्या सलाह आपकी फसल व अवस्था के अनुकूल थी?' : 'Was the advice relevant to current crop stage?'}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setIsRelevant(true)}
                    className={`p-2 rounded-lg border font-bold flex items-center justify-center gap-1.5 transition-all ${
                      isRelevant
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                        : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Sparkles size={14} />
                    <span>{language === 'hi' ? 'प्रासंगिक (Relevant)' : 'Relevant'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsRelevant(false)}
                    className={`p-2 rounded-lg border font-bold flex items-center justify-center gap-1.5 transition-all ${
                      !isRelevant
                        ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                        : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Clock size={14} />
                    <span>{language === 'hi' ? 'अप्रासंगिक (Not Relevant)' : 'Not Relevant'}</span>
                  </button>
                </div>
              </div>

              {/* 4. Star Rating */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  4. {language === 'hi' ? 'समग्र संतुष्टि रेटिंग' : 'Overall Satisfaction Rating'}
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      className="p-1 cursor-pointer transition-transform hover:scale-110"
                    >
                      <Star
                        size={26}
                        className={
                          star <= rating
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-300'
                        }
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-slate-700 ml-2">
                    {rating} / 5
                  </span>
                </div>
              </div>

              {/* 5. Farmer Name & Comment */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t.farmerNameLabel}
                </label>
                <input
                  type="text"
                  placeholder={language === 'hi' ? 'आपका नाम (वैकल्पिक)' : 'Your Name (Optional)'}
                  value={farmerName}
                  onChange={(e) => setFarmerName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {language === 'hi' ? 'विस्तृत सुझाव या टिप्पणी' : 'Comments & Suggestions'}
                </label>
                <textarea
                  rows={3}
                  placeholder={language === 'hi' ? 'सलाह में क्या सुधार किया जा सकता है...' : 'Any feedback on how to make local weather advice more useful...'}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send size={15} />
                <span>{language === 'hi' ? 'प्रतिक्रिया जमा करें' : 'Submit Feedback'}</span>
              </button>
            </form>
          )}
        </div>

        {/* Community Feedback Stats */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-5 border border-slate-800 shadow-xs space-y-3">
            <h3 className="font-bold text-sm text-emerald-400 uppercase tracking-wider">
              {language === 'hi' ? 'फंदा ब्लॉक - किसान संतुष्टि सूचकांक' : 'Farmer Satisfaction Index'}
            </h3>

            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-black text-white">4.8</span>
              <span className="text-xs text-slate-400">/ 5.0 (94% {language === 'hi' ? 'सकारात्मक' : 'Positive'})</span>
            </div>

            <div className="space-y-2 text-xs pt-2 border-t border-slate-800">
              <div className="flex justify-between text-slate-300">
                <span>{language === 'hi' ? 'उपयोगिता स्कोर' : 'Utility Score'}</span>
                <span className="font-bold text-emerald-400">96%</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>{language === 'hi' ? 'सरल भाषा स्पष्टता' : 'Language Clarity'}</span>
                <span className="font-bold text-emerald-400">98%</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>{language === 'hi' ? 'फसल प्रासंगिकता' : 'Crop Relevance'}</span>
                <span className="font-bold text-emerald-400">92%</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200 text-xs text-slate-600 space-y-2">
            <h4 className="font-bold text-slate-800">
              {language === 'hi' ? 'फीडबैक लूप प्रक्रिया' : 'Continuous Improvement Loop'}
            </h4>
            <p className="leading-relaxed">
              {language === 'hi'
                ? 'प्रत्येक किसान की प्रतिक्रिया को कृषि विज्ञान केंद्र और मौसम विभाग के मॉडल ट्यूनिंग में सीधे सम्मिलित किया जाता है।'
                : 'Farmer feedback helps improve numerical model weightings and rule thresholds for Phanda block.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
