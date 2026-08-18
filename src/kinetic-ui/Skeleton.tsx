/**
 * Skeleton in the exact layout position (teardown 5.1): never a blank canvas.
 */
export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`animate-pulse rounded-control bg-state-active ${className}`}
    />
  );
}
