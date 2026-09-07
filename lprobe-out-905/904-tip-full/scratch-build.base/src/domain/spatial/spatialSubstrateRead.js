/**
 * spatialSubstrateRead.js — THE SPATIAL SUBSTRATE PURE READER (DOOR 1 — THE
 * SPATIAL CONSEQUENCE LAYER, owner ruling #8; the map→engine half of the dialogue
 * the urban-fabric layer opened engine→map).
 *
 * THE CONSTITUTIONAL SHAPE: the engine NEVER reads the render or the layout model
 * directly (the projection law survives). At generation time a compact SPATIAL
 * SUBSTRATE is derived from the settlement's ACTIVE town layout (spatialSubstrate.js,
 * the heavy leaf that imports the layout engine) and stored sidecar
 * `spatialLedgers.spatialSubstrate`. THIS module is the pure, ZERO-layout-import
 * reader the engine consumers use — the distanceRead.js sibling to spatialDigest.js:
 * it reads the frozen substrate straight off worldState and turns it into the two
 * derived shapes the consumers need (an adjacency×flammability diffusion field and a
 * deterministic wall breach), WITHOUT ever pulling the town-map builder. So the war
 * layer + the fabric scar reader import THIS leaf (no eager weight), and only the
 * derivation pass imports the builder.
 *
 * THE SUBSTRATE SHAPE (compact, prose-free, codepoint-stable — written by
 * spatialSubstrate.js#deriveSpatialSubstrate):
 *   {
 *     v: 1,                       // substrate schema version
 *     sig: string,               // structural signature (cheap re-derive invalidation)
 *     lyr: 1|2,                  // the ACTIVE layout law version it cohered with
 *     d: [{ id, cat, cx, cy, flam, den }],   // districts (sorted by id): category (the
 *                                            //   12-enum), centroid x/y (0..1000),
 *                                            //   flammability01, density01
 *     adj: { [id]: string[] },   // derived district adjacency (sorted neighbours)
 *     w:  [{ i, x1,y1,x2,y2, str, did }],   // wall segments (0..7 ring octants):
 *                                           //   endpoints, strength01, protected districtId|null
 *     g:  [{ x, y, seg }],       // gates: point + the wall-segment index it pierces
 *   }
 *
 * FIELDS, NOT ENTITIES (the design's core law): fire/siege/diffusion act as intensity
 * FIELDS over DISTRICTS, never per-building simulation. Everything here returns a
 * district-keyed 0..1 field or a segment pick — never an entity.
 *
 * DORMANCY: `spatialConsequenceActive` reads simulationRules.spatialConsequenceEnabled
 * === true, defensively (ABSENT from DEFAULT_SIMULATION_RULES — the urbanFabric/
 * npcGrowth virtual-flag precedent). Absent ⇒ false ⇒ no substrate is ever derived,
 * no sidecar key, every consumer no-ops ⇒ byte-identical (the dormancy golden proves
 * it). The flag is PRE-SIGNED to light at THE ONE REGEN (ruling #8); this lane never
 * lights it.
 *
 * Pure, deterministic, side-effect-free, rng-free, clock-free. No layout import, no
 * store, no React.
 */
import { getSpatialLedger } from './distanceRead.js';
import { compareCodepoint } from '../deterministicSort.js';
import { clamp01 } from '../../kernel/math.js';

/** @typedef {{ id: string, cat: string, cx: number, cy: number, flam: number, den: number }} SubDistrict */
/** @typedef {{ i: number, x1: number, y1: number, x2: number, y2: number, str: number, did: (string|null) }} SubWallSeg */
/** @typedef {{ x: number, y: number, seg: number }} SubGate */
/** @typedef {{ v: number, sig: string, lyr: number, d: SubDistrict[], adj: Record<string, string[]>,
 *   w: SubWallSeg[], g: SubGate[] }} SpatialSubstrate */

/** @param {unknown} v @returns {Record<string, unknown>} */
function asObject(v) {
  return v && typeof v === 'object' && !Array.isArray(v) ? /** @type {Record<string, unknown>} */ (v) : {};
}
/** @param {unknown} v @param {number} fallback @returns {number} */
function num(v, fallback) {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}

// ── THE DORMANCY GATE (constitutional) — the virtual, defensively-read flag ─────
/**
 * Is the spatial-consequence layer LIT? Reads simulationRules.spatialConsequenceEnabled
 * === true, defensively — ABSENT ⇒ false ⇒ DORMANT (byte-identical; NO default in
 * DEFAULT_SIMULATION_RULES). Mirrors urbanFabricActive / npcGrowthActive. Pure, total.
 * @param {{ simulationRules?: Record<string, unknown> }|null|undefined} worldState
 * @returns {boolean}
 */
