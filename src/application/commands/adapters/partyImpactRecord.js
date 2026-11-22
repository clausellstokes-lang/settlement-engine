/**
 * partyImpactRecord.js — application adapter for recordPartyImpact.
 *
 * The pulse writer remains authoritative and still owns pause/in-flight gates,
 * simulation rules, state mutation, telemetry, and campaign/save persistence.
 * This adapter supplies stable addressing, replay identity, and one receipt
 * vocabulary above it.
 */

import {
  commandIdForValue,
  makeCommandEnvelope,
} from '../commandEnvelope.js';
import {
  COMMAND_STATUS,
  PERSISTENCE_STATE,
} from '../commandReceipts.js';

export const PARTY_IMPACT_RECORD = 'campaign.party-impact.record';

function plainRecord(value) {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

export const partyImpactRecordSpec = Object.freeze({
  kind: PARTY_IMPACT_RECORD,
  description: 'Record one reviewed party impact through the World Pulse input lane.',
  targetScope: 'campaign',
  delivery: 'save-outbox',
  atomicity: 'saga',
  surveyor: true,

  validate(command) {
    const action = command.params?.action;
    if (!plainRecord(action) || typeof action.kind !== 'string' || !action.kind) {
      return { ok: false, reason: 'party_impact_required' };
    }
    return { ok: true };
  },

  preflight(command, context) {
    if (typeof context.actions?.recordPartyImpact !== 'function') {
      return { ok: false, reason: 'no_verb' };
    }
    return command.targets?.campaignId
      ? { ok: true }
      : { ok: false, reason: 'no_campaign' };
  },

  async apply(command, context) {
    const result = await context.actions.recordPartyImpact(
      command.targets.campaignId,
      command.params.action,
    );
    if (result === null || result === false) {
      return { ok: false, status: COMMAND_STATUS.FAILED, reason: 'writer_refused' };
    }
    if (result?.ok === false) {
      return {
        ok: false,
        status: COMMAND_STATUS.FAILED,
        reason: result.reason || result.code || 'writer_refused',
        result,
      };
    }
    return {
      ok: true,
      status: COMMAND_STATUS.APPLIED,
      result,
      // The writer awaits every first persistence attempt, but the current
      // flush contract does not prove every member and campaign row committed.
      persistence: { state: PERSISTENCE_STATE.UNCONFIRMED },
    };
  },
});

export function partyImpactCommand(intent, {
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
    campaignId: intent.campaignId,
    action: intent.action,
  };
  return makeCommandEnvelope({
    schemaVersion: 1,
    commandId: commandIdForValue('party-impact-record', identity),
    kind: PARTY_IMPACT_RECORD,
    provenance,
    ownerRef: ownerId ? { accountId: String(ownerId) } : null,
    targets: { campaignId: intent.campaignId },
    expected: revision == null ? {} : { revision: String(revision) },
    params: { action: intent.action },
    correlation: {
      ...(interpretRef ? { compileRef: interpretRef } : {}),
      ...(reviewRef ? { reviewRef } : {}),
      proposalIndex: intent.proposalIndex,
    },
    requestedAt: now,
  });
}
