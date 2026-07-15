/**
 * navalStrength.js — W-NAVY the DERIVED NAVAL STRENGTH (DESIGN_NAVY.md §1), the worldPulse twin.
 *
 * The naval-strength read scales the TIER-BLIND spatial capability (navalCapability01, from the
 * spatial leaf) by ECONOMY TIER + prosperity AFFORDABILITY — economy reads that constitutionally
 * MUST NOT live under src/domain/spatial (the tier-blind keystone invariant). So the strength
 * derivation lives HERE, the worldPulse side (the armyTransitKernel `fundingOf` / militaryStrength
 * `tierRankFraction` precedent). Naval strength is a PARALLEL martial read — NEVER persisted,
 * NEVER a term on the land-readiness scalar. Pure, deterministic; no rng, no wall-clock.
 */

import { isPort } from '../spatial/distanceRead.js';
import { navalCapability01, NAVAL_TUNING } from '../spatial/navalLayer.js';
import { TIER_ORDER, PROSPERITY_TIERS, prosperityRank } from '../../data/constants.js';

/** @param {number} x @returns {number} */
const clamp01 = (x) => (x < 0 ? 0 : x > 1 ? 1 : x);
/** @param {number} v @returns {number} */
function round4(v) { return Math.round(v * 10000) / 10000; }
/** @param {unknown} v @returns {Record<string, unknown>} */
function asObject(v) { return v && typeof v === 'object' && !Array.isArray(v) ? /** @type {Record<string, unknown>} */ (v) : {}; }

/** @typedef {{ id?: string|number, name?: string,
 *   settlement?: { name?: string, tier?: string, config?: { tier?: string },
 *     institutions?: Array<unknown>, economicState?: { prosperity?: unknown } } }} SnapItem */

/** The 0..1 economy-tier fraction of a settlement (TIER_ORDER rank / max). Neutral 'village'
 *  when absent. Mirrors militaryStrength.tierRankFraction. @param {SnapItem|null|undefined} item @returns {number} */
export function tierRankFraction(item) {
  const s = item?.settlement;
  const label = String(s?.tier || s?.config?.tier || 'village');
  const rank = TIER_ORDER.indexOf(label);
  const r = rank >= 0 ? rank : TIER_ORDER.indexOf('village');
  return r / Math.max(1, TIER_ORDER.length - 1);
}

/** The 0..1 prosperity of a settlement (PROSPERITY_TIERS rank / max). Neutral 0.5 when
 *  unlabeled. Mirrors corruptionWeb.prosperity01Of. @param {SnapItem|null|undefined} item @returns {number} */
export function prosperity01Of(item) {
  const eco = asObject(item?.settlement?.economicState);
  const rank = prosperityRank(/** @type {Parameters<typeof prosperityRank>[0]} */ (eco.prosperity));
  const maxRank = Math.max(1, PROSPERITY_TIERS.length - 1);
  return rank < 0 ? 0.5 : clamp01(rank / maxRank);
}

/** The institution roster off a snapshot item (item.settlement.institutions). @param {SnapItem|null|undefined} item */
function institutionsOf(item) {
  const insts = item?.settlement?.institutions;
  return Array.isArray(insts) ? insts : [];
}

/**
 * THE DERIVED NAVAL STRENGTH (design §1). A PARALLEL martial read — NEVER a persisted field,
 * NEVER a term on the land-readiness scalar. 0 unless the settlement is a PORT (the digest
 * isPort read) AND fields a war-capable maritime institution (navalCapability01, the Facet
 * Law). Scaled by economy tier and rented down by prosperity affordability (the SEE/official-
 * pay idiom — a fleet the town cannot fund fields less of itself, floored so a standing
 * shipyard always fields a token squadron). Bounded, pure, deterministic — on the land 0..~100
 * aggregate scale (so a sea battle's resolveFieldBattle is commensurate with a field battle).
 * @param {import('../spatial/distanceRead.js').SpatialDigest} digest
 * @param {SnapItem|null|undefined} item  the snapshot item (snapshot.byId.get(id))
 * @param {string|number} id
 * @returns {number}
 */
export function navalStrengthOf(digest, item, id) {
  if (!digest || !isPort(digest, id)) return 0;   // no port ⇒ no navy (the one-navy law)
  const capability = navalCapability01(institutionsOf(item));
  if (capability <= 0) return 0;                    // a port without a war-capable yard ⇒ "Port only"
  const T = NAVAL_TUNING;
  const tierMult = T.TIER_FLOOR + (1 - T.TIER_FLOOR) * clamp01(tierRankFraction(item));
  const afford = Math.max(T.AFFORD_MIN, clamp01(prosperity01Of(item) / Math.max(1e-6, T.AFFORD_FLOOR)));
  return round4(T.STRENGTH_BASE * capability * tierMult * afford);
}

/**
 * Does a settlement field a war navy at all (naval strength > 0)? The legibility predicate the
 * display card's "Naval force" vs "Port only" split reads (a real number replacing the dead
 * hasNavy boolean). Pure. @param {import('../spatial/distanceRead.js').SpatialDigest} digest
 * @param {SnapItem|null|undefined} item @param {string|number} id @returns {boolean}
 */
export function hasWarNavy(digest, item, id) {
  return navalStrengthOf(digest, item, id) > 0;
}
