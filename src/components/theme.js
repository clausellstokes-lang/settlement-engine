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

// ── THE HALF-SEEN WAR ARROW (owner directive, 2026-08-03 evening; RIBBON V3) ──
//
// THE COMPOSITION, and every token below serves it: the top ribbon is HALF OF AN
// ARROW IN PROFILE. The arrow lies along the top screen edge and the viewport shows
// this side's half — so the whole bar, wordmark included, is the SHAFT'S VISIBLE
// HALF, modelled as a cylinder (lit along the centreline at the top, falling off to
// a dark silhouette at the bottom edge), and Create · Library · Realm are the NEAR
// SIDE'S THREE FLETCHES rooted on it, quill bases at the shaft line, vanes sweeping
// toward Realm. Two red-brown thread wraps frame the cluster. ONE object.
//
// WHAT V3 RETIRED, so nobody re-finds it: V2's parallelogram feathers, its GILT
// hairline + GILT_ACTIVE + GILT_BLOOM, its FLETCH_BROWN/_LIFT gold-family fletching,
// its FLETCH_BARB_LIFT, and its SHAFT_GRAIN/SHAFT_GRAIN_DEEP two-streak plank are
// all GONE — not deprecated, deleted, with their consumers moved in the same commit.
// The species changed too: the owner corrected turkey → GREY GOOSE, the English
// war-arrow feather, which is cooler, more uniform and barred far more quietly.
//
// ⚠️⚠️ THE GROUND MOVED AGAIN, AND THAT IS THE WHOLE HAZARD OF THIS FILE. V2's
// lesson was that tones correct on an ink bar are wrong on light wood. V3 repeats it
// one step darker: the plank went from cream (#F1E5C8, L 0.789) to honey-tan
// (L 0.42–0.55), and THREE foregrounds that cleared AA on the cream fail on the
// honey — GOLD_TXT (5.75 → 3.38), GREEN_DEEP (5.00 → 2.93) and SLATE_DEEP
// (4.28 → 3.53). All three moved in this commit; all three are pinned as negative
// controls in tests/design/contrast.test.js so "just put the old colour back" reds
// with the reason attached instead of shipping an unreadable header.

/**
 * THE SHAFT — honey-tan wood from the owner's reference photo, modelled as the
 * near half of a CYLINDER.
 *
 * Five steps down the barrel, lit from above. SHAFT_SHEEN is the satin highlight
 * along the visible centreline at the very top; SHAFT is the body; SHAFT_BODY is
 * THE LABEL FLOOR (see SHAFT_STOPS); SHAFT_EDGE and SHAFT_RIM are the falloff into
 * the silhouette at the bottom, which is what makes the bar read as a round shaft
 * rather than a flat plank. The modelling range top-to-bottom is 2.67:1.
 *
 * ⚠️ SHAFT_BODY, NOT SHAFT_RIM, IS THE REFERENCE GROUND FOR TEXT — and unlike V2's
 * "darkest streak anywhere", that is a GEOMETRIC claim, not a hopeful one. The
 * cylinder's dark falloff is confined BELOW the label band by SHAFT_STOPS.body, and
 * tests pin that the stop clears the vertically-centred label box on both header
 * heights. Measuring against SHAFT_RIM instead would be over-strict by a factor no
 * glyph ever touches (it would force every label to near-black); measuring against
 * SHAFT_SHEEN would be a lie.
 *
 * ⚠️⚠️ BUT SHAFT_BODY IS THE CYLINDER'S FLOOR, NOT THE BAR'S — THE GRAIN GOES LOWER.
 * The bar a user actually reads is a COMPOSITE: the grain data-URI painted OVER
 * SHAFT_CYLINDER over the base colour. The grain is a dark-brown wash at an alpha
 * derived from its own noise, so the darkest COMPOSITED pixel inside the label band
 * is below SHAFT_BODY — measured on the live bar at 1440x900, Chrome, lane PB:
 *
 *   darkest composited wood in the label band .... rgb(197,165,112)  L 0.3995
 *   the same strip with the grain layer removed .. rgb(204,170,115)  L 0.4282
 *   SHAFT_BODY .................................... rgb(204,169,114)  L 0.4243
 *
 * The second line is the control and it is what makes the attribution certain: strip
 * the grain and the floor returns to SHAFT_BODY exactly. So every ratio below has TWO
 * numbers — the TOKEN ratio (what contrast.test.js computes, and what a designer
 * reasons with) and the COMPOSITE ratio (what a reader actually gets). Every one of
 * them still clears its floor, but the margin on the 4.5 rows is about a tenth, so
 * the grain's alpha is now a live accessibility lever and not a decoration knob.
 *
 * (WCAG 2.2 AA = 4.5:1 for text, SC 1.4.11 = 3:1 for a UI boundary. TOKEN column
 * recomputed by tests/design/contrast.test.js; COMPOSITE column measured as above.)
 *                                          TOKEN    COMPOSITE
 *   INK_DEEP    wordmark + active tab ..... 7.06  →  6.69   AA ✓
 *   BODY        resting reference tab ..... 4.89  →  4.63   AA ✓
 *   SECOND      the ghost-button register . 7.06  →  6.69   AA ✓
 *   SHAFT_GREEN the signed-in account chip  4.87  →  4.62   AA ✓
 *   SHAFT_SLATE the developer account chip  4.96  →  4.70   AA ✓
 *   GOLD_TXT    the active tab's underline  3.38  →  3.20   1.4.11 ✓ (a BOUNDARY
 *                                                            beside an ink label)
 *   FLETCH_VANE the "this is a fletch" edge 4.46  →  4.23   1.4.11 ✓
 *
 * ⚠️ THE ACCOUNT CHIP IS IN THIS TABLE BECAUSE IT HAS NO GROUND OF ITS OWN.
 * AccountMenu's chip is `background: transparent`, so SHAFT_GREEN / SHAFT_SLATE are
 * read against whatever the bar paints beneath them — this composite, in this band.
 * It renders only when signed in, which the census page cannot reach, so it is
 * covered by measuring the GROUND rather than the chip.
 */
export const SHAFT_SHEEN = '#E8CE9E';
export const SHAFT = '#D2B27E';
export const SHAFT_BODY = '#CCA972';
export const SHAFT_EDGE = '#BE9760';
export const SHAFT_RIM = '#A0763F';

