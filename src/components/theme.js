/**
 * theme.js — Backward-compat shim. Canonical tokens live in `src/design/tokens.js`.
 *
 * History: this file used to be the single source for flat constants
 * (GOLD, INK, MUTED, etc.) and was imported by ~80 components. It's now
 * a re-export shim so those imports keep working unchanged while the
 * actual values come from the new token system.
 *
 * Values intentionally shift to the UI Redesign palette (parchment-50,
 * ink-900, gold-500, etc.) — same NAMES, refreshed VALUES. That's the
 * whole point of the shim: re-skin the app without touching 80 files.
 *
 * New code should import from `src/design/tokens.js` directly:
 *   import { color, semantic, type, space, radius } from '@/design/tokens';
 *
 * Or read the CSS custom properties (emitted at app boot by
 * `emitCssTokens()`):
 *   color: var(--color-gold-500);
 *   color: var(--sem-text-body);
 *   padding: var(--space-4);
 */

import { legacy as L } from '../design/tokens.js';

// ── Colors ──────────────────────────────────────────────────────────────────
export const GOLD     = L.GOLD;
export const GOLD_B   = L.GOLD_B;
export const GOLD_BG  = L.GOLD_BG;

// §14 — "sparkling gold" tint marking a dossier row as the user's own custom
// content (source === 'custom'). A subtle shimmering gold gradient + gold left
// edge. Merge into a row's style. Keyframes `sf-goldShimmer` live in index.css.
export const GOLD_TINT = Object.freeze({
  background: 'linear-gradient(110deg, rgba(255,248,225,0.85) 0%, rgba(253,233,183,0.95) 45%, rgba(255,248,225,0.85) 80%)',
  backgroundSize: '220% 100%',
  animation: 'sf-goldShimmer 3.8s ease-in-out infinite',
  borderColor: L.GOLD,
});
export const INK      = L.INK;
export const INK_DEEP = L.INK_DEEP;
export const MUTED    = L.MUTED;
// BODY — WCAG-passing body-copy color (ink-600). Use this for prose,
// description text, helper text, paragraph body. MUTED is too light
// for body and fails 4.5:1; keep MUTED only for chrome (eyebrows,
// subtitles, hint text in card headers).
export const BODY     = L.BODY;
export const SECOND   = L.SECOND;
export const BORDER   = L.BORDER;
export const BORDER2  = L.BORDER2;
export const CARD     = L.CARD;
export const PARCH    = L.PARCH;
export const CARD_ALT = L.CARD_ALT;
export const CARD_HDR = L.CARD_HDR;

// Flat aliases for dashed-key palette colors (P120 / V-2 color burn-down).
export const VIOLET    = L.VIOLET;
export const VIOLET_BG = L.VIOLET_BG;
// VIOLET_DEEP / AMBER_DEEP — legible TEXT foregrounds for the AI-slate/amber tint
// surfaces (the -500 fills as text fail AA on their -100 tint). VIOLET_DEEP now
// re-exports the reference token so THE SLATE CONVERSION (C13) has one value
// source; this is a token DEFINITION file, exempt from no-raw-color.
export const VIOLET_DEEP = L.VIOLET_DEEP; // AI text on slate-100 (== color['slate-700'])
export const AMBER_DEEP  = '#8A5212'; // amber text on amber-100 (== color['amber-700'])
export const RED       = L.RED;
export const RED_BG    = L.RED_BG;
export const GREEN     = L.GREEN;
export const GREEN_BG  = L.GREEN_BG;
export const AMBER     = L.AMBER;
export const AMBER_BG  = L.AMBER_BG;
export const BLUE      = L.BLUE;
export const BLUE_BG   = L.BLUE_BG;
export const GOLD_DEEP = L.GOLD_DEEP;
export const PARCH_100 = L.PARCH_100;
// GOLD_TXT / GOLD_SOFT / BORDER_STRONG are re-exported from their standalone
// (tree-shakeable) token definitions — NOT the first-paint `legacy` object — so
// the Realm/map chrome that consumes them keeps them in the lazy map chunk and
// off the first-paint closure budget. See design/tokens.js.
export { GOLD_TXT, GOLD_SOFT, BORDER_STRONG } from '../design/tokens.js';

