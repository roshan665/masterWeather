import { translations } from './translations';
import type { Language } from '../types/common';
import { useApp } from '../context/AppContext';

export const useTranslation = (overrideLang?: Language) => {
  const appContext = useApp();
  const lang = overrideLang || appContext?.language || 'hi';
  const t = translations[lang] || translations.hi;
  return { t, language: lang };
};
