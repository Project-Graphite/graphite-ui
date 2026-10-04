import { useEffect, useState } from 'react';

export function useDelayed(delayMs: number) {
  const [elapsed, setElapsed] = useState(delayMs <= 0);
  useEffect(() => {
    if (delayMs <= 0) return;
    const timer = window.setTimeout(() => setElapsed(true), delayMs);
    return () => window.clearTimeout(timer);
  }, [delayMs]);
  return elapsed;
}
