import { useEffect, useRef, useState } from "react";
import {
  Bell,
  History,
  House,
  PanelLeftClose,
  Plus,
  Send,
  Square,
  X,
} from "lucide-react";
import { Button, Card, Pill, Sparkline } from "../kinetic-ui";
import { insights } from "../data/insights";
import { metricDefs, metricValues, COVERAGE, type MetricId } from "../data/metrics";
import { favorabilityOf, fmtDelta, fmtValue } from "../lib/semantics";
import { useApp } from "../state/store";
import { ArtifactCard } from "./ArtifactCard";

const STARTERS = [
  "Which facilities drive my A/R over 90 days?",
  "Why did denial rate move last month?",
  "Where am I leaving money vs benchmark?",
  "What is driving the chair utilization decline?",
];

const KEY_CHANGES: MetricId[] = ["cash_collections", "denial_rate", "ar_over_90"];
const ALERT_IDS = ["ins-chair-slide", "ins-underpaid", "ins-mapping"];

function KeyChangeTile({ m }: { m: MetricId }) {
  const def = metricDefs[m];
  const val = metricValues[m];
  const delta = val.current - val.previous;
  const fav = favorabilityOf(def, delta);
  return (
    <Card variant="deep" padded={false} className="flex-1 p-2.5">
      <p className="truncate text-[11px] text-text-muted" title={def.label}>
        {def.label}
      </p>
      <p className="mt-0.5 font-mono text-[15px] font-medium text-text-primary">
        {fmtValue(def.unit, val.current)}
      </p>
      <div className="mt-1 flex items-center justify-between gap-1">
        <span
          className={`font-mono text-[11px] ${fav === "favorable" ? "text-semantic-success-soft" : "text-semantic-error-soft"}`}
        >
          {fmtDelta(def, val.current, val.previous)}
        </span>
        <Sparkline
          data={val.trend}
          favorability={fav}
          width={52}
          height={18}
          label={`${def.label} 8-period trend`}
        />
      </div>
    </Card>
  );
}

