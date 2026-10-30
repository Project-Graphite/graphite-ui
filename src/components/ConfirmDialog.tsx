import { useState, type ReactNode } from 'react';
import { errorMessage } from '../lib/errors.js';
import { Banner } from './Banner.js';
import { Button } from './Button.js';
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
  tone,
}: {
  busyLabel?: string;
  cancelLabel?: string;
  children: ReactNode;
  confirmLabel: string;
  errorFallback?: string;
  eyebrow?: string;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  title: string;
  tone?: 'danger';
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
      {error && (
        <Banner className="mt-5" tone="danger">
          {error}
        </Banner>
      )}
      <div className="mt-6 flex justify-end gap-3">
        <Button disabled={busy} onClick={onClose}>
          {cancelLabel}
        </Button>
        <Button disabled={busy} onClick={() => void confirm()} variant={tone === 'danger' ? 'danger' : 'primary'}>
          {busy ? busyLabel : confirmLabel}
        </Button>
      </div>
    </Dialog>
  );
}
