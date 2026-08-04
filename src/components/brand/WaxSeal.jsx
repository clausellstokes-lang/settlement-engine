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
 *   2. IT PASSES THE GRAYSCALE TEST. The counter is separated from the wax by a
 *      LUMINANCE step (about 4.8:1 against the barrel behind it), never by hue, so
 *      the letter still reads as an `o` in monochrome, in forced colours, and to a
 *      reader with any colour vision deficiency.
 *   3. THE WORD STAYS A WORD. An `o` whose counter is filled is a `0`, or a bullet.
 *
 * ⚠️⚠️ SEAL_WAX IS DEEP BECAUSE THIS IS A LETTERFORM, NOT AN ORNAMENT. It stands in
 * for a glyph inside the wordmark, so it owes TEXT contrast against the honey-tan
 * barrel it rides — 4.5:1, not the 3:1 a decorative graphic would owe. A mid
 * sealing-wax red measures 3.52:1 on the composited bar and fails. This measures
 * 4.80:1. The word has to be readable before the seal is allowed to be pretty.
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
import { SEAL_GLINT, SEAL_RIM, SEAL_WAX } from '../theme.js';

/** The seal's own space. The wax's outer edge is deliberately not a perfect circle. */
const S = 100;

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
        ⚠️ THE PATHS ARE EVEN-ODD FILLED AS ONE SHAPE, which is what makes the counter
        a HOLE rather than a disc painted on top. A second path in the barrel's colour
        would be a lie that breaks the moment the seal is used anywhere else — on the
        PDF's cream page, on the favicon's transparent square — and it is precisely
        that kind of baked-in background that the "flat silhouette, tinted per
        context" rule exists to forbid.
      */}
      <path d={`${BLOB} ${COUNTER}`} fillRule="evenodd" fill={SEAL_WAX} data-testid="wax-seal-body" />
      {/*
        THE DIMPLE — the impression's own shadow, a hairline just inside the counter's
        edge. It is what turns a punched hole into something that was PRESSED. Like
        every other relief on this bar it carries no contrast claim: it is near-tonal
        to the wax, and the counter's legibility comes entirely from the luminance step
        between the wax and whatever shows through.
      */}
      <path d={COUNTER} fill="none" stroke={SEAL_RIM} strokeWidth="5" data-testid="wax-seal-dimple" />
      {/*
        THE GLINT — one short arc on the side the light comes from (the same light the
        plate and the barrel use). Matte wax, not gloss: an arc at low opacity, never a
        specular dot, which would read as plastic and would put a near-white pixel
        inside a letterform.
      */}
      <path d="M 22 34 C 28 22, 40 14, 52 12" fill="none" stroke={SEAL_GLINT} strokeWidth="7" strokeLinecap="round" strokeOpacity="0.75" data-testid="wax-seal-glint" />
    </svg>
  );
}

export { BLOB, COUNTER, S };
