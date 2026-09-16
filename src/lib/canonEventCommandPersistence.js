/**
 * Durable transport for the first server-authoritative canon-event vertical.
 *
 * This module is loaded only after a reviewed CUT_TRADE_ROUTE command reaches
 * the store. It does not enqueue the legacy save outbox: the RPC is itself the
 * one authoritative transaction (journal claim + revision CAS + save update +
 * final receipt). A configured client that is offline refuses before local
 * mutation, because pretending an uncommitted command succeeded would recreate
 * the split-brain path this vertical removes.
 *
 * Scope note: the initiating Surveyor session can read one exact owner-scoped
 * journal identity and explicitly reconcile an ambiguous answer. The service
 * health probe also alerts on unresolved command rows. That bounded action is
 * not a reopen-time command inbox, so callers must not describe reconciliation
 * recovery as product-wide yet.
 */

import { isConfigured, supabase } from './supabase.js';

export const CANON_COMMAND_BACKEND = Object.freeze({
  LOCAL_ONLY: 'local-only',
  OFFLINE: 'offline',
  SERVER: 'server',
});

export function canonEventCommandBackend() {
  if (!isConfigured) return CANON_COMMAND_BACKEND.LOCAL_ONLY;
  if (typeof navigator !== 'undefined' && navigator.onLine === false) {
    return CANON_COMMAND_BACKEND.OFFLINE;
  }
  return CANON_COMMAND_BACKEND.SERVER;
}

function persistenceError(error) {
  return Object.assign(
    new Error(
      error?.message || 'The authoritative canon-event commit did not complete.',
    ),
    {
      name: 'CanonEventCommandPersistenceError',
      code: error?.code || 'canon_command_rpc_failed',
      details: error?.details || null,
    },
  );
}

/**
 * @param {{
 *   ownerId:string,
 *   commandId:string,
 *   saveId:string,
 *   expectedRevision:string,
 *   event:object,
 *   expectedSettlement:object,
 *   expectedCampaignState:object,
 *   expectedAiData:object|null,
 *   settlement:object,
 *   campaignState:object,
 *   aiData:object|null,
 * }} request
 * @param {{client?:typeof supabase}} [dependencies]
 */
export async function commitCutTradeRouteCommand(
  request,
  { client = supabase } = {},
) {
  if (!client || typeof client.rpc !== 'function') {
    throw persistenceError({ code: 'canon_command_backend_unavailable' });
  }
  const { data, error } = await client.rpc('apply_cut_trade_route_command', {
    p_expected_owner: request.ownerId,
    p_command_id: request.commandId,
    p_save_id: request.saveId,
    p_expected_revision: request.expectedRevision,
    p_event: request.event,
    p_expected_data: request.expectedSettlement,
    p_expected_campaign_state: request.expectedCampaignState,
    p_expected_ai_data: request.expectedAiData,
    p_next_data: request.settlement,
    p_next_campaign_state: request.campaignState,
    p_next_ai_data: request.aiData,
  });
  if (error) throw persistenceError(error);
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    throw persistenceError({ code: 'canon_command_response_invalid' });
  }
  return {
    status: String(data.status || 'failed'),
    reason: data.reason == null ? null : String(data.reason),
    replayed: data.replayed === true,
    fingerprint: data.fingerprint == null ? null : String(data.fingerprint),
    revisionKind: data.revisionKind
      ?? data.revision_kind
      ?? 'base-projection-v1',
    settlement: data.settlement ?? null,
    campaignState: data.campaignState ?? data.campaign_state ?? null,
    aiData: data.aiData ?? data.ai_data ?? null,
    updatedAt: data.updatedAt ?? data.updated_at ?? null,
    receipt: data.receipt ?? null,
  };
}

/**
 * The BILATERAL sibling (migration 193). Same journal, same command identity, same
 * receipt discipline; it differs only in carrying a second save id and that save's
 * exact base and next projections, because a user route is an edge and an edge with
 * one endpoint written is a corrupt world rather than a partial success.
 *
 * @param {{
 *   ownerId:string,
 *   commandId:string,
 *   saveId:string,
 *   partnerSaveId:string,
 *   expectedRevision:string,
 *   event:object,
 *   expectedSettlement:object,
 *   expectedCampaignState:object,
 *   expectedAiData:object|null,
 *   partnerExpectedSettlement:object,
 *   settlement:object,
 *   campaignState:object,
 *   partnerSettlement:object,
 *   aiData:object|null,
 * }} request
 * @param {{client?:typeof supabase}} [dependencies]
 */
