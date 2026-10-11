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
  value?: TagColor;
}) {
  return (
    <fieldset className="field-label m-0 border-0 p-0">
      <legend className="mb-1.5 p-0">{label}</legend>
      <div className="swatches">
        {tagColors.map((color) => (
          <label className="swatch" key={color} title={color}>
            <input
              aria-label={color}
              checked={value === undefined ? undefined : value === color}
              className="sr-only"
              defaultChecked={value === undefined ? (defaultValue ?? 'gray') === color : undefined}
              name={name}
              onChange={() => onChange?.(color)}
              type="radio"
              value={color}
            />
            <span aria-hidden="true" className={`swatch-dot tag-${color}`} />
          </label>
        ))}
      </div>
    </fieldset>
  );
}