/**
 * SHAFT_STOPS — where each cylinder step sits, as a FRACTION of the bar's height.
 *
 * Fractions, not px, and that is load-bearing: the desktop bar is 48px and the
 * mobile one 59px, and both must be the same barrel. A px ladder tuned to 48 would
 * put the mobile silhouette 11px too high and drop the dark falloff straight through
 * the mobile wordmark.
 *
 * ⚠️⚠️ THE OLD CLEARANCE ARGUMENT WAS FALSIFIED BY THE TALLEST RIDER, AND THE WHOLE
 * MODEL IS DIFFERENT NOW. It used to read: "`body` is the last stop at or above which
 * the wood never goes darker than SHAFT_BODY, so it must sit BELOW the bottom of a
 * vertically-centred label box" — with LABEL_BOX hand-keyed at 20 and the pin
 * re-deriving (1 + LABEL_BOX/height)/2. The PB verifier's F2, quoted:
 *
 *   "the composited-AA pin's own base premise is falsified by the tallest rider...
 *    That geometry is enforced by tests/components/navFletching.test.jsx:720, which
 *    computes labelBottom = (1 + LABEL_BOX/h)/2 from a HAND-KEYED `LABEL_BOX = 20` —
 *    giving 0.763 < 0.80 on a 38px bar. But the tallest rider is the wordmark, whose
 *    box is 34.84px, 74% larger than 20... LABEL_BOX=20 is a hand-keyed side table
 *    standing in for 'every rider's box' — the exact hazard class this estate has
 *    been bitten by."
 *
 * TWO THINGS WERE WRONG, not one. The box was hand-keyed AND the "vertically centred"
 * model was itself false: the wordmark's ink is not centred in its own box, so even
 * the correct box would have given the wrong bottom. Rasterising every run at its own
 * font (Chrome 1440x900, this lane) puts the deepest ink on the bar at **37.08px of
 * 38** — the descender of the `g` in "Forge", at fraction 0.9758, PAST the old
 * SHAFT_STOPS.edge of 0.92 entirely. HEADER_RIDERS below is the measurement, and the
 * label box is now DERIVED from it rather than standing in for it.
 *
 * ⚠️⚠️ SO THE STOPS MOVED: body 0.80 -> 0.95, edge 0.92 -> 0.98. A DELIBERATE ONE-TIME
 * VISUAL SHIFT. The barrel's dark falloff now lives in the last 5% of the bar (1.9px
 * of 38) instead of the last 20% (7.6px), which is both what the riders need and a
 * better cylinder: a real barrel seen this near edge-on holds its body tone almost to
 * the silhouette and then drops fast. The four real shortfalls it repairs, measured on
 * the composited raster and quoted in tests/design/compositedBarAA.test.js:
 *   INK_DEEP on the wordmark's descender  4.15 -> 5.59  (AA 4.5 — was FAILING)
 *   SEAL_WAX, the `o` of Forge            4.48 -> 4.80  (AA 4.5 — was FAILING)
 *   GOLD_TXT, the plain tab's underline   2.29 -> 3.15  (1.4.11 3:1 — was FAILING)
 *   BODY on the WRAPPED MOBILE bar        4.24 -> 4.62  (AA 4.5 — was FAILING)
 * None of these was visible to the old pin, because the old pin measured one floor —
 * grain over SHAFT_BODY — for every rider, and no rider's real ground was that floor.
 *
 * ⚠️ THE COUPLING TO WATCH IS UNCHANGED IN KIND. These are FRACTIONS, so a shorter bar
 * pushes every stop UP in absolute pixels while the riders' ink stays the same number
 * of px — the clearance gets tighter as the bar gets thinner, and it is the SMALLEST
 * bar that governs. Anyone thinning this bar again must re-measure HEADER_RIDERS and
 * move these numbers with it; the pin now says so per rider, with the rider named.
 */

/**
 * HEADER_RIDERS — EVERY MARK THAT LANDS ON THE BAR, AND THE INK IT ACTUALLY COVERS.
 *
 * This replaces `LABEL_BOX = 20`. Each row is a MEASUREMENT, not a layout box: the run
 * was rasterised at its own font and the first and last rows carrying ink were read
 * off, so `ink` is where the letterform really is rather than where its line box is.
 * (The wordmark's box is 34.84px and its ink runs 7.58..37.08 — the ink OVERFLOWS the
 * box by 0.66px at the bottom, which is precisely why a box-based model could not see
 * the defect.)
 *
 * `bar` is the header height the row was measured on, so a fraction is `ink/bar` and
 * the desktop and the mobile bars can live in one table. ⚠️ THE MOBILE BAR IS
 * CONTENT-SIZED and wraps to two rows at phone widths — measured at 390x844 it is
 * 80.84px tall with its second row of labels at the bottom — so its row is taken at
 * the narrowest common phone. A taller wrap keeps the last row at the same relative
 * depth, so this stays the governing mobile case.
 *
 * Receipts: Chrome, this lane, 2026-08-03. Desktop 1440x900 (header 38px), mobile
 * 390x844 (header 80.84px). tests/design/compositedBarAA.test.js computes each rider's
 * own composited floor from this table; tests/components/navFletching.test.jsx asserts
 * the bar SEATS the same set.
 */
export const HEADER_RIDERS = Object.freeze({
  // the wordmark: FS.h1 serif with its two capitals at 1.32em. The tallest rider AND
  // the deepest — the `g` of "Forge" is what sets the floor.
  wordmark: Object.freeze({ ink: [7.58, 37.08], bar: 38, box: 34.84 }),
  // the wax seal standing in for one `o`: a graphic, but it owes TEXT contrast.
  seal: Object.freeze({ ink: [15.82, 31.66], bar: 38, box: 15.84 }),
  // the plain reference tabs' labels: FS.sm in a padded, ruled box.
  tab: Object.freeze({ ink: [13.25, 24.25], bar: 38, box: 34 }),
  // that box's 2px underline, which is the ACTIVE state's boundary and sits far lower
  // than the label it belongs to — the rider the old single-floor model hid completely.
  tabRule: Object.freeze({ ink: [34, 36], bar: 38, box: 34 }),
  // Sign In. ⚠️ It paints its own opaque ground, so measuring it against the bar is
  // deliberately OVER-strict — kept that way rather than exempted, in the one direction
  // a safety pin should err.
  signIn: Object.freeze({ ink: [10, 21.5], bar: 38, box: 34 }),
  // the signed-in account chip: `background: transparent`, so it genuinely reads
  // against the bar. It cannot render on the census page, which is why it is measured
  // by its GROUND rather than by itself.
  chip: Object.freeze({ ink: [10, 25.25], bar: 38, box: 34 }),
  // the maker's plate: its keyline is what separates the object from the wood.
  plate: Object.freeze({ ink: [6, 32], bar: 38, box: 26 }),
  // the wrapped MOBILE bar's second row of labels — the deepest ink on that bar.
  mobileTab: Object.freeze({ ink: [58.28, 70.1], bar: 80.84, box: 34 }),
});

