import ListItemButton from '@mui/material/ListItemButton';
import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';
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
  const nav = useRef<HTMLElement>(null);
  const [current, setCurrent] = useState<{ height: number; top: number }>();

  useLayoutEffect(() => {
    const item = nav.current?.querySelector<HTMLElement>('.sidebar-item[aria-current="page"]');
    const next = item ? { height: item.offsetHeight, top: item.offsetTop } : undefined;
    setCurrent((shown) => (shown && next && shown.top === next.top && shown.height === next.height ? shown : next));
  }, [collapsed, loading, sections]);

  return (
    <nav aria-busy={loading || undefined} aria-label={label} className="sidebar" data-collapsed={collapsed} ref={nav}>
      {current && <span aria-hidden="true" className="sidebar-indicator" style={{ height: current.height, translate: `0 ${current.top}px` }} />}
      {loading
        ? Array.from({ length: 3 }, (_, section) => (
            <div aria-hidden="true" className="grid gap-0.5" key={section}>
              {Array.from({ length: section === 1 ? 3 : 4 }, (_, row) => (
                <span className="sidebar-item" key={row}>
                  <Skeleton className="h-[18px] w-[18px] shrink-0 rounded-md" />
                  <Skeleton className="sidebar-text h-3 w-24" />
                </span>
              ))}
            </div>
          ))
        : sections.map((section, index) => (
            <div className="sidebar-section" key={section.label ?? index}>
              {section.label && <p className="sidebar-section-label">{section.label}</p>}
              {section.items.map((item) => (
                <ListItemButton
                  aria-current={item.active ? 'page' : undefined}
                  aria-label={collapsed ? (item.badge ? `${item.label}, ${item.badge}` : item.label) : undefined}
                  className="sidebar-item"
                  component={Link}
                  href={item.href}
                  key={item.href}
                  selected={item.active}
                  title={collapsed ? item.label : undefined}
                >
                  <span className="sidebar-icon">
                    <ItemIcon icon={item.icon} label={item.label} />
                    {collapsed && item.badge ? <span aria-hidden="true" className="sidebar-dot" /> : null}
                  </span>
                  <span className="sidebar-text min-w-0 flex-1 truncate">{item.label}</span>
                  {item.badge ? <span className="sidebar-text mono-sm text-faint">{item.badge > 99 ? '99+' : item.badge}</span> : null}
                </ListItemButton>
              ))}
            </div>
          ))}
      {footer && <div className="mt-auto">{footer}</div>}
    </nav>
  );
}
