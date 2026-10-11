import { useEffect, useRef, useState } from 'react';

export const placeholderDelayMs = 200;
export const placeholderMinimumMs = 450;

export function useSettled<T>(value: T | undefined, delay = placeholderDelayMs, minimum = placeholderMinimumMs) {
  const waitingSince = useRef<number | null>(value === undefined ? Date.now() : null);
  const [, release] = useState(0);
  if (value === undefined && waitingSince.current === null) waitingSince.current = Date.now();
  const started = waitingSince.current;
  const holdUntil = value !== undefined && started !== null && Date.now() - started > delay ? started + delay + minimum : 0;
  const holding = holdUntil > Date.now();

  useEffect(() => {
    if (value !== undefined && !holding) waitingSince.current = null;
    if (!holding) return;
    const timer = window.setTimeout(() => release((count) => count + 1), holdUntil - Date.now());
    return () => window.clearTimeout(timer);
  }, [holding, holdUntil, value]);

  return holding ? undefined : value;
}
