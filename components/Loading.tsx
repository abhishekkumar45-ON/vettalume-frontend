// Centered spinner used for every page/panel loading state. Reserves vertical space so the footer
// stays at the bottom instead of floating up under short "Loading…" text.
export default function Loading({
  label = "Please wait…",
  compact = false
}: {
  label?: string;
  compact?: boolean;
}) {
  return (
    <div className={`loadingState${compact ? " compact" : ""}`} role="status" aria-live="polite">
      <span className="loadingSpinner" aria-hidden="true" />
      <span className="loadingLabel">{label}</span>
    </div>
  );
}
