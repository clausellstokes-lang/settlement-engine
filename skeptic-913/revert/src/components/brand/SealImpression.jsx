/**
 * SealImpression.jsx — THE HOUSE DEVICE, PRESSED INTO THE WAX (owner-confirmed
 * 2026-08-04, ribbon V4.1 / task #105's seal clarification).
 *
 * The owner's clarification: "the o-in-Forge seal INTEGRATES THE SITE DEVICE (the
 * house/gable logo) as its wax impression, on the size ladder — tonal dimple at ribbon
 * ~16px, full impressed device at >=28px contexts, device alone as favicon". This
 * module is the middle rung. theme.js's SEAL_LADDER owns the threshold and
 * `sealRegister` is its single writer; WaxSeal decides nothing about it.
 *
 * ⚠️⚠️ IT IS ITS OWN MODULE, AND THAT IS A PIN'S DOING RATHER THAN A PREFERENCE.
 * tests/design/organicLogo.test.js censuses every module in components/brand that
 * inlines the canonical device geometry, and it uses WaxSeal.jsx as its NEGATIVE
 * CONTROL — "a sibling brand module with its own geometry and none of the device's" —
 * which is the one assertion proving that census can fail at all. Inlining the device
 * into WaxSeal would have destroyed that control while every other pin stayed green.
 * So the impression lives here, this file joins the declared inliner set, and WaxSeal
 * stays clean by construction.
 *
 * ⚠️⚠️ AN IMPRESSION IS A DEBOSS, NOT A DRAWING, AND THE DIFFERENCE IS THE WHOLE MARK.
 * A seal matrix presses INTO wax: the struck lines sit BELOW the surface, so what the
 * eye reads is a shadow on the far side of each line and a lit lip on the side facing
 * the light. Both are near-tonal to the wax — a bright drawn logo inside a letterform
 * is exactly the "bright mini-logo" the owner's clarification forbids, and at any size
 * it would put a second metal in a lockup that spends exactly one.
 *
 *   THE SHADOW   SEAL_RIM, offset AWAY from PLATE_LIGHT_DEG — the far wall of the
 *                struck groove. It is the heavier of the two.
 *   THE LIP      SEAL_GLINT, offset TOWARD the light — the raised edge the matrix
 *                pushed up. A whisper, at half the shadow's weight.
 *
 * Neither carries any contrast claim. The `o`'s legibility is, as it has been since V4,
 * the gold ring against the bole showing through the counter — three luminance steps
 * that this module does not touch.
 *
 * ⚠️ THE GEOMETRY IS THE CANONICAL DEVICE, BYTE-FOR-BYTE. The paths are inlined rather
 * than imported because this renders inside the EAGER header shell and the canonical
 * builders (src/design/organic/logo.js) are lazy; organicLogo.test.js pins these bytes
 * equal to that module's, so the two can never drift.
 */
import { PLATE_LIGHT_DEG, SEAL_GLINT, SEAL_RIM, lightOffset, shadowOffset } from '../theme.js';

/** The device's own 64-unit box, and the seal's 100-unit one. */
const DEV = 64;

/**
 * WHERE THE IMPRESSION SITS INSIDE THE SEAL, in the seal's own units.
 *
 * ⚠️ IT IS INSET INTO THE COUNTER, NOT LAID OVER THE WHOLE BLOB. The wax annulus
 * between the gold ring and the counter is nine units wide — no device fits in it — and
 * a device drawn over the ring would be struck across the letter's own stroke. The bowl
 * is where a matrix lands, so the impression is scaled into the counter's box (27..73
 * in both axes) with a hair of clearance so no struck line touches the counter's rim.
 *
 * ⚠️⚠️ AND THE COUNTER STAYS A HOLE. The struck lines are strokes, not a fill: the bole
 * still shows through everywhere between them, so the `o` is still an `o` with an open
 * bowl and the 7.50:1 counter-versus-ring separation the grayscale test asserts is
 * untouched. A filled device would have turned the letter into a `0`.
 */
const INSET = Object.freeze({ x: 29.5, y: 28.5, span: 41 });
const SCALE = INSET.span / DEV;

/** How far a struck line's shadow and lip stand off, in seal units. */
const RELIEF = 1.6;

/**
 * The canonical device, byte-for-byte from src/design/organic/logo.js.
 * ⚠️ DO NOT REFORMAT THESE STRINGS. organicLogo.test.js asserts this file CONTAINS
 * them character for character, which is what keeps the eager copy and the lazy
 * canonical one one mark.
 */
const RING = 'M 7 44 A 27.15 26.85 0 1 1 57 44';
const SKYLINE = 'M 7 44.1 Q 13.5 43.75 20 43.95 L 25.1 36.9 L 29.9 44.05 Q 32 43.9 34 44 L 40.1 34.85 L 45.9 44.1 Q 51.5 43.8 57 44';
const TRIANGLE = 'M 31.9 15.2 L 41.05 30.9 Q 32 31.35 23.05 31.1 Z';
const DOT_R = 4.2;

/**
 * The struck lines' weights, in the DEVICE's units — the heavy redraw, because the
 * impression is always drawn small and the heavy weight is the small-size redraw.
 */
const W = Object.freeze({ ring: 6.1, skyline: 5.85, triangle: 4.95 });

const SHADOW = shadowOffset(RELIEF / SCALE);
const LIP = lightOffset(RELIEF / SCALE);

/**
 * One pass of the device — used twice, offset two ways, which is what makes it a
 * groove rather than an outline.
 * @param {string} stroke the tone
 * @param {number} opacity how strongly this wall of the groove reads
 * @param {number} weight a multiplier on the canonical stroke weights
 * @param {{dx: number, dy: number}} off the offset, in device units
 * @param {string} testid
 */
function Pass({ stroke, opacity, weight, off, testid }) {
  return (
    <g
      data-testid={testid}
      transform={`translate(${off.dx} ${off.dy})`}
      fill="none"
      stroke={stroke}
      strokeOpacity={opacity}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={RING} strokeWidth={W.ring * weight} />
      <path d={SKYLINE} strokeWidth={W.skyline * weight} />
      <path d={TRIANGLE} strokeWidth={W.triangle * weight} />
      <circle cx="32" cy="25.7" r={DOT_R} fill={stroke} fillOpacity={opacity} stroke="none" />
    </g>
  );
}

/**
 * The device, struck into the seal's bowl.
 * ⚠️ THE LIP IS PAINTED FIRST AND THE SHADOW OVER IT. In a real impression the far wall
 * is what you see most of; painting the lit lip last would make the mark read as an
 * embossed sticker sitting proud of the wax, which is the inverse of a seal.
 */
export default function SealImpression() {
  return (
    <g
      data-testid="seal-impression"
      transform={`translate(${INSET.x} ${INSET.y}) scale(${SCALE.toFixed(4)})`}
    >
      <Pass stroke={SEAL_GLINT} opacity={0.5} weight={0.7} off={LIP} testid="seal-impression-lip" />
      <Pass stroke={SEAL_RIM} opacity={0.9} weight={1} off={SHADOW} testid="seal-impression-shadow" />
    </g>
  );
}

export { DEV, INSET, RELIEF, SCALE, W, PLATE_LIGHT_DEG };
