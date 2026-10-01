import { useEffect, useState, type ReactNode } from 'react';

const firstRetryMs = 3_000;
const longestRetryMs = 15_000;

async function serverHealthy(healthUrl: string) {
  try {
    const response = await fetch(healthUrl, {
      cache: 'no-store',
      signal: AbortSignal.timeout(5_000),
    });
    return response.ok;
  } catch {
    return false;
  }
}

function OutagePage({
  healthUrl,
  offlineHint,
  onRecovered,
  productName,
}: {
  healthUrl: string;
  offlineHint: string;
  onRecovered: () => void;
  productName: string;
}) {
  const [attempt, setAttempt] = useState(0);
  const [checking, setChecking] = useState(false);
  const offline = typeof navigator !== 'undefined' && navigator.onLine === false;

  useEffect(() => {
    let cancelled = false;
    const delay = Math.min(longestRetryMs, firstRetryMs * 2 ** attempt);
    const timer = window.setTimeout(async () => {
      setChecking(true);
      const healthy = await serverHealthy(healthUrl);
      if (cancelled) return;
      if (healthy) {
        onRecovered();
        return;
      }
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
    if (await serverHealthy(healthUrl)) {
      onRecovered();
      return;
    }
    setChecking(false);
    setAttempt((current) => current + 1);
  }

  return (
    <div className="page-enter mx-auto max-w-2xl py-10 text-center">
      <p className="eyebrow">{offline ? 'offline' : 'temporarily unavailable'}</p>
      <h1 className="page-title">{offline ? 'You are offline' : `${productName} is taking a short break`}</h1>
      <p className="mt-5 text-muted">
        {offline
          ? offlineHint
          : 'The server is probably being updated. This usually takes under a minute, and the page reloads by itself once it is back.'}
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <button className="primary-button" disabled={checking} onClick={() => void retry()} type="button">
          {checking ? 'Checking…' : 'Try again now'}
        </button>
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
  const [down, setDown] = useState(false);

  useEffect(
    () =>
      subscribe(() => {
        void serverHealthy(healthUrl).then((healthy) => {
          if (!healthy) setDown(true);
        });
      }),
    [healthUrl, subscribe],
  );

  return down ? (
    <OutagePage healthUrl={healthUrl} offlineHint={offlineHint} onRecovered={reloadPage} productName={productName} />
  ) : (
    children
  );
}
