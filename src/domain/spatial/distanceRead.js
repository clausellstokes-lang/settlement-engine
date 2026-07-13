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
 *
 * SEASONS-B (M3): a NEW digest may carry a frozen `reserved.seasonalOverlay`
 * (a per-season × per-terrain cost LAW). When present, the OPTIONAL `season`
 * argument on pathCost/hopWeeks (and seasonalPathCost, used by the route
 * re-score) applies a MULTIPLICATIVE, terrain-weighted, FINITE surcharge at READ
 * TIME — the frozen distanceMatrix is never re-baked. A digest WITHOUT the
 * overlay (every pre-M3 canon / golden) reads with multiplier 1.0 ⇒ byte-
 * identical, whether or not a season is threaded (the dormancy gate).
 *
 * The seasonal READ (the terrain-weighted blend) lives HERE, reading the cost law
 * straight off the frozen overlay object (self-describing) — so this reader keeps
 * its "no heavy imports" leaf property (importing spatialCost would give that
 * module a second distinct-chunk importer and force it into a shared chunk, adding
 * eager first-paint bytes). The builder side (the cost table + buildSeasonalOverlay)
 * stays in spatialCost.
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
 *   gates?: Array<{ between?: [string, string], cost?: number }>,
 *   routeReceipts?: Record<string, { cost?: number, byTerrain?: Record<string, number> }>,
 *   reserved?: { seasonalOverlay?: SeasonalOverlay | null, seaLanes?: SeaLanes | null } }} SpatialDigest
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

// ── The SPATIAL LEDGER NAMESPACE accessors (Phase 5.5 FP-R) ────────────────────
// `worldState.spatialLedgers` is the ONE conditional container for every Phase 5.5
// spatial mover ledger — spatialArrivals (arrival queue), rumorLedgers (STEP 3.5),
// beliefMaps (WAVE A), embattlement (M1), supplyShipments (M2), and every FUTURE
// mover's ledger. Nesting the family under a single key means ensureWorldState's
// eager CONDITIONAL_LEDGER_KEYS array carries ONE name for all of them, so a new
// mover ledger costs ZERO first-paint bytes (it just nests here). These accessors
// live in this zero-import spatial-worldState-read leaf (the sibling of
// activeSpatialDigest, which likewise reads the spatial marker off worldState) so
// they add no first-paint bytes and no new lazy chunk. DORMANCY: the namespace is
// materialized ONLY when ≥1 sub-ledger is present (ensureWorldState's
// deepCloneConditionalLedger drops an empty object; dropSpatialLedger drops the
// whole namespace when its last sub-ledger drains) ⇒ an aspatial/legacy campaign
// carries no `spatialLedgers` key and serializes byte-identically.

/**
 * The live namespace object, or null when absent/garbage. Central guard so every
 * accessor treats a missing / non-object `spatialLedgers` identically.
 * @param {Record<string, unknown> | null | undefined} worldState
 * @returns {Record<string, unknown> | null}
 */
function spatialLedgerNamespace(worldState) {
  if (!worldState || typeof worldState !== 'object') return null;
  const ns = /** @type {Record<string, unknown>} */ (worldState).spatialLedgers;
  return ns && typeof ns === 'object' && !Array.isArray(ns)
    ? /** @type {Record<string, unknown>} */ (ns)
    : null;
}

/**
 * Is a named spatial ledger present? The faithful replacement for the old
 * `'<key>' in worldState` guard — it preserves the present-but-empty vs ABSENT
 * distinction the mover change-detectors rely on (prior = ledger vs prior = null).
 * @param {Record<string, unknown> | null | undefined} worldState
 * @param {string} key
 * @returns {boolean}
 */
export function hasSpatialLedger(worldState, key) {
  const ns = spatialLedgerNamespace(worldState);
  return !!ns && key in ns;
}

/**
 * Read a named spatial ledger, or undefined when absent. The replacement for the
 * old top-level `worldState.<key>` read.
 * @param {Record<string, unknown> | null | undefined} worldState
 * @param {string} key
 * @returns {unknown}
 */
export function getSpatialLedger(worldState, key) {
  const ns = spatialLedgerNamespace(worldState);
  return ns ? ns[key] : undefined;
}

