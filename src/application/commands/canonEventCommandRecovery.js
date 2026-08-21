/**
 * Explicit recovery for one ambiguous server-authoritative canon event.
 *
 * The durable journal remains the only outcome authority:
 *   - finalized/applied => replay the identical RPC to obtain its projection;
 *   - no row => retry the identical idempotent command after proof that this
 *     identity has no committed effect;
 *   - claimed/reconcile => wait; never guess and never reapply;
 *   - finalized/stale|failed => report the terminal no-commit receipt and
 *     require a fresh review rather than rebinding this command identity.
 *
 * This is deliberately a same-review, in-session action. The command envelope
 * is held only in the Surveyor result state; it is not a new durable queue or a
 * second event store.
 */

import { CANON_EVENT_APPLY } from './adapters/canonEventApply.js';
import {
  commandJournalKey,
  validateCommandEnvelope,
} from './commandEnvelope.js';
import { checkCommandIdentity } from './commandContext.js';
import {
  executeSessionCommand,
  forgetSessionCommandReceipt,
} from './sessionCommandRuntime.js';
import { isAuthoritativeCanonEventType } from '../../domain/events/authoritativeCanonEventTypes.js';
import { readCanonEventCommandAuthority } from '../../lib/canonEventCommandPersistence.js';

let defaultRecoveries = new Map();
const scopedRecoveries = new WeakMap();

function recoveryBucket(scope) {
  if (!scope) return defaultRecoveries;
  let bucket = scopedRecoveries.get(scope);
  if (!bucket) {
    bucket = new Map();
    scopedRecoveries.set(scope, bucket);
  }
  return bucket;
}

function outcome(status, reason, fields = {}) {
  return Object.freeze({
    status,
    ok: status === 'applied' || status === 'queued',
    reason: reason || null,
    needsReconciliation: status === 'reconcile-required',
    recovered: false,
    authorityState: 'unknown',
    authorityReceipt: null,
    replayAttempted: false,
    retryAttempted: false,
    receipt: null,
    ...fields,
  });
}

function observedContext(dependencies) {
  const baseline = dependencies.context || {};
  if (typeof dependencies.readCurrentContext !== 'function') {
    return { ok: true, value: baseline };
  }
  try {
    const observed = dependencies.readCurrentContext();
    if (!observed || typeof observed !== 'object') {
      return { ok: false, reason: 'command_context_unavailable' };
    }
    return {
      ok: true,
      value: {
        ...baseline,
        ...observed,
        // Capabilities and the opaque journal scope are captured dependencies,
        // not values an observational callback may replace.
        actions: baseline.actions,
        journalScope: baseline.journalScope,
      },
    };
  } catch {
    return { ok: false, reason: 'command_context_unavailable' };
  }
}

function currentIdentity(command, dependencies) {
  const context = observedContext(dependencies);
  if (!context.ok) return context;
  const identity = checkCommandIdentity(command, context.value);
  return identity.ok
    ? context
    : { ok: false, reason: identity.reason || 'command_context_changed' };
}

function authorityIdentityMatches(row, command) {
  return (
    row.ownerId === command.ownerRef?.accountId
    && row.commandId === command.commandId
    && row.kind === command.kind
    && row.targetId === command.targets?.saveId
  );
}

function authoritySummary(row) {
  if (!row) return null;
  return Object.freeze({
    phase: row.phase,
    status: row.status,
    failureCode: row.failureCode,
    finalizedAt: row.finalizedAt,
    updatedAt: row.updatedAt,
  });
}

function commandEventType(command) {
  const event = command?.params?.event;
  return (
    event
    && typeof event === 'object'
    && !Array.isArray(event)
    && 'type' in event
  ) ? event.type : null;
}

