# Kinetic Platform Atomic Library — Component Recipes

Source: Figma file `QWpZtLfVsUjbc99Lj3JJwJ`, showcase nodes 16797:7 through 16797:12 (extracted 2026-08-18 via Figma MCP get_design_context).
All token names below are the exact CSS variable names emitted by Figma (`--token/name`). Fallback hex values shown are the resolved values in the current (dark) theme.

## Global typography
- Sans: `font-family/sans` = IBM Plex Sans (`fontVariationSettings: "wdth" 100` on every sans text node).
- Mono: `font-family/mono` = IBM Plex Mono (numeric/monetary table cells only).
- Section titles: sans SemiBold 18px, `text/primary` (#f1f5f9).
- Guidance/caption text: sans Regular 12px, `text/muted` (#94a3b8).
- Named style seen: `kinetic/title-sm-regular` = family `font-family/sans`, Regular, size `font-size/sm`, weight `font-weight/400`, lineHeight 100, letterSpacing -1.5.

## Buttons (node 16797:7)
Shared anatomy: radius 8px; padding 16px horizontal / 8px vertical; label sans Medium 14px; row gap between buttons 12px.

| Variant | Background | Border | Text |
|---|---|---|---|
| Primary | `brand/primary` (#ee6d0b) | none | `neutral/white` |
| Hero CTA | gradient/brand: linear-gradient(~160deg, rgb(238,109,11) 0%, rgb(219,131,59) 71.429%) | none | `neutral/white` |
| Secondary | `bg/surface-muted` (#23345a) | 1px `border/default` (rgba(148,163,184,0.25)) | `text/secondary` (#cbd5e1) |
| Ghost | transparent (gets `state/hover` wash on hover) | none | `text/secondary` |
| Danger | `semantic/error` (#ef4444) | none | `neutral/white` |
| Disabled | `state/disabled` (rgba(255,255,255,0.03)) | none | `text/disabled` (rgba(71,85,105,0.85)) |

Usage guidance (verbatim from design): "Primary = brand/primary (one per view). CTA = gradient/brand for hero moments. Secondary = bg/surface-muted + border/default. Ghost = state/hover on hover. Danger = semantic/error, destructive only. Disabled = state/disabled + text/disabled."

## Pills & Badges (node 16797:8)
Shared anatomy: radius 999px (full pill); padding 10px horizontal / 3px vertical; label sans Medium 12px; row gap 10px.

| Pill | Background | Text |
|---|---|---|
| Neutral | `state/selected-grey` (rgba(148,163,184,0.12)) | `text/secondary` (#cbd5e1) |
| Brand | `overlay/ghost-pill-bg-brand` (rgba(238,109,11,0.10)) | `brand/primary` (#ee6d0b) |
| Interactive/Selected | `overlay/ghost-pill-bg-interactive` (rgba(99,102,241,0.10)) | `accent/interactive-soft` (#818cf8) |
| Success | `state/hover` (rgba(255,255,255,0.05)) | `semantic/success-soft` (#6ee7b7) |
| Warning | `state/highlight` (rgba(245,158,11,0.28)) | `semantic/warning-soft` (#fde68a) |
| Error | `state/hover` (rgba(255,255,255,0.05)) | `semantic/error-soft` (#fca5a5) |
| Category A | `category/a-solid` (#1d4ed8) | `neutral/white` |
| Category B | `category/b-solid` (#9333ea) | `neutral/white` |
| Category C | `category/c-solid` (#0f766e) | `neutral/white` |

Usage guidance (verbatim): "Brand pill = overlay/ghost-pill-bg-brand + brand/primary text (brand-led views). Interactive = overlay/ghost-pill-bg-interactive + accent/interactive-soft (data views). Semantic pills carry status only. Category A/B/C solids pair with matching -chart series colors."

Statuses present: Success, Warning, Error (semantic *-soft text on subtle washes); plus Neutral, Brand, Interactive/Selected, and Category A/B/C solids. No dedicated "priority" pill exists in this showcase.

## Inputs & Controls (node 16797:9)
Text input anatomy: width 220px in showcase; radius 8px; padding 12px horizontal / 8px vertical; 1px border; text sans Regular 14px.

| State | Background | Border | Text |
|---|---|---|---|
| Default | `bg/surface-subtle` (#1b2848) | `border/default` (rgba(148,163,184,0.25)) | placeholder `text/placeholder` (#64748b) |
| Focus | `bg/surface-subtle` | `border/active` (rgba(99,102,241,0.7)) + `state/focus` ring | `text/primary` (#f1f5f9) |
| Error | `bg/surface-subtle` | `semantic/error` (#ef4444) | `text/primary` |

Usage guidance (verbatim): "Inputs: bg/surface-subtle + border/default; focus swaps to border/active + state/focus ring; error swaps to semantic/error. Checked controls always use accent/interactive (indigo), never brand orange. Thumbs = control/thumb; unchecked tracks = control/track."

Checkbox (Code Connect mapped): `import { Checkbox } from '@visiquate/kinetic-design-system'` — `<Checkbox label="…" checked />`. Component description: "Checked fill = accent/interactive (indigo, never brand orange)." (Component: Checkboxes/General, node 16613:6053.)

Switch/toggle: 36x20px outer box (returned as exported SVGs, not tokenized code). Per guidance: checked track = `accent/interactive` (indigo #6366f1), unchecked track = `control/track`, thumb = `control/thumb`.

Not present in showcase: selects/dropdowns and segmented controls have no dedicated showcase rows in these six nodes. For selects, follow the input recipe (bg/surface-subtle + border/default, radius 8) with `bg/floating` menus (see Cards). No segmented-control tokens were emitted.

## Tabs & Navigation (node 16797:10)
Tab anatomy: padding 12px horizontal, 8px top; 6px gap between label and 2px-tall underline bar; label sans Medium 14px; 4px gap between tabs.

- Active tab: text `context/tab-active` (#f1f5f9) + underline `brand/primary` (#ee6d0b), 2px tall, full tab width.
- Inactive tab: text `context/tab-inactive` (#94a3b8), transparent 2px underline placeholder (keeps height stable).
- Hover: add `state/hover` wash (rgba(255,255,255,0.05)).
- Tab bar bottom line: `lines/card` (rgba(148,163,184,0.18)).

Usage guidance (verbatim): "Active tab: context/tab-active text + brand/primary underline. Inactive: context/tab-inactive. Hover adds state/hover wash. Tab bar bottom line: lines/card."

No segmented control appears in this section.

## Table (node 16797:11)
Container: 1px border `lines/card` (rgba(148,163,184,0.18)), radius 8px, overflow clipped.
Cells: padding 12px horizontal / 10px vertical; equal-width flex columns.

- Header row: bg `table/header` (#0f172a); labels sans Medium 13px `text/muted` (#94a3b8); bottom border `lines/section`.
- Body rows: zebra striping — odd rows `table/row-odd` (#0f172b), even rows `table/row-even` (#111a30); text sans Regular 13px `text/secondary` (#cbd5e1).
- Numeric/currency cells: `font-family/mono` (IBM Plex Mono) Regular 13px, `text/secondary`.
- Hover row: `overlay/table-row-hover-brand` = rgba(238,109,11,0.06) layered over the row bg (rendered in showcase as orange 6% over #0f172b). Interactive variant exists: `overlay/table-row-hover-interactive`.
- Row dividers: `lines/hairline`.

Usage guidance (verbatim): "Header: table/header bg + text/muted labels + lines/section bottom border. Zebra: table/row-even / table/row-odd. Row hover: overlay/table-row-hover-brand in brand-led views, -interactive in dense data views (pick one family per screen). Row dividers: lines/hairline."

## Cards, Surfaces & Gradients (node 16797:12)
Card anatomy: radius 12px; padding 16px all sides; 8px internal gap; 1px border `lines/card` on non-gradient cards. Card title sans SemiBold 15px `text/primary`; body sans Regular 12px `text/secondary` (white text on gradient cards).

| Card | Surface |
|---|---|
| Default card | `bg/card` (#131d33) + `lines/card` border. "The workhorse container." |
| Floating surface | `bg/floating` (#1f2e51) + `lines/card` border. "For popovers, dropdowns, tooltips." |
| Elevated | gradient/surface-elevation: vertical gradient #0f172a → #1a2540 + `lines/card` border. "Subtle vertical lift for prioritized cards." |
| gradient/brand card | linear-gradient(~162deg, rgb(238,109,11) → rgb(219,131,59) at 71.429%). White text. "Hero CTAs, promo banners, brand moments." |
| gradient/interactive card | linear-gradient(~162deg, rgb(99,102,241) → rgb(6,182,212) at 71.429%). White text. "Feature highlights, empty states, onboarding." |

Usage guidance (verbatim): "Default card: bg/card + lines/card border. Floating (popovers/menus): bg/floating. KPI wells: bg/surface-deep. gradient/brand (orange 135°) = hero CTAs and brand banners only. gradient/interactive (indigo→cyan) = feature highlights and empty states. gradient/surface-elevation = subtle lift on elevated cards. Never use gradients on text, borders, or small controls."

## Orange vs indigo rule (cross-cutting)
- Orange (`brand/primary` #ee6d0b, gradient/brand, overlay/*-brand): brand-led moments — primary buttons (one per view), hero CTAs, active tab underline, brand pills, brand-view table hover.
- Indigo (`accent/interactive` #6366f1, `accent/interactive-soft` #818cf8, `border/active`, gradient/interactive, overlay/*-interactive): all interaction/selection state — checked checkboxes and toggles (never orange), focus borders/rings, interactive pills, data-view table hover, feature-highlight gradients.
- Pick ONE hover family (brand vs interactive) per screen.

## Token quick reference (name → resolved dark value)
- bg/card #131d33; bg/floating #1f2e51; bg/surface-subtle #1b2848; bg/surface-muted #23345a; bg/surface-deep (KPI wells; value not emitted in showcase)
- table/header #0f172a; table/row-odd #0f172b; table/row-even #111a30
- text/primary #f1f5f9; text/secondary #cbd5e1; text/muted #94a3b8; text/placeholder #64748b; text/disabled rgba(71,85,105,0.85)
- brand/primary #ee6d0b; accent/interactive-soft #818cf8; accent/interactive #6366f1 (implied by border/active + gradient/interactive)
- semantic/error #ef4444; semantic/success-soft #6ee7b7; semantic/warning-soft #fde68a; semantic/error-soft #fca5a5
- border/default rgba(148,163,184,0.25); border/active rgba(99,102,241,0.7); lines/card rgba(148,163,184,0.18); lines/section, lines/hairline (referenced in guidance, values not emitted)
- state/hover rgba(255,255,255,0.05); state/disabled rgba(255,255,255,0.03); state/selected-grey rgba(148,163,184,0.12); state/highlight rgba(245,158,11,0.28); state/focus (ring; value not emitted)
- overlay/ghost-pill-bg-brand rgba(238,109,11,0.10); overlay/ghost-pill-bg-interactive rgba(99,102,241,0.10); overlay/table-row-hover-brand rgba(238,109,11,0.06); overlay/table-row-hover-interactive (value not emitted)
- category/a-solid #1d4ed8; category/b-solid #9333ea; category/c-solid #0f766e (each pairs with a matching `-chart` series color)
- control/thumb, control/track (switch parts; values not emitted — toggles exported as SVG)
- neutral/white #ffffff

## Radii and spacing summary
- Buttons and inputs: 8px radius. Pills: 999px. Cards: 12px. Table container: 8px.
- Buttons: px-16 py-8. Pills: px-10 py-3. Inputs: px-12 py-8. Table cells: px-12 py-10. Cards: p-16, gap-8. Tabs: px-12 pt-8, underline h-2px.
