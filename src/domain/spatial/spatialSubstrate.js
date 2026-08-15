/**
 * spatialSubstrate.js — THE SPATIAL SUBSTRATE GEOMETRY (DOOR 1, owner ruling #8).
 *
 * THE PROJECTION LAW (design, binding): "the engine NEVER reads the render or the
 * layout model directly." So this DOMAIN leaf never imports the town-map builder — it
 * is PURE GEOMETRY over an already-built TownMapModel object handed to it as a plain
 * record. The builder call (buildTownMapModel) lives OUTSIDE the engine, in the
 * lazily-loaded canonize body (src/lib/spatialSubstrateDerive.js), which is where the
 * design's "at generation/canonize time a compact SPATIAL SUBSTRATE is derived and
 * stored sidecar" happens. Keeping the builder out of src/domain also keeps the
 * strict-typed engine kernel free of the render layer's un-annotated graph.
 *
 * THE COHERENCE JUDGMENT (mine, vetoable — recorded in the fold report): the
 * substrate must cohere with the settlement's ACTIVE layout version — the map and the
 * engine may never disagree about the town's shape. The canonize body builds the
 * model via buildTownMapModel, the ONE entry the renderer itself uses (it dispatches
 * v1/v2 off the same mapEdits.layoutLawVersion marker), and hands the OUTPUT here — so
 * coherence is automatic: the substrate is a projection of the very geometry the map
 * draws. The v1 model is coarser (noise-placed) but honest; v2 is sourced-asymmetry.
 * Either way the district positions, wall ring, and gates are the rendered ones.
 *
 * WHAT THE LAYOUT DOES NOT EXPOSE (and how this leaf SYNTHESISES it): the town-map
 * model carries district category + wealth + centroid + polygon, an 8-vertex wall
 * ring with a SINGLE wallWeight, gate points, and per-district building counts — but
 * NO building-material vocabulary, NO per-district density/flammability, and NO
 * per-segment wall strength or district-adjacency graph. All four are synthesised
 * here from what the model DOES expose (JUDGMENT tables below, vetoable):
 *   • FLAMMABILITY01 ← category (timber workshops burn, stone temples do not) ×
 *     wealth (coin buys stone and tile — the wealthy quarter is less flammable).
 *   • DENSITY01 ← the district's assigned building count (fill/mass-residential
 *     counts heavier), saturating.
 *   • ADJACENCY ← the k-nearest OTHER districts by centroid within a radius,
 *     symmetrised, plus each district's single nearest (no isolated quarter).
 *   • WALL-SEGMENT STRENGTH ← wallWeight base × the protected district's standing
 *     (a valued/wealthy quarter's wall is better kept) × a gate-weakening (an
 *     opening is the soft spot).
 *
 * DETERMINISM: the model is a pure function of (settlement, mapEdits) under the
 * builder's own seed fork; this leaf adds only pure geometry (no rng, no trig, no
 * clock). A cheap STRUCTURAL SIGNATURE lets the canonize body re-derive only when the
 * town's structure actually changes, keeping the sidecar byte-stable.
 *
 * Pure, deterministic, side-effect-free, rng-free, clock-free. No layout import.
 */
import { compareCodepoint } from '../deterministicSort.js';
import { clamp01 } from '../../kernel/math.js';

/** @typedef {import('./spatialSubstrateRead.js').SpatialSubstrate} SpatialSubstrate */
/** @typedef {import('./spatialSubstrateRead.js').SubDistrict} SubDistrict */
/** @typedef {import('./spatialSubstrateRead.js').SubWallSeg} SubWallSeg */
/** @typedef {import('./spatialSubstrateRead.js').SubGate} SubGate */
/** @typedef {{ id: string, cat: string, cx: number, cy: number, wealthRank: number, flam: number, den: number }} RichDistrict */

