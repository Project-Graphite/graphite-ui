export function isAbortError(reason: unknown) {
  return reason instanceof DOMException && reason.name === 'AbortError';
}

export function errorMessage(reason: unknown, fallback: string) {
  return reason instanceof Error ? reason.message : fallback;
}
