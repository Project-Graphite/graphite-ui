import type { ReactNode } from 'react';

export function SectionHeading({
  action,
  description,
  id,
  level = 2,
  title,
}: {
  action?: ReactNode;
  description?: ReactNode;
  id?: string;
  level?: 2 | 3;
  title: ReactNode;
}) {
  const Heading = level === 2 ? 'h2' : 'h3';
  return (
    <div className="section-heading">
      <div className="section-heading-text">
        <Heading className={`m-0 ${level === 2 ? 'text-h2' : 'text-h3'}`} id={id}>
          {title}
        </Heading>
        {description && <p className="section-heading-description">{description}</p>}
      </div>
      {action}
    </div>
  );
}
