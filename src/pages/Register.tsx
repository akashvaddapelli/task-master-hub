import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Lock } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { useTheme } from "@/contexts/ThemeContext";
import { useToast } from "@/hooks/use-toast";

const Register = () => {
  const { theme, branding } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({ title: "Passwords don't match! 🚨", variant: "destructive" });
      return;
    }
    if (password.length < 6) {
      toast({ title: "Password too short! Min 6 chars required.", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await signUp(email, password);
    setLoading(false);
    if (error) {
      toast({ title: branding.toastError, description: error.message, variant: "destructive" });
    } else {
      toast({ title: theme === "venom" ? "🕷️ Symbiote bond established!" : "🕸️ Welcome to the team, hero!" });
      navigate("/dashboard");
    }
  };

  const isVenom = theme === "venom";

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3">
            <ThemeToggle />
            <Link to="/" className="inline-flex items-center gap-2.5 text-2xl font-bold text-foreground group wiggle">
              <span className="text-3xl">{branding.emoji}</span>
              {branding.name}
            </Link>
          </div>
        </div>
        <Card className="shadow-theme-xl border-2 border-primary/15 rounded-2xl">
          <CardHeader className="text-center pb-2">
            <div className="text-4xl mb-2">{isVenom ? "🖤" : "🕸️"}</div>
            <CardTitle className="text-2xl font-bold">{branding.registerWelcome}</CardTitle>
            <CardDescription className="font-medium">{branding.registerSubtext}</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-5 pt-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="font-bold">
                  {isVenom ? "Host ID" : "Email"} {isVenom ? "🕷️" : "✉️"}
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input id="email" type="email" placeholder={branding.emailPlaceholder} value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10 h-11 rounded-xl border-2 shadow-theme-sm focus:shadow-theme-md focus:border-primary/50 transition-all duration-200" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="font-bold">
                  {isVenom ? "Symbiote Key" : "Password"} {isVenom ? "🔐" : "🔒"}
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10 h-11 rounded-xl border-2 shadow-theme-sm focus:shadow-theme-md focus:border-primary/50 transition-all duration-200" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="font-bold">
                  {isVenom ? "Confirm Key" : "Confirm Password"} 🔐
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input id="confirmPassword" type="password" placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="pl-10 h-11 rounded-xl border-2 shadow-theme-sm focus:shadow-theme-md focus:border-primary/50 transition-all duration-200" required />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex-col gap-4 pt-2">
              <Button type="submit" className="w-full h-11 text-base rounded-full shadow-theme-md hover-glow press-effect" disabled={loading}>
                {loading ? "Bonding... ⏳" : branding.ctaRegister}
              </Button>
              <p className="text-sm text-muted-foreground font-medium">
                {isVenom ? "Already bonded? " : "Already a hero? "}
                <Link to="/login" className="font-bold text-primary hover:underline">
                  {isVenom ? "Enter the void 🕷️" : "Sign in! 🕸️"}
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Register;
