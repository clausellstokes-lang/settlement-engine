/**
 * campaigns.js — Campaign persistence.
 *
 * Uses the existing saved_maps table for cloud-backed campaign records.
 * The full SettlementForge campaign envelope lives in map_data so newer
 * regional graph / Wizard News / World Pulse fields can evolve without a
 * schema migration for every simulator feature.
 */

import { supabase, isConfigured } from './supabase.js';
import {
  admitCampaignContentBinding,
} from '../domain/content/campaignContentBinding.js';
import {
  admitCampaignContentBindingHistory,
} from '../domain/content/campaignContentBindingHistory.js';
import { withLocalAuthorityLock } from './localAuthorityMutex.js';

const LOCAL_KEY = 'sf_campaigns';
const LOCAL_KEY_PREFIX = 'sf_campaigns:';
const TOMBSTONE_KEY = 'sf_campaign_tombstones';
const TOMBSTONE_KEY_PREFIX = 'sf_campaign_tombstones:';
const MAP_DATA_KIND = 'settlementforge_campaign';
const MAP_DATA_VERSION = 2;
export const ACTIVE_CAMPAIGN_STATE = 'active';
const ADMISSION_STATUS = Object.freeze({
  CURRENT: 'current',
  MIGRATED: 'migrated',
  REJECTED: 'rejected',
});
const lastCampaignAdmissionDiagnostics = new Map();

export function isCampaignActive(campaign) {
  return (campaign?.accessState || ACTIVE_CAMPAIGN_STATE) === ACTIVE_CAMPAIGN_STATE;
}

function scopedLocalKey(ownerId) {
  const owner = String(ownerId || 'anon');
  if (owner === 'anon') return LOCAL_KEY;
  return `${LOCAL_KEY_PREFIX}${owner.replace(/[^a-zA-Z0-9_-]/g, '_')}`;
}

/** @param {unknown} value */
function isRecord(value) {
  return value != null && typeof value === 'object' && !Array.isArray(value);
}

/** @param {unknown} value */
function isPersistedId(value) {
  return (
    (typeof value === 'string' && value.trim() !== '')
    || (typeof value === 'number' && Number.isFinite(value))
  );
}

function diagnosticSummary(source, ownerId, entries) {
  const counts = { current: 0, migrated: 0, rejected: 0 };
  for (const entry of entries) counts[entry.status] += 1;
  return Object.freeze({
    source,
    ownerId: String(ownerId || 'anon'),
    ...counts,
    entries: Object.freeze(entries.map(entry => Object.freeze(entry))),
  });
}

function campaignRejection(index, campaign, code) {
  return {
    status: ADMISSION_STATUS.REJECTED,
    index,
    id: isPersistedId(campaign?.id) ? String(campaign.id) : null,
    code,
  };
}

function invalidCurrentMapState(mapState) {
  if (!isRecord(mapState)) return 'campaign_map_state_invalid';
  const version = mapState.schemaVersion == null ? 0 : Number(mapState.schemaVersion);
  if (!Number.isInteger(version) || version < 0) {
    return 'campaign_map_schema_version_invalid';
  }
  if (version > MAP_DATA_VERSION) return 'campaign_map_version_unsupported';

  // Versions 0/1 are admitted for campaignSlice's established v1 → v2
  // migration. Their placements may be either the historical array or a map.
  if (version < MAP_DATA_VERSION) {
    if (
      mapState.placements != null
      && !Array.isArray(mapState.placements)
      && !isRecord(mapState.placements)
    ) {
      return 'campaign_legacy_placements_invalid';
    }
    return null;
  }

  if (mapState.placements != null && !isRecord(mapState.placements)) {
    return 'campaign_placements_invalid';
  }
  for (const field of ['labels', 'markers', 'forests']) {
    if (mapState[field] != null && !Array.isArray(mapState[field])) {
      return `campaign_${field}_invalid`;
    }
  }
  for (const field of ['layers', 'viewport']) {
    if (mapState[field] != null && !isRecord(mapState[field])) {
      return `campaign_${field}_invalid`;
    }
  }
  if (
    mapState.fmgSnapshot != null
    && typeof mapState.fmgSnapshot !== 'string'
  ) {
    return 'campaign_fmg_snapshot_invalid';
  }
  return null;
}

