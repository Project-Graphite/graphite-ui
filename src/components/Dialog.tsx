import { useEffect, useId, useRef, type ReactNode } from 'react';
import { Icon } from './Icon.js';

export function Dialog({
  children,
  eyebrow,
  onClose,
  title,
}: {
  children: ReactNode;
  eyebrow?: string;
  onClose: () => void;
  title: string;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    dialog.current?.showModal();
    return () => opener?.focus();
  }, []);

  return (
    <dialog
      aria-labelledby={titleId}
      className="m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-lg rounded-2xl border border-line bg-surface p-0 text-ink backdrop:bg-paper/80 max-sm:mb-0 max-sm:max-h-[90dvh] max-sm:w-full max-sm:max-w-none max-sm:rounded-b-none [scrollbar-gutter:stable]"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      ref={dialog}
    >
      <div className="p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            {eyebrow && <p className="eyebrow mb-2">{eyebrow}</p>}
            <h2 className="m-0 text-xl font-medium" id={titleId}>
              {title}
            </h2>
          </div>
          <button aria-label="Close" className="icon-button -mt-1.5 -mr-2 shrink-0" onClick={onClose} type="button">
            <Icon name="x" size={18} />
          </button>
        </div>
        {children}
      </div>
    </dialog>
  );
}
