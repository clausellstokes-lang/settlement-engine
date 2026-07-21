/**
 * domain/townMap/massing.js — THE PROCEDURAL MASSING SUBSTRATE (Tranche M, lane M-0).
 *
 * The volumetric construction layer the dimensional map VIEWS consume. Where the glyph layer
 * STAMPS a flat elevation icon, massing BUILDS the building as a COMPOSITE SILHOUETTE — the
 * INSTITUTION SILHOUETTE LAW (owner, 2026-07-21): "a cathedral needs to look like a cathedral."
 * A signature institution is not one extruded box but several: a cathedral is a cruciform nave +
 * transept + a spire-capped tower + a cross; a keep is a massive block ringed by corner towers; a
 * mill is a house with a water wheel; a smithy is a shed with a prominent smoking chimney; a
 * market is a row of open stalls. The generic commons (houses / fill mass) get a single simple
 * gable volume. Each component is a footprint extruded to a height class capped by a roof FORM
 * (spire / gable / hip / wheelhouse / flat), its wall face shaded by orientation under the ONE
 * fixed NW light (SHADOW_DIR, shared with groundDress so the whole plane is lit from one side), a
 * cast ground shadow to the SE, and painter-ordered draw ops in the SAME primitive vocabulary as
 * townMapDraw.js. The projection is INJECTED (a trig-free cavalier / axonometric built from
 * rational factors), so one model casts as the oblique panorama, a near-top-down planner sketch,
 * or a future bird's-eye without the substrate changing (the townPanorama law, one model to many
 * projections). Massing REPLACES the glyph facade in a dimensional view; glyphs remain the flat
 * iconography.
 *
 * THE SILHOUETTE TAXONOMY reuses the glyph library's named-landmark knowledge (glyphAssign
 * resolves church/temple to `spire`, mill to `wheelhouse`, keep to `towered-keep`, and so on);
 * each named glyph kind is LIFTED here to a characteristic 3D composite. The totality walker
 * (tests/lint) reds if a live glyph kind has no silhouette spec (deposit-and-consume). Composites
 * are inscribed WITHIN the building's footprint (a render-chosen ground claim scaled per kind so a
 * cathedral out-claims a cottage); attached features (the mill wheel, the dock jetty) reach to the
 * footprint edge deterministically, never sprawling.
 *
 * SEAM (the dormancy law): a building renders as massing only where the resolved style carries the
 * `massingSet` capability field (the W7 dressedStyle pattern). No shipped lens names it, so every
 * shipped surface is byte-identical (the dormancy pin). REJECTED (vetoable, per the constitution):
 * WebGL / true perspective — GPU float variance breaks same-seed-same-image (THE PROMISE) and the
 * eager budget; cavalier rationals are exact and cross-machine stable.
 *
 * PURITY: banned by the src/domain/townMap source-scan (no Date, no Math.random, no localeCompare,
 * no trig). Uses only + - * / and Math.round/min/max/sqrt/imul, and every emitted coordinate is
 * rounded, so (building, style, projection) resolves to byte-identical ops across runs + machines.
 * Any variant choice is a PURE HASH of (seedId, anchorKey) so adding/removing a building never
 * re-shapes another (the never-restamp law, previewed here for M-0b).
 */

import { SHADOW_DIR } from '../../design/townGlyphs/glyphCompiler.js';

/** @typedef {import('./townMapDraw.js').DrawOp} DrawOp */

const R = Math.round;
/** Round to 2 decimals for clean, cross-machine-stable opacity/weight bytes. @param {number} v */
const R2 = (v) => Math.round(v * 100) / 100;

// THE ONE FIXED LIGHT — NW, shared with the glyph hatch + the ground-dress wall shadows
// (SHADOW_DIR). The unit shadow-fall direction (SE, both components positive): a face whose
// outward normal agrees with it faces AWAY from the light and is shaded; the cast shadow is
// offset along it. Nothing is ever lit from a second direction. Correctly-rounded sqrt.
const SHADOW_MAG = Math.sqrt(SHADOW_DIR.dx * SHADOW_DIR.dx + SHADOW_DIR.dy * SHADOW_DIR.dy) || 1;
const SUX = SHADOW_DIR.dx / SHADOW_MAG;
const SUY = SHADOW_DIR.dy / SHADOW_MAG;

