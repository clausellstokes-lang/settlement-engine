/**
 * settlementPendingEdits.js — delegated transaction coordinator for dossier edits.
 *
 * The store's established domain writers remain authoritative. This helper owns
 * only the queue boundary around them: admission, stable target resolution,
 * freshness preflight, exact-id commit/discard, retained failures, and correlation
 * receipts. Mixed writer batches are explicitly per-item sagas; this module does
 * not claim cross-writer or cloud atomicity.
 */

import {
  activeEdits,
  appendEdit,
  COMMITTABLE_EDIT_KINDS,
} from '../domain/pendingEdits.js';
import {
  buildPendingEditIntent,
  makePendingEditReceipt,
  normalizePendingEditPayload,
  pendingEditOwnerScope,
  pendingEditSourceFingerprint,
  removePendingEditIntents,
  selectPendingEditIntents,
  updatePendingEditIntent,
} from '../domain/pendingEditIntents.js';
import { applyEditOp } from './settlementPendingEditWriters.js';
import { getEffectiveValue, isEditablePath } from '../domain/userEdits.js';
import { resolveFactionForRename } from '../domain/factionRename.js';
import { _resolveEntity } from './settlementSliceHelpers.js';

const RECEIPT_LIMIT = 100;
const WORLD_NPC_KINDS = new Set(['ransom-npc', 'rescue-npc', 'champion-npc', 'recall-npc']);

// ── edit-prose: the QUEUE-wired subset of EDITABLE_FIELDS (R-2, 2026-07-27) ──
//
// EDITABLE_FIELDS (domain/userEdits.js) registers 25 prose paths across 7
// entity kinds. The queue admits exactly the 16 whose full lifecycle holds
// (edit → commit → persist → REGEN survival → snapshot undo). The other 8 are
// DELIBERATELY NOT WIRED — documented breakers, not oversights:
//
//   npc 'personality'      — generated personality is an OBJECT; a string edit
//                            replaces it and a later edit-npc temperament facet
//                            spreads the string into indexed-char garbage
//                            (settlementPendingEditWriters.js applyNpcOp).
//   npc 'goal.short'       — the edit-npc goal facet writes npc.goal.short
//                            directly, bypassing the _userEdits record: the
//                            edit record goes stale and Revert lies.
//   npc 'role'             — reassign-npc SEAT_FIELDS includes 'role' and
//                            Object.assigns over an authored value with no
//                            record sync (same stale-record seam).
//   hook '*'               — no generator produces settlement.hooks and no
//                            display reads it; the registry rows point at a
//                            phantom array on pipeline data.
//   historicalEvent '*',
//   currentTension '*'     — regenSection('history') rerolls the entry arrays
//                            and authored ENTRIES carry no identity to be
//                            preserved by (settlementSlice regenSection +
//                            historyPreservation deferral A; owner-parked).
//
// npc 'secret.what' keeps its existing inline card path (npcComponents.jsx) —
// the direct applyUserEditAction mount predates the queue and stays as-is.
// Every wired settlement 'history.*' path survives a history reroll because
// restoreAuthoredHistory re-applies authored root history prose; the other
// root paths and powerStructure.factions / institutions are replaced by no
// regen branch. Kept in lockstep with EDITABLE_FIELDS by
// tests/store/editProseQueueSpine.test.js.
export const QUEUE_WIRED_PROSE_PATHS = Object.freeze({
  faction: Object.freeze(['desc']),
  institution: Object.freeze(['desc']),
  settlement: Object.freeze([
    'arrivalScene',
    'pressureSentence',
    'settlementReason',
    'prominentRelationship.phrasing',
    'history.historicalCharacter',
    'history.founding.reason',
    'history.founding.initialChallenge',
    'history.founding.overcoming',
    'history.founding.stressNote',
    'history.founding.foundedBy',
    'economicViability.summary',
    'economicState.safetyProfile.safetyDesc',
    'economicState.safetyProfile.guardEffectivenessDesc',
    'economicState.safetyProfile.economicDragDesc',
  ]),
});

/**
 * Produce the serializable source context captured by every staged intent.
 * `revision` uses the save envelope when available; the full source fingerprint
 * catches unsaved/direct mutations that do not stamp that envelope.
 */
