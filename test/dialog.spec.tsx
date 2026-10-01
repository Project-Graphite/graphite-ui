import { act } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { ConfirmDialog, Dialog } from '../src/index.ts';
import { click, render } from './render.tsx';

describe('Dialog', () => {
  it('opens as a modal labelled by its title and closes from the close button', async () => {
    const onClose = vi.fn();
    const { container } = await render(
      <Dialog eyebrow="settings" onClose={onClose} title="Change email">
        <p>Body</p>
      </Dialog>,
    );

    const dialog = container.querySelector('dialog')!;
    expect(dialog.open).toBe(true);
    expect(document.getElementById(dialog.getAttribute('aria-labelledby')!)?.textContent).toBe('Change email');

    await click(container.querySelector('button[aria-label="Close"]')!);
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('asks the parent to close on Escape instead of closing itself', async () => {
    const onClose = vi.fn();
    const { container } = await render(
      <Dialog eyebrow="settings" onClose={onClose} title="Change email">
        <p>Body</p>
      </Dialog>,
    );

    const cancel = new Event('cancel', { cancelable: true });
    await act(async () => container.querySelector('dialog')!.dispatchEvent(cancel));

    expect(cancel.defaultPrevented).toBe(true);
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('returns focus to the element that opened it', async () => {
    const opener = document.createElement('button');
    document.body.append(opener);
    opener.focus();

    const { rerender } = await render(
      <Dialog eyebrow="settings" onClose={() => {}} title="Change email">
        <input />
      </Dialog>,
    );
    await rerender(null);

    expect(document.activeElement).toBe(opener);
    opener.remove();
  });
});

describe('ConfirmDialog', () => {
  it('shows the failure and stays open when confirming fails', async () => {
    const onClose = vi.fn();
    const { container } = await render(
      <ConfirmDialog
        confirmLabel="Delete"
        eyebrow="notes"
        onClose={onClose}
        onConfirm={() => Promise.reject(new Error('The note is locked'))}
        title="Delete this note?"
      >
        <p>Gone for good.</p>
      </ConfirmDialog>,
    );

    await click([...container.querySelectorAll('button')].find((button) => button.textContent === 'Delete')!);

    expect(container.querySelector('.error-message')?.textContent).toBe('The note is locked');
    expect(onClose).not.toHaveBeenCalled();
  });

  it('closes after a successful confirmation', async () => {
    const onClose = vi.fn();
    const onConfirm = vi.fn(() => Promise.resolve());
    const { container } = await render(
      <ConfirmDialog confirmLabel="Delete" eyebrow="notes" onClose={onClose} onConfirm={onConfirm} title="Delete?">
        <p>Gone for good.</p>
      </ConfirmDialog>,
    );

    await click([...container.querySelectorAll('button')].find((button) => button.textContent === 'Delete')!);

    expect(onConfirm).toHaveBeenCalledOnce();
    expect(onClose).toHaveBeenCalledOnce();
  });
});
