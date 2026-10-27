import type { ReactNode } from 'react';
import { Icon, type IconName } from './Icon.js';

export type BannerTone = 'danger' | 'info' | 'success' | 'warning';

const icons: Record<BannerTone, IconName> = { danger: 'alert', info: 'info', success: 'check', warning: 'alert' };

export function Banner({
  action,
  children,
  className = '',
  title,
  tone = 'info',
}: {
  action?: ReactNode;
  children?: ReactNode;
  className?: string;
  title?: ReactNode;
  tone?: BannerTone;
}) {
  return (
    <div className={`banner ${className}`} data-tone={tone} role={tone === 'danger' || tone === 'warning' ? 'alert' : 'status'}>
      <span aria-hidden="true" className="banner-icon">
        <Icon name={icons[tone]} size={18} />
      </span>
      <div className="banner-body">
        {title && <p className="banner-title">{title}</p>}
        {children && <div>{children}</div>}
      </div>
      {action && <div className="banner-action">{action}</div>}
    </div>
  );
}
