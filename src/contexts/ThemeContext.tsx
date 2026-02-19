import { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from "react";

export type ThemeMode = "light" | "dark";

export interface ThemeBranding {
  name: string;
  tagline: string;
  heroTagline: string;
  heroTitle: string;
  heroHighlight: string;
  heroDescription: string;
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

const BRANDING: ThemeBranding = {
  name: "TaskFlow",
  tagline: "Organize. Focus. Achieve.",
  heroTagline: "Your personal productivity companion",
  heroTitle: "Get things done,",
  heroHighlight: "beautifully.",
  heroDescription: "A minimal, elegant task manager designed to help you stay focused and accomplish more with less clutter.",
  emptyTitle: "Nothing here yet",
  emptyDescription: "Create your first task and start building momentum.",
  searchPlaceholder: "Search tasks...",
  toastCreate: "Task created successfully",
  toastUpdate: "Task updated",
  toastDelete: "Task deleted",
  toastError: "Something went wrong",
  ctaMain: "Get Started Free",
  ctaFirst: "Create Your First Task",
  ctaLogin: "Sign In",
  ctaRegister: "Create Account",
  cancelLabel: "Cancel",
  saveLabel: "Create",
  updateLabel: "Save Changes",
  loginWelcome: "Welcome back",
  loginSubtext: "Sign in to continue where you left off.",
  registerWelcome: "Create your account",
  registerSubtext: "Start organizing your tasks in seconds.",
  emailPlaceholder: "you@example.com",
  loadingText: "Loading...",
  featureTitles: ["Lightning Fast", "Beautifully Simple", "Always in Sync"],
  featureDescriptions: [
    "Built for speed. Create, update, and organize tasks instantly.",
    "A clean interface that gets out of your way so you can focus.",
    "Your tasks are securely saved and available on any device.",
  ],
};

const STORAGE_KEY = "theme-mode";

interface ThemeContextType {
  theme: ThemeMode;
  branding: ThemeBranding;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const getStoredTheme = (): ThemeMode => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark") return stored;
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) return "dark";
  } catch {}
  return "light";
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<ThemeMode>(getStoredTheme);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("dark");
    if (theme === "dark") root.classList.add("dark");
    localStorage.setItem(STORAGE_KEY, theme);
    document.title = "TaskFlow";
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  }, []);

  const value = useMemo(() => ({ theme, branding: BRANDING, toggleTheme }), [theme, toggleTheme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
};
