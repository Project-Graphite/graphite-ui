import { useCallback, useRef, useState, type ReactNode } from 'react';
import { useDismiss } from '../lib/useDismiss.js';

export function Popover({
  children,
  label,
  panelClassName = 'popover-list',
  trigger,
  triggerClassName = 'icon-button',
  triggerLabel,
}: {
  children: (close: () => void) => ReactNode;
  label: string;
  panelClassName?: string;
  trigger: ReactNode;
  triggerClassName?: string;
  triggerLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const close = useCallback(() => setOpen(false), []);
  useDismiss(open, root, close);

  return (
    <div
      className="relative"
      onKeyDown={(event) => {
        if (open && event.key === 'Escape') button.current?.focus();
      }}
      ref={root}
    >
      <button
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label={triggerLabel}
        className={triggerClassName}
        onClick={() => setOpen((current) => !current)}
        ref={button}
        type="button"
      >
        {trigger}
      </button>
      {open && (
        <div aria-label={label} className={`popover-panel ${panelClassName}`} role="dialog">
          {children(close)}
        </div>
      )}
    </div>
  );
}
