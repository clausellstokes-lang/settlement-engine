/**
 * domain/worldPulse/brokerageServices.js — [W-I INFORMATION BROKERAGES] I3, THE MENU, THE
 * PRICE, AND THE QUERY (docs/DESIGN_INFORMATION_BROKERAGES.md §6, constitutional Laws 3
 * and 4).
 *
 * SEE, INSTITUTIONALIZED. The statecraft module's SEE posture is a court paying its own
 * agents to watch a rival. The QUERY is the same act bought over a counter: somebody asks
 * the house about a subject, pays an in-world price banded by channel, distance and form,
 * and is handed the house's best reading WITH the honest stamp I2 built.
 *
 * ── THE LAW THIS FILE EXISTS TO KEEP: A QUERY MINTS NO FACT ──
 *
 * "Query results are projections of existing truth and belief, never new facts minted"
 * (§6). That is not a comment here, it is the return type. Every claim in an answer
 * carries a `from` naming the record it was read out of and a `ref` locating it, and there
 * is exactly one place a claim is constructed (`claimFrom`). A reading with no record
 * behind it cannot be built, so the pin can enumerate an answer's claims and resolve every
 * single one back into the world it came from. Two sources are admissible and no third:
 *
 *   'belief'  the settlement's own belief record about the subject, the same
 *             `spatialLedgers.beliefMaps` slot the belief engine wrote.
 *   'truth'   the subject's ground truth as the CALLER supplies it, admitted ONLY where
 *             the house's accuracy floor (I2's distance-attenuated, ceiling-bounded term)
 *             has actually earned it. A house near the subject with correspondents on the
 *             ground can tell you what is so; the same house four roads away cannot, and
 *             hands you the belief instead. That is Law 1 reaching the counter.
 *
 * ── THE PRICE IS REAL, AND THE REFUSAL IS HONEST ──
 *
 * Law 3 is tier-blind: the price is IN-WORLD, denominated in the patron power's political
 * capital (the `factionStates` momentum the faction layer already keeps and already
 * spends), never in credits and never in anything a subscription can read. A patron that
 * cannot cover the price is REFUSED, by name and with a reason, and the refusal path
 * returns no answer at all rather than a degraded one. A house that would answer on credit
 * is a house whose stamp means nothing.
 *
 * ── THE BELIEF READ IS LOCAL, DELIBERATELY ──
 *
 * The belief slot is read through a four-line nested accessor rather than by importing
 * beliefMap.js, for the reason I2's `rumorLedgersOf` states and for one more: beliefMap.js
 * imports the feed half of this slice, so importing it back would close a module cycle
 * through the belief advance. The local read is pinned equal to the canonical
 * `beliefRecord` over a tolerance table in tests/domain/brokerageServices.test.js.
 *
 * PURE, TOTAL, ZERO-DRAW: no rng, no clock, no mutation, no tier read, no store. Every
 * accessor fails CLOSED: an unknown channel, an absent house, a subject nobody has heard
 * of, or a dark flag reads as a REFUSAL, never as a guess.
 */

import { clamp, clamp01 } from '../../kernel/math.js';
import {
  INFORMATION_CHANNELS,
  INFORMATION_BROKERAGE_TUNING,
  BROKERAGE_SERVICE_KEYS,
} from '../../data/informationBrokerageTuning.js';
import {
  BROKERAGE_STAMP_TUNING,
  brokerageEffectsActive,
  brokerageHouseRosterIn,
  houseChannelCompetence,
  newsReliabilityStamp,
} from './brokerageStamps.js';
import { brokerageAccuracyFloor01 } from './brokerageFidelity.js';

// ── The menu (design §3's closed service keys, made total over the cells) ─────