// ── THE ROOF-FORM VOCABULARY (the LITERAL forms — a component wears exactly one) ──────
/** The five massing roof forms a component may cap with. */
export const ROOF_FORMS = Object.freeze(['flat', 'gable', 'hip', 'wheelhouse', 'spire']);

/** Per-form roof rise as a fraction of the component footprint half-size. @type {Readonly<Record<string, number>>} */
const ROOF_RISE_F = Object.freeze({ flat: 0, gable: 0.6, hip: 0.5, wheelhouse: 0.85, spire: 1.7 });
/** Per-ridge-form inset of the ridge ends from the x-edges (0 = full gable ridge; larger =
 *  shorter ridge → hip / cap). @type {Readonly<Record<string, number>>} */
const RIDGE_INSET = Object.freeze({ gable: 0, hip: 0.4, wheelhouse: 0.85 });

// ── THE INSTITUTION SILHOUETTE TAXONOMY (JUDGMENT — say "veto") ────────────────────────
// Keyed on the live glyph vocabulary (design/townGlyphs/medieval.js — the kinds glyphAssign
// resolves to). Each spec: `foot` = footprint half-size scale (a cathedral out-claims a cottage);
// `parts` = component boxes in FOOTPRINT-FRACTION coords (dx,dy = centre offset in half-sizes;
// hw,hd = half-extents; hMul = height multiplier; roof = the form); `feat` = recognition marks
// (cross / wheel / smoke / sign / jetty) attached to a part by index. Parts stay inside the
// footprint (|dx|+hw ≤ 1, |dy|+hd ≤ 1); features may reach the edge. Every current kind is
// classified EXPLICITLY so a new glyph kind lands unmapped and REDS the silhouette walker.
/** The generic commons form: one simple gabled block (the category-default massing). */
const GENERIC = Object.freeze({ foot: 0.9, parts: Object.freeze([{ dx: 0, dy: 0, hw: 0.82, hd: 0.85, hMul: 1, roof: 'gable' }]), feat: Object.freeze([]) });

/** @typedef {{ dx:number, dy:number, hw:number, hd:number, hMul:number, roof:string }} MassingPart */
/** @typedef {{ t:string, c:number }} MassingFeature */
/** @typedef {{ foot:number, parts:ReadonlyArray<MassingPart>, feat:ReadonlyArray<MassingFeature> }} Silhouette */

