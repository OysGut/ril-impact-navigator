import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AlertTriangle, ChevronLeft, ChevronRight, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useAssessments, saveAssessment } from "@/lib/store";
import { DOMAINS, QUESTIONS, STOP_TRIGGERS, type Answer, type ProjectAssessment } from "@/lib/ril";
import { domainColor, DomainIcon } from "@/components/ril/RilBits";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/vurdering/$id")({
  head: () => ({
    meta: [
      { title: "Vurdering – RIL Navigator" },
      { name: "description", content: "Steg-for-steg-vurdering av økologi, samfunn og økonomi." },
      { property: "og:title", content: "RIL-vurdering" },
      { property: "og:description", content: "Svar på spørsmålene og finn ditt regenerative nivå." },
    ],
  }),
  component: Wizard,
});

const STEPS = [...DOMAINS.map((d) => ({ id: d.id, label: d.label })), { id: "stops", label: "Grensesjekk" }] as const;

function Wizard() {
  const { id } = Route.useParams();
  const list = useAssessments();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const a = list.find((x) => x.id === id);
  if (!mounted) return null;
  if (!a) return <main className="p-12 text-center">Fant ikke vurderingen. <Link to="/" className="text-primary underline">Tilbake</Link></main>;
  return <WizardInner a={a} />;
}

function WizardInner({ a }: { a: ProjectAssessment }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const update = (patch: Partial<ProjectAssessment>) => saveAssessment({ ...a, ...patch });
  const cur = STEPS[step]!;
  const setAnswer = (qid: string, answer: Answer) =>
    update({ answers: { ...a.answers, [qid]: { answer, verified: a.answers[qid]?.verified ?? false } } });
  const setVerified = (qid: string, verified: boolean) =>
    update({ answers: { ...a.answers, [qid]: { answer: a.answers[qid]?.answer ?? "yes", verified } } });

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <p className="text-sm text-muted-foreground">{a.name} · {a.isStartup ? "Oppstart (potensial*)" : "Etablert (dokumentert)"} · lagres automatisk</p>
      <div className="mt-4 grid grid-cols-4 gap-2">
        {STEPS.map((s, i) => {
          const done = s.id !== "stops" && QUESTIONS.filter((q) => q.domain === s.id).every((q) => a.answers[q.id]);
          return (
            <button key={s.id} onClick={() => setStep(i)} className={cn("rounded-xl border px-3 py-2 text-left text-sm transition", i === step ? "border-primary bg-accent font-semibold" : "bg-card hover:bg-muted")}>
              <span className="block text-xs text-muted-foreground">Steg {i + 1}{done && " ✓"}</span>
              {s.label}
            </button>
          );
        })}
      </div>

      {cur.id === "stops" ? (
        <section className="mt-8 space-y-3">
          <h1 className="text-3xl font-semibold">Grensesjekk</h1>
          <p className="text-muted-foreground">Kryss av for det som gjelder. Disse setter et tak på nivået uansett andre svar.</p>
          {STOP_TRIGGERS.map((s) => (
            <label key={s.id} className="flex cursor-pointer items-start gap-3 rounded-2xl border bg-card p-4">
              <Checkbox checked={a.stopTriggers[s.id]} onCheckedChange={(v) => update({ stopTriggers: { ...a.stopTriggers, [s.id]: !!v } })} className="mt-0.5" />
              <span className="flex-1">
                <span className="font-medium">{s.label}</span>
                {a.stopTriggers[s.id] && (
                  <span className="mt-2 flex items-center gap-2 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive"><AlertTriangle className="h-4 w-4" />{s.warning}</span>
                )}
              </span>
            </label>
          ))}
        </section>
      ) : (
        <section className="mt-8 space-y-4">
          <div className="flex items-center gap-3">
            {(() => { const I = DomainIcon[cur.id]; return <span className="flex h-10 w-10 items-center justify-center rounded-xl text-primary-foreground" style={{ backgroundColor: domainColor[cur.id] }}><I className="h-5 w-5" /></span>; })()}
            <h1 className="text-3xl font-semibold">{cur.label}</h1>
          </div>
          {QUESTIONS.filter((q) => q.domain === cur.id).map((q) => {
            const ans = a.answers[q.id];
            return (
              <article key={q.id} className="rounded-2xl border bg-card p-5" style={{ borderLeft: `4px solid var(--ril-${q.level})` }}>
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="rounded-full px-2.5 py-0.5 font-bold text-primary-foreground" style={{ backgroundColor: `var(--ril-${q.level})` }}>Port til nivå {q.level}</span>
                  <span className="rounded-full bg-muted px-2.5 py-0.5 text-muted-foreground">FBC: {q.fbcBox}</span>
                </div>
                <h3 className="mt-3 font-sans text-base font-semibold leading-snug">{q.question}</h3>
                <p className="mt-2 flex gap-2 text-sm text-muted-foreground"><Info className="mt-0.5 h-4 w-4 shrink-0" />{q.helpText}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {([["yes", "Ja"], ["no", "Nei"], ["unsure", "Usikker / pågår"]] as const).map(([v, t]) => (
                    <Button key={v} size="sm" variant={ans?.answer === v ? "default" : "outline"} onClick={() => setAnswer(q.id, v)}>{t}</Button>
                  ))}
                </div>
                {ans?.answer === "yes" && (
                  <label className="mt-3 flex items-center gap-2 text-sm">
                    <Checkbox checked={ans.verified} onCheckedChange={(v) => setVerified(q.id, !!v)} />
                    Vi har dokumentasjon / bevis for dette
                    {!a.isStartup && !ans.verified && <span className="text-xs text-destructive">(kreves for etablerte)</span>}
                  </label>
                )}
              </article>
            );
          })}
        </section>
      )}

      <div className="mt-8 flex justify-between">
        <Button variant="outline" disabled={step === 0} onClick={() => setStep(step - 1)}><ChevronLeft /> Forrige</Button>
        {step < STEPS.length - 1 ? (
          <Button onClick={() => { setStep(step + 1); window.scrollTo({ top: 0 }); }}>Neste <ChevronRight /></Button>
        ) : (
          <Button onClick={() => navigate({ to: "/resultat/$id", params: { id: a.id } })}>Se resultat <ChevronRight /></Button>
        )}
      </div>
    </main>
  );
}
