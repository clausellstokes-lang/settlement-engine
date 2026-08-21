/**
 * hegemonyFear.js — D4(b) (DESIGN_SIM_DEPTH_R2 D4): fear_of_dominance + its distinct
 * peace mirror balance_restored. Factored into its own module so BOTH reason movers
 * (warReasons, peaceReasons) share one belief-side sphere read WITHOUT the pure hegemony
 * leaf importing the belief/naval engine (the leaf stays display-safe; display re-exports
 * it). Reads the DOMAIN leaf (hegemony.js), the belief map (fog), and naval strength.
 *
 * THE READ (Blainey's first-class cause): a free settlement fears the BELIEVED aggregate
 * strength-share of a hegemony sphere it neighbours. Inputs, per observer O and sphere
 * center C:
 *   • C's sphere strength-share as O BELIEVES it (belief-side land strength via
 *     readBeliefStrength — a fogged observer fears the empire it believes in, both
 *     directions) PLUS a PUBLIC naval term (ships in port are visible; a maritime hegemon
 *     frightens the ports it can blockade — the coherence-matrix naval COUPLING).
 *   • a distance discount off the frozen digest (far empires frighten less — the bounded
 *     mappedDistanceWeight idiom; 1.0 when unmapped ⇒ no attenuation).
 *   • O's independence: subordinates of C are EXCLUDED (v1 balances, never bandwagons).
 * balance_restored is the unification-law mirror: the SAME feared sphere, read when it
 * CRUMBLES — fear-base × the fraction of its ties that are strained. A firm empire ⇒ pure
 * fear; a crumbling one ⇒ its free neighbours reconcile (the empire falls, balance returns).
 *
 * Gating: fear_of_dominance is a typed reason under peaceEngineEnabled (warReasons gates
 * there); no sphere ⇒ 0 everywhere ⇒ byte-identical. PURE; no rng, no wall clock, no writes.
 */

import { hegemonyRead } from './hegemony.js';
import { readBeliefStrength } from './beliefMap.js';
import { settlementStrength } from './relationshipEvolution.js';
import { navalStrengthOf } from './navalStrength.js';
import { activeSpatialDigest, mappedDistanceWeight } from '../spatial/distanceRead.js';
import { clamp01 } from '../../kernel/math.js';
import { hegemonyReceipt } from './eventProse.js';

/** Bounded, owner-retunable tuning (soak). */
export const HEGEMONY_FEAR_TUNING = Object.freeze({
  // Divisor mapping navalStrengthOf's 0..~100 field-battle scale onto the belief map's
  // 0..1 strength scale, so land (fogged) and naval (public) are commensurate in the share.
  NAVAL_STRENGTH_NORM: 100,
});

/** @param {unknown} v @returns {number} */
function num(v) { return Number.isFinite(Number(v)) ? Number(v) : 0; }

/**
 * The PURE fear scorer: does observer O fear the sphere centred at C? 0 unless C centres a
 * sphere in O's believed read, O is neither C nor one of C's subordinates, and the believed
 * share × distance discount is positive. @param {{ observerId: string, centerId: string,
 * spheres: Array<Record<string, unknown>>, distanceWeight01: number, seed?: string }} args
 * @returns {{ score: number, receipt: string }} */
export function scoreFearOfDominance({ observerId, centerId, spheres, distanceWeight01, seed }) {
  const sphere = pickSphere(spheres, observerId, centerId);
  if (!sphere) return { score: 0, receipt: '' };
  const share = clamp01(num(sphere.strengthShare));
  const near = clamp01(num(distanceWeight01));
  const score = clamp01(share * near);
  if (score <= 0) return { score: 0, receipt: '' };
  return { score, receipt: hegemonyReceipt('fear_of_dominance', seed, { centerName: sphere.centerName }) };
}

/**
 * The PURE peace mirror: the balance restored as a once-feared sphere CRUMBLES. Fear-base ×
 * the strained-tie fraction — a firm empire scores 0 (fear rules), a fraying one scores as its
 * grip slips. @param {{ observerId: string, centerId: string,
 * spheres: Array<Record<string, unknown>>, distanceWeight01: number, seed?: string }} args
 * @returns {{ score: number, receipt: string }} */
export function scoreBalanceRestored({ observerId, centerId, spheres, distanceWeight01, seed }) {
  const sphere = pickSphere(spheres, observerId, centerId);
  if (!sphere) return { score: 0, receipt: '' };
  const share = clamp01(num(sphere.strengthShare));
  const near = clamp01(num(distanceWeight01));
  const memberCount = num(sphere.memberCount);
  const strained = num(/** @type {{ strainedCount?: unknown }} */ (sphere.strain || {}).strainedCount);
  const strainFrac = memberCount > 0 ? clamp01(strained / memberCount) : 0;
  const score = clamp01(share * near * strainFrac);
  if (score <= 0) return { score: 0, receipt: '' };
  return { score, receipt: hegemonyReceipt('balance_restored', seed, { centerName: sphere.centerName }) };
}

