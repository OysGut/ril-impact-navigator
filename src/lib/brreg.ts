import type { NaceCode } from "./nace.functions";

export interface BrregCompany {
  orgNumber: string;
  name: string;
  municipality: string;
  registeredDate: string | null;
  nace: NaceCode[];
  activity: string;
}

interface RawEnhet {
  organisasjonsnummer: string;
  navn: string;
  forretningsadresse?: { kommune?: string };
  stiftelsesdato?: string;
  registreringsdatoEnhetsregisteret?: string;
  aktivitet?: string[];
  naeringskode1?: { kode: string; beskrivelse: string };
  naeringskode2?: { kode: string; beskrivelse: string };
  naeringskode3?: { kode: string; beskrivelse: string };
}

const map = (e: RawEnhet): BrregCompany => ({
  orgNumber: e.organisasjonsnummer,
  name: e.navn,
  municipality: e.forretningsadresse?.kommune ?? "",
  registeredDate: e.stiftelsesdato ?? e.registreringsdatoEnhetsregisteret ?? null,
  activity: (e.aktivitet ?? []).join(" "),
  nace: [e.naeringskode1, e.naeringskode2, e.naeringskode3]
    .filter((n): n is { kode: string; beskrivelse: string } => !!n)
    .map((n) => ({ code: n.kode, name: n.beskrivelse })),
});

const BASE = "https://data.brreg.no/enhetsregisteret/api/enheter";

export async function searchBrreg(query: string): Promise<BrregCompany[]> {
  const q = query.replace(/\s/g, "");
  if (/^\d{9}$/.test(q)) {
    const res = await fetch(`${BASE}/${q}`);
    return res.ok ? [map(await res.json())] : [];
  }
  const res = await fetch(`${BASE}?navn=${encodeURIComponent(query.trim())}&size=8`);
  if (!res.ok) return [];
  const json = (await res.json()) as { _embedded?: { enheter: RawEnhet[] } };
  return (json._embedded?.enheter ?? []).map(map);
}

/** Registered more than one year before `now` → established venture. */
export function isEstablished(registeredDate: string | null, now = new Date()): boolean {
  if (!registeredDate) return false;
  const d = new Date(registeredDate);
  const oneYearAgo = new Date(now);
  oneYearAgo.setFullYear(now.getFullYear() - 1);
  return d < oneYearAgo;
}