export function AnaPanel() {
  const {
    anaMode,
    setAnaMode,
    setAnaOpen,
    threads,
    activeThreadId,
    askAna,
    streaming,
    stopStreaming,
    scope,
    closeDrill,
    drillMetric,
    highlight,
    newChat,
    openThread,
    focusComposerTick,
  } = useApp();
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const thread = threads.find((t) => t.id === activeThreadId);

  useEffect(() => {
    if (focusComposerTick > 0) inputRef.current?.focus();
  }, [focusComposerTick]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [thread?.turns.length, streaming]);

  const submit = () => {
    if (!input.trim()) return;
    askAna(input);
    setInput("");
  };

  return (
    <section
      aria-label="Ana conversation panel"
      className="flex h-full w-[30%] min-w-[320px] flex-col rounded-card border border-lines-card bg-bg-card"
    >
      {/* header */}
      <header className="flex items-center gap-1 border-b border-lines-card px-3 py-2">
        <span
          aria-hidden
          className="grid size-7 place-items-center rounded-control text-[11px] font-semibold text-neutral-white [background:var(--gradient-interactive)]"
        >
          A
        </span>
        <h2 className="ml-1 text-sm font-semibold text-text-primary">Ana</h2>
        <span className="ml-auto flex items-center gap-0.5">
          {anaMode === "chat" && (
            <button
              aria-label="Ana home"
              title="Ana home"
              onClick={() => setAnaMode("home")}
              className="rounded-control p-1.5 text-icon-tertiary hover:bg-state-hover"
            >
              <House size={15} />
            </button>
          )}
          <button
            aria-label="Conversation history"
            title="History"
            onClick={() => setAnaMode(anaMode === "history" ? "home" : "history")}
            className="rounded-control p-1.5 text-icon-tertiary hover:bg-state-hover"
          >
            <History size={15} />
          </button>
          <Button size="sm" variant="primary" onClick={newChat}>
            <Plus size={13} aria-hidden /> New
          </Button>
          <button
            aria-label="Collapse Ana panel"
            title="Collapse (Ana stays one keystroke away: /)"
            onClick={() => setAnaOpen(false)}
            className="rounded-control p-1.5 text-icon-tertiary hover:bg-state-hover"
          >
            <PanelLeftClose size={15} />
          </button>
        </span>
      </header>

      {/* body */}
      <div className="min-h-0 flex-1 overflow-y-auto p-3">
        {anaMode === "history" && (
          <div className="flex flex-col gap-2">
            <p className="text-xs font-medium text-text-muted">RECENT CONVERSATIONS</p>
            {threads.map((t) => (
              <button
                key={t.id}
                onClick={() => openThread(t.id)}
                className="rounded-control border border-lines-hairline bg-bg-surface-subtle p-2.5 text-left hover:border-border-active"
              >
                <p className="text-sm text-text-primary">{t.title}</p>
                <p className="mt-0.5 text-[11px] text-text-muted">
                  {t.createdAt} · {t.turns.length} turns
                </p>
              </button>
            ))}
          </div>
        )}

        {anaMode === "home" && (
          <div className="flex flex-col gap-4">
            <div>
              <h3 className="text-base font-semibold text-text-primary">
                Good morning, Anton
              </h3>
              <p className="mt-0.5 text-xs text-text-muted">{COVERAGE}</p>
            </div>
            <div>
              <p className="mb-1.5 text-[11px] font-medium text-text-muted">
                KEY CHANGES TODAY
              </p>
              <div className="flex gap-2">
                {KEY_CHANGES.map((m) => (
                  <KeyChangeTile key={m} m={m} />
                ))}
              </div>
            </div>
            <div>
              <p className="mb-1.5 text-[11px] font-medium text-text-muted">
                ACTIVE ALERTS
              </p>
              <div className="flex flex-col gap-1.5">
                {ALERT_IDS.map((id) => {
                  const i = insights.find((x) => x.id === id)!;
                  return (
                    <button
                      key={id}
                      onClick={() => highlight(id)}
                      className="flex items-center gap-2 rounded-control border border-lines-hairline bg-bg-surface-subtle p-2 text-left text-xs text-text-secondary hover:border-border-active"
                    >
                      <Bell size={13} className="shrink-0 text-semantic-warning" aria-hidden />
                      <span className="truncate">{i.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <p className="mb-1.5 text-[11px] font-medium text-text-muted">
                START WITH A QUESTION
              </p>
              <div className="flex flex-col gap-1.5">
                {STARTERS.map((q) => (
                  <button
                    key={q}
                    onClick={() => askAna(q)}
                    className="rounded-control bg-overlay-ghost-pill-bg-interactive px-3 py-2 text-left text-xs font-medium text-accent-interactive-soft hover:bg-state-selected-subtle"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {anaMode === "chat" && (
          <div className="flex flex-col gap-3">
            {!thread?.turns.length && (
              <p className="text-xs text-text-muted">
                New conversation. Ask about your data, or pick a starter from Ana home.
              </p>
            )}
            {thread?.turns.map((turn) =>
              turn.role === "user" ? (
                <div
                  key={turn.id}
                  className="ml-8 self-end rounded-card bg-bg-surface-muted px-3 py-2 text-sm text-text-primary"
                >
                  {turn.text}
                </div>
              ) : (
                <div key={turn.id} className="flex flex-col gap-2">
                  {turn.systemChip && (
                    <Pill
                      variant={turn.systemChip.startsWith("Applied") ? "interactive" : "neutral"}
                      className="self-start"
                    >
                      {turn.systemChip}
                    </Pill>
                  )}
                  <div className="whitespace-pre-line text-sm text-text-secondary">
                    {turn.text}
                  </div>
                  {turn.artifactId && (
                    <ArtifactCard artifactId={turn.artifactId} context="chat" />
                  )}
                  {turn.followUps && (
                    <div className="flex flex-wrap gap-1.5">
                      {turn.followUps.map((f) => (
                        <button
                          key={f}
                          onClick={() => askAna(f)}
                          className="rounded-pill bg-state-selected-grey px-2.5 py-[3px] text-xs font-medium text-text-secondary hover:bg-state-selected-subtle hover:text-accent-interactive-soft"
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ),
            )}
            {streaming && (
              <p className="text-xs text-text-muted" role="status">
                Ana is checking 15 facilities...
              </p>
            )}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* composer: global chrome, context chip visible (teardown 1.1) */}
      <footer className="border-t border-lines-card p-2.5">
        <div className="mb-1.5 flex items-center gap-1.5">
          <span className="inline-flex items-center gap-1 rounded-pill bg-overlay-ghost-pill-bg-interactive px-2.5 py-[3px] text-[11px] font-medium text-accent-interactive-soft">
            {scope.label}
            {drillMetric && (
              <button
                aria-label="Clear metric scope"
                onClick={closeDrill}
                className="hover:text-text-primary"
              >
                <X size={11} />
              </button>
            )}
          </span>
          <span className="text-[11px] text-text-decor">press / to focus</span>
        </div>
        <div className="flex items-center gap-1.5">
          <input
            ref={inputRef}
            aria-label="Ask Ana about your data"
            placeholder="Ask about your data..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            className="flex-1 rounded-control border border-border-default bg-bg-surface-subtle px-3 py-2 text-sm text-text-primary placeholder:text-text-placeholder focus:border-border-active focus:outline-none focus:ring-2 focus:ring-state-focus"
          />
          {streaming ? (
            <Button size="md" variant="secondary" onClick={stopStreaming} aria-label="Stop Ana">
              <Square size={13} aria-hidden /> Stop
            </Button>
          ) : (
            <Button size="md" variant="primary" onClick={submit} aria-label="Send">
              <Send size={14} aria-hidden />
            </Button>
          )}
        </div>
      </footer>
    </section>
  );
}

/** Collapsed state: the composer never disappears (teardown L0). */
export function AnaSlimBar() {
  const { focusComposer } = useApp();
  return (
    <button
      onClick={focusComposer}
      aria-label="Open Ana - ask about your data (or press /)"
      title="Ask Ana ( / )"
      className="flex h-full w-12 flex-col items-center gap-3 rounded-card border border-lines-card bg-bg-card py-3 hover:border-border-active"
    >
      <span
        aria-hidden
        className="grid size-7 place-items-center rounded-control text-[11px] font-semibold text-neutral-white [background:var(--gradient-interactive)]"
      >
        A
      </span>
      <span
        aria-hidden
        className="text-[11px] font-medium text-text-muted [writing-mode:vertical-rl]"
      >
        Ask Ana · /
      </span>
    </button>
  );
}
