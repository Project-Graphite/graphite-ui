import createCache, { type EmotionCache } from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { ThemeProvider } from '@mui/material/styles';
import { createContext, useContext, useMemo, type AnchorHTMLAttributes, type ComponentType, type ReactNode } from 'react';
import { createGraphiteTheme } from './theme.js';

export interface UiLinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  href: string;
}

function Anchor(props: UiLinkProps) {
  return <a {...props} />;
}

const LinkContext = createContext<ComponentType<UiLinkProps>>(Anchor);

let layeredCache: EmotionCache | undefined;

function getLayeredCache() {
  if (layeredCache) return layeredCache;
  const nonce = document.querySelector<HTMLMetaElement>('meta[name="csp-nonce"]')?.content || undefined;
  const insertionPoint = document.createElement('style');
  if (nonce) insertionPoint.setAttribute('nonce', nonce);
  insertionPoint.textContent = '@layer theme, base, mui, components, utilities;';
  document.head.prepend(insertionPoint);
  const cache = createCache({ insertionPoint, key: 'mui', nonce });
  const insert = cache.insert;
  cache.insert = (selector, serialized, sheet, shouldCache) =>
    insert(selector, { ...serialized, styles: `@layer mui {${serialized.styles}}` }, sheet, shouldCache);
  layeredCache = cache;
  return cache;
}

export function UiProvider({ children, link }: { children: ReactNode; link: ComponentType<UiLinkProps> }) {
  const theme = useMemo(() => createGraphiteTheme(link), [link]);
  return (
    <CacheProvider value={getLayeredCache()}>
      <ThemeProvider theme={theme}>
        <LinkContext.Provider value={link}>{children}</LinkContext.Provider>
      </ThemeProvider>
    </CacheProvider>
  );
}

export function useLink() {
  return useContext(LinkContext);
}
