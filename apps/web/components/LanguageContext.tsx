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

  // Trigger Google Translate cookie and DOM update
  const applyTranslate = (targetLang: Lang) => {
    try {
      if (typeof document === 'undefined') return;

      // Set the googtrans cookie
      const cookieValue = `/en/${targetLang}`;
      document.cookie = `googtrans=${cookieValue}; path=/`;
      document.cookie = `googtrans=${cookieValue}; domain=.${window.location.hostname}; path=/`;

      // Trigger translate dropdown if initialized
      const selectElem = document.querySelector('.goog-te-combo') as HTMLSelectElement;
      if (selectElem) {
        selectElem.value = targetLang;
        selectElem.dispatchEvent(new Event('change'));
      } else {
        // If element is not loaded yet, reload lightly or re-trigger
        window.location.reload();
      }
    } catch (e) {
      console.warn('Translate trigger warning:', e);
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem('docnest_lang');
    if (saved === 'hi' || saved === 'en') {
      setLangState(saved);
    }
  }, []);

  const setLang = (newLang: Lang) => {
    setLangState(newLang);
    localStorage.setItem('docnest_lang', newLang);
    applyTranslate(newLang);
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
      {/* Hidden container for Google Translate Element */}
      <div id="google_translate_element" style={{ display: 'none' }} />
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
      className="bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-emerald-500/20 hover:from-emerald-500/30 hover:to-teal-500/30 border border-emerald-500/40 text-emerald-300 hover:text-white px-3.5 py-1.5 rounded-full text-xs font-black flex items-center space-x-2 transition active:scale-95 shadow-lg shadow-emerald-950/40 cursor-pointer"
      title="Switch Language (ENG / हिंदी)"
    >
      <Globe className="w-4 h-4 text-emerald-400" />
      <span>{lang === 'en' ? '🌐 ENG' : '🌐 हिंदी'}</span>
    </button>
  );
}
