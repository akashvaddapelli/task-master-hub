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
  // UI-specific
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
    searchPlaceholder: "Search missions... 🔍",
    toastCreate: "🎉 Mission created! Oraaa~!",
    toastUpdate: "✏️ Mission updated! Nice~!",
    toastDelete: "🗑️ Bye bye mission~!",
    toastError: "Oops! 😅",
    ctaMain: "Let's Goooo! 🚀",
    ctaFirst: "Create First Mission!",
    ctaLogin: "Let's Go! 🚀",
    ctaRegister: "Oraaa~! Let's Go! 🚀",
    cancelLabel: "Nah, Later 😴",
    saveLabel: "Go Go Go! 🚀",
    updateLabel: "Update! ✨",
    loginWelcome: "Welcome back!",
    loginSubtext: "Sign in to continue your missions~",
    registerWelcome: "Join the fun!",
    registerSubtext: "Create your account and start your missions~",
    emailPlaceholder: "shinchan@example.com",
    loadingText: "Loading missions... 🚀",
    featureTitles: ["Super Fast! ⚡", "Ultra Secure 🛡️", "Stay on Track 📊"],
    featureDescriptions: [
      "Create tasks faster than Shinchan runs from his mom!",
      "Your tasks are safer than Action Kamen's secret identity!",
      "Don't be lazy like Shinchan! Track your progress~",
    ],
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
    emptyDescription: "Nobita needs your help! Open the 4D pocket and create your first quest~",
    searchPlaceholder: "Search quests... 🔍",
    toastCreate: "🔔 Quest created! Doraemon approves~!",
    toastUpdate: "✨ Quest updated with a gadget~!",
    toastDelete: "🌀 Quest vanished into the pocket~!",
    toastError: "Oh no, Nobita! 😰",
    ctaMain: "Open 4D Pocket! 🌀",
    ctaFirst: "Create First Quest!",
    ctaLogin: "Enter the Door! 🚪",
    ctaRegister: "Get Your Pocket! 🌀",
    cancelLabel: "Maybe later~ 💤",
    saveLabel: "Gadget Go! 🌀",
    updateLabel: "Upgrade! ✨",
    loginWelcome: "Welcome home!",
    loginSubtext: "Nobita's been waiting! Sign in to your quests~",
    registerWelcome: "Hello, friend!",
    registerSubtext: "Get your own 4D pocket and start questing~",
    emailPlaceholder: "nobita@example.com",
    loadingText: "Searching the 4D pocket... 🌀",
    featureTitles: ["Gadget Speed! 🌀", "Pocket Security 🔒", "Smart Tracking 📊"],
    featureDescriptions: [
      "Faster than the Anywhere Door! Create quests in a flash~",
      "Protected by Doraemon's best gadgets! Ultra safe~",
      "Even Nobita can stay on track with this magic~",
    ],
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
    emptyTitle: "No missions detected.",
    emptyDescription: "The Omnitrix is powered up. Initiate your first mission, hero.",
    searchPlaceholder: "Scan missions... 🔍",
    toastCreate: "⚡ Mission deployed!",
    toastUpdate: "🔧 Mission recalibrated.",
    toastDelete: "💥 Mission eliminated.",
    toastError: "System error! 🚨",
    ctaMain: "Hero Time! ⚡",
    ctaFirst: "Deploy First Mission!",
    ctaLogin: "Access Terminal ⚡",
    ctaRegister: "Initialize Omnitrix ⚡",
    cancelLabel: "Stand down",
    saveLabel: "Deploy! ⚡",
    updateLabel: "Recalibrate ⚡",
    loginWelcome: "Access Granted",
    loginSubtext: "Authenticate to access mission control.",
    registerWelcome: "New Hero Registration",
    registerSubtext: "Initialize your Omnitrix and begin operations.",
    emailPlaceholder: "hero@omnitrix.com",
    loadingText: "Scanning alien database... ⚡",
    featureTitles: ["Alien Speed ⚡", "Omnitrix Shield 🛡️", "Hero Tracker 📡"],
    featureDescriptions: [
      "Execute missions at XLR8 speed. No delays.",
      "Secured by Omnitrix-level encryption. Unbreakable.",
      "Track all missions across the galaxy. Zero blind spots.",
    ],
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
    THEME_ORDER.forEach((t) => root.classList.remove(`theme-${t}`));
    root.classList.add(`theme-${theme}`);
    localStorage.setItem(STORAGE_KEY, theme);
    // Update page title
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
