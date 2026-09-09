/**
 * ransomClaim.js — WR-7d: captivity becomes a price, and the price has to travel.
 *
 * Amendment O turns a held envoy into a CLAIM. Three things make that claim
 * different from every other demand in the model, and all three are structural
 * here rather than conventional:
 *
 *   IT IS DWELL-GATED.  A captor does not price a man the day he takes him.
 *     The gate reads WR-7b's hold ledger — `heldSinceTick`, the one authority
 *     on how long this person has been held — and nothing else. There is no
 *     second clock and no stored dwell counter: dwell is `tick − heldSinceTick`,
 *     derived on every read.
 *
 *   ITS SUBJECT IS A PERSON.  The claim rides the I2 reparations-claim shape
 *     unchanged — same kind, same claimant/debtor/magnitude — and adds only a
 *     `subject` naming WHO is being paid for. No new claim vocabulary is minted
 *     for ransom, because a ransom IS a reparations claim; what is novel is
 *     that the thing owed for is a man rather than a season of war.
 *
 *   BOTH HALVES TRAVEL.  Law M binds the demand AND the answer. A demand is a
 *     message a person carries, priced through the one transit kernel at one
 *     whole week per leg, and so is the reply. That is what makes K.7's three
 *     shapes reachable: while the demand is on the road, the home court knows
 *     only silence, and silence is what it will act on.
 *
 * PURE: no world state, no writer, no RNG, no clock. Callers hand in the hold
 * row they already read and the closed bands they already derived.
 */

import { namedPersonArrivalTick, namedPersonLegTicks } from './namedPersonTransit.js';

/**
 * THE I2 CLAIM KIND, re-declared rather than imported.
 *
 * `warCoalitionExpenditure.js` owns this spelling and READS WORLD STATE to do
 * its job; importing it would pull a truth reader into a pure leaf for the sake
 * of one string. The estate's established answer is the one used for the
 * reliability ladder: re-declare, and pin the two spellings equal in a test
 * that imports both, so the vocabulary cannot fork in silence.
 */
export const RANSOM_CLAIM_KIND = 'coalition_reimbursement';

/** The subject discriminator. A ransom claim is owed FOR SOMEBODY. */
export const RANSOM_SUBJECT_KIND = 'person';

/**
 * ES-2 — THE COVERT HOLD CAUSE, re-declared for the SAME reason `RANSOM_CLAIM_KIND` is.
 *
 * `foreignGuestHold.js` owns this word, and it reaches the spatial ledger to do its job.
 * Importing it here would pull a world reader into a leaf whose header promises no world
 * state, for the sake of one string. So the estate's established answer applies unchanged:
 * re-declare, and PIN THE TWO SPELLINGS EQUAL in a test that imports both, so the
 * vocabulary cannot fork in silence. The pin lives in tests/domain/espionageGauntlet.test.js
 * beside the dwell-cut arm this constant selects.
 */
export const RANSOM_COVERT_HOLD_CAUSE = 'caught_spying';

/** Closed dwell bands over the hold, shortest first. */
export const RANSOM_DWELL_BANDS = Object.freeze(['fresh', 'settled', 'protracted']);

/** What the captor believes this particular person is worth. Closed. */
export const RANSOM_WORTH_BANDS = Object.freeze(['common', 'notable', 'principal']);

/** The three K.7 shapes, named. Each is a real ending, not an error. */
export const RANSOM_SILENCE_SHAPES = Object.freeze([
  'silence_misread',
  'demand_corrects_inference',
  'demand_lost_misreading_stands',
]);

