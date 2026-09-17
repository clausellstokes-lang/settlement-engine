/**
 * lib/chromeInsets.js: THE PINNED FOOTER'S BAND AND TUCK, as CSS custom-property
 * names and the compositions every bottom-anchored surface uses.
 *
 * THE OWNER'S ORDERS (2026-09-16). First: the footer stays on screen "the same way on
 * every page", the way the header does. Then, of what stays on screen: only the links
 * row (Pricing | Feedback & support | Terms | Privacy | About) floats at the viewport
 * bottom, and "only when a user scrolls all the way to the bottom does it show the rest
 * of the footer, including the logo". The footer's look and content do not change.
 *
 * THE MECHANISM. On desktop the global <footer> in App.jsx stays `position: sticky` on
 * the header's layer, but its bottom offset is NEGATIVE by exactly the height of the
 * part below the links row (THE TUCK): `bottom: calc(0px - var(--sf-footer-tuck))`. So
 * only THE BAND (the footer's top padding, the links row and the gap under it) is held
 * in view and the rest hangs below the viewport edge; at maximum scroll the sticky
 * element reaches its natural place in the flow and the whole footer shows. No script
 * toggles anything and nothing animates.
 *
 * THE BAND IS THE INSET. Every fixed layer anchored to the viewport bottom (the
 * scroll-button stack, the toasts, the corner cards, the Surveyor docks) sits above the
 * band through aboveFooter()/FOOTER_INSET, and every viewport-sized box leaves room for
 * it. In the last tuck's worth of scroll the whole footer rises past that anchor line and
 * into those layers (a transient toast then covers the links row); that price, and why it
 * is paid, is recorded in docs/FIRST_CONTACT_BACKLOG.md under THE PINNED FOOTER.
 *
 * The heights are MEASURED, never tokenised: the footer's box depends on the web font,
 * browser zoom and link wrapping, and a few pixels short would reopen the landing seam
 * the first order was about. src/hooks/useChromeInsets.js writes them onto the document
 * element under these names (the lib/imFellFace.js precedent for a document-level custom
 * property). The band is floored to whole px, so no pixel of the home button shows; the
 * tuck is the footer's full height minus that band, so the band's top edge lands on a
 * whole pixel.
 *
 * A LEAF ON PURPOSE: components/theme.js re-exports the names (surfaces import their
 * chrome vocabulary from theme.js), while the hook imports them from here. theme.js sits
 * outside the full-tree typecheck include, and a src/hooks file importing it directly
 * would pull theme.js into that gate.
 *
 * THE RULES LIVE HERE TOO, NOT IN src/index.css, AND THAT IS A BYTE LAW. The pinned
 * footer needs four stylesheet rules (below). index.css is the one render-blocking
 * sheet, budgeted at 19,800 B by tests/build/firstPaintNonJs.test.js, and it measured
 * 19,795 B before the pinned footer. So the hook injects them as one small <style> at
 * mount (the lib/imFellFace.js injection precedent; the CSP allows inline styles),
 * before the app shell's first paint. This module rides the first-paint entry closure
 * instead, so it is kept terse on purpose.
 *
 * @enforced-by tests/components/pinnedFooter.test.jsx
 * @enforced-by tests/lint/bottomAnchoredChrome.walker.test.js
 */

/** The pinned BAND's measured height; '0px' whenever the footer is not pinned. */
export const FOOTER_INSET_VAR = '--sf-footer-inset';

/** THE TUCK: the footer's height below the band; '0px' whenever it is not pinned. */
export const FOOTER_TUCK_VAR = '--sf-footer-tuck';

/** The header's measured height (the desktop header wraps at narrow widths). */
export const HEADER_HEIGHT_VAR = '--sf-header-h';

/**
 * The stable hook on LegalRibbonRow's links row (the <nav>). The band ends at the top
 * of the row after it, and the rows after it are the tucked ones.
 */
export const FOOTER_LINKS_ATTR = 'data-sf-footer-links';

