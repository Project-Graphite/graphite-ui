export function Avatar({
  name,
  present,
  size = 'md',
}: {
  name: string;
  present?: boolean;
  size?: 'sm' | 'md';
}) {
  return (
    <span aria-label={present ? `${name}, here now` : name} className={`avatar avatar-${size}`} role="img">
      <span aria-hidden="true">{name.trim().charAt(0).toUpperCase()}</span>
      {present && <span aria-hidden="true" className="presence-dot" />}
    </span>
  );
}
