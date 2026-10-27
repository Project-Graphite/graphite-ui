import MuiBadge from '@mui/material/Badge';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import { StrictMode, useCallback, useState, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import {
  AppShell,
  Avatar,
  Badge,
  Banner,
  Button,
  Card,
  Checkbox,
  CodeInput,
  ColorSwatches,
  CommandPalette,
  ConfirmDialog,
  DatePicker,
  Dialog,
  EmptyState,
  ErrorState,
  Fieldset,
  FilterChip,
  FloatingToolbar,
  FormPanelSkeleton,
  GridListbox,
  Icon,
  IconButton,
  Kbd,
  LinesSkeleton,
  ListRow,
  ListSkeleton,
  Menu,
  Meter,
  OutageGate,
  PageActionsRow,
  PageHeader,
  Pagination,
  Popover,
  Radio,
  SectionHeading,
  SegmentedControl,
  Sidebar,
  Select,
  Sheet,
  Stat,
  StatGrid,
  SuggestField,
  SmoothImage,
  SnackbarProvider,
  Tabs,
  TagChip,
  tagColors,
  TextAreaField,
  TextField,
  TextLink,
  TimePicker,
  Toggle,
  ToolbarButton,
  ToolbarSeparator,
  timeAgo,
  UiProvider,
  useCommandShortcut,
  useSnackbar,
  type CommandItem,
  type IconName,
  type UiLinkProps,
} from '../src/index.ts';
import './styles.css';

const colors = [
  ['paper', 'bg-paper'],
  ['surface', 'bg-surface'],
  ['line', 'bg-line'],
  ['line-soft', 'bg-line-soft'],
  ['ink', 'bg-ink'],
  ['muted', 'bg-muted'],
  ['faint', 'bg-faint'],
  ['danger', 'bg-danger'],
  ['live', 'bg-live'],
  ['wip', 'bg-wip'],
  ['dormant', 'bg-dormant'],
];
const icons: IconName[] = ['bell', 'compass', 'filter', 'gamepad', 'home', 'library', 'search', 'user'];
const commands: CommandItem[] = [
  { group: 'Go to', href: '#workspace', id: 'notes', label: 'Notes', hint: 'g n' },
  { group: 'Go to', href: '#workspace', id: 'agenda', label: 'Agenda', hint: 'g a' },
  { group: 'Actions', id: 'task', label: 'New task', onSelect: () => {} },
  { group: 'Actions', id: 'note', label: 'New note', onSelect: () => {} },
];
const outageListeners = new Set<() => void>();

function Section({ children, title }: { children: ReactNode; title: string }) {
  return (
    <section className="border-t border-line-soft py-10" id={title.toLowerCase().replaceAll(' ', '-')}>
      <p className="eyebrow">{title}</p>
      <div className="mt-5 grid gap-5">{children}</div>
    </section>
  );
}

function SnackbarDemo() {
  const show = useSnackbar();
  return (
    <div className="flex flex-wrap gap-3">
      <Button onClick={() => show({ message: 'Saved to your library', detail: 'just now', action: { label: 'open', href: '#snackbar' } })}>
        Show a snackbar
      </Button>
      <Button onClick={() => show({ message: 'Note deleted', action: { label: 'undo', onSelect: () => show({ message: 'Note restored' }) } })}>
        Show an undo snackbar
      </Button>
    </div>
  );
}

function Preview() {
  const [dialog, setDialog] = useState<'plain' | 'confirm' | null>(null);
  const [palette, setPalette] = useState(false);
  const [query, setQuery] = useState('');
  const openPalette = useCallback(() => setPalette(true), []);
  useCommandShortcut(openPalette);
  const [checked, setChecked] = useState(true);
  const [page, setPage] = useState(3);
  const [sheet, setSheet] = useState(false);
  const [view, setView] = useState<'list' | 'board' | 'calendar'>('list');
  const [filter, setFilter] = useState('all');
  const [marks, setMarks] = useState<string[]>(['bold']);
  const toggleMark = (mark: string) => setMarks((current) => (current.includes(mark) ? current.filter((item) => item !== mark) : [...current, mark]));

  return (
    <AppShell
      actions={
        <>
          <Popover
            label="Notifications"
            trigger={
              <MuiBadge badgeContent={2} color="primary">
                <Icon name="bell" />
              </MuiBadge>
            }
            triggerLabel="Notifications, 2 unread"
          >
            {(close) => (
              <>
                <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
                  <h2 className="m-0 text-base font-medium">Notifications</h2>
                  <Button className="mono-sm" onClick={close} size="small" variant="text">
                    mark all read
                  </Button>
                </div>
                <List disablePadding>
                  {['New chapter', 'New episode'].map((title) => (
                    <ListItem disablePadding divider key={title}>
                      <ListItemButton className="gap-3.5 px-4 py-3" href="#popover" onClick={close}>
                        <span className="unread-dot" />
                        <span className="text-sm">{title}</span>
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </>
            )}
          </Popover>
          <Menu
            header={
              <div className="border-b border-line px-4 py-3">
                <p className="m-0 truncate text-sm text-ink">Preview User</p>
                <p className="mono-sm m-0 truncate text-faint">@preview</p>
              </div>
            }
            items={[
              { label: 'Your profile', href: '#menu' },
              { label: 'Settings', href: '#menu' },
              { label: 'Sign out', onSelect: () => {}, separated: true },
            ]}
            label="Account"
            trigger="P"
            triggerLabel="Account menu for Preview User"
          />
        </>
      }
      brand={{ href: '#', mark: <span aria-hidden="true">◆</span>, name: 'Graphite UI' }}
      footer={
        <footer className="shell mono-sm mt-16 border-t border-line-soft py-8 text-faint">
          Every component, every state.
        </footer>
      }
      nav={[
        { active: true, href: '#colours', label: 'colours' },
        { active: false, href: '#fields', label: 'fields' },
        { active: false, href: '#dialogs', label: 'dialogs' },
      ]}
      tabs={[
        { active: true, href: '#colours', icon: 'home', label: 'Home' },
        { active: false, href: '#fields', icon: 'compass', label: 'Fields' },
        { active: false, href: '#dialogs', icon: 'library', label: 'Dialogs' },
        { active: false, href: '#account', icon: 'user', label: 'Account', loading: true },
      ]}
    >
      <p className="eyebrow">@project-graphite/ui</p>
      <h1 className="page-title">Graphite UI preview</h1>

      <Section title="Colours">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {colors.map(([color, swatch]) => (
            <div className="rounded-xl border border-line p-3" key={color}>
              <span className={`block h-10 rounded-lg border border-line ${swatch}`} />
              <span className="mono-sm mt-2 block text-muted">{color}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Buttons">
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="primary">Primary</Button>
          <Button>Secondary</Button>
          <Button disabled variant="primary">
            Disabled
          </Button>
          <Button variant="text">Text button</Button>
          <Button icon="trash" variant="danger">
            Delete
          </Button>
          <TextLink href="#buttons">text link</TextLink>

          <IconButton icon="filter" label="Filter" />
          <IconButton badge={3} icon="filter" label="Filter, 3 active" />

        </div>
        <div className="flex gap-4">
          {icons.map((name) => (
            <span className="text-muted" key={name} title={name}>
              <Icon name={name} />
            </span>
          ))}
        </div>
      </Section>

      <Section title="Fields">
        <div className="form-panel grid gap-5">
          <TextField label="Email" placeholder="you@example.com" type="email" />
          <TextField hint="At least 12 characters." label="Password" type="password" />
          <TextField error="Enter a handle." label="Handle" />
          <TextAreaField label="Bio" rows={3} />
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField label="Name" placeholder="Garden" />
            <Select
              defaultValue="notes"
              label="Category"
              options={[
                { value: 'notes', label: 'Notes' },
                { value: 'tasks', label: 'Tasks' },
                { value: 'events', label: 'Events' },
              ]}
            />
          </div>
          <Select
            label="Time zone"
            options={Intl.supportedValuesOf('timeZone').map((zone) => ({ value: zone, label: zone.replaceAll('_', ' ') }))}
            placeholder="Choose a time zone"
            searchable
          />
          <SuggestField hint="Try “ne”." label="Service" suggestions={['Netflix', 'Nebula', 'Spotify', 'YouTube Premium']} />
          <div className="grid gap-4 sm:grid-cols-2">
            <DatePicker defaultValue="2026-10-14" label="Due date" />
            <TimePicker defaultValue="09:00" label="Time" />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Select aria-label="Group by" defaultValue="status" options={[{ value: 'status', label: 'Status' }, { value: 'owner', label: 'Owner' }]} size="small" />
            <DatePicker aria-label="Due" quiet size="small" />
            <TimePicker aria-label="At" quiet size="small" />
          </div>
          <div className="flex flex-wrap gap-4">
            <Checkbox defaultChecked label="Remember this choice" name="remember" />
            <Radio defaultChecked label="Bookmark" name="saveAs" value="bookmark" />
            <Radio label="Task" name="saveAs" value="task" />
          </div>
          <ColorSwatches defaultValue="teal" label="Colour" name="color" />
          <GridListbox
            defaultValue=""
            emptyLabel="Any year"
            groups={[
              { label: '2020s', options: ['2026', '2025', '2024', '2023'].map((year) => ({ label: year, value: year })) },
              { label: '2010s', options: ['2019', '2018', '2017'].map((year) => ({ label: year, value: year })) },
            ]}
            label="Year"
            name="year"
          />
          <Toggle checked={checked} description="Shown on your profile." label="Public profile" onChange={setChecked} />
          <div className="panel-rows">
            <Toggle checked={checked} description="Grouped toggles share one frame." label="Weekly summary" onChange={setChecked} />
            <Toggle checked={false} disabled label="Disabled toggle" onChange={() => {}} />
          </div>
          <ul className="panel-rows">
            <li className="panel-row">A framed list row</li>
            <li className="panel-row">Rows share one padding</li>
          </ul>
          <details className="rounded-lg border border-line p-3">
            <summary className="text-ink">A disclosure</summary>
            <p className="mt-2 mb-0 text-sm text-muted">It opens with the same chevron as the rest of the interface.</p>
          </details>
          <div className="grid gap-2">
            <Meter label="Half way" value={0.5} />
            <Meter label="Over budget" value={1.2} />
          </div>
          <Banner>A notice explains something calmly.</Banner>
          <Banner title="Saved" tone="success">Your changes are live.</Banner>
          <Banner action={<Button size="small">Reconnect</Button>} tone="warning">
            Your phone stopped sending messages.
          </Banner>
          <Banner tone="danger">Something went wrong. Try again.</Banner>
          <Fieldset hint="Pick as many as apply." legend="Follow these habits">
            <Checkbox defaultChecked label="Read" name="habit" value="read" />
            <Checkbox label="Walk" name="habit" value="walk" />
          </Fieldset>
        </div>
      </Section>

      <Section title="Dialogs">
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => setDialog('plain')}>Open dialog</Button>
          <Button onClick={() => setDialog('confirm')}>Open confirm dialog</Button>
        </div>
        {dialog === 'plain' && (
          <Dialog onClose={() => setDialog(null)} title="A plain dialog">
            <p className="mt-4 text-muted">On a phone this opens as a bottom sheet.</p>
            <TextField autoFocus label="Title" />
          </Dialog>
        )}
        {dialog === 'confirm' && (
          <ConfirmDialog
            confirmLabel="Delete"
            onClose={() => setDialog(null)}
            onConfirm={() => Promise.reject(new Error('This preview cannot delete anything.'))}
            title="Delete this note?"
            tone="danger"
          >
            <p className="m-0">Confirming shows the error state.</p>
          </ConfirmDialog>
        )}
      </Section>

      <Section title="Workspace">
        <Tabs
          items={[
            { active: true, href: '#workspace', label: 'Profile' },
            { active: false, href: '#workspace', label: 'Security' },
            { active: false, href: '#workspace', label: 'Sessions' },
          ]}
          label="Settings"
        />
        <div className="chip-row">
          {tagColors.map((color) => (
            <TagChip color={color} key={color} label={color} />
          ))}
          <TagChip color="blue" href="#workspace" label="linked" />
          <TagChip color="green" label="removable" onRemove={() => {}} />
        </div>
        <div className="flex items-center gap-3">
          <Avatar name="Amr" present />
          <Avatar name="Sam" />
          <Avatar name="Lee" present size="sm" />
        </div>
        <div className="max-w-xs">
          <CodeInput hint="From your authenticator app." label="Six-digit code" name="code" />
        </div>
        <div className="h-72 max-w-60 overflow-hidden rounded-xl border border-line">
          <Sidebar
            label="Areas"
            sections={[
              {
                items: [
                  { active: true, href: '#workspace', icon: 'home', label: 'Home' },
                  { active: false, badge: 4, href: '#workspace', icon: 'bell', label: 'Inbox' },
                ],
              },
              { label: 'Spaces', items: [{ active: false, href: '#workspace', label: 'Friends trip' }] },
            ]}
          />
        </div>
        <Button className="w-fit" onClick={openPalette}>
          Open command palette (Ctrl+K)
        </Button>
        {palette && (
          <CommandPalette
            items={commands.filter((command) => command.label.toLowerCase().includes(query.toLowerCase()))}
            onClose={() => {
              setPalette(false);
              setQuery('');
            }}
            onQueryChange={setQuery}
            query={query}
          />
        )}
      </Section>

      <Section title="Type scale">
        <p className="m-0 text-display">Display 2.25rem</p>
        <p className="m-0 text-title">Title 1.5rem</p>
        <p className="m-0 text-h2">Heading 2 1.125rem</p>
        <p className="m-0 text-h3">Heading 3 0.9375rem</p>
        <p className="m-0 text-body">Body 0.9375rem for running text and list titles.</p>
        <p className="m-0 text-small text-muted">Small 0.8125rem for metadata lines.</p>
        <p className="m-0 font-mono text-micro text-faint">Micro 0.75rem for keys and codes</p>
      </Section>

      <Section title="Page frame">
        <div className="grid gap-8 rounded-card border border-dashed border-line p-4">
          <PageActionsRow
            actions={
              <>
                <IconButton icon="more" label="More actions" />
                <Button icon="plus" size="small" variant="primary">
                  New task
                </Button>
              </>
            }
            tabs={[
              { active: true, href: '#page-frame', label: 'Open' },
              { active: false, href: '#page-frame-done', label: 'Done' },
            ]}
            title="Tasks"
            toolbar={
              <>
                {['all', 'today', 'work'].map((name, index) => (
                  <FilterChip active={filter === name} count={[12, 3, 5][index]} key={name} label={name} onClick={() => setFilter(name)} />
                ))}
                <FilterChip active={false} color="teal" label="home" onClick={() => {}} />
              </>
            }
            toolbarEnd={
              <SegmentedControl
                label="View"
                onChange={setView}
                options={[
                  { icon: 'list', label: 'List', value: 'list' },
                  { icon: 'board', label: 'Board', value: 'board' },
                  { hideLabel: true, icon: 'calendar', label: 'Calendar', value: 'calendar' },
                ]}
                value={view}
              />
            }
          />
          <SectionHeading action={<Button size="small">Show all</Button>} description="Due in the next seven days." title="This week" />
          <ul className="panel-rows">
            <ListRow lead={<input aria-label="Done" type="checkbox" />} meta="Today · Work" title="Send the invoice" trail={<Badge tone="danger">Overdue</Badge>} />
            <ListRow href="#page-frame" lead={<Icon name="file" size={18} />} meta="Edited 2 hours ago" title="A linked row opens a page" trail={<Kbd>⏎</Kbd>} />
            <ListRow lead={<Icon name="wallet" size={18} />} meta="CIB · ••4512" onClick={() => setSheet(true)} selected title="A button row opens a sheet" trail={<span className="tabular-nums text-ink">EGP 1,250.00</span>} />
            <ListRow dense meta="Dense rows are 40 px" title="A dense row" />
          </ul>
          <SectionHeading level={3} title="Level three heading" />
          <StatGrid>
            <Stat label="Spent this month" value="EGP 12,480" />
            <Stat delta="−8%" deltaTone="good" detail="Budget EGP 20,000" label="Left" meter={<Meter label="Budget used" value={0.62} />} value="EGP 7,520" />
            <Stat delta="+3 today" label="To review" value="5" />
          </StatGrid>
          <div className="grid gap-3 sm:grid-cols-3">
            <Card>A card with medium padding.</Card>
            <Card padding="sm">A small card.</Card>
            <Card href="#page-frame">An interactive card link.</Card>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge>muted</Badge>
            <Badge tone="ink">ink</Badge>
            <Badge icon="alert" tone="danger">
              Overdue
            </Badge>
            <Badge tone="live">live</Badge>
            <Badge tone="wip">in progress</Badge>
            <Badge tone="highlight">highlight</Badge>
            <span className="text-small text-muted">
              Press <Kbd>Ctrl</Kbd> <Kbd>K</Kbd> to search
            </span>
          </div>
          <FloatingToolbar label="Format text">
            <ToolbarButton active={marks.includes('bold')} icon="bold" label="Bold" onClick={() => toggleMark('bold')} />
            <ToolbarButton active={marks.includes('italic')} icon="italic" label="Italic" onClick={() => toggleMark('italic')} />
            <ToolbarButton icon="code" label="Code" onClick={() => toggleMark('code')} />
            <ToolbarSeparator />
            <ToolbarButton icon="link" label="Link" onClick={() => {}} />
            <ToolbarButton label="Turn into" onClick={() => {}}>
              Text
              <Icon name="chevron-down" size={16} />
            </ToolbarButton>
            <ToolbarButton disabled icon="highlight" label="Highlight" onClick={() => {}} />
          </FloatingToolbar>
          <Button className="w-fit" onClick={() => setSheet(true)}>
            Open a sheet
          </Button>
          {sheet && (
            <Sheet
              eyebrow="Task"
              footer={
                <>
                  <Button onClick={() => setSheet(false)}>Cancel</Button>
                  <Button onClick={() => setSheet(false)} variant="primary">
                    Save
                  </Button>
                </>
              }
              onClose={() => setSheet(false)}
              title="Send the invoice"
            >
              <div className="grid gap-5">
                <TextField defaultValue="Send the invoice" label="Title" />
                <TextAreaField label="Description" rows={4} />
                <p className="m-0 text-small text-muted">On a phone this opens from the bottom; on a desktop it slides in from the right.</p>
              </div>
            </Sheet>
          )}
        </div>
      </Section>

      <Section title="Empty states">
        <EmptyState action={<Button icon="plus" variant="primary">New page</Button>} icon="file" title="No pages yet" variant="page">
          Pages hold notes, plans and meeting minutes.
        </EmptyState>
        <EmptyState title="Nothing due this week">Tasks with a due date show up here.</EmptyState>
        <EmptyState action={<Button size="small" variant="text">Clear filters</Button>} title="No tasks match these filters" variant="filtered" />
        <Card>
          <EmptyState action={<Button size="small" variant="text">Add</Button>} icon="target" title="No goals yet" variant="widget" />
        </Card>
      </Section>

      <Section title="Snackbar">
        <SnackbarDemo />
      </Section>

      <Section title="Pagination">
        <Pagination page={page} pageHref={(next) => `#pagination-${next}`} totalPages={7} />
        <div className="flex gap-3">
          <Button className="mono-sm" onClick={() => setPage((current) => Math.max(1, current - 1))} size="small" variant="text">
            previous page
          </Button>
          <Button className="mono-sm" onClick={() => setPage((current) => Math.min(7, current + 1))} size="small" variant="text">
            next page
          </Button>
        </div>
      </Section>

      <Section title="Page header">
        <PageHeader
          actions={
            <Button icon="plus" size="small">
              New
            </Button>
          }
          eyebrow="Shared space · owner"
          title="Home"
        />
      </Section>

      <Section title="Empty, error and loading">
        <ErrorState onRetry={() => {}} title="This didn’t load">
          The server answered with an error.
        </ErrorState>
        <EmptyState title="Nothing here yet">
          <p className="mt-2 mb-0 text-muted">Empty states sit in a dashed box.</p>
        </EmptyState>
        <LinesSkeleton />
        <ListSkeleton rows={2} />
        <FormPanelSkeleton label="Loading a form" />
        <div className="relative h-40 w-28 overflow-hidden rounded-lg border border-line">
          <SmoothImage alt="" fallback={<span className="mono-sm p-2 text-faint">no image</span>} src="/missing.png" />
        </div>
        <p className="mono-sm m-0 text-faint">timeAgo: {timeAgo(new Date(Date.now() - 3_600_000).toISOString())}</p>
      </Section>

      <Section title="Outage">
        <OutageGate
          healthUrl="/missing-health-check"
          offlineHint="Reconnect to the internet to carry on."
          productName="Graphite UI"
          subscribe={(listener) => {
            outageListeners.add(listener);
            return () => {
              outageListeners.delete(listener);
            };
          }}
        >
          <Button className="w-fit" onClick={() => outageListeners.forEach((listener) => listener())}>
            Simulate an outage
          </Button>
        </OutageGate>
      </Section>
    </AppShell>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UiProvider link={(props: UiLinkProps) => <a {...props} />}>
      <SnackbarProvider>
        <Preview />
      </SnackbarProvider>
    </UiProvider>
  </StrictMode>,
);
