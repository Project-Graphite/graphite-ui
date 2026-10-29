import MuiTextField, { type TextFieldProps } from '@mui/material/TextField';
import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from 'react';
import { useFieldAutoFocus } from '../lib/overlay.js';

export interface TriggerLook {
  quiet?: boolean;
  size?: 'default' | 'small';
}

interface FieldText {
  error?: string;
  hint?: ReactNode;
  label: ReactNode;
}

function fieldProps({
  autoComplete,
  autoFocus,
  className,
  defaultValue,
  disabled,
  error,
  hint,
  id,
  label,
  name,
  onBlur,
  onChange,
  onFocus,
  placeholder,
  required,
  value,
  ...htmlInput
}: (InputHTMLAttributes<HTMLInputElement> | TextareaHTMLAttributes<HTMLTextAreaElement>) & FieldText): TextFieldProps {
  return {
    autoComplete,
    autoFocus,
    className,
    defaultValue,
    disabled,
    error: Boolean(error),
    fullWidth: true,
    helperText: error ?? hint,
    id,
    label,
    name,
    onBlur,
    onChange,
    onFocus,
    placeholder,
    required,
    slotProps: { htmlInput: { 'aria-invalid': error ? true : undefined, ...htmlInput } },
    value,
  };
}

export function TextField({ autoFocus, type, ...props }: InputHTMLAttributes<HTMLInputElement> & FieldText) {
  return <MuiTextField {...fieldProps({ ...props, autoFocus: useFieldAutoFocus(autoFocus) })} type={type} />;
}

export function TextAreaField({ autoFocus, rows, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement> & FieldText) {
  return <MuiTextField {...fieldProps({ ...props, autoFocus: useFieldAutoFocus(autoFocus) })} minRows={rows} multiline />;
}
