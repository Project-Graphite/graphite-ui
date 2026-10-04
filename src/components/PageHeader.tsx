import type { ReactNode } from 'react';

export function PageHeader({
  actions,
  children,
  eyebrow,
  title,
}: {
  actions?: ReactNode;
  children?: ReactNode;
  eyebrow?: ReactNode;
  title: ReactNode;
}) {
  return (
    <header className="page-header">
      <div className="min-w-0">
        {eyebrow && <p className="page-header-eyebrow">{eyebrow}</p>}
        <h1 className="page-heading">
          {title}
        </h1>
        {children && <div className="page-header-description">{children}</div>}
      </div>
      {actions && <div className="page-header-actions">{actions}</div>}
    </header>
  );
}
