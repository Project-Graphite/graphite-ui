import MuiCheckbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import MuiRadio from '@mui/material/Radio';
import type { InputHTMLAttributes, ReactNode } from 'react';

type ChoiceProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> & { label?: ReactNode };

function Choice({
  checked,
  className,
  defaultChecked,
  disabled,
  kind,
  label,
  name,
  onChange,
  value,
  ...input
}: ChoiceProps & { kind: 'checkbox' | 'radio' }) {
  const Control = kind === 'checkbox' ? MuiCheckbox : MuiRadio;
  const control = (
    <Control
      checked={checked}
      className={label ? undefined : className}
      defaultChecked={defaultChecked}
      disabled={disabled}
      name={name}
      onChange={onChange}
      size="small"
      slotProps={{ input }}
      value={value}
    />
  );
  return label ? <FormControlLabel className={className} control={control} disabled={disabled} label={label} /> : control;
}

export function Checkbox(props: ChoiceProps) {
  return <Choice kind="checkbox" {...props} />;
}

export function Radio(props: ChoiceProps) {
  return <Choice kind="radio" {...props} />;
}
