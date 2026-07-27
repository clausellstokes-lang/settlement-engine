/**
 * canonEventCommandTransaction.js — store projection around the authoritative
 * CUT_TRADE_ROUTE command RPC.
 *
 * Order is load-bearing:
 *   1. capture owner/save/revision and prepare the full deterministic result;
 *   2. let one database transaction claim, CAS-update, and finalize;
 *   3. project the confirmed server row into Zustand;
 *   4. only then run best-effort campaign ripple and analytics.
 *
 * No local mutation or legacy save outbox write occurs before step 2. Local-only
 * development remains explicit and uses the legacy writer because localStorage
 * is the only persistence authority in that mode. A configured offline client
 * refuses without mutation.
 */

import {
  AUTHORITATIVE_CANON_EVENT_TYPES,
  prepareAuthoritativeCanonEvent,
} from '../domain/events/prepareCanonEvent.js';
import { receiptFromEventLogEntry } from '../domain/events/mutate.js';
import {
  CANON_COMMAND_BACKEND,
  canonEventCommandBackend,
  commitCutTradeRouteCommand,
} from '../lib/canonEventCommandPersistence.js';
import { makeActionResult } from './actionResult.js';
import { stampPreEventNarrative } from './eventNarrativeSnapshots.js';
import { OP_KIND_BARRIER, peekOps } from './outbox.js';
import { pickleCampaignState } from './settlementSliceHelpers.js';

export { AUTHORITATIVE_CANON_EVENT_TYPES };

function dimensions(systemState) {
  if (!systemState || typeof systemState !== 'object') return null;
  const value = (dimension) => (
    dimension && typeof dimension.value === 'number'
      ? dimension.value
      : null
  );
  return {
    resilience: value(systemState.resilience),
    volatility: value(systemState.volatility),
    externalThreat: value(systemState.externalThreat),
    resourcePressure: value(systemState.resourcePressure),
  };
}

function refusal(state, event, reason, commandStatus = 'failed') {
  return {
    ...makeActionResult('applyEvent', {
      ok: false,
      before: {
        eventType: event?.type ?? null,
        targetId: event?.targetId ?? null,
        phase: state?.phase ?? null,
        activeSaveId: state?.activeSaveId ?? null,
        reason,
      },
      after: null,
    }),
    reason,
    commandStatus,
    commandPersistence: {
      mode: 'server-cas',
      state: 'not-committed',
    },
  };
}

function annotateLegacyResult(result, mode, state) {
  if (!result || typeof result !== 'object') return result;
  return {
    ...result,
    commandPersistence: { mode, state },
  };
}

function savedEntry(state, saveId) {
  return (state.savedSettlements || []).find(
    (entry) => String(entry?.id) === String(saveId),
  ) || null;
}

function hasPendingLegacyPersistence(saveId) {
  return peekOps().some((operation) => (
    operation.kind !== OP_KIND_BARRIER
    && String(operation.saveId) === String(saveId)
  ));
}

/**
 * Compare the JSON projection the same way persistence does. Object-key order
 * and omitted `undefined` fields are not behavior; array order remains exact.
 */
function jsonEquivalent(left, right) {
  if (Object.is(left, right)) return true;
  if (left == null || right == null || typeof left !== typeof right) return false;
  if (typeof left !== 'object') return false;
  if (Array.isArray(left) || Array.isArray(right)) {
    if (!Array.isArray(left) || !Array.isArray(right) || left.length !== right.length) {
      return false;
    }
    return left.every((entry, index) => jsonEquivalent(entry, right[index]));
  }
  const leftKeys = Object.keys(left)
    .filter((key) => left[key] !== undefined)
    .sort();
  const rightKeys = Object.keys(right)
    .filter((key) => right[key] !== undefined)
    .sort();
  return leftKeys.length === rightKeys.length
    && leftKeys.every((key, index) => (
      key === rightKeys[index]
      && jsonEquivalent(left[key], right[key])
    ));
}

/**
 * The active slice may contain a newer in-memory edit than its cached save row.
 * Entering the server CAS from that split projection would commit the wrong
 * reviewed base, so compare every lifecycle field the command will replace.
 */
function liveMatchesCachedBase(state, save) {
  const campaignState = save?.campaignState;
  if (!jsonEquivalent(state.settlement, save?.settlement)) return false;
  if (!campaignState || typeof campaignState !== 'object') return false;
  const lifecycleFields = [
    'phase',
    'eventLog',
    'systemState',
    'locks',
    'generatedAt',
    'editedAt',
    'canonizedAt',
    'lastExportAt',
  ];
  return lifecycleFields.every((field) => (
    jsonEquivalent(state[field] ?? null, campaignState[field] ?? null)
  ));
}

/**
 * Preserve the pre-event narrative as a history snapshot when one exists.
 * R-3: ONE writer with the legacy applyEvent lane — the shared helper owns the
 * stamp condition (parity pinned in tests/store/narrativeStampParity.test.js).
 */
