/**
 * ShaftWrap.jsx — one turn of silk whipping on the shaft.
 *
 * From the owner's reference photo: two narrow glossy RED-BROWN thread bands ride
 * the shaft, one ahead of the fletching cluster and one behind it, bracketing it. On a
 * real arrow they are what actually holds the fletching down, which is why they sit on
 * BARE BARREL immediately outside the band's box rather than across the feathers —
 * a wrap painted over the vanes would be binding nothing.
 *
 * ⚠️ BUT IT MUST PAINT OVER THE CORNER IT BINDS, AND THAT IS WHY IT CARRIES A
 * z-index. The band's cells are parallelograms seated so their seams cross the lane
 * divisions at the LABEL's height, which leaves the band's two outer corners displaced
 * from its box at the quill line. A whipping that passed UNDER those corners would show
 * the feather sticking out past its own binding. `zIndex: 1` lifts both wraps over the
 * band's paint layer (`zIndex: 0`) so the thread crosses the corner exactly as it does
 * on a real arrow.
 *
 * ⚠️⚠️ AND SINCE THE MIRROR IT IS ALIGNED TO THAT CORNER RATHER THAN TO THE BOX, WHICH
 * IS WHAT THE OUTER ENDS' SLANT COSTS AND BUYS (ribbon V4 §c).
 *
 * Until V4 the band's two outer ends were SQUARE — the outer cells were drawn long and
 * clipped back to the box — so "flush against the box" and "flush against the feather"
 * were the same place and a wrap at `right: 100%` bound the end by construction. The
 * owner's directive makes every border parallel, so the ends are slashes now and those
 * two places are `|SEAT|` apart: the whole band's quill line is displaced by the seat,
 * so Create's leading corner sits `|SEAT|` INSIDE the box and Realm's trailing corner
 * `|SEAT|` OUTSIDE it. A wrap left at the box would bind nothing at the lead end and
 * leave a slash of bare feather standing proud at the trail end.
 *
 * ⚠️ SO THE OFFSET IS DERIVED FROM THE BAND'S OWN GEOMETRY, NEVER MEASURED OFF A
 * SCREENSHOT. `CORNER` is `|SEAT| / BAND_W` — the corner's displacement as a fraction of
 * the band's width — which is the one form that survives `preserveAspectRatio="none"`:
 * the band is stretched to whatever the cluster measures, so a px offset would be right
 * at 1440 and wrong at every other width while a percentage of the same box is right at
 * all of them. `BITE` is the 2-3px the thread paints OVER the corner, and it IS in px
 * because it is a thread's own width, not a share of the band.
 *
 * ⚠️ IT CANNOT TOUCH THE LABELS, AND THAT IS MEASURED RATHER THAN ASSUMED. The lead
 * wrap now reaches `|SEAT| + BITE` into the band's box — 11.2 CSS px at 1440x900 —
 * while Create's label ink starts 16.0px in. tests/components/navFletching.test.jsx
 * pins the clearance against the measured label extent, so a font or padding change
 * that closed that gap reds here instead of shipping a thread through a letterform.
 *
 * ⚠️ IT IS OUT-OF-FLOW PAINT, LIKE EVERYTHING ELSE ON THIS BAR. The wrap is
 * absolutely positioned OUTSIDE the fletching band's box (a negative horizontal
 * inset), so it contributes no width to the nav row and cannot push the header into
 * a second flex line. A negative HORIZONTAL inset is the safe one: the ribbon's
 * hazard is vertical (theme.js derives ANCHOR_OFFSET from the bar's height), and the
 * nav row's own overhang census in tests/components/navFletching.test.jsx asserts no
 * element spends a vertical layout property or a negative vertical offset. This
 * spends neither.
 *
 * ⚠️⚠️ THE GLOSS IS A TURN, NOT A HIGHLIGHT — AND UNTIL V4C IT WAS NEITHER. Silk
 * whipping is a cylinder wound on a cylinder, so it carries the barrel's own shading
 * plus its own. The previous cut spelled that as a VERTICAL three-stop ramp (the
 * barrel's) with a repeating shadow painted OVER it (the turns'), and the arrangement
 * had a defect nothing in the file could see: the turn layer's only opaque tone was the
 * inter-turn shadow, so the satin crest existed only where the barrel gradient happened
 * to be at its lit stop — the top 9% of the bar. Everywhere a reader actually looks, the
 * "crest" was the thread's BODY tone.
 *
 * MEASURED, on the real Chrome raster at device-pixel resolution, mid-bar, both wraps:
 *   BEFORE  #521F12 / #2E0F08 alternating every device pixel — TWO distinct tones over
 *           the whole 10px width, a crest-to-valley ladder of 1.316:1 on a 2.0px period.
 *           A barcode. The file claimed "a 2.6px turn period whose crest-to-valley
 *           ladder is 2.12:1"; 2.12 is the ladder of the authored HEXES and no reader
 *           ever saw it.
 * So the layers swap roles: the TURN gradient becomes the opaque one and carries all
 * three tones at the spec's own widths, and the barrel becomes a neutral luminance
 * MULTIPLY over it (theme.js WRAP_BARREL, which owns why it must be neutral). One
 * light, two cylinders, and the crest survives to the bottom of the bar.
 *
 * ⚠️⚠️ AND THE MULTIPLY IS THE WHOLE PAINT, WHICH IS WHY IT NOW HAS A FALL-BACK AND A
 * PIN. `backgroundBlendMode` is the ONE declaration making these bands oxblood: delete
 * it and both wraps render as a flat #D7D7D7 LIGHT-GREY stripe — WRAP_BARREL's own
 * neutral, unmultiplied — at ~9:1 against the cedar, which is the loudest object on the
 * bar by a distance. All 398 design + nav assertions stayed green through that deletion,
 * because the R5 pin performs the multiply ARITHMETICALLY from WRAP_BARREL and
 * WRAP_GLOSS and never asks whether the component declares it. So V4D adds both halves
 * a fail-safe owes: a pin on the RENDERED element (tests/components/navFletching), and
 * an `@supports not (background-blend-mode: multiply)` arm (src/index.css) that hands an
 * engine without the blend the PRE-V4C oxblood ramp instead of the modulator alone.
 */
