import type { ReactNode } from 'react';
import { useLink } from '../UiProvider.js';
import { Icon, type IconName } from './Icon.js';

export interface SidebarItem {
  active: boolean;
  badge?: number;
  href: string;
  icon?: IconName;
  label: string;
}

export interface SidebarSection {
  items: SidebarItem[];
  label?: string;
}

export function Sidebar({
  footer,
  label,
  sections,
}: {
  footer?: ReactNode;
  label: string;
  sections: SidebarSection[];
}) {
  const Link = useLink();
  return (
    <nav aria-label={label} className="sidebar">
      {sections.map((section, index) => (
        <div className="grid gap-0.5" key={section.label ?? index}>
          {section.label && <p className="eyebrow m-0 px-3 pb-1.5">{section.label}</p>}
          {section.items.map((item) => (
            <Link
              aria-current={item.active ? 'page' : undefined}
              className="sidebar-item"
              href={item.href}
              key={item.href}
            >
              {item.icon && <Icon name={item.icon} size={18} />}
              <span className="min-w-0 flex-1 truncate">{item.label}</span>
              {item.badge ? <span className="mono-sm text-faint">{item.badge > 99 ? '99+' : item.badge}</span> : null}
            </Link>
          ))}
        </div>
      ))}
      {footer && <div className="mt-auto">{footer}</div>}
    </nav>
  );
}
