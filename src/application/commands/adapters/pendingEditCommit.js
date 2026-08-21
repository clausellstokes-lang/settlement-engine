/**
 * pendingEditCommit.js — command facade over the G-1 transaction coordinator.
 *
 * G-1 already owns payload admission, stable targets, freshness preflight,
 * per-item saga behavior, retained failures, and snapshot undo. This adapter does
 * not duplicate those rules. It makes one exact reviewed selection addressable
 * and replay-safe at the application boundary while preserving the public
 * commitPendingEdits result shape.
 */

import {
  commandIdForValue,
  makeCommandEnvelope,
} from '../commandEnvelope.js';
import {
  COMMAND_STATUS,
  PERSISTENCE_STATE,
} from '../commandReceipts.js';

export const PENDING_EDIT_COMMIT = 'settlement.pending-edits.commit';

function intentIdsFrom(command) {
  return Array.isArray(command.params?.selection?.intentIds)
    ? command.params.selection.intentIds
    : [];
}

export const pendingEditCommitSpec = Object.freeze({
  kind: PENDING_EDIT_COMMIT,
  description: 'Commit one exact owner-scoped set of reviewed settlement edits.',
  targetScope: 'save',
  delivery: 'save-outbox',
  atomicity: 'saga',
  surveyor: false,

  validate(command) {
    if (!command.ownerRef?.ownerKey) return { ok: false, reason: 'owner_scope_required' };
    if (!intentIdsFrom(command).length) return { ok: false, reason: 'intent_ids_required' };
    return { ok: true };
  },

  preflight(_command, context) {
    return typeof context.actions?.commitPendingEditScope === 'function'
      ? { ok: true }
      : { ok: false, reason: 'no_verb' };
  },

  async apply(command, context) {
    const result = await context.actions.commitPendingEditScope(
      command.params.selection,
    );
    const persistence = { state: PERSISTENCE_STATE.UNCONFIRMED };
    if (result?.status === 'partial') {
      return {
        ok: false,
        status: COMMAND_STATUS.PARTIAL,
        reason: 'partial',
        result,
        domainReceipt: result.receipts || null,
        undoToken: result.undoToken || null,
        persistence,
      };
    }
    if (result?.status === 'owner-changed') {
      return {
        ok: false,
        status: COMMAND_STATUS.STALE,
        reason: 'owner_changed',
        result,
      };
    }
    if (result?.ok === false || !result) {
      return {
        ok: false,
        status: COMMAND_STATUS.FAILED,
        reason: result?.failed?.[0]?.reason || result?.status || 'writer_refused',
        result,
      };
    }
    const queued = result.receipts?.some((receipt) => receipt?.status === 'queued');
    return {
      ok: true,
      status: queued ? COMMAND_STATUS.QUEUED : COMMAND_STATUS.APPLIED,
      result,
      domainReceipt: result.receipts || null,
      undoToken: result.undoToken || null,
      persistence,
    };
  },
});

/**
 * `scope.basis` carries the staged intent/receipt fingerprints used only for
 * deterministic command identity. The coordinator still performs authoritative
 * commit-time freshness checks; the generic executor does not reinterpret them.
 */
export function pendingEditCommitCommand(scope, { now = null } = {}) {
  const identity = {
    ownerKey: scope.ownerKey,
    saveId: scope.saveId,
    intentIds: scope.intentIds,
    basis: scope.basis,
  };
  return makeCommandEnvelope({
    schemaVersion: 1,
    commandId: commandIdForValue('pending-edit-commit', identity),
    kind: PENDING_EDIT_COMMIT,
    provenance: 'manual',
    ownerRef: { ownerKey: scope.ownerKey },
    targets: scope.saveId
      ? { saveId: scope.saveId }
      : { draftId: scope.ownerKey.replace(/^draft:/, '') || scope.ownerKey },
    params: {
      selection: { intentIds: scope.intentIds },
      basis: scope.basis,
    },
    correlation: { batchId: commandIdForValue('pending-edit-batch', identity) },
    requestedAt: now,
  });
}

/**
 * Convert a command receipt back to the established store result. The attached
 * commandReceipt is non-enumerable, so existing deep-equality consumers retain
 * their contract while advanced callers may inspect the richer lifecycle.
 */
export function pendingEditFacadeResult(receipt) {
  let result = receipt?.result && typeof receipt.result === 'object'
    ? { ...receipt.result }
    : {
        ok: false,
        status: receipt?.status === COMMAND_STATUS.STALE ? 'owner-changed' : 'failed',
        applied: [],
        failed: [],
        receipts: [],
      };
  if (
    receipt?.replayed
    && (result.status === 'applied' || result.status === 'queued')
  ) {
    result = { ...result, status: 'already-applied' };
  }
  Object.defineProperty(result, 'commandReceipt', {
    value: receipt,
    enumerable: false,
    configurable: false,
  });
  return result;
}

