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

import { legacy as L, semantic as SEM, layout as LAYOUT } from '../design/tokens.js';

// Shared page-width caps (page 1200 / prose 820 / landing 720 / form 460).
// Re-exported through the theme shim so map/chrome surfaces can route their
// frame through the same cap every other top-level page uses (P12) without
// reaching into design/tokens directly.
export const layout = LAYOUT;

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

// Flat aliases for dashed-key palette colors.
export const VIOLET    = L.VIOLET;
export const VIOLET_DEEP = L.VIOLET_DEEP;
export const VIOLET_BG = L.VIOLET_BG;
export const RED       = L.RED;
export const RED_BG    = L.RED_BG;
export const GREEN     = L.GREEN;
export const GREEN_DEEP = L.GREEN_DEEP;
export const GREEN_BG  = L.GREEN_BG;
export const AMBER     = L.AMBER;
export const AMBER_BG  = L.AMBER_BG;
export const AMBER_DEEP = L.AMBER_DEEP;
export const BLUE      = L.BLUE;
export const BLUE_BG   = L.BLUE_BG;
export const GOLD_DEEP = L.GOLD_DEEP;
// Legible foreground/fill/border tokens for the warm palette. GOLD_TXT is the
// WCAG-passing gold text color (gold-500 as text fails); GOLD_SOFT is an opaque
// soft-gold button fill; BORDER_STRONG is a >=3:1 interactive-control border.
export const GOLD_TXT  = L.GOLD_TXT;
export const GOLD_SOFT = L.GOLD_SOFT;
export const BORDER_STRONG = L.BORDER_STRONG;
export const PARCH_100 = L.PARCH_100;

// swatch — exact-value migration swatchbook (see design/tokens.js). Routes the
// long tail of raw inline hex colors through the token system with zero visual
// change so no-raw-color can go to error.
export { swatch } from '../design/tokens.js';

// ── Semantic status/tint surfaces ────────────────────────────────────────────
// Banner hairlines and the Account ledger tile tints, tokenized so the
// boundary/tint colours theme and contrast-audit centrally instead of as inline
// rgba()/hex literals scattered across the Account sections. Same values, named.
export const DANGER_BORDER  = SEM.destructiveBorder;
export const SUCCESS_BORDER = SEM.successBorder;
export const TINT_GOLD       = SEM.tintGoldSurface;
export const TINT_VIOLET     = SEM.tintVioletSurface;
export const TINT_VIOLET_HI  = SEM.tintVioletSurfaceHi;
export const TINT_GREEN      = SEM.tintGreenSurface;
export const TINT_AMBER_HI   = SEM.tintAmberSurfaceHi;

// ── Typography ──────────────────────────────────────────────────────────────
export const sans   = L.sans;
export const serif_ = L.serif_;

// ── Spacing scale (px) ──────────────────────────────────────────────────────
export const SP = L.SP;

// ── Chrome metrics (sticky/fixed frame heights + scroll clearance) ───────────
// Single source of truth for the app's persistent chrome geometry so every
// sticky bar, fixed FAB, footer, scroll-padding, and floating nudge reads the
// SAME numbers instead of re-deriving them as scattered magic literals. Before
// this, the mobile header height (~59), the bottom-nav clearance (88/100), the
// FAB lift (70), the nudge lift (92), and the dossier scroll-padding (64/124)
// were each typed by hand at their call site, so any chrome height change had
// to be chased across App.jsx + four panels and drifted out of sync.
//
// Values are the EFFECTIVE pixel heights today (verified against the call
// sites) so desktop renders byte-identical. Mobile clearances fold in the
// iOS/Android safe-area inset via `bottomClearance()` so fixed content never
// tucks under the home indicator OR the bottom nav.
//
//   headerMobile  — the mobile sticky top bar: SP.sm*2 padding + a 44px brand
//                   row, rounded to the ~59px the layout actually paints.
//   toolbarHeight — the WizardOutputToolbar that pins under the header while a
//                   dossier is on screen (~64px tall).
//   bottomNav     — the 5-tab mobile bottom nav row (44px tap floor + borders).
//   scrollPadDesktop / scrollPadMobile — scroll-padding-top reserved on the
//                   document scroller so anchored/focus scrolls clear the
//                   stacked chrome. Desktop stacks header(60)+toolbar(64);
//                   mobile stacks them at top:0 so one header's worth suffices.
//   mapShellOffset — viewport height the Realm map shell subtracts for the
//                   desktop header + main padding + breathing room.
//   mapShellMin    — the map shell's minimum height floor.
//   fabLift / nudgeLift — how far fixed bottom-right / bottom-center overlays
//                   sit above the mobile bottom nav so they never overlap it.
//   footerPadMobile / mainPadMobile — bottom padding that clears the fixed
//                   bottom nav for the footer + main scroll content.
//
// bottomClearance(base) — returns a CSS calc() that adds the safe-area inset to
// a base px clearance, so one helper feeds every mobile bottom offset.
export const CHROME = Object.freeze({
  headerMobile:    59,
  toolbarHeight:   64,
  bottomNav:       57,
  scrollPadDesktop: 124,
  scrollPadMobile:  64,
  mapShellOffset:  120,
  mapShellMin:     500,
  fabLift:         70,
  nudgeLift:       92,
  footerPadMobile: 88,
  mainPadMobile:   100,
  // Desktop sticky-aside top offset — the small breathing gap a sticky side
  // rail (e.g. SettlementDetail's NextActionRail) pins below the top of the
  // scroll region. Routed through the chrome group so the one sticky offset
  // reads from the same place every other clearance does.
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
export const LANDING_MAX = L.LANDING_MAX;
export const FORM_MAX    = L.FORM_MAX;
