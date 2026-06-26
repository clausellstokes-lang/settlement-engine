/**
 * campaigns.js — Campaign persistence.
 *
 * Uses the existing saved_maps table for cloud-backed campaign records.
 * The full SettlementForge campaign envelope lives in map_data so newer
 * regional graph / Wizard News / World Pulse fields can evolve without a
 * schema migration for every simulator feature.
 */

import { supabase, isConfigured } from './supabase.js';

const LOCAL_KEY = 'sf_campaigns';
const LOCAL_KEY_PREFIX = 'sf_campaigns:';
const TOMBSTONE_KEY = 'sf_campaign_tombstones';
const TOMBSTONE_KEY_PREFIX = 'sf_campaign_tombstones:';
const MAP_DATA_KIND = 'settlementforge_campaign';
const MAP_DATA_VERSION = 2;
export const ACTIVE_CAMPAIGN_STATE = 'active';

export function isCampaignActive(campaign) {
  return (campaign?.accessState || ACTIVE_CAMPAIGN_STATE) === ACTIVE_CAMPAIGN_STATE;
}

function scopedLocalKey(ownerId) {
  const owner = String(ownerId || 'anon');
  if (owner === 'anon') return LOCAL_KEY;
  return `${LOCAL_KEY_PREFIX}${owner.replace(/[^a-zA-Z0-9_-]/g, '_')}`;
}