// swatch — exact-value migration swatchbook (see design/tokens.js). Routes the
// long tail of raw inline hex colors through the token system with zero visual
// change so no-raw-color can go to error.
export { swatch } from '../design/tokens.js';

// ── Typography ──────────────────────────────────────────────────────────────
export const sans   = L.sans;
export const serif_ = L.serif_;

// ── Spacing scale (px) ──────────────────────────────────────────────────────
export const SP = L.SP;

// ── Border-radius scale (px) ────────────────────────────────────────────────
export const R = L.R;

// ── Font-size scale (px) ────────────────────────────────────────────────────
export const FS = L.FS;

// ── Elevation scale (box-shadow) ─────────────────────────────────────────────
// ELEV[1] default cards · ELEV[2] hover/sticky · ELEV[3] modals/popovers.
export const ELEV = L.ELEV;

// ── Layout (page content widths) ─────────────────────────────────────────────
// Shared caps so pages stop inventing their own narrow columns. PAGE_MAX for
// content/reference/marketing pages, PROSE_MAX for reading columns inside a
// wide page, FORM_MAX for genuine forms (auth/success) that stay narrow.
export const PAGE_MAX    = L.PAGE_MAX;
export const PROSE_MAX   = L.PROSE_MAX;
// LANDING_MAX — the compact landing/hero frame (narrower than PAGE_MAX). The
// Create hero + empty-state column share it so the landing reads as one framed
// composition rather than sprawling full-bleed (P12).
export const LANDING_MAX = L.LANDING_MAX;
export const FORM_MAX    = L.FORM_MAX;

// ── Display fallbacks ────────────────────────────────────────────────────────
// One source for "this fact is absent/unknown". Render this (an em-dash) instead
// of an empty string or an ad-hoc literal so every surface shows the same
// placeholder for a missing value.
export const EMPTY_VALUE = '—';

// ── Chrome heights + mobile safe-area clearance ──────────────────────────────
// One frozen source for the fixed-chrome pixel heights the layout paints, so
// map/mobile surfaces stop re-deriving them with local constants. Mobile
// clearances fold in the iOS/Android safe-area inset via `bottomClearance()` so
// fixed content never tucks under the home indicator OR the bottom nav.
//
//   headerMobile  — the mobile sticky top bar (~59px painted).
//   toolbarHeight — the dossier toolbar that pins under the header (~64px).
//   bottomNav     — the 5-tab mobile bottom nav row (44px tap floor + borders).
//   scrollPadDesktop — scroll-padding-top so anchored/focus scrolls clear chrome.
//   mapShellOffset — viewport height the Realm map shell subtracts for the
//                   desktop header + main padding + breathing room.
//   mapShellMin    — the map shell's minimum height floor.
//   fabLift / nudgeLift — how far fixed bottom overlays sit above the bottom nav.
//   footerPadMobile / mainPadMobile — bottom padding clearing the fixed nav.
//   stickyTop      — desktop sticky-aside top breathing gap.
export const CHROME = Object.freeze({
  headerMobile:    59,
  toolbarHeight:   64,
  bottomNav:       57,
  scrollPadDesktop: 124,
  mapShellOffset:  120,
  mapShellMin:     500,
  fabLift:         70,
  nudgeLift:       92,
  footerPadMobile: 88,
  mainPadMobile:   100,
  stickyTop:       12,
});

/**
 * bottomClearance — safe-area-aware bottom offset for fixed/sticky mobile
 * overlays. Adds the device home-indicator inset to a base px clearance so a
 * FAB, nudge, footer, or scroll control always sits clear of BOTH the bottom
 * nav and the safe area. On desktop, pass the plain px value instead.
 *
 * @param {number} basePx - base clearance in px above the viewport bottom.
 * @returns {string} a CSS calc() expression, e.g. 'calc(70px + env(safe-area-inset-bottom))'.
 */
export const bottomClearance = (basePx) =>
  `calc(${basePx}px + env(safe-area-inset-bottom))`;
