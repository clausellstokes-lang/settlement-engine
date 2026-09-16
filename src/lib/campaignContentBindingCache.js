/**
 * Narrow owner-cache projection for campaign content-binding receipts.
 *
 * The binding transaction intentionally preserves unrelated campaign fields.
 * Its local cache follow-up must do the same: replacing the initiating tab's
 * whole campaign after a receipt could erase a newer map or world edit already
 * present in another document's cache.
 */

import {
  admitCampaignContentBinding,
} from '../domain/content/campaignContentBinding.js';
import {
  admitCampaignContentBindingHistory,
} from '../domain/content/campaignContentBindingHistory.js';
import { withLocalAuthorityLock } from './localAuthorityMutex.js';

/**
 * @typedef {Record<string, unknown>} CachedCampaign
 * @typedef {{
 *   id?:unknown,
 *   contentBinding?:unknown,
 *   contentBindingHistory?:unknown,
 *   contentBindingStatus?:unknown,
 *   pendingSync?:unknown,
 * }} CampaignContentProjection
 */

/**
 * @param {CampaignContentProjection|null|undefined} campaign
 * @param {unknown} ownerId
 * @param {ReadonlyArray<unknown>} expectedBindingHashes
 * @param {(ownerId:string) => CachedCampaign[]} loadCampaigns
 * @param {(campaigns:CachedCampaign[], ownerId:string) => void} writeCampaigns
 * @returns {Promise<boolean>}
 */
export async function cacheCampaignContentBindingProjection(
  campaign,
  ownerId,
  expectedBindingHashes,
  loadCampaigns,
  writeCampaigns,
) {
  const binding = admitCampaignContentBinding(campaign?.contentBinding);
  const history = admitCampaignContentBindingHistory(
    campaign?.contentBindingHistory || [],
  );
  if (!binding.ok || !history.ok) {
    throw new TypeError(
      'The campaign content cache projection failed admission.',
    );
  }
  const contentBindingStatus = (
    typeof campaign?.contentBindingStatus === 'string'
    && campaign.contentBindingStatus.trim()
    && campaign.contentBindingStatus.length <= 100
  )
    ? campaign.contentBindingStatus
    : 'pinned';
  const expectedHashes = new Set(
    (Array.isArray(expectedBindingHashes) ? expectedBindingHashes : [])
      .filter(value => (
        typeof value === 'string' && /^[0-9a-f]{64}$/.test(value)
      )),
  );
  const ownerKey = String(ownerId || 'anon');
  return withLocalAuthorityLock('campaign-cache', ownerKey, () => {
    const cached = loadCampaigns(ownerKey);
    const index = cached.findIndex(entry => (
      String(entry?.id || '') === String(campaign?.id || '')
    ));
    if (index < 0) return false;
    const cachedBinding = admitCampaignContentBinding(
      cached[index]?.contentBinding,
    );
    if (
      !cachedBinding.ok
      || (
        cachedBinding.binding.bindingHash !== binding.binding.bindingHash
        && !expectedHashes.has(cachedBinding.binding.bindingHash)
      )
    ) {
      return false;
    }
    const next = [...cached];
    next[index] = {
      ...cached[index],
      contentBinding: binding.binding,
      contentBindingHistory: history.history,
      contentBindingStatus,
      ...(typeof campaign.pendingSync === 'boolean'
        ? { pendingSync: campaign.pendingSync }
        : {}),
    };
    writeCampaigns(next, ownerKey);
    return true;
  });
}
