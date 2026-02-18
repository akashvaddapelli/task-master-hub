import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { CheckSquare, ArrowRight, Zap, Shield, BarChart3, Sparkles } from "lucide-react";

const features = [
  { icon: Zap, title: "Lightning Fast", description: "Create, edit, and organize tasks in seconds with a streamlined interface." },
  { icon: Shield, title: "Secure by Default", description: "Your data is protected with enterprise-grade authentication and encryption." },
  { icon: BarChart3, title: "Stay on Track", description: "Prioritize tasks and track progress to boost your productivity." },
];

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-lg shadow-theme-sm">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2.5 text-xl font-extrabold text-foreground">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary shadow-theme-sm">
              <CheckSquare className="h-5 w-5 text-primary-foreground" />
            </div>
            TaskFlow
          </div>
          <div className="flex items-center gap-3">
            {user ? (
              <Button asChild className="hover-glow press-effect shadow-theme-sm">
                <Link to="/dashboard">Dashboard <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            ) : (
              <>
                <Button variant="ghost" asChild className="press-effect hover:bg-secondary">
                  <Link to="/login">Sign in</Link>
                </Button>
                <Button asChild className="hover-glow press-effect shadow-theme-md">
                  <Link to="/register">Get Started</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="container py-20 text-center sm:py-28 md:py-36">
        <div className="mx-auto max-w-2xl animate-fade-in">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-card px-4 py-1.5 text-sm font-medium text-muted-foreground shadow-theme-sm hover-lift cursor-default">
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            Simple. Powerful. Free.
          </div>
          <h1 className="text-4xl font-black tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl leading-[1.1]">
            Manage your tasks
            <span className="block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">with clarity</span>
          </h1>
          <p className="mx-auto mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground sm:text-xl">
            A clean, focused task manager that helps you stay organized and productive. No clutter, no distractions.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button size="lg" asChild className="h-13 px-8 text-base shadow-theme-lg hover-glow press-effect">
              <Link to={user ? "/dashboard" : "/register"}>
                {user ? "Go to Dashboard" : "Start for free"} <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            {!user && (
              <Button size="lg" variant="outline" asChild className="h-13 px-8 text-base hover-lift press-effect">
                <Link to="/login">Sign in to your account</Link>
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container pb-24 sm:pb-32">
        <div className="mx-auto grid max-w-5xl gap-6 sm:gap-8 md:grid-cols-3">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="group rounded-2xl border bg-card p-7 sm:p-8 text-center shadow-theme-sm hover-lift cursor-default animate-fade-in"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 shadow-theme-sm transition-all duration-300 group-hover:bg-primary/20 group-hover:scale-110">
                <f.icon className="h-7 w-7 text-primary transition-transform duration-300 group-hover:scale-110" />
              </div>
              <h3 className="mb-2 text-lg font-bold text-card-foreground">{f.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card/50 py-8">
        <div className="container text-center text-sm text-muted-foreground">
          © 2026 TaskFlow. Built with Lovable.
        </div>
      </footer>
    </div>
  );
};

export default Index;
