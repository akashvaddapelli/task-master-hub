import { useTheme, AnimeTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const themeEmoji: Record<AnimeTheme, string> = {
  shinchan: "🖍️",
  doraemon: "🔔",
  benten: "👽",
};

const ThemeToggle = () => {
  const { theme, cycleTheme } = useTheme();
  const [spinning, setSpinning] = useState(false);

  const handleClick = () => {
    setSpinning(true);
    // Flash effect on body
    document.documentElement.style.transition = "filter 0.15s ease";
    document.documentElement.style.filter = "brightness(1.3) saturate(1.5)";
    setTimeout(() => {
      document.documentElement.style.filter = "";
      setTimeout(() => {
        document.documentElement.style.transition = "";
      }, 150);
    }, 150);
    cycleTheme();
    setTimeout(() => setSpinning(false), 500);
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleClick}
      className={`
        rounded-full border-2 shadow-theme-sm 
        hover:shadow-theme-md hover:scale-110 
        active:scale-90 transition-all duration-200
        ${spinning ? "animate-spin" : ""}
      `}
      title="Change theme!"
    >
      <span className="text-lg">{themeEmoji[theme]}</span>
    </Button>
  );
};

export default ThemeToggle;
