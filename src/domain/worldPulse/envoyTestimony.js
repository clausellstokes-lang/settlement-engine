/**
 * envoyTestimony.js — WR-7c: envoy testimony on the credibility ladder, and the
 * ruler's choice of whom to believe.
 *
 * Amendment K4 gives the court no merged estimate and no averaged account. What
 * a court knows about a parlay is what one or more named people TOLD it, and
 * those tellings can disagree. This leaf grades each telling on the estate's own
 * reliability ladder and then answers the second question the amendment asks:
 * when two envoys contradict each other, WHICH ONE DOES THE RULER BELIEVE?
 *
 * The answer is character, not arithmetic. A lawful seat reads the ladder. A
 * seat whose own chair is at risk reads its interest. Either way the module
 * SELECTS an account; it never blends two. Every returned digest is byte-equal
 * to exactly one input account's digest, which is what makes K4's prohibition
 * structural rather than a convention this file promises to keep.
 *
 * PURE: no world state, no writer, no RNG, no clock. Callers hand in closed
 * bands they have already read through belief machinery (K3).
 */

/**
 * THE LADDER, best first. This is the estate's existing reliability vocabulary
 * (`brokerageStamps.RELIABILITY_LADDER`), deliberately NOT imported: the K3 pin
 * set keeps the negotiation modules' reachable set closed, and brokerageStamps
 * reads institutions. The one-spelling rule is enforced by a pin that imports
 * both and asserts equality, so the vocabulary cannot fork.
 * @type {readonly string[]}
 */
export const TESTIMONY_LADDER = Object.freeze([
  'confirmed', 'corroborated', 'reported', 'tavern_talk',
]);

/** Closed source-credibility bands. Ordinary is the neutral middle. */
export const TESTIMONY_CREDIBILITY_BANDS = Object.freeze([
  'discredited', 'doubted', 'ordinary', 'trusted',
]);

/** Closed bases on which a seat may settle a contradiction. */
export const TESTIMONY_SELECTION_BASES = Object.freeze([
  'sole_account', 'ladder', 'credibility', 'seat_interest', 'tie_break',
]);

/** Closed seat-character bands the selection consumes. All are projections. */
export const TESTIMONY_SEAT_LAWFULNESS = Object.freeze(['lawless', 'balanced', 'lawful']);
export const TESTIMONY_SEAT_MORALITY = Object.freeze(['merciful', 'balanced', 'malicious']);
export const TESTIMONY_SEAT_SECURITY = Object.freeze(['unseated', 'precarious', 'holding', 'secure']);

/**
 * What a court wants out of the episode. Closed; never a free-text motive.
 *
 * THE ONE SPELLING FOR THE WHOLE WR-7c FAMILY. `coalitionRatification.js`
 * imports this exact list rather than declaring its own: a ballot's
 * `desiredOutcome` and a seat's are the same fact about the same court, and
 * unanimity is decided by comparing them. Two spellings of peace — `Peace`,
 * `peace `, `make_peace` — would read as two different wishes and quietly
 * break `unanimousInJudgment`, which is the finite-semantics law's exact
 * failure mode. This leaf owns the vocabulary because it imports nothing at
 * all, so depending on it cannot widen anyone's K3 reach.
 */
export const TESTIMONY_DESIRED_OUTCOMES = Object.freeze(['peace', 'war', 'undecided']);

const ACCOUNT_KEYS = Object.freeze([
  'id', 'errandId', 'npcId', 'partyId', 'counterpartId', 'episodeKey',
  'pictureId', 'sheetDigest', 'firsthand', 'credibilityBand', 'returnedTick',
]);

const SEAT_KEYS = Object.freeze([
  'settlementId', 'rulerPresent', 'lawfulnessBand', 'moralityBand',
  'securityBand', 'desiredOutcome',
]);

/** The digest an account carries when the envoy reports NO agreement at all. */
export const TESTIMONY_NO_TERMS_DIGEST = 'none';

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

