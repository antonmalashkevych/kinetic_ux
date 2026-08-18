import type { MetricId } from "./metrics";

/**
 * Live insight feed content (Make prototype pattern). Numbers on cards are
 * NOT written here - cards pull from the semantic layer via metricId so the
 * feed can never contradict the board (teardown 3.1).
 */
export type InsightType = "anomaly" | "risk" | "improvement";

export interface Insight {
  id: string;
  type: InsightType;
  title: string;
  metricId: MetricId;
  detectedAt: string;
  why: string;
  suggestedAction: string;
  investigatePrompt: string;
  /** id of an agency-ladder action, if this insight has an executable play */
  agencyActionId?: string;
}

export const insights: Insight[] = [
  {
    id: "ins-denial-spike",
    type: "anomaly",
    title: "Denial concentration at Delta Dental of TX",
    metricId: "denial_rate",
    detectedAt: "Today 06:40",
    why: "One payer now accounts for 22% of all denials, up from 14% in June. Overall denial rate is improving, but this payer is moving against the trend.",
    suggestedAction:
      "Review the 90 most recent CO-97 denials from this payer for a pattern before the next submission batch.",
    investigatePrompt: "Why are Delta Dental of TX denials concentrating?",
  },
  {
    id: "ins-chair-slide",
    type: "risk",
    title: "Chair utilization sliding across 4 Texas clinics",
    metricId: "chair_utilization",
    detectedAt: "Today 06:15",
    why: "Utilization has fallen for 8 consecutive weeks, driven by Austin, Dallas and two San Antonio locations. Provider schedules show unfilled afternoon blocks.",
    suggestedAction:
      "Open root-cause: compare scheduling templates of the 4 declining clinics against the network median.",
    investigatePrompt: "What is driving the chair utilization decline?",
  },
  {
    id: "ins-underpaid",
    type: "risk",
    title: "Underpayment variance on PPO fee schedules",
    metricId: "underpaid",
    detectedAt: "Yesterday 18:02",
    why: "214 claims across 3 PPO payers paid below contracted rates in the last 90 days. Variance is concentrated in crown and implant codes.",
    suggestedAction:
      "Draft a recovery batch: flag and resubmit the 214 underpaid claims with contract citations.",
    investigatePrompt: "Show me the underpaid PPO claims cohort",
    agencyActionId: "recover-variance",
  },
  {
    id: "ins-unbilled-win",
    type: "improvement",
    title: "Days in unbilled down 1.4 after claim-scrub fix",
    metricId: "days_unbilled",
    detectedAt: "Yesterday 09:30",
    why: "The July claim-scrub rule update removed the top rejection cause. Unbilled days have improved 5 weeks in a row.",
    suggestedAction:
      "No action needed. Consider applying the same scrub rules to the ortho claim path.",
    investigatePrompt: "What changed in the unbilled days trend?",
  },
  {
    id: "ins-mapping",
    type: "anomaly",
    title: "Same-day treatment metric reads 0.2% - mapping suspect",
    metricId: "same_day_treatment",
    detectedAt: "Today 05:58",
    why: "The value fell off a cliff in two weeks (24% to 0.2%), which is outside the plausible range for this metric. A procedure-code mapping change on Aug 4 is the likely cause, not a real operational collapse.",
    suggestedAction:
      "Verify the Aug 4 procedure-code mapping in VQ8.Uniti before trusting this metric.",
    investigatePrompt: "Is the same-day treatment drop real or a data issue?",
  },
  {
    id: "ins-case-accept",
    type: "improvement",
    title: "Case acceptance above benchmark for 8 straight weeks",
    metricId: "case_acceptance",
    detectedAt: "Mon 08:12",
    why: "Acceptance is 8 points above the ADA P75 benchmark and still climbing since the treatment-plan presentation training in June.",
    suggestedAction:
      "Capture the winning script from the top 3 clinics and circulate to the network.",
    investigatePrompt: "Which clinics drive the case acceptance gains?",
  },
];
