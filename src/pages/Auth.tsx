import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Compass } from "lucide-react";

export default function Auth() {
  const { user } = useAuth();
  const nav = useNavigate();
  const [params] = useSearchParams();
  const next = params.get("next") || "/planning";
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (user) nav(next, { replace: true });
  }, [user, nav, next]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: { full_name: name },
          },
        });
        if (error) throw error;
        toast.success("Account created — you're signed in.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back!");
      }
    } catch (err: any) {
      toast.error(err.message || "Authentication failed");
    } finally {
      setBusy(false);
    }
  };

  const google = async () => {
    setBusy(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin + "/auth",
    });
    if (result.error) toast.error("Google sign-in failed");
    setBusy(false);
  };

  return (
    <div className="container max-w-md py-12">
      <div className="flex items-center justify-center gap-2 mb-6">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-hero text-primary-foreground">
          <Compass className="h-5 w-5" />
        </span>
        <span className="font-display font-bold text-xl">HT Compass</span>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{mode === "login" ? "Sign in" : "Create account"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button type="button" variant="outline" className="w-full" onClick={google} disabled={busy}>
            Continue with Google
          </Button>
          <div className="text-center text-xs text-muted-foreground">or</div>
          <form onSubmit={submit} className="space-y-3">
            {mode === "signup" && (
              <div>
                <Label htmlFor="name">Full name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
            )}
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <Button type="submit" className="w-full" disabled={busy}>
              {mode === "login" ? "Sign in" : "Create account"}
            </Button>
          </form>
          <div className="text-center text-sm">
            {mode === "login" ? (
              <button className="text-primary underline" onClick={() => setMode("signup")}>
                New here? Create an account
              </button>
            ) : (
              <button className="text-primary underline" onClick={() => setMode("login")}>
                Already have an account? Sign in
              </button>
            )}
          </div>
          <p className="text-xs text-muted-foreground text-center">
            By continuing you agree this is an educational planning tool, not medical advice.
          </p>
          <Link to="/" className="block text-center text-xs text-muted-foreground hover:text-foreground">
            ← Back to home
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
