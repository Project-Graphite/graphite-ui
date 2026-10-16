import type { ReactNode } from 'react';

export function EmptyState({
  children,
  level = 2,
  title,
}: {
  children?: ReactNode;
  level?: 2 | 3 | 4 | 5 | 6;
  title: string;
}) {
  const Heading = `h${level}` as const;
  return (
    <div className="rounded-xl border border-dashed border-line p-8 text-center">
      <Heading className="m-0 text-xl font-medium">{title}</Heading>
      {children}
    </div>
  );
}
