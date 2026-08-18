import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Download,
  MessageSquareText,
  Pin,
  PinOff,
  Search,
  ThumbsDown,
  ThumbsUp,
  ZoomIn,
} from "lucide-react";
import { Button, Card, Input, SegmentedControl, Table, THead, Th, TRow, Td } from "../kinetic-ui";
import { facilities } from "../data/facilities";
import { fmtValue } from "../lib/semantics";
import { useApp } from "../state/store";
import type { ArtifactView } from "../data/threads";

/**
 * THE canonical artifact (ARCHITECTURE.md section 2). Same component in chat,
 * on the board, in the drill panel. Identity, provenance, lineage, actions.
 */
export function ArtifactCard({
  artifactId,
  context,
}: {
  artifactId: string;
  context: "chat" | "board";
}) {
  const {
    artifacts,
    setArtifactView,
    togglePin,
    openConversationFor,
    openDrill,
    askAboutMetric,
    showToast,
  } = useApp();
  const a = artifacts[artifactId];
  const [search, setSearch] = useState("");
  const [provOpen, setProvOpen] = useState(false);
  const [feedback, setFeedback] = useState<"none" | "asking" | "done">("none");
  if (!a) return null;

  const pinned = a.pinnedTo.includes("board-dso");
  const rows = facilities.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase()),
  );
  const max = Math.max(...facilities.map((f) => f.arOver90));

  return (
    <Card variant={context === "chat" ? "elevated" : "default"} className="flex flex-col gap-3">
      {/* identity */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-[15px] font-semibold text-text-primary">
            {a.title}
          </h3>
          <p className="mt-0.5 text-xs text-text-muted">{a.definition}</p>
        </div>
        <SegmentedControl
          ariaLabel="Visualization type"
          value={a.view}
          onChange={(v) => setArtifactView(a.id, v as ArtifactView)}
          items={a.validViews.map((v) => ({
            id: v.view,
            label: v.view === "bar" ? "Bars" : v.view === "table" ? "Table" : "Line",
            disabledReason: v.disabledReason,
          }))}
        />
      </div>

      {/* view */}
      {a.view === "table" && (
        <>
          <div className="relative">
            <Search
              size={14}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-icon-tertiary"
              aria-hidden
            />
            <Input
              aria-label="Search facilities"
              placeholder="Search facilities..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8"
            />
          </div>
          <Table>
            <THead>
              <Th>Facility</Th>
              <Th numeric>A/R &gt; 90d ($)</Th>
              <Th numeric>Claims</Th>
            </THead>
            <tbody>
              {rows.map((f, i) => (
                <TRow key={f.name} index={i} hover="interactive">
                  <Td>{f.name}</Td>
                  <Td numeric>{f.arOver90.toLocaleString("en-US")}</Td>
                  <Td numeric>{f.claims}</Td>
                </TRow>
              ))}
            </tbody>
          </Table>
          <p className="text-xs text-text-muted">
            {rows.length} of {facilities.length} records
          </p>
        </>
      )}

      {a.view === "bar" && (
        <div className="flex flex-col gap-1" role="img" aria-label={`${a.title}: ranked horizontal bars, Austin highest at $612k`}>
          {facilities.map((f) => (
            <div key={f.name} className="group flex items-center gap-2">
              <span
                title={f.name}
                className="w-44 shrink-0 truncate text-right text-xs text-text-secondary"
              >
                {f.name}
              </span>
              <div className="relative h-4 flex-1 rounded-xs bg-state-hover">
                <div
                  className="h-4 rounded-xs bg-category-a-chart transition-[width]"
                  style={{ width: `${(f.arOver90 / max) * 100}%` }}
                />
              </div>
              <span className="w-14 shrink-0 font-mono text-xs text-text-secondary">
                {fmtValue("usd", f.arOver90)}
              </span>
            </div>
          ))}
          <div className="mt-1 flex justify-between pl-46 text-[11px] text-text-muted">
            <span>$0</span>
            <span>$300k</span>
            <span>$600k</span>
          </div>
        </div>
      )}

      {/* action bar: identical in every container */}
      <div className="flex flex-wrap items-center gap-1.5 border-t border-lines-hairline pt-2.5">
        <Button size="sm" variant="ghost" onClick={() => askAboutMetric(a.metricId)}>
          <MessageSquareText size={13} aria-hidden /> Ask about this
        </Button>
        <Button size="sm" variant="ghost" onClick={() => openDrill(a.metricId)}>
          <ZoomIn size={13} aria-hidden /> Drill
        </Button>
        <Button size="sm" variant="ghost" onClick={() => togglePin(a.id)}>
          {pinned ? <PinOff size={13} aria-hidden /> : <Pin size={13} aria-hidden />}
          {pinned ? "Unpin" : "Pin"}
        </Button>
        {context === "board" && (
          <Button size="sm" variant="ghost" onClick={() => openConversationFor(a.id)}>
            <MessageSquareText size={13} aria-hidden /> Open conversation
          </Button>
        )}
        <Button
          size="sm"
          variant="ghost"
          onClick={() => showToast("Export queued: CSV with provenance sheet attached.")}
        >
          <Download size={13} aria-hidden /> Export
        </Button>
        <span className="ml-auto flex items-center gap-1">
          <button
            aria-label="Good answer"
            onClick={() => {
              setFeedback("done");
              showToast("Thanks. Marked as a good answer.");
            }}
            className="rounded-control p-1.5 text-icon-tertiary hover:bg-state-hover"
          >
            <ThumbsUp size={14} />
          </button>
          <button
            aria-label="Bad answer"
            onClick={() => setFeedback("asking")}
            className="rounded-control p-1.5 text-icon-tertiary hover:bg-state-hover"
          >
            <ThumbsDown size={14} />
          </button>
        </span>
      </div>

      {/* feedback loop closes visibly (teardown 5.6) */}
      {feedback === "asking" && (
        <div className="flex flex-wrap items-center gap-1.5 rounded-control bg-bg-surface-subtle p-2 text-xs">
          <span className="text-text-secondary">What was wrong?</span>
          {["The number", "The definition", "The chart", "My question was misread"].map(
            (opt) => (
              <button
                key={opt}
                onClick={() => {
                  setFeedback("done");
                  showToast(`Logged against the ${a.title} definition. Future answers will account for it.`);
                }}
                className="rounded-pill bg-state-selected-grey px-2.5 py-[3px] font-medium text-text-secondary hover:bg-state-selected-subtle hover:text-accent-interactive-soft"
              >
                {opt}
              </button>
            ),
          )}
        </div>
      )}

      {/* provenance footer, collapsed to one line (teardown 1.4) */}
      <button
        onClick={() => setProvOpen((v) => !v)}
        aria-expanded={provOpen}
        className="flex items-center gap-1 text-left text-[11px] text-text-muted hover:text-text-secondary"
      >
        {provOpen ? <ChevronDown size={12} aria-hidden /> : <ChevronRight size={12} aria-hidden />}
        As of {a.provenance.asOf} · {a.provenance.source} · {a.provenance.scope} · Query
      </button>
      {provOpen && (
        <div className="rounded-control bg-bg-surface-deep p-3 text-xs">
          <code className="block font-mono text-text-tertiary">
            {a.provenance.query}
          </code>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {a.provenance.assumptions.map((as) => (
              <button
                key={as}
                onClick={() => showToast("Assumption editing is not wired in this prototype - but this is where you would change it.")}
                className="rounded-pill bg-overlay-ghost-pill-bg-interactive px-2.5 py-[3px] font-medium text-accent-interactive-soft"
              >
                {as} ▾
              </button>
            ))}
          </div>
          <p className="mt-2 text-text-muted">
            Produced by: “{a.question}”
          </p>
        </div>
      )}
    </Card>
  );
}