/** @param {unknown} v @returns {Record<string, unknown>} */
function asObject(v) {
  return v && typeof v === 'object' && !Array.isArray(v) ? /** @type {Record<string, unknown>} */ (v) : {};
}
/** @param {unknown} v @param {number} fallback @returns {number} */
function num(v, fallback) {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}
/** @param {number} v @returns {number} */
function round4(v) { return Math.round(num(v, 0) * 10000) / 10000; }

export const SUBSTRATE_VERSION = 1;

// ── FLAMMABILITY (JUDGMENT — say "veto") ──────────────────────────────────────
// Per district-category base flammability (0 stone … 1 timber-and-thatch). The map
// carries no material vocabulary, so this is the honest interpretation of "lot grain
// + material vocabulary": what a quarter of that character is BUILT of.
/** @type {Readonly<Record<string, number>>} */
const FLAMMABILITY_BY_CATEGORY = Object.freeze({
  industrial: 0.90, craft: 0.80, criminal: 0.78, residential: 0.72, foreign: 0.66,
  merchant: 0.60, other: 0.55, arcane: 0.45, military: 0.38, civic: 0.32,
  noble: 0.30, religious: 0.25,
});
// Coin buys stone, tile, and firebreaks: a wealthier quarter of the same character
// is less flammable. The 6 wealth bands (destitute…opulent) scale flammability down
// by up to this fraction at the top band.
const WEALTH_BANDS = Object.freeze(['destitute', 'poor', 'modest', 'comfortable', 'wealthy', 'opulent']);
const WEALTH_FLAMMABILITY_RELIEF = 0.35;

// Building-count saturation for density01; 'fill' (mass residential/lodging) counts
// heavier (denser lots). JUDGMENT.
const DENSITY_SATURATION = 8;
const FILL_DENSITY_WEIGHT = 1.5;

// ── ADJACENCY (JUDGMENT — say "veto") ─────────────────────────────────────────
// A district's neighbours: up to K_ADJ nearest OTHER districts within ADJ_RADIUS of
// its centroid (the town view is 1000×1000), symmetrised, plus its single nearest so
// no quarter is isolated. Deterministic (distance then codepoint).
const K_ADJ = 3;
const ADJ_RADIUS = 340;

// ── WALL-SEGMENT STRENGTH (JUDGMENT — say "veto") ─────────────────────────────
// Base = wallWeight/WALL_WEIGHT_MAX (floored). A valued/wealthy quarter's sector is
// better kept; a gate is the soft spot.
const WALL_WEIGHT_MAX = 5;
const VALUED_CATEGORIES = new Set(['civic', 'noble', 'religious', 'merchant', 'military']);
const WALL_VALUED_BONUS = 0.15;
const WALL_WEALTH_BONUS = 0.20;
const WALL_BASE_FLOOR = 0.30;
const GATE_WEAKEN = 0.6;

/** Wealth-band rank (0 destitute … 5 opulent; unknown ⇒ 0). @param {string} wealth */
function wealthRankOf(wealth) {
  return Math.max(0, WEALTH_BANDS.indexOf(String(wealth).toLowerCase()));
}

/**
 * Derive the compact spatial substrate from an ALREADY-BUILT TownMapModel (handed in
 * by the canonize body, which built it via buildTownMapModel off the settlement's
 * active layout). Coherent with the rendered map by construction (same model). `sig`
 * is the caller-computed structural signature (substrateSignatureOf in
 * lib/spatialSubstrateDerive.js — it reads settlement identity fields, which this
 * scanned-blind leaf deliberately does not touch); it is stored for the reuse check.
 * Returns null when the model has no districts (a mapless dossier) — the consumers
 * then honest-null. PURE, deterministic. No layout import (the projection law).
 * @param {Record<string, unknown>|null|undefined} model  a built TownMapModel
 * @param {string} [sig]  the caller-computed structural signature
 * @returns {SpatialSubstrate|null}
 */
