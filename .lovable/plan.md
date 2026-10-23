# Matrisen: RIL-nivå loddrett, innsikt vannrett

## Idé
Den andre aksen skal ikke måle hvor mange spørsmål som er besvart eller dokumentert. Den skal måle hvor godt virksomheten **forstår sin egen påvirkning**, ut fra hva den har svart. En virksomhet kan ha lav RIL og samtidig god innsikt («vi vet at kjernen er fossil»). Det er noe helt annet enn lav RIL uten innsikt («vi har ikke sett på dette»).

## Begrep
Forslag: **Innsikt** (EN: **Impact insight**), med undertittelen «Hvor godt dere forstår egen påvirkning» / «How well you understand your own impact». Andre mulige navn: «Bevissthet», «Erkjennelse» eller «Problemforståelse». Navnet kan lett byttes senere.

## Slik beregnes innsikt (faste, etterprøvbare regler)
- Hvert svaralternativ får en egen innsiktsverdi fra 0 til 4 i tillegg til modenheten. Den sier noe om hva svaret viser om kunnskapen, ikke om hvor godt det går.
  - «Vi har ikke sett på dette», vage svar og «Vet ikke» gir lav verdi.
  - Svar som tydelig erkjenner et problem, også et dårlig resultat, gir høy verdi. Eksempel: «Kjernen er fossil utvinning» viser at virksomheten kjenner problemet.
  - Svar som viser kartlegging, måling eller konkrete planer gir høy verdi.
- Innsikten for hvert område er gjennomsnittet av områdets svar, omregnet til 0–100 %. Totalen er snittet av de tre områdene.
- Dokumentasjon påvirker ikke innsikten. For etablerte virksomheter påvirker den fortsatt bare RIL-nivået, som før. Taket på 60 % og avkrysningen «underbygget» for oppstarter tas bort.

## Matrisen
- Loddrett akse: RIL 1–9. Vannrett akse: Innsikt 0–100 %.
- Nye kvadranter:
  - Lav RIL, lav innsikt: «Blind sone – kartlegg først»
  - Lav RIL, høy innsikt: «Kjent skade – prioriter tiltak»
  - Høy RIL, lav innsikt: «Lovende, men lite forstått»
  - Høy RIL, høy innsikt: «Bevisst regenerativ»
- I sidepanelet vises hvert område som «Nivå X · Innsikt Y %». Under står listen «Svar som viser lav innsikt», med spørsmålets tema og hva som ble svart.
- Veiviseren viser fortsatt ingen konsekvenser.

## Teknisk
- `src/lib/ril.ts`: `Option.insight: 0–4` settes eksplisitt for alle 16 × 5 alternativer i `opts()`-listene. Spørsmålstekstene endres ikke. `calculateCertainty` erstattes av `calculateInsight(answers)` → `{ domains, total, weak }`. `STARTUP_CERTAINTY_CAP` fjernes. `effectiveMaturity` er uendret.
- `src/lib/ril.en.ts` / `ril-text.ts`: engelske tekster for de nye etikettene.
- `src/components/ril/RilMatrix.tsx`: bytt aksene, nye kvadrantnavn og ny forklaring.
- `src/routes/resultat.$id.tsx`: oppdater tekster, og fjern merknaden om taket på 60 %.
- `src/routes/vurdering.$id.tsx`: avkrysningen for oppstarter fjernes igjen. Etablerte beholder «Dette kan vi dokumentere».
- Tester i `ril.test.ts`: «Vet ikke» på alt gir 0 %. «Kjernen er fossil» gir høy innsikt selv om modenheten er 0. Svar med lav innsikt havner i `weak`. Testene for sikkerhet fjernes.
- Prosjektminnet oppdateres: aksen viser innsikt fra svarinnholdet, ikke antall svar eller dokumentasjon.
