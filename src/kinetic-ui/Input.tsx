import type { InputHTMLAttributes } from "react";

/**
 * Kinetic input. Recipes: section-inputs-controls.
 * bg/surface-subtle + border/default; focus = border/active + state/focus
 * ring (indigo owns focus per kit rule).
 */
export function Input({
  className = "",
  invalid,
  ...rest
}: InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }) {
  return (
    <input
      className={[
        "rounded-control border bg-bg-surface-subtle px-3 py-2 text-sm text-text-primary",
        "placeholder:text-text-placeholder",
        "focus:outline-none focus:border-border-active focus:ring-2 focus:ring-state-focus",
        invalid ? "border-semantic-error" : "border-border-default",
        className,
      ].join(" ")}
      {...rest}
    />
  );
}
