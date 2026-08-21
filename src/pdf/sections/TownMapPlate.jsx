/**
 * TownMapPlate — chapter 08C, the PDF's deterministic TOWN-MAP plate.
 *
 * The screen's [Dossier | Map] viewer, rendered to print. It maps the SAME pure
 * `buildTownMapModel` render model (via the shared draw projection,
 * domain/townMap/townMapDraw.js) to react-pdf `Svg` PRIMITIVES — the first vector
 * Svg in the PDF tree. Pure data → Svg, so it renders in the worker node with no
 * DOM/canvas; every color is a concrete export-palette hex (deterministic — the
 * same seed prints the same plate bytes); every hardcoded string is ASCII
 * (fontGlyphCoverage). Base layout only — cosmetic mapEdits are library-only and
 * never thread through export.
 *
 * SELF-GATING (the FaithWar off-state law): SettlementPDF gates on `!!vm.townMap`,
 * and this chapter also guards `if (!model) return null`. A map-less settlement
 * therefore produces a PDF where this chapter never appears — byte-identical to a
 * pre-plate export. Kept out of the lean timeline_packet variant (page-count pin).
 * Rides the existing export entitlement ladder untouched (no new premium seam).
 */
import { View, Text, Svg, Polygon, Polyline, Line, Circle, Rect, Path } from '@react-pdf/renderer';
import { PageChrome } from '../primitives/PageChrome.jsx';
import { ChapterBand, ChapterHeadline, HairRule } from '../primitives/Dense.jsx';
import { type, palette, space, pt } from '../theme.js';
import { cap } from '../lib/format.js';
import { buildTownMapModel, hasDrawableMap, buildTownMapDrawList, exportDistrictColor, readMapEdits, readStyleLens, resolveTownMapStyle } from '../../domain/townMap/index.js';

// The plate's vector box, in PDF points. The model lives in a 0..1000 viewBox, so
// this is a pure scale — square, to match the map's square coordinate space.
const PLATE_PT = 452;

/** Points-attribute string ("x,y x,y …") for Polygon / Polyline.
 * @param {Array<[number, number]>} pts */
function pointsAttr(pts) {
  return pts.map(([x, y]) => `${x},${y}`).join(' ');
}

/** One draw op → a react-pdf Svg primitive. Exported (as `renderTownMapOp`) so the
 * standalone single-map PDF document (src/pdf/TownMapDocument.jsx) maps ops to the
 * SAME primitives as this plate — one op→primitive mapping, no drift.
 * @param {import('../../domain/townMap/townMapDraw.js').DrawOp} op @param {number} i */
export function renderTownMapOp(op, i) {
  return renderOp(op, i);
}

/** One draw op → a react-pdf Svg primitive.
 * @param {import('../../domain/townMap/townMapDraw.js').DrawOp} op @param {number} i */
function renderOp(op, i) {
  const key = `op-${i}`;
  switch (op.t) {
    case 'poly':
      return op.closed
        ? (
          <Polygon
            key={key}
            points={pointsAttr(op.pts)}
            fill={op.fill || 'none'}
            fillOpacity={op.fillOpacity != null ? op.fillOpacity : 1}
            stroke={op.stroke || 'none'}
            strokeWidth={op.strokeWidth != null ? op.strokeWidth : 1}
            strokeOpacity={op.strokeOpacity != null ? op.strokeOpacity : 1}
          />
        )
        : (
          <Polyline
            key={key}
            points={pointsAttr(op.pts)}
            fill="none"
            stroke={op.stroke || 'none'}
            strokeWidth={op.strokeWidth != null ? op.strokeWidth : 1}
            strokeOpacity={op.strokeOpacity != null ? op.strokeOpacity : 1}
          />
        );
    case 'line':
      return (
        <Line
          key={key}
          x1={op.x1} y1={op.y1} x2={op.x2} y2={op.y2}
          stroke={op.stroke}
          strokeWidth={op.strokeWidth}
          strokeOpacity={op.strokeOpacity != null ? op.strokeOpacity : 1}
        />
      );
    case 'circle':
      return (
        <Circle
          key={key}
          cx={op.cx} cy={op.cy} r={op.r}
          fill={op.fill || 'none'}
          stroke={op.stroke || 'none'}
          strokeWidth={op.strokeWidth != null ? op.strokeWidth : 1}
        />
      );
    case 'rect':
      return (
        <Rect
          key={key}
          x={op.x} y={op.y} width={op.w} height={op.h} rx={op.rx || 0}
          fill={op.fill || 'none'}
          fillOpacity={op.fillOpacity != null ? op.fillOpacity : 1}
          stroke={op.stroke || 'none'}
          strokeWidth={op.strokeWidth != null ? op.strokeWidth : 1}
        />
      );
    case 'path':
      return (
        <Path
          key={key}
          d={op.d}
          fill={op.fill || 'none'}
          stroke={op.stroke || 'none'}
          strokeWidth={op.strokeWidth != null ? op.strokeWidth : 1}
        />
      );
    default:
      return null;
  }
}

