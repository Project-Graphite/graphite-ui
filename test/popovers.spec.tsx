import { describe, expect, it, vi } from 'vitest';
import { Menu, Popover } from '../src/index.ts';
import { click, press, render } from './render.tsx';

describe('Menu', () => {
  async function openMenu(onSignOut = vi.fn()) {
    const view = await render(
      <Menu
        items={[
          { label: 'Your profile', href: '/me' },
          { label: 'Settings', href: '/settings' },
          { label: 'Sign out', onSelect: onSignOut, separated: true },
        ]}
        label="Account"
        trigger="A"
        triggerLabel="Account menu for Amr"
      />,
    );
    const trigger = view.container.querySelector<HTMLButtonElement>('button[aria-haspopup="menu"]')!;
    await click(trigger);
    return { ...view, onSignOut, trigger };
  }

  it('focuses the first item and moves with the arrow keys, wrapping at the ends', async () => {
    const { container } = await openMenu();
    const menu = container.querySelector('[role="menu"]')!;

    expect(document.activeElement?.textContent).toBe('Your profile');
    await press(menu, 'ArrowUp');
    expect(document.activeElement?.textContent).toBe('Sign out');
    await press(menu, 'ArrowDown');
    expect(document.activeElement?.textContent).toBe('Your profile');
    await press(menu, 'End');
    expect(document.activeElement?.textContent).toBe('Sign out');
  });

  it('closes with Escape and returns focus to the trigger', async () => {
    const { container, trigger } = await openMenu();

    await press(container.querySelector('[role="menu"]')!, 'Escape');

    expect(container.querySelector('[role="menu"]')).toBeNull();
    expect(document.activeElement).toBe(trigger);
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
  });

  it('runs an action item and closes', async () => {
    const { container, onSignOut } = await openMenu();

    await click([...container.querySelectorAll('[role="menuitem"]')].find((item) => item.textContent === 'Sign out')!);

    expect(onSignOut).toHaveBeenCalledOnce();
    expect(container.querySelector('[role="menu"]')).toBeNull();
  });
});

describe('Popover', () => {
  it('lets its content close it and returns focus to the trigger on Escape', async () => {
    const { container } = await render(
      <Popover label="Notifications" trigger="bell" triggerLabel="Notifications">
        {(close) => (
          <button onClick={close} type="button">
            mark all read
          </button>
        )}
      </Popover>,
    );
    const trigger = container.querySelector<HTMLButtonElement>('button[aria-haspopup="dialog"]')!;

    await click(trigger);
    const panel = container.querySelector('[role="dialog"]')!;
    expect(panel.getAttribute('aria-label')).toBe('Notifications');
    await click(panel.querySelector('button')!);
    expect(container.querySelector('[role="dialog"]')).toBeNull();

    await click(trigger);
    await press(container.querySelector('[role="dialog"] button')!, 'Escape');
    expect(container.querySelector('[role="dialog"]')).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });
});
