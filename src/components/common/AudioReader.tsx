import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Sparkles } from 'lucide-react';

interface AudioReaderProps {
  textToRead: string;
  language: 'hi' | 'en';
  label?: string;
}

export const AudioReader: React.FC<AudioReaderProps> = ({
  textToRead,
  language,
  label,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleTogglePlay = () => {
    if (!('speechSynthesis' in window)) {
      alert(language === 'hi' ? 'आपके ब्राउज़र में आवाज़ सुविधा समर्थित नहीं है।' : 'Speech synthesis not supported.');
      return;
    }

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
      utterance.rate = 0.95;
      utterance.pitch = 1.0;

      utterance.onend = () => {
        setIsPlaying(false);
      };

      utterance.onerror = () => {
        setIsPlaying(false);
      };

      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);
    }
  };

  return (
    <button
      onClick={handleTogglePlay}
      type="button"
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium text-xs md:text-sm transition-all shadow-xs cursor-pointer ${
        isPlaying
          ? 'bg-emerald-600 text-white shadow-emerald-200 shadow-md ring-2 ring-emerald-300'
          : 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100'
      }`}
      aria-label={isPlaying ? 'Stop audio' : 'Listen audio'}
    >
      {isPlaying ? (
        <>
          <VolumeX size={16} className="shrink-0 animate-pulse" />
          <span>{language === 'hi' ? 'आवाज रोकें' : 'Stop Audio'}</span>
          <span className="flex space-x-0.5 items-center">
            <span className="w-1 h-3 bg-white animate-bounce rounded-full" style={{ animationDelay: '0ms' }} />
            <span className="w-1 h-4 bg-white animate-bounce rounded-full" style={{ animationDelay: '150ms' }} />
            <span className="w-1 h-2 bg-white animate-bounce rounded-full" style={{ animationDelay: '300ms' }} />
          </span>
        </>
      ) : (
        <>
          <Volume2 size={16} className="shrink-0 text-emerald-600" />
          <span>{label || (language === 'hi' ? 'सलाह सुनें (ऑडियो)' : 'Listen Advisory (Audio)')}</span>
          <Sparkles size={13} className="text-amber-500 shrink-0" />
        </>
      )}
    </button>
  );
};
