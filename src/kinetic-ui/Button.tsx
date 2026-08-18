import type { ButtonHTMLAttributes } from "react";

/**
 * Kinetic button. Recipes: Atomic Library section-buttons.
 * radius 8, px-16 py-8, sans Medium 14, one primary per view.
 */
export type ButtonVariant =
  | "primary" // brand/primary bg - ONE per view
  | "hero" // gradient/brand - hero moments only
  | "secondary" // bg/surface-muted + border/default
  | "ghost" // transparent, state/hover wash
  | "danger"; // semantic/error - destructive only

const styles: Record<ButtonVariant, string> = {
  primary: "bg-brand-primary text-neutral-white hover:opacity-90",
  hero: "text-neutral-white [background:var(--gradient-brand)] hover:opacity-90",
  secondary:
    "bg-bg-surface-muted text-text-secondary border border-border-default hover:bg-bg-surface-emphasis",
  ghost: "bg-transparent text-text-secondary hover:bg-state-hover",
  danger: "bg-semantic-error text-neutral-white hover:opacity-90",
};

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: "md" | "sm";
}

export function Button({
  variant = "secondary",
  size = "md",
  className = "",
  disabled,
  ...rest
}: Props) {
  return (
    <button
      disabled={disabled}
      className={[
        "inline-flex items-center gap-2 rounded-control font-medium transition-colors",
        size === "md" ? "px-4 py-2 text-sm" : "px-3 py-1.5 text-xs",
        disabled
          ? "bg-state-disabled text-text-disabled cursor-not-allowed"
          : styles[variant],
        className,
      ].join(" ")}
      {...rest}
    />
  );
}
