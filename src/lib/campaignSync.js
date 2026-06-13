/**
 * campaignSync.js — merge and sync policy for campaign persistence.
 *
 * The store owns UI state; this module owns the dull but important rule:
 * local cache and cloud rows are peers for campaign content, and loading
 * cloud data must never erase a local-only campaign that has not been
 * uploaded yet. Server-owned access and retention fields are authoritative.
 */

function parseTime(value) {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (!value) return 0;
  const ms = Date.parse(value);
  return Number.isFinite(ms) ? ms : 0;
}

export function campaignUpdatedAtMs(campaign) {
  if (!campaign || typeof campaign !== 'object') return 0;
  return Math.max(
    parseTime(campaign.updatedAt),
    parseTime(campaign.mapState?.savedAt),
    parseTime(campaign.savedAt),
    parseTime(campaign.createdAt),
  );
}

function cloneJson(value) {
  if (value === undefined || value === null) return value;
  return JSON.parse(JSON.stringify(value));
}

export function campaignSignature(campaign) {
  if (!campaign || typeof campaign !== 'object') return JSON.stringify(campaign ?? null);
  // `pendingSync` is local-only sync bookkeeping (never-synced marker). It must
  // not feed the signature, or merge's clearing of it (pendingSync:false on a
  // remote-confirmed campaign) would look like a content change and re-upload
  // every cloud campaign on every load.
  const { pendingSync: _pendingSync, ...rest } = campaign;
  try {
    return JSON.stringify(rest);
  } catch {
    return JSON.stringify({
      id: campaign?.id,
      name: campaign?.name,
      updatedAt: campaign?.updatedAt,
      mapSavedAt: campaign?.mapState?.savedAt,
    });
  }
}

const TOMBSTONE_TTL_MS = 1000 * 60 * 60 * 24 * 90; // 90 days

function normalizeTombstones(tombstones) {
  const map = new Map();
  if (!tombstones) return map;
  const entries = tombstones instanceof Map
    ? Array.from(tombstones, ([id, deletedAt]) => ({ id, deletedAt }))
    : (Array.isArray(tombstones) ? tombstones : []);
  for (const entry of entries) {
    if (!entry || entry.id == null) continue;
    map.set(String(entry.id), parseTime(entry.deletedAt));
  }
  return map;
}

/**
 * Drop deletion tombstones that have done their job so the per-owner list stays
 * bounded. A tombstone is retained while the cloud still lists the id (the
 * delete has not propagated yet — keep suppressing) or while it is recent; once
 * the id is gone from a successful remote load and the entry has aged past the
 * grace window, the stale local copy is already pruned by mergeCampaignLists and
 * the `pendingSync:false` marker is the durable backstop, so the tombstone can go.
 */
export function reconcileTombstones(tombstones = [], remoteCampaigns = [], { now = Date.now() } = {}) {
  const remoteIds = new Set(
    (remoteCampaigns || []).filter(campaign => campaign?.id).map(campaign => String(campaign.id)),
  );
  return (tombstones || []).filter(entry => {
    if (!entry || entry.id == null) return false;
    if (remoteIds.has(String(entry.id))) return true;
    return (now - parseTime(entry.deletedAt)) < TOMBSTONE_TTL_MS;
  });
}

/**
 * Merge a device's local cache with the cloud list under the deletion-aware
 * policy. Two mechanisms break the deletion-resurrection cycle:
 *
 *   1. Tombstones (per-owner, options.tombstones) — a campaign this device
 *      deleted is suppressed even if a stale cache copy or an in-flight list()
 *      still carries it, unless the cloud holds a copy updated AFTER the
 *      deletion (a genuine re-creation that outranks the tombstone).
 *   2. The never-synced marker (`pendingSync`) — a local campaign absent from a
 *      successful remote load is kept ONLY while it has never reached the cloud
 *      (pendingSync !== false). A campaign that previously synced and is now
 *      missing from remote was deleted on another device, so it is dropped
 *      rather than kept-and-re-uploaded. Remote-confirmed campaigns are stamped
 *      pendingSync:false here so that fact survives into the next load.
 */
