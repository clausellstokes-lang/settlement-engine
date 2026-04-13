/**
 * Step 2: resolveResources
 *
 * Resolves nearby resources from config — random terrain-compatible selection
 * or manual state map with tier-weighted depletion.
 *
 * Extracted from generateSettlement.js lines 296–386.
 */

import { registerStep } from '../pipeline.js';
import { RESOURCE_DATA } from '../../data/resourceData.js';
import { getCompatibleResources, getDefaultResources } from '../terrainHelpers.js';

const DEPLETION_PROB = {
  thorp: 0.05, hamlet: 0.10, village: 0.20,
  town: 0.35, city: 0.55, metropolis: 0.70,
};

const RESOURCE_COUNT_RANGE = {
  thorp: [1,3], hamlet: [2,4], village: [3,5],
  town: [4,6], city: [5,7], metropolis: [6,8],
};

const RARE_RESOURCES = { 'ancient_ruins': 0.15, 'magical_node': 0.15 };

registerStep('resolveResources', {
  deps: ['resolveConfig'],
  provides: ['nearbyResources', 'nearbyResourcesDepleted'],
  phase: 'config',
}, (ctx, rng) => {
  const { tier, tradeRoute, resolvedTerrain, effectiveConfig } = ctx;
  const config = ctx.config || {};
  const depletionProb = DEPLETION_PROB[tier] ?? 0.25;

  let nearbyResources;
  let nearbyResourcesDepleted = config.nearbyResourcesDepleted || [];

  if (config.nearbyResourcesRandom !== false) {
    // Random mode
    const terrainOverride = resolvedTerrain
      || (config.terrainOverride && config.terrainOverride !== 'auto' ? config.terrainOverride : null);
    const compatible = getCompatibleResources(tradeRoute, terrainOverride)
      .filter(r => r.compatible).map(r => r.key);

    const terrainSpecific = compatible.filter(k => RESOURCE_DATA[k]?.terrain === terrainOverride);
    const universal = compatible.filter(k => !RESOURCE_DATA[k]?.terrain);

    // One per category from universal
    const byCategory = {};
    universal.forEach(k => {
      const cat = (RESOURCE_DATA[k]?.category) || 'land';
      (byCategory[cat] = byCategory[cat] || []).push(k);
    });

    const selected = new Set();

    // Terrain-specific first
    const shuffledTerrain = rng.shuffle([...terrainSpecific]);
    const terrainSlots = Math.min(shuffledTerrain.length, terrainOverride ? 2 : 0);
    shuffledTerrain.slice(0, terrainSlots).forEach(k => selected.add(k));

    // One per category (exclude rare from category pools)
    Object.values(byCategory).forEach(arr => {
      if (arr.length === 0) return;
      const nonRare = arr.filter(k => RARE_RESOURCES[k] === undefined);
      const pool = nonRare.length > 0 ? nonRare : arr;
      selected.add(rng.pick(pool));
    });

    // Fill to target count
    const [rcMin, rcMax] = RESOURCE_COUNT_RANGE[tier] || [3, 6];
    const targetCount = rng.randInt(rcMin, rcMax);

    rng.shuffle([...universal]).forEach(k => {
      if (selected.size >= targetCount) return;
      const rarity = RARE_RESOURCES[k];
      if (rarity !== undefined && !rng.chance(rarity)) return;
      selected.add(k);
    });

    nearbyResources = [...selected];

    // Suppress magical resources in no-magic worlds
    if (config.magicExists === false) {
      nearbyResources = nearbyResources.filter(r => r !== 'magical_node');
    }

    // Tier-weighted random depletion
    nearbyResourcesDepleted = nearbyResources.filter(() => rng.chance(depletionProb));
  } else {
    // Manual mode
    const resourceState = config.nearbyResourcesState || {};
    const allCompatible = getCompatibleResources(tradeRoute).filter(r => r.compatible).map(r => r.key);
    const legacyList = config.nearbyResources ?? getDefaultResources(tradeRoute);

    if (Object.keys(resourceState).length > 0) {
      nearbyResources = allCompatible.filter(k => {
        const st = resourceState[k];
        return st === 'allow' || st === 'abundant' || st === 'depleted';
      });
      const forceAbundant = new Set(allCompatible.filter(k => resourceState[k] === 'abundant'));
      const forceDepleted = new Set(allCompatible.filter(k => resourceState[k] === 'depleted'));
      const allowState = nearbyResources.filter(k => !forceAbundant.has(k) && !forceDepleted.has(k));
      nearbyResourcesDepleted = [
        ...forceDepleted,
        ...allowState.filter(() => rng.chance(depletionProb)),
      ];
    } else {
      nearbyResources = legacyList;
    }
  }

  // Write back into effectiveConfig for downstream steps
  effectiveConfig.nearbyResources = nearbyResources;
  effectiveConfig.nearbyResourcesDepleted = nearbyResourcesDepleted;

  return { nearbyResources, nearbyResourcesDepleted };
});
