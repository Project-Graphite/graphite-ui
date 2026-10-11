import { useId, useLayoutEffect, useRef, useState, type InputHTMLAttributes, type ReactNode } from 'react';
import { useAnchoredPanel } from '../lib/useAnchoredPanel.js';
import { describedBy, FieldMessage } from './Field.js';

export function SuggestField({
  className = '',
  defaultValue,
  error,
  hint,
  label,
  onPick,
  suggestions,
  ...input
}: Omit<InputHTMLAttributes<HTMLInputElement>, 'defaultValue' | 'value'> & {
  defaultValue?: string;
  error?: string;
  hint?: ReactNode;
  label: ReactNode;
  onPick?: (value: string) => void;
  suggestions: string[];
}) {
  const id = useId();
  const [query, setQuery] = useState(defaultValue ?? '');
  const [active, setActive] = useState(0);
  const list = useRef<HTMLDivElement>(null);
  const { close, open, panel, place, root, setOpen, trigger } = useAnchoredPanel<HTMLInputElement, HTMLDivElement>();
  const matches = (text: string) => {
    const words = text.trim().toLowerCase();
    if (!words) return [];
    return suggestions.filter((suggestion) => suggestion.toLowerCase().includes(words) && suggestion.toLowerCase() !== words).slice(0, 8);
  };
  const shown = matches(query);
  const expanded = open && shown.length > 0;

  useLayoutEffect(() => {
    if (!expanded) return;
    place();
    list.current?.querySelector('[data-active="true"]')?.scrollIntoView({ block: 'nearest' });
  }, [active, expanded, place, shown.length]);

  function pick(value: string) {
    if (trigger.current) trigger.current.value = value;
    setQuery(value);
    close();
    onPick?.(value);
  }

  return (
    <div className={`field-label ${className}`} ref={root}>
      <label htmlFor={`${id}-input`}>{label}</label>
      <input
        {...input}
        aria-activedescendant={expanded ? `${id}-${active}` : undefined}
        aria-autocomplete="list"
        aria-controls={expanded ? `${id}-list` : undefined}
        aria-describedby={describedBy(id, error, hint)}
        aria-expanded={expanded}
        aria-invalid={error ? true : undefined}
        autoComplete="off"
        defaultValue={defaultValue}
        id={`${id}-input`}
        onBlur={(event) => {
          close();
          input.onBlur?.(event);
        }}
        onInput={(event) => {
          const text = event.currentTarget.value;
          setQuery(text);
          setActive(0);
          setOpen(matches(text).length > 0);
          input.onInput?.(event);
        }}
        onKeyDown={(event) => {
          if (expanded && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
            event.preventDefault();
            setActive((index) => (index + (event.key === 'ArrowDown' ? 1 : shown.length - 1)) % shown.length);
          } else if (expanded && event.key === 'Enter') {
            event.preventDefault();
            pick(shown[active]!);
          } else if (expanded && event.key === 'Escape') {
            event.preventDefault();
            close();
          }
          input.onKeyDown?.(event);
        }}
        ref={trigger}
        role="combobox"
      />
      <FieldMessage error={error} hint={hint} id={id} />
      {expanded && (
        <div className="popover-panel listbox-panel" popover="manual" ref={panel}>
          <div className="listbox-options" id={`${id}-list`} ref={list} role="listbox">
            {shown.map((suggestion, index) => (
              <div
                aria-selected={index === active}
                className="listbox-option"
                data-active={index === active}
                id={`${id}-${index}`}
                key={suggestion}
                onClick={() => pick(suggestion)}
                onPointerDown={(event) => event.preventDefault()}
                onPointerMove={() => index !== active && setActive(index)}
                role="option"
              >
                <span className="min-w-0 flex-1 truncate">{suggestion}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
