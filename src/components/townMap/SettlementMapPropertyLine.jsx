/**
 * components/townMap/SettlementMapPropertyLine — THE PROPERTY-LINE HALO (MP-1).
 *
 * The owner's §494 directive, drawn: hover a building and the whole PROPERTY lights
 * up — its boundary, and the open ground inside it — rather than the building alone.
 * A yard, a court, and every other structure on the same ground are one property and
 * highlight as one, because membership is "shares a `parcelId`" and the join is
 * cartographyProperty.js's (§495.3). This leaf performs no geometry and owns no
 * membership rule; it renders what that leaf answers.
 *
 * A LEAF, FOR A MEASURED REASON. SettlementMapPane is a max-lines-capped hot file
 * with six effective lines of headroom at this base, and its own precedent for this
 * situation is explicit (landform, grid, age overlay, fog): the pane grows by a CALL,
 * not a block. Self-gating like the grid, so the pane mounts it unconditionally.
 *
 * ── BORDER AS WELL AS TINT (§494.3, §495.4c) ─────────────────────────────────
 * The halo is a STROKE plus a low-opacity FILL, never a fill alone. A tint-only
 * highlight is invisible to a reader in a high-contrast mode and ambiguous to a
 * colour-blind one; the boundary is the affordance and the tint is its support. The
 * opacity precedent is the pane's own hovered district polygon (0.24 fill, 0.95
 * stroke) — the property line sits between the district and the building in the
 * z-order and reads a little softer than the district, so it cannot be mistaken for
 * one. It is also drawn ABOVE the district and BELOW the buildings, matching the
 * painter's own back-to-front position for a `parcel` op.
 *
 * ── THE YARD IS A HOLE, NOT A POLYGON ────────────────────────────────────────
 * The open ground (§495.4d) is the parcel ring with each member footprint punched out
 * under `fill-rule: evenodd`. `footprint ⊂ parcel` is a theorem, so the renderer's
 * even-odd rule performs the subtraction EXACTLY and no clipping code exists anywhere.
 * The buildings themselves keep their own paint: the tint stops at their walls, which
 * is what makes the yard legible AS a yard.
 *
 * ── IT NEVER TAKES A POINTER ─────────────────────────────────────────────────
 * `pointerEvents: 'none'` throughout. The halo is drawn over the very building that
 * summoned it, so a hit-testable halo would steal the pointer, drop the hover, remove
 * the halo, restore the hover — a flicker loop. Touch posture is therefore unchanged:
 * touch drops hover and a tap pins, exactly as before, because this leaf handles no
 * event at all.
 *
 * ── FREE, AT EVERY LEVEL ─────────────────────────────────────────────────────
 * Owner ruling §514.1b: editing the map is paywalled at every level; VIEWING AND
 * INTERACTING ARE NOT. This is interaction, so it reads no entitlement, takes no
 * `canEdit`, and is mounted outside every authoring gate — an anonymous reader gets
 * the halo. A gate here would be the opposite error to a revenue leak, and just as
 * much a defect.
 *
 * No store, no clock, no randomness, no raw colour (every value is a theme token
 * threaded in by the pane, so a lens palette wears through), no while/do loop.
 *
 * @enforced-by tests/ui/settlementMapPropertyLine.test.jsx
 */
import { useMemo } from 'react';
import { buildPropertyLineIndex, openGroundOf, propertyLineForAnchor }
  from '../../domain/townCartography/cartographyProperty.js';

/** The hovered-district precedent, one step softer so the two never read alike. */
const YARD_FILL_OPACITY = 0.18;
const LINE_STROKE_OPACITY = 0.95;
const LINE_STROKE_WIDTH = 2.5;

/** @param {Array<[number, number]>} ring @returns {string} */
function subpath(ring) {
  return `M ${ring.map(([x, y]) => `${x},${y}`).join(' L ')} Z`;
}

/**
 * @param {{ cartography?: unknown, anchorKey?: string|null, halo?: string }} props
 * `cartography` is the compiled block or null — null is the ORDINARY case, because the
 * cartography rule is virtual and dark by default, and a dark block simply draws no
 * halo rather than degrading anything the pane already shows.
 */
export default function SettlementMapPropertyLine({ cartography = null, anchorKey = null, halo = '' }) {
  const index = useMemo(() => buildPropertyLineIndex(cartography), [cartography]);
  const line = propertyLineForAnchor(index, anchorKey);
  const ground = openGroundOf(line);
  if (!line || !ground || !halo) return null;
  // ONE property, ONE draw. The whole ring is a single path and the members are holes
  // in it, so hovering any member of a compound highlights the boundary exactly once
  // and there is no seam to double-draw where two members touch (§495.4e).
  const yard = [ground.ring, ...ground.holes].map(subpath).join(' ');
  return (
    <g data-town-property-line={line.parcelId} style={{ pointerEvents: 'none' }}>
      <path d={yard} fillRule="evenodd" fill={halo} fillOpacity={YARD_FILL_OPACITY} stroke="none" />
      <path
        d={subpath(ground.ring)}
        fill="none"
        stroke={halo}
        strokeOpacity={LINE_STROKE_OPACITY}
        strokeWidth={LINE_STROKE_WIDTH}
        strokeLinejoin="round"
      />
    </g>
  );
}
