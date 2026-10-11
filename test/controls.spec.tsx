import { act } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { ColorSwatches, DatePicker, Meter, Select, SuggestField, TimePicker, useSettled } from '../src/index.ts';
import { click, press, render } from './render.tsx';

const fruit = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry', hint: 'red' },
];

const options = () => [...document.querySelectorAll('[role="option"]')].map((option) => option.textContent);

describe('Select', () => {
  it('shows the chosen label, picks by keyboard and keeps the value for forms', async () => {
    const onChange = vi.fn();
    const { container } = await render(
      <form>
        <Select defaultValue="banana" label="Fruit" name="fruit" onChange={onChange} options={fruit} />
      </form>,
    );
    const trigger = container.querySelector<HTMLButtonElement>('[role="combobox"]')!;
    expect(trigger.textContent).toBe('Banana');
    expect(document.getElementById(trigger.getAttribute('aria-labelledby')!)?.textContent).toBe('Fruit');
    expect(new FormData(container.querySelector('form')!).get('fruit')).toBe('banana');

    await press(trigger, 'ArrowDown');
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(options()).toEqual(['Apple', 'Banana', 'Cherryred']);
    const list = document.querySelector('[role="listbox"]')!;
    expect(list.getAttribute('aria-activedescendant')).toBe(document.querySelector('[aria-selected="true"]')!.id);

    await press(list, 'ArrowDown');
    await press(list, 'Enter');
    expect(onChange).toHaveBeenCalledWith('cherry');
    expect(trigger.textContent).toBe('Cherry');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(new FormData(container.querySelector('form')!).get('fruit')).toBe('cherry');

    await act(async () => container.querySelector('form')!.reset());
    expect(trigger.textContent).toBe('Banana');
  });

  it('jumps to an option by typing and closes on Escape', async () => {
    const { container } = await render(<Select aria-label="Fruit" options={fruit} placeholder="Pick one" />);
    const trigger = container.querySelector<HTMLButtonElement>('[role="combobox"]')!;
    expect(trigger.textContent).toBe('Pick one');

    await click(trigger);
    const list = document.querySelector('[role="listbox"]')!;
    await press(list, 'c');
    expect(document.querySelector('[data-active="true"]')?.textContent).toContain('Cherry');
    await press(list, 'Escape');
    expect(document.querySelector('[role="listbox"]')).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });

  it('filters long lists when searchable', async () => {
    const { container } = await render(<Select label="Fruit" options={fruit} searchable />);
    await click(container.querySelector('[role="combobox"]')!);
    const search = document.querySelector<HTMLInputElement>('.listbox-search input')!;
    expect(document.activeElement).toBe(search);

    await act(async () => {
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!.call(search, 'red');
      search.dispatchEvent(new Event('input', { bubbles: true }));
    });
    expect(options()).toEqual(['Cherryred']);

    await act(async () => {
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!.call(search, 'kiwi');
      search.dispatchEvent(new Event('input', { bubbles: true }));
    });
    expect(document.querySelector('.listbox-empty')?.textContent).toBe('Nothing matches “kiwi”.');
  });
});

describe('DatePicker', () => {
  it('opens on the chosen month, moves by keyboard and stores an ISO date', async () => {
    const onChange = vi.fn();
    const { container } = await render(
      <form>
        <DatePicker defaultValue="2026-10-14" label="Due" name="due" onChange={onChange} />
      </form>,
    );
    const trigger = container.querySelector<HTMLButtonElement>('button')!;
    expect(trigger.textContent).toContain('2026');
    expect(new FormData(container.querySelector('form')!).get('due')).toBe('2026-10-14');

    await click(trigger);
    expect(document.querySelector('.date-panel-head')?.textContent).toContain('October 2026');
    expect(document.querySelector('[aria-pressed="true"]')?.getAttribute('data-day')).toBe('2026-10-14');

    const grid = document.querySelector('[role="grid"]')!;
    await press(grid, 'ArrowDown');
    expect(document.activeElement?.getAttribute('data-day')).toBe('2026-10-21');
    await press(grid, 'PageDown');
    expect(document.querySelector('.date-panel-head')?.textContent).toContain('November 2026');

    await click(document.querySelector('[data-day="2026-11-21"]')!);
    expect(onChange).toHaveBeenCalledWith('2026-11-21');
    expect(new FormData(container.querySelector('form')!).get('due')).toBe('2026-11-21');

    await click(trigger);
    await click([...document.querySelectorAll('.date-panel-foot button')].find((button) => button.textContent === 'Clear')!);
    expect(trigger.textContent).toBe('Choose a date');
  });

  it('starts weeks on Monday and refuses days outside the range', async () => {
    const { container } = await render(<DatePicker aria-label="Day" defaultValue="2026-10-14" max="2026-10-20" min="2026-10-10" />);
    await click(container.querySelector('button')!);

    expect(document.querySelectorAll('.date-day')[0]?.getAttribute('data-day')).toBe('2026-09-28');
    expect(document.querySelector<HTMLButtonElement>('[data-day="2026-10-09"]')!.disabled).toBe(true);
    expect(document.querySelector<HTMLButtonElement>('[data-day="2026-10-10"]')!.disabled).toBe(false);
  });
});

