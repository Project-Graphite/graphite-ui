import { describe, expect, it, vi } from 'vitest';
import { TextAreaField, TextField, Toggle } from '../src/index.ts';
import { click, render } from './render.tsx';

describe('TextField and TextAreaField', () => {
  it('links an error to the input and marks it invalid', async () => {
    const { container } = await render(<TextField error="Enter a handle." label="Handle" name="handle" />);

    const input = container.querySelector('input')!;
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(document.getElementById(input.getAttribute('aria-describedby')!)?.textContent).toBe('Enter a handle.');
  });

  it('links a hint when there is no error', async () => {
    const { container } = await render(<TextAreaField hint="Markdown works." label="Bio" />);

    const textarea = container.querySelector('textarea')!;
    expect(textarea.hasAttribute('aria-invalid')).toBe(false);
    expect(document.getElementById(textarea.getAttribute('aria-describedby')!)?.className).toBe('field-hint');
  });
});

describe('Toggle', () => {
  it('is a labelled switch that reports the next state', async () => {
    const onChange = vi.fn();
    const { container } = await render(<Toggle checked={false} label="Public profile" onChange={onChange} />);

    const toggle = container.querySelector('[role="switch"]')!;
    expect(toggle.getAttribute('aria-checked')).toBe('false');
    expect(document.getElementById(toggle.getAttribute('aria-labelledby')!)?.textContent).toBe('Public profile');

    await click(toggle);
    expect(onChange).toHaveBeenCalledWith(true);
  });
});
