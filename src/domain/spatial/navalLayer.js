/**
 * navalLayer.js — W-NAVY: the sea as a road where losing means drowning (DESIGN_NAVY.md).
 *
 * The naval formalization of an implicit path property (M8 sea lanes already let armies
 * sail — routing folds sea edges in whenever an endpoint is a port). W-NAVY names that
 * reality: navies convoy own/allied armies over water; two hostile navies sharing a SEA
 * EDGE fight a sea battle with LAND-PARITY semantics (the loser retreats to home port); an
 * army at sea SHARES its convoy's fate; and THE BLOCKADE LAW, verbatim: "a blockade is the
 * same as a siege."
 *
 * THE SCOPE SUPERSESSION (design §0): M8's seaLanes.js declared "NO FLEET COMBAT — this
 * module mints no battle" and froze the digest slot's shape. The owner's three naval laws
 * consciously SUPERSEDE that boundary — but HONOR the frozen slot: NAVIES NEVER LIVE IN THE
 * FROZEN SLOT. All naval state lives in a new `spatialLedgers.navalTransit` ledger (the
 * armyTransit pattern — drop-when-empty, zero eager, no digest version-axis event). The M8
 * slot stays byte-frozen; seaLanes.js itself still mints no battle — fleet combat lives HERE.
 *
 * THE NAVY (design §1): one navy per port settlement, capability DERIVED, NEVER PERSISTED.
 * This TIER-BLIND leaf owns the two spatial halves: port geography (the digest's isPort read)
 * ∧ a maritime-military institution via THE FACET LAW (the facetOf chokepoint — a custom
 * "Drydock Guild" declaring naval-capable COUNTS, a Shipyard's `shipbuilding` tag counts, the
 * name pattern counts) ⇒ navalCapability01. The STRENGTH scaling (× economy tier × prosperity
 * affordability) is an ECONOMY read forbidden under src/domain/spatial (the tier-blind
 * invariant), so it lives in the worldPulse twin `worldPulse/navalStrength.js`
 * (navalStrengthOf), which imports the capability + tuning from here. A port WITHOUT a
 * war-capable maritime institution (docks alone) is CONVOY-capable (isPort) but fields NO war
 * navy (strength 0 — "Port only," the display card's existing hasPort branch).
 *
 * DORMANCY (constitutional): the naval layer is LIVE iff the spatial-canon marker is present
 * AND the VIRTUAL `navalEnabled` flag is set (design §6 + the brief's law 3 — navies are
 * physical, the armyTransit marker precedent, PLUS an opt-in flag so a lit spatial world is
 * byte-identical until naval is switched on; NO DEFAULT_SIMULATION_RULES entry). Aspatial
 * worlds have no sea — a no-op there is correct (the digest is the water's only home).
 *
 * PURE + LAZY: no Date, no Math.random, no mutation, no tier/auth. A spatial leaf imported
 * ONLY by the lazy navalKernel (→ the lazy pulseKernel) ⇒ ZERO first-paint bytes; the ledger
 * nests under the FP-R `spatialLedgers` namespace ⇒ zero eager literal. The seeded PRNG
 * (sea-battle / convoy rolls) forks a stable composite key at the call site.
 */

import {
  isPort, hopWeeks, pathCost, candidateRoutes, seaLaneAdjacency, activeSeaLanes,
  hasSpatialLedger, getSpatialLedger,
} from './distanceRead.js';
import { chooseRoute, riskToleranceFromAlignment } from './embattlement.js';
import { ARMY_ROLES, armyRecordOf } from './armyTransit.js';
import { facetOf } from './cohesionWeave.js';

