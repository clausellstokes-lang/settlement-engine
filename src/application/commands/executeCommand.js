/**
 * executeCommand.js — the application-command lifecycle and session replay gate.
 *
 * The executor is generic only about coordination. Domain validation and mutation
 * remain in CommandSpec adapters. The in-memory journal is deliberately described
 * as session authority: it prevents duplicate execution within the live
 * store/tab, including concurrent double-submit, but makes no cross-reload or
 * cross-device claim. Command-specific adapters may additionally claim durable
 * server identity and report that stronger authority in their receipts.
 */

import {
  commandFingerprint,
  commandJournalKey,
  validateCommandEnvelope,
} from './commandEnvelope.js';
import {
  checkCommandFreshness,
  checkCommandIdentity,
  makeCommandContext,
} from './commandContext.js';
import {
  advanceCommandReceipt,
  beginCommandReceipt,
  COMMAND_STATUS,
  isTerminalCommandStatus,
  PERSISTENCE_STATE,
  replayCommandReceipt,
} from './commandReceipts.js';

/**
 * One journal may serve the app-wide Surveyor runtime and many isolated store
 * instances. Object/function scopes receive WeakMap-backed buckets; a null scope
 * uses the app-session bucket.
 */
export function createMemoryCommandJournal() {
  let defaultBucket = new Map();
  let scopedBuckets = new WeakMap();

  function bucket(scope) {
    if (!scope) return defaultBucket;
    let scoped = scopedBuckets.get(scope);
    if (!scoped) {
      scoped = new Map();
      scopedBuckets.set(scope, scoped);
    }
    return scoped;
  }

  return Object.freeze({
    get(key, scope = null) {
      return bucket(scope).get(key) || null;
    },
    claim(key, record, scope = null) {
      const records = bucket(scope);
      if (records.has(key)) return false;
      records.set(key, record);
      return true;
    },
    complete(key, record, scope = null) {
      bucket(scope).set(key, record);
    },
    release(key, scope = null) {
      bucket(scope).delete(key);
    },
    entries(scope = null) {
      return [...bucket(scope).values()];
    },
    clear(scope) {
      if (scope) {
        scopedBuckets.delete(scope);
      } else {
        defaultBucket = new Map();
        scopedBuckets = new WeakMap();
      }
    },
  });
}

function terminalReceipt(command, status, reason, at, fields = {}) {
  const started = beginCommandReceipt(command, at);
  return advanceCommandReceipt(started, status, {
    at,
    reason,
    ...fields,
  });
}

function invalidReceipt(raw, reason, message) {
  return Object.freeze({
    commandId: typeof raw?.commandId === 'string' ? raw.commandId : null,
    kind: typeof raw?.kind === 'string' ? raw.kind : null,
    provenance: typeof raw?.provenance === 'string' ? raw.provenance : null,
    targets: raw?.targets && typeof raw.targets === 'object' ? raw.targets : {},
    status: COMMAND_STATUS.FAILED,
    ok: false,
    reason,
    message,
    needsReconciliation: false,
    replayed: false,
    attempt: 1,
    transitions: Object.freeze([]),
    persistence: Object.freeze({ state: PERSISTENCE_STATE.NOT_REQUIRED }),
    domainReceipt: null,
    undoToken: null,
    result: null,
  });
}

function adapterStatus(outcome) {
  if (isTerminalCommandStatus(outcome?.status)) return outcome.status;
  return outcome?.ok === false ? COMMAND_STATUS.FAILED : COMMAND_STATUS.APPLIED;
}

function emit(observer, receipt) {
  try {
    observer?.(receipt);
  } catch {
    // Observability must never change command semantics.
  }
}

/**
 * @param {{
 *   registry?: ReturnType<import('./commandRegistry.js').createCommandRegistry>,
 *   journal?: ReturnType<typeof createMemoryCommandJournal>,
 *   clock?: () => string|null,
 *   onTransition?: (receipt:object) => void,
 * }} options
 */