export async function commitCreateRouteCommand(
  request,
  { client = supabase } = {},
) {
  if (!client || typeof client.rpc !== 'function') {
    throw persistenceError({ code: 'canon_command_backend_unavailable' });
  }
  const { data, error } = await client.rpc('apply_create_route_command', {
    p_expected_owner: request.ownerId,
    p_command_id: request.commandId,
    p_save_id: request.saveId,
    p_partner_save_id: request.partnerSaveId,
    p_expected_revision: request.expectedRevision,
    p_event: request.event,
    p_expected_data: request.expectedSettlement,
    p_expected_campaign_state: request.expectedCampaignState,
    p_expected_ai_data: request.expectedAiData,
    p_partner_expected_data: request.partnerExpectedSettlement,
    p_next_data: request.settlement,
    p_next_campaign_state: request.campaignState,
    p_partner_next_data: request.partnerSettlement,
    p_next_ai_data: request.aiData,
  });
  if (error) throw persistenceError(error);
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    throw persistenceError({ code: 'canon_command_response_invalid' });
  }
  return {
    status: String(data.status || 'failed'),
    reason: data.reason == null ? null : String(data.reason),
    replayed: data.replayed === true,
    fingerprint: data.fingerprint == null ? null : String(data.fingerprint),
    routeId: data.routeId ?? data.route_id ?? null,
    revisionKind: data.revisionKind
      ?? data.revision_kind
      ?? 'base-projection-v1',
    settlement: data.settlement ?? null,
    campaignState: data.campaignState ?? data.campaign_state ?? null,
    aiData: data.aiData ?? data.ai_data ?? null,
    partnerSettlement: data.partnerSettlement ?? data.partner_settlement ?? null,
    updatedAt: data.updatedAt ?? data.updated_at ?? null,
    receipt: data.receipt ?? null,
  };
}

/**
 * Read one exact durable canon-event identity through the journal's owner RLS.
 *
 * A missing row is meaningful because migration 183 claims and mutates inside
 * the same PostgreSQL transaction: after this read completes, this command
 * identity owns no committed effect. Recovery still retries only the identical
 * idempotent command, so an older in-flight request that commits immediately
 * afterward can only be replayed, never duplicated.
 *
 * The query addresses owner + command first and validates kind/target in the
 * recovery coordinator. Filtering those fields here would turn a conflicting
 * row into a false "not committed" observation.
 *
 * @param {{ownerId:string, commandId:string}} request
 * @param {{client?:typeof supabase}} [dependencies]
 */
export async function readCanonEventCommandAuthority(
  request,
  { client = supabase } = {},
) {
  if (!isConfigured && client === supabase) {
    throw persistenceError({ code: 'canon_command_journal_not_configured' });
  }
  if (!client || typeof client.from !== 'function') {
    throw persistenceError({ code: 'canon_command_journal_unavailable' });
  }
  const ownerId = String(request?.ownerId || '').trim();
  const commandId = String(request?.commandId || '').trim();
  if (!ownerId || !commandId) {
    throw persistenceError({ code: 'canon_command_journal_identity_missing' });
  }
  const { data, error } = await client
    .from('application_command_journal')
    .select(
      'owner_id, command_id, kind, target_id, phase, status, receipt, failure_code, claimed_at, finalized_at, updated_at',
    )
    .eq('owner_id', ownerId)
    .eq('command_id', commandId)
    .maybeSingle();
  if (error) throw persistenceError(error);
  if (data == null) return null;
  if (typeof data !== 'object' || Array.isArray(data)) {
    throw persistenceError({ code: 'canon_command_journal_response_invalid' });
  }
  return {
    ownerId: String(data.owner_id || ''),
    commandId: String(data.command_id || ''),
    kind: String(data.kind || ''),
    targetId: data.target_id == null ? null : String(data.target_id),
    phase: String(data.phase || ''),
    status: String(data.status || ''),
    receipt: (
      data.receipt
      && typeof data.receipt === 'object'
      && !Array.isArray(data.receipt)
    ) ? data.receipt : null,
    failureCode: data.failure_code == null
      ? null
      : String(data.failure_code),
    claimedAt: data.claimed_at == null ? null : String(data.claimed_at),
    finalizedAt: data.finalized_at == null
      ? null
      : String(data.finalized_at),
    updatedAt: data.updated_at == null ? null : String(data.updated_at),
  };
}
