import MuiAvatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';

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
    <Badge
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      color="success"
      invisible={!present}
      overlap="circular"
      variant="dot"
    >
      <MuiAvatar aria-label={present ? `${name}, here now` : name} className={`avatar avatar-${size}`} role="img">
        <span aria-hidden="true">{name.trim().charAt(0).toUpperCase()}</span>
      </MuiAvatar>
    </Badge>
  );
}
