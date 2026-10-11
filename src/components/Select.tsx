import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { useAnchoredPanel } from '../lib/useAnchoredPanel.js';
import { describedBy, FieldMessage } from './Field.js';
import { Icon } from './Icon.js';

export interface SelectOption<T extends string = string> {
  value: T;
  label: string;
  hint?: string;
  leading?: ReactNode;
}

export function Select<T extends string = string>({
  'aria-label': ariaLabel,
  className = '',
  defaultValue,
  disabled = false,
  error,
  hint,
  label,
  name,
  onChange,
  options,
  placeholder = 'Choose…',
  searchable = false,
  value,
}: {
  'aria-label'?: string;
  className?: string;
  defaultValue?: T | '';
  disabled?: boolean;
  error?: string;
  hint?: ReactNode;
  label?: ReactNode;
  name?: string;
  onChange?: (value: T) => void;
  options: SelectOption<T>[];
  placeholder?: string;
  searchable?: boolean;
  value?: T | '';
}) {
  const id = useId();
  const [own, setOwn] = useState<T | ''>(defaultValue ?? '');
  const current = value ?? own;
  const selected = options.find((option) => option.value === current);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const typed = useRef({ text: '', at: 0 });
  const hidden = useRef<HTMLInputElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const search = useRef<HTMLInputElement>(null);
  const { close, open, panel, place, root, setOpen, trigger } = useAnchoredPanel<HTMLButtonElement, HTMLDivElement>(searchable ? 288 : 192);
  const shown = useMemo(() => {
    const words = query.trim().toLowerCase();
    return words ? options.filter((option) => `${option.label} ${option.hint ?? ''} ${option.value}`.toLowerCase().includes(words)) : options;
  }, [options, query]);

  useEffect(() => {
    const form = hidden.current?.form;
    if (!form) return;
    const reset = () => setOwn(defaultValue ?? '');
    form.addEventListener('reset', reset);
    return () => form.removeEventListener('reset', reset);
  }, [defaultValue]);

  useLayoutEffect(() => {
    if (!open) return;
    (searchable ? search.current : list.current)?.focus({ preventScroll: true });
  }, [open, searchable]);

  useLayoutEffect(() => {
    if (!open) return;
    place();
    list.current?.querySelector('[data-active="true"]')?.scrollIntoView({ block: 'nearest' });
  }, [active, open, place, shown.length]);

  function show() {
    setQuery('');
    setActive(Math.max(0, options.findIndex((option) => option.value === current)));
    setOpen(true);
  }

  function choose(next: T) {
    if (value === undefined) setOwn(next);
    if (next !== current) onChange?.(next);
    close();
    trigger.current?.focus();
  }

  function onPanelKey(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Escape') {
      event.preventDefault();
      close();
      trigger.current?.focus();
    } else if (event.key === 'Tab') {
      close();
    } else if (['ArrowDown', 'ArrowUp', 'Home', 'End', 'PageDown', 'PageUp'].includes(event.key)) {
      event.preventDefault();
      const last = shown.length - 1;
      const step = event.key.startsWith('Page') ? 8 : 1;
      setActive((index) =>
        event.key === 'Home'
          ? 0
          : event.key === 'End'
            ? last
            : Math.min(last, Math.max(0, index + (event.key === 'ArrowDown' || event.key === 'PageDown' ? step : -step))),
      );
    } else if (event.key === 'Enter') {
      event.preventDefault();
      const option = shown[active];
      if (option) choose(option.value);
    } else if (!searchable && event.key.length === 1 && !event.metaKey && !event.ctrlKey) {
      const now = Date.now();
      typed.current = { text: (now - typed.current.at < 700 ? typed.current.text : '') + event.key.toLowerCase(), at: now };
      const match = shown.findIndex((option) => option.label.toLowerCase().startsWith(typed.current.text));
      if (match >= 0) setActive(match);
    }
  }

  const control = (
    <div className={`relative ${label ? '' : className}`} ref={root}>
      <button
        aria-controls={open ? `${id}-list` : undefined}
        aria-describedby={describedBy(id, error, hint)}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-invalid={error ? true : undefined}
        aria-label={ariaLabel}
        aria-labelledby={label ? `${id}-label` : undefined}
        className="select-trigger field-control"
        disabled={disabled}
        onClick={() => (open ? close() : show())}
        onKeyDown={(event) => {
          if (!open && ['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(event.key)) {
            event.preventDefault();
            show();
          }
        }}
        ref={trigger}
        role="combobox"
        type="button"
      >
        <span className={`flex min-w-0 items-center gap-2 truncate ${selected ? '' : 'text-faint'}`}>
          {selected?.leading}
          <span className="truncate">{selected?.label ?? placeholder}</span>
        </span>
        <span className="chevron">
          <Icon name="chevron-down" size={16} />
        </span>
      </button>
      <input name={name} ref={hidden} type="hidden" value={current} />
      {open && (
        <div className="popover-panel listbox-panel" onKeyDown={onPanelKey} popover="manual" ref={panel}>
          {searchable && (
            <div className="listbox-search">
              <Icon name="search" size={16} />
              <input
                aria-activedescendant={shown[active] ? `${id}-${active}` : undefined}
                aria-controls={`${id}-list`}
                aria-label={`Search ${typeof label === 'string' ? label.toLowerCase() : 'options'}`}
                autoComplete="off"
                onChange={(event) => {
                  setQuery(event.currentTarget.value);
                  setActive(0);
                }}
                placeholder="Type to search"
                ref={search}
                value={query}
              />
            </div>
          )}
          <div
            aria-activedescendant={!searchable && shown[active] ? `${id}-${active}` : undefined}
            className="listbox-options"
            id={`${id}-list`}
            ref={list}
            role="listbox"
            tabIndex={searchable ? -1 : 0}
          >
            {shown.map((option, index) => (
              <div
                aria-selected={option.value === current}
                className="listbox-option"
                data-active={index === active}
                id={`${id}-${index}`}
                key={option.value}
                onClick={() => choose(option.value)}
                onPointerMove={() => index !== active && setActive(index)}
                role="option"
              >
                {option.leading}
                <span className="min-w-0 flex-1 truncate">{option.label}</span>
                {option.hint && <span className="listbox-hint">{option.hint}</span>}
                {option.value === current && <Icon name="check-mark" size={16} />}
              </div>
            ))}
            {shown.length === 0 && <p className="listbox-empty">Nothing matches “{query}”.</p>}
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