import {
  CHROME, FLETCH, SHAFT_STOPS, WRAP, WRAP_BARREL, WRAP_EDGE, WRAP_GLOSS, WRAP_TURN,
} from '../theme.js';
import { BAND, BAND_W, RUN, SEAT, lean, unitHash } from './FletchBand.jsx';

/**
 * How far the band's outer quill-line corner is displaced from its box, as a SIGNED
 * fraction of the band's width — the seat, in the band's own units. Positive under the
 * mirrored lean (the corners sit to the right of the box); a re-mirror makes it negative
 * and both wraps follow, which is why the sign is kept rather than absolute.
 */
const CORNER = -SEAT / BAND_W;

/** How far the thread paints OVER the corner it binds, in px: two turns of silk. */
const BITE = 3;

/**
 * The inset that lands a wrap's binding edge on the corner it binds, plus the bite.
 * ⚠️ THE BITE IS SUBTRACTED IN BOTH CASES and that is not a coincidence: the lead wrap
 * binds with its RIGHT edge and the trail wrap with its LEFT, so "further over the
 * corner" is a smaller inset either way, whichever direction the band leans.
 * @param {number} corners how many corner-displacements from the wrap's own box edge
 */
const seated = (corners) => `calc(${(100 + corners * CORNER * 100).toFixed(4)}% - ${BITE}px)`;

