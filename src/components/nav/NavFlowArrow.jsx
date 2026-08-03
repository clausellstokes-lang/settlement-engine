/**
 * NavFlowArrow.jsx — the ribbon's flow chevron.
 *
 * Create · Library · Realm read as a sequence, not a set, so the right edge of
 * a tab that FEEDS its neighbour carries an open chevron pointing into it. It
 * is drawn as an architectural hairline in the BORDER register — two token
 * borders on a rotated box, no glyph and no icon import, so the chrome gains a
 * flow reading without a first-paint icon cost or an ornamental note.
 *
 * THE ADJACENCY GUARD: the chevron renders only when `to` — the tab actually
 * rendered next ON THIS SURFACE — is the flow successor lib/routes.js declares
 * in NAV_FLOW. The mobile bottom nav is the ONLY mount (LD-2 retired the
 * desktop ribbon's chevrons); it omits Realm (Gallery follows Library there),
 * so Library draws none. An arrow pointing at the wrong neighbour would teach
 * a false lesson about where the work goes, which is worse than no arrow at
 * all.
 *
 * Harmony: the chevron takes GOLD on the active tab and the quieter BORDER
 * elsewhere, matching the tab's own resting/active register, and carries the
 * same 0.2s transition the tab uses so the two settle together.
 *
 * A11y: decorative only — aria-hidden, no focus, no pointer surface. The tab's
 * own button carries the whole accessible name and keyboard behaviour; the
 * chevron adds nothing an assistive technology has to read. It positions
 * against the tab button, which supplies `position: relative`.
 */
import { NAV_FLOW } from '../../lib/routes.js';
import { GOLD, BORDER } from '../theme.js';

/** True when `to` is the flow successor `from` declares in NAV_FLOW. */
export function flowsInto(from, to) {
  return !!from && !!to && NAV_FLOW[from] === to;
}

export default function NavFlowArrow({ from, to, active = false }) {
  if (!flowsInto(from, to)) return null;
  const stroke = active ? GOLD : BORDER;
  return (
    <span
      aria-hidden="true"
      data-testid={`nav-flow-${from}-${to}`}
      style={{
        // Sits on the seam between the two tabs (the mobile bar's column
        // boundary — the only live mount since LD-2) so it reads as the right edge of
        // this tab opening into the next, not as a mark belonging to either.
        position: 'absolute', right: -3, top: '50%',
        width: 6, height: 6, marginTop: -3,
        borderTop: `1px solid ${stroke}`, borderRight: `1px solid ${stroke}`,
        transform: 'rotate(45deg)',
        pointerEvents: 'none',
        transition: 'border-color 0.2s',
      }}
    />
  );
}