/**
 * Admit unwrapped campaign envelopes from one owner-scoped local cache.
 *
 * The parser is intentionally campaign-specific. It recognizes the v1 map
 * shape that campaignSlice already migrates, refuses unsupported future map
 * versions instead of misreading them as v1, and drops only the malformed
 * sibling from the active result.
 *
 * @param {unknown} value
 * @param {{source?:string, ownerId?:string}} [options]
 */
export function admitCampaignEntries(
  value,
  { source = 'campaign-cache', ownerId = 'anon' } = {},
) {
  if (!Array.isArray(value)) {
    return {
      entries: [],
      diagnostics: diagnosticSummary(source, ownerId, [{
        status: ADMISSION_STATUS.REJECTED,
        index: null,
        id: null,
        code: 'cache_root_not_array',
      }]),
    };
  }

  const entries = [];
  const diagnostics = [];
  value.forEach((campaign, index) => {
    if (!isRecord(campaign)) {
      diagnostics.push(campaignRejection(index, campaign, 'campaign_envelope_not_object'));
      return;
    }
    if (campaign.id != null && !isPersistedId(campaign.id)) {
      diagnostics.push(campaignRejection(index, campaign, 'campaign_id_invalid'));
      return;
    }
    if (campaign.name != null && typeof campaign.name !== 'string') {
      diagnostics.push(campaignRejection(index, campaign, 'campaign_name_invalid'));
      return;
    }
    if (
      campaign.settlementIds != null
      && !Array.isArray(campaign.settlementIds)
      && typeof campaign.settlementIds !== 'string'
    ) {
      diagnostics.push(campaignRejection(index, campaign, 'campaign_membership_invalid'));
      return;
    }
    if (
      Array.isArray(campaign.settlementIds)
      && campaign.settlementIds.some(id => !isPersistedId(id))
    ) {
      diagnostics.push(campaignRejection(index, campaign, 'campaign_member_id_invalid'));
      return;
    }
    const mapError = campaign.mapState == null
      ? null
      : invalidCurrentMapState(campaign.mapState);
    if (mapError) {
      diagnostics.push(campaignRejection(index, campaign, mapError));
      return;
    }
    const recordFields = ['regionalGraph', 'wizardNews', 'worldState'];
    const invalidRecordField = recordFields.find(
      field => campaign[field] != null && !isRecord(campaign[field]),
    );
    if (invalidRecordField) {
      diagnostics.push(campaignRejection(index, campaign, `${invalidRecordField}_invalid`));
      return;
    }

    let admittedCampaign = campaign;
    if (campaign.contentBinding != null) {
      const contentAdmission = admitCampaignContentBinding(campaign.contentBinding);
      if (!contentAdmission.ok) {
        diagnostics.push(campaignRejection(
          index,
          campaign,
          contentAdmission.reason || 'campaign_content_binding_invalid',
        ));
        return;
      }
      admittedCampaign = {
        ...campaign,
        contentBinding: contentAdmission.binding,
      };
    }
    if (campaign.contentBindingHistory != null) {
      const historyAdmission = admitCampaignContentBindingHistory(
        campaign.contentBindingHistory,
      );
      if (!historyAdmission.ok) {
        diagnostics.push(campaignRejection(
          index,
          campaign,
          historyAdmission.reason || 'campaign_content_history_invalid',
        ));
        return;
      }
      admittedCampaign = {
        ...admittedCampaign,
        contentBindingHistory: historyAdmission.history,
      };
    }

    // This wall reports only migrations that it actually performs. A missing
    // content binding remains deliberately pending until campaignSlice can pin
    // the correct owner's hydrated library as one immutable legacy cutoff.
    // Claiming that untouched state was migrated here would make the diagnostic
    // lie and conflate safe admission with the later owner-aware migration.
    const migrationCodes = [];
    if (!isUuid(campaign.id)) migrationCodes.push('legacy_campaign_id');
    if (!Array.isArray(campaign.settlementIds)) {
      migrationCodes.push('legacy_campaign_membership');
    }
    const mapVersion = campaign.mapState?.schemaVersion == null
      ? 0
      : Number(campaign.mapState.schemaVersion);
    if (campaign.mapState && mapVersion < MAP_DATA_VERSION) {
      migrationCodes.push('legacy_campaign_map');
    }
    if (!campaign.accessState) migrationCodes.push('legacy_access_state');

    entries.push(admittedCampaign);
    diagnostics.push({
      status: migrationCodes.length
        ? ADMISSION_STATUS.MIGRATED
        : ADMISSION_STATUS.CURRENT,
      index,
      id: isPersistedId(campaign.id) ? String(campaign.id) : null,
      code: migrationCodes.join(',') || 'current',
      sourceVersion: campaign.mapState ? Number(mapVersion) : null,
      targetVersion: campaign.mapState ? MAP_DATA_VERSION : null,
    });
  });

  return {
    entries,
    diagnostics: diagnosticSummary(source, ownerId, diagnostics),
  };
}

