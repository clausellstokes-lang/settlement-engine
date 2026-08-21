/**
 * economicGenerator.js
 * Economic state and viability generation — public entry point.
 *
 * The implementation now lives in ./economy/*; this module only re-exports the
 * public surface so every existing importer keeps importing from
 * './economicGenerator.js' unchanged.
 */
export { POWER_ROLES_BY_CATEGORY } from '../data/historyData.js';
export { isSaltPreserved } from './economy/tradeGoods.js';
export { priorityToCategory } from './economy/prosperity.js';
export { getUpgradeOpportunities } from './economy/upgradeOpportunities.js';
export { generateEconomicState } from './economy/economicState.js';
export { generateEconomicViability, sortBySeverity } from './economy/viability.js';
