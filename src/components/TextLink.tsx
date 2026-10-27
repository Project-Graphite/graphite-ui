import MuiLink from '@mui/material/Link';
import type { ReactNode } from 'react';
import { useLink } from '../UiProvider.js';

export function TextLink({
  children,
  className,
  external = false,
  href,
  onClick,
}: { children: ReactNode; className?: string } & (
  | { external?: boolean; href: string; onClick?: never }
  | { external?: never; href?: never; onClick: () => void }
)) {
  const Link = useLink();
  if (onClick) {
    return (
      <MuiLink className={className} component="button" onClick={onClick} type="button" underline="always">
        {children}
      </MuiLink>
    );
  }
  return external ? (
    <MuiLink className={className} href={href} rel="noopener noreferrer" target="_blank" underline="always">
      {children}
    </MuiLink>
  ) : (
    <MuiLink className={className} component={Link} href={href} underline="always">
      {children}
    </MuiLink>
  );
}
