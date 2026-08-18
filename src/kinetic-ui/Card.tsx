import type { HTMLAttributes } from "react";

/**
 * Kinetic card. Recipes: section-cards-gradients.
 * radius 12, p-16; default = bg/card + lines/card; floating = popovers;
 * elevated = gradient/surface-elevation for prioritized cards.
 * Gradient cards (brand/interactive) are for hero moments only.
 */
export type CardVariant = "default" | "floating" | "elevated" | "deep";

const styles: Record<CardVariant, string> = {
  default: "bg-bg-card border border-lines-card",
  floating: "bg-bg-floating border border-lines-card",
  elevated:
    "[background:var(--gradient-surface-elevation)] border border-lines-card",
  deep: "bg-bg-surface-deep border border-lines-card",
};

interface Props extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  padded?: boolean;
}

export function Card({
  variant = "default",
  padded = true,
  className = "",
  ...rest
}: Props) {
  return (
    <div
      className={[
        "rounded-card",
        padded ? "p-4" : "",
        styles[variant],
        className,
      ].join(" ")}
      {...rest}
    />
  );
}