function localLoad(ownerId = 'anon') {
  try {
    const raw = JSON.parse(localStorage.getItem(scopedLocalKey(ownerId)) || '[]');
    return Array.isArray(raw) ? raw : [];
  } catch {
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

function campaignFromRow(row) {
  const mapData = row?.map_data || {};
  const payload = mapData.campaign && mapData.kind === MAP_DATA_KIND
    ? mapData.campaign
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
      // Server-owned publish state (migration 045). Read-only on the client:
      // shareMap/unshareMap own these via SECURITY DEFINER RPCs; the campaign
      // write path (rowForCampaign) never echoes them back. They let the gallery
      // match an owned campaign to its anonymized public tile by slug.
      publicSlug: row.public_slug || null,
      isPublic: row.is_public === true,
      shareKind: row.share_kind || 'map',
      galleryDescription: row.gallery_description || '',
      galleryTags: Array.isArray(row.gallery_tags) ? row.gallery_tags : [],
      // NOTE: the 088 gallery columns (image_url/alt/importable/world_sections) are
      // intentionally NOT selected here — the campaign-load path runs for every user
      // on every page and must not depend on 088 being applied. The share editor
      // seeds those from defaults on edit (a minor pre-fill gap); revisit once 088 is
      // universally live. See [[share-to-gallery-redesign]].
    };
  }

  // Legacy saved_maps rows did not know about campaign envelopes. Surface
  // them as simple campaigns instead of hiding user data.
  return {
    id: row.id,
    name: row.name || 'Untitled Campaign',
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    settlementIds: [],
    mapState: {
      schemaVersion: MAP_DATA_VERSION,
      seed: row.map_seed || null,
      fmgSnapshot: mapData?.fmgSnapshot || mapData || null,
      placements: row.burg_settlement_map || {},
      labels: [],
      markers: [],
      forests: [],
      layers: {},
      viewport: {},
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
    publicSlug: row.public_slug || null,
    isPublic: row.is_public === true,
    shareKind: row.share_kind || 'map',
    galleryDescription: row.gallery_description || '',
    galleryTags: Array.isArray(row.gallery_tags) ? row.gallery_tags : [],
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
    .select('id, name, map_seed, map_data, burg_settlement_map, supply_chain_config, access_state, inactive_reason, inactive_since, retention_expires_at, created_at, updated_at, public_slug, is_public, share_kind, gallery_description, gallery_tags')
    .order('updated_at', { ascending: false });
  if (error) throw error;
  return (data || []).map(campaignFromRow);
}

async function supabaseUpsert(campaign) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  const row = rowForCampaign(campaign, user.id);
  const { data, error } = await supabase
    .from('saved_maps')
    .upsert(row, { onConflict: 'id' })
    .select('id')
    .single();
  if (error) throw error;
  return data?.id || campaign.id;
}

async function supabaseWriteAll(campaigns) {
  const results = await Promise.allSettled((campaigns || []).map(campaign => supabaseUpsert(campaign)));
  const failed = results.find(result => result.status === 'rejected');
  if (failed) throw failed.reason;
}

async function supabaseDelete(id) {
  const { error } = await supabase.from('saved_maps').delete().eq('id', id);
  if (error) throw error;
}

/**
 * Atomic world-pulse advance write (migration 069). Persists the ENTIRE advance
 * write-set — every affected member settlement's post-pulse state AND the campaign
 * snapshot — through one SECURITY DEFINER RPC, so the cloud can never hold a
 * partial/hybrid advance (settlement A lands, B fails, campaign behind). The RPC
 * is ownership-checked and locks the campaign row; pass `expectedTick` to enable
 * the stale-apply guard (advance only if the stored tick is strictly behind).
 *
 * HARD DEPENDENCY: migration 069 must be applied. There is intentionally NO serial
 * fallback in cloud mode — a fallback would re-introduce the non-atomic path. On an
 * RPC-missing/error result this throws, and the caller degrades to the honest
 * cloud-pending state (the advance is real locally; a retry/reload reconciles).
 *
 * The `snapshot` is the full map_data envelope (mapDataForCampaign shape) so the
 * RPC writes saved_maps.map_data verbatim and re-derives the same columns
 * rowForCampaign would — keeping the atomic path byte-identical to the upsert path.
 *
 * @param {{ campaignId: string, campaign: any, settlementUpdates?: Array<{saveId:string, settlement?:any, campaignState?:any, versionHistory?:any}>, expectedTick?: number|null }} args
 * @returns {Promise<{ applied: boolean, settlementsWritten?: number, settlementsRequested?: number, reason?: string }>}
 */
async function supabasePersistWorldPulseAdvance({ campaignId, campaign, settlementUpdates = [], expectedTick = null }) {
  const { data, error } = await supabase.rpc('persist_world_pulse_advance', {
    p_campaign_id: campaignId,
    p_campaign_snapshot: mapDataForCampaign(campaign),
    p_settlement_updates: settlementUpdates,
    p_expected_tick: expectedTick == null ? null : Number(expectedTick),
  });
  if (error) throw error;
  return data || { applied: false };
}

async function localList(ownerId = 'anon') {
  return localLoad(ownerId);
}

async function localUpsert(campaign, ownerId = 'anon') {
  const campaigns = localLoad(ownerId);
  const idx = campaigns.findIndex(item => String(item.id) === String(campaign.id));
  const next = { ...campaign, updatedAt: campaign.updatedAt || new Date().toISOString() };
  if (idx >= 0) campaigns[idx] = next;
  else campaigns.unshift(next);
  localWrite(campaigns, ownerId);
  return next.id;
}

async function localWriteAll(campaigns, ownerId = 'anon') {
  localWrite(campaigns, ownerId);
}

async function localDelete(id, ownerId = 'anon') {
  localWrite(localLoad(ownerId).filter(campaign => String(campaign.id) !== String(id)), ownerId);
}

export const campaigns = {
  list: isConfigured ? supabaseList : localList,
  upsert: isConfigured ? supabaseUpsert : localUpsert,
  /** Atomic world-pulse advance write (cloud only — null in local mode, where the
   *  single localStorage write has no cross-row hybrid risk). See the helper. */
  persistWorldPulseAdvance: isConfigured ? supabasePersistWorldPulseAdvance : null,
  writeAll: isConfigured ? supabaseWriteAll : localWriteAll,
  delete: isConfigured ? supabaseDelete : localDelete,
  cache: localWrite,
  loadCached: localLoad,
  clearCache: localClear,
  // Deletion tombstones (always local, owner-scoped — see above).
  loadTombstones,
  writeTombstones,
  recordTombstone,
  isConfigured,
};
