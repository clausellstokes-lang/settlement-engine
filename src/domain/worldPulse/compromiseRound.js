/**
 * compromiseRound.js — WR-7c: the compromise round and the endogenous terminator.
 *
 * A close vote is not a failure; it is the model's engine of convergence. K2.4
 * sends BOTH sides' envoys out again, simultaneously, and the war goes on the
 * whole time — there is no ceasefire in this model, anywhere, and no shape in
 * this file could hold one.
 *
 * Amendment L forbids a ROUND LIMIT, and there is none: nothing here counts
 * rounds down, refuses to open the next one, or forces a peace. Two bounds do
 * exist and neither is that, so both are named rather than left for a reader to
 * discover — THE BAND IS CAPPED (`WIDENING_CAP_01`: how far a court's
 * acceptance can widen, not how long its war may run), and
 * `compromiseConvergence` searches under a PROBE HORIZON. The horizon is a
 * bound on an arithmetic search, not on a war: when it runs out the projection
 * answers `beyond_probe` and returns no round at all, so it can never end,
 * shorten, or force one.
 *
 * What ends a war instead is the pair of forces this leaf makes arithmetic:
 *
 *   THE WIDENING.  Every failed round widens BOTH parties' acceptance bands.
 *     Widening is monotone and symmetric: a court that has sent three embassies
 *     home empty will sign what it would have refused at the first.
 *
 *   THE HOME-FRONT DRAIN.  WR-4's domestic degradation ACCELERATES the widening.
 *     The same round index yields a wider band under a heavier drain, so the
 *     realm that is bleeding at home comes to terms first — which is the whole
 *     point of L's fourth force.
 *
 * Together they converge or they do not, and `compromiseConvergence` answers
 * that as a projection rather than a promise: WR-9 measures it on the soak. A
 * pair the widening alone cannot close is reported honestly as unclosed, never
 * rounded down to a comforting number.
 *
 * The arithmetic is deliberately multiplicative and linear — no pow, no exp,
 * no log (the transcendental ratchet).
 *
 * PURE: no world state, no writer, no RNG, no clock.
 */

/** Closed widening bands, narrowest first. A court's public posture. */
export const COMPROMISE_WIDENING_BANDS = Object.freeze([
  'held', 'yielding', 'pliant', 'desperate',
]);

/** Closed home-front drain bands, consumed from WR-4's read. */
export const COMPROMISE_DRAIN_BANDS = Object.freeze([
  'quiet', 'present', 'pressing', 'decisive',
]);

