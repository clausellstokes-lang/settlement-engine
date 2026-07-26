/**
 * pendingEditIntents.js — the small contract around the legacy pending-edit queue.
 *
 * This module does not execute edits. It gives the existing writers the minimum
 * transaction vocabulary they previously lacked:
 *
 *   - complete, kind-specific payload admission;
 *   - stable NPC references (an index is accepted only long enough to resolve an id);
 *   - a save/draft owner reference and source fingerprint for freshness checks;
 *   - exact-id queue selection and small per-item receipts.
 *
 * It deliberately remains dependency-light. Its only domain dependency beyond
 * the existing queue primitive is npcFacetContract, the zero-import finite-value
 * vocabulary shared with the richer NPC bank. Session Ledger construction and
 * all executable writers remain in lazy authoring chunks. This module validates
 * transport; it is not a second domain executor.
 */

import { buildEdit } from './pendingEdits.js';
import { validateNpcFacet } from './npc/npcFacetContract.js';

/** @typedef {null | boolean | number | string} JsonPrimitive */
/** @typedef {{[key: string]: unknown}} UnknownRecord */
/** @typedef {{ownerRef?: unknown}} OwnerScopedRecord */
/**
 * Runtime admission recursively validates the contents of these containers.
 * Keeping their JSDoc leaves unknown avoids TypeScript's circular-alias hole
 * while still preventing unchecked property access at every consumer.
 * @typedef {JsonPrimitive | unknown[] | UnknownRecord} JsonValue
 */
/**
 * The fields used by queue selectors and receipt builders are named; additional
 * JSON transport fields stay unknown until the helper that owns them validates
 * their shape.
 *
 * @typedef {{
 *   id?: string|number,
 *   intentId?: unknown,
 *   kind?: string,
 *   reverted?: unknown,
 *   ownerRef?: {id?: string|null, [key: string]: unknown}|null,
 *   targetRef?: unknown,
 *   [key: string]: unknown
 * }} PendingIntent
 */
/**
 * @typedef {{
 *   intentId: string,
 *   kind: string|undefined,
 *   targetRef: unknown,
 *   ownerRef: PendingIntent['ownerRef'],
 *   status: unknown,
 *   reason: unknown,
 *   attempt: number,
 *   baseRevision: string|null,
 *   sourceFingerprint: string|null,
 *   domainReceipt: unknown,
 *   undoToken: unknown
 * }} PendingEditReceipt
 */
/**
 * @typedef {{
 *   payload: {[key: string]: JsonValue},
 *   targetRef: {type: string, id: string, ownerKey: string}
 * }} NormalizedPendingEdit
 */

const NPC_KINDS = new Set([
  'rename-npc',
  'edit-npc',
  'reassign-npc',
  'stasis-npc',
  'return-npc',
  'ransom-npc',
  'rescue-npc',
  'champion-npc',
  'recall-npc',
]);

const STASIS_REASONS = new Set(['journey', 'imprisoned', 'missing', 'sequestered']);
const SEAT_FIELDS = new Set([
  'institutionId',
  'factionLink',
  'factionAffiliation',
  'settlementId',
  'role',
  'linkedInstitutionIds',
  'linkedFactionIds',
]);
const SEAT_ARRAY_FIELDS = new Set(['linkedInstitutionIds', 'linkedFactionIds']);

const TABLE_EFFECTS = Object.freeze({
  incident: { dispatch: 'flavor', eventType: 'TABLE_INCIDENT', target: false },
  'stressor-relief': { dispatch: 'applyEvent', eventType: 'RESOLVE_STRESSOR', target: true },
  obligation: { dispatch: 'applyEvent', eventType: 'APPLY_STRESSOR', target: true },
  exposure: { dispatch: 'applyEvent', eventType: 'EXPOSE_CORRUPTION', target: true },
});
const TABLE_MAGNITUDES = Object.freeze({ minor: 0.25, moderate: 0.5, major: 0.8 });
const OBLIGATION_TYPES = new Set(['debt', 'famine', 'scarcity', 'unrest', 'siege', 'plague']);

