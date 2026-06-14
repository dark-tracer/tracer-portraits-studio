import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useServerFn } from "@tanstack/react-start";
import { ensureAdminRole } from "@/lib/admin.functions";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/auth")({
  ssr: false,
  head: () => ({ meta: [{ title: "Sign In — Traced in Light" }] }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const { session, loading } = useAuth();
  const ensure = useServerFn(ensureAdminRole);
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && session) {
      ensure().then(() => navigate({ to: "/admin" }));
    }
  }, [loading, session, ensure, navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin + "/admin" },
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="min-h-screen flex items-center justify-center px-6 pt-32 pb-20">
      <div className="w-full max-w-md">
        <p className="text-[11px] uppercase tracking-widest-xl text-[var(--gold)] mb-4 text-center">
          Studio Access
        </p>
        <h1 className="font-serif text-4xl text-foreground text-center mb-10">
          {mode === "signin" ? "Sign In" : "Create Account"}
        </h1>
        <form onSubmit={onSubmit} className="space-y-5">
          <div>
            <label className="text-[11px] uppercase tracking-widest-xl text-muted-foreground">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full border-b border-border bg-transparent py-3 outline-none focus:border-foreground"
            />
          </div>
          <div>
            <label className="text-[11px] uppercase tracking-widest-xl text-muted-foreground">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full border-b border-border bg-transparent py-3 outline-none focus:border-foreground"
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <button
            type="submit"
            disabled={busy}
            className="w-full bg-primary text-primary-foreground py-4 text-[11px] uppercase tracking-widest-xl hover:opacity-90 disabled:opacity-50"
          >
            {busy ? "..." : mode === "signin" ? "Sign In" : "Sign Up"}
          </button>
        </form>
        <button
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="mt-6 w-full text-[11px] uppercase tracking-widest-xl text-muted-foreground hover:text-foreground"
        >
          {mode === "signin" ? "Need an account? Sign up" : "Have an account? Sign in"}
        </button>
      </div>
    </section>
  );
}
