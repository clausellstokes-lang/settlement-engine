/**
 * Step 14: generateNarratives
 *
 * Generates settlement reason, resource analysis, economic viability,
 * history, and legacy annotations.
 *
 * Extracted from generateSettlement.js lines 891, 984–1001.
 */

import { registerStep } from '../pipeline.js';
import { TERRAIN_DATA } from '../../data/geographyData.js';
import { generateSettlementReason } from '../narrativeGenerator.js';
import { generateResourceAnalysis } from '../resourceGenerator.js';
import { generateEconomicViability } from '../economicGenerator.js';
import { generateHistory } from '../historyGenerator.js';
import { deriveLegacyAnnotations } from '../legacyGenerator.js';
import { getTerrainType } from '../terrainHelpers.js';

registerStep('generateNarratives', {
  deps: ['generatePopulation', 'generateEconomy'],
  provides: ['settlementReason', 'resourceAnalysis', 'economicViability', 'history'],
  phase: 'narrative',
}, (ctx) => {
  const {
    tier, population, tradeRoute, effectiveConfig,
    institutions, economicState, powerStructure,
  } = ctx;

  const terrainT = getTerrainType(tradeRoute, effectiveConfig.terrainOverride || null);
  const allowedResources = TERRAIN_DATA[terrainT]?.allowedResources?.slice(0, 7) || [];

  const settlementReason = generateSettlementReason(tier, tradeRoute, null, effectiveConfig);
  const resourceAnalysis = generateResourceAnalysis(terrainT, allowedResources, [], institutions, effectiveConfig);
  const economicViability = generateEconomicViability(
    { tier, population, institutions, economicState, config: { ...effectiveConfig } },
    terrainT, allowedResources
  );
  const history = generateHistory(tier, effectiveConfig, institutions, economicViability, economicState, powerStructure);

  // Legacy annotations
  const legacyAnnotations = deriveLegacyAnnotations(history, {
    powerStructure, economicState, tier, institutions,
  });
  if (legacyAnnotations.length > 0) {
    history.legacyAnnotations = legacyAnnotations;
  }

  return { settlementReason, resourceAnalysis, economicViability, history };
});
