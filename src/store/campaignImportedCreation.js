/**
 * Durable creation lane for account-imported campaigns.
 *
 * Normal campaign creation is intentionally optimistic and offline-capable.
 * Import is different: the complete remapped membership and content binding
 * already exist, and inserting a placeholder first would make the later
 * binding rewrite violate the cloud CAS trigger. This module constructs the
 * final envelope, awaits one authoritative insert, and only then publishes it
 * to the live/device cache.
 */

import {
  ensureRegionalGraph,
  ensureWizardNewsFeed,
} from '../domain/region/index.js';
import { createNewCampaignWorldState } from '../domain/worldPulse/worldState.js';
import { campaigns as campaignService } from '../lib/campaigns.js';
import { accountRuntimeBinding } from './campaignContentBindingModel.js';
import {
  captureCampaignSession,
  isCurrentCampaignSession,
  localWrite,
  newCampaignId,
} from './campaignSliceShared.js';
import { staffUnlocksPaidFeatures } from '../lib/staffEntitlements.js';

export function buildNewCampaign(current, name, initial = {}) {
  const id = newCampaignId();
  const campaignName = String(name || '').trim() || 'Untitled Campaign';
  const contentCutoff = initial.contentBinding
    ? { binding: initial.contentBinding, failedClosed: false }
    : accountRuntimeBinding(current, 'account-environment');
  // ONE ACTION, ONE INSTANT. This minted THREE separate wall-clock reads — `createdAt`,
  // `updatedAt`, and a third inside `ensureWizardNewsFeed()`'s own fallthrough below — so a
  // creation that straddled a millisecond boundary produced a campaign whose three stamps
  // disagreed. Creating a campaign IS a wall-clock event (this is the store boundary, where
  // the estate's temporal law says the clock legitimately enters); taking the instant more
  // than once is what was wrong.
  const now = new Date().toISOString();
  return {
    id,
    name: campaignName,
    createdAt: now,
    updatedAt: now,
    settlementIds: Array.isArray(initial.settlementIds)
      ? [...initial.settlementIds]
      : [],
    mapState: null,
    regionalGraph: ensureRegionalGraph(undefined, { now }),
    wizardNews: ensureWizardNewsFeed(undefined, { now }),
    // BIRTH, through the ONE birth door. This read `ensureWorldState(null, …)`,
    // which made "which preset does a fresh campaign start in?" an emergent
    // property of a no-arg normalize three modules away — invisible here, and
    // unaddressable from the preset table. `createNewCampaignWorldState` is the
    // named seam; it resolves NEW_CAMPAIGN_SIMULATION_PRESET_ID, which is null
    // today and therefore byte-identical to the call it replaces.
    worldState: createNewCampaignWorldState({ id, name: campaignName }),
    collapsed: false,
    accessState: 'active',
    lastReadTick: 0,
    flagsSeen: null,
    contentBinding: contentCutoff.binding,
    contentBindingHistory: Array.isArray(initial.contentBindingHistory)
      ? [...initial.contentBindingHistory]
      : [],
    contentBindingStatus: initial.contentBinding
      ? 'pinned'
      : contentCutoff.failedClosed
        ? 'environment-failed-closed'
        : 'pinned',
    // Ordinary creation retains this optimistic/offline marker. The imported
    // lane clears it only after the selected authority confirms the insert.
    pendingSync: true,
  };
}

export async function createImportedCampaignWithReceipt({
  get,
  set,
  name,
  initial = {},
}) {
  const current = get();
  const canCreate = current.auth?.tier === 'premium'
    || staffUnlocksPaidFeatures(current.auth?.role);
  if (!canCreate) {
    return {
      ok: false,
      status: 'failed',
      reason: 'campaign_import_requires_premium',
    };
  }
  const session = captureCampaignSession(current);
  if (!session) {
    return {
      ok: false,
      status: 'stale',
      reason: 'auth_session_changed',
    };
  }
  const campaign = buildNewCampaign(current, name, initial);
  const sessionIsCurrent = () => (
    isCurrentCampaignSession(get(), session)
  );
  try {
    const persistedId = await campaignService.upsert(
      campaign,
      session.ownerId,
      sessionIsCurrent,
    );
    if (
      !sessionIsCurrent()
      || String(persistedId) !== String(campaign.id)
    ) {
      return {
        ok: false,
        status: 'reconcile-required',
        reason: !sessionIsCurrent()
          ? 'auth_session_changed'
          : 'campaign_insert_identity_mismatch',
        persistence: { state: 'unconfirmed' },
      };
    }
    const landed = {
      ...campaign,
      pendingSync: campaignService.isConfigured ? false : true,
    };
    set(state => {
      state.campaigns.unshift(landed);
      // Cloud upsert does not update the device cache. Local mode already
      // wrote this exact envelope inside its coordinated authority.
      if (campaignService.isConfigured) {
        localWrite(state.campaigns, session.ownerId);
      }
    });
    return {
      ok: true,
      status: 'applied',
      campaignId: campaign.id,
      persistence: {
        state: 'confirmed',
        authority: campaignService.isConfigured
          ? 'saved-maps-row'
          : 'local-campaign-cache',
      },
    };
  } catch (error) {
    return {
      ok: false,
      status: error?.code === 'auth_session_changed'
        ? 'stale'
        : 'reconcile-required',
      reason: error instanceof Error
        ? error.message
        : 'campaign_insert_unconfirmed',
      persistence: {
        state: error?.code === 'auth_session_changed'
          ? 'not-required'
          : 'unconfirmed',
      },
    };
  }
}
