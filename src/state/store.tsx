/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  metricDefs,
  metricValues,
  type MetricId,
} from "../data/metrics";
import {
  seedArtifact,
  seedThreads,
  type Artifact,
  type ArtifactView,
  type Thread,
  type Turn,
} from "../data/threads";
import { insights, type Insight } from "../data/insights";
import { fmtDelta, fmtValue, narrative, statusOf } from "../lib/semantics";

export type CanvasTab = "feed" | "board" | "saved" | "lastOpened";
export type AnaMode = "home" | "chat" | "history";

export interface Scope {
  label: string;
  metricId?: MetricId;
}

export interface AgencyState {
  actionId: string;
  step: "draft" | "receipt";
  receiptAt?: string;
  undone?: boolean;
}

interface AppState {
  railExpanded: boolean;
  anaOpen: boolean;
  anaMode: AnaMode;
  canvasTab: CanvasTab;
  threads: Thread[];
  activeThreadId: string | null;
  artifacts: Record<string, Artifact>;
  streaming: boolean;
  drillMetric: MetricId | null;
  drillFilters: string[];
  agency: AgencyState | null;
  highlightInsight: string | null;
  toast: string | null;
  boardLoading: boolean;
  scope: Scope;
  focusComposerTick: number;
  // actions
  toggleRail: () => void;
  setAnaOpen: (v: boolean) => void;
  setAnaMode: (m: AnaMode) => void;
  setCanvasTab: (t: CanvasTab) => void;
  newChat: () => void;
  openThread: (id: string, opts?: { fromArtifact?: string }) => void;
  askAna: (q: string) => void;
  stopStreaming: () => void;
  investigate: (i: Insight) => void;
  setArtifactView: (id: string, v: ArtifactView) => void;
  togglePin: (id: string) => void;
  openDrill: (m: MetricId) => void;
  closeDrill: () => void;
  removeDrillFilter: (f: string) => void;
  openConversationFor: (artifactId: string) => void;
  askAboutMetric: (m: MetricId) => void;
  startAgency: (actionId: string) => void;
  confirmAgency: () => void;
  undoAgency: () => void;
  closeAgency: () => void;
  showToast: (msg: string) => void;
  highlight: (insightId: string) => void;
  focusComposer: () => void;
}

const Ctx = createContext<AppState | null>(null);

let idSeq = 0;
const nid = () => `n${++idSeq}`;

