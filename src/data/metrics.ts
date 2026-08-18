import type { MetricDef, MetricValue } from "../lib/semantics";

/**
 * DSO dental demo dataset - corrected per teardown L3:
 * one value per metric, computed here, referenced everywhere.
 * All values internally consistent; one metric (same_day_treatment) is
 * DELIBERATELY out of plausible range to demonstrate the plausibility gate.
 */

export const AS_OF = "Aug 18, 2026 07:52";
export const PERIOD = "Aug 2026 MTD";
export const COMPARE = "vs Jul 2026";
export const SOURCE = "VQ8.Uniti";
export const COVERAGE = "15 facilities · claims through Aug 17";

export const metricDefs = {
  open_ar: {
    id: "open_ar",
    label: "Open A/R Liability",
    unit: "usd",
    direction: "lower",
    target: 9_500_000,
    targetBasis: "Your FY26 target",
    plausibleRange: [100_000, 50_000_000],
    definition: "Total outstanding accounts receivable across all facilities.",
  },
  ar_over_90: {
    id: "ar_over_90",
    label: "A/R > 90 Days",
    unit: "usd",
    direction: "lower",
    target: 2_000_000,
    targetBasis: "Your FY26 target",
    plausibleRange: [50_000, 20_000_000],
    definition:
      "Outstanding receivables aged more than 90 days from service date.",
  },
  cash_collections: {
    id: "cash_collections",
    label: "Cash Collections",
    unit: "usd",
    direction: "higher",
    target: 8_200_000,
    targetBasis: "Your FY26 target",
    plausibleRange: [500_000, 50_000_000],
    definition: "Cash posted month-to-date across all payers and patients.",
  },
  total_writeoff: {
    id: "total_writeoff",
    label: "Total Write-off",
    unit: "usd",
    direction: "lower",
    target: 380_000,
    targetBasis: "Your FY26 target",
    plausibleRange: [10_000, 5_000_000],
    definition: "Contractual and bad-debt write-offs posted month-to-date.",
  },
  denial_rate: {
    id: "denial_rate",
    label: "Denial Rate",
    unit: "pct",
    direction: "lower",
    target: 7.0,
    targetBasis: "Industry P75, HFMA 2025",
    plausibleRange: [0, 40],
    definition: "Denied claims as a share of claims adjudicated this period.",
  },
  clean_claim_rate: {
    id: "clean_claim_rate",
    label: "Clean Claim / First-Pass Rate",
    unit: "pct",
    direction: "higher",
    target: 85,
    targetBasis: "Industry P75, HFMA 2025",
    plausibleRange: [40, 100],
    definition: "Claims accepted and paid on first submission.",
  },
  chair_utilization: {
    id: "chair_utilization",
    label: "Chair Utilization",
    unit: "pct",
    direction: "higher",
    target: 85,
    targetBasis: "Your FY26 target",
    plausibleRange: [10, 100],
    definition: "Scheduled chair hours used vs available chair hours.",
  },
  case_acceptance: {
    id: "case_acceptance",
    label: "Case Acceptance Rate",
    unit: "pct",
    direction: "higher",
    target: 65,
    targetBasis: "Industry P75, ADA 2025",
    plausibleRange: [20, 100],
    definition: "Presented treatment plans accepted by patients.",
  },
  no_show_rate: {
    id: "no_show_rate",
    label: "No-Show / Cancellation Rate",
    unit: "pct",
    direction: "lower",
    target: 6.0,
    targetBasis: "Your FY26 target",
    plausibleRange: [0, 30],
    definition: "Appointments missed or cancelled within 24 hours.",
  },
  revenue_per_visit: {
    id: "revenue_per_visit",
    label: "Revenue per Visit",
    unit: "usd",
    direction: "higher",
    target: 2_400,
    targetBasis: "Industry P75, ADA 2025",
    plausibleRange: [200, 10_000],
    definition: "Net production divided by completed visits.",
  },
  revenue_per_patient: {
    id: "revenue_per_patient",
    label: "Revenue per Patient",
    unit: "usd",
    direction: "higher",
    target: 3_500,
    targetBasis: "Industry P75, ADA 2025",
    plausibleRange: [500, 12_000],
    definition: "Net production per active patient, trailing 12 months.",
  },
  production_per_provider: {
    id: "production_per_provider",
    label: "Production per Provider",
    unit: "usd",
    direction: "higher",
    target: 28_300,
    targetBasis: "Your FY26 target",
    plausibleRange: [5_000, 100_000],
    definition: "Monthly net production per full-time provider.",
  },
  days_unbilled: {
    id: "days_unbilled",
    label: "Days in Unbilled",
    unit: "days",
    direction: "lower",
    target: 6.5,
    targetBasis: "Your FY26 target",
    plausibleRange: [0, 60],
    definition: "Average days from service to claim submission.",
  },
  underpaid: {
    id: "underpaid",
    label: "Underpaid Amount (90d)",
    unit: "usd",
    direction: "lower",
    target: 430_000,
    targetBasis: "Your FY26 target",
    plausibleRange: [0, 5_000_000],
    definition:
      "Payer payments below contracted fee schedule, trailing 90 days.",
  },
  same_day_treatment: {
    id: "same_day_treatment",
    label: "Same-Day Treatment Rate",
    unit: "pct",
    direction: "higher",
    target: 30,
    targetBasis: "Industry P75, ADA 2025",
    plausibleRange: [5, 90],
    definition: "Diagnosed treatment started on the day of diagnosis.",
  },
} as const satisfies Record<string, MetricDef>;

