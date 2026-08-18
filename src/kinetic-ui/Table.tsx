import type { HTMLAttributes, TdHTMLAttributes, ThHTMLAttributes } from "react";

/**
 * Kinetic table. Recipes: section-table.
 * Header bg table/header, zebra rows, mono numerics, hover family per view
 * type (brand-led vs data-led). Proper header semantics for screen readers.
 */
export function Table({
  className = "",
  ...rest
}: HTMLAttributes<HTMLTableElement>) {
  return (
    <div className="overflow-hidden rounded-control border border-lines-card">
      <table className={`w-full border-collapse text-[13px] ${className}`} {...rest} />
    </div>
  );
}

export function THead({ children }: { children: React.ReactNode }) {
  return (
    <thead className="bg-table-header">
      <tr className="border-b border-lines-section">{children}</tr>
    </thead>
  );
}

export function Th({
  numeric,
  className = "",
  ...rest
}: ThHTMLAttributes<HTMLTableCellElement> & { numeric?: boolean }) {
  return (
    <th
      scope="col"
      className={[
        "px-3 py-2.5 text-xs font-medium text-text-muted",
        numeric ? "text-right" : "text-left",
        className,
      ].join(" ")}
      {...rest}
    />
  );
}

export function TRow({
  index,
  hover = "interactive",
  className = "",
  ...rest
}: HTMLAttributes<HTMLTableRowElement> & {
  index: number;
  hover?: "interactive" | "brand" | "none";
}) {
  const hoverCls =
    hover === "interactive"
      ? "hover:bg-overlay-table-row-hover-interactive"
      : hover === "brand"
        ? "hover:bg-overlay-table-row-hover-brand"
        : "";
  return (
    <tr
      className={[
        index % 2 === 0 ? "bg-table-row-even" : "bg-table-row-odd",
        "border-b border-lines-hairline last:border-b-0",
        hoverCls,
        className,
      ].join(" ")}
      {...rest}
    />
  );
}

export function Td({
  numeric,
  className = "",
  ...rest
}: TdHTMLAttributes<HTMLTableCellElement> & { numeric?: boolean }) {
  return (
    <td
      className={[
        "px-3 py-2.5 text-text-secondary",
        numeric ? "text-right font-mono" : "text-left",
        className,
      ].join(" ")}
      {...rest}
    />
  );
}
