# Kinetic UX - Revised Architecture

This document defines the UX architecture of the revised prototype. It is the
contract between the UX teardown (`docs/UX_TEARDOWN.md`), the Kinetic Atomic
Library (`docs/KIT_RECIPES.md`, `src/styles/tokens.css`), and the code.

Inputs merged here:

1. The **server build** (11 screenshots, Aug 2026) supplies the flow skeleton:
   welcome, conversation, answer objects, pinboards with hero KPIs, risk strip,
   scorecard, insight cards.
2. Anton's **Command Center Make prototype** supplies the shell concept: a
   docked Ana copilot column beside a live insight feed, "Investigate with
   Ana", alert-to-card highlight cross-links, system chips on chat answers.
3. The **teardown** supplies the correction list: conversation as substrate,
   one artifact model, bidirectional drill, provenance everywhere, one status
   vocabulary, direction-of-goodness semantics.

---

## 1. Shell

```
+------+--------------------------+---------------------------------------+
| Rail | Ana panel (docked col)   | Canvas                                |
| 48/  | 30% width, min 320px     | tabs: Feed | Command Center | Saved   |
| 240  | collapsible to slim bar  |       | Last Opened | Analysis        |
+------+--------------------------+---------------------------------------+
```

- **Left rail** (from the Make prototype): collapsed 48px icon rail or
  expanded 240px. Groups: Ana section (only when panel closed: orb, New
  conversation, History), ANALYTICS (Command Center, Live Feed), APPS
  (Denial Resolution Copilot, Patient Access Copilot), SAVED (Favorites,
  Quick Access, Alerts), SYSTEM (user, help). One nav system, not four
  (teardown 2.1).
- **Ana panel**: docked left column, never an overlay. Three states:
  - `open`: full conversation UI (thread, home state, history).
  - `slim`: a one-line vertical bar with an "Ask Ana" affordance; clicking or
    pressing `/` reopens. **The slim bar is present on every route** - the
    composer is global chrome (teardown 1.1). It is never removed.
  - Context chip: the composer always shows where it is scoped, e.g.
    `Command Center x` or `Command Center > Denial Rate x`. Asking "why is
    this up?" resolves against the chip (teardown acceptance 3).
- **Canvas**: tabbed main area (Make prototype pattern). The Command Center
  tab is the revised pinboard. The Analysis tab appears when Ana generates a
  full analysis and takes over the canvas.

Keyboard: `/` focuses the composer from anywhere with current context
attached. `Esc` closes drill panels.

## 2. Object model (one artifact, everywhere)

```ts
Artifact {
  id: string                 // stable, deep-linkable
  title: string
  definition: string         // one-line metric definition
  question?: string          // the question that produced it
  threadId?: string          // lineage: originating conversation
  metricIds: MetricId[]
  view: 'table' | 'bar' | 'line' | 'kpi'   // a VIEW, not identity
  validViews: View[]         // derived from data shape - invalid = not offered
  provenance: { asOf, source, scope, query, assumptions[] }
  pinnedTo: BoardId[]        // forward lineage
}
```

- A **Board** (pinboard/Command Center section) is a *saved arrangement of
  artifacts*, not a second authoring product (teardown 2.3).
- Every artifact renders the same **action bar** in every container: Ask
  about this, Drill, Pin/Unpin, **Open conversation**, Export, feedback.
- **Open conversation** is the missing primitive the teardown demanded
  (1.3): from any tile, reopen the thread that produced it, artifact
  attached. If authored (not asked), it seeds a new thread with the
  artifact's definition and provenance.
- Drilling opens a **right-side panel**, never an occluding modal
  (teardown 5.5). The panel has three sections: Data (cohort table with
  editable filter-path chips), Context (compare reframes), Reasoning
  (provenance + Open conversation).

## 3. Semantic layer (single source of truth)

`src/data/metrics.ts` is the only place a number is computed.

```ts
MetricDef {
  id, label, unit: 'usd' | 'pct' | 'days' | 'count'
  directionOfGoodness: 'higher' | 'lower' | 'band'
  target: number
  targetBasis: string        // "Industry P75, ADA 2025" | "FY26 target"
  plausibleRange: [min, max] // out of range renders flagged, not confident
}
MetricValue { current, previous, trend[], asOf, scope }
```