export function pendingEditContext(state) {
  if (!state?.settlement) return null;
  const { ownerKey, saveId, settlementRef } = pendingEditOwnerScope(state);
  if (!ownerKey || !settlementRef) return null;
  const save = saveId
    ? (state.savedSettlements || []).find((entry) => String(entry?.id) === saveId)
    : null;
  const revisionValue = save?.timestamp
    ?? save?.campaignState?.editedAt
    ?? state.editedAt
    ?? state.generatedAt
    ?? null;
  return {
    ownerKey,
    saveId,
    settlementRef,
    revision: revisionValue != null ? String(revisionValue) : null,
    phase: String(state.phase || 'draft'),
    settlement: state.settlement,
    systemState: state.systemState ?? null,
  };
}

function npcFor(settlement, npcId) {
  const matches = (settlement?.npcs || [])
    .filter((npc) => String(npc?.id ?? '') === String(npcId ?? ''));
  return matches.length === 1 ? matches[0] : null;
}

/**
 * Report whether the current settlement can safely accept a direct edit. A world
 * advance commits campaign state wholesale, and a parked pause later resumes
 * from its captured snapshot; writing inside either window can be clobbered.
 */
export function pendingEditWriteCapability(state) {
  const saveId = state?.activeSaveId;
  if (saveId == null) return { ok: true, reason: null, campaignId: null };
  const campaigns = (state.campaigns || []).filter((campaign) => (
    (campaign?.accessState || 'active') === 'active'
    && (campaign?.settlementIds || []).some((id) => String(id) === String(saveId))
  ));
  const advancing = campaigns.find((campaign) => (
    (state.advanceInFlight || []).some((id) => String(id) === String(campaign.id))
  ));
  if (advancing) {
    return { ok: false, reason: 'realm_advancing', campaignId: advancing.id };
  }
  const paused = campaigns.find((campaign) => campaign?.worldState?.pausedAdvance);
  if (paused) {
    return { ok: false, reason: 'advance_paused', campaignId: paused.id };
  }
  return { ok: true, reason: null, campaignId: null };
}

/**
 * Live capability is checked both at admission and immediately before apply.
 * Shape validation belongs to the pure contract; this layer answers whether the
 * current world can truthfully accept the already-valid operation.
 */