/** The sphere centred at C in O's believed read, or null when O should feel nothing about C
 *  (C not a centre, O === C, or O is a SUBORDINATE of C — balances, never bandwagons).
 *  @param {Array<Record<string, unknown>>} spheres @param {string} observerId @param {string} centerId */
function pickSphere(spheres, observerId, centerId) {
  if (!Array.isArray(spheres) || String(observerId) === String(centerId)) return null;
  const sphere = spheres.find((s) => String(s.centerId) === String(centerId));
  if (!sphere) return null;
  const members = Array.isArray(sphere.members) ? sphere.members : [];
  if (members.some((m) => String(/** @type {{ id?: unknown }} */ (m).id) === String(observerId))) return null;
  return sphere;
}

/**
 * Build the per-tick fear context a reason mover consumes: the belief-side sphere read
 * (memoized per observer) + the distance discount, both off the SAME (worldState, snapshot).
 * `hasSphere` is a cheap ground-truth gate — false ⇒ every fear/balance read is 0 without any
 * per-observer work (the negative-control pin; byte-identical when no hegemony exists).
 * @param {{ worldState: Record<string, unknown>, snapshot: { settlements?: unknown[], byId?: unknown } | null | undefined }} args
 */
export function makeHegemonyFear({ worldState, snapshot }) {
  const digest = activeSpatialDigest(worldState);
  const settlements = /** @type {Array<{ id?: unknown, name?: unknown, settlement?: { name?: unknown } | null }>} */ (
    Array.isArray(snapshot?.settlements) ? snapshot.settlements : []);
  /** @type {Map<string, unknown>} */
  const byId = snapshot?.byId instanceof Map
    ? snapshot.byId
    : new Map(settlements.map((it) => [String(it.id), it]));
  /** The snapshot item for a settlement id, in the shape navalStrengthOf reads.
   *  @param {string} id @returns {import('./navalStrength.js').SnapItem | undefined} */
  const itemOf = (id) => /** @type {import('./navalStrength.js').SnapItem | undefined} */ (byId.get(String(id)));
  // Land strength (0..1, the belief map's scale) + a PUBLIC naval term (0..1) — the aggregate
  // the design says INCLUDES navalStrength. Land is fogged per observer; naval is un-fogged.
  const landOf = (/** @type {string} */ id) => clamp01(num(settlementStrength(itemOf(id), {})));
  const navalOf = (/** @type {string} */ id) => (digest
    ? clamp01(num(navalStrengthOf(digest, itemOf(id), id)) / HEGEMONY_FEAR_TUNING.NAVAL_STRENGTH_NORM)
    : 0);
  const groundStrengthOf = (/** @type {string} */ id) => landOf(id) + navalOf(id);

  // Cheap gate: is there ANY hegemony sphere at all (ground-truth structure)?
  const baseSpheres = hegemonyRead({ worldState, settlements, strengthOf: groundStrengthOf }).spheres;
  const hasSphere = baseSpheres.length > 0;

  /** @type {Map<string, Array<Record<string, unknown>>>} */
  const believedCache = new Map();
  const believedSpheresFor = (/** @type {string} */ observerId) => {
    if (!hasSphere) return [];
    const key = String(observerId);
    const memo = believedCache.get(key);
    if (memo) return memo;
    const spheres = hegemonyRead({
      worldState, settlements,
      // Fogged LAND (readBeliefStrength: banded belief for known, ground for self/unknown) +
      // PUBLIC naval — so the same empire is BELIEVED bigger/smaller by different observers.
      strengthOf: (/** @type {string} */ id) => clamp01(num(readBeliefStrength(observerId, String(id), worldState, landOf(id)))) + navalOf(id),
    }).spheres;
    believedCache.set(key, spheres);
    return spheres;
  };

  const distanceWeightBetween = (/** @type {string} */ centerId, /** @type {string} */ observerId) => (
    hasSphere && digest ? mappedDistanceWeight(digest, String(centerId), String(observerId)) : 1);

  return {
    hasSphere,
    /** fear_of_dominance for pair (observer, center). @param {string} observerId @param {string} centerId */
    fearOf(observerId, centerId) {
      if (!hasSphere) return { score: 0, receipt: '' };
      return scoreFearOfDominance({
        observerId, centerId,
        spheres: believedSpheresFor(observerId),
        distanceWeight01: distanceWeightBetween(centerId, observerId),
        seed: `${observerId}>${centerId}`,
      });
    },
    /** balance_restored for pair (observer, center). @param {string} observerId @param {string} centerId */
    balanceRestoredOf(observerId, centerId) {
      if (!hasSphere) return { score: 0, receipt: '' };
      return scoreBalanceRestored({
        observerId, centerId,
        spheres: believedSpheresFor(observerId),
        distanceWeight01: distanceWeightBetween(centerId, observerId),
        seed: `${observerId}>${centerId}`,
      });
    },
  };
}
