/**
 * ransomChoices.js — WR-7d: two courts decide what a man is worth, and one of
 * them may decide he is worth nothing.
 *
 * Amendment O puts BOTH ends of a ransom through character and books rather
 * than through a price table. The captor chooses hold, ransom, or release. The
 * home chooses pay, refuse, or abandon. Neither choice is arithmetic dressed as
 * a decision: the same claim, the same dwell, the same treasury produce
 * different answers under different tempers, and if they did not, disposition
 * would be decoration.
 *
 * THE THIRD OUTCOME IS THE ONE THAT MATTERS. A realm may ABANDON its own man,
 * and abandonment is not refusal: refusing a price still expects him home one
 * day, while abandonment writes him off. When an abandoned soul comes home
 * anyway — released, escaped, or ransomed by somebody else — he carries the
 * grievance PERSONALLY. It is his, attached to his own H1 record and named
 * against the seat that left him, and amendment H says a grievance held by a
 * person with standing is how a coalition against a seat begins.
 *
 * PURE: no world state, no writer, no RNG, no clock. Every input is a closed
 * band a caller has already read through its own machinery.
 */

/** The captor's three answers. Closed. */
export const CAPTOR_CHOICES = Object.freeze(['hold', 'ransom', 'release']);

/** The home court's three answers. Closed, and `abandon` is not `refuse`. */
export const HOME_ANSWERS = Object.freeze(['pay', 'refuse', 'abandon']);

/** Seat character, the same three axes the testimony leaf reads. */
export const RANSOM_SEAT_LAWFULNESS = Object.freeze(['lawless', 'balanced', 'lawful']);
export const RANSOM_SEAT_MORALITY = Object.freeze(['merciful', 'balanced', 'malicious']);
export const RANSOM_SEAT_SECURITY = Object.freeze(['unseated', 'precarious', 'holding', 'secure']);

/** What the books say a court can bear. Closed; never a raw treasury figure. */
export const RANSOM_MEANS_BANDS = Object.freeze(['destitute', 'strained', 'comfortable']);

/** How much the home court values this particular person. Closed. */
export const RANSOM_REGARD_BANDS = Object.freeze(['forgotten', 'valued', 'beloved']);

/** What the captor's own war books say holding this man is worth. Closed. */
export const RANSOM_LEVERAGE_BANDS = Object.freeze(['none', 'useful', 'decisive']);

/** The grievance a returning abandoned soul carries. One kind, one owner. */
export const ABANDONMENT_GRIEVANCE_KIND = 'abandoned_to_captivity';

const CAPTOR_KEYS = Object.freeze([
  'settlementId', 'rulerPresent', 'lawfulnessBand', 'moralityBand',
  'securityBand', 'leverageBand',
]);

const HOME_KEYS = Object.freeze([
  'settlementId', 'rulerPresent', 'lawfulnessBand', 'moralityBand',
  'securityBand', 'meansBand', 'regardBand',
]);

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

/** @param {Record<string, unknown>} row @param {readonly string[]} expected @returns {boolean} */
function hasExactKeys(row, expected) {
  const actual = Object.keys(row).sort();
  const wanted = [...expected].sort();
  return actual.length === wanted.length && actual.every((key, index) => key === wanted[index]);
}

/** @param {unknown} value @returns {Record<string, unknown> | null} */
export function normalizeCaptorCourt(value) {
  const row = recordOf(value);
  if (!hasExactKeys(row, CAPTOR_KEYS)) return null;
  const settlementId = strictText(row.settlementId);
  const lawfulnessBand = closedValue(row.lawfulnessBand, RANSOM_SEAT_LAWFULNESS);
  const moralityBand = closedValue(row.moralityBand, RANSOM_SEAT_MORALITY);
  const securityBand = closedValue(row.securityBand, RANSOM_SEAT_SECURITY);
  const leverageBand = closedValue(row.leverageBand, RANSOM_LEVERAGE_BANDS);
  if (!settlementId || !lawfulnessBand || !moralityBand || !securityBand
    || !leverageBand || typeof row.rulerPresent !== 'boolean') return null;
  return {
    settlementId,
    rulerPresent: row.rulerPresent,
    lawfulnessBand,
    moralityBand,
    securityBand,
    leverageBand,
  };
}

/** @param {unknown} value @returns {Record<string, unknown> | null} */
export function normalizeHomeCourt(value) {
  const row = recordOf(value);
  if (!hasExactKeys(row, HOME_KEYS)) return null;
  const settlementId = strictText(row.settlementId);
  const lawfulnessBand = closedValue(row.lawfulnessBand, RANSOM_SEAT_LAWFULNESS);
  const moralityBand = closedValue(row.moralityBand, RANSOM_SEAT_MORALITY);
  const securityBand = closedValue(row.securityBand, RANSOM_SEAT_SECURITY);
  const meansBand = closedValue(row.meansBand, RANSOM_MEANS_BANDS);
  const regardBand = closedValue(row.regardBand, RANSOM_REGARD_BANDS);
  if (!settlementId || !lawfulnessBand || !moralityBand || !securityBand
    || !meansBand || !regardBand || typeof row.rulerPresent !== 'boolean') return null;
  return {
    settlementId,
    rulerPresent: row.rulerPresent,
    lawfulnessBand,
    moralityBand,
    securityBand,
    meansBand,
    regardBand,
  };
}

/**
 * THE CAPTOR'S CHOICE.
 *
 * Leverage is the war book: a man whose captivity is DECISIVE to the campaign
 * is not for sale at any price, because selling him costs more than the ransom
 * pays. Character is the rest of it — a merciful court with nothing to gain
 * lets him go, a malicious one holds him because holding him hurts.
 *
 * @param {{captor?:unknown, dwellBand?:unknown, claimOpen?:unknown}} args
 * @returns {{choice:string, basis:string, reason:string}}
 */
