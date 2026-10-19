import MuiPopover from '@mui/material/Popover';
import { useState, type ReactNode } from 'react';
import { Trigger, type TriggerVariant } from './Trigger.js';

export function Popover({
  align = 'end',
  children,
  label,
  panelClassName = 'popover-list',
  trigger,
  triggerClassName,
  triggerLabel,
  triggerVariant = triggerClassName ? undefined : 'icon',
}: {
  align?: 'start' | 'end';
  children: (close: () => void) => ReactNode;
  label: string;
  panelClassName?: string;
  trigger: ReactNode;
  triggerClassName?: string;
  triggerLabel: string;
  triggerVariant?: TriggerVariant;
}) {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const close = () => setAnchor(null);
  const horizontal = align === 'end' ? 'right' : 'left';

  return (
    <>
      <Trigger
        className={triggerClassName}
        expanded={Boolean(anchor)}
        haspopup="dialog"
        label={triggerLabel}
        onClick={(event) => {
          const target = event.currentTarget;
          setAnchor((current) => (current ? null : target));
        }}
        variant={triggerVariant}
      >
        {trigger}
      </Trigger>
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
