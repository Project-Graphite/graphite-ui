import type { ReactNode } from 'react';
import { useDelayed } from '../lib/useDelayed.js';

export function Skeleton({ className = '' }: { className?: string }) {
  return <span aria-hidden="true" className={`skeleton ${className}`} />;
}

export function Placeholder({
  children,
  className = '',
  label,
}: {
  children: ReactNode;
  className?: string;
  label: string;
}) {
  const shown = useDelayed(placeholderDelayMs);
  return (
    <div aria-busy="true" aria-label={label} className={`${className} ${shown ? 'placeholder-in' : 'invisible'}`} role="status">
      {children}
    </div>
  );
}

export const placeholderDelayMs = 200;

export const actionSkeletonClass = 'h-[2.375rem] rounded-lg';

export function ListSkeleton({
  label = 'Loading',
  rows = 5,
}: {
  label?: string;
  rows?: number;
}) {
  return (
    <Placeholder label={label}>
      {Array.from({ length: rows }, (_, index) => (
        <div aria-hidden="true" className="border-b border-line-soft py-4" key={index}>
          <Skeleton className="h-4 w-1/2 max-w-xs" />
          <Skeleton className="mt-2 h-3 w-1/4 max-w-32" />
        </div>
      ))}
    </Placeholder>
  );
}

export function LinesSkeleton({
  className = '',
  label = 'Loading',
  lines = 3,
}: {
  className?: string;
  label?: string;
  lines?: number;
}) {
  return (
    <Placeholder className={`grid gap-2.5 ${className}`} label={label}>
      {Array.from({ length: lines }, (_, index) => (
        <Skeleton
          className={`h-3.5 ${index === lines - 1 ? 'w-2/5' : index % 2 ? 'w-5/6' : 'w-full'}`}
          key={index}
        />
      ))}
    </Placeholder>
  );
}

export function FormSkeleton({
  fields = 3,
  label = 'Loading settings',
}: {
  fields?: number;
  label?: string;
}) {
  return (
    <Placeholder className="grid max-w-3xl gap-6" label={label}>
      <Skeleton className="h-6 w-40" />
      {Array.from({ length: fields }, (_, index) => (
        <div aria-hidden="true" className="grid gap-2" key={index}>
          <Skeleton className="h-3.5 w-28" />
          <Skeleton className="h-12 rounded-lg" />
        </div>
      ))}
      <Skeleton className="h-12 w-36 rounded-lg" />
    </Placeholder>
  );
}

export function PageSkeleton({
  children,
  label = 'Loading page',
}: {
  children?: ReactNode;
  label?: string;
}) {
  return (
    <Placeholder label={label}>
      <Skeleton className="h-3 w-28" />
      <Skeleton className="mt-4 h-9 w-2/3 max-w-lg" />
      <div aria-hidden="true" className="mt-8">
        {children ?? (
          <div className="grid max-w-2xl gap-2.5">
            <Skeleton className="h-3.5 w-full" />
            <Skeleton className="h-3.5 w-5/6" />
            <Skeleton className="h-3.5 w-2/5" />
          </div>
        )}
      </div>
    </Placeholder>
  );
}

export function TabsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div aria-hidden="true" className="flex gap-6 border-b border-line pb-3">
      {Array.from({ length: count }, (_, index) => (
        <Skeleton className="h-4 w-16" key={index} />
      ))}
    </div>
  );
}

export function FormPanelSkeleton({ fields = 2, label }: { fields?: number; label: string }) {
  return (
    <div className="form-panel">
      <Placeholder className="grid gap-5" label={label}>
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-9 w-1/2" />
        {Array.from({ length: fields }, (_, index) => (
          <div aria-hidden="true" className="grid gap-2" key={index}>
            <Skeleton className="h-3.5 w-20" />
            <Skeleton className="h-12 rounded-lg" />
          </div>
        ))}
        <Skeleton className="h-12 rounded-lg" />
      </Placeholder>
    </div>
  );
}
