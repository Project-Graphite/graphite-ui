import { useEffect, useId, useLayoutEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { useAnchoredPanel } from '../lib/useAnchoredPanel.js';
import { describedBy, FieldMessage, triggerClass, type TriggerLook } from './Field.js';
import { Icon } from './Icon.js';

const dayMs = 86_400_000;

const toDays = (text: string) => Date.parse(`${text}T00:00:00Z`) / dayMs;
const toText = (days: number) => new Date(days * dayMs).toISOString().slice(0, 10);
const todayText = () => {
  const now = new Date();
  return toText(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) / dayMs);
};
const valid = (text: string) => /^\d{4}-\d{2}-\d{2}$/.test(text) && !Number.isNaN(toDays(text));

export function formatDay(text: string, options: Intl.DateTimeFormatOptions = { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }) {
  return new Intl.DateTimeFormat(undefined, { ...options, timeZone: 'UTC' }).format(new Date(toDays(text) * dayMs));
}

function monthGrid(month: string, weekStartsOn: number) {
  const first = toDays(`${month}-01`);
  const lead = (new Date(first * dayMs).getUTCDay() - weekStartsOn + 7) % 7;
  return Array.from({ length: 42 }, (_, index) => toText(first - lead + index));
}

export function DatePicker({
  'aria-label': ariaLabel,
  className = '',
  defaultValue,
  disabled = false,
  error,
  hint,
  label,
  max,
  min,
  name,
  onChange,
  optional = true,
  placeholder = 'Choose a date',
  quiet,
  size,
  value,
  weekStartsOn = 1,
}: TriggerLook & {
  'aria-label'?: string;
  className?: string;
  defaultValue?: string;
  disabled?: boolean;
  error?: string;
  hint?: ReactNode;
  label?: ReactNode;
  max?: string;
  min?: string;
  name?: string;
  onChange?: (value: string) => void;
  optional?: boolean;
  placeholder?: string;
  value?: string;
  weekStartsOn?: number;
}) {
  const id = useId();
  const [own, setOwn] = useState(defaultValue ?? '');
  const current = value ?? own;
  const [focus, setFocus] = useState(valid(current) ? current : todayText());
  const hidden = useRef<HTMLInputElement>(null);
  const grid = useRef<HTMLDivElement>(null);
  const { close, open, panel, place, root, setOpen, trigger } = useAnchoredPanel<HTMLButtonElement, HTMLDivElement>(296);
  const month = focus.slice(0, 7);
  const days = monthGrid(month, weekStartsOn);
  const today = todayText();
  const outside = (day: string) => (min !== undefined && day < min) || (max !== undefined && day > max);

  useEffect(() => {
    const form = hidden.current?.form;
    if (!form) return;
    const reset = () => setOwn(defaultValue ?? '');
    form.addEventListener('reset', reset);
    return () => form.removeEventListener('reset', reset);
  }, [defaultValue]);

  useLayoutEffect(() => {
    if (!open) return;
    place();
    grid.current?.querySelector<HTMLButtonElement>(`[data-day="${focus}"]`)?.focus({ preventScroll: true });
  }, [focus, open, place]);

  function show() {
    setFocus(valid(current) ? current : today);
    setOpen(true);
  }

  function choose(next: string) {
    if (value === undefined) setOwn(next);
    if (next !== current) onChange?.(next);
    close();
    trigger.current?.focus();
  }

  function shiftMonth(by: number) {
    const [year, monthIndex] = focus.split('-').map(Number) as [number, number];
    const target = new Date(Date.UTC(year, monthIndex - 1 + by, 1));
    const lastDay = new Date(Date.UTC(target.getUTCFullYear(), target.getUTCMonth() + 1, 0)).getUTCDate();
    setFocus(toText(Date.UTC(target.getUTCFullYear(), target.getUTCMonth(), Math.min(Number(focus.slice(8)), lastDay)) / dayMs));
  }

  function onGridKey(event: KeyboardEvent<HTMLDivElement>) {
    const moves: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };
    if (event.key in moves) {
      event.preventDefault();
      setFocus(toText(toDays(focus) + moves[event.key]!));
    } else if (event.key === 'PageUp' || event.key === 'PageDown') {
      event.preventDefault();
      shiftMonth(event.key === 'PageUp' ? -1 : 1);
    }
  }

  const control = (
    <div className={`relative ${label ? '' : className}`} ref={root}>
      <button
        aria-describedby={describedBy(id, error, hint)}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-invalid={error ? true : undefined}
        aria-label={ariaLabel}
        aria-labelledby={label ? `${id}-label ${id}-value` : undefined}
        className={triggerClass({ quiet, size })}
        disabled={disabled}
        onClick={() => (open ? close() : show())}
        ref={trigger}
        type="button"
      >
        <span className={`truncate ${valid(current) ? '' : 'text-faint'}`} id={`${id}-value`}>
          {valid(current) ? formatDay(current) : placeholder}
        </span>
        <span className="trigger-icon">
          <Icon name="calendar" size={16} />
        </span>
      </button>
      <input name={name} ref={hidden} type="hidden" value={current} />
      {open && (
        <div
          aria-label="Choose a date"
          className="popover-panel date-panel"
          onKeyDown={(event) => {
            if (event.key === 'Escape') {
              event.preventDefault();
              close();
              trigger.current?.focus();
            }
          }}
          popover="manual"
          ref={panel}
          role="dialog"
        >
          <div className="date-panel-head">
            <button aria-label="Previous month" className="icon-button" onClick={() => shiftMonth(-1)} type="button">
              <Icon name="chevron-left" size={16} />
            </button>
            <span aria-live="polite" className="font-medium">
              {formatDay(`${month}-01`, { month: 'long', year: 'numeric' })}
            </span>
            <button aria-label="Next month" className="icon-button" onClick={() => shiftMonth(1)} type="button">
              <Icon name="chevron-right" size={16} />
            </button>
          </div>
          <div className="date-grid" onKeyDown={onGridKey} ref={grid} role="grid">
            {days.slice(0, 7).map((day) => (
              <span aria-hidden="true" className="date-weekday" key={`head-${day}`}>
                {formatDay(day, { weekday: 'narrow' })}
              </span>
            ))}
            {days.map((day) => (
              <button
                aria-current={day === today ? 'date' : undefined}
                aria-label={formatDay(day, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                aria-pressed={day === current}
                className="date-day"
                data-day={day}
                data-outside={day.slice(0, 7) !== month || undefined}
                disabled={outside(day)}
                key={day}
                onClick={() => choose(day)}
                tabIndex={day === focus ? 0 : -1}
                type="button"
              >
                {Number(day.slice(8))}
              </button>
            ))}
          </div>
          <div className="date-panel-foot">
            {optional && current ? (
              <button className="text-button text-sm" onClick={() => choose('')} type="button">
                Clear
              </button>
            ) : (
              <span />
            )}
            <button className="text-button text-sm" disabled={outside(today)} onClick={() => choose(today)} type="button">
              Today
            </button>
          </div>
        </div>
      )}
    </div>
  );

  if (!label) return control;
  return (
    <div className={`field-label ${className}`}>
      <span id={`${id}-label`}>{label}</span>
      {control}
      <FieldMessage error={error} hint={hint} id={id} />
    </div>
  );
}