export function spatialConsequenceActive(worldState) {
  const rules = worldState && typeof worldState === 'object' ? worldState.simulationRules : null;
  return !!(rules && typeof rules === 'object'
    && /** @type {Record<string, unknown>} */ (rules).spatialConsequenceEnabled === true);
}

// ── Substrate reads (normalized off the frozen sidecar) ────────────────────────
/**
 * The stored substrate for a settlement id, normalized, or null when absent/dark.
 * Tolerant of malformed/partial data (every field defaulted). EXPORTED for the
 * consumers + the pins.
 * @param {{ spatialLedgers?: unknown }|null|undefined} worldState @param {string} sid
 * @returns {SpatialSubstrate|null}
 */
export function substrateOf(worldState, sid) {
  const ledger = asObject(getSpatialLedger(/** @type {Record<string, unknown>} */ (worldState), 'spatialSubstrate'));
  const raw = ledger[String(sid)];
  if (raw == null) return null;
  return normalizeSubstrate(raw);
}

/** @param {unknown} raw @returns {SpatialSubstrate} */
export function normalizeSubstrate(raw) {
  const o = asObject(raw);
  /** @type {SubDistrict[]} */
  const d = (Array.isArray(o.d) ? o.d : []).map((e) => {
    const r = asObject(e);
    return {
      id: String(r.id ?? ''), cat: String(r.cat ?? 'other'),
      cx: num(r.cx, 0), cy: num(r.cy, 0),
      flam: clamp01(num(r.flam, 0)), den: clamp01(num(r.den, 0)),
    };
  }).filter((e) => e.id !== '');
  /** @type {Record<string, string[]>} */
  const adj = {};
  const rawAdj = asObject(o.adj);
  for (const id of Object.keys(rawAdj).sort(compareCodepoint)) {
    const list = Array.isArray(rawAdj[id]) ? /** @type {unknown[]} */ (rawAdj[id]) : [];
    adj[id] = list.filter((x) => typeof x === 'string').map(String).sort(compareCodepoint);
  }
  /** @type {SubWallSeg[]} */
  const w = (Array.isArray(o.w) ? o.w : []).map((e) => {
    const r = asObject(e);
    return {
      i: Math.floor(num(r.i, 0)), x1: num(r.x1, 0), y1: num(r.y1, 0), x2: num(r.x2, 0), y2: num(r.y2, 0),
      str: clamp01(num(r.str, 0.5)), did: typeof r.did === 'string' ? r.did : null,
    };
  });
  /** @type {SubGate[]} */
  const g = (Array.isArray(o.g) ? o.g : []).map((e) => {
    const r = asObject(e);
    return { x: num(r.x, 0), y: num(r.y, 0), seg: Math.floor(num(r.seg, 0)) };
  });
  return { v: Math.floor(num(o.v, 1)), sig: String(o.sig ?? ''), lyr: Math.floor(num(o.lyr, 1)), d, adj, w, g };
}

/** Does the settlement carry a populated substrate (≥1 district)? @param {SpatialSubstrate|null} sub */
export function hasSubstrate(sub) {
  return !!(sub && Array.isArray(sub.d) && sub.d.length > 0);
}

/** The district record for an id, or null. @param {SpatialSubstrate} sub @param {string} id */
export function districtOf(sub, id) {
  for (const dd of sub.d) if (dd.id === id) return dd;
  return null;
}

// ── THE ADJACENCY DIFFUSION FIELD (consumers a + c) ────────────────────────────
/**
 * Diffuse a seed intensity over the substrate's district adjacency graph — the
 * WHERE field the calamity toll (flammability-weighted) and the covert/rumor
 * pressure (plain adjacency) both read. A bounded number of hops, each hop
 * attenuated by `leash` (0..1), optionally multiplied per district by its
 * flammability (fire spreads to flammable neighbours). Returns a district-keyed
 * 0..1 field NORMALISED so its max is 1 (a WHERE partition — never a magnitude).
 * PURE, deterministic (codepoint-ordered accumulation).
 *
 * @param {SpatialSubstrate} sub
 * @param {Record<string, number>} seeds  district id → initial 0..1 intensity
 * @param {{ hops?: number, leash?: number, flammable?: boolean }} [opts]
 * @returns {Record<string, number>} district id → normalised 0..1 intensity
 */
