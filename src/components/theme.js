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

// ── THE FLETCHED RIBBON (owner directive, 2026-08-03; RIBBON V2 same day) ─────
// The desktop ribbon reads as the back half of an arrow in flight. V1 drew a
// leather-brown band on a dark ink bar. THE V2 DIRECTIVE INVERTS THE MATERIAL: the
// WHOLE bar — wordmark included — becomes ONE continuous LIGHT-WOOD SHAFT, and the
// Create · Library · Realm trio becomes three DARK-BROWN, GILT-EDGED feathers lying
// on it. These constants are that composition's only colour source; NavRibbon.jsx,
// NavDivider.jsx and App.jsx read them and spell no hex of their own.
//
// FLETCH_BROWN is the theme's OWN gold-800 — the deepest brown in the gold family,
// already carried as GOLD_TXT — so the fletching is DERIVED from the palette rather
// than invented beside it, and a palette edit moves it. FLETCH_BROWN_LIFT is the one
// authored step between gold-800 (#6A511F) and gold-700 (#8C6F32): the ACTIVE
// feather's lift, the LIGHTEST value that still clears AA for the ribbon's 12px label.
//
// MEASURED (tests/design/contrast.test.js recomputes every ratio below; WCAG 2.2
// AA = 4.5:1 for normal text, SC 1.4.11 = 3:1 for a UI boundary):
//   PARCH_100 on FLETCH_BROWN ......... 6.24:1  resting feather label        AA ✓
//   PARCH     on FLETCH_BROWN_LIFT .... 5.71:1  active feather label         AA ✓
//   PARCH_100 on FLETCH_BROWN_LIFT .... 5.18:1  the label register's floor   AA ✓
//   GOLD      on FLETCH_BROWN ......... 3.12:1  the gilt hairline, against the
//                                               feather it traces            1.4.11 ✓
//   GOLD_B    on FLETCH_BROWN ......... 3.83:1  the ACTIVE feather's brighter
//                                               gilt, against the same       1.4.11 ✓
//   GOLD_B    on FLETCH_BROWN_LIFT .... 3.18:1  brighter gilt on the lifted fill it
//                                               actually sits on             1.4.11 ✓
//   GOLD      on FLETCH_BROWN_LIFT .... 2.59:1  RECORDED, NOT HIDDEN: the RESTING
//       gilt tone against the ACTIVE fill is under 3:1 — but that pairing is never
//       rendered (an active feather wears GOLD_B, a resting one wears FLETCH_BROWN).
//       Kept as the negative control the contrast pin asserts stays unused.
export const FLETCH_BROWN = L.GOLD_TXT;
export const FLETCH_BROWN_LIFT = '#7A5C23';

// THE BARB TEXTURE (V2 directive §4). A fine diagonal grain running WITH the
// feather's slant, at a DIFFERENT direction and scale from the shaft's horizontal
// wood grain so the two textures never read as one moiré. Authored as OPAQUE steps
// rather than an alpha wash precisely so "AA against the darkest point of the
// texture" is a computable claim and not a hand-wave: these ARE the darkest points.
//   FLETCH_BARB      4.63% darker than FLETCH_BROWN      (directive band: 3–5%)
//   FLETCH_BARB_LIFT 4.13% darker than FLETCH_BROWN_LIFT (directive band: 3–5%)
//   PARCH_100 on FLETCH_BARB ..... 6.43:1  resting label on its darkest barb  AA ✓
//   PARCH     on FLETCH_BARB_LIFT  5.88:1  active label on its darkest barb   AA ✓
export const FLETCH_BARB = '#684F1E';
export const FLETCH_BARB_LIFT = '#785A22';

// THE GILT (V2 directive §4) — gilding, never neon. GILT is a HAIRLINE tracing each
// feather's silhouette; GILT_ACTIVE is the brighter tone that, with the gold
// underline, is the active cell's second distinguisher now that the label weight no
// longer rises to 700. GILT_BLOOM is the very-low-alpha outer glow: alpha, not a
// hue, so it warms whatever it falls on and never becomes a second edge.
// ⚠️ THE GILT IS DECORATION, NEVER A STATE CARRIER. Against the LIGHT SHAFT the gilt
// measures 1.92:1 — nowhere near 1.4.11's 3:1 — and that is correct and recorded:
// the boundary that says "this is a feather" is FLETCH_BROWN against the shaft at
// 5.97:1, and the boundary that says "this feather is active" is carried by the
// lifted fill, the brighter PARCH label, the gold underline and aria-current="page".
// Nothing legible depends on seeing the gilt.
export const GILT = L.GOLD;
export const GILT_ACTIVE = L.GOLD_B;
// DERIVED, not spelled. The obvious way to write this is a fourth gold value with
// an alpha channel — but that forks the palette (a GOLD edit would leave the bloom
// behind at the old hue) AND adds a row to the deep-craft translucent-literal
// burn-down ratchet, which is a worklist trending to zero, not a budget to spend.
// `color-mix` keeps the bloom a function OF the gilt: one tone, two strengths, and
// the ratchet's count is untouched. The idiom is already load-bearing in index.css
// (.sf-btn's hover mix), so this adds no new browser assumption.
// (⚠️ Do not write the translucent-colour function's name literally in this file —
// tests/design/deepCraftKillList.test.js counts LINE MATCHES, so even a comment
// mentioning it adds one to the ratchet. That is exactly how this note got here.)
export const GILT_BLOOM = `color-mix(in srgb, ${L.GOLD} 22%, transparent)`;

