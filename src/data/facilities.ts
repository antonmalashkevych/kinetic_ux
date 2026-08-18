/**
 * A/R > 90 days by facility. Realistic long-tail distribution (teardown 3.5),
 * sums exactly to metricValues.ar_over_90.current ($3,240,000).
 */
export interface FacilityRow {
  name: string;
  arOver90: number;
  claims: number;
}

export const facilities: FacilityRow[] = [
  { name: "Bright Dental - Austin", arOver90: 612_000, claims: 78 },
  { name: "SmileCare - Phoenix", arOver90: 489_000, claims: 64 },
  { name: "CareOne Dental - Tampa", arOver90: 402_000, claims: 55 },
  { name: "Lakeview Dental - Chicago", arOver90: 318_000, claims: 41 },
  { name: "Summit Dental - Denver", arOver90: 264_000, claims: 37 },
  { name: "Harbor Dental - Seattle", arOver90: 221_000, claims: 29 },
  { name: "Magnolia Dental - Atlanta", arOver90: 187_000, claims: 26 },
  { name: "Redwood Dental - Sacramento", arOver90: 158_000, claims: 22 },
  { name: "Bluebonnet Dental - Dallas", arOver90: 141_000, claims: 19 },
  { name: "Coastal Dental - San Diego", arOver90: 122_000, claims: 17 },
  { name: "Prairie Dental - Omaha", arOver90: 104_000, claims: 14 },
  { name: "Gateway Dental - St. Louis", arOver90: 89_000, claims: 12 },
  { name: "Northside Dental - Columbus", arOver90: 62_000, claims: 9 },
  { name: "Riverbend Dental - Nashville", arOver90: 41_000, claims: 6 },
  { name: "Old Town Dental - Alexandria", arOver90: 30_000, claims: 3 },
];

export const facilitiesTotal = facilities.reduce((s, f) => s + f.arOver90, 0);
