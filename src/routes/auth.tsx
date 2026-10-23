import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useT } from "@/lib/i18n";
import { useUser } from "@/lib/auth";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Logg inn – RIL Navigator" },
      { name: "description", content: "Logg inn eller lag en bruker for å ta vare på RIL-vurderingene dine." },
      { property: "og:title", content: "Logg inn – RIL Navigator" },
      { property: "og:description", content: "Ta vare på vurderingene dine på tvers av enheter." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { tr } = useT();
  const navigate = useNavigate();
  const user = useUser();
  const [mode, setMode] = useState<"in" | "up" | "forgot">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (user) navigate({ to: "/", replace: true });
  }, [user, navigate]);

  const google = async () => {
    const r = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (r.error) toast.error(tr({ nb: "Google-innlogging feilet", en: "Google sign-in failed" }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "in") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else if (mode === "up") {
        const { error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: window.location.origin } });
        if (error) throw error;
        toast.success(tr({ nb: "Sjekk e-posten din for å bekrefte kontoen.", en: "Check your email to confirm your account." }));
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/reset-password` });
        if (error) throw error;
        toast.success(tr({ nb: "Vi har sendt deg en lenke for nytt passord.", en: "We sent you a password reset link." }));
      }
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const title = mode === "in" ? tr({ nb: "Logg inn", en: "Sign in" }) : mode === "up" ? tr({ nb: "Lag bruker", en: "Create account" }) : tr({ nb: "Glemt passord", en: "Forgot password" });

  return (
    <main className="mx-auto max-w-md px-6 py-16">
      <div className="rounded-3xl border bg-card p-8">
        <h1 className="font-display text-3xl font-semibold">{title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{tr({ nb: "Vurderingene dine lagres på kontoen, og du finner dem igjen på alle enheter.", en: "Your assessments are saved to your account and available on every device." })}</p>
        {mode !== "forgot" && (
          <>
            <Button variant="outline" className="mt-6 w-full" onClick={google}>{tr({ nb: "Fortsett med Google", en: "Continue with Google" })}</Button>
            <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground"><span className="h-px flex-1 bg-border" />{tr({ nb: "eller", en: "or" })}<span className="h-px flex-1 bg-border" /></div>
          </>
        )}
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-1.5"><Label htmlFor="email">{tr({ nb: "E-post", en: "Email" })}</Label><Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></div>
          {mode !== "forgot" && (
            <div className="space-y-1.5"><Label htmlFor="pw">{tr({ nb: "Passord", en: "Password" })}</Label><Input id="pw" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} /></div>
          )}
          <Button type="submit" className="w-full" disabled={busy}>{mode === "forgot" ? tr({ nb: "Send lenke", en: "Send link" }) : title}</Button>
        </form>
        <div className="mt-5 flex flex-wrap justify-between gap-2 text-sm">
          {mode === "in" ? (
            <>
              <button className="text-primary underline" onClick={() => setMode("up")}>{tr({ nb: "Lag ny bruker", en: "Create an account" })}</button>
              <button className="text-muted-foreground underline" onClick={() => setMode("forgot")}>{tr({ nb: "Glemt passord?", en: "Forgot password?" })}</button>
            </>
          ) : (
            <button className="text-primary underline" onClick={() => setMode("in")}>{tr({ nb: "Har du bruker? Logg inn", en: "Have an account? Sign in" })}</button>
          )}
        </div>
      </div>
    </main>
  );
}
