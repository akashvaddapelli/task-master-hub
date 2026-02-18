import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";

export type AnimeTheme = "shinchan" | "doraemon" | "benten";

const THEME_ORDER: AnimeTheme[] = ["shinchan", "doraemon", "benten"];
const STORAGE_KEY = "anime-theme";

interface ThemeContextType {
  theme: AnimeTheme;
  cycleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const getStoredTheme = (): AnimeTheme => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && THEME_ORDER.includes(stored as AnimeTheme)) return stored as AnimeTheme;
  } catch {}
  return "shinchan";
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<AnimeTheme>(getStoredTheme);

  useEffect(() => {
    const root = document.documentElement;
    // Remove all theme classes, then add current
    THEME_ORDER.forEach((t) => root.classList.remove(`theme-${t}`));
    root.classList.add(`theme-${theme}`);
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const cycleTheme = useCallback(() => {
    setTheme((prev) => {
      const idx = THEME_ORDER.indexOf(prev);
      return THEME_ORDER[(idx + 1) % THEME_ORDER.length];
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, cycleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
};
