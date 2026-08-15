/**
 * Lazy reviewed campaign content-binding session.
 *
 * Same-seed generation and strict persistence are deliberately kept out of the
 * eager campaign slice. Callers capture the auth session before importing this
 * module; every continuation rechecks that authority.
 */

import {
  applyReviewedCampaignContentBindingChange,
  previewCampaignContentBindingChange,
} from '../domain/content/campaignContentLifecycle.js';
import {
  contentRuntimeFromCampaignBinding,
} from '../domain/content/contentEnvironment.js';
import {
  forgeContentRuntimeComparison,
} from '../domain/content/contentSamplePreview.js';
import {
  accountRuntimeBinding,
} from './campaignContentBindingModel.js';
import { campaigns as campaignService } from '../lib/campaigns.js';
import {
  cloneJson,
  findActiveCampaign,
  isCurrentCampaignSession,
} from './campaignSliceShared.js';

let lockSequence = 0;

function authorityKey(session) {
  return `${session.ownerId}:${session.generation}`;
}

function previewFixture(state, campaign) {
  const members = new Set((campaign?.settlementIds || []).map(String));
  const save = (state.savedSettlements || []).find(entry => (
    members.has(String(entry?.id))
  )) || null;
  return {
    seed: String(
      save?.seed
      || save?.settlement?._seed
      || campaign?.worldState?.rngSeed
      || `campaign-content-preview:${campaign?.id || 'unknown'}`,
    ),
    config: save?.config || save?.settlement?._config || {},
    explicitConfigFields: save?.configExplicitFields || {},
  };
}

export async function previewCampaignContentBindingMigrationSession({
  get,
  campaignId,
  options = {},
  session,
}) {
  if (!isCurrentCampaignSession(get(), session)) {
    return { ok: false, reason: 'auth_session_changed' };
  }
  const requestOptions = /** @type {any} */ (options);
  const state = get();
  const campaign = findActiveCampaign(state.campaigns, campaignId);
  if (!campaign?.contentBinding) {
    return { ok: false, reason: 'campaign_content_binding_unavailable' };
  }
  let targetBinding = requestOptions.targetBinding || null;
  if (!targetBinding) {
    const accountTarget = accountRuntimeBinding(
      state,
      'account-environment-migration',
    );
    if (accountTarget.failedClosed) {
      return { ok: false, reason: accountTarget.reason };
    }
    targetBinding = accountTarget.binding;
  }
  const { generateSettlementPipeline } = await import(
    '../generators/generateSettlementPipeline.js'
  );
  let sameSeedSample;
  try {
    sameSeedSample = forgeContentRuntimeComparison({
      ...previewFixture(state, campaign),
      beforeRuntime: contentRuntimeFromCampaignBinding(
        campaign.contentBinding,
      ),
      afterRuntime: contentRuntimeFromCampaignBinding(targetBinding),
    }, generateSettlementPipeline);
  } catch (error) {
    return {
      ok: false,
      reason: 'campaign_content_sample_failed',
      message: error instanceof Error
        ? error.message
        : 'The same-seed campaign content sample could not be forged.',
    };
  }
  if (!isCurrentCampaignSession(get(), session)) {
    return { ok: false, reason: 'auth_session_changed' };
  }
  return previewCampaignContentBindingChange({
    campaignId: campaign.id,
    authorityKey: authorityKey(session),
    currentBinding: campaign.contentBinding,
    contentBindingHistory: campaign.contentBindingHistory || [],
    targetBinding,
    sameSeedSample,
    kind: requestOptions.kind || 'campaign.content-binding.migrate',
  });
}