export type MetricId = keyof typeof metricDefs;

export const metricValues: Record<MetricId, MetricValue> = {
  open_ar: {
    current: 11_200_000,
    previous: 10_400_000,
    trend: [9.6, 9.9, 10.0, 10.2, 10.4, 10.7, 11.0, 11.2].map(
      (m) => m * 1_000_000,
    ),
    asOf: AS_OF,
    scope: "15 of 15 facilities",
    source: SOURCE,
  },
  ar_over_90: {
    current: 3_240_000,
    previous: 2_960_000,
    trend: [2.4, 2.5, 2.6, 2.7, 2.96, 3.05, 3.18, 3.24].map(
      (m) => m * 1_000_000,
    ),
    asOf: AS_OF,
    scope: "15 of 15 facilities",
    source: SOURCE,
  },
  cash_collections: {
    current: 7_900_000,
    previous: 7_300_000,
    trend: [6.8, 7.0, 7.1, 7.2, 7.3, 7.5, 7.7, 7.9].map((m) => m * 1_000_000),
    asOf: AS_OF,
    scope: "15 of 15 facilities",
    source: SOURCE,
  },
  total_writeoff: {
    current: 412_000,
    previous: 389_000,
    trend: [355, 348, 362, 371, 389, 395, 404, 412].map((k) => k * 1000),
    asOf: AS_OF,
    scope: "15 of 15 facilities",
    source: SOURCE,
  },
  denial_rate: {
    current: 8.2,
    previous: 8.8,
    trend: [9.6, 9.4, 9.1, 9.0, 8.8, 8.6, 8.4, 8.2],
    asOf: AS_OF,
    scope: "15 of 15 facilities",
    source: SOURCE,
  },
  clean_claim_rate: {
    current: 84.8,
    previous: 84.1,
    trend: [82.9, 83.2, 83.5, 83.8, 84.1, 84.4, 84.6, 84.8],
    asOf: AS_OF,
    scope: "15 of 15 facilities",
    source: SOURCE,
  },
  chair_utilization: {
    current: 60.3,
    previous: 62.0,
    trend: [66.4, 65.8, 64.9, 63.7, 62.0, 61.4, 60.9, 60.3],
    asOf: AS_OF,
    scope: "15 of 15 facilities",
    source: SOURCE,
  },
  case_acceptance: {
    current: 73.0,
    previous: 71.5,
    trend: [68.9, 69.6, 70.2, 70.8, 71.5, 72.1, 72.6, 73.0],
    asOf: AS_OF,
    scope: "15 of 15 facilities",
    source: SOURCE,
  },
  no_show_rate: {
    current: 7.2,
    previous: 6.9,
    trend: [6.2, 6.4, 6.5, 6.7, 6.9, 7.0, 7.1, 7.2],
    asOf: AS_OF,
    scope: "15 of 15 facilities",
    source: SOURCE,
  },
  revenue_per_visit: {
    current: 2_066,
    previous: 2_103,
    trend: [2180, 2166, 2150, 2131, 2103, 2089, 2075, 2066],
    asOf: AS_OF,
    scope: "15 of 15 facilities",
    source: SOURCE,
  },
  revenue_per_patient: {
    current: 2_980,
    previous: 2_940,
    trend: [2850, 2870, 2895, 2915, 2940, 2955, 2970, 2980],
    asOf: AS_OF,
    scope: "15 of 15 facilities",
    source: SOURCE,
  },
  production_per_provider: {
    current: 26_100,
    previous: 25_400,
    trend: [24100, 24400, 24800, 25100, 25400, 25700, 25900, 26100].map(
      (v) => v,
    ),
    asOf: AS_OF,
    scope: "42 providers, 15 facilities",
    source: SOURCE,
  },
  days_unbilled: {
    current: 7.7,
    previous: 9.1,
    trend: [10.8, 10.4, 10.0, 9.6, 9.1, 8.6, 8.1, 7.7],
    asOf: AS_OF,
    scope: "15 of 15 facilities",
    source: SOURCE,
  },
  underpaid: {
    current: 510_000,
    previous: 445_000,
    trend: [388, 402, 415, 430, 445, 468, 490, 510].map((k) => k * 1000),
    asOf: AS_OF,
    scope: "PPO contracts, 15 facilities",
    source: SOURCE,
  },
  same_day_treatment: {
    current: 0.2, // deliberately implausible -> plausibility gate demo
    previous: 24.0,
    trend: [23.1, 23.5, 23.8, 24.0, 24.0, 18.2, 4.1, 0.2],
    asOf: AS_OF,
    scope: "15 of 15 facilities",
    source: SOURCE,
  },
};

