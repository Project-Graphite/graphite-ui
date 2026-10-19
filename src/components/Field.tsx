import MuiTextField, { type TextFieldProps } from '@mui/material/TextField';
import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from 'react';

export interface TriggerLook {
  quiet?: boolean;
  size?: 'default' | 'small';
}

export function triggerClass({ quiet = false, size = 'default' }: TriggerLook) {
  return `select-trigger field-control${size === 'small' ? ' select-trigger-small' : ''}${quiet ? ' select-trigger-quiet' : ''}`;
}

export function describedBy(id: string, error?: string, hint?: ReactNode) {
  return error ? `${id}-error` : hint ? `${id}-hint` : undefined;
}

export function FieldMessage({ error, hint, id }: { error?: string; hint?: ReactNode; id: string }) {
  return error ? (
    <span className="field-error" id={`${id}-error`}>
      {error}
    </span>
  ) : hint ? (
    <span className="field-hint" id={`${id}-hint`}>
      {hint}
    </span>
  ) : (
    <span aria-hidden="true" className="field-slot" />
  );
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

export function TextField({ type, ...props }: InputHTMLAttributes<HTMLInputElement> & FieldText) {
  return <MuiTextField {...fieldProps(props)} type={type} />;
}

export function TextAreaField({ rows, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement> & FieldText) {
  return <MuiTextField {...fieldProps(props)} minRows={rows} multiline />;
}
