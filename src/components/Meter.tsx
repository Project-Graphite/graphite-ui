export function Meter({ label, value }: { label: string; value: number }) {
  return (
    <div
      aria-label={label}
      aria-valuemax={100}
      aria-valuemin={0}
      aria-valuenow={Math.round(value * 100)}
      className="meter"
      data-over={value > 1 || undefined}
      role="progressbar"
    >
      <span className="meter-fill" style={{ width: `${Math.min(1, Math.max(0, value)) * 100}%` }} />
    </div>
  );
}