// Closed policy metadata for the proof-slice writers. These are descriptive
// adapter IDs, never executable dispatch. Adding a new committable kind therefore
// requires an explicit timing/classification/recovery decision beside its schema.
const EDIT_POLICY = Object.freeze({
  'rename-npc':        ['authoring', 'immediate', 'settlement.rename-npc'],
  'rename-settlement': ['authoring', 'immediate', 'settlement.rename'],
  'edit-npc':          ['authoring', 'immediate', 'npc.edit-facet'],
  'reassign-npc':      ['authoring', 'immediate', 'npc.reassign'],
  'stasis-npc':        ['mechanical', 'immediate', 'npc.enter-stasis'],
  'return-npc':        ['mechanical', 'immediate', 'npc.return-from-stasis'],
  'ransom-npc':        ['world', 'next-pulse', 'roads.ransom-hostage'],
  'rescue-npc':        ['world', 'next-pulse', 'roads.rescue-hostage'],
  'champion-npc':      ['world', 'next-pulse', 'contest.champion'],
  'recall-npc':        ['world', 'next-pulse', 'roads.recall'],
  'table-event':       ['mechanical', 'canon-queue', 'table-ledger.apply'],
});

/**
 * @param {unknown} value
 * @returns {UnknownRecord|null}
 */
function recordOf(value) {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? /** @type {UnknownRecord} */ (value)
    : null;
}

/** @param {unknown} value */
function text(value) {
  return typeof value === 'string' ? value.trim() : '';
}

/**
 * Clone one value into the deliberately smaller plain-JSON transport domain.
 *
 * This is explicit rather than a JSON stringify/parse round trip so an Immer
 * draft can be detached without the banned clone idiom, and so unsupported
 * objects fail closed instead of being silently coerced. The scalar handling
 * preserves JSON's useful admission semantics: non-finite numbers become null,
 * negative zero becomes zero, object properties with non-values are omitted,
 * and the equivalent array positions become null.
 *
 * @param {unknown} value
 * @param {WeakSet<object>} [ancestors]
 * @returns {JsonValue}
 */
function clonePlainJson(value, ancestors = new WeakSet()) {
  if (value === null) return null;
  if (typeof value === 'string' || typeof value === 'boolean') return value;
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) return null;
    return Object.is(value, -0) ? 0 : value;
  }
  if (typeof value !== 'object') {
    throw new TypeError('pending edit transport contains a non-JSON value');
  }
  if (ancestors.has(value)) {
    throw new TypeError('pending edit transport contains a circular reference');
  }

  ancestors.add(value);
  try {
    if (Array.isArray(value)) {
      /** @type {JsonValue[]} */
      const clone = [];
      for (let index = 0; index < value.length; index += 1) {
        const entry = value[index];
        const entryType = typeof entry;
        if (entry === undefined || entryType === 'function' || entryType === 'symbol') {
          clone.push(null);
        } else {
          clone.push(clonePlainJson(entry, ancestors));
        }
      }
      return clone;
    }

    const prototype = Object.getPrototypeOf(value);
    if (prototype !== Object.prototype && prototype !== null) {
      throw new TypeError('pending edit transport contains a non-plain object');
    }

    /** @type {{[key: string]: JsonValue}} */
    const clone = {};
    for (const key of Object.keys(value)) {
      const child = /** @type {UnknownRecord} */ (value)[key];
      const childType = typeof child;
      if (child === undefined || childType === 'function' || childType === 'symbol') continue;
      // Define an own data property so a transported "__proto__" key cannot
      // invoke Object.prototype's legacy setter while the clone is assembled.
      Object.defineProperty(clone, key, {
        value: clonePlainJson(child, ancestors),
        enumerable: true,
        configurable: true,
        writable: true,
      });
    }
    return clone;
  } finally {
    ancestors.delete(value);
  }
}

/**
 * Deep-freeze a detached JSON tree in place. The clone has no aliases to caller
 * state, so freezing it cannot freeze or otherwise mutate an Immer draft.
 * @param {JsonValue} value
 * @returns {JsonValue}
 */
