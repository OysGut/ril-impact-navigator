import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Sparkles, X, Loader2, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getNaceCodes, suggestNace, type NaceCode } from "@/lib/nace.functions";

export function NacePicker({ value, onChange, name, description }: { value: NaceCode[]; onChange: (v: NaceCode[]) => void; name: string; description: string }) {
  const [q, setQ] = useState("");
  const fetchCodes = useServerFn(getNaceCodes);
  const suggestFn = useServerFn(suggestNace);
  const { data: codes = [], isLoading } = useQuery({ queryKey: ["nace"], queryFn: () => fetchCodes(), staleTime: Infinity });
  const [suggestions, setSuggestions] = useState<(NaceCode & { reason: string })[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hits = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (t.length < 2) return [];
    return codes.filter((c) => c.code.startsWith(t) || c.name.toLowerCase().includes(t)).slice(0, 8);
  }, [q, codes]);

  const has = (c: string) => value.some((v) => v.code === c);
  const add = (c: NaceCode) => { if (!has(c.code)) onChange([...value, { code: c.code, name: c.name }]); setQ(""); };

  const suggest = async () => {
    setBusy(true); setError(null);
    try {
      const r = await suggestFn({ data: { name, description } });
      setSuggestions(r.suggestions);
      if (r.error) setError(r.error);
      else if (!r.suggestions.length) setError("Fant ingen forslag – prøv å skrive en litt lengre beskrivelse.");
    } catch {
      setError("Kunne ikke hente forslag akkurat nå.");
    } finally { setBusy(false); }
  };

  return (
    <div className="space-y-2">
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {value.map((v) => (
            <span key={v.code} className="inline-flex items-center gap-1 rounded-full bg-accent px-2.5 py-1 text-xs text-accent-foreground">
              <b>{v.code}</b> {v.name}
              <button type="button" aria-label={`Fjern ${v.code}`} onClick={() => onChange(value.filter((x) => x.code !== v.code))}><X className="h-3 w-3" /></button>
            </span>
          ))}
        </div>
      )}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder={isLoading ? "Laster bransjer…" : "Søk bransje eller kode, f.eks. havbruk"} />
          {hits.length > 0 && (
            <div className="absolute z-50 mt-1 max-h-64 w-full overflow-auto rounded-xl border bg-popover p-1 shadow-lg">
              {hits.map((h) => (
                <button key={h.code} type="button" onClick={() => add(h)} disabled={has(h.code)} className="flex w-full gap-2 rounded-lg px-2 py-1.5 text-left text-sm hover:bg-muted disabled:opacity-50">
                  <span className="font-mono text-xs text-muted-foreground">{h.code}</span>{h.name}
                </button>
              ))}
            </div>
          )}
        </div>
        <Button type="button" variant="outline" size="sm" className="h-9" onClick={suggest} disabled={busy}>
          {busy ? <Loader2 className="animate-spin" /> : <Sparkles />} Foreslå NACE
        </Button>
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
      {suggestions.length > 0 && (
        <div className="space-y-1 rounded-xl border bg-muted/40 p-2">
          <p className="px-1 text-xs font-semibold text-muted-foreground">KI-forslag – klikk for å legge til</p>
          {suggestions.map((s) => (
            <button key={s.code} type="button" disabled={has(s.code)} onClick={() => add(s)} className="flex w-full items-start gap-2 rounded-lg px-2 py-1.5 text-left text-sm hover:bg-background disabled:opacity-50">
              <Plus className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span><b className="font-mono text-xs">{s.code}</b> {s.name}<span className="block text-xs text-muted-foreground">{s.reason}</span></span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
