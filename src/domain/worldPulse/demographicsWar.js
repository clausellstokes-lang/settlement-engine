/**
 * demographicsWar.js — WAVE P4 (THE WORLD'S HAND), MOTIVE vs CAPABILITY, THROUGH BELIEF.
 * docs/DESIGN_DEMOGRAPHIC_ENGINE.md law 6 and §6 are this file's contract.
 *
 * "Scarcity creates motive; surplus creates CAPABILITY (armies eat). The war read
 * splits them: a starving fractured realm WANTS war and cannot wage it; a fed realm
 * CAN and may not need to. And the actor acts on PERCEIVED scarcity through its belief
 * map, never omniscient truth, so a court can invade a neighbour it wrongly believes
 * grain-rich and destroy the route both needed."
 *
 * NO PARALLEL MOTIVE PATH. §0b traced the insertion point and it already exists and is
 * already wired: `resource_pressure` is a first-class casus belli in the live per-pair
 * loop, scored off `pressureBlend` = 0.6 x food + 0.4 x economy. The casus taxonomy is
 * walker-enforced for totality AND bijection, so a second demographic casus would be a
 * registry violation before it was a design mistake. This file therefore produces THREE
 * numbers that warReasons.js feeds into that ONE existing scorer, and it produces no
 * reason type, no ledger key, no event and no draw.
 *
 * NO SECOND CAP. RESOURCE_ENVY_GAIN (the envy gradient's gain) and the x1.30
 * war-factor cap already supply law 6's banded appetite, and every reading here is a
 * BLEND that leaves the 0..1 surface those two act on exactly where it was. Pressure
 * raises the weight inside the authored band and never past it: "the realm develops
 * reasons, not mania."
 *
 * THE THREE READINGS:
 *
 *   MOTIVE      how badly THIS settlement needs what a neighbour has, blended from the
 *               existing food/economy pressure, its own demographic pressure, and the
 *               realm's carrying-capacity divergence inside its own small share.
 *   CAPABILITY  whether it can actually march. Armies eat, so hunger at home and a
 *               realm living past its own harvest both take capability away, down to a
 *               floor that is never zero: a starving realm can still raid its
 *               neighbour's granary; it cannot campaign for a season.
 *   BELIEF      what the court THINKS the neighbour has, resolved through the ONE
 *               belief selector every other actor read routes through. Omniscient or
 *               unmarked worlds fall back to truth verbatim, so dark is byte-identical.
 *
 * WHY THE PERCEIVED READ USES THE DEMOGRAPHIC AXIS. The belief record already carries
 * `populationTrendBand`, the D-1 DEMOGRAPHIC axis: a believed -2..+2 running from
 * emptying to swelling. A neighbour a court believes to be SWELLING is a neighbour it
 * believes is being fed, which is exactly the grain-rich misreading the design names.
 * The axis is optional (it exists only when beliefAxesEnabled is lit), so its absence
 * falls back to the neutral band rather than to truth: a court with a picture but no
 * demographic detail knows it is guessing.
 *
 * Pure leaf: no store, no React, no clock, no randomness, no I/O, no writes.
 *
 * @enforced-by tests/domain/demographicsWorldsHand.test.js
 */

import { clamp, clamp01 } from '../../kernel/math.js';
import { belief } from './beliefMap.js';
import {
  densityCeilingOf,
  effectiveBoundOf,
  foodCapacityOf,
  foodDeficit01Of,
  pressureOf,
} from './demographicsRates.js';

/** @typedef {import('./demographicsRates.js').DemoSettlement} DemoSettlement */

/**
 * THE BANDS (design §10 — tuning-pass property). Every weight below is a SHARE of one
 * blend that already summed to 1, so nothing here widens the 0..1 surface the existing
 * gain and cap act on.
 */
