# Ny vurdering: startup først, eksisterende firma bak en knapp

## Hva brukeren får
- Dialogen «Ny vurdering» åpner med **Oppstart / konsept** valgt og viser bare: navn, kort beskrivelse, bransjer (NACE) og valget oppstart/etablert.
- Brønnøysund-søket er skjult. I stedet står det en diskret tekstknapp nederst/øverst: «Har du et eksisterende selskap? Hent fra Brønnøysundregistrene» (EN: «Existing company? Fetch from the Brønnøysund Register»).
- Klikk på knappen viser søkefeltet. Etter at et selskap er valgt, fylles feltene ut som i dag, og en liten linje viser org.nr. med mulighet til å skjule søket igjen.
- Rekkefølgen på oppstart/etablert-valget beholdes, med oppstart først og forhåndsvalgt.

## Teknisk
- Kun `src/routes/index.tsx` (`NewAssessment`): ny `showBrreg`-state (default `false`), flytt `BrregSearch`-blokken bak en `Button variant="link"` med `Building2`-ikon, plassert under NACE-feltet. Nye tekster med `tr({ nb, en })`.
- Ingen endring i lagring, regler eller tester.
