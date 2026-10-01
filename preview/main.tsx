import { StrictMode, useState, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import {
  AppShell,
  ConfirmDialog,
  Dialog,
  EmptyState,
  FormPanelSkeleton,
  GridListbox,
  Icon,
  LinesSkeleton,
  ListSkeleton,
  Menu,
  OutageGate,
  Pagination,
  Popover,
  SmoothImage,
  SnackbarProvider,
  TextAreaField,
  TextField,
  Toggle,
  timeAgo,
  useSnackbar,
  type IconName,
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
const icons: IconName[] = ['bell', 'compass', 'filter', 'gamepad', 'home', 'library', 'user'];
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
    <button
      className="secondary-button inline-flex w-fit"
      onClick={() => show({ message: 'Saved to your library', detail: 'just now', action: { label: 'open', href: '#snackbar' } })}
      type="button"
    >
      Show a snackbar
    </button>
  );
}

function Preview() {
  const [dialog, setDialog] = useState<'plain' | 'confirm' | null>(null);
  const [checked, setChecked] = useState(true);
  const [page, setPage] = useState(3);

  return (
    <AppShell
      actions={
        <>
          <Popover label="Notifications" trigger={<Icon name="bell" />} triggerLabel="Notifications, 2 unread">
            {(close) => (
              <>
                <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
                  <h2 className="m-0 text-base font-medium">Notifications</h2>
                  <button className="text-button mono-sm" onClick={close} type="button">
                    mark all read
                  </button>
                </div>
                <ul className="popover-list-body m-0 list-none p-0">
                  {['New chapter', 'New episode'].map((title) => (
                    <li key={title}>
                      <a className="popover-row" href="#popover" onClick={close}>
                        <span className="unread-dot" />
                        <span className="text-sm">{title}</span>
                      </a>
                    </li>
                  ))}
                </ul>
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
          <button className="primary-button inline-flex" type="button">
            Primary
          </button>
          <button className="secondary-button inline-flex" type="button">
            Secondary
          </button>
          <button className="primary-button inline-flex" disabled type="button">
            Disabled
          </button>
          <button className="text-button" type="button">
            Text button
          </button>
          <a className="rule-link" href="#buttons">
            rule link
          </a>
          <button aria-label="Filter" className="icon-button" type="button">
            <Icon name="filter" />
            <span className="count-badge">3</span>
          </button>
        </div>
        <div className="flex gap-4">
          {icons.map((name) => (
            <span className="text-muted" key={name} title={name}>
              <Icon name={name} />
            </span>
          ))}
        </div>
        <div className="flex border-b border-line">
          <a aria-current="page" className="tab-link" href="#buttons">
            Active tab
          </a>
          <a className="tab-link" href="#buttons">
            Tab
          </a>
        </div>
      </Section>

      <Section title="Fields">
        <div className="form-panel grid gap-5">
          <TextField label="Email" placeholder="you@example.com" type="email" />
          <TextField hint="At least 12 characters." label="Password" type="password" />
          <TextField error="Enter a handle." label="Handle" />
          <TextAreaField label="Bio" rows={3} />
          <label className="field-label">
            Category
            <select defaultValue="notes">
              <option value="notes">Notes</option>
              <option value="tasks">Tasks</option>
            </select>
          </label>
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
          <Toggle checked={false} disabled label="Disabled toggle" onChange={() => {}} />
          <p className="notice m-0">A notice explains something calmly.</p>
          <p className="error-message m-0">Something went wrong. Try again.</p>
        </div>
      </Section>

      <Section title="Dialogs">
        <div className="flex flex-wrap gap-3">
          <button className="secondary-button inline-flex" onClick={() => setDialog('plain')} type="button">
            Open dialog
          </button>
          <button className="secondary-button inline-flex" onClick={() => setDialog('confirm')} type="button">
            Open confirm dialog
          </button>
        </div>
        {dialog === 'plain' && (
          <Dialog eyebrow="preview" onClose={() => setDialog(null)} title="A plain dialog">
            <p className="mt-4 text-muted">On a phone this opens as a bottom sheet.</p>
          </Dialog>
        )}
        {dialog === 'confirm' && (
          <ConfirmDialog
            confirmLabel="Delete"
            eyebrow="preview"
            onClose={() => setDialog(null)}
            onConfirm={() => Promise.reject(new Error('This preview cannot delete anything.'))}
            title="Delete this note?"
          >
            <p className="m-0">Confirming shows the error state.</p>
          </ConfirmDialog>
        )}
      </Section>

      <Section title="Snackbar">
        <SnackbarDemo />
      </Section>

      <Section title="Pagination">
        <Pagination page={page} pageHref={(next) => `#pagination-${next}`} totalPages={7} />
        <div className="flex gap-3">
          <button className="text-button mono-sm" onClick={() => setPage((current) => Math.max(1, current - 1))} type="button">
            previous page
          </button>
          <button className="text-button mono-sm" onClick={() => setPage((current) => Math.min(7, current + 1))} type="button">
            next page
          </button>
        </div>
      </Section>

      <Section title="Empty and loading">
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
          <button
            className="secondary-button inline-flex w-fit"
            onClick={() => outageListeners.forEach((listener) => listener())}
            type="button"
          >
            Simulate an outage
          </button>
        </OutageGate>
      </Section>
    </AppShell>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SnackbarProvider>
      <Preview />
    </SnackbarProvider>
  </StrictMode>,
);
