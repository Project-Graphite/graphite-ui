import MuiDialog from '@mui/material/Dialog';
import InputBase from '@mui/material/InputBase';
import ListItemButton from '@mui/material/ListItemButton';
import ListSubheader from '@mui/material/ListSubheader';
import { useEffect, useId, useState, type KeyboardEvent } from 'react';
import { useLink } from '../UiProvider.js';
import { Icon } from './Icon.js';

export interface Command {
  group: string;
  hint?: string;
  id: string;
  label: string;
}

export type CommandItem = Command & ({ href: string } | { onSelect: () => void });

export function useCommandShortcut(open: () => void) {
  useEffect(() => {
    const listen = (event: globalThis.KeyboardEvent) => {
      if (event.key.toLowerCase() === 'k' && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        open();
      }
    };
    document.addEventListener('keydown', listen);
    return () => document.removeEventListener('keydown', listen);
  }, [open]);
}

export function CommandPalette({
  emptyLabel = 'Nothing matches',
  items,
  label = 'Search and commands',
  onClose,
  onQueryChange,
  placeholder = 'Search or run a command',
  query,
}: {
  emptyLabel?: string;
  items: CommandItem[];
  label?: string;
  onClose: () => void;
  onQueryChange: (query: string) => void;
  placeholder?: string;
  query: string;
}) {
  const Link = useLink();
  const listId = useId();
  const [active, setActive] = useState(0);
  const groups = [...new Set(items.map((item) => item.group))];
  const ordered = groups.flatMap((group) => items.filter((item) => item.group === group));
  const activeItem = ordered[Math.min(active, ordered.length - 1)];
  const optionId = (item: CommandItem) => `${listId}-${item.id}`;

  useEffect(() => {
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    return () => opener?.focus();
  }, []);

  useEffect(() => setActive(0), [query]);

  useEffect(() => {
    document.getElementById(`${listId}-${activeItem?.id}`)?.scrollIntoView?.({ block: 'nearest' });
  }, [activeItem?.id, listId]);

  function move(event: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      if (ordered.length === 0) return;
      const step = event.key === 'ArrowDown' ? 1 : -1;
      setActive((current) => (Math.min(current, ordered.length - 1) + step + ordered.length) % ordered.length);
    } else if (event.key === 'Enter' && activeItem) {
      event.preventDefault();
      document.getElementById(optionId(activeItem))?.click();
    }
  }

  return (
    <MuiDialog
      aria-label={label}
      disableAutoFocus
      fullWidth
      onClose={onClose}
      open
      slotProps={{ container: { className: 'items-start' }, paper: { className: 'mt-[12vh]' } }}
    >
      <div className="flex items-center gap-3 border-b border-line px-4">
        <span className="text-faint">
          <Icon name="search" size={18} />
        </span>
        <InputBase
          autoFocus
          className="min-h-14 flex-1"
          onChange={(event) => onQueryChange(event.target.value)}
          onKeyDown={move}
          placeholder={placeholder}
          slotProps={{
            input: {
              'aria-activedescendant': activeItem ? optionId(activeItem) : undefined,
              'aria-autocomplete': 'list',
              'aria-controls': listId,
              'aria-expanded': true,
              'aria-label': label,
              role: 'combobox',
            },
          }}
          value={query}
        />
        <kbd className="mono-sm text-faint [@media(hover:none)]:hidden">esc</kbd>
      </div>
      <div className="max-h-[min(26rem,60dvh)] overflow-y-auto" id={listId} role="listbox">
        {ordered.length === 0 ? (
          <p className="m-0 px-4 py-6 text-center text-sm text-muted">{emptyLabel}</p>
        ) : (
          groups.map((group) => (
            <div aria-label={group} className="py-1.5" key={group} role="group">
              <ListSubheader aria-hidden="true" component="div">
                {group}
              </ListSubheader>
              {ordered
                .filter((item) => item.group === group)
                .map((item) => {
                  const props = {
                    'aria-selected': item === activeItem,
                    className: 'gap-3',
                    id: optionId(item),
                    onMouseMove: () => setActive(ordered.indexOf(item)),
                    role: 'option',
                    selected: item === activeItem,
                    tabIndex: -1,
                  };
                  const content = (
                    <>
                      <span className="min-w-0 flex-1 truncate">{item.label}</span>
                      {item.hint && <span className="mono-sm shrink-0 text-faint">{item.hint}</span>}
                    </>
                  );
                  return 'href' in item ? (
                    <ListItemButton {...props} component={Link} href={item.href} key={item.id} onClick={onClose}>
                      {content}
                    </ListItemButton>
                  ) : (
                    <ListItemButton
                      {...props}
                      key={item.id}
                      onClick={() => {
                        onClose();
                        item.onSelect();
                      }}
                    >
                      {content}
                    </ListItemButton>
                  );
                })}
            </div>
          ))
        )}
      </div>
    </MuiDialog>
  );
}
