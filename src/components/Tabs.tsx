import { useLink } from '../UiProvider.js';

export interface TabItem {
  active: boolean;
  href: string;
  label: string;
}

export function Tabs({ items, label }: { items: TabItem[]; label: string }) {
  const Link = useLink();
  return (
    <nav aria-label={label} className="scroll-x flex gap-2 border-b border-line">
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
