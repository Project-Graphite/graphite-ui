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

  it('starts on the first field instead of the close button', async () => {
    const { container } = await render(
      <Dialog onClose={() => {}} title="Change email">
        <input aria-label="Email" />
      </Dialog>,
    );

    expect(document.activeElement).toBe(container.querySelector('input'));
  });

  it('cannot be dismissed when it must be acknowledged', async () => {
    const onClose = vi.fn();
    const { container } = await render(
      <Dialog dismissible={false} onClose={onClose} title="Your recovery code">
        <button onClick={onClose} type="button">
          Done
        </button>
      </Dialog>,
    );
    const dialog = container.querySelector('dialog')!;
    const escape = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true });
    const cancel = new Event('cancel', { cancelable: true });

    await act(async () => {
      dialog.dispatchEvent(escape);
      dialog.dispatchEvent(cancel);
    });
    await click(dialog);

    expect(container.querySelector('button[aria-label="Close"]')).toBeNull();
    expect(escape.defaultPrevented).toBe(true);
    expect(cancel.defaultPrevented).toBe(true);
    expect(onClose).not.toHaveBeenCalled();
  });

  it('closes from the backdrop until a field is edited', async () => {
    const onClose = vi.fn();
    const form = (
      <Dialog onClose={onClose} title="Rename">
        <input aria-label="Name" />
      </Dialog>
    );

    const pristine = await render(form);
    await click(pristine.container.querySelector('dialog')!);
    expect(onClose).toHaveBeenCalledOnce();

    const edited = await render(form);
    const input = edited.container.querySelector('input')!;
    await act(async () => {
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!.call(input, 'Garden');
      input.dispatchEvent(new Event('input', { bubbles: true }));
    });
    await click(edited.container.querySelector('dialog')!);
    expect(onClose).toHaveBeenCalledOnce();

    await click(edited.container.querySelector('button[aria-label="Close"]')!);
    expect(onClose).toHaveBeenCalledTimes(2);
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

  it('marks a destructive confirmation with the danger button', async () => {
    const view = (tone?: 'danger') => (
      <ConfirmDialog confirmLabel="Delete" onClose={() => {}} onConfirm={() => Promise.resolve()} title="Delete?" tone={tone}>
        <p>Gone for good.</p>
      </ConfirmDialog>
    );
    const confirmButton = (container: HTMLElement) =>
      [...container.querySelectorAll('button')].find((button) => button.textContent === 'Delete')!;

    const plain = await render(view());
    expect(confirmButton(plain.container).className).toBe('primary-button');

    const danger = await render(view('danger'));
    expect(confirmButton(danger.container).className).toBe('danger-button');
  });
});
