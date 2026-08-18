import type { MetricId } from "./metrics";
import { AS_OF, SOURCE } from "./metrics";

/**
 * The one artifact model (ARCHITECTURE.md section 2): every answer is a
 * first-class object with identity, provenance and lineage in BOTH
 * directions (thread <-> board).
 */
export type ArtifactView = "bar" | "table" | "line" | "kpi";

export interface Artifact {
  id: string;
  title: string;
  definition: string;
  question: string;
  threadId: string;
  metricId: MetricId;
  view: ArtifactView;
  /** derived from data shape; anything else is not offered (teardown 4.1) */
  validViews: { view: ArtifactView; disabledReason?: string }[];
  provenance: {
    asOf: string;
    source: string;
    scope: string;
    query: string;
    assumptions: string[];
  };
  pinnedTo: string[]; // board ids
}

export interface Turn {
  id: string;
  role: "user" | "ana";
  text: string;
  artifactId?: string;
  systemChip?: string; // "Applied · Artifact created" | "Info only"
  followUps?: string[];
}

export interface Thread {
  id: string;
  title: string;
  createdAt: string;
  turns: Turn[];
}

/** Categorical ranking of 15 facilities: bar + table valid; line/area are not. */
const CATEGORICAL_VIEWS: Artifact["validViews"] = [
  { view: "bar" },
  { view: "table" },
  {
    view: "line",
    disabledReason:
      "15 facilities are categories, not a time series. Line and area imply continuity that does not exist here.",
  },
];

export const seedArtifact: Artifact = {
  id: "art-ar90-fac",
  title: "A/R > 90 Days by Facility (Top 15)",
  definition:
    "Outstanding receivables aged more than 90 days from service date, grouped by facility.",
  question: "Which facilities drive my A/R over 90 days?",
  threadId: "t-ar90",
  metricId: "ar_over_90",
  view: "bar",
  validViews: CATEGORICAL_VIEWS,
  provenance: {
    asOf: AS_OF,
    source: SOURCE,
    scope: "15 of 15 facilities",
    query:
      "SELECT facility, SUM(balance) FROM ar_open WHERE aged_days > 90 GROUP BY facility ORDER BY 2 DESC",
    assumptions: [
      "Aged by service date (not posting date)",
      "Excludes credits and unapplied cash",
    ],
  },
  pinnedTo: ["board-dso"],
};

export const seedThreads: Thread[] = [
  {
    id: "t-ar90",
    title: "A/R > 90 days by facility",
    createdAt: "Today 07:41",
    turns: [
      {
        id: "t1-u1",
        role: "user",
        text: "Which facilities drive my A/R over 90 days?",
      },
      {
        id: "t1-a1",
        role: "ana",
        text: "Three facilities hold 46% of aged A/R. Austin alone carries $612k, which is 19% of the total. Here is the full ranking:",
        artifactId: "art-ar90-fac",
        systemChip: "Applied · Artifact created",
        followUps: [
          "Why is Austin so high?",
          "Compare to last quarter",
          "Which payers drive the Austin balance?",
        ],
      },
    ],
  },
  {
    id: "t-denials",
    title: "Denial rate movement",
    createdAt: "Yesterday 16:20",
    turns: [
      {
        id: "t2-u1",
        role: "user",
        text: "Why did denial rate move last month?",
      },
      {
        id: "t2-a1",
        role: "ana",
        text: "Denial rate improved 0.6 pt (8.8% to 8.2%). The claim-scrub rule update on Jul 12 removed the top rejection cause. One offsetting factor: Delta Dental of TX denials are concentrating and now make up 22% of all denials.",
        systemChip: "Info only · No artifact changes",
        followUps: [
          "Show Delta Dental of TX denials",
          "What is the denial dollar impact?",
        ],
      },
    ],
  },
];
