/**
 * demographicsRisk.js — WAVE P4 (THE WORLD'S HAND), THE CAUSAL RISK CONDITIONS.
 * docs/DESIGN_DEMOGRAPHIC_ENGINE.md law 5 and §7 are this file's contract.
 *
 * THE LAW, STATED BEFORE THE CODE BECAUSE THE CODE IS SHAPED BY IT:
 *
 *   "CURBS ARE WORLD EVENTS, NEVER INVISIBLE MATH. Disease, beast raids, catastrophe
 *   and war curb density through the EXISTING stressor machinery with incidence
 *   coupled to demographic state — a packed, hungry city invites plague; a sprawling
 *   underdefended satellite invites raids."
 *
 * So the engine never raises a disaster because the realm is "too full". It raises the
 * CONDITIONS that make a disaster likelier, and the disaster fires on its own existing
 * rules, at its own existing seam, with its own existing severity draw. This module
 * computes those conditions and NOTHING ELSE: it emits no event, mints no candidate,
 * writes no key, takes no draw, and holds no state.
 *
 * NO HIDDEN GOVERNOR, STRUCTURALLY. Every reading below is a function of ONE
 * settlement's own state. There is no realm total, no settlement count, no population
 * target and no realm-scale term anywhere in this file, and there is no import that
 * could supply one — demographicsObservation.js (which owns the realm reading) is
 * deliberately NOT imported here, and a source scan pins that absence. A realm-total
 * term inside an incidence deriver would BE the balancing hand law 5 forbids, and the
 * only defence against it that survives a refactor is that the number is not reachable.
 *
 * §0b NAMED TWO TRAPS AND BOTH ARE ANSWERED HERE:
 *
 *   1. THE SATURATION TRAP. The existing population contributors are STEPS at
 *      `pop >= 5000` (causalState.js deriveHousingPressure: a flat -4; capacityModel's
 *      demand rows likewise), so every settlement from five thousand to twenty-nine
 *      trillion people lands in one bucket and the entire runaway range reads
 *      identically. Every term in this file is CONTINUOUS in the head count, because
 *      it is driven by `pressure01 = population / min(K_food, D_tier)` — a ratio that
 *      keeps climbing after the tier ordinal has stopped moving. A pin measures the
 *      term at three populations above five thousand and requires three distinct
 *      values.
 *   2. THE HARD-GATE TRAP. The disease consumer reads housing pressure through a hard
 *      threshold (`pressureModel.js`: `if (scores.housing_pressure < 45) disease +=
 *      0.08`), so a crowding term routed through the housing score would be swallowed
 *      whole on either side of 45 and would deliver a step even if it were smooth. The
 *      lift below is therefore added to the DISEASE PRESSURE ITSELF at the one seam,
 *      alongside that gate rather than through it.
 *
 * THE THREE COUPLINGS, in the design's own words. Crowding plus poor sanitation raises
 * DISEASE susceptibility; dense trade accelerates transmission; frontier sprawl and low
 * defence raise RAID exposure. Crowding is the CONDITION in the disease pair and the
 * other two are ACCELERANTS on it: an uncrowded town with filthy water and a busy road
 * takes no lift at all from this module, because a settlement that is not packed is not
 * the packed hungry city the law describes. The raid pair is additive instead, because
 * an underdefended place is exposed whether or not it sprawls.
 *
 * FINITE SEMANTICS: every dial is a named constant in ONE authored table, every output
 * is a bounded 0..1 reading, and no surface shows any of them.
 *
 * Pure leaf: no store, no React, no clock, no randomness, no I/O, no writes.
 *
 * @enforced-by tests/domain/demographicsWorldsHand.test.js
 */

import { clamp01 } from '../../kernel/math.js';
import {
  DEMOGRAPHIC_TUNING,
  densityCeilingOf,
  effectiveBoundOf,
  foodCapacityOf,
  foodDeficit01Of,
  pressureOf,
} from './demographicsRates.js';

/** @typedef {import('./demographicsRates.js').DemoSettlement} DemoSettlement */

/**
 * THE INCIDENCE COUPLING BANDS (design §10 — tuning-pass property, owner-signed at the
 * soak redo). Each gain is the MOST that term may add to an existing pressure score,
 * and the two caps bound the whole coupling: the couplings tilt the odds, they never
 * own them, because the disaster still fires on the stressor lane's own rules.
 */
