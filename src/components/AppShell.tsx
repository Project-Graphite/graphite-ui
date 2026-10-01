import type { CSSProperties, ReactNode } from 'react';
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

export function AppShell({
  actions,
  alert,
  brand,
  children,
  footer,
  nav,
  tabs,
}: {
  actions?: ReactNode;
  alert?: ReactNode;
  brand: { href: string; mark: ReactNode; name: string };
  children: ReactNode;
  footer?: ReactNode;
  nav: ShellNavItem[];
  tabs: ShellTab[];
}) {
  const Link = useLink();
  return (
    <div className="flex min-h-screen flex-col pb-[calc(var(--tab-bar-height)+env(safe-area-inset-bottom))] md:pb-0">
      <a className="skip-link" href="#content">
        skip to content
      </a>
      <header className="sticky top-0 z-20 border-b border-line-soft bg-paper/90 backdrop-blur-md">
        <div className="shell flex h-16 items-center gap-6">
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
      <main className="shell flex-1 py-8 sm:py-14" id="content">
        {children}
      </main>
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
  );
}
