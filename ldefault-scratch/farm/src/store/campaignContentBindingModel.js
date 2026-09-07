/**
 * Eager-safe campaign content-binding normalization and account projection.
 *
 * The heavy same-seed review and persistence session live in the lazy sibling.
 * This module contains only the synchronous work required by campaign create
 * and load chokepoints.
 */

import {
  admitCampaignContentBinding,
  makeCampaignContentBinding,
} from '../domain/content/campaignContentBinding.js';
import {
  VANILLA_CONTENT_ENVIRONMENT,
} from '../domain/content/contentEnvironmentDefaults.js';
import {
  admitCampaignContentBindingHistory,
} from '../domain/content/campaignContentBindingHistory.js';

export function accountRuntimeBinding(
  state,
  source = 'account-environment',
) {
  const runtime = typeof state.getActiveCustomContentRuntime === 'function'
    ? state.getActiveCustomContentRuntime()
    : {
        environment: state.activeContentEnvironment || null,
        customContent: state.customContent || {},
        tunables: {},
        visualSelection: {},
        resolution: { ok: true },
      };
  const failedClosed = runtime?.resolution?.ok === false;
  return {
    failedClosed,
    reason: failedClosed
      ? runtime.resolution.reason || 'content_environment_resolution_failed'
      : null,
    runtime,
    binding: makeCampaignContentBinding(
      failedClosed ? {} : runtime.customContent || {},
      {
        source: failedClosed ? 'environment-failed-closed' : source,
        environment: failedClosed
          ? VANILLA_CONTENT_ENVIRONMENT
          : runtime.environment || state.activeContentEnvironment || null,
        tunables: failedClosed ? {} : runtime.tunables || {},
        visualSelection: failedClosed ? {} : runtime.visualSelection || {},
      },
    ),
  };
}

export function legacyCampaignContentBinding(customContent, environment) {
  return makeCampaignContentBinding(customContent || {}, {
    source: 'legacy-inferred',
    environment,
  });
}

/**
 * Normalize active binding plus optional history at the campaign load wall.
 */
export function normalizeCampaignContentBinding(
  campaign,
  inferredCustomContent,
) {
  if (campaign.contentBinding) {
    const admitted = admitCampaignContentBinding(campaign.contentBinding);
    if (!admitted.ok) {
      campaign.contentBinding = makeCampaignContentBinding({}, {
        source: 'invalid-binding-failed-closed',
      });
      campaign.contentBindingStatus = 'invalid-failed-closed';
    } else {
      campaign.contentBinding = admitted.binding;
      campaign.contentBindingStatus = 'pinned';
    }
  } else if (inferredCustomContent !== undefined) {
    campaign.contentBinding = makeCampaignContentBinding(
      inferredCustomContent,
      { source: 'legacy-inferred' },
    );
    campaign.contentBindingStatus = 'pinned';
  } else {
    // The correct owner's library may hydrate after campaign rows. The custom
    // content slice finalizes this explicit pending cutoff after both reads.
    campaign.contentBindingStatus = 'legacy-inferred-pending';
  }

  if (!Array.isArray(campaign.contentBindingHistory)) {
    campaign.contentBindingHistory = [];
    return campaign;
  }
  const history = admitCampaignContentBindingHistory(
    campaign.contentBindingHistory,
  );
  if (history.ok) {
    campaign.contentBindingHistory = history.history;
    return campaign;
  }
  // History never participates in simulation. Reject only the damaged recovery
  // lane while retaining an independently admitted active binding.
  campaign.contentBindingHistory = [];
  if (campaign.contentBindingStatus === 'pinned') {
    campaign.contentBindingStatus = 'history-invalid-failed-closed';
  }
  return campaign;
}
