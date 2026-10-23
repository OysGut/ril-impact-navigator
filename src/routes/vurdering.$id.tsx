import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Check, ChevronLeft, ChevronRight, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useAssessments, saveAssessment } from "@/lib/store";
import { DOMAINS, QUESTIONS, UNKNOWN, type ProjectAssessment } from "@/lib/ril";
import { domainLabel, questionText } from "@/lib/ril-text";
import { useT } from "@/lib/i18n";
import { domainColor, DomainIcon } from "@/components/ril/RilBits";
import { NacePicker } from "@/components/ril/NacePicker";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/vurdering/$id")({
  head: () => ({
    meta: [
      { title: "Vurdering – RIL Navigator" },
      { name: "description", content: "Beskriv virksomheten steg for steg innen økologi, samfunn og økonomi." },
      { property: "og:title", content: "RIL-vurdering" },
      { property: "og:description", content: "Beskriv virksomheten – systemet finner det regenerative nivået." },
    ],
  }),
  component: Wizard,
});

function Wizard() {
  const { id } = Route.useParams();
  const { tr } = useT();
  const list = useAssessments();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const a = list.find((x) => x.id === id);
  if (!mounted) return null;
  if (!a) return <main className="p-12 text-center">{tr({ nb: "Fant ikke vurderingen.", en: "Assessment not found." })} <Link to="/" className="text-primary underline">{tr({ nb: "Tilbake", en: "Back" })}</Link></main>;
  return <WizardInner a={a} />;
}

const ORDERED = DOMAINS.flatMap((d) => QUESTIONS.filter((q) => q.domain === d.id));