/**
 * Fold a named spatial ledger onto worldState, creating the namespace if absent.
 * Returns a NEW worldState (never mutates). Replacement for
 * `{ ...worldState, <key>: value }`.
 * @param {Record<string, unknown>} worldState
 * @param {string} key
 * @param {unknown} value
 * @returns {Record<string, unknown>}
 */
export function setSpatialLedger(worldState, key, value) {
  const ns = spatialLedgerNamespace(worldState);
  return { ...worldState, spatialLedgers: { ...(ns || {}), [key]: value } };
}

/**
 * Drop a named spatial ledger. When it was the LAST sub-ledger, drop the whole
 * `spatialLedgers` namespace so an emptied world stays byte-identical to a dormant
 * one. A no-op (returns the same reference) when the key is already absent —
 * matching the old `else if ('<key>' in worldState)` guard.
 * @param {Record<string, unknown>} worldState
 * @param {string} key
 * @returns {Record<string, unknown>}
 */
export function dropSpatialLedger(worldState, key) {
  const ns = spatialLedgerNamespace(worldState);
  if (!ns || !(key in ns)) return worldState;
  const { [key]: _drop, ...rest } = ns;
  if (Object.keys(rest).length === 0) {
    const { spatialLedgers: _dropNs, ...worldRest } = worldState;
    return worldRest;
  }
  return { ...worldState, spatialLedgers: rest };
}

/** The codepoint-stable unordered pair key (matches the digest's routeReceipts keys). */
/** @param {string} a @param {string} b @returns {string} */
function pairKey(a, b) {
  return a < b ? `${a}|${b}` : `${b}|${a}`;
}

/** Add a directed edge a→b to an adjacency map, keeping the CHEAPEST cost on a
 *  parallel edge. Shared by gateAdjacency (land gates) + seaLaneAdjacency (sea edges).
 *  @param {Map<string, Map<string, number>>} adj @param {string} a @param {string} b @param {number} cost */
function linkMin(adj, a, b, cost) {
  if (!adj.has(a)) adj.set(a, new Map());
  const m = /** @type {Map<string, number>} */ (adj.get(a));
  const prev = m.get(b);
  if (prev == null || cost < prev) m.set(b, cost);
}

/**
 * @typedef {{ version?: number, seasonTerrainCost?: Record<string, Record<string, number>> }} SeasonalOverlay
 */

/**
 * THE SEASONAL DORMANCY GATE (M3). Returns the frozen `seasonalOverlay` cost law
 * ONLY when the digest carries a populated, versioned overlay (a NEW canon built
 * by the entitled M3 re-canonize). EVERY pre-M3 digest — every committed golden —
 * has `reserved.seasonalOverlay = null`, so this returns null ⇒ every seasonal
 * read below is multiplier 1.0 ⇒ the pre-M3 cost path EXACTLY (byte-identical).
 * @param {SpatialDigest & { reserved?: { seasonalOverlay?: unknown } } | null | undefined} digest
 * @returns {SeasonalOverlay | null}
 */
export function activeSeasonalOverlay(digest) {
  const ov = /** @type {{ reserved?: { seasonalOverlay?: unknown } } | null | undefined} */ (digest)?.reserved?.seasonalOverlay;
  if (!ov || typeof ov !== 'object') return null;
  const overlay = /** @type {SeasonalOverlay} */ (ov);
  // A populated, positive-versioned overlay is active. The gate is forward-
  // compatible: the overlay is SELF-DESCRIBING (carries its own seasonTerrainCost),
  // so the reader honours any version's own frozen law rather than pinning one M3
  // constant — no cross-module import needed for the gate.
  if (!(typeof overlay.version === 'number' && Number.isInteger(overlay.version) && overlay.version >= 1)) return null;
  if (!overlay.seasonTerrainCost || typeof overlay.seasonTerrainCost !== 'object') return null;
  return overlay;
}

/**
 * The FINITE seasonal multiplier for one terrain class in one season, read off a
 * frozen overlay's own cost law. Unknown season/class ⇒ 1.0. Always ≥ 1 and ≤ the
 * overlay's table max (SLOW, NOT SEVER) by construction.
 * @param {SeasonalOverlay | null | undefined} overlay
 * @param {string|null|undefined} season @param {string|null|undefined} terrainClass
 * @returns {number}
 */
