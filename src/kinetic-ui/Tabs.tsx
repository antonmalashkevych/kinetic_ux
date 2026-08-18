/**
 * Kinetic tabs. Recipes: section-tabs-navigation.
 * Active: context/tab-active text + 2px brand/primary underline (brand owns
 * the active tab per kit rule). Inactive: context/tab-inactive with a
 * transparent height-stable underline. Bar bottom line: lines/card.
 */
export interface TabItem<T extends string = string> {
  id: T;
  label: string;
  count?: number;
}

export function Tabs<T extends string>({
  items,
  active,
  onChange,
}: {
  items: TabItem<T>[];
  active: T;
  onChange: (id: T) => void;
}) {
  return (
    <div
      role="tablist"
      className="flex items-end gap-1 border-b border-lines-card"
    >
      {items.map((t) => {
        const is = t.id === active;
        return (
          <button
            key={t.id}
            role="tab"
            aria-selected={is}
            onClick={() => onChange(t.id)}
            className={[
              "px-3 pt-2 pb-0 text-sm font-medium rounded-t-[6px] transition-colors",
              is
                ? "text-context-tab-active"
                : "text-context-tab-inactive hover:bg-state-hover",
            ].join(" ")}
          >
            <span className="inline-flex items-center gap-1.5 pb-1.5">
              {t.label}
              {t.count !== undefined && (
                <span className="rounded-pill bg-state-selected-grey px-1.5 text-[11px] font-mono text-text-muted">
                  {t.count}
                </span>
              )}
            </span>
            <span
              aria-hidden
              className={`block h-[2px] w-full ${is ? "bg-brand-primary" : "bg-transparent"}`}
            />
          </button>
        );
      })}
    </div>
  );
}
