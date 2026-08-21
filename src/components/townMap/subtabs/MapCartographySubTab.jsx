/**
 * components/townMap/subtabs/MapCartographySubTab — TC-5b-ii, THE PAINTER'S MOUNT.
 *
 * The `Map ▸ Cartography` sub-tab: the first surface in the estate that draws a
 * compiled cartography sheet, and TC-5a's paint leaf's FIRST PRODUCTION IMPORTER.
 *
 * ONE ORDERING TRUTH. `buildCartographyDrawList` emits ops in the painter's own
 * back-to-front order — wards, then arterials and lanes over them, then buildings
 * on top — sorted by raw codepoint id inside each layer. This component renders
 * that sequence VERBATIM and NEVER re-sorts, re-filters or recomputes it. A second
 * ordering here would be a second truth about what the sheet says; a paint-time
 * audience filter would be a second truth about what a reader may see, and
 * cartographyPaint.js:30-36 forbids it by construction.
 *
 * NO GEOMETRY OF ITS OWN. A plan point is an integer pair and is emitted
 * verbatim. This component performs no vertex arithmetic, so `footprint ⊂ parcel
 * ⊂ ward` cannot be broken here.
 *
 * THE EXTENT IS A RESOLVED PROP, NOT A MANIFEST READ (D-6). The block carries no
 * extent, and TC-5b-i's seam deliberately exposes no manifest — handing a whole
 * audience-projected manifest to a UI leaf is a wide surface for a component that
 * needs one integer. The shell threads `block` and `planExtent` as two props.
 *
 * A-4, THE DEGRADED STATE. `buildCartographyDrawList` THROWS on a malformed
 * block. That is caught here and answered with a visible, honest notice naming the
 * surviving road — never a blank panel, never a silent fallback, and never the raw
 * error text, which is a developer fact and goes to the console alone. A
 * legitimately EMPTY sheet is a DIFFERENT case with its own narrated state.
 *
 * STORE-FREE and prop-mounted, the MapPlayerSubTab posture: a lazy leaf reached
 * only from MapTabShell, so its first-paint cost is zero. No store read, no clock,
 * no randomness, no colour of its own — every value resolves through
 * cartographyColours.js, which resolves through the design tokens.
 *
 * @enforced-by tests/ui/mapCartographySubTab.test.jsx
 * @enforced-by tests/build/mapTabShellLazy.test.js
 */

import { useEffect, useMemo } from 'react';
import { BORDER, CARD, FS, INK, MUTED, SP, sans } from '../../theme.js';
import { buildCartographyDrawList } from '../../../domain/townCartography/cartographyPaint.js';
import { resolveRoleFill, STREET_TONE_PERMILLE } from './cartographyColours.js';

/** Build sentinel — see MapTabShell's, and tests/build/mapTabShellLazy.test.js. */
export const MAP_CARTOGRAPHY_SUBTAB_LAZY_SENTINEL = 'settlementforge:map-cartography-subtab:lazy-v1';

/** The pen-width scale. `widthPlan` and `weightPermille` are BOTH already on the
 *  op, so weighting them authors no second weight table. */
const PERMILLE = 1000;
const PERMILLE_HALF = 500;
/** A weighted lane may never round away to an invisible hairline. */
const PEN_FLOOR_PLAN = 1;

const noteStyle = {
  fontFamily: sans, fontSize: FS.sm, color: MUTED, lineHeight: 1.5, margin: 0,
};

/**
 * Serialize a plan ring or run to an SVG points list. Integers only: the paint
 * leaf guarantees the LAYER is an array but not its vertices, and a malformed
 * vertex must degrade to A-4 rather than emit an undefined coordinate.
 * @param {unknown} vertices @param {string} at @returns {string}
 */
function pointsOf(vertices, at) {
  if (!Array.isArray(vertices) || vertices.length === 0) {
    throw new Error(`${at} carries no plan points`);
  }
  return vertices.map((vertex, index) => {
    if (!Array.isArray(vertex) || !Number.isInteger(vertex[0]) || !Number.isInteger(vertex[1])) {
      throw new Error(`${at}[${index}] is not an integer plan point`);
    }
    return `${vertex[0]},${vertex[1]}`;
  }).join(' ');
}

