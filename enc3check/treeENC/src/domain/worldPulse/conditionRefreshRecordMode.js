import { deriveActiveCondition } from '../activeConditions.js';

const STATE_ONLY = 'state_only';

// A condition refresh is eligible only when the condition is the outcome's
// entire mechanical payload. This known-apply-field deny-list sits behind the
// closed producer opt-in below: a new family cannot become eligible by shape
// alone, and every compound outcome the current apply mouth understands remains
// public. Adding an effect to an opted-in producer must extend this contract.
const SIDE_EFFECT_FIELDS = Object.freeze([
  'populationDeltas',
  'foodStockpileDeltas',
  'tierChange',
  'resourcePatch',
  'resourceMembership',
  'institutionPatch',
  'lifecyclePatch',
  'powerTransfer',
  'deityReembed',
  'stressor',
  'relationshipKey',
  'relationshipPatch',
  'npcPatch',
  'factionPatch',
  'proposalPayload',
]);

/**
 * Producer opt-in is a closed set. A new condition family remains public until
 * its owner proves that repeated application is condition-only and that the
 * persisted condition contains its complete causal identity.
 *
 * @param {unknown} candidate
 * @returns {boolean}
 */
export function isConditionRefreshOptedIn(candidate) {
  const record = recordOf(candidate);
  return record?.ruleFamily === 'organic_drift'
    || record?.candidateType === 'flow_trade_scarcity';
}

/** @param {unknown} value @returns {Record<string, unknown>|null} */
function recordOf(value) {
  return value != null && typeof value === 'object' && !Array.isArray(value)
    ? /** @type {Record<string, unknown>} */ (value)
    : null;
}

/** @param {unknown} value @returns {string|null} */
function targetIdOf(value) {
  return typeof value === 'string' || (typeof value === 'number' && Number.isFinite(value))
    ? String(value)
    : null;
}

/** @param {string} left @param {string} right @returns {number} */
function codepoint(left, right) {
  return left < right ? -1 : left > right ? 1 : 0;
}

/**
 * Preserve stable causal facts while excluding explanatory prose. A changed
 * reason sentence is not a new event; a changed source/effect/segment is.
 * Unsupported nested values fail closed so an unfamiliar cause shape stays
 * Chronicle-visible.
 *
 * @param {unknown} value
 * @returns {string|null}
 */
function causeContextKey(value) {
  const cause = recordOf(value);
  if (!cause) return null;
  /** @type {Array<[string, string|Array<string>]>} */
  const entries = [];
  for (const key of Object.keys(cause).sort(codepoint)) {
    if (key === 'reason') continue;
    const raw = cause[key];
    if (raw === null) {
      entries.push([key, 'null:']);
      continue;
    }
    if (typeof raw === 'string') {
      entries.push([key, `string:${raw}`]);
      continue;
    }
    if (typeof raw === 'boolean') {
      entries.push([key, `boolean:${raw ? 'true' : 'false'}`]);
      continue;
    }
    if (typeof raw === 'number') {
      if (!Number.isFinite(raw)) return null;
      entries.push([key, `number:${String(raw)}`]);
      continue;
    }
    if (Array.isArray(raw)) {
      /** @type {string[]} */
      const values = [];
      let supported = true;
      for (const entry of raw) {
        if (entry === null) {
          values.push('null:');
        } else if (typeof entry === 'string') {
          values.push(`string:${entry}`);
        } else if (typeof entry === 'boolean') {
          values.push(`boolean:${entry ? 'true' : 'false'}`);
        } else if (typeof entry === 'number' && Number.isFinite(entry)) {
          values.push(`number:${String(entry)}`);
        } else {
          supported = false;
          break;
        }
      }
      if (!supported) return null;
      entries.push([key, values]);
      continue;
    }
    return null;
  }
  return JSON.stringify(entries);
}

/**
 * Tick and reason prose are refresh detail, not causal identity. The trigger
 * source plus sorted non-prose cause facts capture the durable "why this
 * condition exists" context.
 *
 * @param {NonNullable<ReturnType<typeof deriveActiveCondition>>} condition
 * @returns {string|null}
 */
