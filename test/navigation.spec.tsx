import { describe, expect, it } from 'vitest';
import { AppShell, Pagination, UiProvider, type UiLinkProps } from '../src/index.ts';
import { render } from './render.tsx';

function RouterLink({ href, ...props }: UiLinkProps) {
  return <a data-router="true" href={href} {...props} />;
}

describe('Pagination', () => {
  it('renders nothing for a single page', async () => {
    const { container } = await render(<Pagination page={1} pageHref={(page) => `?page=${page}`} totalPages={1} />);
    expect(container.innerHTML).toBe('');
  });

  it('uses the app link and caps the last page', async () => {
    const { container } = await render(
      <UiProvider link={RouterLink}>
        <Pagination maxPages={3} page={3} pageHref={(page) => `?page=${page}`} totalPages={40} />
      </UiProvider>,
    );

    const previous = container.querySelector('a[rel="prev"]')!;
    expect(previous.getAttribute('href')).toBe('?page=2');
    expect(previous.getAttribute('data-router')).toBe('true');
    expect(container.querySelector('a[rel="next"]')).toBeNull();
    expect(container.textContent).toContain('Page 3 of 3');
  });
});

describe('AppShell', () => {
  it('marks the active destinations and sizes the tab bar to its tabs', async () => {
    const { container } = await render(
      <AppShell
        brand={{ href: '/', mark: null, name: 'Strata' }}
        nav={[
          { active: true, href: '/notes', label: 'notes' },
          { active: false, href: '/agenda', label: 'agenda' },
        ]}
        tabs={[
          { active: true, href: '/', icon: 'home', label: 'Home' },
          { active: false, href: '/notes', icon: 'library', label: 'Notes' },
          { active: false, href: '/me', icon: 'user', label: 'Account', loading: true },
        ]}
      >
        <p>Page</p>
      </AppShell>,
    );

    const primary = container.querySelector('nav[aria-label="Primary"]')!;
    expect(primary.querySelector('[aria-current="page"]')?.textContent).toBe('notes');

    const tabBar = container.querySelector<HTMLElement>('nav[aria-label="Main"]')!;
    expect(tabBar.style.getPropertyValue('--tab-count')).toBe('3');
    expect(tabBar.querySelector('[aria-current="page"]')?.textContent).toBe('Home');
    expect(tabBar.querySelectorAll('a')).toHaveLength(2);
    expect(container.querySelector('main#content')?.textContent).toBe('Page');
  });
});
