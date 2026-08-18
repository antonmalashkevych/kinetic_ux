/**
 * The semantic layer: every number is computed once, here, and referenced
 * everywhere (teardown 3.1). Status, favorability and narrative are DERIVED,
 * never hand-set.
 */

export type Status = "on-target" | "near" | "gap" | "critical";
export type Favorability = "favorable" | "unfavorable" | "neutral";
export type Direction = "higher" | "lower";
export type Unit = "usd" | "pct" | "days" | "count";

export interface MetricDef {
  id: string;
  label: string;
  unit: Unit;
  /** direction_of_goodness (teardown 4.3): which way is good */
  direction: Direction;
  target: number;
  targetBasis: string; // "Industry P75, ADA 2025" | "Your FY26 target"
  plausibleRange: [number, number]; // outside = flagged, never confident
  definition: string; // one-line, shown on artifacts
}

export interface MetricValue {
  current: number;
  previous: number;
  trend: number[]; // last 8 periods incl. current
  asOf: string;
  scope: string; // "15 of 15 facilities"
  source: string; // "VQ8.Uniti"
}

/** Signed gap toward target, positive = better than target. */
function goodness(def: MetricDef, v: number): number {
  return def.direction === "higher" ? v - def.target : def.target - v;
}

/** One status vocabulary, everywhere (teardown L8-15). */
export function statusOf(def: MetricDef, v: number): Status {
  const g = goodness(def, v);
  const span = Math.abs(def.target) || 1;
  const rel = g / span;
  if (rel >= 0) return "on-target";
  if (rel > -0.05) return "near";
  if (rel > -0.25) return "gap";
  return "critical";
}

/** Favorability of a CHANGE, independent of status vs target. */
export function favorabilityOf(def: MetricDef, delta: number): Favorability {
  if (delta === 0) return "neutral";
  const goodMove = def.direction === "higher" ? delta > 0 : delta < 0;
  return goodMove ? "favorable" : "unfavorable";
}

export function isPlausible(def: MetricDef, v: number): boolean {
  return v >= def.plausibleRange[0] && v <= def.plausibleRange[1];
}

/* ---------- formatting (one rule set, teardown 6.1) ---------- */

export function fmtValue(unit: Unit, v: number): string {
  switch (unit) {
    case "usd":
      if (Math.abs(v) >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
      if (Math.abs(v) >= 10_000) return `$${Math.round(v / 1_000)}k`;
      return `$${Math.round(v).toLocaleString("en-US")}`;
    case "pct":
      return `${v.toFixed(1)}%`;
    case "days":
      return `${v.toFixed(1)} days`;
    case "count":
      return v.toLocaleString("en-US");
  }
}

export function fmtDelta(def: MetricDef, cur: number, prev: number): string {
  const d = cur - prev;
  const sign = d > 0 ? "+" : d < 0 ? "-" : "";
  if (def.unit === "pct") return `${sign}${Math.abs(d).toFixed(1)} pt`;
  if (prev === 0) return "n/a";
  const relPct = (Math.abs(d) / Math.abs(prev)) * 100;
  return `${sign}${relPct.toFixed(1)}%`;
}

/* ---------- narrative from verified slots (teardown 3.2) ---------- */

/**
 * Prose is assembled from the SAME computed values the tile renders and
 * validated: sign, threshold direction. Fails closed to a plain statement.
 */
export function narrative(def: MetricDef, val: MetricValue): string {
  const v = val.current;
  const g = goodness(def, v);
  const rel = def.direction === "higher" ? "above" : "below";
  const relBad = def.direction === "higher" ? "below" : "above";
  const gapText =
    def.unit === "pct"
      ? `${Math.abs(v - def.target).toFixed(1)} pt`
      : fmtValue(def.unit, Math.abs(v - def.target));

  // validation: never emit "below target" when the value beats the target
  if (g >= 0) {
    return `${def.label} at ${fmtValue(def.unit, v)} meets the target of ${fmtValue(def.unit, def.target)} (${gapText} ${rel} it; basis: ${def.targetBasis}).`;
  }
  return `${def.label} at ${fmtValue(def.unit, v)} is ${gapText} ${relBad} the target of ${fmtValue(def.unit, def.target)} (basis: ${def.targetBasis}).`;
}
