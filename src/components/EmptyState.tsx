import type { ReactNode } from 'react';
import { Icon, type IconName } from './Icon.js';

export function EmptyState({
  action,
  children,
  icon,
  level = 2,
  title,
  variant = 'section',
}: {
  action?: ReactNode;
  children?: ReactNode;
  icon?: IconName;
  level?: 2 | 3 | 4 | 5 | 6;
  title: string;
  variant?: 'filtered' | 'page' | 'section' | 'widget';
}) {
  const Heading = `h${level}` as const;
  if (variant === 'widget') {
    return (
      <div className="empty-state" data-variant="widget">
        {icon && (
          <span aria-hidden="true" className="empty-state-icon">
            <Icon name={icon} size={16} />
          </span>
        )}
        <p className="m-0 min-w-0 truncate">{title}</p>
        {action && <div className="empty-state-action">{action}</div>}
      </div>
    );
  }
  return (
    <div className="empty-state" data-variant={variant}>
      {icon && (
        <span aria-hidden="true" className="empty-state-icon">
          <Icon name={icon} size={20} />
        </span>
      )}
      <Heading className={`m-0 ${variant === 'page' ? 'text-title' : 'text-h2'}`}>{title}</Heading>
      {children && <div className="empty-state-body">{children}</div>}
      {action && <div className="empty-state-action">{action}</div>}
    </div>
  );
}
