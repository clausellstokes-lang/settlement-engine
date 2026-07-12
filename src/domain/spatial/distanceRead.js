/**
 * distanceRead.js — the PURE distance reader over a FROZEN spatial digest
 * (Phase 5.5 MODULATION, item 1).
 *
 * The keystone (spatialDigest.js) freezes an integer distance MATRIX between
 * settlements at canonize. This module turns that frozen geometry into the two
 * scalars the modulation seams consume, WITHOUT recomputing any geometry:
 *
 *   • hopWeeks(digest, fromId, toId)      — travel TIME in integer weeks
 *     (the §II.5-1 cost→weeks calibration): a typical PRIMARY-tier (adjacent)
 *     hop ≈ 1 week, SECONDARY ≈ 2–3, TERTIARY/distant ≈ 4+, the map diameter
 *     ≈ one season. The weeks-per-cost-unit CONSTANT is DERIVED from the
 *     digest's own primary-hop distance distribution at first read (memoized),
 *     never a magic number — see calibration() + calibrationReceipt().
 *
 *   • distanceWeight(digest, fromId, toId) — a 0..1 attenuation for channel-
 *     strength modulation, MONOTONE-decreasing in path cost and FLOORED (an
 *     established distant channel is weakened, never zeroed).
 *
 * FROZEN-vs-LIVE (design §III.2): the digest is immutable canon; this reader
 * NEVER mutates it. The calibration is a pure, deterministic function of the
 * frozen distanceMatrix, memoized on the digest OBJECT via a WeakMap purely as
 * a per-tick perf cache — the value is a pure function of the digest contents
 * regardless of memoization, so replay is byte-identical.
 *
 * PURE: no iframe, no tier/auth, no Date/Math.random. The domain stays tier-
 * blind; the entitlement + spatialCanonVersion gate lives at the CALL SITES
 * (pulseKernel / applyWorldPulse thread the digest only under the marker). This
 * module has NO heavy imports (it does not pull the digest BUILDER), so it adds
 * no weight to the canonize chunk and never reaches first paint.
 *
 * Field names read from the committed digest (verified against
 * spatialDigest.js#buildSpatialDigest, NOT the brief's guesses):
 *   - digest.distanceMatrix : sortedObject { [id]: { [neighbourId]: intCost } }
 *                             (self excluded; only finite/reachable pairs).
 *   - digest.tiers          : sortedObject { [id]: { [neighbourId]: 1|2|3 } }
 *                             (1 = primary/adjacent territory neighbour).
 */

// ── Calibration constants (the §II.5-1 anchors; retunable in the soak) ───────
// The MEDIAN primary-tier (adjacent) hop maps to this many weeks. Anchoring on
// the median primary hop (robust to outliers, unlike the map diameter) directly
// realizes the design's "a typical adjacent hop ≈ 1 week"; secondary/tertiary
// hops (2×/4× the median cost) then fall out at ≈2/≈4 weeks arithmetically.
export const PRIMARY_HOP_WEEKS_ANCHOR = 1;

// One season, for the diameter DIAGNOSTIC in the calibration receipt (the design
// wants "map diameter ≈ one season"; we anchor on the median primary hop and
// REPORT the resulting diameter-weeks rather than pinning both, which would
// over-constrain the fit).
export const SEASON_WEEKS = 13;

// Hard ceiling on a single hop's travel weeks — nothing sits in-transit longer
// than a YEAR regardless of a pathological diameter. Bounds the arrival-queue
// horizon (item 4).
export const MAX_HOP_WEEKS = 52;

// The distance-weight FLOOR: an established channel to the most distant reachable
// settlement retains at least this fraction of its strength (0.35). "The weight
// floor must not zero out an established channel" — a distant supplier weakens,
// never vanishes. Cross-checked by the weight-floor property test.
export const DISTANCE_WEIGHT_FLOOR = 0.35;

// Fallback median hop cost when a digest exposes no primary-tier pair at all
// (a single settlement, or a fully-disconnected placement). Keeps hopWeeks /
// distanceWeight total functions; such a digest never drives real modulation.
const DEFAULT_HOP_COST = 300;

/** @param {number} v */
const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);

