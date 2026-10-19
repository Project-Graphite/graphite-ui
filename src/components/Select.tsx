import Autocomplete from '@mui/material/Autocomplete';
import MenuItem from '@mui/material/MenuItem';
import MuiTextField, { type TextFieldProps } from '@mui/material/TextField';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import type { TriggerLook } from './Field.js';

export interface SelectOption<T extends string = string> {
  value: T;
  label: string;
  hint?: string;
  leading?: ReactNode;
  disabled?: boolean;
}

function OptionContent({ option }: { option: SelectOption }) {
  return (
    <>
      {option.leading}
      <span className="min-w-0 flex-1 truncate">{option.label}</span>
      {option.hint && <span className="text-sm text-muted">{option.hint}</span>}
    </>
  );
}

export function Select<T extends string = string>({
  'aria-label': ariaLabel,
  className,
  defaultValue,
  disabled = false,
  error,
  fullWidth,
  hint,
  label,
  name,
  onChange,
  options,
  placeholder,
  quiet,
  searchable = false,
  size,
  value,
}: TriggerLook & {
  'aria-label'?: string;
  className?: string;
  defaultValue?: T | '';
  disabled?: boolean;
  error?: string;
  fullWidth?: boolean;
  hint?: ReactNode;
  label?: ReactNode;
  name?: string;
  onChange?: (value: T) => void;
  options: SelectOption<T>[];
  placeholder?: string;
  searchable?: boolean;
  value?: T | '';
}) {
  const [own, setOwn] = useState<T | ''>(defaultValue ?? '');
  const current = value ?? own;
  const selected = options.find((option) => option.value === current);
  const [query, setQuery] = useState('');
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const form = root.current?.closest('form');
    if (!form) return;
    const reset = () => setOwn(defaultValue ?? '');
    form.addEventListener('reset', reset);
    return () => form.removeEventListener('reset', reset);
  }, [defaultValue]);

  function choose(next: T) {
    if (value === undefined) setOwn(next);
    if (next !== current) onChange?.(next);
  }

  const field: TextFieldProps = {
    disabled,
    error: Boolean(error),
    fullWidth: fullWidth ?? Boolean(label),
    helperText: error ?? hint,
    label,
    size: size === 'small' ? 'small' : 'medium',
    variant: quiet ? 'standard' : 'outlined',
  };

  if (searchable) {
    return (
      <>
        <Autocomplete
          className={(fullWidth ?? label) ? className : `w-40 ${className ?? ''}`}
          disableClearable
          disabled={disabled}
          filterOptions={(list, state) => {
            const words = state.inputValue.trim().toLowerCase();
            return words ? list.filter((option) => `${option.label} ${option.hint ?? ''} ${option.value}`.toLowerCase().includes(words)) : list;
          }}
          getOptionDisabled={(option) => Boolean(option.disabled)}
          getOptionLabel={(option) => option.label}
          isOptionEqualToValue={(option, chosen) => option.value === chosen.value}
          noOptionsText={`Nothing matches “${query}”.`}
          onChange={(_, option) => choose(option.value)}
          onInputChange={(_, text) => setQuery(text)}
          openOnFocus
          options={options}
          ref={root}
          renderInput={(params) => (
            <MuiTextField {...params} {...field} fullWidth placeholder={placeholder} slotProps={{ ...params.slotProps, htmlInput: { ...params.slotProps.htmlInput, 'aria-label': ariaLabel } }} />
          )}
          renderOption={({ key, ...props }, option) => (
            <li key={key} {...props}>
              <OptionContent option={option} />
            </li>
          )}
          value={(selected ?? null) as SelectOption<T>}
        />
        {name && <input name={name} type="hidden" value={current} />}
      </>
    );
  }

  return (
    <MuiTextField
      {...field}
      className={className}
      name={name}
      onChange={(event) => choose(event.target.value as T)}
      ref={root}
      select
      slotProps={{
        htmlInput: { 'aria-label': ariaLabel },
        inputLabel: placeholder ? { shrink: true } : undefined,
        select: {
          displayEmpty: Boolean(placeholder),
          renderValue: () =>
            selected ? (
              <span className="flex min-w-0 items-center gap-2">
                {selected.leading}
                {selected.label}
              </span>
            ) : (
              <span className="text-faint">{placeholder}</span>
            ),
        },
      }}
      value={current}
    >
      {options.map((option) => (
        <MenuItem className="gap-2" disabled={option.disabled} key={option.value} value={option.value}>
          <OptionContent option={option} />
        </MenuItem>
      ))}
    </MuiTextField>
  );
}
