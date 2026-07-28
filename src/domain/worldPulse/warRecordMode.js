import { deriveActiveCondition } from '../activeConditions.js';
import { slugify } from '../../kernel/slugify.js';

/** @typedef {import('./pulseShapes.js').PulseOutcome} PulseOutcome */
/** @typedef {import('./pulseShapes.js').PulseSnapshot} PulseSnapshot */

/**
 * Preserve the clearance receipt's original slug semantics, including one
 * underscore for leading/trailing punctuation, while delegating normalization
 * and separator collapsing to the shared primitive.
 * @param {unknown} value
 * @returns {string}
 */
function clearanceIdPart(value) {
  const raw = String(value);
  const core = slugify(raw, { sep: '_', raw: true });
  if (!core) return raw ? '_' : '';
  const leading = /^[^a-zA-Z0-9]/.test(raw) ? '_' : '';
  const trailing = /[^a-zA-Z0-9]$/.test(raw) ? '_' : '';
  return `${leading}${core}${trailing}`;
}

/**
 * Build the condition-outcome shape consumed by applyWorldPulseOutcomes.
 * `recordMode` is receipt metadata only; the condition payload is unchanged.
 *
 * @param {{ id: string, archetype: string, targetSaveId: string, severity: number,
 *   headline: string, summary: string, reasons: string[], tick: number,
 *   sourceEventTargetId: string, causes: unknown[],
 *   recordMode?: string }} args
 * @returns {PulseOutcome}
 */
export function warConditionOutcome({
  id,
  archetype,
  targetSaveId,
  severity,
  headline,
  summary,
  reasons,
  tick,
  sourceEventTargetId,
  causes,
  recordMode,
}) {
  return {
    id,
    type: 'condition',
    candidateType: archetype,
    ruleId: `war_layer_${archetype}`,
    ruleFamily: 'stressor',
    applyMode: 'auto',
    probability: 1,
    targetSaveId,
    severity,
    headline,
    summary,
    reasons,
    ...(recordMode ? { recordMode } : {}),
    condition: {
      archetype,
      severity,
      triggeredAt: { tick, sourceEventType: 'WAR_LAYER', sourceEventTargetId },
      causes,
    },
  };
}

/**
 * A condition is a Chronicle beat on onset, target/context change, or band
 * change. Only an exact persisted condition identity in the same band is a
 * state-only refresh. `forceChronicle` marks first recovery.
 *
 * @param {{ snapshot: PulseSnapshot, archetype: string, targetSaveId: string, severity: number,
 *   sourceEventTargetId: string, forceChronicle?: boolean,
 *   incomingCauseEffect?: string }} args
 * @returns {string|undefined}
 */
export function recurringWarConditionRecordMode({
  snapshot,
  archetype,
  targetSaveId,
  severity,
  sourceEventTargetId,
  forceChronicle = false,
  incomingCauseEffect = '',
}) {
  if (forceChronicle) return undefined;
  const item = snapshot?.byId?.get?.(String(targetSaveId));
  const active = item?.settlement?.activeConditions || item?.activeConditions || [];
  const incoming = deriveActiveCondition({
    archetype,
    severity,
    triggeredAt: { sourceEventType: 'WAR_LAYER', sourceEventTargetId },
  });
  const previous = active
    .map((/** @type {unknown} */ condition) => deriveActiveCondition(
      /** @type {Parameters<typeof deriveActiveCondition>[0]} */ (condition),
    ))
    .find((/** @type {ReturnType<typeof deriveActiveCondition>} */ condition) => (
      condition?.id === incoming?.id
    ));
  if (!incoming || !previous) return undefined;
  if (incomingCauseEffect && !previous.causes.some((/** @type {{ effect?: unknown }} */ cause) => (
    cause?.effect === incomingCauseEffect
  ))) return undefined;
  return previous.severityBand === incoming.severityBand ? 'state_only' : undefined;
}

/**
 * Public receipt for the exact tick the durable scar drops below its renewal
 * floor. It carries no patch: the war ledger already crossed the boundary while
 * the existing active condition and its aftereffects keep ordinary expiry.
 * @param {{ homeId: string|number, name: string, previousScar: number, nextScar: number,
 *   floor: number, tick: number }} args
 * @returns {PulseOutcome|null}
 */
export function warExhaustionClearanceOutcome({
  homeId,
  name,
  previousScar,
  nextScar,
  floor,
  tick,
}) {
  if (previousScar < floor || nextScar >= floor) return null;
  return {
    id: `world_outcome.war_exhaustion_cleared.${clearanceIdPart(homeId)}.${tick}`,
    type: 'state',
    candidateType: 'war_exhaustion_cleared',
    ruleId: 'war_layer_war_exhaustion_cleared',
    ruleFamily: 'stressor',
    applyMode: 'auto',
    probability: 1,
    targetSaveId: String(homeId),
    severity: floor,
    headline: `${name}'s war exhaustion begins to lift`,
    summary: `The war scar no longer renews its grip on ${name}, though its aftereffects continue fading.`,
    reasons: [`War-exhaustion scar crossed below its renewal floor (${previousScar.toFixed(2)} → ${nextScar.toFixed(2)}).`],
    generatedAtTick: tick,
  };
}
