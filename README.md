# Kinetic UX - Revised AI-First Prototype

A working prototype of the revised Kinetic experience: conversation as the
substrate, one artifact model with provenance and lineage, and a Command
Center that resembles the current server build's flow with the UX teardown's
corrections applied.

Dark mode only. Built exclusively on the Kinetic Atomic Library tokens
(110 variables, IBM Plex Sans/Mono) - no new colors, no new elements.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build
npm run lint
```

Node 20+ recommended.

## What to try (the loop)

1. **Ask**: click a starter question in Ana's home panel (left column), e.g.
   "Which facilities drive my A/R over 90 days?" - the answer arrives as an
   artifact with a valid-only viz switcher, provenance footer and action bar.
2. **Pin / Board**: the artifact is pinned to the Command Center tab. Note
   the corrected semantics: favorability-aware deltas, one status vocabulary,
   labeled benchmark bases, a deliberately flagged "check mapping" KPI, and
   the severity-sorted "Needs attention" strip.
3. **Drill**: click any KPI, risk tile or scorecard row - a side panel opens
   (the board stays visible) with Data / Context / Reasoning. Esc closes.
4. **Recall**: in the drill panel press **Open conversation** - the thread
   that produced the number reopens with the artifact attached.
5. **Scope chip**: with a drill open, type "why is this up?" in the composer -
   "this" resolves against the chip.
6. **Agency ladder**: on the Underpayment risk tile press **Recover
   variance** - draft preview with exact scope, confirm, receipt with a 15s
   undo window.
7. **Slim bar**: collapse Ana (top-right of the panel) - the composer never
   disappears; press `/` anywhere to summon it.

## Structure

```
docs/            UX teardown, architecture spec, kit recipes
src/styles/      tokens.css - the 110 Kinetic variables (source of truth)
src/kinetic-ui/  component layer built from the Atomic Library recipes
src/lib/         semantics.ts - directionOfGoodness, status, plausibility,
                 slot-verified narrative, formatting rules
src/data/        corrected DSO dental demo dataset (one value per metric)
src/state/       app store (shell, threads, artifacts, drill, agency)
src/app/         shell, Ana panel, feed, Command Center, drill, agency
scripts/         e2e-smoke.mjs (Playwright sanity pass)
```

## Design rules encoded here

- Orange (`brand/primary`) = brand moments only: one primary CTA per view,
  active tab underline. Never data series, never checked controls.
- Indigo (`accent/interactive`) = all interaction: focus, selection, context
  chips, active borders.
- Semantic hues = status vs target only; `category/*-chart` = series only.
- Status is never color-only (icon + text), AA-minded contrast, visible
  focus rings, `prefers-reduced-motion` respected.

See `docs/ARCHITECTURE.md` for the full contract and
`docs/UX_TEARDOWN.md` for why each decision exists.
