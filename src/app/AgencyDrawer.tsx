import { useEffect, useState } from "react";
import { CircleCheck, RotateCcw, X } from "lucide-react";
import { Button, Card, Pill, Table, THead, Th, TRow, Td } from "../kinetic-ui";
import { useApp } from "../state/store";

/**
 * Agency ladder, rungs 4-5 (ARCHITECTURE.md 1.5): Draft (exact scope,
 * diff-style preview) -> Execute (receipt: scope, actor, timestamp, undo
 * window, audit entry). Nothing executes silently; everything is reversible.
 */

const SAMPLE = [
  { claim: "CLM-88412", facility: "Bright Dental - Austin", code: "D2740", paid: 612, contracted: 918, variance: 306 },
  { claim: "CLM-87903", facility: "SmileCare - Phoenix", code: "D6010", paid: 1240, contracted: 1710, variance: 470 },
  { claim: "CLM-87781", facility: "CareOne Dental - Tampa", code: "D2740", paid: 655, contracted: 918, variance: 263 },
  { claim: "CLM-87544", facility: "Lakeview Dental - Chicago", code: "D6065", paid: 890, contracted: 1275, variance: 385 },
  { claim: "CLM-87102", facility: "Summit Dental - Denver", code: "D2750", paid: 701, contracted: 962, variance: 261 },
];

function UndoRow({ onUndo }: { onUndo: () => void }) {
  const [secondsLeft, setSecondsLeft] = useState(15);
  useEffect(() => {
    const iv = setInterval(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(iv);
  }, []);
  return (
    <div className="mt-1 flex items-center gap-2">
      <Button size="sm" variant="secondary" onClick={onUndo} disabled={secondsLeft === 0}>
        <RotateCcw size={13} aria-hidden /> Undo ({secondsLeft}s)
      </Button>
      <span className="text-text-muted">
        {secondsLeft > 0
          ? "Recall window open."
          : "Recall window closed; use batch recall within 24h."}
      </span>
    </div>
  );
}

export function AgencyDrawer() {
  const { agency, confirmAgency, undoAgency, closeAgency } = useApp();

  if (!agency) return null;

  return (
    <div className="absolute inset-0 z-30 flex items-stretch justify-end bg-bg-overlay">
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Recover payment variance"
        className="flex w-[520px] flex-col gap-3 overflow-y-auto border-l border-lines-card bg-bg-floating p-5"
      >
        <header className="flex items-center gap-2">
          <h2 className="text-base font-semibold text-text-primary">
            Recover payment variance
          </h2>
          <Pill variant="interactive">
            {agency.step === "draft" ? "Draft - nothing sent yet" : "Executed"}
          </Pill>
          <button
            aria-label="Close"
            onClick={closeAgency}
            className="ml-auto rounded-control p-1.5 text-icon-tertiary hover:bg-state-hover"
          >
            <X size={16} />
          </button>
        </header>

        {agency.step === "draft" && (
          <>
            <Card variant="deep" className="text-xs text-text-secondary">
              <p className="text-sm font-medium text-text-primary">Exact scope</p>
              <ul className="mt-1.5 flex flex-col gap-1">
                <li>· 214 claims across 3 PPO payers, trailing 90 days</li>
                <li>· Crown and implant codes only (D27xx, D60xx)</li>
                <li>· Estimated recoverable: $186,000</li>
                <li>· Action: flag and resubmit with contract citations</li>
                <li>· Reversal: batch can be recalled within 24h before payer pickup</li>
              </ul>
            </Card>
            <div>
              <p className="mb-1.5 text-[11px] font-medium tracking-wide text-text-muted">
                PREVIEW - SAMPLE 5 OF 214
              </p>
              <Table>
                <THead>
                  <Th>Claim</Th>
                  <Th>Facility</Th>
                  <Th>Code</Th>
                  <Th numeric>Paid ($)</Th>
                  <Th numeric>Contract ($)</Th>
                  <Th numeric>Variance ($)</Th>
                </THead>
                <tbody>
                  {SAMPLE.map((r, i) => (
                    <TRow key={r.claim} index={i} hover="none">
                      <Td className="font-mono">{r.claim}</Td>
                      <Td>{r.facility}</Td>
                      <Td className="font-mono">{r.code}</Td>
                      <Td numeric>{r.paid}</Td>
                      <Td numeric>{r.contracted}</Td>
                      <Td numeric className="text-semantic-warning-soft">
                        +{r.variance}
                      </Td>
                    </TRow>
                  ))}
                </tbody>
              </Table>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="primary" onClick={confirmAgency}>
                Confirm and submit 214 claims
              </Button>
              <Button variant="ghost" onClick={closeAgency}>
                Cancel
              </Button>
            </div>
          </>
        )}

        {agency.step === "receipt" && (
          <Card variant="deep" className="flex flex-col gap-2 text-xs text-text-secondary">
            {agency.undone ? (
              <>
                <p className="flex items-center gap-2 text-sm font-medium text-text-primary">
                  <RotateCcw size={15} className="text-semantic-warning" aria-hidden />
                  Reversed. Nothing was submitted.
                </p>
                <p>Audit entry AUD-2481 records both the action and the reversal.</p>
              </>
            ) : (
              <>
                <p className="flex items-center gap-2 text-sm font-medium text-text-primary">
                  <CircleCheck size={15} className="text-semantic-success" aria-hidden />
                  Submitted: 214 claims flagged for resubmission
                </p>
                <p>Actor: Anton M. · {agency.receiptAt} · Audit entry AUD-2481</p>
                <p>Scope: 3 PPO payers, crown and implant codes, est. $186k</p>
                <UndoRow onUndo={undoAgency} />
              </>
            )}
            <div className="mt-1">
              <Button size="sm" variant="ghost" onClick={closeAgency}>
                Done
              </Button>
            </div>
          </Card>
        )}
      </aside>
    </div>
  );
}