export const WAR_DEMOGRAPHIC_TUNING = Object.freeze({
  // The settlement's own carrying-capacity pressure, as a share of the pressure blend.
  DEMOGRAPHIC_SHARE: 0.35,
  // The realm's divergence, as its own smaller share (law 6's realm-scale appetite).
  REALM_SHARE: 0.15,
  // Capability: what hunger at home and a realm past its harvest take away.
  LOCAL_HUNGER_COST: 0.55,
  LOCAL_STRAIN_COST: 0.25,
  REALM_STRAIN_COST: 0.30,
  // A starving realm can still raid a granary. It cannot campaign for a season.
  CAPABILITY_FLOOR: 0.20,
  // The believed foe pressure per populationTrendBand, indexed by (band + 2) over the
  // closed -2..+2 vocabulary: an emptying neighbour looks strained, a swelling one
  // looks well fed, and a court that invades the second one is acting on the picture.
  PERCEIVED_BY_TREND: Object.freeze([0.80, 0.65, 0.50, 0.35, 0.20]),
  // A picture with no demographic detail, and a subject no picture was ever formed of.
  NEUTRAL_PERCEIVED: 0.50,
});

const W = WAR_DEMOGRAPHIC_TUNING;

/** @param {unknown} v @returns {Record<string, unknown>} */
function asObject(v) {
  return v && typeof v === 'object' && !Array.isArray(v) ? /** @type {Record<string, unknown>} */ (v) : {};
}
/** @param {unknown} v @param {number} fallback @returns {number} */
function num(v, fallback) {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}
/** @param {number} v @returns {number} */
function round4(v) {
  return Math.round(v * 10000) / 10000;
}

/**
 * ONE SETTLEMENT'S DEMOGRAPHIC PRESSURE as a 0..1 motive reading. `pressureOf` runs to
 * PRESSURE_MAX (2) because famine lag is real and narratable, but a settlement that has
 * already passed its bound is under as much motive as motive goes, so the read saturates
 * at the bound rather than rewarding the overshoot twice.
 * @param {DemoSettlement|null|undefined} settlement
 * @param {{ spatialLedgers?: unknown, simulationRules?: unknown }|null|undefined} worldState
 * @param {string} settlementId
 * @returns {number} 0..1
 */
export function demographicPressure01Of(settlement, worldState, settlementId) {
  const population = Math.max(0, Math.round(num(asObject(settlement).population, 0)));
  const bound = effectiveBoundOf(
    foodCapacityOf(settlement, worldState, settlementId),
    densityCeilingOf(settlement, worldState, settlementId),
  );
  return clamp01(pressureOf(population, bound.bound));
}

/**
 * THE MOTIVE BLEND. The existing food/economy pressure keeps the majority share; the
 * settlement's own carrying-capacity pressure and the realm's divergence take the two
 * authored shares. The result is a 0..1 number in exactly the units
 * `scoreResourcePressure` already consumes, so the envy gain and the war-factor cap are
 * untouched.
 * @param {{ base01: number, own01: number, realm01: number }} input
 * @returns {number} 0..1
 */
export function foldDemographicMotive(input) {
  const base = clamp01(num(asObject(input).base01, 0));
  const own = clamp01(num(asObject(input).own01, 0));
  const realm = clamp01(num(asObject(input).realm01, 0));
  const baseShare = 1 - W.DEMOGRAPHIC_SHARE - W.REALM_SHARE;
  return clamp01(baseShare * base + W.DEMOGRAPHIC_SHARE * own + W.REALM_SHARE * realm);
}

/**
 * @typedef {Object} WarCapability
 * @property {number} capability01 0..1, floored at CAPABILITY_FLOOR
 * @property {number} hunger01     the local food deficit that took capability away
 * @property {number} localStrain01 how far past its own bound the settlement is living
 * @property {number} realmStrain01 how far past its harvest the realm is living
 * @property {boolean} constrained  capability fell measurably below full
 */

/**
 * CAPABILITY: ARMIES EAT. Surplus is what lets a court put a season's campaign in the
 * field; hunger at home and a realm already living past its own harvest are what take
 * that away. The floor is deliberate and named: a starving realm has not lost the
 * ability to raid, only the ability to campaign, and a zero here would silently make
 * famine a peace treaty.
 * @param {{ settlement: DemoSettlement|null|undefined,
 *   worldState: { spatialLedgers?: unknown, simulationRules?: unknown }|null|undefined,
 *   settlementId: string, realmPressure01?: number }} input
 * @returns {WarCapability}
 */