export function previewCampaignContentBindingRollbackSession({
  get,
  campaignId,
  targetBindingHash,
  session,
}) {
  if (!isCurrentCampaignSession(get(), session)) {
    return Promise.resolve({ ok: false, reason: 'auth_session_changed' });
  }
  const campaign = findActiveCampaign(get().campaigns, campaignId);
  const targetBinding = (campaign?.contentBindingHistory || []).find(
    binding => binding.bindingHash === targetBindingHash,
  );
  if (!targetBinding) {
    return Promise.resolve({
      ok: false,
      reason: 'campaign_content_rollback_target_unavailable',
    });
  }
  return previewCampaignContentBindingMigrationSession({
    get,
    campaignId,
    session,
    options: {
      targetBinding,
      kind: 'campaign.content-binding.rollback',
    },
  });
}

function notStarted(outcome) {
  return {
    ...(outcome || {
      ok: false,
      status: 'failed',
      reason: 'campaign_content_change_failed',
    }),
    persistence: { state: 'not-started' },
  };
}

async function cacheCampaignContentProjection(
  get,
  campaignId,
  ownerId,
  expectedBindingHashes,
) {
  // The CAS wrote the row it compared. Refresh only binding-owned cache fields:
  // replaying the initiating tab's older whole-campaign snapshot here would
  // erase unrelated edits that the narrow local or PostgreSQL patch preserved.
  const campaign = findActiveCampaign(get().campaigns, campaignId);
  if (!campaign?.contentBinding) return;
  try {
    await campaignService.cacheContentBindingProjection(
      cloneJson(campaign),
      expectedBindingHashes,
      ownerId,
    );
  } catch (error) {
    // Cache is a recoverable projection after the authoritative receipt. A
    // cache-write failure must never reinterpret a confirmed server result as
    // an ambiguous command.
    console.warn(
      '[campaignContentBinding] local cache projection failed',
      error,
    );
  }
}