/** Board sections (order matters) */
export const KPI_STRIP: MetricId[] = [
  "open_ar",
  "cash_collections",
  "denial_rate",
  "total_writeoff",
  "same_day_treatment",
];

export const SCORECARD: MetricId[] = [
  "revenue_per_patient",
  "chair_utilization",
  "revenue_per_visit",
  "clean_claim_rate",
  "no_show_rate",
  "production_per_provider",
  "case_acceptance",
];

/** Risk strip config: est. impact drives sort within severity */
export const RISKS: {
  metricId: MetricId;
  impactUsd: number;
  impactLabel: string;
  action: string;
}[] = [
  {
    metricId: "ar_over_90",
    impactUsd: 1_240_000,
    impactLabel: "$1.24M over target",
    action: "Triage cohort",
  },
  {
    metricId: "chair_utilization",
    impactUsd: 1_400_000,
    impactLabel: "est. $1.4M/qtr capacity loss",
    action: "Open root-cause",
  },
  {
    metricId: "denial_rate",
    impactUsd: 310_000,
    impactLabel: "est. $310k at risk",
    action: "Escalate top payer",
  },
  {
    metricId: "underpaid",
    impactUsd: 186_000,
    impactLabel: "est. $186k recoverable",
    action: "Recover variance",
  },
  {
    metricId: "no_show_rate",
    impactUsd: 92_000,
    impactLabel: "est. $92k/mo",
    action: "Fill schedule gaps",
  },
];
