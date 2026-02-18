import { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from "react";

export type AnimeTheme = "shinchan" | "doraemon" | "benten";

export interface ThemeBranding {
  name: string;
  emoji: string;
  tagline: string;
  heroTagline: string;
  heroTitle: string;
  heroHighlight: string;
  heroDescription: string;
  missionWord: string;
  emptyEmoji: string;
  emptyTitle: string;
  emptyDescription: string;
}

const BRANDING: Record<AnimeTheme, ThemeBranding> = {
  shinchan: {
    name: "ShinTask!",
    emoji: "🖍️",
    tagline: "Oraaa~! Get things done!",
    heroTagline: "Action! Action! Let's go~!",
    heroTitle: "Manage tasks",
    heroHighlight: "Shinchan style! 🖍️",
    heroDescription: "Even Shinchan gets things done (sometimes)! A fun & colorful task manager to keep you organized. Oraaa~! 💪",
    missionWord: "Mission",
    emptyEmoji: "😴",
    emptyTitle: "No missions yet!",
    emptyDescription: "Don't be lazy like Shinchan! Create your first task~",
  },
  doraemon: {
    name: "DoraTask!",
    emoji: "🔔",
    tagline: "Future gadgets for your tasks!",
    heroTagline: "Doko demo door~! ✨",
    heroTitle: "Organize tasks",
    heroHighlight: "with Doraemon! 🔔",
    heroDescription: "Pull out the perfect gadget from your 4D pocket! A magical task manager that makes everything possible~ 🚀",
    missionWord: "Quest",
    emptyEmoji: "🤖",
    emptyTitle: "No quests yet!",
    emptyDescription: "Nobita needs your help! Create your first quest~",
  },
  benten: {
    name: "OmniTask!",
    emoji: "👽",
    tagline: "It's hero time!",
    heroTagline: "It's Hero Time! 🔥",
    heroTitle: "Crush tasks",
    heroHighlight: "like Ben 10! 👽",
    heroDescription: "Transform into any alien and smash through your to-do list! The Omnitrix-powered task manager. Go hero! 💥",
    missionWord: "Mission",
    emptyEmoji: "⌚",
    emptyTitle: "No missions yet!",
    emptyDescription: "The Omnitrix is ready! Create your first mission, hero~",
  },
};

const THEME_ORDER: AnimeTheme[] = ["shinchan", "doraemon", "benten"];
const STORAGE_KEY = "anime-theme";

interface ThemeContextType {
  theme: AnimeTheme;
  branding: ThemeBranding;
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

  const branding = useMemo(() => BRANDING[theme], [theme]);

  return (
    <ThemeContext.Provider value={{ theme, branding, cycleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
};
