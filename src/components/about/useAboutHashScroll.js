import { useEffect } from 'react';

/**
 * about/useAboutHashScroll — land a deep link ON its section, not at page top.
 *
 * THE PROBLEM THIS EXISTS FOR. The About split turned the old `/how-to?tab=<id>`
 * deep links into `#anchor` links (docs/DESIGN_ABOUT_PAGES.md §1), and the URL
 * half of that works — but the SCROLL half does not come for free, twice over:
 *
 *   1. The redirect uses `history.replaceState`, which by spec performs NO
 *      fragment navigation, so setting `#faq` scrolls nothing. `navigate()` then
 *      explicitly `scrollTo(0, 0)`s, which is right for a page change and wrong
 *      for an anchored one.
 *   2. Even on a COLD load of `/about/guide#faq`, the browser looks for `#faq`
 *      before React has rendered anything, finds no such element, and gives up.
 *
 * Without this hook, `/how-to?tab=faq` would technically "not 404 and not land on
 * the wrong page" while still dumping the reader at the top of a long page —
 * strictly worse than the tab it replaced. Anchor survival means the reader
 * arrives at the content, not merely at a URL that mentions it.
 *
 * Runs once per mount, after paint (rAF), so the sections exist to be found. The
 * scroll is INSTANT, not smooth: the motion law allows a settle micro-fade at
 * most, and a long smooth scroll on arrival reads as the page running away.
 */
export default function useAboutHashScroll() {
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    let id = '';
    try { id = decodeURIComponent(window.location.hash.replace(/^#/, '')); } catch { id = ''; }
    if (!id) return undefined;
    const raf = window.requestAnimationFrame(() => {
      const el = document.getElementById(id);
      // An unknown fragment is a no-op, never a throw and never a jump: an old
      // link with a fragment we retired should still show the page it names.
      if (el && typeof el.scrollIntoView === 'function') el.scrollIntoView({ block: 'start' });
    });
    return () => window.cancelAnimationFrame(raf);
  }, []);
}
