# Ny spørsmålsmodell: beskrivende svar, systemet setter nivået

## Problemet i dag
Hvert spørsmål er en direkte «port» til ett nivå (spørsmål 5 = nivå 5), og brukeren svarer Ja/Nei. Da vurderer brukeren i praksis seg selv. Nå skal brukeren bare beskrive virksomheten sin, og systemet regner ut nivået med faste regler som kan etterprøves.

## Hvordan det fungerer for brukeren
- Hvert lag (Økologi, Samfunn, Økonomi) har **5–6 spørsmål om tema**, ikke om nivåer. Eksempler fra Økologi:
  - «Hvordan kjenner dere til virksomhetens miljøpåvirkning?»
  - «Hvordan har påvirkningen utviklet seg de siste årene?»
  - «Hva gjør dere med natur som verdikjeden har brukt eller skadet?»
  - «Hvordan påvirker virksomheten naturen utenfor egen verdikjede?»
  - «Hvem tar beslutninger på vegne av naturen?»
- Hvert spørsmål har **4–5 beskrivende svaralternativer** som en trapp fra «lite» til «mye». Eksempel:
  1. Vi har ikke sett på dette
  2. Vi har grove anslag
  3. Vi har kartlagt de viktigste områdene
  4. Vi måler årlig mot en baseline
  5. Målingene viser at vi er innenfor det naturen tåler, uten kompensasjon
- I tillegg finnes alternativet «Vet ikke». Under hvert alternativ kan det stå en kort forklaring.
- Det står ingen nivå, poeng eller konsekvens i veiviseren. De støttende utsagnene og ett spørsmål om gangen beholdes.
- Etablerte virksomheter får en enkel avkrysning, «Dette kan vi dokumentere», ved de høyeste alternativene. Oppstarter blir ikke spurt.
- Grensesjekkene (fossil kjerne, kompensasjon, manglende målinger, ukjente skader) blir ikke egne spørsmål. Systemet leser dem ut av de vanlige svarene.

## Hvordan systemet setter nivået (faste regler)
- Hvert svaralternativ gir en **modenhet på 0–4** på et tema.
- Hvert nivå har krav i hvert lag. For eksempel krever nivå 5 i Økologi:
  - modenhet minst 3 på «kjennskap til påvirkning»
  - modenhet minst 3 på «utvikling over tid»
  - at kompensasjon ikke er hovedveien til netto null
- Lagets nivå blir det høyeste nivået der alle kravene er møtt.
- Det svakeste laget bestemmer totalen, som i dag. Taket ved fossil kjerne (2), manglende målinger (3) og bare kompensasjon (4) gjelder fortsatt, men utløses av svarene.
- «Vet ikke» teller som laveste modenhet.
- For etablerte virksomheter teller et høyt alternativ uten dokumentasjon ett trinn lavere.

## Resultatsiden blir mer forklarende
- Hvert lag får «Hvorfor dette nivået?» med de konkrete kravene som er møtt (✓) og ikke møtt (✗), og hvilke svar de bygger på.
- «Raskeste vei» peker på kravet som mangler for neste nivå, og hvilket svar som må endres.

## Ny visning: Score og sikkerhet (matrise)
- Resultatsiden får to faner: «Oversikt» (som i dag) og «Matrise».
- Matrisen er et stort, kvadratisk diagram:
  - Den vannrette aksen viser RIL-nivå 1–9, med en stiplet linje ved nivå 5.
  - Den loddrette aksen viser hvor sikker scoren er, fra 0 til 100 %.
- Hvert lag (Økologi, Samfunn, Økonomi) vises som en stor prikk i sin egen farge, og totalscoren som en egen markør.
- Diagrammet deles i fire felt med korte tekster:
  - **Lav score, lav sikkerhet:** «Kartlegg først»
  - **Lav score, høy sikkerhet:** «Kjent skade – prioriter tiltak»
  - **Høy score, lav sikkerhet:** «Lovende, men udokumentert»
  - **Høy score, høy sikkerhet:** «Dokumentert regenerativ»
- Sikkerheten regnes ut med faste regler per lag:
  - Hvert besvart spørsmål med dokumentasjon teller fullt.
  - Hvert besvart spørsmål uten dokumentasjon teller halvt.
  - «Vet ikke» og ubesvarte spørsmål teller null.
  - Oppstarter vurderes på potensial og får derfor alltid et tak på sikkerheten (60 %), med en forklaring om det.
- Når man holder over en prikk, vises lagets nivå og sikkerhet, og hvilke spørsmål som trekker sikkerheten ned.

## Eksisterende vurderinger
Gamle Ja/Nei-svar kan ikke overføres. Eksisterende vurderinger beholder navn, org.nr. og bransjer, men får blanke svar og en merknad om at de må besvares på nytt.

## Teknisk
- `src/lib/ril.ts`: ny datamodell `Question { id, domain, theme, question, guidance[], options: { id, label, hint?, maturity: 0–4, flags?: ("fossilCore" | "offsetOnly" | "noBaseline" | "coDestructionUnknown")[] }[] }`.
- Regler som data: `LEVEL_RULES[domain][level] = { requires: { theme: minMaturity }[], forbids?: flag[] }`, slik at reglene kan leses og justeres på ett sted.
- `calculateRIL(answers, isStartup)` returnerer per lag nivå + liste over oppfylte/manglende krav (forklaring). Stopptak utledes fra flagg.
- `answers: Record<questionId, { optionId, verified }>`; versjonsfelt `schemaVersion: 2` i lagringen for å nullstille gamle svar.
- `src/lib/guidance.ts` slås inn i spørsmålsdataene; `STOP_QUESTIONS` fjernes.
- Veiviseren (`vurdering.$id.tsx`) viser alternativene som store, klikkbare kort; resultatsiden viser forklaringen.
- `calculateCertainty(answers, isStartup)` i `ril.ts` returnerer 0–100 per lag + totalt (gjennomsnitt), samt liste over spørsmål som trekker ned.
- Matrisen bygges som en egen SVG-komponent `RilMatrix` (kvadratisk, skalerer med bredden), fanene med shadcn `Tabs`.
- Testene i `ril.test.ts` skrives om: weakest-layer, stopptak via flagg, dokumentasjonsregel for etablerte, «Vet ikke» = laveste, og ett eksempel per nivåkrav for nivå 5. I tillegg testes sikkerhetsreglene (dokumentert = 1, udokumentert = 0,5, «Vet ikke» = 0, tak på 60 % for oppstarter).
- `roadmap.md` opprettes med disse to oppgavene ved oppstart av byggingen.