function nextAiData(beforeSave, prepared) {
  return stampPreEventNarrative(beforeSave, {
    event: prepared.event,
    logEntry: prepared.logEntry,
    appliedAt: prepared.appliedAt,
  });
}

/**
 * Translate one confirmed server projection back into the established
 * applyEvent result shape.
 */
function resultForCommit(prepared, stateBefore, saveId, projection, remote) {
  const eventReceipt = receiptFromEventLogEntry(prepared.logEntry);
  const result = {
    ...makeActionResult('applyEvent', {
      before: {
        eventType: prepared.event?.type ?? null,
        targetId: prepared.event?.targetId ?? null,
        phase: stateBefore.phase,
        activeSaveId: saveId,
        systemState: dimensions(stateBefore.systemState),
      },
      after: {
        phase: 'canon',
        logged: true,
        appliedAt: prepared.appliedAt,
        systemState: dimensions(prepared.nextSystemState),
      },
      receipts: eventReceipt ? [eventReceipt] : [],
      persistenceOps: [{
        saveId: String(saveId),
        kind: 'command-rpc',
        fields: ['settlement', 'campaignState'],
      }],
    }),
    commandPersistence: {
      mode: 'server-cas',
      state: 'confirmed',
      replayed: remote.replayed === true,
      fingerprint: remote.fingerprint || null,
      revisionKind: remote.revisionKind || 'base-projection-v1',
      updatedAt: remote.updatedAt || null,
      // The event receipt below is the deterministic domain projection. Keep
      // the database-finalized command receipt beside it so explicit
      // lost-answer recovery can show exactly what durable authority confirmed.
      authorityReceipt: remote.receipt || null,
      localProjection: projection,
    },
  };
  if (projection === 'deferred-local-projection-changed') {
    return {
      ...result,
      commandStatus: 'reconcile-required',
      needsReconciliation: true,
      reason: 'local_projection_changed_after_commit',
    };
  }
  return result;
}

function commandStatusForRemote(status) {
  if (status === 'stale') return 'stale';
  if (status === 'reconcile-required') return 'reconcile-required';
  return 'failed';
}

/**
 * @param {{
 *   get:Function,
 *   set:Function,
 *   event:object,
 *   command:object,
 *   applyLegacy:() => unknown,
 *   afterCommit?:(details:object) => void,
 * }} input
 */
