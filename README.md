# graphite-ui

`@project-graphite/ui` holds the Project Graphite design tokens, dark theme and React components,
so every Graphite web app shares one look and one set of building blocks.

It has no runtime dependencies. React 19 is a peer dependency, and the package never imports a
router: apps pass their own link component in through `UiProvider`.

## Use it in an app

Install a release by URL. No registry account or token is needed:

```sh
npm install --save-exact https://github.com/project-graphite/graphite-ui/releases/download/v0.4.3/project-graphite-ui-0.4.3.tgz
```

Load the theme after Tailwind. `@source` lets Tailwind see the classes the components use, and its
path is relative to the CSS file:

```css
@import 'tailwindcss';
@import '@project-graphite/ui/theme.css';
@source '../node_modules/@project-graphite/ui/dist';
```

Give the package the app's router link once:

```tsx
import { Link } from 'react-router';
import { UiProvider, type UiLinkProps } from '@project-graphite/ui';

const RouterLink = ({ href, ...props }: UiLinkProps) => <Link to={href} {...props} />;

<UiProvider link={RouterLink}>
  <App />
</UiProvider>;
```

Then import components and use the colour tokens as Tailwind classes, such as `bg-surface`,
`text-muted` and `border-line`:

```tsx
import { AppShell, Dialog, TextField, Toggle } from '@project-graphite/ui';
```

## What is in it

- **`theme.css`**:
  - colour, font, radius, shadow and easing tokens;
  - a type scale (`text-display`, `text-title`, `text-h2`, `text-h3`, `text-body`, `text-small`,
    `text-micro`), page widths (`max-w-narrow`, `max-w-default`, `max-w-wide`), the `raised`,
    `overlay` and `highlight` colours and `rounded-mark`;
  - spacing, control, row-height, duration and z-index variables (`--space-*`, `--control-*`,
    `--touch`, `--row-height`, `--duration-*`, `--z-*`);
  - base form styles, the focus ring and scrollbars;
  - motion that only runs when reduced motion isn't requested;
  - the `shell`, `page-title`, `page-heading` and `mono-sm` utilities;
  - component classes such as `panel-rows`, `panel-row`, `form-panel`, `chip-row`, `tab-bar` and
    `skeleton`.
- **Components**:
  - layout: `AppShell` (with an optional `Sidebar` and `useShell`), `PageHeader`,
    `PageActionsRow`, `SectionHeading`, `Tabs`, `Card`, `ListRow`;
  - dialogs and popups: `Dialog`, `Sheet`, `ConfirmDialog`, `CommandPalette`, `Popover`, `Menu`,
    `FloatingToolbar` (with `ToolbarButton` and `ToolbarSeparator`);
  - forms: `TextField`, `TextAreaField`, `SuggestField`, `Select`, `DatePicker`, `TimePicker`,
    `CodeInput`, `Toggle`, `ColorSwatches`, `GridListbox`, `Fieldset`, `SegmentedControl`;
  - display: `TagChip` (with `tagColors`), `FilterChip`, `Badge`, `Kbd`, `Stat` (in a
    `StatGrid`), `Avatar`, `Meter`, `EmptyState` (`page`, `section`, `filtered` and `widget`
    variants), `ErrorState`, `Pagination`, `SmoothImage`, the skeletons and `Placeholder`, `Icon`,
    `TextLink`;
  - feedback: `Banner`, `SnackbarProvider` (with `useSnackbar`), `OutageGate`.
- **Helpers**: `errorMessage`, `isAbortError`, `timeAgo`, `formatDay`, `useDismiss`, `useDelayed`,
  `useSettled` (with `placeholderDelayMs` and `placeholderMinimumMs`), `useLink`, and
  `useCommandShortcut` (opens the command palette on Ctrl+K or Cmd+K).

The phone layouts are built in. Dialogs become bottom sheets, and the tab bar and popovers account
for the header and the safe area.

## Develop

```sh
npm ci
npm run lint && npm test && npm run build
npm run preview:dev
```

`preview:dev` serves a local page showing every component in every state. It isn't published.

To try a change in an app before releasing it, run `npm run build && npm pack`. Then install the
tarball in the app with `npm install --no-save <path to the .tgz>`.

## Release

1. Merge a PR that bumps `version` in `package.json` and `package-lock.json`, titled
   `chore(release): <version>`.
2. Tag the merge commit and push the tag, for example `git tag v0.2.0 && git push origin v0.2.0`.

The `Release` workflow checks that the tag matches the version, runs lint, tests and build, attests
the tarball's provenance and publishes the GitHub release. Anyone can verify a downloaded tarball
with `gh attestation verify <file> --repo project-graphite/graphite-ui`.

Versions follow semver. While the package is at 0.x, a minor version may break things, and its
release notes say so.
