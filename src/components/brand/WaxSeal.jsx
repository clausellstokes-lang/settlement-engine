/**
 * WaxSeal.jsx — THE `o` OF "FORGE", AS A BLOB OF SEALING WAX.
 *
 * Owner task #78. The wordmark stays type; exactly one glyph is replaced. That is the
 * whole idea and it is why it works: a lockup where the mark is a picture BESIDE the
 * name is two objects, and a lockup where the name is a picture is not a name. One
 * letter turned to wax makes the word itself the object, and it says the one thing
 * the brand wants said at the door — this is sealed, it is a record, it is finished.
 *
 * ⚠️⚠️ THE IMPRESSION IS THE COUNTER, AND THE COUNTER IS A REAL HOLE.
 * The `o`'s bowl is not painted a darker red — it is genuinely open, so whatever the
 * seal rides shows through it. Three things follow, and all three are the reason:
 *
 *   1. IT SURVIVES BEING SHRUNK. At 16px the seal is an annulus with a dimple, which
 *      is exactly what a struck seal looks like at 16px. A darker-red bowl measured
 *      1.39:1 against the wax and merged into a featureless blob by about 20px.
 *   2. IT PASSES THE GRAYSCALE TEST. The counter is separated from its neighbour by a
 *      LUMINANCE step, never by hue, so the letter still reads as an `o` in
 *      monochrome, in forced colours, and to a reader with any colour vision
 *      deficiency.
 *   3. THE WORD STAYS A WORD. An `o` whose counter is filled is a `0`, or a bullet.
 *
 * ⚠️⚠️ AND IN V4 THE `o` BECAME A GILDED LETTER WHOSE BOWL HOLDS THE WAX. That is a
 * REAL SEMANTIC SHIFT and it is forced, not preferred. SEAL_WAX is deep because this
 * is a letterform rather than an ornament — it stands in for a glyph, so it owes TEXT
 * contrast, 4.5:1, not the 3:1 a decorative graphic would owe. On the V3 honey barrel
 * it carried that itself at 4.80:1. On the V4 cedar shaft a deep red letterform on
 * dark red wood measures 1.40:1: the reddest possible way to be invisible. Lightening
 * the wax is not available — a bright sealing wax is not sealing wax, and it would
 * walk the lockup's one saturated hue toward theme.js's mid-russet dead band. So:
 *
 *   THE RING   the `o`'s STROKE is a gold annulus off the GILT ladder, and it is what
 *              carries the letterform's contrast (7.50:1 on the bole bed behind it).
 *   THE WAX    fills between the ring's inner edge and the counter — 5.34:1 against
 *              the ring, which is where the seal still reads as a blob of wax pressed
 *              into a letter rather than as a coloured outline.
 *   THE COUNTER stays a TRUE HOLE, showing the bole through it at 7.50:1 against the
 *              ring. Three tones, three luminance steps, no hue doing any work.
 *
 * ⚠️ IT IS THE V4 LANE'S OWNER-VETO CANDIDATE, recorded as such in the queue row. The
 * named fallback if the owner prefers the wax whole is WAX ON A GOLD FOIL ROSETTE: the
 * blob unchanged, with a gold foil disc set behind it to carry the contrast. That
 * fallback is a strictly larger mark at the same x-height, which is why it is the
 * fallback and not the first cut.
 *
 * ⚠️ CHROMA IS RATIONED, AND THIS SPENDS THE RATION. Red is the ONE saturated hue in
 * the lockup and it means "sealed". It is deliberately the same family as the silk
 * WRAPs that bind the fletching, a step deeper, so the bar reads as one object with
 * two red moments rather than as two unrelated accents. Nothing else on this bar may
 * take a saturated colour without giving this one up.
 *
 * ACCESSIBILITY. The seal is `aria-hidden`, and so is the whole wordmark `h1` it sits
 * in — the accessible name comes from the home button's own `aria-label`, the plain
 * string "SettlementForge". That was already the arrangement before the seal existed,
 * and it is why one glyph can become a graphic without costing anything: assistive
 * technology never read those spans. Every TYPED context (the tab title, the og
 * caption, the PDF byline) uses the same plain string. The mark is never allowed to
 * become the way the product's name is spelled.
 */
