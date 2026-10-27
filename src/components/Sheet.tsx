import Drawer from '@mui/material/Drawer';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useId, type ReactNode } from 'react';
import { IconButton } from './Button.js';

export function Sheet({
  actions,
  children,
  eyebrow,
  footer,
  onClose,
  title,
  width = '32rem',
}: {
  actions?: ReactNode;
  children: ReactNode;
  eyebrow?: ReactNode;
  footer?: ReactNode;
  onClose: () => void;
  title: ReactNode;
  width?: string;
}) {
  const titleId = useId();
  const phone = useMediaQuery('(max-width: 47.99rem)', { noSsr: true });
  return (
    <Drawer
      anchor={phone ? 'bottom' : 'right'}
      onClose={onClose}
      open
      slotProps={{
        paper: {
          'aria-labelledby': titleId,
          className: 'sheet-paper',
          role: 'dialog',
          style: phone
            ? { maxHeight: 'calc(100dvh - 2rem)', borderTopLeftRadius: 'var(--radius-card)', borderTopRightRadius: 'var(--radius-card)' }
            : { width: `min(${width}, 100vw)` },
        },
      }}
    >
      <div className="sheet-head">
        <div className="min-w-0">
          {eyebrow && <p className="eyebrow mb-1">{eyebrow}</p>}
          <h2 className="m-0 text-h2" id={titleId}>
            {title}
          </h2>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          {actions}
          <IconButton icon="x" label="Close" onClick={onClose} />
        </div>
      </div>
      <div className="sheet-body">{children}</div>
      {footer && <div className="sheet-foot">{footer}</div>}
    </Drawer>
  );
}
