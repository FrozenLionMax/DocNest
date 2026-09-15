import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

import hi from './hi.json';
import en from './en.json';

const LANGUAGE_KEY = 'docnest_language';

/**
 * i18n setup for DocNest.
 * Default language: English (en) as primary, with Hindi (hi) option.
 */
i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    hi: { translation: hi },
  },
  lng: 'en', // Default to English as primary
  fallbackLng: 'hi',
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
});

/** Load saved language from storage */
export async function loadSavedLanguage(): Promise<void> {
  try {
    const savedLang = await AsyncStorage.getItem(LANGUAGE_KEY);
    if (savedLang && (savedLang === 'hi' || savedLang === 'en')) {
      await i18n.changeLanguage(savedLang);
    }
  } catch (error) {
    console.warn('Failed to load saved language:', error);
  }
}

/** Change language and persist choice */
export async function changeLanguage(lang: 'hi' | 'en'): Promise<void> {
  await i18n.changeLanguage(lang);
  await AsyncStorage.setItem(LANGUAGE_KEY, lang);
}

/** Get current language */
export function getCurrentLanguage(): 'hi' | 'en' {
  return (i18n.language as 'hi' | 'en') || 'en';
}

export default i18n;