/**
 * LABEL_BOX — now DERIVED: the tallest rider's own box.
 *
 * ⚠️ IT SURVIVES AS A NAME AND NOT AS AN AUTHORITY. Nothing may compute an AA floor
 * from it any more — the per-rider ink extents above are the authority, because a box
 * is leading and a floor is about ink. It is kept because the bar's SEAT claim ("38 is
 * a floor, not a preference") is genuinely about boxes, and that claim now reads the
 * same table the contrast claim does instead of a second hand-keyed number.
 */
export const LABEL_BOX = Math.max(...Object.values(HEADER_RIDERS).map((r) => r.box));
export const SHAFT_STOPS = Object.freeze({ lit: 0.09, mid: 0.38, body: 0.95, edge: 0.98 });

/**
 * SHAFT_CYLINDER — the barrel shading, as one CSS gradient.
 *
 * The falloff deliberately ACCELERATES toward the bottom (0 → 9% holds the sheen,
 * then 9 → 75% descends gently across the label band, then 75 → 100% drops fast into
 * the rim). That is how a real cylinder shades: cos-falloff is flat near the
 * centreline and steep near the silhouette. Painting it linearly would read as a
 * gradient-filled rectangle, which is the exact "feathers on a plank" failure the
 * directive names.
 */
export const SHAFT_CYLINDER =
  `linear-gradient(180deg, ${SHAFT_SHEEN} 0%, ${SHAFT_SHEEN} ${SHAFT_STOPS.lit * 100}%,`
  + ` ${SHAFT} ${SHAFT_STOPS.mid * 100}%, ${SHAFT_BODY} ${SHAFT_STOPS.body * 100}%,`
  + ` ${SHAFT_EDGE} ${SHAFT_STOPS.edge * 100}%, ${SHAFT_RIM} 100%)`;

/** The barrel's ladder as data, in the order SHAFT_CYLINDER paints it. */
const CYLINDER_LADDER = Object.freeze([
  Object.freeze([0, SHAFT_SHEEN]),
  Object.freeze([SHAFT_STOPS.lit, SHAFT_SHEEN]),
  Object.freeze([SHAFT_STOPS.mid, SHAFT]),
  Object.freeze([SHAFT_STOPS.body, SHAFT_BODY]),
  Object.freeze([SHAFT_STOPS.edge, SHAFT_EDGE]),
  Object.freeze([1, SHAFT_RIM]),
]);

/**
 * cylinderToneAt — WHAT TONE THE BARREL ACTUALLY IS AT A GIVEN DEPTH, and it is THE
 * SINGLE WRITER for that question.
 *
 * ⚠️ IT EXISTS BECAUSE THE ESTATE USED TO ANSWER IT WITH A CONSTANT. Every AA number
 * on this bar was quoted against SHAFT_BODY, on the strength of a geometric argument
 * ("the falloff never reaches a letterform") that the tallest rider falsified — see
 * SHAFT_STOPS' note and HEADER_RIDERS. A stop is not a floor; the floor is whatever
 * the gradient evaluates to under the ink, and that is a computation, so it is written
 * once here and read by every pin instead of being re-derived per test.
 *
 * ⚠️ INTERPOLATED IN sRGB, per channel, because that is what a CSS `linear-gradient`
 * does with unprefixed stops. Interpolating in any other space would answer a question
 * about a gradient nobody paints.
 *
 * @param {number} fraction depth down the bar, 0 at the top edge and 1 at the bottom
 * @returns {[number, number, number]} the 0-255 sRGB triple at that depth
 */