// ── Tuning (documented here; retuned in the W-NAVY + checkpoint soaks) ──────────
export const NAVAL_TUNING = Object.freeze({
  // NAVAL STRENGTH. The war-navy an eligible port fields, on the SAME 0..~100 aggregate
  // scale as land forces (so a sea battle's resolveFieldBattle is commensurate with a
  // field battle by construction). strength = BASE × capability × (TIER_FLOOR + (1−TIER_FLOOR)
  // × tier01) × affordability. A wealthy metropolis shipyard ⇒ ~BASE; a poor town's lone
  // shipyard ⇒ a fraction. 0 when the port has no war-capable maritime institution.
  STRENGTH_BASE: 100,
  TIER_FLOOR: 0.4,        // even a thorp's shipyard fields a real (if small) squadron
  // CAPABILITY presence — how much war-navy the standing maritime-military institutions
  // represent (the mercPresenceOf idiom: count × per-inst, hard-capped — no unbounded stack).
  CAPABILITY_PER_INST: 0.6, // one shipyard ⇒ 0.6 capability; two+ ⇒ the cap
  CAPABILITY_CAP: 1.0,
  // AFFORDABILITY — the prosperity-affordability idiom (SEE/official-pay precedent): a fleet
  // the town cannot fund fields less of itself (a SCALE, not a hard gate — the documented
  // corruptionWeb JUDGMENT). afford = clamp(prosperity01 / AFFORD_FLOOR) floored at AFFORD_MIN.
  // [JUDGMENT, vetoable: AFFORD_MIN > 0 — a standing shipyard always fields at least a token
  // squadron; poverty rents the fleet DOWN (the mercenary "reinforces little" idiom), it does
  // not evaporate a yard that exists. Say "veto" to drop the floor (subsistence ⇒ no navy).]
  AFFORD_FLOOR: 0.5,
  AFFORD_MIN: 0.15,

  // ── CONVOY (design §2) ────────────────────────────────────────────────────────
  // The per-mode speed factor at the plan seam. Sea legs are ALREADY ~10× cheaper via
  // the M8 cost calibration (a low sea-lane cost ⇒ few hopWeeks); the mode factor makes
  // the advantage deliberate. A laden convoy is a little slower than an empty courier but
  // still FASTER than the equivalent land march (ARMY_SPEED_FACTOR 1.5) — the sea's point.
  CONVOY_SPEED_FACTOR: 1.2,
  CONVOY_READINESS_SPEED_GAIN: 0.4, // a drilled navy sails steadier (mirrors army speed)
  MAX_CONVOY_WEEKS: 52,
  // THE STORM-SEASON EV PENALTY (design §2). A convoy's expected value is scaled DOWN by
  // the season's own storm multiplier (winter 2.5 ⇒ EV ÷ 2.5) — winter crossings are rare
  // by construction (the EV rarely clears zero when a storm prices up the passage). The
  // storm law is READ off the frozen slot's self-describing stormSeasonCost.
  CONVOY_THREAT_WEIGHT: 1.0, // how heavily a believed sea threat discounts the convoy EV

  // ── SEA BATTLE + SHARED FATE (design §3) ──────────────────────────────────────
  // SHARED FATE (the owner's "an army at sea shares its convoy's fate", bounded by the
  // constitution's never-annihilated law): a lost convoy inflicts the HEAVIEST bounded loss
  // band IN THE ENGINE on the embarked army — losing at sea is worse than any land defeat
  // (land's LOSER_MAX_LOSS is 0.45; drowning tops it) — then a forced debark at the nearest
  // friendly port, whence the survivors retreat overland. NEVER annihilation: a survivor
  // floor always reaches shore (rescuable, not wiped).
  SHARED_FATE_MAX_LOSS: 0.7,       // the heaviest band in the engine (> land's 0.45)
  SHARED_FATE_MIN_LOSS: 0.4,       // even a near-run sea defeat drowns more than a land rout
  SHARED_FATE_SURVIVOR_FLOOR: 0.15, // survivors never fall below this fraction (never-annihilated)

  // ── BLOCKADE (design §4 — "a blockade is the same as a siege") ────────────────
  // THE LOADED-DICE INITIATION (§H — convoys routine, blockades DRAMA): p = INITIATE_BASE
  // × pull², cap-held — a rare, authority-routed, deferral-visible event.
  BLOCKADE_INITIATE_BASE: 0.1,
  // BLOCKADE-RUNNING (design §4 — M7 smuggling over sea paths, the fleet is the gate): a
  // lone runner's base chance vs NO fleet; a strong blockading fleet drives it toward 0.
  BLOCKADE_RUN_BASE: 0.5,
});

/** @param {number} x @returns {number} */
const clamp01 = (x) => (x < 0 ? 0 : x > 1 ? 1 : x);
/** @param {unknown} v @param {number} f @returns {number} */
function num(v, f) { return typeof v === 'number' && Number.isFinite(v) ? v : f; }
/** @param {number} v @returns {number} 4-dp round for byte-tidy persisted floats */
function round4(v) { return Math.round(v * 10000) / 10000; }
/** @param {unknown} v @returns {Record<string, unknown>} */
function asObject(v) { return v && typeof v === 'object' && !Array.isArray(v) ? /** @type {Record<string, unknown>} */ (v) : {}; }

