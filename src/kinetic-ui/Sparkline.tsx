/**
 * Legible micro-chart (teardown 4.5): consistent scale, endpoint dot,
 * favorability-colored stroke (NOT always red), accessible label.
 * Color = favorability of the trend, from the semantic layer.
 */
import type { Favorability } from "../lib/semantics";

export function Sparkline({
  data,
  favorability,
  width = 96,
  height = 28,
  label,
}: {
  data: number[];
  favorability: Favorability;
  width?: number;
  height?: number;
  label: string; // accessible summary, e.g. "8 week trend, worsening"
}) {
  if (data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  const pad = 3;
  const pts = data.map((v, i) => {
    const x = pad + (i / (data.length - 1)) * (width - pad * 2);
    const y = pad + (1 - (v - min) / span) * (height - pad * 2);
    return [x, y] as const;
  });
  const d = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const stroke =
    favorability === "favorable"
      ? "var(--color-semantic-success)"
      : favorability === "unfavorable"
        ? "var(--color-semantic-error)"
        : "var(--color-text-muted)";
  const [ex, ey] = pts[pts.length - 1];
  return (
    <svg
      width={width}
      height={height}
      role="img"
      aria-label={label}
      className="shrink-0"
    >
      <path d={d} fill="none" stroke={stroke} strokeWidth={1.5} />
      <circle cx={ex} cy={ey} r={2.5} fill={stroke} />
    </svg>
  );
}
