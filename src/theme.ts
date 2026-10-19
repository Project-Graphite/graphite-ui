import { createTheme } from '@mui/material/styles';
import type { ComponentType } from 'react';
import type { UiLinkProps } from './UiProvider.js';

const token = (name: string) => `var(--color-${name})`;

export function createGraphiteTheme(link: ComponentType<UiLinkProps>) {
  return createTheme({
    cssVariables: { nativeColor: true },
    defaultColorScheme: 'dark',
    colorSchemes: {
      dark: {
        palette: {
          primary: { main: token('ink'), contrastText: token('paper') },
          error: { main: token('danger'), contrastText: token('paper') },
          success: { main: token('live'), contrastText: token('paper') },
          warning: { main: token('wip'), contrastText: token('paper') },
          background: { default: token('paper'), paper: token('surface') },
          text: { primary: token('ink'), secondary: token('muted'), disabled: token('faint') },
          divider: token('line'),
        },
      },
    },
    shape: { borderRadius: 8 },
    typography: { fontFamily: 'var(--font-sans)' },
    components: {
      MuiButtonBase: { defaultProps: { LinkComponent: link } },
      MuiSwitch: { styleOverrides: { switchBase: { color: token('muted') } } },
    },
  });
}