/** @typedef {{ name?: unknown, category?: unknown, priorityCategory?: unknown, tags?: unknown,
 *   facets?: unknown, status?: unknown, _worldPulseInactive?: unknown }} InstLike */

// ── THE MARITIME-MILITARY CAPABILITY (the Facet Law — mirror the mercenary clause) ─
/**
 * The war-capable maritime institution pattern — shipyards, dockyards, dry docks,
 * admiralties, naval arsenals, war-fleets, shipwrights, the war galley yard. A SELF-
 * CONTAINED classifier (parity with mercenaryMarket's MERCENARY_MARKET_PATTERN): a
 * settlement fields a NAVY when it carries one of these, declared or inferred. NB: plain
 * docks / harbours / fishing communities are WATER ACCESS (convoy-capable — the isPort
 * read), NOT a war navy — they do not match here. Matched against name/category/tags.
 * @type {RegExp}
 */
export const NAVAL_INSTITUTION_PATTERN =
  /shipyard|dockyard|dry\s*dock|drydock|boatyard|admiralt|naval|navy|war\s*(fleet|galley|ship)|shipwright|marine\s*corps|fleet\s*(yard|base|command)/i;

/** True iff the institution is currently STANDING (mirrors mercenaryMarket.isStanding). @param {InstLike|null|undefined} inst @returns {boolean} */
function isStanding(inst) {
  if (!inst || typeof inst !== 'object') return false;
  if (inst._worldPulseInactive) return false;
  const s = String(inst.status || 'active').toLowerCase();
  return s !== 'removed' && s !== 'destroyed' && s !== 'remnant' && s !== 'ruined';
}

/** Does a row carry the maritime `shipbuilding` tag (Shipyard / River boatyard)? The one
 *  real catalog signal of ship-BUILDING capability. @param {InstLike} inst @returns {boolean} */
function hasShipbuildingTag(inst) {
  const tags = Array.isArray(inst?.tags) ? inst.tags.map(String) : [];
  return tags.includes('shipbuilding');
}

/**
 * Is an institution row a WAR-CAPABLE maritime institution — the Facet Law: a DECLARED
 * `naval` institutionFunction facet (a custom "Drydock Guild" declaring naval-capable
 * COUNTS, whatever its English), OR the catalog `shipbuilding` tag, OR the naval name/tag
 * pattern? Skips inactive institutions. Mirrors convergence's mercenary clause exactly.
 * @param {unknown} raw @returns {boolean}
 */
export function isNavalInstitution(raw) {
  if (typeof raw === 'string') {
    return NAVAL_INSTITUTION_PATTERN.test(raw);
  }
  const inst = /** @type {InstLike} */ (raw);
  if (!isStanding(inst)) return false;
  if (facetOf(/** @type {Parameters<typeof facetOf>[0]} */ (inst), 'institutionFunction') === 'naval') return true;
  if (hasShipbuildingTag(inst)) return true;
  const tags = Array.isArray(inst.tags) ? inst.tags.join(' ') : '';
  const hay = `${String(inst.name || '')} ${String(inst.category || '')} ${String(inst.priorityCategory || '')} ${tags}`;
  return NAVAL_INSTITUTION_PATTERN.test(hay);
}

/**
 * 0..1 local WAR-NAVY capability — how much war-capable maritime institution a settlement's
 * standing roster represents. 0 (⇒ no navy ⇒ strength 0) when it has none. Pure.
 * @param {Array<unknown>|null|undefined} institutions @returns {number}
 */
export function navalCapability01(institutions) {
  const insts = Array.isArray(institutions) ? institutions : [];
  const T = NAVAL_TUNING;
  let count = 0;
  for (const inst of insts) if (isNavalInstitution(inst)) count += 1;
  return Math.min(T.CAPABILITY_CAP, count * T.CAPABILITY_PER_INST);
}

// NOTE (constitutional — the TIER-BLIND spatial invariant): the STRENGTH derivation
// (navalStrengthOf) scales the tier-blind capability above by ECONOMY TIER + prosperity
// affordability — economy reads that must NOT live in src/domain/spatial. They live in the
// worldPulse twin `worldPulse/navalStrength.js` (the armyTransitKernel/militaryStrength
// precedent), which imports navalCapability01 + NAVAL_TUNING from here. This leaf stays the
// pure, tier-blind geometry+capability layer.

// ══ Stage 2 — CONVOY (design §2) ═══════════════════════════════════════════════
// A navy convoys an own/allied army over water. The record rides the SIBLING
// `navalTransit` ledger (NOT the frozen slot, NOT the armyTransit ledger), carrying
// BOTH ids: OWNER (the navy's home port) ≠ CARGO (the army's home — the allied case).

