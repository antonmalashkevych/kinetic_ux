/**
 * Segmented control built from kit control tokens (control/segment,
 * control/segment-hover); selection state uses surface tokens, selection
 * accent stays indigo per kit rule (indigo owns selection).
 */
export function SegmentedControl<T extends string>({
  items,
  value,
  onChange,
  ariaLabel,
}: {
  items: { id: T; label: string; disabledReason?: string }[];
  value: T;
  onChange: (id: T) => void;
  ariaLabel: string;
}) {
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className="inline-flex items-center gap-0.5 rounded-control bg-control-segment p-0.5 border border-lines-hairline"
    >
      {items.map((it) => {
        const is = it.id === value;
        const disabled = !!it.disabledReason;
        return (
          <button
            key={it.id}
            role="radio"
            aria-checked={is}
            disabled={disabled}
            title={it.disabledReason}
            onClick={() => onChange(it.id)}
            className={[
              "rounded-[6px] px-2.5 py-1 text-xs font-medium transition-colors",
              disabled
                ? "text-text-disabled cursor-not-allowed"
                : is
                  ? "bg-bg-surface-muted text-text-primary border border-border-active"
                  : "text-text-muted hover:bg-control-segment-hover",
            ].join(" ")}
          >
            {it.label}
          </button>
        );
      })}
    </div>
  );
}
