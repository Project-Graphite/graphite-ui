import { useMemo, type ReactNode } from 'react';
import { Select, type SelectOption } from './Select.js';

function times(step: number) {
  return Array.from({ length: (24 * 60) / step }, (_, index) => {
    const minutes = index * step;
    return `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;
  });
}

export function TimePicker({
  'aria-label': ariaLabel,
  className,
  defaultValue,
  disabled,
  emptyLabel = 'No time',
  error,
  hint,
  label,
  name,
  onChange,
  optional = true,
  step = 15,
  value,
}: {
  'aria-label'?: string;
  className?: string;
  defaultValue?: string;
  disabled?: boolean;
  emptyLabel?: string;
  error?: string;
  hint?: ReactNode;
  label?: ReactNode;
  name?: string;
  onChange?: (value: string) => void;
  optional?: boolean;
  step?: number;
  value?: string;
}) {
  const extra = value ?? defaultValue ?? '';
  const options = useMemo<SelectOption[]>(() => {
    const listed = times(step);
    if (extra && !listed.includes(extra)) listed.push(extra);
    return [...(optional ? [{ value: '', label: emptyLabel }] : []), ...listed.sort().map((time) => ({ value: time, label: time }))];
  }, [emptyLabel, extra, optional, step]);

  return (
    <Select
      aria-label={ariaLabel}
      className={className}
      defaultValue={defaultValue}
      disabled={disabled}
      error={error}
      hint={hint}
      label={label}
      name={name}
      onChange={onChange}
      options={options}
      placeholder={emptyLabel}
      searchable
      value={value}
    />
  );
}