/**
 * THE LIGHT-WOOD SHAFT (V2 directive §2 + §3) — the desktop AND mobile header's one
 * continuous material, running the full width INCLUDING under the wordmark.
 *
 * SHAFT is a single step deeper than the cream page body (1.15:1 against PARCH):
 * enough that the ribbon separates as its own plank, gentle enough that it still
 * reads as the same room. Two more devices finish the separation rather than one
 * loud one — a BORDER hairline along the bottom edge and ELEV[2]'s soft shadow.
 *
 * SHAFT_GRAIN / SHAFT_GRAIN_DEEP are the two streak tones. MEASURED, not stated:
 * they sit 1.96% and 3.89% below SHAFT in relative luminance. The directive named a
 * 2–4% band, so the DEEP streak is inside it and the light one is 0.04pp under its
 * floor — an honest ≈2–4%, recorded that way rather than rounded into compliance.
 * The tone was deliberately NOT nudged to meet the floor: 0.04pp of relative
 * luminance is invisible, the owner's word for the grain was SUBTLE, and moving a
 * measured colour to make a sentence true is the reflex this very bar's 60-vs-124
 * history exists to warn against. The band is a target, not a threshold anything
 * depends on — what keeps the grain a material and not a stripe pattern is the pair
 * staying ordered and staying quiet, which tests/components/navFletching.test.jsx
 * measures on every run. SHAFT_GRAIN_DEEP is THE DARKEST STREAK:
 * every label that rides the shaft owes its AA to THAT value, not to SHAFT, and
 * tests/design/contrast.test.js measures each one against it:
 *   GOLD_TXT   on SHAFT_GRAIN_DEEP .... 5.75:1  wordmark + active reference tab AA ✓
 *   BODY       on SHAFT_GRAIN_DEEP .... 8.33:1  resting reference tab           AA ✓
 *   SECOND     on SHAFT_GRAIN_DEEP ... 12.04:1  the ghost-button register       AA ✓
 *   GREEN_DEEP on SHAFT_GRAIN_DEEP .... 5.00:1  the signed-in account chip      AA ✓
 *   GREEN (the V1 chip tone) .......... 3.91:1  FAILS as text on wood — which is
 *       exactly why AccountMenu moved to GREEN_DEEP; pinned as a negative control.
 */
export const SHAFT = '#F1E5C8';
export const SHAFT_GRAIN = '#EFE3C6';
export const SHAFT_GRAIN_DEEP = '#EDE1C4';

// SHAFT_RULE — the seam between two REFERENCE tabs, read as a groove cut in the
// plank. It replaces BORDER on this one surface for a measured reason: BORDER is
// the house hairline against CARD and PARCH, and it was ~5:1 against the ink bar V1
// drew it on, but against light wood it collapses to 1.56:1 and the reference tabs
// lost their separation entirely. This is 2.50:1 — a decorative divider carries no
// WCAG floor (it is not a boundary anyone must perceive to operate the nav), so the
// number is chosen by eye against the BALANCE LAW rather than by a threshold:
// present, quiet, and deliberately weaker than the gilt seams inside the fletching,
// because the hierarchy between "the journey" and "the shelf" is the whole point.
export const SHAFT_RULE = '#A39062';

/**
 * SHAFT_GRAIN_LAYERS — the wood grain itself, as ONE CSS background-image string
 * both headers share, so the mobile and desktop planks are the same board.
 *
 * Two layered HORIZONTAL streak gradients, asset-free. Their periods are 13px and
 * 29px — COPRIME, so the combined figure only repeats every 377px, and the bar is
 * 48px tall: no tiling rhythm is visible because none of it is ever on screen twice.
 * Within each period the streaks sit at irregular offsets and sub-pixel widths, so
 * even one period reads as drifting figure rather than as a ruled pair of lines.
 *
 * ⚠️ Consumers must paint this OVER the SHAFT base colour (`background-image` +
 * `background-color`), never as the whole `background` shorthand with no base — the
 * gradients are transparent between streaks and would otherwise let the page show
 * through the bar.
 */
