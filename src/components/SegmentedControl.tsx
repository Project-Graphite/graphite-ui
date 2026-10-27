import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { Icon, type IconName } from './Icon.js';

export interface SegmentedOption<Value extends string> {
  icon?: IconName;
  label: string;
  value: Value;
  hideLabel?: boolean;
}

export function SegmentedControl<Value extends string>({
  className,
  label,
  onChange,
  options,
  size = 'small',
  value,
}: {
  className?: string;
  label: string;
  onChange: (value: Value) => void;
  options: SegmentedOption<Value>[];
  size?: 'medium' | 'small';
  value: Value;
}) {
  return (
    <ToggleButtonGroup
      aria-label={label}
      className={className}
      exclusive
      onChange={(_, next: Value | null) => next !== null && onChange(next)}
      size={size}
      value={value}
    >
      {options.map((option) => (
        <ToggleButton
          aria-label={option.hideLabel ? option.label : undefined}
          className="gap-1.5 normal-case"
          key={option.value}
          title={option.hideLabel ? option.label : undefined}
          value={option.value}
        >
          {option.icon && <Icon name={option.icon} size={16} />}
          {!option.hideLabel && option.label}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}
