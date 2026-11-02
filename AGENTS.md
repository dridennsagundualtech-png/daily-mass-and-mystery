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

## Sinner's Cure architecture
- Fully offline, browser-only: no server functions/routes, no backend, no external URLs (app must run without internet later).
- All content lives in `src/data/` (format documented in `src/data/README.md`) so the owner can swap in full data files.
- All persistence goes through `src/lib/storage.ts` (`useLocal`, keys prefixed `sc.`) so components stay in sync.
- `getToday(date)` in `src/lib/today.ts` is the single pure source for Today content (reused by a future widget).
- Bead prayers are step lists (`src/lib/steps.ts`) rendered by `BeadPrayer` + `BeadRing`; bead index map is documented there.
- Fonts are bundled via @fontsource imports in `src/styles.css`; never add remote font links.
