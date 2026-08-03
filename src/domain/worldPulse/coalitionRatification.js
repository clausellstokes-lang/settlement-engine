/**
 * coalitionRatification.js — WR-7c: two-level authority over a carried sheet.
 *
 * A term sheet an envoy carried home binds nothing until it is RATIFIED. K.6
 * makes that a two-level act, and both levels are real:
 *
 *   LEVEL ONE — the member.  Each coalition member decides for itself, and
 *     inside a member the seat's book may diverge from the realm's (amendment
 *     G).  A living seat decides; a realm with no seated ruler decides as a
 *     realm.  The ballot records WHICH book cast the vote.
 *
 *   LEVEL TWO — the coalition.  A weighted majority of the coalition's
 *     legitimate powers rules, and where that ruling contradicts a member's own
 *     ruler THE COALITION VETOES THAT RULER.  H makes a seat answerable from
 *     below; K.6 makes it answerable from above as well, and the overruled seat
 *     is named on the receipt because being overruled is a political fact its
 *     own powers will read.
 *
 * K4 IS STRUCTURAL HERE, NOT CONVENTIONAL. Every member votes on ITS OWN
 * picture: a ballot names exactly one picture id, two ballots may never name
 * the same one, and no function in this file takes two pictures. There is no
 * merged estimate to build because there is no shape that could hold one.
 *
 * Divergent sheets are COMPETING OFFERS, never a blend. When no single sheet
 * carries a majority, the coalition has failed to choose — and failure to
 * choose is exactly the close-vote case that opens the compromise round. The
 * majority a rival sheet must carry is a majority of the WHOLE coalition's
 * weight (ruling R-BLD-7), not of the members who happened to vote on that one
 * sheet: a sub-tally of three, however unanimous, does not outrank a coalition
 * of thirty.
 *
 * PURE: no world state, no writer, no RNG.
 */

import {
  compareOfferToResponderDraft,
  evaluateNegotiationPicture,
  normalizeParlayTermSheet,
} from './negotiationPictures.js';
// THE ONE COURT-DESIRE VOCABULARY. `desiredOutcome` means the same thing on a
// ballot as it does on a seat reading testimony, so it is declared ONCE and
// imported — two spellings of peace would silently break unanimity (the
// finite-semantics law). `envoyTestimony.js` reaches nothing at all, so this
// import cannot widen the vote's K3 reach; the seam pin records it as reviewed.
import { TESTIMONY_DESIRED_OUTCOMES } from './envoyTestimony.js';

/** Closed verdict vocabulary. `close` is a real outcome, not an error. */
export const RATIFICATION_VERDICTS = Object.freeze(['ratified', 'refused', 'close']);

/** Closed ballot decisions. */
export const BALLOT_DECISIONS = Object.freeze(['accept', 'refuse']);

/** Which book cast the member's vote. */
export const BALLOT_AUTHORITIES = Object.freeze(['seat', 'realm']);

/**
 * The legitimate powers' weights. A coalition is not one-settlement-one-vote:
 * a principal power that fielded the war outweighs a minor party that sent a
 * company. Banded and authored — §7 of the war volume carries it to tuning.
 */
export const RATIFICATION_POWER_BANDS = Object.freeze(['minor', 'ordinary', 'principal']);

export const RATIFICATION_TUNING = Object.freeze({
  /** Weight per power band; the tally is integer, so a tie is exactly a tie. */
  POWER_WEIGHT: Object.freeze({ minor: 1, ordinary: 2, principal: 3 }),
  /**
   * A vote whose winning margin is at or under this share of the whole is
   * CLOSE — not a defeat, not a mandate. The compromise round consumes it.
   */
  CLOSE_BAND_01: 0.15,
});

const BALLOT_KEYS = Object.freeze([
  'memberId', 'sideId', 'counterpartId', 'episodeKey', 'termSheetId', 'pictureId',
  'powerBand', 'decision', 'authority', 'seatDecision', 'realmDecision',
  'desiredOutcome', 'reason',
]);

