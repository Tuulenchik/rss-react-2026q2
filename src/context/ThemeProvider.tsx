import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { ThemeContext, type Theme } from './ThemeContext';

type ThemeProviderProps = {
  children: ReactNode;
};

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const contextValue = useMemo(
    () => ({
      theme,
      toggleTheme: () => {
        setTheme((currentTheme) =>
          currentTheme === 'dark' ? 'light' : 'dark'
        );
      },
    }),
    [theme]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}
