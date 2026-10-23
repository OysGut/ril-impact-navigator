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
  const start = () => {
    const id = crypto.randomUUID();
    saveAssessment({ id, name: name.trim() || "Uten navn", industry, isStartup, answers: {}, stopTriggers: emptyStops(), updatedAt: "" });
    navigate({ to: "/vurdering/$id", params: { id } });
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="lg"><Plus /> Start ny vurdering</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle className="font-display text-2xl">Ny vurdering</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1.5"><Label>Prosjekt / virksomhet</Label><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="F.eks. Fjordtare AS" /></div>
          <div className="space-y-1.5"><Label>Bransje / kort beskrivelse</Label><Input value={industry} onChange={(e) => setIndustry(e.target.value)} placeholder="F.eks. Havbruk" /></div>
          <div className="grid grid-cols-2 gap-2">
            {[
              { v: true, t: "Oppstart / konsept", d: "Vurderes på potensial (*)" },
              { v: false, t: "Etablert virksomhet", d: "Krever dokumentasjon" },
            ].map((o) => (
              <button key={o.t} type="button" onClick={() => setIsStartup(o.v)} className={cn("rounded-xl border p-3 text-left transition", isStartup === o.v ? "border-primary bg-accent" : "hover:bg-muted")}>
                <div className="text-sm font-semibold">{o.t}</div>
                <div className="text-xs text-muted-foreground">{o.d}</div>
              </button>
            ))}
          </div>
          <Button className="w-full" onClick={start}>Start vurderingen</Button>
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
        <h1 className="mt-3 max-w-2xl text-4xl font-semibold leading-tight md:text-6xl">Mindre dårlig er ikke det samme som godt.</h1>
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

      <h2 className="mt-14 text-2xl font-semibold">Mine vurderinger</h2>
      {list.length === 0 ? (
        <p className="mt-4 rounded-2xl border border-dashed p-10 text-center text-muted-foreground">Ingen vurderinger ennå. Start din første over.</p>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((a) => {
            const r = calculateRIL(a.answers, a.isStartup, a.stopTriggers);
            return (
              <div key={a.id} className="group rounded-2xl border bg-card p-5 transition hover:shadow-md">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold">{a.name}</h3>
                    <p className="text-xs text-muted-foreground">{a.isStartup ? "Oppstart" : "Etablert"}{a.industry && ` · ${a.industry}`} · {new Date(a.updatedAt).toLocaleDateString("nb-NO")}</p>
                  </div>
                  <RilBadge level={r.total} asterisk={r.asterisk} size="sm" />
                </div>
                <div className="mt-4 flex gap-2">
                  {DOMAINS.map((d) => (
                    <span key={d.id} className="rounded-full px-2.5 py-0.5 text-xs font-semibold text-primary-foreground" style={{ backgroundColor: domainColor[d.id] }}>
                      {d.label} {r.domains[d.id]}
                    </span>
                  ))}
                </div>
                <div className="mt-5 flex gap-2">
                  <Button size="sm" asChild><Link to="/resultat/$id" params={{ id: a.id }}>Se resultat</Link></Button>
                  <Button size="sm" variant="outline" asChild><Link to="/vurdering/$id" params={{ id: a.id }}>Rediger</Link></Button>
                  <Button size="sm" variant="ghost" className="ml-auto" aria-label="Slett" onClick={() => confirm("Slette vurderingen?") && deleteAssessment(a.id)}><Trash2 /></Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
