import { createContext, useContext } from 'react';
import type { Locale, ProfileContent } from '../../types/portfolio';

export interface I18nContextValue {
  locale: Locale;
  content: ProfileContent;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
}

export const I18nContext = createContext<I18nContextValue | null>(null);

export function useI18n() {
  const value = useContext(I18nContext);
  if (!value) {
    throw new Error('useI18n must be used inside I18nProvider');
  }
  return value;
}
