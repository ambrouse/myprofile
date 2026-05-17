import type { ReactNode } from 'react';
import { I18nProvider } from '../features/i18n/I18nProvider';
import { ThemeProvider } from '../features/theme/ThemeProvider';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <I18nProvider>{children}</I18nProvider>
    </ThemeProvider>
  );
}
