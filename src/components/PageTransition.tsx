import { ViewTransition, type ReactNode } from 'react';

export function PageTransition({ children, page }: { children: ReactNode; page: string }) {
  return (
    <ViewTransition default="none" exit="page-leave" key={page}>
      {children}
    </ViewTransition>
  );
}
