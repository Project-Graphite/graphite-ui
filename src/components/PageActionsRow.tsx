import type { ReactNode } from 'react';
import { Tabs, type TabItem } from './Tabs.js';

export function PageActionsRow({
  actions,
  tabs,
  tabsLabel = 'Sections',
  title,
  toolbar,
  toolbarEnd,
}: {
  actions?: ReactNode;
  tabs?: TabItem[];
  tabsLabel?: string;
  title: ReactNode;
  toolbar?: ReactNode;
  toolbarEnd?: ReactNode;
}) {
  const rowEnd = tabs ? toolbarEnd : (toolbarEnd || actions) && (
    <>
      {toolbarEnd}
      {actions}
    </>
  );
  return (
    <>
      <h1 className="sr-only">{title}</h1>
      {(tabs || toolbar || toolbarEnd || actions) && (
        <div className="page-actions">
          {tabs && (
            <div className="page-actions-row">
              <Tabs items={tabs} label={tabsLabel} />
              {actions && <div className="page-actions-end">{actions}</div>}
            </div>
          )}
          {(toolbar || rowEnd) && (
            <div className="page-actions-row">
              {toolbar && <div className="page-actions-start">{toolbar}</div>}
              {rowEnd && <div className="page-actions-end">{rowEnd}</div>}
            </div>
          )}
        </div>
      )}
    </>
  );
}