/**
 * The frozen spatial digest, read-shape (only the fields this reader touches; the
 * full builder shape lives in spatialDigest.js).
 * @typedef {{ settlementIds?: string[],
 *   distanceMatrix?: Record<string, Record<string, number>>,
 *   tiers?: Record<string, Record<string, number>>,
 *   gates?: Array<{ between?: [string, string], cost?: number }> }} SpatialDigest
 */

/**
 * THE CONSTITUTIONAL GATE (design §III.2, dormancy law). Returns the frozen
 * spatial digest ONLY when a worldState carries BOTH the positive-integer
 * `spatialCanonVersion` marker (stamped solely by an entitled spatial canonize)
 * AND a real digest with a distance matrix. Absent ⇒ null ⇒ every caller keeps
 * its aspatial path BYTE-IDENTICAL. Every modulation seam keys on this ONE read
 * so the gate can never drift between seams.
 * @param {{ spatialCanonVersion?: number, spatialDigest?: SpatialDigest }|null|undefined} worldState
 * @returns {SpatialDigest|null} the digest, or null when spatial canon is not active.
 */
export function activeSpatialDigest(worldState) {
  const version = worldState?.spatialCanonVersion;
  if (!(typeof version === 'number' && Number.isInteger(version) && version > 0)) return null;
  const digest = worldState?.spatialDigest;
  if (!digest || typeof digest !== 'object') return null;
  if (!digest.distanceMatrix || typeof digest.distanceMatrix !== 'object') return null;
  return digest;
}

// Per-digest calibration memo. WeakMap ⇒ GC-friendly and keyed on identity; the
// stored value is a pure function of the digest contents (see calibration()).
/** @type {WeakMap<object, CalibrationReceipt>} */
const CALIBRATION_MEMO = new WeakMap();

/**
 * @typedef {Object} CalibrationReceipt
 * @property {number} weeksPerCost        the derived weeks-per-cost-unit constant.
 * @property {number} medianPrimaryHopCost median integer cost of a primary-tier hop.
 * @property {number} primaryHopCount     how many primary-tier pairs fed the median.
 * @property {number} diameterCost        the largest finite pairwise distance.
 * @property {number} diameterWeeks       diameterCost in weeks (the diagnostic).
 * @property {number} anchorWeeks         PRIMARY_HOP_WEEKS_ANCHOR (the fit target).
 * @property {number} floor               DISTANCE_WEIGHT_FLOOR.
 * @property {boolean} derived            true when real primary-hop data drove it.
 */

/** @param {unknown} v @returns {number|null} finite number or null */
function finiteNum(v) {
  return typeof v === 'number' && Number.isFinite(v) ? v : null;
}

/**
 * Codepoint-stable median of an integer list (lower-middle for even counts, so
 * the value is deterministic and is itself a real observed cost).
 * @param {number[]} sorted a pre-sorted ascending array
 */
function lowerMedian(sorted) {
  if (!sorted.length) return null;
  return sorted[Math.floor((sorted.length - 1) / 2)];
}

/**
 * Derive (and memoize) the calibration from the frozen digest's own distance
 * distribution. Deterministic: scans distanceMatrix + tiers in codepoint order,
 * takes the lower-median primary-hop cost as the anchor. Pure function of the
 * digest contents.
 * @param {SpatialDigest} digest
 * @returns {CalibrationReceipt}
 */
