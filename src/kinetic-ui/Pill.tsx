import type { HTMLAttributes } from "react";

/**
 * Kinetic pill/badge. Recipes: section-pills-badges.
 * radius 999, px-10 py-3, sans Medium 12.
 * Semantic pills carry STATUS only; category solids carry series identity only.
 */
export type PillVariant =
  | "neutral"
  | "brand"
  | "interactive"
  | "success"
  | "warning"
  | "error"
  | "category-a"
  | "category-b"
  | "category-c";

const styles: Record<PillVariant, string> = {
  neutral: "bg-state-selected-grey text-text-secondary",
  brand: "bg-overlay-ghost-pill-bg-brand text-brand-primary",
  interactive:
    "bg-overlay-ghost-pill-bg-interactive text-accent-interactive-soft",
  success: "bg-state-hover text-semantic-success-soft",
  warning: "bg-state-highlight text-semantic-warning-soft",
  error: "bg-state-hover text-semantic-error-soft",
  "category-a": "bg-category-a-solid text-neutral-white",
  "category-b": "bg-category-b-solid text-neutral-white",
  "category-c": "bg-category-c-solid text-neutral-white",
};

interface Props extends HTMLAttributes<HTMLSpanElement> {
  variant?: PillVariant;
}

export function Pill({ variant = "neutral", className = "", ...rest }: Props) {
  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 rounded-pill px-2.5 py-[3px] text-xs font-medium whitespace-nowrap",
        styles[variant],
        className,
      ].join(" ")}
      {...rest}
    />
  );
}
