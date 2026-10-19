import InputAdornment from '@mui/material/InputAdornment';
import MuiTextField from '@mui/material/TextField';
import type { KeyboardEvent, ReactNode, Ref } from 'react';
import type { TriggerLook } from './Field.js';
import { Icon, type IconName } from './Icon.js';

export function PickerField({
  'aria-label': ariaLabel,
  className,
  disabled,
  error,
  fieldRef,
  haspopup,
  hint,
  icon,
  label,
  onOpen,
  open,
  placeholder,
  quiet,
  rootRef,
  size,
  value,
}: TriggerLook & {
  'aria-label'?: string;
  className?: string;
  disabled?: boolean;
  error?: string;
  fieldRef: Ref<HTMLInputElement>;
  haspopup: 'dialog' | 'listbox';
  hint?: ReactNode;
  icon: IconName;
  label?: ReactNode;
  onOpen: () => void;
  open: boolean;
  placeholder?: string;
  rootRef: Ref<HTMLDivElement>;
  value: string;
}) {
  return (
    <MuiTextField
      className={className}
      disabled={disabled}
      error={Boolean(error)}
      fullWidth={Boolean(label)}
      helperText={error ?? hint}
      inputRef={fieldRef}
      label={label}
      onClick={onOpen}
      placeholder={placeholder}
      ref={rootRef}
      size={size === 'small' ? 'small' : 'medium'}
      slotProps={{
        htmlInput: {
          'aria-expanded': open,
          'aria-haspopup': haspopup,
          'aria-label': ariaLabel,
          className: 'cursor-pointer',
          onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => {
            if (['ArrowDown', 'Enter', ' '].includes(event.key)) {
              event.preventDefault();
              onOpen();
            }
          },
          readOnly: true,
        },
        input: {
          endAdornment: (
            <InputAdornment position="end">
              <Icon name={icon} size={18} />
            </InputAdornment>
          ),
        },
      }}
      value={value}
      variant={quiet ? 'standard' : 'outlined'}
    />
  );
}
