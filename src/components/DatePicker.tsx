import MuiIconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import MuiPopover from '@mui/material/Popover';
import MuiTextField from '@mui/material/TextField';
import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { Button, IconButton } from './Button.js';
import type { TriggerLook } from './Field.js';
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
  const [own, setOwn] = useState(defaultValue ?? '');
  const current = value ?? own;
  const [focus, setFocus] = useState(valid(current) ? current : todayText());
  const [open, setOpen] = useState(false);
  const grid = useRef<HTMLDivElement>(null);
  const root = useRef<HTMLDivElement>(null);
  const field = useRef<HTMLInputElement>(null);
  const hidden = useRef<HTMLInputElement>(null);
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

  const focusDay = () => grid.current?.querySelector<HTMLButtonElement>(`[data-day="${focus}"]`)?.focus({ preventScroll: true });

  useEffect(focusDay, [focus]);

  function show() {
    setFocus(valid(current) ? current : today);
    setOpen(true);
  }

  function close() {
    setOpen(false);
    field.current?.focus();
  }

  function choose(next: string) {
    if (value === undefined) setOwn(next);
    if (next !== current) onChange?.(next);
    close();
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

  return (
    <>
      <MuiTextField
        className={className}
        disabled={disabled}
        error={Boolean(error)}
        fullWidth={Boolean(label)}
        helperText={error ?? hint}
        inputRef={field}
        label={label}
        onClick={show}
        placeholder={placeholder}
        ref={root}
        size={size === 'small' ? 'small' : 'medium'}
        slotProps={{
          htmlInput: {
            'aria-expanded': open,
            'aria-haspopup': 'dialog',
            'aria-label': ariaLabel,
            className: 'cursor-pointer',
            onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => {
              if (['ArrowDown', 'Enter', ' '].includes(event.key)) {
                event.preventDefault();
                show();
              }
            },
            readOnly: true,
          },
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <Icon name="calendar" size={18} />
              </InputAdornment>
            ),
          },
        }}
        value={valid(current) ? formatDay(current) : ''}
        variant={quiet ? 'standard' : 'outlined'}
      />
      <input name={name} ref={hidden} type="hidden" value={current} />
      <MuiPopover
        anchorEl={() => root.current!}
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
        disableAutoFocus
        onClose={close}
        open={open}
        slotProps={{ paper: { 'aria-label': 'Choose a date', className: 'w-[19rem] p-3', role: 'dialog' }, transition: { onEntered: focusDay } }}
      >
        <div className="date-panel-head">
          <IconButton icon="chevron-left" label="Previous month" onClick={() => shiftMonth(-1)} size="small" />
          <span aria-live="polite" className="font-medium">
            {formatDay(`${month}-01`, { month: 'long', year: 'numeric' })}
          </span>
          <IconButton icon="chevron-right" label="Next month" onClick={() => shiftMonth(1)} size="small" />
        </div>
        <div className="date-grid" onKeyDown={onGridKey} ref={grid} role="grid">
          {days.slice(0, 7).map((day) => (
            <span aria-hidden="true" className="date-weekday" key={`head-${day}`}>
              {formatDay(day, { weekday: 'narrow' })}
            </span>
          ))}
          {days.map((day) => (
            <MuiIconButton
              aria-current={day === today ? 'date' : undefined}
              aria-label={formatDay(day, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              aria-pressed={day === current}
              className={`aspect-square text-sm ${day === current ? 'bg-ink text-paper hover:bg-ink' : day.slice(0, 7) === month ? 'text-ink' : 'text-faint'} ${day === today && day !== current ? 'border border-solid border-muted' : ''}`}
              data-day={day}
              disabled={outside(day)}
              key={day}
              onClick={() => choose(day)}
              size="small"
              tabIndex={day === focus ? 0 : -1}
            >
              {Number(day.slice(8))}
            </MuiIconButton>
          ))}
        </div>
        <div className="date-panel-foot">
          {optional && current ? (
            <Button onClick={() => choose('')} size="small" variant="text">
              Clear
            </Button>
          ) : (
            <span />
          )}
          <Button disabled={outside(today)} onClick={() => choose(today)} size="small" variant="text">
            Today
          </Button>
        </div>
      </MuiPopover>
    </>
  );
}
