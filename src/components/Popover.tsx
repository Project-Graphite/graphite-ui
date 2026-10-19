import MuiPopover from '@mui/material/Popover';
import { useState, type ReactNode } from 'react';

export function Popover({
  align = 'end',
  children,
  label,
  panelClassName = 'popover-list',
  trigger,
  triggerClassName = 'icon-button',
  triggerLabel,
}: {
  align?: 'start' | 'end';
  children: (close: () => void) => ReactNode;
  label: string;
  panelClassName?: string;
  trigger: ReactNode;
  triggerClassName?: string;
  triggerLabel: string;
}) {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const close = () => setAnchor(null);
  const horizontal = align === 'end' ? 'right' : 'left';

  return (
    <>
      <button
        aria-expanded={Boolean(anchor)}
        aria-haspopup="dialog"
        aria-label={triggerLabel}
        className={triggerClassName}
        onClick={(event) => {
          const target = event.currentTarget;
          setAnchor((current) => (current ? null : target));
        }}
        type="button"
      >
        {trigger}
      </button>
      <MuiPopover
        anchorEl={anchor}
        anchorOrigin={{ horizontal, vertical: 'bottom' }}
        onClose={close}
        open={Boolean(anchor)}
        slotProps={{ paper: { 'aria-label': label, className: panelClassName, role: 'dialog' } }}
        transformOrigin={{ horizontal, vertical: 'top' }}
      >
        {children(close)}
      </MuiPopover>
    </>
  );
}
