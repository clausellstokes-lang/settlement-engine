/**
 * economy/upgradeOpportunities.js — historical upgrade opportunities (faction roles available at a settlement tier).
 */

import { HISTORY_EVENTS } from '../../data/historyData.js';
import { TIER_ORDER } from '../../data/constants.js';


// getUpgradeOpportunities
export const getUpgradeOpportunities = (institutions, tier, config = {}) => {
  const tierIndex = TIER_ORDER.indexOf(tier);
  const result = [];
  Object.entries(HISTORY_EVENTS).forEach(([category, roles]) => {
    roles.forEach((role) => {
      if (tierIndex < TIER_ORDER.indexOf(role.minTier)) return;
      if (role.requiresGuild && !institutions.some((i) => i.tags?.includes('guild'))) return;
      // Keyword gate: at least one institution name must contain one of the keywords
      if (
        role.requiresInstKeyword &&
        !institutions.some((i) => role.requiresInstKeyword.some((kw) => (i.name || '').toLowerCase().includes(kw)))
      )
        return;
      if (role.requiresPort) {
        const waterRoute = ['port', 'river', 'coastal'].includes(config?.tradeRouteAccess);
        const hasWaterInst = institutions.some(
          (i) =>
            i.tags?.includes('port') ||
            (i.name || '').toLowerCase().includes('port') ||
            (i.name || '').toLowerCase().includes('harbour') ||
            (i.name || '').toLowerCase().includes('harbor') ||
            ((i.name || '').toLowerCase().includes('dock') && waterRoute)
        );
        if (!waterRoute && !hasWaterInst) return;
      }
      if (
        category === 'other' ||
        // Dual-axis match (see src/data/categoryVocabulary.js): a faction role
        // matches an institution by EITHER its semantic priorityCategory OR its
        // grouping (category). Both clauses are load-bearing — e.g. the
        // 'religious' role is carried by the grouping while 'military' is carried
        // by priorityCategory — so neither can be dropped without silently
        // losing matches. categoryGovernance.test.js pins that every role stays
        // matchable through one of the two axes.
        institutions.some((i) => i.priorityCategory === category || i.category?.toLowerCase() === category)
      )
        result.push({ ...role, category });
    });
  });
  result.forEach((role) => {
    role.effectivePriority = role.priority * (config?.[role.category] ?? 1);
  });
  return result.sort((a, b) => b.effectivePriority - a.effectivePriority);
};
