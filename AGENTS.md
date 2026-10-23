<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- RIL scoring and insight rules live only in src/lib/ril.ts (calculateRIL, calculateInsight, LEVEL_RULES as data) with tests in src/lib/ril.test.ts; UI must never re-implement scoring.
- UI text is bilingual via useT().tr({ nb, en }) from src/lib/i18n.ts; Norwegian content in ril.ts is the source, English content lives in ril.en.ts keyed by id and is read through src/lib/ril-text.ts.
- Assessments are stored in browser localStorage via src/lib/store.ts; swap this module if a backend is added.
- Company lookup calls the public Brønnøysund API directly from the browser (src/lib/brreg.ts); NACE codes come from SSB Klass via server function and AI suggestions are validated against that list (src/lib/nace.functions.ts).
