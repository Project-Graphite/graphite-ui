import MuiButton from '@mui/material/Button';
import Fade from '@mui/material/Fade';
import SnackbarContent from '@mui/material/SnackbarContent';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { IconButton } from './Button.js';

interface Snack {
  id: number;
  message: string;
  detail?: string;
  action?: { label: string } & ({ href: string } | { onSelect: () => void });
  tone?: 'error';
}

type ShowSnack = (snack: Omit<Snack, 'id'>) => void;

const SnackbarContext = createContext<ShowSnack>(() => {});

const visibleMs = 6_000;

function SnackbarItem({ onDismiss, snack }: { onDismiss: (id: number) => void; snack: Snack }) {
  const [paused, setPaused] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const { action } = snack;

  const leave = useCallback(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) onDismiss(snack.id);
    else setLeaving(true);
  }, [onDismiss, snack.id]);

  useEffect(() => {
    if (paused || leaving || snack.tone === 'error') return;
    const timer = window.setTimeout(leave, visibleMs);
    return () => window.clearTimeout(timer);
  }, [leave, leaving, paused, snack.tone]);

  return (
    <Fade appear in={!leaving} onExited={() => onDismiss(snack.id)}>
      <SnackbarContent
        action={
          <>
            {action &&
              ('href' in action ? (
                <MuiButton color="inherit" href={action.href} onClick={leave} size="small">
                  {action.label}
                </MuiButton>
              ) : (
                <MuiButton
                  color="inherit"
                  onClick={() => {
                    leave();
                    action.onSelect();
                  }}
                  size="small"
                >
                  {action.label}
                </MuiButton>
              ))}
            <IconButton color="inherit" icon="x" label="Dismiss" onClick={leave} size="small" />
          </>
        }
        className={`pointer-events-auto ${snack.tone === 'error' ? 'border-l-[3px] border-l-danger' : ''}`}
        message={
          <>
            <p className="m-0 text-sm">{snack.message}</p>
            {snack.detail && <p className="mono-sm m-0 mt-0.5 truncate opacity-70">{snack.detail}</p>}
          </>
        }
        onBlur={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        role={snack.tone === 'error' ? 'alert' : 'none'}
      />
    </Fade>
  );
}

export function SnackbarProvider({ children }: { children: ReactNode }) {
  const [snacks, setSnacks] = useState<Snack[]>([]);
  const nextId = useRef(0);

  const show = useCallback<ShowSnack>((snack) => {
    nextId.current += 1;
    const id = nextId.current;
    setSnacks((current) => [...current.slice(-2), { ...snack, id }]);
  }, []);

  const dismiss = useCallback(
    (id: number) => setSnacks((current) => current.filter((snack) => snack.id !== id)),
    [],
  );

  return (
    <SnackbarContext.Provider value={show}>
      {children}
      <div className="snackbar-region">
        <div aria-live="polite" className="grid gap-[0.6rem]" role="status">
          {snacks
            .filter((snack) => snack.tone !== 'error')
            .map((snack) => (
              <SnackbarItem key={snack.id} onDismiss={dismiss} snack={snack} />
            ))}
        </div>
        {snacks
          .filter((snack) => snack.tone === 'error')
          .map((snack) => (
            <SnackbarItem key={snack.id} onDismiss={dismiss} snack={snack} />
          ))}
      </div>
    </SnackbarContext.Provider>
  );
}

export function useSnackbar() {
  return useContext(SnackbarContext);
}
