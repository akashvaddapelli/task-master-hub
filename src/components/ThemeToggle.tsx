import { useTheme, AnimeTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { useRef, useState, useCallback } from "react";
import { Palette } from "lucide-react";

const THEME_COLORS: Record<AnimeTheme, string[]> = {
  shinchan: ["#e03e3e", "#f5c542", "#3b82f6", "#ff6b6b", "#ffd93d"],
  doraemon: ["#2563eb", "#ef4444", "#fbbf24", "#60a5fa", "#f87171"],
  benten: ["#22c55e", "#16a34a", "#a3e635", "#4ade80", "#86efac"],
};

const THEME_RIPPLE: Record<AnimeTheme, string> = {
  shinchan: "rgba(224, 62, 62, 0.25)",
  doraemon: "rgba(37, 99, 235, 0.25)",
  benten: "rgba(34, 197, 94, 0.3)",
};

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  shape: "circle" | "star" | "square";
  rotation: number;
  rotationSpeed: number;
}

function spawnParticles(
  canvas: HTMLCanvasElement,
  originX: number,
  originY: number,
  colors: string[]
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.style.display = "block";

  const shapes: Particle["shape"][] = ["circle", "star", "square"];
  const particles: Particle[] = Array.from({ length: 32 }, () => {
    const angle = Math.random() * Math.PI * 2;
    const speed = 2 + Math.random() * 6;
    return {
      x: originX,
      y: originY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 1,
      life: 1,
      maxLife: 0.6 + Math.random() * 0.5,
      size: 4 + Math.random() * 8,
      color: colors[Math.floor(Math.random() * colors.length)],
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.3,
    };
  });

  let animId: number;
  const startTime = performance.now();

  const draw = (now: number) => {
    const elapsed = (now - startTime) / 1000;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let alive = false;
    for (const p of particles) {
      const t = elapsed / p.maxLife;
      if (t >= 1) continue;
      alive = true;

      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.15; // gravity
      p.vx *= 0.98;
      p.rotation += p.rotationSpeed;

      const alpha = 1 - t;
      const scale = 1 - t * 0.5;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.color;

      const s = p.size * scale;
      if (p.shape === "circle") {
        ctx.beginPath();
        ctx.arc(0, 0, s / 2, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.shape === "square") {
        ctx.fillRect(-s / 2, -s / 2, s, s);
      } else {
        // 4-point star
        ctx.beginPath();
        for (let i = 0; i < 8; i++) {
          const r = i % 2 === 0 ? s / 2 : s / 5;
          const a = (i * Math.PI) / 4;
          ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
        }
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();
    }

    if (alive) {
      animId = requestAnimationFrame(draw);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      canvas.style.display = "none";
    }
  };

  animId = requestAnimationFrame(draw);
  // Safety cleanup
  setTimeout(() => {
    cancelAnimationFrame(animId);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas.style.display = "none";
  }, 1500);
}

const ThemeToggle = () => {
  const { theme, cycleTheme } = useTheme();
  const [spinning, setSpinning] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Lazily create the canvas once
  const getCanvas = useCallback(() => {
    if (canvasRef.current) return canvasRef.current;
    const c = document.createElement("canvas");
    c.style.cssText =
      "position:fixed;top:0;left:0;width:100vw;height:100vh;pointer-events:none;z-index:9999;display:none";
    document.body.appendChild(c);
    canvasRef.current = c;
    return c;
  }, []);

  const handleClick = () => {
    setSpinning(true);

    const order: AnimeTheme[] = ["shinchan", "doraemon", "benten"];
    const nextTheme = order[(order.indexOf(theme) + 1) % order.length];
    const colors = THEME_COLORS[nextTheme];
    const rippleColor = THEME_RIPPLE[nextTheme];

    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      // Ripple wave
      const ripple = document.createElement("div");
      const maxDim = Math.max(window.innerWidth, window.innerHeight) * 2.5;
      ripple.style.cssText = `
        position:fixed;
        left:${cx}px;top:${cy}px;
        width:${maxDim}px;height:${maxDim}px;
        margin-left:${-maxDim / 2}px;margin-top:${-maxDim / 2}px;
        border-radius:50%;
        background: radial-gradient(circle, ${rippleColor} 0%, transparent 70%);
        pointer-events:none;z-index:9998;
        transform:scale(0);opacity:1;
        animation: theme-ripple 0.7s cubic-bezier(0.22, 0.61, 0.36, 1) forwards;
      `;
      document.body.appendChild(ripple);
      setTimeout(() => ripple.remove(), 750);

      // Particles on top
      spawnParticles(getCanvas(), cx, cy, colors);
    }

    // Flash
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
      ref={btnRef}
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
      <Palette className="h-4 w-4" />
    </Button>
  );
};

export default ThemeToggle;
