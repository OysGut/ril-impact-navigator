import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Nytt passord – RIL Navigator" },
      { name: "description", content: "Velg et nytt passord for RIL Navigator-kontoen din." },
      { property: "og:title", content: "Nytt passord – RIL Navigator" },
      { property: "og:description", content: "Velg et nytt passord." },
    ],
  }),
  component: ResetPassword,
});

function ResetPassword() {
  const { tr } = useT();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    toast.success(tr({ nb: "Passordet er oppdatert.", en: "Password updated." }));
    navigate({ to: "/" });
  };
  return (
    <main className="mx-auto max-w-md px-6 py-16">
      <form onSubmit={submit} className="space-y-4 rounded-3xl border bg-card p-8">
        <h1 className="font-display text-3xl font-semibold">{tr({ nb: "Nytt passord", en: "New password" })}</h1>
        <div className="space-y-1.5"><Label htmlFor="pw">{tr({ nb: "Passord", en: "Password" })}</Label><Input id="pw" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} /></div>
        <Button type="submit" className="w-full" disabled={busy}>{tr({ nb: "Lagre passord", en: "Save password" })}</Button>
      </form>
    </main>
  );
}