/** @type {Readonly<Record<string, Silhouette>>} */
export const SILHOUETTE_BY_KIND = Object.freeze({
  // CATHEDRAL / church / temple — cruciform nave + transept + spire tower + cross.
  spire: { foot: 1.6, parts: [
    { dx: 0, dy: 0.02, hw: 0.32, hd: 0.92, hMul: 0.62, roof: 'gable' },   // 0 nave (long N-S)
    { dx: 0, dy: -0.18, hw: 0.82, hd: 0.3, hMul: 0.6, roof: 'gable' },    // 1 transept (E-W)
    { dx: 0, dy: 0.64, hw: 0.26, hd: 0.26, hMul: 1.4, roof: 'spire' },    // 2 west tower + spire
  ], feat: [{ t: 'cross', c: 2 }] },
  // SHRINE / chapel — a small nave + a short spire + cross.
  'small-spire': { foot: 1.1, parts: [
    { dx: 0, dy: 0.12, hw: 0.42, hd: 0.6, hMul: 0.6, roof: 'gable' },
    { dx: 0, dy: -0.36, hw: 0.24, hd: 0.24, hMul: 1.05, roof: 'spire' },
  ], feat: [{ t: 'cross', c: 1 }] },
  // MAGE TOWER — a slender tall tower with a conical (spire) cap + a low annex.
  'mage-tower': { foot: 1.05, parts: [
    { dx: -0.08, dy: 0, hw: 0.34, hd: 0.34, hMul: 1.65, roof: 'spire' },
    { dx: 0.52, dy: 0.4, hw: 0.24, hd: 0.34, hMul: 0.6, roof: 'gable' },
  ], feat: [{ t: 'cross', c: 0 }] },
  // MILL — a house with a big water wheel on the road/water (east) side.
  wheelhouse: { foot: 1.2, parts: [
    { dx: -0.14, dy: 0, hw: 0.5, hd: 0.62, hMul: 0.85, roof: 'gable' },
  ], feat: [{ t: 'wheel', c: 0 }] },
  // SMITHY — a shed with a prominent smoking chimney.
  forge: { foot: 1.2, parts: [
    { dx: -0.12, dy: 0, hw: 0.55, hd: 0.66, hMul: 0.72, roof: 'gable' },
    { dx: 0.58, dy: -0.4, hw: 0.14, hd: 0.14, hMul: 1.4, roof: 'flat' },  // 1 chimney
  ], feat: [{ t: 'smoke', c: 1 }] },
  // KEEP / castle — a massive central block ringed by four corner towers.
  'towered-keep': { foot: 1.5, parts: [
    { dx: 0, dy: 0, hw: 0.58, hd: 0.58, hMul: 1.0, roof: 'flat' },
    { dx: -0.7, dy: 0.7, hw: 0.2, hd: 0.2, hMul: 1.35, roof: 'flat' },
    { dx: 0.7, dy: 0.7, hw: 0.2, hd: 0.2, hMul: 1.35, roof: 'flat' },
    { dx: -0.7, dy: -0.7, hw: 0.2, hd: 0.2, hMul: 1.35, roof: 'flat' },
    { dx: 0.7, dy: -0.7, hw: 0.2, hd: 0.2, hMul: 1.35, roof: 'flat' },
  ], feat: [] },
  // MARKET — a long open-sided mass read as a row of three gabled stalls.
  'stall-rows': { foot: 1.5, parts: [
    { dx: -0.62, dy: 0, hw: 0.26, hd: 0.58, hMul: 0.55, roof: 'gable' },
    { dx: 0, dy: 0, hw: 0.26, hd: 0.58, hMul: 0.6, roof: 'gable' },
    { dx: 0.62, dy: 0, hw: 0.26, hd: 0.58, hMul: 0.55, roof: 'gable' },
  ], feat: [] },
  // GRANARY — a tall single gambrel-roofed store.
  'gambrel-store': { foot: 1.2, parts: [
    { dx: 0, dy: 0, hw: 0.5, hd: 0.62, hMul: 1.12, roof: 'gable' },
  ], feat: [] },
  // DOCKS — a low shed with a jetty reaching toward the water (east) side.
  'quay-shed': { foot: 1.3, parts: [
    { dx: -0.24, dy: 0, hw: 0.45, hd: 0.5, hMul: 0.58, roof: 'gable' },
  ], feat: [{ t: 'jetty', c: 0 }] },
  // INN — a house with a hanging signpost.
  'signpost-house': { foot: 1.0, parts: [
    { dx: -0.12, dy: 0, hw: 0.5, hd: 0.6, hMul: 0.85, roof: 'gable' },
  ], feat: [{ t: 'sign', c: 0 }] },
  // NOBLE MANOR — a wide hipped hall + a gabled wing + a chimney.
  'manor-hall': { foot: 1.5, parts: [
    { dx: -0.22, dy: 0, hw: 0.48, hd: 0.72, hMul: 0.9, roof: 'hip' },
    { dx: 0.55, dy: 0.16, hw: 0.28, hd: 0.5, hMul: 0.74, roof: 'gable' },
    { dx: -0.36, dy: -0.5, hw: 0.1, hd: 0.1, hMul: 1.2, roof: 'flat' },   // 2 chimney
  ], feat: [{ t: 'smoke', c: 2 }] },
  // CIVIC MOOT HALL — a hipped hall crowned by a spired bell turret.
  'moot-hall': { foot: 1.3, parts: [
    { dx: 0, dy: 0.12, hw: 0.55, hd: 0.7, hMul: 0.85, roof: 'hip' },
    { dx: 0, dy: -0.46, hw: 0.16, hd: 0.16, hMul: 1.3, roof: 'spire' },
  ], feat: [] },
  // FOREIGN — a house under a shallow hipped (dome-read) roof.
  'caravan-house': { foot: 1.1, parts: [
    { dx: 0, dy: 0, hw: 0.52, hd: 0.62, hMul: 0.9, roof: 'hip' },
  ], feat: [] },
  // INDUSTRIAL WORKSHOP — a mono-pitch shed with a tall smoking chimney.
  workshop: { foot: 1.2, parts: [
    { dx: -0.16, dy: 0, hw: 0.5, hd: 0.6, hMul: 0.7, roof: 'flat' },
    { dx: 0.56, dy: -0.36, hw: 0.13, hd: 0.13, hMul: 1.5, roof: 'flat' }, // 1 chimney
  ], feat: [{ t: 'smoke', c: 1 }] },
  // GENERIC COMMONS — the residential houses + the fill LOD (explicit generic default).
  'house-a': GENERIC,
  'house-b': { foot: 0.9, parts: [{ dx: 0, dy: 0, hw: 0.82, hd: 0.8, hMul: 0.95, roof: 'gable' }], feat: [] },
  'house-c': { foot: 0.95, parts: [{ dx: 0, dy: 0, hw: 0.78, hd: 0.86, hMul: 1.06, roof: 'gable' }], feat: [] },
  massing: { foot: 1.0, parts: [
    { dx: -0.42, dy: 0, hw: 0.34, hd: 0.55, hMul: 0.6, roof: 'gable' },
    { dx: 0.44, dy: 0.12, hw: 0.34, hd: 0.55, hMul: 0.55, roof: 'gable' },
  ], feat: [] },
});

