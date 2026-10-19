import MuiIconButton from '@mui/material/IconButton';
import type { MouseEvent, ReactNode } from 'react';
import { Button, type ButtonVariant } from './Button.js';

export type TriggerVariant = ButtonVariant | 'icon';

export function Trigger({
  children,
  className,
  expanded,
  haspopup,
  label,
  onClick,
  variant,
}: {
  children: ReactNode;
  className?: string;
  expanded: boolean;
  haspopup: 'dialog' | 'menu';
  label: string;
  onClick: (event: MouseEvent<HTMLElement>) => void;
  variant?: TriggerVariant;
}) {
  const props = { 'aria-expanded': expanded, 'aria-haspopup': haspopup, 'aria-label': label, onClick } as const;
  if (variant === 'icon') {
    return (
      <MuiIconButton {...props} className={className} title={label}>
        {children}
      </MuiIconButton>
    );
  }
  if (variant) {
    return (
      <Button {...props} className={`w-fit shrink-0 ${className ?? ''}`} size="small" variant={variant}>
        {children}
      </Button>
    );
  }
  return (
    <button {...props} className={className} type="button">
      {children}
    </button>
  );
}