export const RISK_TUNING = Object.freeze({
  // Crowding is measured above an ease point, so a half-empty valley couples nothing.
  // The scale runs from the ease point to the pressure read's own ceiling, which is
  // what keeps the term climbing long after the tier ordinal has saturated.
  CROWDING_EASE: 0.60,
  // The three disease terms. Crowding alone is the condition; filth and traffic are
  // accelerants that can only act THROUGH crowding.
  CROWDING_DISEASE_GAIN: 0.10,
  SANITATION_DISEASE_GAIN: 0.09,
  TRANSMISSION_DISEASE_GAIN: 0.06,
  DISEASE_LIFT_CAP: 0.22,
  // Hunger keeps its own small share of the disease coupling: the design's example is
  // a city that is packed AND hungry, and a granary-empty crowd sickens faster.
  DEFICIT_DISEASE_GAIN: 0.05,
  // The two raid terms, additive: an underdefended place is exposed on its own, and
  // sprawl multiplies what the raiders can reach.
  DEFENSE_EASE: 60,
  SPRAWL_RAID_GAIN: 0.09,
  DEFENSE_GAP_RAID_GAIN: 0.13,
  RAID_LIFT_CAP: 0.20,
});

const R = RISK_TUNING;

/** @param {unknown} v @returns {Record<string, unknown>} */
function asObject(v) {
  return v && typeof v === 'object' && !Array.isArray(v) ? /** @type {Record<string, unknown>} */ (v) : {};
}
/** @param {unknown} v @param {number} fallback @returns {number} */
function num(v, fallback) {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}
/** @param {number} v @returns {number} 4dp so a receipt compares by value across machines */
function round4(v) {
  return Math.round(v * 10000) / 10000;
}
/** A 0..100 causal score read as a 0..1 SHORTFALL (higher = worse), total on absence.
 *  @param {Record<string, unknown>|null|undefined} scores @param {string} key
 *  @param {number} fallback @returns {number} */
function shortfall01(scores, key, fallback) {
  const raw = num(asObject(scores)[key], fallback);
  return clamp01((100 - raw) / 100);
}

/**
 * @typedef {Object} DemographicRisk
 * @property {number} pressure01     population / min(K_food, D_tier), the continuous read
 * @property {number} crowding01     the share of that pressure above the ease point
 * @property {number} sanitation01   0 clean, 1 filthy (healing capacity + built condition)
 * @property {number} transmission01 how much traffic the place carries
 * @property {number} deficit01      the live food deficit
 * @property {number} sprawl01       the share of this settlement's own ground standing empty
 * @property {number} defenseGap01   how far readiness falls short of the ease point
 * @property {number} diseaseLift01  the bounded lift on DISEASE pressure
 * @property {number} raidLift01     the bounded lift on CONFLICT (raid exposure) pressure
 * @property {string[]} diseaseReasons  the named clauses, empty when the lift is zero
 * @property {string[]} raidReasons     the named clauses, empty when the lift is zero
 */

/**
 * THE PER-SETTLEMENT RISK CONDITIONS. Callers gate on `demographicsActive` before
 * calling; this function itself never reads the flag, so the pins can drive it directly
 * and the one dormancy gate stays where the design put it.
 *
 * @param {{ settlement: DemoSettlement|null|undefined,
 *   worldState: { spatialLedgers?: unknown, simulationRules?: unknown }|null|undefined,
 *   settlementId: string,
 *   scores?: Record<string, unknown>|null }} input the causal scores the pressure pass
 *   already holds, passed in rather than re-derived so this module never re-runs a deriver
 * @returns {DemographicRisk}
 */
