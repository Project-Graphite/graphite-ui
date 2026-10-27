import MuiDialog from '@mui/material/Dialog';
import { useCallback, useId, useRef, type ReactNode } from 'react';
import { IconButton } from './Button.js';

export function Dialog({
  children,
  dismissible = true,
  eyebrow,
  onClose,
  title,
}: {
  children: ReactNode;
  dismissible?: boolean;
  eyebrow?: string;
  onClose: () => void;
  title: string;
}) {
  const edited = useRef(false);
  const titleId = useId();
  const focusFirstField = useCallback((paper: HTMLDivElement | null) => {
    if (paper && !paper.contains(document.activeElement)) {
      paper.querySelector<HTMLElement>(':is(input:not([type="hidden"]), select, textarea):not(:disabled)')?.focus();
    }
  }, []);

  return (
    <MuiDialog
      aria-labelledby={titleId}
      fullWidth
      onClose={(_, reason) => {
        if (dismissible && !(reason === 'backdropClick' && edited.current)) onClose();
      }}
      open
      slotProps={{
        paper: {
          onChange: () => {
            edited.current = true;
          },
          ref: focusFirstField,
        },
      }}
    >
      <div className="p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            {eyebrow && <p className="eyebrow mb-2">{eyebrow}</p>}
            <h2 className="m-0 text-h2" id={titleId}>
              {title}
            </h2>
          </div>
          {dismissible && <IconButton className="-mt-1.5 -mr-2 shrink-0" icon="x" label="Close" onClick={onClose} />}
        </div>
        {children}
      </div>
    </MuiDialog>
  );
}
