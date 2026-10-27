import type { ReactNode } from 'react';
import { useLink } from '../UiProvider.js';

export function Card({
  as: Element = 'div',
  children,
  className = '',
  href,
  interactive = Boolean(href),
  padding = 'md',
}: {
  as?: 'article' | 'div' | 'li' | 'section';
  children: ReactNode;
  className?: string;
  href?: string;
  interactive?: boolean;
  padding?: 'sm' | 'md';
}) {
  const Link = useLink();
  const classes = `card ${padding === 'sm' ? 'card-sm' : ''} ${interactive ? 'card-interactive' : ''} ${className}`;
  return href ? (
    <Link className={classes} href={href}>
      {children}
    </Link>
  ) : (
    <Element className={classes}>{children}</Element>
  );
}
