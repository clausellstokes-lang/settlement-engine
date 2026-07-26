/**
 * lib/intent/interpretApply.js — the ACCEPT→MINT executor (Surveyor S3→S4 seam).
 *
 * The application HALF of the accept→mint slice. The PURE half
 * (dispatchAcceptedOps + interpretApplyLogRecord,
 * src/domain/intent/applyDispatch.js) maps the review's accepted ops to typed
 * ApplyIntent[]. THIS turns each intent into an addressed application command.
 * The command adapter, not this Surveyor-specific module, reaches the same
 * recordPartyImpact / applyEvent writer the manual UI drives.
 *
 * DI by design (mirrors the edge functions' handler seam): terminal writers are
 * injected into the command context, so the executor is pinned without a live
 * store and the panel wires the real actions. Orchestration glue belongs in
 * src/lib (never src/domain — the engine spine stays headless,
 * tests/architecture/layerBoundaries.test.js). Reached only from the lazy
 * interpret panel, so it adds zero eager bytes.
 *
 * NEVER-BYPASS (the constitution, §3): every landed op flows through a registered
 * CommandSpec and then its established writer — the AI writes NO state directly.
 * Stable per-proposal command ids keep duplicate op types distinct. The
 * session-command journal prevents a double-submit from executing the writer
 * twice. Command adapters may strengthen that guarantee: the first
 * CUT_TRADE_ROUTE vertical also claims a durable server journal.
 */

import { dispatchAcceptedOps, interpretApplyLogRecord } from '../../domain/intent/applyDispatch.js';
import {
  CANON_EVENT_APPLY,
  canonEventCommand,
} from '../../application/commands/adapters/canonEventApply.js';
import { partyImpactCommand } from '../../application/commands/adapters/partyImpactRecord.js';
import { executeSessionCommand } from '../../application/commands/sessionCommandRuntime.js';
import { isAuthoritativeCanonEventType } from '../../domain/events/authoritativeCanonEventTypes.js';

const SUCCESS_STATUS = new Set(['applied', 'queued']);

/**
 * @typedef {{
 *   ownerId?: string|null,
 *   saveId?: string|null,
 *   campaignId?: string|null,
 *   saveRevision?: string|null,
 *   campaignRevision?: string|null,
 * }} InterpretApplyTargetContext
 */

/**
 * @typedef {{
 *   accepted?: Array<{op?: any, index?: number}|any>,
 *   campaignId?: string|null,
 *   saveId?: string|null,
 *   ownerId?: string|null,
 *   targetContext?: InterpretApplyTargetContext,
 *   currentContext?: InterpretApplyTargetContext,
 *   readCurrentContext?: () => InterpretApplyTargetContext,
 *   seed?: string|number|null,
 *   interpretRef?: string|null,
 *   reviewRef?: string|null,
 *   corrections?: Array<{class?: string}>,
 *   blocked?: Array<unknown>,
 *   now?: string,
 *   actions?: {
 *     applyEvent?: (event: any) => unknown,
 *     recordPartyImpact?: (
 *       campaignId: string,
 *       action: any,
 *     ) => Promise<unknown>|unknown,
 *   },
 *   executeCommand?: typeof executeSessionCommand,
 * }} InterpretApplyIO
 */

function hasOwn(record, field) {
  return !!record && Object.prototype.hasOwnProperty.call(record, field);
}

function observed(record, field, fallback = null) {
  return hasOwn(record, field) ? record[field] : fallback;
}

function targetAndCurrent(io) {
  const targetInput = io.targetContext || {};
  const target = {
    ownerId: observed(targetInput, 'ownerId', io.ownerId ?? null),
    saveId: observed(targetInput, 'saveId', io.saveId ?? null),
    campaignId: observed(targetInput, 'campaignId', io.campaignId ?? null),
    saveRevision: observed(targetInput, 'saveRevision', null),
    campaignRevision: observed(targetInput, 'campaignRevision', null),
  };
  const currentInput = io.currentContext;
  if (!currentInput) return { target, current: { ...target } };
  return {
    target,
    current: {
      ownerId: observed(currentInput, 'ownerId', target.ownerId),
      saveId: observed(currentInput, 'saveId', target.saveId),
      campaignId: observed(currentInput, 'campaignId', target.campaignId),
      saveRevision: observed(currentInput, 'saveRevision', target.saveRevision),
      campaignRevision: observed(
        currentInput,
        'campaignRevision',
        target.campaignRevision,
      ),
    },
  };
}

