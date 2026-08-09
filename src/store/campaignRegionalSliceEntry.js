/** Stable synchronous delegates for the cold regional campaign implementation. */
import { campaignActionDelegate } from './campaignEntryDelegates.js';

export const CAMPAIGN_REGIONAL_ACTIONS = Object.freeze([
  'rebuildCampaignRegionalGraph',
  'discoverCampaignRegionalChannels',
  'setRegionalChannelStatus',
  'injectCampaignStressor',
  'resolveCampaignStressor',
  'undoCampaignStressorBridge',
  'setCampaignRegionalGraph',
  'setRegionalImpactStatus',
  'ignoreQueuedRegionalImpact',
  'advanceCampaignRegionalImpacts',
  'applyQueuedRegionalImpact',
  'resolveRegionalImpact',
  'applyAllQueuedRegionalImpacts',
  'ignoreAllQueuedRegionalImpacts',
  'getCampaignRegionalGraph',
]);

export const createCampaignRegionalSlice = (_set, get) => Object.fromEntries(
  CAMPAIGN_REGIONAL_ACTIONS.map(name => [name, campaignActionDelegate(get, name)]),
);
