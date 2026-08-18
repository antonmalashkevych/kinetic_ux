import {
  Activity,
  Bell,
  CircleHelp,
  ClipboardList,
  History,
  LayoutDashboard,
  PanelLeft,
  Plus,
  Rss,
  ShieldCheck,
  Star,
} from "lucide-react";
import { useApp, type CanvasTab } from "../state/store";

/**
 * Left rail: the Make prototype's nav grouping (per Anton's choice), one
 * navigation system instead of four (teardown 2.1). Collapsed 48px or
 * expanded 240px. Every item acts or explains - no dead promises.
 */

interface Item {
  icon: typeof Activity;
  label: string;
  tab?: CanvasTab;
  explain?: string;
}

const GROUPS: { title: string; items: Item[] }[] = [
  {
    title: "ANALYTICS",
    items: [
      { icon: LayoutDashboard, label: "Command Center", tab: "board" },
      { icon: Rss, label: "Live Insight Feed", tab: "feed" },
    ],
  },
  {
    title: "APPS",
    items: [
      {
        icon: ShieldCheck,
        label: "Denial Resolution Copilot",
        explain: "Denial Resolution Copilot is not part of this prototype build.",
      },
      {
        icon: ClipboardList,
        label: "Patient Access Copilot",
        explain: "Patient Access Copilot is not part of this prototype build.",
      },
    ],
  },
  {
    title: "SAVED",
    items: [
      { icon: Star, label: "Favorites", tab: "saved" },
      { icon: History, label: "Last Opened", tab: "lastOpened" },
      {
        icon: Bell,
        label: "Alerts",
        explain: "Alert management lives in Ana's home panel in this prototype.",
      },
    ],
  },
];

export function LeftRail() {
  const {
    railExpanded,
    toggleRail,
    canvasTab,
    setCanvasTab,
    anaOpen,
    focusComposer,
    newChat,
    setAnaMode,
    setAnaOpen,
    showToast,
  } = useApp();

  const w = railExpanded ? "w-60" : "w-12";

  return (
    <nav
      aria-label="Primary navigation"
      className={`flex h-full ${w} flex-col gap-1 rounded-card border border-lines-card bg-bg-surface-deep py-2 transition-[width]`}
    >
      <div className="flex items-center gap-2 px-2">
        <span
          aria-hidden
          className="grid size-8 shrink-0 place-items-center rounded-control bg-brand-primary text-xs font-semibold text-neutral-white"
        >
          K
        </span>
        {railExpanded && (
          <span className="text-sm font-semibold text-text-primary">Kinetic</span>
        )}
        <button
          aria-label={railExpanded ? "Collapse navigation" : "Expand navigation"}
          onClick={toggleRail}
          className={`rounded-control p-1.5 text-icon-tertiary hover:bg-state-hover ${railExpanded ? "ml-auto" : "hidden"}`}
        >
          <PanelLeft size={15} />
        </button>
      </div>
      {!railExpanded && (
        <button
          aria-label="Expand navigation"
          onClick={toggleRail}
          className="mx-auto rounded-control p-1.5 text-icon-tertiary hover:bg-state-hover"
        >
          <PanelLeft size={15} />
        </button>
      )}

      {/* Ana section, only when the panel is collapsed (Make pattern) */}
      {!anaOpen && (
        <div className={`mt-1 flex flex-col gap-1 ${railExpanded ? "px-2" : "items-center px-1"}`}>
          <button
            onClick={newChat}
            title="New conversation"
            className={`flex items-center gap-2 rounded-control px-2 py-1.5 text-xs font-medium text-neutral-white [background:var(--gradient-brand)] hover:opacity-90 ${railExpanded ? "" : "justify-center"}`}
          >
            <Plus size={14} aria-hidden />
            {railExpanded && "New conversation"}
          </button>
          <button
            onClick={() => {
              setAnaOpen(true);
              setAnaMode("history");
            }}
            title="Conversation history"
            className={`flex items-center gap-2 rounded-control px-2 py-1.5 text-xs text-text-secondary hover:bg-state-hover ${railExpanded ? "" : "justify-center"}`}
          >
            <History size={14} aria-hidden />
            {railExpanded && "History"}
          </button>
        </div>
      )}

      {GROUPS.map((g) => (
        <div key={g.title} className="mt-2">
          {railExpanded && (
            <p className="px-3 pb-1 text-[10px] font-medium tracking-wide text-text-decor">
              {g.title}
            </p>
          )}
          <div className={`flex flex-col gap-0.5 ${railExpanded ? "px-2" : "items-center px-1"}`}>
            {g.items.map((it) => {
              const active = it.tab && canvasTab === it.tab;
              return (
                <button
                  key={it.label}
                  title={it.label}
                  aria-current={active ? "page" : undefined}
                  onClick={() =>
                    it.tab ? setCanvasTab(it.tab) : showToast(it.explain!)
                  }
                  className={[
                    "flex items-center gap-2 rounded-control px-2 py-1.5 text-xs",
                    railExpanded ? "w-full" : "justify-center",
                    active
                      ? "bg-state-selected text-text-primary"
                      : "text-text-secondary hover:bg-state-hover",
                  ].join(" ")}
                >
                  <it.icon size={15} aria-hidden className={active ? "text-accent-interactive-soft" : ""} />
                  {railExpanded && <span className="truncate">{it.label}</span>}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      <div className={`mt-auto flex flex-col gap-0.5 ${railExpanded ? "px-2" : "items-center px-1"}`}>
        <button
          title="Ask Ana ( / )"
          onClick={focusComposer}
          className={`flex items-center gap-2 rounded-control px-2 py-1.5 text-xs text-text-secondary hover:bg-state-hover ${railExpanded ? "" : "justify-center"}`}
        >
          <Activity size={15} aria-hidden />
          {railExpanded && "Ask Ana ( / )"}
        </button>
        <button
          title="Help"
          onClick={() => showToast("Help center is not part of this prototype build.")}
          className={`flex items-center gap-2 rounded-control px-2 py-1.5 text-xs text-text-secondary hover:bg-state-hover ${railExpanded ? "" : "justify-center"}`}
        >
          <CircleHelp size={15} aria-hidden />
          {railExpanded && "Help"}
        </button>
        <div className={`flex items-center gap-2 px-2 py-1.5 ${railExpanded ? "" : "justify-center"}`}>
          <span
            aria-hidden
            className="grid size-6 shrink-0 place-items-center rounded-pill bg-bg-surface-emphasis text-[10px] font-semibold text-text-primary"
          >
            AM
          </span>
          {railExpanded && (
            <span className="truncate text-xs text-text-secondary">Anton M.</span>
          )}
        </div>
      </div>
    </nav>
  );
}