function localLoad(ownerId = 'anon') {
  try {
    const parsed = JSON.parse(localStorage.getItem(scopedLocalKey(ownerId)) || '[]');
    const admitted = admitCampaignEntries(parsed, {
      source: 'local-cache',
      ownerId,
    });
    lastCampaignAdmissionDiagnostics.set(String(ownerId || 'anon'), admitted.diagnostics);
    return admitted.entries;
  } catch {
    lastCampaignAdmissionDiagnostics.set(
      String(ownerId || 'anon'),
      diagnosticSummary('local-cache', ownerId, [{
        status: ADMISSION_STATUS.REJECTED,
        index: null,
        id: null,
        code: 'cache_json_invalid',
      }]),
    );
    return [];
  }
}

function localWrite(campaigns, ownerId = 'anon') {
  localStorage.setItem(scopedLocalKey(ownerId), JSON.stringify(campaigns || []));
}

function localClear(ownerId = 'anon') {
  localStorage.removeItem(scopedLocalKey(ownerId));
}

// ── Deletion tombstones ──────────────────────────────────────────────────────
// A per-owner local record of campaigns this device deleted. mergeCampaignLists
// consumes these so a stale cache copy (or an in-flight list() that resolves
// after the delete) can't merge a just-removed campaign back in. Always local —
// the cloud row is hard-deleted; the tombstone only guards this device until the
// delete propagates and is then pruned by reconcileTombstones.

function scopedTombstoneKey(ownerId) {
  const owner = String(ownerId || 'anon');
  if (owner === 'anon') return TOMBSTONE_KEY;
  return `${TOMBSTONE_KEY_PREFIX}${owner.replace(/[^a-zA-Z0-9_-]/g, '_')}`;
}

function loadTombstones(ownerId = 'anon') {
  try {
    const raw = JSON.parse(localStorage.getItem(scopedTombstoneKey(ownerId)) || '[]');
    return Array.isArray(raw) ? raw.filter(entry => entry?.id != null) : [];
  } catch {
    return [];
  }
}

function writeTombstones(tombstones, ownerId = 'anon') {
  localStorage.setItem(scopedTombstoneKey(ownerId), JSON.stringify(tombstones || []));
}

function recordTombstone(id, ownerId = 'anon') {
  if (id == null) return;
  const key = String(id);
  const next = loadTombstones(ownerId).filter(entry => String(entry.id) !== key);
  next.push({ id: key, deletedAt: new Date().toISOString() });
  writeTombstones(next, ownerId);
}

function isUuid(value) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(value || ''));
}

function mapDataForCampaign(campaign) {
  return {
    kind: MAP_DATA_KIND,
    version: MAP_DATA_VERSION,
    campaign,
  };
}

function looksLikeUnwrappedCampaign(mapData) {
  return (
    isRecord(mapData.mapState)
    || mapData.settlementIds != null
    || isRecord(mapData.regionalGraph)
    || isRecord(mapData.wizardNews)
    || isRecord(mapData.worldState)
  );
}