function WizardInner({ a }: { a: ProjectAssessment }) {
  const navigate = useNavigate();
  const { lang, tr } = useT();
  const [pos, setPos] = useState(() => {
    const first = ORDERED.findIndex((q) => !a.answers[q.id]);
    return first === -1 ? 0 : first;
  });
  const update = (patch: Partial<ProjectAssessment>) => saveAssessment({ ...a, ...patch, resetNotice: false });
  const q = ORDERED[pos]!;
  const t = questionText(q, lang);
  const ans = a.answers[q.id];
  const sectionQs = ORDERED.filter((x) => x.domain === q.domain);
  const go = (n: number) => { setPos(Math.max(0, Math.min(ORDERED.length - 1, n))); window.scrollTo({ top: 0 }); };
  const choose = (optionId: string) =>
    update({ answers: { ...a.answers, [q.id]: { optionId, verified: ans?.optionId === optionId ? ans.verified : false } } });
  const Icon = DomainIcon[q.domain];

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <p className="text-sm text-muted-foreground">{a.name} · {tr({ nb: "lagres automatisk", en: "saved automatically" })}</p>
      {a.resetNotice && (
        <p className="mt-3 rounded-xl bg-accent p-3 text-sm text-accent-foreground">
          {tr({ nb: "Spørsmålene er fornyet. Tidligere svar er nullstilt – svar gjerne på nytt.", en: "The questions have been renewed. Previous answers were reset – please answer again." })}
        </p>
      )}
      <details className="mt-3 rounded-xl border bg-card p-3">
        <summary className="cursor-pointer text-sm font-medium">{tr({ nb: "Bransjer (NACE)", en: "Industries (NACE)" })}: {a.nace?.length ? a.nace.map((n) => n.code).join(", ") : tr({ nb: "ingen valgt", en: "none selected" })}</summary>
        <div className="mt-3"><NacePicker value={a.nace ?? []} onChange={(nace) => update({ nace })} name={a.name} description={a.industry} /></div>
      </details>

      <div className="mt-4 grid grid-cols-3 gap-2">
        {DOMAINS.map((d) => {
          const qs = ORDERED.filter((x) => x.domain === d.id);
          const answered = qs.filter((x) => a.answers[x.id]).length;
          return (
            <button key={d.id} onClick={() => go(ORDERED.indexOf(qs[0]!))} className={cn("rounded-xl border px-3 py-2 text-left text-sm transition", d.id === q.domain ? "border-primary bg-accent font-semibold" : "bg-card hover:bg-muted")}>
              <span className="block text-xs text-muted-foreground">{answered}/{qs.length} {tr({ nb: "besvart", en: "answered" })}</span>
              {domainLabel(d.id, lang)}
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {sectionQs.map((x, i) => (
          <button
            key={x.id}
            onClick={() => go(ORDERED.indexOf(x))}
            aria-label={`${tr({ nb: "Spørsmål", en: "Question" })} ${i + 1}`}
            className={cn(
              "h-8 w-8 rounded-full border text-xs font-semibold transition",
              x.id === q.id ? "border-primary bg-primary text-primary-foreground" : a.answers[x.id] ? "bg-accent text-accent-foreground" : "bg-card text-muted-foreground hover:bg-muted",
            )}
          >
            {i + 1}
          </button>
        ))}
      </div>

      <article key={q.id} className="mt-6 rounded-3xl border bg-card p-8 md:p-10">
        <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: domainColor[q.domain] }}>
          <Icon className="h-4 w-4" />
          {domainLabel(q.domain, lang)} · {t.theme}
        </div>
        <h1 className="mt-4 text-2xl font-semibold leading-snug md:text-3xl">{t.question}</h1>

        {t.guidance.length > 0 && (
          <div className="mt-6 rounded-2xl bg-muted/60 p-5">
            <p className="flex items-center gap-2 text-sm font-semibold"><Lightbulb className="h-4 w-4 text-primary" /> {tr({ nb: "Slik kan du forstå spørsmålet", en: "How to understand the question" })}</p>
            <ul className="mt-3 space-y-2">
              {t.guidance.map((g) => (
                <li key={g} className="flex gap-2 text-sm leading-relaxed text-muted-foreground"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />{g}</li>
              ))}
            </ul>
          </div>
        )}

        <p className="mt-6 text-sm font-semibold">{tr({ nb: "Hva passer best for dere?", en: "What fits you best?" })}</p>
        <div className="mt-3 space-y-2" role="radiogroup">
          {q.options.map((o, i) => {
            const ot = t.option(i);
            const selected = ans?.optionId === o.id;
            return (
              <button
                key={o.id}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => choose(o.id)}
                className={cn("flex w-full items-start gap-3 rounded-2xl border p-4 text-left transition", selected ? "border-primary bg-accent" : "bg-background hover:bg-muted")}
              >
                <span className={cn("mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border", selected && "border-primary bg-primary text-primary-foreground")}>
                  {selected && <Check className="h-3 w-3" />}
                </span>
                <span>
                  <span className="block text-sm font-medium">{ot.label}</span>
                  {ot.hint && <span className="mt-0.5 block text-xs text-muted-foreground">{ot.hint}</span>}
                </span>
              </button>
            );
          })}
          <button
            type="button"
            role="radio"
            aria-checked={ans?.optionId === UNKNOWN}
            onClick={() => choose(UNKNOWN)}
            className={cn("w-full rounded-2xl border border-dashed p-3 text-center text-sm text-muted-foreground transition", ans?.optionId === UNKNOWN ? "border-primary bg-accent text-accent-foreground" : "hover:bg-muted")}
          >
            {tr({ nb: "Vet ikke", en: "Don't know" })}
          </button>
        </div>

        {ans && ans.optionId !== UNKNOWN && (
          <label className="mt-4 flex items-center gap-2 text-sm">
            <Checkbox checked={ans.verified} onCheckedChange={(v) => update({ answers: { ...a.answers, [q.id]: { ...ans, verified: !!v } } })} />
            {a.isStartup
              ? tr({ nb: "Svaret er underbygget (pilot, forskning, avtaler eller beregninger)", en: "Answer is substantiated (pilot, research, agreements or calculations)" })
              : tr({ nb: "Dette kan vi dokumentere", en: "We can document this" })}
          </label>
        )}
      </article>

      <div className="mt-6 flex justify-between">
        <Button variant="outline" disabled={pos === 0} onClick={() => go(pos - 1)}><ChevronLeft /> {tr({ nb: "Forrige", en: "Previous" })}</Button>
        {pos < ORDERED.length - 1 ? (
          <Button onClick={() => go(pos + 1)}>{ans ? tr({ nb: "Neste", en: "Next" }) : tr({ nb: "Hopp over", en: "Skip" })} <ChevronRight /></Button>
        ) : (
          <Button onClick={() => navigate({ to: "/resultat/$id", params: { id: a.id } })}>{tr({ nb: "Se resultat", en: "See result" })} <ChevronRight /></Button>
        )}
      </div>
      <p className="mt-6 text-center text-xs text-muted-foreground">
        <Link to="/resultat/$id" params={{ id: a.id }} className="underline">{tr({ nb: "Gå til resultat", en: "Go to result" })}</Link>
      </p>
    </main>
  );
}
