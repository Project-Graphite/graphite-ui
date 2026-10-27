import Chip from '@mui/material/Chip';
import { useLink } from '../UiProvider.js';
import type { TagColor } from './TagChip.js';

export function FilterChip({
  active,
  color,
  count,
  href,
  label,
  onClick,
}: {
  active: boolean;
  color?: TagColor;
  count?: number;
  href?: string;
  label: string;
  onClick?: () => void;
}) {
  const Link = useLink();
  const chip = {
    clickable: true,
    icon: color && <span aria-hidden="true" className={`swatch-dot ml-2 size-2.5 tag-${color}`} />,
    label: (
      <span className="flex min-w-0 items-center gap-1.5">
        <span className="truncate">{label}</span>
        {count !== undefined && <span className="shrink-0 text-faint tabular-nums">{count}</span>}
      </span>
    ),
    title: label,
    variant: active ? 'filled' : 'outlined',
  } as const;
  return href ? (
    <Chip {...chip} aria-current={active ? 'page' : undefined} component={Link} href={href} />
  ) : (
    <Chip {...chip} aria-pressed={active} onClick={onClick} />
  );
}
