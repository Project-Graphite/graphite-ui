import { createContext, useContext, type AnchorHTMLAttributes, type ComponentType, type ReactNode } from 'react';

export interface UiLinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  href: string;
}

function Anchor(props: UiLinkProps) {
  return <a {...props} />;
}

const LinkContext = createContext<ComponentType<UiLinkProps>>(Anchor);

export function UiProvider({ children, link }: { children: ReactNode; link: ComponentType<UiLinkProps> }) {
  return <LinkContext.Provider value={link}>{children}</LinkContext.Provider>;
}

export function useLink() {
  return useContext(LinkContext);
}
