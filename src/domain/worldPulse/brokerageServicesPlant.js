/**
 * domain/worldPulse/brokerageServicesPlant.js — [W-I INFORMATION BROKERAGES] I4, THE
 * MARKET (docs/DESIGN_INFORMATION_BROKERAGES.md §6 PLANT, §11 slice I4).
 *
 * LIE, INSTITUTIONALIZED. The design's sentence is exact and this module takes it
 * literally: "the already-built LIE verb gains a seller". Nothing here re-implements a
 * lifecycle. The disinformation verb in informationStatecraft.js already seeds a false
 * belief, carries it in the `spatialLedgers.disinfo` ledger, notices when the audience
 * re-anchors toward truth, exposes it, and charges the liar. This module builds the ONE
 * thing that verb has never had: a COMMISSION. A Whisper market takes a power's coin and
 * puts that power's chosen falsehood into somebody else's court.
 *
 * ── WHAT IS PRODUCED, AND WHY IT IS PRODUCED RATHER THAN APPLIED ──
 *
 * `commissionPlant` returns a DisinfoRecord of exactly the shape the LIE verb's own ledger
 * holds, plus the belief override that plants it. It writes nothing. That is deliberate on
 * two counts:
 *
 *   1. informationStatecraft.js is the single writer of `spatialLedgers.disinfo` and of
 *      the belief overrides that ride with it. A second writer to one ledger is the
 *      cross-writer defect the estate has already paid for elsewhere, and the deposit /
 *      consume idiom (roadsReturnedCaptives, intelTransfers, bluffExposures) exists
 *      precisely so a producer never reaches into a consumer's container.
 *   2. Producing the record makes the composition TESTABLE END TO END WITHOUT the wiring:
 *      tests/domain/brokeragePlant.test.js hands a commissioned record to the REAL
 *      `processLies` and watches the real triple fire, so the claim "the existing
 *      contradict, expose and blowback prices failure" is executed rather than asserted.
 *
 * THE REQUIRED WIRING IS ONE CALL, and it is reported rather than made because
 * informationStatecraft.js is another session's file this session. See the block comment
 * at `PLANT_WIRING` below for the precise edit.
 *
 * ── THE MARKET'S CREDIBILITY BACKS THE LIE, AND PAYS FOR IT ──
 *
 * Ex ante, the plant is believed in proportion to the MARKET's own credibility stock (a
 * house nobody trusts launders nothing), read through the statecraft module's published
 * `credibilityWeight` / `credibilityScoreOf` rather than through a second reading of the
 * stock. Ex post, the exposure charges `record.liarId`, and this module sets `liarId` to
 * the market's own host settlement: the seller wears the failure, which is what makes the
 * credibility stock a real stake and not a decoration. The commissioning patron is carried
 * in the receipt as DM truth.
 *
 * ── TUNING IS BORROWED, NEVER RE-AUTHORED ──
 *
 * Every lifecycle number here is `LIE_TUNING`'s. The exaggeration size, the confidence
 * baseline, the contradiction gap and the shelf life are the SAME constants the verb uses,
 * imported, so a tuning edit to the lie moves the plant with it and the two can never
 * drift into a world where a commissioned lie outlives a court's own bluff for no reason.
 *
 * PURE, TOTAL, ZERO-DRAW: no rng (a commission is an act, not a roll; the initiation
 * rarity that gates a court's spontaneous bluff has no business gating a paid order), no
 * clock, no mutation, no tier read.
 */

import { clamp, clamp01 } from '../../kernel/math.js';
import {
  LIE_TUNING,
  credibilityScoreOf,
  credibilityWeight,
} from './informationStatecraft.js';
import { brokerageEffectsActive, brokerageHouseRosterIn } from './brokerageStamps.js';
import { servicesAvailable, patronPurse01, QUERY_PRICE_BANDS } from './brokerageServices.js';

/**
 * THE PRECISE WIRING THIS SLICE COULD NOT MAKE (informationStatecraft.js is foreign this
 * session). Inside `processLies`, immediately after the seed loop over `liarIds` and
 * before `const disinfo = Object.keys(nextDisinfo).length ? ... `:
 *
 *     for (const plant of commissionedPlants || []) {
 *       if (nextDisinfo[plant.key]) continue;
 *       setOverride(plant.record.audienceId, plant.record.subjectId, plant.override);
 *       nextDisinfo[plant.key] = plant.record;
 *     }
 *
 * with `commissionedPlants` threaded from `advanceInformationStatecraft`, which would call
 * `commissionPlants(...)` from this module. FOUR PROPERTIES make that edit safe, and each
 * is pinned here rather than asserted there:
 *   - the key namespace is `plant:*`, disjoint from the verb's own `lie:*`, so neither can
 *     silently overwrite the other and the verb's one-bluff-per-pair guard is untouched;
 *   - the record shape is byte-compatible with DisinfoRecord, so the carry-forward branch,
 *     the exposure branch and the ledger sort all treat a plant as a first-class lie;
 *   - the override is a complete BeliefRecord, so `applyBeliefOverrides` needs no new case;
 *   - with the brokerage flag dark `commissionPlants` returns an EMPTY array, so the loop
 *     above runs zero times and the verb is byte-identical.
 * @type {string}
 */