/**
 * @typedef {import('./armyTransit.js').ArmyTransitRecord & {
 *   mode: 'sea', ownerId: string, cargoId: string|null, cargoStrength: number, targetId: string
 * }} NavalTransitRecord
 */

/**
 * Parse a raw record into a NavalTransitRecord, or null when it is not a naval record.
 * Builds on armyRecordOf (so the role-coercion FIX is exercised — a 'convoy'/'blockade'
 * role SURVIVES here instead of degrading to 'march') then folds the naval-specific fields
 * (mode + the owner/cargo ids + the embarked army's strength + the blockade/convoy target).
 * @param {unknown} rec @returns {NavalTransitRecord|null}
 */
export function navalRecordOf(rec) {
  const base = armyRecordOf(rec);
  if (!base) return null;
  if (base.role !== ARMY_ROLES.CONVOY && base.role !== ARMY_ROLES.BLOCKADE) return null;
  const r = asObject(rec);
  return {
    ...base,
    mode: 'sea',
    ownerId: r.ownerId != null ? String(r.ownerId) : base.armyId,
    cargoId: r.cargoId != null ? String(r.cargoId) : null,
    cargoStrength: Math.max(0, num(r.cargoStrength, 0)),
    targetId: r.targetId != null ? String(r.targetId) : (base.destId || ''),
  };
}

/**
 * The live naval-transit ledger, or null when absent/dormant. The one read consumers use
 * (mirror armyTransitLedger). @param {{ spatialLedgers?: unknown } | null | undefined} worldState
 * @returns {Record<string, NavalTransitRecord> | null}
 */
export function navalTransitLedger(worldState) {
  if (!hasSpatialLedger(worldState, 'navalTransit')) return null;
  const raw = asObject(getSpatialLedger(worldState, 'navalTransit'));
  /** @type {Record<string, NavalTransitRecord>} */
  const out = {};
  for (const id of Object.keys(raw)) {
    const rec = navalRecordOf(raw[id]);
    if (rec) out[id] = rec;
  }
  return Object.keys(out).length ? out : null;
}

/**
 * The transit time (integer weeks) for a laden convoy over a base courier hop-time. The
 * per-mode factor (CONVOY_SPEED_FACTOR) is applied at the plan seam; a drilled navy sails
 * a little steadier. Floored ≥ 1, capped. Pure. @param {number} baseHopWeeks @param {number} [readiness01]
 * @returns {number}
 */
export function convoyTransitWeeks(baseHopWeeks, readiness01 = 0.5) {
  const T = NAVAL_TUNING;
  const base = Math.max(0, num(baseHopWeeks, 0));
  if (base <= 0) return 0;
  const rdy = clamp01(num(readiness01, 0.5));
  const speedMult = 1 + T.CONVOY_READINESS_SPEED_GAIN * (rdy - 0.5) * 2;
  const weeks = Math.ceil((base * T.CONVOY_SPEED_FACTOR) / Math.max(0.1, speedMult));
  return Math.min(T.MAX_CONVOY_WEEKS, Math.max(1, weeks));
}

/** The self-describing STORM multiplier for a season, read off the frozen seaLanes slot's
 *  own stormSeasonCost law. ≥ 1 (slow, not sever); 1 when absent/unknown. Pure.
 *  @param {import('./distanceRead.js').SpatialDigest} digest @param {string|null|undefined} season @returns {number} */
export function stormMultOf(digest, season) {
  const lanes = activeSeaLanes(digest);
  const table = lanes && lanes.stormSeasonCost;
  const v = table && season != null ? table[String(season)] : undefined;
  return typeof v === 'number' && Number.isFinite(v) && v >= 1 ? v : 1;
}

/**
 * The CONVOY EXPECTED VALUE (design §2 — speed against ruin). Benefit ∝ the cargo delivered;
 * risk = believed sea threat × the heaviest shared-fate loss band × cargo; and the whole EV
 * is scaled DOWN by the season's storm multiplier — so a winter crossing (stormMult 2.5) is
 * rarely worth it (the seasonal-campaigning texture at sea, for free). Pure, bounded.
 * @param {{ cargoStrength?: number, threat01?: number, sharedFateLoss?: number, stormMult?: number }} [args]
 * @returns {number}
 */
