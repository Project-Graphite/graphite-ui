import { useState, type ReactNode } from 'react';
import { errorMessage } from '../lib/errors.js';
import { Dialog } from './Dialog.js';

export function ConfirmDialog({
  busyLabel = 'Working…',
  cancelLabel = 'Cancel',
  children,
  confirmLabel,
  errorFallback = 'Could not finish this',
  eyebrow,
  onClose,
  onConfirm,
  title,
}: {
  busyLabel?: string;
  cancelLabel?: string;
  children: ReactNode;
  confirmLabel: string;
  errorFallback?: string;
  eyebrow: string;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  title: string;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function confirm() {
    setBusy(true);
    setError('');
    try {
      await onConfirm();
      onClose();
    } catch (reason) {
      setError(errorMessage(reason, errorFallback));
      setBusy(false);
    }
  }

  return (
    <Dialog eyebrow={eyebrow} onClose={onClose} title={title}>
      <div className="mt-5 grid gap-3 text-sm text-muted">{children}</div>
      {error && <p className="error-message mt-5 mb-0">{error}</p>}
      <div className="mt-6 flex justify-end gap-3">
        <button className="secondary-button" disabled={busy} onClick={onClose} type="button">
          {cancelLabel}
        </button>
        <button className="primary-button" disabled={busy} onClick={() => void confirm()} type="button">
          {busy ? busyLabel : confirmLabel}
        </button>
      </div>
    </Dialog>
  );
}
