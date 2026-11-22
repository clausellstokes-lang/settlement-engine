/**
 * domain/worldPulse/warCoalitionRefusal.js — THE REFUSAL AFTERMATH (WR-6).
 *
 * THE DECOMPOSITION WAVE (war tranche, ruling R-BLD-4). One thing happens here: an
 * ally that was CALLED and did not march pays for it, once, in the relationship.
 * The tunables, the closed cause vocabulary, the calling court's bounded character
 * read, and the `coalition_refused` outcome that carries all of it now live together.
 *
 * WHAT THIS MAY NOT DO, structurally. It BUILDS an outcome and returns it — it cannot
 * push one, because it has no outcome array; and it cannot select an enemy, invent a
 * refusal, remove a refusal's base cost, or write the relationship, because it never
 * sees the decision ledger that produces refusals. The character read is an aftermath
 * BAR only: a bounded multiplier between MIN_CHARACTER_MULT and MAX_CHARACTER_MULT
 * that colours how heavily one real, already-decided refusal lands.
 *
 * The refusal CAUSE is closed: anything outside COALITION_REFUSAL_CAUSES collapses to
 * 'strategic' and takes the retaliation prose, so a typo cannot mint a new cause or
 * silently drop the reason line.
 */

import { clamp01 } from '../region/contestMath.js';
import { stablePart } from './worldState.js';
import { thresholdFactorOf } from './dispositionProfile.js';
import { readWarSeatBooks } from './warSeatBooks.js';
import { COALITION_REFUSAL_CAUSES } from './warCoalitionEvidence.js';
import { coalitionCallArchiveRow, coalitionDecisionEvidence } from './warCoalitionDecision.js';

/**
 * The fields of a coalition JOIN DECISION this builder reads. Declared here rather
 * than left implicit because a NEW file must be strict-clean, and because writing the
 * read surface down is the cheapest guard against the builder quietly growing a
 * dependency on the decision ledger it is not allowed to see.
 * @typedef {Object} CoalitionJoinDecision
 * @property {string} partyId
 * @property {string} callerId
 * @property {string} enemyId
 * @property {string} callId
 * @property {string} relationshipKey
 * @property {string} [riskBand]
 * @property {{ trust?: unknown, resentment?: unknown, obligationFatigue?: unknown }} [relationshipState]
 */

/**
 * @typedef {import('./pulseShapes.js').PulseSnapshot} PulseSnapshot
 * @typedef {import('./pulseShapes.js').WorldState} WorldState
 * @typedef {import('./pulseShapes.js').PulseOutcome} PulseOutcome
 */

// WR-6 refusal aftermath.  The refusal is one earned relationship fact; the
// calling court's own books plus WR-2 history colour how heavily that fact lands.  The
// bounded multiplier cannot erase the consequence or override the compact.
export const COALITION_REFUSAL_TUNING = Object.freeze({
  TRUST_HIT: 0.08,
  RESENTMENT_GAIN: 0.12,
  OBLIGATION_FATIGUE_GAIN: 0.1,
  MIN_CHARACTER_MULT: 0.8,
  MAX_CHARACTER_MULT: 1.2,
  QUIET_MAX: 0.9,
  PRESSING_MIN: 1.1,
});
const COALITION_REFUSAL_CAUSE_SET = new Set(COALITION_REFUSAL_CAUSES);
/** @type {Readonly<Record<string, string>>} */
const COALITION_REFUSAL_CAUSE_REASON = Object.freeze({
  army_committed: 'The court cannot answer while its only field army is committed elsewhere.',
  army_returned: 'The returning army cannot be committed to another campaign at once.',
  home_threatened: 'The court keeps its army at home while its own walls are threatened.',
  occupied: 'An occupying power prevents the court from marching into a different war.',
  front_infeasible: 'The court cannot field a force capable of opening this separate front.',
});

/** Keep persisted relationship costs byte-tidy across floating arithmetic. @param {number} value @returns {number} */
const round4 = (value) => Math.round(value * 10_000) / 10_000;

/**
 * The caller's bounded reading of one real refusal.  Martial confidence makes
 * a failed call weigh more; diplomatic confidence and an inward-looking court
 * make room for prudence.  This is an aftermath bar only: it cannot select an
 * enemy, invent a refusal, remove its base cost, or change the relationship.
 *
 * @param {WorldState} worldState
 * @param {Record<string, unknown>} rules
 * @param {PulseSnapshot} snapshot
 * @param {unknown} callerId    String()-coerced before any read.
 * @param {unknown} refusingId  String()-coerced before any read.
 * @returns {{ multiplier: number, costBand: string, receipt: string }}
 */