function freezeJson(value) {
  if (value && typeof value === 'object') {
    for (const child of Object.values(value)) {
      freezeJson(/** @type {JsonValue} */ (child));
    }
    Object.freeze(value);
  }
  return value;
}

/**
 * Pending intents are a JSON transport contract. Detaching at admission prevents
 * a caller from changing a nested table directive or assignment after review.
 * The generic return records that a validated transport value keeps its public
 * shape; clonePlainJson is the one runtime admission boundary.
 *
 * @template T
 * @param {T} value
 * @returns {T}
 */
function detachJson(value) {
  const detached = freezeJson(clonePlainJson(value));
  return /** @type {T} */ (/** @type {unknown} */ (detached));
}

/**
 * Stable JSON for source-fingerprint projections. Queue inputs are ordinary data,
 * but the circular guard keeps a malformed imported save from wedging the editor.
 * @param {unknown} value
 */
function stableStringify(value) {
  const seen = new WeakSet();
  /**
   * @param {unknown} entry
   * @returns {JsonValue|undefined}
   */
  const walk = (entry) => {
    if (entry === null) return null;
    if (typeof entry === 'string'
      || typeof entry === 'boolean'
      || typeof entry === 'number') return entry;
    if (typeof entry !== 'object') return undefined;
    if (seen.has(entry)) return '[Circular]';
    seen.add(entry);
    if (Array.isArray(entry)) {
      const out = entry.map(value => walk(value) ?? null);
      seen.delete(entry);
      return out;
    }
    /** @type {{[key: string]: JsonValue}} */
    const out = {};
    for (const key of Object.keys(entry).sort()) {
      const child = /** @type {UnknownRecord} */ (entry)[key];
      const projected = walk(child);
      if (projected !== undefined) {
        Object.defineProperty(out, key, {
          value: projected,
          enumerable: true,
          configurable: true,
          writable: true,
        });
      }
    }
    seen.delete(entry);
    return out;
  };
  return JSON.stringify(walk(value));
}

