import type { ReactNode } from 'react';
import { useLink } from '../UiProvider.js';
import { useShell } from './AppShell.js';
import { Icon, type IconName } from './Icon.js';
import { Skeleton } from './Skeleton.js';

export interface SidebarItem {
  active: boolean;
  badge?: number;
  href: string;
  icon?: IconName | ReactNode;
  label: string;
}

export interface SidebarSection {
  items: SidebarItem[];
  label?: string;
}

function ItemIcon({ icon, label }: { icon: SidebarItem['icon']; label: string }) {
  if (typeof icon === 'string') return <Icon name={icon as IconName} size={18} />;
  return icon ?? <span className="sidebar-initial">{label.charAt(0).toUpperCase()}</span>;
}

export function Sidebar({
  footer,
  label,
  loading = false,
  sections,
}: {
  footer?: ReactNode;
  label: string;
  loading?: boolean;
  sections: SidebarSection[];
}) {
  const Link = useLink();
  const { collapsed } = useShell();
  return (
    <nav aria-busy={loading || undefined} aria-label={label} className="sidebar" data-collapsed={collapsed}>
      {loading
        ? Array.from({ length: 3 }, (_, section) => (
            <div aria-hidden="true" className="grid gap-0.5" key={section}>
              {Array.from({ length: section === 1 ? 3 : 4 }, (_, row) => (
                <span className="sidebar-item" key={row}>
                  <Skeleton className="h-[18px] w-[18px] shrink-0 rounded-md" />
                  {!collapsed && <Skeleton className="h-3 w-24" />}
                </span>
              ))}
            </div>
          ))
        : sections.map((section, index) => (
            <div className="sidebar-section" key={section.label ?? index}>
              {section.label && <p className="sidebar-section-label">{section.label}</p>}
              {section.items.map((item) => (
                <Link
                  aria-current={item.active ? 'page' : undefined}
                  aria-label={collapsed ? (item.badge ? `${item.label}, ${item.badge}` : item.label) : undefined}
                  className="sidebar-item"
                  href={item.href}
                  key={item.href}
                  title={collapsed ? item.label : undefined}
                >
                  <span className="sidebar-icon">
                    <ItemIcon icon={item.icon} label={item.label} />
                    {collapsed && item.badge ? <span aria-hidden="true" className="sidebar-dot" /> : null}
                  </span>
                  {!collapsed && <span className="min-w-0 flex-1 truncate">{item.label}</span>}
                  {!collapsed && item.badge ? (
                    <span className="mono-sm text-faint">{item.badge > 99 ? '99+' : item.badge}</span>
                  ) : null}
                </Link>
              ))}
            </div>
          ))}
      {footer && <div className="mt-auto">{footer}</div>}
    </nav>
  );
}