function coalitionRefusalCharacterRead(worldState, rules, snapshot, callerId, refusingId) {
  const books = readWarSeatBooks({
    worldState,
    snapshot,
    actorId: String(callerId),
    opponentId: String(refusingId),
  });
  const continueBias = clamp01(Number(books.continueBias01));
  const peaceBias = clamp01(Number(books.peaceBias01));
  const T = COALITION_REFUSAL_TUNING;
  const authored = Math.max(T.MIN_CHARACTER_MULT, Math.min(
    T.MAX_CHARACTER_MULT,
    1 + (continueBias - peaceBias) * 0.4,
  ));
  let learned = 1;
  if (rules?.dispositionChannelsEnabled === true) {
    const entry = worldState?.dispositionStats?.[String(callerId)] || null;
    const martial = thresholdFactorOf(entry, 'martial');
    const diplomatic = thresholdFactorOf(entry, 'diplomatic');
    const insular = thresholdFactorOf(entry, 'insular');
    // A high learned stock produces factor < 1.  Invert martial because confidence
    // in force hardens the expected obligation; keep diplomatic/insular in their
    // published direction because confidence in parley and inwardness soften it.
    learned = ((2 - martial.factor) + diplomatic.factor + insular.factor) / 3;
  }
  const multiplier = round4(Math.max(T.MIN_CHARACTER_MULT, Math.min(
    T.MAX_CHARACTER_MULT,
    rules?.dispositionChannelsEnabled === true ? (authored + learned) / 2 : authored,
  )));
  const characterSource = rules?.dispositionChannelsEnabled === true
    ? 'own books and history'
    : 'own books';
  if (multiplier >= T.PRESSING_MIN) {
    return {
      multiplier,
      costBand: 'pressing',
      receipt: `The calling court's ${characterSource} make the broken expectation weigh heavily against the compact.`,
    };
  }
  if (multiplier <= T.QUIET_MAX) {
    return {
      multiplier,
      costBand: 'quiet',
      receipt: `The calling court's ${characterSource} leave room to read the refusal as prudence rather than betrayal.`,
    };
  }
  return {
    multiplier,
    costBand: 'present',
    receipt: 'The calling court records the refusal as a breach of allied expectation.',
  };
}

/**
 * BUILD the `coalition_refused` outcome for one real refusal. Pure: returns the
 * outcome, pushes nothing. The head keeps a one-line closure that pushes what this
 * returns, so all six refusal sites in evaluateWarLayer read exactly as they did.
 *
 * @param {Object} args
 * @param {WorldState} args.worldState
 * @param {Record<string, unknown>} args.rules
 * @param {PulseSnapshot} args.snapshot
 * @param {CoalitionJoinDecision} args.decision  the coalition join decision that was refused.
 * @param {string} [args.refusalCause]             closed vocabulary; anything else means 'strategic'.
 * @param {number} args.tick
 * @param {(id: unknown, fallback: string) => string} args.coalitionNameFor
 * @returns {PulseOutcome}
 */
export function buildCoalitionRefusalOutcome({
  worldState, rules, snapshot, decision, refusalCause = 'strategic', tick, coalitionNameFor,
}) {
  const partyName = coalitionNameFor(decision.partyId, 'The allied court');
  const callerName = coalitionNameFor(decision.callerId, 'the calling ally');
  const enemyName = coalitionNameFor(decision.enemyId, 'the opposing court');
  const relation = decision.relationshipState || {};
  const callerReading = coalitionRefusalCharacterRead(
    worldState,
    rules,
    snapshot,
    decision.callerId,
    decision.partyId,
  );
  const refusalTuning = COALITION_REFUSAL_TUNING;
  const retaliationReason = decision.riskBand === 'decisive' || decision.riskBand === 'pressing'
    ? `The court believes answering ${callerName} would expose the realm to retaliation beyond the present war.`
    : `The court weighed the wider retaliation that a march against ${enemyName} could awaken.`;
  const closedRefusalCause = COALITION_REFUSAL_CAUSE_SET.has(refusalCause)
    ? refusalCause
    : 'strategic';
  const refusalReason = COALITION_REFUSAL_CAUSE_REASON[closedRefusalCause]
    || retaliationReason;
  return {
    id: `world_outcome.coalition_refused.${stablePart(decision.callId)}.${tick}`,
    type: 'relationship_shift',
    candidateType: 'coalition_refused',
    ruleId: 'war_coalition_refusal',
    ruleFamily: 'relationship',
    applyMode: 'auto',
    probability: 1,
    targetSaveId: decision.partyId,
    sourceEventTargetId: decision.callerId,
    severity: 0.5,
    headline: `${partyName} refuses ${callerName}'s call`,
    summary: `${partyName} will not send its army against ${enemyName}; the refusal now stands between the allied courts.`,
    reasons: [
      refusalReason,
      callerReading.receipt,
    ],
    relationshipKey: decision.relationshipKey,
    relationshipPatch: {
      trust: round4(clamp01((Number(relation.trust) || 0)
        - refusalTuning.TRUST_HIT * callerReading.multiplier)),
      resentment: round4(clamp01((Number(relation.resentment) || 0)
        + refusalTuning.RESENTMENT_GAIN * callerReading.multiplier)),
      obligationFatigue: round4(clamp01((Number(relation.obligationFatigue) || 0)
        + refusalTuning.OBLIGATION_FATIGUE_GAIN * callerReading.multiplier)),
    },
    metadata: {
      incidentType: 'coalition_refused',
      allianceCall: coalitionCallArchiveRow(decision, 'refused', tick),
      refusalCostBand: callerReading.costBand,
      coalitionEvidence: coalitionDecisionEvidence(decision, false, tick).map((row) => (
        row.kind === 'coalition_refused'
          ? { ...row, costBand: callerReading.costBand, refusalCause: closedRefusalCause }
          : row
      )),
    },
  };
}
