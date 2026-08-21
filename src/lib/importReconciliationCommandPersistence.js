/**
 * Durable transport for structured existing-campaign reconciliation.
 *
 * The RPC is the cloud authority: one transaction claims command identity,
 * validates the reviewed membership topology, inserts or rehomes, and finalizes
 * the receipt. This module never writes through saves.js, campaigns.js, or the
 * legacy outbox in configured mode.
 */

import { isConfigured, supabase } from './supabase.js';

export const IMPORT_COMMAND_BACKEND = Object.freeze({
  LOCAL_ONLY: 'local-only',
  OFFLINE: 'offline',
  SERVER: 'server',
});

export function importReconciliationCommandBackend() {
  if (!isConfigured) return IMPORT_COMMAND_BACKEND.LOCAL_ONLY;
  if (typeof navigator !== 'undefined' && navigator.onLine === false) {
    return IMPORT_COMMAND_BACKEND.OFFLINE;
  }
  return IMPORT_COMMAND_BACKEND.SERVER;
}

function persistenceError(error) {
  return Object.assign(
    new Error(
      error?.message || 'The authoritative import command did not complete.',
    ),
    {
      name: 'ImportReconciliationCommandPersistenceError',
      code: error?.code || 'import_command_rpc_failed',
      details: error?.details || null,
    },
  );
}

/**
 * @param {{
 *   ownerId:string,
 *   commandId:string,
 *   kind:string,
 *   campaignId:string,
 *   saveId:string,
 *   sourceChecksum:string,
 *   importSessionId:string,
 *   expectedMembershipCampaignIds:string[],
 *   entry:object|null,
 * }} request
 * @param {{client?:typeof supabase}} [dependencies]
 */
export async function commitImportReconciliationCommand(
  request,
  { client = supabase } = {},
) {
  if (!client || typeof client.rpc !== 'function') {
    throw persistenceError({ code: 'import_command_backend_unavailable' });
  }
  const { data, error } = await client.rpc(
    'apply_import_reconciliation_command',
    {
      p_expected_owner: request.ownerId,
      p_command_id: request.commandId,
      p_kind: request.kind,
      p_campaign_id: request.campaignId,
      p_save_id: request.saveId,
      p_source_checksum: request.sourceChecksum,
      p_import_session_id: request.importSessionId,
      p_expected_membership_campaign_ids:
        request.expectedMembershipCampaignIds,
      p_entry: request.entry,
    },
  );
  if (error) throw persistenceError(error);
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    throw persistenceError({ code: 'import_command_response_invalid' });
  }
  return {
    status: String(data.status || 'failed'),
    reason: data.reason == null ? null : String(data.reason),
    replayed: data.replayed === true,
    fingerprint: data.fingerprint == null ? null : String(data.fingerprint),
    receipt: data.receipt ?? null,
    saveRow: data.saveRow ?? data.save_row ?? null,
    campaignRows: data.campaignRows ?? data.campaign_rows ?? [],
  };
}

/**
 * Read the caller's own durable import receipts for recovery diagnostics. RLS
 * remains the authority; this helper accepts exact command ids only and returns
 * journal metadata, never imported source or campaign payloads.
 */
export async function readImportCommandJournal(
  commandIds,
  { client = supabase } = {},
) {
  const ids = [...new Set(
    (Array.isArray(commandIds) ? commandIds : [])
      .filter(value => typeof value === 'string' && value.trim())
      .map(value => value.trim()),
  )].slice(0, 100);
  if (!isConfigured || ids.length === 0) return [];
  if (!client || typeof client.from !== 'function') {
    throw persistenceError({ code: 'import_journal_backend_unavailable' });
  }
  const { data, error } = await client
    .from('application_command_journal')
    .select(
      'command_id, kind, target_id, phase, status, receipt, failure_code, claimed_at, finalized_at, updated_at',
    )
    .in('command_id', ids)
    .in('kind', [
      'import.settlement.create-and-attach',
      'import.campaign.attach-existing',
    ]);
  if (error) throw persistenceError(error);
  return Array.isArray(data) ? data : [];
}
