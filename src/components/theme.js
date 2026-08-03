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
export const SLATE    = L.SLATE;
export const SLATE_BG = L.SLATE_BG;
// SLATE_DEEP / AMBER_DEEP — legible TEXT foregrounds for the AI-slate/amber tint
// surfaces (the -500 fills as text fail AA on their -100 tint). SLATE_DEEP
// re-exports the reference token so THE SLATE CONVERSION (C13) has one value
// source; this is a token DEFINITION file, exempt from no-raw-color.
// (VIOLET*→SLATE* rename completed at fold batch 2, 2026-07-19 — no aliases.)
export const SLATE_DEEP = L.SLATE_DEEP; // AI text on slate-100 (== color['slate-700'])
export const AMBER_DEEP  = '#8A5212'; // amber text on amber-100 (== color['amber-700'])
export const GREEN_DEEP = L.GREEN_DEEP; // legible green text on green-100 tints (== color['green-700'])
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

// ── THE FLETCHED RIBBON (owner directive, 2026-08-03) ────────────────────────
// The desktop ribbon's Create · Library · Realm trio reads as the back half of an
// arrow in flight: ONE continuous leather-brown band carrying three forward-leaning
// feathers. These are that band's only colour and geometry source — NavRibbon.jsx
// and NavDivider.jsx read them and spell no hex and no pixel of their own.
//
// FLETCH_BROWN is the theme's OWN gold-800 — the deepest brown in the gold family,
// already carried as GOLD_TXT — so the band is DERIVED from the palette rather than
// invented beside it, and a palette edit moves the fletching with it.
// FLETCH_BROWN_LIFT is the one authored step between gold-800 (#6A511F) and gold-700
// (#8C6F32): the ACTIVE feather's lift, chosen as the LIGHTEST value that still
// clears WCAG AA for the ribbon's 12px label.
//
// MEASURED (tests/design/contrast.test.js recomputes every ratio below; WCAG 2.2
// AA = 4.5:1 for normal text, SC 1.4.11 = 3:1 for a UI boundary):
//   PARCH_100 on FLETCH_BROWN ......... 6.24:1  resting feather label        AA ✓
//   PARCH     on FLETCH_BROWN_LIFT .... 5.71:1  active feather label         AA ✓
//   PARCH_100 on FLETCH_BROWN_LIFT .... 5.18:1  the label register's floor   AA ✓
//   GOLD      on FLETCH_BROWN ......... 3.12:1  fletch stroke + active edge, against
//                                               the band it is cut into      1.4.11 ✓
//   GOLD      on FLETCH_BROWN_LIFT .... 2.59:1  RECORDED, NOT HIDDEN: the active
//       feather's gold edge against its OWN lifted fill is under 3:1. It is a
//       REDUNDANT channel, not a state carrier — the active feather is already told
//       by the lifted fill, the brighter PARCH label, weight 700, and aria-current
//       ="page" — so nothing about the state depends on reading that edge.
export const FLETCH_BROWN = L.GOLD_TXT;
export const FLETCH_BROWN_LIFT = '#7A5C23';

/**
 * FLETCH — the fletching's GEOMETRY, deliberately kept apart from CHROME: none of
 * it may enter the header's layout box.
 *
 * `slant` is the horizontal run of every feather edge AND of the angled stroke
 * between feathers. ONE number for both is what makes the strokes exactly parallel
 * to the vanes: each traverses `slant` px over the same band height.
 *
 * `overhang` is how far the band's PAINT extends below the ribbon. It is drawn as a
 * drop-shadow of the band's own clipped silhouette — pure paint, contributing no
 * height, margin, border or out-of-flow offset to any box — so the ribbon adds NO
 * layout height, which is what keeps ANCHOR_OFFSET (and with it every About /
 * guide / Compendium anchor landing) describing the same bar it described before.
 *
 * MEASURED in a real browser at 1440×900, base 83b18609 vs the fletched tree served
 * side by side: header 124px / nav 100px in BOTH. Note the number: CHROME.headerDesktop
 * is 60 and the live desktop header is 124 — a pre-existing divergence lane FL-2
 * reported and deliberately did not touch, because moving ANCHOR_OFFSET relocates
 * every anchor landing in the estate.
 */
export const FLETCH = Object.freeze({ slant: 10, overhang: 4 });

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
//   headerDesktop — the desktop sticky top bar (~60px painted); the dossier
//                   toolbar pins flush below it (was a hardcoded top:60 literal).
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
  headerDesktop:   60,
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
 * ANCHOR_OFFSET — the scroll-margin-top an in-page `#anchor` target must carry.
 *
 * The desktop ribbon is `position:'sticky', top:0`, so a fragment jump (a link
 * click, a translated deep link, or a programmatic `scrollIntoView`) parks the
 * target heading UNDERNEATH the chrome unless the target names a scroll margin.
 * DERIVED from the chrome token rather than copied — 60 + 24 = 84 — so raising
 * the header height moves every anchor landing with it.
 *
 * It lives here, beside the measurement it is derived from, because more than one
 * page family needs it: the About family's two pages (the guide's five sections,
 * the manifesto's six bands, the positioning ladder) all read this one export
 * instead of each re-deriving the same sum. DEFERRED, DOCUMENTED, NOT A BUG TO
 * RE-FIND: compendium/registrySlug.js still carries its own `ANCHOR_SCROLL_MARGIN
 * = 84` literal for the Compendium's anchors. It is byte-equal by construction and
 * pinned at 84 on both sides, but it is a second spelling; folding the Compendium
 * onto this token is a separate lane (it touches four compendium components).
 */
export const ANCHOR_OFFSET = CHROME.headerDesktop + SP.xxl;

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
