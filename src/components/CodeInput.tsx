import type { InputHTMLAttributes, ReactNode } from 'react';
import { TextField } from './Field.js';

export function CodeInput({
  length = 6,
  ...props
}: Omit<InputHTMLAttributes<HTMLInputElement>, 'maxLength' | 'pattern' | 'type'> & {
  error?: string;
  hint?: ReactNode;
  label: ReactNode;
  length?: number;
}) {
  return (
    <TextField
      autoComplete="one-time-code"
      className="code-input"
      inputMode="numeric"
      maxLength={length}
      pattern={`\\d{${length}}`}
      spellCheck={false}
      type="text"
      {...props}
    />
  );
}