function inspectSupabaseCampaignRow(row) {
  if (!isRecord(row)) return { code: 'supabase_row_not_object' };
  if (!isPersistedId(row.id)) return { code: 'campaign_id_invalid' };
  if (row.map_data != null && !isRecord(row.map_data)) {
    return { code: 'map_data_jsonb_invalid' };
  }
  if (row.burg_settlement_map != null && !isRecord(row.burg_settlement_map)) {
    return { code: 'burg_settlement_map_jsonb_invalid' };
  }
  if (
    row.supply_chain_config != null
    && !Array.isArray(row.supply_chain_config)
  ) {
    return { code: 'supply_chain_config_jsonb_invalid' };
  }

  const mapData = row.map_data || {};
  if (mapData.kind === MAP_DATA_KIND) {
    if (!isRecord(mapData.campaign)) {
      return { code: 'campaign_payload_jsonb_invalid' };
    }
    const version = mapData.version == null ? 1 : Number(mapData.version);
    if (!Number.isInteger(version) || version < 1) {
      return { code: 'campaign_envelope_version_invalid' };
    }
    if (version > MAP_DATA_VERSION) {
      return { code: 'campaign_envelope_version_unsupported' };
    }
    return {
      code: null,
      shape: 'versioned_campaign_envelope',
      migrationCode: version < MAP_DATA_VERSION
        ? 'legacy_campaign_envelope'
        : null,
      sourceVersion: version,
    };
  }
  if (Object.hasOwn(mapData, 'campaign')) {
    if (mapData.kind != null) {
      return { code: 'campaign_envelope_kind_invalid' };
    }
    if (!isRecord(mapData.campaign)) {
      return { code: 'campaign_payload_jsonb_invalid' };
    }
    return {
      code: null,
      shape: 'untagged_campaign_envelope',
      migrationCode: 'legacy_untagged_campaign_envelope',
      sourceVersion: 0,
    };
  }
  if (looksLikeUnwrappedCampaign(mapData)) {
    return {
      code: null,
      shape: 'unwrapped_campaign',
      migrationCode: 'legacy_unwrapped_campaign',
      sourceVersion: 0,
    };
  }
  // Rows created before campaign envelopes held the FMG payload directly.
  return {
    code: null,
    shape: 'legacy_saved_map',
    migrationCode: 'legacy_saved_map',
    sourceVersion: 0,
  };
}

function campaignFromRow(row, inspection) {
  const mapData = row?.map_data || {};
  const payload = inspection.shape === 'versioned_campaign_envelope'
    || inspection.shape === 'untagged_campaign_envelope'
    ? mapData.campaign
    : inspection.shape === 'unwrapped_campaign'
      ? mapData
      : null;
  if (payload && typeof payload === 'object') {
    return {
      ...payload,
      id: isUuid(payload.id) ? payload.id : row.id,
      name: payload.name || row.name,
      createdAt: payload.createdAt || row.created_at,
      updatedAt: row.updated_at || payload.updatedAt,
      accessState: row.access_state || ACTIVE_CAMPAIGN_STATE,
      inactiveReason: row.inactive_reason || null,
      inactiveSince: row.inactive_since || null,
      retentionExpiresAt: row.retention_expires_at || null,
    };
  }

  // Legacy saved_maps rows did not know about campaign envelopes. Surface
  // them as simple campaigns instead of hiding user data. Preserve unknown
  // map-state keys while normalizing the fields current consumers depend on.
  const legacyMapState = isRecord(mapData.mapState) ? mapData.mapState : mapData;
  return {
    id: row.id,
    name: row.name || 'Untitled Campaign',
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    settlementIds: [],
    mapState: {
      ...legacyMapState,
      schemaVersion: MAP_DATA_VERSION,
      seed: row.map_seed ?? legacyMapState.seed ?? legacyMapState.mapSeed ?? null,
      fmgSnapshot: typeof legacyMapState.fmgSnapshot === 'string'
        ? legacyMapState.fmgSnapshot
        : null,
      placements: row.burg_settlement_map
        || (isRecord(legacyMapState.placements) ? legacyMapState.placements : {}),
      labels: Array.isArray(legacyMapState.labels) ? legacyMapState.labels : [],
      markers: Array.isArray(legacyMapState.markers) ? legacyMapState.markers : [],
      forests: Array.isArray(legacyMapState.forests) ? legacyMapState.forests : [],
      layers: isRecord(legacyMapState.layers) ? legacyMapState.layers : {},
      viewport: isRecord(legacyMapState.viewport) ? legacyMapState.viewport : {},
      savedAt: row.updated_at,
    },
    regionalGraph: null,
    wizardNews: null,
    worldState: null,
    collapsed: false,
    accessState: row.access_state || ACTIVE_CAMPAIGN_STATE,
    inactiveReason: row.inactive_reason || null,
    inactiveSince: row.inactive_since || null,
    retentionExpiresAt: row.retention_expires_at || null,
  };
}

