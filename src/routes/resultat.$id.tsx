import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AlertTriangle, Zap, OctagonX, Sprout, Printer, Pencil, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAssessments } from "@/lib/store";
import { calculateRIL, DOMAINS, LEVELS, NATURE_START, ROBERT_STOP } from "@/lib/ril";
import { RilBadge, RilLadder, domainColor, DomainIcon, levelColor } from "@/components/ril/RilBits";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/resultat/$id")({
  head: () => ({
    meta: [
      { title: "Resultat – RIL Navigator" },
      { name: "description", content: "Din RIL-score, flaskehals og veien til neste nivå." },
      { property: "og:title", content: "RIL-resultat" },
      { property: "og:description", content: "Diagnose og veikart for regenerativ påvirkning." },
    ],
  }),
  component: Result,
});

function Result() {
  const { id } = Route.useParams();
  const list = useAssessments();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  const a = list.find((x) => x.id === id);
  if (!a) return <main className="p-12 text-center">Fant ikke vurderingen. <Link to="/" className="text-primary underline">Tilbake</Link></main>;

  const r = calculateRIL(a.answers, a.isStartup, a.stopTriggers);
  const info = LEVELS[r.total - 1]!;
  const domainLabel = (d: string) => DOMAINS.find((x) => x.id === d)!.label;
  const best = DOMAINS.reduce((m, d) => (r.domains[d.id] > r.domains[m.id] ? d : m));
  const capped = r.ceiling !== null && r.ceiling < Math.min(...Object.values(r.domains));

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <section className="grid gap-8 rounded-3xl border bg-card p-8 md:grid-cols-[auto_1fr] md:p-12" style={{ backgroundImage: "var(--gradient-nested)" }}>
        <RilBadge level={r.total} asterisk={r.asterisk} size="lg" />
        <div>
          <p className="text-sm text-muted-foreground">{a.name}</p>
          <h1 className="mt-1 text-4xl font-semibold" style={{ color: levelColor(r.total) }}>Nivå {r.total}{r.asterisk && "*"}: {info.name}</h1>
          <p className="mt-2 text-lg">{info.definition}</p>
          {r.asterisk && <p className="mt-3 text-sm italic text-muted-foreground">* Foreløpig designscore basert på potensial. Krever dokumenterte målinger i drift.</p>}
          <p className="mt-4 rounded-xl bg-background/70 p-4 text-sm">
            {capped
              ? <>Scoren er låst av en grensesjekk: {r.activeStops.map((s) => s.warning).join(" ")}</>
              : <>Din score er begrenset til nivå {r.total} av <b>{domainLabel(r.bottleneck)}</b>-laget{best.id !== r.bottleneck && r.domains[best.id] > r.total && <>, selv om {best.label} når nivå {r.domains[best.id]}</>}. Det svakeste laget bestemmer – ingen kompensasjon.</>}
          </p>
          <div className="no-print mt-6 flex flex-wrap gap-2">
            <Button asChild><Link to="/vurdering/$id" params={{ id: a.id }}><Pencil /> Juster svar</Link></Button>
            <Button variant="outline" onClick={() => window.print()}><Printer /> Eksporter / skriv ut</Button>
            <Button variant="outline" asChild><Link to="/guide" search={{ level: r.total }}><BookOpen /> Les om nivået</Link></Button>
          </div>
        </div>
      </section>

      {r.activeStops.length > 0 && (
        <div className="mt-6 space-y-2">
          {r.activeStops.map((s) => (
            <p key={s.id} className="flex items-center gap-2 rounded-xl bg-destructive/10 p-3 text-sm text-destructive"><AlertTriangle className="h-4 w-4" />{s.warning}</p>
          ))}
        </div>
      )}

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_340px]">
        <div className="space-y-10">
          <section>
            <h2 className="text-2xl font-semibold">De tre nøstede lagene</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              {DOMAINS.map((d) => {
                const I = DomainIcon[d.id];
                const isB = d.id === r.bottleneck;
                return (
                  <div key={d.id} className={cn("rounded-2xl border bg-card p-5", isB && "ring-2 ring-destructive")}>
                    <div className="flex items-center gap-2 font-semibold" style={{ color: domainColor[d.id] }}><I className="h-5 w-5" />{d.label}</div>
                    <div className="mt-3 font-display text-5xl font-bold" style={{ color: levelColor(r.domains[d.id]) }}>{r.domains[d.id]}</div>
                    <div className="text-xs text-muted-foreground">{LEVELS[r.domains[d.id] - 1]!.name}</div>
                    {isB && <div className="mt-3 inline-block rounded-full bg-destructive px-2.5 py-0.5 text-xs font-bold text-destructive-foreground">Flaskehals</div>}
                  </div>
                );
              })}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">Hva skal til for å nå neste nivå?</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border bg-card p-5">
                <div className="flex items-center gap-2 font-semibold text-primary"><Zap className="h-5 w-5" /> Raskeste vei</div>
                {r.nextQuestion ? (
                  <>
                    <p className="mt-2 text-xs text-muted-foreground">{domainLabel(r.nextQuestion.domain)} · nivå {r.nextQuestion.level}</p>
                    <p className="mt-1 text-sm font-medium">{r.nextQuestion.question}</p>
                    <p className="mt-2 text-xs text-muted-foreground">{a.answers[r.nextQuestion.id]?.answer === "yes" && !a.isStartup ? "Besvart ja, men mangler dokumentasjon." : r.nextQuestion.helpText}</p>
                  </>
                ) : <p className="mt-2 text-sm">Dere har nådd toppen av skalaen.</p>}
              </div>
              <div className="rounded-2xl border bg-card p-5">
                <div className="flex items-center gap-2 font-semibold text-destructive"><OctagonX className="h-5 w-5" /> Hva må stoppes?</div>
                <ol className="mt-2 list-decimal space-y-1.5 pl-4 text-sm">{ROBERT_STOP.map((s) => <li key={s}>{s}</li>)}</ol>
                <p className="mt-2 text-xs text-muted-foreground">Karl-Henrik Robèrt, FSSD</p>
              </div>
              <div className="rounded-2xl border bg-card p-5">
                <div className="flex items-center gap-2 font-semibold" style={{ color: "var(--soc)" }}><Sprout className="h-5 w-5" /> Hva må startes?</div>
                <ol className="mt-2 list-decimal space-y-1.5 pl-4 text-sm">{NATURE_START.map((s) => <li key={s}>{s}</li>)}</ol>
                <p className="mt-2 text-xs text-muted-foreground">Naturens 4 START-prinsipper</p>
              </div>
            </div>
          </section>
        </div>
        <aside>
          <h2 className="mb-4 text-2xl font-semibold">RIL-stigen</h2>
          <RilLadder active={r.total} />
        </aside>
      </div>
    </main>
  );
}
