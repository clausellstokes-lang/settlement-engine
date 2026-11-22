/**
 * Declarative common envelope for pulse-stage results.
 *
 * This module does not schedule, import, or execute a mover. It only gives
 * callers and tooling one byte-safe result shape while legacy movers retain
 * their existing return contracts. In particular, an unchanged result always
 * carries the caller's ORIGINAL worldState reference, even when the raw result
 * accidentally supplies a fresh object.
 */

export const PULSE_STAGE_RESULT_KIND = 'pulse_stage_result.v1';

/** @param {unknown} value @returns {ReadonlyArray<unknown> | undefined} */
function frozenArray(value) {
  return Array.isArray(value) ? Object.freeze([...value]) : undefined;
}

/**
 * @typedef {Object} PulseStageResult
 * @property {'pulse_stage_result.v1'} kind
 * @property {boolean} changed
 * @property {unknown} worldState
 * @property {ReadonlyArray<unknown>} [settlementUpdates]
 * @property {ReadonlyArray<unknown>} [newsEntries]
 * @property {ReadonlyArray<unknown>} [evidence]
 * @property {ReadonlyArray<unknown>} [effects]
 */

/**
 * Normalize a mover-like result without changing or freezing domain state.
 * Optional arrays are copied before freezing so later mutation of an input
 * array cannot mutate the certification envelope.
 *
 * @param {unknown} rawResult
 * @param {unknown} priorWorldState
 * @returns {Readonly<PulseStageResult>}
 */
export function normalizePulseStageResult(rawResult, priorWorldState) {
  const row = rawResult && typeof rawResult === 'object' && !Array.isArray(rawResult)
    ? /** @type {Record<string, unknown>} */ (rawResult)
    : {};
  const changed = row.changed === true;
  const worldState = changed && Object.prototype.hasOwnProperty.call(row, 'worldState')
    ? row.worldState
    : priorWorldState;
  /** @type {Record<string, unknown>} */
  const envelope = {
    kind: PULSE_STAGE_RESULT_KIND,
    changed,
    worldState,
  };
  for (const key of ['settlementUpdates', 'newsEntries', 'evidence', 'effects']) {
    const list = frozenArray(row[key]);
    if (list) envelope[key] = list;
  }
  return /** @type {Readonly<PulseStageResult>} */ (Object.freeze(envelope));
}

/**
 * Construct the canonical no-op result. Additional optional arrays are
 * normalized exactly as they are by `normalizePulseStageResult`.
 *
 * @param {unknown} worldState
 * @param {Record<string, unknown>} [optional]
 * @returns {Readonly<PulseStageResult>}
 */
export function unchangedPulseStageResult(worldState, optional = {}) {
  return normalizePulseStageResult({ ...optional, changed: false }, worldState);
}
