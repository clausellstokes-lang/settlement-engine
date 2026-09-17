/**
 * useChromeInsets: measure the pinned footer and publish it as CSS custom properties.
 *
 * THE OWNER'S ORDERS (2026-09-16): the footer stays on screen "the same way on every
 * page", the way the header does, but only its links row floats at the viewport bottom;
 * the rest of the footer, the home button included, shows only when the user scrolls all
 * the way to the bottom. App.jsx makes the global <footer> sticky with a NEGATIVE bottom
 * offset (lib/chromeInsets.js explains the mechanism) where the full painted arrow shows,
 * 1024 px and up (the chair's ruling on the arrow plan: below that the bottom bar holds
 * the bottom edge and the footer lies in the page flow). This hook measures what that
 * needs:
 *
 *   - THE BAND (--sf-footer-inset): the distance from the footer's top edge to the top
 *     of the first row after the links row, floored to whole px. It is the part held in
 *     view, so every fixed layer anchored to the viewport bottom composes it through
 *     aboveFooter()/FOOTER_INSET, and the landing hero's desktop letterbox (an inline
 *     style in HomeLanding) ends at its top edge.
 *   - THE TUCK (--sf-footer-tuck): the footer's full height minus the band, the part
 *     that hangs below the viewport edge until the end of the page.
 *
 * The header's height is NOT measured here any more: the header is the owner's arrow
 * painting, whose lengths are computed from the page width, and
 * components/nav/ArrowHeader.jsx is the one writer of --sf-header-h and its siblings.
 *
 * The links row is found by FOOTER_LINKS_ATTR on LegalRibbonRow's <nav>, and the band
 * ends at its next sibling (the home button, or the copyright line when there is none).
 *
 * The hook also injects the chrome's stylesheet rules (scroll-padding-bottom, the footer
 * controls' matching scroll-margin, the print resets, the keyboard reveal) from
 * lib/chromeInsets.js, which says why they are not in the render-blocking src/index.css.
 *
 * Every height is MEASURED rather than tokenised: the footer's box depends on the web
 * font, browser zoom and link wrapping.
 *
 * When the footer is not pinned (below 1024 px) the band and the tuck are both '0px', so
 * every consumer computes exactly the offset it used before the footer was pinned.
 *
 * LIFECYCLE: a layout effect injects the rules (once) and writes before paint; a
 * ResizeObserver on the footer rewrites on any size change (a font swap or a wrap
 * changes the footer's box); the effect re-runs when `footerPinned` flips; cleanup
 * disconnects and removes both properties (the injected rules stay, inert without the
 * variables, the way lib/imFellFace.js leaves its face).
 *
 * @enforced-by tests/components/pinnedFooter.test.jsx
 */
import { useLayoutEffect, useRef } from 'react';
import {
  CHROME_INSET_RULES, CHROME_INSET_STYLE_ID, FOOTER_INSET_VAR, FOOTER_LINKS_ATTR, FOOTER_TUCK_VAR,
} from '../lib/chromeInsets.js';

/**
 * @param {boolean} footerPinned - true when the footer is sticky (the full arrow, 1024 px and up).
 * @returns {{ footerRef: import('react').MutableRefObject<HTMLElement|null> }}
 */
export default function useChromeInsets(footerPinned) {
  /** @type {import('react').MutableRefObject<HTMLElement|null>} */
  const footerRef = useRef(null);

  useLayoutEffect(() => {
    const root = document.documentElement.style;
    /** @param {string} name @param {number} px */
    const set = (name, px) => root.setProperty(name, `${px}px`);
    // Inject the chrome's rules once (idempotent across remounts: the DOM is the truth).
    if (!document.getElementById(CHROME_INSET_STYLE_ID)) {
      document.head.appendChild(Object.assign(document.createElement('style'), {
        id: CHROME_INSET_STYLE_ID, textContent: CHROME_INSET_RULES,
      }));
    }
    const write = () => {
      const footer = footerPinned ? footerRef.current : null;
      const box = footer && footer.getBoundingClientRect();
      // The first row after the links row: the home button, or the copyright line.
      const next = footer && footer.querySelector(`[${FOOTER_LINKS_ATTR}]+*`);
      const band = box ? Math.floor((next ? next.getBoundingClientRect().top : box.bottom) - box.top) : 0;
      set(FOOTER_INSET_VAR, band);
      set(FOOTER_TUCK_VAR, box ? box.height - band : 0);
    };
    write();
    // Older engines (and jsdom) have no ResizeObserver: the first measurement still lands.
    const observer = globalThis.ResizeObserver ? new ResizeObserver(write) : null;
    if (footerRef.current && observer) observer.observe(footerRef.current);
    return () => {
      observer?.disconnect();
      for (const name of [FOOTER_INSET_VAR, FOOTER_TUCK_VAR]) root.removeProperty(name);
    };
  }, [footerPinned]);

  return { footerRef };
}
