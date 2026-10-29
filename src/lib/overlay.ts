import { createContext, useContext } from 'react';

export const OverlayContext = createContext(false);

export function coarsePointer() {
  return window.matchMedia('(pointer: coarse)').matches;
}

export function useFieldAutoFocus(autoFocus: boolean | undefined) {
  const inOverlay = useContext(OverlayContext);
  return autoFocus && !(inOverlay && coarsePointer());
}
