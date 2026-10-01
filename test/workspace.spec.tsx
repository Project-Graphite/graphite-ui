import { act } from 'react';
import { describe, expect, it, vi } from 'vitest';
import {
  AppShell,
  Avatar,
  CodeInput,
  CommandPalette,
  Sidebar,
  Tabs,
  TagChip,
  useCommandShortcut,
  type CommandItem,
} from '../src/index.ts';
import { click, press, render } from './render.tsx';

describe('Tabs', () => {
  it('marks the current tab', async () => {
    const { container } = await render(
      <Tabs
        items={[
          { active: false, href: '/settings', label: 'Profile' },
          { active: true, href: '/settings/security', label: 'Security' },
        ]}
        label="Settings"
      />,
    );

    expect(container.querySelector('nav')?.getAttribute('aria-label')).toBe('Settings');
    expect(container.querySelector('[aria-current="page"]')?.textContent).toBe('Security');
  });
});

describe('TagChip', () => {
  it('shows the colour and offers removal with a named button', async () => {
    const onRemove = vi.fn();
    const { container } = await render(<TagChip color="teal" label="Trip" onRemove={onRemove} />);

    expect(container.querySelector('.tag-chip')?.classList.contains('tag-teal')).toBe(true);
    await click(container.querySelector('button[aria-label="Remove Trip"]')!);
    expect(onRemove).toHaveBeenCalledOnce();
  });

  it('links to a filter when given an href', async () => {
    const { container } = await render(<TagChip href="/tags/trip" label="Trip" />);
    expect(container.querySelector('a')?.getAttribute('href')).toBe('/tags/trip');
  });
});

describe('Avatar', () => {
  it('shows the initial and announces presence', async () => {
    const { container } = await render(<Avatar name="amr" present />);

    const avatar = container.querySelector('[role="img"]')!;
    expect(avatar.textContent).toBe('A');
    expect(avatar.getAttribute('aria-label')).toBe('amr, here now');
    expect(avatar.querySelector('.presence-dot')).not.toBeNull();
  });
});

describe('CodeInput', () => {
  it('asks for a numeric one-time code of the given length', async () => {
    const { container } = await render(<CodeInput label="Code" name="code" />);

    const input = container.querySelector('input')!;
    expect(input.getAttribute('autocomplete')).toBe('one-time-code');
    expect(input.getAttribute('inputmode')).toBe('numeric');
    expect(input.maxLength).toBe(6);
    expect(input.getAttribute('pattern')).toBe('\\d{6}');
  });
});

describe('Sidebar and AppShell', () => {
  it('renders the sidebar beside the page with the current item marked', async () => {
    const { container } = await render(
      <AppShell
        brand={{ href: '/', mark: null, name: 'Strata' }}
        nav={[]}
        sidebar={
          <Sidebar
            label="Areas"
            sections={[
              {
                label: 'personal',
                items: [
                  { active: true, href: '/', icon: 'home', label: 'Home' },
                  { active: false, badge: 120, href: '/inbox', icon: 'bell', label: 'Inbox' },
                ],
              },
            ]}
          />
        }
        tabs={[{ active: true, href: '/', icon: 'home', label: 'Home' }]}
      >
        <p>Page</p>
      </AppShell>,
    );

    const sidebar = container.querySelector('aside nav[aria-label="Areas"]')!;
    expect(sidebar.querySelector('[aria-current="page"]')?.textContent).toBe('Home');
    expect(sidebar.textContent).toContain('99+');
    expect(container.querySelector('aside + main#content')?.textContent).toBe('Page');
  });
});

describe('CommandPalette', () => {
  const items: CommandItem[] = [
    { group: 'Go to', href: '/notes', id: 'notes', label: 'Notes' },
    { group: 'Go to', href: '/agenda', id: 'agenda', label: 'Agenda' },
    { group: 'Actions', id: 'new-task', label: 'New task', onSelect: vi.fn() },
  ];

  async function open(onClose = vi.fn(), list = items) {
    const view = await render(
      <CommandPalette items={list} onClose={onClose} onQueryChange={() => {}} query="" />,
    );
    const input = view.container.querySelector<HTMLInputElement>('input[role="combobox"]')!;
    return { ...view, input, onClose };
  }

  it('opens as a modal with the first result active', async () => {
    const { container, input } = await open();

    expect(container.querySelector('dialog')?.open).toBe(true);
    const active = document.getElementById(input.getAttribute('aria-activedescendant')!);
    expect(active?.textContent).toBe('Notes');
    expect(active?.getAttribute('aria-selected')).toBe('true');
  });

  it('moves through every group with the arrow keys and wraps', async () => {
    const { input } = await open();
    const activeLabel = () => document.getElementById(input.getAttribute('aria-activedescendant')!)?.textContent;

    await press(input, 'ArrowDown');
    expect(activeLabel()).toBe('Agenda');
    await press(input, 'ArrowDown');
    expect(activeLabel()).toBe('New task');
    await press(input, 'ArrowDown');
    expect(activeLabel()).toBe('Notes');
    await press(input, 'ArrowUp');
    expect(activeLabel()).toBe('New task');
  });

  it('runs the active action on Enter and closes', async () => {
    const onSelect = vi.fn();
    const { input, onClose } = await open(vi.fn(), [{ group: 'Actions', id: 'a', label: 'New note', onSelect }]);

    await press(input, 'Enter');

    expect(onSelect).toHaveBeenCalledOnce();
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('says when nothing matches', async () => {
    const { container } = await open(vi.fn(), []);
    expect(container.querySelector('[role="listbox"]')?.textContent).toBe('Nothing matches');
  });

  it('opens from Ctrl+K or Cmd+K', async () => {
    const onOpen = vi.fn();
    function Shortcut() {
      useCommandShortcut(onOpen);
      return null;
    }
    await render(<Shortcut />);

    await act(async () => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }));
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'K', metaKey: true }));
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k' }));
    });

    expect(onOpen).toHaveBeenCalledTimes(2);
  });
});
