import GlobalStyles from '@mui/material/GlobalStyles';
import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles';
import { createContext, useContext, useMemo, type AnchorHTMLAttributes, type ComponentType, type ReactNode } from 'react';
import { createGraphiteTheme } from './theme.js';

export interface UiLinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  href: string;
}

function Anchor(props: UiLinkProps) {
  return <a {...props} />;
}

const LinkContext = createContext<ComponentType<UiLinkProps>>(Anchor);

export function UiProvider({ children, link }: { children: ReactNode; link: ComponentType<UiLinkProps> }) {
  const theme = useMemo(() => createGraphiteTheme(link), [link]);
  return (
    <StyledEngineProvider enableCssLayer>
      <GlobalStyles styles="@layer theme, base, mui, components, utilities;" />
      <ThemeProvider theme={theme}>
        <LinkContext.Provider value={link}>{children}</LinkContext.Provider>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

export function useLink() {
  return useContext(LinkContext);
}