/** The silhouette spec for a glyph kind, falling back to the generic commons for an unknown
 *  kind (runtime safety; the walker guards known-kind totality). @param {string|null|undefined} kind */
export function silhouetteForKind(kind) {
  return (typeof kind === 'string' && SILHOUETTE_BY_KIND[kind]) || GENERIC;
}

// ── THE CAVALIER PROJECTION (trig-free, rational factors — the panorama idiom) ────────
/** The oblique panorama projection (matches townPanorama.js: x preserved, north-south
 *  foreshortened, elevation raises up-screen). */
export const OBLIQUE_PROJ = Object.freeze({ depth: 0.6, groundTop: 150, elevScale: 1 });
/** A near-top-down planner projection: the north-south axis reads almost 1:1 (a plan) with a
 *  shallow elevation pop, keeping the whole 0..1000 sheet inside the view box with headroom for
 *  the roof pop (the planner's-sketch seed for M-4). */
export const FLAT_PLAN_PROJ = Object.freeze({ depth: 0.82, groundTop: 80, elevScale: 0.34 });

/**
 * Build a projection function from a rational config. Project a plan point (map x, y) at
 * pseudo-elevation `elev` to screen space. Trig-free; every coordinate rounded.
 * @param {{ depth?: number, groundTop?: number, elevScale?: number }} [proj]
 * @returns {(x:number, y:number, elev:number) => { x:number, y:number }}
 */
export function makeCavalierProject(proj) {
  const depth = proj && typeof proj.depth === 'number' ? proj.depth : OBLIQUE_PROJ.depth;
  const groundTop = proj && typeof proj.groundTop === 'number' ? proj.groundTop : OBLIQUE_PROJ.groundTop;
  const elevScale = proj && typeof proj.elevScale === 'number' ? proj.elevScale : OBLIQUE_PROJ.elevScale;
  return (x, y, elev) => ({ x: R(x), y: R(groundTop + y * depth - (elev || 0) * elevScale) });
}

// ── Shading (by orientation, under the ONE fixed NW light) ────────────────────────────
const SHADE_BASE = 0.05, SHADE_GAIN = 0.26, SHADE_MAX = 0.5;
/** Wall-face shade ink opacity from an outward horizontal normal: a face agreeing with the SE
 *  shadow-fall (away from the NW light) darkens; a face toward the light stays light.
 *  @param {number} nx @param {number} ny */
function wallShade(nx, ny) {
  const toward = nx * SUX + ny * SUY;                 // >0 faces away from the light (SE)
  return R2(Math.min(SHADE_MAX, SHADE_BASE + SHADE_GAIN * Math.max(0, toward)));
}
const ROOF_TINT_BASE = 0.5, ROOF_TINT_BUMP = 0.12;
/** Roof-plane category-tint opacity: roofs face the sky (LIT), with a subtle directional bump
 *  for planes leaning SE — so lit(roof) / shade(walls) / shadow(ground) reads. @param {number} nx @param {number} ny */
function roofTint(nx, ny) {
  return R2(ROOF_TINT_BASE + ROOF_TINT_BUMP * Math.max(0, nx * SUX + ny * SUY));
}

