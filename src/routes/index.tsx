import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, BookOpen, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAssessments, saveAssessment, deleteAssessment } from "@/lib/store";
import { calculateRIL, DOMAINS, emptyStops, LEVELS } from "@/lib/ril";
import { RilBadge, domainColor } from "@/components/ril/RilBits";
import { cn } from "@/lib/utils";
import { BrregSearch } from "@/components/ril/BrregSearch";
import { NacePicker } from "@/components/ril/NacePicker";
import { isEstablished, type BrregCompany } from "@/lib/brreg";
import type { NaceCode } from "@/lib/nace.functions";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "RIL Navigator – Mine vurderinger" },
      { name: "description", content: "Vurder prosjekter og virksomheter på RIL-skalaen 1–9 for regenerativ påvirkning." },
      { property: "og:title", content: "RIL Navigator – Regenerative Impact Level" },
      { property: "og:description", content: "En vitenskapsbasert 1–9-skala for regenerative forretningsmodeller." },
    ],
  }),
  component: Dashboard,
});

function NewAssessment() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [industry, setIndustry] = useState("");
  const [isStartup, setIsStartup] = useState(true);
  const [orgNumber, setOrgNumber] = useState<string | undefined>();
  const [nace, setNace] = useState<NaceCode[]>([]);
  const pick = (c: BrregCompany) => {
    setName(c.name);
    setOrgNumber(c.orgNumber);
    setNace(c.nace);
    if (c.activity) setIndustry(c.activity.slice(0, 300));
    setIsStartup(!isEstablished(c.registeredDate));
  };
  const start = () => {
    const id = crypto.randomUUID();
    saveAssessment({ id, name: name.trim() || tr({ nb: "Uten navn", en: "Untitled" }), industry, orgNumber, nace, isStartup, answers: {}, updatedAt: "" });
    navigate({ to: "/vurdering/$id", params: { id } });
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="lg"><Plus /> Start ny vurdering</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader><DialogTitle className="font-display text-2xl">{tr({ nb: "Ny vurdering", en: "New assessment" })}</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>{tr({ nb: "Hent fra Brønnøysundregistrene (valgfritt)", en: "Fetch from the Brønnøysund Register (optional)" })}</Label>
            <BrregSearch onSelect={pick} />
            {orgNumber && <p className="text-xs text-muted-foreground">{tr({ nb: "Hentet fra Enhetsregisteret · org.nr.", en: "Fetched from the Central Coordinating Register · org. no." })} {orgNumber}</p>}
          </div>
          <div className="space-y-1.5"><Label>{tr({ nb: "Prosjekt / virksomhet", en: "Project / business" })}</Label><Input value={name} onChange={(e) => setName(e.target.value)} placeholder={tr({ nb: "F.eks. Fjordtare AS", en: "E.g. Fjordtare AS" })} /></div>
          <div className="space-y-1.5"><Label>{tr({ nb: "Bransje / kort beskrivelse", en: "Industry / short description" })}</Label><Input value={industry} onChange={(e) => setIndustry(e.target.value)} placeholder={tr({ nb: "F.eks. Regenerativt tarehavbruk i Nord-Norge", en: "E.g. Regenerative kelp farming in Northern Norway" })} /></div>
          <div className="space-y-1.5"><Label>{tr({ nb: "Bransjer (NACE)", en: "Industries (NACE)" })}</Label><NacePicker value={nace} onChange={setNace} name={name} description={industry} /></div>
          <div className="grid grid-cols-2 gap-2">
            {[
              { v: true, t: tr({ nb: "Oppstart / konsept", en: "Startup / concept" }), d: tr({ nb: "Vurderes på potensial (*)", en: "Assessed on potential (*)" }) },
              { v: false, t: tr({ nb: "Etablert virksomhet", en: "Established venture" }), d: tr({ nb: "Krever dokumentasjon", en: "Requires documentation" }) },
            ].map((o) => (
              <button key={o.t} type="button" onClick={() => setIsStartup(o.v)} className={cn("rounded-xl border p-3 text-left transition", isStartup === o.v ? "border-primary bg-accent" : "hover:bg-muted")}>
                <div className="text-sm font-semibold">{o.t}</div>
                <div className="text-xs text-muted-foreground">{o.d}</div>
              </button>
            ))}
          </div>
          <Button className="w-full" onClick={start}>{tr({ nb: "Start vurderingen", en: "Start the assessment" })}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Dashboard() {
  const list = useAssessments();
  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <section className="relative overflow-hidden rounded-3xl border bg-card p-10 md:p-14" style={{ backgroundImage: "var(--gradient-nested)" }}>
        <p className="text-sm font-semibold uppercase tracking-widest text-primary">Regenerative Impact Level</p>
        <h1 className="mt-3 max-w-2xl text-4xl font-semibold leading-tight md:text-6xl">{tr({ nb: "Mindre dårlig er ikke det samme som godt.", en: "Less bad is not the same as good." })}</h1>
        <p className="mt-4 max-w-xl text-lg text-muted-foreground">
          Mål virksomheten på en absolutt skala fra 1 til 9 – der det svakeste laget av natur, samfunn og økonomi bestemmer.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <NewAssessment />
          <Button size="lg" variant="outline" asChild><Link to="/guide"><BookOpen /> Utforsk RIL-nivåene</Link></Button>
        </div>
        <div className="mt-10 flex gap-1">
          {LEVELS.map((l) => (
            <div key={l.level} className="h-2 flex-1 rounded-full" style={{ backgroundColor: `var(--ril-${l.level})` }} />
          ))}
        </div>
      </section>

      <h2 className="mt-14 text-2xl font-semibold">{tr({ nb: "Mine vurderinger", en: "My assessments" })}</h2>
      {list.length === 0 ? (
        <p className="mt-4 rounded-2xl border border-dashed p-10 text-center text-muted-foreground">{tr({ nb: "Ingen vurderinger ennå. Start din første over.", en: "No assessments yet. Start your first one above." })}</p>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((a) => {
            const r = calculateRIL(a.answers, a.isStartup);
            return (
              <div key={a.id} className="group rounded-2xl border bg-card p-5 transition hover:shadow-md">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold">{a.name}</h3>
                    <p className="text-xs text-muted-foreground">{a.isStartup ? tr({ nb: "Oppstart", en: "Startup" }) : tr({ nb: "Etablert", en: "Established" })}{a.orgNumber && ` · ${a.orgNumber}`} · {new Date(a.updatedAt).toLocaleDateString(lang === "en" ? "en-GB" : "nb-NO")}</p>
                  </div>
                  <RilBadge level={r.total} asterisk={r.asterisk} size="sm" />
                </div>
                {a.nace && a.nace.length > 0 && (
                  <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">{a.nace.map((n) => `${n.code} ${n.name}`).join(" · ")}</p>
                )}
                <div className="mt-4 flex gap-2">
                  {DOMAINS.map((d) => (
                    <span key={d.id} className="rounded-full px-2.5 py-0.5 text-xs font-semibold text-primary-foreground" style={{ backgroundColor: domainColor[d.id] }}>
                      {d.label} {r.domains[d.id]}
                    </span>
                  ))}
                </div>
                <div className="mt-5 flex gap-2">
                  <Button size="sm" asChild><Link to="/resultat/$id" params={{ id: a.id }}>{tr({ nb: "Se resultat", en: "See result" })}</Link></Button>
                  <Button size="sm" variant="outline" asChild><Link to="/vurdering/$id" params={{ id: a.id }}>{tr({ nb: "Rediger", en: "Edit" })}</Link></Button>
                  <Button size="sm" variant="ghost" className="ml-auto" aria-label={tr({ nb: "Slett", en: "Delete" })} onClick={() => confirm(tr({ nb: "Slette vurderingen?", en: "Delete the assessment?" })) && deleteAssessment(a.id)}><Trash2 /></Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
