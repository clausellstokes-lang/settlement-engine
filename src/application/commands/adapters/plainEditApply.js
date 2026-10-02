/**
 * plainEditApply.js — THE ONE GENERIC ADAPTER for a plain edit on a draft (EM-C4a).
 *
 * Design §2.3: ops apply only through the existing store writers via the lazy
 * application-command boundary, and THERE IS NO SECOND PATH. This adapter is
 * that boundary's half: it names one capability, refuses the malformed shapes
 * before any writer is reached, and hands the request to the injected store verb.
 *
 * ⛔ IT IMPORTS NOTHING FROM `src/store/**` AND NOTHING FROM `src/domain/edit/**`.
 * It is pure envelope-and-policy; the writer arrives as `context.actions`, which is
 * commandContext.js's whole purpose ("Keeping the two separate prevents callbacks or
 * store references from leaking into queues, logs, or server payloads"). That is also
 * why the dispatch runtime is a SECOND file: standardCommandRegistry statically
 * imports every spec, so folding the runtime in here would close an import cycle.
 *
 * ⛔ THE SURVEYOR CEILING IS DECLARED, NOT ARGUED: `surveyor: false` means a
 * Surveyor-originated command is refused at dispatch with
 * `surveyor_capability_refused` BEFORE validation, journaling or any writer
 * (executeCommand.js's assert). An AI lane may not edit a settlement record.
 *
 * ⛔ IT CLAIMS NO PERSISTENCE. `delivery: 'local'` and a `NOT_REQUIRED` persistence
 * state are the honest report: EM-B3 owns the layer's persistence, and a receipt that
 * claimed more than the boundary knows is the lie commandReceipts.js exists to prevent.
 */

import {
  commandIdForValue,
  makeCommandEnvelope,
} from '../commandEnvelope.js';
import {
  COMMAND_STATUS,
  PERSISTENCE_STATE,
} from '../commandReceipts.js';

/** The ONE command kind this packet registers. */
export const PLAIN_EDIT_APPLY = 'settlement.plain-edit.apply';

export const plainEditApplySpec = Object.freeze({
  kind: PLAIN_EDIT_APPLY,
  description: 'Apply one plain edit to a draft settlement.',
  // The edit names ONE save, carries ONE op against ONE root key, and the store
  // writer applies it locally; EM-B3 is what will later carry it to a server.
  targetScope: 'save',
  delivery: 'local',
  atomicity: 'single-target',
  surveyor: false,

  validate(command) {
    if (!command.ownerRef?.ownerKey) return { ok: false, reason: 'owner_scope_required' };
    if (!command.targets?.saveId) return { ok: false, reason: 'save_required' };
    if (!command.params?.op) return { ok: false, reason: 'op_required' };
    return { ok: true };
  },

  preflight(_command, context) {
    return typeof context.actions?.applyPlainEditToDraft === 'function'
      ? { ok: true }
      : { ok: false, reason: 'no_verb' };
  },

  async apply(command, context) {
    const result = await context.actions.applyPlainEditToDraft(command.params);
    if (result?.ok === true) {
      return {
        ok: true,
        status: COMMAND_STATUS.APPLIED,
        result,
        persistence: { state: PERSISTENCE_STATE.NOT_REQUIRED },
      };
    }
    // The writer's refusal reason travels VERBATIM: it is a member of the store
    // module's own closed set, and re-wording it here would mint an eighth reason
    // that no test of that set could ever see.
    return {
      ok: false,
      status: COMMAND_STATUS.FAILED,
      reason: result?.reason || 'writer_refused',
      result: result ?? null,
    };
  },
});

/**
 * Build the envelope. The identity is the (owner, save, root key, op type, value)
 * tuple, canonicalized by commandIdForValue — so a double-submit of the SAME edit is
 * ONE journal entry and replays, while a different value is a different command.
 *
 * @param {{ownerKey:string, saveId:string, rootKey:string, op:object, value:unknown}} scope
 *   exact, owner-scoped, captured BEFORE the lazy import
 * @param {{now?: string|null}} [options]
 */
export function plainEditCommand(scope, { now = null } = {}) {
  const identity = {
    ownerKey: scope.ownerKey,
    saveId: scope.saveId,
    rootKey: scope.rootKey,
    opType: scope.op?.type ?? null,
    value: scope.value ?? null,
  };
  return makeCommandEnvelope({
    schemaVersion: 1,
    commandId: commandIdForValue('plain-edit-apply', identity),
    kind: PLAIN_EDIT_APPLY,
    provenance: 'manual',
    ownerRef: { ownerKey: scope.ownerKey },
    targets: { saveId: scope.saveId },
    params: {
      saveId: scope.saveId,
      rootKey: scope.rootKey,
      op: scope.op,
      value: scope.value,
    },
    correlation: { batchId: commandIdForValue('plain-edit-batch', identity) },
    requestedAt: now,
  });
}

/**
 * Convert a command receipt back to the store's result shape, with the receipt
 * attached NON-ENUMERABLY (pendingEditFacadeResult's exact idiom), so deep-equality
 * consumers keep their contract while a caller that wants the lifecycle can read it.
 */
export function plainEditFacadeResult(receipt) {
  const result = receipt?.result && typeof receipt.result === 'object'
    ? { ...receipt.result }
    : { ok: false, reason: receipt?.reason || 'command_refused' };
  Object.defineProperty(result, 'commandReceipt', {
    value: receipt,
    enumerable: false,
    configurable: false,
  });
  return result;
}
