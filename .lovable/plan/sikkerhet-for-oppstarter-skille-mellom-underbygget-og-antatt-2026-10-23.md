# Sikkerhet for oppstarter: skille mellom underbygget og antatt

## Hvorfor alle havner på 60 %
For oppstarter teller i dag hvert besvarte spørsmål som fullt sikkert, uansett om svaret er underbygget. Deretter skaleres alt med taket på 60 %. Har man svart på alle spørsmålene, blir det derfor 60 % på alle områder, uansett hvor godt man kjenner tallene sine. Sikkerheten skiller altså bare mellom besvart og ikke besvart, og det er derfor matrisen ser flat ut.

## Ny regel (samme som for etablerte, bare med tak)
- Underbygget svar = 1, ubegrunnet svar = 0,5, «Vet ikke» eller ubesvart = 0.
- For oppstarter betyr «underbygget» at svaret støttes av f.eks. pilotdata, forskning, intensjonsavtaler eller beregninger. For etablerte betyr det dokumentasjon, som i dag.
- Taket på 60 % for oppstarter beholdes: helt underbygget gir 60 %, alt bare antatt gir 30 %.
- Svar som ikke er underbygget vises under «hva som trekker ned sikkerheten», som for etablerte.

## I veiviseren
- Avkrysningen for dokumentasjon vises også for oppstarter, med egen tekst: «Svaret er underbygget (pilot, forskning, avtaler eller beregninger)» / «Answer is substantiated (pilot, research, agreements or calculations)».
- Bare avkrysningen; ingen nivåmerker eller konsekvenser vises (i tråd med veiviserregelen).

## Teknisk
- `calculateCertainty` i `src/lib/ril.ts`: fjern snarveien `if (isStartup) sum += 1`, og bruk `verified` for alle. Skaleringen med `STARTUP_CERTAINTY_CAP` beholdes.
- `calculateRIL` endres ikke (oppstarter vurderes fortsatt på potensial).
- `src/routes/vurdering.$id.tsx`: vis avkrysningen også når `isStartup`, med egen tekst (nb/en).
- Tester i `src/lib/ril.test.ts`: oppstart med alle svar underbygget = 60 %, alle ubegrunnet = 30 %, etablert med alt dokumentert = 100 %.
- Lagrede svar beholdes. Eksisterende oppstartsvurderinger faller til 30 % til svarene krysses av som underbygget.
