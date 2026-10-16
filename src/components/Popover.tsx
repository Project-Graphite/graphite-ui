import type { ReactNode } from 'react';
import { useAnchoredPanel } from '../lib/useAnchoredPanel.js';

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
  const { close, open, panel, root, setOpen, trigger: button } = useAnchoredPanel<HTMLButtonElement, HTMLDivElement>('auto', 'end');

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
        <div aria-label={label} className={`popover-panel anchored-panel ${panelClassName}`} popover="manual" ref={panel} role="dialog">
          {children(close)}
        </div>
      )}
    </div>
  );
}