/**
 * ⚠️⚠️ THE WINDINGS — ONE TURN, THREE BANDS, AT THE SPEC'S OWN WIDTHS (part 2 §3).
 *
 * A turn of silk laid on a shaft shows three things across its width, and in this order
 * under an upper-LEFT light: the shadow where it meets the previous turn, the satin
 * crest catching the light on its near side, and the body falling away behind it. So the
 * period reads shadow → crest → body, which puts the crest on the LEFT of each turn
 * exactly as the spec asks.
 *
 * ⚠️ THE STOPS ARE DERIVED BY RUNNING SUM, NEVER SPELLED. Four of the six positions are
 * the same three widths added up, and authoring them as literals is how a period stops
 * summing to itself — 0.4 + 1.0 + 1.2 must be 2.6 or the gradient's last stop and its
 * repeat boundary disagree and the whole field walks by a fraction of a pixel per turn.
 * The pin re-derives the same sum rather than reading these numbers back.
 *
 * ⚠️ IT IS FULLY OPAQUE, and that is the swap the header note describes: the turns are
 * the material now, and WRAP_BARREL multiplies the barrel's light over them.
 */
const SHADOW_END = WRAP_TURN.shadow;
const GLOSS_END = SHADOW_END + WRAP_TURN.gloss;
const TURNS = 'repeating-linear-gradient(90deg,'
  + ` ${WRAP_EDGE} 0, ${WRAP_EDGE} ${SHADOW_END}px,`
  + ` ${WRAP_GLOSS} ${SHADOW_END}px, ${WRAP_GLOSS} ${GLOSS_END}px,`
  + ` ${WRAP} ${GLOSS_END}px, ${WRAP} ${WRAP_TURN.period}px)`;

/**
 * ⚠️⚠️ THE PAINT AND ITS BLEND ARE ONE OBJECT, BECAUSE THEY ARE ONE CONTRACT SPELLED IN
 * TWO PROPERTIES. `background-blend-mode`'s Nth mode belongs to `background-image`'s Nth
 * layer, and CSS REPEATS a short blend list to fill a longer image list rather than
 * complaining — so a third layer added to the images alone would silently inherit
 * `multiply` and take the whole wrap to near-black. Written as two literals that list
 * is an invisible coupling maintained by memory; written as one table it is a coupling
 * the language enforces, and the pin asserts the two lists the ELEMENT carries are the
 * same length so the table cannot be bypassed by an inline edit either.
 */
const LAYERS = Object.freeze([
  // The barrel's light, MULTIPLIED over the opaque turns.
  Object.freeze([WRAP_BARREL, 'multiply']),
  // ⚠️ AND THE SECOND MODE IS `normal` DELIBERATELY: a single `multiply` would apply to
  // this last layer too, multiplying the turns by the background colour and crushing the
  // whole wrap.
  Object.freeze([TURNS, 'normal']),
]);
const PAINT = LAYERS.map(([image]) => image).join(', ');
const BLEND = LAYERS.map(([, mode]) => mode).join(', ');

/**
 * THE PRE-V4C THREAD RAMP — the fail-safe an engine without `background-blend-mode`
 * gets, and it is RECOVERED rather than re-invented (ShaftWrap.jsx @ dd86e5f9^, where
 * it was the wrap's whole paint under the name THREAD).
 *
 * ⚠️⚠️ WITHOUT IT THE FAILURE MODE IS NOT "FLATTER", IT IS GREY. The layer the blend
 * modulates is WRAP_BARREL, a NEUTRAL luminance ramp — that neutrality is R5's whole
 * lesson (oxblood × oxblood is near-black) and it is exactly what makes the unblended
 * paint a #D7D7D7 light-grey stripe at ~9:1 on the cedar. A binding that loses its
 * blend must lose a dimension of modelling, never its material; so the fallback is the
 * thread's own oxblood shading, sharing SHAFT_STOPS with the wood exactly as it did
 * before V4C, which is the same claim one step flatter.
 *
 * ⚠️ THE PRE-V4C TURN LAYER IS DELIBERATELY NOT RESTORED WITH IT. That gradient is the
 * defect V4C measured and retired — two tones alternating every device pixel, a barcode
 * — and a fail-safe should degrade to the last known-GOOD tone rather than to the last
 * shipped composition including its recorded fault.
 */