function availability(kind, payload, state) {
  const settlement = state?.settlement;
  if (!settlement) return { ok: false, reason: 'settlement_missing' };
  const writeCapability = pendingEditWriteCapability(state);
  if (!writeCapability.ok) return writeCapability;

  if (kind === 'rename-settlement') {
    if (String(settlement.name || '') === String(payload.newName || '')) {
      return { ok: false, reason: 'no_effect' };
    }
    return { ok: true };
  }

  if (kind === 'rename-faction') {
    // Canon lock first: it is the reason a rename is refused, and reporting
    // 'faction_target_missing' for a locked-but-present faction would send the
    // reader looking for a data problem that is not there.
    if (state.phase === 'canon') return { ok: false, reason: 'canon_identity_locked' };
    const target = resolveFactionForRename(settlement, payload.factionIndex);
    if (!target) return { ok: false, reason: 'faction_target_missing' };
    if (target.currentName === String(payload.newName || '')) {
      return { ok: false, reason: 'no_effect' };
    }
    return { ok: true };
  }

  if (kind === 'table-event') {
    if (payload.directive?.dispatch === 'flavor' && state.phase !== 'canon') {
      return { ok: false, reason: 'canon_required' };
    }
    return { ok: true };
  }

  if (kind === 'edit-prose') {
    // Registry gate first (the writer re-checks it), then the queue-wired
    // subset — a registered-but-hazardous path is refused with its own typed
    // reason so a future wiring decision is visible in the refusal, not lost.
    if (!isEditablePath(payload.entityKind, payload.path)) {
      return { ok: false, reason: 'prose_path_not_editable' };
    }
    const wired = QUEUE_WIRED_PROSE_PATHS[payload.entityKind];
    if (!wired || !wired.includes(payload.path)) {
      return { ok: false, reason: 'prose_path_deferred' };
    }
    const entity = _resolveEntity(settlement, payload.entityKind, payload.entityIndex);
    if (!entity) return { ok: false, reason: 'prose_target_missing' };
    if (getEffectiveValue(entity, payload.path) === payload.value) {
      return { ok: false, reason: 'no_effect' };
    }
    return { ok: true };
  }

  const npc = npcFor(settlement, payload.npcId);
  if (!npc) return { ok: false, reason: 'npc_target_missing' };

  if (kind === 'rename-npc') {
    if (state.phase === 'canon') return { ok: false, reason: 'canon_identity_locked' };
    if (String(npc.name || '') === String(payload.newName || '')) {
      return { ok: false, reason: 'no_effect' };
    }
  } else if (kind === 'edit-npc') {
    const current = npc.facets?.[payload.facetKind];
    if (current === payload.value) return { ok: false, reason: 'no_effect' };
  } else if (kind === 'reassign-npc') {
    const changes = Object.entries(payload.target || {})
      .some(([key, value]) => JSON.stringify(npc[key]) !== JSON.stringify(value));
    if (!changes) return { ok: false, reason: 'no_effect' };
  } else if (kind === 'stasis-npc') {
    if (npc.stasis?.reason === payload.reason) return { ok: false, reason: 'no_effect' };
  } else if (kind === 'return-npc') {
    if (!npc.stasis) return { ok: false, reason: 'npc_not_in_stasis' };
  } else if (kind === 'ransom-npc' || kind === 'rescue-npc') {
    if (npc.whereabouts?.state !== 'hostage') {
      return { ok: false, reason: 'npc_not_hostage' };
    }
  } else if (kind === 'recall-npc') {
    if (!['traveling', 'visiting'].includes(npc.whereabouts?.state)) {
      return { ok: false, reason: 'npc_not_recallable' };
    }
  } else if (kind === 'champion-npc') {
    if (npc.contestBacking === payload.contestId) {
      return { ok: false, reason: 'no_effect' };
    }
  }
  return { ok: true };
}

/**
 * @returns {{ok:true, payload:Record<string,any>, targetRef:{type:string,id:string,ownerKey:string}}
 *   | {ok:false, reason:string}}
 */
function normalizedAt(kind, payload, context) {
  if (!context) return { ok: false, reason: 'settlement_missing' };
  return normalizePendingEditPayload(kind, payload, context);
}

/**
 * Queue one edit. Returns null on a typed refusal for compatibility with the
 * existing controls; accepted entries always carry stable targets and freshness.
 */
export function queuePendingEdit(get, set, kind, payload) {
  if (!COMMITTABLE_EDIT_KINDS.includes(kind)) return null;
  const state = get();
  const context = pendingEditContext(state);
  const normalized = normalizedAt(kind, payload, context);
  if (!normalized.ok) return null;
  if (!availability(kind, normalized.payload, state).ok) return null;

  // A repeated click on the same still-staged action returns the original intent
  // instead of creating two world orders with different clock-derived ids.
  const existing = activeEdits(state.pendingEditsQueue || []).find((intent) => (
    intent.status !== 'failed'
    && intent.status !== 'stale'
    && intent.kind === kind
    && intent.ownerRef?.id === context.ownerKey
    && JSON.stringify(intent.payload) === JSON.stringify(normalized.payload)
  ));
  if (existing) return existing;

  const clock = (state.pendingEditsClock || 0) + 1;
  const intent = buildPendingEditIntent(kind, normalized, clock, context);
  set((draft) => {
    draft.pendingEditsClock = clock;
    draft.pendingEditsQueue = appendEdit(draft.pendingEditsQueue || [], intent);
  });

  const queueDepthAfter = activeEdits(get().pendingEditsQueue || []).length;
  import('../lib/analytics.js').then(({ Funnel, EVENTS }) => {
    Funnel.track(EVENTS.EDIT_PENDING_QUEUED, {
      kind,
      canon_phase: get().phase,
      queue_depth_after: queueDepthAfter,
    });
  }).catch(() => {});
  return intent;
}

function appendReceipts(set, receipts) {
  if (!receipts.length) return;
  set((state) => {
    state.pendingEditReceipts = [
      ...(state.pendingEditReceipts || []),
      ...receipts,
    ].slice(-RECEIPT_LIMIT);
  });
}