export const SHAFT_GRAIN_LAYERS = [
  `repeating-linear-gradient(180deg, transparent 0, transparent 3px, ${SHAFT_GRAIN} 3px,`
  + ` ${SHAFT_GRAIN} 3.75px, transparent 3.75px, transparent 8px, ${SHAFT_GRAIN} 8px,`
  + ` ${SHAFT_GRAIN} 8.5px, transparent 8.5px, transparent 13px)`,
  `repeating-linear-gradient(180deg, transparent 0, transparent 6px, ${SHAFT_GRAIN_DEEP} 6px,`
  + ` ${SHAFT_GRAIN_DEEP} 6.75px, transparent 6.75px, transparent 19px, ${SHAFT_GRAIN_DEEP} 19px,`
  + ` ${SHAFT_GRAIN_DEEP} 19.6px, transparent 19.6px, transparent 29px)`,
].join(', ');

/**
 * FLETCH — the fletching's GEOMETRY, deliberately kept apart from CHROME: none of
 * it may enter the header's layout box.
 *
 * `slant` is the horizontal run of every feather edge AND of the angled stroke
 * between feathers. ONE number for both is what makes the strokes exactly parallel
 * to the vanes: each traverses `slant` px over the same band height.
 *
 * `overhang` is how far the fletching's PAINT extends below the ribbon. It is drawn
 * as a drop-shadow of the band's own clipped silhouette — pure paint, contributing
 * no height, margin, border or out-of-flow offset to any box — so the ribbon adds NO
 * layout height, which is what keeps ANCHOR_OFFSET (and with it every About /
 * guide / Compendium anchor landing) describing the bar it actually is.
 *
 * `gilt` is the hairline's width and `bloom` the outer glow's blur radius — both
 * held here beside the slant so the whole feather is described in one place.
 *
 * The barb streaks' ANGLE is not here: it needs CHROME.headerDesktop, which is
 * declared below, so it lives with the rest of the derived chrome as
 * FLETCH_BARB_DEG rather than as a getter that would read CHROME out of its own
 * temporal dead zone during module evaluation.
 */
export const FLETCH = Object.freeze({ slant: 10, overhang: 4, gilt: 1, bloom: 5 });

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
//   headerDesktop — THE SLIM SHAFT (V2 directive §1): 48px, and it is now the
//                   desktop bar's REAL height rather than a description of it.
//                   App.jsx spends it as the header's own min-height and every
//                   derived number below reads it, so this one edit moves the bar,
//                   the anchor landings and the barb angle together.
//                   ⚠️ IT WAS NOT ALWAYS TRUE. Until ribbon v2 this said 60 while
//                   the live bar measured 124: NavDivider's decorative SVG asked
//                   for height="100%" against an indefinite parent, so it fell back
//                   to its own viewBox height (100) and that 100 — a coordinate
//                   space, not a measurement — set the header's flex line. The SVG
//                   is now absolutely positioned and can no longer price the bar.
//                   Lane FL-2 reported the 60-vs-124 divergence without a cause;
//                   this is the cause, and tests/components/navDividers.test.jsx
//                   pins the divider's box to the ribbon's height so it cannot
//                   return. The dossier toolbar pins flush below this number, so it
//                   was also landing 64px under the header until now.
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
  headerDesktop:   48,
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
 * DERIVED from the chrome token rather than copied — 48 + 24 = 72 — so changing
 * the header height moves every anchor landing with it.
 *
 * ⚠️ NEVER PIN THE SUM. Every assertion about this number, here and in the four
 * suites that read it, must assert `CHROME.headerDesktop + SP.xxl` and not the
 * literal it currently evaluates to. A pin on the literal is a pin on today's
 * arithmetic: it survives an edit that breaks the derivation and fails on an edit
 * that honours it, which is exactly backwards. (V2 directive §1.)
 *
 * It lives here, beside the measurement it is derived from, because more than one
 * page family needs it: the About family's two pages, the Compendium's registry and
 * catalog hubs, and the dossier's entity anchors all read this one export instead of
 * each re-deriving the same sum. The three second spellings the V1 note deferred —
 * registrySlug.js's own `ANCHOR_SCROLL_MARGIN = 84`, CatalogTabs.jsx's hardcoded
 * `scrollMarginTop: 80`, and SummaryTab.jsx's four of the same — were all folded
 * onto this token under the V2 directive, so the estate now has ONE anchor number.
 */
export const ANCHOR_OFFSET = CHROME.headerDesktop + SP.xxl;

/**
 * FLETCH_BARB_DEG — the CSS gradient angle of the feather's barb texture, DERIVED.
 *
 * A barb must lie parallel to the feather's own edge, and that edge runs
 * FLETCH.slant px horizontally over exactly CHROME.headerDesktop px vertically. CSS
 * measures a gradient angle clockwise from "up", and stripes leaning forward by θ
 * from vertical need their gradient LINE (which is perpendicular to them) at
 * 90° + θ. So the angle is 90 + atan(slant / headerDesktop), and it re-derives
 * itself the moment the slant or the bar height moves. At slant 10 over a 48px
 * shaft that is 102° — deliberately far from the shaft grain's 180°, which is what
 * keeps the two textures reading as different materials instead of one moiré.
 */
export const FLETCH_BARB_DEG = 90 + Math.round((Math.atan2(FLETCH.slant, CHROME.headerDesktop) * 180) / Math.PI);

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