/**
 * THE SERVICE AVAILABILITY TABLE, total over legality x form x channel with NO
 * fall-through (design §10's totality requirement). Read it through
 * `servicesAvailable`, which is the only caller allowed to answer the question.
 *
 * The rules, each with the reason it is a rule and not a preference:
 *   info_calibration  always. Presence alone grades the news (I2), and a house that
 *                     declines a channel still keeps a register.
 *   info_query        only where the house will VOUCH for the channel. The vouch floor is
 *                     I2's, shared rather than re-authored, so a house that stays silent
 *                     on the Herald cannot be paid to speak in private either. That
 *                     consistency is the whole value of the stamp.
 *   info_feed         major forms only. A standing contract needs correspondents on
 *                     several roads; a small house sells piecework.
 *   info_plant        illegal major only (design §6). One seller of lies in the realm.
 * @type {readonly string[]}
 */
export const BROKERAGE_SERVICE_MENU_KEYS = BROKERAGE_SERVICE_KEYS;

/**
 * The services one house will actually sell in one channel, in the canonical key order.
 * TOTAL: an unknown legality, form or channel yields the EMPTY menu, which is a refusal
 * rather than a default.
 * @param {unknown} legality @param {unknown} form @param {unknown} channel
 * @returns {readonly string[]}
 */
export function servicesAvailable(legality, form, channel) {
  const legal = String(legality) === 'legal';
  const illegal = String(legality) === 'illegal';
  const minor = String(form) === 'minor';
  const major = String(form) === 'major';
  if (!(legal || illegal) || !(minor || major)) return Object.freeze([]);
  if (!INFORMATION_CHANNELS.includes(String(channel))) return Object.freeze([]);
  const competence = houseChannelCompetence([{ legality: String(legality), form: String(form) }], channel);
  const keys = ['info_calibration'];
  if (competence >= BROKERAGE_STAMP_TUNING.CHANNEL_VOUCH_FLOOR) keys.push('info_query');
  if (major) keys.push('info_feed');
  if (major && illegal) keys.push('info_plant');
  return Object.freeze(BROKERAGE_SERVICE_KEYS.filter((key) => keys.includes(key)));
}

// ── The channel-to-belief-axis join (a channel is not an axis) ────────────────

/**
 * WHAT A BELIEF RECORD CAN ACTUALLY ANSWER, per channel. A belief carries a strength band
 * and a readiness (war), an alliance label (politics) and an observance label (faith), and
 * carries NOTHING about trade, crime or persons. So those three channels answer with a
 * GRADE and a register count and no axis reading at all, and saying so is the honest
 * shape: inventing a trade axis here would be exactly the minted fact §6 forbids.
 *
 * RECORDED SEAM: give the belief record a trade or persons axis and this table is where
 * the query starts answering them. The table is total against INFORMATION_CHANNELS and the
 * pin fails on a missing or extra channel, so the widening cannot be half-done.
 * @type {Readonly<Record<string, readonly string[]>>}
 */
export const CHANNEL_BELIEF_AXES = Object.freeze({
  trade: Object.freeze([]),
  war: Object.freeze(['strengthBand', 'readiness']),
  politics: Object.freeze(['allianceLabel']),
  faith: Object.freeze(['faithLabel']),
  crime: Object.freeze([]),
  persons: Object.freeze([]),
});

// ── The price (Law 3: in-world, banded, never a number on a surface) ─────────

/**
 * THE PRICE BANDS, best-to-worst for the buyer. Closed vocabulary; the surface renders the
 * band's prose and never the scalar (the legibility law, and the game-grade doctrine's
 * "translate formulas, never show them").
 * @type {readonly string[]}
 */
export const QUERY_PRICE_BANDS = Object.freeze(['token', 'fee', 'purse', 'fortune']);

/** The glance label of each band. @type {readonly string[]} */
const BAND_LABELS = Object.freeze(['A token', 'A fee', 'A purse', 'A fortune']);

/** The sentence reading of each band. @type {readonly string[]} */
const BAND_SENTENCES = Object.freeze([
  'The house asks little for this; it already had the answer.',
  'The house names an ordinary rate, the sort a merchant pays without argument.',
  'The house wants real coin for this, and will want it before it speaks.',
  'The house asks a price that would fund a season of correspondents, because that is what it would take.',
]);

/**
 * THE PRICE TUNING (PROPOSED, soak-vetoable in the I1 band idiom). Prices are fractions of
 * a power's political capital, so they are comparable across settlements of any size and
 * read nothing from anywhere near a subscription.
 *
 * The STRUCTURE is what the pins lock: strictly rising in distance, strictly falling in
 * competence, strictly higher for the guild form, and bounded above so no question can
 * cost a power everything it has.
 */
