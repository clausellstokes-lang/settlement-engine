import { useEffect, useRef } from 'react';

/**
 * useFocusOnViewChange — WCAG 2.4.3 focus management for the SPA.
 *
 * On every `view` change, move keyboard/screen-reader focus to the <main>
 * region (the ref target) so a navigator isn't stranded at the top of the DOM
 * after the route swaps under them. Pairs with the skip-to-content link and
 * `main[tabIndex=-1]` in App.jsx.
 *
 * Skips the very first render (the initial page load already places focus at
 * the document top, which is correct for a fresh visit — only a *navigation*
 * should pull focus into <main>).
 *
 * @param {string} view                 the current view id (changes on nav)
 * @param {{ current: (HTMLElement | null) }} mainRef  ref to the <main> element
 */
export function useFocusOnViewChange(view, mainRef) {
  const first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    const el = mainRef?.current;
    if (el && typeof el.focus === 'function') {
      // Preventing scroll keeps the focus move from jumping the viewport; the
      // view itself owns where it scrolls to.
      el.focus({ preventScroll: true });
    }
  }, [view, mainRef]);
}

export default useFocusOnViewChange;
