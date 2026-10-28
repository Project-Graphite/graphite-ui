import { useEffect, useState, type ReactNode } from 'react';
import { Button } from './Button.js';

const firstRetryMs = 3_000;
const longestRetryMs = 15_000;

type Health = 'ok' | 'offline' | 'updating' | 'failing';

async function serverHealth(healthUrl: string): Promise<Health> {
  if (typeof navigator !== 'undefined' && navigator.onLine === false) return 'offline';
  try {
    const response = await fetch(healthUrl, {
      cache: 'no-store',
      signal: AbortSignal.timeout(5_000),
    });
    if (response.ok) return 'ok';
    return response.status >= 502 && response.status <= 504 ? 'updating' : 'failing';
  } catch {
    return 'updating';
  }
}

const copy: Record<Exclude<Health, 'ok'>, { eyebrow: string; title: (product: string) => string; body?: string }> = {
  offline: { eyebrow: 'offline', title: () => 'You are offline' },
  updating: {
    eyebrow: 'temporarily unavailable',
    title: (product) => `${product} is being updated`,
    body: 'This usually takes under a minute, and the page reloads by itself once it is back.',
  },
  failing: {
    eyebrow: 'server error',
    title: (product) => `${product} is having trouble`,
    body: 'The server is up but answering with errors. It has been noticed; the page reloads by itself once it recovers.',
  },
};

function OutagePage({
  healthUrl,
  initialCause,
  offlineHint,
  onRecovered,
  productName,
}: {
  healthUrl: string;
  initialCause: Exclude<Health, 'ok'>;
  offlineHint: string;
  onRecovered: () => void;
  productName: string;
}) {
  const [attempt, setAttempt] = useState(0);
  const [checking, setChecking] = useState(false);
  const [cause, setCause] = useState<Exclude<Health, 'ok'>>(initialCause);

  useEffect(() => {
    let cancelled = false;
    const delay = Math.min(longestRetryMs, firstRetryMs * 2 ** attempt);
    const timer = window.setTimeout(async () => {
      setChecking(true);
      const health = await serverHealth(healthUrl);
      if (cancelled) return;
      if (health === 'ok') {
        onRecovered();
        return;
      }
      setCause(health);
      setChecking(false);
      setAttempt((current) => current + 1);
    }, delay);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [attempt, healthUrl, onRecovered]);

  async function retry() {
    setChecking(true);
    const health = await serverHealth(healthUrl);
    if (health === 'ok') {
      onRecovered();
      return;
    }
    setCause(health);
    setChecking(false);
    setAttempt((current) => current + 1);
  }

  return (
    <div className="page-enter mx-auto max-w-2xl py-10 text-center">
      <p className="eyebrow">{copy[cause].eyebrow}</p>
      <h1 className="page-title">{copy[cause].title(productName)}</h1>
      <p className="mt-5 text-muted">{copy[cause].body ?? offlineHint}</p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <Button disabled={checking} onClick={() => void retry()} variant="primary">
          {checking ? 'Checking…' : 'Try again now'}
        </Button>
        <span aria-live="polite" className="mono-sm text-faint">
          {checking ? 'checking the server' : `retrying automatically · attempt ${attempt + 1}`}
        </span>
      </div>
    </div>
  );
}

function reloadPage() {
  window.location.reload();
}

export function OutageGate({
  children,
  healthUrl,
  offlineHint,
  productName,
  subscribe,
}: {
  children: ReactNode;
  healthUrl: string;
  offlineHint: string;
  productName: string;
  subscribe: (listener: () => void) => () => void;
}) {
  const [down, setDown] = useState<Exclude<Health, 'ok'>>();

  useEffect(
    () =>
      subscribe(() => {
        void serverHealth(healthUrl).then((health) => {
          if (health !== 'ok') setDown(health);
        });
      }),
    [healthUrl, subscribe],
  );

  return down ? (
    <OutagePage healthUrl={healthUrl} initialCause={down} offlineHint={offlineHint} onRecovered={reloadPage} productName={productName} />
  ) : (
    children
  );
}