describe('TimePicker', () => {
  it('offers quarter hours, keeps an unusual time and can be cleared', async () => {
    const onChange = vi.fn();
    const { container } = await render(<TimePicker defaultValue="09:10" label="Time" name="time" onChange={onChange} />);
    await click(container.querySelector('[role="combobox"]')!);

    const listed = options();
    expect(listed.slice(0, 3)).toEqual(['No time', '00:00', '00:15']);
    expect(listed).toContain('09:10');
    expect(listed).toHaveLength(98);

    await click([...document.querySelectorAll('[role="option"]')].find((option) => option.textContent === 'No time')!);
    expect(onChange).toHaveBeenCalledWith('');
  });
});

describe('ColorSwatches', () => {
  it('is a labelled radio group with the default colour chosen', async () => {
    const { container } = await render(
      <form>
        <ColorSwatches defaultValue="teal" label="Colour" name="color" />
      </form>,
    );
    expect(container.querySelector('legend')?.textContent).toBe('Colour');
    expect(new FormData(container.querySelector('form')!).get('color')).toBe('teal');
    await click(container.querySelector('input[value="pink"]')!);
    expect(new FormData(container.querySelector('form')!).get('color')).toBe('pink');
  });
});

describe('useSettled', () => {
  function Probe({ value }: { value?: string }) {
    return <span>{useSettled(value) ?? 'waiting'}</span>;
  }

  it('shows quick data at once, and holds slow data until the placeholder has been seen long enough', async () => {
    vi.useFakeTimers();
    const quick = await render(<Probe />);
    await act(async () => vi.advanceTimersByTime(100));
    await quick.rerender(<Probe value="ready" />);
    expect(quick.container.textContent).toBe('ready');

    const slow = await render(<Probe />);
    await act(async () => vi.advanceTimersByTime(300));
    await slow.rerender(<Probe value="ready" />);
    expect(slow.container.textContent).toBe('waiting');
    await act(async () => vi.advanceTimersByTime(400));
    expect(slow.container.textContent).toBe('ready');
    vi.useRealTimers();
  });
});

describe('SuggestField', () => {
  async function type(input: HTMLInputElement, text: string) {
    await act(async () => {
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!.call(input, text);
      input.dispatchEvent(new Event('input', { bubbles: true }));
    });
  }

  it('suggests matches while typing and fills in the picked one', async () => {
    const onPick = vi.fn();
    const { container } = await render(
      <form>
        <SuggestField label="Service" name="service" onPick={onPick} suggestions={['Netflix', 'Spotify', 'Nebula']} />
      </form>,
    );
    const input = container.querySelector<HTMLInputElement>('input[role="combobox"]')!;
    expect(input.labels?.[0]?.textContent).toBe('Service');

    await type(input, 'ne');
    expect(input.getAttribute('aria-expanded')).toBe('true');
    expect(options()).toEqual(['Netflix', 'Nebula']);

    await press(input, 'ArrowDown');
    expect(input.getAttribute('aria-activedescendant')).toBe(document.querySelector('[data-active="true"]')!.id);
    await press(input, 'Enter');
    expect(onPick).toHaveBeenCalledWith('Nebula');
    expect(input.value).toBe('Nebula');
    expect(document.querySelector('[role="listbox"]')).toBeNull();
    expect(new FormData(container.querySelector('form')!).get('service')).toBe('Nebula');

    await type(input, 'spo');
    await press(input, 'Escape');
    expect(document.querySelector('[role="listbox"]')).toBeNull();
    await type(input, 'kiwi');
    expect(input.getAttribute('aria-expanded')).toBe('false');
  });
});

describe('Meter', () => {
  it('reports progress as a percentage, fills to the edge at most and marks going over', async () => {
    const { container, rerender } = await render(<Meter label="Garden goal" value={0.42} />);
    const meter = container.querySelector('[role="progressbar"]')!;
    expect(meter.getAttribute('aria-label')).toBe('Garden goal');
    expect(meter.getAttribute('aria-valuenow')).toBe('42');
    expect(meter.querySelector<HTMLElement>('.meter-fill')!.style.width).toBe('42%');
    expect(meter.hasAttribute('data-over')).toBe(false);

    await rerender(<Meter label="Garden goal" value={1.3} />);
    expect(meter.getAttribute('aria-valuenow')).toBe('130');
    expect(meter.querySelector<HTMLElement>('.meter-fill')!.style.width).toBe('100%');
    expect(meter.hasAttribute('data-over')).toBe(true);
  });
});