export function diffuseField(sub, seeds, opts = {}) {
  const hops = Math.max(0, Math.floor(num(opts.hops, 2)));
  const leash = clamp01(num(opts.leash, 0.5));
  const flammable = opts.flammable === true;
  const flamOf = new Map(sub.d.map((dd) => [dd.id, dd.flam]));
  /** @type {Map<string, number>} */
  let field = new Map();
  for (const id of Object.keys(asObject(seeds)).sort(compareCodepoint)) {
    const v = clamp01(num(/** @type {Record<string, number>} */ (seeds)[id], 0));
    if (v > 0 && flamOf.has(id)) field.set(id, v);
  }
  // Each hop pushes leash-attenuated intensity to codepoint-sorted neighbours,
  // taking the MAX (a district's incidence is its strongest inbound path).
  for (let h = 0; h < hops; h++) {
    /** @type {Map<string, number>} */
    const next = new Map(field);
    for (const [id, v] of [...field.entries()].sort((a, b) => compareCodepoint(a[0], b[0]))) {
      const nbrs = Array.isArray(sub.adj[id]) ? sub.adj[id] : [];
      for (const nb of nbrs) {
        if (!flamOf.has(nb)) continue;
        const spread = v * leash * (flammable ? 0.5 + 0.5 * /** @type {number} */ (flamOf.get(nb)) : 1);
        const prev = next.get(nb) ?? 0;
        if (spread > prev) next.set(nb, spread);
      }
    }
    field = next;
  }
  // Normalise to a WHERE partition (max = 1) — the field shapes WHERE, never the
  // magnitude/total. An empty field stays empty (honest-null).
  let max = 0;
  for (const v of field.values()) if (v > max) max = v;
  /** @type {Record<string, number>} */
  const out = {};
  if (max <= 0) return out;
  for (const id of [...field.keys()].sort(compareCodepoint)) {
    const v = round4(field.get(id) ?? 0);
    if (v > 0) out[id] = round4((field.get(id) ?? 0) / max);
  }
  return out;
}

/** @param {number} v @returns {number} */
function round4(v) { return Math.round(num(v, 0) * 10000) / 10000; }

/** The single strongest district in a field (argmax, codepoint tiebreak), or null.
 *  @param {Record<string, number>} field @returns {string|null} */
export function peakDistrict(field) {
  let best = null;
  let bestV = 0;
  for (const id of Object.keys(asObject(field)).sort(compareCodepoint)) {
    const v = num(/** @type {Record<string, number>} */ (field)[id], 0);
    if (v > bestV) { best = id; bestV = v; }
  }
  return best;
}

// ── THE WALL BREACH (consumer b) ───────────────────────────────────────────────
/**
 * A stable per-pair attacker APPROACH octant (0..7), a deterministic hash of the
 * unordered besieger↔besieged id pair. The realm-map bearing would be more precise
 * but requires the (often-absent) spatial digest + pack in the war layer; a stable
 * per-pair octant keeps consumer (b) aspatial-safe and byte-identical when dark.
 * PURE. @param {string} a @param {string} b @returns {number} 0..7
 */
export function approachOctant(a, b) {
  const key = String(a) < String(b) ? `${a}|${b}` : `${b}|${a}`;
  return hash32(key) % 8;
}

/** FNV-1a 32-bit over a string — a deterministic, trig-free, rng-free hash (the
 *  codebase's codeDigit idiom generalised). Exported for the derivation signature.
 *  @param {string} s @returns {number} */
export function hash32(s) {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    // FNV prime multiply in 32-bit, avoiding BigInt (Math.imul is exact int32).
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0);
}

// How much a wall segment's ALIGNMENT to the attack matters vs its raw strength
// when picking the breach — both count (a weak segment far from the attack still
// resists; a strong segment dead ahead can still be forced). JUDGMENT (vetoable).
const BREACH_FACE_WEIGHT = 0.6;

/**
 * The breach segment: given the attacker's approach octant, the deterministic pick
 * over the substrate's 8 wall segments minimising (strength + FACE_WEIGHT ×
 * angular-misalignment) — the weakest segment facing the attack. Returns its
 * wallSegmentId + the districtId it protects, or null when the town has no walls in
 * the substrate (honest-null). PURE, deterministic (argmin, lower-index tiebreak).
 * @param {SpatialSubstrate} sub @param {number} approach  0..7
 * @returns {{ wallSegmentId: number, districtId: (string|null) }|null}
 */
export function resolveBreachSegment(sub, approach) {
  const segs = Array.isArray(sub.w) ? sub.w : [];
  if (segs.length === 0) return null;
  const ao = ((Math.floor(num(approach, 0)) % 8) + 8) % 8;
  let best = null;
  let bestScore = Infinity;
  for (const seg of segs) {
    // Segment i faces compass octant i (its outward bearing ≈ the mid-arc). The
    // angular distance to the approach octant on the 8-ring, 0..1.
    const raw = Math.abs((((seg.i % 8) + 8) % 8) - ao);
    const octDist = Math.min(raw, 8 - raw) / 4; // 0 (dead ahead) .. 1 (opposite)
    const score = clamp01(seg.str) + BREACH_FACE_WEIGHT * octDist;
    if (score < bestScore || (score === bestScore && best != null && seg.i < best.wallSegmentId)) {
      bestScore = score;
      best = { wallSegmentId: seg.i, districtId: seg.did };
    }
  }
  return best;
}
