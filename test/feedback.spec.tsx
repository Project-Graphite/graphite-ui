import { act } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { errorMessage, OutageGate, SnackbarProvider, timeAgo, useSnackbar } from '../src/index.ts';
import { click, render } from './render.tsx';

function ShowButton({ message }: { message: string }) {
  const show = useSnackbar();
  return (
    <button onClick={() => show({ message, action: { label: 'open', href: '/inbox' } })} type="button">
      show
    </button>
  );
}

describe('SnackbarProvider', () => {
  it('announces snacks politely and keeps at most three', async () => {
    const { container } = await render(
      <SnackbarProvider>
        <ShowButton message="Saved" />
      </SnackbarProvider>,
    );

    const button = container.querySelector('button')!;
    for (let count = 0; count < 4; count += 1) await click(button);

    const region = container.querySelector('.snackbar-region')!;
    expect(region.getAttribute('aria-live')).toBe('polite');
    expect(region.querySelectorAll('.snackbar')).toHaveLength(3);
    expect(region.querySelector('a')?.getAttribute('href')).toBe('/inbox');
  });
});

describe('OutageGate', () => {
  it('replaces the page when an outage is reported and the health check fails', async () => {
    vi.stubGlobal('fetch', vi.fn(() => Promise.resolve(new Response(null, { status: 503 }))));
    let report = () => {};
    const { container } = await render(
      <OutageGate
        healthUrl="/api/v1/health"
        offlineHint="Reconnect to carry on."
        productName="Strata"
        subscribe={(listener) => {
          report = listener;
          return () => {};
        }}
      >
        <p>Page</p>
      </OutageGate>,
    );
    expect(container.textContent).toBe('Page');

    await act(async () => report());

    expect(fetch).toHaveBeenCalledWith('/api/v1/health', expect.objectContaining({ cache: 'no-store' }));
    expect(container.querySelector('h1')?.textContent).toBe('Strata is taking a short break');
  });
});

describe('helpers', () => {
  it('uses the error message or the fallback', () => {
    expect(errorMessage(new Error('Locked'), 'Could not save')).toBe('Locked');
    expect(errorMessage('nope', 'Could not save')).toBe('Could not save');
  });

  it('describes past times relative to now', () => {
    expect(timeAgo(new Date(Date.now() - 2 * 3_600_000).toISOString())).toBe(
      new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' }).format(-2, 'hour'),
    );
  });
});
