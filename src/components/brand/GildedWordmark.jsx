/**
 * GildedWordmark.jsx — THE WORDMARK AS THE MOUNTED ARTIFACT (owner directive, ribbon
 * V4). Three layers, in this order and no other: THE BOLE BED, THE LEAF, THE KEYLINE.
 *
 * ⚠️⚠️ THIS MODULE REPLACES THE MAKER'S PLATE, AND THE REPLACEMENT IS FORCED RATHER
 * THAN PREFERRED. The owner's correction is that the WORDMARK ITSELF is the gilded
 * object and there is no plate. The arithmetic agrees twice over:
 *
 *   1. The plate's legibility structure was a pale metal device on a MID-TONE bronze
 *      face behind a near-black keyline. On the V4 cedar shaft that keyline measures
 *      2.86:1 against the lightest ground it touches — under SC 1.4.11's 3:1 — and
 *      the bronze face sits inside the mid-russet DEAD BAND (theme.js). There is no
 *      retune: a dark object on dark wood behind a dark keyline is a smudge.
 *   2. A plate BESIDE a name is two marks competing at 26px. A gilded name is one.
 *
 * The house DEVICE itself is untouched and still ships — favicon, PDF seal, footer,
 * error boundary (components/brand/HouseDevice.jsx). What retired is the PLATE.
 *
 * ⚠️⚠️ WHY THE WORDMARK IS STILL REAL TYPE AND NOT A DRAWING. Every instinct says
 * "gild it" means "draw it", and drawing it would cost four things this lockup cannot
 * spend: the two capitals' 1.32em step would stop tracking the font, the wax seal
 * would stop sitting on the text baseline, the name would stop being selectable and
 * copyable (the SettlementFoOrge incident is recorded in Lockup.jsx), and the bar
 * would gain a second set of metrics to keep in sync with FS.h1. So the gilding is
 * done to LIVE TYPE: the leaf is a gradient clipped to the glyphs, the keyline is a
 * text stroke, and only the BED is drawn.
 *
 * ⚠️⚠️ THE FILL CARRIES 100% OF THE CONTRAST AND THE RELIEF CARRIES 0% — the same law
 * the retired plate ran on, inherited deliberately. Every stop of the leaf gradient is
 * at or above L 0.44, so the claim holds at every point of every glyph rather than on
 * average; the keyline and the glint are CHARACTER ONLY and carry no part of it. A
 * browser that drops them loses texture and no legibility.
 *
 * ⚠️⚠️ AND THE CLIP FAILS SAFE. `background-clip: text` with a transparent fill is the
 * one idiom here that could make a wordmark VANISH rather than degrade, so the colour
 * declared underneath it is GILT — not `transparent`, not `inherit`. An engine that
 * honours neither `-webkit-background-clip` nor `-webkit-text-fill-color` renders a
 * solid GILT wordmark at 7.50:1 on the bole, which is the same claim one stop flatter.
 * The pin asserts the fallback tone is a member of the GILT ladder, because "it will
 * be fine" is exactly how a wordmark ships invisible.
 */
import {
  BOLE, BOLE_DEEP, GILD, GILT, GILT_LIGHT, HEADER_RIDERS, PLATE_KEYLINE, lightOffset,
} from '../theme.js';

/** The bed's own coordinate space. Stretched to the run, so it is a proportion. */
const BW = 200;
const BH = 48;

/**
 * ⚠️ THE SEED IS VETTED, AND THE VETTING IS A DERIVATION — moved here verbatim from
 * the retired MakerPlate, because the reason it existed did not retire with the plate.
 *
 * SVG's feTurbulence is specified down to its PRNG, and that PRNG has DEGENERATE
 * seeds: initial lattices where a gradient vector comes out as exactly (0, 0), which
 * leaves a dead spot in the noise field. Engines then differ on how they handle it,
 * so a degenerate seed is the one thing that turns "deterministic texture" into a
 * cross-engine golden hazard. There are 66 of them below 20,000.
 *
 * The exclusion is therefore not a hardcoded blocklist that rots — it is the spec's
 * OWN lattice construction, re-run here, so ANY seed a future edit picks is checked
 * against the real condition.
 *
 * @param {number} seed the feTurbulence seed to test
 * @returns {boolean} true when the spec's lattice yields a zero gradient vector
 */
export function isDegenerateSeed(seed) {
  const M31 = 2147483647;
  const A = 16807;
  const Q = 127773;
  const RR = 2836;
  let l = seed > 0 ? seed : 1;
  const step = () => {
    const r = A * (l % Q) - RR * Math.floor(l / Q);
    l = r <= 0 ? r + M31 : r;
    return ((l % 512) - 256) / 256;
  };
  for (let k = 0; k < 4; k += 1) {
    for (let i = 0; i < 256; i += 1) {
      const gx = step();
      const gy = step();
      if (gx === 0 && gy === 0) return true;
    }
  }
  return false;
}