function successfulReceiptFor(receipts, intentId, ownerKey) {
  return [...(receipts || [])].reverse().find((receipt) => (
    String(receipt?.intentId) === String(intentId)
    && receipt?.ownerRef?.id === ownerKey
    && (receipt.status === 'applied' || receipt.status === 'queued')
  )) || null;
}

async function applyRename(get, set, intent) {
  const payload = intent.payload || {};
  if (intent.kind === 'rename-npc') {
    const npcs = get().settlement?.npcs || [];
    const index = npcs.findIndex((npc) => String(npc?.id ?? '') === String(payload.npcId));
    if (index < 0) return { ok: false, status: 'failed', reason: 'npc_target_missing' };
    // AWAITED, for the same reason the faction arm below is: the writer fetches
    // its cascade module at the call seam, so the write lands a microtask later.
    // Reading the roster off the un-awaited call would score every real rename as
    // 'rename_not_applied' while the write still landed.
    await get().renameNPC?.(index, payload.newName);
    const after = npcFor(get().settlement, payload.npcId);
    return after?.name === payload.newName
      ? { ok: true, status: 'applied', reason: null }
      : { ok: false, status: 'failed', reason: 'rename_not_applied' };
  }

  if (intent.kind === 'rename-faction') {
    // The converged writer owns resolution, the dual-write, the whole
    // FACTION_RENAME_SURFACES cascade (the count lives in that list, never in a
    // comment beside it) and the neighbour walk. This dispatcher only reports whether the
    // write landed, so a receipt can never claim an apply the writer refused.
    // AWAITED: the writer fetches its cascade module at the call seam to keep it
    // off first paint, so the action envelope is a promise. Reading `.changed`
    // off the un-awaited promise would score every real rename as a failure
    // while the write still landed.
    const result = /** @type {any} */ (await get().renameFaction?.(payload.factionIndex, payload.newName));
    if (result?.changed) return { ok: true, status: 'applied', reason: null };
    const after = resolveFactionForRename(get().settlement, payload.factionIndex);
    return {
      ok: false,
      status: 'failed',
      reason: after ? 'rename_not_applied' : 'faction_target_missing',
    };
  }

  const saveId = get().activeSaveId;
  if (saveId != null) {
    get().renameSettlement?.(saveId, payload.newName);
  } else {
    set((state) => {
      if (state.settlement) state.settlement.name = payload.newName;
    });
  }
  return get().settlement?.name === payload.newName
    ? { ok: true, status: 'applied', reason: null }
    : { ok: false, status: 'failed', reason: 'rename_not_applied' };
}

/**
 * Route a reviewed prose intent through the EXISTING registered writer.
 * applyUserEditAction owns the strict EDITABLE_FIELDS gate, the _userEdits /
 * _authored record, and the durable persist; this dispatcher only verifies the
 * write landed so the receipt never claims an apply the writer refused.
 */
function applyProse(get, intent) {
  const payload = intent.payload || {};
  const write = get().applyUserEditAction;
  if (typeof write !== 'function') {
    return { ok: false, status: 'failed', reason: 'writer_missing' };
  }
  write(payload.entityKind, payload.entityIndex, payload.path, payload.value);
  const entity = _resolveEntity(get().settlement, payload.entityKind, payload.entityIndex);
  return entity && getEffectiveValue(entity, payload.path) === payload.value
    ? { ok: true, status: 'applied', reason: null }
    : { ok: false, status: 'failed', reason: 'prose_not_applied' };
}

// ASYNC because applyRename is (the faction writer fetches its cascade module at
// the call seam). The `await` must stay INSIDE the try: a bare `return
// applyRename(...)` would settle the promise outside this frame and route a
// writer exception past the 'writer_exception' receipt into an unhandled
// rejection.
async function applyOne(get, set, intent) {
  try {
    if (intent.kind === 'rename-npc'
      || intent.kind === 'rename-faction'
      || intent.kind === 'rename-settlement') {
      return await applyRename(get, set, intent);
    }
    if (intent.kind === 'edit-prose') {
      return applyProse(get, intent);
    }
    const result = /** @type {any} */ (applyEditOp(get, set, intent));
    if (result?.ok) return result;
    return {
      ok: false,
      status: result?.status || 'failed',
      reason: result?.reason || 'writer_refused',
      receipt: result?.receipt || null,
    };
  } catch (error) {
    console.warn(`[commitPendingEdits] ${intent.kind} failed:`, error);
    return {
      ok: false,
      status: 'failed',
      reason: 'writer_exception',
      retryable: false,
    };
  }
}

