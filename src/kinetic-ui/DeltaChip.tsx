import { ArrowDown, ArrowUp, Minus } from "lucide-react";
import type { Favorability } from "../lib/semantics";

/**
 * Separates the two signals the server build conflated (teardown 4.3):
 * ARROW = direction of change. COLOR = favorability via directionOfGoodness.
 * Includes text for screen readers so status is never color-only.
 */
export function DeltaChip({
  delta,
  favorability,
  label,
  period,
}: {
  delta: number; // signed change (already formatted-ready)
  favorability: Favorability;
  label: string; // e.g. "+9.5%" or "-0.6 pt"
  period?: string; // e.g. "vs Jul"
}) {
  const color =
    favorability === "favorable"
      ? "text-semantic-success-soft"
      : favorability === "unfavorable"
        ? "text-semantic-error-soft"
        : "text-text-muted";
  const Arrow = delta > 0 ? ArrowUp : delta < 0 ? ArrowDown : Minus;
  const srWord =
    favorability === "favorable"
      ? "improved"
      : favorability === "unfavorable"
        ? "worsened"
        : "unchanged";
  return (
    <span
      className={`inline-flex items-center gap-0.5 text-xs font-medium font-mono ${color}`}
    >
      <Arrow size={12} aria-hidden />
      {label}
      {period && (
        <span className="ml-0.5 font-sans font-normal text-text-muted">
          {period}
        </span>
      )}
      <span className="sr-only">({srWord})</span>
    </span>
  );
}
