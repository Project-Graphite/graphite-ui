import type { ReactNode } from 'react';

export function StatGrid({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <dl className={`stat-grid ${className}`}>{children}</dl>;
}

export function Stat({
  delta,
  deltaTone = 'neutral',
  detail,
  label,
  meter,
  value,
}: {
  delta?: ReactNode;
  deltaTone?: 'bad' | 'good' | 'neutral';
  detail?: ReactNode;
  label: ReactNode;
  meter?: ReactNode;
  value: ReactNode;
}) {
  return (
    <div className="stat">
      <dt>{label}</dt>
      <dd className="stat-value">
        {value}
        {delta && (
          <span className="stat-delta" data-tone={deltaTone}>
            {delta}
          </span>
        )}
      </dd>
      {meter && <dd>{meter}</dd>}
      {detail && <dd className="stat-detail">{detail}</dd>}
    </div>
  );
}
