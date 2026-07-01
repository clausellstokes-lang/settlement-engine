import { useEffect, useRef } from 'react';

/**
 * useFocusOnViewChange — move focus to `ref` whenever `viewKey` changes (a route /
 * view transition), skipping the initial mount so first load isn't disrupted.
 *
 * In an SPA the DOM doesn't reload on navigation, so without this a keyboard or
 * screen-reader user stays wherever they were (usually the top of the header) after
 * changing views — WCAG 2.4.3 (Focus Order). Pointing focus at the <main> region (or
 * its heading) on each change gives them a consistent, predictable landing spot. The
 * target must be programmatically focusable (tabIndex={-1}).
 *
 * Extracted + unit-tested so the behavior is a guarded contract, not a convention a
 * future App refactor can silently drop (the exact regression the audit found).
 *
 * @param {unknown} viewKey  a value that changes on every view transition
 * @param {import('react').RefObject<HTMLElement>} ref  the focus target
 */
export function useFocusOnViewChange(viewKey, ref) {
  const isFirst = useRef(true);
  useEffect(() => {
    if (isFirst.current) { isFirst.current = false; return; }
    ref.current?.focus?.();
  }, [viewKey, ref]);
}
