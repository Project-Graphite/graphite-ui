import type { ReactNode } from 'react';
import { useLink } from '../UiProvider.js';

export function ListRow({
  children,
  className = '',
  dense = false,
  href,
  label,
  lead,
  meta,
  onClick,
  selected = false,
  title,
  trail,
}: {
  children?: ReactNode;
  className?: string;
  dense?: boolean;
  href?: string;
  label?: string;
  lead?: ReactNode;
  meta?: ReactNode;
  onClick?: () => void;
  selected?: boolean;
  title: ReactNode;
  trail?: ReactNode;
}) {
  const Link = useLink();
  const content = (
    <>
      {lead && <span className="list-row-lead">{lead}</span>}
      <span className="list-row-text">
        <span className="list-row-title">{title}</span>
        {meta && <span className="list-row-meta">{meta}</span>}
        {children}
      </span>
    </>
  );
  return (
    <li className={`list-row ${className}`} data-dense={dense || undefined} data-selected={selected || undefined}>
      {href ? (
        <Link aria-current={selected ? 'page' : undefined} aria-label={label} className="list-row-main" href={href}>
          {content}
        </Link>
      ) : onClick ? (
        <button aria-label={label} aria-pressed={selected || undefined} className="list-row-main" onClick={onClick} type="button">
          {content}
        </button>
      ) : (
        <div className="list-row-main">{content}</div>
      )}
      {trail && <span className="list-row-trail">{trail}</span>}
    </li>
  );
}