export const QUERY_PRICE_TUNING = Object.freeze({
  /** A guild answers better and charges more; a small house sells piecework cheaply. */
  FORM_BASE: Object.freeze({ minor: 0.06, major: 0.10 }),
  /** How much an INCOMPETENT channel costs on top: a house with no correspondents there
   *  has to go and buy the answer before it can sell it. */
  IGNORANCE_SURCHARGE: 0.5,
  /** Per news-delay tick to the subject. Distance costs at the counter as well as in the
   *  fidelity term, which is Law 1 stated a second way. */
  DISTANCE_SURCHARGE: 0.02,
  /** No single question may cost a power more than this share of its capital. */
  MAX_PRICE01: 0.30,
  /** Band cut points over the price scalar, ascending. */
  BAND_CUTS: Object.freeze([0.08, 0.14, 0.22]),
  /** What the charge does to the payer besides spend capital: asking costs effort. */
  EXHAUSTION_W: 0.25,
});

/**
 * @typedef {Object} QueryPrice
 * @property {number} cost01   the share of the patron's capital the question costs
 * @property {string} band     one of QUERY_PRICE_BANDS
 * @property {string} label    the glance reading (no numbers)
 * @property {string} detail   the sentence reading (no numbers)
 */

/**
 * The price of one question. TOTAL: an unreadable form or channel prices at the guild base
 * with the full ignorance surcharge, which is the fail-CLOSED direction (an unknown house
 * is the expensive one, never the free one).
 *
 * @param {Object} args
 * @param {unknown} args.legality @param {unknown} args.form @param {unknown} args.channel
 * @param {unknown} [args.delayTicks] the news distance to the subject
 * @returns {QueryPrice}
 */
export function brokerageQueryPrice({ legality, form, channel, delayTicks = 0 }) {
  const T = QUERY_PRICE_TUNING;
  const base = /** @type {Record<string, number>} */ (T.FORM_BASE)[String(form)] ?? T.FORM_BASE.major;
  const competence = houseChannelCompetence([{ legality: String(legality), form: String(form) }], channel);
  const ignorance = 1 - clamp01(competence / INFORMATION_BROKERAGE_TUNING.FIDELITY_CEILING);
  const delay = typeof delayTicks === 'number' && Number.isFinite(delayTicks)
    ? Math.max(0, Math.floor(delayTicks)) : 0;
  const cost01 = clamp(
    base * (1 + T.IGNORANCE_SURCHARGE * ignorance) + T.DISTANCE_SURCHARGE * delay,
    0,
    T.MAX_PRICE01,
  );
  let band = 0;
  while (band < T.BAND_CUTS.length && cost01 >= T.BAND_CUTS[band]) band += 1;
  return {
    cost01,
    band: QUERY_PRICE_BANDS[band],
    label: BAND_LABELS[band],
    detail: BAND_SENTENCES[band],
  };
}

// ── The purse (what a power actually has to spend) ───────────────────────────

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

/**
 * THE PURSE: the political capital a power can spend on a question, read off the faction
 * ledger the faction layer already keeps. Absent state reads as an EMPTY purse, so a power
 * the faction layer has never heard of buys nothing; that is the fail-closed direction and
 * it is also the truth (a power with no recorded standing has no standing to spend).
 * @param {unknown} worldState @param {string} patronId @returns {number}
 */
export function patronPurse01(worldState, patronId) {
  const state = asObject(asObject(asObject(worldState).factionStates)[text(patronId)]);
  return clamp01(num(state.momentum, 0));
}

/**
 * The faction patch that SPENDS the price: capital down by the cost, effort up by a
 * fraction of it. Absolute next-values, which is what `applyFactionPatch` bakes and
 * re-applies (its own docblock's rebasing rule).
 * @param {unknown} worldState @param {string} patronId @param {number} cost01 @param {number} tick
 * @returns {Record<string, unknown>}
 */