export const RANSOM_TUNING = Object.freeze({
  /** Dwell cut-points in whole ticks, ascending; below the first is `fresh`. */
  DWELL_CUTS: Object.freeze([2, 8]),
  /**
   * ES-2 / J-ES-15b — THE SAME LADDER, STRETCHED, FOR A CAUGHT SPY. "Longer hostage terms"
   * is a LATER GATE rather than a stored duration: the hold still records only
   * `heldSinceTick` (a duration field is refused by law), and a `caught_spying` row simply
   * banded against these cuts sits `fresh` twice as long before the ransom gate opens and
   * does not reach `protracted` until week sixteen. Zero new keys; derived on every read.
   */
  DWELL_CUTS_COVERT: Object.freeze([4, 16]),
  /** The gate opens at this band and never before it. */
  GATE_OPENS_AT: 'settled',
  /** Claim magnitude per worth band, before the dwell lift. */
  WORTH_CLAIM_01: Object.freeze({ common: 0.08, notable: 0.18, principal: 0.32 }),
  /** How much a protracted hold adds to the price, as a share of the base. */
  DWELL_LIFT_01: Object.freeze({ fresh: 0, settled: 0.15, protracted: 0.4 }),
  /** No single person is ever worth more of a realm than this. */
  CLAIM_CEILING_01: 0.5,
  /** Nominal weeks a demand or an answer rides when the caller prices nothing. */
  MESSAGE_WEEKS: 1,
});

/** @param {unknown} value @returns {Record<string, unknown>} */
function recordOf(value) {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? /** @type {Record<string, unknown>} */ (value)
    : {};
}

/** @param {unknown} value @returns {string} */
function strictText(value) {
  return typeof value === 'string' && value.length > 0 && value.trim() === value ? value : '';
}

/** @param {unknown} value @param {readonly string[]} vocabulary @returns {string} */
function closedValue(value, vocabulary) {
  return typeof value === 'string' && vocabulary.includes(value) ? value : '';
}

/** @param {unknown} value @returns {number | null} */
function tickOf(value) {
  return Number.isInteger(value) && Number(value) >= 0 ? Number(value) : null;
}

/** @param {number} value @returns {number} four-decimal fixed rounding */
function round4(value) {
  return Math.round(value * 10000) / 10000;
}

/**
 * The dwell read, and the ONLY clock this module has.
 *
 * `heldSinceTick` comes from WR-7b's hold row, which its one writer maintains.
 * Nothing here stores, caches, or re-derives a dwell: a captor who has held a
 * man for six weeks is a captor whose ledger row says so, and if the row is
 * unreadable the gate is SHUT rather than guessed open — a ransom minted from
 * an unreadable hold would be a price on a person nobody can prove is held.
 *
 * @param {{hold?:unknown, tick?:unknown}} args
 * @returns {{open:boolean, dwellTicks:number, band:string, reason:string}}
 */
export function ransomDwellRead({ hold, tick } = {}) {
  /** @param {string} reason */
  const shut = (reason) => ({
    open: false, dwellTicks: 0, band: RANSOM_DWELL_BANDS[0], reason,
  });
  const row = recordOf(hold);
  const heldSinceTick = tickOf(row.heldSinceTick);
  const now = tickOf(tick);
  if (heldSinceTick == null || now == null) return shut('unreadable_hold');
  if (!strictText(row.npcId) || !strictText(row.captorId)) return shut('unreadable_hold');
  if (now < heldSinceTick) return shut('hold_not_yet_open');
  const dwellTicks = now - heldSinceTick;
  // ES-2 / J-ES-15b — THE COVERT ARM, and its enforcement is the SIGNATURE. This function
  // takes a HOLD and a tick and nothing else, so the only way "is this a spy?" can enter is
  // off the hold row's own cause. No world state, no errand, no importance can reach in and
  // make one captive's clock different from another's for a reason the row does not carry.
  const cuts = row.cause === RANSOM_COVERT_HOLD_CAUSE
    ? RANSOM_TUNING.DWELL_CUTS_COVERT
    : RANSOM_TUNING.DWELL_CUTS;
  let index = cuts.length;
  for (let at = 0; at < cuts.length; at += 1) {
    if (dwellTicks < Number(cuts[at])) { index = at; break; }
  }
  const band = RANSOM_DWELL_BANDS[index];
  const gateIndex = RANSOM_DWELL_BANDS.indexOf(RANSOM_TUNING.GATE_OPENS_AT);
  return {
    open: index >= gateIndex,
    dwellTicks,
    band,
    reason: index >= gateIndex ? 'dwell_met' : 'dwell_too_short',
  };
}