/** A pure 0..1 hash of a string (FNV-1a, integer-only) for a deterministic variant choice. @param {string} str */
function hashUnit(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) h = (Math.imul(h, 16777619) ^ str.charCodeAt(i)) >>> 0;
  return (h >>> 0) / 4294967296;
}

/**
 * The roof planes for a form over an eave rectangle, each carrying the horizontal normal
 * (nx, ny) that drives its tint. Points are already-projected [sx, sy] pairs.
 * @param {string} form @param {number} cx @param {number} cy @param {number} hw @param {number} rise
 * @param {(px:number, py:number, e:number) => [number, number]} P @param {number} topH
 * @param {[number,number]} eA @param {[number,number]} eB @param {[number,number]} eC @param {[number,number]} eD
 * @returns {Array<{ pts: Array<[number,number]>, nx: number, ny: number }>}
 */
function roofPlanes(form, cx, cy, hw, rise, P, topH, eA, eB, eC, eD) {
  if (form === 'flat' || rise <= 0) return [{ pts: [eA, eB, eC, eD], nx: 0, ny: 0 }];
  if (form === 'spire') {
    const apex = P(cx, cy, topH);
    return [
      { pts: [eA, eB, apex], nx: 0, ny: 1 }, { pts: [eB, eC, apex], nx: 1, ny: 0 },
      { pts: [eC, eD, apex], nx: 0, ny: -1 }, { pts: [eD, eA, apex], nx: -1, ny: 0 },
    ];
  }
  const inset = RIDGE_INSET[form] ?? 0;
  const rW = P(cx - hw * (1 - inset), cy, topH);
  const rE = P(cx + hw * (1 - inset), cy, topH);
  return [
    { pts: [eA, eB, rE, rW], nx: 0, ny: 1 }, { pts: [eD, rW, rE, eC], nx: 0, ny: -1 },
    { pts: [eB, eC, rE], nx: 1, ny: 0 }, { pts: [eA, rW, eD], nx: -1, ny: 0 },
  ];
}

/** A shaded wall face: a solid building-fill quad plus an ink shade overlay. @param {DrawOp[]} ops
 *  @param {Array<[number,number]>} pts @param {string} fill @param {string} ink @param {number} bw @param {number} shade */
function pushWall(ops, pts, fill, ink, bw, shade) {
  ops.push({ t: 'poly', pts, closed: true, fill, fillOpacity: 1, stroke: ink, strokeOpacity: 0.5, strokeWidth: bw });
  ops.push({ t: 'poly', pts, closed: true, fill: ink, fillOpacity: shade });
}

/**
 * Emit ONE component box: the south (front) wall face this cavalier idiom shows plus the roof
 * planes. In the x-preserving transform an east/west face (constant map-x) collapses to zero
 * width, so the front wall is the shown face; a future skewed bird's-eye projection (M-3) opens
 * the side faces. Appends to `ops`. @param {DrawOp[]} ops @param {MassingPart} part
 * @param {number} x @param {number} y @param {number} sz @param {number} h @param {number} nudge
 * @param {string} fill @param {string} ink @param {number} bw @param {string} tint
 * @param {(px:number,py:number,e:number)=>[number,number]} P
 * @returns {{ cx:number, cy:number, hw:number, roof:string, topH:number }} the part's geometry for features
 */
function partOps(ops, part, x, y, sz, h, nudge, fill, ink, bw, tint, P) {
  const cx = x + part.dx * sz, cy = y + part.dy * sz;
  const hw = part.hw * sz, hd = part.hd * sz;
  const eaveH = h * part.hMul;
  const rise = (ROOF_RISE_F[part.roof] ?? ROOF_RISE_F.gable) * hw * nudge;
  const topH = eaveH + rise;
  const ax = cx - hw, bx = cx + hw, ny0 = cy - hd, sy0 = cy + hd;
  const bA = P(ax, sy0, 0), bB = P(bx, sy0, 0);
  const eA = P(ax, sy0, eaveH), eB = P(bx, sy0, eaveH), eC = P(bx, ny0, eaveH), eD = P(ax, ny0, eaveH);
  pushWall(ops, [bA, bB, eB, eA], fill, ink, bw, wallShade(0, 1));   // south (front) wall
  for (const pl of roofPlanes(part.roof, cx, cy, hw, rise, P, topH, eA, eB, eC, eD)) {
    ops.push({ t: 'poly', pts: pl.pts, closed: true, fill: tint, fillOpacity: roofTint(pl.nx, pl.ny), stroke: ink, strokeOpacity: 0.55, strokeWidth: bw });
  }
  return { cx, cy, hw, roof: part.roof, topH };
}