export async function runCanonEventCommandTransaction(input) {
  const stateBefore = input.get();
  const saveId = stateBefore.activeSaveId == null
    ? null
    : String(stateBefore.activeSaveId);
  const ownerId = stateBefore.auth?.user?.id == null
    ? null
    : String(stateBefore.auth.user.id);
  const beforeSave = saveId ? savedEntry(stateBefore, saveId) : null;

  // Clock-bound canon events are not immediate settlement commits. Preserve
  // their established campaign queue writer rather than forcing them through a
  // semantically different row CAS.
  if (
    saveId
    && typeof stateBefore.isSettlementClockBound === 'function'
    && stateBefore.isSettlementClockBound(saveId)
  ) {
    const result = await input.applyLegacy();
    return annotateLegacyResult(result, 'campaign-clock', 'queued');
  }

  const backend = canonEventCommandBackend();
  if (backend === CANON_COMMAND_BACKEND.LOCAL_ONLY) {
    const result = await input.applyLegacy();
    return annotateLegacyResult(result, 'local-only', 'confirmed');
  }
  if (backend === CANON_COMMAND_BACKEND.OFFLINE) {
    return refusal(
      stateBefore,
      input.event,
      'offline_authoritative_commit_required',
    );
  }
  if (!ownerId) {
    return refusal(stateBefore, input.event, 'owner_context_missing', 'stale');
  }
  if (!saveId || !beforeSave) {
    return refusal(stateBefore, input.event, 'save_context_missing', 'stale');
  }

  const expectedRevision = beforeSave.timestamp == null
    ? null
    : String(beforeSave.timestamp);
  if (!expectedRevision) {
    return refusal(stateBefore, input.event, 'revision_missing', 'stale');
  }
  if (
    input.command?.ownerRef?.accountId
    && String(input.command.ownerRef.accountId) !== ownerId
  ) {
    return refusal(stateBefore, input.event, 'owner_changed', 'stale');
  }
  if (
    input.command?.targets?.saveId
    && String(input.command.targets.saveId) !== saveId
  ) {
    return refusal(stateBefore, input.event, 'save_changed', 'stale');
  }
  if (
    input.command?.expected?.revision
    && String(input.command.expected.revision) !== expectedRevision
  ) {
    return refusal(stateBefore, input.event, 'revision_changed', 'stale');
  }
  // A legacy full-row write prepared before this command could otherwise land
  // afterward and erase the authoritative result. Do not enter the durable
  // journal until the existing per-save outbox is clear; this local refusal is
  // intentionally retryable under the same command identity.
  if (hasPendingLegacyPersistence(saveId)) {
    return {
      ...refusal(
        stateBefore,
        input.event,
        'legacy_persistence_pending',
      ),
      retryable: true,
    };
  }
  if (
    !beforeSave.settlement
    || !beforeSave.campaignState
    || typeof beforeSave.campaignState !== 'object'
  ) {
    return refusal(
      stateBefore,
      input.event,
      'base_projection_missing',
      'stale',
    );
  }
  if (!liveMatchesCachedBase(stateBefore, beforeSave)) {
    return {
      ...refusal(
        stateBefore,
        input.event,
        'local_projection_uncommitted',
      ),
      retryable: true,
    };
  }

  const now = input.command?.requestedAt || new Date().toISOString();
  const prepared = prepareAuthoritativeCanonEvent({
    settlement: stateBefore.settlement,
    systemState: stateBefore.systemState,
    phase: stateBefore.phase,
    eventLog: stateBefore.eventLog,
    event: input.event,
    now,
  });
  if (!prepared.ok) {
    if (prepared.veto) {
      return {
        ...refusal(stateBefore, input.event, prepared.reason),
        veto: {
          code: prepared.veto.code || null,
          detail: prepared.veto.detail || '',
          message: prepared.veto.message,
        },
        userMessage: prepared.veto.message,
      };
    }
    return refusal(stateBefore, input.event, prepared.reason);
  }

  const campaignState = pickleCampaignState({
    ...stateBefore,
    settlement: prepared.nextSettlement,
    systemState: prepared.nextSystemState,
    eventLog: prepared.nextEventLog,
    editedAt: prepared.appliedAt,
  }, { now: prepared.appliedAt });
  const aiData = nextAiData(beforeSave, prepared);
  const remote = await commitCutTradeRouteCommand({
    ownerId,
    commandId: input.command.commandId,
    saveId,
    expectedRevision,
    event: input.event,
    expectedSettlement: beforeSave.settlement,
    expectedCampaignState: beforeSave.campaignState,
    expectedAiData: beforeSave.aiData ?? null,
    settlement: prepared.nextSettlement,
    campaignState,
    aiData,
  });

  if (remote.status !== 'applied') {
    return refusal(
      stateBefore,
      input.event,
      remote.reason || remote.status,
      commandStatusForRemote(remote.status),
    );
  }
  if (
    !remote.settlement
    || !remote.campaignState
    || !remote.updatedAt
  ) {
    throw Object.assign(
      new Error('The server committed the command without a reloadable projection.'),
      { code: 'canon_command_projection_missing' },
    );
  }

  const current = input.get();
  const sameOwner = String(current.auth?.user?.id || '') === ownerId;
  const currentSave = savedEntry(current, saveId);
  const activeProjectionChanged = (
    String(current.activeSaveId || '') === saveId
    && (
      current.settlement !== stateBefore.settlement
      || current.systemState !== stateBefore.systemState
      || current.eventLog !== stateBefore.eventLog
    )
  );
  const cachedProjectionChanged = (
    !currentSave
    || (
      currentSave !== beforeSave
      && (
        String(currentSave.timestamp || '') !== expectedRevision
        || !jsonEquivalent(currentSave.settlement, beforeSave.settlement)
        || !jsonEquivalent(
          currentSave.campaignState,
          beforeSave.campaignState,
        )
      )
    )
  );
  let projection = 'deferred-owner-changed';
  if (sameOwner && !activeProjectionChanged && !cachedProjectionChanged) {
    input.set((draft) => {
      const index = (draft.savedSettlements || []).findIndex(
        (entry) => String(entry?.id) === saveId,
      );
      if (index >= 0) {
        draft.savedSettlements[index] = {
          ...draft.savedSettlements[index],
          settlement: remote.settlement,
          campaignState: remote.campaignState,
          ...(remote.aiData != null ? { aiData: remote.aiData } : {}),
          timestamp: remote.updatedAt,
        };
        projection = 'cache';
      }
      if (String(draft.activeSaveId || '') === saveId) {
        draft.settlement = remote.settlement;
        draft.systemState = remote.campaignState.systemState
          || prepared.nextSystemState;
        draft.phase = remote.campaignState.phase || 'canon';
        draft.eventLog = Array.isArray(remote.campaignState.eventLog)
          ? remote.campaignState.eventLog
          : prepared.nextEventLog;
        draft.editedAt = remote.campaignState.editedAt || prepared.appliedAt;
        draft.pendingPreview = null;
        draft.pendingBatchPreview = null;
        projection = 'active';
      }
    });
  } else if (sameOwner) {
    projection = 'deferred-local-projection-changed';
  }

  const result = resultForCommit(
    prepared,
    stateBefore,
    saveId,
    projection,
    remote,
  );
  if (projection === 'active') {
    try {
      input.afterCommit?.({
        prepared,
        beforeSave,
        stateBefore,
        afterState: input.get(),
        result,
      });
    } catch {
      // The save and command receipt are already durable. Campaign ripple and
      // analytics are intentionally best-effort post-commit effects.
    }
  }
  return result;
}