export function deriveSpatialSubstrate(model, sig = '') {
  const m = asObject(model);
  const lyr = Number(m.layoutLawVersion) === 2 ? 2 : 1;

  const rawDistricts = Array.isArray(m.districts) ? m.districts : [];
  if (rawDistricts.length === 0) return null;

  // Building count per district (fill counts heavier — denser lots).
  /** @type {Map<string, number>} */
  const buildingWeight = new Map();
  for (const b of (Array.isArray(m.buildings) ? m.buildings : [])) {
    const bo = asObject(b);
    const did = String(bo.districtId ?? '');
    if (did === '') continue;
    const w = String(bo.kind ?? 'landmark') === 'fill' ? FILL_DENSITY_WEIGHT : 1;
    buildingWeight.set(did, (buildingWeight.get(did) ?? 0) + w);
  }

  // Enriched districts (carry wealth for the wall derivation; projected to the
  // prose-free stored shape afterwards).
  /** @type {RichDistrict[]} */
  const rich = rawDistricts.map((dd) => {
    const o = asObject(dd);
    const id = String(o.id ?? '');
    const cat = String(o.category ?? 'other');
    const centroid = asObject(o.centroid);
    const wealth = String(o.wealth ?? 'modest');
    return {
      id, cat,
      cx: Math.round(num(centroid.x, 0)), cy: Math.round(num(centroid.y, 0)),
      wealthRank: wealthRankOf(wealth),
      flam: flammabilityOf(cat, wealth),
      den: clamp01((buildingWeight.get(id) ?? 0) / DENSITY_SATURATION),
    };
  }).filter((dd) => dd.id !== '');
  rich.sort((a, b) => compareCodepoint(a.id, b.id));
  if (rich.length === 0) return null;

  const adj = deriveAdjacency(rich);
  const { w, g } = deriveWalls(asObject(m.fortifications), rich);

  /** @type {SubDistrict[]} */
  const d = rich.map((r) => ({ id: r.id, cat: r.cat, cx: r.cx, cy: r.cy, flam: r.flam, den: round4(r.den) }));

  return { v: SUBSTRATE_VERSION, sig: String(sig || ''), lyr, d, adj, w, g };
}

/** Per-district flammability from category × wealth. @param {string} cat @param {string} wealth */
function flammabilityOf(cat, wealth) {
  const base = FLAMMABILITY_BY_CATEGORY[cat] ?? FLAMMABILITY_BY_CATEGORY.other;
  const relief = (wealthRankOf(wealth) / (WEALTH_BANDS.length - 1)) * WEALTH_FLAMMABILITY_RELIEF;
  return round4(clamp01(base * (1 - relief)));
}

/** Symmetric district adjacency from centroids (k-nearest within radius + nearest).
 *  @param {RichDistrict[]} d @returns {Record<string, string[]>} */
function deriveAdjacency(d) {
  /** @type {Map<string, Set<string>>} */
  const nbrs = new Map(d.map((dd) => [dd.id, new Set()]));
  for (const a of d) {
    // Rank other districts by centroid distance (integer, exact), codepoint tiebreak.
    const ranked = d.filter((b) => b.id !== a.id).map((b) => {
      const dx = a.cx - b.cx;
      const dy = a.cy - b.cy;
      return { id: b.id, dist: Math.round(Math.sqrt(dx * dx + dy * dy)) };
    }).sort((x, y) => (x.dist - y.dist) || compareCodepoint(x.id, y.id));
    // The nearest always links (no isolated quarter); then up to K_ADJ within radius.
    for (let i = 0; i < ranked.length; i++) {
      if (i === 0 || (ranked[i].dist <= ADJ_RADIUS && i < K_ADJ)) {
        nbrs.get(a.id)?.add(ranked[i].id);
        nbrs.get(ranked[i].id)?.add(a.id); // symmetrise
      }
    }
  }
  /** @type {Record<string, string[]>} */
  const out = {};
  for (const id of [...nbrs.keys()].sort(compareCodepoint)) {
    const list = [...(nbrs.get(id) ?? new Set())].sort(compareCodepoint);
    if (list.length) out[id] = list;
  }
  return out;
}