function selectedIds(queue, selection, ownerKey = null) {
  const requested = Array.isArray(selection?.intentIds)
    ? new Set(selection.intentIds.map(String))
    : null;
  // Explicit IDs are capabilities only inside the current owner namespace. A
  // stale UI or direct caller cannot use an A identifier to mutate A while B is
  // open. Ownerless legacy items are never adopted implicitly here.
  return activeEdits(queue)
    .filter((intent) => intent.ownerRef?.id === ownerKey)
    .filter((intent) => !requested || requested.has(String(intent.id)))
    .map((intent) => String(intent.id));
}

/**
 * Capture the exact command identity for one public commit call. Successful
 * intents leave the queue, so their session receipt retains the original review
 * basis and lets a repeated explicit submit resolve to the same command id.
 * Refreshed failed work carries a new basis and therefore mints a new command.
 */
export function pendingEditCommandScope(state, selection = null) {
  const context = pendingEditContext(state);
  if (!context) return null;
  const requestedIds = Array.isArray(selection?.intentIds)
    ? [...new Set(selection.intentIds.map(String))].sort()
    : selectedIds(
        state.pendingEditsQueue || [],
        selection,
        context.ownerKey,
      ).sort();
  const queue = state.pendingEditsQueue || [];
  const receipts = state.pendingEditReceipts || [];
  const basis = requestedIds.map((intentId) => {
    const intent = queue.find((candidate) => (
      String(candidate?.id) === intentId
      && candidate?.ownerRef?.id === context.ownerKey
    ));
    if (intent) {
      return {
        intentId,
        status: String(intent.status || 'staged'),
        attempt: Number(intent.attempts || 0),
        baseRevision: intent.baseRevision ?? null,
        sourceFingerprint: intent.sourceFingerprint ?? null,
      };
    }
    const receipt = [...receipts].reverse().find((candidate) => (
      String(candidate?.intentId) === intentId
      && candidate?.ownerRef?.id === context.ownerKey
    ));
    if (receipt) {
      return {
        intentId,
        status: String(receipt.status || 'applied'),
        attempt: Number(receipt.attempt || 0),
        baseRevision: receipt.baseRevision ?? null,
        sourceFingerprint: receipt.sourceFingerprint ?? null,
      };
    }
    return {
      intentId,
      status: 'unresolved',
      attempt: 0,
      baseRevision: null,
      sourceFingerprint: null,
    };
  });
  return {
    ownerKey: context.ownerKey,
    saveId: context.saveId,
    revision: context.revision,
    sourceFingerprint: pendingEditSourceFingerprint(context),
    intentIds: requestedIds,
    basis,
  };
}

function targetKey(intent) {
  const type = intent?.targetRef?.type;
  const id = intent?.targetRef?.id;
  return type && id != null ? `${String(type)}:${String(id)}` : null;
}

function classifyCounts(intents) {
  let rename = 0;
  let prose = 0;
  for (const intent of intents) {
    if (intent.kind === 'rename-npc'
      || intent.kind === 'rename-faction'
      || intent.kind === 'rename-settlement') rename += 1;
    if (intent.kind === 'edit-prose') prose += 1;
  }
  return { structural: 0, rename, prose };
}

function trackCommit(intents, phase) {
  if (!intents.length) return;
  const counts = classifyCounts(intents);
  import('../lib/analytics.js').then(({ track, EVENTS }) => {
    track(EVENTS.EDIT_COMMITTED, {
      count: intents.length,
      structural_count: counts.structural,
      rename_count: counts.rename,
      prose_count: counts.prose,
      canon_phase: phase,
    });
  }).catch(() => {});
}