export function captorRansomChoice({ captor, dwellBand, claimOpen } = {}) {
  const court = normalizeCaptorCourt(captor);
  if (!court) return { choice: '', basis: '', reason: 'invalid_captor' };
  const dwell = strictText(dwellBand);
  if (!dwell) return { choice: '', basis: '', reason: 'invalid_dwell' };
  // A man whose captivity IS the campaign is not merchandise.
  if (court.leverageBand === 'decisive') {
    return { choice: 'hold', basis: 'war_leverage', reason: 'chosen' };
  }
  // Mercy is a disposition, not a discount: a merciful court that gains nothing
  // by holding him opens the door rather than naming a number.
  if (court.moralityBand === 'merciful' && court.leverageBand === 'none') {
    return { choice: 'release', basis: 'character', reason: 'chosen' };
  }
  // Malice holds a useful man even when the price is on the table, because the
  // holding is the point. The gate being open changes nothing for such a court.
  if (court.moralityBand === 'malicious' && court.leverageBand === 'useful') {
    return { choice: 'hold', basis: 'character', reason: 'chosen' };
  }
  if (claimOpen !== true) {
    return { choice: 'hold', basis: 'dwell_gate_shut', reason: 'chosen' };
  }
  return { choice: 'ransom', basis: 'books', reason: 'chosen' };
}

/**
 * THE HOME COURT'S ANSWER, and the distinction the whole amendment turns on.
 *
 * REFUSE is a price rejected: the court will not pay THIS, and still counts the
 * man as its own. ABANDON is a person written off — and only a court that both
 * can afford him and does not want him back can truly abandon him, which is why
 * a destitute realm that cannot pay is refusing rather than abandoning. That
 * distinction is the difference between a haggling story and a betrayal story,
 * and the model must not blur it into one word.
 *
 * @param {{home?:unknown, claim?:unknown}} args
 * @returns {{answer:string, basis:string, abandoned:boolean, reason:string}}
 */
export function homeRansomAnswer({ home, claim } = {}) {
  /** @param {string} reason */
  const refusal = (reason) => ({
    answer: '', basis: '', abandoned: false, reason,
  });
  const court = normalizeHomeCourt(home);
  const row = recordOf(claim);
  const claim01 = typeof row.claim01 === 'number' && Number.isFinite(row.claim01)
    && row.claim01 > 0 ? row.claim01 : null;
  if (!court) return refusal('invalid_home');
  if (claim01 == null) return refusal('invalid_claim');
  /** @param {string} answer @param {string} basis @param {boolean} abandoned */
  const answered = (answer, basis, abandoned) => ({
    answer, basis, abandoned, reason: 'answered',
  });
  // A court that cannot pay is REFUSING, whatever it feels. Poverty is not
  // betrayal, and calling it betrayal would mint a grievance nobody earned.
  if (court.meansBand === 'destitute') return answered('refuse', 'means', false);
  // ABANDONMENT: it could pay and does not want him. A beloved man is never
  // abandoned; a forgotten one may be, and a lawless or malicious seat will.
  const writesOff = court.regardBand === 'forgotten'
    || (court.rulerPresent === true && court.moralityBand === 'malicious');
  if (writesOff && court.regardBand !== 'beloved') {
    return answered('abandon', 'seat_writes_him_off', true);
  }
  if (court.regardBand === 'beloved') return answered('pay', 'regard', false);
  if (court.meansBand === 'comfortable') return answered('pay', 'books', false);
  // Strained means and ordinary regard: the price decides, and a price above
  // what a strained realm can bear is refused without anybody being written off.
  return claim01 <= 0.2
    ? answered('pay', 'books', false)
    : answered('refuse', 'books', false);
}

/**
 * THE ABANDONED SOUL COMES HOME.
 *
 * He carries the grievance PERSONALLY: it is attached to his own durable id,
 * it names the seat that left him, and it is his to keep whether or not the
 * realm ever admits what it did. Amendment H's coalition against a seat starts
 * with exactly this — a person of standing with a specific reason.
 *
 * A refusal mints NOTHING. A court that could not raise the price and said so
 * has wronged nobody, and inventing a grievance there would make every poor
 * realm a betrayer.
 *
 * @param {{answer?:unknown, hold?:unknown, homeId?:unknown, returnedTick?:unknown}} args
 * @returns {{grievance:Record<string, unknown>|null, reason:string}}
 */
export function abandonmentGrievance({ answer, hold, homeId, returnedTick } = {}) {
  const row = recordOf(hold);
  const npcId = strictText(row.npcId);
  const captorId = strictText(row.captorId);
  const againstId = strictText(homeId);
  const tick = Number.isInteger(returnedTick) && Number(returnedTick) >= 0
    ? Number(returnedTick)
    : null;
  const decided = recordOf(answer);
  if (decided.answer !== 'abandon' || decided.abandoned !== true) {
    return { grievance: null, reason: 'not_abandoned' };
  }
  if (!npcId || !againstId || tick == null) return { grievance: null, reason: 'invalid_return' };
  return {
    grievance: {
      kind: ABANDONMENT_GRIEVANCE_KIND,
      // The HOLDER is the person, not the realm. That is the whole point: a
      // realm cannot settle this grievance by settling with another realm.
      holderNpcId: npcId,
      againstSettlementId: againstId,
      captorId,
      heldSinceTick: Number.isInteger(row.heldSinceTick) ? Number(row.heldSinceTick) : null,
      returnedTick: tick,
      basis: String(decided.basis || ''),
    },
    reason: 'minted',
  };
}