export function convoyEV({ cargoStrength = 0, threat01 = 0, sharedFateLoss = 0.6, stormMult = 1 } = {}) {
  const cargo = Math.max(0, num(cargoStrength, 0));
  const threat = clamp01(num(threat01, 0));
  const loss = clamp01(num(sharedFateLoss, 0));
  const storm = Math.max(1, num(stormMult, 1));
  const benefit = cargo;
  const risk = NAVAL_TUNING.CONVOY_THREAT_WEIGHT * threat * loss * cargo;
  return round4((benefit - risk) / storm);
}

// ── CAPACITY (design §2 — the FIRST consumer of SEA_LANE_CAPACITY) ──────────────
/** The codepoint-stable sea-edge keys a settlement-id path traverses (consecutive pairs
 *  that are sea-lane-adjacent). @param {import('./distanceRead.js').SpatialDigest} digest
 *  @param {string[]|null|undefined} path @returns {string[]} */
export function seaEdgesOfPath(digest, path) {
  const adj = seaLaneAdjacency(digest);
  const nodes = Array.isArray(path) ? path.map(String) : [];
  /** @type {string[]} */
  const out = [];
  for (let i = 0; i < nodes.length - 1; i++) {
    const a = nodes[i];
    const b = nodes[i + 1];
    if (adj.get(a)?.has(b)) out.push(a < b ? `${a}|${b}` : `${b}|${a}`);
  }
  return out;
}

/** The recorded (M8) per-lane capacity bound, read off the frozen slot's edges (all uniform
 *  SEA_LANE_CAPACITY). The convoy layer is its FIRST consumer. @param {import('./distanceRead.js').SpatialDigest} digest @returns {number} */
export function seaLaneCapacityOf(digest) {
  const lanes = activeSeaLanes(digest);
  const edges = lanes && Array.isArray(lanes.edges) ? lanes.edges : [];
  for (const e of edges) { const c = num(e?.capacity, 0); if (c > 0) return c; }
  return 10; // the M8 default (SEA_LANE_CAPACITY) when no edge records one
}

/**
 * Is there throughput headroom for a NEW convoy over `path`? The convoy is the FIRST
 * consumer of the recorded-but-unenforced SEA_LANE_CAPACITY: a lane already carrying
 * `capacity` active convoys is FULL (a new convoy over it DEFERS — deferral-visible). Pure.
 * @param {import('./distanceRead.js').SpatialDigest} digest
 * @param {Record<string, NavalTransitRecord>|null|undefined} activeRecords
 * @param {string[]} path @returns {{ available: boolean, fullEdge: string|null, capacity: number }}
 */
export function convoyCapacityAvailable(digest, activeRecords, path) {
  const capacity = seaLaneCapacityOf(digest);
  /** @type {Map<string, number>} */
  const load = new Map();
  for (const rec of Object.values(asObject(activeRecords))) {
    const nr = navalRecordOf(rec);
    if (!nr || nr.role !== ARMY_ROLES.CONVOY) continue;
    for (const e of seaEdgesOfPath(digest, nr.path)) load.set(e, (load.get(e) || 0) + 1);
  }
  for (const e of seaEdgesOfPath(digest, path)) {
    if ((load.get(e) || 0) >= capacity) return { available: false, fullEdge: e, capacity };
  }
  return { available: true, fullEdge: null, capacity };
}

/**
 * planConvoy (design §2): mint a NavalTransitRecord (mode:'sea', role CONVOY) carrying an
 * army over water from the NAVY's home port (owner) to a destination. Carries BOTH ids —
 * OWNER (the navy) ≠ CARGO (the army's home, the allied case). The route is the M1 danger
 * re-score over the frozen sea-augmented digest (a convoy prefers the safe sea road); the
 * transit time rides the per-mode convoy speed. Returns null when unreachable/unmapped OR
 * when capacity DEFERS the crossing (deferral-visible). Pure + deterministic.
 * @param {import('./distanceRead.js').SpatialDigest} digest
 * @param {{ spatialLedgers?: unknown } | null | undefined} worldState
 * @param {Object} args
 * @param {string} args.ownerId       the navy's home port (embarkation)
 * @param {string} args.cargoId       the embarked army's home settlement
 * @param {string} args.destId        the landing port
 * @param {number} args.ownerStrength the navy's aggregate naval strength (escort)
 * @param {number} args.cargoStrength the embarked army's aggregate strength
 * @param {number} [args.readiness01] the navy's 0..1 readiness
 * @param {{ lawfulness01?: number }|null} [args.alignment]
 * @param {number} args.departTick
 * @param {string|null} [args.season]
 * @param {Record<string, NavalTransitRecord>|null} [args.activeRecords] the live ledger (capacity check)
 * @param {number} [args.supplyQuality] @param {number} [args.funding]
 * @returns {{ record: NavalTransitRecord } | { deferred: 'capacity', fullEdge: string } | null}
 */
