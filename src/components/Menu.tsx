import Divider from '@mui/material/Divider';
import MuiMenu from '@mui/material/Menu';
import MenuItemBase from '@mui/material/MenuItem';
import { useState, type ReactNode } from 'react';
import { useLink } from '../UiProvider.js';
import { Trigger, type TriggerVariant } from './Trigger.js';

export type MenuItem = { label: string; separated?: boolean } & (
  | { href: string }
  | { onSelect: () => void }
);

export function Menu({
  header,
  items,
  label,
  trigger,
  triggerClassName = 'avatar-button',
  triggerLabel,
  triggerVariant,
}: {
  header?: ReactNode;
  items: MenuItem[];
  label: string;
  trigger: ReactNode;
  triggerClassName?: string;
  triggerLabel: string;
  triggerVariant?: TriggerVariant;
}) {
  const Link = useLink();
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const close = () => setAnchor(null);

  return (
    <>
      <Trigger
        className={triggerVariant ? undefined : triggerClassName}
        expanded={Boolean(anchor)}
        haspopup="menu"
        label={triggerLabel}
        onClick={(event) => {
          const target = event.currentTarget;
          setAnchor((current) => (current ? null : target));
        }}
        variant={triggerVariant}
      >
        {trigger}
      </Trigger>
      <MuiMenu
        anchorEl={anchor}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        onClose={close}
        open={Boolean(anchor)}
        slotProps={{ list: { 'aria-label': label }, paper: { className: 'min-w-60' } }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        variant="menu"
      >
        {header && <li role="none">{header}</li>}
        {items.flatMap((item) => [
          ...(item.separated ? [<Divider key={`${item.label}-divider`} />] : []),
          'href' in item ? (
            <MenuItemBase component={Link} href={item.href} key={item.label} onClick={close}>
              {item.label}
            </MenuItemBase>
          ) : (
            <MenuItemBase
              key={item.label}
              onClick={() => {
                close();
                item.onSelect();
              }}
            >
              {item.label}
            </MenuItemBase>
          ),
        ])}
      </MuiMenu>
    </>
  );
}
