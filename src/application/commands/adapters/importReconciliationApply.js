/**
 * Command specs for structured existing-campaign reconciliation.
 *
 * Both capabilities share one authoritative transaction adapter but retain
 * distinct command kinds and validation. The spec translates persistence
 * outcomes only; membership law, owner checks, source-copy constraints, local
 * recovery, and store projection remain in the command transaction.
 */

import { makeCommandEnvelope } from '../commandEnvelope.js';
import {
  COMMAND_STATUS,
  PERSISTENCE_STATE,
} from '../commandReceipts.js';
import { reconciliationDraftToCommandFields } from '../../../lib/importReconciliationCommandIdentity.js';

export const IMPORT_SETTLEMENT_CREATE_AND_ATTACH =
  'import.settlement.create-and-attach';
export const IMPORT_CAMPAIGN_ATTACH_EXISTING =
  'import.campaign.attach-existing';

function plainRecord(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function validateShared(command) {
  if (!command.ownerRef?.accountId) {
    return { ok: false, reason: 'account_owner_required' };
  }
  if (!command.targets?.campaignId || !command.targets?.saveId) {
    return { ok: false, reason: 'import_targets_required' };
  }
  if (!command.expected?.sourceFingerprint) {
    return { ok: false, reason: 'source_checksum_required' };
  }
  if (!Array.isArray(command.expected?.membershipCampaignIds)) {
    return { ok: false, reason: 'membership_topology_required' };
  }
  if (!command.correlation?.importSessionId || !command.correlation?.proposalId) {
    return { ok: false, reason: 'import_correlation_required' };
  }
  return { ok: true };
}

function preflight(_command, context) {
  return typeof context.actions?.applyImportReconciliationCommand === 'function'
    ? { ok: true }
    : { ok: false, reason: 'no_import_command_writer' };
}

async function apply(command, context) {
  const outcome = await context.actions.applyImportReconciliationCommand(command);
  if (outcome?.status === COMMAND_STATUS.RECONCILE_REQUIRED) {
    return {
      ok: false,
      status: COMMAND_STATUS.RECONCILE_REQUIRED,
      reason: outcome.reason || 'import_command_result_unknown',
      result: outcome.result || null,
      needsReconciliation: true,
      persistence: { state: PERSISTENCE_STATE.UNCONFIRMED },
    };
  }
  if (outcome?.status === COMMAND_STATUS.STALE) {
    return {
      ok: false,
      status: COMMAND_STATUS.STALE,
      reason: outcome.reason || 'import_review_stale',
      result: outcome.result || null,
    };
  }
  if (outcome?.status === COMMAND_STATUS.FAILED || outcome?.ok === false) {
    return {
      ok: false,
      status: COMMAND_STATUS.FAILED,
      reason: outcome?.reason || 'import_command_refused',
      result: outcome?.result || null,
    };
  }
  return {
    ok: true,
    status: COMMAND_STATUS.APPLIED,
    result: outcome?.result || outcome || null,
    persistence: {
      state: outcome?.persistenceState === 'confirmed'
        ? PERSISTENCE_STATE.CONFIRMED
        : PERSISTENCE_STATE.UNCONFIRMED,
    },
  };
}

export const importSettlementCreateAndAttachSpec = Object.freeze({
  kind: IMPORT_SETTLEMENT_CREATE_AND_ATTACH,
  description: 'Create one dormant imported settlement and attach it atomically.',
  targetScope: 'cross-save',
  delivery: 'server-uow',
  atomicity: 'server-atomic',
  surveyor: false,

  validate(command) {
    const shared = validateShared(command);
    if (!shared.ok) return shared;
    if (!plainRecord(command.params?.entry)) {
      return { ok: false, reason: 'import_entry_required' };
    }
    return { ok: true };
  },
  preflight,
  apply,
});

export const importCampaignAttachExistingSpec = Object.freeze({
  kind: IMPORT_CAMPAIGN_ATTACH_EXISTING,
  description: 'Rehome one existing settlement into the reviewed target campaign.',
  targetScope: 'cross-save',
  delivery: 'server-uow',
  atomicity: 'server-atomic',
  surveyor: false,

  validate(command) {
    const shared = validateShared(command);
    if (!shared.ok) return shared;
    if (Object.hasOwn(command.params || {}, 'entry')) {
      return { ok: false, reason: 'existing_settlement_content_forbidden' };
    }
    if (command.params?.membershipPolicy !== 'exclusive-rehome') {
      return { ok: false, reason: 'exclusive_membership_policy_required' };
    }
    return { ok: true };
  },
  preflight,
  apply,
});

export function importReconciliationCommand(draft, context) {
  return makeCommandEnvelope(
    reconciliationDraftToCommandFields(draft, context),
  );
}