const THREAD = `linear-gradient(180deg, ${WRAP_GLOSS} 0%, ${WRAP_GLOSS} ${SHAFT_STOPS.lit * 100}%,`
  + ` ${WRAP} ${SHAFT_STOPS.mid * 100}%, ${WRAP} ${SHAFT_STOPS.body * 100}%, ${WRAP_EDGE} 100%)`;

/**
 * The class the `@supports` arm hangs off (src/index.css). ⚠️ IT CARRIES NO STYLE OF ITS
 * OWN — every declaration on this element is still inline, and the stylesheet's only job
 * is the ONE thing an inline style cannot express: a conditional. An engine that never
 * loads the sheet gets the blended paint, which is the correct one.
 */
const WRAP_CLASS = 'sf-shaft-wrap';

/** The wrap's own box, in the units its tie-off is drawn in: px, and the bar's height. */
const W = FLETCH.wrap;
const H = CHROME.headerDesktop;

/**
 * ⚠️⚠️ THE TIE-OFF (spec part 2 §3) — THE ONE AUTHORED MARK ON THE WHIPPING, AND IT IS
 * WHAT MAKES THE BAND READ AS *WOUND AND LOCKED* RATHER THAN AS A STRIPED CUFF.
 *
 * A whipping is finished by passing the working end back diagonally under the last turns
 * and pulling it home. That single diagonal is the most recognisable thing about a real
 * binding, and it is the only mark here that is not periodic — which is precisely why it
 * carries the read: a field of identical turns says "pattern", one diagonal across it
 * says "somebody tied this".
 *
 * ⚠️ IT LEANS BY THE COMPOSITION'S ONE LEAN, taken from FletchBand's `lean` rather than
 * re-spelled, so a future re-mirror moves the tie-off with every other slanted mark on
 * the bar. Over the wrap's full width the lean costs `W · BAND / RUN` of depth — about
 * 20.5px on a 38px bar — so the pass is steep, like the vanes it binds, not a 45° slash.
 *
 * ⚠️ THE JITTER IS THE BAND'S OWN INTEGER HASH, never `Math.random` and never
 * `Math.sin`: the two wraps must be byte-identical on every render and every engine, and
 * they must not be identical TO EACH OTHER — two tie-offs at the same height on the same
 * bar is the periodicity failure the sheen bands were already re-drawn to escape.
 *
 * @param {'lead'|'trail'} side which wrap — the lead ties low, the trail high
 * @returns {{ pass: string, nub: string }} the diagonal, and its clipped cut end
 */
function tieOff(side) {
  // The lead wrap ties across its LOWER third and the trail across its UPPER third
  // (spec §3), so the two ends of the cluster do not mirror each other exactly.
  const seat = side === 'lead' ? H * 0.62 : H * 0.16;
  // ±2px, from the hash: one draw per side, fixed forever.
  const jitter = (unitHash(side === 'lead' ? 811 : 929) - 0.5) * 4;
  // The pass starts OUTSIDE the box on both ends so its ends are cut by the wrap's own
  // edge rather than stopping in mid-air — a thread that ends inside its own binding is
  // a scratch. `over` is how far past each edge it reaches.
  const over = 2;
  const x0 = W + over;
  const y0 = seat + jitter;
  const x1 = -over;
  // depth = -lean⁻¹(Δx): the lean is negative, so a leftward run is a downward one.
  const drop = ((x0 - x1) / RUN) * BAND;
  const y1 = y0 + drop;
  const round = (n) => +n.toFixed(2);
  return {
    pass: `M ${round(x0)} ${round(y0)} L ${round(x1)} ${round(y1)}`,
    // THE NUB — the working end's cut tail, 1.5px of thread turned back on itself at the
    // pass's lower end and clipped by the wrap's edge. It is what a finished tie-off
    // leaves behind, and it is the reason the pass has an end at all rather than simply
    // running off. It leans the same way, one step shallower, so it reads as the same
    // thread rather than as a stray tick.
    nub: `M ${round(x1)} ${round(y1)} l ${round(lean(1.5) * -1)} ${round(-1.5)}`,
  };
}