export function calibration(digest) {
  if (!digest || typeof digest !== 'object') {
    return {
      weeksPerCost: PRIMARY_HOP_WEEKS_ANCHOR / DEFAULT_HOP_COST,
      medianPrimaryHopCost: DEFAULT_HOP_COST,
      primaryHopCount: 0,
      diameterCost: 0,
      diameterWeeks: 0,
      anchorWeeks: PRIMARY_HOP_WEEKS_ANCHOR,
      floor: DISTANCE_WEIGHT_FLOOR,
      derived: false,
    };
  }
  const memo = CALIBRATION_MEMO.get(digest);
  if (memo) return memo;

  const distanceMatrix = digest.distanceMatrix && typeof digest.distanceMatrix === 'object' ? digest.distanceMatrix : {};
  const tiers = digest.tiers && typeof digest.tiers === 'object' ? digest.tiers : {};

  /** @type {number[]} */
  const primaryCosts = [];
  /** @type {number[]} */
  const allCosts = [];
  let diameterCost = 0;
  // Codepoint-sorted scan (Object.keys of a sortedObject is already sorted, but
  // sort defensively so the derivation never depends on insertion order).
  for (const fromId of Object.keys(distanceMatrix).sort()) {
    const row = distanceMatrix[fromId];
    if (!row || typeof row !== 'object') continue;
    const tierRow = tiers[fromId] && typeof tiers[fromId] === 'object' ? tiers[fromId] : {};
    for (const toId of Object.keys(row).sort()) {
      const cost = finiteNum(row[toId]);
      if (cost == null || cost <= 0) continue;
      allCosts.push(cost);
      if (cost > diameterCost) diameterCost = cost;
      // Count each unordered primary-tier pair ONCE (fromId < toId) so the median
      // isn't double-weighted by the symmetric matrix.
      if (Number(tierRow[toId]) === 1 && fromId < toId) primaryCosts.push(cost);
    }
  }

  primaryCosts.sort((a, b) => a - b);
  allCosts.sort((a, b) => a - b);
  const medianPrimaryHopCost = lowerMedian(primaryCosts) ?? lowerMedian(allCosts) ?? DEFAULT_HOP_COST;
  const weeksPerCost = PRIMARY_HOP_WEEKS_ANCHOR / medianPrimaryHopCost;

  /** @type {CalibrationReceipt} */
  const receipt = {
    weeksPerCost,
    medianPrimaryHopCost,
    primaryHopCount: primaryCosts.length,
    diameterCost,
    diameterWeeks: Math.round(diameterCost * weeksPerCost),
    anchorWeeks: PRIMARY_HOP_WEEKS_ANCHOR,
    floor: DISTANCE_WEIGHT_FLOOR,
    derived: primaryCosts.length > 0,
  };
  CALIBRATION_MEMO.set(digest, receipt);
  return receipt;
}

/**
 * The calibration RECEIPT for a digest — the "why this many weeks?" audit trail
 * the brief asks be recorded (the frozen digest is never mutated; this is the
 * receipt derived from it). Pure passthrough to calibration().
 * @param {SpatialDigest} digest
 * @returns {CalibrationReceipt}
 */
export function calibrationReceipt(digest) {
  return calibration(digest);
}

/**
 * Raw frozen integer distance between two settlements, or null when the pair is
 * unreachable / absent / identical. Pure matrix read.
 * @param {SpatialDigest} digest @param {string|number} fromId @param {string|number} toId
 * @returns {number|null}
 */
export function pathCost(digest, fromId, toId) {
  const a = String(fromId);
  const b = String(toId);
  if (a === b) return 0;
  const row = digest?.distanceMatrix?.[a];
  if (!row || typeof row !== 'object') return null;
  return finiteNum(row[b]);
}

/**
 * Travel time in integer WEEKS from `fromId` to `toId` over the frozen geometry.
 * A primary-tier hop ≈ PRIMARY_HOP_WEEKS_ANCHOR week; cost scales linearly by the
 * derived weeksPerCost; floored at 1 for any distinct reachable pair (no zero-
 * latency cross-settlement hop) and capped at MAX_HOP_WEEKS.
 *   - same settlement           ⇒ 0 (a local effect has no travel time).
 *   - unreachable / absent pair  ⇒ null (caller decides: no spatial delay).
 * @param {SpatialDigest} digest @param {string|number} fromId @param {string|number} toId
 * @returns {number|null}
 */
export function hopWeeks(digest, fromId, toId) {
  const cost = pathCost(digest, fromId, toId);
  if (cost == null) return null;
  if (cost === 0) return 0;
  const { weeksPerCost } = calibration(digest);
  const weeks = Math.round(cost * weeksPerCost);
  return Math.min(MAX_HOP_WEEKS, Math.max(1, weeks));
}

// Per-digest settlement-id membership memo (built once per digest object).
/** @type {WeakMap<object, Set<string>>} */
const MEMBERSHIP_MEMO = new WeakMap();