function conditionContextKey(condition) {
  const causes = [];
  for (const cause of condition.causes) {
    const key = causeContextKey(cause);
    if (key == null) return null;
    causes.push(key);
  }
  causes.sort(codepoint);
  return JSON.stringify([
    condition.triggeredAt.sourceEventType,
    condition.triggeredAt.sourceEventTargetId,
    causes,
  ]);
}

/**
 * @param {unknown} value
 * @returns {ReturnType<typeof deriveActiveCondition>}
 */
function canonicalCondition(value) {
  const record = recordOf(value);
  if (!record) return null;
  return deriveActiveCondition(
    /** @type {Parameters<typeof deriveActiveCondition>[0]} */ (record),
  );
}

/**
 * A strict shape guard used only after the caller has explicitly opted a
 * producer family in. Proposals and compound outcomes remain public even when
 * they happen to carry a condition payload.
 *
 * @param {unknown} candidate
 * @returns {boolean}
 */
export function isPureConditionRefreshCandidate(candidate) {
  const record = recordOf(candidate);
  if (!record
      || record.type !== 'condition'
      || record.applyMode !== 'auto'
      || record.partySourced === true
      || record.recordMode != null
      || !recordOf(record.condition)
      || targetIdOf(record.targetSaveId) == null) {
    return false;
  }
  for (const field of SIDE_EFFECT_FIELDS) {
    if (record[field] != null) return false;
  }
  if (record.affectedSettlementIds != null) {
    if (!Array.isArray(record.affectedSettlementIds)) return false;
    const targetId = targetIdOf(record.targetSaveId);
    if (record.affectedSettlementIds.some(id => targetIdOf(id) !== targetId)) return false;
  }
  return true;
}

/**
 * Public on onset, exact-condition causal/status transition, or severity-band
 * transition. Only a same-identity, same-context, same-status, same-band
 * refresh is mechanical.
 *
 * @param {{ snapshot: unknown, candidate: unknown }} args
 * @returns {'state_only'|undefined}
 */
export function recurringConditionRecordMode({ snapshot, candidate }) {
  if (!isConditionRefreshOptedIn(candidate)
      || !isPureConditionRefreshCandidate(candidate)) return undefined;
  const candidateRecord = recordOf(candidate);
  const targetId = targetIdOf(candidateRecord?.targetSaveId);
  const snapshotRecord = recordOf(snapshot);
  const byId = snapshotRecord?.byId;
  if (!targetId || !(byId instanceof Map)) return undefined;

  const item = recordOf(byId.get(targetId));
  const settlement = recordOf(item?.settlement);
  const activeRaw = Array.isArray(settlement?.activeConditions)
    ? settlement.activeConditions
    : Array.isArray(item?.activeConditions)
      ? item.activeConditions
      : [];
  const incoming = canonicalCondition(candidateRecord?.condition);
  if (!incoming) return undefined;

  let previous = null;
  for (const raw of activeRaw) {
    const condition = canonicalCondition(raw);
    if (condition?.id === incoming.id) {
      previous = condition;
      break;
    }
  }
  if (!previous
      || previous.archetype !== incoming.archetype
      || previous.status !== incoming.status
      || previous.severityBand !== incoming.severityBand) {
    return undefined;
  }
  const previousContext = conditionContextKey(previous);
  const incomingContext = conditionContextKey(incoming);
  return previousContext != null && previousContext === incomingContext
    ? STATE_ONLY
    : undefined;
}

/**
 * Preserve the original reference unless the candidate is a proven refresh.
 *
 * @template T
 * @param {unknown} snapshot
 * @param {T} candidate
 * @returns {T}
 */
export function classifyRecurringConditionCandidate(snapshot, candidate) {
  if (recurringConditionRecordMode({ snapshot, candidate }) !== STATE_ONLY) return candidate;
  const record = recordOf(candidate);
  return /** @type {T} */ (/** @type {unknown} */ ({
    ...record,
    recordMode: STATE_ONLY,
  }));
}