import { GILT, GILT_LIGHT, SEAL_GLINT, SEAL_RIM, SEAL_WAX, lightArc } from '../theme.js';

/** The seal's own space. The wax's outer edge is deliberately not a perfect circle. */
const S = 100;

/**
 * THE RING'S WIDTH, as a fraction of the seal's box — the `o`'s stroke weight.
 *
 * ⚠️ IT IS A FRACTION, NOT A STROKE WIDTH, because the ring is drawn as the AREA
 * between two closed paths rather than as a stroke. A stroke would be centred on the
 * blob's own irregular outline and would inherit its wobble on BOTH sides, which reads
 * as a shaky rule; an area between the blob and a scaled copy of it keeps the outer
 * edge irregular (wax) and the inner edge calm (a struck letter).
 */
const RING = 0.14;

/**
 * ⚠️ THE GLINT IS AIMED BY PLATE_LIGHT_DEG — the seal's half of the verifier's F3
 * ("PLATE_LIGHT_DEG IS A DEAD TOKEN... No code computes from it").
 *
 * The arc used to be four hand-authored coordinates that HAPPENED to sit on the upper
 * left, and that is precisely the failure the finding is about: a composition whose
 * one-light claim is carried by four separate people's memory of where the light was.
 * It is now an arc centred on the light's OWN bearing, so moving the azimuth swings
 * the highlight around the wax instead of leaving it stranded on the wrong side.
 *
 * ⚠️ THE TRIG LIVES IN theme.js, NOT HERE, and that is a pinned law rather than a
 * preference: tests/design/makerPlate.test.jsx forbids transcendentals in every brand
 * module because engines differ in the last ulp and this mark must be byte-identical
 * everywhere, forever. `lightArc` computes once, beside the constant, and rounds.
 */
const GLINT = lightArc(S / 2, S / 2, 35, 32);

/**
 * THE WAX'S OUTER EDGE — a circle a hand pressed. The four control points are pulled
 * by different amounts, so the blob is round at a glance and irregular on inspection,
 * which is what wax does and what a drawn circle never does. Authored as constants,
 * not jittered: the mark must be byte-identical everywhere, forever.
 */
const BLOB = 'M 50 4 C 74 4, 96 22, 96 48 C 96 74, 76 97, 49 97'
  + ' C 24 97, 3 76, 4 50 C 5 25, 26 4, 50 4 Z';

/**
 * THE COUNTER — the `o`'s bowl, struck through the wax. Slightly off-centre and
 * slightly out-of-round for the same reason the blob is.
 */
const COUNTER = 'M 50 26 C 63 26, 73 37, 73 50 C 73 63, 63 74, 50 74'
  + ' C 37 74, 27 63, 27 50 C 27 37, 37 26, 50 26 Z';

/**
 * THE COUNTER AGAIN, PRE-DIVIDED BY THE WAX LAYER'S OWN TRANSFORM — so the hole the
 * wax leaves lands exactly on the hole the ring leaves.
 *
 * ⚠️ IT IS COMPUTED, NOT AUTHORED TWICE. The wax is drawn inside
 * `translate(t) scale(k)`, so a point p in that group lands at t + k·p; the counter
 * must therefore be authored at (COUNTER − t) / k to come out in the same absolute
 * place as the ring's counter. Hand-authoring a second near-identical path is how two
 * copies of one shape drift by a pixel and the `o` grows a red crescent that nobody
 * can attribute. The transform is uniform in x and y, so ONE substitution over every
 * number in the path is exactly right — and it is plain arithmetic, so the byte-
 * identity law (no transcendentals in a brand module) is untouched.
 */
const preDivide = (d, k, t) => d.replace(
  /-?\d+(?:\.\d+)?/g,
  (n) => String(Number(((Number(n) - t) / k).toFixed(3))),
);
const INNER_COUNTER = preDivide(COUNTER, 1 - RING, (S / 2) * RING);