export const PLANT_WIRING = 'informationStatecraft.processLies: fold commissionPlants() into nextDisinfo';

/**
 * The two things a patron can pay to have believed. Closed vocabulary. INFLATE is the
 * garrison bluff sold to a third party (make them fear this place); DEFLATE is the crueller
 * one and the reason the market exists at all (make them think this place is weak, and
 * watch what they do about it).
 * @type {readonly string[]}
 */
export const PLANT_INTENTS = Object.freeze(['inflate', 'deflate']);

/** The closed refusal vocabulary. @type {readonly string[]} */
export const PLANT_REFUSALS = Object.freeze([
  'dormant', 'no_market', 'bad_intent', 'cannot_pay', 'no_channel',
]);

/**
 * THE PLANT PRICE (PROPOSED, soak-vetoable). Denominated exactly as the query is, in the
 * patron's political capital, and dearer for two authored reasons: a lie has to be
 * laundered before it will travel, and the market prices the blowback it will wear if the
 * lie is found. The band vocabulary is the query's, so one surface can render both.
 */
export const PLANT_PRICE_TUNING = Object.freeze({
  /** What a commission costs before anything else. */
  BASE: 0.18,
  /** Added per band of exaggeration asked for: a bigger lie is a dearer lie. */
  PER_BAND: 0.04,
  /** A market with a poor name has to work harder to make a lie stick, and charges for it. */
  DISREPUTE_SURCHARGE: 0.12,
  /** No commission may cost a power more than this share of its capital. */
  MAX_PRICE01: 0.45,
  /** Band cut points over the price scalar, ascending (the query's ladder, extended). */
  BAND_CUTS: Object.freeze([0.08, 0.14, 0.22]),
  /** Commissioning a lie is tiring work for the people who have to keep it. */
  EXHAUSTION_W: 0.4,
});

/** @param {unknown} v @returns {Record<string, unknown>} */
function asObject(v) {
  return v != null && typeof v === 'object' && !Array.isArray(v)
    ? /** @type {Record<string, unknown>} */ (v) : {};
}

/** @param {unknown} v @returns {string} */
function text(v) {
  return typeof v === 'string' ? v : String(v == null ? '' : v);
}

/** @param {unknown} v @param {number} fallback @returns {number} */
function num(v, fallback) {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}

/** Four decimal places, the belief ledger's own rounding. @param {number} v @returns {number} */
function round4(v) {
  return Math.round(v * 10000) / 10000;
}

/**
 * The Whisper market standing in a settlement, or null. The ONE place this module decides
 * a house can sell a lie, and it decides it from the DECLARED service key rather than from
 * a name, so a custom illegal-major brokerage sells plants exactly as the native one does
 * (design §3's custom-content clause).
 * @param {unknown} item the snapshot item
 * @returns {import('./brokerageStamps.js').BrokerageHouseRecord|null}
 */
export function marketHouseOf(item) {
  // Delegated roster read (see brokerageHouseRosterIn): the ruin filter lives in ONE file,
  // and a burnt-out market sells nothing because the filter runs before the key read.
  const roster = brokerageHouseRosterIn(asObject(asObject(item).settlement));
  for (const house of roster) {
    if (servicesAvailable(house.legality, house.form, 'crime').includes('info_plant')) return house;
  }
  return null;
}

/**
 * @typedef {Object} PlantPrice
 * @property {number} cost01
 * @property {string} band  one of QUERY_PRICE_BANDS
 */

/**
 * What a commission costs. Rises with the size of the lie and with the market's own
 * disrepute; bounded above so no single order can bankrupt a power.
 * @param {Object} args
 * @param {number} args.bands the exaggeration asked for, in strength bands
 * @param {number} args.credibility01 the market's credibility weight (neutral 1)
 * @returns {PlantPrice}
 */
