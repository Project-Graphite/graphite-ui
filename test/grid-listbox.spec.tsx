import { describe, expect, it } from 'vitest';
import { GridListbox } from '../src/index.ts';
import { click, press, render } from './render.tsx';

const groups = [
  { label: '2020s', options: ['2026', '2025', '2024', '2023', '2022', '2021'].map((year) => ({ label: year, value: year })) },
  { label: '1990s', options: ['1999', '1998'].map((year) => ({ label: year, value: year })) },
];

describe('GridListbox', () => {
  async function setup() {
    const view = await render(
      <form>
        <GridListbox defaultValue="" emptyLabel="Any year" groups={groups} label="Year" name="year" />
      </form>,
    );
    return {
      ...view,
      submitted: () => new FormData(view.container.querySelector('form')!).get('year'),
      trigger: () => view.container.querySelector<HTMLButtonElement>('button[aria-haspopup="listbox"]')!,
    };
  }

  it('picks an option from the list and submits it with the form', async () => {
    const { container, submitted, trigger } = await setup();
    expect(trigger().textContent).toBe('Any year');

    await click(trigger());
    const options = [...container.querySelectorAll<HTMLButtonElement>('[role="option"]')];
    expect(options[0]?.textContent).toBe('Any year');
    await click(options.find((option) => option.textContent === '1999')!);

    expect(container.querySelector('[role="listbox"]')).toBeNull();
    expect(trigger().textContent).toBe('1999');
    expect(submitted()).toBe('1999');
  });

  it('moves by a whole row with the up and down arrows', async () => {
    const { container, trigger } = await setup();
    await click(trigger());
    const listbox = container.querySelector('[role="listbox"]')!;

    await press(listbox, 'ArrowRight');
    expect(document.activeElement?.textContent).toBe('2026');
    await press(listbox, 'ArrowDown');
    expect(document.activeElement?.textContent).toBe('2021');
  });

  it('closes with Escape and returns focus to the field', async () => {
    const { container, submitted, trigger } = await setup();
    await click(trigger());

    await press(container.querySelector('[role="listbox"]')!, 'Escape');

    expect(container.querySelector('[role="listbox"]')).toBeNull();
    expect(document.activeElement).toBe(trigger());
    expect(submitted()).toBe('');
  });
});
