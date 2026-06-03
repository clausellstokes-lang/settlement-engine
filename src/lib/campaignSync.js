/**
 * campaignSync.js — merge and sync policy for campaign persistence.
 *
 * The store owns UI state; this module owns the dull but important rule:
 * local cache and cloud rows are peers, and loading cloud data must never
 * erase a local-only campaign that has not been uploaded yet.
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
  try {
    return JSON.stringify(campaign || null);
  } catch {
    return JSON.stringify({
      id: campaign?.id,
      name: campaign?.name,
      updatedAt: campaign?.updatedAt,
      mapSavedAt: campaign?.mapState?.savedAt,
    });
  }
}

export function mergeCampaignLists(localCampaigns = [], remoteCampaigns = []) {
  const byId = new Map();

  const add = (campaign, sourceRank) => {
    if (!campaign?.id) return;
    const id = String(campaign.id);
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
    .map(entry => entry.campaign)
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
    const id = String(campaign.id);
    if (ids && !ids.has(id)) return false;
    return lastSyncedSignatures.get(id) !== campaignSignature(campaign);
  });
}

export async function syncCampaignChanges(campaigns = [], { service, changedId = null } = {}) {
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
  return results.map(result => result.value);
}
