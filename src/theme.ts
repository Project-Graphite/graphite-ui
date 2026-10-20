import Fade from '@mui/material/Fade';
import { createTheme, type Shadows } from '@mui/material/styles';
import type { ComponentType } from 'react';
import type { UiLinkProps } from './UiProvider.js';

const token = (name: string) => `var(--color-${name})`;
const panel = { border: `1px solid ${token('line')}`, backgroundColor: token('surface'), boxShadow: 'var(--shadow-popover)' };
const hovered = { backgroundColor: token('line-soft'), color: token('ink') };
const pressable = (transitions: string) => ({
  transition: `${transitions}, scale 160ms var(--ease-settle)`,
  '@media (prefers-reduced-motion: no-preference)': { '&:active': { scale: '0.97' } },
});
const notice = (tone: string) => ({
  border: `1px solid color-mix(in srgb, ${token(tone)} 45%, ${token('line')})`,
  borderLeft: `3px solid ${token(tone)}`,
  backgroundColor: token('surface'),
  color: token('ink'),
  '& .MuiAlert-icon': { color: token(tone) },
});

export function createGraphiteTheme(link: ComponentType<UiLinkProps>) {
  return createTheme({
    cssVariables: { nativeColor: true },
    defaultColorScheme: 'dark',
    colorSchemes: {
      dark: {
        palette: {
          primary: { main: token('ink'), light: '#fff', dark: '#fff', contrastText: token('paper') },
          error: { main: token('danger'), light: token('danger'), dark: `color-mix(in srgb, ${token('danger')} 80%, #fff)`, contrastText: token('paper') },
          info: { main: token('muted'), contrastText: token('paper') },
          success: { main: token('live'), contrastText: token('paper') },
          warning: { main: token('wip'), contrastText: token('paper') },
          background: { default: token('paper'), paper: token('surface') },
          text: { primary: token('ink'), secondary: token('muted'), disabled: token('faint') },
          divider: token('line'),
          action: {
            active: token('muted'),
            hover: token('line-soft'),
            selected: token('line-soft'),
            focus: token('line-soft'),
            disabled: token('faint'),
            disabledBackground: token('line-soft'),
          },
        },
      },
    },
    shadows: Array(25).fill('none') as Shadows,
    shape: { borderRadius: 8 },
    transitions: { duration: { enteringScreen: 220, leavingScreen: 160 } },
    typography: { fontFamily: 'var(--font-sans)' },
    components: {
      MuiButtonBase: { defaultProps: { LinkComponent: link } },
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: pressable('background-color 160ms ease, border-color 160ms ease, color 160ms ease'),
          contained: {
            '&.MuiButton-colorPrimary:hover': { backgroundColor: '#fff' },
            '&.MuiButton-colorError:hover': { backgroundColor: `color-mix(in srgb, ${token('danger')} 80%, #fff)` },
          },
          outlined: { borderColor: token('line'), color: token('ink'), '&:hover': { borderColor: token('muted'), backgroundColor: token('line-soft') } },
          text: { color: token('muted'), '&:hover': { backgroundColor: 'transparent', color: token('ink') } },
        },
      },
      MuiIconButton: {
        styleOverrides: { root: { ...pressable('background-color 160ms ease, color 160ms ease'), color: token('muted'), '&:hover': hovered } },
      },
      MuiChip: { styleOverrides: { clickable: pressable('background-color 160ms ease, border-color 160ms ease') } },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            backgroundColor: token('surface'),
            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: token('muted') },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: token('ink'), borderWidth: 1 },
          },
          notchedOutline: { borderColor: token('line') },
          input: { '&::placeholder': { color: token('faint'), opacity: 1 } },
        },
      },
      MuiInputLabel: { styleOverrides: { root: { color: token('muted'), '&.Mui-focused': { color: token('ink') } } } },
      MuiFormHelperText: { styleOverrides: { root: { color: token('faint'), '&.Mui-error': { color: token('danger') } } } },
      MuiSelect: { styleOverrides: { icon: { color: token('muted') } } },
      MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } },
      MuiPopover: {
        defaultProps: { slots: { transition: Fade } },
        styleOverrides: { paper: { ...panel, borderRadius: 'var(--radius-panel)' } },
      },
      MuiMenu: { defaultProps: { slots: { transition: Fade } } },
      MuiMenuItem: {
        styleOverrides: {
          root: {
            color: token('muted'),
            '&:hover, &.Mui-focusVisible': hovered,
            '&.Mui-selected, &.Mui-selected:hover, &.Mui-selected.Mui-focusVisible': { ...hovered, fontWeight: 560 },
          },
        },
      },
      MuiAutocomplete: {
        styleOverrides: {
          paper: { ...panel, borderRadius: 'var(--radius-panel)' },
          option: {
            color: token('muted'),
            '&.Mui-focused': { backgroundColor: `${token('line-soft')} !important`, color: token('ink') },
            '&[aria-selected="true"]': { backgroundColor: 'transparent !important', color: token('ink'), fontWeight: 560 },
          },
          noOptions: { color: token('faint') },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: { border: `1px solid ${token('line')}`, backgroundColor: token('paper'), borderRadius: 'var(--radius-card)' },
        },
      },
      MuiBackdrop: {
        styleOverrides: {
          root: {
            '&:not(.MuiBackdrop-invisible)': {
              backgroundColor: `color-mix(in srgb, ${token('paper')} 80%, transparent)`,
              backdropFilter: 'blur(4px)',
            },
          },
        },
      },
      MuiListItemButton: {
        styleOverrides: { root: { '&:hover, &.Mui-selected, &.Mui-selected:hover': hovered } },
      },
      MuiSwitch: {
        styleOverrides: {
          switchBase: {
            color: token('muted'),
            '&.Mui-checked': { color: token('paper') },
            '&.Mui-checked + .MuiSwitch-track': { backgroundColor: token('ink'), opacity: 1 },
          },
          track: { backgroundColor: token('line'), opacity: 1 },
        },
      },
      MuiCheckbox: { styleOverrides: { root: { color: token('muted'), '&.Mui-checked': { color: token('ink') } } } },
      MuiRadio: { styleOverrides: { root: { color: token('muted'), '&.Mui-checked': { color: token('ink') } } } },
      MuiTab: { styleOverrides: { root: { color: token('muted'), '&:hover, &.Mui-selected': { color: token('ink') } } } },
      MuiToggleButton: {
        styleOverrides: {
          root: {
            color: token('muted'),
            borderColor: token('line'),
            '&:hover': hovered,
            '&.Mui-selected, &.Mui-selected:hover': { backgroundColor: token('ink'), color: token('paper') },
          },
        },
      },
      MuiAlert: {
        styleOverrides: {
          root: { borderRadius: 'var(--radius-field)' },
          standard: {
            '&.MuiAlert-colorError': notice('danger'),
            '&.MuiAlert-colorSuccess': notice('live'),
            '&.MuiAlert-colorWarning': notice('wip'),
            '&.MuiAlert-colorInfo': notice('muted'),
          },
        },
      },
      MuiSnackbarContent: {
        styleOverrides: { root: { ...panel, color: token('ink'), borderRadius: 'var(--radius-panel)' } },
      },
      MuiSkeleton: {
        styleOverrides: {
          root: { backgroundColor: token('line-soft') },
          wave: { '&::after': { background: `linear-gradient(90deg, transparent, ${token('line')}, transparent)` } },
        },
      },
      MuiLinearProgress: {
        styleOverrides: {
          root: { backgroundColor: token('line-soft') },
          colorPrimary: { backgroundColor: token('line-soft') },
          determinate: { backgroundColor: token('line-soft') },
          bar: { borderRadius: 999 },
        },
      },
      MuiBadge: { styleOverrides: { dot: { border: `2px solid ${token('paper')}`, boxSizing: 'content-box' } } },
      MuiPaginationItem: {
        styleOverrides: {
          root: {
            color: token('muted'),
            '&:hover': hovered,
            '&.Mui-selected, &.Mui-selected:hover': { backgroundColor: 'transparent', border: `1px solid ${token('line')}`, color: token('ink') },
          },
        },
      },
      MuiBottomNavigationAction: { styleOverrides: { root: { color: token('faint'), '&.Mui-selected': { color: token('ink') } } } },
    },
  });
}