/**
 * The wax seal that stands in for one `o`.
 *
 * @param {Object} props
 * @param {string} [props.size='0.66em'] the seal's box, in the wordmark's own em so it
 *   tracks the type at every breakpoint rather than being re-tuned per header.
 *   ⚠️ SIZED AGAINST THE X-HEIGHT, NOT THE EM. This serif's x-height is about 0.47em,
 *   so 0.66em makes the wax about 1.4x the height of the letters beside it — a blob
 *   pressed onto the line, which is what wax is, rather than a glyph that happens to
 *   be round. The first cut at 0.78em rose to cap height and read as a mis-set letter
 *   in the wrong point size.
 * @param {React.CSSProperties} [props.style]
 */
export default function WaxSeal({ size = '0.66em', style }) {
  return (
    <svg
      viewBox={`0 0 ${S} ${S}`}
      width={size}
      height={size}
      aria-hidden="true"
      focusable="false"
      data-testid="wax-seal"
      style={{
        // ⚠️ INLINE-BLOCK ON THE TEXT BASELINE, NOT A FLOATED DECORATION. The seal
        // occupies the `o`'s place in the line box, so the word's spacing, its
        // selection rectangle and its line breaking are the type's, not the SVG's.
        display: 'inline-block',
        verticalAlign: '-0.045em',
        margin: '0 0.015em',
        ...style,
      }}
    >
      {/*
        ⚠️ EVERY LAYER IS EVEN-ODD FILLED AS ONE SHAPE, which is what makes the counter
        a HOLE rather than a disc painted on top. A second path in the barrel's colour
        would be a lie that breaks the moment the seal is used anywhere else — on the
        PDF's cream page, on the favicon's transparent square — and it is precisely
        that kind of baked-in background that the "flat silhouette, tinted per
        context" rule exists to forbid.

        1 — THE RING: the `o`'s stroke, and the layer that carries the letterform's
        contrast. Blob-minus-counter in GILT, so the outer edge is the wax's own
        irregular pressing and the letter still reads as gold at 16px.
      */}
      <path d={`${BLOB} ${COUNTER}`} fillRule="evenodd" fill={GILT} data-testid="wax-seal-ring" />
      {/*
        2 — THE WAX, between the ring's inner edge and the counter. The inner edge is
        the blob scaled about its own centre by (1 − RING), so the ring's width is a
        constant fraction of the seal at every size it is drawn — a stroke would have
        to be re-tuned per size and would wobble on both edges.
      */}
      <g transform={`translate(${(S / 2) * RING} ${(S / 2) * RING}) scale(${1 - RING})`}>
        <path d={`${BLOB} ${INNER_COUNTER}`} fillRule="evenodd" fill={SEAL_WAX} data-testid="wax-seal-body" />
      </g>
      {/*
        3 — THE DIMPLE — the impression's own shadow, a hairline just inside the
        counter's edge. It is what turns a punched hole into something that was
        PRESSED. Like every other relief on this bar it carries no contrast claim: it
        is near-tonal to the wax, and the counter's legibility comes entirely from the
        luminance step between the gold ring and the bole showing through.
      */}
      <path d={COUNTER} fill="none" stroke={SEAL_RIM} strokeWidth="5" data-testid="wax-seal-dimple" />
      {/*
        4 — THE GLINT — one short arc on the side the light comes from (the same light
        the bed and the barrel use). Matte wax, not gloss: an arc at low opacity, never
        a specular dot, which would read as plastic and would put a near-white pixel
        inside a letterform. ⚠️ It rides the WAX, never the ring: a bright arc laid on
        gold is a second metal, and the lockup spends exactly one.
      */}
      <path d={GLINT} fill="none" stroke={SEAL_GLINT} strokeWidth="7" strokeLinecap="round" strokeOpacity="0.75" data-testid="wax-seal-glint" />
      {/*
        5 — THE RING'S OWN LIT EDGE, on the same azimuth: a whisper of the leaf's light
        stop along the outer rim, which is what makes the annulus read as METAL rather
        than as a flat gold outline. Character only; the ring's fill already carries
        the whole claim.
      */}
      <path d={BLOB} fill="none" stroke={GILT_LIGHT} strokeWidth="2" strokeOpacity="0.55" data-testid="wax-seal-rim-light" />
    </svg>
  );
}

export { BLOB, COUNTER, INNER_COUNTER, RING, S };
