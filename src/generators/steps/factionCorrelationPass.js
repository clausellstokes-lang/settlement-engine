/**
 * Step 12: factionCorrelationPass
 *
 * Faction-institution correlation feedback loop + demand imports.
 * Also runs arcane institution strip for no-magic worlds.
 *
 * Extracted from generateSettlement.js lines 851–889.
 */

import { registerStep } from '../pipeline.js';
import { deriveFactionBoosts, applyFactionInstitutionBoosts } from '../factionCorrelation.js';
import { computeDemandImports } from '../demandProfile.js';
import { stripArcaneInstitutions } from '../isolationGenerator.js';

registerStep('factionCorrelationPass', {
  deps: ['neighbourFactions', 'generateEconomy'],
  provides: [],
  phase: 'power',
}, (ctx) => {
  const {
    institutions, tier, effectiveConfig,
    institutionToggles, categoryToggles,
    powerStructure, economicState,
  } = ctx;

  // Demand imports — faction purchasing power + culture shapes imports
  const _hasMagicTrade = institutions.some(i => /teleport|airship|planar/i.test(i.name));
  if (effectiveConfig.tradeRouteAccess !== 'isolated' || _hasMagicTrade) {
    const demandImports = computeDemandImports(
      powerStructure?.factions || [],
      effectiveConfig.culture,
      economicState.activeChains || [],
      tier,
      economicState.primaryImports || []
    );
    if (demandImports.length > 0) {
      economicState.primaryImports = [
        ...(economicState.primaryImports || []),
        ...demandImports,
      ].slice(0, 10);
    }
  }

  // Faction-institution correlation loop
  const factionBoosts = deriveFactionBoosts(powerStructure?.factions || [], tier);
  if (factionBoosts.length > 0) {
    const boostAdditions = applyFactionInstitutionBoosts(
      factionBoosts, institutions, tier, effectiveConfig,
      institutionToggles, categoryToggles
    );
    if (boostAdditions.length > 0) {
      institutions.push(...boostAdditions);
    }
  }

  // Arcane institution safety-net
  stripArcaneInstitutions(institutions, effectiveConfig);

  return {};
});