function seasonTerrainFactor(overlay, season, terrainClass) {
  const table = overlay && overlay.seasonTerrainCost;
  const row = table && season != null ? table[String(season)] : null;
  const v = row && terrainClass != null ? row[String(terrainClass)] : undefined;
  return typeof v === 'number' && Number.isFinite(v) && v > 0 ? v : 1;
}

/**
 * The cost-weighted seasonal multiplier for a route/edge whose cost breaks down by
 * terrain class (a routeReceipt's `byTerrain`): a weighted average of the per-class
 * factors — a mostly-mountain hop reads near the mountain factor, a plains hop near
 * 1. FINITE, in [1, the table max]; empty/absent composition ⇒ 1.0.
 * @param {SeasonalOverlay | null | undefined} overlay
 * @param {Record<string, number> | null | undefined} byTerrain
 * @param {string|null|undefined} season
 * @returns {number}
 */
export function terrainBlendMultiplier(overlay, byTerrain, season) {
  if (!overlay || season == null || !byTerrain || typeof byTerrain !== 'object') return 1;
  let num = 0;
  let den = 0;
  for (const cls of Object.keys(byTerrain)) {
    const cost = byTerrain[cls];
    if (!(typeof cost === 'number' && Number.isFinite(cost) && cost > 0)) continue;
    num += cost * seasonTerrainFactor(overlay, season, cls);
    den += cost;
  }
  return den > 0 ? num / den : 1;
}

// ── SEA LANES (M8): the self-describing frozen slot read (mirror the seasonal read) ─
// Like the seasonal overlay, the seaLanes slot is SELF-DESCRIBING — it carries its
// own version + ports + edge set + storm-season law — so this leaf reader honours
// the frozen slot straight off the digest object WITHOUT importing the seaLanes
// builder (which pulls the institution catalog). A pre-M8 digest has
// `reserved.seaLanes = null` ⇒ every read below is inert ⇒ byte-identical.

/**
 * @typedef {{ version?: number, ports?: string[],
 *   edges?: Array<{ between?: [string, string], cost?: number, capacity?: number }>,
 *   stormSeasonCost?: Record<string, number> }} SeaLanes
 */

/**
 * THE SEA-LANE DORMANCY GATE (M8). Returns the frozen seaLanes edge set ONLY when
 * the digest carries a populated, versioned slot (a NEW canon built by the entitled
 * M8 re-canonize with ≥2 eligible ports). EVERY pre-M8 digest — every committed
 * golden — has `reserved.seaLanes = null`, so this returns null ⇒ the sea-augmented
 * routing + storm read are dormant ⇒ the pre-M8 land path EXACTLY (byte-identical).
 * @param {SpatialDigest & { reserved?: { seaLanes?: unknown } } | null | undefined} digest
 * @returns {SeaLanes | null}
 */
export function activeSeaLanes(digest) {
  const sl = /** @type {{ reserved?: { seaLanes?: unknown } } | null | undefined} */ (digest)?.reserved?.seaLanes;
  if (!sl || typeof sl !== 'object') return null;
  const lanes = /** @type {SeaLanes} */ (sl);
  if (!(typeof lanes.version === 'number' && Number.isInteger(lanes.version) && lanes.version >= 1)) return null;
  if (!Array.isArray(lanes.edges) || lanes.edges.length === 0) return null;
  return lanes;
}

// Per-digest port-id set memo ⇒ isPort is O(1) (the pathCost hot-loop gate reads it).
/** @type {WeakMap<object, Set<string>>} */
const PORT_SET_MEMO = new WeakMap();
/** @param {SpatialDigest} digest @returns {Set<string>} */
function portSet(digest) {
  const lanes = activeSeaLanes(digest);
  if (!lanes || !Array.isArray(lanes.ports)) return EMPTY_STRING_SET;
  const memo = PORT_SET_MEMO.get(/** @type {object} */ (digest));
  if (memo) return memo;
  const set = new Set(lanes.ports.map(String));
  if (digest && typeof digest === 'object') PORT_SET_MEMO.set(/** @type {object} */ (digest), set);
  return set;
}
const EMPTY_STRING_SET = /** @type {Set<string>} */ (new Set());