Derived, never hand-set:

- **Status** (one vocabulary, everywhere): `on-target | near | gap | critical`
  computed from current vs target with direction applied (teardown 4.3, 15).
- **Delta favorability**: arrow shows direction of change; color shows
  *favorability* (semantic/success vs semantic/error), computed via
  `directionOfGoodness`. Aged claims +94.5% renders BAD.
- **Narrative**: assembled from verified numeric slots via template
  (`{metric} at {value} is {delta} {direction} {targetBasis} of {target}`),
  validated against the same values the tile renders (teardown 3.2). No
  free-form arithmetic in prose.
- **Plausibility gate**: value outside `plausibleRange` renders as a flagged
  "check mapping" state, never as a hero number (teardown 3.3).

## 4. Flows (the loop the prototype must demonstrate)

1. **Welcome / empty state**: no "Ask anything". Role-relevant starter
   questions as chips, data coverage line ("128 facilities, claims through
   17 Aug"), recent threads. No particle field.
2. **Ask** → Ana streams an **answer artifact**: title, definition, valid-only
   viz switcher (15 categories default to sorted horizontal bars, area
   disabled with a reason), provenance footer collapsed to one line,
   follow-up chips, system chip ("Applied", "Info only").
3. **Pin** → artifact lands on the Command Center board; tile keeps full
   action bar and lineage.
4. **Command Center** (resembles server board, corrected): compact KPI
   summary strip (not oversized heroes), risk strip sorted by severity and
   dollar impact (says "nothing needs attention" when empty), scorecard
   promoted, insight cards with consistent numbers. Board header carries
   global time context + visible filter chips. DEMO watermark persistent.
5. **Drill**: click any tile → right panel (Data / Context / Reasoning),
   board stays visible. Filter breadcrumb chips are removable.
6. **Recall**: "Open conversation" from the drill panel or tile menu reopens
   the originating thread, scrolled to the turn, artifact attached.
7. **Cross-link** (Make pattern): clicking an alert in Ana's home state
   switches to the feed and scroll-glows the target card.
8. **Agency ladder** (light): risk tile action ("Recover variance") opens a
   Draft preview (scope, records, est. value, diff-style) → Confirm →
   receipt with undo window. Nothing executes silently (teardown 1.5).

## 5. States

Every artifact container implements: `loading` (skeleton in exact layout),
`empty` (reason + one action: widen period / retry / Ask about this),
`error` (what failed, owner), `flagged` (plausibility). A board cannot show
"Published" while any tile is in error/empty (teardown 3.4, 5.1).

## 6. Component inventory (Phase 3)

From kit recipes only: Button (primary/secondary/ghost/danger/disabled),
Pill (neutral/brand/interactive/success/warning/error/category), StatusBadge
(single vocabulary, never color-only: icon + text), Input, Composer, Tabs
(brand underline), SegmentedControl, Table (header #0f172a, zebra, mono
numerics, hover family per view type), Card (default/floating/elevated),
KpiTile, Sparkline (labeled endpoint + period), DrillPanel, ContextChip,
SkeletonTile, ProvenanceFooter.

Color discipline: orange = brand moments (one primary CTA, active tab);
indigo = focus/selection/interaction; semantic = status only; category
a/b/c = chart series only. No brand orange in data series (teardown 4.2).

## 7. State model (React)

Contexts mirror the Make prototype where they earned their keep:

- `ShellContext`: rail expanded, ana panel state (open/slim), active canvas tab.
- `ThreadContext`: threads, messages, active thread; `askAna(question, scope)`.
- `ArtifactContext`: artifact registry, pin/unpin, drill target.
- `ScopeContext`: current context chip (board/tile), time context, filters.
- `HighlightContext`: transient scroll-and-glow cross-links.

## 8. Acceptance criteria

Inherited from teardown L11, testable in this prototype: ambient conversation
on every route; ask→pin→reopen round trip under 5s; contextual pronoun via
scope chip; provenance in one click; one value per metric; directional
correctness for every metric in `metrics.ts`; no dead interactive elements;
designed empty/loading states; valid-only viz switching; AA contrast, no
color-only status, 24px targets, keyboard loop.