/** Emit a recognition feature (cross / wheel / smoke / sign / jetty) attached to a part's
 *  geometry. All ink; trig-free. @param {DrawOp[]} ops @param {MassingFeature} f
 *  @param {{ cx:number, cy:number, hw:number, roof:string, topH:number }} g the part geometry
 *  @param {number} sz @param {string} ink @param {number} bw @param {(px:number,py:number,e:number)=>[number,number]} P */
function featureOps(ops, f, g, sz, ink, bw, P) {
  if (f.t === 'cross') {
    const arm = g.hw * 0.7, up = g.hw * 1.1;
    const base = P(g.cx, g.cy, g.topH), tip = P(g.cx, g.cy, g.topH + up);
    const bar0 = P(g.cx - arm, g.cy, g.topH + up * 0.6), bar1 = P(g.cx + arm, g.cy, g.topH + up * 0.6);
    ops.push({ t: 'line', x1: base[0], y1: base[1], x2: tip[0], y2: tip[1], stroke: ink, strokeWidth: bw });
    ops.push({ t: 'line', x1: bar0[0], y1: bar0[1], x2: bar1[0], y2: bar1[1], stroke: ink, strokeWidth: bw });
  } else if (f.t === 'smoke') {
    const s0 = P(g.cx, g.cy, g.topH), s1 = P(g.cx + sz * 0.18, g.cy, g.topH + sz * 0.4), s2 = P(g.cx - sz * 0.06, g.cy, g.topH + sz * 0.8);
    ops.push({ t: 'poly', pts: [s0, s1, s2], closed: false, stroke: ink, strokeOpacity: 0.5, strokeWidth: bw });
  } else if (f.t === 'wheel') {
    const wc = P(g.cx + g.hw + sz * 0.36, g.cy, sz * 0.36);
    const rad = Math.max(2, R(sz * 0.34));
    ops.push({ t: 'circle', cx: wc[0], cy: wc[1], r: rad, stroke: ink, strokeWidth: bw });
    ops.push({ t: 'line', x1: wc[0] - rad, y1: wc[1], x2: wc[0] + rad, y2: wc[1], stroke: ink, strokeWidth: bw });
    ops.push({ t: 'line', x1: wc[0], y1: wc[1] - rad, x2: wc[0], y2: wc[1] + rad, stroke: ink, strokeWidth: bw });
  } else if (f.t === 'sign') {
    const px = g.cx + g.hw + sz * 0.14;
    const p0 = P(px, g.cy, 0), p1 = P(px, g.cy, sz * 0.7);
    const arm = P(px + sz * 0.28, g.cy, sz * 0.7);
    ops.push({ t: 'line', x1: p0[0], y1: p0[1], x2: p1[0], y2: p1[1], stroke: ink, strokeWidth: bw });
    ops.push({ t: 'line', x1: p1[0], y1: p1[1], x2: arm[0], y2: arm[1], stroke: ink, strokeWidth: bw });
    const b0 = P(px + sz * 0.14, g.cy, sz * 0.62), b1 = P(px + sz * 0.28, g.cy, sz * 0.62);
    const b2 = P(px + sz * 0.28, g.cy, sz * 0.44), b3 = P(px + sz * 0.14, g.cy, sz * 0.44);
    ops.push({ t: 'poly', pts: [b0, b1, b2, b3], closed: true, stroke: ink, strokeWidth: bw, fill: 'none' });
  } else if (f.t === 'jetty') {
    for (const off of [-sz * 0.28, sz * 0.28]) {
      const j0 = P(g.cx + g.hw, g.cy + off, 0), j1 = P(g.cx + g.hw + sz * 0.55, g.cy + off, 0);
      ops.push({ t: 'line', x1: j0[0], y1: j0[1], x2: j1[0], y2: j1[1], stroke: ink, strokeOpacity: 0.6, strokeWidth: bw });
    }
  }
}