export function planConvoy(digest, worldState, {
  ownerId, cargoId, destId, ownerStrength, cargoStrength, readiness01 = 0.5,
  alignment = null, departTick, season = null, activeRecords = null,
  supplyQuality = 1, funding = 0.5,
}) {
  if (!digest) return null;
  const owner = String(ownerId);
  const dest = String(destId);
  if (owner === dest) return null;
  const scored = chooseRoute(digest, worldState, owner, dest, riskToleranceFromAlignment(alignment), season);
  /** @type {string[]} */
  let path;
  if (scored && Array.isArray(scored.path) && scored.path.length) {
    path = scored.path.map(String);
  } else {
    const cands = candidateRoutes(digest, owner, dest, 1);
    if (!cands.length) return null;
    path = cands[0].path.map(String);
  }
  // A convoy must actually SAIL — the route has to traverse at least one sea edge (else it
  // is a land march, not a convoy; the caller should plan an army march instead).
  if (seaEdgesOfPath(digest, path).length === 0) return null;
  // CAPACITY (deferral-visible): a full lane defers the crossing.
  const cap = convoyCapacityAvailable(digest, activeRecords, path);
  if (!cap.available) return { deferred: 'capacity', fullEdge: /** @type {string} */ (cap.fullEdge) };
  const base = hopWeeks(digest, owner, dest, season);
  if (base == null) return null;
  const weeks = convoyTransitWeeks(base, readiness01);
  const depart = Math.max(0, Math.floor(num(departTick, 0)));
  const record = navalRecordOf({
    armyId: owner, role: ARMY_ROLES.CONVOY, ownerId: owner, cargoId: String(cargoId),
    originId: owner, destId: dest, targetId: dest, path,
    departTick: depart, arrivalTick: depart + weeks, position01: 0,
    strength: Math.max(0, num(ownerStrength, 0)), cargoStrength: Math.max(0, num(cargoStrength, 0)),
    readiness: clamp01(num(readiness01, 0.5)), supplyQuality: clamp01(num(supplyQuality, 1)),
    funding: clamp01(num(funding, 0.5)), beliefStaleness: 0, lastTick: depart,
  });
  return record ? { record } : null;
}

// ══ Stage 3 — SEA BATTLE + SHARED FATE (design §3) ═════════════════════════════
// Two hostile navies whose paths share a SEA EDGE collide there (the recon's precise gap:
// M5's collision is node-shared only). Resolution reuses resolveFieldBattle VERBATIM (land
// parity by construction — the pure sigmoid, the same bounded attrition, the same fork). The
// loser retreats to home port via the existing retreat flow; a lost convoy's embarked army
// SHARES the convoy's fate (the heaviest band + forced debark). The kernel orchestrates the
// battle; these are its pure inputs + the shared-fate/debark math.

/**
 * The SHARED-SEA-EDGE predicate (design §3): the codepoint-first sea-lane edge two
 * settlement-id paths BOTH traverse (consecutive path pairs ∩ seaLaneAdjacency), or null.
 * Two hostile columns sharing a sea edge meet ON the water — not merely at a shared node.
 * @param {import('./distanceRead.js').SpatialDigest} digest
 * @param {string[]|null|undefined} pathA @param {string[]|null|undefined} pathB @returns {string|null}
 */
export function sharesSeaEdge(digest, pathA, pathB) {
  const ea = new Set(seaEdgesOfPath(digest, pathA));
  if (!ea.size) return null;
  const shared = seaEdgesOfPath(digest, pathB).filter((e) => ea.has(e));
  if (!shared.length) return null;
  return shared.sort()[0];
}

/**
 * The effective-strength inputs for a naval record at a sea battle (mirror the field-battle
 * battleInputs: fatigue rises with the crossing; home-waters advantage falls with it). The
 * navy's aggregate NAVAL strength is the size — so resolveFieldBattle is commensurate with a
 * land field battle by construction. @param {NavalTransitRecord} rec
 * @returns {{ armyId: string, size: number, readiness: number, supplyQuality: number, funding: number, groundAdvantage01: number, fatigue01: number }}
 */
