import { act } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { AppShell, ErrorState, ListSkeleton, PageHeader, Sidebar, SnackbarProvider, useSnackbar } from '../src/index.ts';
import { click, render } from './render.tsx';

function shell(loading = false) {
  return (
    <AppShell
      brand={{ href: '/', mark: null, name: 'Strata' }}
      nav={[]}
      sidebar={
        <Sidebar
          label="Areas"
          loading={loading}
          sections={[
            {
              items: [
                { active: true, href: '/', icon: 'home', label: 'Home' },
                { active: false, badge: 3, href: '/inbox', icon: 'bell', label: 'Inbox' },
              ],
            },
            { label: 'Spaces', items: [{ active: false, href: '/spaces/club', label: 'Club' }] },
          ]}
        />
      }
      tabs={[{ active: true, href: '/', icon: 'home', label: 'Home' }]}
    >
      <p>Page</p>
    </AppShell>
  );
}

describe('Collapsible sidebar', () => {
  afterEach(() => localStorage.clear());

  it('collapses to icons from the header, keeps names for assistive tech, and remembers the choice', async () => {
    const { container } = await render(shell());
    const toggle = container.querySelector<HTMLButtonElement>('header button[aria-controls="app-sidebar"]')!;
    const nav = () => container.querySelector('nav[aria-label="Areas"]')!;

    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    expect(nav().textContent).toContain('Inbox3');
    expect(nav().querySelector('.sidebar-initial')?.textContent).toBe('C');

    await click(toggle);

    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    expect(toggle.getAttribute('aria-label')).toBe('Expand the sidebar');
    expect(container.querySelector('aside')?.getAttribute('data-collapsed')).toBe('true');
    const inbox = nav().querySelector('a[href="/inbox"]')!;
    expect(inbox.textContent).toBe('');
    expect(inbox.getAttribute('aria-label')).toBe('Inbox, 3');
    expect(inbox.getAttribute('title')).toBe('Inbox');
    expect(inbox.querySelector('.sidebar-dot')).not.toBeNull();
    expect(localStorage.getItem('graphite-sidebar-collapsed')).toBe('1');
  });

  it('starts collapsed when that was the last choice', async () => {
    localStorage.setItem('graphite-sidebar-collapsed', '1');
    const { container } = await render(shell());
    expect(container.querySelector('aside')?.getAttribute('data-collapsed')).toBe('true');
  });

  it('holds the sidebar shape while it loads', async () => {
    const { container } = await render(shell(true));
    const nav = container.querySelector('nav[aria-label="Areas"]')!;
    expect(nav.getAttribute('aria-busy')).toBe('true');
    expect(nav.querySelectorAll('.skeleton').length).toBeGreaterThan(0);
    expect(nav.querySelector('a')).toBeNull();
  });
});

describe('Placeholders', () => {
  it('stay invisible for quick loads and fade in after the delay', async () => {
    vi.useFakeTimers();
    try {
      const { container } = await render(<ListSkeleton label="Loading tasks" rows={2} />);
      const placeholder = container.querySelector('[role="status"]')!;
      expect(placeholder.getAttribute('aria-busy')).toBe('true');
      expect(placeholder.classList.contains('invisible')).toBe(true);

      await act(async () => vi.advanceTimersByTime(200));
      expect(placeholder.classList.contains('invisible')).toBe(false);
    } finally {
      vi.useRealTimers();
    }
  });
});

describe('PageHeader and ErrorState', () => {
  it('lays out the title with its actions', async () => {
    const { container } = await render(<PageHeader actions={<button type="button">New</button>} title="Tasks" />);
    expect(container.querySelector('h1')?.textContent).toBe('Tasks');
    expect(container.querySelector('h1')?.className).toBe('page-heading');
    expect(container.querySelector('.page-header-actions button')?.textContent).toBe('New');
  });

  it('offers a retry', async () => {
    const onRetry = vi.fn();
    const { container } = await render(
      <ErrorState onRetry={onRetry} title="Could not load your tasks">
        Check your connection.
      </ErrorState>,
    );
    expect(container.querySelector('[role="alert"] h2')?.textContent).toBe('Could not load your tasks');
    await click(container.querySelector('button')!);
    expect(onRetry).toHaveBeenCalledOnce();
  });
});

describe('Error snacks', () => {
  it('are marked as alerts', async () => {
    function Show() {
      const show = useSnackbar();
      return (
        <button onClick={() => show({ message: 'Could not save', tone: 'error' })} type="button">
          show
        </button>
      );
    }
    const { container } = await render(
      <SnackbarProvider>
        <Show />
      </SnackbarProvider>,
    );
    await click(container.querySelector('button')!);
    const snack = container.querySelector('.snackbar')!;
    expect(snack.classList.contains('snackbar-error')).toBe(true);
    expect(snack.getAttribute('role')).toBe('alert');
  });
});
