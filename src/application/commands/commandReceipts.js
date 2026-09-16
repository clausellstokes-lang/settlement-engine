/**
 * commandReceipts.js — one honest lifecycle for application-command attempts.
 *
 * Receipts describe what the application boundary knows. `applied` means the
 * established writer accepted the domain mutation; persistence is reported
 * separately because several legacy writers still enqueue or attempt cloud
 * delivery after the local commit.
 */

export const COMMAND_STATUS = Object.freeze({
  RECEIVED: 'received',
  VALIDATING: 'validating',
  VALIDATED: 'validated',
  APPLYING: 'applying',
  PERSISTING: 'persisting',
  APPLIED: 'applied',
  QUEUED: 'queued',
  PARTIAL: 'partial',
  FAILED: 'failed',
  STALE: 'stale',
  RECONCILE_REQUIRED: 'reconcile-required',
});

const TERMINAL = new Set([
  COMMAND_STATUS.APPLIED,
  COMMAND_STATUS.QUEUED,
  COMMAND_STATUS.PARTIAL,
  COMMAND_STATUS.FAILED,
  COMMAND_STATUS.STALE,
  COMMAND_STATUS.RECONCILE_REQUIRED,
]);

export const PERSISTENCE_STATE = Object.freeze({
  NOT_REQUIRED: 'not-required',
  UNCONFIRMED: 'unconfirmed',
  QUEUED: 'queued',
  CONFIRMED: 'confirmed',
  FAILED: 'failed',
});

export function isTerminalCommandStatus(status) {
  return TERMINAL.has(status);
}

function transition(status, at, reason = null) {
  return Object.freeze({ status, at: at || null, reason: reason || null });
}

/** Start the lifecycle for one validated envelope. */
export function beginCommandReceipt(command, at = null) {
  return Object.freeze({
    commandId: command.commandId,
    kind: command.kind,
    provenance: command.provenance,
    targets: command.targets,
    status: COMMAND_STATUS.RECEIVED,
    ok: false,
    reason: null,
    needsReconciliation: false,
    replayed: false,
    attempt: 1,
    transitions: Object.freeze([transition(COMMAND_STATUS.RECEIVED, at)]),
    persistence: Object.freeze({ state: PERSISTENCE_STATE.NOT_REQUIRED }),
    domainReceipt: null,
    undoToken: null,
    result: null,
  });
}

/** Append one lifecycle observation without mutating an earlier receipt. */
export function advanceCommandReceipt(receipt, status, fields = {}) {
  const at = fields.at ?? null;
  const reason = fields.reason ?? null;
  const next = {
    ...receipt,
    ...fields,
    status,
    ok: status === COMMAND_STATUS.APPLIED || status === COMMAND_STATUS.QUEUED,
    reason,
    needsReconciliation: status === COMMAND_STATUS.RECONCILE_REQUIRED
      || fields.needsReconciliation === true,
    replayed: false,
    transitions: Object.freeze([
      ...(receipt.transitions || []),
      transition(status, at, reason),
    ]),
  };
  if (fields.persistence) next.persistence = Object.freeze({ ...fields.persistence });
  delete next.at;
  return Object.freeze(next);
}

/** Return a replay view without altering the authoritative stored receipt. */
export function replayCommandReceipt(receipt) {
  return Object.freeze({
    ...receipt,
    replayed: true,
    attempt: receipt.attempt || 1,
  });
}

