import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AlertTriangle, Zap, OctagonX, Sprout, Printer, Pencil, BookOpen, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAssessments } from "@/lib/store";
import { useUser } from "@/lib/auth";
import { calculateInsight, calculateRIL, DOMAINS, questionById, UNKNOWN, type CheckedRequirement, type ProjectAssessment } from "@/lib/ril";
import { domainLabel, levelText, questionText, startList, stopList, warningText } from "@/lib/ril-text";
import { useT, type Lang } from "@/lib/i18n";
import { RilBadge, RilLadder, domainColor, DomainIcon, levelColor } from "@/components/ril/RilBits";
import { RilMatrix } from "@/components/ril/RilMatrix";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/resultat/$id")({
  head: () => ({
    meta: [
      { title: "Resultat – RIL Navigator" },
      { name: "description", content: "Din RIL-score, innsikt, flaskehals og veien til neste nivå." },
      { property: "og:title", content: "RIL-resultat" },
      { property: "og:description", content: "Diagnose og veikart for regenerativ påvirkning." },
    ],
  }),
  component: Result,
});

function reqText(c: CheckedRequirement, a: ProjectAssessment, lang: Lang) {
  const q = questionById(c.questionId)!;
  const t = questionText(q, lang);
  const ans = a.answers[q.id];
  const idx = ans ? q.options.findIndex((o) => o.id === ans.optionId) : -1;
  const current = !ans ? (lang === "en" ? "Not answered" : "Ikke besvart") : ans.optionId === UNKNOWN || idx < 0 ? (lang === "en" ? "Don't know" : "Vet ikke") : t.option(idx).label;
  const undocumented = !a.isStartup && ans && idx >= 3 && !ans.verified && !c.met;
  return { theme: t.theme, needed: t.option(c.min).label, current, undocumented };
}