/** The set of settlement ids the digest actually mapped. @param {SpatialDigest} digest */
function membership(digest) {
  const memo = MEMBERSHIP_MEMO.get(digest);
  if (memo) return memo;
  const set = new Set((Array.isArray(digest?.settlementIds) ? digest.settlementIds : []).map(String));
  MEMBERSHIP_MEMO.set(digest, set);
  return set;
}

/** Is `id` a settlement the digest mapped? @param {SpatialDigest} digest @param {string|number} id */
export function isMapped(digest, id) {
  return membership(digest).has(String(id));
}

/**
 * distanceWeight, but a NO-OP (1.0) when EITHER endpoint isn't in the digest's
 * mapped settlement set. This is the constitutional distinction the modulation
 * seams need: an UNMAPPED settlement (id not in the frozen digest — not placed,
 * or an id that doesn't correspond to a digest node) must NOT be attenuated (it
 * would silently weaken every tie), whereas a MAPPED-but-distant pair attenuates
 * on the curve and a MAPPED-but-unreachable pair floors. Only genuinely-mapped
 * pairs are ever modulated.
 * @param {SpatialDigest} digest @param {string|number} from @param {string|number} to @returns {number}
 */
export function mappedDistanceWeight(digest, from, to) {
  const set = membership(digest);
  if (!set.has(String(from)) || !set.has(String(to))) return 1.0;
  return distanceWeight(digest, from, to);
}

/**
 * A 0..1 attenuation of channel strength by distance: MONOTONE-decreasing in
 * path cost, exactly 1.0 for any hop at or below the median primary-hop cost
 * (adjacent ties are unattenuated), decaying toward — but never below —
 * DISTANCE_WEIGHT_FLOOR for the most distant reachable settlement.
 *
 *   weight(d) = FLOOR + (1 - FLOOR) · m / max(m, d)      (m = median primary hop)
 *
 * At d ≤ m ⇒ 1.0; at d = 2m ⇒ FLOOR + (1-FLOOR)/2; as d → ∞ ⇒ FLOOR. Documented,
 * closed-form, and trivially monotone (m/max(m,d) is non-increasing in d).
 *   - same settlement           ⇒ 1.0 (no self-attenuation).
 *   - unreachable / absent pair  ⇒ FLOOR (maximally distant, but never zero).
 * @param {SpatialDigest} digest @param {string|number} fromId @param {string|number} toId
 * @returns {number} in [FLOOR, 1].
 */
export function distanceWeight(digest, fromId, toId) {
  const cost = pathCost(digest, fromId, toId);
  if (cost == null) return DISTANCE_WEIGHT_FLOOR; // unreachable ⇒ maximally attenuated (floored)
  if (cost <= 0) return 1.0;                       // same settlement / adjacent-cheap ⇒ full
  const { medianPrimaryHopCost: m } = calibration(digest);
  const ratio = m / Math.max(m, cost); // in (0, 1], non-increasing in cost
  return clamp01(DISTANCE_WEIGHT_FLOOR + (1 - DISTANCE_WEIGHT_FLOOR) * ratio);
}

// A tie is "materially attenuated" (worth surfacing distance for) once its weight
// drops below this — i.e. it has lost more than ~15% of its strength to distance.
export const MATERIAL_ATTENUATION = 0.85;

/**
 * LEGIBILITY (5.5-M item 5): a DM-facing distance read for a mapped tie, or null
 * when the endpoints aren't both mapped or the distance doesn't materially matter
 * (adjacent ties read exactly as before — no phrase). Reuses the weeks/weight the
 * modulation already computes; surfaces "a distant supplier (≈N weeks away)" where
 * it now bites. Pure; lazy-surface only.
 * @param {SpatialDigest} digest @param {string|number} fromId @param {string|number} toId
 * @returns {{ weeks:number, weight:number, band:string, phrase:string }|null}
 */
