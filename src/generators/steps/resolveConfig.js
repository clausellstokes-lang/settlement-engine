/**
 * Step 1: resolveConfig
 *
 * Resolves tier, population, trade route, terrain, culture, magic level,
 * monster threat, and priority sliders from raw user config.
 *
 * Extracted from generateSettlement.js lines 198–410.
 */

import { registerStep } from '../pipeline.js';
import { TIER_ORDER, POPULATION_RANGES, getMagicLevel, TOWN_PLUS_TIERS, popToTier } from '../../data/constants.js';
import { getTerrainType } from '../terrainHelpers.js';

const TERRAIN_WEIGHTS = [
  ['plains', 22], ['hills', 18], ['forest', 13],
  ['riverside', 16], ['coastal', 16], ['mountain', 9], ['desert', 6],
];

const TERRAIN_ROUTE_POOLS = {
  plains:    ['crossroads','crossroads','road','road','river'],
  hills:     ['road','road','crossroads','road','isolated'],
  forest:    ['road','isolated','isolated','road','river'],
  riverside: ['river','river','river','road','crossroads'],
  coastal:   ['port','port','port','port','river'],
  mountain:  ['road','road','road','isolated','isolated'],
  desert:    ['crossroads','road','road','isolated','road'],
};

const CULTURES = [
  'germanic','latin','celtic','arabic','norse','slavic',
  'east_asian','mesoamerican','south_asian','steppe','greek',
];

registerStep('resolveConfig', {
  deps: [],
  provides: [
    'tier', 'population', 'tradeRoute', 'terrainType', 'resolvedTerrain',
    'culture', 'magicLevel', 'threat', 'priorityMagicEffective',
    'noMagic', 'townPlus', 'effectiveConfig',
    'institutionToggles', 'categoryToggles', 'goodsToggles', 'servicesToggles',
  ],
  phase: 'config',
}, (ctx, rng) => {
  const config = ctx.config || {};

  // Magic priority
  const priorityMagicEffective = config.magicExists === false
    ? 0 : (config.priorityMagic ?? 50);

  // Extract toggles
  const institutionToggles = config._institutionToggles || {};
  const categoryToggles    = config._categoryToggles    || {};
  const goodsToggles       = config._goodsToggles       || {};
  const servicesToggles    = config._servicesToggles     || {};

  // Resolve tier
  const tier = config.settType === 'custom'  ? popToTier(config.population)
             : config.settType === 'random'  ? rng.pick(TIER_ORDER)
             : (config.settType || 'village');

  // Population
  const popRange = POPULATION_RANGES[tier];
  const population = config.settType === 'custom'
    ? config.population
    : rng.randInt(popRange.min, popRange.max);

  const noMagic  = config.magicExists === false || (config.priorityMagic || 0) === 0;
  const townPlus = TOWN_PLUS_TIERS.includes(tier);

  // Random terrain
  const randomTerrain = !config.terrainOverride || config.terrainOverride === 'auto';
  const doRandomTerrain = randomTerrain && config.tradeRouteAccess === 'random_trade';

  let resolvedTerrain = null;
  if (doRandomTerrain) {
    const terrains = TERRAIN_WEIGHTS.map(([t]) => t);
    const weights  = TERRAIN_WEIGHTS.map(([, w]) => w);
    resolvedTerrain = rng.weightedPick(terrains, weights);
  }

  // Trade route
  let routePool = null;
  if (config.tradeRouteAccess === 'random_trade') {
    if (resolvedTerrain) {
      let pool = [...(TERRAIN_ROUTE_POOLS[resolvedTerrain] || ['road','road','road','crossroads'])];
      if (noMagic && townPlus) pool = pool.filter(r => r !== 'isolated');
      if (pool.length === 0) pool = ['road'];
      routePool = pool;
    } else {
      routePool = noMagic && townPlus
        ? ['road','road','road','river','crossroads','port']
        : ['road','road','road','river','crossroads','port','isolated'];
    }
  }

  const rawRoute = routePool
    ? rng.pick(routePool)
    : (config.tradeRouteAccess || 'road');

  const tradeRoute = (rawRoute === 'isolated' && townPlus && noMagic) ? 'road' : rawRoute;

  // Derived values
  const magicLevel = getMagicLevel(priorityMagicEffective);

  const threat = (() => {
    let mt = config.monsterThreat;
    if (mt === 'random_threat') {
      mt = rng.pick(['heartland','heartland','frontier','frontier','frontier','plagued']);
    }
    mt = mt || 'frontier';
    return mt === 'low' ? 'heartland' : mt === 'high' ? 'plagued'
         : mt === 'medium' ? 'frontier' : mt;
  })();

  const culture = (config.culture === 'random_culture' || !config.culture)
    ? rng.pick(CULTURES)
    : config.culture;

  const terrainType = getTerrainType(tradeRoute, resolvedTerrain || config.terrainOverride || null);

  // Military floor for plagued settlements
  const militaryFloor = threat === 'plagued' && (config.priorityMilitary ?? 50) < 25 ? 25 : null;

  const effectiveConfig = {
    priorityEconomy:  50,
    priorityMilitary: 50,
    priorityReligion: 50,
    priorityCriminal: 50,
    ...config,
    tier,
    priorityMagic: priorityMagicEffective,
    tradeRouteAccess: tradeRoute,
    magicLevel,
    monsterThreat: threat,
    culture,
    terrainType,
    terrainOverride: resolvedTerrain || config.terrainOverride || null,
    ...(militaryFloor ? { priorityMilitary: militaryFloor } : {}),
  };

  return {
    tier, population, tradeRoute, terrainType, resolvedTerrain,
    culture, magicLevel, threat, priorityMagicEffective,
    noMagic, townPlus, effectiveConfig,
    institutionToggles, categoryToggles, goodsToggles, servicesToggles,
  };
});
