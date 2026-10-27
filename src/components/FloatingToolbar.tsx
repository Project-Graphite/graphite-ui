import { forwardRef, type KeyboardEvent, type ReactNode } from 'react';
import { Icon, type IconName } from './Icon.js';

function moveFocus(event: KeyboardEvent<HTMLDivElement>) {
  const step = { ArrowLeft: -1, ArrowRight: 1, Home: -Infinity, End: Infinity }[event.key];
  if (step === undefined) return;
  const buttons = [...event.currentTarget.querySelectorAll<HTMLButtonElement>('button:not(:disabled)')];
  const current = buttons.indexOf(document.activeElement as HTMLButtonElement);
  buttons[Math.max(0, Math.min(buttons.length - 1, current + step))]?.focus();
  event.preventDefault();
}

export const FloatingToolbar = forwardRef<HTMLDivElement, { children: ReactNode; className?: string; label: string }>(function FloatingToolbar(
  { children, className = '', label },
  ref,
) {
  return (
    <div aria-label={label} className={`floating-toolbar ${className}`} onKeyDown={moveFocus} ref={ref} role="toolbar">
      {children}
    </div>
  );
});

export function ToolbarSeparator() {
  return <span aria-hidden="true" className="floating-toolbar-separator" />;
}

export function ToolbarButton({
  active,
  children,
  disabled,
  icon,
  label,
  onClick,
}: {
  active?: boolean;
  children?: ReactNode;
  disabled?: boolean;
  icon?: IconName;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      aria-label={children ? undefined : label}
      aria-pressed={active}
      className="toolbar-button"
      disabled={disabled}
      onClick={onClick}
      onMouseDown={(event) => event.preventDefault()}
      title={label}
      type="button"
    >
      {icon && <Icon name={icon} size={16} />}
      {children}
    </button>
  );
}
