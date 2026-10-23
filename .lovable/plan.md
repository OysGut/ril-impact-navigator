# Bransje (NACE) og Brønnøysund-oppslag i ny vurdering

## Hva brukeren får
1. **Søk opp selskap i Brønnøysundregistrene** – i «Ny vurdering» kan man skrive firmanavn eller organisasjonsnummer. Treffene vises i en liste (navn, org.nr., kommune). Når man velger et selskap fylles det inn automatisk:
   - Navn og org.nr.
   - Alle registrerte næringskoder (opptil 3)
   - Status settes til «Etablert virksomhet» hvis selskapet er registrert for mer enn ett år siden, ellers «Oppstart» (kan endres)
2. **Velg flere bransjer (NACE)** – et søkefelt mot den offisielle standarden for næringsgruppering (SSB). Man kan søke på kode eller tekst («havbruk», «03.2») og legge til flere bransjer, som vises som små merkelapper som kan fjernes.
3. **«Foreslå NACE»-knapp** – en liten knapp ved siden av bransjefeltet. Basert på navn og kort beskrivelse foreslår KI 3–5 aktuelle NACE-koder med en kort begrunnelse. Man klikker på et forslag for å legge det til.
4. Valgte bransjer og org.nr. vises på kortene i «Mine vurderinger» og på resultatsiden, og kan endres i vurderingen.

## Forutsetning
- «Foreslå NACE» bruker KI og krever at Lovable Cloud slås på (ingen ekstra konto eller nøkkel). Vurderingene lagres fortsatt i nettleseren som i dag.
- Brønnøysund-oppslag og NACE-listen er åpne offentlige tjenester og krever ingenting.

## Teknisk
- Brreg: `https://data.brreg.no/enhetsregisteret/api/enheter?navn=…` og `/enheter/{orgnr}` (åpen, CORS-støttet), debounce 300 ms. Henter `naeringskode1–3`, `stiftelsesdato`/`registreringsdatoEnhetsregisteret`, `forretningsadresse.kommune`.
- NACE-liste: SSB Klass API (klassifikasjon 6, SN2007) hentes én gang via `ensureQueryData`, filtreres lokalt; kun nivå 5-koder (`xx.xxx`) kan velges.
- AI-forslag: `createServerFn` som kaller Lovable AI Gateway med strukturert svar (`{code, name, reason}[]`); koder valideres mot SSB-listen før de vises.
- Datamodell i `ProjectAssessment`: `orgNumber?: string`, `nace: {code, name}[]` (erstatter fritekst `industry`, eksisterende verdier beholdes som beskrivelse). Lagringen i `src/lib/store.ts` er bakoverkompatibel.
- Nye komponenter: `BrregSearch`, `NacePicker` (Command/Popover fra shadcn), brukt i dialogen og i vurderingssiden.