export async function applyCampaignContentBindingMigrationSession({
  get,
  set,
  campaignId,
  preview,
  session,
  mutationBlockForState,
}) {
  if (!isCurrentCampaignSession(get(), session)) {
    return notStarted({
      ok: false,
      status: 'failed',
      reason: 'auth_session_changed',
    });
  }
  const token = `campaign-content-${++lockSequence}`;
  let outcome = /** @type {any} */ (null);
  let prior = /** @type {any} */ (null);
  let candidate = /** @type {any} */ (null);

  set(state => {
    const blocked = mutationBlockForState(state, campaignId);
    if (blocked) {
      outcome = {
        ok: false,
        status: 'blocked',
        reason: blocked.reason || 'campaign_mutation_in_flight',
      };
      return;
    }
    const campaign = findActiveCampaign(state.campaigns, campaignId);
    if (!campaign?.contentBinding) {
      outcome = {
        ok: false,
        status: 'failed',
        reason: 'campaign_content_binding_unavailable',
      };
      return;
    }
    outcome = applyReviewedCampaignContentBindingChange({
      campaignId: campaign.id,
      authorityKey: authorityKey(session),
      currentBinding: campaign.contentBinding,
      contentBindingHistory: campaign.contentBindingHistory || [],
      preview,
    });
    if (!outcome.ok) return;
    prior = {
      contentBinding: cloneJson(campaign.contentBinding),
      contentBindingHistory: cloneJson(campaign.contentBindingHistory || []),
      contentBindingStatus: campaign.contentBindingStatus,
      updatedAt: campaign.updatedAt,
      pendingSync: campaign.pendingSync,
    };
    campaign.contentBinding = cloneJson(outcome.binding);
    campaign.contentBindingHistory = cloneJson(outcome.history);
    campaign.contentBindingStatus = 'pinned';
    campaign.updatedAt = new Date().toISOString();
    campaign.pendingSync = true;
    state.campaignMutationLocks = [
      ...(state.campaignMutationLocks || []),
      {
        token,
        campaignIds: [campaign.id],
        settlementIds: [],
        reason: 'content_binding_migration_in_flight',
        ownerId: session.ownerId,
        generation: session.generation,
      },
    ];
    candidate = cloneJson(campaign);
  });
  if (!outcome?.ok) return notStarted(outcome);

  try {
    const receipt = await campaignService.compareAndSwapContentBinding(
      candidate,
      {
        expectedBindingHash: outcome.previousBindingHash,
        previewFingerprint: preview?.previewFingerprint,
      },
      session.ownerId,
      () => isCurrentCampaignSession(get(), session),
    );
    if (!isCurrentCampaignSession(get(), session)) {
      return {
        ok: false,
        status: 'failed',
        reason: 'auth_session_changed',
        persistence: { state: 'unknown' },
      };
    }
    if (receipt.ok && receipt.status === 'applied') {
      set(state => {
        const campaign = findActiveCampaign(state.campaigns, campaignId);
        if (
          campaign
          && campaign.contentBinding?.bindingHash === outcome.bindingHash
        ) {
          campaign.updatedAt = receipt.appliedAt || campaign.updatedAt;
          campaign.pendingSync = false;
          campaign.contentBindingStatus = 'pinned';
        }
      });
      await cacheCampaignContentProjection(
        get,
        campaignId,
        session.ownerId,
        [outcome.previousBindingHash, outcome.bindingHash],
      );
      return {
        ...outcome,
        commandId: receipt.commandId,
        replayed: receipt.replayed,
        persistence: { state: 'confirmed' },
      };
    }

    if (receipt.status === 'stale') {
      set(state => {
        const campaign = findActiveCampaign(state.campaigns, campaignId);
        if (
          !campaign
          || campaign.contentBinding?.bindingHash !== outcome.bindingHash
        ) return;
        if (receipt.remoteBinding) {
          campaign.contentBinding = cloneJson(receipt.remoteBinding);
          campaign.contentBindingHistory = cloneJson(
            receipt.remoteBindingHistory || [],
          );
          campaign.contentBindingStatus = 'conflict-refreshed';
        } else {
          Object.assign(campaign, prior);
          campaign.contentBindingStatus = 'remote-binding-unavailable';
        }
      });
      await cacheCampaignContentProjection(
        get,
        campaignId,
        session.ownerId,
        [
          outcome.previousBindingHash,
          outcome.bindingHash,
          receipt.remoteBinding?.bindingHash,
        ],
      );
      return {
        ...receipt,
        persistence: { state: 'conflict' },
      };
    }

    set(state => {
      const campaign = findActiveCampaign(state.campaigns, campaignId);
      if (
        campaign
        && campaign.contentBinding?.bindingHash === outcome.bindingHash
      ) {
        Object.assign(campaign, prior);
        campaign.contentBindingStatus = receipt.status === 'reconcile-required'
          ? 'persistence-unknown'
          : prior.contentBindingStatus;
      }
    });
    await cacheCampaignContentProjection(
      get,
      campaignId,
      session.ownerId,
      [prior.contentBinding?.bindingHash],
    );
    return {
      ...receipt,
      persistence: {
        state: receipt.status === 'reconcile-required'
          ? 'unknown'
          : 'failed',
      },
    };
  } catch (error) {
    if (isCurrentCampaignSession(get(), session)) {
      set(state => {
        const campaign = findActiveCampaign(state.campaigns, campaignId);
        if (
          campaign
          && campaign.contentBinding?.bindingHash === outcome.bindingHash
        ) {
          Object.assign(campaign, prior);
          campaign.contentBindingStatus = 'persistence-unknown';
        }
      });
      await cacheCampaignContentProjection(
        get,
        campaignId,
        session.ownerId,
        [prior.contentBinding?.bindingHash],
      );
    }
    return {
      ok: false,
      status: 'failed',
      reason: error?.code === 'auth_session_changed'
        ? 'auth_session_changed'
        : 'campaign_content_persistence_unknown',
      message: error instanceof Error ? error.message : String(error),
      retryable: error?.code !== 'auth_session_changed',
      persistence: { state: 'unknown' },
    };
  } finally {
    set(state => {
      state.campaignMutationLocks = (state.campaignMutationLocks || [])
        .filter(lock => lock.token !== token);
    });
  }
}