function Result() {
  const { id } = Route.useParams();
  const { lang, tr } = useT();
  const list = useAssessments();
  const user = useUser();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  const a = list.find((x) => x.id === id);
  if (!a) return <main className="p-12 text-center">{tr({ nb: "Fant ikke vurderingen.", en: "Assessment not found." })} <Link to="/" className="text-primary underline">{tr({ nb: "Tilbake", en: "Back" })}</Link></main>;

  const r = calculateRIL(a.answers, a.isStartup);
  const c = calculateInsight(a.answers);
  const info = levelText(r.total, lang);
  const best = DOMAINS.reduce((m, d) => (r.domains[d.id] > r.domains[m.id] ? d : m));
  const capped = r.ceiling !== null && r.ceiling < Math.min(...Object.values(r.domains));
  const next = r.nextStep ? reqText(r.nextStep, a, lang) : null;

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      {!user && (
        <div className="no-print mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-primary/30 bg-accent p-4">
          <p className="text-sm">{tr({ nb: "Resultatet ditt er klart! Lag en gratis bruker for å ta vare på det og finne det igjen på alle enheter.", en: "Your result is ready! Create a free account to keep it and find it on any device." })}</p>
          <Button size="sm" asChild><Link to="/auth">{tr({ nb: "Lag bruker / logg inn", en: "Create account / sign in" })}</Link></Button>
        </div>
      )}
      <section className="grid gap-8 rounded-3xl border bg-card p-8 md:grid-cols-[auto_1fr] md:p-12" style={{ backgroundImage: "var(--gradient-nested)" }}>
        <RilBadge level={r.total} asterisk={r.asterisk} size="lg" />
        <div>
          <p className="text-sm text-muted-foreground">{a.name}{a.orgNumber && ` · ${tr({ nb: "org.nr.", en: "org. no." })} ${a.orgNumber}`}</p>
          {a.nace && a.nace.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">{a.nace.map((n) => <span key={n.code} className="rounded-full bg-background/80 px-2.5 py-0.5 text-xs"><b>{n.code}</b> {n.name}</span>)}</div>
          )}
          <h1 className="mt-2 text-4xl font-semibold" style={{ color: levelColor(r.total) }}>{tr({ nb: "Nivå", en: "Level" })} {r.total}{r.asterisk && "*"}: {info.name}</h1>
          <p className="mt-2 text-lg">{info.definition}</p>
          <p className="mt-2 text-sm text-muted-foreground">{tr({ nb: "Innsikt", en: "Insight" })}: <b className="text-foreground">{c.total}%</b></p>
          {r.asterisk && <p className="mt-2 text-sm italic text-muted-foreground">* {tr({ nb: "Foreløpig designscore basert på potensial. Krever dokumenterte målinger i drift.", en: "Preliminary design score based on potential. Requires documented measurements in operation." })}</p>}
          <p className="mt-4 rounded-xl bg-background/70 p-4 text-sm">
            {capped
              ? <>{tr({ nb: "Scoren er låst av en grensesjekk:", en: "The score is capped by a boundary check:" })} {r.activeStops.map((s) => warningText(s.id, lang)).join(" ")}</>
              : lang === "en"
                ? <>Your score is limited to level {r.total} by the <b>{domainLabel(r.bottleneck, lang)}</b> layer{best.id !== r.bottleneck && r.domains[best.id] > r.total && <>, even though {domainLabel(best.id, lang)} reaches level {r.domains[best.id]}</>}. The weakest layer decides – no compensation.</>
                : <>Din score er begrenset til nivå {r.total} av <b>{domainLabel(r.bottleneck, lang)}</b>-laget{best.id !== r.bottleneck && r.domains[best.id] > r.total && <>, selv om {domainLabel(best.id, lang)} når nivå {r.domains[best.id]}</>}. Det svakeste laget bestemmer – ingen kompensasjon.</>}
          </p>
          <div className="no-print mt-6 flex flex-wrap gap-2">
            <Button asChild><Link to="/vurdering/$id" params={{ id: a.id }}><Pencil /> {tr({ nb: "Juster svar", en: "Adjust answers" })}</Link></Button>
            <Button variant="outline" onClick={() => window.print()}><Printer /> {tr({ nb: "Eksporter / skriv ut", en: "Export / print" })}</Button>
            <Button variant="outline" asChild><Link to="/guide" search={{ level: r.total }}><BookOpen /> {tr({ nb: "Les om nivået", en: "Read about the level" })}</Link></Button>
          </div>
        </div>
      </section>

      {r.activeStops.length > 0 && (
        <div className="mt-6 space-y-2">
          {r.activeStops.map((s) => (
            <p key={s.id} className="flex items-center gap-2 rounded-xl bg-destructive/10 p-3 text-sm text-destructive"><AlertTriangle className="h-4 w-4" />{warningText(s.id, lang)}</p>
          ))}
        </div>
      )}

      <Tabs defaultValue="overview" className="mt-10">
        <TabsList className="no-print">
          <TabsTrigger value="overview">{tr({ nb: "Oversikt", en: "Overview" })}</TabsTrigger>
          <TabsTrigger value="matrix">{tr({ nb: "Matrise", en: "Matrix" })}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid gap-10 lg:grid-cols-[1fr_340px]">
            <div className="space-y-10">
              <section>
                <h2 className="text-2xl font-semibold">{tr({ nb: "De tre nøstede lagene", en: "The three nested layers" })}</h2>
                <div className="mt-4 grid gap-4 md:grid-cols-3">
                  {DOMAINS.map((d) => {
                    const I = DomainIcon[d.id];
                    const isB = d.id === r.bottleneck;
                    const det = r.details[d.id];
                    return (
                      <div key={d.id} className={cn("rounded-2xl border bg-card p-5", isB && "ring-2 ring-destructive")}>
                        <div className="flex items-center gap-2 font-semibold" style={{ color: domainColor[d.id] }}><I className="h-5 w-5" />{domainLabel(d.id, lang)}</div>
                        <div className="mt-3 flex items-baseline gap-3">
                          <span className="font-display text-5xl font-bold" style={{ color: levelColor(r.domains[d.id]) }}>{r.domains[d.id]}</span>
                          <span className="text-xs text-muted-foreground">{c.domains[d.id]}% {tr({ nb: "innsikt", en: "insight" })}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">{levelText(r.domains[d.id], lang).name}</div>
                        {isB && <div className="mt-3 inline-block rounded-full bg-destructive px-2.5 py-0.5 text-xs font-bold text-destructive-foreground">{tr({ nb: "Flaskehals", en: "Bottleneck" })}</div>}
                        <details className="mt-4 text-sm">
                          <summary className="cursor-pointer font-semibold">{tr({ nb: "Hvorfor dette nivået?", en: "Why this level?" })}</summary>
                          <ul className="mt-2 space-y-2">
                            {[...det.met, ...det.next].map((req, i) => {
                              const t = reqText(req, a, lang);
                              return (
                                <li key={i} className="flex gap-2 text-xs">
                                  {req.met ? <Check className="h-4 w-4 shrink-0" style={{ color: "var(--ril-7)" }} /> : <X className="h-4 w-4 shrink-0 text-destructive" />}
                                  <span>
                                    <b>{tr({ nb: "Nivå", en: "Level" })} {req.level} · {t.theme}</b>
                                    <span className="block text-muted-foreground">{tr({ nb: "Krever minst", en: "Requires at least" })}: «{t.needed}»</span>
                                    {!req.met && <span className="block text-muted-foreground">{tr({ nb: "Deres svar", en: "Your answer" })}: «{t.current}»{t.undocumented && ` (${tr({ nb: "ikke dokumentert", en: "not documented" })})`}</span>}
                                  </span>
                                </li>
                              );
                            })}
                          </ul>
                        </details>
                      </div>
                    );
                  })}
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold">{tr({ nb: "Hva skal til for å nå neste nivå?", en: "What does it take to reach the next level?" })}</h2>
                <div className="mt-4 grid gap-4 md:grid-cols-3">
                  <div className="rounded-2xl border bg-card p-5">
                    <div className="flex items-center gap-2 font-semibold text-primary"><Zap className="h-5 w-5" /> {tr({ nb: "Raskeste vei", en: "Fastest path" })}</div>
                    {r.nextStep && next ? (
                      <>
                        <p className="mt-2 text-xs text-muted-foreground">{domainLabel(r.bottleneck, lang)} · {next.theme}</p>
                        <p className="mt-1 text-sm">{tr({ nb: "Kom dit at dette stemmer:", en: "Get to where this is true:" })}</p>
                        <p className="mt-1 text-sm font-medium">«{next.needed}»</p>
                        <p className="mt-2 text-xs text-muted-foreground">{tr({ nb: "I dag", en: "Today" })}: «{next.current}»{next.undocumented && ` – ${tr({ nb: "dokumenter dette", en: "document this" })}`}</p>
                      </>
                    ) : <p className="mt-2 text-sm">{capped ? tr({ nb: "Fjern grensen som låser scoren (se over).", en: "Remove the boundary that caps the score (see above)." }) : tr({ nb: "Dere har nådd toppen av skalaen.", en: "You have reached the top of the scale." })}</p>}
                  </div>
                  <div className="rounded-2xl border bg-card p-5">
                    <div className="flex items-center gap-2 font-semibold text-destructive"><OctagonX className="h-5 w-5" /> {tr({ nb: "Hva må stoppes?", en: "What must stop?" })}</div>
                    <ol className="mt-2 list-decimal space-y-1.5 pl-4 text-sm">{stopList(lang).map((s) => <li key={s}>{s}</li>)}</ol>
                    <p className="mt-2 text-xs text-muted-foreground">Karl-Henrik Robèrt, FSSD</p>
                  </div>
                  <div className="rounded-2xl border bg-card p-5">
                    <div className="flex items-center gap-2 font-semibold" style={{ color: "var(--soc)" }}><Sprout className="h-5 w-5" /> {tr({ nb: "Hva må startes?", en: "What must start?" })}</div>
                    <ol className="mt-2 list-decimal space-y-1.5 pl-4 text-sm">{startList(lang).map((s) => <li key={s}>{s}</li>)}</ol>
                    <p className="mt-2 text-xs text-muted-foreground">{tr({ nb: "Naturens 4 START-prinsipper", en: "Nature's 4 START principles" })}</p>
                  </div>
                </div>
              </section>
            </div>
            <aside>
              <h2 className="mb-4 text-2xl font-semibold">{tr({ nb: "RIL-stigen", en: "The RIL ladder" })}</h2>
              <RilLadder active={r.total} />
            </aside>
          </div>
        </TabsContent>

        <TabsContent value="matrix" className="mt-6">
          <h2 className="text-2xl font-semibold">{tr({ nb: "RIL-nivå og innsikt", en: "RIL level and insight" })}</h2>
          <p className="mt-1 mb-6 max-w-2xl text-sm text-muted-foreground">
            {tr({ nb: "Hvert lag plasseres etter RIL-nivå (loddrett) og hvor godt svarene viser at dere forstår egen påvirkning (vannrett). Hold over en prikk for detaljer.", en: "Each layer is placed by RIL level (vertical) and how well the answers show you understand your own impact (horizontal). Hover a dot for details." })}
          </p>
          <RilMatrix r={r} c={c} />
        </TabsContent>
      </Tabs>
    </main>
  );
}
