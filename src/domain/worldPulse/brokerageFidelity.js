/**
 * domain/worldPulse/brokerageFidelity.js — [W-I INFORMATION BROKERAGES] I2, THE
 * BELIEF-DERIVATION FIDELITY TERM (docs/DESIGN_INFORMATION_BROKERAGES.md §5 secondary
 * effect, constitutional Law 1).
 *
 * WHAT THIS ADDS. Where an information house stands, the settlement reads the world a
 * little more sharply. That is the whole of the secondary effect, and it is expressed as
 * an ACCURACY FLOOR on the belief reconciliation: the aggregate fidelity of what the
 * settlement hears about a subject is floored at the house's competence, attenuated by
 * how far the subject is. It is the same slot the statecraft SEE posture already uses
 * (beliefMap.reconcileBelief's `sightFloor01`), and it composes with it by taking the
 * better of the two, because paid eyes and a paid register are both eyes.
 *
 * ── LAW 1 IS HELD TWICE, ON PURPOSE ──
 *
 * "Brokerage fidelity BENDS the distance-decay curve, bounded by an authored ceiling;
 * omniscience is impossible." Two independent constructions enforce it, so neither a
 * tuning edit nor a refactor can quietly abolish distance:
 *
 *   1. THE CEILING. The floor can never exceed the authored FIDELITY_CEILING (I1), which
 *      is strictly below 1. No arrangement of houses reaches certainty.
 *   2. THE ATTENUATION. The floor is divided by a distance price that grows with the
 *      news-distance the estate already computes (routeAwareHopDelayTicks, the same
 *      surcharge the rumour staleness and the belief report ages pay). A house sharpens
 *      what happens near it and barely touches what happens far away, so the curve bends
 *      and never flattens.
 *
 * The attenuation is a RATIONAL form, `1 / (1 + price × delay)`, and not an exponential
 * decay, for a determinism reason as much as a design one: division and multiplication
 * are correctly rounded in every ECMAScript engine while Math.pow is only approximated,
 * so a transcendental here could fork same-seed worlds across engines (the estate's
 * transcendental ratchet). Monotone non-increasing in distance, which is what the pin
 * actually asserts.
 *
 * ── HOW IT REACHES THE BELIEF ENGINE (a composition, not a rewrite) ──
 *
 * The belief DERIVATION is untouched: reconcileBelief keeps its existing sightFloor01
 * contract and gains no parameter. advanceBeliefMaps composes the incoming sight closure
 * with the floor built here (two lines, at the point it already holds the snapshot index
 * and the distance digest), and when the layer is dark the wrapper returns the caller's
 * own closure BY REFERENCE, so the dormant path is byte-identical by object identity
 * rather than by argument. The pulse kernel is unchanged.
 *
 * PURE: no rng, no wall clock, no mutation, no tier read. The per-observer roster read is
 * memoised in a Map created per advance and never serialised.
 */

import { clamp01 } from '../../kernel/math.js';
import { INFORMATION_BROKERAGE_TUNING } from '../../data/informationBrokerageTuning.js';
import { liveInstitutions } from '../institutions/institutionRoster.js';
import { brokerageEffectsActive, brokerageHousesOf, houseChannelCompetence } from './brokerageStamps.js';
import { routeAwareHopDelayTicks } from './distancePricedNews.js';
import { activeSpatialDigest } from '../spatial/distanceRead.js';
import { embattlementLevel } from '../spatial/embattlement.js';

/**
 * THE CHANNELS A BELIEF RECORD ACTUALLY SPANS. A belief carries a readiness and a
 * strength band (war), a relationship label (politics) and an observance label (faith).
 * It carries nothing about trade, crime or persons, so a house's competence in those
 * channels must not enter this term: crediting a Whisper market's underworld reach for a
 * sharper read of a neighbour's army would be competence laundering. The stamp ladder
 * prices those channels where they belong, on the news item.
 * @type {readonly string[]}
 */
export const BELIEF_FIDELITY_CHANNELS = Object.freeze(['war', 'politics', 'faith']);

export const BROKERAGE_FIDELITY_TUNING = Object.freeze({
  /**
   * The distance price. The floor is divided by `1 + DISTANCE_PRICE × newsDelayTicks`, so
   * a subject one news-tick away keeps roughly four sevenths of the house's competence
   * and one four ticks away keeps a quarter of it. Owner-retunable; the STRUCTURE (a
   * bounded, monotone, never-flat attenuation) is what the pins lock.
   */
  DISTANCE_PRICE: 0.75,
  /** Law 1's ceiling, read from the I1 table so there is one authored copy. */
  FIDELITY_CEILING: INFORMATION_BROKERAGE_TUNING.FIDELITY_CEILING,
  BELIEF_FIDELITY_CHANNELS,
});

/**
 * The competence a settlement's houses bring to a BELIEF, the mean of their competence
 * across the three channels a belief record spans. 0 when no house stands, which is the
 * dormant reading everywhere outside a brokerage settlement.
 *
 * @param {readonly import('./brokerageStamps.js').BrokerageHouse[]|null|undefined} houses
 * @returns {number} in [0, FIDELITY_CEILING]
 */
export function beliefChannelCompetence(houses) {
  let total = 0;
  for (const channel of BELIEF_FIDELITY_CHANNELS) total += houseChannelCompetence(houses, channel);
  return clamp01(Math.min(
    total / BELIEF_FIDELITY_CHANNELS.length,
    INFORMATION_BROKERAGE_TUNING.FIDELITY_CEILING,
  ));
}