export const COMPROMISE_ROUND_TUNING = Object.freeze({
  /** A vote at or under this margin is close, and opens a round. */
  CLOSE_BAND_01: 0.15,
  /** How much one failed round widens an acceptance band before drain. */
  WIDENING_STEP_01: 0.06,
  /**
   * The widest a band ever gets. This is a BAND CEILING, not a round limit: at
   * the cap the widening simply stops helping, and the drain — or nothing —
   * decides. Amendment L's prohibition is on capping ROUNDS: a court may be
   * refused ten thousand times and this module will widen it, open the next
   * round, and never once decline to. The only place a round index meets a
   * bound at all is the probe horizon inside `compromiseConvergence`, which
   * searches a projection and reports `beyond_probe` rather than deciding
   * anything about the war.
   */
  WIDENING_CAP_01: 0.75,
  /** Drain multiplier per band; quiet contributes nothing rather than a floor. */
  DRAIN_ACCELERATION: Object.freeze({
    quiet: 0, present: 0.35, pressing: 0.7, decisive: 1,
  }),
  /** How hard the drain leans on the widening at its heaviest. */
  DRAIN_WEIGHT_01: 0.5,
  /** Band cut-points over the widening share, ascending. */
  WIDENING_BAND_CUTS: Object.freeze([0.15, 0.35, 0.6]),
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
function roundIndexOf(value) {
  return Number.isInteger(value) && Number(value) >= 0 ? Number(value) : null;
}

/** @param {number} value @returns {number} four-decimal fixed rounding */
function round4(value) {
  return Math.round(value * 10000) / 10000;
}

/**
 * The round index is DERIVED, never stored: it is simply how many parlays for
 * this episode have already come home without a ratified sheet. Storing a
 * counter would be a second source of truth for a fact the errand history
 * already carries.
 *
 * @param {{failedParlayIds?:unknown}} args @returns {number}
 */
export function compromiseRoundIndex({ failedParlayIds } = {}) {
  if (!Array.isArray(failedParlayIds)) return 0;
  const ids = failedParlayIds.map(strictText).filter(Boolean);
  return new Set(ids).size;
}

/** @param {number} widening01 @returns {string} */
export function wideningBandOf(widening01) {
  const cuts = COMPROMISE_ROUND_TUNING.WIDENING_BAND_CUTS;
  const value = Number(widening01) || 0;
  for (let index = 0; index < cuts.length; index += 1) {
    if (value < Number(cuts[index])) return COMPROMISE_WIDENING_BANDS[index];
  }
  return COMPROMISE_WIDENING_BANDS[COMPROMISE_WIDENING_BANDS.length - 1];
}

/**
 * How far one party's acceptance band has widened after `roundIndex` failed
 * rounds under a given home-front drain.
 *
 * MONOTONE in the round index by construction, and strictly greater under a
 * heavier drain until the ceiling is reached. Round zero is always exactly zero
 * — a court that has not yet been refused has conceded nothing.
 *
 * @param {{roundIndex?:unknown, drainBand?:unknown}} args
 * @returns {{roundIndex:number, drainBand:string, widening01:number, band:string, reason:string}}
 */
export function widenAcceptance({ roundIndex, drainBand } = {}) {
  const rounds = roundIndexOf(roundIndex);
  const drain = closedValue(drainBand, COMPROMISE_DRAIN_BANDS);
  if (rounds == null || !drain) {
    return {
      roundIndex: 0, drainBand: '', widening01: 0, band: COMPROMISE_WIDENING_BANDS[0], reason: 'invalid_input',
    };
  }
  const drains = /** @type {Record<string, number>} */ (COMPROMISE_ROUND_TUNING.DRAIN_ACCELERATION);
  const acceleration = Number(drains[drain]) || 0;
  const drainFactor = 1 + COMPROMISE_ROUND_TUNING.DRAIN_WEIGHT_01 * acceleration;
  const raw = COMPROMISE_ROUND_TUNING.WIDENING_STEP_01 * rounds * drainFactor;
  const widening01 = round4(Math.min(COMPROMISE_ROUND_TUNING.WIDENING_CAP_01, raw));
  return {
    roundIndex: rounds,
    drainBand: drain,
    widening01,
    band: wideningBandOf(widening01),
    reason: 'widened',
  };
}

/** @param {unknown} value @returns {Record<string, unknown> | null} */
function normalizeSide(value) {
  const row = recordOf(value);
  const partyId = strictText(row.partyId);
  const drainBand = closedValue(row.drainBand, COMPROMISE_DRAIN_BANDS);
  if (!partyId || !drainBand) return null;
  return { partyId, drainBand };
}

/**
 * Open the next round. BOTH sides go out at once — the design's "both sides'
 * envoys out simultaneously" is the shape of the return value, so a caller
 * cannot accidentally send one and hold the other.
 *
 * A round opens ONLY on a close verdict. A ratified or refused sheet is a
 * decision, and a decided coalition does not compromise with itself.
 *
 * @param {{verdict?:unknown, episodeKey?:unknown, sides?:unknown,
 *   priorRoundIndex?:unknown}} args
 * @returns {Record<string, unknown>}
 */
export function openCompromiseRound({ verdict, episodeKey, sides, priorRoundIndex } = {}) {
  /** @param {string} reason */
  const refusal = (reason) => ({
    opened: false, reason, episodeKey: '', roundIndex: 0, mandates: [], warContinues: true,
  });
  const key = strictText(episodeKey);
  const prior = roundIndexOf(priorRoundIndex);
  if (!key || prior == null) return refusal('invalid_context');
  if (verdict !== 'close') return refusal('verdict_is_decided');
  if (!Array.isArray(sides) || sides.length !== 2) return refusal('not_two_sides');
  const rows = sides.map(normalizeSide);
  if (rows.some((row) => !row)) return refusal('invalid_side');
  const known = /** @type {Array<Record<string, unknown>>} */ (rows);
  const ids = known.map((row) => String(row.partyId));
  if (ids[0] === ids[1]) return refusal('same_party');
  const roundIndex = prior + 1;
  const ordered = [...known].sort((left, right) => (
    String(left.partyId) < String(right.partyId) ? -1
      : String(left.partyId) > String(right.partyId) ? 1 : 0
  ));
  const mandates = ordered.map((row, index) => {
    const widened = widenAcceptance({ roundIndex, drainBand: row.drainBand });
    return {
      partyId: String(row.partyId),
      counterpartId: String(ordered[1 - index].partyId),
      episodeKey: key,
      roundIndex,
      drainBand: String(row.drainBand),
      widening01: widened.widening01,
      band: widened.band,
    };
  });
  return {
    opened: true,
    reason: 'round_opened',
    episodeKey: key,
    roundIndex,
    mandates,
    // Stated as a fact on every record, because the absence of a ceasefire is a
    // design law and a reader should not have to infer it from silence.
    warContinues: true,
  };
}

/**
 * WR-9's projection: at which round would these two acceptance bands first
 * cover the distance between the parties' positions?
 *
 * `gap01` is the believed distance still separating the two sides, already
 * closed to a share by the caller's own belief-side read. The answer is the
 * first round at which the two widenings sum to at least the gap.
 *
 * Returns `closesAtRound: null` when the ceilings cannot cover the gap at all.
 * That is the honest answer, and it is the one WR-9's envelope must see: it
 * means the widening alone will not end this war, and the home front or a
 * ruler change will have to.
 *
 * `maxProbe` IS A PROBE HORIZON — the only bound on a round index anywhere in
 * this module, and it bounds a SEARCH, not a war. A projection that runs off
 * the end of its horizon returns `beyond_probe` with `closesAtRound: null`: it
 * declines to answer rather than naming a round, so no caller can read a
 * horizon as a limit on how long the fighting may go on. The ceiling test
 * above it already answers the unreachable case, so a horizon overrun means
 * only that the caller asked for a shorter look than the arithmetic needed.
 *
 * @param {{gap01?:unknown, sides?:unknown, maxProbe?:unknown}} args
 * @returns {Record<string, unknown>}
 */
export function compromiseConvergence({ gap01, sides, maxProbe } = {}) {
  /** @param {string} reason */
  const refusal = (reason) => ({
    reason, closesAtRound: null, gap01: 0, ceilingReach01: 0, sides: [],
  });
  const gap = typeof gap01 === 'number' && Number.isFinite(gap01) && gap01 >= 0 && gap01 <= 2
    ? gap01
    : null;
  if (gap == null) return refusal('invalid_gap');
  if (!Array.isArray(sides) || sides.length !== 2) return refusal('not_two_sides');
  const rows = sides.map(normalizeSide);
  if (rows.some((row) => !row)) return refusal('invalid_side');
  const known = /** @type {Array<Record<string, unknown>>} */ (rows);

  // The reach both ceilings together can ever cover. Comparing against it first
  // is what makes the search below finite for every gap it will ever be asked
  // about: the loop is a search over a bounded arithmetic answer, not a rule
  // about wars, and its horizon decides nothing (see the docstring).
  const ceilingReach01 = round4(2 * COMPROMISE_ROUND_TUNING.WIDENING_CAP_01);
  const summary = {
    reason: 'projected',
    closesAtRound: /** @type {number | null} */ (null),
    gap01: round4(gap),
    ceilingReach01,
    sides: known.map((row) => ({ partyId: String(row.partyId), drainBand: String(row.drainBand) })),
  };
  if (gap > ceilingReach01) return { ...summary, reason: 'widening_cannot_close_it' };
  if (gap === 0) return { ...summary, closesAtRound: 0 };

  const probe = Number.isInteger(maxProbe) && Number(maxProbe) > 0 ? Number(maxProbe) : 4096;
  for (let round = 1; round <= probe; round += 1) {
    const reach = known.reduce((sum, row) => (
      sum + widenAcceptance({ roundIndex: round, drainBand: row.drainBand }).widening01
    ), 0);
    if (round4(reach) >= round4(gap)) return { ...summary, closesAtRound: round };
  }
  return { ...summary, reason: 'beyond_probe' };
}
