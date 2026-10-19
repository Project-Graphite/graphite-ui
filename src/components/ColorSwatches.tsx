import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import MuiRadio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import type { ReactNode } from 'react';
import { tagColors, type TagColor } from './TagChip.js';

export function ColorSwatches({
  defaultValue,
  label,
  name,
  onChange,
  value,
}: {
  defaultValue?: TagColor;
  label: ReactNode;
  name: string;
  onChange?: (color: TagColor) => void;
  value?: TagColor | null;
}) {
  return (
    <FormControl component="fieldset">
      <FormLabel component="legend">{label}</FormLabel>
      <RadioGroup
        defaultValue={value === undefined ? (defaultValue ?? 'gray') : undefined}
        name={name}
        onChange={(event) => onChange?.(event.target.value as TagColor)}
        row
        value={value}
      >
        {tagColors.map((color) => (
          <MuiRadio
            checkedIcon={<span className={`swatch-dot tag-${color} ring-2 ring-ink ring-offset-2 ring-offset-paper`} />}
            icon={<span className={`swatch-dot tag-${color}`} />}
            key={color}
            slotProps={{ input: { 'aria-label': color } }}
            title={color}
            value={color}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
}