export function cylinderToneAt(fraction) {
  const f = Math.min(1, Math.max(0, fraction));
  const rgb = (hex) => {
    const n = parseInt(hex.slice(1, 7), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  };
  for (let i = 1; i < CYLINDER_LADDER.length; i += 1) {
    const [p0, c0] = CYLINDER_LADDER[i - 1];
    const [p1, c1] = CYLINDER_LADDER[i];
    if (f <= p1) {
      const t = p1 === p0 ? 0 : (f - p0) / (p1 - p0);
      const a = rgb(c0);
      const b = rgb(c1);
      return [0, 1, 2].map((k) => a[k] + (b[k] - a[k]) * t);
    }
  }
  return rgb(SHAFT_RIM);
}

/**
 * The DARKEST tone one rider's ink can land on — its own floor, before the grain.
 *
 * The cylinder only darkens downward, so the worst point of any extent is its BOTTOM.
 * ⚠️ `vaneEdge` IS NOT IN HEADER_RIDERS AND CANNOT BE: the fletch band's boundary runs
 * the whole bar and then hangs below it, so its extent is not a measurement of a
 * letterform but a scoping decision — it is passed explicitly by the pin that makes
 * that decision, with its residual quoted there rather than buried here.
 *
 * @param {{ ink: number[], bar: number }} rider a HEADER_RIDERS row
 * @returns {[number, number, number]} the 0-255 sRGB triple under its deepest ink
 */
export const riderFloorTone = (rider) => cylinderToneAt(rider.ink[1] / rider.bar);

/**
 * SHAFT_GRAIN_TEXTURE — the fine LONGITUDINAL wood grain, as a deterministic inline
 * SVG data URI (owner directive: feTurbulence, FIXED seed).
 *
 * `baseFrequency='0.008 0.42'` is the whole trick: wildly anisotropic noise, slow
 * across the shaft and fast along its short axis, which turns fractal noise into
 * fine LENGTHWISE streaks — grain running with the shaft, as real turned wood does.
 * `seed='7'` and `stitchTiles='stitch'` make it deterministic AND seamless when the
 * 320px tile repeats, so the plank has no visible join at any viewport width.
 *
 * The feColorMatrix paints a fixed dark-brown at an alpha DERIVED from the noise —
 * GRAIN_AMP · (0.20·(R+G+B) − 0.22) — so the wash clamps to zero in the gaps and is a
 * grain you can see rather than a set of stripes. ⚠️ GRAIN_AMP is the contrast budget
 * (see its own note); it scales the strength and leaves the shape alone. There is no
 * random call anywhere in this module: the string below is a constant of the two
 * authored numbers, which is what the determinism pin asserts.
 *
 * ⚠️⚠️ `color-interpolation-filters='sRGB'` IS SPELLED OUT, AND IT WAS MISSING.
 * SVG's DEFAULT for a filter chain is linearRGB, and engines do not agree about it —
 * which made this "deterministic" texture render at materially different STRENGTHS in
 * different renderers. Measured on the same authored bytes: Chrome put an effective
 * wash of about 6% under the label band, librsvg about 17%. A fixed seed only buys
 * determinism of the NOISE; the colour space is what makes the noise turn into the
 * same picture. That mattered here because the grain is the layer that pushes the
 * composited bar BELOW SHAFT_BODY, so an engine-dependent wash is an engine-dependent
 * contrast ratio. Declaring sRGB is a ONE-TIME, DELIBERATE VISUAL SHIFT: the grain
 * reads slightly differently than it did before this line existed, and
 * tests/design/compositedBarAA.test.js now measures what it actually costs.
 *
 * ⚠️ ENCODE IN THIS ORDER. `%` must be escaped BEFORE `#`, `<` and `>`, or the
 * `%23` this function itself emits would be re-escaped into `%2523`. The SVG is
 * authored with single-quoted attributes and explicit userSpaceOnUse numbers (never
 * `100%`) precisely to keep the character set this small.
 */
/**
 * GRAIN_AMP — HOW HARD THE GRAIN IS ALLOWED TO PRESS ON THE WOOD, and it is an
 * ACCESSIBILITY NUMBER wearing a texture's name.
 *
 * ⚠️⚠️ THE GRAIN IS THE LAYER THAT DECIDES THE BAR'S CONTRAST FLOOR. Every AA ratio
 * in this file is quoted against SHAFT_BODY, and the cylinder never goes darker than
 * SHAFT_BODY inside the label band (SHAFT_STOPS.body guarantees it). The grain does:
 * it is a dark-brown wash painted OVER the cylinder, so the darkest tone a letterform
 * actually lands on is SHAFT_BODY composited with this wash at its own strongest
 * point. Turn this number up and every ratio on the bar falls together.
 *
 * THE BUDGET, DERIVED RATHER THAN CHOSEN: the tightest claim on the bar is BODY (the
 * resting reference tab) at 4.5:1, which needs a ground of at least L 0.3865.
 * SHAFT_BODY is L 0.4243. So the wash may spend at most 0.038 of luminance — about a
 * 7% alpha at its peak — and this scale is what holds it there.
 *
 * The alpha the filter computes is GRAIN_AMP * (0.20*(R+G+B) - 0.22): the SHAPE of
 * the wash (where it appears and where it clamps to nothing) is unchanged, only its
 * STRENGTH is scaled, so the grain still reads as lengthwise streaks rather than
 * becoming a flat tint.
 *
 * ⚠️ IT WAS 1.0 AND THE BAR DID NOT CLEAR AA OFF-CHROMIUM. See the colour-space note
 * below: with linearRGB left to the engines, Chrome rendered the wash at about 6%
 * and librsvg at 17%, and at 17% the resting tab measures 4.09:1. Declaring sRGB made
 * the engines agree — at the DARKER number — so this scale is what actually pays for
 * the AA claim rather than Chrome's leniency paying for it.
 * tests/design/compositedBarAA.test.js rasterises the real tile and enforces it.
 */
export const GRAIN_AMP = 0.24;

const GRAIN_SVG = [
  "<svg xmlns='http://www.w3.org/2000/svg' width='320' height='64'>",
  "<filter id='grain' filterUnits='userSpaceOnUse' x='0' y='0' width='320' height='64'",
  " color-interpolation-filters='sRGB'>",
  "<feTurbulence type='fractalNoise' baseFrequency='0.008 0.42' numOctaves='3'",
  " seed='7' stitchTiles='stitch' result='noise'/>",
  "<feColorMatrix in='noise' type='matrix' values='",
  `0 0 0 0 0.36 0 0 0 0 0.26 0 0 0 0 0.13 ${0.20 * GRAIN_AMP} ${0.20 * GRAIN_AMP} ${0.20 * GRAIN_AMP} 0 ${-0.22 * GRAIN_AMP}'/>`,
  '</filter>',
  "<rect x='0' y='0' width='320' height='64' filter='url(#grain)'/>",
  '</svg>',
].join('');
export const SHAFT_GRAIN_TEXTURE = `url("data:image/svg+xml,${GRAIN_SVG
  .replace(/%/g, '%25').replace(/#/g, '%23').replace(/</g, '%3C').replace(/>/g, '%3E')}")`;

/**
 * SHAFT_GRAIN_LAYERS — the finished plank, as ONE CSS background-image string both
 * headers share, so the mobile and desktop bars are the same piece of wood.
 *
 * Order is paint order: the grain rides ON TOP of the cylinder shading, because
 * grain is a property of the surface and the shading is the light falling on it.
 * Reversed, the barrel would wash over the grain and the wood would go flat.
 *
 * ⚠️ Consumers must paint this OVER the SHAFT base colour (`background-image` +
 * `background-color`), never as the whole `background` shorthand with no base — the
 * grain is transparent in its gaps and the page would show through the shaft.
 */
export const SHAFT_GRAIN_LAYERS = [SHAFT_GRAIN_TEXTURE, SHAFT_CYLINDER].join(', ');

// SHAFT_RULE — the seam between two REFERENCE tabs, read as a groove cut in the
// barrel. Retoned for the honey wood: V2's #A39062 was chosen against cream and
// measures 1.29:1 on this ground, which is invisible. This is 2.14:1 — a decorative
// divider carries no WCAG floor (nothing about reaching Compendium depends on seeing
// it), so the number is chosen by eye: present, quiet, and deliberately weaker than
// the fletch silhouettes, because the hierarchy between "the journey" and "the shelf"
// is the point.
export const SHAFT_RULE = '#8C6E42';

// SHAFT_GREEN / SHAFT_SLATE — the account chip's status tones FOR TEXT RIDING THE
// WOOD, and they exist because the chip's background is `transparent`, so its label
// is read against whatever the header paints.
// ⚠️ THE TWO-STEP COLLAPSED, DELIBERATELY. V2 could keep a brighter RULE (GREEN) and
// a deeper LABEL (GREEN_DEEP) because the cream ground let the rule clear 1.4.11 at
// 3.91:1. On honey-tan, GREEN falls to 2.18:1 and GREEN_DEEP to 2.93:1 — the rule no
// longer clears the boundary floor at EITHER step, so there is no honest two-step
// left to keep. Rule and label both take these tones (4.87:1 / 4.96:1), which clears
// text AA and the boundary floor at once. The status hue is preserved; only its
// brightness moved, and it moved because the ground did.
export const SHAFT_GREEN = '#2A4420';
export const SHAFT_SLATE = '#303E4A';

/**
 * THE GREY-GOOSE VANE — the English war-arrow feather, in profile.
 *
 * The owner corrected the species from turkey, and the correction is the whole
 * character of these tones: goose primaries are COOLER, more UNIFORM and far more
 * quietly marked than turkey. So there is no bold barring anywhere here. What
 * carries the material instead is a fine ladder — a paler LEADING edge, a mid VANE,
 * a darker trailing TIP, near-invisible BARB striations, two broad SHEEN bands where
 * the barbs catch light, and a pale RACHIS the barbs comb off. This is a quieter
 * feather than V2's, and that is a feature: it is what lets the labels breathe.
 *
 * EVERY TONE IS OPAQUE, and that is the same discipline V2 established for its
 * barbs: "AA against the lightest band under a label" is only a computable claim if
 * the lightest band is a value this file can name. An alpha wash would make it a
 * hand-wave. The governing number is therefore the LIGHTEST tone in the ladder —
 * FLETCH_SHEEN_LIFT, the active fletch's brightened sheen — and every pale label in
 * both registers is measured against THAT, never against the vane body.
 *
 * MEASURED (tests/design/contrast.test.js):
 *   PARCH_100 on FLETCH_SHEEN_LIFT .... 4.84:1  the label register's FLOOR    AA ✓
 *   PARCH     on FLETCH_SHEEN_LIFT .... 5.33:1  the active label on it        AA ✓
 *   PARCH_100 on FLETCH_SHEEN ......... 5.49:1  resting label, resting sheen  AA ✓
 *   PARCH_100 on FLETCH_LEAD .......... 6.30:1  on the paler leading edge     AA ✓
 *   PARCH_100 on FLETCH_VANE .......... 8.24:1  on the vane body              AA ✓
 *   PARCH_100 on FLETCH_BARB .......... 8.60:1  on a barb striation           AA ✓
 *   GOLD      on FLETCH_VANE .......... 4.12:1  the active gold underline, on the
 *       LIGHTEST ground it can touch — the sheen bands stop short of the vane's
 *       lower edge on purpose (GooseFletch SHEEN_FLOOR) so the underline's ground is
 *       the vertical gradient alone, which only darkens downward.  1.4.11 ✓
 */
export const FLETCH_LEAD = '#5C5347';
export const FLETCH_VANE = '#4A4238';
export const FLETCH_TIP = '#3B352D';
export const FLETCH_BARB = '#454035';
export const FLETCH_SHEEN = '#655C4E';
export const FLETCH_SHEEN_LIFT = '#6E6456';
export const FLETCH_RACHIS = '#6E6456';
// The seam where two fletches overlap: a quill SHADOW, not a gilt hairline. It is
// 1.23:1 against the vane and that is exactly right — feather-on-feather shadows are
// nearly tonal, and the boundary a user actually needs is the vane against the wood
// (4.46:1). Recorded, not hidden.
export const FLETCH_SEAM = '#3B352D';

// THE WRAPS — two narrow glossy red-brown thread bands riding the shaft, framing the
// fletching cluster: the silk/linen whipping from the reference photo. WRAP is the
// thread, WRAP_GLOSS its specular highlight (measured against WRAP, not the wood —
// it is a highlight INSIDE the binding), WRAP_EDGE the shadowed lower turn.
// WRAP on SHAFT_BODY is 3.16:1, so the binding clears 1.4.11 as a boundary even
// though nothing depends on perceiving it.
export const WRAP = '#8A4630';
export const WRAP_GLOSS = '#A85E45';
export const WRAP_EDGE = '#67321F';

// FLETCH_SHADOW — the soft drop shadow that seats a feather on the wood. Authored as
// an 8-DIGIT HEX rather than the translucent-colour function on purpose: that
// function's occurrences are a burn-down ratchet trending to zero
// (tests/design/deepCraftKillList.test.js counts them), and a decoration has no
// business spending a row of a worklist. Alpha 0x59 ≈ 35% of a near-black brown:
// enough to lift the vane off the barrel, far too little to read as a second edge.
export const FLETCH_SHADOW = '#2A251E59';

/**
 * ── THE MAKER'S PLATE + THE WAX SEAL (owner task #78, research-locked spec) ──
 *
 * The brand lockup on the shaft: an aged-BRONZE MAKER'S PLATE carrying the house
 * device, and beside it the wordmark, whose `o` in "Forge" is a blob of DEEP-RED
 * SEALING WAX with the letter's counter STAMPED THROUGH it.
 *
 * ⚠️⚠️ THE RULE OF TINCTURE, AS A CODE-LEVEL PALETTE CONSTRAINT. Heraldry's oldest
 * legibility law: never metal on metal, never colour on colour. Here that is not
 * decoration advice, it is the whole AA structure of the plate — THE DEVICE'S FILL
 * CARRIES 100% OF THE CONTRAST AND THE RELIEF CARRIES 0%. The device is a METAL
 * (PLATE_DEVICE, pale parchment-gold) on a COLOUR (the bronze face), and it must
 * clear AA on every tone of that face by itself, with the emboss switched off. The
 * bevels, the keyline and the grit are CHARACTER ONLY: near-tonal to the face,
 * carrying no part of any legibility claim, so a browser that renders them badly (or
 * a user with reduced transparency) loses nothing but texture.
 *
 * ⚠️ THE FACE IS MID-TONE, AND THAT IS ALSO A LEGIBILITY DECISION, NOT A MOOD. An
 * engraved plate needs headroom in BOTH directions — a highlight above the face and a
 * shadow below it. On a near-black face there is no room below, the shadow half of
 * every bevel disappears, and the relief flattens into a flat dark shape with a light
 * scratch on it. PLATE_LIT sits at L 0.109: dark enough to carry a pale device at
 * 5.05:1, light enough that PLATE_BEVEL_SHADE still reads as a shadow.
 *
 * ⚠️ THE BEVEL IS CONFINED TO THE PLATE'S MARGIN, AND THAT IS WHAT MAKES THE AA
 * CLAIM GEOMETRIC RATHER THAN HOPEFUL — the same move SHAFT_STOPS.body makes for the
 * barrel. PLATE_BEVEL_LIGHT is lighter than the face, so a device sitting ON it would
 * measure 4.28:1 and fail. It cannot: the bevel lives in the outer PLATE_MARGIN
 * fraction of the plate and the device lives inside that box. MakerPlate's pin
 * asserts the confinement, not the good intentions.
 *
 * ONE LIGHT, ONE AZIMUTH. Every relief on this bar — the plate's bevel, the device's
 * emboss, the plate's mounting shadow — is lit from PLATE_LIGHT_DEG, and so is the
 * barrel it is mounted on (SHAFT_STOPS puts the barrel's highlight along its top).
 * Two light directions in one composition is the single fastest way to make a set of
 * carefully-rendered materials look like stickers.
 */
export const PLATE_LIT = '#6E5A33';
export const PLATE_FACE = '#5A4928';
export const PLATE_DEEP = '#43351B';
export const PLATE_BEVEL_LIGHT = '#7A6539';
export const PLATE_BEVEL_SHADE = '#382C15';
export const PLATE_KEYLINE = '#241B0C';
export const PLATE_DEVICE = '#F0E0B4';
export const PLATE_RIVET = '#8C7444';
// The mounting stack's three shadows, as one authored tone (see MakerPlate).
export const PLATE_SHADOW = '#241B0C';

/**
 * PLATE — the plate's GEOMETRY, in its own 5:6 coordinate space.
 *
 * `ratio` is the HEATER SHIELD's 5:6, the proportion an English heater actually is.
 * (The 9:10 figure the open web repeats is a single-source AI-aggregator echo with no
 * primary behind it; it was checked and rejected during the research pass.)
 *
 * ⚠️ `margin` IS THE BEVEL'S TERRITORY AND THE DEVICE'S FORBIDDEN ZONE — see the
 * tincture note above. It is a FRACTION of the plate, so the confinement survives
 * every size the plate is drawn at, including the 32px favicon redraw.
 *
 * ⚠️ `gritAmp` IS AN ACCESSIBILITY NUMBER WEARING A TEXTURE'S NAME. It is the
 * maximum per-channel deviation the grit may add, in 0-255 units. GRIT, NOT GLOSS:
 * a specular highlight would put a near-white pixel on the face and the device's
 * contrast floor would move with it. At 8 the wash is visible as age and cannot shift
 * any ratio by a hundredth.
 */
export const PLATE = Object.freeze({
  ratio: 5 / 6, margin: 0.14, bevel: 0.035, keyline: 1, gritAmp: 8, seed: 19,
});

/**
 * PLATE_LIGHT_DEG — THE COMPOSITION'S ONE LIGHT DIRECTION, AND SINCE LANE FS IT IS
 * THE SINGLE WRITER FOR EVERY SHADOW AND GLINT OFFSET ON THE BAR RATHER THAN A
 * DOCSTRING'S OPINION ABOUT ONE.
 *
 * ⚠️⚠️ IT WAS A DEAD TOKEN, AND THE CLAIM ABOVE IT WAS FALSE. The PB verifier found
 * both halves. F3: "It is exported from theme.js under a docstring calling it 'the
 * composition's ONE light direction', and it is referenced exactly once in the entire
 * tree: inside a JSX *comment* at src/components/brand/MakerPlate.jsx:178. No code
 * computes from it; changing 225 to any other value moves nothing and reds nothing."
 * F4: "The plate's mounting shadows are (0,+0.5), (+0.5,+1), (+1,+2) — down and RIGHT,
 * i.e. light from the upper LEFT, and the seal's glint arc agrees (upper-left). The
 * band's contact shadows are (-1.6,+0.6) and (-5,+3) — down and LEFT, i.e. light from
 * the upper RIGHT. Two elements 700px apart in one 38px composition are lit from
 * opposite sides."
 *
 * ⚠️ THE ANGLE'S FRAME, SPELLED OUT, because the old docstring's "clockwise from
 * shadow falls straight down" did not survive being used. `(cos θ, sin θ)` in SVG/CSS
 * coordinates — x to the RIGHT, y DOWN — is the unit vector pointing FROM the lit
 * surface TOWARD the light. At 225° that is (-0.7071, -0.7071): left and up, the upper
 * left. A cast shadow therefore lands at the NEGATION of it, down and to the right,
 * which is what the plate already did and what the band now does.
 *
 * ⚠️ WHAT IS DERIVED AND WHAT IS NOT. Every OFFSET — the plate's three mounting
 * shadows, its bevel pair, the device's inverted emboss, the seal's glint arc, the
 * band's cast shadow and its edge-light — reads this constant now, so moving it moves
 * the whole composition together and a wrong sign is a red rather than a screenshot.
 * GRADIENT VECTORS are deliberately NOT derived: a 45° screen direction is not a 45°
 * objectBoundingBox vector unless the box is square, so deriving them means carrying
 * each element's aspect ratio into its own gradient and is a larger change than this
 * lane is scoped for. The three that exist (the plate's face, the vane's fall, the
 * barrel's cylinder) already agree with this azimuth qualitatively; converting them to
 * derived vectors is deliberately deferred — documented, not a bug to re-find.
 */
export const PLATE_LIGHT_DEG = 225;

const LIGHT_RAD = (PLATE_LIGHT_DEG * Math.PI) / 180;

/**
 * The unit vector from a lit surface TOWARD the light, in SVG/CSS coordinates.
 * ⚠️ ROUNDED TO 4dp ON PURPOSE. `Math.cos` is not required by IEEE-754 to be correctly
 * rounded and engines differ in the last ulp; a shadow offset that differs in the 17th
 * digit is invisible, but a token that differs at all is a cross-engine golden hazard
 * the moment anything pins it. Four decimals is finer than a device pixel at any zoom
 * this bar is drawn at and is stable everywhere.
 */
export const LIGHT_UNIT = Object.freeze({
  x: Number(Math.cos(LIGHT_RAD).toFixed(4)),
  y: Number(Math.sin(LIGHT_RAD).toFixed(4)),
});

/** How far, and which way, a mark moves when it is pushed TOWARD the light. */
export const lightOffset = (distance) => Object.freeze({
  dx: Number((LIGHT_UNIT.x * distance).toFixed(3)),
  dy: Number((LIGHT_UNIT.y * distance).toFixed(3)),
});

/** How far, and which way, a CAST SHADOW falls: directly away from the light. */
export const shadowOffset = (distance) => Object.freeze({
  dx: Number((-LIGHT_UNIT.x * distance).toFixed(3)),
  dy: Number((-LIGHT_UNIT.y * distance).toFixed(3)),
});

/**
 * One CSS `drop-shadow()` cast by the composition's light.
 * @param {number} distance how far the caster stands off the surface
 * @param {number} blur the shadow's softness in px
 * @param {string} color the shadow tone
 */
export const dropShadow = (distance, blur, color) => {
  const { dx, dy } = shadowOffset(distance);
  return `drop-shadow(${dx}px ${dy}px ${blur}px ${color})`;
};

/**
 * A CONTACT SHADOW — ambient occlusion, and it deliberately has NO offset.
 *
 * ⚠️ THIS IS NOT AN EXCEPTION TO THE ONE-LIGHT LAW, IT IS THE OTHER HALF OF IT. A cast
 * shadow has an azimuth because a source throws it; occlusion in a crevice has none,
 * because what is missing there is the AMBIENT — the light the room throws back from
 * every direction at once. Offsetting it would be claiming a second source. It is what
 * lets a lap seam read as contact under a light that cannot cast a visible shadow
 * across it (see FletchBand's shingle note).
 *
 * @param {number} blur how tight the contact is, in px
 * @param {string} color the shadow tone
 */
export const contactShadow = (blur, color) => `drop-shadow(0px 0px ${blur}px ${color})`;

/**
 * A HIGHLIGHT ARC aimed at the light — the seal's glint, as geometry rather than as
 * four remembered coordinates.
 *
 * ⚠️ IT LIVES HERE AND NOT IN WaxSeal.jsx FOR A REASON THAT IS ALREADY PINNED.
 * tests/design/makerPlate.test.jsx forbids `Math.sin|cos|tan|exp|log|pow` in every
 * brand module, because a transcendental is not required by IEEE-754 to be correctly
 * rounded and engines differ in the last ulp — which would make a mark that must be
 * byte-identical everywhere, forever, into a cross-engine hazard. The trig therefore
 * happens ONCE, here, beside the constant it derives from, and every result is rounded
 * to 2dp so the authored path is the same string on every engine. That is the same
 * argument LIGHT_UNIT makes, applied to a path instead of an offset.
 *
 * The curve is the standard single-quadratic arc approximation: both ends and the
 * midpoint lie on the circle, with the control point pushed out by 1/cos(half-angle).
 *
 * @param {number} cx centre x, in the caller's own coordinate space
 * @param {number} cy centre y
 * @param {number} r the arc's radius
 * @param {number} halfDeg how far the arc reaches either side of the light's bearing
 * @returns {string} an SVG path
 */
export const lightArc = (cx, cy, r, halfDeg) => {
  const at = (deg, radius) => {
    const t = (deg * Math.PI) / 180;
    return [
      Number((cx + Math.cos(t) * radius).toFixed(2)),
      Number((cy + Math.sin(t) * radius).toFixed(2)),
    ];
  };
  const [ax, ay] = at(PLATE_LIGHT_DEG - halfDeg, r);
  const [bx, by] = at(PLATE_LIGHT_DEG + halfDeg, r);
  const [kx, ky] = at(PLATE_LIGHT_DEG, r / Math.cos((halfDeg * Math.PI) / 180));
  return `M ${ax} ${ay} Q ${kx} ${ky} ${bx} ${by}`;
};

/**
 * THE SEALING WAX — the ONE saturated hue in the whole lockup, and it MEANS
 * something: "sealed". It is rationed on purpose. The bar already spends red once, on
 * the silk wraps that bind the fletching (WRAP), and the seal is deliberately the
 * same family a step deeper, so the two read as one object's two red moments rather
 * than as two unrelated accents.
 *
 * ⚠️⚠️ SEAL_WAX IS DEEP BECAUSE IT IS A LETTERFORM, NOT AN ORNAMENT. It stands in for
 * the `o` of "Forge" inside the wordmark, so it owes TEXT contrast against the bar it
 * rides — and the bar is honey-tan wood. A mid sealing-wax red (#8C2F2A) measures
 * 3.52:1 on the composited barrel and fails; this measures 4.80:1 and passes. The
 * word has to be readable before the seal is allowed to be pretty.
 *
 * ⚠️⚠️ THE IMPRESSION IS THE COUNTER, AND THE COUNTER IS A HOLE. The `o`'s bowl is
 * not painted a darker red — it is genuinely open, so the barrel shows through it.
 * That is what makes the seal survive being shrunk: at 16px it is an annulus with a
 * dimple, and at any size the counter is separated from the wax by a LUMINANCE step
 * of about 4.8:1 rather than by hue, which is what the grayscale test asks for. A
 * darker-red counter measured 1.39:1 against the wax and merged into a blob by 20px.
 */
export const SEAL_WAX = '#6E1F1B';
export const SEAL_RIM = '#4A1310';
export const SEAL_GLINT = '#8E322B';

/**
 * FLETCH — the fletching's GEOMETRY, deliberately kept apart from CHROME: none of
 * it may enter the header's layout box.
 *
 * ⚠️⚠️ EVERY NUMBER HERE IS PAINT AND NEVER LAYOUT — see FletchBand.jsx's overflow
 * note. None of it contributes a height, a margin, a border or an offset to any box,
 * which is what keeps ANCHOR_OFFSET (and with it every About / guide / Compendium
 * anchor landing) describing the bar the ribbon actually is.
 *
 * ⚠️⚠️ `band` IS THE FLETCHING'S OWN DEPTH, AND IT IS INDEPENDENT OF THE BAR
 * (owner directive, 2026-08-03 night, restated in the final correction). The shaft is
 * a THIN STICK; the fletching riding it is ROUGHLY TWICE AS DEEP, top-aligned at the
 * quill line, and the ~half that does not fit HANGS below the bar's bottom edge. So
 * this number is chosen for the FEATHERS, never for the chrome — and as the bar thins
 * the hang grows, which is the composition's whole point rather than a side effect.
 * 76 is about twice the bar this shaft is being thinned toward (the measured floor
 * that still seats the wordmark is in the high thirties); FLETCH_HANG below derives
 * the peek from this and CHROME.headerDesktop, and nothing authors it twice.
 *
 * ⚠️ IT MUST NOT BECOME A MULTIPLE OF THE CHROME. Writing `band: CHROME.headerDesktop
 * * 2` would read as tidier and would destroy the directive: the hang would then be a
 * fixed FRACTION of the bar and could never deepen as the bar thins, which is exactly
 * the behaviour the owner asked for. The relationship is a design intention checked by
 * eye, not an equation — so it is recorded here rather than computed.
 *
 * `lane` is one fletch's width in the band's own coordinate space and `lap` is how far
 * each cell reaches UNDER the next one — the shingle. ⚠️ BOTH LIVE IN ONE COORDINATE
 * SPACE ON PURPOSE. V3 drew three separate SVGs, one per cell, each stretched by
 * `preserveAspectRatio="none"` to its own cell width; the lap was authored in each
 * cell's local units and came out at a DIFFERENT number of screen pixels per cell,
 * small enough that the 10px seam between cells outran it and the band read as three
 * separate tabs with bare wood between them. The band is now ONE SVG over the whole
 * cluster, so `lap` is a fixed fraction of `lane` and the shingle is exact by
 * construction at every width.
 *
 * `barbRun` is the horizontal run a slanted mark makes over the vane's full depth, and
 * it is THE lean of this composition: the barb comb, the two slanted edges of every
 * cell (hence every lap boundary), and the sheen bands all use it, so the comb never
 * crosses the cut. FLETCH_BARB_DEG below is derived from it so the angle can never
 * drift from the geometry that produced it. `barbGap` is the comb's spacing;
 * `barbJitter` the fraction by which the deterministic jitter may widen or narrow one
 * gap — see FletchBand's jitter note; a perfectly regular comb reads as machine
 * hatching.
 *
 * `wrap` is each whipping band's width. ⚠️ IT IS SIZED BY THE BAND'S LEAN, not by
 * taste: the parallelograms are seated so their seams cross the lane divisions at the
 * label's own height, which leaves the leading corner poking about `lean(headerDesktop
 * / 2)` px outside the band's box at the quill line. The wrap is wide enough to bind
 * that corner, which is what a whipping does. Narrower and the feather's tip would
 * stick out past its own binding.
 *
 * `slant` survives as the PLAIN rule's own lean and nothing else: the fletch-seam
 * divider it used to size is retired (the band has no internal seams any more — the
 * laps are the seams).
 */
/**
 * ⚠️⚠️ `barbGap` AND `barbJitter` WERE RETUNED BECAUSE THE BAND READ AS CORRUGATED
 * METAL, AND THE NUMBER THAT MATTERS IS NOT THE GAP — IT IS THE COVERAGE.
 *
 * The PB verifier's eye verdict (2026-08-03 night, finding (g) cause 1, quoted): "The
 * comb is stripes, not texture: barbGap 4.1 viewBox units = 3.6 CSS px with strokes at
 * 0.7/1.0/1.25px non-scaling → up to ~35% areal coverage; the docstring's 'hairline at
 * a ~8% tonal drop' describes the TONE, not the resulting coverage."
 *
 * That is the whole defect in one sentence. The BALANCE LAW was written about tonal
 * depth and the comb honoured it — FLETCH_BARB really is only ~8% darker than
 * FLETCH_VANE — while a third of the vane's AREA was ink. Tone × area is what the eye
 * integrates at arm's length, and a third of the area at any tone is a slatted shutter.
 *
 * The reference settles it: a goose primary held at arm's length shows almost NO
 * individual barbs. It reads as a smooth dark vane with soft tonal bands and a satin
 * sheen, and the barbs are a whisper you only see up close. So the comb stops being the
 * material and becomes a near-subliminal layer over it: the gap widens to 6.6 units
 * (5.8 CSS px on the measured band) and FletchBand's own BARB weights drop to
 * 0.3/0.4/0.5px at 0.11/0.17/0.24 opacity — about 6.9% areal coverage and about 1.2%
 * effective ink. The jitter widens with it (0.34 → 0.42) because a sparser comb needs a
 * looser wobble to stay off the eye's grid.
 */
export const FLETCH = Object.freeze({
  band: 76, lane: 100, lap: 44,
  barbRun: 37, barbGap: 6.6, barbJitter: 0.42,
  slant: 10, wrap: 10,
});

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
//                   ⚠️ IT DID NOT FOLLOW THE DESKTOP BAR DOWN, AND THAT IS A FLOOR,
//                   NOT AN OVERSIGHT. The mobile bar's height is set by the 44px
//                   TAP TARGET inside it plus its 8px padding, not by this token —
//                   so thinning it means shaving breathing room around a tap target,
//                   not slimming a decoration. Deliberately deferred to the owner
//                   (lane PB, 2026-08-03); documented, not a bug to re-find.
//   headerDesktop — THE THIN SHAFT (owner's final correction, 2026-08-03 night):
//                   38px, and it is the desktop bar's REAL height rather than a
//                   description of it.
//                   ⚠️ 38 IS A MEASURED FLOOR, NOT A ROUND NUMBER. The bar must
//                   SEAT its riders at their CURRENT font sizes, and the tallest is
//                   the wordmark: FS.h1 serif with its two capitals at 1.32em, whose
//                   laid-out box measures 34.8px in Chrome at 1440x900. The reference
//                   tabs and Sign In measure 34.0 (FS.sm label + SP.sm padding +
//                   their 2px rule). 38 seats the tallest with 1.6px of air above and
//                   below; 36 leaves 0.6px, which is not a seat but a coincidence one
//                   font-fallback away from clipping. tests/components/navFletching
//                   pins the SEAT — every rider fits inside the bar — rather than the
//                   number, so a future type change reds here instead of shipping a
//                   clipped wordmark.
//                   The FLETCH BAND does NOT follow: it is the feather's own depth
//                   (FLETCH.band), so thinning the shaft DEEPENS the hang, which is
//                   exactly the composition the owner asked for.
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
  headerDesktop:   38,
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
 * DERIVED from the chrome token rather than copied — 38 + 24 = 62 — so changing
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
 * FLETCH_BARB_DEG — THE COMB ANGLE: how far off vertical the barb striations (and,
 * with them, the sheen bands they catch the light in) lean. DERIVED, never spelled.
 *
 * A barb leaves the rachis and sweeps toward the trailing tip, running FLETCH.barbRun
 * across the vane over exactly FLETCH.band of depth. So the angle is
 * atan(barbRun / band) and it re-derives the moment either number moves.
 * At barbRun 37 over a 76-deep vane that is 26° — a comb, not a rake.
 *
 * ⚠️ IT DERIVES FROM THE FEATHER, NOT FROM THE CHROME, and that changed with the
 * shingled band. V3 ran the sweep over CHROME.headerDesktop, which was true only
 * while the vane was exactly as deep as the bar. The vane now hangs well below the
 * bar, and — worse — the shaft is about to get thinner: a comb pinned to the chrome
 * would have swung from 28° to 34° the moment the bar slimmed, changing every
 * feather in the band as a side effect of a layout edit nobody thought was visual.
 * The comb is a property of the FEATHER, so it is measured across the feather.
 * (barbRun moved 26 → 37 in the same edit purely to hold 28° across the new depth.)
 *
 * ⚠️ IT IS SHARED, WHICH IS THE POINT — and the final correction made it MORE so.
 * FletchBand draws the barbs, the sheen bands AND both slanted edges of every cell off
 * this one number, so a lap boundary is a barb line rather than a cut across the
 * grain; angles maintained separately is how a feather stops looking like one feather. It is also deliberately far from the
 * shaft grain's own direction (the grain runs LENGTHWISE, along the shaft), so vane
 * and wood never read as one interference pattern where a fletch meets bare barrel.
 */
export const FLETCH_BARB_DEG = Math.round((Math.atan2(FLETCH.barbRun, FLETCH.band) * 180) / Math.PI);

/**
 * FLETCH_HANG — how far the fletching's lower edges PEEK below the bar, in px.
 *
 * ⚠️⚠️ DERIVED, AND PAINT, AND NEITHER OF THOSE IS OPTIONAL. It is the difference
 * between the feather's own depth and the bar's, so thinning the shaft deepens the
 * hang without anyone editing a second number — which is exactly the composition the
 * owner asked for ("the band's height is independent; it hangs deeper as the bar
 * thins"). And it is bought with `overflow: visible` on a zero-inset box, never with
 * a height, a margin, a border or a negative offset: theme.js derives ANCHOR_OFFSET
 * from CHROME.headerDesktop and every in-page anchor in the estate lands on it, so a
 * hang that cost one pixel of box would move every anchor in the product.
 * tests/components/navFletching.test.jsx pins the mechanism AND the absence.
 */
export const FLETCH_HANG = FLETCH.band - CHROME.headerDesktop;

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