/**
 * The footer inset (the band) as a var() reference with a 0px fallback, so jsdom, the
 * first frame and every mobile render compute exactly the value they computed before
 * the footer was pinned.
 */
export const FOOTER_INSET = `var(${FOOTER_INSET_VAR}, 0px)`;

/**
 * The footer's sticky bottom offset: minus the tuck. 0px on phones, in jsdom and on the
 * first frame (the fallback), and 0px while a tucked control has keyboard focus (the
 * reveal rule in CHROME_INSET_RULES sets the variable on the footer itself).
 */
export const FOOTER_TUCKED_BOTTOM = `calc(0px - var(${FOOTER_TUCK_VAR}, 0px))`;

/**
 * aboveFooter: lift a bottom offset by the pinned footer's band.
 *
 * @param {number|string} base - a px number, or any CSS length or calc() expression
 *   (for example a bottomClearance() result).
 * @returns {string} for example 'calc(16px + var(--sf-footer-inset, 0px))'.
 */
export const aboveFooter = (base) =>
  `calc(${typeof base === 'number' ? `${base}px` : base} + ${FOOTER_INSET})`;

/**
 * The id of the injected sheet. useChromeInsets appends the sheet only when no element
 * carries it (idempotent across remounts, like ensureImFellFace; the DOM is the "already
 * injected" truth).
 */
export const CHROME_INSET_STYLE_ID = 'sf-chrome-insets';

/** The app's one global footer (a direct child of App.jsx's .parchment-bg root). */
const APP_FOOTER = '.parchment-bg>footer';

/**
 * The pinned footer's four stylesheet rules, as one text (single source for the
 * injection and its test):
 *
 *   1. html scroll-padding-bottom: keyboard focus and nearest-aligned scrolls stop
 *      above the band (WCAG 2.2 SC 2.4.11, Focus Not Obscured). GenerateWizard sets
 *      only the scroll-padding-top longhand inline, so the two never clash.
 *   2. THE FOOTER'S OWN CONTROLS ARE EXEMPT FROM (1). They sit inside the padded strip
 *      by design, and no scroll can move a sticky footer, so without this every focus
 *      on a footer link mid-page scrolled the document by about half a viewport and
 *      left the link exactly where it was (measured in Chromium: about 405 px per Tab
 *      at 1280x800, and about 370 px in the whole-footer-pinned shape before the tuck).
 *      A scroll-margin of the band on top and minus the band on the bottom moves each
 *      footer control's focus rectangle up by exactly the padding, so a control that is
 *      on screen counts as on screen and nothing scrolls. On phones the band is 0px and
 *      the rule is a no-op.
 *   3. print: paper has no viewport, so the footer lies back in the flow instead of
 *      sitting over a printed page's content (!important beats its inline sticky).
 *   4. THE KEYBOARD REVEAL. The home button sits in the tuck, below the viewport edge,
 *      yet it stays in the tab order. While a control outside the links row has
 *      :focus-visible, the tuck is 0px on the footer itself, so the whole footer shows
 *      and the focused control is never hidden. It keys on :focus-visible, not
 *      :focus-within, so a mouse press on a footer control never makes the footer jump.
 *
 * The landing hero's desktop LETTERBOX (sized to the gap between the header and the
 * band) is not a rule here: it is an inline style in the lazy HomeLanding chunk, because
 * every byte of this module rides the first-paint entry closure, whose raw budget
 * (tests/build/vendorPdfLazy.test.js) had under 100 B to spare.
 */
export const CHROME_INSET_RULES = `html{scroll-padding-bottom:${FOOTER_INSET}}`
  + `${APP_FOOTER} *{scroll-margin:${FOOTER_INSET} 0 calc(0px - ${FOOTER_INSET})}`
  + `@media print{${APP_FOOTER}{position:static!important}}`
  + `${APP_FOOTER}:has(:focus-visible:not([${FOOTER_LINKS_ATTR}] *)){${FOOTER_TUCK_VAR}:0px}`;