/**
 * HOW FAR THE BED MUST REACH PAST THE WORDMARK'S OWN BOX, in px, on each side.
 *
 * ⚠️⚠️ IT IS DERIVED FROM MEASURED INK, NOT FROM THE BOX, AND THAT IS THE WHOLE POINT.
 * The wordmark's laid-out box is 34.84px of a 38px bar, so it spans 1.58..36.42 — but
 * its INK runs 7.58..37.08, overflowing its own box by 0.66px at the bottom (the `g`
 * of "Forge"). A bed inset from the BOX by 3px would therefore fall 0.66px short of
 * the requirement at exactly the one place a descender needs it, and every screenshot
 * would look correct. So the reach is computed from HEADER_RIDERS' ink extents, and
 * the containment pin re-derives the same relationship rather than reading these
 * numbers back.
 *
 * ⚠️⚠️ THE TOP REACH IS NEGATIVE, AND THAT IS THE FIX FOR A REAL DEFECT, NOT A
 * MICRO-OPTIMISATION. The first cut clamped every reach at zero — `Math.max(0, …)` —
 * on the reasoning that a bed covering MORE than it must is still containment. It is,
 * and it looked wrong for a reason the arithmetic could not see: the wordmark's box
 * starts 6px above its own ink, so a clamped bed ran the full height of the bar and
 * read as a hard-edged black PLAQUE. Screenshotted at 250% it was unmistakably a plate
 * — the exact object the owner's V4 correction retires — with a gilded name sitting on
 * it. So the reach is SIGNED: the bed hugs `ink ± pad` on every side and nothing more,
 * which is what a branded-in patch of shaft looks like. Containment is unchanged and
 * still asserted; what changed is that the bed no longer claims territory it does not
 * need, and territory is what made it read as an object rather than as a scorch.
 *
 * @param {{ ink: number[], bar: number, box: number }} [rider] the wordmark's row
 * @param {number} [pad] BOLE_PAD, the opaque core's reach past the ink
 * @returns {{ top: number, right: number, bottom: number, left: number }} px, signed
 */
export function boleReach(rider = HEADER_RIDERS.wordmark, pad = GILD.pad) {
  const boxTop = (rider.bar - rider.box) / 2;
  return Object.freeze({
    top: boxTop - (rider.ink[0] - pad),
    right: pad,
    bottom: (rider.ink[1] + pad) - (boxTop + rider.box),
    left: pad,
  });
}

const REACH = boleReach();

/**
 * HOW FAR THE SCORCH FIELD STARTS OUTSIDE THE CORE, in the bed's own units.
 *
 * ⚠️ TWICE THE AMPLITUDE, AND THE FACTOR IS THE PROOF. The displacement moves each
 * edge pixel by at most `edgeAmp` in either direction, so a field starting 2·edgeAmp
 * out has its nearest possible edge at 1·edgeAmp out — strictly outside the core, at
 * every seed and every amplitude, by construction rather than by inspection.
 */
const SCORCH_OUT = GILD.edgeAmp * 2;

/**
 * THE LEAF + THE KEYLINE, as the style one text run wears.
 *
 * ⚠️ ONE VERTICAL TWO-STOP GRADIENT, AND NO THIRD STOP EVER. The temptation on a
 * gilded letter is a dark stop "for modelling", and it is precisely the failure the
 * fill claim forbids: a sub-floor tone inside a letterform is unmeasurable by any
 * token-vs-token pin and invisible in review. Modelling lives in the KEYLINE and the
 * BED. GILT_LIGHT (L 0.6068) at the top, GILT (L 0.4509) at the foot — both at or
 * above the 0.44 floor, so the claim holds at every scanline of every glyph.
 *
 * ⚠️ THE GLINT IS THE ONE UPPER-LEFT LIGHT, and it is DERIVED from PLATE_LIGHT_DEG
 * rather than hand-placed: a text-shadow pushed TOWARD the light, in the leaf's own
 * light stop, which reads as the lit edge of a raised letter. It is a whisper (0.6px,
 * no blur) — anything heavier and gold-on-gold starts reading as a double strike.
 */
const GLINT = lightOffset(0.6);
export const LEAF = Object.freeze({
  // ⚠️ THE FALLBACK, AND IT IS FIRST ON PURPOSE. If the clip does not take, this is
  // what a reader sees: a solid GILT wordmark at 7.50:1 on the bole.
  color: GILT,
  backgroundImage: `linear-gradient(180deg, ${GILT_LIGHT} 0%, ${GILT} 100%)`,
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  // The keyline: near-black, per glyph, character only. `paint-order` puts it OUTSIDE
  // the fill where engines support it, so the letterform is not thinned by its own
  // outline; where they do not, a 0.75px centred stroke costs 0.375px of counter and
  // nothing else.
  WebkitTextStrokeWidth: `${GILD.keyline}px`,
  WebkitTextStrokeColor: PLATE_KEYLINE,
  paintOrder: 'stroke fill',
  textShadow: `${GLINT.dx}px ${GLINT.dy}px 0 ${GILT_LIGHT}`,
  position: 'relative',
  zIndex: 1,
});

