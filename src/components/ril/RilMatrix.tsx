import { useState } from "react";
import { DOMAINS, type InsightResult, type Domain, type RilResult } from "@/lib/ril";
import { domainLabel, questionText } from "@/lib/ril-text";
import { questionById } from "@/lib/ril";
import { useT } from "@/lib/i18n";
import { domainColor } from "./RilBits";

const REASON_EN: Record<string, string> = { "Ikke besvart": "Not answered", "Vet ikke": "Don't know", "Lav innsikt": "Low insight" };

// SVG coordinates: plot area 10..90 on both axes.
// Horizontal = insight %, vertical = RIL level.
const X = (pct: number) => 10 + (pct / 100) * 80;
const Y = (level: number) => 90 - ((level - 1) / 8) * 80;

export function RilMatrix({ r, c }: { r: RilResult; c: InsightResult }) {
  const { lang, tr } = useT();
  const [hover, setHover] = useState<Domain | "total" | null>(null);

  // Spread overlapping points a little so all three stay visible.
  const pts = DOMAINS.map((d, i) => ({ id: d.id, x: X(c.domains[d.id]) + (i - 1) * 1.6, y: Y(r.domains[d.id]) }));
  const quad = [
    { x: 30, y: 87, t: tr({ nb: "Blind sone – kartlegg først", en: "Blind spot – map first" }) },
    { x: 70, y: 87, t: tr({ nb: "Kjent skade – prioriter tiltak", en: "Known harm – prioritise action" }) },
    { x: 30, y: 14, t: tr({ nb: "Lovende, men lite forstått", en: "Promising, but poorly understood" }) },
    { x: 70, y: 14, t: tr({ nb: "Bevisst regenerativ", en: "Conscious regenerative" }) },
  ];
  const info = hover === null ? null : hover === "total"
    ? { title: tr({ nb: "Totalt", en: "Total" }), level: r.total, pct: c.total, weak: [] as InsightResult["weak"][Domain] }
    : { title: domainLabel(hover, lang), level: r.domains[hover], pct: c.domains[hover], weak: c.weak[hover] };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
      <div className="mx-auto aspect-square w-full max-w-[720px] rounded-3xl border bg-card p-2">
        <svg viewBox="0 0 100 100" className="h-full w-full" role="img" aria-label={tr({ nb: "Matrise: RIL-nivå og innsikt", en: "Matrix: RIL level and insight" })}>
          <rect x="10" y="10" width="40" height="40" fill="var(--soc)" opacity="0.08" />
          <rect x="50" y="10" width="40" height="40" fill="var(--eco)" opacity="0.12" />
          <rect x="10" y="50" width="40" height="40" fill="var(--ril-3)" opacity="0.08" />
          <rect x="50" y="50" width="40" height="40" fill="var(--muted)" opacity="0.5" />
          <rect x="10" y="10" width="80" height="80" fill="none" stroke="var(--border)" strokeWidth="0.3" />
          <line x1="10" y1="50" x2="90" y2="50" stroke="var(--ril-5)" strokeWidth="0.35" strokeDasharray="1.2 1" />
          <line x1="50" y1="10" x2="50" y2="90" stroke="var(--border)" strokeWidth="0.3" />
          {quad.map((q) => (
            <text key={q.t} x={q.x} y={q.y} textAnchor="middle" fontSize="2.4" fill="var(--muted-foreground)" fontWeight="600">{q.t}</text>
          ))}
          {Array.from({ length: 9 }, (_, i) => i + 1).map((l) => (
            <g key={l}>
              <line x1="8.8" y1={Y(l)} x2="10" y2={Y(l)} stroke="var(--muted-foreground)" strokeWidth="0.25" />
              <text x="7.8" y={Y(l) + 0.9} textAnchor="end" fontSize="2.6" fill={`var(--ril-${l})`} fontWeight="700">{l}</text>
            </g>
          ))}
          {[0, 25, 50, 75, 100].map((p) => (
            <text key={p} x={X(p)} y="94" textAnchor="middle" fontSize="2.4" fill="var(--muted-foreground)">{p}%</text>
          ))}
          <text x="50" y="98.5" textAnchor="middle" fontSize="2.8" fill="var(--foreground)" fontWeight="600">{tr({ nb: "Innsikt i egen påvirkning", en: "Impact insight" })}</text>
          <text x="2.5" y="50" textAnchor="middle" fontSize="2.8" fill="var(--foreground)" fontWeight="600" transform="rotate(-90 2.5 50)">{tr({ nb: "RIL-nivå", en: "RIL level" })}</text>

          {/* Total marker */}
          <g onMouseEnter={() => setHover("total")} onMouseLeave={() => setHover(null)} className="cursor-pointer">
            <rect x={X(c.total) - 3} y={Y(r.total) - 3} width="6" height="6" rx="1" fill="none" stroke="var(--foreground)" strokeWidth="0.6" transform={`rotate(45 ${X(c.total)} ${Y(r.total)})`} />
          </g>
          {pts.map((p) => (
            <g key={p.id} onMouseEnter={() => setHover(p.id)} onMouseLeave={() => setHover(null)} className="cursor-pointer">
              <circle cx={p.x} cy={p.y} r={hover === p.id ? 3.6 : 3} fill={domainColor[p.id]} stroke="var(--card)" strokeWidth="0.6" />
            </g>
          ))}
        </svg>
      </div>

      <aside className="space-y-3">
        {DOMAINS.map((d) => (
          <button key={d.id} type="button" onMouseEnter={() => setHover(d.id)} onMouseLeave={() => setHover(null)} onFocus={() => setHover(d.id)} onBlur={() => setHover(null)} className="flex w-full items-center gap-3 rounded-xl border bg-card p-3 text-left">
            <span className="h-4 w-4 rounded-full" style={{ backgroundColor: domainColor[d.id] }} />
            <span className="flex-1 text-sm font-semibold">{domainLabel(d.id, lang)}</span>
            <span className="text-sm text-muted-foreground">{tr({ nb: "Nivå", en: "Level" })} {r.domains[d.id]} · {tr({ nb: "Innsikt", en: "Insight" })} {c.domains[d.id]}%</span>
          </button>
        ))}
        <div className="flex items-center gap-3 rounded-xl border bg-card p-3 text-sm">
          <span className="h-3.5 w-3.5 rotate-45 border-2 border-foreground" />
          <span className="flex-1 font-semibold">{tr({ nb: "Totalt", en: "Total" })}</span>
          <span className="text-muted-foreground">{r.label} · {tr({ nb: "Innsikt", en: "Insight" })} {c.total}%</span>
        </div>
        {info && (
          <div className="rounded-xl bg-muted p-4 text-sm">
            <p className="font-semibold">{info.title}: {tr({ nb: "nivå", en: "level" })} {info.level}, {info.pct}% {tr({ nb: "innsikt", en: "insight" })}</p>
            {info.weak.length > 0 && (
              <>
                <p className="mt-2 text-xs font-semibold text-muted-foreground">{tr({ nb: "Svar som viser lav innsikt:", en: "Answers showing low insight:" })}</p>
                <ul className="mt-1 space-y-0.5 text-xs text-muted-foreground">{info.weak.map((w) => <li key={w.id}>• {questionText(questionById(w.id)!, lang).theme} – {lang === "en" ? REASON_EN[w.reason] ?? w.reason : w.reason}</li>)}</ul>
              </>
            )}
          </div>
        )}
      </aside>
    </div>
  );
}