export function distanceLegibility(digest, fromId, toId) {
  const weight = mappedDistanceWeight(digest, fromId, toId);
  if (weight >= MATERIAL_ATTENUATION) return null; // adjacent / unmapped ⇒ nothing to say
  const weeks = hopWeeks(digest, fromId, toId);
  const w = weeks == null ? MAX_HOP_WEEKS : weeks;
  const band = w >= 4 ? 'distant' : 'regional';
  const label = band === 'distant' ? 'a distant supplier' : 'a regional supplier';
  const phrase = `${label} (≈${w} week${w === 1 ? '' : 's'} away)`;
  return { weeks: w, weight, band, phrase };
}

// ── The k-shortest CANDIDATE ROUTE seam (the danger-routing re-score input) ────
// The keystone digest freezes the settlement geometry but ships NO alternate-route
// cache (it has territory/gates/tiers/distanceMatrix/routeReceipts — verified
// against buildSpatialDigest). The M1 cheap-vs-safe re-score needs CANDIDATE routes
// per O-D pair; per §II.4 they are "cached at canonize, never re-pathfound per
// tick." We DERIVE them deterministically from the frozen `gates` (the sparse
// settlement adjacency) — a pure function of the immutable digest — and MEMOIZE
// them on the digest object (WeakMap, keyed by identity), so the derivation runs
// once per pair and every per-tick read is a cache hit. No keystone amendment.

// How many candidate routes to cache per O-D pair (the primary + up to K-1
// single-edge-detour alternates). Small: a mover picks among a few plausible roads.
export const K_CANDIDATES = 3;

/** The frozen digest's gate adjacency (id → Map(neighbourId → integer cost)),
 *  memoized per digest object. Pure derivation from digest.gates. */
/** @type {WeakMap<object, Map<string, Map<string, number>>>} */
const ADJ_MEMO = new WeakMap();
/** @param {SpatialDigest} digest @returns {Map<string, Map<string, number>>} */
function gateAdjacency(digest) {
  const memo = ADJ_MEMO.get(/** @type {object} */ (digest));
  if (memo) return memo;
  /** @type {Map<string, Map<string, number>>} */
  const adj = new Map();
  const link = (/** @type {string} */ a, /** @type {string} */ b, /** @type {number} */ cost) => {
    if (!adj.has(a)) adj.set(a, new Map());
    const m = /** @type {Map<string, number>} */ (adj.get(a));
    const prev = m.get(b);
    if (prev == null || cost < prev) m.set(b, cost);
  };
  const gates = Array.isArray(digest?.gates) ? digest.gates : [];
  for (const g of gates) {
    const pair = Array.isArray(g?.between) ? g.between : [];
    const a = pair[0] == null ? null : String(pair[0]);
    const b = pair[1] == null ? null : String(pair[1]);
    const cost = finiteNum(g?.cost);
    if (a == null || b == null || a === b || cost == null || cost < 0) continue;
    link(a, b, cost);
    link(b, a, cost);
  }
  if (digest && typeof digest === 'object') ADJ_MEMO.set(/** @type {object} */ (digest), adj);
  return adj;
}

/**
 * Deterministic Dijkstra over the gate adjacency: the cheapest path a→b avoiding a
 * set of undirected edges (encoded "lo|hi"). Tie-breaks (equal tentative cost) keep
 * the LOWER-codepoint predecessor, and the frontier pops the lowest cost then lowest
 * codepoint node — so the result is a pure function of the graph, not heap order.
 * @param {Map<string, Map<string, number>>} adj @param {string} from @param {string} to
 * @param {Set<string>} blockedEdges
 * @returns {{ path: string[], cost: number }|null}
 */
