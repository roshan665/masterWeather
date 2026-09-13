import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  Mic,
  Send,
  FileText,
  Sprout
} from 'lucide-react';
import { AudioReader } from '../../components/common/AudioReader';

export const AdvisoriesPage: React.FC = () => {
  const { language, activeCrop } = useApp();
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([]);

  const suggestions = [
    {
      num: 1,
      textEn: 'Delay chemical spraying due to impending heavy rainfall.',
      textHi: 'आसन्न भारी वर्षा के कारण कीटनाशक छिड़काव स्थगित करें।'
    },
    {
      num: 2,
      textEn: 'Ensure proper drainage in low-lying soybean fields.',
      textHi: 'निचले सोयाबीन खेतों में जल निकासी की उचित व्यवस्था सुनिश्चित करें।'
    },
    {
      num: 3,
      textEn: 'Monitor for pod borer and aphid in vegetative / podding stage.',
      textHi: 'वानस्पतिक एवं फली विकास अवस्था में फली छेदक एवं माहू कीट की निगरानी करें।'
    },
    {
      num: 4,
      textEn: 'Apply DAP (2%) foliar spray if nutrient deficiency symptoms appear.',
      textHi: 'पोषक तत्वों की कमी के लक्षण दिखने पर डीएपी (2%) का पर्णीय छिड़काव करें।'
    }
  ];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput.trim();
    setMessages((prev) => [
      ...prev,
      { sender: 'user', text: userText },
      {
        sender: 'ai',
        text: `ICAR-IISR & KVK Advisory for "${userText}": Weather conditions in Phanda block favor moisture retention. Maintain light cultivation and inspect for early pest signs.`
      }
    ]);
    setChatInput('');
  };

  return (
    <div className="space-y-4 max-w-xl mx-auto pb-6 animate-in fade-in duration-200">
      
      {/* Header matching Mockup Screen 8 */}
      <div className="flex items-center justify-between pb-1">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-emerald-400" />
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            AI Advisory
          </h1>
        </div>

        <AudioReader
          textToRead={suggestions.map(s => `${s.num}. ${s.textEn}`).join(' ')}
          language={language}
          compact
        />
      </div>

      {/* Main AI Advisory Card */}
      <div className="bg-[#0a231e] border border-emerald-500/25 rounded-3xl p-4 sm:p-5 shadow-2xl space-y-4">
        
        {/* Intro prompt */}
        <div className="flex items-start gap-3 pb-2 border-b border-emerald-900/40">
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
            <Sprout size={18} />
          </div>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
            Based on current weather and {activeCrop.nameEn} crop conditions in Phanda block, here are the key suggestions for you:
          </p>
        </div>

        {/* Numbered Steps (1, 2, 3, 4) */}
        <div className="space-y-3">
          {suggestions.map((s) => (
            <div key={s.num} className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-emerald-700 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-md shadow-emerald-950/40">
                {s.num}
              </div>
              <p className="text-xs sm:text-sm text-slate-100 font-medium leading-relaxed">
                {language === 'hi' ? s.textHi : s.textEn}
              </p>
            </div>
          ))}
        </div>

        {/* View Full Report Button (Green Glowing Gradient) */}
        <div className="pt-2">
          <button
            type="button"
            className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-600 hover:from-emerald-500 hover:to-teal-400 text-slate-950 font-black text-sm rounded-2xl shadow-lg shadow-emerald-950/40 flex items-center justify-center gap-2 active:scale-98 transition-all cursor-pointer"
          >
            <FileText size={18} />
            <span>View Full Report</span>
          </button>
        </div>
      </div>

      {/* Conversation History if asked */}
      {messages.length > 0 && (
        <div className="space-y-2.5">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-2xl text-xs sm:text-sm ${
                m.sender === 'user'
                  ? 'bg-emerald-900/60 border border-emerald-500/30 text-white ml-8 text-right'
                  : 'bg-[#0a231e] border border-emerald-500/20 text-slate-200 mr-8 text-left'
              }`}
            >
              {m.text}
            </div>
          ))}
        </div>
      )}

      {/* Ask anything input bar matching Mockup Screen 8 */}
      <form onSubmit={handleSendMessage} className="bg-[#0a231e] border border-emerald-500/30 rounded-2xl p-2 flex items-center gap-2 shadow-lg">
        <button
          type="button"
          className="p-2 rounded-xl text-slate-400 hover:text-emerald-400 transition-colors"
          title="Voice input"
        >
          <Mic size={18} />
        </button>

        <input
          type="text"
          placeholder="Ask anything about your crops..."
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          className="flex-1 bg-transparent text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none"
        />

        <button
          type="submit"
          className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 transition-all font-bold cursor-pointer"
          aria-label="Send query"
        >
          <Send size={16} />
        </button>
      </form>

    </div>
  );
};