/** Deterministic FNV-1a digest; change detection, not authentication. */
/** @param {unknown} value */
function digest(value) {
  const source = stableStringify(value);
  if (source === undefined) {
    throw new TypeError('source fingerprint requires a JSON-shaped value');
  }
  let hash = 0x811c9dc5;
  for (let i = 0; i < source.length; i += 1) {
    hash ^= source.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return `${source.length}:${(hash >>> 0).toString(36)}`;
}

/**
 * Resolve the one settlement/save namespace that owns pending work currently on
 * screen. This is pure so store preflight and every queue projection share the
 * same addressing rule.
 *
 * @param {{ activeSaveId?:unknown, settlement?:{id?:unknown}|null,
 *   generationId?:unknown } | null | undefined} state
 * @returns {{ ownerKey:string|null, saveId:string|null, settlementRef:string|null }}
 */
export function pendingEditOwnerScope(state) {
  if (!state?.settlement) {
    return { ownerKey: null, saveId: null, settlementRef: null };
  }
  const saveId = state.activeSaveId != null ? String(state.activeSaveId) : null;
  const settlementRef = String(
    state.settlement.id
    ?? saveId
    ?? state.generationId
    ?? 'current-draft',
  );
  return {
    ownerKey: saveId ? `save:${saveId}` : `draft:${settlementRef}`,
    saveId,
    settlementRef,
  };
}

/**
 * Project queue entries or receipts into one owner namespace. Ownerless legacy
 * records are visible only with no active owner; they are never adopted by a
 * save or draft namespace.
 *
 * @template {OwnerScopedRecord} T
 * @param {T[]} entries
 * @param {string|null} ownerKey
 * @returns {T[]}
 */
export function selectPendingEditOwnerScope(entries, ownerKey) {
  if (!Array.isArray(entries)) return [];
  return entries.filter((entry) => {
    const entryOwner = recordOf(entry?.ownerRef)?.id;
    // An ownerless legacy item may be inspected only when no settlement owner is
    // active. Carrying it into save B would be an unprovable cross-save claim.
    if (entryOwner == null || String(entryOwner) === '') return ownerKey == null;
    return ownerKey != null && String(entryOwner) === String(ownerKey);
  });
}

/**
 * Fingerprint the authoritative inputs a pending edit is reviewed against. This is
 * intentionally conservative: an unrelated settlement change may require another
 * review, but a pulse, remote refresh, or direct writer cannot slip through stale
 * approval merely because it missed one narrow target projection.
 *
 * @param {{ ownerKey:string, revision:string|null, phase:string,
 *   settlement:unknown, systemState:unknown }} context
 */
export function pendingEditSourceFingerprint(context) {
  return `pef:${digest({
    ownerKey: context.ownerKey,
    revision: context.revision,
    phase: context.phase,
    settlement: context.settlement,
    systemState: context.systemState,
  })}`;
}

/**
 * Resolve an NPC transport target to one unique stable id. Array position is a
 * route hint only and is never retained on the intent.
 * @param {UnknownRecord} payload
 * @param {unknown} settlement
 * @returns {{ok:true, npc:UnknownRecord, npcId:string} | {ok:false, reason:string}}
 */
function normalizeNpcTarget(payload, settlement) {
  const settlementRecord = recordOf(settlement);
  const npcs = Array.isArray(settlementRecord?.npcs) ? settlementRecord.npcs : [];
  const sourceId = payload.npcId != null ? String(payload.npcId) : '';
  let npc = null;

  if (sourceId) {
    const matches = npcs
      .map(recordOf)
      .filter((candidate) => candidate && String(candidate.id ?? '') === sourceId);
    if (matches.length !== 1) {
      return { ok: false, reason: matches.length ? 'npc_target_ambiguous' : 'npc_target_missing' };
    }
    [npc] = matches;
  } else {
    const npcIndex = typeof payload.npcIndex === 'number'
      && Number.isInteger(payload.npcIndex)
      && payload.npcIndex >= 0
      ? payload.npcIndex
      : null;
    if (npcIndex !== null) npc = recordOf(npcs[npcIndex]);
  }

  if (!npc) return { ok: false, reason: 'npc_target_missing' };
  if (npc.id == null || !String(npc.id).trim()) {
    return { ok: false, reason: 'npc_target_has_no_stable_id' };
  }
  const npcId = String(npc.id);
  if (npcs.filter((candidate) => String(recordOf(candidate)?.id ?? '') === npcId).length !== 1) {
    return { ok: false, reason: 'npc_target_ambiguous' };
  }
  return { ok: true, npc, npcId };
}

/**
 * @param {UnknownRecord} payload
 * @returns {{ok:true, payload:{[key:string]:JsonValue}} | {ok:false, reason:string}}
 */
function validateTablePayload(payload) {
  const record = recordOf(payload.record);
  const directive = recordOf(payload.directive);
  if (!record || !directive) return { ok: false, reason: 'table_event_incomplete' };

  const recordKind = text(record.kind);
  const spec = TABLE_EFFECTS[/** @type {keyof typeof TABLE_EFFECTS} */ (recordKind)];
  if (!spec) return { ok: false, reason: 'table_event_kind_invalid' };
  if (typeof record.flavor !== 'string' || record.flavor.length > 2000) {
    return { ok: false, reason: 'table_event_flavor_invalid' };
  }
  if (directive.dispatch !== spec.dispatch) {
    return { ok: false, reason: 'table_event_dispatch_mismatch' };
  }
  const targetRef = text(record.targetRef);
  if (spec.target && !targetRef) {
    return { ok: false, reason: 'table_event_target_missing' };
  }
  if (recordKind === 'obligation' && !OBLIGATION_TYPES.has(targetRef)) {
    return { ok: false, reason: 'table_event_target_invalid' };
  }
  const band = text(record.band);
  const expectedSeverity = TABLE_MAGNITUDES[
    /** @type {keyof typeof TABLE_MAGNITUDES} */ (band)
  ];
  if (spec.target && (
    !Object.hasOwn(TABLE_MAGNITUDES, band)
    || record.severity !== expectedSeverity
  )) {
    return { ok: false, reason: 'table_event_magnitude_invalid' };
  }
  if (!spec.target && (
    text(record.targetRef)
    || record.band != null
    || record.severity != null
  )) {
    return { ok: false, reason: 'table_event_record_mismatch' };
  }

  const normalizedRecord = {
    kind: recordKind,
    targetRef: spec.target ? targetRef : '',
    targetLabel: spec.target ? text(record.targetLabel) || targetRef : '',
    band: spec.target ? band : null,
    severity: spec.target ? record.severity : null,
    flavor: record.flavor,
  };

  if (spec.dispatch === 'flavor') {
    const entry = recordOf(directive.entry);
    const narrativeSummary = normalizedRecord.flavor
      || 'A moment at the table was recorded.';
    if (!entry
      || entry.source !== 'table'
      || entry.type !== spec.eventType
      || entry.narrativeSummary !== narrativeSummary) {
      return { ok: false, reason: 'table_event_directive_invalid' };
    }
    return {
      ok: true,
      payload: {
        record: normalizedRecord,
        directive: {
          dispatch: 'flavor',
          entry: { type: spec.eventType, source: 'table', narrativeSummary },
        },
      },
    };
  } else {
    const event = recordOf(directive.event);
    if (!event || event.source !== 'table' || event.type !== spec.eventType) {
      return { ok: false, reason: 'table_event_directive_invalid' };
    }
    if (String(event.targetId ?? '') !== String(record.targetRef)) {
      return { ok: false, reason: 'table_event_target_mismatch' };
    }
    const sourceEventPayload = recordOf(event.payload);
    if (Number(sourceEventPayload?.severity) !== Number(record.severity)) {
      return { ok: false, reason: 'table_event_magnitude_mismatch' };
    }
    if (event.type !== 'EXPOSE_CORRUPTION'
      && String(sourceEventPayload?.stressorType ?? '') !== String(record.targetRef)) {
      return { ok: false, reason: 'table_event_target_mismatch' };
    }
    if (event.tableFlavor !== normalizedRecord.flavor) {
      return { ok: false, reason: 'table_event_flavor_mismatch' };
    }

    const eventPayload = event.type === 'EXPOSE_CORRUPTION'
      ? { severity: normalizedRecord.severity }
      : {
          stressorType: normalizedRecord.targetRef,
          label: normalizedRecord.targetLabel,
          severity: normalizedRecord.severity,
        };
    return {
      ok: true,
      payload: {
        record: normalizedRecord,
        directive: {
          dispatch: 'applyEvent',
          event: {
            type: spec.eventType,
            targetId: normalizedRecord.targetRef,
            payload: eventPayload,
            source: 'table',
            tableFlavor: normalizedRecord.flavor,
          },
        },
      },
    };
  }
}

/**
 * Normalize and validate one committable edit payload.
 *
 * @param {string} kind
 * @param {unknown} rawPayload
 * @param {{ settlement:unknown, settlementRef:string, ownerKey:string, phase:string }} context
 * @returns {{ok:true, payload:{[key:string]:JsonValue}, targetRef:{type:string,id:string,ownerKey:string}}
 *   | {ok:false, reason:string}}
 */
export function normalizePendingEditPayload(kind, rawPayload, context) {
  const input = recordOf(rawPayload);
  if (!input) return { ok: false, reason: 'payload_required' };

  let npcId = '';
  if (NPC_KINDS.has(kind)) {
    const npcTarget = normalizeNpcTarget(input, context.settlement);
    if (npcTarget.ok === false) return { ok: false, reason: npcTarget.reason };
    npcId = npcTarget.npcId;
  }

  /** @type {{[key: string]: JsonValue}} */
  let payload;
  if (kind === 'rename-npc') {
    const newName = text(input.newName);
    if (!newName) return { ok: false, reason: 'new_name_required' };
    payload = { npcId, newName };
  } else if (kind === 'rename-settlement') {
    const newName = text(input.newName);
    if (!newName) return { ok: false, reason: 'new_name_required' };
    payload = { newName };
  } else if (kind === 'edit-npc') {
    const facetKind = text(input.facetKind);
    const value = text(input.value);
    const facet = validateNpcFacet(facetKind, value);
    if (!facet.ok) return { ok: false, reason: 'npc_facet_invalid' };
    payload = { npcId, facetKind, value };
  } else if (kind === 'reassign-npc') {
    const target = recordOf(input.target);
    if (!target) return { ok: false, reason: 'npc_assignment_required' };
    /** @type {{[key: string]: JsonValue}} */
    const filtered = {};
    for (const [key, value] of Object.entries(target)) {
      if (!SEAT_FIELDS.has(key)) return { ok: false, reason: 'npc_assignment_field_invalid' };
      if (value === undefined) continue;
      if (SEAT_ARRAY_FIELDS.has(key)) {
        if (!Array.isArray(value) || !value.every((entry) => (
          typeof entry === 'string'
          || (typeof entry === 'number' && Number.isFinite(entry))
        ))) return { ok: false, reason: 'npc_assignment_value_invalid' };
        filtered[key] = value.map(entry => (
          typeof entry === 'string' ? entry : Number(entry)
        ));
      } else {
        if (value === null) {
          filtered[key] = null;
        } else if (typeof value === 'string') {
          filtered[key] = value;
        } else if (typeof value === 'number' && Number.isFinite(value)) {
          filtered[key] = value;
        } else {
          return { ok: false, reason: 'npc_assignment_value_invalid' };
        }
      }
    }
    if (!Object.keys(filtered).length) return { ok: false, reason: 'npc_assignment_required' };
    payload = { npcId, target: filtered };
  } else if (kind === 'stasis-npc') {
    const reason = text(input.reason);
    if (!STASIS_REASONS.has(reason)) return { ok: false, reason: 'stasis_reason_invalid' };
    payload = { npcId, reason };
  } else if (kind === 'champion-npc') {
    const contestId = text(input.contestId);
    if (!contestId) return { ok: false, reason: 'contest_id_required' };
    payload = { npcId, contestId };
  } else if (['return-npc', 'ransom-npc', 'rescue-npc', 'recall-npc'].includes(kind)) {
    payload = { npcId };
  } else if (kind === 'table-event') {
    const table = validateTablePayload(input);
    if (table.ok === false) return { ok: false, reason: table.reason };
    payload = table.payload;
  } else {
    return { ok: false, reason: 'kind_not_committable' };
  }

  const recordTargetRef = text(recordOf(input.record)?.targetRef);
  const targetRef = NPC_KINDS.has(kind)
    ? { type: 'npc', id: npcId, ownerKey: context.ownerKey }
    : kind === 'table-event' && recordTargetRef
      ? { type: 'table-subject', id: recordTargetRef, ownerKey: context.ownerKey }
      : { type: 'settlement', id: context.settlementRef, ownerKey: context.ownerKey };

  try {
    return {
      ok: true,
      payload: detachJson(payload),
      targetRef: detachJson(targetRef),
    };
  } catch {
    return { ok: false, reason: 'payload_not_serializable' };
  }
}

/**
 * Build the serializable intent envelope around the existing queue primitive.
 * @param {string} kind
 * @param {NormalizedPendingEdit} normalized
 * @param {number} clock
 * @param {{ saveId?:string|null, ownerKey:string, revision:string|null,
 *   phase:string, settlement:unknown, systemState:unknown }} context
 * @returns {Readonly<PendingIntent>}
 */
export function buildPendingEditIntent(kind, normalized, clock, context) {
  const base = buildEdit(kind, normalized.payload, clock);
  const sourceFingerprint = pendingEditSourceFingerprint(context);
  const policy = EDIT_POLICY[/** @type {keyof typeof EDIT_POLICY} */ (kind)];
  const [kindClass, executionPolicy, applyAdapterId] = policy;
  const targetRef = Object.freeze({ ...normalized.targetRef });
  return Object.freeze({
    ...base,
    targetRef,
    preconditions: detachJson([{
      targetRef,
      baseRevision: context.revision,
      sourceFingerprint,
    }]),
    kindClass,
    scope: 'save',
    executionPolicy,
    deliveryPolicy: 'direct',
    availability: Object.freeze({ status: 'available', reason: null }),
    previewPolicy: kind === 'table-event' ? 'typed-directive' : 'cascade',
    previewAdapterId: kind === 'table-event'
      ? 'table-ledger.preview'
      : 'pending-edits.preview-cascade',
    affectedSaveIds: Object.freeze(context.saveId ? [String(context.saveId)] : []),
    applyAdapterId,
    recoveryPolicy: 'review-and-retry',
    undoPolicy: 'snapshot',
    // This is the save/draft namespace of the staged work, not account or auth
    // ownership. Authorization remains in the existing store/UI capability gates.
    ownerRef: Object.freeze({
      scope: context.saveId ? 'save' : 'draft',
      id: context.ownerKey,
      saveId: context.saveId,
    }),
    baseRevision: context.revision,
    sourceFingerprint,
    status: 'staged',
    attempts: 0,
    failureReason: null,
  });
}

/**
 * Exact-id selection. Unknown ids simply select nothing.
 * @param {PendingIntent[]} queue @param {Array<string|number>} intentIds
 * @returns {PendingIntent[]}
 */
export function selectPendingEditIntents(queue, intentIds) {
  if (!Array.isArray(queue) || !Array.isArray(intentIds) || !intentIds.length) return [];
  const wanted = new Set(intentIds.map(String));
  return queue.filter((intent) => !intent?.reverted && wanted.has(String(intent?.id)));
}

/**
 * Replace one intent with a new lifecycle observation without mutating the queue.
 * @param {PendingIntent[]} queue @param {string|number} intentId
 * @param {UnknownRecord} patch @returns {PendingIntent[]}
 */
export function updatePendingEditIntent(queue, intentId, patch) {
  if (!Array.isArray(queue)) return [];
  return queue.map((intent) => {
    // This helper is also called from Zustand's Immer producer. Spreading an
    // Immer draft copies nested proxy references (payload, ownerRef, targetRef)
    // into the replacement object; those proxies are revoked when the producer
    // closes and make the retained queue unreadable on retry. Even unchanged
    // siblings must be detached because assigning a newly mapped array would
    // otherwise leak their draft proxies. Pending intents are a closed JSON
    // transport contract, so snapshot every member before replacement.
    const detached = detachJson(intent);
    return String(intent?.id) === String(intentId)
      ? detachJson({ ...detached, ...patch })
      : detached;
  });
}

/**
 * Remove exactly the named intents, leaving other queue owners untouched.
 * @param {PendingIntent[]} queue @param {Array<string|number>} intentIds
 * @returns {PendingIntent[]}
 */
export function removePendingEditIntents(queue, intentIds) {
  if (!Array.isArray(queue)) return [];
  const removed = new Set((intentIds || []).map(String));
  return queue.filter((intent) => !removed.has(String(intent?.id)));
}

/**
 * Small session receipt. Authoritative event/snapshot receipts remain in their
 * existing stores; this correlates the queue attempt without becoming a new log.
 * @param {PendingIntent} intent @param {UnknownRecord} result
 * @param {number} attempt @returns {Readonly<PendingEditReceipt>}
 */
export function makePendingEditReceipt(intent, result, attempt) {
  return Object.freeze({
    intentId: String(intent.id),
    kind: intent.kind,
    targetRef: intent.targetRef,
    ownerRef: intent.ownerRef,
    status: result.status,
    reason: result.reason || null,
    attempt,
    // Retain the reviewed basis so the application command facade can recover
    // the same replay identity after a successful intent leaves the queue.
    // These remain session-only with the receipt; no new persistence claim.
    baseRevision: intent.baseRevision == null
      ? null
      : String(intent.baseRevision),
    sourceFingerprint: intent.sourceFingerprint == null
      ? null
      : String(intent.sourceFingerprint),
    domainReceipt: result.receipt || null,
    undoToken: result.undoToken || null,
  });
}