export function createCommandExecutor({
  registry,
  journal = createMemoryCommandJournal(),
  clock = () => null,
  onTransition = null,
} = {}) {
  if (!registry || typeof registry.get !== 'function') {
    throw new TypeError('createCommandExecutor requires a command registry');
  }

  async function execute(rawCommand, rawContext = {}) {
    const checked = validateCommandEnvelope(rawCommand);
    if (checked.ok === false) {
      return invalidReceipt(rawCommand, checked.reason, checked.message);
    }
    const command = checked.command;
    const context = makeCommandContext(rawContext);
    const at = () => context.now || clock?.() || null;

    const identity = checkCommandIdentity(command, context);
    if (!identity.ok) {
      return terminalReceipt(command, COMMAND_STATUS.STALE, identity.reason, at());
    }

    const journalKey = commandJournalKey(command);
    const fingerprint = commandFingerprint(command);
    const existing = journal.get(journalKey, context.journalScope);
    if (existing) {
      if (existing.fingerprint !== fingerprint) {
        return terminalReceipt(
          command,
          COMMAND_STATUS.FAILED,
          'command_id_conflict',
          at(),
        );
      }
      const receipt = existing.promise
        ? await existing.promise
        : existing.receipt;
      return replayCommandReceipt(receipt);
    }

    const freshness = checkCommandFreshness(command, context);
    if (!freshness.ok) {
      return terminalReceipt(command, COMMAND_STATUS.STALE, freshness.reason, at());
    }

    const spec = registry.get(command.kind);
    if (!spec) {
      return terminalReceipt(command, COMMAND_STATUS.FAILED, 'unknown_command', at());
    }

    // The Surveyor ceiling, enforced at dispatch. Construction already shapes
    // what the AI lanes can mint (the interpret dispatcher's two op families,
    // the Content studio's one hard-coded kind), but only this assert makes the
    // registered `surveyor` capability flag binding at runtime: a
    // Surveyor-originated command whose spec is not Surveyor-public is refused
    // before validation, journaling, or any writer. Manual and system
    // provenance are untouched.
    if (command.provenance === 'surveyor' && spec.surveyor !== true) {
      return terminalReceipt(
        command,
        COMMAND_STATUS.FAILED,
        'surveyor_capability_refused',
        at(),
        {
          // One vetoable user-facing sentence; no internal flag or kind names.
          message: 'The Surveyor is not allowed to make this kind of change, so nothing was changed.',
        },
      );
    }

    // Promise.resolve().then(...) yields once before the body starts. The journal
    // claim therefore lands first, so a concurrent duplicate observes the same
    // in-flight promise and cannot reach the writer twice.
    const run = Promise.resolve().then(async () => {
      let receipt = beginCommandReceipt(command, at());
      receipt = advanceCommandReceipt(receipt, COMMAND_STATUS.VALIDATING, { at: at() });
      emit(onTransition, receipt);

      if (spec.validate) {
        let validation;
        try {
          validation = await spec.validate(command, context);
        } catch (error) {
          return advanceCommandReceipt(receipt, COMMAND_STATUS.FAILED, {
            at: at(),
            reason: error instanceof Error ? error.message : 'command_validation_failed',
          });
        }
        if (validation?.ok === false) {
          return advanceCommandReceipt(
            receipt,
            validation.status === COMMAND_STATUS.STALE
              ? COMMAND_STATUS.STALE
              : COMMAND_STATUS.FAILED,
            {
              at: at(),
              reason: validation.reason || 'command_validation_failed',
            },
          );
        }
      }

      if (spec.preflight) {
        let preflight;
        try {
          preflight = await spec.preflight(command, context);
        } catch (error) {
          return advanceCommandReceipt(receipt, COMMAND_STATUS.FAILED, {
            at: at(),
            reason: error instanceof Error ? error.message : 'preflight_failed',
          });
        }
        if (preflight?.ok === false) {
          return advanceCommandReceipt(
            receipt,
            preflight.status === COMMAND_STATUS.STALE
              ? COMMAND_STATUS.STALE
              : COMMAND_STATUS.FAILED,
            {
              at: at(),
              reason: preflight.reason || 'preflight_refused',
              result: preflight.result || null,
            },
          );
        }
      }

      receipt = advanceCommandReceipt(receipt, COMMAND_STATUS.VALIDATED, { at: at() });
      emit(onTransition, receipt);
      receipt = advanceCommandReceipt(receipt, COMMAND_STATUS.APPLYING, { at: at() });
      emit(onTransition, receipt);

      let outcome;
      try {
        outcome = await spec.apply(command, context);
      } catch (error) {
        // A throw may occur after a legacy writer mutated local state or started a
        // network request. Retrying blindly would risk a duplicate, so the honest
        // terminal state is reconcile-required, not an ordinary refusal.
        return advanceCommandReceipt(receipt, COMMAND_STATUS.RECONCILE_REQUIRED, {
          at: at(),
          reason: error instanceof Error ? error.message : 'writer_threw',
          persistence: { state: PERSISTENCE_STATE.UNCONFIRMED },
        });
      }

      const status = adapterStatus(outcome);
      return advanceCommandReceipt(receipt, status, {
        at: at(),
        reason: outcome?.reason || null,
        result: outcome?.result ?? outcome ?? null,
        domainReceipt: outcome?.domainReceipt ?? null,
        undoToken: outcome?.undoToken ?? null,
        persistence: outcome?.persistence || {
          state: status === COMMAND_STATUS.QUEUED
            ? PERSISTENCE_STATE.QUEUED
            : PERSISTENCE_STATE.NOT_REQUIRED,
        },
        needsReconciliation: outcome?.needsReconciliation === true,
      });
    });

    // The single-threaded claim cannot lose a race because no awaited work occurs
    // between the earlier lookup and this synchronous insertion.
    journal.claim(journalKey, { fingerprint, promise: run }, context.journalScope);
    const receipt = await run;
    // Only retain outcomes for which retry could duplicate or compound a
    // mutation. Validation/preflight refusals and known writer refusals are safe
    // to re-evaluate when their live capability changes.
    if ([
      COMMAND_STATUS.APPLIED,
      COMMAND_STATUS.QUEUED,
      COMMAND_STATUS.PARTIAL,
      COMMAND_STATUS.RECONCILE_REQUIRED,
    ].includes(receipt.status)) {
      journal.complete(
        journalKey,
        { fingerprint, receipt },
        context.journalScope,
      );
    } else {
      journal.release(journalKey, context.journalScope);
    }
    emit(onTransition, receipt);
    return receipt;
  }

  return Object.freeze({ execute, journal, registry });
}