/**
 * One whipping band.
 * @param {{ side: 'lead'|'trail' }} props which end of the cluster it binds.
 */
export default function ShaftWrap({ side }) {
  // ⚠️ The lead wrap's inset RUNS AGAINST the corner and the trail wrap's runs WITH it,
  // because `right` grows leftward while `left` grows rightward — both land on the same
  // physical displacement (see `seated`).
  const outward = side === 'lead' ? { right: seated(-1) } : { left: seated(1) };
  const tie = tieOff(side);
  return (
    <span
      aria-hidden="true"
      className={WRAP_CLASS}
      data-testid={`nav-shaft-wrap-${side}`}
      data-wrap-side={side}
      style={{
        position: 'absolute', top: 0, bottom: 0,
        // Seated on the corner it binds, and out of flow: a `right`/`left` inset at or
        // near 100% puts the wrap essentially outside the band, on bare wood, spending
        // no row width. See the corner note above for why it is not exactly 100%.
        ...outward,
        width: FLETCH.wrap,
        // ⚠️ THE BASE COLOUR IS THE FIRST FAIL-SAFE, not the paint. An engine that drops
        // the gradients renders a flat oxblood band, which is a binding one step flatter
        // — never a gap in the shaft.
        backgroundColor: WRAP,
        // The paint and its blend, from the one table that owns both (LAYERS).
        backgroundImage: PAINT,
        backgroundBlendMode: BLEND,
        // ⚠️⚠️ AND THE SECOND FAIL-SAFE IS THE ONE THE FIRST CANNOT MAKE. The base colour
        // only covers an engine that drops the GRADIENTS; an engine that keeps them and
        // drops the BLEND paints WRAP_BARREL's neutral grey right over it. This hands the
        // `@supports` arm in src/index.css the oxblood ramp to swap in, as a custom
        // property so the tones stay in theme.js and the stylesheet holds only the
        // conditional.
        '--sf-wrap-flat': THREAD,
        pointerEvents: 'none',
        // Over the band's paint (zIndex 0), never under it — see the binding note.
        zIndex: 1,
      }}
    >
      {/* ⚠️ THE TIE-OFF IS DRAWN, NOT GRADIENT-FAKED, because it is a single non-periodic
          mark and CSS has no way to say that. `preserveAspectRatio="none"` is safe here
          in the one direction that matters: the wrap's WIDTH is a fixed px value, so the
          x axis is never stretched, and the y axis stretches only if the bar's height
          changes — which moves the tie-off's seat with the bar, as it should.
          It clips itself (no `overflow: visible`), which is what makes the ends CUT. */}
      <svg
        aria-hidden="true"
        focusable="false"
        data-testid={`nav-shaft-tie-${side}`}
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        style={{
          position: 'absolute', top: 0, right: 0, bottom: 0, left: 0,
          width: '100%', height: '100%', display: 'block', pointerEvents: 'none',
        }}
      >
        {/* The border hairlines: the SAME path one step wider in the shadow tone, so the
            0.4px of WRAP_EDGE either side of the crest is exact by construction rather
            than two offset copies that drift apart at some width. */}
        <path
          d={`${tie.pass} ${tie.nub}`}
          data-testid={`nav-shaft-tie-edge-${side}`}
          fill="none"
          stroke={WRAP_EDGE}
          strokeWidth={WRAP_TURN.period + WRAP_TURN.shadow * 2}
          vectorEffect="non-scaling-stroke"
        />
        <path
          d={`${tie.pass} ${tie.nub}`}
          data-testid={`nav-shaft-tie-pass-${side}`}
          fill="none"
          stroke={WRAP_GLOSS}
          strokeOpacity="0.5"
          strokeWidth={WRAP_TURN.period}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </span>
  );
}

export { GLOSS_END, SHADOW_END, TURNS, tieOff };
