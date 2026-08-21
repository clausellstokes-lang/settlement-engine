/** Cold persisted-campaign admission. Imported only by raw campaign ingresses. */
import { hydratePersistedWorldState } from '../domain/worldPulse/worldStateHydration.js';

export function hydratePersistedCampaignWorld(campaign) {
  if (!campaign || typeof campaign !== 'object') return campaign;
  return {
    ...campaign,
    worldState: hydratePersistedWorldState(campaign.worldState, campaign),
  };
}

export function hydratePersistedCampaignRows(rows, inferredCustomContent, migrateCampaign) {
  return (rows || []).map(campaign => migrateCampaign(
    hydratePersistedCampaignWorld(campaign),
    inferredCustomContent,
  ));
}