export function plantPrice({ bands, credibility01 }) {
  const T = PLANT_PRICE_TUNING;
  const size = clamp(Math.abs(Math.round(num(bands, 0))), 0, LIE_TUNING.INFLATE_BANDS * 2);
  const disrepute = clamp01(1 - clamp01(num(credibility01, 1)));
  const cost01 = clamp(T.BASE + T.PER_BAND * size + T.DISREPUTE_SURCHARGE * disrepute, 0, T.MAX_PRICE01);
  let band = 0;
  while (band < T.BAND_CUTS.length && cost01 >= T.BAND_CUTS[band]) band += 1;
  return { cost01, band: QUERY_PRICE_BANDS[band] };
}

/**
 * @typedef {Object} CommissionedPlant
 * @property {string} key      the disinfo-ledger key (`plant:<market>:<audience>:<subject>`)
 * @property {Record<string, unknown>} record   a DisinfoRecord, byte-compatible
 * @property {Record<string, unknown>} override the BeliefRecord to plant
 * @property {Record<string, unknown>} receipt  DM truth: who paid, for what, at what price
 */

/**
 * @typedef {Object} PlantResult
 * @property {boolean} refused
 * @property {{ reason: string, detail: string }|null} refusal
 * @property {CommissionedPlant|null} plant
 * @property {PlantPrice|null} price
 * @property {{ patronId: string, factionPatch: Record<string, unknown> }|null} charge
 */

/** @param {string} reason @param {string} detail @returns {PlantResult} */
function refuse(reason, detail) {
  return { refused: true, refusal: { reason, detail }, plant: null, price: null, charge: null };
}

/**
 * COMMISSION ONE PLANT. Returns the record and the override the LIE verb will consume, or
 * an honest refusal.
 *
 * `audienceBelief` is the audience's CURRENT belief about the subject, and it is required
 * for the same reason the verb requires it: a court with no belief about a place has no
 * channel to hear a lie about it, so there is nowhere for the plant to land. That check is
 * the verb's own (`if (!prior) continue`), applied at the counter instead of at the seed.
 *
 * @param {Object} args
 * @param {unknown} args.worldState
 * @param {unknown} args.item the snapshot item hosting the market
 * @param {string} args.patronId the commissioning power's faction-state key
 * @param {string} args.audienceId the court the lie is planted in
 * @param {string} args.subjectId the settlement lied about
 * @param {number} args.subjectTrueBand the subject's true strength band (caller-held truth)
 * @param {Record<string, unknown>|null} args.audienceBelief the audience's current belief
 * @param {unknown} args.intent one of PLANT_INTENTS
 * @param {number} args.tick
 * @returns {PlantResult}
 */
export function commissionPlant({
  worldState, item, patronId, audienceId, subjectId, subjectTrueBand, audienceBelief, intent, tick,
}) {
  if (!brokerageEffectsActive(worldState)) {
    return refuse('dormant', 'No market in this world sells that.');
  }
  if (!PLANT_INTENTS.includes(text(intent))) {
    return refuse('bad_intent', 'The market does not understand the order.');
  }
  const market = marketHouseOf(item);
  if (!market) {
    return refuse('no_market', 'There is no market here that will place a story for coin.');
  }
  const prior = asObject(audienceBelief);
  if (!Object.keys(prior).length) {
    return refuse('no_channel', 'That court has never heard of the place; there is nothing to correct and no ear to correct it in.');
  }
  const hostId = text(asObject(item).id);
  const now = Math.max(0, Math.floor(num(tick, 0)));
  const credW = credibilityWeight(credibilityScoreOf(
    /** @type {Parameters<typeof credibilityScoreOf>[0]} */ (asObject(worldState)), hostId, now,
  ));
  const direction = text(intent) === 'inflate' ? 1 : -1;
  const trueBand = clamp(Math.round(num(subjectTrueBand, 2)), 0, 4);
  const assertedBand = clamp(trueBand + direction * LIE_TUNING.INFLATE_BANDS, 0, 4);
  const price = plantPrice({ bands: assertedBand - trueBand, credibility01: credW });
  if (patronPurse01(worldState, patronId) < price.cost01) {
    return refuse('cannot_pay', 'The market does not place stories on credit.');
  }
  const record = {
    liarId: hostId,
    subjectId: text(subjectId),
    audienceId: text(audienceId),
    assertedBand,
    trueBand,
    seededTick: now,
    lineageId: `disinfo:${hostId}:${text(audienceId)}:${now}`,
  };
  const override = {
    readiness: round4(clamp01(Math.max(clamp01(num(prior.readiness, 0.25)), 0.5))),
    strengthBand: assertedBand,
    allianceLabel: prior.allianceLabel,
    faithLabel: prior.faithLabel,
    // THE MARKET'S NAME IS THE COLLATERAL: a well-regarded house makes a lie stick, a
    // discredited one barely makes it heard. Same construction the verb uses for a court.
    confidence01: round4(clamp01(LIE_TUNING.BASE_CONFIDENCE * credW)),
    lastUpdateTick: now,
  };
  return {
    refused: false,
    refusal: null,
    plant: {
      key: `plant:${hostId}:${text(audienceId)}:${text(subjectId)}`,
      record,
      override,
      receipt: {
        marketId: market.institutionId,
        marketName: market.name,
        hostId,
        patronId: text(patronId),
        intent: text(intent),
        assertedBand,
        trueBand,
        priceBand: price.band,
        commissionedAtTick: now,
      },
    },
    price,
    charge: {
      patronId: text(patronId),
      factionPatch: plantChargePatch(worldState, patronId, price.cost01, now),
    },
  };
}

