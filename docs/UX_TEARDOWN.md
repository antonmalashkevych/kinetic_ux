# Kinetic / Ana - UX Teardown of Live Server Build
**Reviewer:** Senior UX practitioner (20 yrs, enterprise analytics & agentic products)
**Date:** 18 Aug 2026
**Material reviewed:** 11 production screenshots from Drive folder `1_qpEL3Lr-msyVMbwIuf2r_hrvfZiMqEv` (screen1, 2, 3, 4, 6, 7, 8, 9, 10, 10_1, 11). Key findings re-verified pixel-by-pixel against screen1, screen7 and screen10_1 on 18 Aug.
**Not reviewed:** `Screen Recording 2026-08-18 at 7.53.00 AM.mov` (110 MB, exceeds the Drive connector's fetch cap). Flow-timing, latency and micro-interaction findings below are inferred from static evidence only and should be re-checked against that recording.
**Structure:** findings run from grand scheme (L0-L1) down to pixel craft (L6-L7), then a prioritized fix list.

---

## L0. VERDICT

**The build has drifted from an AI-first product into a conventional BI dashboard with a chat box bolted onto one of its screens.**

This is not a styling problem and it will not be fixed by visual polish. It is a structural inversion. In the intended concept, conversation is the operating system and charts, tables and boards are things the conversation produces and can re-open. In the build, the dashboard is the operating system and the conversation is a feature that lives on a different screen.

The single most damning piece of evidence: **the composer disappears the moment the user enters a pinboard.** Screens 1, 2 and 4 (conversation context) have an "Ask about your data..." input docked at the bottom. Screens 6, 7, 8, 9, 10, 10_1 and 11 (pinboard context, which is where all the actual business content lives) have **no input at all**. The canvas runs to the bottom edge of the viewport.

The consequence is that the two behaviours the concept is built on are currently impossible:
1. **Drill in from chat to any graph or table** exists partially (screen 4 shows a real answer object with a viz switcher), but the reverse path does not exist at all.
2. **Recall the conversation again from any artifact** is architecturally absent. A pinned tile has no link back to the reasoning that produced it. Once an answer is pinned, it becomes an orphan number.

Layered on top of that structural issue is a **trust problem that is visible to the naked eye on a single screen**. The dashboard shows Chair Utilization as 60.3% in the scorecard and 4.3% in the insight card roughly 400 px below it. Case Acceptance is 73.0% in one place and 100.0% in another. A narrative card reads "Case acceptance at 100.0% - below 75% target." Total Write-off is $39 next to $11M of open A/R. A published board ships a tile that says "No results were returned for this query." Any revenue-cycle director will find one of these within ninety seconds and stop believing the product. In an AI-first analytics tool, credibility is the entire product; there is no fallback of "well at least the SQL is mine."

**Severity summary**

| Layer | State | Verdict |
|---|---|---|
| Product architecture (AI-first) | Inverted | Rebuild the shell, not the screens |
| Trust / data integrity surfaced in UI | Failing | Blocks any customer demo |
| Information architecture & naming | Overloaded | Cut ~60% of the nav vocabulary |
| Analytical design (charts, semantics of good/bad) | Failing | No encoding system exists |
| Interaction states (loading, empty, error) | Missing | Blank screens shipped |
| Visual craft & accessibility | Below enterprise bar | Contrast and density both fail |
| Answer-object pattern (screen 4) | **Strong** | Protect this; it is the seed of the real product |

**Bottom line:** stop adding dashboard surface area. Spend the next cycle inverting the shell so that conversation is ambient everywhere, every artifact is addressable and re-openable, and every number carries its provenance. Everything else in this document is downstream of that.

---

## L1. GRAND SCHEME: THE AI-FIRST INVERSION

### 1.1 Conversation must be a substrate, not a screen

**Observed.** Chat is a destination reached via "New Conversation" in the left rail. Pinboards are a parallel destination. The two never coexist. The composer is present on screens 1, 2, 4 and absent on screens 6-11.

**Why it matters.** If a user has to leave the data to ask about the data, they will not ask. They will do what they have always done: read the tile, misread it, and export to Excel. The chat then degrades into a novelty that gets used in the first session and abandoned by week three. This is the single most common failure mode of retrofitted AI in enterprise analytics, and the build is currently exhibiting it.

**Recommendation.**
- The composer becomes **global chrome**, persistently docked on every route: welcome, conversation, pinboard, tool, modal, drill-down. It is never removed, only collapsed to a single-line bar.
- Context is implicit and visible. When the user is on the DSO Insights pinboard, the composer shows an inline context chip: `DSO Insights ×`. When they open a specific tile, the chip becomes `DSO Insights › Denial Rate ×`. Asking "why is this up?" with that chip present must resolve "this" without the user restating it.
- Selection becomes a question. Selecting three rows in the scorecard, or lassoing a region of a chart, populates the composer with a scoped context chip. The user types "compare these" and it works.
- Keyboard-first: one global key (for example `/` or `Cmd+K`) focuses the composer from anywhere, with the current context pre-attached.

### 1.2 One object model: every answer is a first-class, addressable artifact

**Observed.** Screen 4 is genuinely good and is the most important asset in this build. An answer arrives as a titled object ("AR > 90 Days by Facility") with a one-line definition, a viz-type switcher, an in-object search, a record count, and an action bar: EXPORT, thumbs up / thumbs down, Save, Pin. That is the correct shape for an AI answer.

But the object is a dead end. It has no URL, no version, no provenance, no time context, and no relationship to the pinboard tiles that display the same metric.

**Why it matters.** In an AI-first product the artifact is the unit of collaboration. People share it, argue with it, subscribe to it, and come back to it in three weeks. If artifacts are ephemeral chat output, the product produces no compounding institutional memory, and every user re-derives the same answer forever.

**Recommendation.** Define one canonical artifact type used **everywhere**: in chat, as a pinboard tile, in the modal, in a shared link, in an export, in an email digest. Its contract:

| Property | Requirement |
|---|---|
| Identity | Stable ID and shareable deep link |
| Title & definition | Human title plus one-line metric definition (already present, keep it) |
| Provenance | Source system(s), the question that produced it, the generated query, filters applied, as-of timestamp |
| Representation | Viz type is a *view*, not a property of the artifact; switching view does not create a new object |
| Lineage | Link back to the originating conversation turn, and forward to every board it appears on |
| State | Live / snapshot, and if snapshot, when it was frozen |
| Actions | Ask about this, Drill, Compare, Save, Pin, Share, Export, Subscribe, Feedback |

Concretely: a pinboard becomes a **saved arrangement of artifacts**, not a separately authored dashboard. This collapses two codebases into one and makes bidirectional drill free rather than a feature to build.

### 1.3 Bidirectional drill and conversation recall

**Observed.** The risk strip promises exactly the right thing: "Highest-priority signals across dso insights - click any tile to drill into the cohort," with per-tile verbs "Triage cohort →", "Escalate now →", "Open root-cause →", "Recover variance →", "Auto-pilot refunds →". Those verbs are the best product thinking on display anywhere in the build. But there is no evidence in the four near-identical dashboard captures (7, 8, 9, 10) that anything happens on click, and no path exists from any tile into a conversation.

**Why it matters.** "Recall the conversation again" is the mechanic that makes an analytics product feel like a colleague rather than a report. It is also the cheapest retention loop available: users return to a thread, not to a chart.

**Recommendation.** Every artifact, everywhere, exposes the same three-way drill:

1. **Drill down (data)** - open the cohort behind the number as a table artifact, with the filter path shown as breadcrumb chips the user can edit or delete.
2. **Drill sideways (context)** - "Compare to last quarter / to benchmark / to peer facilities" as one-click reframes that mutate the artifact's view, not the user's location.
3. **Drill up (reasoning)** - **"Open conversation"**. This is the missing primitive. It reopens the thread that produced this artifact, with the full turn history, and drops the user at the composer with the artifact attached. If the artifact was authored rather than asked, it opens a new thread seeded with the artifact's definition and provenance.

Design rule: **drilling never navigates away.** Use a right-side rail or a bottom sheet so the board stays visible behind. The current pattern of a centred modal that dims and hides everything (screen 3) breaks the user's mental map and forces a Back button that does not exist.

### 1.4 Provenance and the trust layer

**Observed.** Nowhere in 11 screenshots is there an as-of timestamp, a time-range control, a visible filter state (there is an almost invisible funnel glyph at the far left edge of screens 6-11, roughly 10 px, unlabeled), a data-source attribution per number, or any way to see how a figure was computed. The welcome screen instead advertises plumbing: "Powered by VQ8.Uniti longitudinal record & VQ8.Paradise data lake."

**Why it matters.** In healthcare revenue cycle, the first question of every stakeholder is "as of when, and does this include X?" A number without a period and a definition is not an answer, it is a rumour. Note also that this build is doing PHI-adjacent analytics; provenance and access context are compliance surface, not decoration.

**Recommendation.**
- **Global time context** in the header of every board and artifact: period, comparison basis, refresh time, next refresh. Editable in one click and inherited by every child artifact and every chat answer.
- **Per-artifact trust footer**, collapsed by default, one line: `As of 18 Aug 07:52 · VQ8.Uniti · 15 of 128 facilities · Query`. Expanding reveals the generated query, the joins, row counts, and any assumption the agent made ("excluded facilities with fewer than 30 claims").
- **Assumption surfacing.** When the agent has to guess (which A/R definition, which date field, whether to include write-offs), it says so inline as an editable chip: `aged by: service date ▾`. This converts the model's biggest liability into the product's biggest differentiator.
- **Confidence, honestly.** Distinguish "computed from source" from "estimated / benchmarked / modelled." The scorecard's "Current Benchmark Value" column currently gives no hint whether $3,500 revenue-per-patient is an industry benchmark, a client target, or a placeholder.
- Move the VQ8 plumbing copy out of the hero. Put connection state in a status affordance; keep the hero about what the user can do.

### 1.5 The agency ladder: answer, recommend, act

**Observed.** The build already gestures at agency: "Agentic loop active" on the welcome screen, "Ana Navigator · 7 steps" as a floating chip bottom-right, and action verbs on risk tiles including the notably bold "Auto-pilot refunds". But there is no visible mechanism for reviewing, approving, scoping or auditing an action, and "Ana Navigator · 7 steps" is an unexplained artifact of agent internals presented as UI.

**Why it matters.** Agentic claims raise the trust bar rather than lowering it. "Auto-pilot refunds" in a healthcare finance context implies money movement. If a user cannot see exactly what will happen, to how many records, with what reversal path, they will never click it, and the feature becomes decorative risk.

**Recommendation.** Make the ladder explicit and make each rung visibly safe.

| Rung | User sees | Requirement |
|---|---|---|
| 1. Answer | Artifact + provenance | Read-only, no confirmation |
| 2. Explain | Root-cause narrative with links to evidence | Every claim clickable to its data |
| 3. Recommend | Ranked plays with expected value and effort | "Recover variance: 412 claims, est. $510k, 3 owners" |
| 4. Draft | A prepared action the user reviews | Preview of exact scope, diff-style |
| 5. Execute | Confirmed action with receipt | Scope, actor, timestamp, undo window, audit entry |

Rename the agent's step counter into progress the user cares about ("Checking 128 facilities... 4 of 7 steps"), or hide it. Expose agent reasoning on demand, never as ambient noise.

### 1.6 Onboarding: the empty state is the most important screen in an AI product

**Observed.** Screens 1 and 2 show a robot avatar, "Welcome to Kinetic", the plumbing line, "Ask anything about your data.", three status pills, and a particle starfield background. There are **zero example questions**. The user's entire vocabulary for a brand-new interaction modality is the phrase "Ask anything."

**Why it matters.** "Ask anything" is the least helpful instruction in software. It produces a blank-page freeze, then a vague question, then a mediocre answer, then abandonment. Conversion from first session to second session in AI analytics tools is driven almost entirely by whether the first question succeeded.

**Recommendation.**
- Replace "Ask anything about your data" with **4 to 6 role-relevant starter questions as clickable chips**, drawn from this tenant's actual connected data and this user's role: "Which facilities drive my A/R over 90 days?", "Why did denial rate move last month?", "Where am I leaving money on the table vs benchmark?"
- Show, in one line, **what data is connected and through when**: "128 facilities, claims through 17 Aug."
- Show recent threads and pinned artifacts here, so the empty state is also the return path.
- Remove or heavily damp the particle field. Motion and sci-fi texture read as "toy" to a VP of Revenue Cycle and actively reduce trust in a numbers product. Save spectacle for the moment an answer resolves.

---

## L2. INFORMATION ARCHITECTURE AND NAMING

### 2.1 Four navigation systems stacked in one 220 px rail

**Observed.** From top to bottom the left rail contains: brand + collapse toggle; "New Conversation" primary CTA; a segmented control `Pinboard | Folder`; a search field "Search items..."; a second four-way control `Browse | Recent | Most Used | Starred`; a "Pin starred to top" toggle; a list of pinboards; a `TOOLS` section with six entries; then two orphaned bottom items "Rialto Insights" and "Cerebrum"; then a status dot "Online" and three unlabeled icon buttons.

That is four competing organizing schemes (by type, by recency, by usage, by favourite) plus two taxonomies (Pinboards, Tools) plus two unexplained destinations, before the user has asked a single question.

**Why it matters.** Rich navigation is the compensation pattern for a product that cannot be asked. Every hour spent on rail affordances is an hour spent making the conversation unnecessary, which contradicts the concept. It also has a real cost: the two most important things in the rail (New Conversation, and recent threads) are visually outweighed by machinery.

**Recommendation.** Reduce to two levels.
- **Primary:** New conversation. Then a single unified, searchable list of *everything the user has made or saved* (threads, artifacts, boards), with lightweight filter chips rather than four separate controls. One list, one search, filters as chips: `Threads · Boards · Artifacts · Starred`.
- **Secondary:** a collapsed "Library / Admin" group for metric definitions, prompt guidance and connections. Tools are things a power user opens deliberately, not top-level furniture.
- Delete the "Pin starred to top" toggle. That is a setting invented to paper over a sorting decision the product should just make.
- Give "Rialto Insights" and "Cerebrum" a home or remove them. As standalone bottom-rail items with no label context they read as internal builds that escaped into the UI.

### 2.2 Terminology sprawl: twelve proper nouns before the first question

**Observed.** Across two welcome screenshots a first-time user meets: Ana, Kinetic, Ana Kinetic, VQ8.Uniti, VQ8.Paradise, Signal Intelligence, Process Signals, Intake Intelligence, Metric Library, Prompt Library, Prompt Guide, Ana Navigator, Rialto Insights, Cerebrum, and "Agentic loop active." None is explained. Three of them ("Signal Intelligence", "Process Signals", "Intake Intelligence") are indistinguishable from one another in meaning.

**Why it matters.** Invented vocabulary transfers cognitive cost from the team that named things to every user, forever. It also makes the product unteachable: a champion cannot onboard a colleague if they cannot explain the nav.

**Recommendation.**
- Name features by the **job**, not the brand: "Metric Library" is fine; "Signal Intelligence" should be something like "Alerts", "Process Signals" something like "Workflow bottlenecks", "Intake Intelligence" something like "New patients & referrals". If the team cannot write a five-word plain-English label, the feature is not yet defined.
- One product name in the chrome. "Ana Kinetic" top-left, "Welcome to Kinetic" in the hero, "Ana Navigator" bottom-right and "Stop Claude" in the composer means four different names for the same assistant on one screen.
- Every nav item gets a one-line tooltip on hover stating what it does and who uses it.

### 2.3 Pinboard should be a saved view, not a second application

**Observed.** Pinboards have their own authoring model: a "Published" state badge, a DEMO tag, an "Edit" mode, a gear, an overflow menu, link chips to other boards ("Appointments & Schedulin...", "Financials & Snapshot"), and a title/subtitle pair. This is a full dashboard-builder product living beside the chat product.

**Why it matters.** Two authoring models means two mental models, two permission systems, duplicated viz code (which is likely why the chart in screen 3 is broken while the table in screen 4 is fine), and no shared provenance. It also invites the classic dashboard-rot cycle the AI-first concept was meant to escape.

**Recommendation.** A board is an arrangement of artifacts, each of which retains its lineage to a conversation. Authoring a board means "pin things and arrange them," not "build charts." Publishing means "freeze the arrangement and share it," and the published board still lets every viewer open the conversation behind any tile. Truncated titles ("DSO INSIGHTS · COMMAND CEN...", "Appointments & Schedulin...") indicate the label model is fighting the container; shorten names and show full text on hover.

---

## L3. TRUST AND DATA INTEGRITY, AS SURFACED IN THE UI

These are the findings that will kill a demo. They are listed above visual design deliberately, because polish applied over contradictions makes the contradictions more credible, not less.

### 3.1 The same KPI shows two different values on one page

**Observed.** On the DSO Insights board:
- Scorecard: **Chair Utilization 60.3%** (benchmark 85.0%, GAP)
- Insight card ~400 px below: **Chair Utilization 4.3%** (Target 85%, CRITICAL)
- Scorecard: **Case Acceptance Rate 73.0%** (benchmark 65.0%, Met)
- Insight card: **Case Acceptance 100.0%** (Target 75%)
- Scorecard: **Revenue per Visit $2,065.68**
- Insight card: **Revenue per Visit $2,040**

**Recommendation.** One metric, one definition, one value, computed once and referenced everywhere. If two figures legitimately differ (different period, different denominator, different facility scope), the UI must state the difference on the face of the tile, not leave the user to discover the contradiction. Add a same-page consistency check to CI: any two components rendering the same metric ID with different values in the same time context should fail the build.

### 3.2 Narrative text contradicts its own numbers

**Observed.**
- "Case acceptance at 100.0% - below 75% target; high-value procedure penetration lagging." 100% is not below 75%.
- "Chair utilization at 4.3% - 24.7 % below target , no-show rate still below 6% threshold." 4.3% against an 85% target is 80.7 points below, not 24.7. Note also the stray space in "24.7 %", the space before the comma, and the comma splice.
- "no-show rate still below 6% threshold" is framed as reassurance inside a card badged CRITICAL, while the scorecard rates No-Show at 7.2% against a 6.0% benchmark as a GAP.

**Why it matters.** Generated narrative is the highest-trust and highest-risk surface in the product. A reader who catches one arithmetic contradiction will discount every sentence the system ever writes, including the correct ones.

**Recommendation.**
- Never let the model compute or restate arithmetic in prose. Prose is assembled from **verified numeric slots** produced by the same calculation layer that renders the tile. Template: `{metric} at {value} is {delta} {direction} {target_label} of {target}`.
- Validate every generated narrative against its own numbers before render: sign, magnitude, threshold direction. Fail closed to a plain numeric statement rather than shipping a wrong sentence.
- Enforce one voice and one unit format at the template level, not per generation.

### 3.3 Implausible magnitudes shipped without a sanity gate

**Observed.** "TOTAL WRITE-OFF $39" with a "-96.4%" delta, presented as a hero KPI beside "$11M" of open A/R. "Same-Day Treatment 0.2%". "Collections Rate 13.9%". "Chair Utilization 4.3%". A "Days in Unbilled 7.7" tile marked ON TRACK with a "-56.7%" delta.

**Recommendation.** Add plausibility bounds per metric at the semantic layer. A value outside bounds renders as a flagged state ("Value out of expected range, check mapping") rather than as a confident hero number. This is cheap, and it converts a credibility catastrophe into a visible, forgivable data-quality signal.

### 3.4 A broken tile is shipped inside a Published board

**Observed.** Screens 10_1 and 11 show a card containing a generic grey bar-chart placeholder glyph and the text "No results were returned for this query." No title, no explanation of which query, no retry, no owner, no timestamp.

**Recommendation.**
- Empty results must be an informative state, not a shrug: what was asked, why nothing came back (no data in period / filter excludes everything / source unavailable), and one action ("Widen to last 90 days", "Retry", "Ask about this").
- A board cannot enter "Published" state with a tile in an error or empty condition. Block publish, or publish with a visible board-level health indicator.
- Remove the decorative grey chart glyph. Drawing a fake chart to represent the absence of a chart is a small lie the user notices.

### 3.5 Data reads as synthetic and the UI does not say so

**Observed.** The board carries a "DEMO" tag in the header, but the facility values in screens 3 and 4 sit in an implausibly tight band (23,489,437 to 32,341,221 across 15 named facilities) and facility names are obvious placeholders ("Bright Dental", "SmileCare", "CareOne").

**Recommendation.** If this is demo data, mark it unmistakably and consistently: a persistent banner or watermark, not a small "DEMO" label that is easy to screenshot away. Nothing damages an enterprise sale more than a prospect discovering they were shown fabricated numbers they thought were real. Conversely, if a demo tenant is going to be shown to buyers, invest in realistic distributions; a flat band across 15 facilities is the tell.

---

## L4. ANALYTICAL DESIGN: THE MISSING ENCODING SYSTEM

### 4.1 The chart type switcher has no guardrails

**Observed.** Screen 3 shows "AR > 90 Days by Facility (Top 15)" rendered as an **area chart over nominal categories**: a solid orange blob filling most of the frame, from which no value can be read. Screen 4 shows the same metric as a clean table. The row of eight tiny unlabeled viz-type glyphs is identical in both, so the user simply picked an option the system should never have offered.

**Why it matters.** Offering an invalid encoding is a design decision to let users produce nonsense. Area implies continuity between adjacent x values; facility names have no adjacency and no order beyond the sort the user chose. Filling the area also destroys the one thing the chart is for, comparing 15 magnitudes.

**Recommendation.**
- The switcher shows only encodings valid for the data shape (categorical × 1 measure, 15 items → horizontal bar as default, table, lollipop; line and area disabled with a tooltip explaining why).
- Default to the right answer. For a ranked comparison of 15 named entities, a **horizontal bar chart sorted descending** is correct; labels then read horizontally and no rotation is needed.
- Label the glyphs, or use a labelled dropdown. Eight unlabeled 12 px icons is a guessing game.
- Fix the axis: ticks at 0 / 8,500,000 / 17,000,000 / 25,500,000 / 34,000,000 are mechanically derived from the max rather than chosen for human reading. Use round steps (0 / 10M / 20M / 30M) and abbreviate ($10M, $20M).
- Fix label collision: the rotated 45-degree facility names overlap each other and are clipped at both ends of the frame ("...rtheast Dental - New York", "...tain W... ntal - Denver").

### 4.2 Colour carries no meaning

**Observed.** Brand orange is used for the entire chart series in screen 3, for active nav, for links, for the primary CTA, and for the floating right-edge drawer. Red is used for all four hero sparklines regardless of whether the trend is good or bad, for all "Gap" pills, for all scorecard current values, and for both WARNING and CRITICAL insight cards. Green appears only in "ON TRACK" and "Met" pills. Amber appears only in "Near" and "WATCH".

**Why it matters.** With no encoding vocabulary, colour becomes decoration and the user cannot scan. Worse, colour is actively misleading: every sparkline being red implies every trend is bad.

**Recommendation.** Define and document a semantic palette, then use nothing outside it in data contexts.

| Role | Use | Never |
|---|---|---|
| Brand orange | Interactive affordances, active state, primary CTA | Data series |
| Categorical set (6-8 hues, colour-blind safe) | Series identity | Status |
| Sequential ramp | Magnitude | Categories |
| Semantic good / warn / bad | Status vs target, direction-of-goodness deltas | Brand or series |
| Neutral greys | Structure, reference lines, benchmarks | Emphasis |

Additionally: WARNING and CRITICAL must be visually distinct beyond a text badge (border weight, header treatment, position in sort order). Right now the CRITICAL card and the WARNING card look identical.

### 4.3 Direction of change is not the same as direction of goodness

**Observed.** This is the most consequential analytical bug in the build.
- "Aged >90d claims **36k ▲ +94.5%**" badged **ON TRACK** in green. A 94.5% increase in aged A/R is close to the worst thing on the page.
- "TOTAL WRITE-OFF $39 **▼ -96.4%**" shown with red/downward treatment. A write-off reduction is good.
- "Days in Unbilled 7.7 ▼ -56.7%" badged ON TRACK, which is plausibly right, but by the same mechanical rule that made the aged-claims tile wrong.
- "Denial Rate 8.2% ▼ -62.8%" badged WATCH, while a falling denial rate is an improvement.

The system is clearly colouring and badging on the arithmetic sign of the delta, not on whether the movement is favourable for that metric.

**Recommendation.**
- Every metric definition carries a **`direction_of_goodness`** property (`higher_is_better`, `lower_is_better`, `target_band`). Delta colour, arrow semantics and status badges derive from it. This is a one-line schema change with an outsized trust payoff.
- Separate the two signals visually. Status against target (Met / Near / Gap) and movement since last period (better / worse) are different facts and should not share one badge.
- Reconcile the taxonomies. The risk strip uses ON TRACK / WATCH; the scorecard uses Met / Near / Gap; the insight cards use WARNING / CRITICAL. That is three status vocabularies on one page. Pick one four-step scale and use it everywhere.

### 4.4 The risk strip contradicts its own premise

**Observed.** The strip is introduced as "Highest-priority signals across dso insights" under a warning glyph, yet the five tiles are badged ON TRACK, ON TRACK, WATCH, WATCH, WATCH. Meanwhile an insight card further down is CRITICAL.

**Recommendation.** If the section is "highest priority", it must be **sorted by severity and materiality**, must surface CRITICAL items, and should be empty (or say "nothing needs attention today") when nothing qualifies. A risk strip that is always full and always green teaches users to ignore it. Rank by expected dollar impact, not by metric catalogue order.

### 4.5 Sparklines and the "Trend Value" column carry no information

**Observed.** Hero tiles show red sparklines with no axis, no scale, no period label, no endpoint value. The scorecard's "Trend Value" column shows small solid red or olive blobs, roughly 40 × 12 px, in which no trend is discernible; the Case Acceptance row appears to show a single dot.

**Recommendation.** Either make micro-charts legible (consistent y-scale within a column, endpoint dot, current value labelled, period stated once in the column header, hover for values) or replace them with a signed delta and a period label. A shape the user cannot read is worse than a number, because it looks like information.

### 4.6 Benchmarks are asserted, not explained

**Observed.** "Current Benchmark Value" gives $3,500 revenue per patient, 85.0% chair utilization, $4,400 revenue per visit, $340,000 production per provider. No source, no cohort, no vintage, and no distinction between industry benchmark and internal target. The insight cards call the same figures "Target".

**Recommendation.** Label the basis explicitly ("Industry P75, ADA 2025" vs "Your FY26 target"), make it hoverable for definition, and use one word consistently: benchmark or target, not both.

### 4.7 Density is inverted against decision value

**Observed.** Four hero tiles consume roughly the top 200 px of the canvas to display four numbers, with generous internal padding. The scorecard, which carries seven KPIs with current value, benchmark, gap and trend (the actual decision content), is cramped below the fold at roughly 40 px per row. The insight cards repeat their own headline metric inside their metric list (Case Acceptance appears as both the big number and a list row; likewise Chair Utilization).

**Recommendation.** Allocate vertical space in proportion to decision value. Halve the hero tile height, remove the duplicated metric row inside insight cards, and let the scorecard breathe. Consider making the hero row a compact single-line summary strip with the scorecard promoted above the fold.

---

## L5. INTERACTION, STATE AND FEEDBACK

### 5.1 Blank canvas as a loading state

**Observed.** Screen 6 shows the DSO Insights board fully chromed (title, Published badge, subtitle, DEMO tag, link chips, refresh, Edit, gear, overflow) with a **completely empty body**. No skeleton, no spinner, no progress, no message. Given screens 7-10 show the same board populated, screen 6 is a load-in state, and it is indistinguishable from a broken or empty board.

**Recommendation.** Skeleton the exact layout (tile shapes in position) so perceived latency drops and the user knows what is coming. Show per-tile load state so one slow query does not blank the board. If load exceeds a threshold, say what is slow and offer to notify or to show cached data with its age.

### 5.2 "Stop Claude" overlays the composer and leaks the vendor

**Observed.** On screens 1 and 2 a pill button reading "Stop Claude" sits **on top of** the input field, obscuring the placeholder mid-word ("Ask about you|"). Two problems in one control: the underlying model vendor is exposed in the product's own voice, and the cancel affordance covers the primary input.

**Recommendation.** Cancel belongs inside the composer's affordance area, replacing the send button while a response streams, labelled "Stop" with a square glyph. Never overlay the input. And the assistant has a name already: if a label is needed, it is "Stop Ana."

### 5.3 Model selection is exposed to a business user

**Observed.** An "Auto ▾" control sits inside the composer beside the send button.

**Recommendation.** Remove it from the default experience. A revenue-cycle director has no basis to choose a model and no way to evaluate the consequences. If speed/depth tradeoffs matter, express them in user terms ("Quick answer" vs "Deep analysis") and put the raw model choice behind an advanced setting.

### 5.4 Floating controls with no relationship to each other

**Observed.** The right and bottom-right of the viewport hold three unrelated floating elements: an orange tab with a gear glyph and a "<" chevron, clipped by the viewport edge (screens 1, 2, 4); a circular mic FAB (screens 1-4); and an "Ana Navigator · 7 steps" chip (screens 1, 2). On board screens the orange tab disappears and two ~10 px glyphs (collapse, funnel) appear at the far-left edge of the canvas instead.

**Recommendation.** One consistent zone for utility affordances, present on every route in the same place, with labels or tooltips. Nothing should be clipped by the viewport edge; a control that is half off-screen reads as a rendering bug. The near-invisible edge glyphs for collapse and filter must become visible, labelled controls, because **filter state is critical context for every number on the page** and it is currently hidden in a 10 px icon.

### 5.5 No breadcrumb, no back, no undo

**Observed.** The chart modal (screen 3) dims and fully occludes the board. There is a close X and nothing else: no breadcrumb of how the user got there, no back, no path forward into a related question. No screen shows a breadcrumb anywhere.

**Recommendation.** Drill-downs open in a persistent side panel or bottom sheet with a visible filter-path breadcrumb whose segments are individually removable. Add undo for destructive or state-changing actions (unpin, delete, publish, and above all anything on the agency ladder above rung 3).

### 5.6 Feedback is collected but appears to go nowhere visible

**Observed.** Screen 4 offers thumbs up / thumbs down beside Save and Pin. Good instinct.

**Recommendation.** Close the loop or the signal decays. A thumbs-down should open one optional question ("What was wrong: the number, the definition, the chart, the question I understood?"), then visibly do something: offer a corrected interpretation, or record the correction against the metric definition so the same mistake is not repeated. Silent feedback trains users that feedback is pointless.

### 5.7 Four identical dashboard captures suggest non-responsiveness

**Observed.** Screens 7, 8, 9 and 10 are pixel-similar apart from cursor position and a left-rail selection highlight. Screens 1 and 2 differ only in background particle positions. Screens 10_1 and 11 differ only in cursor position.

**Inference (to be confirmed against the recording).** The tester was hovering and clicking on tiles, risk-strip actions and insight-card metrics and nothing was responding. If so, the interactive promises on the page ("click any tile to drill into the cohort", "Triage cohort →", "Escalate now →") are non-functional, which is worse than absent: a dead link on a KPI teaches users the product is a picture.

**Recommendation.** Verify against the recording. Any element that looks clickable must respond within 100 ms with at least a hover state, and must either act or explain why it cannot ("Drill-down not available for this metric yet").

---

## L6. VISUAL AND CONTENT DESIGN CRAFT

### 6.1 Typography

- Three type systems compete: a UI sans for labels and headings, a monospace for data values, status pills and micro-copy ("VQ8.Uniti Connected", "32,341,221", "15 records"), and small-caps micro-labels around 9-10 px ("NAME", "VALUE", "TOOLS", "OPEN A/R LIABILITY", "AR > 90 DAYS BY FACILITY"). Monospace for tabular figures is defensible; monospace for status text and body micro-copy reads as terminal cosplay and hurts legibility.
- Numeric formatting is inconsistent within one page: `$11M`, `$250k`, `$510k`, `$3.2M`, `36k`, `$39`, `32,341,221`, `$2,065.68`, `$2,066`, `$47,118`, `8.6%`, `60.3%`, `7.7`. Decide precision and abbreviation rules per magnitude band and apply globally.
- The VALUE column in screen 4 shows bare integers (`32,341,221`) with no currency symbol and no unit, for a metric that is dollars. Units must be on the column header at minimum.
- Text truncation appears in at least three places ("DSO INSIGHTS · COMMAND CEN...", "Appointments & Schedulin...", the clipped chart axis labels). Fix by shortening source strings, not by widening containers.
- The hero line wraps badly, orphaning "lake." onto its own line: "Powered by VQ8.Uniti longitudinal record & VQ8.Paradise data / lake." Set a max measure and balance the wrap.

### 6.2 Colour, contrast and dark theme execution

- Body and micro-copy in mid-grey on near-black (roughly #0f0f14) will not clear WCAG AA 4.5:1 in most of the places sampled: the welcome subtitle, the status pills, the risk-strip action links ("Triage cohort →" at roughly 10 px), the scorecard column headers, the "15 records" count, and the "No results were returned for this query" text.
- Orange links on dark and red values on dark are both borderline; small red text at 10-11 px is the worst case.
- The particle starfield sits directly behind body copy on the welcome screen, which makes contrast non-deterministic per pixel. Remove it behind text or damp it heavily.
- Everything is one dark scheme. Analysts work in bright rooms, present on projectors, and export to decks. A light theme is not cosmetic for a numbers product, it is a requirement.

### 6.3 Copy and voice

- Sentence case, capital case and lowercase are mixed within one section: section title "RISK STRIP" in caps, its description "Highest-priority signals across **dso insights**" with a lowercased product name mid-sentence, and title case elsewhere ("Most Impactful KPIs - Scorecard").
- Punctuation errors in generated narrative: "24.7 %" (space before percent), "below 6% threshold , no-show" (space before comma), a hyphen used where an "is" clause is needed.
- Redundant column naming: "Status KPI" and "Current Benchmark Value" and "Trend Value" are all longer and vaguer than necessary. "KPI", "Current", "Benchmark", "Gap", "Trend" reads better and fits.
- "Ask anything about your data." is the weakest possible prompt (see 1.6).
- Terms used interchangeably that should not be: target vs benchmark, signal vs risk vs insight, board vs pinboard, conversation vs chat vs thread.

### 6.4 Layout system

- Two different container styles coexist for the same job: the chat answer object (screen 4) is a full-width borderless region, while the pinboard uses bordered cards. Same content, two shells.
- The chart modal (screen 3) is neither centred nor sized to its content; it floats high-left with dead space, and the dimmed board behind it is unreadably dark rather than deliberately muted.
- Card overflow menus (the vertical dot glyphs) appear on hero tiles, risk tiles, the scorecard and insight cards, all with unknown and probably differing contents. Standardize the artifact action menu across every container.

---

## L7. ACCESSIBILITY AND OPERATING CONTEXT

1. **Contrast** fails AA in numerous small-text and status contexts (see 6.2). This is procurement-relevant for health systems, many of which require a VPAT.
2. **Colour as sole encoder.** Status is conveyed by red / amber / green pills and by red / green delta arrows. Add shape or text so red-green colour-blind users (roughly 8% of men) can read status. The scorecard's coloured dot in the "Status KPI" column is the clearest offender.
3. **Target sizes.** The viz-type glyphs, the edge collapse and filter icons, the card overflow dots and the risk-tile action links are all well under the 24 px minimum target guidance, some near 10 px.
4. **Keyboard and screen reader.** No visible focus treatment in any capture. A conversational product must be fully operable from the keyboard: focus composer, navigate turns, open artifact, switch view, drill, close. Data tables need proper header semantics; charts need text alternatives (an accessible summary sentence per chart is a natural fit here, since the system can already generate narrative).
5. **Motion.** The particle field must respect `prefers-reduced-motion`.
6. **PHI and compliance context.** This is healthcare revenue-cycle data. The UI should make the current data scope and access basis visible (which facilities, which role, whether any patient-level identifiers are in view), and any export or share action should state what leaves the system. None of the 11 screens shows this. Given VisiQuate's own policy of never processing PHI in tooling like this, the product should also make it obvious when a view is aggregate-only.

---

## L8. PRIORITIZED FIX LIST

### P0 - Blocks customer exposure (do before any further demo)

| # | Fix | Ref |
|---|---|---|
| 1 | Resolve the same-page KPI contradictions (Chair Utilization 60.3 vs 4.3, Case Acceptance 73 vs 100, Rev/Visit 2,065.68 vs 2,040). One metric, one value. | 3.1 |
| 2 | Stop generating arithmetic in prose; assemble narrative from verified numeric slots and validate before render. | 3.2 |
| 3 | Add `direction_of_goodness` to metric definitions and drive all delta colour and status badges from it. Aged >90d claims up 94.5% cannot read as green ON TRACK. | 4.3 |
| 4 | Add plausibility bounds; block implausible values ($39 total write-off) from rendering as confident hero numbers. | 3.3 |
| 5 | Remove "Stop Claude": rename and move it out of the composer overlay. | 5.2 |
| 6 | No Published board may contain an error or empty tile; give empty results a real state with a reason and an action. | 3.4 |
| 7 | Disable invalid chart types; default categorical rankings to sorted horizontal bars. Kill the orange area blob. | 4.1 |
| 8 | Mark demo data unmistakably, or replace it with realistic distributions. | 3.5 |

### P1 - Required for the concept to be true (next cycle)

| # | Fix | Ref |
|---|---|---|
| 9 | Make the composer global chrome on every route, with a visible context chip. | 1.1 |
| 10 | Add "Open conversation" to every artifact and tile. This is the missing primitive. | 1.3 |
| 11 | Unify the artifact model across chat, board, modal and share; artifacts get IDs and deep links. | 1.2 |
| 12 | Add global time context plus a per-artifact provenance footer (as-of, source, scope, query). | 1.4 |
| 13 | Replace "Ask anything" with role-relevant starter questions and a data-coverage line. | 1.6 |
| 14 | Skeleton loading per tile; never ship a blank canvas. | 5.1 |
| 15 | Collapse three status vocabularies (ON TRACK/WATCH, Met/Near/Gap, WARNING/CRITICAL) into one scale. | 4.3, 4.4 |
| 16 | Make drill-downs open in a side panel with an editable filter breadcrumb, not an occluding modal. | 5.5 |
| 17 | Surface filter state as visible chips; retire the 10 px edge funnel. | 5.4 |
| 18 | Define the semantic colour system and remove brand orange from data series. | 4.2 |

### P2 - Craft, coherence and scale

| # | Fix | Ref |
|---|---|---|
| 19 | Reduce the left rail from four navigation systems to two; unify threads, boards and artifacts into one searchable list. | 2.1 |
| 20 | Rename invented features to plain-English jobs; one assistant name across the chrome. | 2.2 |
| 21 | Fix contrast to AA; add non-colour status encoding; raise target sizes to 24 px. | L7 |
| 22 | Global number formatting and unit rules; fix truncation and the hero line wrap. | 6.1 |
| 23 | Rebalance density: shrink hero tiles, promote the scorecard, de-duplicate insight-card metrics. | 4.7 |
| 24 | Make micro-charts legible or replace them with signed deltas. | 4.5 |
| 25 | Label benchmark basis and vintage; use one word (benchmark or target). | 4.6 |
| 26 | Remove the model selector from the default experience. | 5.3 |
| 27 | Ship a light theme. | 6.2 |
| 28 | Close the feedback loop on thumbs down. | 5.6 |
| 29 | Damp or remove the particle background; respect reduced-motion. | 1.6, 6.2 |
| 30 | Build the explicit agency ladder with previews, receipts and undo before shipping anything named "auto-pilot". | 1.5 |

---

## L9. WHAT TO PROTECT

The critique above is dense, so it is worth being explicit that several things in this build are right and should not be lost in a redesign.

1. **The answer object in screen 4.** Title, one-line definition, viz switcher, in-object search, record count, and an action bar with Export / feedback / Save / Pin. This is the correct atomic unit of an AI analytics product. Everything in L1 is essentially "make this the whole product."
2. **Action verbs on risk tiles.** "Triage cohort", "Escalate now", "Open root-cause", "Recover variance". This is the language of a product that intends to change outcomes rather than describe them. Keep the ambition; add the safety rails.
3. **Benchmark-adjacent framing in the scorecard.** Showing current against benchmark with an explicit gap is more useful than the raw-number dashboards this category usually ships. It needs sourcing and consistency, not replacement.
4. **Pin / Save as a first-class gesture from chat.** The idea that conversation output graduates into a persistent board is exactly right, and is the seed of the bidirectional model in 1.3.
5. **Metric Library and Prompt Guide as concepts.** A governed semantic layer plus user education is the correct backbone for an AI analytics product. They are misnamed and mis-placed in the nav, not misconceived.
6. **The intent to show system state** ("VQ8.Uniti Connected", "Agentic loop active", the step counter). Users of agentic products do need to know what is happening. The instinct is right; the expression is engineer-facing.

---

## L10. EVIDENCE APPENDIX: SCREEN-BY-SCREEN

**screen1, screen2 - Welcome / empty conversation**
Robot avatar in rounded square; "Welcome to Kinetic"; plumbing subtitle wrapping with orphaned "lake."; "Ask anything about your data."; three status pills; particle starfield; left rail with four nav systems; orange gear drawer clipped at the right viewport edge; mic FAB; "Ana Navigator · 7 steps" chip; "Stop Claude" pill overlaying the composer placeholder; "Auto ▾" model selector. No example questions, no data-coverage statement, no recent threads. Two captures differ only in particle positions.

**screen3 - Chart modal**
"AR > 90 Days by Facility (Top 15)" as a solid orange area chart over 15 nominal categories: unreadable. Eight unlabeled viz glyphs; "N=15"; y ticks 0 / 8.5M / 17M / 25.5M / 34M; 45-degree axis labels overlapping and clipped at both ends. Modal floats off-centre; board behind is dimmed to unreadable. Close X is the only navigation.

**screen4 - Answer object as table (the good screen)**
Avatar, title, one-line definition, small-caps context label, viz switcher with table active, "Search table...", NAME / VALUE columns, 15 rows of unitless integers, "15 records", action bar EXPORT / thumbs / Save / Pin. Composer present. Missing: as-of, filters, provenance, units, suggested follow-ups.

**screen6 - Pinboard load state**
Full board chrome (star, title, "Published", DEMO, subtitle, two link chips, refresh, Edit, gear, overflow) with an entirely empty body. Two ~10 px glyphs at the far-left canvas edge (collapse, filter). No composer.

**screen7, screen8, screen9, screen10 - Pinboard populated**
Four hero tiles (Open A/R $11M ▲77.0%, Cash Acceleration $250k ▼14.7%, Net Yield 8.6% ▼81.4%, Total Write-off $39 ▼96.4%), all with red sparklines. Risk strip of five tiles with ON TRACK / WATCH badges and action links. "Most Impactful KPIs - Scorecard" with Status KPI / Current Value / Current Benchmark Value / GAP / Trend Value across seven KPIs. No composer. Four captures near-identical.

**screen10_1, screen11 - Pinboard scrolled**
Scorecard, then three cards: an untitled empty-state card ("No results were returned for this query") with a decorative grey chart glyph; "Revenue Optimization [WARNING]" with the self-contradicting 100%/75% narrative; "Operational Throughput [CRITICAL]" with the 4.3% / "24.7 % below target" arithmetic error. Both cards duplicate their headline metric inside their own metric list. Chair Utilization 4.3% here versus 60.3% in the scorecard above. No composer.

---

## L11. ACCEPTANCE CRITERIA

How to know the concept has been restored, stated as tests rather than opinions.

1. **Ambient conversation.** From any of the 11 screens above, a user can ask a question without navigating. Pass/fail per route.
2. **Round trip.** Ask a question in chat, pin the answer to a board, then from that board tile reopen the originating conversation with full history and the artifact attached. Under 5 seconds, zero dead ends.
3. **Contextual pronoun.** On the DSO Insights board, with the Denial Rate tile selected, the question "why is this up?" returns an answer about denial rate without the user naming the metric.
4. **Provenance in one click.** Every number on every screen reaches its as-of timestamp, source, scope and query in a single interaction.
5. **Semantic integrity.** No metric renders two different values in the same time context anywhere in the product (enforced in CI).
6. **Directional correctness.** For each metric, a favourable movement renders as favourable. Test the full metric catalogue, not samples.
7. **No dead promises.** Every element styled as interactive responds within 100 ms and either acts or explains.
8. **No blank or lying states.** Every load, empty, partial and error condition has a designed state naming the cause and offering one action. Published boards cannot contain a failed tile.
9. **Chart validity.** The viz switcher cannot produce an encoding invalid for the data shape.
10. **Accessibility floor.** AA contrast throughout, status never colour-only, 24 px minimum targets, full keyboard operation of the conversational loop.
11. **First-question success.** In unmoderated testing with target-role users, at least 80% get a useful answer on their first attempt without help. This is the metric that predicts adoption.

---

## L12. OPEN QUESTIONS FOR THE TEAM

1. Is the primary user a revenue-cycle VP (weekly, board-oriented, exception-driven) or a revenue-cycle analyst (daily, query-driven)? Nearly every density, nav and default decision above changes with the answer, and the current build appears to be serving both and therefore neither.
2. Is the pinboard intended as an authoring product in its own right, or as saved conversation output? If the former, the two-application problem in 2.3 is a deliberate strategy and needs a much stronger justification than it currently has.
3. What are "Signal Intelligence", "Process Signals" and "Intake Intelligence" meant to do, in one sentence each, in a customer's words? If the team cannot answer quickly, these are probably one feature.
4. How far up the agency ladder (1.5) is the product actually meant to go this year? "Auto-pilot refunds" implies rung 5, which implies audit, permissions, approvals and reversal, none of which is visible.
5. Where does the semantic layer live, and is it the single source of truth for both chat answers and board tiles? The contradictions in 3.1 suggest it is not, and if so, that is the root cause behind roughly half of the P0 list.
6. Is the demo tenant shown to prospects? If yes, the data-realism issue in 3.5 is a revenue problem, not a QA problem.
7. Does the recording (`Screen Recording 2026-08-18 at 7.53.00 AM.mov`, not reviewable here due to the connector's fetch cap) show non-responsive tiles, as the four identical dashboard captures imply? Please re-share it in a smaller size or via a local folder so the interaction findings in 5.7 can be confirmed rather than inferred.
