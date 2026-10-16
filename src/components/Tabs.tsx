import { useLayoutEffect, useRef } from 'react';
import { useLink } from '../UiProvider.js';

export interface TabItem {
  active: boolean;
  href: string;
  label: string;
}

export function Tabs({ items, label }: { items: TabItem[]; label: string }) {
  const Link = useLink();
  const strip = useRef<HTMLElement>(null);
  const activeHref = items.find((item) => item.active)?.href;

  useLayoutEffect(() => {
    const nav = strip.current;
    const tab = nav?.querySelector('[aria-current="page"]');
    if (!nav || !tab) return;
    const bounds = nav.getBoundingClientRect();
    const box = tab.getBoundingClientRect();
    nav.scrollLeft += Math.min(0, box.left - bounds.left) + Math.max(0, box.right - bounds.right);
  }, [activeHref]);

  return (
    <nav aria-label={label} className="scroll-x flex gap-2 border-b border-line" ref={strip}>
      {items.map((item) => (
        <Link
          aria-current={item.active ? 'page' : undefined}
          className="tab-link -mb-px"
          href={item.href}
          key={item.href}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
