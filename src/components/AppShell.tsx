import { createContext, useContext, useState, type CSSProperties, type ReactNode } from 'react';
import { useLink } from '../UiProvider.js';
import { Icon, type IconName } from './Icon.js';
import { Skeleton } from './Skeleton.js';

export interface ShellNavItem {
  active: boolean;
  href: string;
  label: string;
}

export interface ShellTab extends ShellNavItem {
  icon: IconName;
  loading?: boolean;
}

const collapseKey = 'graphite-sidebar-collapsed';

const ShellContext = createContext({ collapsed: false });

export function useShell() {
  return useContext(ShellContext);
}

function storedCollapsed() {
  try {
    return localStorage.getItem(collapseKey) === '1';
  } catch {
    return false;
  }
}

function storeCollapsed(collapsed: boolean) {
  try {
    localStorage.setItem(collapseKey, collapsed ? '1' : '0');
  } catch {
    return;
  }
}

export function AppShell({
  actions,
  alert,
  brand,
  children,
  footer,
  nav,
  sidebar,
  tabs,
}: {
  actions?: ReactNode;
  alert?: ReactNode;
  brand: { href: string; mark: ReactNode; name: string };
  children: ReactNode;
  footer?: ReactNode;
  nav: ShellNavItem[];
  sidebar?: ReactNode;
  tabs: ShellTab[];
}) {
  const Link = useLink();
  const [collapsed, setCollapsed] = useState(storedCollapsed);
  const toggle = () => {
    setCollapsed(!collapsed);
    storeCollapsed(!collapsed);
  };

  return (
    <ShellContext.Provider value={{ collapsed: Boolean(sidebar) && collapsed }}>
      <div className="flex min-h-screen flex-col pb-[calc(var(--tab-bar-height)+env(safe-area-inset-bottom))] md:pb-0">
        <a className="skip-link" href="#content">
          skip to content
        </a>
        <header className="sticky top-0 z-20 border-b border-line-soft bg-paper/90 backdrop-blur-md">
          <div className={sidebar ? 'shell-bar flex h-16 items-center gap-2' : 'shell flex h-16 items-center gap-6'}>
            {sidebar && (
              <button
                aria-controls="app-sidebar"
                aria-expanded={!collapsed}
                aria-label={collapsed ? 'Expand the sidebar' : 'Collapse the sidebar'}
                className="sidebar-toggle hidden md:inline-flex"
                onClick={toggle}
                title={collapsed ? 'Expand the sidebar' : 'Collapse the sidebar'}
                type="button"
              >
                <Icon name="panel" size={18} />
              </button>
            )}
            <Link
              className="flex shrink-0 items-center gap-2.5 text-lg font-semibold tracking-tight text-ink no-underline"
              href={brand.href}
            >
              {brand.mark}
              {brand.name}
            </Link>
            <nav aria-label="Primary" className="mono-sm hidden items-center gap-6 md:flex">
              {nav.map((item) => (
                <Link
                  aria-current={item.active ? 'page' : undefined}
                  className={`nav-link whitespace-nowrap no-underline ${item.active ? 'text-ink' : 'text-muted hover:text-ink'}`}
                  href={item.href}
                  key={item.href}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="ml-auto flex items-center gap-2">{actions}</div>
          </div>
          {alert}
        </header>
        {sidebar ? (
          <div className="flex flex-1">
            <aside className="sidebar-panel hidden md:block" data-collapsed={collapsed} id="app-sidebar">
              {sidebar}
            </aside>
            <div className="min-w-0 flex-1">
              <main className="shell py-8 sm:py-14" id="content">
                {children}
              </main>
            </div>
          </div>
        ) : (
          <main className="shell flex-1 py-8 sm:py-14" id="content">
            {children}
          </main>
        )}
        {footer}
        <nav aria-label="Main" className="tab-bar md:hidden" style={{ '--tab-count': tabs.length } as CSSProperties}>
          {tabs.map((tab) =>
            tab.loading ? (
              <span aria-hidden="true" className="tab-bar-item" key={tab.label}>
                <Skeleton className="h-[22px] w-[22px] rounded-full" />
                <Skeleton className="h-2.5 w-10" />
              </span>
            ) : (
              <Link
                aria-current={tab.active ? 'page' : undefined}
                className="tab-bar-item"
                href={tab.href}
                key={tab.label}
              >
                <Icon name={tab.icon} size={22} />
                <span>{tab.label}</span>
              </Link>
            ),
          )}
        </nav>
      </div>
    </ShellContext.Provider>
  );
}
