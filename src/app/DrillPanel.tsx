import { MessageSquareText, X } from "lucide-react";
import { Button, Card, StatusBadge, Table, THead, Th, TRow, Td } from "../kinetic-ui";
import { facilities } from "../data/facilities";
import { metricDefs, metricValues, COMPARE } from "../data/metrics";
import { fmtValue, narrative, statusOf } from "../lib/semantics";
import { seedArtifact } from "../data/threads";
import { useApp } from "../state/store";
import { useState } from "react";

/**
 * Drill-in: a side panel, never an occluding modal (teardown 5.5). The board
 * stays visible. Three sections: Data, Context, Reasoning - including the
 * missing primitive, "Open conversation" (teardown 1.3).
 */
export function DrillPanel() {
  const {
    drillMetric,
    closeDrill,
    drillFilters,
    removeDrillFilter,
    askAboutMetric,
    openConversationFor,
    focusComposer,
  } = useApp();
  const [compare, setCompare] = useState<string | null>(null);
  if (!drillMetric) return null;

  const def = metricDefs[drillMetric];
  const val = metricValues[drillMetric];
  const hasCohort = drillMetric === "ar_over_90";
  const hasThread = seedArtifact.metricId === drillMetric;

  const quarterAgo = val.trend[Math.max(0, val.trend.length - 5)];
  const compareLine =
    compare === "quarter"
      ? `Vs a quarter ago: ${fmtValue(def.unit, quarterAgo)} then, ${fmtValue(def.unit, val.current)} now.`
      : compare === "benchmark"
        ? `Vs ${def.targetBasis}: target ${fmtValue(def.unit, def.target)}, current ${fmtValue(def.unit, val.current)}.`
        : compare === "peers"
          ? "Peer comparison needs a benchmarking cohort - not wired in this prototype."
          : null;

  return (
    <aside
      role="complementary"
      aria-label={`Drill into ${def.label}`}
      className="absolute inset-y-2 right-2 z-20 flex w-[420px] flex-col gap-3 overflow-y-auto rounded-card border border-lines-card bg-bg-floating p-4 shadow-[0_8px_40px_var(--color-bg-overlay)]"
    >
      <header className="flex items-start gap-2">
        <div>
          <p className="text-[11px] text-text-muted">Command Center › drill</p>
          <h2 className="text-base font-semibold text-text-primary">{def.label}</h2>
          <p className="mt-0.5 text-xs text-text-muted">{def.definition}</p>
        </div>
        <span className="ml-auto flex items-center gap-2">
          <StatusBadge status={statusOf(def, val.current)} />
          <button
            aria-label="Close drill panel (Esc)"
            onClick={closeDrill}
            className="rounded-control p-1.5 text-icon-tertiary hover:bg-state-hover"
          >
            <X size={16} />
          </button>
        </span>
      </header>

      {/* editable filter path (teardown 5.5) */}
      <div className="flex flex-wrap items-center gap-1.5">
        {drillFilters.map((f) => (
          <span
            key={f}
            className="inline-flex items-center gap-1 rounded-pill bg-overlay-ghost-pill-bg-interactive px-2.5 py-[3px] text-xs font-medium text-accent-interactive-soft"
          >
            {f}
            <button aria-label={`Remove filter ${f}`} onClick={() => removeDrillFilter(f)}>
              <X size={11} />
            </button>
          </span>
        ))}
      </div>

      {/* DATA */}
      <section>
        <h3 className="mb-1.5 text-[11px] font-medium tracking-wide text-text-muted">
          DATA - THE COHORT BEHIND THE NUMBER
        </h3>
        {hasCohort ? (
          <Table>
            <THead>
              <Th>Facility</Th>
              <Th numeric>A/R &gt; 90d ($)</Th>
              <Th numeric>Claims</Th>
            </THead>
            <tbody>
              {facilities.slice(0, 8).map((f, i) => (
                <TRow key={f.name} index={i} hover="interactive">
                  <Td>{f.name}</Td>
                  <Td numeric>{f.arOver90.toLocaleString("en-US")}</Td>
                  <Td numeric>{f.claims}</Td>
                </TRow>
              ))}
            </tbody>
          </Table>
        ) : (
          <Card variant="deep" padded className="text-xs text-text-secondary">
            Facility-level cohorts are wired for A/R metrics in this prototype.
            For {def.label}, the 8-period trend is:
            <div className="mt-2 grid grid-cols-4 gap-1 font-mono text-text-primary">
              {val.trend.map((t, i) => (
                <span key={i} className="rounded-xs bg-state-hover px-1.5 py-1 text-center">
                  {fmtValue(def.unit, t)}
                </span>
              ))}
            </div>
          </Card>
        )}
      </section>

      {/* CONTEXT */}
      <section>
        <h3 className="mb-1.5 text-[11px] font-medium tracking-wide text-text-muted">
          CONTEXT - REFRAME WITHOUT LEAVING
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {[
            ["quarter", "Vs last quarter"],
            ["benchmark", "Vs benchmark"],
            ["peers", "Vs peer facilities"],
          ].map(([id, label]) => (
            <button
              key={id}
              aria-pressed={compare === id}
              onClick={() => setCompare(compare === id ? null : id)}
              className={[
                "rounded-pill px-2.5 py-[3px] text-xs font-medium",
                compare === id
                  ? "bg-state-selected text-text-primary"
                  : "bg-state-selected-grey text-text-secondary hover:bg-state-hover",
              ].join(" ")}
            >
              {label}
            </button>
          ))}
        </div>
        {compareLine && (
          <p className="mt-2 text-xs text-text-secondary">{compareLine}</p>
        )}
      </section>

      {/* REASONING */}
      <section>
        <h3 className="mb-1.5 text-[11px] font-medium tracking-wide text-text-muted">
          REASONING - WHERE THIS NUMBER COMES FROM
        </h3>
        <Card variant="deep" className="flex flex-col gap-1.5 text-xs">
          <p className="text-text-secondary">{narrative(def, val)}</p>
          <p className="text-text-muted">
            As of {val.asOf} · {val.source} · {val.scope} · change {COMPARE}
          </p>
          <p className="text-text-muted">
            Target basis: <span className="text-text-secondary">{def.targetBasis}</span>
          </p>
        </Card>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {hasThread ? (
            <Button size="sm" variant="primary" onClick={() => openConversationFor(seedArtifact.id)}>
              <MessageSquareText size={13} aria-hidden /> Open conversation
            </Button>
          ) : (
            <Button
              size="sm"
              variant="primary"
              onClick={() => {
                askAboutMetric(drillMetric);
                focusComposer();
              }}
            >
              <MessageSquareText size={13} aria-hidden /> Ask Ana about this
            </Button>
          )}
        </div>
      </section>
    </aside>
  );
}
