import { CircleCheck, TriangleAlert, X } from "lucide-react";
import {
  Button,
  Card,
  DeltaChip,
  Pill,
  Skeleton,
  Sparkline,
  StatusBadge,
  Table,
  THead,
  Th,
  TRow,
  Td,
} from "../kinetic-ui";
import {
  AS_OF,
  COMPARE,
  KPI_STRIP,
  PERIOD,
  RISKS,
  SCORECARD,
  metricDefs,
  metricValues,
  type MetricId,
} from "../data/metrics";
import {
  favorabilityOf,
  fmtDelta,
  fmtValue,
  isPlausible,
  narrative,
  statusOf,
  type Status,
} from "../lib/semantics";
import { useApp } from "../state/store";
import { ArtifactCard } from "./ArtifactCard";

/**
 * The revised pinboard: resembles the server build's board (KPI row, risk
 * strip, scorecard, narrative cards) with the teardown fixes applied:
 * one value per metric, favorability-aware deltas, one status vocabulary,
 * visible time context and filters, skeletons, drill on every tile.
 */

const severityRank: Record<Status, number> = {
  critical: 0,
  gap: 1,
  near: 2,
  "on-target": 3,
};

function KpiTile({ m }: { m: MetricId }) {
  const { openDrill } = useApp();
  const def = metricDefs[m];
  const val = metricValues[m];
  const delta = val.current - val.previous;
  const plausible = isPlausible(def, val.current);

  return (
    <button
      onClick={() => openDrill(m)}
      className="min-w-0 flex-1 rounded-card border border-lines-card bg-bg-card p-3 text-left transition-colors hover:border-border-active"
      aria-label={`${def.label}, drill into cohort`}
    >
      <p className="truncate text-[11px] font-medium tracking-wide text-text-muted" title={def.label}>
        {def.label.toUpperCase()}
      </p>
      {plausible ? (
        <>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="font-mono text-xl font-medium text-text-primary">
              {fmtValue(def.unit, val.current)}
            </span>
            <DeltaChip
              delta={delta}
              favorability={favorabilityOf(def, delta)}
              label={fmtDelta(def, val.current, val.previous)}
            />
          </div>
          <div className="mt-1.5 flex items-center justify-between gap-2">
            <StatusBadge status={statusOf(def, val.current)} />
            <Sparkline
              data={val.trend}
              favorability={favorabilityOf(def, delta)}
              width={72}
              height={22}
              label={`${def.label}, 8 period trend`}
            />
          </div>
        </>
      ) : (
        <div className="mt-1.5 flex flex-col gap-1.5">
          <Pill variant="warning" className="self-start">
            <TriangleAlert size={11} aria-hidden />
            Check mapping
          </Pill>
          <p className="text-[11px] leading-snug text-text-muted">
            Value ({fmtValue(def.unit, val.current)}) is outside the plausible
            range. Verify the Aug 4 code mapping before trusting it.
          </p>
        </div>
      )}
    </button>
  );
}

