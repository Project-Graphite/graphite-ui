import { useCallback, useEffect, useLayoutEffect, useRef, useState, type RefObject } from 'react';
import { useDismiss } from './useDismiss.js';

const gap = 6;
const margin = 8;

export function useAnchoredPanel<Trigger extends HTMLElement, Panel extends HTMLElement>(minWidth: number | 'auto' = 0, align: 'start' | 'end' = 'start') {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<Trigger>(null);
  const panel = useRef<Panel>(null);
  const close = useCallback(() => setOpen(false), []);
  useDismiss(open, root as RefObject<HTMLElement | null>, close);

  const place = useCallback(() => {
    const anchor = trigger.current?.getBoundingClientRect();
    const element = panel.current;
    if (!anchor || !element) return;
    const width = minWidth === 'auto' ? element.offsetWidth : Math.min(Math.max(anchor.width, minWidth), window.innerWidth - margin * 2);
    const left = Math.min(Math.max(align === 'end' ? anchor.right - width : anchor.left, margin), window.innerWidth - width - margin);
    const below = window.innerHeight - anchor.bottom - gap - margin;
    const above = anchor.top - gap - margin;
    const height = element.scrollHeight;
    const upwards = height > below && above > below;
    if (minWidth !== 'auto') element.style.width = `${width}px`;
    element.style.left = `${left}px`;
    element.style.maxHeight = `${Math.max(upwards ? above : below, 160)}px`;
    element.style.top = upwards ? '' : `${anchor.bottom + gap}px`;
    element.style.bottom = upwards ? `${window.innerHeight - anchor.top + gap}px` : '';
  }, [align, minWidth]);

  useLayoutEffect(() => {
    const element = panel.current;
    if (!open || !element) return;
    element.showPopover?.();
    place();
    return () => element.hidePopover?.();
  }, [open, place]);

  useEffect(() => {
    if (!open) return;
    window.addEventListener('resize', place);
    window.addEventListener('scroll', place, true);
    return () => {
      window.removeEventListener('resize', place);
      window.removeEventListener('scroll', place, true);
    };
  }, [open, place]);

  return { close, open, panel, place, root, setOpen, trigger };
}