async function executeRecovery(command, dependencies) {
  const firstContext = currentIdentity(command, dependencies);
  if (!firstContext.ok) {
    return outcome('stale', firstContext.reason, {
      authorityState: 'not-read',
    });
  }

  let authority;
  try {
    authority = await dependencies.readAuthority({
      ownerId: command.ownerRef.accountId,
      commandId: command.commandId,
    });
  } catch {
    return outcome('reconcile-required', 'durable_authority_unavailable', {
      authorityState: 'unavailable',
    });
  }

  // Auth, target, or active-save rotation while the owner-scoped read was in
  // flight invalidates the result for this UI session. The database RLS still
  // protected the read; this second check prevents projecting it elsewhere.
  const current = currentIdentity(command, dependencies);
  if (!current.ok) {
    return outcome('stale', current.reason, {
      authorityState: 'discarded-after-context-change',
    });
  }

  if (authority && !authorityIdentityMatches(authority, command)) {
    return outcome('reconcile-required', 'durable_authority_identity_mismatch', {
      authorityState: 'conflict',
      authority: authoritySummary(authority),
      authorityReceipt: authority.receipt || null,
    });
  }

  if (authority) {
    const finalized = authority.phase === 'finalized';
    if (
      finalized
      && (authority.status === 'stale' || authority.status === 'failed')
    ) {
      return outcome(
        authority.status,
        authority.failureCode || authority.status,
        {
          authorityState: 'terminal-no-commit',
          authority: authoritySummary(authority),
          authorityReceipt: authority.receipt || null,
        },
      );
    }
    if (!finalized || authority.status !== 'applied') {
      return outcome(
        'reconcile-required',
        authority.failureCode || 'durable_outcome_unresolved',
        {
          authorityState: 'unresolved',
          authority: authoritySummary(authority),
          authorityReceipt: authority.receipt || null,
        },
      );
    }
  }

  const replayAttempted = authority?.status === 'applied';
  const retryAttempted = authority == null;
  try {
    dependencies.forgetReceipt(command, current.value.journalScope);
    const receipt = await dependencies.executeCommand(command, current.value);
    return outcome(receipt.status, receipt.reason, {
      recovered: receipt.status === 'applied' || receipt.status === 'queued',
      authorityState: replayAttempted
        ? 'applied'
        : 'proved-absent',
      authority: authoritySummary(authority),
      authorityReceipt: authority?.receipt || null,
      replayAttempted,
      retryAttempted,
      receipt,
    });
  } catch {
    return outcome('reconcile-required', 'durable_recovery_attempt_failed', {
      authorityState: replayAttempted ? 'applied' : 'proved-absent',
      authority: authoritySummary(authority),
      authorityReceipt: authority?.receipt || null,
      replayAttempted,
      retryAttempted,
    });
  }
}

/**
 * Reconcile one exact command. Concurrent clicks share one recovery promise;
 * neither can clear the other's in-flight session-journal claim.
 *
 * @param {unknown} rawCommand
 * @param {{
 *   context:object,
 *   readCurrentContext?:()=>object,
 *   readAuthority?:(request:object)=>Promise<object|null>,
 *   executeCommand?:(command:object, context:object)=>Promise<object>,
 *   forgetReceipt?:(command:object, scope?:object|Function|null)=>void,
 * }} dependencies
 */
export function recoverCanonEventCommand(rawCommand, dependencies = {}) {
  const checked = validateCommandEnvelope(rawCommand);
  if (
    checked.ok === false
    || checked.command.kind !== CANON_EVENT_APPLY
    || !checked.command.ownerRef?.accountId
    || !checked.command.targets?.saveId
    // Preparation falls back to a wall clock when requestedAt is absent.
    // Such an attempt cannot be reproduced byte-for-byte after its answer is
    // lost, so it is ineligible for automatic recovery.
    || !checked.command.requestedAt
    || !isAuthoritativeCanonEventType(
      commandEventType(checked.command),
    )
  ) {
    return Promise.resolve(outcome('failed', 'invalid_canon_recovery_command', {
      authorityState: 'not-read',
    }));
  }
  const command = checked.command;
  const scope = dependencies.context?.journalScope || null;
  const bucket = recoveryBucket(scope);
  const key = commandJournalKey(command);
  const existing = bucket.get(key);
  if (existing) return existing;

  const run = executeRecovery(command, {
    ...dependencies,
    readAuthority:
      dependencies.readAuthority || readCanonEventCommandAuthority,
    executeCommand: dependencies.executeCommand || executeSessionCommand,
    forgetReceipt:
      dependencies.forgetReceipt || forgetSessionCommandReceipt,
  }).finally(() => {
    if (bucket.get(key) === run) bucket.delete(key);
  });
  bucket.set(key, run);
  return run;
}

/** Test/logout hook for the app-session recovery coordinator. */
export function clearCanonEventRecoveriesForTests() {
  defaultRecoveries = new Map();
}
