# Brukere og innlogging (Google + e-post/passord)

## Hva brukeren får
- Alle kan fortsatt gjøre vurderinger uten å logge inn.
- Når resultatet er klart, vises en tydelig oppfordring på resultatsiden: «Lag en bruker for å ta vare på resultatene» (NO/EN).
- Innloggingsside med «Fortsett med Google» og e-post/passord (registrering, innlogging, glemt passord + side for nytt passord).
- Menyen viser «Logg inn» eller kontoen din med «Logg ut».
- Innloggede brukere får vurderingene lagret på kontoen, tilgjengelig fra alle enheter.
- Ved første innlogging flyttes vurderinger fra nettleseren automatisk inn på kontoen.
- Ingen profildata lagres utover selve innloggingen.

## Teknisk
- Aktiver Lovable Cloud; slå på e-postinnlogging og Google.
- Tabell `assessments` (id, user_id, data jsonb, updated_at) med grants og RLS: kun eier kan lese/skrive.
- `src/lib/store.ts` blir en hybrid: localStorage når utlogget, Cloud når innlogget; samme API (`useAssessments`, `saveAssessment`, `deleteAssessment`) slik at sidene ikke endres. Ved SIGNED_IN lastes lokale vurderinger opp og tømmes lokalt.
- Ruter: `/auth` (offentlig), `/reset-password` (offentlig). Vurdering/resultat forblir offentlige.
- `onAuthStateChange` i `__root.tsx`; Navbar viser innloggingsstatus.
- Oppdater AGENTS.md (lagringsregel) og roadmap.md.