function rowForCampaign(campaign, userId) {
  const mapState = campaign?.mapState || {};
  const row = {
    user_id: userId,
    name: campaign?.name || 'Untitled Campaign',
    map_seed: mapState.seed || null,
    map_data: mapDataForCampaign(campaign),
    burg_settlement_map: mapState.placements || {},
    supply_chain_config: campaign?.regionalGraph?.channels || [],
  };
  if (isUuid(campaign?.id)) row.id = campaign.id;
  return row;
}

async function supabaseList() {
  const { data, error } = await supabase
    .from('saved_maps')
    .select('id, name, map_seed, map_data, burg_settlement_map, supply_chain_config, access_state, inactive_reason, inactive_since, retention_expires_at, created_at, updated_at')
    .order('updated_at', { ascending: false });
  if (error) throw error;
  const admitted = admitSupabaseCampaignRows(data || []);
  lastCampaignAdmissionDiagnostics.set('cloud', admitted.diagnostics);
  return admitted.entries;
}

/**
 * Parse Supabase's saved_maps row envelope before a JSONB default can conceal a
 * malformed value. Each row is admitted independently, so one broken campaign
 * cannot hide the owner's other campaigns.
 *
 * @param {unknown} value
 */
export function admitSupabaseCampaignRows(value) {
  if (!Array.isArray(value)) {
    return {
      entries: [],
      diagnostics: diagnosticSummary('supabase', 'cloud', [{
        status: ADMISSION_STATUS.REJECTED,
        index: null,
        id: null,
        code: 'supabase_result_not_array',
      }]),
    };
  }

  const entries = [];
  const diagnostics = [];
  value.forEach((row, index) => {
    const inspection = inspectSupabaseCampaignRow(row);
    if (inspection.code) {
      diagnostics.push(campaignRejection(index, row, inspection.code));
      return;
    }

    const campaign = campaignFromRow(row, inspection);
    const nested = admitCampaignEntries([campaign], {
      source: 'supabase',
      ownerId: 'cloud',
    });
    const nestedDiagnostic = nested.diagnostics.entries[0];
    if (!nested.entries.length || nestedDiagnostic?.status === ADMISSION_STATUS.REJECTED) {
      diagnostics.push({
        ...(nestedDiagnostic || campaignRejection(index, campaign, 'campaign_payload_invalid')),
        index,
      });
      return;
    }

    const codes = [
      inspection.migrationCode,
      nestedDiagnostic?.status === ADMISSION_STATUS.MIGRATED
        ? nestedDiagnostic.code
        : null,
    ].filter(Boolean);
    entries.push(nested.entries[0]);
    diagnostics.push({
      status: codes.length ? ADMISSION_STATUS.MIGRATED : ADMISSION_STATUS.CURRENT,
      index,
      id: String(campaign.id),
      code: codes.join(',') || 'current',
      sourceVersion: inspection.sourceVersion,
      targetVersion: MAP_DATA_VERSION,
    });
  });

  return {
    entries,
    diagnostics: diagnosticSummary('supabase', 'cloud', diagnostics),
  };
}

// ── Campaign persistence owner/session fence ─────────────────────────────────
//
// This service keeps a campaign-specific error shape even though saves.js uses
// the same capture/recheck discipline. The stable code is shared by callers;
// the domain message and write coordinator remain visible at this boundary.

function campaignAuthSessionChangedError(expectedOwnerId, actualOwnerId = null) {
  return Object.assign(
    new Error('Campaign persistence belongs to a different authenticated account.'),
    {
      code: 'auth_session_changed',
      expectedOwnerId: String(expectedOwnerId || 'anon'),
      actualOwnerId: actualOwnerId == null ? null : String(actualOwnerId),
    },
  );
}

function assertCampaignSessionCurrent(expectedOwnerId, isSessionCurrent, actualOwnerId = null) {
  if (isSessionCurrent && !isSessionCurrent()) {
    throw campaignAuthSessionChangedError(expectedOwnerId, actualOwnerId);
  }
}

/**
 * Verify the authenticated campaign owner on both sides of auth.getUser().
 *
 * The post-await check closes same-owner session rotation, which an owner-id
 * comparison alone cannot detect.
 */
async function assertExpectedSupabaseOwner(expectedOwnerId, isSessionCurrent = null) {
  assertCampaignSessionCurrent(expectedOwnerId, isSessionCurrent);
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  if (String(user.id) !== String(expectedOwnerId || 'anon')) {
    throw campaignAuthSessionChangedError(expectedOwnerId, user.id);
  }
  // Same-owner SIGNED_IN can rotate the campaign generation while getUser()
  // is suspended. Re-check after it resolves, before constructing the write.
  assertCampaignSessionCurrent(expectedOwnerId, isSessionCurrent, user.id);
  return user;
}

