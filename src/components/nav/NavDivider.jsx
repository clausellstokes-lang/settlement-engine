/**
 * NavDivider.jsx — the desktop ribbon's seam mark (LD-2, refitted for THE
 * FLETCHED RIBBON under the owner directive of 2026-08-03).
 *
 * The original order: nav items are separated by vertical lines running
 * top-to-bottom of the bar, EXCEPT inside the Create → Library → Realm trio,
 * whose seams were full-height CHEVRONS — two strokes converging on a mid-height
 * apex. THE CURVED-CHEVRON READING IS RETIRED ON DESKTOP. The trio now sits in a
 * single leather-brown fletched band (NavRibbon.jsx), and the seams between its
 * feathers become what a fletching's seams actually are: SHARP STRAIGHT ANGLED
 * STROKES, one per boundary, cut at exactly the angle the feathers lean.
 *
 * THE KIND IS STILL DERIVED, NEVER MAPPED. `dividerKind` asks the flow predicate
 * NavFlowArrow already owns (lib/routes.js NAV_FLOW) whether the left cell feeds
 * the right one. A hardcoded "angled strokes at these two boundaries" list is
 * exactly the parallel-array second truth routes.js:163 exists to forbid: a
 * future nav insertion or reorder files its own divider automatically instead of
 * silently keeping a stale mark at the wrong boundary. Only the ANSWER's spelling
 * changed ('chevron' → 'fletch'); the derivation did not.
 *
 * GEOMETRY. Both kinds are an inline SVG stretched to the parent's height
 * (`alignSelf: stretch`) with `preserveAspectRatio="none"`, so one viewBox serves
 * every bar height, and `vectorEffect="non-scaling-stroke"` keeps the hairline
 * exactly one device pixel under that non-uniform scale.
 *
 * WHY THE FLETCH STROKE IS `FLETCH.slant` WIDE AND NOTHING ELSE. The feather's
 * clipped edge runs `FLETCH.slant` px horizontally over the band's full height
 * (NavRibbon's FEATHER_CLIP). Giving this mark the SAME width and drawing it
 * corner-to-corner — bottom-left to top-right — makes it traverse the same run
 * over the same height, so the stroke is PARALLEL to the vanes by construction
 * rather than by a second angle someone has to keep in sync. Change FLETCH.slant
 * and both move together.
 *
 * WIDTH + CLEARANCE. The plain rule stays 7px wide and the ribbon's flex `gap`
 * stays 0, so the divider IS the seam rather than an addition to it: each label
 * keeps its SP.lg (16px) padding and the rule sits 3.5px further out.
 *
 * BYTE FRUGALITY. This renders in the EAGER App.jsx header, so it is inline SVG
 * with no icon import and no new dependency — one or two `<line>` elements and a
 * token colour.
 *
 * A11Y. Pure decoration: `aria-hidden`, no focus stop, no pointer surface, no
 * text content, so no nav link's accessible name changes. The ribbon's buttons
 * carry the whole accessible name and keyboard behaviour. The fletch stroke takes
 * GOLD, measured at 3.12:1 against FLETCH_BROWN — clear of WCAG 1.4.11's 3:1 for
 * a non-text boundary (the ratio is recorded in theme.js and recomputed by
 * tests/design/contrast.test.js).
 */
import { BORDER, GOLD, FLETCH } from '../theme.js';
import { flowsInto } from './NavFlowArrow.jsx';

/** The plain rule's own coordinate space; scaled to the bar by preserveAspectRatio. */
const W = 7;
const H = 100;

/**
 * The seam mark between two adjacent nav cells, derived from the declared flow.
 * @param {string} from left cell's view id
 * @param {string} to right cell's view id
 * @returns {'fletch'|'line'} an angled fletch stroke when `from` feeds `to` (the
 *   pair is inside the fletched band), else a plain vertical rule
 */
export function dividerKind(from, to) {
  return flowsInto(from, to) ? 'fletch' : 'line';
}

export default function NavDivider({ kind, from, to }) {
  const isFletch = kind === 'fletch';
  // The fletch stroke's box is exactly as wide as the feathers' slant, so its
  // corner-to-corner diagonal is the vanes' own angle (see the geometry note).
  const w = isFletch ? FLETCH.slant : W;
  const stroke = {
    stroke: isFletch ? GOLD : BORDER,
    strokeWidth: 1,
    vectorEffect: 'non-scaling-stroke',
  };
  return (
    <span
      aria-hidden="true"
      data-testid={`nav-divider-${kind}-${from}-${to}`}
      data-divider-kind={kind}
      style={{
        // Stretches to the ribbon's full height — inside the fletched band that
        // is the band's height, so the stroke spans exactly the feathers it cuts
        // between; outside it, the ribbon's, so a plain rule still runs the bar
        // top-to-bottom. Both fall out of the flex chain rather than out of
        // absolute positioning (which would span BOTH rows once the header wraps).
        alignSelf: 'stretch', display: 'flex', flex: `0 0 ${w}px`,
        pointerEvents: 'none',
        // Above the band's paint layer, which is z-index 0 within the band.
        position: 'relative', zIndex: 1,
      }}
    >
      <svg
        width="100%" height="100%" viewBox={`0 0 ${w} ${H}`}
        preserveAspectRatio="none" focusable="false" aria-hidden="true"
        style={{ display: 'block', overflow: 'visible' }}
      >
        {isFletch ? (
          // ONE straight stroke, bottom-left → top-right: the same forward lean
          // the feathers carry, cut through the band as a single sharp angle.
          <line x1="0" y1={H} x2={w} y2="0" {...stroke} />
        ) : (
          <line x1={w / 2} y1="0" x2={w / 2} y2={H} {...stroke} />
        )}
      </svg>
    </span>
  );
}
