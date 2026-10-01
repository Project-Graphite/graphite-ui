import { useEffect, useId, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react';

export interface GridGroup {
  label: string;
  options: Array<{ label: string; value: string }>;
}

export function GridListbox({
  columns = 5,
  defaultValue,
  emptyLabel,
  groups,
  label,
  name,
}: {
  columns?: number;
  defaultValue: string;
  emptyLabel: string;
  groups: GridGroup[];
  label: string;
  name: string;
}) {
  const [value, setValue] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const listbox = useRef<HTMLDivElement>(null);
  const labelId = useId();
  const selectedLabel = groups.flatMap((group) => group.options).find((option) => option.value === value)?.label;

  useEffect(() => {
    if (!open) return;
    const selected =
      listbox.current?.querySelector<HTMLElement>('[aria-selected="true"]') ??
      listbox.current?.querySelector<HTMLElement>('[role="option"]');
    const panel = listbox.current;
    if (selected && panel) {
      panel.scrollTop = selected.offsetTop - (panel.clientHeight - selected.offsetHeight) / 2;
      selected.focus({ preventScroll: true });
    }
    const close = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', close);
    return () => document.removeEventListener('pointerdown', close);
  }, [open]);

  function choose(next: string) {
    setValue(next);
    setOpen(false);
    trigger.current?.focus();
  }

  function move(event: KeyboardEvent<HTMLDivElement>) {
    const options = [...(listbox.current?.querySelectorAll<HTMLElement>('[role="option"]') ?? [])];
    const current = options.indexOf(document.activeElement as HTMLElement);
    const step = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: columns, ArrowUp: -columns }[event.key];
    if (event.key === 'Escape') {
      event.preventDefault();
      setOpen(false);
      trigger.current?.focus();
    } else if (event.key === 'Tab') {
      setOpen(false);
    } else if (step !== undefined || event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      const target =
        event.key === 'Home'
          ? 0
          : event.key === 'End'
            ? options.length - 1
            : Math.min(options.length - 1, Math.max(0, current + (step ?? 0)));
      options[target]?.focus();
    }
  }

  return (
    <div className="field-label" ref={root}>
      <span id={labelId}>{label}</span>
      <div className="relative">
        <input name={name} type="hidden" value={value} />
        <button
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-labelledby={labelId}
          className="select-trigger"
          onClick={() => setOpen((current) => !current)}
          ref={trigger}
          type="button"
        >
          <span className={value ? 'text-ink' : 'text-faint'}>{selectedLabel ?? emptyLabel}</span>
          <svg aria-hidden="true" className="chevron" fill="none" height="16" viewBox="0 0 24 24" width="16">
            <path d="m6 9 6 6 6-6" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
          </svg>
        </button>
        {open && (
          <>
            <div aria-hidden="true" className="sheet-backdrop" onClick={() => setOpen(false)} />
            <div
              aria-labelledby={labelId}
              className="popover-panel grid-listbox"
              onKeyDown={move}
              ref={listbox}
              role="listbox"
              style={{ '--grid-columns': columns } as CSSProperties}
            >
              <button
                aria-selected={value === ''}
                className="grid-option col-span-full"
                onClick={() => choose('')}
                role="option"
                type="button"
              >
                {emptyLabel}
              </button>
              {groups.map((group) => (
                <div className="contents" key={group.label}>
                  <p className="eyebrow col-span-full mt-3 mb-1">{group.label}</p>
                  {group.options.map((option) => (
                    <button
                      aria-selected={value === option.value}
                      className="grid-option"
                      key={option.value}
                      onClick={() => choose(option.value)}
                      role="option"
                      type="button"
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
