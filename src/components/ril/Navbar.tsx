import { Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { Sprout } from "lucide-react";
import { setLang, useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { lang, tr } = useT();
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
  return (
    <header className="no-print sticky top-0 z-30 border-b bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-6">
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-semibold text-primary">
          <Sprout className="h-6 w-6" /> RIL Navigator
        </Link>
        <div className="flex items-center gap-6">
          <nav className="flex gap-6 text-sm font-medium text-muted-foreground">
            <Link to="/" activeOptions={{ exact: true }} activeProps={{ className: "text-primary" }}>{tr({ nb: "Mine vurderinger", en: "My assessments" })}</Link>
            <Link to="/guide" activeProps={{ className: "text-primary" }}>{tr({ nb: "Kunnskapsbase", en: "Knowledge base" })}</Link>
          </nav>
          <div className="flex rounded-full border bg-card p-0.5 text-xs font-semibold" role="group" aria-label={tr({ nb: "Språk", en: "Language" })}>
            {(["nb", "en"] as const).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLang(l)}
                aria-pressed={lang === l}
                className={cn("rounded-full px-2.5 py-1 transition", lang === l ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground")}
              >
                {l === "nb" ? "NO" : "EN"}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
