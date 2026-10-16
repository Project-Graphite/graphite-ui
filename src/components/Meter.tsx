export function Meter({ label, value }: { label: string; value: number }) {
  const filled = Math.min(1, Math.max(0, value));
  return (
    <div
      aria-label={label}
      aria-valuemax={100}
      aria-valuemin={0}
      aria-valuenow={Math.round(filled * 100)}
      className="meter"
      data-over={value > 1 || undefined}
      role="progressbar"
    >
      <span className="meter-fill" style={{ width: `${filled * 100}%` }} />
    </div>
  );
}
