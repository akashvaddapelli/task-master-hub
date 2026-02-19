import { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from "react";

export type AnimeTheme = "venom" | "spiderman";

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
  searchPlaceholder: string;
  toastCreate: string;
  toastUpdate: string;
  toastDelete: string;
  toastError: string;
  ctaMain: string;
  ctaFirst: string;
  ctaLogin: string;
  ctaRegister: string;
  cancelLabel: string;
  saveLabel: string;
  updateLabel: string;
  loginWelcome: string;
  loginSubtext: string;
  registerWelcome: string;
  registerSubtext: string;
  emailPlaceholder: string;
  loadingText: string;
  featureDescriptions: string[];
  featureTitles: string[];
}

const BRANDING: Record<AnimeTheme, ThemeBranding> = {
  venom: {
    name: "VenomTask",
    emoji: "🕷️",
    tagline: "We are the darkness.",
    heroTagline: "The symbiote awakens...",
    heroTitle: "Devour your tasks",
    heroHighlight: "like Venom. 🖤",
    heroDescription: "Unleash the symbiote within. No task escapes the darkness. We are productivity. We are Venom.",
    missionWord: "Hunt",
    emptyEmoji: "🌑",
    emptyTitle: "The void is empty.",
    emptyDescription: "The symbiote hungers. Create your first hunt to feed the darkness.",
    searchPlaceholder: "Search the darkness... 🔍",
    toastCreate: "🕷️ Hunt deployed. The symbiote feeds.",
    toastUpdate: "🖤 Hunt recalibrated.",
    toastDelete: "💀 Hunt consumed by the void.",
    toastError: "Symbiote error! 🚨",
    ctaMain: "Unleash the Symbiote 🖤",
    ctaFirst: "Begin the Hunt",
    ctaLogin: "Enter the Void 🕷️",
    ctaRegister: "Bond with Symbiote 🖤",
    cancelLabel: "Retreat",
    saveLabel: "Unleash 🕷️",
    updateLabel: "Evolve 🖤",
    loginWelcome: "Welcome back, host.",
    loginSubtext: "The symbiote remembers you.",
    registerWelcome: "New host detected.",
    registerSubtext: "Bond with the symbiote to begin operations.",
    emailPlaceholder: "host@symbiote.com",
    loadingText: "Symbiote syncing... 🕷️",
    featureTitles: ["Symbiote Speed 🕷️", "Void Shield 🛡️", "Dark Tracker 📡"],
    featureDescriptions: [
      "Execute hunts at symbiote velocity. Nothing escapes.",
      "Protected by living darkness. Impenetrable.",
      "Track all hunts across the shadows. Total awareness.",
    ],
  },
  spiderman: {
    name: "SpiderTask",
    emoji: "🕸️",
    tagline: "With great power comes great productivity!",
    heroTagline: "Your friendly neighborhood task manager!",
    heroTitle: "Swing through tasks",
    heroHighlight: "Spidey style! 🔴🔵",
    heroDescription: "With great power comes great responsibility — and great task management! Swing into action and crush your to-do list, hero!",
    missionWord: "Mission",
    emptyEmoji: "🕸️",
    emptyTitle: "No missions on the radar!",
    emptyDescription: "Even Spidey needs a mission! Create your first one and save the day.",
    searchPlaceholder: "Scan for missions... 🔍",
    toastCreate: "🕸️ Mission launched! Go get 'em, tiger!",
    toastUpdate: "⚡ Mission upgraded!",
    toastDelete: "💥 Mission completed & cleared!",
    toastError: "Spidey-sense tingling! Something's wrong! 🚨",
    ctaMain: "Swing Into Action! 🕸️",
    ctaFirst: "Launch First Mission!",
    ctaLogin: "Suit Up! 🔴",
    ctaRegister: "Join the Web! 🕸️",
    cancelLabel: "Stand down",
    saveLabel: "Web it! 🕸️",
    updateLabel: "Upgrade! ⚡",
    loginWelcome: "Hey there, hero!",
    loginSubtext: "Suit up and get back to saving the day.",
    registerWelcome: "New hero incoming!",
    registerSubtext: "Get your web-shooters ready. The city needs you.",
    emailPlaceholder: "hero@dailybugle.com",
    loadingText: "Web-swinging to data... 🕸️",
    featureTitles: ["Web Speed ⚡", "Spidey Shield 🛡️", "Hero Tracker 📊"],
    featureDescriptions: [
      "Faster than a web-swing across Manhattan!",
      "Your data is protected by spider-sense. Unbreakable.",
      "Track all missions like Spidey tracks villains. Zero blind spots.",
    ],
  },
};

const THEME_ORDER: AnimeTheme[] = ["venom", "spiderman"];
const STORAGE_KEY = "hero-theme";

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
  return "venom";
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<AnimeTheme>(getStoredTheme);

  useEffect(() => {
    const root = document.documentElement;
    THEME_ORDER.forEach((t) => root.classList.remove(`theme-${t}`));
    root.classList.add(`theme-${theme}`);
    localStorage.setItem(STORAGE_KEY, theme);
    document.title = BRANDING[theme].name;
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
