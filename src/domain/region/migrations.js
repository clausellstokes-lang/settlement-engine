/**
 * domain/region/migrations.js
 *
 * Regional state migration helpers for campaign records. Kept separate from
 * settlement migrations because this data belongs to campaign scope.
 */

import { ensureRegionalGraph } from './graph.js';

/**
 * @typedef {{ regionalGraph?: unknown, [key: string]: unknown }} CampaignRecord
 */

/**
 * @param {unknown} [graph]
 * @returns {ReturnType<typeof ensureRegionalGraph>}
 */
export function migrateRegionalGraphToLatest(graph) {
  return ensureRegionalGraph(graph || {});
}

/**
 * @param {CampaignRecord | null | undefined} campaign
 * @returns {CampaignRecord | null | undefined}
 */
export function withMigratedCampaignRegionalGraph(campaign) {
  if (!campaign || typeof campaign !== 'object') return campaign;
  return {
    ...campaign,
    regionalGraph: migrateRegionalGraphToLatest(campaign.regionalGraph),
  };
}

/**
 * @param {CampaignRecord[]} [campaigns]
 * @returns {(CampaignRecord | null | undefined)[]}
 */
export function migrateCampaignsRegionalGraphs(campaigns = []) {
  return (Array.isArray(campaigns) ? campaigns : []).map(campaign => {
    if (!campaign || typeof campaign !== 'object') return campaign;
    if (!campaign.regionalGraph) return campaign;
    return withMigratedCampaignRegionalGraph(campaign);
  });
}
