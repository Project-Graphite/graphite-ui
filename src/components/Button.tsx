import MuiBadge from '@mui/material/Badge';
import MuiButton,{ type ButtonProps as MuiButtonProps } from '@mui/material/Button';
import MuiIconButton, { type IconButtonProps as MuiIconButtonProps } from '@mui/material/IconButton';
import { Icon, type IconName } from './Icon.js';

export type ButtonVariant = 'primary' | 'secondary' | 'text' | 'danger';

const looks = {
  primary: { variant: 'contained' },
  secondary: { variant: 'outlined' },
  text: { variant: 'text' },
  danger: { variant: 'contained', color: 'error' },
} as const;

export function Button({
  icon,
  variant = 'secondary',
  ...props
}: Omit<MuiButtonProps, 'color' | 'startIcon' | 'variant'> & { icon?: IconName; variant?: ButtonVariant }) {
  return <MuiButton {...looks[variant]} startIcon={icon && <Icon name={icon} size={18} />} {...props} />;
}

export function IconButton({
  badge,
  icon,
  label,
  ...props
}: Omit<MuiIconButtonProps, 'aria-label' | 'children'> & { badge?: number; href?: string; icon: IconName; label: string; rel?: string; target?: string }) {
  return (
    <MuiIconButton aria-label={label} title={label} {...props}>
      {badge ? (
        <MuiBadge badgeContent={badge} color="primary" max={99}>
          <Icon name={icon} size={18} />
        </MuiBadge>
      ) : (
        <Icon name={icon} size={18} />
      )}
    </MuiIconButton>
  );
}
