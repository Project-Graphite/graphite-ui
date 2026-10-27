import type { ReactNode } from 'react';

export function Fieldset({
  children,
  className = '',
  hint,
  legend,
}: {
  children: ReactNode;
  className?: string;
  hint?: ReactNode;
  legend: ReactNode;
}) {
  return (
    <fieldset className={`fieldset ${className}`}>
      <legend className="fieldset-legend">{legend}</legend>
      {children}
      {hint && <p className="fieldset-hint">{hint}</p>}
    </fieldset>
  );
}