/**
 * The MASSING draw ops for ONE building: a cast ground shadow, the COMPOSITE SILHOUETTE (its
 * component volumes painter-sorted far-to-near, each a shaded front wall + kind-keyed roof), and
 * the recognition features. Pure + deterministic: (all inputs) resolves to byte-identical ops.
 * The projection is INJECTED so the volume composes into any view; the base height is PASSED IN
 * (derived by the caller from the panorama's shared pseudo-elevation tables, never re-derived).
 * The caller depth-sorts BUILDINGS far-to-near; this depth-sorts the PARTS within the building.
 * @param {{ x:number, y:number, footprint:number, height:number, roofKind:string, color:string,
 *   style:import('../../design/townMapStyles.js').TownMapStyle,
 *   project?:(x:number,y:number,elev:number)=>{x:number,y:number}, seedId?:string, anchorKey?:string }} arg
 * @returns {DrawOp[]}
 */
export function buildingMassingOps({ x, y, footprint, height, roofKind, color, style, project, seedId = '', anchorKey = '' }) {
  /** @type {DrawOp[]} */
  const ops = [];
  const proj = typeof project === 'function' ? project : makeCavalierProject(OBLIQUE_PROJ);
  const spec = silhouetteForKind(roofKind);
  const base = Number.isFinite(footprint) && footprint > 0 ? footprint : 8;
  const sz = base * spec.foot;
  const h = Number.isFinite(height) && height > 0 ? height : 12;
  const palette = (style && style.palette) || {};
  const ink = palette.ink;
  const fill = palette.buildingFill;
  const bw = (style && style.stroke && style.stroke.building) || 1.5;
  const tint = color || fill;
  // PURE-HASH variant (previewing the never-restamp law): a small per-building roof-pitch nudge
  // keyed on (seedId, anchorKey), so identical-kind neighbours are not stamped alike.
  const nudge = 0.85 + hashUnit(`${seedId}:${anchorKey}`) * 0.3;

  /** @type {(px:number, py:number, e:number) => [number,number]} */
  const P = (px, py, e) => { const q = proj(px, py, e); return [q.x, q.y]; };

  // (1) CAST GROUND SHADOW — the footprint offset SE (the groundDress wall-shadow idiom), length
  //     scaling with the tallest part so a tall keep/spire throws a longer shadow. On the ground.
  let maxHMul = 0;
  for (const p of spec.parts) maxHMul = Math.max(maxHMul, p.hMul);
  const shLen = 3 + h * maxHMul * 0.12;
  const shadow = [[x - sz, y + sz], [x + sz, y + sz], [x + sz, y - sz], [x - sz, y - sz]]
    .map(([cx, cy]) => P(cx + SUX * shLen, cy + SUY * shLen, 0));
  ops.push({ t: 'poly', pts: shadow, closed: true, fill: ink, fillOpacity: R2(0.14) });

  // (2) COMPONENT VOLUMES — painter-sorted far-to-near (a part further north draws first, so a
  //     near part occludes it). Ties (same dy) keep spec order via a stable index sort.
  const order = spec.parts.map((_, i) => i).sort((a, b) => (spec.parts[a].dy - spec.parts[b].dy) || (a - b));
  /** @type {Array<{ cx:number, cy:number, hw:number, roof:string, topH:number }>} */
  const geom = new Array(spec.parts.length);
  for (const i of order) geom[i] = partOps(ops, spec.parts[i], x, y, sz, h, nudge, fill, ink, bw, tint, P);

  // (3) RECOGNITION FEATURES — drawn on top (cross / wheel / smoke / sign / jetty).
  for (const f of spec.feat) { const g = geom[f.c]; if (g) featureOps(ops, f, g, sz, ink, bw, P); }
  return ops;
}

/**
 * The deterministic painter sort key for a building in a massing scene: far-to-near by screen
 * depth (map-y), ties broken by anchorKey codepoint order (never insertion order), so the
 * composite is stable across runs. Consumers sort with this before emitting volumes.
 * @param {{ position:{ y:number }, anchorKey?:string }} a @param {{ position:{ y:number }, anchorKey?:string }} b
 * @returns {number}
 */
export function compareMassingDepth(a, b) {
  const dy = (a.position ? a.position.y : 0) - (b.position ? b.position.y : 0);
  if (dy !== 0) return dy;
  const ka = a.anchorKey || '', kb = b.anchorKey || '';
  return ka < kb ? -1 : ka > kb ? 1 : 0;
}
