import { useEffect, useState } from "react";
import { Building2, Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { searchBrreg, type BrregCompany } from "@/lib/brreg";

export function BrregSearch({ onSelect }: { onSelect: (c: BrregCompany) => void }) {
  const [q, setQ] = useState("");
  const [hits, setHits] = useState<BrregCompany[]>([]);
  const [busy, setBusy] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (q.trim().length < 2) { setHits([]); return; }
    let cancel = false;
    const t = setTimeout(async () => {
      setBusy(true);
      try {
        const r = await searchBrreg(q);
        if (!cancel) { setHits(r); setOpen(true); }
      } catch {
        if (!cancel) setHits([]);
      } finally { if (!cancel) setBusy(false); }
    }, 300);
    return () => { cancel = true; clearTimeout(t); };
  }, [q]);

  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input className="pl-9" value={q} onChange={(e) => setQ(e.target.value)} onFocus={() => setOpen(true)} placeholder="Firmanavn eller org.nr." />
      {busy && <Loader2 className="absolute right-3 top-2.5 h-4 w-4 animate-spin text-muted-foreground" />}
      {open && q.trim().length >= 2 && !busy && (
        <div className="absolute z-50 mt-1 max-h-72 w-full overflow-auto rounded-xl border bg-popover p-1 shadow-lg">
          {hits.length === 0 ? (
            <p className="px-3 py-2 text-sm text-muted-foreground">Ingen treff i Brønnøysundregistrene.</p>
          ) : hits.map((h) => (
            <button key={h.orgNumber} type="button" onClick={() => { onSelect(h); setOpen(false); setQ(""); }} className="flex w-full items-start gap-2 rounded-lg px-2 py-2 text-left hover:bg-muted">
              <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span className="text-sm">
                <span className="font-semibold">{h.name}</span>
                <span className="block text-xs text-muted-foreground">{h.orgNumber}{h.municipality && ` · ${h.municipality}`}{h.nace[0] && ` · ${h.nace[0].name}`}</span>
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
