import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';
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
  const dialog = useRef<HTMLDialogElement>(null);
  const listId = useId();
  const [active, setActive] = useState(0);
  const groups = [...new Set(items.map((item) => item.group))];
  const ordered = groups.flatMap((group) => items.filter((item) => item.group === group));
  const activeItem = ordered[Math.min(active, ordered.length - 1)];
  const optionId = (item: CommandItem) => `${listId}-${item.id}`;

  useEffect(() => {
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    dialog.current?.showModal();
    return () => opener?.focus();
  }, []);

  useEffect(() => setActive(0), [query]);

  useEffect(() => {
    document.getElementById(`${listId}-${activeItem?.id}`)?.scrollIntoView?.({ block: 'nearest' });
  }, [activeItem?.id, listId]);

  function move(event: KeyboardEvent<HTMLInputElement>) {
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
    <dialog
      aria-label={label}
      className="command-palette"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      ref={dialog}
    >
      <div className="flex items-center gap-3 border-b border-line px-4">
        <span className="text-faint">
          <Icon name="search" size={18} />
        </span>
        <input
          aria-activedescendant={activeItem ? optionId(activeItem) : undefined}
          aria-autocomplete="list"
          aria-controls={listId}
          aria-expanded="true"
          aria-label={label}
          autoFocus
          className="command-input"
          onChange={(event) => onQueryChange(event.target.value)}
          onKeyDown={move}
          placeholder={placeholder}
          role="combobox"
          type="text"
          value={query}
        />
        <kbd className="mono-sm text-faint">esc</kbd>
      </div>
      <div className="command-list" id={listId} role="listbox">
        {ordered.length === 0 ? (
          <p className="m-0 px-4 py-6 text-center text-sm text-muted">{emptyLabel}</p>
        ) : (
          groups.map((group) => (
            <div aria-label={group} className="py-1.5" key={group} role="group">
              <p aria-hidden="true" className="eyebrow m-0 px-4 py-1.5">
                {group}
              </p>
              {ordered
                .filter((item) => item.group === group)
                .map((item) => {
                  const props = {
                    'aria-selected': item === activeItem,
                    className: 'command-option',
                    id: optionId(item),
                    onMouseMove: () => setActive(ordered.indexOf(item)),
                    role: 'option',
                    tabIndex: -1,
                  };
                  const content = (
                    <>
                      <span className="min-w-0 flex-1 truncate">{item.label}</span>
                      {item.hint && <span className="mono-sm shrink-0 text-faint">{item.hint}</span>}
                    </>
                  );
                  return 'href' in item ? (
                    <Link {...props} href={item.href} key={item.id} onClick={onClose}>
                      {content}
                    </Link>
                  ) : (
                    <button
                      {...props}
                      key={item.id}
                      onClick={() => {
                        onClose();
                        item.onSelect();
                      }}
                      type="button"
                    >
                      {content}
                    </button>
                  );
                })}
            </div>
          ))
        )}
      </div>
    </dialog>
  );
}
