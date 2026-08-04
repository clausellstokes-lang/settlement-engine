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
 * THE GLOSS IS THREE STOPS, NOT A HIGHLIGHT DOT. Silk whipping is a cylinder wound
 * on a cylinder, so it carries the barrel's own shading plus its own: WRAP_GLOSS
 * near the lit centreline, WRAP through the body, WRAP_EDGE at the shadowed lower
 * turn. Sharing SHAFT_STOPS.lit with the wood underneath is what keeps the two
 * cylinders lit by the same light — a wrap with its own highlight position reads as
 * a sticker.
 */
import { FLETCH, SHAFT_STOPS, WRAP, WRAP_EDGE, WRAP_GLOSS } from '../theme.js';
import { BAND_W, SEAT } from './FletchBand.jsx';

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

/** The thread's own shading, sharing the barrel's light. */
const THREAD = `linear-gradient(180deg, ${WRAP_GLOSS} 0%, ${WRAP_GLOSS} ${SHAFT_STOPS.lit * 100}%,`
  + ` ${WRAP} ${SHAFT_STOPS.mid * 100}%, ${WRAP} ${SHAFT_STOPS.body * 100}%, ${WRAP_EDGE} 100%)`;

/**
 * THE WINDINGS — fine vertical turns of thread, so the band reads as something wound
 * rather than something painted. Sub-pixel gaps at a 2px period: present at a glance,
 * never a barcode.
 */
const TURNS = `repeating-linear-gradient(90deg, transparent 0, transparent 1.4px,`
  + ` ${WRAP_EDGE} 1.4px, ${WRAP_EDGE} 2px)`;

/**
 * One whipping band.
 * @param {{ side: 'lead'|'trail' }} props which end of the cluster it binds.
 */
export default function ShaftWrap({ side }) {
  // ⚠️ The lead wrap's inset RUNS AGAINST the corner and the trail wrap's runs WITH it,
  // because `right` grows leftward while `left` grows rightward — both land on the same
  // physical displacement (see `seated`).
  const outward = side === 'lead' ? { right: seated(-1) } : { left: seated(1) };
  return (
    <span
      aria-hidden="true"
      data-testid={`nav-shaft-wrap-${side}`}
      data-wrap-side={side}
      style={{
        position: 'absolute', top: 0, bottom: 0,
        // Seated on the corner it binds, and out of flow: a `right`/`left` inset at or
        // near 100% puts the wrap essentially outside the band, on bare wood, spending
        // no row width. See the corner note above for why it is not exactly 100%.
        ...outward,
        width: FLETCH.wrap,
        backgroundColor: WRAP,
        backgroundImage: [TURNS, THREAD].join(', '),
        pointerEvents: 'none',
        // Over the band's paint (zIndex 0), never under it — see the binding note.
        zIndex: 1,
      }}
    />
  );
}
