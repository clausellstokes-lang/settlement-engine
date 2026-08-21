import { useEffect, useState } from 'react';

/**
 * Whether the device exposes the fine pointer required by drag authoring.
 * SSR/jsdom default to true so server output is stable and controls remain
 * testable; real coarse-pointer devices report false and stay view-only.
 */
export function useFinePointer() {
  const [fine, setFine] = useState(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return true;
    try { return window.matchMedia('(pointer: fine)').matches; } catch { return true; }
  });

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return undefined;
    let query;
    try { query = window.matchMedia('(pointer: fine)'); } catch { return undefined; }
    const update = () => setFine(Boolean(query.matches));
    query.addEventListener?.('change', update);
    return () => query.removeEventListener?.('change', update);
  }, []);

  return fine;
}
