/**
 * economy/upgradeOpportunities.js — historical upgrade opportunities (faction roles available at a settlement tier).
 */

import { POWER_ROLES_BY_CATEGORY } from '../../data/historyData.js';
import { TIER_ORDER } from '../../data/constants.js';
import {
  isMaterializedCustomContent,
} from '../../domain/content/customContentSemanticAuthority.js';


// getUpgradeOpportunities
export const getUpgradeOpportunities = (institutions, tier, config = {}) => {
  // These roles are the native catalog's institutional implications. Custom
  // definitions need an explicit future role field before they may create NPC
  // offices; presentation metadata and names are not authority.
  const nativeInstitutions = (institutions || []).filter(
    institution => !isMaterializedCustomContent(institution),
  );
  const tierIndex = TIER_ORDER.indexOf(tier);
  const result = [];
  Object.entries(POWER_ROLES_BY_CATEGORY).forEach(([category, roles]) => {
    roles.forEach((role) => {
      if (tierIndex < TIER_ORDER.indexOf(role.minTier)) return;
      if (role.requiresGuild && !nativeInstitutions.some((i) => i.tags?.includes('guild'))) return;
      // Keyword gate: at least one institution name must contain one of the keywords
      if (
        role.requiresInstKeyword &&
        !nativeInstitutions.some((i) => role.requiresInstKeyword.some((kw) => (i.name || '').toLowerCase().includes(kw)))
      )
        return;
      if (role.requiresPort) {
        const waterRoute = ['port', 'river', 'coastal'].includes(config?.tradeRouteAccess);
        const hasWaterInst = nativeInstitutions.some(
          (i) =>
            i.tags?.includes('port') ||
            /\bport\b/.test((i.name || '').toLowerCase()) || // F5 unit 6: word-bounded; the substring read "Teleportation circle" as a port
            /\bharbour\b/.test((i.name || '').toLowerCase()) ||
            /\bharbor\b/.test((i.name || '').toLowerCase()) ||
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
        nativeInstitutions.some((i) => i.priorityCategory === category || i.category?.toLowerCase() === category)
      )
        result.push({ ...role, category });
    });
  });
  result.forEach((role) => {
    role.effectivePriority = role.priority * (config?.[role.category] ?? 1);
  });
  return result.sort((a, b) => b.effectivePriority - a.effectivePriority);
};

/**
 * A mandated role's own row, outside the pool's institution filters (soak 1000 row 20). The
 * generator mints its tier's head of government first (npcGenerator.js ::
 * TIER_MANDATORY_ROLES); `getUpgradeOpportunities` offers a 'government' role only where a
 * government-shelf institution stands, so a city whose City hall sits on infrastructure and
 * that holds no government row dropped its Mayor and seated nobody. The caller asks for this
 * row only when the pool dropped the head.
 * @param {string} role
 * @returns {Record<string, unknown> & { role: string, category: string } | undefined}
 */
export const mandatedRoleCandidate = (role) => {
  for (const [category, roles] of Object.entries(POWER_ROLES_BY_CATEGORY)) {
    const row = roles.find((r) => r.role === role);
    if (row) return { ...row, category: row.category || category };
  }
  return undefined;
};
