/**
 * prepareCanonEvent.js — pure preparation for one immediate canon event.
 *
 * This is the deterministic half of settlementSlice.applyEvent: validate and
 * apply the domain event, reconcile the settlement graph, restore authored
 * SystemState deltas, and construct the next event log. It performs no store,
 * network, analytics, campaign-ripple, or persistence work.
 *
 * The first server-authoritative vertical deliberately admits only
 * CUT_TRADE_ROUTE. Other event families retain the legacy writer until their
 * extra crisis, relationship, succession, or campaign-clock semantics can be
 * moved without weakening them.
 */

import { applyEvent as domainApplyEvent } from './applyEvent.js';
import { layerAuthoredDeltas } from './eventPipeline.js';
import { deriveSystemState } from '../state/deriveSystemState.js';
import { reconcileSettlementChange } from '../settlementReconciliation.js';
import {
  AUTHORITATIVE_CANON_EVENT_TYPES,
  isAuthoritativeCanonEventType,
} from './authoritativeCanonEventTypes.js';

/** @typedef {import('../types.js').Event} Event */
/** @typedef {import('../types.js').EventLogEntry} EventLogEntry */
/** @typedef {import('../types.js').SystemState} SystemState */
/** @typedef {import('../settlement.schema.js').CanonicalSettlement} CanonicalSettlement */
/** @typedef {CanonicalSettlement & {reconciliationLog?: Array<Record<string, unknown>>}} ReconcilableSettlement */

export {
  AUTHORITATIVE_CANON_EVENT_TYPES,
  isAuthoritativeCanonEventType,
};

/**
 * @param {{
 *   settlement:ReconcilableSettlement|null,
 *   systemState:SystemState|null,
 *   phase?:string,
 *   eventLog?:Array<EventLogEntry|object>,
 *   event:Event|null|undefined,
 *   now:string,
 * }} input
 */
export function prepareAuthoritativeCanonEvent(input) {
  if (!isAuthoritativeCanonEventType(input?.event?.type)) {
    return { ok: false, reason: 'event_not_server_authoritative' };
  }
  if (!input?.settlement) {
    return { ok: false, reason: 'no_settlement' };
  }
  if (input.phase !== 'canon') {
    return { ok: false, reason: 'canon_phase_required' };
  }

  // The guards above establish the non-null values the legacy domain wrapper
  // accepts at runtime. Name them once so the preparation steps below remain
  // strict-clean without weakening the public refusal contract.
  const settlement = input.settlement;
  const event = /** @type {Event} */ (input.event);
  const systemState = input.systemState || deriveSystemState(settlement);
  const applied = domainApplyEvent({
    settlement,
    systemState,
    event,
    now: input.now,
  });
  let { logEntry } = applied;
  let nextSettlement = /** @type {ReconcilableSettlement} */ (
    applied.nextSettlement
  );
  const { veto } = applied;
  if (veto) {
    return {
      ok: false,
      reason: veto.code || 'event_vetoed',
      veto,
    };
  }

  nextSettlement = /** @type {ReconcilableSettlement} */ (
    reconcileSettlementChange(nextSettlement, settlement, {
      source: 'canon_event',
      changeType: event.type,
      changeLabel: event.targetId
        || event.payload?.label
        || event.id,
      now: logEntry.appliedAt,
    })
  );
  const nextSystemState = layerAuthoredDeltas(
    deriveSystemState(nextSettlement),
    event,
    settlement,
  );
  logEntry = {
    ...logEntry,
    afterState: nextSystemState,
  };

  return {
    ok: true,
    event,
    nextSettlement,
    nextSystemState,
    logEntry,
    nextEventLog: [
      ...(Array.isArray(input.eventLog) ? input.eventLog : []),
      logEntry,
    ],
    appliedAt: logEntry.appliedAt || input.now,
  };
}