/**
 * THE BOLE BED — a scorched, branded-in patch of shaft behind the whole wordmark run.
 *
 * ⚠️⚠️ THE CORE IS THE BED AND THE SCORCH LIVES ENTIRELY OUTSIDE IT — and the
 * INEQUALITY between them is what makes the containment geometric rather than hopeful.
 *
 * Two layers. The opaque BOLE core is exactly the bed's own box, which is exactly
 * `ink ± BOLE_PAD` (see boleReach), undisplaced. The BOLE_DEEP scorch is a LARGER rect
 * — inset by −2·edgeAmp on every side — run through a displacement map of amplitude
 * edgeAmp, so its edge can wander anywhere in [bed + 1·edgeAmp, bed + 3·edgeAmp] and
 * NEVER inside the core. So no seed, at any amplitude, can uncover a glyph.
 *
 * ⚠️ THE FIRST CUT INSET THE CORE BY THE AMPLITUDE INSTEAD, AND IT COST THE WHOLE
 * EFFECT. That construction is also sound, and it couples the two numbers backwards:
 * every unit of raggedness you buy is a unit eaten out of the opaque core, so the
 * amplitude is capped by the pad and the edge can only ever be a faint wobble around a
 * rectangle's own outline. Screenshotted, the bed read as a dark rounded slab. Pushing
 * the scorch OUTWARD instead decouples them completely: the amplitude is free, the
 * ragged edge is the silhouette the eye actually gets, and the AA claim is untouched
 * because the core never moved.
 *
 * ⚠️ `color-interpolation-filters="sRGB"` IS SPELLED OUT AND IS NOT OPTIONAL — the
 * SVG default for a filter chain is linearRGB, engines disagree about it, and the
 * whole point of a fixed seed is that the same bytes produce the same picture.
 */
function BoleBed({ id }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      data-testid="bole-bed"
      viewBox={`0 0 ${BW} ${BH}`}
      preserveAspectRatio="none"
      style={{
        position: 'absolute',
        top: -REACH.top, right: -REACH.right, bottom: -REACH.bottom, left: -REACH.left,
        width: `calc(100% + ${REACH.left + REACH.right}px)`,
        height: `calc(100% + ${REACH.top + REACH.bottom}px)`,
        // Paint, never layout: the bed reaches below the wordmark's box and must cost
        // no height, or ANCHOR_OFFSET moves and every in-page anchor in the estate
        // lands worse. Absolute + overflow-visible buys the reach for free.
        overflow: 'visible',
        display: 'block',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    >
      <defs>
        <filter
          id={`${id}-scorch`}
          x="-20%"
          y="-40%"
          width="140%"
          height="180%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence type="fractalNoise" baseFrequency="0.035 0.09" numOctaves="3" seed={GILD.seed} result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale={GILD.edgeAmp} xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
      {/* 1 — the scorch: the outer field, edge-displaced, deepest where the brand bit.
             ⚠️ It starts TWO amplitudes outside the core, so a displacement of ONE
             amplitude leaves its nearest possible edge a full amplitude clear of the
             core on every side — the ragged outline is the silhouette, and it can
             never be the thing under a letter. */}
      <rect
        data-testid="bole-scorch"
        x={-SCORCH_OUT}
        y={-SCORCH_OUT}
        width={BW + SCORCH_OUT * 2}
        height={BH + SCORCH_OUT * 2}
        fill={BOLE_DEEP}
        filter={`url(#${id}-scorch)`}
      />
      {/* 2 — THE OPAQUE CORE, and it IS the bed: exactly `ink ± BOLE_PAD`, undisplaced,
              carrying the whole AA claim by itself. */}
      <rect
        data-testid="bole-core"
        x="0"
        y="0"
        width={BW}
        height={BH}
        fill={BOLE}
      />
    </svg>
  );
}

/**
 * THE GILDED WORDMARK — the bed, then the leaf-and-keyline run inside it.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children the wordmark's own text run
 * @param {string} [props.id] scopes the SVG-local filter id so two lockups on one page
 *   (the desktop bar and a mobile one under a breakpoint change) cannot collide.
 */
export default function GildedWordmark({ children, id = 'gild' }) {
  return (
    <>
      <BoleBed id={id} />
      <span data-testid="gilded-leaf" style={LEAF}>{children}</span>
    </>
  );
}

export { BH, BW, REACH, SCORCH_OUT };