/**
 * Mint the claim. The returned row IS the I2 reparations shape — `kind`,
 * `claimantId`, `debtorId`, `claim01`, `atTick` — plus one `subject` field, and
 * the subject is the whole difference between this and a season's reparations.
 *
 * The debtor is the person's OWN home. A ransom is not a war reparation the
 * enemy owes: it is a price a captor puts on a guest, and the realm that sent
 * him is the only party who can pay it.
 *
 * @param {{hold?:unknown, tick?:unknown, homeId?:unknown, worthBand?:unknown}} args
 * @returns {{claim:Record<string, unknown>|null, reason:string}}
 */
export function mintRansomClaim({ hold, tick, homeId, worthBand } = {}) {
  const row = recordOf(hold);
  const dwell = ransomDwellRead({ hold, tick });
  if (!dwell.open) return { claim: null, reason: dwell.reason };
  const captorId = strictText(row.captorId);
  const npcId = strictText(row.npcId);
  const debtorId = strictText(homeId);
  const worth = closedValue(worthBand, RANSOM_WORTH_BANDS);
  if (!debtorId || !worth) return { claim: null, reason: 'invalid_demand' };
  // A captor cannot ransom a man to himself; that is a release wearing a price.
  if (debtorId === captorId) return { claim: null, reason: 'captor_is_home' };
  const worths = /** @type {Record<string, number>} */ (RANSOM_TUNING.WORTH_CLAIM_01);
  const lifts = /** @type {Record<string, number>} */ (RANSOM_TUNING.DWELL_LIFT_01);
  const base = Number(worths[worth]) || 0;
  const lift = Number(lifts[dwell.band]) || 0;
  const claim01 = round4(Math.min(RANSOM_TUNING.CLAIM_CEILING_01, base * (1 + lift)));
  if (claim01 <= 0) return { claim: null, reason: 'empty_claim' };
  return {
    claim: {
      kind: RANSOM_CLAIM_KIND,
      claimantId: captorId,
      debtorId,
      claim01,
      atTick: Number(tick),
      subject: {
        kind: RANSOM_SUBJECT_KIND,
        npcId,
        errandId: strictText(row.errandId),
        holdCause: strictText(row.cause),
        dwellBand: dwell.band,
        worthBand: worth,
      },
    },
    reason: 'claimed',
  };
}

/**
 * BOTH HALVES TRAVEL (law M). The demand rides from the captor's venue to the
 * debtor's home; the answer rides back. Both are priced through the ONE named-
 * person transit kernel, so a ransom message can never outrun a person — and
 * the round trip is minted as a PAIR, because a caller who could open the
 * demand leg without the answer leg would have built a court that hears
 * instantly.
 *
 * @param {{claim?:unknown, departTick?:unknown, venueId?:unknown,
 *   outboundWeeks?:unknown, returnWeeks?:unknown, gradeMultiplier?:unknown}} args
 * @returns {Record<string, unknown>}
 */
