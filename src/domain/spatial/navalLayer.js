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
 * THE NAVY (design §1 — this file's Stage 1): one navy per port settlement, capability
 * DERIVED, NEVER PERSISTED. Naval strength is a PARALLEL read (never a field on the land-
 * readiness scalar): port geography (the digest's isPort read) ∧ a maritime-military
 * institution via THE FACET LAW (the facetOf chokepoint — a custom "Drydock Guild" declaring
 * naval-capable COUNTS, a Shipyard's `shipbuilding` tag counts, the name pattern counts),
 * scaled by economy tier, and rented down by the prosperity-affordability idiom (a port that
 * cannot pay its fleet fields less of it). A port WITHOUT a war-capable maritime institution
 * (docks alone) can still be CONVOYED (isPort) but fields NO war navy (strength 0 — "Port
 * only," the display card's existing hasPort branch).
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

import { isPort } from './distanceRead.js';
import { facetOf } from './cohesionWeave.js';
import { TIER_ORDER, PROSPERITY_TIERS, prosperityRank } from '../../data/constants.js';

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
});

/** @param {number} x @returns {number} */
const clamp01 = (x) => (x < 0 ? 0 : x > 1 ? 1 : x);
/** @param {number} v @returns {number} 4-dp round for byte-tidy persisted floats */
function round4(v) { return Math.round(v * 10000) / 10000; }
/** @param {unknown} v @returns {Record<string, unknown>} */
function asObject(v) { return v && typeof v === 'object' && !Array.isArray(v) ? /** @type {Record<string, unknown>} */ (v) : {}; }

/** @typedef {{ name?: unknown, category?: unknown, priorityCategory?: unknown, tags?: unknown,
 *   facets?: unknown, status?: unknown, _worldPulseInactive?: unknown }} InstLike */
/** @typedef {{ id?: string|number, name?: string,
 *   settlement?: { name?: string, tier?: string, config?: { tier?: string },
 *     institutions?: Array<InstLike|string>, economicState?: { prosperity?: unknown } },
 *   causal?: { scores?: Record<string, number> } }} SnapItem */

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
 * @param {InstLike|string|null|undefined} raw @returns {boolean}
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
 * @param {Array<InstLike|string>|null|undefined} institutions @returns {number}
 */
export function navalCapability01(institutions) {
  const insts = Array.isArray(institutions) ? institutions : [];
  const T = NAVAL_TUNING;
  let count = 0;
  for (const inst of insts) if (isNavalInstitution(inst)) count += 1;
  return Math.min(T.CAPABILITY_CAP, count * T.CAPABILITY_PER_INST);
}

// ── The snapshot-item reads (the armyTransitKernel/convergence item shape) ──────
/** The 0..1 economy-tier fraction of a settlement (TIER_ORDER rank / max). Neutral
 *  'village' when absent. Mirrors militaryStrength.tierRankFraction. @param {SnapItem} item */
function tierFractionOf(item) {
  const s = item?.settlement;
  const tier = String(s?.tier || s?.config?.tier || 'village');
  const rank = TIER_ORDER.indexOf(tier);
  const r = rank >= 0 ? rank : TIER_ORDER.indexOf('village');
  return r / Math.max(1, TIER_ORDER.length - 1);
}

/** The 0..1 prosperity of a settlement (PROSPERITY_TIERS rank / max). Neutral 0.5 when
 *  unlabeled. Mirrors corruptionWeb.prosperity01Of. @param {SnapItem} item @returns {number} */
export function prosperity01Of(item) {
  const eco = asObject(item?.settlement?.economicState);
  const rank = prosperityRank(/** @type {Parameters<typeof prosperityRank>[0]} */ (eco.prosperity));
  const maxRank = Math.max(1, PROSPERITY_TIERS.length - 1);
  return rank < 0 ? 0.5 : clamp01(rank / maxRank);
}

/** The institution roster off a snapshot item (item.settlement.institutions). @param {SnapItem} item */
function institutionsOf(item) {
  const insts = item?.settlement?.institutions;
  return Array.isArray(insts) ? insts : [];
}

/**
 * THE DERIVED NAVAL STRENGTH (design §1). A PARALLEL martial read — NEVER a persisted
 * field, NEVER a term on the land-readiness scalar. 0 unless the settlement is a PORT (the
 * digest isPort read) AND fields a war-capable maritime institution (the Facet Law). Scaled
 * by economy tier and rented down by prosperity affordability (the SEE/official-pay idiom —
 * a fleet the town cannot fund fields less of itself). Bounded, pure, deterministic.
 * @param {import('./distanceRead.js').SpatialDigest} digest
 * @param {SnapItem} item  the snapshot item (snapshot.byId.get(id))
 * @param {string|number} id
 * @returns {number} the aggregate war-navy strength (0 when no navy), on the land 0..~100 scale
 */
export function navalStrengthOf(digest, item, id) {
  if (!digest || !isPort(digest, id)) return 0;         // no port ⇒ no navy (the one-navy law)
  const capability = navalCapability01(institutionsOf(item));
  if (capability <= 0) return 0;                          // a port without a war-capable yard ⇒ Port only
  const T = NAVAL_TUNING;
  const tier01 = tierFractionOf(item);
  const tierMult = T.TIER_FLOOR + (1 - T.TIER_FLOOR) * clamp01(tier01);
  const afford = Math.max(T.AFFORD_MIN, clamp01(prosperity01Of(item) / Math.max(1e-6, T.AFFORD_FLOOR)));
  return round4(T.STRENGTH_BASE * capability * tierMult * afford);
}

/**
 * Does a settlement field a war navy at all (naval strength > 0)? The legibility predicate
 * the display card's "Naval force" vs "Port only" split reads (a real number replacing the
 * dead hasNavy boolean). Pure. @param {import('./distanceRead.js').SpatialDigest} digest
 * @param {SnapItem} item @param {string|number} id @returns {boolean}
 */
export function hasWarNavy(digest, item, id) {
  return navalStrengthOf(digest, item, id) > 0;
}
