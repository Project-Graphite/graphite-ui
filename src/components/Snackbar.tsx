import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { useLink } from '../UiProvider.js';

interface Snack {
  id: number;
  message: string;
  detail?: string;
  action?: { label: string; href: string };
}

type ShowSnack = (snack: Omit<Snack, 'id'>) => void;

const SnackbarContext = createContext<ShowSnack>(() => {});

const visibleMs = 6_000;

function SnackbarItem({ onDismiss, snack }: { onDismiss: (id: number) => void; snack: Snack }) {
  const Link = useLink();
  const [paused, setPaused] = useState(false);
  const [leaving, setLeaving] = useState(false);

  const leave = useCallback(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) onDismiss(snack.id);
    else setLeaving(true);
  }, [onDismiss, snack.id]);

  useEffect(() => {
    if (paused || leaving) return;
    const timer = window.setTimeout(leave, visibleMs);
    return () => window.clearTimeout(timer);
  }, [leave, leaving, paused]);

  return (
    <div
      className={`snackbar ${leaving ? 'snackbar-leaving' : ''}`}
      onAnimationEnd={(event) => {
        if (leaving && event.target === event.currentTarget) onDismiss(snack.id);
      }}
      onBlur={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="min-w-0 flex-1">
        <p className="m-0 truncate text-sm text-ink">{snack.message}</p>
        {snack.detail && <p className="mono-sm m-0 mt-0.5 truncate text-faint">{snack.detail}</p>}
      </div>
      {snack.action && (
        <Link className="rule-link mono-sm shrink-0" href={snack.action.href} onClick={leave}>
          {snack.action.label}
        </Link>
      )}
      <button
        aria-label="Dismiss"
        className="text-button shrink-0 px-1 text-lg leading-none"
        onClick={leave}
        type="button"
      >
        ×
      </button>
    </div>
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
      <div aria-live="polite" className="snackbar-region" role="status">
        {snacks.map((snack) => (
          <SnackbarItem key={snack.id} onDismiss={dismiss} snack={snack} />
        ))}
      </div>
    </SnackbarContext.Provider>
  );
}

export function useSnackbar() {
  return useContext(SnackbarContext);
}
