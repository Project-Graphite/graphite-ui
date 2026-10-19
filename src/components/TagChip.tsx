import Chip from '@mui/material/Chip';
import { useLink } from '../UiProvider.js';

export const tagColors = ['gray', 'red', 'orange', 'yellow', 'green', 'teal', 'blue', 'purple', 'pink'] as const;

export type TagColor = (typeof tagColors)[number];

export function TagChip({
  color = 'gray',
  href,
  label,
  onRemove,
}: {
  color?: TagColor;
  href?: string;
  label: string;
  onRemove?: () => void;
}) {
  const Link = useLink();
  const chip = {
    className: `tag-chip tag-${color}`,
    icon: <span aria-hidden="true" className="tag-dot ml-2" />,
    label,
    onDelete: onRemove,
    size: 'small',
    variant: 'outlined',
  } as const;
  return href ? <Chip {...chip} clickable component={Link} href={href} /> : <Chip {...chip} />;
}