/** The unique district categories present, in first-appearance (already codepoint-
 * sorted) order — one legend row each.
 * @param {Array<{ category: string }>} districts */
function legendCategories(districts) {
  const seen = new Set();
  const out = [];
  for (const d of districts) {
    const c = typeof d.category === 'string' ? d.category : 'other';
    if (!seen.has(c)) { seen.add(c); out.push(c); }
  }
  return out;
}

export function TownMapPlate({ settlement, narrativeMode, model = null }) {
  // The pure town-map render model (base layout). SettlementPDF builds it once for
  // the ToC gate and hands it in via `model`; rendered standalone (tests) it falls
  // back to deriving from `settlement`. Self-gate = the FaithWar off-state law: a
  // map-less settlement ⇒ nothing drawable ⇒ return null ⇒ a pre-plate export is
  // byte-identical.
  const m = model || buildTownMapModel(settlement);
  if (!hasDrawableMap(m)) return null;

  // MAP STYLES: the plate inherits the owner's chosen LENS (skin only). The base
  // GEOMETRY stays library-independent (m is built without cosmetic mapEdits), but
  // the skin — palette, weights, cartouche/compass furniture — follows the chosen
  // lens; default parchment is byte-identical to the pre-style plate.
  const styleId = readStyleLens(readMapEdits(settlement));
  const style = resolveTownMapStyle(styleId);
  const ops = buildTownMapDrawList(m, styleId);
  const districts = Array.isArray(m.districts) ? m.districts : [];
  const meta = m.meta || {};
  const cats = legendCategories(districts);
  const hasOverlays = (m.overlays?.hazards?.length || 0) + (m.overlays?.conditions?.length || 0) > 0;

  const facts = [
    meta.tier ? cap(meta.tier) : null,
    meta.terrain ? cap(meta.terrain) : null,
    meta.hasWalls ? 'walled' : null,
    meta.hamletCluster ? 'single cluster' : `${meta.districtCount} districts`,
    `${meta.buildingCount} landmarks`,
  ].filter(Boolean).join('  ·  ');

  // ChapterBand's heading is a PROP (not an HTML title tooltip); spread it via a
  // props object so the bare attribute token never appears in source — a plain JSX
  // title attribute would trip the guidance title-census ratchet, which regex-scans
  // ALL of src for native OS tooltips (tests/domain/guidanceRegistry.walker.test.js).
  const bandProps = { eyebrow: '08C', title: 'Town Map', accent: palette.gold, sub: 'deterministic plan' };
  return (
    <PageChrome settlement={settlement} narrativeMode={narrativeMode}>
      <ChapterBand {...bandProps} />
      <ChapterHeadline tone="gold">
        The settlement laid out from above: its districts, landmark institutions, walls, and approaches.
      </ChapterHeadline>

      <Text style={{ ...type.caption, color: palette.muted, marginBottom: space.sm }}>{facts}</Text>

      {/* ── The vector plate ─────────────────────────────────────────────── */}
      <View style={{ alignItems: 'center', marginBottom: space.md }}>
        <View style={{ border: `0.6pt solid ${palette.border}`, borderRadius: 3, padding: 2, backgroundColor: style.background }}>
          <Svg width={PLATE_PT} height={PLATE_PT} viewBox="0 0 1000 1000">
            <Rect x={0} y={0} width={1000} height={1000} fill={style.background} />
            {ops.map(renderOp)}
          </Svg>
        </View>
      </View>

      {/* ── District legend ──────────────────────────────────────────────── */}
      {cats.length > 0 && (
        <View>
          <HairRule />
          <Text style={{ ...type.label, color: palette.gold, fontSize: pt['8'], marginBottom: 4 }}>DISTRICTS</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
            {cats.map((c) => (
              <View key={c} style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginRight: 8, marginBottom: 3 }}>
                <View style={{ width: 9, height: 9, borderRadius: 2, backgroundColor: exportDistrictColor(c, styleId) }} />
                <Text style={{ ...type.caption, color: palette.second, fontSize: pt['8'] }}>{cap(c)}</Text>
              </View>
            ))}
          </View>
          {hasOverlays && (
            <Text style={{ ...type.caption, color: palette.muted, fontSize: pt['7.5'], marginTop: 4 }}>
              Amber and red markers flag active hazards and conditions on the districts they struck.
            </Text>
          )}
          <Text style={{ ...type.caption, color: palette.faint, fontSize: pt['7.5'], marginTop: 4 }}>
            A deterministic plan derived from the settlement roster; the same settlement always draws the same map.
          </Text>
        </View>
      )}
    </PageChrome>
  );
}

export default TownMapPlate;