function shortestPath(adj, from, to, blockedEdges) {
  if (from === to) return { path: [from], cost: 0 };
  /** @type {Map<string, number>} */
  const dist = new Map([[from, 0]]);
  /** @type {Map<string, string>} */
  const prev = new Map();
  /** @type {Set<string>} */
  const done = new Set();
  for (;;) {
    // Pick the un-finalized node with the lowest (cost, codepoint id).
    let u = null;
    let best = Infinity;
    for (const [node, d] of dist) {
      if (done.has(node)) continue;
      if (d < best || (d === best && (u == null || node < u))) { best = d; u = node; }
    }
    if (u == null) break;
    if (u === to) break;
    done.add(u);
    const nbrs = adj.get(u);
    if (!nbrs) continue;
    for (const nb of [...nbrs.keys()].sort()) {
      if (done.has(nb)) continue;
      const edgeKey = u < nb ? `${u}|${nb}` : `${nb}|${u}`;
      if (blockedEdges.has(edgeKey)) continue;
      const w = /** @type {number} */ (nbrs.get(nb));
      const cand = best + w;
      const known = dist.has(nb) ? /** @type {number} */ (dist.get(nb)) : Infinity;
      // Strict-less updates; equal-cost keeps the lower-codepoint predecessor.
      if (cand < known || (cand === known && u < /** @type {string} */ (prev.get(nb) ?? '￿'))) {
        dist.set(nb, cand);
        prev.set(nb, u);
      }
    }
  }
  // We break exactly when `to` is the minimum un-finalized node (its dist optimal)
  // or when the frontier empties; in the latter case `to` never received a finite
  // dist. So a present dist for `to` is both reachable AND optimal.
  if (!dist.has(to)) return null;
  /** @type {string[]} */
  const path = [to];
  let cur = to;
  while (cur !== from) {
    const p = prev.get(cur);
    if (p == null) return null;
    path.push(p);
    cur = p;
  }
  path.reverse();
  return { path, cost: /** @type {number} */ (dist.get(to)) };
}

/** @param {{ path: string[], cost: number }} r */
const routeSig = (r) => r.path.join('>');

/** Per-digest candidate-route cache: digest → (`from|to|k` → routes). */
/** @type {WeakMap<object, Map<string, Array<{ path: string[], cost: number }>>>} */
const CANDIDATE_MEMO = new WeakMap();

/**
 * The k cheapest candidate routes between two settlements over the frozen geometry:
 * the shortest path plus single-edge-detour alternates (each avoids one edge of the
 * primary, yielding a genuinely different — usually longer — road), deduped and
 * ranked by (cost asc, codepoint path). A pure function of the frozen digest,
 * MEMOIZED per (digest, pair) so it is derived once and re-scored (never re-solved)
 * per tick. Empty when the pair is unreachable / unmapped.
 * @param {SpatialDigest} digest @param {string|number} fromId @param {string|number} toId
 * @param {number} [k]
 * @returns {Array<{ path: string[], cost: number }>}
 */
export function candidateRoutes(digest, fromId, toId, k = K_CANDIDATES) {
  const from = String(fromId);
  const to = String(toId);
  const kk = Number.isInteger(k) && k > 0 ? k : K_CANDIDATES;
  if (!digest || typeof digest !== 'object') return from === to ? [{ path: [from], cost: 0 }] : [];
  let byPair = CANDIDATE_MEMO.get(/** @type {object} */ (digest));
  if (!byPair) { byPair = new Map(); CANDIDATE_MEMO.set(/** @type {object} */ (digest), byPair); }
  const cacheKey = `${from}|${to}|${kk}`;
  const cached = byPair.get(cacheKey);
  if (cached) return cached;

  /** @type {Array<{ path: string[], cost: number }>} */
  let routes = [];
  if (from === to) {
    routes = [{ path: [from], cost: 0 }];
  } else {
    const adj = gateAdjacency(digest);
    const primary = shortestPath(adj, from, to, new Set());
    if (primary) {
      routes.push(primary);
      const seen = new Set([routeSig(primary)]);
      // Remove each edge of the primary in turn → the cheapest detour around it.
      for (let i = 0; i + 1 < primary.path.length; i++) {
        const a = primary.path[i];
        const b = primary.path[i + 1];
        const edgeKey = a < b ? `${a}|${b}` : `${b}|${a}`;
        const alt = shortestPath(adj, from, to, new Set([edgeKey]));
        if (alt && !seen.has(routeSig(alt))) { routes.push(alt); seen.add(routeSig(alt)); }
      }
      routes.sort((x, y) => (x.cost - y.cost) || (routeSig(x) < routeSig(y) ? -1 : routeSig(x) > routeSig(y) ? 1 : 0));
      routes = routes.slice(0, kk);
    }
  }
  byPair.set(cacheKey, routes);
  return routes;
}