export function queryChargePatch(worldState, patronId, cost01, tick) {
  const state = asObject(asObject(asObject(worldState).factionStates)[text(patronId)]);
  const price = clamp01(num(cost01, 0));
  return {
    momentum: clamp01(clamp01(num(state.momentum, 0)) - price),
    exhaustion: clamp01(clamp01(num(state.exhaustion, 0)) + price * QUERY_PRICE_TUNING.EXHAUSTION_W),
    lastActedTick: Math.max(0, Math.floor(num(tick, 0))),
    recentAction: 'brokerage_query',
  };
}

// ── The answer (a projection, and nothing but) ───────────────────────────────

/**
 * The belief record one observer holds about one subject, read WITHOUT importing the
 * belief engine (see the module header for both reasons). Null when no record stands.
 * @param {unknown} worldState @param {string} observerId @param {string} subjectId
 * @returns {Record<string, unknown>|null}
 */
export function localBeliefRecord(worldState, observerId, subjectId) {
  const maps = asObject(asObject(asObject(worldState).spatialLedgers).beliefMaps);
  const seat = asObject(asObject(maps[text(observerId)]).seat);
  const record = seat[text(subjectId)];
  return record != null && typeof record === 'object' && !Array.isArray(record)
    ? /** @type {Record<string, unknown>} */ (record) : null;
}

/**
 * @typedef {Object} QueryClaim
 * @property {string} axis  the belief axis this claim reads
 * @property {unknown} value
 * @property {string} from  'belief' or 'truth' — the ONLY two admissible sources
 * @property {string} ref   where the claim was read from, resolvable by the pin
 */

/**
 * THE ONLY CONSTRUCTOR OF A CLAIM. Every reading in an answer passes through here, which
 * is what makes "a query mints no new facts" checkable rather than promised: a claim
 * cannot exist without naming the record it came out of.
 * @param {string} axis @param {unknown} value @param {string} from @param {string} ref
 * @returns {QueryClaim}
 */
function claimFrom(axis, value, from, ref) {
  return { axis, value, from, ref };
}

/**
 * @typedef {Object} QueryAnswer
 * @property {string} subjectId
 * @property {string} channel
 * @property {readonly QueryClaim[]} claims
 * @property {import('./brokerageStamps.js').ReliabilityStamp|null} stamp
 * @property {number} floor01  the house's earned accuracy on this pair (Law 1 bounded)
 */

/**
 * @typedef {Object} QueryResult
 * @property {boolean} refused
 * @property {{ reason: string, detail: string }|null} refusal
 * @property {QueryAnswer|null} answer
 * @property {QueryPrice|null} price
 * @property {{ patronId: string, factionPatch: Record<string, unknown> }|null} charge
 * @property {Record<string, unknown>|null} receipt
 */

/** The closed refusal vocabulary. Every early return below names one of these. @type {readonly string[]} */
export const QUERY_REFUSALS = Object.freeze([
  'dormant', 'no_house', 'channel_declined', 'cannot_pay', 'no_record',
]);

/** @param {string} reason @param {string} detail @returns {QueryResult} */
function refuse(reason, detail) {
  return { refused: true, refusal: { reason, detail }, answer: null, price: null, charge: null, receipt: null };
}

/**
 * THE QUERY. Ask a settlement's houses about a subject in a channel; pay, or be refused.
 *
 * The order is load bearing and each step is a refusal the caller can act on: the layer
 * must be lit, a house must stand, the house must vouch for the channel, the patron must
 * be able to pay, and the house must actually hold something about the subject. Only then
 * is an answer built, and it is built entirely out of records that already existed.
 *
 * @param {Object} args
 * @param {unknown} args.worldState the campaign world state
 * @param {unknown} args.item the snapshot item of the settlement whose houses are asked
 * @param {string} args.subjectId the subject asked about
 * @param {unknown} args.channel one of INFORMATION_CHANNELS
 * @param {string} args.patronId the paying power's faction-state key
 * @param {number} args.tick
 * @param {unknown} [args.delayTicks] the news distance to the subject (0 when unpriced)
 * @param {Record<string, unknown>|null} [args.groundTruth] the subject's true axes, when the
 *   caller holds them; a house that has earned the truth reads it from HERE and never
 *   invents it, and a caller that supplies none simply cannot be told the truth.
 * @returns {QueryResult}
 */