function captureResearchRows(preState, successfulIntents) {
  const settlementUuid = preState.activeSaveId;
  if (!settlementUuid || !successfulIntents.length) return;
  Promise.all([
    import('../lib/consent.js'),
    import('../lib/analyticsQueue.js'),
    import('../lib/editFingerprint.js'),
    import('../domain/pendingEditsPreview.js'),
  ]).then(([{ getConsent }, { enqueueEdit }, { extractEditRows }, { previewCascade }]) => {
    if (!getConsent().research) return;
    let cascade = null;
    try {
      cascade = previewCascade(preState.settlement, successfulIntents);
    } catch {
      // Research projection is optional and must never change commit semantics.
    }
    for (const row of extractEditRows(successfulIntents, {
      settlementUuid,
      cascade,
    })) enqueueEdit(row);
  }).catch(() => {});
}

/**
 * Commit an exact set of intent ids. Preflight is evaluated against one immutable
 * pre-batch state; writers then execute in queue order and report independently.
 *
 * ASYNC (2026-07-28): the faction-rename writer fetches its cascade module at the
 * call seam, so applyOne is awaited. Writers still run STRICTLY IN QUEUE ORDER —
 * the loop awaits each before starting the next — and the pre-batch snapshot is
 * still captured before the first writer. The only caller,
 * commitPendingEditsAction, passes this through the session-command runtime,
 * whose `commit` dependency is already typed `Promise<object>|object`.
 *
 * @returns {Promise<object>}
 */
