import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { CheckSquare, ArrowRight, Zap, Shield, BarChart3 } from "lucide-react";

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
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 text-xl font-bold text-foreground">
            <CheckSquare className="h-6 w-6 text-primary" />
            TaskFlow
          </div>
          <div className="flex items-center gap-3">
            {user ? (
              <Button asChild>
                <Link to="/dashboard">Dashboard <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            ) : (
              <>
                <Button variant="ghost" asChild><Link to="/login">Sign in</Link></Button>
                <Button asChild><Link to="/register">Get Started</Link></Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="container py-24 text-center md:py-32">
        <div className="mx-auto max-w-2xl animate-fade-in">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-card px-4 py-1.5 text-sm text-muted-foreground">
            <Zap className="h-3.5 w-3.5 text-accent" />
            Simple. Powerful. Free.
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl">
            Manage your tasks
            <span className="block text-primary">with clarity</span>
          </h1>
          <p className="mx-auto mt-6 max-w-lg text-lg text-muted-foreground">
            A clean, focused task manager that helps you stay organized and productive. No clutter, no distractions.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Button size="lg" asChild>
              <Link to={user ? "/dashboard" : "/register"}>
                {user ? "Go to Dashboard" : "Start for free"} <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container pb-24">
        <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="rounded-xl border bg-card p-6 text-center transition-shadow hover:shadow-md animate-fade-in">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <f.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 font-semibold text-card-foreground">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container text-center text-sm text-muted-foreground">
          © 2026 TaskFlow. Built with Lovable.
        </div>
      </footer>
    </div>
  );
};

export default Index;
