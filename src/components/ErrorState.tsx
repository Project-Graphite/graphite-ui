import type { ReactNode } from 'react';
import { Button } from './Button.js';
import { Icon } from './Icon.js';

export function ErrorState({
  action,
  children,
  onRetry,
  title,
}: {
  action?: ReactNode;
  children?: ReactNode;
  onRetry?: () => void;
  title: string;
}) {
  return (
    <div className="error-state" role="alert">
      <span className="error-state-icon">
        <Icon name="alert" size={22} />
      </span>
      <h2 className="m-0 text-h2">{title}</h2>
      {children && <div className="max-w-md text-sm text-muted">{children}</div>}
      {(onRetry || action) && (
        <div className="mt-2 flex flex-wrap justify-center gap-2">
          {onRetry && (
            <Button icon="refresh" onClick={onRetry} size="small">
              Try again
            </Button>
          )}
          {action}
        </div>
      )}
    </div>
  );
}
