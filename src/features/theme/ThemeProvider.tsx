import { useEffect, useMemo, useState, type ReactNode } from 'react';
import type { ThemeMode } from '../../types/portfolio';
import { ThemeContext, type ThemeContextValue } from './themeContext';

function getInitialTheme(): ThemeMode {
  const savedTheme = window.localStorage.getItem('portfolio-theme');
  if (savedTheme === 'dark' || savedTheme === 'light') {
    return savedTheme;
  }
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeMode>(getInitialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem('portfolio-theme', theme);
  }, [theme]);

  const value = useMemo<ThemeContextValue>(() => ({
    theme,
    toggleTheme: () => {
      document.documentElement.classList.add('is-theme-switching');
      window.setTimeout(() => document.documentElement.classList.remove('is-theme-switching'), 360);
      setTheme((current) => current === 'dark' ? 'light' : 'dark');
    }
  }), [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
