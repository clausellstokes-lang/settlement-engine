import { deriveActiveCondition } from '../activeConditions.js';
import { stablePart } from './worldState.js';
import { clamp01 } from '../../kernel/math.js';

/** @typedef {import('./pulseShapes.js').OccupationRecord} OccupationRecord */
/** @typedef {import('./pulseShapes.js').PulseOutcome} PulseOutcome */
/** @typedef {import('./pulseShapes.js').PulseSnapshot} PulseSnapshot */

/** @param {unknown} a @param {unknown} b @returns {number} */
const codepoint = (a, b) => (String(a) < String(b) ? -1 : String(a) > String(b) ? 1 : 0);

/** @param {unknown} value @param {number} [fallback] @returns {number} */
const num = (value, fallback = 0) => (
  Number.isFinite(Number(value)) ? Number(value) : fallback
);

/**
 * The narrative identity of one occupier's occupation portfolio. Exact occupied
 * ids preserve target swaps at a stable count; the state rung preserves real
 * contested/unstable/extractive/stabilized/vassalized transitions. Continuous
 * resistance, dwell, benefit, and last-tick drift are deliberately excluded.
 *
 * @param {Record<string, OccupationRecord>|null|undefined} occupations
 * @param {unknown} occupierId
 * @returns {Array<[string, string]>}
 */
export function occupationContext(occupations, occupierId) {
  const wanted = String(occupierId);
  return Object.keys(occupations || {})
    .filter(occupiedId => String(occupations?.[occupiedId]?.occupierId) === wanted)
    .sort(codepoint)
    .map(occupiedId => [
      String(occupiedId),
      String(occupations?.[occupiedId]?.state || 'contested'),
    ]);
}

/**
 * The aggregate benefit stored on every one of an occupier's occupation rows.
 * Taking the maximum is tolerant of partial/legacy ledgers while preserving the
 * current invariant that every row carries the same aggregate yield.
 *
 * @param {Record<string, OccupationRecord>|null|undefined} occupations
 * @param {unknown} occupierId
 * @returns {number}
 */
export function storedOccupierBenefit(occupations, occupierId) {
  const wanted = String(occupierId);
  let benefit = 0;
  for (const rec of Object.values(occupations || {})) {
    if (String(rec?.occupierId) !== wanted) continue;
    benefit = Math.max(benefit, clamp01(num(rec?.benefitYield)));
  }
  return benefit;
}

/**
 * A recurring aggregate occupation condition stays public on:
 *   - onset or renewed production;
 *   - a different persisted condition identity / target;
 *   - an occupied-set, count, target, or state-rung change;
 *   - a severity-band change.
 *
 * Only the exact same persisted condition, same portfolio context, same band,
 * and continuously-producing prior tick is a state-only refresh. Raw numeric
 * drift inside a band does not become a weekly Chronicle metronome.
 *
 * @param {{
 *   snapshot: PulseSnapshot,
 *   archetype: string,
 *   targetSaveId: unknown,
 *   severity: number,
 *   previousOccupations: Record<string, OccupationRecord>,
 *   nextOccupations: Record<string, OccupationRecord>,
 *   previousProducerActive?: boolean,
 * }} args
 * @returns {string|undefined}
 */
export function recurringOccupationConditionRecordMode({
  snapshot,
  archetype,
  targetSaveId,
  severity,
  previousOccupations,
  nextOccupations,
  previousProducerActive = true,
}) {
  if (!previousProducerActive) return undefined;

  const target = String(targetSaveId);
  const incoming = deriveActiveCondition({
    archetype,
    severity,
    triggeredAt: {
      sourceEventType: 'OCCUPATION_LAYER',
      sourceEventTargetId: target,
    },
  });
  const item = snapshot?.byId?.get?.(target);
  const active = item?.settlement?.activeConditions || item?.activeConditions || [];
  const previous = active
    .map((/** @type {unknown} */ condition) => deriveActiveCondition(
      /** @type {Parameters<typeof deriveActiveCondition>[0]} */ (condition),
    ))
    .find((/** @type {ReturnType<typeof deriveActiveCondition>} */ condition) => condition?.id === incoming?.id);

  if (!incoming || !previous) return undefined;
  if (previous.severityBand !== incoming.severityBand) return undefined;
  if (JSON.stringify(occupationContext(previousOccupations, target))
      !== JSON.stringify(occupationContext(nextOccupations, target))) {
    return undefined;
  }
  return 'state_only';
}

/**
 * Public one-shot for the tick an occupier's last occupation disappears. It
 * intentionally carries no condition patch: the prior condition keeps its
 * existing bounded expiry tail, while this receipt says its renewal has ended.
 *
 * @param {{
 *   occupierId: unknown,
 *   occupierName: string,
 *   previousCount: number,
 *   nextCount: number,
 *   previousSeverity: number,
 *   tick: number,
 * }} args
 * @returns {PulseOutcome|null}
 */
export function occupationBurdenClearanceOutcome({
  occupierId,
  occupierName,
  previousCount,
  nextCount,
  previousSeverity,
  tick,
}) {
  if (!(previousCount > 0 && nextCount === 0)) return null;
  const target = String(occupierId);
  return {
    id: `world_outcome.occupation_burden_cleared.${stablePart(target)}.${tick}`,
    type: 'state',
    candidateType: 'occupation_burden_cleared',
    ruleId: 'occupation_burden_cleared',
    ruleFamily: 'stressor',
    applyMode: 'auto',
    probability: 1,
    targetSaveId: target,
    severity: clamp01(num(previousSeverity)),
    headline: `${occupierName}'s occupation burden begins to lift`,
    summary: `${occupierName} no longer holds occupied settlements. Garrison and administrative strain is no longer renewed, though its aftereffects continue fading.`,
    reasons: [`Occupation count fell from ${previousCount} to 0; the burden is no longer renewed.`],
    metadata: { previousOccupationCount: previousCount, nextOccupationCount: 0 },
  };
}

/**
 * Public one-shot for the tick an occupier's aggregate occupation benefit falls
 * to zero. No condition patch: the existing easing condition keeps its exact
 * expiry math, while the Chronicle records that fresh spoils stopped.
 *
 * @param {{
 *   occupierId: unknown,
 *   occupierName: string,
 *   previousBenefit: number,
 *   nextBenefit: number,
 *   previousSeverity: number,
 *   tick: number,
 * }} args
 * @returns {PulseOutcome|null}
 */
export function warSpoilsEndedOutcome({
  occupierId,
  occupierName,
  previousBenefit,
  nextBenefit,
  previousSeverity,
  tick,
}) {
  if (!(previousBenefit > 0 && nextBenefit <= 0)) return null;
  const target = String(occupierId);
  return {
    id: `world_outcome.war_spoils_ended.${stablePart(target)}.${tick}`,
    type: 'state',
    candidateType: 'war_spoils_ended',
    ruleId: 'occupation_war_spoils_ended',
    ruleFamily: 'stressor',
    applyMode: 'auto',
    probability: 1,
    targetSaveId: target,
    severity: clamp01(num(previousSeverity)),
    headline: `${occupierName}'s war spoils dry up`,
    summary: `Fresh tribute, levies, and materiel from ${occupierName}'s occupations no longer sustain its war effort. The remaining benefit continues fading.`,
    reasons: [`Occupier benefit fell from ${clamp01(num(previousBenefit)).toFixed(2)} to 0.00.`],
    metadata: {
      previousBenefit: clamp01(num(previousBenefit)),
      nextBenefit: clamp01(num(nextBenefit)),
    },
  };
}
