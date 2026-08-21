/**
 * canonEventApply.js — application adapter for the established applyEvent verb.
 *
 * The adapter owns command shape and result translation only. Event semantics,
 * preview parity, campaign-clock queueing, mutation, and causal receipts remain
 * owned by settlementSlice.applyEvent. Delivery is intentionally writer-routed:
 * CUT_TRADE_ROUTE uses the command-specific server transaction; event families
 * not yet migrated retain the established save outbox.
 */

import {
  commandIdForValue,
  makeCommandEnvelope,
} from '../commandEnvelope.js';
import {
  COMMAND_STATUS,
  PERSISTENCE_STATE,
} from '../commandReceipts.js';
import { isAuthoritativeCanonEventType } from '../../../domain/events/authoritativeCanonEventTypes.js';

export const CANON_EVENT_APPLY = 'settlement.canon-event.apply';

function plainRecord(value) {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

function refusalReason(result) {
  return result?.reason
    || result?.before?.reason
    || result?.veto?.code
    || result?.userMessage
    || 'writer_refused';
}

export const canonEventApplySpec = Object.freeze({
  kind: CANON_EVENT_APPLY,
  description: 'Apply one reviewed canon event through settlementSlice.applyEvent.',
  targetScope: 'save',
  delivery: 'writer-routed',
  atomicity: 'single-target',
  surveyor: true,

  validate(command) {
    const event = command.params?.event;
    if (!plainRecord(event) || typeof event.type !== 'string' || !event.type) {
      return { ok: false, reason: 'event_required' };
    }
    return { ok: true };
  },

  preflight(command, context) {
    if (typeof context.actions?.applyEvent !== 'function') {
      return { ok: false, reason: 'no_verb' };
    }
    return command.targets?.saveId
      ? { ok: true }
      : { ok: false, reason: 'no_save' };
  },

  async apply(command, context) {
    const event = command.params.event;
    const result = await context.actions.applyEvent(
      event,
      ...(isAuthoritativeCanonEventType(event.type)
        ? [{ applicationCommand: command }]
        : []),
    );
    if (result === null || result === false) {
      return { ok: false, status: COMMAND_STATUS.FAILED, reason: 'writer_refused' };
    }
    if (result?.commandStatus === COMMAND_STATUS.RECONCILE_REQUIRED) {
      return {
        ok: false,
        status: COMMAND_STATUS.RECONCILE_REQUIRED,
        reason: refusalReason(result),
        result,
        needsReconciliation: true,
        persistence: {
          state: result?.commandPersistence?.state === 'confirmed'
            ? PERSISTENCE_STATE.CONFIRMED
            : PERSISTENCE_STATE.UNCONFIRMED,
        },
      };
    }
    if (result?.commandStatus === COMMAND_STATUS.STALE) {
      return {
        ok: false,
        status: COMMAND_STATUS.STALE,
        reason: refusalReason(result),
        result,
      };
    }
    if (result?.ok === false || result?.queued === false) {
      return {
        ok: false,
        status: COMMAND_STATUS.FAILED,
        reason: refusalReason(result),
        result,
      };
    }
    if (result?.queued === true) {
      return {
        ok: true,
        status: COMMAND_STATUS.QUEUED,
        result,
        domainReceipt: result.receipts || null,
        persistence: { state: PERSISTENCE_STATE.QUEUED },
      };
    }
    return {
      ok: true,
      status: COMMAND_STATUS.APPLIED,
      result,
      domainReceipt: result?.receipts || null,
      // applyEvent enqueues persistence but its ActionResult does not yet expose
      // the durable outbox acknowledgement. Do not call that cloud-confirmed.
      persistence: {
        state: result?.commandPersistence?.state === 'confirmed'
          ? PERSISTENCE_STATE.CONFIRMED
          : result?.persistenceOps?.length
            ? PERSISTENCE_STATE.QUEUED
            : PERSISTENCE_STATE.UNCONFIRMED,
      },
    };
  },
});

/**
 * Build the stable command for one reviewed proposal. The proposal index is
 * part of identity, so two identical op types in one interpretation remain
 * independently approvable and independently receipted.
 */
export function canonEventCommand(intent, {
  interpretRef = null,
  reviewRef = null,
  seed = null,
  ownerId = null,
  revision = null,
  now = null,
  provenance = 'surveyor',
} = {}) {
  const identity = {
    interpretRef,
    reviewRef: reviewRef || interpretRef,
    seed: seed == null ? null : String(seed),
    provenance,
    proposalIndex: intent.proposalIndex,
    saveId: intent.saveId,
    // A newly reviewed base projection is a new attempt, not a rebinding of an
    // earlier durable identity. The journal may therefore retain a terminal
    // stale receipt without poisoning a later review after the save advances.
    revision: revision == null ? null : String(revision),
    event: intent.event,
  };
  const commandId = commandIdForValue('canon-event-apply', identity);
  // Surveyor ops describe event semantics but do not mint domain event ids.
  // Deriving a missing id from the already-stable command identity gives every
  // log entry, condition, undo record, and regional consequence the provenance
  // key the manual composer already supplies. Authored ids remain untouched.
  const event = intent.event?.id
    ? intent.event
    : {
        ...intent.event,
        id: `event:${commandId.slice('cmd:'.length)}`,
      };
  return makeCommandEnvelope({
    schemaVersion: 1,
    commandId,
    kind: CANON_EVENT_APPLY,
    provenance,
    ownerRef: ownerId ? { accountId: String(ownerId) } : null,
    targets: { saveId: intent.saveId },
    expected: revision == null ? {} : { revision: String(revision) },
    params: { event },
    correlation: {
      ...(interpretRef ? { compileRef: interpretRef } : {}),
      ...(reviewRef ? { reviewRef } : {}),
      proposalIndex: intent.proposalIndex,
    },
    requestedAt: now,
  });
}
