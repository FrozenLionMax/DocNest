'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Globe } from 'lucide-react';

type Lang = 'en' | 'hi';

interface LanguageContextType {
  lang: Lang;
  toggleLang: () => void;
  setLang: (lang: Lang) => void;
  t: (enText: string, hiText: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'en',
  toggleLang: () => {},
  setLang: () => {},
  t: (enText) => enText,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en');

  useEffect(() => {
    const saved = localStorage.getItem('docnest_lang');
    if (saved === 'hi' || saved === 'en') {
      setLangState(saved);
    }
  }, []);

  const setLang = (newLang: Lang) => {
    setLangState(newLang);
    localStorage.setItem('docnest_lang', newLang);
  };

  const toggleLang = () => {
    const next = lang === 'en' ? 'hi' : 'en';
    setLang(next);
  };

  const t = (enText: string, hiText: string) => {
    return lang === 'hi' ? hiText : enText;
  };

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

export function LanguageTogglePill() {
  const { lang, toggleLang } = useLanguage();
  return (
    <button
      type="button"
      onClick={toggleLang}
      className="bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 px-3 py-1.5 rounded-full text-xs font-extrabold flex items-center space-x-1.5 transition"
      title="Switch Language / भाषा बदलें"
    >
      <Globe className="w-3.5 h-3.5 text-emerald-600" />
      <span>{lang === 'en' ? 'ENG (English)' : 'हिंदी (Hindi)'}</span>
    </button>
  );
}
