/**
 * The cold campaign runtime capsule.
 *
 * The store composes stable delegates from the three *Entry slices. This module
 * is their single dynamic-import target, so the campaign model, regional graph,
 * and world-pulse readers enter the browser together and are published as one
 * immutable action table.
 */
import {
  CAMPAIGN_CORE_RUNTIME_SENTINEL,
  createCampaignSlice,
} from './campaignSlice.js';
import {
  CAMPAIGN_REGIONAL_RUNTIME_SENTINEL,
  createCampaignRegionalSlice,
} from './campaignRegionalSlice.js';
import {
  CAMPAIGN_PULSE_RUNTIME_SENTINEL,
  createCampaignWorldPulseSlice,
} from './campaignWorldPulseSlice.js';

export const CAMPAIGN_RUNTIME_LAZY_SENTINEL = 'settlementforge_campaign_runtime_capsule_v1';
export const CAMPAIGN_RUNTIME_BODY_SENTINELS = Object.freeze({
  core: CAMPAIGN_CORE_RUNTIME_SENTINEL,
  regional: CAMPAIGN_REGIONAL_RUNTIME_SENTINEL,
  pulse: CAMPAIGN_PULSE_RUNTIME_SENTINEL,
});

function collectActions(target, slice, source) {
  for (const [name, value] of Object.entries(slice)) {
    if (typeof value !== 'function') continue;
    if (Object.hasOwn(target, name)) {
      throw new Error(`Duplicate campaign runtime action "${name}" from ${source}`);
    }
    target[name] = value;
  }
}

/** Build every campaign action before exposing any of them to eager delegates. */
export function createCampaignRuntimeActions(set, get) {
  const core = createCampaignSlice(set, get);
  const regional = createCampaignRegionalSlice(set, get);
  const pulse = createCampaignWorldPulseSlice(set, get);
  const actions = {};

  collectActions(actions, core, 'campaignSlice');
  collectActions(actions, regional, 'campaignRegionalSlice');
  collectActions(actions, pulse, 'campaignWorldPulseSlice');

  return Object.freeze({
    actions: Object.freeze(actions),
    bodySentinels: CAMPAIGN_RUNTIME_BODY_SENTINELS,
    outboxStatus: core.outboxStatus,
    sentinel: CAMPAIGN_RUNTIME_LAZY_SENTINEL,
  });
}
