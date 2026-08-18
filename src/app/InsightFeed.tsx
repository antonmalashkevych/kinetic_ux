import { useEffect, useRef, useState } from "react";
import { Sparkles, TrendingUp, TriangleAlert } from "lucide-react";
import { Button, Card, DeltaChip, Pill, StatusBadge } from "../kinetic-ui";
import { insights, type Insight, type InsightType } from "../data/insights";
import { metricDefs, metricValues } from "../data/metrics";
import {
  favorabilityOf,
  fmtDelta,
  fmtValue,
  isPlausible,
  statusOf,
} from "../lib/semantics";
import { useApp } from "../state/store";

/**
 * Live insight feed (Make prototype pattern). Every number on a card comes
 * from the semantic layer via metricId - the feed cannot contradict the board.
 */

const TYPE_META: Record<
  InsightType,
  { label: string; icon: typeof Sparkles; border: string; pill: "warning" | "error" | "success" }
> = {
  anomaly: { label: "Anomaly", icon: TriangleAlert, border: "border-l-semantic-warning", pill: "warning" },
  risk: { label: "Risk", icon: TriangleAlert, border: "border-l-semantic-error", pill: "error" },
  improvement: { label: "Improvement", icon: TrendingUp, border: "border-l-semantic-success", pill: "success" },
};

function InsightCardView({ insight, highlighted }: { insight: Insight; highlighted: boolean }) {
  const { investigate, startAgency, openDrill } = useApp();
  const ref = useRef<HTMLDivElement>(null);
  const def = metricDefs[insight.metricId];
  const val = metricValues[insight.metricId];
  const meta = TYPE_META[insight.type];
  const delta = val.current - val.previous;
  const plausible = isPlausible(def, val.current);

  useEffect(() => {
    if (highlighted)
      ref.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [highlighted]);

  return (
    <div ref={ref}>
      <Card
        className={[
          "border-l-2 transition-shadow",
          meta.border,
          highlighted
            ? "border-border-active shadow-[0_0_0_3px_var(--color-state-focus)]"
            : "",
        ].join(" ")}
      >
        <div className="flex items-center gap-2">
          <Pill variant={meta.pill}>
            <meta.icon size={11} aria-hidden />
            {meta.label}
          </Pill>
          <span className="text-[11px] text-text-muted">{insight.detectedAt}</span>
          <span className="ml-auto">
            <StatusBadge status={statusOf(def, val.current)} />
          </span>
        </div>
        <h3 className="mt-2 text-[15px] font-semibold text-text-primary">
          {insight.title}
        </h3>

        <div className="mt-2 flex items-baseline gap-3 rounded-control bg-bg-surface-deep px-3 py-2">
          <span className="text-xs text-text-muted">{def.label}</span>
          {plausible ? (
            <>
              <span className="font-mono text-lg font-medium text-text-primary">
                {fmtValue(def.unit, val.current)}
              </span>
              <DeltaChip
                delta={delta}
                favorability={favorabilityOf(def, delta)}
                label={fmtDelta(def, val.current, val.previous)}
                period="vs Jul"
              />
            </>
          ) : (
            <Pill variant="warning">
              <TriangleAlert size={11} aria-hidden />
              Value out of expected range - check mapping
            </Pill>
          )}
          <span className="ml-auto text-[11px] text-text-decor">
            target {fmtValue(def.unit, def.target)}
          </span>
        </div>

        <p className="mt-2 text-xs leading-relaxed text-text-secondary">
          <span className="font-medium text-text-muted">WHY IT MATTERS · </span>
          {insight.why}
        </p>
        <p className="mt-1.5 text-xs leading-relaxed text-text-secondary">
          <span className="font-medium text-text-muted">SUGGESTED ACTION · </span>
          {insight.suggestedAction}
        </p>

        <div className="mt-3 flex items-center gap-1.5">
          {insight.agencyActionId ? (
            <Button size="sm" variant="primary" onClick={() => startAgency(insight.agencyActionId!)}>
              Draft recovery batch
            </Button>
          ) : (
            <Button size="sm" variant="secondary" onClick={() => openDrill(insight.metricId)}>
              Drill into the data
            </Button>
          )}
          <Button size="sm" variant="ghost" onClick={() => investigate(insight)}>
            <Sparkles size={13} aria-hidden /> Investigate with Ana
          </Button>
        </div>
      </Card>
    </div>
  );
}

export function InsightFeed() {
  const { highlightInsight } = useApp();
  const [filter, setFilter] = useState<"all" | InsightType>("all");
  const list = insights.filter((i) => filter === "all" || i.type === filter);
  const counts = (t: InsightType) => insights.filter((i) => i.type === t).length;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-1.5">
        {(
          [
            ["all", `All ${insights.length}`],
            ["anomaly", `Anomalies ${counts("anomaly")}`],
            ["risk", `Risks ${counts("risk")}`],
            ["improvement", `Improvements ${counts("improvement")}`],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            aria-pressed={filter === id}
            onClick={() => setFilter(id)}
            className={[
              "rounded-pill px-2.5 py-[3px] text-xs font-medium",
              filter === id
                ? "bg-overlay-ghost-pill-bg-interactive text-accent-interactive-soft"
                : "bg-state-selected-grey text-text-secondary hover:bg-state-hover",
            ].join(" ")}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="flex flex-col gap-3">
        {list.map((i) => (
          <InsightCardView key={i.id} insight={i} highlighted={highlightInsight === i.id} />
        ))}
      </div>
    </div>
  );
}
