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
  const content = (
    <>
      <span aria-hidden="true" className="tag-dot" />
      {label}
    </>
  );
  return (
    <span className={`tag-chip tag-${color}`}>
      {href ? (
        <Link className="tag-chip-label" href={href}>
          {content}
        </Link>
      ) : (
        <span className="tag-chip-label">{content}</span>
      )}
      {onRemove && (
        <button aria-label={`Remove ${label}`} className="tag-chip-remove" onClick={onRemove} type="button">
          ×
        </button>
      )}
    </span>
  );
}