const MEMBER_KEYS = Object.freeze([
  'memberId', 'sideId', 'counterpartId', 'powerBand', 'seatPresent',
  'seatDecision', 'desiredOutcome',
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

/** @param {string} a @param {string} b @returns {number} */
function codepoint(a, b) {
  return a < b ? -1 : a > b ? 1 : 0;
}

/** @param {number} value @returns {number} four-decimal fixed rounding */
function round4(value) {
  return Math.round(value * 10000) / 10000;
}

/** @param {unknown} band @returns {number} */
export function ratificationPowerWeight(band) {
  const key = closedValue(band, RATIFICATION_POWER_BANDS);
  const weights = /** @type {Record<string, number>} */ (RATIFICATION_TUNING.POWER_WEIGHT);
  return key ? Number(weights[key]) : 0;
}

/** @param {unknown} value @returns {Record<string, unknown> | null} */
export function normalizeRatificationMember(value) {
  const row = recordOf(value);
  if (!hasExactKeys(row, MEMBER_KEYS)) return null;
  const memberId = strictText(row.memberId);
  const sideId = strictText(row.sideId);
  const counterpartId = strictText(row.counterpartId);
  const powerBand = closedValue(row.powerBand, RATIFICATION_POWER_BANDS);
  const desiredOutcome = closedValue(row.desiredOutcome, TESTIMONY_DESIRED_OUTCOMES);
  const seatPresent = row.seatPresent === true;
  const seatDecision = row.seatDecision === null
    ? null
    : closedValue(row.seatDecision, BALLOT_DECISIONS);
  if (!memberId || !sideId || !counterpartId || sideId === counterpartId
    || memberId === counterpartId || !powerBand
    || !desiredOutcome || typeof row.seatPresent !== 'boolean') return null;
  // A seat that is present must have decided; a seat that is absent must not
  // have. An absent seat carrying a decision is an invented ruler.
  if (seatPresent !== (seatDecision != null && seatDecision !== '')) return null;
  return {
    memberId, sideId, counterpartId, powerBand, seatPresent, seatDecision, desiredOutcome,
  };
}

/** @param {unknown} value @returns {Record<string, unknown> | null} */
export function normalizeRatificationBallot(value) {
  const row = recordOf(value);
  if (!hasExactKeys(row, BALLOT_KEYS)) return null;
  const memberId = strictText(row.memberId);
  const sideId = strictText(row.sideId);
  const counterpartId = strictText(row.counterpartId);
  const episodeKey = strictText(row.episodeKey);
  const termSheetId = strictText(row.termSheetId);
  const pictureId = strictText(row.pictureId);
  const powerBand = closedValue(row.powerBand, RATIFICATION_POWER_BANDS);
  const decision = closedValue(row.decision, BALLOT_DECISIONS);
  const authority = closedValue(row.authority, BALLOT_AUTHORITIES);
  const realmDecision = closedValue(row.realmDecision, BALLOT_DECISIONS);
  const seatDecision = row.seatDecision === null
    ? null
    : closedValue(row.seatDecision, BALLOT_DECISIONS);
  const desiredOutcome = closedValue(row.desiredOutcome, TESTIMONY_DESIRED_OUTCOMES);
  const reason = strictText(row.reason);
  if (!memberId || !sideId || !counterpartId || sideId === counterpartId
    || memberId === counterpartId || !episodeKey
    || !termSheetId || !pictureId || !powerBand || !decision || !authority
    || !realmDecision || !desiredOutcome || !reason) return null;
  if (authority === 'seat' && !seatDecision) return null;
  if (authority === 'realm' && seatDecision !== null) return null;
  if (decision !== (authority === 'seat' ? seatDecision : realmDecision)) return null;
  return {
    memberId,
    sideId,
    counterpartId,
    episodeKey,
    termSheetId,
    pictureId,
    powerBand,
    decision,
    authority,
    seatDecision,
    realmDecision,
    desiredOutcome,
    reason,
  };
}

/**
 * LEVEL ONE. One member reads the carried sheet through ITS OWN frozen picture
 * and casts one ballot. The picture is a single argument on purpose: there is
 * no signature here that could accept a second one.
 *
 * The sheet stays BILATERAL (amendment I: no congress, ever). What differs
 * between members is not the pair — it is the PICTURE of that pair each member
 * happens to hold, because each heard from its own envoy. `sideId` names the
 * principal whose side this member stands on, and the member's picture must be
 * oriented to exactly that side of exactly that edge.
 *
 * @param {{member?:unknown, picture?:unknown, termSheet?:unknown}} args
 * @returns {{ballot:Record<string, unknown>|null, reason:string}}
 */
export function castRatificationBallot({ member, picture, termSheet } = {}) {
  const row = normalizeRatificationMember(member);
  const sheet = normalizeParlayTermSheet(termSheet);
  if (!row) return { ballot: null, reason: 'invalid_member' };
  if (!sheet) return { ballot: null, reason: 'invalid_term_sheet' };
  const parties = Array.isArray(sheet.parties) ? sheet.parties.map(String) : [];
  if (!parties.includes(String(row.sideId)) || !parties.includes(String(row.counterpartId))) {
    return { ballot: null, reason: 'foreign_edge' };
  }
  const orientation = { victorId: sheet.victorId, loserId: sheet.loserId };
  const evaluation = evaluateNegotiationPicture(picture, orientation);
  if (!evaluation) return { ballot: null, reason: 'invalid_picture' };
  if (String(evaluation.partyId) !== String(row.sideId)) {
    return { ballot: null, reason: 'foreign_picture' };
  }
  const bounded = compareOfferToResponderDraft(sheet.clauses, sheet.budgetSpent, evaluation);
  const realmDecision = bounded.accepted ? 'accept' : 'refuse';
  const authority = row.seatPresent === true ? 'seat' : 'realm';
  const decision = authority === 'seat' ? String(row.seatDecision) : realmDecision;
  const ballot = normalizeRatificationBallot({
    memberId: row.memberId,
    sideId: row.sideId,
    counterpartId: row.counterpartId,
    episodeKey: String(sheet.episodeKey),
    termSheetId: String(sheet.id),
    pictureId: String(evaluation.pictureId),
    powerBand: row.powerBand,
    decision,
    authority,
    seatDecision: row.seatPresent === true ? String(row.seatDecision) : null,
    realmDecision,
    desiredOutcome: row.desiredOutcome,
    reason: bounded.reason,
  });
  return ballot
    ? { ballot, reason: 'cast' }
    : { ballot: null, reason: 'invalid_ballot' };
}

/**
 * LEVEL TWO. Weighted majority of the legitimate powers, and the coalition's
 * veto over a member's own ruler.
 *
 * @param {{ballots?:unknown, closeBand01?:unknown}} args
 * @returns {Record<string, unknown>}
 */
export function ratifyTermSheet({ ballots, closeBand01 } = {}) {
  const band = typeof closeBand01 === 'number' && Number.isFinite(closeBand01)
    && closeBand01 >= 0 && closeBand01 <= 1
    ? closeBand01
    : RATIFICATION_TUNING.CLOSE_BAND_01;
  /** @param {string} reason */
  const refusal = (reason) => ({
    verdict: '',
    reason,
    episodeKey: '',
    termSheetId: '',
    acceptWeight: 0,
    refuseWeight: 0,
    totalWeight: 0,
    margin01: 0,
    closeBand01: band,
    ballots: [],
    overruled: [],
    unanimousInJudgment: false,
    splitInFact: false,
  });
  if (!Array.isArray(ballots) || ballots.length === 0) return refusal('no_ballots');
  const rows = ballots.map(normalizeRatificationBallot);
  if (rows.some((entry) => !entry)) return refusal('invalid_ballot');
  const known = /** @type {Array<Record<string, unknown>>} */ (rows);
  const episodeKey = String(known[0].episodeKey);
  const termSheetId = String(known[0].termSheetId);
  if (known.some((entry) => entry.episodeKey !== episodeKey || entry.termSheetId !== termSheetId)) {
    return refusal('sheet_mismatch');
  }
  // One coalition, one side of one edge. A tally that mixed the two sides would
  // be the multilateral table amendment I forbids.
  const sideId = String(known[0].sideId);
  if (known.some((entry) => entry.sideId !== sideId
    || entry.counterpartId !== known[0].counterpartId)) return refusal('side_mismatch');
  const memberIds = known.map((entry) => String(entry.memberId));
  if (new Set(memberIds).size !== memberIds.length) return refusal('duplicate_member');
  // K4, enforced: one member, one picture, and never the same picture twice.
  const pictureIds = known.map((entry) => String(entry.pictureId));
  if (new Set(pictureIds).size !== pictureIds.length) return refusal('shared_picture');

  const ordered = [...known].sort((left, right) => (
    codepoint(String(left.memberId), String(right.memberId))
  ));
  let acceptWeight = 0;
  let refuseWeight = 0;
  for (const entry of ordered) {
    const weight = ratificationPowerWeight(entry.powerBand);
    if (weight <= 0) return refusal('invalid_power_band');
    if (entry.decision === 'accept') acceptWeight += weight;
    else refuseWeight += weight;
  }
  const totalWeight = acceptWeight + refuseWeight;
  if (totalWeight <= 0) return refusal('empty_tally');
  const margin01 = Math.abs(acceptWeight - refuseWeight) / totalWeight;
  const verdict = margin01 <= band
    ? 'close'
    : acceptWeight > refuseWeight ? 'ratified' : 'refused';

  // THE COALITION'S VETO OF A MEMBER'S OWN RULER. Only a decisive coalition can
  // overrule a seat: a close vote has no ruling to impose, so nobody is bound
  // and nobody is overruled.
  const bindingDecision = verdict === 'ratified' ? 'accept' : verdict === 'refused' ? 'refuse' : '';
  const overruled = bindingDecision
    ? ordered
      .filter((entry) => entry.authority === 'seat' && entry.seatDecision !== bindingDecision)
      .map((entry) => ({
        memberId: String(entry.memberId),
        seatDecision: String(entry.seatDecision),
        boundTo: bindingDecision,
      }))
    : [];

  const outcomes = new Set(ordered.map((entry) => String(entry.desiredOutcome)));
  const decisions = new Set(ordered.map((entry) => String(entry.decision)));
  return {
    verdict,
    reason: 'tallied',
    episodeKey,
    termSheetId,
    acceptWeight,
    refuseWeight,
    totalWeight,
    margin01,
    closeBand01: band,
    ballots: ordered,
    overruled,
    // THE JEWEL K4 BUYS: every court wanting the same thing, and voting
    // differently, because each heard from its own envoy.
    unanimousInJudgment: outcomes.size === 1,
    splitInFact: decisions.size > 1,
  };
}

/**
 * THE UNION COALITION'S WEIGHT. Every member that cast a ballot on ANY of the
 * rival sheets, counted exactly once at its own power weight. This is the
 * denominator ruling R-BLD-7 makes law: a rival sheet is measured against the
 * whole coalition, not against the subset of members who happened to hold a
 * picture of it.
 *
 * A member whose power band differs between two tallies is a coalition that
 * cannot be summed, so the read fails closed rather than picking a weight.
 *
 * RULING R-BLD-8c — THE SUMMARY IS NOT EVIDENCE. `unionMargin01` divides a
 * tally's own `acceptWeight` by a denominator this function counted itself from
 * the ballots. Trusting the numerator while recounting the denominator lets a
 * forged summary field ratify a sheet nobody voted for, so the same ballots
 * that produce the union also re-produce each offer's accept weight, and a
 * disagreement fails the whole read closed (`accept_weight_mismatch`). Only
 * `acceptWeight` is recounted here because only `acceptWeight` is load-bearing:
 * `refuseWeight`, `totalWeight` and `margin01` are carried onto the offer row
 * for the receipt and decide nothing (deliberate scope, not an oversight).
 *
 * @param {Array<Record<string, unknown>>} rows
 * @returns {{weight:number, reason:string}}
 */
function unionCoalitionWeight(rows) {
  /** @type {Map<string, number>} */
  const byMember = new Map();
  for (const row of rows) {
    const cast = Array.isArray(row.ballots) ? row.ballots : null;
    if (!cast || cast.length === 0) return { weight: 0, reason: 'offer_without_ballots' };
    let acceptWeight = 0;
    for (const entry of cast) {
      const ballot = normalizeRatificationBallot(entry);
      if (!ballot) return { weight: 0, reason: 'invalid_offer' };
      const memberId = String(ballot.memberId);
      const weight = ratificationPowerWeight(ballot.powerBand);
      if (weight <= 0) return { weight: 0, reason: 'invalid_power_band' };
      const seen = byMember.get(memberId);
      if (seen != null && seen !== weight) return { weight: 0, reason: 'member_band_mismatch' };
      byMember.set(memberId, weight);
      if (ballot.decision === 'accept') acceptWeight += weight;
    }
    // R-BLD-8c: the ballots are the record; the summary must match them.
    if (Number(row.acceptWeight) !== acceptWeight) {
      return { weight: 0, reason: 'accept_weight_mismatch' };
    }
  }
  let weight = 0;
  for (const value of byMember.values()) weight += value;
  return weight > 0 ? { weight, reason: 'summed' } : { weight: 0, reason: 'empty_coalition' };
}

/**
 * Divergent sheets from different counterparties are COMPETING OFFERS, decided
 * against each other and never merged. A sheet wins only by carrying a real
 * majority of the whole coalition's weight; if none does, the coalition has
 * failed to choose, and failure to choose IS the close-vote case.
 *
 * "A real majority of the whole" is arithmetic, not a figure of speech: a
 * sheet's own accept weight is compared against the UNION coalition's weight,
 * and the surplus must clear the close band. Three weight voting yes among
 * thirty is a sub-tally, not a mandate, however unanimous that three was.
 *
 * ONE offer is not a contest. With a single tally the union IS that tally, so
 * `unionMargin01` and the tally's own margin are the same number. RULING
 * R-BLD-8b makes the arm say so BY CONSTRUCTION rather than by trusting the
 * carried verdict: the sole verdict is read off the SIGNED union margin —
 * above the band ratified, below the negated band refused, otherwise close —
 * which is the identical three-way test `ratifyTermSheet` ran, re-run on this
 * function's own arithmetic. So the record can never say `ratified` while
 * `offers[0].holds` is false, and the arm still says the one thing the contest
 * arm cannot, which is the difference between a REFUSAL and a stalemate.
 *
 * RULING R-BLD-8b, SECOND HALF — ONE BAND OR NO ANSWER. Every offer row carries
 * the band its own tally was decided at. If the caller hands this function a
 * different band, the offers' verdicts and the offers' `holds` were computed
 * against two different laws, and any answer built from both is a contradiction
 * wearing a receipt. That refuses closed (`band_mismatch`). A widening round
 * does not re-decide stale verdicts at a new band — it re-runs `ratifyTermSheet`
 * over the ballots at the new band, because the members' verdicts move too.
 *
 * RULING R-BLD-8a — ONE COALITION, ONE SIDE. Rival offers are rivals only if
 * one body is choosing between them. Two tallies from OPPOSITE sides of the
 * same episode are two coalitions, and unioning them mints a body that never
 * met: the enemy's weight would count toward the majority that binds us. The
 * offers must agree on `sideId` AND `counterpartId` down to the ballot, or the
 * read refuses closed (`side_mismatch`) — the same law `ratifyTermSheet`
 * already enforces inside one tally, enforced one level up.
 *
 * @param {{tallies?:unknown, closeBand01?:unknown}} args
 * @returns {Record<string, unknown>}
 */
export function chooseAmongCompetingOffers({ tallies, closeBand01 } = {}) {
  const band = typeof closeBand01 === 'number' && Number.isFinite(closeBand01)
    && closeBand01 >= 0 && closeBand01 <= 1
    ? closeBand01
    : RATIFICATION_TUNING.CLOSE_BAND_01;
  /** @param {string} reason */
  const refusal = (reason) => ({
    verdict: '', reason, chosenTermSheetId: null, offers: [], unionWeight: 0, closeBand01: band,
  });
  if (!Array.isArray(tallies) || tallies.length === 0) return refusal('no_offers');
  const rows = tallies.map(recordOf);
  if (rows.some((row) => !strictText(row.termSheetId) || row.reason !== 'tallied')) {
    return refusal('invalid_offer');
  }
  const episodeKey = String(rows[0].episodeKey || '');
  if (!episodeKey || rows.some((row) => String(row.episodeKey || '') !== episodeKey)) {
    return refusal('episode_mismatch');
  }
  const sheetIds = rows.map((row) => String(row.termSheetId));
  if (new Set(sheetIds).size !== sheetIds.length) return refusal('duplicate_offer');
  // R-BLD-8a. Read the edge off the ballots themselves rather than a summary
  // field: `ratifyTermSheet` publishes no side, and the ballots are what the
  // union is actually summed from. An offer with no ballots at all adds no
  // spelling here and falls to `offer_without_ballots` below, where it belongs.
  const edges = new Set();
  for (const row of rows) {
    const cast = Array.isArray(row.ballots) ? row.ballots : [];
    for (const entry of cast) {
      const ballot = recordOf(entry);
      edges.add(`${strictText(ballot.sideId)} ${strictText(ballot.counterpartId)}`);
    }
  }
  if (edges.size > 1) return refusal('side_mismatch');
  // R-BLD-8b, second half: one band, or no answer.
  if (rows.some((row) => Number(row.closeBand01) !== band)) return refusal('band_mismatch');
  const union = unionCoalitionWeight(rows);
  if (union.weight <= 0) return refusal(union.reason);

  const offers = [...rows]
    .sort((left, right) => codepoint(String(left.termSheetId), String(right.termSheetId)))
    .map((row) => {
      const acceptWeight = Number(row.acceptWeight || 0);
      // Surplus of yes over the whole coalition's no, as a share of the whole.
      const unionMargin01 = round4((2 * acceptWeight - union.weight) / union.weight);
      return {
        termSheetId: String(row.termSheetId),
        verdict: String(row.verdict || ''),
        acceptWeight,
        totalWeight: Number(row.totalWeight || 0),
        margin01: Number(row.margin01 || 0),
        unionMargin01,
        holds: unionMargin01 > band,
      };
    });
  // A single offer is not a contest. R-BLD-8b: the verdict is DERIVED from this
  // function's own union arithmetic — the same three-way test the tally ran —
  // so `verdict` and `holds` cannot disagree, whatever the carried verdict says.
  if (offers.length === 1) {
    const sole = offers[0];
    const verdict = sole.holds
      ? 'ratified'
      : sole.unionMargin01 < -band ? 'refused' : 'close';
    return {
      verdict,
      reason: 'sole_offer',
      chosenTermSheetId: verdict === 'ratified' ? sole.termSheetId : null,
      offers,
      unionWeight: union.weight,
      closeBand01: band,
    };
  }
  const holding = offers.filter((offer) => offer.holds === true);
  if (holding.length !== 1) {
    return {
      verdict: 'close',
      reason: holding.length === 0 ? 'no_sheet_holds_a_majority' : 'rival_sheets_both_hold',
      chosenTermSheetId: null,
      offers,
      unionWeight: union.weight,
      closeBand01: band,
    };
  }
  return {
    verdict: 'ratified',
    reason: 'one_sheet_holds',
    chosenTermSheetId: holding[0].termSheetId,
    offers,
    unionWeight: union.weight,
    closeBand01: band,
  };
}
