import {
  CircleCheck,
  CircleMinus,
  TriangleAlert,
  OctagonAlert,
} from "lucide-react";
import type { Status } from "../lib/semantics";

/**
 * THE one status vocabulary (teardown 4.3/L8-15): on-target | near | gap | critical.
 * Never color-only: every status carries an icon + text (teardown L7.2).
 * critical is visually distinct beyond hue (border) per teardown 4.2.
 */
const config: Record<
  Status,
  { label: string; cls: string; Icon: typeof CircleCheck }
> = {
  "on-target": {
    label: "On target",
    cls: "bg-state-hover text-semantic-success-soft",
    Icon: CircleCheck,
  },
  near: {
    label: "Near",
    cls: "bg-state-highlight text-semantic-warning-soft",
    Icon: CircleMinus,
  },
  gap: {
    label: "Gap",
    cls: "bg-state-hover text-semantic-error-soft",
    Icon: TriangleAlert,
  },
  critical: {
    label: "Critical",
    cls: "bg-state-hover text-semantic-error-soft border border-semantic-error",
    Icon: OctagonAlert,
  },
};

export function StatusBadge({ status }: { status: Status }) {
  const { label, cls, Icon } = config[status];
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-pill px-2.5 py-[3px] text-xs font-medium whitespace-nowrap ${cls}`}
    >
      <Icon size={12} aria-hidden />
      {label}
    </span>
  );
}
