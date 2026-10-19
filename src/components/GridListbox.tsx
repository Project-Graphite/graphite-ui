import MuiPopover from '@mui/material/Popover';
import { Fragment, useRef, useState, type KeyboardEvent } from 'react';
import { Button } from './Button.js';
import { PickerField } from './PickerField.js';

export interface GridGroup {
  label: string;
  options: Array<{ label: string; value: string; wide?: boolean }>;
}

export function GridListbox({
  columns = 5,
  defaultValue,
  emptyLabel,
  groups,
  label,
  name,
}: {
  columns?: number;
  defaultValue: string;
  emptyLabel: string;
  groups: GridGroup[];
  label: string;
  name: string;
}) {
  const [value, setValue] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const field = useRef<HTMLInputElement>(null);
  const listbox = useRef<HTMLDivElement>(null);
  const selectedLabel = groups.flatMap((group) => group.options).find((option) => option.value === value)?.label;

  function focusSelected() {
    const selected =
      listbox.current?.querySelector<HTMLElement>('[aria-selected="true"]') ??
      listbox.current?.querySelector<HTMLElement>('[role="option"]');
    selected?.scrollIntoView({ block: 'center' });
    selected?.focus({ preventScroll: true });
  }

  function close() {
    setOpen(false);
    field.current?.focus();
  }

  function choose(next: string) {
    setValue(next);
    close();
  }

  function move(event: KeyboardEvent<HTMLDivElement>) {
    const options = [...(listbox.current?.querySelectorAll<HTMLElement>('[role="option"]') ?? [])];
    const current = options.indexOf(document.activeElement as HTMLElement);
    const step = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: columns, ArrowUp: -columns }[event.key];
    if (step !== undefined || event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      const target =
        event.key === 'Home'
          ? 0
          : event.key === 'End'
            ? options.length - 1
            : Math.min(options.length - 1, Math.max(0, current + (step ?? 0)));
      options[target]?.focus();
    }
  }

  const option = (optionValue: string, optionLabel: string, className?: string) => (
    <Button
      aria-selected={value === optionValue}
      className={className}
      key={optionValue}
      onClick={() => choose(optionValue)}
      role="option"
      size="small"
      variant={value === optionValue ? 'primary' : 'text'}
    >
      {optionLabel}
    </Button>
  );

  return (
    <>
      <PickerField
        fieldRef={field}
        haspopup="listbox"
        icon="chevron-down"
        label={label}
        onOpen={() => setOpen(true)}
        open={open}
        rootRef={root}
        value={selectedLabel ?? emptyLabel}
      />
      <input name={name} type="hidden" value={value} />
      <MuiPopover
        anchorEl={() => root.current!}
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
        disableAutoFocus
        onClose={close}
        open={open}
        slotProps={{ paper: { className: 'max-h-80 w-[22rem] max-w-[calc(100vw-2rem)] p-3' }, transition: { onEntered: focusSelected } }}
      >
        <div
          aria-label={label}
          className="grid gap-1"
          onKeyDown={move}
          ref={listbox}
          role="listbox"
          style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
        >
          {option('', emptyLabel, 'col-span-full')}
          {groups.map((group) => (
            <Fragment key={group.label}>
              <p className="eyebrow col-span-full mt-3 mb-1">{group.label}</p>
              {group.options.map((item) => option(item.value, item.label, item.wide ? 'col-span-full' : undefined))}
            </Fragment>
          ))}
        </div>
      </MuiPopover>
    </>
  );
}