function RiskStrip() {
  const { openDrill, startAgency, askAboutMetric } = useApp();
  const ranked = [...RISKS].sort((a, b) => {
    const sa = severityRank[statusOf(metricDefs[a.metricId], metricValues[a.metricId].current)];
    const sb = severityRank[statusOf(metricDefs[b.metricId], metricValues[b.metricId].current)];
    return sa === sb ? b.impactUsd - a.impactUsd : sa - sb;
  });
  const anyUrgent = ranked.some((r) => {
    const st = statusOf(metricDefs[r.metricId], metricValues[r.metricId].current);
    return st === "critical" || st === "gap";
  });

  return (
    <Card padded={false} className="p-4">
      <div className="flex items-center gap-2">
        <TriangleAlert size={15} className="text-semantic-warning" aria-hidden />
        <h2 className="text-sm font-semibold text-text-primary">Needs attention</h2>
        <span className="text-xs text-text-muted">
          sorted by severity and dollar impact · click any tile to drill into the cohort
        </span>
      </div>
      {!anyUrgent ? (
        <p className="mt-3 flex items-center gap-2 text-sm text-text-secondary">
          <CircleCheck size={15} className="text-semantic-success" aria-hidden />
          Nothing needs attention today.
        </p>
      ) : (
        <div className="mt-3 grid grid-cols-5 gap-2 max-[1400px]:grid-cols-3 max-[1000px]:grid-cols-2">
          {ranked.map((r) => {
            const def = metricDefs[r.metricId];
            const val = metricValues[r.metricId];
            const delta = val.current - val.previous;
            return (
              <div
                key={r.metricId}
                className="flex flex-col gap-1.5 rounded-control border border-lines-hairline bg-bg-surface-deep p-3"
              >
                <div className="flex items-center justify-between gap-1">
                  <span className="truncate text-xs text-text-secondary" title={def.label}>
                    {def.label}
                  </span>
                  <StatusBadge status={statusOf(def, val.current)} />
                </div>
                <button
                  onClick={() => openDrill(r.metricId)}
                  className="flex items-baseline gap-2 text-left hover:opacity-80"
                  aria-label={`Drill into ${def.label}`}
                >
                  <span className="font-mono text-lg font-medium text-text-primary">
                    {fmtValue(def.unit, val.current)}
                  </span>
                  <DeltaChip
                    delta={delta}
                    favorability={favorabilityOf(def, delta)}
                    label={fmtDelta(def, val.current, val.previous)}
                  />
                </button>
                <span className="text-[11px] text-text-muted">{r.impactLabel}</span>
                <div className="mt-auto flex items-center gap-1">
                  {r.action === "Recover variance" ? (
                    <Button size="sm" variant="secondary" onClick={() => startAgency("recover-variance")}>
                      {r.action}
                    </Button>
                  ) : (
                    <Button size="sm" variant="secondary" onClick={() => openDrill(r.metricId)}>
                      {r.action}
                    </Button>
                  )}
                  <Button size="sm" variant="ghost" onClick={() => askAboutMetric(r.metricId)}>
                    Ask
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}

function Scorecard() {
  const { openDrill } = useApp();
  return (
    <Card padded={false} className="p-4">
      <h2 className="text-sm font-semibold text-text-primary">
        Most impactful KPIs - scorecard
      </h2>
      <p className="mt-0.5 text-xs text-text-muted">
        Benchmarks are labeled with their basis. Hover a target for its source.
      </p>
      <div className="mt-3">
        <Table>
          <THead>
            <Th>KPI</Th>
            <Th numeric>Current</Th>
            <Th numeric>Target</Th>
            <Th>Status</Th>
            <Th numeric>Change {COMPARE}</Th>
            <Th>Trend (8 periods)</Th>
          </THead>
          <tbody>
            {SCORECARD.map((m, i) => {
              const def = metricDefs[m];
              const val = metricValues[m];
              const delta = val.current - val.previous;
              return (
                <TRow
                  key={m}
                  index={i}
                  hover="interactive"
                  className="cursor-pointer"
                  onClick={() => openDrill(m)}
                >
                  <Td className="text-text-primary">{def.label}</Td>
                  <Td numeric className="text-text-primary">
                    {fmtValue(def.unit, val.current)}
                  </Td>
                  <Td numeric title={def.targetBasis} className="underline decoration-dotted decoration-text-decor underline-offset-2">
                    {fmtValue(def.unit, def.target)}
                  </Td>
                  <Td>
                    <StatusBadge status={statusOf(def, val.current)} />
                  </Td>
                  <Td numeric>
                    <DeltaChip
                      delta={delta}
                      favorability={favorabilityOf(def, delta)}
                      label={fmtDelta(def, val.current, val.previous)}
                    />
                  </Td>
                  <Td>
                    <Sparkline
                      data={val.trend}
                      favorability={favorabilityOf(def, delta)}
                      width={88}
                      height={22}
                      label={`${def.label} trend`}
                    />
                  </Td>
                </TRow>
              );
            })}
          </tbody>
        </Table>
      </div>
    </Card>
  );
}

function NarrativeCard({
  title,
  headline,
  rows,
}: {
  title: string;
  headline: MetricId;
  rows: MetricId[];
}) {
  const { openDrill, askAboutMetric } = useApp();
  const def = metricDefs[headline];
  const val = metricValues[headline];
  const st = statusOf(def, val.current);
  return (
    <Card
      className={st === "critical" ? "border-semantic-error" : ""}
      variant={st === "critical" ? "elevated" : "default"}
    >
      <div className="flex items-center gap-2">
        <h3 className="text-sm font-semibold text-text-primary">{title}</h3>
        <StatusBadge status={st} />
      </div>
      {/* narrative assembled from verified slots - it CANNOT contradict the tile */}
      <p className="mt-1.5 text-xs leading-relaxed text-text-secondary">
        {narrative(def, val)}
      </p>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="font-mono text-2xl font-medium text-text-primary">
          {fmtValue(def.unit, val.current)}
        </span>
        <span className="text-xs text-text-muted" title={def.targetBasis}>
          target {fmtValue(def.unit, def.target)}
        </span>
      </div>
      <div className="mt-2 flex flex-col gap-1 border-t border-lines-hairline pt-2">
        {rows.map((m) => {
          const d = metricDefs[m];
          const v = metricValues[m];
          return (
            <button
              key={m}
              onClick={() => openDrill(m)}
              className="flex items-center justify-between rounded-control px-1.5 py-1 text-xs hover:bg-state-hover"
            >
              <span className="text-text-secondary">{d.label}</span>
              <span className="flex items-center gap-2">
                <span className="font-mono text-text-primary">
                  {fmtValue(d.unit, v.current)}
                </span>
                <StatusBadge status={statusOf(d, v.current)} />
              </span>
            </button>
          );
        })}
      </div>
      <div className="mt-2.5">
        <Button size="sm" variant="ghost" onClick={() => askAboutMetric(headline)}>
          Ask about this
        </Button>
      </div>
    </Card>
  );
}

export function CommandCenter() {
  const { boardLoading, artifacts, removeDrillFilter, drillFilters, showToast } = useApp();
  const pinned = Object.values(artifacts).filter((a) =>
    a.pinnedTo.includes("board-dso"),
  );

  if (boardLoading) {
    return (
      <div className="flex flex-col gap-3" aria-busy="true" aria-label="Command Center loading">
        <Skeleton className="h-9 w-2/3" />
        <div className="flex gap-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-24 flex-1" />
          ))}
        </div>
        <Skeleton className="h-40" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* board header: identity + global time context + visible filters */}
      <div className="flex flex-wrap items-center gap-2">
        <h1 className="text-lg font-semibold text-text-primary">DSO Insights · Command Center</h1>
        <Pill variant="success">
          <CircleCheck size={11} aria-hidden /> Published
        </Pill>
        <Pill variant="warning">DEMO DATA</Pill>
        <span className="ml-auto text-xs text-text-muted">
          {PERIOD} · {COMPARE} · refreshed {AS_OF} · next 13:00
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-[11px] font-medium text-text-muted">FILTERS</span>
        {["All facilities", "Payer: all", PERIOD].map((f) => (
          <span
            key={f}
            className="inline-flex items-center gap-1 rounded-pill bg-state-selected-grey px-2.5 py-[3px] text-xs font-medium text-text-secondary"
          >
            {f}
            <button
              aria-label={`Remove filter ${f}`}
              onClick={() =>
                drillFilters.includes(f)
                  ? removeDrillFilter(f)
                  : showToast("Filter editing applies inside the drill panel in this prototype.")
              }
              className="text-icon-tertiary hover:text-text-primary"
            >
              <X size={11} />
            </button>
          </span>
        ))}
      </div>

      {/* compact KPI strip (heroes demoted, teardown 4.7) */}
      <div className="flex gap-2 max-[1200px]:flex-wrap">
        {KPI_STRIP.map((m) => (
          <KpiTile key={m} m={m} />
        ))}
      </div>

      <RiskStrip />
      <Scorecard />

      <div className="grid grid-cols-2 gap-3 max-[1100px]:grid-cols-1">
        <NarrativeCard
          title="Revenue optimization"
          headline="revenue_per_visit"
          rows={["revenue_per_patient", "production_per_provider", "case_acceptance"]}
        />
        <NarrativeCard
          title="Operational throughput"
          headline="chair_utilization"
          rows={["no_show_rate", "days_unbilled", "clean_claim_rate"]}
        />
      </div>

      {/* pinned artifacts keep full lineage (teardown 1.2/1.3) */}
      <div>
        <h2 className="mb-2 text-sm font-semibold text-text-primary">
          Pinned from conversations
        </h2>
        {pinned.length ? (
          <div className="grid grid-cols-2 gap-3 max-[1100px]:grid-cols-1">
            {pinned.map((a) => (
              <ArtifactCard key={a.id} artifactId={a.id} context="board" />
            ))}
          </div>
        ) : (
          <Card variant="deep" className="text-center">
            <p className="text-sm text-text-secondary">Nothing pinned yet.</p>
            <p className="mt-1 text-xs text-text-muted">
              Ask Ana a question and press Pin on the answer - it lands here
              with its conversation attached.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
