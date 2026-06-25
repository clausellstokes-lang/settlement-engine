/**
 * Step 1: resolveConfig
 *
 * Resolves tier, population, trade route, terrain, culture, magic level,
 * monster threat, and priority sliders from raw user config.
 *
 * Configuration-resolution step for the settlement generation pipeline.
 */

import { registerStep } from '../pipeline.js';
import { TIER_ORDER, POPULATION_RANGES, getMagicLevel, TOWN_PLUS_TIERS, popToTier } from '../../data/constants.js';
import { getTerrainType } from '../terrainHelpers.js';
import { recordTrace } from '../../domain/trace.js';

// Exported so the gallery-facet alignment test can pin TERRAIN_OPTIONS against
// the vocabulary the generator actually rolls (the values persisted to
// config.terrainType). See tests/components/gallery/facetAlignment.test.js.
export const TERRAIN_WEIGHTS = [
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

// The canonical 11-culture catalog. Exported so the gallery-facet alignment
// test can pin CULTURE_OPTIONS against the values the generator persists to
// config.culture. See tests/components/gallery/facetAlignment.test.js.
export const CULTURES = [
  'germanic','latin','celtic','arabic','norse','slavic',
  'east_asian','mesoamerican','south_asian','steppe','greek',
];

registerStep('resolveConfig', {
  deps: [],
  reads: [], // ctx keys this step consumes that another step produces
  provides: [
    'tier', 'population', 'tradeRoute', 'terrainType', 'resolvedTerrain',
    'culture', 'magicLevel', 'threat', 'priorityMagicEffective',
    'noMagic', 'townPlus', 'effectiveConfig',
    'institutionToggles', 'categoryToggles', 'goodsToggles', 'servicesToggles',
  ],
  phase: 'config',
}, (ctx, rng) => {
  const config = ctx.config || {};

  // Priority sliders: when the UI's "Random" slider mode is on
  // (config._randomizePriorities, threaded by generateSettlement), roll each
  // priority per generation — deterministic per seed, fresh per regenerate
  // (the wizard mints a new seed each click). The rolls are NEVER written
  // back into the stored UI config: persisting resolved randoms is exactly
  // the bug that pinned 'random' enum settings to their first roll. Guarded
  // so the flag-off path draws no rng (existing seeds reproduce bit-for-bit).
  const rolledPriorities = config._randomizePriorities === true
    ? {
        priorityEconomy: rng.randInt(5, 95),
        priorityMilitary: rng.randInt(5, 95),
        priorityReligion: rng.randInt(5, 95),
        priorityCriminal: rng.randInt(5, 95),
        priorityMagic: rng.randInt(5, 95),
      }
    : null;
  const basePriorityMagic = rolledPriorities ? rolledPriorities.priorityMagic : config.priorityMagic;

  // Magic priority
  const priorityMagicEffective = config.magicExists === false
    ? 0 : (basePriorityMagic ?? 50);

  // Extract toggles
  const institutionToggles = config._institutionToggles || {};
  const categoryToggles    = config._categoryToggles    || {};
  const goodsToggles       = config._goodsToggles       || {};
  const servicesToggles    = config._servicesToggles     || {};

  // Resolve tier
  const rawTier = config.settType === 'custom'  ? popToTier(config.population)
                : config.settType === 'random'  ? rng.pick(TIER_ORDER)
                : (config.settType || 'village');
  // Guard the direct-settType path: an unknown settType (anything outside the
  // six canonical tiers) would otherwise make POPULATION_RANGES[tier] undefined
  // and throw on popRange.min/.max below. Fall back to 'village'.
  const tier = POPULATION_RANGES[rawTier] ? rawTier : 'village';

  // Population
  const popRange = POPULATION_RANGES[tier];
  const population = config.settType === 'custom'
    ? config.population
    : rng.randInt(popRange.min, popRange.max);

  // Derive noMagic from the already-resolved effective priority so the two can't
  // drift: previously an absent priorityMagic counted as 0 here (noMagic=true) while
  // priorityMagicEffective defaulted to 50, giving contradictory magic signals.
  const noMagic  = priorityMagicEffective === 0;
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
  const militaryFloor = threat === 'plagued'
    && ((rolledPriorities?.priorityMilitary ?? config.priorityMilitary) ?? 50) < 25 ? 25 : null;

  const effectiveConfig = {
    priorityEconomy:  50,
    priorityMilitary: 50,
    priorityReligion: 50,
    priorityCriminal: 50,
    ...config,
    ...(rolledPriorities || {}),
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

  // Causal traces — record the *decisions* this step made (vs. the
  // values it simply passed through). The "why" on each trace makes
  // it possible for the PipelineRail and AI-grounding layers to
  // explain how a settlement got its scaling.
  recordTrace(ctx, {
    targetType: 'condition',
    targetId: `tier.${tier}`,
    step: 'resolveConfig',
    result: 'selected',
    causes: [{
      source: config.settType === 'random' ? 'config.settType=random' :
              config.settType === 'custom' ? `config.population=${config.population}` :
              `config.settType=${config.settType}`,
      reason: config.settType === 'random'
        ? `Randomly picked from ${TIER_ORDER.join(', ')}.`
        : config.settType === 'custom'
          ? `Tier derived from population ${config.population}.`
          : 'Tier set directly by user choice.',
    }],
    downstreamEffects: [
      { target: 'population', effect: `range ${popRange.min}–${popRange.max}` },
      { target: 'institutionPool', effect: 'scaling tier' },
    ],
  });

  if (resolvedTerrain) {
    recordTrace(ctx, {
      targetType: 'condition',
      targetId: `terrain.${resolvedTerrain}`,
      step: 'resolveConfig',
      result: 'rolled',
      causes: [{
        source: 'config.terrainOverride=auto',
        reason: 'Terrain not pinned. Weighted-rolled from regional pool.',
      }],
      downstreamEffects: [
        { target: 'tradeRoutePool', effect: 'terrain-constrained' },
        { target: 'resourcePool',   effect: 'terrain-biased' },
      ],
    });
  }

  if (routePool) {
    recordTrace(ctx, {
      targetType: 'condition',
      targetId: `tradeRoute.${tradeRoute}`,
      step: 'resolveConfig',
      result: 'rolled',
      causes: [{
        source: resolvedTerrain ? `terrain.${resolvedTerrain}` : 'config.tradeRouteAccess=random_trade',
        reason: noMagic && townPlus && rawRoute === 'isolated'
          ? `Rolled 'isolated' but town-plus + no-magic forces road access.`
          : `Picked from pool: ${routePool.join(', ')}.`,
      }],
      downstreamEffects: [
        { target: 'economicViability', effect: 'trade-access input' },
      ],
    });
  }

  // The isolated→road rewrite above also fires on an EXPLICIT
  // tradeRouteAccess:'isolated' (no routePool) — that path used to rewrite
  // the user's choice with no trace at all. Mirror the rolled-pool trace
  // shape so the override always leaves a receipt.
  if (!routePool && tradeRoute !== rawRoute) {
    recordTrace(ctx, {
      targetType: 'condition',
      targetId: `tradeRoute.${tradeRoute}`,
      step: 'resolveConfig',
      result: 'overridden',
      causes: [{
        source: `config.tradeRouteAccess=${rawRoute}`,
        reason: `Explicit 'isolated' chosen, but town-plus + no-magic forces road access.`,
      }],
      downstreamEffects: [
        { target: 'economicViability', effect: 'trade-access input' },
      ],
    });
  }

  if (config.monsterThreat === 'random_threat') {
    recordTrace(ctx, {
      targetType: 'threat',
      targetId: `monsterThreat.${threat}`,
      step: 'resolveConfig',
      result: 'rolled',
      causes: [{
        source: 'config.monsterThreat=random_threat',
        reason: 'Picked from frontier-weighted threat distribution.',
      }],
      downstreamEffects: [
        { target: 'defenseProfile', effect: 'threat-tier input' },
        // Only claim the floor when it actually bound — this used to assert
        // 'floored to 25' for every plagued roll, even when the user's
        // priorityMilitary was already ≥ 25 and nothing changed.
        ...(militaryFloor ? [{ target: 'priorityMilitary', effect: 'floored to 25' }] : []),
      ],
    });
  }

  // The plagued military floor (above) also fires on an EXPLICIT
  // monsterThreat choice ('plagued', or 'high' which normalizes to it) —
  // that path used to floor the user's priority silently. Same trace shape
  // as the rolled path; emitted only when the floor actually bound.
  if (config.monsterThreat !== 'random_threat' && militaryFloor) {
    recordTrace(ctx, {
      targetType: 'threat',
      targetId: `monsterThreat.${threat}`,
      step: 'resolveConfig',
      result: 'overridden',
      causes: [{
        source: `config.monsterThreat=${config.monsterThreat}`,
        reason: 'Explicit plagued-tier threat with priorityMilitary below 25. A settlement under that pressure cannot field less than a skeleton garrison.',
      }],
      downstreamEffects: [
        { target: 'priorityMilitary', effect: 'floored to 25' },
      ],
    });
  }

  if (config.culture === 'random_culture' || !config.culture) {
    recordTrace(ctx, {
      targetType: 'condition',
      targetId: `culture.${culture}`,
      step: 'resolveConfig',
      result: 'rolled',
      causes: [{
        source: config.culture ? `config.culture=${config.culture}` : 'config.culture=null',
        reason: 'Culture not pinned. Picked from canonical 11-culture catalog.',
      }],
      downstreamEffects: [
        { target: 'namePool',          effect: 'culture-scoped' },
        { target: 'institutionFlavor', effect: 'culture-scoped' },
      ],
    });
  }

  return {
    tier, population, tradeRoute, terrainType, resolvedTerrain,
    culture, magicLevel, threat, priorityMagicEffective,
    noMagic, townPlus, effectiveConfig,
    institutionToggles, categoryToggles, goodsToggles, servicesToggles,
  };
});