export async function commitPendingEditScope(get, set, selection = null) {
  const preState = get();
  const queue = preState.pendingEditsQueue || [];
  const context = pendingEditContext(preState);
  const requestedIds = Array.isArray(selection?.intentIds)
    ? selection.intentIds.map(String)
    : [];
  const intentIds = selectedIds(queue, selection, context?.ownerKey);
  if (!intentIds.length) {
    // A repeated submit after the first synchronous commit correlates to the
    // already-issued same-owner receipt and does not execute a writer twice.
    // Cross-owner IDs correlate to nothing and cannot reveal another save.
    const receipts = requestedIds
      .map((id) => successfulReceiptFor(
        preState.pendingEditReceipts,
        id,
        context?.ownerKey,
      ))
      .filter(Boolean);
    return {
      ok: receipts.length > 0,
      status: receipts.length ? 'already-applied' : 'empty',
      applied: receipts.map((receipt) => receipt.intentId),
      failed: [],
      receipts,
    };
  }

  const selected = selectPendingEditIntents(queue, intentIds);
  const fingerprint = context ? pendingEditSourceFingerprint(context) : null;
  const ready = [];
  const failed = [];
  const receipts = [];

  // Preflight every selected item before the first mutation, so item two does not
  // become stale merely because item one changed their shared source.
  for (const intent of selected) {
    const attempt = Number(intent.attempts || 0) + 1;
    let result = null;
    if (!context || (
      intent.ownerRef?.id
      && intent.ownerRef.id !== context.ownerKey
    )) {
      result = { status: 'stale', reason: 'owner_changed' };
    } else if (!intent.sourceFingerprint || intent.sourceFingerprint !== fingerprint) {
      result = { status: 'stale', reason: 'source_changed' };
    } else {
      const normalized = normalizedAt(intent.kind, intent.payload, context);
      if (normalized.ok === false) {
        result = { status: 'failed', reason: normalized.reason };
      } else {
        const live = availability(intent.kind, normalized.payload, preState);
        if (!live.ok) result = { status: 'failed', reason: live.reason };
      }
    }

    if (result) {
      set((state) => {
        state.pendingEditsQueue = updatePendingEditIntent(
          state.pendingEditsQueue,
          intent.id,
          {
            status: result.status,
            failureReason: result.reason,
            attempts: attempt,
            availability: { status: 'unavailable', reason: result.reason },
          },
        );
      });
      const receipt = makePendingEditReceipt(intent, result, attempt);
      receipts.push(receipt);
      failed.push({ intentId: intent.id, status: result.status, reason: result.reason });
    } else {
      ready.push(intent);
    }
  }

  // Capture one reversible checkpoint before the first writer. A post-change
  // snapshot cannot undo the change it records. The token is correlated only to
  // successful item receipts; a missing/failed snapshot makes no undo claim.
  let undoToken = null;
  if (ready.length) {
    try {
      const snapshot = get().recordSnapshot;
      if (typeof snapshot === 'function') {
        const count = ready.length;
        const result = snapshot({
          kind: 'auto-commit',
          label: count === 1 ? 'Dossier change' : `${count} dossier changes`,
        });
        // Read the REFUSAL, not just the shape: recordSnapshot returns ok:false
        // (and a null `after`) when its target save is not in the cache, so nothing
        // was checkpointed. Either signal alone must block the mint — a token
        // naming a snapshot that was never recorded is a dead undo lever.
        const snapshotId = result?.ok === false ? null : result?.after?.snapshotId;
        if (snapshotId) {
          undoToken = {
            kind: 'snapshot',
            snapshotId,
            saveId: context?.saveId || null,
          };
        }
      }
    } catch {
      // The writer can still run, but its receipt truthfully carries no undo token.
    }
  }

  const applied = [];
  const retryableFailures = [];
  for (const intent of ready) {
    const attempt = Number(intent.attempts || 0) + 1;
    const result = await applyOne(get, set, intent);
    const receipt = makePendingEditReceipt(
      intent,
      result.ok && undoToken ? { ...result, undoToken } : result,
      attempt,
    );
    receipts.push(receipt);
    if (result.ok) {
      applied.push({ intent, receipt });
    } else {
      failed.push({ intentId: intent.id, status: result.status, reason: result.reason });
      retryableFailures.push({ intent, result, attempt });
    }
  }

  const appliedIds = applied.map(({ intent }) => intent.id);
  if (appliedIds.length) {
    set((state) => {
      state.pendingEditsQueue = removePendingEditIntents(state.pendingEditsQueue, appliedIds);
    });
  }

  // A known refusal made no mutation. Rebase it to the post-success source so the
  // retained item can be retried; an exception is ambiguous and stays unrebasable.
  const postContext = pendingEditContext(get());
  const postFingerprint = postContext ? pendingEditSourceFingerprint(postContext) : null;
  for (const { intent, result, attempt } of retryableFailures) {
    set((state) => {
      state.pendingEditsQueue = updatePendingEditIntent(
        state.pendingEditsQueue,
        intent.id,
        {
          status: 'failed',
          failureReason: result.reason,
          attempts: attempt,
          availability: { status: 'unavailable', reason: result.reason },
          ...(result.retryable === false || !postContext ? {} : {
            baseRevision: postContext.revision,
            sourceFingerprint: postFingerprint,
            preconditions: [{
              targetRef: intent.targetRef,
              baseRevision: postContext.revision,
              sourceFingerprint: postFingerprint,
            }],
          }),
        },
      );
    });
  }

  // Exact-scope commits leave other reviewed work in the queue. A successful
  // write changes the conservative whole-settlement fingerprint, so carry
  // forward only untouched work whose prior review matched this batch's source
  // and whose target is disjoint from every target just applied. Same-target
  // work still requires an explicit Review again.
  const appliedTargetKeys = applied.map(({ intent }) => targetKey(intent));
  const selectedSet = new Set(intentIds.map(String));
  const canRebaseDisjoint = applied.length > 0
    && postContext
    && postFingerprint
    && appliedTargetKeys.every(Boolean);
  if (canRebaseDisjoint) {
    const appliedTargets = new Set(appliedTargetKeys);
    const rebaseIntents = activeEdits(get().pendingEditsQueue || [])
      .filter((intent) => (
        !selectedSet.has(String(intent.id))
        && intent.ownerRef?.id === postContext.ownerKey
        && intent.sourceFingerprint === fingerprint
        && targetKey(intent)
        && !appliedTargets.has(targetKey(intent))
      ));
    if (rebaseIntents.length) {
      set((state) => {
        for (const intent of rebaseIntents) {
          state.pendingEditsQueue = updatePendingEditIntent(
            state.pendingEditsQueue,
            intent.id,
            {
              baseRevision: postContext.revision,
              sourceFingerprint: postFingerprint,
              preconditions: [{
                targetRef: intent.targetRef,
                baseRevision: postContext.revision,
                sourceFingerprint: postFingerprint,
              }],
            },
          );
        }
      });
    }
  }

  appendReceipts(set, receipts);

  const successfulIntents = applied.map(({ intent }) => intent);
  if (successfulIntents.length) {
    trackCommit(successfulIntents, get().phase);
    captureResearchRows(preState, successfulIntents);
  }

  return {
    ok: failed.length === 0 && applied.length > 0,
    status: failed.length ? (applied.length ? 'partial' : 'failed') : 'applied',
    applied: applied.map(({ intent }) => intent.id),
    failed,
    receipts,
    undoToken: applied.length ? undoToken : null,
  };
}