async function supabaseUpsert(campaign, expectedOwnerId = 'anon', isSessionCurrent = null) {
  const user = await assertExpectedSupabaseOwner(expectedOwnerId, isSessionCurrent);
  const row = rowForCampaign(campaign, user.id);
  assertCampaignSessionCurrent(expectedOwnerId, isSessionCurrent, user.id);
  const { data, error } = await supabase
    .from('saved_maps')
    .upsert(row, { onConflict: 'id' })
    .select('id')
    .single();
  if (error) throw error;
  return data?.id || campaign.id;
}

async function supabaseCompareAndSwapContentBinding(
  _campaign,
  command,
  expectedOwnerId = 'anon',
  isSessionCurrent = null,
) {
  const {
    admitCampaignContentBindingCasReceipt,
  } = await import('./campaignContentBindingCas.js');
  const user = await assertExpectedSupabaseOwner(
    expectedOwnerId,
    isSessionCurrent,
  );
  const { data, error } = await supabase.rpc(
    'compare_and_swap_campaign_content_binding',
    {
      p_expected_owner: user.id,
      p_command_id: command.commandId,
      p_fingerprint: command.fingerprint,
      p_campaign_id: command.campaignId,
      p_expected_binding_hash: command.expectedBindingHash,
      p_target_binding: command.targetBinding,
      p_content_binding_history: command.contentBindingHistory,
    },
  );
  if (error) throw error;
  // A committed response belongs only to the session that initiated it. The
  // server result stays durable and idempotently replayable, but it must never
  // mutate a replacement account's in-memory campaign state.
  assertCampaignSessionCurrent(expectedOwnerId, isSessionCurrent, user.id);
  return admitCampaignContentBindingCasReceipt(data, command);
}

async function supabaseWriteAll(campaigns, expectedOwnerId = 'anon', isSessionCurrent = null) {
  const results = await Promise.allSettled(
    (campaigns || []).map(campaign =>
      supabaseUpsert(campaign, expectedOwnerId, isSessionCurrent)),
  );
  const failed = results.find(result => result.status === 'rejected');
  if (failed) throw failed.reason;
}

async function supabaseDelete(id, expectedOwnerId = 'anon', isSessionCurrent = null) {
  await assertExpectedSupabaseOwner(expectedOwnerId, isSessionCurrent);
  assertCampaignSessionCurrent(expectedOwnerId, isSessionCurrent, expectedOwnerId);
  // Keep the expected owner in the SQL predicate too. Auth can rotate after
  // getUser() yields; this second wall prevents a same-id B row from matching
  // even if the request is ultimately sent with B's session.
  const { data, error } = await supabase
    .from('saved_maps')
    .delete()
    .eq('id', id)
    .eq('user_id', expectedOwnerId)
    .select('id');
  if (error) throw error;
  const deleted = (Array.isArray(data) ? data : data ? [data] : [])
    .some(row => String(row?.id) === String(id));
  // A returned row is proof that the expected owner's delete committed. Do not
  // reinterpret that success if auth rotates while the response is in flight;
  // the caller will tombstone A and avoid touching the replacement session.
  if (deleted) return id;
  // Zero rows can mean either "already absent" or that an auth rotation made the
  // request unable to delete A. Re-read both owner and generation before granting
  // idempotent success so a stale caller never finalizes a false delete.
  await assertExpectedSupabaseOwner(expectedOwnerId, isSessionCurrent);
  const { data: remaining, error: confirmError } = await supabase
    .from('saved_maps')
    .select('id')
    .eq('id', id)
    .eq('user_id', expectedOwnerId)
    .maybeSingle();
  if (confirmError) throw confirmError;
  if (remaining?.id != null) {
    throw Object.assign(
      new Error('Campaign delete did not confirm the requested row.'),
      { code: 'campaign_delete_unconfirmed' },
    );
  }
  return null;
}

async function localList(ownerId = 'anon') {
  return localLoad(ownerId);
}