export function seaBattleInputs(rec) {
  return {
    armyId: rec.ownerId || rec.armyId,
    size: rec.strength,
    readiness: rec.readiness,
    supplyQuality: rec.supplyQuality,
    funding: rec.funding,
    groundAdvantage01: clamp01(1 - rec.position01), // a navy near its home port fights home waters
    fatigue01: rec.position01,
  };
}

/**
 * THE SHARED FATE (design §3). A lost convoy's embarked army takes the HEAVIEST bounded loss
 * band in the engine — scaled by how decisive the sea battle was (margin ∈ [0,1]) — but a
 * survivor floor ALWAYS reaches shore (never annihilation). Deterministic; pure.
 * @param {number} cargoStrength @param {number} margin01  the battle's decisiveness (|pWin−0.5|·2)
 * @returns {{ loss: number, survived: number, drowned: number }}
 */
export function sharedFateLoss(cargoStrength, margin01) {
  const T = NAVAL_TUNING;
  const s = Math.max(0, num(cargoStrength, 0));
  const m = clamp01(num(margin01, 0));
  const loss = T.SHARED_FATE_MIN_LOSS + (T.SHARED_FATE_MAX_LOSS - T.SHARED_FATE_MIN_LOSS) * m;
  const survived = Math.max(s * T.SHARED_FATE_SURVIVOR_FLOOR, s * (1 - loss));
  return { loss: round4(loss), survived: round4(survived), drowned: round4(Math.max(0, s - survived)) };
}

/**
 * The nearest FRIENDLY port to debark at (design §3 — "forced debark at the nearest friendly
 * port"). The codepoint-min-cost port among the candidates (the kernel supplies the ports NOT
 * hostile to the cargo's owner). Null when none is reachable. Pure.
 * @param {import('./distanceRead.js').SpatialDigest} digest @param {string} fromId
 * @param {Array<string>|null|undefined} candidatePorts @param {string|null} [season] @returns {string|null}
 */
export function nearestFriendlyPort(digest, fromId, candidatePorts, season = null) {
  let best = null;
  let bestCost = Infinity;
  for (const raw of [...new Set((Array.isArray(candidatePorts) ? candidatePorts : []).map(String))].sort()) {
    if (!isPort(digest, raw) || raw === String(fromId)) continue;
    const c = pathCost(digest, fromId, raw, season);
    if (c != null && Number.isFinite(c) && c < bestCost) { bestCost = c; best = raw; }
  }
  return best;
}

// ══ Stage 4 — THE BLOCKADE (design §4: "a blockade is the same as a siege") ════
// A navy blockading a port cuts its SEA supply axis through the EXISTING interception
// seam (the hostile navy on the port's sea approaches IS routeIntercepted's hostile-
// intermediary predicate). The M8 both-cut law then does the rest: a blockade ALONE
// strangles commerce (the land axis still feeds), land + sea COMBINED starves.

/**
 * The set of ports under an ACTIVE blockade (a BLOCKADE record in the navalTransit ledger
 * targeting them), each mapped to its blockading owner ids. Pure read; empty when dormant.
 * @param {{ spatialLedgers?: unknown } | null | undefined} worldState @returns {Map<string, Set<string>>}
 */
export function activeBlockadeTargets(worldState) {
  /** @type {Map<string, Set<string>>} */
  const out = new Map();
  const led = navalTransitLedger(worldState);
  if (!led) return out;
  for (const rec of Object.values(led)) {
    if (!rec || rec.role !== ARMY_ROLES.BLOCKADE || !rec.targetId) continue;
    if (!out.has(rec.targetId)) out.set(rec.targetId, new Set());
    /** @type {Set<string>} */ (out.get(rec.targetId)).add(rec.ownerId);
  }
  return out;
}

/**
 * Does a blockade cut a supply route into a port at a given gate node (design §4 — "supply-
 * cutting rides routeIntercepted")? True iff the destination port is under an active blockade
 * AND the gate node is one of its SEA APPROACHES (a sea-lane-adjacent port the blockading
 * fleet holds) — OR the gate is a blockader itself. Guarded: NO navalTransit ledger ⇒ false ⇒
 * byte-identical (the supply layer's exact prior behavior). Pure.
 * @param {{ spatialLedgers?: unknown } | null | undefined} worldState
 * @param {import('./distanceRead.js').SpatialDigest} digest
 * @param {string|number} destPort @param {string|number} gateNode @returns {boolean}
 */
