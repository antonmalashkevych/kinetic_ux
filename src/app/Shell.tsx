import { useApp } from "../state/store";
import { AnaPanel, AnaSlimBar } from "./AnaPanel";
import { LeftRail } from "./LeftRail";
import { Canvas } from "./Canvas";
import { DrillPanel } from "./DrillPanel";
import { AgencyDrawer } from "./AgencyDrawer";

export function Shell() {
  const { anaOpen, toast } = useApp();
  return (
    <div className="relative flex h-full gap-2 bg-bg-page p-2">
      <LeftRail />
      {anaOpen ? <AnaPanel /> : <AnaSlimBar />}
      <Canvas />
      <DrillPanel />
      <AgencyDrawer />
      {toast && (
        <div
          role="status"
          className="absolute bottom-4 left-1/2 z-40 -translate-x-1/2 rounded-card border border-lines-card bg-bg-floating px-4 py-2.5 text-sm text-text-primary shadow-[0_8px_40px_var(--color-bg-overlay)]"
        >
          {toast}
        </div>
      )}
    </div>
  );
}
