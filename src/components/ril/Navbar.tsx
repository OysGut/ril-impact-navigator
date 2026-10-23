import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Sprout, LogIn, LogOut, UserX, User } from "lucide-react";
import { toast } from "sonner";
import { setLang, useT } from "@/lib/i18n";
import { useUser } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { deleteMyAccount } from "@/lib/account.functions";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { lang, tr } = useT();
  const user = useUser();
  const navigate = useNavigate();
  const deleteFn = useServerFn(deleteMyAccount);
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/", replace: true });
  };
  const deleteMe = async () => {
    if (!confirm(tr({ nb: "Slette kontoen og alle vurderingene dine for godt? Dette kan ikke angres.", en: "Permanently delete your account and all your assessments? This cannot be undone." }))) return;
    try {
      await deleteFn();
      await supabase.auth.signOut();
      toast.success(tr({ nb: "Kontoen og alle data er slettet.", en: "Your account and all data have been deleted." }));
      navigate({ to: "/", replace: true });
    } catch {
      toast.error(tr({ nb: "Kunne ikke slette kontoen. Prøv igjen.", en: "Could not delete the account. Try again." }));
    }
  };

  return (
    <header className="no-print sticky top-0 z-30 border-b bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-6">
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-semibold text-primary">
          <Sprout className="h-6 w-6" /> RIL Navigator
        </Link>
        <div className="flex items-center gap-5">
          <nav className="hidden gap-6 text-sm font-medium text-muted-foreground sm:flex">
            <Link to="/" activeOptions={{ exact: true }} activeProps={{ className: "text-primary" }}>{tr({ nb: "Mine vurderinger", en: "My assessments" })}</Link>
            <Link to="/guide" activeProps={{ className: "text-primary" }}>{tr({ nb: "Kunnskapsbase", en: "Knowledge base" })}</Link>
          </nav>
          <div className="flex rounded-full border bg-card p-0.5 text-xs font-semibold" role="group" aria-label={tr({ nb: "Språk", en: "Language" })}>
            {(["nb", "en"] as const).map((l) => (
              <button key={l} type="button" onClick={() => setLang(l)} aria-pressed={lang === l}
                className={cn("rounded-full px-2.5 py-1 transition", lang === l ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground")}>
                {l === "nb" ? "NO" : "EN"}
              </button>
            ))}
          </div>
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="outline" aria-label={tr({ nb: "Konto", en: "Account" })}><User /></Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel className="max-w-56 truncate font-normal text-muted-foreground">{user.email}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild><Link to="/personvern">{tr({ nb: "Personvern", en: "Privacy" })}</Link></DropdownMenuItem>
                <DropdownMenuItem onClick={signOut}><LogOut /> {tr({ nb: "Logg ut", en: "Sign out" })}</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={deleteMe} className="text-destructive"><UserX /> {tr({ nb: "Slett meg", en: "Delete me" })}</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button size="sm" variant="outline" asChild><Link to="/auth"><LogIn /> {tr({ nb: "Logg inn", en: "Sign in" })}</Link></Button>
          )}
        </div>
      </div>
    </header>
  );
}
