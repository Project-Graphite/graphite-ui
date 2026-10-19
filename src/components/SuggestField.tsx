import Autocomplete from '@mui/material/Autocomplete';
import MuiTextField from '@mui/material/TextField';
import type { InputHTMLAttributes, ReactNode } from 'react';

export function SuggestField({
  className,
  defaultValue,
  error,
  hint,
  label,
  onPick,
  suggestions,
  ...input
}: Omit<InputHTMLAttributes<HTMLInputElement>, 'defaultValue' | 'onBlur' | 'onChange' | 'onFocus' | 'onKeyDown' | 'onMouseDown' | 'value'> & {
  defaultValue?: string;
  error?: string;
  hint?: ReactNode;
  label: ReactNode;
  onPick?: (value: string) => void;
  suggestions: string[];
}) {
  return (
    <Autocomplete
      autoHighlight
      className={className}
      defaultValue={defaultValue}
      filterOptions={(list, state) => {
        const words = state.inputValue.trim().toLowerCase();
        if (!words) return [];
        return list.filter((suggestion) => suggestion.toLowerCase().includes(words) && suggestion.toLowerCase() !== words).slice(0, 8);
      }}
      freeSolo
      onChange={(_, value, reason) => {
        if (reason === 'selectOption' && value) onPick?.(value);
      }}
      options={suggestions}
      renderInput={(params) => (
        <MuiTextField
          {...params}
          error={Boolean(error)}
          helperText={error ?? hint}
          label={label}
          slotProps={{ ...params.slotProps, htmlInput: { ...input, ...params.slotProps.htmlInput } }}
        />
      )}
    />
  );
}
