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

  // Trigger Google Translate silently with ZERO popup/banner
  const applyTranslate = (targetLang: Lang) => {
    try {
      if (typeof document === 'undefined') return;

      // Set cookie across domains and paths
      const cookieValue = `/en/${targetLang}`;
      document.cookie = `googtrans=${cookieValue}; path=/`;
      document.cookie = `googtrans=${cookieValue}; domain=.${window.location.hostname}; path=/`;

      // Trigger translate combo element
      const selectElem = document.querySelector('.goog-te-combo') as HTMLSelectElement;
      if (selectElem) {
        selectElem.value = targetLang;
        selectElem.dispatchEvent(new Event('change'));
      }

      // Cleanup any injected popup or banner frames from DOM immediately
      setTimeout(() => {
        const frames = document.querySelectorAll('.goog-te-banner-frame, #goog-gt-tt, .goog-te-balloon-frame');
        frames.forEach((f) => {
          (f as HTMLElement).style.display = 'none';
          (f as HTMLElement).style.visibility = 'hidden';
          (f as HTMLElement).remove();
        });
        document.body.style.top = '0px';
      }, 50);
    } catch (e) {
      console.warn('Translate trigger warning:', e);
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem('docnest_lang');
    if (saved === 'hi' || saved === 'en') {
      setLangState(saved as Lang);
      if (saved === 'hi') {
        setTimeout(() => applyTranslate('hi'), 500);
      }
    }

    // Observer to continuously purge Google Translate popups & tooltips from top of page
    const observer = new MutationObserver(() => {
      const banner = document.querySelector('.goog-te-banner-frame') as HTMLElement;
      if (banner) {
        banner.style.display = 'none';
        banner.style.visibility = 'hidden';
      }
      const balloon = document.querySelector('#goog-gt-tt') as HTMLElement;
      if (balloon) {
        balloon.style.display = 'none';
      }
      if (document.body.style.top && document.body.style.top !== '0px') {
        document.body.style.top = '0px';
      }
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class'],
    });

    return () => observer.disconnect();
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
      <div id="google_translate_element" style={{ display: 'none', position: 'absolute', top: '-9999px' }} />
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
      className="bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-emerald-500/20 hover:from-emerald-500/30 hover:to-teal-500/30 border border-emerald-500/40 text-emerald-300 hover:text-white px-3 py-1.5 rounded-full text-xs font-black flex items-center space-x-1.5 transition active:scale-95 shadow-lg shadow-emerald-950/40 cursor-pointer"
      title="Switch Language (ENG / हिंदी)"
    >
      <Globe className="w-3.5 h-3.5 text-emerald-400" />
      <span>{lang === 'en' ? 'ENG' : 'हिंदी'}</span>
    </button>
  );
}