export function demographicRiskOf(input) {
  const settlement = asObject(input).settlement
    ? /** @type {DemoSettlement} */ (asObject(input).settlement)
    : null;
  const worldState = /** @type {Record<string, unknown>} */ (asObject(asObject(input).worldState));
  const id = String(asObject(input).settlementId || '');
  const scores = asObject(asObject(input).scores);

  const population = Math.max(0, Math.round(num(asObject(settlement).population, 0)));
  const bound = effectiveBoundOf(
    foodCapacityOf(settlement, worldState, id),
    densityCeilingOf(settlement, worldState, id),
  );
  // CONTINUOUS BY CONSTRUCTION: a ratio of the head count to a bound that does not
  // move with it, so the reading keeps rising through and far past five thousand.
  const pressure01 = pressureOf(population, bound.bound);
  const crowding01 = clamp01(
    (pressure01 - R.CROWDING_EASE) / Math.max(1e-9, DEMOGRAPHIC_TUNING.PRESSURE_MAX - R.CROWDING_EASE),
  );

  // Sanitation has no dataset of its own in the tree, so it is read as the shortfall of
  // the two scores that DO speak to it: what the place can heal, and how well it is
  // built. Both are existing derivers; neither is re-derived here.
  const sanitation01 = clamp01(
    0.6 * shortfall01(scores, 'healing_capacity', 50) + 0.4 * shortfall01(scores, 'infrastructure_condition', 50),
  );
  // Dense trade accelerates transmission: the road that feeds a city carries what
  // travels on it. This is the connectivity score read forward (higher = more traffic),
  // never a shortfall.
  const transmission01 = clamp01(num(scores.trade_connectivity, 50) / 100);
  const deficit01 = foodDeficit01Of(settlement);

  // Sprawl: the share of this settlement's OWN ground that stands empty. A steading of
  // forty on ground that would hold three hundred is thin cover over wide land, which
  // is what makes a satellite pay for its cheap acres. Note this is the settlement's
  // own ceiling and never a realm-scale count.
  const sprawl01 = clamp01(1 - population / Math.max(1, bound.densityCeiling));
  const defenseGap01 = clamp01(
    (R.DEFENSE_EASE - num(scores.defense_readiness, 50)) / Math.max(1, R.DEFENSE_EASE),
  );

  const diseaseLift01 = Math.min(
    R.DISEASE_LIFT_CAP,
    crowding01 * (
      R.CROWDING_DISEASE_GAIN
      + R.SANITATION_DISEASE_GAIN * sanitation01
      + R.TRANSMISSION_DISEASE_GAIN * transmission01
      + R.DEFICIT_DISEASE_GAIN * deficit01
    ),
  );
  const raidLift01 = Math.min(
    R.RAID_LIFT_CAP,
    R.SPRAWL_RAID_GAIN * sprawl01 * defenseGap01 + R.DEFENSE_GAP_RAID_GAIN * defenseGap01,
  );

  /** @type {string[]} */
  const diseaseReasons = [];
  if (diseaseLift01 > 0) {
    diseaseReasons.push('the quarters are packed');
    if (sanitation01 >= 0.5) diseaseReasons.push('and the water and the streets are foul');
    if (transmission01 >= 0.5) diseaseReasons.push('and the road brings strangers every week');
    if (deficit01 >= 0.2) diseaseReasons.push('and the crowd is hungry');
  }
  /** @type {string[]} */
  const raidReasons = [];
  if (raidLift01 > 0) {
    if (defenseGap01 > 0) raidReasons.push('the watch is thin');
    if (sprawl01 >= 0.5) raidReasons.push('and the holding is scattered over open ground');
  }

  return {
    pressure01: round4(pressure01),
    crowding01: round4(crowding01),
    sanitation01: round4(sanitation01),
    transmission01: round4(transmission01),
    deficit01: round4(deficit01),
    sprawl01: round4(sprawl01),
    defenseGap01: round4(defenseGap01),
    diseaseLift01: round4(diseaseLift01),
    raidLift01: round4(raidLift01),
    diseaseReasons,
    raidReasons,
  };
}

/** The one-clause reason a pressure entry records for the disease coupling, or ''.
 *  @param {DemographicRisk} risk @returns {string} */
export function diseaseCouplingReason(risk) {
  return risk.diseaseReasons.length ? risk.diseaseReasons.join(' ') : '';
}

/** The one-clause reason a pressure entry records for the raid coupling, or ''.
 *  @param {DemographicRisk} risk @returns {string} */
export function raidCouplingReason(risk) {
  return risk.raidReasons.length ? risk.raidReasons.join(' ') : '';
}