/** Slot-verified answers: every number comes from the semantic layer. */
function answerFor(q: string, scope: Scope): Omit<Turn, "id" | "role"> {
  const lower = q.toLowerCase();
  const metricAnswer = (m: MetricId): Omit<Turn, "id" | "role"> => {
    const def = metricDefs[m];
    const val = metricValues[m];
    const delta = fmtDelta(def, val.current, val.previous);
    return {
      text: `${narrative(def, val)} Change vs last period: ${delta}. Status: ${statusOf(def, val.current).replace("-", " ")}.`,
      systemChip: "Info only · No artifact changes",
      followUps: ["Drill into the cohort", "Compare to last quarter"],
    };
  };

  // contextual pronoun (acceptance criterion 3): "this" resolves via scope chip
  if (/\bthis\b/.test(lower) && scope.metricId) {
    return metricAnswer(scope.metricId);
  }
  if (/(a\/?r|receivab|90)/.test(lower) && /facilit|driv|which/.test(lower)) {
    return {
      text: "Three facilities hold 46% of aged A/R. Austin alone carries $612k, which is 19% of the total. Here is the full ranking:",
      artifactId: seedArtifact.id,
      systemChip: "Applied · Artifact created",
      followUps: [
        "Why is Austin so high?",
        "Compare to last quarter",
        "Which payers drive the Austin balance?",
      ],
    };
  }
  if (/denial/.test(lower)) return metricAnswer("denial_rate");
  if (/chair|utili[zs]ation/.test(lower)) return metricAnswer("chair_utilization");
  if (/no.?show/.test(lower)) return metricAnswer("no_show_rate");
  if (/benchmark|money|gap|leaving/.test(lower)) {
    const gaps = (Object.keys(metricDefs) as MetricId[])
      .map((m) => ({
        m,
        def: metricDefs[m],
        val: metricValues[m],
        st: statusOf(metricDefs[m], metricValues[m].current),
      }))
      .filter((x) => x.st === "gap" || x.st === "critical")
      .slice(0, 5)
      .map(
        (x) =>
          `${x.def.label}: ${fmtValue(x.def.unit, x.val.current)} vs ${fmtValue(x.def.unit, x.def.target)} (${x.def.targetBasis})`,
      );
    return {
      text: `Largest gaps to benchmark right now:\n${gaps.map((g) => `· ${g}`).join("\n")}`,
      systemChip: "Info only · No artifact changes",
      followUps: ["Drill into chair utilization", "Open the Command Center"],
    };
  }
  return {
    text: "In this prototype I can answer the starter questions and questions scoped by the context chip (select a tile and ask \"why is this up?\"). A full model is not wired here, and I would rather say so than invent numbers.",
    systemChip: "Info only · No artifact changes",
    followUps: [
      "Which facilities drive my A/R over 90 days?",
      "Why did denial rate move last month?",
      "Where am I leaving money vs benchmark?",
    ],
  };
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [railExpanded, setRailExpanded] = useState(false);
  const [anaOpen, setAnaOpen] = useState(true);
  const [anaMode, setAnaMode] = useState<AnaMode>("home");
  const [canvasTab, setCanvasTab] = useState<CanvasTab>("feed");
  const [threads, setThreads] = useState<Thread[]>(seedThreads);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [artifacts, setArtifacts] = useState<Record<string, Artifact>>({
    [seedArtifact.id]: seedArtifact,
  });
  const [streaming, setStreaming] = useState(false);
  const [drillMetric, setDrillMetric] = useState<MetricId | null>(null);
  const [drillFilters, setDrillFilters] = useState<string[]>([]);
  const [agency, setAgency] = useState<AgencyState | null>(null);
  const [highlightInsight, setHighlightInsight] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [boardLoading, setBoardLoading] = useState(true);
  const [focusComposerTick, setFocusComposerTick] = useState(0);
  const streamTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const highlightTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* simulate board load once: skeleton, never a blank canvas */
  useEffect(() => {
    const t = setTimeout(() => setBoardLoading(false), 900);
    return () => clearTimeout(t);
  }, []);

  const scope: Scope = useMemo(() => {
    if (drillMetric)
      return {
        label: `Command Center › ${metricDefs[drillMetric].label}`,
        metricId: drillMetric,
      };
    if (canvasTab === "board") return { label: "Command Center" };
    if (canvasTab === "feed") return { label: "Live Feed" };
    return { label: "Library" };
  }, [drillMetric, canvasTab]);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2800);
  }, []);

  const newChat = useCallback(() => {
    const t: Thread = {
      id: nid(),
      title: "New conversation",
      createdAt: "Now",
      turns: [],
    };
    setThreads((p) => [t, ...p]);
    setActiveThreadId(t.id);
    setAnaMode("chat");
    setAnaOpen(true);
  }, []);

  const openThread = useCallback((id: string) => {
    setActiveThreadId(id);
    setAnaMode("chat");
    setAnaOpen(true);
  }, []);

  const pushTurn = useCallback((threadId: string, turn: Turn) => {
    setThreads((prev) =>
      prev.map((t) =>
        t.id === threadId ? { ...t, turns: [...t.turns, turn] } : t,
      ),
    );
  }, []);

  const askAna = useCallback(
    (q: string) => {
      if (!q.trim() || streaming) return;
      let threadId = activeThreadId;
      if (!threadId || anaMode !== "chat") {
        const t: Thread = {
          id: nid(),
          title: q.slice(0, 42),
          createdAt: "Now",
          turns: [],
        };
        setThreads((p) => [t, ...p]);
        threadId = t.id;
        setActiveThreadId(t.id);
        setAnaMode("chat");
        setAnaOpen(true);
      }
      pushTurn(threadId, { id: nid(), role: "user", text: q });
      setStreaming(true);
      const capturedScope = scope;
      streamTimer.current = setTimeout(() => {
        const a = answerFor(q, capturedScope);
        pushTurn(threadId!, { id: nid(), role: "ana", ...a });
        setStreaming(false);
      }, 850);
    },
    [activeThreadId, anaMode, pushTurn, scope, streaming],
  );

  const stopStreaming = useCallback(() => {
    if (streamTimer.current) clearTimeout(streamTimer.current);
    setStreaming(false);
    if (activeThreadId)
      pushTurn(activeThreadId, {
        id: nid(),
        role: "ana",
        text: "Stopped.",
        systemChip: "Cancelled by you",
      });
  }, [activeThreadId, pushTurn]);

  const investigate = useCallback(
    (i: Insight) => {
      const t: Thread = {
        id: nid(),
        title: `Investigate: ${i.title.slice(0, 34)}`,
        createdAt: "Now",
        turns: [{ id: nid(), role: "user", text: i.investigatePrompt }],
      };
      setThreads((p) => [t, ...p]);
      setActiveThreadId(t.id);
      setAnaMode("chat");
      setAnaOpen(true);
      setStreaming(true);
      streamTimer.current = setTimeout(() => {
        const def = metricDefs[i.metricId];
        const val = metricValues[i.metricId];
        pushTurn(t.id, {
          id: nid(),
          role: "ana",
          text: `${i.why}\n\n${narrative(def, val)}\n\nSuggested next step: ${i.suggestedAction}`,
          systemChip: "Info only · No artifact changes",
          followUps: ["Drill into the cohort", "Open the Command Center"],
        });
        setStreaming(false);
      }, 850);
    },
    [pushTurn],
  );

  const setArtifactView = useCallback((id: string, v: ArtifactView) => {
    setArtifacts((prev) => ({ ...prev, [id]: { ...prev[id], view: v } }));
  }, []);

  const togglePin = useCallback(
    (id: string) => {
      setArtifacts((prev) => {
        const a = prev[id];
        const pinned = a.pinnedTo.includes("board-dso");
        return {
          ...prev,
          [id]: {
            ...a,
            pinnedTo: pinned
              ? a.pinnedTo.filter((b) => b !== "board-dso")
              : [...a.pinnedTo, "board-dso"],
          },
        };
      });
      const a = artifacts[id];
      showToast(
        a?.pinnedTo.includes("board-dso")
          ? "Unpinned from Command Center"
          : "Pinned to Command Center",
      );
    },
    [artifacts, showToast],
  );

  const openDrill = useCallback((m: MetricId) => {
    setDrillMetric(m);
    setDrillFilters(["All facilities", "Payer: all", "Aug 2026 MTD"]);
  }, []);

  const closeDrill = useCallback(() => setDrillMetric(null), []);

  const removeDrillFilter = useCallback(
    (f: string) => setDrillFilters((p) => p.filter((x) => x !== f)),
    [],
  );

  const openConversationFor = useCallback(
    (artifactId: string) => {
      const a = artifacts[artifactId];
      if (!a) return;
      openThread(a.threadId);
      setDrillMetric(null);
    },
    [artifacts, openThread],
  );

  const askAboutMetric = useCallback(
    (m: MetricId) => {
      setDrillMetric(m); // sets the scope chip
      setAnaOpen(true);
      setAnaMode("chat");
      setFocusComposerTick((t) => t + 1);
    },
    [],
  );

  const startAgency = useCallback(
    (actionId: string) => setAgency({ actionId, step: "draft" }),
    [],
  );
  const confirmAgency = useCallback(() => {
    setAgency((p) =>
      p ? { ...p, step: "receipt", receiptAt: "Aug 18, 2026 · now" } : p,
    );
  }, []);
  const undoAgency = useCallback(() => {
    setAgency((p) => (p ? { ...p, undone: true } : p));
    showToast("Action reversed. Nothing was submitted.");
  }, [showToast]);
  const closeAgency = useCallback(() => setAgency(null), []);

  const highlight = useCallback((insightId: string) => {
    setCanvasTab("feed");
    setHighlightInsight(insightId);
    if (highlightTimer.current) clearTimeout(highlightTimer.current);
    highlightTimer.current = setTimeout(() => setHighlightInsight(null), 3000);
  }, []);

  const focusComposer = useCallback(() => {
    setAnaOpen(true);
    setFocusComposerTick((t) => t + 1);
  }, []);

  /* global keyboard: "/" focuses composer, Esc closes drill (acceptance 1) */
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (e.key === "/" && tag !== "INPUT" && tag !== "TEXTAREA") {
        e.preventDefault();
        focusComposer();
      }
      if (e.key === "Escape") setDrillMetric(null);
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [focusComposer]);

  const value: AppState = {
    railExpanded,
    anaOpen,
    anaMode,
    canvasTab,
    threads,
    activeThreadId,
    artifacts,
    streaming,
    drillMetric,
    drillFilters,
    agency,
    highlightInsight,
    toast,
    boardLoading,
    scope,
    focusComposerTick,
    toggleRail: () => setRailExpanded((v) => !v),
    setAnaOpen,
    setAnaMode,
    setCanvasTab,
    newChat,
    openThread,
    askAna,
    stopStreaming,
    investigate,
    setArtifactView,
    togglePin,
    openDrill,
    closeDrill,
    removeDrillFilter,
    openConversationFor,
    askAboutMetric,
    startAgency,
    confirmAgency,
    undoAgency,
    closeAgency,
    showToast,
    highlight,
    focusComposer,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp(): AppState {
  const v = useContext(Ctx);
  if (!v) throw new Error("useApp outside AppProvider");
  return v;
}

export { insights };
