import { Card, Tabs } from "../kinetic-ui";
import { useApp, type CanvasTab } from "../state/store";
import { CommandCenter } from "./CommandCenter";
import { InsightFeed } from "./InsightFeed";
import { ArtifactCard } from "./ArtifactCard";

export function Canvas() {
  const { canvasTab, setCanvasTab, artifacts, threads, openThread } = useApp();
  const pinned = Object.values(artifacts).filter((a) => a.pinnedTo.length > 0);

  return (
    <main className="flex h-full min-w-0 flex-1 flex-col gap-3 overflow-hidden">
      <Tabs<CanvasTab>
        items={[
          { id: "feed", label: "Live Insight Feed" },
          { id: "board", label: "Command Center" },
          { id: "saved", label: "Saved", count: pinned.length },
          { id: "lastOpened", label: "Last Opened" },
        ]}
        active={canvasTab}
        onChange={setCanvasTab}
      />
      <div className="min-h-0 flex-1 overflow-y-auto pr-1">
        {canvasTab === "feed" && <InsightFeed />}
        {canvasTab === "board" && <CommandCenter />}
        {canvasTab === "saved" && (
          <div className="flex flex-col gap-3">
            {pinned.length ? (
              pinned.map((a) => (
                <ArtifactCard key={a.id} artifactId={a.id} context="board" />
              ))
            ) : (
              <Card variant="deep" className="text-center">
                <p className="text-sm text-text-secondary">Nothing saved yet.</p>
                <p className="mt-1 text-xs text-text-muted">
                  Pin any answer from a conversation and it appears here and on
                  the Command Center, with its conversation attached.
                </p>
              </Card>
            )}
          </div>
        )}
        {canvasTab === "lastOpened" && (
          <div className="flex flex-col gap-2">
            {threads.map((t) => (
              <button
                key={t.id}
                onClick={() => openThread(t.id)}
                className="rounded-card border border-lines-card bg-bg-card p-3 text-left hover:border-border-active"
              >
                <p className="text-sm text-text-primary">{t.title}</p>
                <p className="mt-0.5 text-xs text-text-muted">
                  Conversation · {t.createdAt} · {t.turns.length} turns
                </p>
              </button>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