export function warCapabilityOf(input) {
  const settlement = /** @type {DemoSettlement|null} */ (asObject(input).settlement || null);
  // Restored to the shape this function's own @param contracts for, exactly as the
  // settlement read above is: `asObject` is the defensive read and it erases both.
  const worldState = /** @type {{ spatialLedgers?: unknown, simulationRules?: unknown }|null|undefined} */ (
    asObject(input).worldState);
  const id = String(asObject(input).settlementId || '');
  const population = Math.max(0, Math.round(num(asObject(settlement).population, 0)));
  const bound = effectiveBoundOf(
    foodCapacityOf(settlement, worldState, id),
    densityCeilingOf(settlement, worldState, id),
  );
  const hunger01 = foodDeficit01Of(settlement);
  const localStrain01 = clamp01(pressureOf(population, bound.bound) - 1);
  const realmStrain01 = clamp01(num(asObject(input).realmPressure01, 0) - 1);
  const capability01 = clamp(
    1 - (W.LOCAL_HUNGER_COST * hunger01 + W.LOCAL_STRAIN_COST * localStrain01 + W.REALM_STRAIN_COST * realmStrain01),
    W.CAPABILITY_FLOOR,
    1,
  );
  return {
    capability01: round4(capability01),
    hunger01: round4(hunger01),
    localStrain01: round4(localStrain01),
    realmStrain01: round4(realmStrain01),
    constrained: capability01 < 1,
  };
}

/**
 * @typedef {Object} PerceivedScarcity
 * @property {number} foe01     the pressure the observer BELIEVES the subject is under
 * @property {string} source    'truth' | 'belief' | 'unknown'
 * @property {boolean} mistaken the believed reading differs from the truth by a band or more
 * @property {number} truth01   the ground truth, carried so a receipt can name the error
 */

/**
 * PERCEIVED, NEVER OMNISCIENT. Routed through the ONE belief selector so this read
 * inherits the whole epistemics estate: the self carve-out, the omniscient fallback,
 * the unmarked-world fallback, and absence-as-information when a court has formed no
 * picture at all. Dark on every one of those paths means the truth verbatim, which is
 * what keeps a dormant world byte-identical.
 *
 * @param {{ observerId: string, subjectId: string,
 *   worldState: Record<string, unknown>|null|undefined, truth01: number }} input
 * @returns {PerceivedScarcity}
 */
export function perceivedScarcityOf(input) {
  const truth01 = clamp01(num(asObject(input).truth01, 0));
  const resolved = belief(
    String(asObject(input).observerId || ''),
    String(asObject(input).subjectId || ''),
    /** @type {Parameters<typeof belief>[2]} */ (asObject(input).worldState),
  );
  if (resolved.source === 'truth') {
    return { foe01: truth01, source: 'truth', mistaken: false, truth01 };
  }
  if (resolved.source === 'unknown') {
    // A court that has heard nothing assumes the middle, and knows it is assuming.
    return {
      foe01: W.NEUTRAL_PERCEIVED,
      source: 'unknown',
      mistaken: Math.abs(W.NEUTRAL_PERCEIVED - truth01) >= 0.25,
      truth01,
    };
  }
  const band = asObject(resolved.record).populationTrendBand;
  const foe01 = typeof band === 'number' && Number.isFinite(band)
    ? num(W.PERCEIVED_BY_TREND[clamp(Math.round(band) + 2, 0, 4)], W.NEUTRAL_PERCEIVED)
    : W.NEUTRAL_PERCEIVED;
  return { foe01, source: 'belief', mistaken: Math.abs(foe01 - truth01) >= 0.25, truth01 };
}

/**
 * THE CLAUSE A RECEIPT APPENDS when the court acted on a picture rather than on the
 * ground. Empty when the read was the truth, so a dormant world appends nothing and the
 * existing receipt string is byte-identical.
 * @param {PerceivedScarcity} perceived @returns {string}
 */