export function mergeCampaignLists(localCampaigns = [], remoteCampaigns = [], { tombstones } = /** @type {{ tombstones?: Array<{id: any, deletedAt?: any}>|Map<any, any> }} */ ({})) {
  const byId = new Map();
  const tombstoneMap = normalizeTombstones(tombstones);
  const remoteById = new Map(
    (remoteCampaigns || [])
      .filter(campaign => campaign?.id)
      .map(campaign => [String(campaign.id), campaign]),
  );
  const remoteAccess = new Map(
    (remoteCampaigns || [])
      .filter(campaign => campaign?.id)
      .map(campaign => [String(campaign.id), {
        accessState: campaign.accessState || 'active',
        inactiveReason: campaign.inactiveReason || null,
        inactiveSince: campaign.inactiveSince || null,
        retentionExpiresAt: campaign.retentionExpiresAt || null,
      }]),
  );

  const tombstoneSuppresses = (id) => {
    const deletedAt = tombstoneMap.get(id);
    if (deletedAt == null) return false;
    const remoteCopy = remoteById.get(id);
    // A remote copy updated after the deletion is a real re-creation — honor it.
    return !(remoteCopy && campaignUpdatedAtMs(remoteCopy) > deletedAt);
  };

  const add = (campaign, sourceRank) => {
    if (!campaign?.id) return;
    const id = String(campaign.id);
    if (tombstoneSuppresses(id)) return;
    const existing = byId.get(id);
    if (!existing) {
      byId.set(id, { campaign: cloneJson(campaign), sourceRank });
      return;
    }

    const incomingTime = campaignUpdatedAtMs(campaign);
    const existingTime = campaignUpdatedAtMs(existing.campaign);
    if (
      incomingTime > existingTime ||
      (incomingTime === existingTime && sourceRank > existing.sourceRank)
    ) {
      byId.set(id, { campaign: cloneJson(campaign), sourceRank });
    }
  };

  for (const campaign of localCampaigns || []) add(campaign, 1);
  for (const campaign of remoteCampaigns || []) add(campaign, 2);

  return Array.from(byId.values())
    .filter(entry => {
      const id = String(entry.campaign.id);
      if (remoteById.has(id)) return true;
      // Local-only campaign: keep it unless we positively know it once synced
      // (pendingSync === false). Dropping a previously-synced, now-absent
      // campaign here is what stops the deletion-resurrection cycle.
      return entry.campaign.pendingSync !== false;
    })
    .map(entry => {
      const campaign = entry.campaign;
      const id = String(campaign.id);
      const authoritativeAccess = remoteAccess.get(id);
      if (remoteById.has(id)) {
        // Confirmed in the cloud — record that so a later remote deletion is
        // honored instead of resurrected, and let server-owned access win.
        const confirmed = { ...campaign, pendingSync: false };
        return authoritativeAccess ? { ...confirmed, ...authoritativeAccess } : confirmed;
      }
      return campaign;
    })
    .sort((a, b) => {
      const delta = campaignUpdatedAtMs(b) - campaignUpdatedAtMs(a);
      if (delta) return delta;
      return String(a.name || '').localeCompare(String(b.name || ''));
    });
}

const lastSyncedSignatures = new Map();

export function primeCampaignSync(campaigns = []) {
  lastSyncedSignatures.clear();
  for (const campaign of campaigns || []) {
    if (!campaign?.id) continue;
    lastSyncedSignatures.set(String(campaign.id), campaignSignature(campaign));
  }
}

export function forgetCampaignSync(id) {
  if (id == null) return;
  lastSyncedSignatures.delete(String(id));
}

function changedIdSet(changedId) {
  if (changedId == null) return null;
  const ids = Array.isArray(changedId) ? changedId : [changedId];
  return new Set(ids.filter(id => id != null).map(id => String(id)));
}

export function getCampaignsNeedingSync(campaigns = [], changedId = null) {
  const ids = changedIdSet(changedId);
  return (campaigns || []).filter(campaign => {
    if (!campaign?.id) return false;
    if ((campaign.accessState || 'active') !== 'active') return false;
    const id = String(campaign.id);
    if (ids && !ids.has(id)) return false;
    return lastSyncedSignatures.get(id) !== campaignSignature(campaign);
  });
}

export async function syncCampaignChanges(campaigns = [], { service, changedId = null } = /** @type {{ service?: any, changedId?: string|null }} */ ({})) {
  if (!service?.isConfigured || typeof service.upsert !== 'function') return [];
  const changed = getCampaignsNeedingSync(campaigns, changedId);
  if (!changed.length) return [];

  const results = await Promise.allSettled(changed.map(async campaign => {
    await service.upsert(campaign);
    lastSyncedSignatures.set(String(campaign.id), campaignSignature(campaign));
    return campaign.id;
  }));

  const failed = results.find(result => result.status === 'rejected');
  if (failed) throw failed.reason;
  return results.map(result => /** @type {PromiseFulfilledResult<any>} */ (result).value);
}
