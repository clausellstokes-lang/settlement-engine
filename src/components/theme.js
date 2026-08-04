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
//
// ⚠️⚠️⚠️ RIBBON V4 (owner directive, 2026-08-03 night) — THE WAR ARROW REPAINT, AND
// IT MOVES THE GROUND A THIRD TIME, PAST THE POINT OF NO RETURN FOR THE INK REGISTER.
//
// The owner's correction: the shaft is a CEDAR/MAHOGANY WAR SHAFT — red/dark brown,
// not honey — and the feather base is the BOTTOM-BORDER DARK INK FAMILY. Both halves
// of the composition therefore go dark, and the whole bar flips register: EVERY DARK
// INK RIDER BECOMES A PARCHMENT ONE. That is not a palette preference, it is forced,
// and the forcing is arithmetic:
//
//   THE MID-RUSSET DEAD BAND. A wood body whose relative luminance falls between
//   ~0.145 and ~0.252 clears NEITHER register. PARCH_100 (L 0.826) needs a ground at
//   or below L 0.1447 to reach 4.5:1; INK_DEEP (L 0.0163) needs one at or above
//   L 0.2521. Between those two numbers there is no legible label of either colour,
//   at any hue. Measured on a grey ramp: at L 0.18 the pale label reads 3.79:1 and
//   the dark label 3.44:1 — BOTH FAIL, and nothing about the failure is visible in a
//   screenshot. So the single most important DON'T in this file is: DO NOT SHIP THE
//   MIDDLE OF THE WOOD RANGE. SHAFT_BODY IS COMMITTED TO L ≤ 0.13, and the pin that
//   makes that a law rather than a note is in tests/design/contrast.test.js.
//
// WHAT V4 RETIRED, so nobody re-finds it: the honey-tan barrel; the ink label
// register on the bar (INK_DEEP / BODY / SECOND as header foregrounds); GOLD_TXT as
// the plain tab's underline; the DARK account-chip tones; and the MAKER'S PLATE as a
// header element — the Device survives as the favicon and the PDF seal, and the
// wordmark itself becomes the mounted, gilded artifact (see the GILT ladder below).

/**
 * THE SHAFT — CEDAR/MAHOGANY war shaft (owner's V4 correction), modelled as the
 * near half of a CYLINDER.
 *
 * Five steps down the barrel, lit from above. SHAFT_SHEEN is the satin highlight
 * along the visible centreline at the very top; SHAFT is the body; SHAFT_BODY is
 * THE BODY TONE the whole register is committed against; SHAFT_EDGE and SHAFT_RIM
 * are the falloff into the silhouette at the bottom, which is what makes the bar read
 * as a round shaft rather than a flat plank. The modelling range top-to-bottom is
 * 2.76:1 — a real barrel, and still one piece of wood.
 *
 * ⚠️⚠️ THE POLARITY INVERTED, AND EVERY CLAIM IN THIS FILE INVERTED WITH IT. On the
 * honey barrel the labels were DARK, so the worst ground was the DARKEST tone under
 * their ink and SHAFT_STOPS.body was the guarantee that mattered. On cedar the labels
 * are PALE, so the worst ground is the LIGHTEST tone under their ink and the
 * guarantee that matters is SHAFT_STOPS.lit — the stop below which the satin sheen is
 * confined. It is 0.09; the SHALLOWEST ink any rider puts on this bar is the
 * wordmark's, at fraction 0.1995 (HEADER_RIDERS). So the lightest ground a letterform
 * can touch is cylinderToneAt(0.1995) = rgb(147,84,51), L 0.1268 — under the L 0.1447
 * ceiling PARCH_100 needs for 4.5:1, with room to spare. SHAFT_SHEEN itself is
 * L 0.1467 and would NOT clear it; it never has to, because no ink reaches it.
 * That confinement is the whole AA structure of the bar and it is pinned as a
 * relationship (`min(ink[0]/bar) > SHAFT_STOPS.lit`), never as a promise.
 *
 * ⚠️⚠️ AND THE GRAIN NOW HELPS INSTEAD OF HURTING. The bar a user reads is a
 * COMPOSITE: the grain data-URI painted OVER SHAFT_CYLINDER over the base colour. The
 * grain is a DARK wash, so on the honey barrel it pushed the ground down toward the
 * dark labels' floor and its alpha was a live accessibility lever. Against a PALE
 * register a darkening wash can only ever improve the ratio — which is why GRAIN_AMP's
 * budget is re-derived in V4 from an AA ceiling into a DIRECTION proof (see GRAIN_AMP).
 *
 * (WCAG 2.2 AA = 4.5:1 for text, SC 1.4.11 = 3:1 for a UI boundary. The PALE column is
 * each rider measured on ITS OWN lightest ground — riderFloorTone's `pale` polarity —
 * which is what tests/design/compositedBarAA.test.js computes.)
 *                                                        PALE FLOOR
 *   PARCH_100  resting reference tab ....................   5.73  AA ✓
 *   PARCH      active reference tab .....................   6.31  AA ✓
 *   PARCH_100  the ghost register (Upgrade) .............   5.27  AA ✓
 *   SHAFT_SAGE the signed-in account chip ................  4.63  AA ✓
 *   SHAFT_STEEL the developer account chip ...............  4.63  AA ✓
 *   GILT       the active tab's underline ................  3.74  1.4.11 ✓
 *   GILT_LIGHT the quill-line indicator, on the sheen ....  3.34  1.4.11 ✓
 *
 * ⚠️ THE ACCOUNT CHIP IS IN THIS TABLE BECAUSE IT HAS NO GROUND OF ITS OWN.
 * AccountMenu's chip is `background: transparent`, so SHAFT_SAGE / SHAFT_STEEL are
 * read against whatever the bar paints beneath them. It renders only when signed in,
 * which the census page cannot reach, so it is covered by measuring the GROUND rather
 * than the chip.
 *
 * ⚠️ CHROMA STAYS RATIONED. The wood is LOW-chroma earth; saturation is the seal's
 * alone; gold is metal. The cedar's own red is a wood red, not a signal red — which is
 * what lets the oxblood wraps and the deep wax still read as the two saturated moments.
 */