export function ransomMessageLegs({
  claim, departTick, venueId, outboundWeeks, returnWeeks, gradeMultiplier,
} = {}) {
  /** @param {string} reason */
  const refusal = (reason) => ({
    minted: false, reason, demandLeg: null, answerLeg: null, answerDueTick: null,
  });
  const row = recordOf(claim);
  const subject = recordOf(row.subject);
  const depart = tickOf(departTick);
  const fromId = strictText(venueId);
  const toId = strictText(row.debtorId);
  if (row.kind !== RANSOM_CLAIM_KIND || subject.kind !== RANSOM_SUBJECT_KIND) {
    return refusal('not_a_ransom_claim');
  }
  if (depart == null || !fromId || !toId || fromId === toId) return refusal('invalid_route');
  const weeks = RANSOM_TUNING.MESSAGE_WEEKS;
  const demandLeg = {
    fromId,
    toId,
    departTick: depart,
    arrivalTick: namedPersonArrivalTick({
      departTick: depart, nominalWeeks: outboundWeeks, gradeMultiplier, unpricedWeeks: weeks,
    }),
  };
  const answerTicks = namedPersonLegTicks({
    nominalWeeks: returnWeeks, gradeMultiplier, unpricedWeeks: weeks,
  });
  const answerLeg = {
    fromId: toId,
    toId: fromId,
    departTick: demandLeg.arrivalTick,
    arrivalTick: demandLeg.arrivalTick + answerTicks,
  };
  return {
    minted: true,
    reason: 'legs_minted',
    demandLeg,
    answerLeg,
    // The tick the captor can first learn anything. Until then he holds a man
    // and knows nothing, exactly as the home holds a silence and knows nothing.
    answerDueTick: answerLeg.arrivalTick,
  };
}

/**
 * K.7, ALL THREE SHAPES, decided by arithmetic rather than by narration.
 *
 * A home court that hears nothing past its envoy's expected return mints the
 * HOSTILITY INFERENCE — it fears the worst, and the fear is receipted as an
 * inference rather than a fact. What happens to that inference depends entirely
 * on a message travelling somewhere the court cannot see:
 *
 *   `silence_misread` — the window has passed, no demand has arrived yet, and
 *     the court is acting on a belief that happens to be false. The man is
 *     alive. Nobody is lying; the road is simply long.
 *
 *   `demand_corrects_inference` — the demand lands. Its very existence proves
 *     the envoy lives, so the inference is corrected by evidence the captor
 *     never meant as a kindness.
 *
 *   `demand_lost_misreading_stands` — the demand was intercepted, lost, or
 *     killed on the road. The correction that existed never arrives, and the
 *     court goes on believing its dead man dead. This is the cruellest arm and
 *     it is a first-class result, not a failure.
 *
 * @param {{expectedReturnTick?:unknown, tick?:unknown, demandLeg?:unknown,
 *   demandLost?:unknown, heldAlive?:unknown}} args
 * @returns {Record<string, unknown>}
 */
export function ransomAgainstSilence({
  expectedReturnTick, tick, demandLeg, demandLost, heldAlive,
} = {}) {
  /** @param {string} reason */
  const unread = (reason) => ({
    shape: '', reason, inferenceStands: false, demandArrived: false, silentTicks: 0,
  });
  const due = tickOf(expectedReturnTick);
  const now = tickOf(tick);
  if (due == null || now == null) return unread('invalid_window');
  if (typeof heldAlive !== 'boolean' || typeof demandLost !== 'boolean') {
    return unread('invalid_window');
  }
  if (now <= due) return unread('window_still_open');
  const leg = recordOf(demandLeg);
  const arrival = tickOf(leg.arrivalTick);
  const arrived = demandLost !== true && arrival != null && now >= arrival;
  const silentTicks = now - due;
  if (arrived) {
    return {
      // The demand is its own proof of life, whatever else it asks for.
      shape: 'demand_corrects_inference',
      reason: 'demand_arrived',
      inferenceStands: false,
      demandArrived: true,
      silentTicks,
      correctedBy: strictText(leg.fromId),
      subjectAlive: heldAlive === true,
    };
  }
  return {
    shape: demandLost === true ? 'demand_lost_misreading_stands' : 'silence_misread',
    reason: demandLost === true ? 'demand_never_came' : 'demand_still_travelling',
    // The jewel: an envoy alive and priced, and a court at home in mourning.
    inferenceStands: true,
    demandArrived: false,
    silentTicks,
    correctedBy: '',
    subjectAlive: heldAlive === true,
  };
}