export function blockadeInterceptsSupply(worldState, digest, destPort, gateNode) {
  const targets = activeBlockadeTargets(worldState);
  if (targets.size === 0) return false;
  const dest = String(destPort);
  const blockaders = targets.get(dest);
  if (!blockaders || blockaders.size === 0) return false;
  const gate = String(gateNode);
  if (blockaders.has(gate)) return true;                 // the blockading fleet's own port
  const adj = seaLaneAdjacency(digest);
  return adj.get(dest)?.has(gate) === true;              // a sea approach the fleet holds
}

/**
 * The 0..1 commerce STRANGULATION a blockade inflicts on a port (design §4 — "a blockade alone
 * strangles commerce"): the number of blockaders, saturating. The economic-pressure read the
 * peace layer's economic_strangulation reason can consume (the wire is a documented seam — the
 * peace reason is fed today by the disjoint supply-web campaignPlans). Pure.
 * @param {{ spatialLedgers?: unknown } | null | undefined} worldState @param {string|number} portId @returns {number}
 */
export function blockadeStrangulationOf(worldState, portId) {
  const blockaders = activeBlockadeTargets(worldState).get(String(portId));
  if (!blockaders || blockaders.size === 0) return 0;
  return clamp01(0.5 + 0.25 * (blockaders.size - 1)); // one blockader ⇒ 0.5; more tighten it
}

/**
 * THE BLOCKADE-RUNNING roll (design §4 — M7 smuggling over sea paths, the fleet is the gate):
 * a lone runner's chance to slip a blockade, driven DOWN by the blockading fleet's strength
 * (the gate). A strong fleet ⇒ near-zero; no fleet ⇒ the base chance. Deterministic given the
 * forked rng. Pure. @param {{ fleetGate01?: number, rng?: { random: () => number } | null }} [args]
 * @returns {{ ran: boolean, probability: number }}
 */
export function blockadeRunRoll({ fleetGate01 = 0, rng = null } = {}) {
  const p = clamp01(NAVAL_TUNING.BLOCKADE_RUN_BASE * (1 - clamp01(num(fleetGate01, 0))));
  const draw = rng && typeof rng.random === 'function' ? clamp01(rng.random()) : 1;
  return { ran: draw < p, probability: round4(p) };
}

/**
 * planBlockade (design §4): mint a BLOCKADE naval record — a navy sails from its home port to
 * hold a hostile port's sea approaches. Reuses the convoy record shape (mode:'sea', role
 * BLOCKADE, no cargo). Returns null when the target is not sea-reachable. Pure + deterministic.
 * @param {import('./distanceRead.js').SpatialDigest} digest
 * @param {{ spatialLedgers?: unknown } | null | undefined} worldState
 * @param {Object} args
 * @param {string} args.ownerId       the blockading navy's home port
 * @param {string} args.targetId      the blockaded port
 * @param {number} args.ownerStrength the navy's naval strength
 * @param {number} [args.readiness01] @param {{ lawfulness01?: number }|null} [args.alignment]
 * @param {number} args.departTick @param {string|null} [args.season]
 * @returns {{ record: NavalTransitRecord } | null}
 */
export function planBlockade(digest, worldState, { ownerId, targetId, ownerStrength, readiness01 = 0.5, alignment = null, departTick, season = null }) {
  if (!digest) return null;
  const owner = String(ownerId);
  const target = String(targetId);
  if (owner === target || !isPort(digest, target)) return null;
  const scored = chooseRoute(digest, worldState, owner, target, riskToleranceFromAlignment(alignment), season);
  /** @type {string[]} */
  let path;
  if (scored && Array.isArray(scored.path) && scored.path.length) path = scored.path.map(String);
  else {
    const cands = candidateRoutes(digest, owner, target, 1);
    if (!cands.length) return null;
    path = cands[0].path.map(String);
  }
  if (seaEdgesOfPath(digest, path).length === 0) return null; // a blockade must reach by sea
  const base = hopWeeks(digest, owner, target, season);
  if (base == null) return null;
  const weeks = convoyTransitWeeks(base, readiness01);
  const depart = Math.max(0, Math.floor(num(departTick, 0)));
  const record = navalRecordOf({
    armyId: owner, role: ARMY_ROLES.BLOCKADE, ownerId: owner, cargoId: null,
    originId: owner, destId: target, targetId: target, path,
    departTick: depart, arrivalTick: depart + weeks, position01: 0,
    strength: Math.max(0, num(ownerStrength, 0)), cargoStrength: 0,
    readiness: clamp01(num(readiness01, 0.5)), supplyQuality: 1, funding: 0.5,
    beliefStaleness: 0, lastTick: depart,
  });
  return record ? { record } : null;
}
