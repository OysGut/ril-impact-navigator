import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ExternalLink, Quote } from "lucide-react";
import { LEVELS } from "@/lib/ril";
import { RilBadge, RilLadder, levelColor } from "@/components/ril/RilBits";

export const Route = createFileRoute("/guide")({
  validateSearch: (s: Record<string, unknown>) => ({ level: Math.min(9, Math.max(1, Number(s.level) || 5)) }),
  head: () => ({
    meta: [
      { title: "Kunnskapsbase – RIL-nivåene 1–9" },
      { name: "description", content: "Utforsk de ni RIL-nivåene, FBC-koblinger og rammeverk som FSSD, Doughnut Economics og Biomimicry." },
      { property: "og:title", content: "RIL Kunnskapsbase" },
      { property: "og:description", content: "Fra degenerativ til koevolusjonær – forstå hvert nivå." },
    ],
  }),
  component: Guide,
});

function Guide() {
  const { level } = Route.useSearch();
  const navigate = useNavigate({ from: "/guide" });
  const l = LEVELS[level - 1];
  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-4xl font-semibold">Kunnskapsbase</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">Sterk bærekraft: Natur ⊃ Samfunn ⊃ Økonomi. Klikk et nivå for å lære hva det betyr i praksis.</p>
      <div className="mt-8 grid gap-8 md:grid-cols-[340px_1fr]">
        <RilLadder selected={level} onSelect={(n) => navigate({ search: { level: n }, replace: true })} />
        <article className="rounded-3xl border bg-card p-8" style={{ borderTop: `6px solid ${levelColor(level)}` }}>
          <div className="flex items-center gap-4">
            <RilBadge level={level} />
            <div>
              <h2 className="text-3xl font-semibold" style={{ color: levelColor(level) }}>{l.name}</h2>
              <p className="text-sm text-muted-foreground">{l.short}</p>
            </div>
          </div>
          <p className="mt-6 text-lg">{l.definition}</p>
          <h3 className="mt-6 text-lg font-semibold">I praksis</h3>
          <p className="mt-1 text-muted-foreground">{l.practice}</p>
          <h3 className="mt-6 text-lg font-semibold">Aktiverte FBC-bokser</h3>
          <div className="mt-2 flex flex-wrap gap-2">{l.fbc.map((f) => <span key={f} className="rounded-full bg-accent px-3 py-1 text-sm text-accent-foreground">{f}</span>)}</div>
          <h3 className="mt-6 text-lg font-semibold">Rammeverk og ressurser</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {l.frameworks.map((f) => (
              <a key={f.name} href={f.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm hover:bg-muted">{f.name}<ExternalLink className="h-3.5 w-3.5" /></a>
            ))}
          </div>
          {l.quote && <blockquote className="mt-8 flex gap-3 border-l-4 pl-4 font-display text-xl italic" style={{ borderColor: levelColor(level) }}><Quote className="h-5 w-5 shrink-0 text-muted-foreground" />{l.quote}</blockquote>}
        </article>
      </div>
    </main>
  );
}