/** The wall segments + gates from the fortifications ring (N vertices ⇒ N segments).
 *  @param {Record<string, unknown>} fort @param {RichDistrict[]} d
 *  @returns {{ w: SubWallSeg[], g: SubGate[] }} */
function deriveWalls(fort, d) {
  const ring = Array.isArray(fort.walls) ? fort.walls : [];
  if (ring.length < 3) return { w: [], g: [] };
  const wallWeight = clamp01(num(fort.wallWeight, 1) / WALL_WEIGHT_MAX);
  const rawGates = Array.isArray(fort.gates) ? fort.gates : [];

  // Segment i connects ring vertex i → vertex i+1 (closed). Its outward octant ≈ i.
  const n = ring.length;
  /** @type {Array<{ i: number, x1: number, y1: number, x2: number, y2: number, mx: number, my: number }>} */
  const rawSegs = [];
  for (let i = 0; i < n; i++) {
    const a = Array.isArray(ring[i]) ? /** @type {number[]} */ (ring[i]) : [0, 0];
    const b = Array.isArray(ring[(i + 1) % n]) ? /** @type {number[]} */ (ring[(i + 1) % n]) : [0, 0];
    const x1 = num(a[0], 0);
    const y1 = num(a[1], 0);
    const x2 = num(b[0], 0);
    const y2 = num(b[1], 0);
    rawSegs.push({ i, x1, y1, x2, y2, mx: Math.round((x1 + x2) / 2), my: Math.round((y1 + y2) / 2) });
  }
  // Map each gate to the segment whose midpoint is nearest (the segment it pierces).
  /** @type {Set<number>} */
  const gatedSegs = new Set();
  /** @type {SubGate[]} */
  const g = rawGates.map((gate) => {
    const go = asObject(gate);
    const gx = num(go.x, 0);
    const gy = num(go.y, 0);
    let bestSeg = 0;
    let bestDist = Infinity;
    for (const seg of rawSegs) {
      const dx = gx - seg.mx;
      const dy = gy - seg.my;
      const dist = dx * dx + dy * dy;
      if (dist < bestDist) { bestDist = dist; bestSeg = seg.i; }
    }
    gatedSegs.add(bestSeg);
    return { x: Math.round(gx), y: Math.round(gy), seg: bestSeg };
  });
  // Strength: base × protected-district standing × gate-weakening.
  /** @type {SubWallSeg[]} */
  const w = rawSegs.map((seg) => {
    const prot = nearestDistrict(d, seg.mx, seg.my);
    let str = Math.max(WALL_BASE_FLOOR, wallWeight);
    if (prot) {
      if (VALUED_CATEGORIES.has(prot.cat)) str += WALL_VALUED_BONUS;
      str += (prot.wealthRank / (WEALTH_BANDS.length - 1)) * WALL_WEALTH_BONUS;
    }
    if (gatedSegs.has(seg.i)) str *= GATE_WEAKEN;
    return { i: seg.i, x1: seg.x1, y1: seg.y1, x2: seg.x2, y2: seg.y2, str: round4(clamp01(str)), did: prot ? prot.id : null };
  });
  return { w, g };
}

/** The district whose centroid is nearest a point, or null (codepoint tiebreak).
 *  @param {RichDistrict[]} d @param {number} x @param {number} y @returns {RichDistrict|null} */
function nearestDistrict(d, x, y) {
  let best = null;
  let bestDist = Infinity;
  for (const dd of d) {
    const dx = x - dd.cx;
    const dy = y - dd.cy;
    const dist = dx * dx + dy * dy;
    if (dist < bestDist || (dist === bestDist && best != null && compareCodepoint(dd.id, best.id) < 0)) {
      bestDist = dist;
      best = dd;
    }
  }
  return best;
}