function commandForIntent(intent, io, target) {
  const shared = {
    interpretRef: io.interpretRef,
    reviewRef: io.reviewRef,
    seed: io.seed,
    ownerId: target.ownerId,
    now: io.now,
  };
  if (intent.target === 'recordPartyImpact') {
    return partyImpactCommand(intent, {
      ...shared,
      revision: target.campaignRevision,
    });
  }
  return canonEventCommand(intent, {
    ...shared,
    revision: target.saveRevision,
  });
}

function executionContext(intent, io, current) {
  return {
    ownerId: current.ownerId,
    saveId: current.saveId,
    campaignId: current.campaignId,
    revision: intent.target === 'recordPartyImpact'
      ? current.campaignRevision
      : current.saveRevision,
    now: io.now,
    actions: io.actions,
  };
}

function nextSaveRevision(receipt) {
  return receipt?.result?.commandPersistence?.updatedAt
    || receipt?.result?.after?.appliedAt
    || null;
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

function readLiveContext(input, fallback) {
  if (typeof input.readCurrentContext !== 'function') return fallback;
  try {
    const observedContext = input.readCurrentContext();
    return targetAndCurrent({
      targetContext: fallback,
      currentContext: observedContext,
    }).current;
  } catch {
    // An observational callback must not turn command execution into a throw.
    // The executor still validates the last complete snapshot it received.
    return fallback;
  }
}

/**
 * Fold one explicit durable-recovery observation into the visible apply result.
 *
 * The original command envelope remains session-only and lets the recovery
 * action replay the exact reviewed behavior. Neither it nor this UI summary is
 * a persistence authority; the durable journal row and command RPC remain that
 * authority.
 */
export function mergeCanonEventRecoveryResult(
  applyResult,
  commandId,
  recovery,
) {
  const prior = applyResult || {};
  const commandResults = Array.isArray(prior.commandResults)
    ? prior.commandResults
    : [];
  const matchedIndex = commandResults.findIndex(
    item => item.commandId === commandId,
  );
  if (matchedIndex < 0) return prior;
  const matched = commandResults[matchedIndex];

  const receipt = recovery?.receipt || null;
  const status = receipt?.status || recovery?.status || matched.status;
  const successful = item => (
    item.status === 'applied' || item.status === 'queued'
  );
  const sameSummary = (summary, item) => (
    summary.opType === item.opType && summary.family === item.family
  );
  const removeCommandOwnedSummaries = (summaries, results, predicate) => {
    const remaining = [...summaries];
    for (const result of results.filter(predicate)) {
      const index = remaining.findIndex(summary => (
        sameSummary(summary, result)
      ));
      if (index >= 0) remaining.splice(index, 1);
    }
    return remaining;
  };
  const nextCommandResults = commandResults.map(item => (
    item.commandId === commandId
      ? {
          ...item,
          status,
          replayed: receipt?.replayed === true,
          receipt: receipt || item.receipt,
          recovery,
        }
      : item
  ));

  // Command ids are the exact identity. Strip the old command-owned summaries,
  // then rebuild them from updated command results. Any exceptional summary
  // without a command result (for example an injected executor throwing) is
  // preserved separately rather than guessed by family/type.
  const extraApplied = removeCommandOwnedSummaries(
    prior.applied || [],
    commandResults,
    successful,
  );
  const extraFailed = removeCommandOwnedSummaries(
    prior.failed || [],
    commandResults,
    item => !successful(item),
  );
  const applied = [
    ...nextCommandResults.filter(successful).map(item => ({
      opType: item.opType,
      family: item.family,
    })),
    ...extraApplied,
  ];
  const failed = [
    ...nextCommandResults.filter(item => !successful(item)).map(item => ({
      opType: item.opType,
      family: item.family,
      reason: item.recovery?.reason
        || item.receipt?.reason
        || item.status
        || 'refused',
    })),
    ...extraFailed,
  ];

  return {
    ...prior,
    applied,
    failed,
    commandResults: nextCommandResults,
    log: prior.log
      ? { ...prior.log, appliedCount: applied.length }
      : prior.log,
  };
}

/**
 * Execute accepted proposals as independently receipted application commands
 * and return their no-content reproducibility summary.
 *
 * @param {InterpretApplyIO} io
 * @returns {Promise<{
 *   applied: Array<{ opType: string, family: string }>,
 *   failed: Array<{ opType: string, family: string, reason: string }>,
 *   unroutable: Array<{ opType: string }>,
 *   commandResults: Array<{commandId:string, proposalIndex:number,
 *     opType:string, family:string, status:string, replayed:boolean,
 *     receipt:object}>,
 *   log: ReturnType<typeof interpretApplyLogRecord>,
 * }>}
 */
export async function runInterpretApply(io) {
  const input = /** @type {InterpretApplyIO} */ (io || {});
  const {
    accepted = [],
    seed = null,
    interpretRef = null,
    corrections = [],
    blocked = [],
    now,
    actions = {},
    executeCommand = executeSessionCommand,
  } = input;
  const contexts = targetAndCurrent(input);
  const expected = { ...contexts.target };
  let current = contexts.current;
  const { intents, unroutable } = dispatchAcceptedOps(accepted, {
    campaignId: expected.campaignId,
    saveId: expected.saveId,
  });

  /** @type {Array<{ opType: string, family: string }>} */
  const applied = [];
  /** @type {Array<{ opType: string, family: string, reason: string }>} */
  const failed = [];
  /** @type {typeof intents} */
  const landedIntents = [];
  /** @type {Array<any>} */
  const commandResults = [];

  for (const intent of intents) {
    current = readLiveContext(input, current);
    const command = commandForIntent(intent, {
      ...input,
      seed,
      interpretRef,
      now,
      actions,
    }, expected);
    try {
      const receipt = await executeCommand(
        command,
        executionContext(intent, { ...input, now, actions }, current),
      );
      commandResults.push({
        commandId: command.commandId,
        proposalIndex: intent.proposalIndex,
        opType: intent.opType,
        family: intent.family,
        status: receipt.status,
        replayed: receipt.replayed === true,
        receipt,
        // Only an ambiguous authoritative canon command needs its exact
        // envelope retained for the product-visible same-session recovery
        // action. It never enters analytics, logs, or browser persistence.
        ...(receipt.status === 'reconcile-required'
          && command.kind === CANON_EVENT_APPLY
          && isAuthoritativeCanonEventType(commandEventType(command))
          ? { recoveryCommand: command }
          : {}),
      });
      if (SUCCESS_STATUS.has(receipt.status)) {
        applied.push({ opType: intent.opType, family: intent.family });
        landedIntents.push(intent);
        // Canon proposals in one accepted review form an ordered mini-saga. A
        // successful first proposal advances the save revision that the next
        // proposal must address. Derive it from the stored receipt (not merely
        // the latest live store) so replaying the whole review reconstructs the
        // exact same command chain and cannot mint a new second command.
        if (intent.target === 'applyEvent') {
          const revision = nextSaveRevision(receipt);
          if (revision) {
            expected.saveRevision = revision;
            current = { ...current, saveRevision: revision };
          }
        }
      } else {
        failed.push({
          opType: intent.opType,
          family: intent.family,
          reason: receipt.reason || receipt.status || 'refused',
        });
      }
    } catch (error) {
      // The standard executor is total; this catch protects an injected test or
      // future runtime implementation without dropping the proposal silently.
      failed.push({
        opType: intent.opType,
        family: intent.family,
        reason: error instanceof Error ? error.message : 'command_executor_threw',
      });
    }
  }

  // Use the exact per-command successes. Matching by family+opType over-counted
  // a failed duplicate whenever a same-type sibling landed.
  const log = interpretApplyLogRecord({
    intents: landedIntents,
    corrections,
    blocked,
    interpretRef,
    seed,
    now,
  });

  return { applied, failed, unroutable, commandResults, log };
}