async function localUpsert(campaign, ownerId = 'anon', isSessionCurrent = null) {
  assertCampaignSessionCurrent(ownerId, isSessionCurrent, ownerId);
  const campaigns = localLoad(ownerId);
  const idx = campaigns.findIndex(item => String(item.id) === String(campaign.id));
  const next = { ...campaign, updatedAt: campaign.updatedAt || new Date().toISOString() };
  if (idx >= 0) campaigns[idx] = next;
  else campaigns.unshift(next);
  localWrite(campaigns, ownerId);
  return next.id;
}

async function localCompareAndSwapContentBinding(
  _campaign,
  command,
  ownerId = 'anon',
  isSessionCurrent = null,
) {
  const {
    applyLocalCampaignContentBindingCas,
  } = await import('./campaignContentBindingCas.js');
  assertCampaignSessionCurrent(ownerId, isSessionCurrent, ownerId);
  const result = await withLocalAuthorityLock(
    'campaign-cache',
    String(ownerId || 'anon'),
    () => {
      const applied = applyLocalCampaignContentBindingCas(
        localLoad(ownerId),
        command,
      );
      if (applied.receipt.ok) {
        localWrite(applied.campaigns, ownerId);
      }
      return applied;
    },
  );
  assertCampaignSessionCurrent(ownerId, isSessionCurrent, ownerId);
  return result.receipt;
}

async function localWriteAll(campaigns, ownerId = 'anon', isSessionCurrent = null) {
  assertCampaignSessionCurrent(ownerId, isSessionCurrent, ownerId);
  localWrite(campaigns, ownerId);
}

async function localDelete(id, ownerId = 'anon', isSessionCurrent = null) {
  assertCampaignSessionCurrent(ownerId, isSessionCurrent, ownerId);
  localWrite(localLoad(ownerId).filter(campaign => String(campaign.id) !== String(id)), ownerId);
}

// ── Per-campaign write/delete coordinator ────────────────────────────────────
//
// Campaign rows are whole-envelope upserts. A delete that races an older or
// newly-started upsert can otherwise "succeed" and then be recreated by the
// later write. Keep one write tail per campaign id and reserve an id as soon as
// deletion starts: writes already running finish before the queued delete,
// while writes that start after the reservation fail closed.
const campaignWriteTails = new Map();
const campaignDeleteReservations = new Set();

function campaignWriteKey(id, ownerId = 'anon') {
  return id == null ? null : `${String(ownerId || 'anon')}\u0000${String(id)}`;
}

function campaignDeleteInFlightError(id) {
  return Object.assign(
    new Error(`Campaign ${String(id)} is being deleted.`),
    { code: 'campaign_delete_in_flight' },
  );
}

function enqueueCampaignWrite(id, ownerId, operation) {
  const key = campaignWriteKey(id, ownerId);
  if (key == null) return Promise.resolve().then(operation);
  const previous = campaignWriteTails.get(key) || Promise.resolve();
  const current = previous.catch(() => {}).then(operation);
  const tail = current.catch(() => {});
  campaignWriteTails.set(key, tail);
  tail.finally(() => {
    if (campaignWriteTails.get(key) === tail) {
      campaignWriteTails.delete(key);
    }
  });
  return current;
}

function reserveCampaignDelete(id, ownerId = 'anon') {
  const key = campaignWriteKey(id, ownerId);
  if (key == null) return false;
  if (campaignDeleteReservations.has(key)) return false;
  campaignDeleteReservations.add(key);
  return true;
}

function releaseCampaignDelete(id, ownerId = 'anon') {
  const key = campaignWriteKey(id, ownerId);
  if (key != null) campaignDeleteReservations.delete(key);
}

function isCampaignDeleteReserved(id, ownerId = 'anon') {
  const key = campaignWriteKey(id, ownerId);
  return key != null && campaignDeleteReservations.has(key);
}

const rawUpsert = isConfigured ? supabaseUpsert : localUpsert;
const rawCompareAndSwapContentBinding = isConfigured
  ? supabaseCompareAndSwapContentBinding
  : localCompareAndSwapContentBinding;
const rawWriteAll = isConfigured ? supabaseWriteAll : localWriteAll;
const rawDelete = isConfigured ? supabaseDelete : localDelete;