/** Is `id` an eligible PORT (a node the frozen seaLanes set connects)? O(1). @param {SpatialDigest} digest @param {string|number} id */
export function isPort(digest, id) {
  return portSet(digest).has(String(id));
}

// Per-digest sea-lane adjacency memo (id → Map(portId → integer lane cost)). Pure
// derivation from the frozen edge set; memoized on the digest object (identity).
/** @type {WeakMap<object, Map<string, Map<string, number>>>} */
const SEA_ADJ_MEMO = new WeakMap();
/** @param {SpatialDigest} digest @returns {Map<string, Map<string, number>>} */
export function seaLaneAdjacency(digest) {
  const lanes = activeSeaLanes(digest);
  if (!lanes) return new Map();
  const memo = SEA_ADJ_MEMO.get(/** @type {object} */ (digest));
  if (memo) return memo;
  /** @type {Map<string, Map<string, number>>} */
  const adj = new Map();
  // activeSeaLanes already guarantees a non-empty edges array (?? [] only satisfies
  // the optional-typed field for strict — never taken at runtime).
  for (const e of lanes.edges ?? []) {
    const pair = Array.isArray(e?.between) ? e.between : [];
    const a = pair[0] == null ? null : String(pair[0]);
    const b = pair[1] == null ? null : String(pair[1]);
    const cost = finiteNum(e?.cost);
    if (a == null || b == null || a === b || cost == null || cost <= 0) continue;
    linkMin(adj, a, b, cost); linkMin(adj, b, a, cost);
  }
  if (digest && typeof digest === 'object') SEA_ADJ_MEMO.set(/** @type {object} */ (digest), adj);
  return adj;
}

// Per-digest ship-carrier neighbour-map memo (the derivation is digest-invariant).
/** @type {WeakMap<object, Map<string, Array<{ neighbourId: string, edgeId: string }>>>} */
const SEA_NBR_MEMO = new WeakMap();

/**
 * The port-to-port neighbour map for the SHIP-CREW rumor carrier (round 9): each
 * port → its sea-lane-connected ports, codepoint-sorted, edge-prefixed 'sea' so the
 * carrier's edge ids never collide with the trade/army/criminal lanes. EMPTY when
 * the seaLanes slot is dormant ⇒ the ship lane never fires ⇒ byte-identical. News
 * over these lanes travels at the SEA-AWARE hopWeeks (fast — the cheap lane cost),
 * so two ports gossip across a sea the land takes a season to walk around.
 * @param {SpatialDigest} digest
 * @returns {Map<string, Array<{ neighbourId: string, edgeId: string }>>}
 */
export function seaLaneNeighbourMap(digest) {
  if (digest && typeof digest === 'object') {
    const memo = SEA_NBR_MEMO.get(/** @type {object} */ (digest));
    if (memo) return memo;
  }
  const adj = seaLaneAdjacency(digest);
  /** @type {Map<string, Array<{ neighbourId: string, edgeId: string }>>} */
  const out = new Map();
  for (const [node, nbrs] of adj) {
    out.set(node, [...nbrs.keys()].sort().map((neighbourId) => ({
      neighbourId,
      edgeId: node < neighbourId ? `sea.${node}.${neighbourId}` : `sea.${neighbourId}.${node}`,
    })));
  }
  if (digest && typeof digest === 'object') SEA_NBR_MEMO.set(/** @type {object} */ (digest), out);
  return out;
}

/**
 * The STORM-SEASON multiplier for a sea lane in a season, read off the slot's own
 * self-describing law. Unknown/absent season ⇒ 1.0. Always ≥ 1 (slow, not sever).
 * @param {SeaLanes | null | undefined} lanes @param {string|null|undefined} season @returns {number}
 */