/**
 * THE FIDELITY TERM. The accuracy floor a house puts under one (observer, subject) pair:
 * its belief competence, attenuated by the news distance to the subject. Total and
 * fail-closed: no competence, or an unreadable delay, reads as no floor at all.
 *
 * @param {number} competence01 the house competence from `beliefChannelCompetence`
 * @param {unknown} newsDelayTicks the news-distance surcharge to the subject
 * @returns {number} in [0, FIDELITY_CEILING], strictly below 1
 */
export function brokerageAccuracyFloor01(competence01, newsDelayTicks) {
  const competence = clamp01(typeof competence01 === 'number' && Number.isFinite(competence01) ? competence01 : 0);
  if (competence <= 0) return 0;
  const delay = typeof newsDelayTicks === 'number' && Number.isFinite(newsDelayTicks)
    ? Math.max(0, Math.floor(newsDelayTicks)) : 0;
  const attenuated = competence / (1 + BROKERAGE_FIDELITY_TUNING.DISTANCE_PRICE * delay);
  return clamp01(Math.min(attenuated, INFORMATION_BROKERAGE_TUNING.FIDELITY_CEILING));
}

/**
 * @typedef {{ decayKeep01: number, accuracyFloor01: number }} SightModifier
 */

/**
 * Build the per-pair brokerage floor closure the kernel hands to `composeBrokerageSight`,
 * or NULL when the layer is dark (design Law 5) so the composition is a no-op.
 *
 * The gate is checked BEFORE the frozen digest is read, so a dark campaign pays for
 * nothing: no digest build, no roster walk, no closure.
 *
 * @param {Object} args
 * @param {{ spatialCanonVersion?: unknown, simulationRules?: unknown, spatialLedgers?: unknown,
 *   spatialDigest?: unknown }|null|undefined} args.worldState
 * @param {Map<string, unknown>|null|undefined} args.byId
 *   the tick snapshot index (observer id to its snapshot item)
 * @returns {((observerId: string, subjectId: string) => number)|null}
 */
export function makeBrokerageFloorFn({ worldState, byId }) {
  if (!brokerageEffectsActive(worldState)) return null;
  const index = byId instanceof Map ? byId : new Map();
  // The same two readers the belief engine's own news pricing uses, so the register and
  // the rumour it grades never disagree about how far away a subject is.
  const digest = activeSpatialDigest(
    /** @type {Parameters<typeof activeSpatialDigest>[0]} */ (worldState),
  );
  const embattlementOf = digest ? (/** @type {string} */ sid) => embattlementLevel(worldState, sid) : null;
  /** @type {Map<string, number>} */
  const competenceCache = new Map();
  const competenceOf = (/** @type {string} */ observerId) => {
    const key = String(observerId);
    const cached = competenceCache.get(key);
    if (cached !== undefined) return cached;
    const item = index.get(key);
    const settlement = item != null && typeof item === 'object'
      ? /** @type {{ settlement?: unknown }} */ (item).settlement : null;
    // THE ROSTER IS READ THROUGH THE CANONICAL RUIN FILTER (institutionRoster), never raw.
    // A house that a calamity flattened, that the town abandoned, or that closed for want
    // of coin is still sitting in the roster, and crediting it here would sharpen a
    // settlement's read of the world on the strength of a burnt-out register — the
    // ruin-filter class, in the shape K1 recorded for hasPrison. `liveInstitutions` is also
    // this call site's settlement-to-roster accessor (total over a missing or non-array
    // roster), so the read has ONE spelling rather than a hand-rolled narrowing beside it.
    // The presence gate re-applies the same predicate for callers that hand it a bare
    // roster; the two agree by construction because both name isLiveInstitution.
    const host = settlement != null && typeof settlement === 'object'
      ? /** @type {{ institutions?: unknown }} */ (settlement) : null;
    const value = beliefChannelCompetence(brokerageHousesOf(liveInstitutions(host)));
    competenceCache.set(key, value);
    return value;
  };
  return (observerId, subjectId) => {
    const competence = competenceOf(observerId);
    if (competence <= 0) return 0;
    const delay = digest
      ? routeAwareHopDelayTicks(digest, String(subjectId), String(observerId), embattlementOf)
      : 0;
    return brokerageAccuracyFloor01(competence, delay);
  };
}

/**
 * Compose the brokerage floor INTO the existing sight closure. Returns the caller's own
 * closure by reference when there is no floor function, which is the dormancy anchor: the
 * kernel's argument is then the identical object it was before this module existed.
 *
 * When both are live the composition takes the BETTER floor and leaves the decay
 * modifier alone. A house sharpens what a settlement hears; it does not slow how fast the
 * settlement forgets, which is the SEE posture's own effect and stays its own.
 *
 * @param {((observerId: string, subjectId: string) => SightModifier)|null|undefined} baseSightOf
 * @param {((observerId: string, subjectId: string) => number)|null|undefined} floorOf
 * @returns {((observerId: string, subjectId: string) => SightModifier)|null}
 */
export function composeBrokerageSight(baseSightOf, floorOf) {
  if (typeof floorOf !== 'function') return typeof baseSightOf === 'function' ? baseSightOf : null;
  return (observerId, subjectId) => {
    const base = typeof baseSightOf === 'function' ? baseSightOf(observerId, subjectId) : null;
    const baseFloor = base && typeof base.accuracyFloor01 === 'number' && Number.isFinite(base.accuracyFloor01)
      ? base.accuracyFloor01 : 0;
    const baseDecay = base && typeof base.decayKeep01 === 'number' && Number.isFinite(base.decayKeep01)
      ? base.decayKeep01 : 0;
    const floor = floorOf(observerId, subjectId);
    if (!(floor > baseFloor)) return base || { decayKeep01: baseDecay, accuracyFloor01: baseFloor };
    return { decayKeep01: baseDecay, accuracyFloor01: floor };
  };
}