/** @param {unknown} value @returns {number | null} */
function tickOf(value) {
  return Number.isInteger(value) && Number(value) >= 0 ? Number(value) : null;
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

/** @param {string} a @param {string} b @returns {number} */
function codepoint(a, b) {
  return a < b ? -1 : a > b ? 1 : 0;
}

/**
 * One envoy's account of one parlay. `sheetDigest` is the closed identity of
 * what this envoy says was agreed — the carried sheet's id, or the explicit
 * no-terms token. Two accounts AGREE exactly when their digests are equal.
 * @param {unknown} value @returns {Record<string, unknown> | null}
 */
export function normalizeEnvoyAccount(value) {
  const row = recordOf(value);
  if (!hasExactKeys(row, ACCOUNT_KEYS)) return null;
  const id = strictText(row.id);
  const errandId = strictText(row.errandId);
  const npcId = strictText(row.npcId);
  const partyId = strictText(row.partyId);
  const counterpartId = strictText(row.counterpartId);
  const episodeKey = strictText(row.episodeKey);
  const pictureId = strictText(row.pictureId);
  const sheetDigest = strictText(row.sheetDigest);
  const credibilityBand = closedValue(row.credibilityBand, TESTIMONY_CREDIBILITY_BANDS);
  const returnedTick = tickOf(row.returnedTick);
  if (!id || !errandId || !npcId || !partyId || !counterpartId || !episodeKey
    || !pictureId || !sheetDigest || !credibilityBand || returnedTick == null
    || partyId === counterpartId || typeof row.firsthand !== 'boolean') return null;
  return {
    id,
    errandId,
    npcId,
    partyId,
    counterpartId,
    episodeKey,
    pictureId,
    sheetDigest,
    firsthand: row.firsthand,
    credibilityBand,
    returnedTick,
  };
}

/** @param {unknown} value @returns {Record<string, unknown> | null} */
export function normalizeTestimonySeat(value) {
  const row = recordOf(value);
  if (!hasExactKeys(row, SEAT_KEYS)) return null;
  const settlementId = strictText(row.settlementId);
  const lawfulnessBand = closedValue(row.lawfulnessBand, TESTIMONY_SEAT_LAWFULNESS);
  const moralityBand = closedValue(row.moralityBand, TESTIMONY_SEAT_MORALITY);
  const securityBand = closedValue(row.securityBand, TESTIMONY_SEAT_SECURITY);
  const desiredOutcome = closedValue(row.desiredOutcome, TESTIMONY_DESIRED_OUTCOMES);
  if (!settlementId || !lawfulnessBand || !moralityBand || !securityBand
    || !desiredOutcome || typeof row.rulerPresent !== 'boolean') return null;
  return {
    settlementId,
    rulerPresent: row.rulerPresent,
    lawfulnessBand,
    moralityBand,
    securityBand,
    desiredOutcome,
  };
}

/** Rung index of a ladder token, or the bottom rung. @param {unknown} rung */
export function testimonyRungOf(rung) {
  const index = TESTIMONY_LADDER.indexOf(typeof rung === 'string' ? rung : '');
  return index < 0 ? TESTIMONY_LADDER.length - 1 : index;
}

/** @param {unknown} band @returns {number} 0 discredited … 3 trusted */
function credibilityRankOf(band) {
  const index = TESTIMONY_CREDIBILITY_BANDS.indexOf(typeof band === 'string' ? band : '');
  return index < 0 ? 0 : index;
}

/**
 * Grade every account, and group the agreeing ones.
 *
 * THE RULE, closed and stated once:
 *   a second-hand telling is `tavern_talk`, whatever it says;
 *   a firsthand telling standing alone is `reported`;
 *   two or more firsthand tellings that agree are `corroborated`;
 *   and only an uncontradicted, wholly trusted corroboration is `confirmed`.
 * A discredited source is demoted one rung and can never be promoted, so a
 * proven liar's word cannot carry a group to the top of the ladder.
 *
 * @param {{accounts?:unknown}} args
 * @returns {{episodeKey:string, accounts:Array<Record<string, unknown>>,
 *   groups:Array<Record<string, unknown>>, split:boolean,
 *   corroboratedDigest:string|null, reason:string}}
 */
export function readEnvoyTestimony({ accounts } = {}) {
  const empty = {
    episodeKey: '', accounts: [], groups: [], split: false, corroboratedDigest: null,
  };
  if (!Array.isArray(accounts) || accounts.length === 0) {
    return { ...empty, reason: 'no_accounts' };
  }
  const rows = accounts.map(normalizeEnvoyAccount);
  if (rows.some((row) => !row)) return { ...empty, reason: 'invalid_account' };
  const known = /** @type {Array<Record<string, unknown>>} */ (rows);
  const episodeKey = String(known[0].episodeKey);
  if (known.some((row) => row.episodeKey !== episodeKey)) {
    return { ...empty, reason: 'episode_mismatch' };
  }
  const ids = known.map((row) => String(row.id));
  const npcIds = known.map((row) => String(row.npcId));
  if (new Set(ids).size !== ids.length || new Set(npcIds).size !== npcIds.length) {
    return { ...empty, reason: 'duplicate_account' };
  }
  const pictureIds = known.map((row) => String(row.pictureId));
  if (new Set(pictureIds).size !== pictureIds.length) {
    return { ...empty, reason: 'shared_picture' };
  }

  const ordered = [...known].sort((left, right) => codepoint(String(left.id), String(right.id)));
  const digests = [...new Set(ordered.map((row) => String(row.sheetDigest)))].sort(codepoint);
  const split = digests.length > 1;

  const groups = digests.map((digest) => {
    const members = ordered.filter((row) => row.sheetDigest === digest);
    const firsthand = members.filter((row) => row.firsthand === true);
    const allTrusted = firsthand.length > 0
      && firsthand.every((row) => row.credibilityBand === 'trusted');
    return {
      digest,
      accountIds: members.map((row) => String(row.id)),
      firsthandCount: firsthand.length,
      uncontradicted: !split,
      allTrusted,
    };
  });

  const graded = ordered.map((row) => {
    const group = groups.find((entry) => entry.digest === row.sheetDigest);
    const firsthandCount = group ? Number(group.firsthandCount) : 0;
    let rungIndex;
    if (row.firsthand !== true) {
      rungIndex = TESTIMONY_LADDER.indexOf('tavern_talk');
    } else if (firsthandCount < 2) {
      rungIndex = TESTIMONY_LADDER.indexOf('reported');
    } else if (group && group.uncontradicted === true && group.allTrusted === true) {
      rungIndex = TESTIMONY_LADDER.indexOf('confirmed');
    } else {
      rungIndex = TESTIMONY_LADDER.indexOf('corroborated');
    }
    // Demotion only. A discredited source drops one rung; it never climbs, so
    // the ladder cannot be gamed by adding an untrustworthy corroborator.
    if (row.credibilityBand === 'discredited') {
      rungIndex = Math.min(TESTIMONY_LADDER.length - 1, rungIndex + 1);
    }
    return {
      ...row,
      rung: TESTIMONY_LADDER[rungIndex],
      agreeingWith: group
        ? /** @type {string[]} */ (group.accountIds).filter((entry) => entry !== row.id)
        : [],
    };
  });

  const corroborated = groups.find((group) => Number(group.firsthandCount) >= 2) || null;
  return {
    episodeKey,
    accounts: graded,
    groups,
    split,
    corroboratedDigest: corroborated ? String(corroborated.digest) : null,
    reason: 'graded',
  };
}

/**
 * Does this account's report serve what the seat wants? A no-terms account
 * serves a court that wants the war continued; a terms account serves a court
 * that wants peace. An undecided court is served by neither, so interest cannot
 * decide and the read falls through to the ladder.
 * @param {Record<string, unknown>} account @param {string} desiredOutcome
 */
function servesSeatInterest(account, desiredOutcome) {
  const agreed = String(account.sheetDigest) !== TESTIMONY_NO_TERMS_DIGEST;
  if (desiredOutcome === 'peace') return agreed;
  if (desiredOutcome === 'war') return !agreed;
  return false;
}

/**
 * A seat reads its own interest first exactly when its chair is at risk or its
 * character is malicious — the two conditions under which amendment G says the
 * ruler's books outrank the realm's.
 * @param {Record<string, unknown>} seat
 */
function readsInterestFirst(seat) {
  return seat.securityBand === 'unseated' || seat.securityBand === 'precarious'
    || seat.moralityBand === 'malicious';
}

/** @param {Record<string, unknown>} account @returns {number[]} */
function ladderKey(account) {
  return [testimonyRungOf(account.rung), -credibilityRankOf(account.credibilityBand)];
}

/** @param {number[]} left @param {number[]} right @returns {number} */
function compareKeys(left, right) {
  for (let index = 0; index < Math.max(left.length, right.length); index += 1) {
    const a = Number(left[index] || 0);
    const b = Number(right[index] || 0);
    if (a !== b) return a - b;
  }
  return 0;
}

/**
 * THE RULER CHOOSES WHOM TO BELIEVE, and the choice is a political act.
 *
 * One account is SELECTED whole. Nothing is averaged, blended, or reconciled:
 * the returned digest is byte-equal to exactly one input account's digest. When
 * the seat passes over the best-graded account to believe a worse one, the
 * result says so — `politicalAct` is true and the receipt names what was set
 * aside. That is the receipt the Herald reads as character.
 *
 * @param {{testimony?:unknown, seat?:unknown}} args
 * @returns {{chosen:Record<string, unknown>|null, chosenDigest:string|null,
 *   rejectedAccountIds:string[], basis:string, politicalAct:boolean,
 *   passedOverAccountId:string|null, reason:string}}
 */
export function selectBelievedAccount({ testimony, seat } = {}) {
  /** @param {string} reason */
  const refusal = (reason) => ({
    chosen: null,
    chosenDigest: null,
    rejectedAccountIds: [],
    basis: '',
    politicalAct: false,
    passedOverAccountId: null,
    reason,
  });
  const read = recordOf(testimony);
  const rows = Array.isArray(read.accounts)
    ? /** @type {Array<Record<string, unknown>>} */ (read.accounts)
    : [];
  if (rows.length === 0 || read.reason !== 'graded') return refusal('invalid_testimony');
  const court = normalizeTestimonySeat(seat);
  if (!court) return refusal('invalid_seat');
  if (rows.some((row) => row.partyId !== court.settlementId)) return refusal('foreign_account');

  const byLadder = [...rows].sort((left, right) => (
    compareKeys(ladderKey(left), ladderKey(right)) || codepoint(String(left.id), String(right.id))
  ));
  const best = byLadder[0];
  if (rows.length === 1) {
    return {
      chosen: best,
      chosenDigest: String(best.sheetDigest),
      rejectedAccountIds: [],
      basis: 'sole_account',
      politicalAct: false,
      passedOverAccountId: null,
      reason: 'selected',
    };
  }

  // A seat with no living ruler cannot exercise character; the realm reads the
  // ladder. So does a lawful ruler, by disposition.
  const interestFirst = court.rulerPresent === true
    && readsInterestFirst(court)
    && court.lawfulnessBand !== 'lawful'
    && court.desiredOutcome !== 'undecided';
  const credibilityFirst = court.rulerPresent === true
    && !interestFirst
    && court.lawfulnessBand === 'lawless';

  const ranked = [...rows].sort((left, right) => {
    if (interestFirst) {
      const serves = Number(servesSeatInterest(right, String(court.desiredOutcome)))
        - Number(servesSeatInterest(left, String(court.desiredOutcome)));
      if (serves !== 0) return serves;
    }
    if (credibilityFirst) {
      const credibility = credibilityRankOf(right.credibilityBand) - credibilityRankOf(left.credibilityBand);
      if (credibility !== 0) return credibility;
    }
    return compareKeys(ladderKey(left), ladderKey(right))
      || codepoint(String(left.id), String(right.id));
  });

  const chosen = ranked[0];
  const runnerUp = ranked[1];
  // A tie only MATTERS when the tied accounts disagree about the world. Two
  // envoys telling the same story rank equally and are ordered by id, but
  // nothing was decided by that ordering, so it is not a tie-break.
  const tied = Boolean(runnerUp)
    && compareKeys(ladderKey(chosen), ladderKey(runnerUp)) === 0
    && String(chosen.sheetDigest) !== String(runnerUp.sheetDigest)
    && (!interestFirst
      || servesSeatInterest(chosen, String(court.desiredOutcome))
        === servesSeatInterest(runnerUp, String(court.desiredOutcome)));
  const basis = interestFirst && chosen.id !== best.id
    ? 'seat_interest'
    : credibilityFirst && chosen.id !== best.id
      ? 'credibility'
      : tied ? 'tie_break' : 'ladder';
  const politicalAct = String(chosen.id) !== String(best.id);
  return {
    chosen,
    chosenDigest: String(chosen.sheetDigest),
    rejectedAccountIds: ranked.slice(1).map((row) => String(row.id)),
    basis,
    politicalAct,
    passedOverAccountId: politicalAct ? String(best.id) : null,
    reason: 'selected',
  };
}
