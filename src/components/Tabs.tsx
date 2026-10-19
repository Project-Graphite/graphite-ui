import Tab from '@mui/material/Tab';
import MuiTabs from '@mui/material/Tabs';
import { useLink } from '../UiProvider.js';

export interface TabItem {
  active: boolean;
  href: string;
  label: string;
}

export function Tabs({ items, label }: { items: TabItem[]; label: string }) {
  const Link = useLink();
  return (
    <MuiTabs
      aria-label={label}
      className="border-b border-line"
      role="navigation"
      scrollButtons="auto"
      value={items.find((item) => item.active)?.href ?? false}
      variant="scrollable"
    >
      {items.map((item) => (
        <Tab
          aria-current={item.active ? 'page' : undefined}
          component={Link}
          href={item.href}
          key={item.href}
          label={item.label}
          value={item.href}
        />
      ))}
    </MuiTabs>
  );
}
