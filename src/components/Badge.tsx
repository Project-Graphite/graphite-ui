import type { ReactNode } from 'react';
import { Icon, type IconName } from './Icon.js';

export type BadgeTone = 'danger' | 'highlight' | 'ink' | 'live' | 'muted' | 'wip';

export function Badge({ children, icon, tone = 'muted' }: { children: ReactNode; icon?: IconName; tone?: BadgeTone }) {
  return (
    <span className="badge" data-tone={tone}>
      {icon && <Icon name={icon} size={16} />}
      {children}
    </span>
  );
}
