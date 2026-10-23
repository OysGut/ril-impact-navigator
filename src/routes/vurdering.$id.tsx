import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Lightbulb, ShieldQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useAssessments, saveAssessment } from "@/lib/store";
import { DOMAINS, QUESTIONS, STOP_TRIGGERS, type Answer, type ProjectAssessment } from "@/lib/ril";
import { domainColor, DomainIcon } from "@/components/ril/RilBits";
import { cn } from "@/lib/utils";
import { NacePicker } from "@/components/ril/NacePicker";
import { GUIDANCE, STOP_QUESTIONS } from "@/lib/guidance";

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

type Item =
  | { kind: "q"; id: string; section: string; q: (typeof QUESTIONS)[number] }
  | { kind: "stop"; id: string; section: "stops"; stopId: keyof ProjectAssessment["stopTriggers"] };

const ITEMS: Item[] = [
  ...DOMAINS.flatMap((d) =>
    QUESTIONS.filter((q) => q.domain === d.id).sort((x, y) => x.level - y.level).map((q) => ({ kind: "q" as const, id: q.id, section: d.id, q })),
  ),
  ...STOP_TRIGGERS.map((t) => ({ kind: "stop" as const, id: `stop-${t.id}`, section: "stops" as const, stopId: t.id })),
];

function WizardInner({ a }: { a: ProjectAssessment }) {
  const navigate = useNavigate();
  const [pos, setPos] = useState(() => {
    const first = ITEMS.findIndex((it) => !a.answers[it.id]);
    return first === -1 ? 0 : first;
  });
  const update = (patch: Partial<ProjectAssessment>) => saveAssessment({ ...a, ...patch });
  const item = ITEMS[pos]!;
  const ans = a.answers[item.id];
  const sectionItems = ITEMS.filter((it) => it.section === item.section);
  const sectionStep = STEPS.findIndex((s) => s.id === item.section);
  const go = (n: number) => { setPos(Math.max(0, Math.min(ITEMS.length - 1, n))); window.scrollTo({ top: 0 }); };

  const setAnswer = (answer: Answer) => {
    const patch: Partial<ProjectAssessment> = {
      answers: { ...a.answers, [item.id]: { answer, verified: ans?.verified ?? false } },
    };
    if (item.kind === "stop") patch.stopTriggers = { ...a.stopTriggers, [item.stopId]: answer === "yes" };
    update(patch);
  };
  const setVerified = (verified: boolean) =>
    update({ answers: { ...a.answers, [item.id]: { answer: ans?.answer ?? "yes", verified } } });

  const question = item.kind === "q" ? item.q.question : STOP_QUESTIONS[item.stopId]!.question;
  const guidance = item.kind === "q" ? (GUIDANCE[item.id] ?? []) : STOP_QUESTIONS[item.stopId]!.guidance;
  const Icon = item.kind === "q" ? DomainIcon[item.q.domain] : ShieldQuestion;
  const color = item.kind === "q" ? domainColor[item.q.domain] : "var(--ril-5)";

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <p className="text-sm text-muted-foreground">{a.name} · lagres automatisk</p>
      <details className="mt-3 rounded-xl border bg-card p-3">
        <summary className="cursor-pointer text-sm font-medium">Bransjer (NACE): {a.nace?.length ? a.nace.map((n) => n.code).join(", ") : "ingen valgt"}</summary>
        <div className="mt-3"><NacePicker value={a.nace ?? []} onChange={(nace) => update({ nace })} name={a.name} description={a.industry} /></div>
      </details>

      <div className="mt-4 grid grid-cols-4 gap-2">
        {STEPS.map((s, i) => {
          const its = ITEMS.filter((it) => it.section === s.id);
          const answered = its.filter((it) => a.answers[it.id]).length;
          return (
            <button key={s.id} onClick={() => go(ITEMS.indexOf(its[0]!))} className={cn("rounded-xl border px-3 py-2 text-left text-sm transition", i === sectionStep ? "border-primary bg-accent font-semibold" : "bg-card hover:bg-muted")}>
              <span className="block text-xs text-muted-foreground">{answered}/{its.length} besvart</span>
              {s.label}
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5" aria-label="Spørsmål i denne delen">
        {sectionItems.map((it, i) => (
          <button
            key={it.id}
            onClick={() => go(ITEMS.indexOf(it))}
            aria-label={`Spørsmål ${i + 1}`}
            className={cn(
              "h-8 w-8 rounded-full border text-xs font-semibold transition",
              it.id === item.id ? "border-primary bg-primary text-primary-foreground" : a.answers[it.id] ? "bg-accent text-accent-foreground" : "bg-card text-muted-foreground hover:bg-muted",
            )}
          >
            {i + 1}
          </button>
        ))}
      </div>

      <article key={item.id} className="mt-6 rounded-3xl border bg-card p-8 md:p-10">
        <div className="flex items-center gap-2 text-sm font-semibold" style={{ color }}>
          <Icon className="h-4 w-4" />
          {STEPS[sectionStep]!.label} · spørsmål {sectionItems.indexOf(item) + 1} av {sectionItems.length}
        </div>
        <h1 className="mt-4 text-2xl font-semibold leading-snug md:text-3xl">{question}</h1>

        {guidance.length > 0 && (
          <div className="mt-6 rounded-2xl bg-muted/60 p-5">
            <p className="flex items-center gap-2 text-sm font-semibold"><Lightbulb className="h-4 w-4 text-primary" /> Slik kan du forstå spørsmålet</p>
            <ul className="mt-3 space-y-2">
              {guidance.map((g) => (
                <li key={g} className="flex gap-2 text-sm leading-relaxed text-muted-foreground"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />{g}</li>
              ))}
            </ul>
          </div>
        )}

        {item.kind === "q" && <p className="mt-4 text-xs text-muted-foreground">Flourishing Business Canvas: {item.q.fbcBox}</p>}

        <div className="mt-6 grid gap-2 sm:grid-cols-3">
          {([["yes", "Ja"], ["no", "Nei"], ["unsure", "Usikker / pågår"]] as const).map(([v, t]) => (
            <Button key={v} size="lg" variant={ans?.answer === v ? "default" : "outline"} onClick={() => setAnswer(v)}>{t}</Button>
          ))}
        </div>
        {item.kind === "q" && ans?.answer === "yes" && (
          <label className="mt-4 flex items-center gap-2 text-sm">
            <Checkbox checked={ans.verified} onCheckedChange={(v) => setVerified(!!v)} />
            Vi har dokumentasjon / bevis for dette
          </label>
        )}
      </article>

      <div className="mt-6 flex justify-between">
        <Button variant="outline" disabled={pos === 0} onClick={() => go(pos - 1)}><ChevronLeft /> Forrige</Button>
        {pos < ITEMS.length - 1 ? (
          <Button onClick={() => go(pos + 1)}>{ans ? "Neste" : "Hopp over"} <ChevronRight /></Button>
        ) : (
          <Button onClick={() => navigate({ to: "/resultat/$id", params: { id: a.id } })}>Se resultat <ChevronRight /></Button>
        )}
      </div>
      <p className="mt-6 text-center text-xs text-muted-foreground">
        <Link to="/resultat/$id" params={{ id: a.id }} className="underline">Gå til resultat</Link>
      </p>
    </main>
  );
}