/**
 * The faction patch that pays for a commission. Absolute next-values, the rebasing rule
 * `applyFactionPatch` documents.
 * @param {unknown} worldState @param {string} patronId @param {number} cost01 @param {number} tick
 * @returns {Record<string, unknown>}
 */
export function plantChargePatch(worldState, patronId, cost01, tick) {
  const state = asObject(asObject(asObject(worldState).factionStates)[text(patronId)]);
  const price = clamp01(num(cost01, 0));
  return {
    momentum: clamp01(clamp01(num(state.momentum, 0)) - price),
    exhaustion: clamp01(clamp01(num(state.exhaustion, 0)) + price * PLANT_PRICE_TUNING.EXHAUSTION_W),
    lastActedTick: Math.max(0, Math.floor(num(tick, 0))),
    recentAction: 'brokerage_plant',
  };
}

/**
 * IS THE PLANT EXPOSED? The verb's own predicate, re-expressed over the same LIE_TUNING
 * constants so the two can never disagree about when a lie has run out: the audience's
 * belief has re-anchored past the contradiction gap, or the story has simply been afield
 * too long.
 *
 * This exists so the AUDIENCE PROJECTION below can answer "is this still DM truth" without
 * re-running the mover, and tests/domain/brokeragePlant.test.js pins it equal to the real
 * `processLies` outcome over a table rather than trusting the re-expression.
 *
 * @param {Record<string, unknown>|null|undefined} record a DisinfoRecord
 * @param {Record<string, unknown>|null|undefined} audienceBelief the audience's belief NOW
 * @param {number} tick
 * @returns {boolean}
 */
export function plantIsExposed(record, audienceBelief, tick) {
  const rec = asObject(record);
  if (!Object.keys(rec).length) return false;
  const now = Math.max(0, Math.floor(num(tick, 0)));
  const belief = asObject(audienceBelief);
  const asserted = Math.round(num(rec.assertedBand, 0));
  const current = Object.keys(belief).length
    ? Math.round(num(belief.strengthBand, LIE_TUNING.INFLATE_BANDS))
    : Math.round(num(rec.trueBand, 0));
  const contradicted = Math.abs(current - asserted) >= LIE_TUNING.EXPOSE_CONTRADICT_BANDS;
  const agedOut = now - Math.floor(num(rec.seededTick, now)) >= LIE_TUNING.EXPOSE_MAX_AGE_TICKS;
  return contradicted || agedOut;
}

/**
 * THE AUDIENCE PROJECTION (design §6: "plants are DM-truth until exposed"; the
 * consequences doc's audience law).
 *
 * A live plant is INVISIBLE to a player. Not redacted, not hinted at, absent: the whole
 * point of a plant is that the table experiences it as a belief the world holds, and a
 * row saying "this belief was bought" would hand the table the answer to the mystery the
 * plant IS. An EXPOSED plant projects in full, because by then the world knows.
 *
 * The DM projection is the records unchanged, because the DM is the audience the ledger
 * was written for.
 *
 * @param {readonly Record<string, unknown>[]|null|undefined} records
 * @param {Object} [options]
 * @param {string} [options.audience] 'dm' (default) or 'player'
 * @param {(record: Record<string, unknown>) => boolean} [options.isExposed]
 * @returns {readonly Record<string, unknown>[]}
 */
export function projectPlants(records, { audience = 'dm', isExposed = () => false } = {}) {
  const rows = Array.isArray(records) ? records : [];
  if (text(audience) !== 'player') return Object.freeze([...rows]);
  return Object.freeze(rows.filter((record) => isExposed(record) === true));
}