/**
 * @param {number} widthPlan @param {number} weightPermille @returns {number}
 */
function penWidthOf(widthPlan, weightPermille) {
  const weighted = widthPlan * weightPermille;
  return Math.max(PEN_FLOOR_PLAN, Math.floor((weighted + PERMILLE_HALF) / PERMILLE));
}

/**
 * The draw list, resolved to renderable elements IN THE EMITTED ORDER.
 * @param {unknown} block @returns {Array<Record<string, unknown>>}
 */
function elementsFor(block) {
  return buildCartographyDrawList(block).map((op) => {
    const at = `${op.op} '${op.id}'`;
    if (op.op === 'street') {
      return {
        key: `${op.op}:${op.id}`,
        kind: 'polyline',
        points: pointsOf(op.polyline, at),
        stroke: resolveRoleFill(op.role, STREET_TONE_PERMILLE),
        penWidth: penWidthOf(op.widthPlan, op.weightPermille),
      };
    }
    return {
      key: `${op.op}:${op.id}`,
      kind: 'polygon',
      points: pointsOf(op.polygon, at),
      fill: resolveRoleFill(op.role, op.tonePermille),
    };
  });
}

/**
 * @param {{ block?: unknown, planExtent?: unknown }} props
 * ⛔ There is no `manifest` prop and there must never be one (§6.2, D-6).
 */
export default function MapCartographySubTab({ block = null, planExtent = null }) {
  const sheet = useMemo(() => {
    try {
      if (!Number.isInteger(planExtent) || /** @type {number} */ (planExtent) <= 0) {
        throw new Error(`plan extent '${String(planExtent)}' is not a positive integer`);
      }
      return { drawn: true, elements: elementsFor(block), reason: '' };
    } catch (error) {
      return { drawn: false, elements: [], reason: String(error && error.message) };
    }
  }, [block, planExtent]);

  // The raw premise is a DEVELOPER fact. Reported here rather than in the memo so
  // the render phase stays pure, and never rendered — the legibility law forbids
  // leaking it to a reader, and C5 asserts its absence from the DOM.
  useEffect(() => {
    if (sheet.reason) console.warn('[TownCartography] the sheet could not be drawn', sheet.reason);
  }, [sheet.reason]);

  return (
    <div
      data-map-cartography-subtab={MAP_CARTOGRAPHY_SUBTAB_LAZY_SENTINEL}
      style={{
        display: 'flex', flexDirection: 'column', gap: SP.sm,
        padding: SP.md, background: CARD, border: `1px solid ${BORDER}`,
      }}
    >
      {!sheet.drawn && (
        <div role="status" aria-live="polite" style={{ display: 'grid', gap: SP.xs }}>
          <div style={{ fontFamily: sans, fontSize: FS.sm, fontWeight: 800, color: INK }}>
            The surveyor&rsquo;s sheet could not be drawn for this settlement.
          </div>
          <p style={noteStyle}>
            The Plan view holds the same ground, and remains the precision fallback.
          </p>
        </div>
      )}

      {sheet.drawn && sheet.elements.length === 0 && (
        <p style={noteStyle}>
          This settlement has nothing laid down on the surveyor&rsquo;s sheet yet.
        </p>
      )}

      {sheet.drawn && sheet.elements.length > 0 && (
        <svg
          viewBox={`0 0 ${planExtent} ${planExtent}`}
          role="img"
          aria-label="Surveyed sheet of this settlement"
          style={{ display: 'block', width: '100%', height: 'auto', border: `1px solid ${BORDER}` }}
        >
          {sheet.elements.map((element) => (element.kind === 'polyline' ? (
            <polyline
              key={String(element.key)}
              points={String(element.points)}
              fill="none"
              stroke={String(element.stroke)}
              strokeWidth={Number(element.penWidth)}
            />
          ) : (
            <polygon
              key={String(element.key)}
              points={String(element.points)}
              fill={String(element.fill)}
            />
          )))}
        </svg>
      )}
    </div>
  );
}
