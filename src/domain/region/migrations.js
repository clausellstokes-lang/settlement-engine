/**
 * domain/region/migrations.js
 *
 * Regional state migration helpers for campaign records. Kept separate from
 * settlement migrations because this data belongs to campaign scope.
 */

import { ensureRegionalGraph } from './graph.js';

export function migrateRegionalGraphToLatest(graph) {
  return ensureRegionalGraph(graph || {});
}

export function withMigratedCampaignRegionalGraph(campaign) {
  if (!campaign || typeof campaign !== 'object') return campaign;
  return {
    ...campaign,
    regionalGraph: migrateRegionalGraphToLatest(campaign.regionalGraph),
  };
}

export function migrateCampaignsRegionalGraphs(campaigns = []) {
  return (Array.isArray(campaigns) ? campaigns : []).map(campaign => {
    if (!campaign || typeof campaign !== 'object') return campaign;
    if (!campaign.regionalGraph) return campaign;
    return withMigratedCampaignRegionalGraph(campaign);
  });
}
