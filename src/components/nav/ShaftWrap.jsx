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
 * divisions at the LABEL's height, which leaves the leading corner of the first cell
 * (and the trailing corner of the last) poking a few px outside the band's box at the
 * quill line. A whipping that passed UNDER those corners would show the feather
 * sticking out past its own binding. `zIndex: 1` lifts both wraps over the band's
 * paint layer (`zIndex: 0`) so the thread crosses the corner exactly as it does on a
 * real arrow. It cannot touch the labels: they sit inside the band's box and the wraps
 * sit entirely outside it.
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
  const outward = { [side === 'lead' ? 'right' : 'left']: '100%' };
  return (
    <span
      aria-hidden="true"
      data-testid={`nav-shaft-wrap-${side}`}
      data-wrap-side={side}
      style={{
        position: 'absolute', top: 0, bottom: 0,
        // Flush against the cluster and OUTSIDE it: `right: 100%` puts the lead wrap
        // entirely to the left of the band, on bare wood, spending no row width.
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
