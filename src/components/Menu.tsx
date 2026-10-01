import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { useDismiss } from '../lib/useDismiss.js';
import { useLink } from '../UiProvider.js';

export type MenuItem = { label: string; separated?: boolean } & (
  | { href: string }
  | { onSelect: () => void }
);

export function Menu({
  header,
  items,
  label,
  trigger,
  triggerClassName = 'avatar-button',
  triggerLabel,
}: {
  header?: ReactNode;
  items: MenuItem[];
  label: string;
  trigger: ReactNode;
  triggerClassName?: string;
  triggerLabel: string;
}) {
  const Link = useLink();
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setOpen(false), []);
  useDismiss(open, root, close);

  useEffect(() => {
    if (open) panel.current?.querySelector<HTMLElement>('[role="menuitem"]')?.focus();
  }, [open]);

  function move(event: KeyboardEvent<HTMLDivElement>) {
    const options = [...(panel.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? [])];
    const current = options.indexOf(document.activeElement as HTMLElement);
    if (event.key === 'Escape') {
      event.preventDefault();
      close();
      button.current?.focus();
    } else if (event.key === 'Tab') {
      close();
    } else if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
      event.preventDefault();
      const target =
        event.key === 'Home'
          ? 0
          : event.key === 'End'
            ? options.length - 1
            : (current + (event.key === 'ArrowDown' ? 1 : -1) + options.length) % options.length;
      options[target]?.focus();
    }
  }

  return (
    <div className="relative" ref={root}>
      <button
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={triggerLabel}
        className={triggerClassName}
        onClick={() => setOpen((current) => !current)}
        ref={button}
        type="button"
      >
        {trigger}
      </button>
      {open && (
        <div aria-label={label} className="popover-panel menu-panel" onKeyDown={move} ref={panel} role="menu">
          {header}
          {items.map((item) => {
            const className = `menu-item ${item.separated ? 'border-t border-line' : ''}`;
            return 'href' in item ? (
              <Link className={className} href={item.href} key={item.label} onClick={close} role="menuitem">
                {item.label}
              </Link>
            ) : (
              <button
                className={className}
                key={item.label}
                onClick={() => {
                  close();
                  item.onSelect();
                }}
                role="menuitem"
                type="button"
              >
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