export function answerBrokerageQuery({
  worldState, item, subjectId, channel, patronId, tick, delayTicks = 0, groundTruth = null,
}) {
  if (!brokerageEffectsActive(worldState)) {
    return refuse('dormant', 'No house in this world keeps a register worth paying for.');
  }
  const channelKey = text(channel);
  if (!INFORMATION_CHANNELS.includes(channelKey)) {
    return refuse('channel_declined', 'The house does not deal in that.');
  }
  const host = asObject(item);
  const settlementId = text(host.id);
  // Delegated roster read (see brokerageHouseRosterIn): the ruin filter lives in ONE file.
  const roster = brokerageHouseRosterIn(asObject(host.settlement));
  if (!roster.length) {
    return refuse('no_house', 'There is no house here to ask.');
  }
  // The house that will answer is the one that reads this channel best, ties by the
  // canonical roster order, so the answer does not depend on which door was knocked on.
  /** @type {import('./brokerageStamps.js').BrokerageHouseRecord|null} */
  let chosen = null;
  let competence = 0;
  for (const house of roster) {
    const value = houseChannelCompetence([{ legality: house.legality, form: house.form }], channelKey);
    if (value > competence) { competence = value; chosen = house; }
  }
  if (!chosen || !servicesAvailable(chosen.legality, chosen.form, channelKey).includes('info_query')) {
    return refuse('channel_declined', 'The house will not put its name to that trade, at any price.');
  }
  const price = brokerageQueryPrice({
    legality: chosen.legality, form: chosen.form, channel: channelKey, delayTicks,
  });
  const purse = patronPurse01(worldState, patronId);
  if (purse < price.cost01) {
    return refuse('cannot_pay', 'The house does not answer on credit, and the asking price is not on the table.');
  }
  const subject = text(subjectId);
  const belief = localBeliefRecord(worldState, settlementId, subject);
  const floor01 = brokerageAccuracyFloor01(competence, delayTicks);
  const truth = asObject(groundTruth);
  const truthEarned = floor01 >= BROKERAGE_STAMP_TUNING.SHARP_VOUCH_FLOOR && Object.keys(truth).length > 0;
  const axes = /** @type {Record<string, readonly string[]>} */ (CHANNEL_BELIEF_AXES)[channelKey];
  /** @type {QueryClaim[]} */
  const claims = [];
  for (const axis of axes) {
    if (truthEarned && Object.prototype.hasOwnProperty.call(truth, axis)) {
      claims.push(claimFrom(axis, truth[axis], 'truth', `groundTruth.${subject}.${axis}`));
      continue;
    }
    if (belief && Object.prototype.hasOwnProperty.call(belief, axis)) {
      claims.push(claimFrom(axis, belief[axis], 'belief',
        `spatialLedgers.beliefMaps.${settlementId}.seat.${subject}.${axis}`));
    }
  }
  const stamp = newsReliabilityStamp({
    houses: [{ legality: chosen.legality, form: chosen.form }],
    channel: channelKey,
    provenance: belief
      ? { hopCount: 0, independentSources: 1, credibility01: 1 }
      : { hopCount: Number.POSITIVE_INFINITY, independentSources: 1, credibility01: 1 },
  });
  if (!claims.length && !belief) {
    return refuse('no_record', 'The register holds nothing about that, and the house will not invent it.');
  }
  return {
    refused: false,
    refusal: null,
    answer: { subjectId: subject, channel: channelKey, claims: Object.freeze(claims), stamp, floor01 },
    price,
    charge: { patronId: text(patronId), factionPatch: queryChargePatch(worldState, patronId, price.cost01, tick) },
    receipt: {
      houseId: chosen.institutionId,
      houseName: chosen.name,
      graderId: settlementId,
      subjectId: subject,
      channel: channelKey,
      priceBand: price.band,
      grade: stamp ? stamp.grade : null,
      askedAtTick: Math.max(0, Math.floor(num(tick, 0))),
    },
  };
}