/**
 * Re-review failed or stale work against the current owner and world. This never
 * writes domain state: it only replaces the review basis after payload, target,
 * and live capability all pass again.
 */
export function refreshPendingEditScope(get, set, selection = null) {
  const state = get();
  const context = pendingEditContext(state);
  const queue = state.pendingEditsQueue || [];
  const intentIds = selectedIds(queue, selection, context?.ownerKey);
  const selected = selectPendingEditIntents(queue, intentIds);
  if (!context || !selected.length) {
    return { ok: false, status: 'empty', refreshed: [], failed: [] };
  }

  const fingerprint = pendingEditSourceFingerprint(context);
  const refreshed = [];
  const failed = [];
  for (const intent of selected) {
    let normalized = null;
    let reason = null;
    if (intent.ownerRef?.id && intent.ownerRef.id !== context.ownerKey) {
      reason = 'owner_changed';
    } else {
      normalized = normalizedAt(intent.kind, intent.payload, context);
      if (normalized.ok === false) reason = normalized.reason;
      else {
        const live = availability(intent.kind, normalized.payload, state);
        if (!live.ok) reason = live.reason;
      }
    }

    if (reason || !normalized || normalized.ok === false) {
      set((draft) => {
        draft.pendingEditsQueue = updatePendingEditIntent(
          draft.pendingEditsQueue,
          intent.id,
          {
            status: 'failed',
            failureReason: reason || 'review_refused',
            availability: {
              status: 'unavailable',
              reason: reason || 'review_refused',
            },
          },
        );
      });
      failed.push({ intentId: intent.id, reason: reason || 'review_refused' });
      continue;
    }

    set((draft) => {
      draft.pendingEditsQueue = updatePendingEditIntent(
        draft.pendingEditsQueue,
        intent.id,
        {
          payload: normalized.payload,
          targetRef: normalized.targetRef,
          ownerRef: {
            scope: context.saveId ? 'save' : 'draft',
            id: context.ownerKey,
            saveId: context.saveId,
          },
          baseRevision: context.revision,
          sourceFingerprint: fingerprint,
          preconditions: [{
            targetRef: normalized.targetRef,
            baseRevision: context.revision,
            sourceFingerprint: fingerprint,
          }],
          status: 'staged',
          failureReason: null,
          availability: { status: 'available', reason: null },
        },
      );
    });
    refreshed.push(intent.id);
  }

  return {
    ok: failed.length === 0 && refreshed.length > 0,
    status: failed.length ? (refreshed.length ? 'partial' : 'failed') : 'refreshed',
    refreshed,
    failed,
  };
}

/** Discard exactly the named pending intents; unrelated queue work survives. */
export function discardPendingEditScope(get, set, selection = null) {
  const queue = get().pendingEditsQueue || [];
  const ownerKey = pendingEditContext(get())?.ownerKey;
  const intentIds = selectedIds(queue, selection, ownerKey);
  const selected = selectPendingEditIntents(queue, intentIds);
  if (!selected.length) return { ok: false, discarded: [] };
  set((state) => {
    state.pendingEditsQueue = removePendingEditIntents(state.pendingEditsQueue, intentIds);
  });
  import('../lib/analytics.js').then(({ track, EVENTS }) => {
    track(EVENTS.EDIT_REVERTED, { count: selected.length, scope: 'selected' });
  }).catch(() => {});
  return { ok: true, discarded: selected.map((intent) => intent.id) };
}

/** Reader helper for surfaces that want to distinguish authoring from world work. */
export function isWorldPendingEdit(intent) {
  return WORLD_NPC_KINDS.has(intent?.kind);
}