export function perceivedScarcityClause(perceived) {
  if (!perceived || perceived.source === 'truth') return '';
  const belief01 = num(perceived.foe01, 0);
  const truth = num(perceived.truth01, 0);
  const picture = perceived.source === 'unknown'
    ? 'The court has had no word of that place in a long while'
    : belief01 < truth
      ? 'The court believes their granaries are full'
      : 'The court believes their granaries are bare';
  const correction = perceived.mistaken
    ? ' and the court is wrong about it.'
    : ' and it happens to be so.';
  return ` ${picture}${correction}`;
}

/**
 * THE CLAUSE A RECEIPT APPENDS when the want outran the means. Empty when capability
 * is full, so an unconstrained pair reads exactly as it did before this wave.
 * @param {WarCapability} capability @returns {string}
 */
export function warCapabilityClause(capability) {
  if (!capability || capability.constrained !== true) return '';
  return capability.capability01 <= W.CAPABILITY_FLOOR + 0.05
    ? ' The want is there and the means are not: this realm cannot feed a season in the field.'
    : ' The granaries would have to answer for the march, and they answer thinly.';
}

/**
 * @typedef {Object} DemographicWarTerms
 * @property {number} own01        the motive blend the envy gradient reads for the actor
 * @property {number} foe01        the PERCEIVED pressure it reads for the subject
 * @property {number} capability01 the multiplier the score is damped by
 * @property {string} note         the receipt clauses, '' when nothing was perceived or damped
 * @property {string} beliefSource 'truth' | 'belief' | 'unknown'
 * @property {boolean} mistaken    the actor's picture of the subject is wrong by a band
 */

/**
 * THE WHOLE P4 WAR READ FOR ONE DIRECTED PAIR, assembled here so warReasons.js gains
 * one call rather than an engine. Motive is the actor's blend; the foe term is what the
 * actor BELIEVES rather than what is true; capability is what the actor can actually
 * field. Callers gate on `demographicsActive` before calling.
 *
 * @param {{ worldState: Record<string, unknown>|null|undefined,
 *   fromId: string, toId: string,
 *   fromSettlement: DemoSettlement|null|undefined,
 *   toSettlement: DemoSettlement|null|undefined,
 *   base01: number, baseFoe01: number, realmPressure01: number }} input
 * @returns {DemographicWarTerms}
 */
export function demographicWarTermsFor(input) {
  // Restored to the shape this function's own @param contracts for: `asObject` is the
  // defensive read and it erases the declared type, and `ws` then feeds three readers
  // that each want the world shape back.
  const ws = /** @type {Record<string, unknown>|null|undefined} */ (asObject(input).worldState);
  const fromId = String(asObject(input).fromId || '');
  const toId = String(asObject(input).toId || '');
  const realm01 = clamp01(num(asObject(input).realmPressure01, 0));

  const ownDemo01 = demographicPressure01Of(
    /** @type {DemoSettlement|null} */ (asObject(input).fromSettlement || null), ws, fromId);
  const foeDemo01 = demographicPressure01Of(
    /** @type {DemoSettlement|null} */ (asObject(input).toSettlement || null), ws, toId);

  const perceived = perceivedScarcityOf({
    observerId: fromId,
    subjectId: toId,
    worldState: /** @type {Record<string, unknown>} */ (ws),
    truth01: foeDemo01,
  });
  const capability = warCapabilityOf({
    settlement: /** @type {DemoSettlement|null} */ (asObject(input).fromSettlement || null),
    worldState: ws,
    settlementId: fromId,
    realmPressure01: realm01,
  });

  return {
    own01: foldDemographicMotive({
      base01: num(asObject(input).base01, 0),
      own01: ownDemo01,
      realm01,
    }),
    // The foe term keeps the existing food/economy reading as its base and takes the
    // PERCEIVED demographic pressure in the same authored share the actor's own term
    // takes its truth, so the two sides of the gradient are measured on one scale.
    foe01: foldDemographicMotive({
      base01: num(asObject(input).baseFoe01, 0),
      own01: perceived.foe01,
      realm01,
    }),
    capability01: capability.capability01,
    note: `${perceivedScarcityClause(perceived)}${warCapabilityClause(capability)}`,
    beliefSource: perceived.source,
    mistaken: perceived.mistaken,
  };
}
