import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Shield, BarChart3, Star } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import shinchanHero from "@/assets/shinchan-hero.png";

const featureIcons = [Zap, Shield, BarChart3];

const Index = () => {
  const { user } = useAuth();
  const { theme, branding } = useTheme();

  const features = branding.featureTitles.map((title, i) => ({
    icon: featureIcons[i],
    title,
    description: branding.featureDescriptions[i],
  }));

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b-2 border-primary/20 bg-card/90 backdrop-blur-lg shadow-theme-sm">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ThemeToggle />
            <span className="text-xl font-bold text-foreground wiggle cursor-default">
              {branding.emoji} {branding.name}
            </span>
          </div>
          <div className="flex items-center gap-3">
            {user ? (
              <Button asChild className="hover-glow press-effect shadow-theme-sm rounded-full">
                <Link to="/dashboard">Dashboard <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            ) : (
              <>
                <Button variant="ghost" asChild className="press-effect hover:bg-secondary rounded-full">
                  <Link to="/login">Sign in</Link>
                </Button>
                <Button asChild className="hover-glow press-effect shadow-theme-md rounded-full">
                  <Link to="/register">Get Started!</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="container py-16 sm:py-20 md:py-28">
        <div className="mx-auto max-w-4xl flex flex-col md:flex-row items-center gap-8 md:gap-12">
          <div className="flex-1 text-center md:text-left animate-fade-in">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border-2 border-primary/20 bg-card px-4 py-2 text-sm font-semibold text-muted-foreground shadow-theme-sm hover-lift cursor-default">
              <Star className="h-4 w-4 text-secondary" />
              {branding.heroTagline}
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl leading-[1.1]">
              {branding.heroTitle}
              <span className="block text-primary">{branding.heroHighlight}</span>
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-muted-foreground sm:text-xl mx-auto md:mx-0">
              {branding.heroDescription}
            </p>
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center md:justify-start">
              <Button size="lg" asChild className="h-13 px-8 text-base shadow-theme-lg hover-glow press-effect rounded-full">
                <Link to={user ? "/dashboard" : "/register"}>
                  {user ? "Go to Dashboard" : branding.ctaMain} <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              {!user && (
                <Button size="lg" variant="outline" asChild className="h-13 px-8 text-base hover-lift press-effect rounded-full border-2">
                  <Link to="/login">I have an account</Link>
                </Button>
              )}
            </div>
          </div>
          <div className="flex-shrink-0 animate-bounce-in">
            <img
              src={shinchanHero}
              alt="Hero character"
              className="w-56 h-56 sm:w-64 sm:h-64 md:w-72 md:h-72 rounded-3xl shadow-theme-xl border-4 border-primary/20 hover-lift cursor-default"
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container pb-20 sm:pb-28">
        <h2 className="text-center text-2xl font-bold text-foreground mb-10">
          {theme === "benten" ? `${branding.name} Capabilities` : `Why ${branding.name} is Awesome! ✨`}
        </h2>
        <div className="mx-auto grid max-w-5xl gap-6 sm:gap-8 md:grid-cols-3">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="group rounded-2xl border-2 border-primary/10 bg-card p-7 sm:p-8 text-center shadow-theme-sm hover-lift cursor-default animate-fade-in"
              style={{ animationDelay: `${i * 120}ms` }}
            >
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary/50 shadow-theme-sm transition-all duration-300 group-hover:bg-secondary group-hover:scale-110 group-hover:rotate-3">
                <f.icon className="h-8 w-8 text-primary transition-transform duration-300 group-hover:scale-110" />
              </div>
              <h3 className="mb-2 text-lg font-bold text-card-foreground">{f.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-2 border-primary/10 bg-card/50 py-8">
        <div className="container text-center text-sm font-medium text-muted-foreground">
          {branding.emoji} {branding.name} © 2026 — "{branding.tagline}" — Built with Lovable
        </div>
      </footer>
    </div>
  );
};

export default Index;