export const SHAFT_SHEEN = '#9C5A38';
export const SHAFT = '#83492C';
export const SHAFT_BODY = '#7A422A';
export const SHAFT_EDGE = '#5E3220';
export const SHAFT_RIM = '#3F2013';

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
 * the silhouette and then drops fast. The four real shortfalls it repaired, measured
 * on the composited raster of the HONEY barrel:
 *   INK_DEEP on the wordmark's descender  4.15 -> 5.59  (AA 4.5 — was FAILING)
 *   SEAL_WAX, the `o` of Forge            4.48 -> 4.80  (AA 4.5 — was FAILING)
 *   GOLD_TXT, the plain tab's underline   2.29 -> 3.15  (1.4.11 3:1 — was FAILING)
 *   BODY on the WRAPPED MOBILE bar        4.24 -> 4.62  (AA 4.5 — was FAILING)
 * None of these was visible to the old pin, because the old pin measured one floor —
 * grain over SHAFT_BODY — for every rider, and no rider's real ground was that floor.
 *
 * ⚠️⚠️ AND THEN V4 INVERTED WHICH STOP IS LOAD-BEARING, WITHOUT MOVING ONE NUMBER.
 * The four rows above are HISTORY: their riders are gone (INK_DEEP, GOLD_TXT and BODY
 * are no longer header foregrounds, and the seal now sits inside a gold annulus on a
 * bole bed). On cedar the register is PALE, so a pale label fails at its ground's
 * LIGHTEST point and the guarantee that carries the bar is `lit`, not `body`:
 *
 *   SHAFT_STOPS.lit = 0.09   confines the satin sheen (L 0.1467, which would NOT
 *                            clear PARCH_100's L 0.1447 ceiling) ABOVE every rider.
 *   min(ink[0]/bar) = 0.1995 the wordmark's own top of ink — the shallowest on the bar.
 *
 * The stops are UNCHANGED because they were already right for both polarities; what
 * changed is which end of the ladder the argument leans on, and that is stated here
 * so a future edit does not "free up" the lit stop thinking it costs nothing.
 *
 * ⚠️ THE COUPLING TO WATCH IS UNCHANGED IN KIND, AND NOW RUNS THE OTHER WAY. These are
 * FRACTIONS, so a shorter bar pushes every stop UP in absolute pixels while the riders'
 * ink stays the same number of px — which now brings the SHEEN down toward the
 * shallowest ink rather than the rim up toward the deepest. It is still the SMALLEST
 * bar that governs, and anyone thinning this bar again must re-measure HEADER_RIDERS
 * and move these numbers with it; the pin says so per rider, with the rider named.
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
 * ⚠️⚠️ `polarity` IS THE V4 ADDITION AND IT IS WHAT KEEPS THE DERIVATION PIN HONEST.
 * A floor is only a floor with respect to a DIRECTION of failure, and the V4 register
 * flip means the bar now carries both directions at once:
 *
 *   'dark'  dark ink on the bar → fails toward the DARKEST composited tone under its
 *           ink: the BOTTOM of its extent, with the grain wash at full strength.
 *   'pale'  pale ink on the bar → fails toward the LIGHTEST tone under its ink: the
 *           TOP of its extent, with NO grain at all (a darkening wash cannot make a
 *           pale label's ground lighter, so its worst case is the bare cylinder).
 *   'bed'   the mark paints its OWN opaque ground, so the bar is not its ground: the
 *           gilded wordmark on its bole bed, and the seal inside its gold annulus.
 *           Its floor is asserted against that bed by the pin that owns the bed.
 *
 * ⚠️ WITHOUT THIS FIELD THE PIN GOES VACUOUSLY GREEN. `riderFloorTone` used to take
 * `ink[1]` unconditionally, which is the DARKEST end. Point it at a pale label and it
 * hands back the friendliest ground on the bar and reports a comfortable pass while the
 * real worst case — the sheen at the top of the same extent — is never measured. That
 * is the same shape of defect as the single hand-keyed floor this table replaced, one
 * level deeper, so the polarity is stored beside the measurement rather than inferred.
 *
 * Receipts: Chrome, this lane, 2026-08-03. Desktop 1440x900 (header 38px), mobile
 * 390x844 (header 80.84px). tests/design/compositedBarAA.test.js computes each rider's
 * own composited floor from this table; tests/components/navFletching.test.jsx asserts
 * the bar SEATS the same set.
 */
export const HEADER_RIDERS = Object.freeze({
  // the wordmark: FS.h1 serif with its two capitals at 1.32em. The tallest rider AND
  // the deepest — the `g` of "Forge" is what sets the extent the BOLE BED must cover.
  // ⚠️ 'bed': since V4 the wordmark is gold leaf on an opaque Armenian-bole field, so
  // its ground is BOLE and never the barrel. The extent survives because the bole's
  // own containment pin is derived from it (bole ⊇ ink + BOLE_PAD).
  wordmark: Object.freeze({ ink: [7.58, 37.08], bar: 38, box: 34.84, polarity: 'bed' }),
  // the wax seal standing in for one `o`: a graphic, but it owes TEXT contrast. Since
  // V4 its ground is the gold annulus that is the `o`'s stroke, not the wood.
  seal: Object.freeze({ ink: [15.82, 31.66], bar: 38, box: 15.84, polarity: 'bed' }),
  // the plain reference tabs' labels: FS.sm in a padded, ruled box. PALE since V4.
  tab: Object.freeze({ ink: [13.25, 24.25], bar: 38, box: 34, polarity: 'pale' }),
  // that box's 2px underline, which is the ACTIVE state's boundary and sits far lower
  // than the label it belongs to — the rider the old single-floor model hid completely.
  // GILT since V4: gold is a pale mark, so it fails toward the light like the label.
  tabRule: Object.freeze({ ink: [34, 36], bar: 38, box: 34, polarity: 'pale' }),
  // the GHOST register on the bar (Upgrade), and Sign In beside it. ⚠️ Sign In paints
  // its own opaque gold ground, so measuring this extent against the bar is deliberately
  // OVER-strict — kept that way rather than exempted, in the one direction a safety pin
  // should err. The ghost button genuinely has no ground and is the real subject.
  signIn: Object.freeze({ ink: [10, 21.5], bar: 38, box: 34, polarity: 'pale' }),
  // the signed-in account chip: `background: transparent`, so it genuinely reads
  // against the bar. It cannot render on the census page, which is why it is measured
  // by its GROUND rather than by itself.
  chip: Object.freeze({ ink: [10, 25.25], bar: 38, box: 34, polarity: 'pale' }),
  // the wrapped MOBILE bar's second row of labels — the deepest ink on that bar.
  mobileTab: Object.freeze({ ink: [58.28, 70.1], bar: 80.84, box: 34, polarity: 'pale' }),
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
 * THE WORST TONE ONE RIDER'S INK CAN LAND ON, IN ITS OWN DIRECTION OF FAILURE —
 * its floor before the grain, and since V4 the direction is READ, never assumed.
 *
 * The cylinder only darkens downward, so the extremes of any extent are its two ends:
 * the BOTTOM is the darkest tone it touches and the TOP is the lightest. Which of the
 * two is the "floor" depends entirely on the ink:
 *
 *   'dark' ink → the bottom. A dark label fails where its ground is darkest.
 *   'pale' ink → the TOP. A pale label fails where its ground is lightest, which is
 *                the exact inverse, and is why V4 needs this at all.
 *   'bed'      → the rider paints its own opaque ground; the barrel is not its ground.
 *                Returning the bar's tone for one of these would be answering a
 *                question nobody asked, so it throws instead of guessing.
 *
 * ⚠️ `vaneEdge` IS NOT IN HEADER_RIDERS AND CANNOT BE: the fletch band's boundary runs
 * the whole bar and then hangs below it, so its extent is not a measurement of a
 * letterform but a scoping decision — it is passed explicitly by the pin that makes
 * that decision, with its residual quoted there rather than buried here.
 *
 * @param {{ ink: number[], bar: number, polarity: string }} rider a HEADER_RIDERS row
 * @returns {[number, number, number]} the 0-255 sRGB triple under its worst ink
 */
export const riderFloorTone = (rider) => {
  if (rider.polarity === 'bed') {
    throw new Error('riderFloorTone: a `bed` rider has no barrel ground — measure it against its own bed');
  }
  return cylinderToneAt(rider.ink[rider.polarity === 'dark' ? 1 : 0] / rider.bar);
};

/**
 * HOW MUCH OF THE GRAIN'S PEAK WASH A RIDER'S FLOOR CARRIES — the other half of the
 * polarity, and it is a SHARE rather than a boolean so the pin composites one formula.
 *
 * The grain is a dark wash. Over a dark label's ground it deepens the ground and costs
 * contrast, so a dark rider's floor carries the wash at its strongest. Over a PALE
 * label's ground the same wash can only ever darken — which raises the ratio — so the
 * pale rider's worst case is the wash at its WEAKEST, which is zero: the bare cylinder
 * showing through a gap in the grain. Compositing the peak wash under a pale label
 * would be measuring its BEST case and calling it a floor.
 *
 * @param {{ polarity: string }} rider a HEADER_RIDERS row
 * @returns {number} 1 when the peak wash is the worst case, 0 when its absence is
 */
export const riderGrainShare = (rider) => (rider.polarity === 'dark' ? 1 : 0);

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
 * ⚠️⚠️ ON THE HONEY BARREL THIS WAS THE LAYER THAT DECIDED THE BAR'S CONTRAST FLOOR.
 * Every AA ratio was quoted against SHAFT_BODY, the cylinder never went darker than
 * SHAFT_BODY inside the label band, and the grain did: a dark-brown wash painted OVER
 * the cylinder, so the darkest tone a DARK letterform landed on was SHAFT_BODY
 * composited with this wash at its strongest point. Turn the number up and every ratio
 * on that bar fell together. THE BUDGET WAS DERIVED FROM THAT: BODY (the resting
 * reference tab) at 4.5:1 needed a ground of at least L 0.3865 against SHAFT_BODY's
 * L 0.4243, so the wash could spend at most 0.038 of luminance — about a 7% alpha at
 * its peak — and GRAIN_AMP 0.24 held it there.
 *
 * ⚠️⚠️ V4 RE-DERIVED IT, AND THE DERIVATION CHANGED KIND RATHER THAN VALUE. On cedar
 * the register is PALE, and a darkening wash under a pale label can only ever RAISE
 * its ratio. So the AA budget above does not bind any more, and the honest replacement
 * is a DIRECTION proof rather than a ceiling:
 *
 *   THE LAW: the grain's own tone must be darker than the lightest ground any rider's
 *   ink can touch, so that no alpha, at any strength, can lighten a pale label's
 *   ground. GRAIN tone = SHAFT_EDGE, L 0.0477. Lightest rider ground =
 *   cylinderToneAt(0.1995), L 0.1268. 0.0477 < 0.1268, at every alpha, by construction.
 *
 * ⚠️ SO WHAT SETS THE NUMBER NOW IS THE MATERIAL, AND IT IS STILL DERIVED. The wood is
 * about five times darker than the honey barrel, so the OLD alpha would have been
 * nearly invisible on it. The target is the one thing that should not change across a
 * repaint: the wash costs the same SHARE of the wood's own luminance it cost before —
 * 7.5% at its peak (0.4243 → 0.3924 then; 0.0820 → 0.0759 now). Solving the sRGB
 * composite of SHAFT_EDGE over SHAFT_BODY for that share gives a peak alpha of 0.1579,
 * and the tile's measured peak alpha is 0.2451 · GRAIN_AMP, so GRAIN_AMP = 0.644 → the
 * authored 0.64 (peak alpha 0.1569, a 7.45% drop). A DELIBERATE ONE-TIME VISUAL SHIFT:
 * the grain is materially stronger in absolute alpha and identical in read.
 *
 * The alpha the filter computes is GRAIN_AMP * (0.20*(R+G+B) - 0.22): the SHAPE of
 * the wash (where it appears and where it clamps to nothing) is unchanged, only its
 * STRENGTH is scaled, so the grain still reads as lengthwise streaks rather than
 * becoming a flat tint.
 *
 * ⚠️ IT WAS 1.0 AND THE BAR DID NOT CLEAR AA OFF-CHROMIUM. See the colour-space note
 * below: with linearRGB left to the engines, Chrome rendered the wash at about 6%
 * and librsvg at 17%, and at 17% the resting tab measured 4.09:1. Declaring sRGB made
 * the engines agree — at the DARKER number. That argument is history in the same way
 * the budget is: the space is still declared, and for the same reason (a deterministic
 * seed only buys a deterministic FIELD; the space is what makes it a deterministic
 * PICTURE), but the reader it protects is now the material rather than the ratio.
 * tests/design/compositedBarAA.test.js rasterises the real tile and enforces it.
 */
export const GRAIN_AMP = 0.64;

/**
 * THE GRAIN'S OWN TONE, DERIVED FROM THE BARREL RATHER THAN HAND-KEYED — the V4 cure
 * for a side table that had already outlived one repaint.
 *
 * It used to be three loose decimals (0.36 0.26 0.13) sitting in the middle of the
 * matrix string: a hand-keyed brown that happened to suit honey wood and would have
 * kept suiting it after the wood went cedar, silently, because nothing read it. Grain
 * is not a colour laid ON the wood, it is the wood's own darker latewood — so it takes
 * SHAFT_EDGE, the barrel's own falloff step, and moves whenever the ladder does.
 *
 * ⚠️ IT ALSO CARRIES THE DIRECTION PROOF above: SHAFT_EDGE is darker than every tone
 * the cylinder reaches inside any rider's ink, so this wash can only darken, at any
 * alpha, forever. Choosing a tone LIGHTER than SHAFT_EDGE would quietly turn the grain
 * back into a contrast lever — hence the pin beside it.
 */
const GRAIN_TONE = SHAFT_EDGE;

/**
 * ⚠️⚠️ THE WOOD'S TEXTURE TILES ARE BUILT BY ONE WRITER — spec part 2 §2's three
 * layers, and the reason they share a builder is the reason the grain needed a colour
 * space declared in the first place.
 *
 * A wood texture on this bar is always the same four decisions: a fixed feTurbulence
 * seed, an anisotropic baseFrequency, a feColorMatrix that paints ONE fixed tone at an
 * alpha DERIVED from the noise, and the escaping that survives becoming a data URI.
 * Three hand-authored copies of that is three places for `color-interpolation-filters`
 * to go missing, three places for the escape ORDER to be got wrong, and three tile
 * sizes to drift apart so the layers stop tiling in step.
 *
 * ⚠️ THE ESCAPE ORDER IS THE TRAP AND IT IS WHY THIS IS A FUNCTION. `%` must be
 * escaped BEFORE `#`, `<` and `>`, or the `%23` this very function emits is re-escaped
 * into `%2523` and the filter reference stops resolving — a texture that silently
 * renders as nothing. The SVG is authored with single-quoted attributes and explicit
 * userSpaceOnUse numbers (never `100%`) precisely to keep the character set this small.
 *
 * ⚠️ `gain` AND `bias` ARE PASSED ALREADY SCALED, not as an amplitude the builder
 * multiplies. Each layer's amplitude constant is its own accessibility/material
 * argument (see GRAIN_AMP, GROWTH_AMP, PORE_AMP), and the arithmetic that spends it
 * belongs beside that argument at the call site rather than hidden in here.
 *
 * ⚠️⚠️ `ceiling` IS THE SECOND MATRIX, AND IT IS WHAT MAKES A THRESHOLDED LAYER
 * VISIBLE AT ALL — the defect the first cut of the wood finishes shipped past.
 * `gain·(R+G+B) − bias` clamps at ZERO below the cut, which is the thresholding; it also
 * clamps at ONE above it, and that is the half that matters. With a gentle gain the
 * surviving band is a shallow triangle whose typical alpha is a fraction of its peak, so
 * a layer authored "at 9%" renders at about 2% almost everywhere and reads as nothing.
 * Screenshotted at 3x against bare wood, the first growth pass was indistinguishable
 * from the bare cylinder. With a STEEP gain the same band saturates to a broad PLATEAU
 * at alpha 1, and the second matrix then scales that plateau down to the authored
 * ceiling — so the layer is a few broad strokes AT its budget rather than a wide smear
 * an order of magnitude under it. The budget is spent, not merely declared.
 *
 * A layer that wants the raw ramp (the grain, whose whole character is that it never
 * saturates) passes no ceiling and gets no second matrix — its bytes are untouched.
 *
 * @param {string} id the filter's document-local id — one per layer, for legibility
 * @param {number} seed the feTurbulence seed (vetted non-degenerate; see the seed pin)
 * @param {string} baseFrequency the anisotropic `x y` pair
 * @param {number} gain the alpha the matrix takes from each of R, G and B
 * @param {number} bias the constant added to that sum — NEGATIVE, so the wash clamps
 *   to nothing in the gaps and the layer is a texture rather than a flat tint
 * @param {string} tone the fixed colour the matrix paints
 * @param {number} [ceiling] the peak alpha the saturated plateau is scaled down to;
 *   omitted for an unsaturated ramp
 * @returns {string} a CSS `url("data:image/svg+xml,…")`
 */
function woodTile(id, seed, baseFrequency, gain, bias, tone, ceiling) {
  const unit = ((h) => {
    const n = parseInt(h.slice(1, 7), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => Number((v / 255).toFixed(4)));
  })(tone);
  const svg = [
    `<svg xmlns='http://www.w3.org/2000/svg' width='${WOOD_TILE.w}' height='${WOOD_TILE.h}'>`,
    `<filter id='${id}' filterUnits='userSpaceOnUse' x='0' y='0'`,
    ` width='${WOOD_TILE.w}' height='${WOOD_TILE.h}' color-interpolation-filters='sRGB'>`,
    `<feTurbulence type='fractalNoise' baseFrequency='${baseFrequency}' numOctaves='3'`,
    ` seed='${seed}' stitchTiles='stitch' result='noise'/>`,
    "<feColorMatrix in='noise' type='matrix' values='",
    `0 0 0 0 ${unit[0]} 0 0 0 0 ${unit[1]} 0 0 0 0 ${unit[2]} ${gain} ${gain} ${gain} 0 ${bias}'`,
    ceiling === undefined ? '/>' : " result='cut'/>",
    ceiling === undefined ? ''
      : `<feColorMatrix in='cut' type='matrix' values='1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 ${ceiling} 0'/>`,
    '</filter>',
    `<rect x='0' y='0' width='${WOOD_TILE.w}' height='${WOOD_TILE.h}' filter='url(#${id})'/>`,
    '</svg>',
  ].join('');
  return `url("data:image/svg+xml,${svg
    .replace(/%/g, '%25').replace(/#/g, '%23').replace(/</g, '%3C').replace(/>/g, '%3E')}")`;
}

/**
 * THE TILE EVERY WOOD LAYER SHARES. ⚠️ ONE SIZE, NOT THREE, AND IT IS LOAD-BEARING:
 * `stitchTiles='stitch'` makes each layer seamless at its OWN period, so three
 * different periods would beat against one another and the plank would grow a visible
 * moiré at some viewport widths and not others. Every claim about "per 320px tile"
 * below is a claim about this rectangle.
 */
const WOOD_TILE = Object.freeze({ w: 320, h: 64 });

export const SHAFT_GRAIN_TEXTURE = woodTile(
  'grain', 7, '0.008 0.42', 0.20 * GRAIN_AMP, -0.22 * GRAIN_AMP, GRAIN_TONE,
);

/**
 * ⚠️⚠️ THE GROWTH LINES (spec part 2 §2) — THE SECOND TURBULENCE PASS, AND IT IS THE
 * LAYER THAT MAKES THE BARREL READ AS A PIECE OF WOOD RATHER THAN AS A SHADED TUBE.
 *
 * The grain (seed 7) is FINE: hundreds of hairline streaks that integrate into a matte
 * surface. Real turned cedar also carries a handful of BROAD tonal runs — the growth
 * rings the shaft was cut across — and their absence is why the V4 bar reads slightly
 * synthetic at a glance even with the grain on it. So this pass is deliberately the
 * opposite shape: very few, very broad, very quiet.
 *
 * ⚠️ THE NUMBERS ARE MEASURED, NOT ASSERTED, AND ONE OF THEM IS A CORRECTED SPEC VALUE.
 * The spec asks for "seed 11, baseFrequency 0.004 0.55, matrix-thresholded to 2-3 broad
 * wavering streaks per 320px tile, RIM-tone wash <=9% alpha". Rasterised, `0.004 0.55`
 * cannot produce that picture at ANY threshold: a y-frequency of 0.55 is a 1.8px period,
 * FINER than the grain's own 0.42, so the field is banded into a dozen-plus thin lines
 * across the tile's 64px and thresholding it harder makes the survivors thinner rather
 * than fewer. Measured on the real tile: 0.55 gives 12-17 streak crossings per column at
 * every gain/bias pair tried, against the spec's own "2-3".
 *
 *   JUDGMENT (vetoable): the SHAPE the spec describes in words is kept and the
 *   y-frequency is corrected to the value that produces it — 0.05, a ~20px period, which
 *   measures 2 and 3 streak crossings on two independent columns of the tile. The x
 *   frequency (0.004, the "wavering slowly ALONG the shaft" half) and the seed (11) are
 *   the spec's own. Alternative rejected: honour `0.55` literally and drop the "2-3
 *   broad" language — that ships a second fine grain over the first, which is the
 *   corrugated-metal failure the band was already rebuilt once to escape.
 *
 * THE WASH IS RIM-TONE, and that is both the spec's letter and the direction law: the
 * darkest step on the ladder can only ever darken (see GRAIN_AMP's direction proof).
 *
 * ⚠️ GROWTH_AMP IS A CEILING, NOT A SCALE, and the difference is the layer's whole
 * visibility. See woodTile's `ceiling` note: the threshold is applied with a STEEP gain
 * so the surviving band saturates into a broad plateau, and this number is what that
 * plateau is scaled down to. Measured on the real tile: peak alpha 0.0902 — the ceiling,
 * reached — across 25.7% of the tile at a mean-over-inked of 3.95%, and a mean run count
 * of 1.99 streak crossings per column with a maximum of 4. The first cut spent a gentle
 * gain instead and measured a 2.85% mean at the same nominal budget: a layer that was
 * authored at 9% and rendered as nothing.
 */
export const GROWTH_AMP = 0.09;
/**
 * THE THRESHOLD'S TWO NUMBERS. `GROWTH_CUT` is where it cuts, as the sum of the noise's
 * three channels; `GROWTH_GAIN` is how steeply it climbs past the cut, which is what
 * decides whether the survivors are a shallow smear or a plateau at the ceiling.
 *
 * ⚠️ THEY ARE SEPARATE FROM THE AMPLITUDE because they answer different questions — the
 * cut decides HOW MANY streaks, the gain how BROAD each one is at full strength, and the
 * amplitude how dark full strength is. The grain's single-knob spelling (0.20/0.22, one
 * fixed ratio) can express none of that, which is why it is not reused here.
 */
const GROWTH_CUT = 1.53;
const GROWTH_GAIN = 3.0;
export const SHAFT_GROWTH_TEXTURE = woodTile(
  'growth', 11, '0.004 0.05', GROWTH_GAIN, -GROWTH_GAIN * GROWTH_CUT, SHAFT_RIM, GROWTH_AMP,
);

/**
 * ⚠️ THE PORE FLECKING (spec part 2 §2) — RETINA-ONLY, AND "RETINA-ONLY" HERE MEANS
 * ALWAYS PAINTED AND ONLY EVER RESOLVED AT 2x, exactly as the comb and the fray are.
 *
 * Spec part 2 §4's threshold table puts pore flecks in the same class as the band's
 * comb: "≤0.6px, each <2% effective ink so 1x integrates as tone — the corrugated-metal
 * law inverted". So there is no media query and no second code path; there is one layer
 * whose ink is small enough that a 1x rasteriser integrates it into a matte surface and
 * a 2x one resolves it into pores. Measured: 4.38% areal coverage at a 0.0588 peak alpha
 * — the spec's "~4% coverage at 6% alpha" — for a MEAN alpha of 0.0011 over the whole
 * tile, 0.11% effective ink, an order and a half under the 2% ceiling.
 *
 * ⚠️⚠️ THE SPEC'S TWO FREQUENCIES ARE TRANSPOSED AND THEY ARE SWAPPED HERE, RECORDED
 * RATHER THAN SILENTLY FOLLOWED. The spec reads "baseFrequency 0.35 0.08 (flecks
 * elongated along the shaft)" — and in SVG the pair is `x y`, where a HIGHER frequency
 * means FASTER variation and therefore SMALLER features on that axis. `0.35 0.08` is
 * fast in x and slow in y, which makes features tall and narrow: flecks elongated
 * ACROSS the shaft, the exact opposite of the parenthetical in the same sentence. The
 * repo's own grain settles which half is the intent: it has run `0.008 0.42` — slow in
 * x, fast in y — since V3 and is described everywhere as "grain running WITH the shaft".
 *
 *   JUDGMENT (vetoable): the two numbers are the spec's, in the order that produces the
 *   shape the spec's own words ask for. Alternative rejected: `0.35 0.08` verbatim,
 *   which would put a cross-grain fleck field on a longitudinally-grained shaft — the
 *   one texture pairing that reads as printed paper rather than as turned wood.
 */
export const PORE_AMP = 0.06;
/**
 * The pores' threshold — see GROWTH_CUT/GROWTH_GAIN. The cut is HIGHER (far fewer
 * pixels survive: 4.4% of the tile against the growth lines' 25.7%) and the gain steeper
 * still, because a pore is a small hard mark rather than a broad soft run: a fleck that
 * fades out over its own width is a smudge, and a smudge at 2x is worse than no pore.
 */
const PORE_CUT = 1.87;
const PORE_GAIN = 4.0;
export const SHAFT_PORE_TEXTURE = woodTile(
  'pore', 13, '0.08 0.35', PORE_GAIN, -PORE_GAIN * PORE_CUT, SHAFT_RIM, PORE_AMP,
);

/**
 * SHAFT_GRAIN_LAYERS — the finished plank, as ONE CSS background-image string both
 * headers share, so the mobile and desktop bars are the same piece of wood.
 *
 * ⚠️⚠️ THE LIST IS IN CSS PAINT ORDER, WHICH IS THE REVERSE OF READING ORDER, and spec
 * part 2 §5 names the reading order: base → cylinder → grain(7) → growth(11) →
 * flecks(13). A CSS `background-image` list paints its FIRST layer TOPMOST, so the list
 * is that sequence reversed. Getting it backwards would put the barrel's shading over
 * the wood's own surface and the plank would go flat — the same failure the two-layer
 * version already recorded, now with two more layers able to make it.
 *
 * ⚠️ Consumers must paint this OVER the SHAFT base colour (`background-image` +
 * `background-color`), never as the whole `background` shorthand with no base — every
 * layer here is transparent in its gaps and the page would show through the shaft.
 *
 * ⚠️⚠️ EVERY LAYER DARKENS AND NONE MAY LIGHTEN — THE DEAD-BAND LAW, spec part 2 §2's
 * "all darkening-direction only; pale latewood streaks BANNED". A pale streak is not a
 * taste failure: the bar's whole AA structure is that a PALE label's ground never rises
 * above L 0.1447 (see SHAFT_STOPS), and a lightening layer at any alpha walks that
 * ground toward the mid-russet dead band where NEITHER register is legible. The three
 * tones here are SHAFT_EDGE (L 0.0477) and SHAFT_RIM (L 0.0223) twice, all far below
 * the L 0.1268 lightest ground any rider's ink can touch, so the direction holds at
 * every alpha by construction. tests/design/compositedBarAA.test.js asserts it per layer.
 */
export const SHAFT_GRAIN_LAYERS = [
  SHAFT_PORE_TEXTURE, SHAFT_GROWTH_TEXTURE, SHAFT_GRAIN_TEXTURE, SHAFT_CYLINDER,
].join(', ');

// SHAFT_RULE — the seam between two REFERENCE tabs, read as a groove cut in the
// barrel.
// ⚠️⚠️ A GROOVE IS A SHADOW, NEVER A HIGHLIGHT, AND V4 IS WHERE THAT STOPPED BEING
// A TASTE AND BECAME THE DERIVATION. On honey wood this was #8C6E42 at 2.14:1, chosen
// by eye, and the pin beside it read "quieter than the fletching, louder than BORDER".
// On cedar that second half inverts: BORDER (#C8B89A) is LIGHTER than the wood, so it
// would measure 4.08:1 and be the loudest mark on the bar — it fails now for the
// opposite reason it failed before. So the rule is derived instead of measured against
// a moving neighbour: it must be DARKER than the wood (a cut in a surface removes
// light) and quieter than the boundary that says "fletch" (1.41:1 against the vane's
// 1.73:1), which keeps the hierarchy between "the journey" and "the shelf" that is the
// whole point. A decorative divider carries no WCAG floor either way.
export const SHAFT_RULE = '#5A3020';

// SHAFT_SAGE / SHAFT_STEEL — the account chip's status tones FOR TEXT RIDING THE
// WOOD, and they exist because the chip's background is `transparent`, so its label
// is read against whatever the header paints.
// ⚠️ THE TWO-STEP COLLAPSED IN V3, AND V4 FLIPPED WHAT IS LEFT. V2 could keep a
// brighter RULE (GREEN) and a deeper LABEL (GREEN_DEEP) because the cream ground let
// the rule clear 1.4.11 at 3.91:1; on honey-tan neither step cleared the boundary
// floor, so rule and label collapsed onto one DARK tone. On cedar a dark chip is
// invisible — the old SHAFT_GREEN measures 1.36:1 on SHAFT_BODY — so the collapsed
// step flips register with everything else and becomes a PALE retone. These are the
// most saturated tints that still clear 4.5:1 on the chip's OWN lightest ground
// (cylinderToneAt(10/38) = rgb(141,80,49)): 4.63:1 each. The status hue is
// preserved through all three moves; only its brightness follows the ground.
// ⚠️ THE NAMES CHANGED WITH THE TONES on purpose. SHAFT_GREEN/SHAFT_SLATE named a
// DARK green and a DARK slate; keeping those names on pale tints is how a palette
// starts lying about itself.
export const SHAFT_SAGE = '#D2E2C0';
export const SHAFT_STEEL = '#CFDFEA';

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
 * ⚠️⚠️ V4 MOVED THE WHOLE LADDER DOWN A REGISTER, ON THE OWNER'S CORRECTION: the
 * feather base is the BOTTOM-BORDER DARK INK FAMILY. That is not a mood — it is what
 * makes the fletching read as the SAME OBJECT as the page's own ink furniture rather
 * than as a grey applique on red wood. It also costs the vane its old 4.46:1 boundary
 * against the barrel, which is a real trade and is re-scoped explicitly (see below,
 * and tests/design/contrast.test.js's identification block).
 *
 * MEASURED (tests/design/contrast.test.js):
 *   PARCH_100 on FLETCH_SHEEN_LIFT .... 6.60:1  the label register's FLOOR    AA ✓
 *   PARCH     on FLETCH_SHEEN_LIFT .... 7.27:1  the active label on it        AA ✓
 *   PARCH_100 on FLETCH_SHEEN ......... 7.86:1  resting label, resting sheen  AA ✓
 *   PARCH_100 on FLETCH_LEAD .......... 8.92:1  on the paler leading edge     AA ✓
 *   PARCH_100 on FLETCH_VANE ......... 11.50:1  on the vane body              AA ✓
 *   PARCH_100 on FLETCH_BARB ......... 11.82:1  on a barb striation           AA ✓
 *
 * ⚠️⚠️ THE VANE-vs-WOOD BOUNDARY IS RE-SCOPED, NOT QUIETLY DROPPED. FLETCH_VANE on
 * SHAFT_BODY is 1.73:1, under SC 1.4.11's 3:1, and no honest retune fixes it: the
 * directive puts a dark feather on dark wood, and any tone that opened that gap would
 * either drag the vane up into the parchment register's way or drag the wood up into
 * the dead band. So the CLAIM MOVES TO WHAT ACTUALLY IDENTIFIES A FLETCH:
 *
 *   1. THE LABEL. Each cell carries its own name at 6.60:1 or better — a component
 *      whose name is legible on it is identified by the strongest means WCAG knows.
 *   2. THE INDICATOR. The active lane is marked by the GILT_LIGHT quill line at
 *      3.34:1 on the sheen zone, which is the state channel and does clear 3:1.
 *   3. THE SILHOUETTE, which survives as SHAPE rather than as tone: the sheen bands,
 *      the hang (the lower half of every vane sits on the ~11:1 parchment page, not
 *      on wood at all), and the leading edge-light.
 *
 * That is the scoping decision, made in the open, with the number quoted rather than
 * buried — and it is the reason the indicator had to leave the house GOLD family.
 */
export const FLETCH_LEAD = '#453D31';
export const FLETCH_VANE = '#332C22';
export const FLETCH_TIP = '#211C15';
export const FLETCH_BARB = '#312A20';
export const FLETCH_SHEEN = '#4E4537';
export const FLETCH_SHEEN_LIFT = '#5A5040';
export const FLETCH_RACHIS = '#5A5040';
/**
 * FLETCH_SPLIT_LIT — the lit lip of a barb split, and it is THE ONE TONE ON THIS BAND
 * THAT BREAKS THE LABEL FLOOR.
 *
 * A real split in a feather's vane shows two things: a dark seam where the barbs have
 * parted, and a bright lip where the light catches the raised edge of one of them. The
 * seam is FLETCH_TIP, already the darkest rung of the ladder and free. The LIP is not:
 * at L 0.0985 it is LIGHTER than FLETCH_SHEEN_LIFT (L 0.0796), which is the tone the
 * whole parchment register's 6.60:1 floor is quoted against.
 *
 * ⚠️⚠️ SO IT IS THE ONLY MARK ON THIS BAND CONFINED BY GEOMETRY RATHER THAN BY TONE.
 * It may never be painted inside a label's CALM ZONE, and the pin asserts the exclusion
 * on the authored paths rather than trusting the placement code — because the failure it
 * prevents is invisible: a split hairline crossing a letterform lifts that letterform's
 * ground by a fraction of a percent of area, which no screenshot shows and no ratio
 * quoted against SHEEN_LIFT would catch. It is also RETINA-ONLY (0.4px at low opacity,
 * under 2% effective ink), so at 1x it integrates into the vane as tone.
 */
export const FLETCH_SPLIT_LIT = '#6A5F4E';
// The seam where two fletches overlap: a quill SHADOW, not a gilt hairline. It is
// 1.23:1 against the vane and that is exactly right — feather-on-feather shadows are
// nearly tonal. ⚠️ It is the TIP tone by construction, so the two can never drift.
export const FLETCH_SEAM = FLETCH_TIP;

// THE WRAPS — two narrow OXBLOOD silk thread bands riding the shaft, framing the
// fletching cluster: the whipping from the reference photo. WRAP is the thread,
// WRAP_GLOSS its satin crest, WRAP_EDGE the shadowed inter-turn valley.
// ⚠️⚠️ THEY DEEPENED TO OXBLOOD BECAUSE THE WOOD IS NOW THE SAME HUE. On honey wood a
// mid red-brown was a third of the way to the label register and read as a binding at
// 3.16:1. On cedar the same tone would be a slightly-different-red smudge on red, so
// the wrap goes DEEPER instead of brighter — WRAP is 1.69:1 against SHAFT_BODY and
// WRAP_EDGE 2.22:1, and the binding is identified by its own WOUND STRUCTURE (a
// 2.6px turn period whose crest-to-valley ladder is 2.12:1) rather than by a single
// flat step against the wood. That is what a thread lying on a same-hue shaft really
// looks like, and it is a legitimate scoping: the wrap carries no state, no label
// rides it, and nothing about reaching Create depends on perceiving it. Recorded and
// pinned as a measured relationship, never as a 3:1 claim it cannot make.
export const WRAP = '#521F12';
export const WRAP_GLOSS = '#7E3A24';
export const WRAP_EDGE = '#2E0F08';

/**
 * ⚠️⚠️ THE WHIPPING'S TURN PERIOD, AND THE LADDER IT REALLY RENDERS — spec part 2 §3,
 * and the claim above it was FALSE IN THE SHIPPED PIXELS until this token existed.
 *
 * The note above says the binding is identified "by its own WOUND STRUCTURE (a 2.6px
 * turn period whose crest-to-valley ladder is 2.12:1)". Measured on the real Chrome
 * raster at device-pixel resolution, both halves were wrong:
 *
 *   PERIOD    2.0px, not 2.6 — at 1x that renders as one lit pixel alternating with one
 *             dark one, the whole width of the wrap. A barcode, not silk.
 *   LADDER    1.316:1, not 2.12 — the "crest" was #521F12, the thread's BODY tone. The
 *             satin crest WRAP_GLOSS did not appear anywhere below the top 9% of the
 *             bar, because the turns were painted OVER the barrel gradient and the
 *             turns' only opaque tone was the inter-turn shadow. 2.12:1 is the ladder
 *             of the AUTHORED HEXES, and no reader ever saw it.
 *
 * ⚠️ SO THE TURNS BECOME THE OPAQUE LAYER AND THE BARREL BECOMES A MODULATOR. The turn
 * gradient now carries all three tones — shadow, crest, body — and this is the barrel's
 * shading multiplied over it, so "both cylinders share the light" (spec §3) is what the
 * compositor actually does rather than what two colour ramps agree to imply.
 *
 * ⚠️⚠️ AND IT IS NEUTRAL GREY ON PURPOSE, WHICH IS THE WHOLE OF R5's LESSON. The
 * obvious spelling is a second oxblood ramp multiplied over the first — and multiply is
 * a product, so oxblood × oxblood is near-black: #521F12 × #2E0F08 lands at rgb(15,2,1),
 * which crushes the wound structure to nothing at the bottom of the bar. That is exactly
 * the failure the counsel measured. A LUMINANCE modulator applies the cylinder's light
 * and leaves the hue alone, so the crest stays a crest at every depth.
 *
 * The stops are SHAFT_STOPS', so the thread is lit by the barrel's own light: no
 * darkening at all through the sheen zone, then the same accelerating falloff into the
 * silhouette. ⚠️ THE GREYS LIVE HERE rather than in ShaftWrap because this is a token
 * DEFINITION file (exempt from no-raw-color) and because the argument they encode —
 * "one light, and the wrap borrows the shaft's" — belongs beside SHAFT_STOPS.
 */
export const WRAP_BARREL =
  `linear-gradient(180deg, #FFFFFF 0%, #FFFFFF ${SHAFT_STOPS.lit * 100}%,`
  + ` #E2E2E2 ${SHAFT_STOPS.mid * 100}%, #B4B4B4 ${SHAFT_STOPS.body * 100}%,`
  + ` #8E8E8E ${SHAFT_STOPS.edge * 100}%, #6E6E6E 100%)`;

/**
 * THE TURN PERIOD IN CSS PIXELS, and it is a MEASUREMENT of the object rather than a
 * pleasing number. Spec part 2 §3: at this bar the shaft reads about 9.5mm across, and
 * the silk used to whip a war arrow lays about 2.6px per turn at that scale — four turns
 * per 10px wrap. ⚠️ IT IS px AND NOT A SHARE OF THE WRAP, because a thread's diameter is
 * a physical width: a wrap that grew wider would carry MORE turns, never fatter ones.
 */
export const WRAP_TURN = Object.freeze({
  period: 2.6, shadow: 0.4, gloss: 1.0, body: 1.2,
});

// FLETCH_SHADOW — the soft drop shadow that seats a feather on the wood. Authored as
// an 8-DIGIT HEX rather than the translucent-colour function on purpose: that
// function's occurrences are a burn-down ratchet trending to zero
// (tests/design/deepCraftKillList.test.js counts them), and a decoration has no
// business spending a row of a worklist. Alpha 0x59 ≈ 35% of a near-black brown:
// enough to lift the vane off the barrel, far too little to read as a second edge.
export const FLETCH_SHADOW = '#2A251E59';

/**
 * ── THE GILDED WORDMARK + THE GILDED SEAL (owner directive, ribbon V4) ──
 *
 * ⚠️⚠️ THE PLATE RETIRED, AND THE WORDMARK ITSELF BECAME THE MOUNTED ARTIFACT.
 * The owner's V4 correction, in his own words: the WORDMARK is the gilded object, with
 * no plate. Two things forced it and both are arithmetic rather than taste:
 *
 *   1. THE PLATE COULD NOT SURVIVE THE GROUND. The plate's whole legibility structure
 *      was a PALE METAL DEVICE on a MID-TONE BRONZE FACE (the rule of tincture, as
 *      code), separated from the wood by a near-black keyline. On cedar that keyline
 *      measures 2.86:1 against the lightest ground it touches — under 1.4.11's 3:1 —
 *      and the bronze face sits squarely in the mid-russet DEAD BAND. A dark object on
 *      dark wood behind a dark keyline is not a plate, it is a smudge.
 *   2. TWO OBJECTS WERE ALWAYS ONE TOO MANY. A plate BESIDE a name is two marks
 *      competing at 26px; a gilded name is one.
 *
 * So the plate's tokens are gone — deleted, not deprecated, with their consumer
 * removed in the same commit. THE DEVICE ITSELF SURVIVES: it is the favicon, the PDF
 * seal, the footer and the error boundary (components/brand/HouseDevice.jsx), which is
 * where a house device belongs. PLATE_KEYLINE is the ONE token kept, because the
 * gilded letterform still owes a keyline and re-authoring the same near-black under a
 * new name would be a second spelling of one tone.
 *
 * ⚠️⚠️ THE THREE LAYERS, AND WHY THERE ARE EXACTLY THREE.
 *
 *   1. THE BOLE BED. Armenian bole — the dark red-brown clay a gilder lays under gold
 *      leaf — as a scorched, branded-in patch of shaft behind the whole wordmark run.
 *      IT IS NOT DECORATION: it is the gilding's CONTRAST BED, and without it there is
 *      no gold at all. The bar's lit sheen tops out at L 0.1467, and NO gold a reader
 *      would call gold clears 4.5:1 on that (the house GOLD manages 2.23:1). On BOLE
 *      at L 0.0168 the leaf measures 7.50:1. The bed is what buys the metal.
 *   2. THE LEAF. Gold-FILLED letters: the FILL carries 100% of the contrast, and every
 *      stop of its gradient is at or above L 0.44 so the claim holds at every point of
 *      every glyph. Modelling lives in the keyline and the bed, NEVER in a dark gold
 *      stop — a shaded gold is how a gilded letter quietly loses its floor mid-stroke.
 *   3. THE KEYLINE. A 0.75px near-black outline per glyph, painted OUTSIDE the fill
 *      (paint-order), character only, zero contrast claim. NO bevel and NO emboss: at
 *      a 20px x-height a bevel is one grey pixel pretending to be a light source.
 *
 * ⚠️ THE SEAL BECAME A GILDED LETTER WHOSE BOWL HOLDS THE WAX, AND IT HAD TO. Bare wax
 * on cedar is 1.40:1 — a red letterform on red wood, invisible, and it stands in for a
 * glyph so it owes TEXT contrast. The `o`'s STROKE is now a gold annulus off this same
 * ladder, SEAL_WAX fills between the ring and the counter (5.34:1 against the ring),
 * and the counter stays a TRUE HOLE showing the bole through it (7.50:1 against the
 * ring). Three separated tones, all by luminance, none by hue.
 * ⚠️⚠️ IT IS THE LANE'S OWNER-VETO CANDIDATE: it is a real semantic shift (the seal
 * becomes a gilded letter rather than a blob of wax), and the named fallback if the
 * owner vetoes it is WAX ON A GOLD FOIL ROSETTE — the wax kept whole and a gold foil
 * disc set behind it. Recorded in the queue row, not decided here.
 *
 * ONE LIGHT, ONE AZIMUTH. Every relief on this bar — the bole's cast, the seal's
 * glint, the band's shadows — is lit from PLATE_LIGHT_DEG, and so is the barrel it is
 * mounted on. Two light directions in one composition is the single fastest way to
 * make a set of carefully-rendered materials look like stickers.
 */
export const PLATE_KEYLINE = '#241B0C';

/**
 * THE GILT LADDER — ONE GOLD FAMILY FOR THE GILDING AND FOR THE INDICATOR, and that
 * unification is a finding rather than a tidy-up.
 *
 * The house GOLD (#C9A24C) measures 2.23:1 against the barrel's sheen zone, so it
 * cannot carry the active-lane indicator on cedar; and a second gold invented for the
 * indicator alone would put two metals in one 38px composition. GILT_LIGHT clears 3:1
 * there (3.34:1) and is the leaf's own light stop, so the bar has exactly one metal.
 *
 * ⚠️ EVERY STOP IS AT OR ABOVE L 0.44, AND THAT IS THE WHOLE FILL CLAIM. GILT is
 * L 0.4509 and GILT_LIGHT L 0.6068. A third, darker stop "for modelling" would put a
 * sub-floor tone inside a letterform, which is exactly the failure a gradient fill
 * invites; the modelling is the keyline's and the bed's job.
 * ⚠️ GILT_LIGHT ALSO CLEARS L 0.58, which is the separate floor the INDICATOR owes:
 * it is drawn on the shaft's sheen zone, not on the bole, and that is a much lighter
 * ground than any letterform touches.
 */
export const GILT = '#D4AF45';
export const GILT_LIGHT = '#E6CB6F';

/**
 * THE BOLE — the gilding's bed, and the seal's.
 *
 * BOLE is the opaque core; BOLE_DEEP is the scorch at its edge, where the brand bit
 * deepest. ⚠️ BOTH ARE AT OR BELOW L 0.06, which is the pinned law: the core is the
 * ground every gilt claim in this file is quoted against, so a future retune that
 * lightened it would move every one of those ratios at once, invisibly.
 * BOLE_PAD is how far the opaque core must extend past the wordmark's MEASURED ink
 * extents (HEADER_RIDERS.wordmark) — 3px, so no glyph edge, and no antialiased pixel
 * of one, ever lands on bare wood.
 */
export const BOLE = '#3A1A10';
export const BOLE_DEEP = '#2A1008';
export const BOLE_PAD = 3;

/**
 * GILD — the gilded wordmark's GEOMETRY, in px of the bar it is mounted on.
 *
 * `pad` is BOLE_PAD restated in this object so a reader building the bed has one place
 * to look; `keyline` is the near-black outline's width; `seed` is the bole's
 * turbulence seed and `edgeAmp` how far that turbulence may displace the bed's EDGE.
 *
 * ⚠️ `edgeAmp` DISPLACES THE EDGE AND NOTHING ELSE, and that is what keeps the AA
 * claim geometric rather than hopeful — the same move SHAFT_STOPS made for the barrel.
 * The bed's OPAQUE CORE is the rectangle the wordmark's ink extents plus `pad` define;
 * the turbulence only ever eats outward from that core, so no displacement, at any
 * amplitude, can uncover a glyph. A filter that displaced the whole shape would put
 * bare cedar under a letter at some seed, and no screenshot would show which one.
 *
 * ⚠️ `seed` IS VETTED against SVG's own feTurbulence PRNG — see isDegenerateSeed in
 * components/brand/GildedWordmark.jsx, which re-runs the spec's lattice construction
 * rather than carrying a blocklist that rots.
 */
export const GILD = Object.freeze({
  pad: BOLE_PAD, keyline: 0.75, seed: 17, edgeAmp: 5,
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
 * ⚠️ WHAT IS DERIVED AND WHAT IS NOT. Every OFFSET — the bole bed's cast shadow and
 * its lit edge, the seal's glint arc, the band's cast shadow and its edge-light —
 * reads this constant, so moving it moves the whole composition together and a wrong
 * sign is a red rather than a screenshot. GRADIENT VECTORS are deliberately NOT
 * derived: a 45° screen direction is not a 45° objectBoundingBox vector unless the box
 * is square, so deriving them means carrying each element's aspect ratio into its own
 * gradient and is a larger change than this lane is scoped for. The three that exist
 * (the leaf's fall, the vane's fall, the barrel's cylinder) already agree with this
 * azimuth qualitatively; converting them to derived vectors is deliberately deferred —
 * documented, not a bug to re-find.
 *
 * ⚠️ THE PLATE'S NAME SURVIVES THE PLATE. This token is called PLATE_LIGHT_DEG because
 * it was born with the maker's plate, and the plate retired in V4. Renaming it would
 * touch every consumer for nothing and break the one property that matters — that
 * there is exactly ONE of it — so the name is kept and the reason is written down
 * rather than left as an oddity for the next reader to "fix".
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
 * tests/design/brandLockup.test.jsx forbids `Math.sin|cos|tan|exp|log|pow` in every
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
 * the `o` of "Forge" inside the wordmark, so it owes TEXT contrast — and on the V3
 * honey barrel it carried that claim itself, at 4.80:1, which is why it was authored
 * this deep in the first place.
 *
 * ⚠️⚠️ ON CEDAR IT CANNOT CARRY THAT CLAIM AT ALL, AND THAT IS WHY THE `o` IS GILDED.
 * A deep red letterform on dark red wood measures 1.40:1 — the reddest possible way to
 * be invisible. The tone does NOT get lightened to fix it: a bright sealing wax is not
 * sealing wax, and lightening it would walk the one saturated hue in the lockup toward
 * the dead band. Instead the `o`'s STROKE becomes a gold annulus off the GILT ladder
 * and the wax fills between that ring and the counter, where it measures 5.34:1
 * against the ring. The wax keeps its colour and its meaning and stops being asked to
 * do a job its colour forbids.
 *
 * ⚠️⚠️ THE IMPRESSION IS THE COUNTER, AND THE COUNTER IS STILL A TRUE HOLE. The `o`'s
 * bowl is not painted a darker red — it is genuinely open, so the BOLE shows through
 * it at 7.50:1 against the gold ring. That is what makes the seal survive being
 * shrunk: at 16px it is a gold annulus with a wax fill and a dimple, and at every size
 * all three separations are LUMINANCE steps rather than hue steps, which is what the
 * grayscale test asks for. A darker-red counter measured 1.39:1 against the wax and
 * merged into a blob by 20px.
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
 * label's own height, which displaces the band's two outer quill-line corners from its
 * box by about `|lean(headerDesktop / 2)|` px. The wrap is wide enough to bind that
 * corner, which is what a whipping does. Narrower and the feather's tip would stick out
 * past its own binding.
 * ⚠️⚠️ SINCE THE V4 MIRROR THE WRAP MUST ALSO BE *PLACED* ON THAT CORNER, and this is
 * the note that says so because the width alone no longer gets there. While the band's
 * two outer ends were SQUARE (the retired FRAME clip), "flush against the box" and
 * "flush against the feather" were the same place; the directive makes both ends slashes
 * and the two places move `|SEAT|` apart in OPPOSITE directions — the lead corner falls
 * inside the box and the trail corner outside it. ShaftWrap.jsx derives that offset from
 * the band's own seat; nothing here may re-spell it.
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