async function coordinatedUpsert(campaign, ownerId = 'anon', isSessionCurrent = null) {
  const id = campaign?.id;
  assertCampaignSessionCurrent(ownerId, isSessionCurrent, ownerId);
  if (isCampaignDeleteReserved(id, ownerId)) throw campaignDeleteInFlightError(id);
  return enqueueCampaignWrite(id, ownerId, () => {
    assertCampaignSessionCurrent(ownerId, isSessionCurrent, ownerId);
    if (isCampaignDeleteReserved(id, ownerId)) throw campaignDeleteInFlightError(id);
    return rawUpsert(campaign, ownerId, isSessionCurrent);
  });
}

async function coordinatedCompareAndSwapContentBinding(
  campaign,
  options = {},
  ownerId = 'anon',
  isSessionCurrent = null,
) {
  const {
    makeCampaignContentBindingCasCommand,
  } = await import('./campaignContentBindingCas.js');
  const id = campaign?.id;
  const command = makeCampaignContentBindingCasCommand({
    campaignId: id,
    expectedBindingHash: options.expectedBindingHash,
    targetBinding: campaign?.contentBinding,
    contentBindingHistory: campaign?.contentBindingHistory || [],
    previewFingerprint: options.previewFingerprint,
  });
  assertCampaignSessionCurrent(ownerId, isSessionCurrent, ownerId);
  if (isCampaignDeleteReserved(id, ownerId)) {
    throw campaignDeleteInFlightError(id);
  }
  return enqueueCampaignWrite(id, ownerId, () => {
    assertCampaignSessionCurrent(ownerId, isSessionCurrent, ownerId);
    if (isCampaignDeleteReserved(id, ownerId)) {
      throw campaignDeleteInFlightError(id);
    }
    return rawCompareAndSwapContentBinding(
      campaign,
      command,
      ownerId,
      isSessionCurrent,
    );
  });
}

async function coordinatedWriteAll(campaigns, ownerId = 'anon', isSessionCurrent = null) {
  assertCampaignSessionCurrent(ownerId, isSessionCurrent, ownerId);
  const blocked = (campaigns || []).find(
    campaign => isCampaignDeleteReserved(campaign?.id, ownerId),
  );
  if (blocked) throw campaignDeleteInFlightError(blocked.id);
  if (isConfigured) {
    await Promise.all(
      (campaigns || []).map(campaign =>
        coordinatedUpsert(campaign, ownerId, isSessionCurrent)),
    );
    return;
  }
  return rawWriteAll(campaigns, ownerId, isSessionCurrent);
}

async function coordinatedDelete(id, ownerId = 'anon', isSessionCurrent = null) {
  // The store reserves synchronously before its first await. Keep this
  // idempotent so legacy/direct callers receive the same protection.
  reserveCampaignDelete(id, ownerId);
  try {
    return await enqueueCampaignWrite(id, ownerId, () => {
      assertCampaignSessionCurrent(ownerId, isSessionCurrent, ownerId);
      return rawDelete(id, ownerId, isSessionCurrent);
    });
  } catch (error) {
    // A failed delete leaves the campaign retryable and writable.
    releaseCampaignDelete(id, ownerId);
    throw error;
  }
}

export const campaigns = {
  list: isConfigured ? supabaseList : localList,
  upsert: coordinatedUpsert,
  compareAndSwapContentBinding: coordinatedCompareAndSwapContentBinding,
  writeAll: coordinatedWriteAll,
  delete: coordinatedDelete,
  reserveDelete: reserveCampaignDelete,
  releaseDelete: releaseCampaignDelete,
  isDeleteReserved: isCampaignDeleteReserved,
  cache: localWrite,
  cacheContentBindingProjection: (
    campaign,
    expectedBindingHashes = [],
    ownerId = 'anon',
  ) => import('./campaignContentBindingCache.js').then(({
    cacheCampaignContentBindingProjection,
  }) => cacheCampaignContentBindingProjection(
    campaign,
    ownerId,
    expectedBindingHashes,
    localLoad,
    localWrite,
  )),
  loadCached: localLoad,
  clearCache: localClear,
  // Deletion tombstones (always local, owner-scoped — see above).
  loadTombstones,
  writeTombstones,
  recordTombstone,
  /** Owner-scoped accounting only; rejected campaign payloads are never retained. */
  getAdmissionDiagnostics: (ownerId = isConfigured ? 'cloud' : 'anon') => (
    lastCampaignAdmissionDiagnostics.get(String(ownerId || 'anon'))
    || diagnosticSummary('not-read', ownerId, [])
  ),
  isConfigured,
};
