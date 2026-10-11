import { useId, type InputHTMLAttributes, type ReactNode, type TextareaHTMLAttributes } from 'react';

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

export function TextField({
  className = '',
  error,
  hint,
  label,
  ...input
}: InputHTMLAttributes<HTMLInputElement> & { error?: string; hint?: ReactNode; label: ReactNode }) {
  const id = useId();
  return (
    <label className={`field-label ${className}`}>
      {label}
      <input
        aria-describedby={describedBy(id, error, hint)}
        aria-invalid={error ? true : undefined}
        {...input}
      />
      <FieldMessage error={error} hint={hint} id={id} />
    </label>
  );
}

export function TextAreaField({
  error,
  hint,
  label,
  ...textarea
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { error?: string; hint?: ReactNode; label: ReactNode }) {
  const id = useId();
  return (
    <label className="field-label">
      {label}
      <textarea
        aria-describedby={describedBy(id, error, hint)}
        aria-invalid={error ? true : undefined}
        {...textarea}
      />
      <FieldMessage error={error} hint={hint} id={id} />
    </label>
  );
}