function stormSeasonFactor(lanes, season) {
  const table = lanes && lanes.stormSeasonCost;
  const v = table && season != null ? table[String(season)] : undefined;
  return typeof v === 'number' && Number.isFinite(v) && v >= 1 ? v : 1;
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
 * Frozen integer distance between two settlements, or null when the pair is
 * unreachable / absent / identical.
 *
 * SEASONS-B (M3): with an OPTIONAL `season` AND a seasonalOverlay on the digest,
 * the frozen base cost is multiplied by the route's terrain-weighted seasonal
 * factor at READ TIME (never re-baking the matrix). No season, or no overlay (any
 * pre-M3 digest) ⇒ the raw frozen distance, byte-identical.
 * @param {SpatialDigest} digest @param {string|number} fromId @param {string|number} toId
 * @param {string|null} [season]
 * @returns {number|null}
 */
export function pathCost(digest, fromId, toId, season = null) {
  const a = String(fromId);
  const b = String(toId);
  if (a === b) return 0;
  const row = digest?.distanceMatrix?.[a];
  const landBase = row && typeof row === 'object' ? finiteNum(row[b]) : null;
  const seaLanes = activeSeaLanes(digest);
  const overlay = activeSeasonalOverlay(digest);

  // ── FAST PATH — no read-time surcharge to apply (no season; or neither overlay nor
  // sea lanes). Returns the sea-aware base with an O(1) gate. SEA LANES (M8): escalate
  // to the sea-augmented route ONLY when the slot is lit AND at least one endpoint is a
  // PORT (a sea lane can only shorten/reach a route that embarks at a port), so a
  // landlocked↔landlocked pair keeps the O(1) frozen-matrix read — the
  // distanceWeight/tradeSalience/religiousContest hot-loop guard. Dormant (pre-M8, or a
  // non-port pair) ⇒ the branch is skipped ⇒ the land distance EXACTLY (byte-identical).
  if (season == null || (!overlay && !seaLanes)) {
    let base = landBase != null && landBase > 0 ? landBase : null;
    if (seaLanes && (isPort(digest, a) || isPort(digest, b))) {
      const routes = candidateRoutes(digest, a, b, 1);
      const seaCost = routes.length ? finiteNum(routes[0].cost) : null;
      if (seaCost != null && seaCost > 0 && (base == null || seaCost < base)) base = seaCost;
    }
    return base;
  }

  // ── SEASONAL / STORM SURCHARGE PATH — an overlay or sea lanes, and a season. Draw
  // BOTH the base cost AND the season blend from ONE consistent cheapest route
  // (candidateRoutes — land-only pre-M8, sea-augmented on a lit world; the SAME call
  // M3 already ran per seasonal read, so no new hot-loop cost). The frozen distance
  // matrix is NEVER re-baked. Land hops weather the seasonal terrain law; sea hops the
  // storm law (pathSeasonMultiplier), so base + multiplier ride the SAME road.
  const routes = candidateRoutes(digest, a, b, 1);
  let base = landBase != null && landBase > 0 ? landBase : null;
  let routePath = [a, b];
  if (routes.length) {
    const routeCost = finiteNum(routes[0].cost);
    if (routeCost != null && routeCost > 0 && (base == null || routeCost <= base)) {
      base = routeCost;
      routePath = routes[0].path;
    }
  }
  if (base == null || base <= 0) return base;
  return Math.round(base * pathSeasonMultiplier(digest, routePath, season));
}

/**
 * Travel time in integer WEEKS from `fromId` to `toId` over the frozen geometry.
 * A primary-tier hop ≈ PRIMARY_HOP_WEEKS_ANCHOR week; cost scales linearly by the
 * derived weeksPerCost; floored at 1 for any distinct reachable pair (no zero-
 * latency cross-settlement hop) and capped at MAX_HOP_WEEKS.
 *   - same settlement           ⇒ 0 (a local effect has no travel time).
 *   - unreachable / absent pair  ⇒ null (caller decides: no spatial delay).
 *
 * SEASONS-B (M3): the OPTIONAL `season` rides the season-aware pathCost, so a
 * winter route over mountains lengthens (info runs cold) while the calibration
 * (weeks-per-cost) stays the frozen geometric anchor. No season / no overlay ⇒
 * the geometric weeks, byte-identical. Still floored ≥ 1 and capped at
 * MAX_HOP_WEEKS — so even a max-winter mountain hop is SLOW, never infinite.
 * @param {SpatialDigest} digest @param {string|number} fromId @param {string|number} toId
 * @param {string|null} [season]
 * @returns {number|null}
 */
export function hopWeeks(digest, fromId, toId, season = null) {
  const cost = pathCost(digest, fromId, toId, season);
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

/** The frozen digest's LAND gate adjacency (id → Map(neighbourId → integer cost)),
 *  memoized per digest object. Pure derivation from digest.gates — land only, so a
 *  purely inland trip routes overland (the sea graph is a SEPARATE, port-gated
 *  augmentation; see augmentedAdjacency). Pre-M8 + inland routing is byte-identical. */
/** @type {WeakMap<object, Map<string, Map<string, number>>>} */
const ADJ_MEMO = new WeakMap();
/** @param {SpatialDigest} digest @returns {Map<string, Map<string, number>>} */
function gateAdjacency(digest) {
  const memo = ADJ_MEMO.get(/** @type {object} */ (digest));
  if (memo) return memo;
  /** @type {Map<string, Map<string, number>>} */
  const adj = new Map();
  const gates = Array.isArray(digest?.gates) ? digest.gates : [];
  for (const g of gates) {
    const pair = Array.isArray(g?.between) ? g.between : [];
    const a = pair[0] == null ? null : String(pair[0]);
    const b = pair[1] == null ? null : String(pair[1]);
    const cost = finiteNum(g?.cost);
    if (a == null || b == null || a === b || cost == null || cost < 0) continue;
    linkMin(adj, a, b, cost);
    linkMin(adj, b, a, cost);
  }
  if (digest && typeof digest === 'object') ADJ_MEMO.set(/** @type {object} */ (digest), adj);
  return adj;
}

// SEA LANES (M8): the AUGMENTED routing graph = the land gates PLUS the frozen water
// edge set, memoized. Used ONLY for a trip INVOLVING a port (routingAdjacency gates on
// isPort) — an island port becomes reachable (isolation inversion) and a cheap sea lane
// wins over a long land haul, while a purely inland↔inland trip keeps the land-only
// gateAdjacency (the v1 model + the hot-loop guard). Domination is pruned at BUILD time
// (a dominated sea lane is never emitted), so a folded sea edge is only ever the CHEAPER
// of land/sea for its pair — the storm-vs-terrain attribution in pathSeasonMultiplier is
// therefore always correct. Dormant (no sea lanes) ⇒ returns the land adjacency itself.
/** @type {WeakMap<object, Map<string, Map<string, number>>>} */
const AUG_MEMO = new WeakMap();
/** @param {SpatialDigest} digest @returns {Map<string, Map<string, number>>} */
function augmentedAdjacency(digest) {
  const seaAdj = seaLaneAdjacency(digest);
  if (seaAdj.size === 0) return gateAdjacency(digest);
  const memo = AUG_MEMO.get(/** @type {object} */ (digest));
  if (memo) return memo;
  /** @type {Map<string, Map<string, number>>} */
  const adj = new Map();
  for (const [a, nbrs] of gateAdjacency(digest)) adj.set(a, new Map(nbrs)); // copy (never mutate the land memo)
  for (const [a, nbrs] of seaAdj) {
    for (const [b, cost] of nbrs) linkMin(adj, a, b, cost);
  }
  if (digest && typeof digest === 'object') AUG_MEMO.set(/** @type {object} */ (digest), adj);
  return adj;
}

/** The routing graph for a specific O-D pair: the sea-AUGMENTED graph when the slot is
 *  lit AND the trip INVOLVES a port (either endpoint is a port); otherwise the land-only
 *  graph. This is the ONE gate that makes "sea lanes shortcut trips involving a port; a
 *  purely inland-to-inland trip routes overland" consistent across candidateRoutes /
 *  chooseRoute / pathCost. @param {SpatialDigest} digest @param {string} a @param {string} b
 *  @returns {Map<string, Map<string, number>>} */
function routingAdjacency(digest, a, b) {
  if (activeSeaLanes(digest) && (isPort(digest, a) || isPort(digest, b))) return augmentedAdjacency(digest);
  return gateAdjacency(digest);
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
    // Port-gated routing graph: sea-augmented for a trip involving a port, land-only
    // otherwise (a purely inland↔inland trip routes overland). Pre-M8 ⇒ always land.
    const adj = routingAdjacency(digest, from, to);
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

// ── SEASONS-B (M3): the read-time seasonal surcharge ──────────────────────────
// A route's terrain composition is FROZEN in the digest's routeReceipts.byTerrain
// (per primary hop); the seasonalOverlay carries the per-season × per-terrain cost
// law. These helpers blend the two at READ TIME (never re-baking the frozen
// matrix). All FINITE + ≥ 1 (SLOW, NOT SEVER). Dormant (no overlay / no season)
// ⇒ 1.0 ⇒ byte-identical.

/**
 * The seasonal multiplier for a single primary-hop edge a↔b in a season, from its
 * routeReceipt's terrain composition. 1.0 when the overlay/season is absent or the
 * pair has no receipt (not a primary hop). In [1, SLOW_NOT_SEVER_MAX].
 * @param {SpatialDigest} digest @param {string|number} fromId @param {string|number} toId @param {string|null} [season]
 * @returns {number}
 */
export function edgeSeasonMultiplier(digest, fromId, toId, season = null) {
  const overlay = activeSeasonalOverlay(digest);
  if (!overlay || season == null) return 1;
  const receipt = digest?.routeReceipts?.[pairKey(String(fromId), String(toId))];
  return receipt && receipt.byTerrain ? terrainBlendMultiplier(overlay, receipt.byTerrain, season) : 1;
}

/**
 * The cost-weighted seasonal multiplier for a whole route PATH (a sequence of
 * settlement ids, each consecutive pair a primary hop). A weighted average of its
 * edges' seasonal factors, so a route dominated by a mountain hop reads near the
 * mountain factor while a plains route reads near 1. FINITE, in
 * [1, SLOW_NOT_SEVER_MAX]; 1.0 when dormant / seasonless / < 2 nodes.
 * @param {SpatialDigest} digest @param {Array<string|number>} path @param {string|null} [season]
 * @returns {number}
 */
export function pathSeasonMultiplier(digest, path, season = null) {
  const overlay = activeSeasonalOverlay(digest);
  const seaLanes = activeSeaLanes(digest);
  const nodes = Array.isArray(path) ? path : [];
  if ((!overlay && !seaLanes) || season == null || nodes.length < 2) return 1;
  const receipts = digest && digest.routeReceipts;
  const seaAdj = seaLanes ? seaLaneAdjacency(digest) : null;
  const storm = stormSeasonFactor(seaLanes, season);
  let num = 0;
  let den = 0;
  for (let i = 0; i + 1 < nodes.length; i++) {
    const u = String(nodes[i]);
    const v = String(nodes[i + 1]);
    // SEA LANES (M8): a water hop weathers the STORM season (its own frozen law),
    // weighted by the lane cost. Checked FIRST (a chosen route hop taken over water
    // is a sea lane even if the ports are also land-adjacent). Dormant ⇒ never fires.
    const seaCost = seaAdj ? seaAdj.get(u)?.get(v) : undefined;
    if (seaCost != null && seaCost > 0) {
      num += seaCost * storm;
      den += seaCost;
      continue;
    }
    const receipt = receipts ? receipts[pairKey(u, v)] : undefined;
    if (!receipt) continue;
    const edgeCost = finiteNum(receipt.cost);
    if (edgeCost == null || edgeCost <= 0) continue;
    num += edgeCost * terrainBlendMultiplier(overlay, receipt.byTerrain, season);
    den += edgeCost;
  }
  return den > 0 ? num / den : 1;
}

/**
 * The season-adjusted integer cost of traversing a known route PATH of frozen
 * `baseCost`: baseCost × the path's terrain-weighted seasonal multiplier. The
 * route re-score (embattlement.chooseRoute) and the caravan arrival clock
 * (supplyShipments.routeWeeks) minimize / schedule on THIS, so winter both
 * reshapes route CHOICE and lengthens arrivals. No season ⇒ baseCost unchanged.
 * @param {SpatialDigest} digest @param {Array<string|number>} path @param {number} baseCost @param {string|null} [season]
 * @returns {number}
 */
export function seasonalPathCost(digest, path, baseCost, season = null) {
  const base = Math.max(0, finiteNum(baseCost) ?? 0);
  if (season == null) return base;
  return Math.round(base * pathSeasonMultiplier(digest, path, season));
}
