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

- RIL scoring rules live only in src/lib/ril.ts (calculateRIL) with tests in src/lib/ril.test.ts; UI must never re-implement scoring.
- Assessments are stored in browser localStorage via src/lib/store.ts; swap this module if a backend is added.
- Company lookup calls the public Brønnøysund API directly from the browser (src/lib/brreg.ts); NACE codes come from SSB Klass via server function and AI suggestions are validated against that list (src/lib/nace.functions.ts).
