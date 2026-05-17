import { useMemo, useState, type ReactNode } from 'react';
import en from '../../content/profile.en.json';
import vi from '../../content/profile.vi.json';
import type { Locale, ProfileContent } from '../../types/portfolio';
import { I18nContext, type I18nContextValue } from './i18nContext';

const contentByLocale: Record<Locale, ProfileContent> = { en, vi };

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(() => {
    const savedLocale = window.localStorage.getItem('portfolio-locale');
    return savedLocale === 'en' || savedLocale === 'vi' ? savedLocale : 'en';
  });

  function applyLocale(nextLocale: Locale) {
    document.documentElement.classList.add('is-locale-switching');
    window.setTimeout(() => document.documentElement.classList.remove('is-locale-switching'), 360);
    window.localStorage.setItem('portfolio-locale', nextLocale);
    document.documentElement.lang = nextLocale;
    setLocale(nextLocale);
  }

  const value = useMemo<I18nContextValue>(() => ({
    locale,
    content: contentByLocale[locale],
    setLocale: applyLocale,
    toggleLocale: () => applyLocale(locale === 'vi' ? 'en' : 'vi')
  }), [locale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
