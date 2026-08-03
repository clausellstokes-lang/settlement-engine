/**
 * NavDivider.jsx — the desktop ribbon's seam mark (LD-2).
 *
 * The owner's order: nav items are separated by vertical lines running
 * top-to-bottom of the bar, EXCEPT inside the Create → Library → Realm trio,
 * whose seams become full-height ARROWS — two strokes from the bar's top and
 * bottom edges converging on a mid-height apex, pointing right, open at the
 * back. Sections then read as sections and the journey reads as flow, with one
 * mark family doing both jobs.
 *
 * THE KIND IS DERIVED, NEVER MAPPED. `dividerKind` asks the flow predicate
 * NavFlowArrow already owns (lib/routes.js NAV_FLOW) whether the left cell
 * feeds the right one. A hardcoded "chevrons at these two boundaries" list is
 * exactly the parallel-array second truth routes.js:163 exists to forbid: a
 * future nav insertion or reorder files its own divider automatically instead
 * of silently keeping a stale arrow pointing at the wrong neighbour.
 *
 * GEOMETRY. The mark is an inline SVG that stretches to its parent's height
 * (`alignSelf: stretch` against the ribbon, which itself stretches to the
 * header row) with `preserveAspectRatio="none"`, so one viewBox serves every
 * bar height. `vectorEffect="non-scaling-stroke"` keeps the hairline exactly
 * one device pixel under that non-uniform scale, and holds the two kinds to a
 * matched stroke weight — without it the chevron's diagonals would thicken as
 * the bar grew while the line's vertical stayed put.
 *
 * WIDTH + CLEARANCE. The mark is 7px wide and the ribbon's own flex `gap` goes
 * to 0, so the divider IS the seam rather than an addition to it: each label
 * keeps its SP.lg (16px) padding and the rule sits 3.5px further out, leaving
 * the chevron apex ~16px clear of the next label at every viewport where the
 * full ribbon renders. Net ribbon growth is 3px per boundary — the alternative
 * (keeping gap 4 and adding width) pushed the header toward an earlier wrap.
 *
 * BYTE FRUGALITY. This renders in the EAGER App.jsx header, so it is inline SVG
 * with no icon import and no new dependency — two `<line>` elements and a token
 * colour.
 *
 * A11Y. Pure decoration: `aria-hidden`, no focus stop, no pointer surface, no
 * text content, so no nav link's accessible name changes. The ribbon's buttons
 * carry the whole accessible name and keyboard behaviour.
 */
import { BORDER } from '../theme.js';
import { flowsInto } from './NavFlowArrow.jsx';

/** The divider's own coordinate space; scaled to the bar by preserveAspectRatio. */
const W = 7;
const H = 100;

/**
 * The seam mark between two adjacent nav cells, derived from the declared flow.
 * @param {string} from left cell's view id
 * @param {string} to right cell's view id
 * @returns {'chevron'|'line'} chevron when `from` feeds `to`, else a plain rule
 */
export function dividerKind(from, to) {
  return flowsInto(from, to) ? 'chevron' : 'line';
}

export default function NavDivider({ kind, from, to }) {
  const isChevron = kind === 'chevron';
  const stroke = { stroke: BORDER, strokeWidth: 1, vectorEffect: 'non-scaling-stroke' };
  return (
    <span
      aria-hidden="true"
      data-testid={`nav-divider-${kind}-${from}-${to}`}
      data-divider-kind={kind}
      style={{
        // Stretches to the ribbon's full height — the ribbon in turn stretches
        // to the header row, so "top-to-bottom of the bar" falls out of the
        // flex chain rather than out of absolute positioning (which would span
        // BOTH rows once the header wraps at intermediate widths).
        alignSelf: 'stretch', display: 'flex', flex: `0 0 ${W}px`,
        pointerEvents: 'none',
      }}
    >
      <svg
        width="100%" height="100%" viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none" focusable="false" aria-hidden="true"
        style={{ display: 'block', overflow: 'visible' }}
      >
        {isChevron ? (
          <>
            <line x1="0" y1="0" x2={W} y2={H / 2} {...stroke} />
            <line x1="0" y1={H} x2={W} y2={H / 2} {...stroke} />
          </>
        ) : (
          <line x1={W / 2} y1="0" x2={W / 2} y2={H} {...stroke} />
        )}
      </svg>
    </span>
  );
}
