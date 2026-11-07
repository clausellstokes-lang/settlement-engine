/**
 * foodLand.js — HOW MUCH THE LAND GROWS: one source (FIX-FOOD-ISOLATION second seat, the chair's ruling,
 * 2026-11-07).
 *
 * The food writer (foodGenerator.js :: generateFoodSecurity) and the isolation-support receipt
 * (isolationSupport.js :: deriveIsolationSupport) both read how much a place's land grows. They read it
 * from different tables and disagreed: the receipt scored an isolated town's foodshed at 6/52 while the
 * writer grew 85–99% of its need. This module is the writer's own land arithmetic, extracted unchanged
 * (the institution flags, the five food sources, the terrain's agricultureCapacity, the resource and
 * custom-producer bonuses, the custom-consumer need bonus), so both read one figure.
 *
 * Pure: a function of the tier, the roster and the config's pre-economy facts (terrain, route,
 * resources and their depletion, custom content). It reads nothing the economy pass writes and
 * draws no RNG. The year's fortune (the writer's seeded crop variance) and the stresses (famine,
 * siege, plague, war…) are NOT here: they are the year's, applied by the writer on top; this is the
 * land's ordinary harvest.
 */

import { grownShareOf, hasImportProcessor, hinterlandShareOf } from './economy/foodBalance.js';
import { TERRAIN_DATA } from '../data/geographyData.js';
import { customDeps } from '../lib/dependencyEngine.js';
import { nativeSemanticNames } from '../domain/content/customContentSemanticAuthority.js';
import { availableNativeResourceKeys } from '../domain/resourceSemantics.js';
import { waterAccessKind } from '../domain/tradeRouteSemantics.js';
import { hasMarketInstitution } from '../domain/facts/market.js';

// Registered custom food effects are deliberately small and bounded. These
// constants live beside the land's one source (moved with it from the canonical
// food writer, FIX-FOOD-ISOLATION second seat) so generation, prosperity,
// viability, and world-pulse stockpiles can never apply different versions of
// the author's declaration.
const CUSTOM_PRODUCER_CAPACITY_PER_ITEM = 0.15;
const CUSTOM_PRODUCER_CAPACITY_CAP = 0.6;
const CUSTOM_CONSUMER_NEED_PER_ITEM = 0.1;
const CUSTOM_CONSUMER_NEED_CAP = 0.5;

/**
 * The land's facts as the food writer reads them.
 * @param {string} tier
 * @param {Array<any>} institutions
 * @param {Record<string, any>} config
 * @param {string=} landRoute the route, where the caller holds it apart from the config
 */
export function foodLandOf(tier, institutions, config, landRoute) {
  const instNames = nativeSemanticNames(institutions)
    .map(name => name.toLowerCase());
  // Depleted resources stop feeding the food math (a depleted fishing ground no
  // longer counts as fishing). Reads BOTH depletion formats the DEPLETE_RESOURCE
  // event maintains; inert (identical output) when nothing is depleted.
  const flatDepletedResources = new Set([
    ...(config.nearbyResourcesDepleted || []),
    ...Object.entries(config.nearbyResourcesState || {})
      .filter(([, v]) => v === 'depleted')
      .map(([k]) => k),
  ]);
  const resources = (config.nearbyResources || []).filter(
    resource => !flatDepletedResources.has(resource),
  );
  const customResourceNames = new Set(
    (config.nearbyResourcesCustom || []).map(name => String(name).toLowerCase()),
  );
  const presentCustomResources = resources.filter(
    name => customResourceNames.has(String(name).toLowerCase()),
  );
  const exactCustomResources = Array.isArray(
    config.nearbyResourceDefinitions,
  )
    ? config.nearbyResourceDefinitions
    : null;
  const depletedCustomResourceIds = new Set(
    (Array.isArray(config.nearbyResourceDefinitionsDepleted)
      ? config.nearbyResourceDefinitionsDepleted
      : [])
      .map(definition => (
        definition?.customDefinitionId
        || definition?.localUid
        || ''
      ))
      .filter(Boolean),
  );
  const materializedCustomResources = exactCustomResources
    ? exactCustomResources.filter(definition => (
        !depletedCustomResourceIds.has(
          definition?.customDefinitionId || definition?.localUid,
        )
      ))
    : presentCustomResources;
  // Source sidecars permit a native resource and custom definition to share a
  // display label. Project native membership explicitly instead of subtracting
  // custom labels and accidentally erasing the native resource.
  const nativeResources = availableNativeResourceKeys(config);
  const route         = landRoute || config.tradeRouteAccess || 'road';
  const terrain       = config.terrainType || 'plains';
  const hasInst  = (...keys) => instNames.some(n => keys.some(k => n.includes(k)));
  const hasRes = (...keys) => nativeResources.some(
    resource => keys.some(key => String(resource).includes(key)),
  );

  // ── Institution flags ─────────────────────────────────────────────────────
  const hasSubsistence    = hasInst('subsistence', 'common field', 'household farm', 'farming community');
  const hasFarmland       = hasInst('farmland', 'grain field', 'managed farmland');
  // A stand-in ("Access to external mill") is not a mill: it extends no stores (FOOD-2).
  // (the grain-processor read the import check already uses: sawmills and stand-ins excluded)
  const hasMill           = hasImportProcessor(institutions || [], 'grain', {});
  const hasGranary        = hasInst('town granary', 'village granary', 'granary');
  const hasCityGranary    = hasInst('city granari');
  const hasStateGranary   = hasInst('state granary');
  const hasFishing        = hasInst('fish', 'fishing') || hasRes('fishing_grounds', 'river_fish');
  // F3 FOOD-WORDS unit 3 (the chair's ruling, 2026-11-04): a fishing row on water IS the catch —
  // a Fisher's landing, a fishery or a fish market where the water fact is not 'none' feeds the
  // place even when the terrain rolled no fishing-grounds resource. A Fishmonger is a trader.
  const fishRowOnWater    = hasInst('fisher', 'fishery', 'fishing', 'fish market') && waterAccessKind(terrain, route) !== 'none';
  const fishSource        = hasFishing && (hasRes('fishing_grounds', 'river_fish') || fishRowOnWater);
  const hasPastoral       = hasInst('pastoral', 'grazing', 'livestock', 'shepherd', 'common graz');
  const hasHunting        = hasInst('hunting', 'managed forest', 'woodcutter');
  const hasMarket         = hasMarketInstitution(institutions); // CENSUS-1 fact 5: the market home (a black market is not one) — MERGE-R2 (the chair's ruling 3): the catalogue's tags are the one detector
  const _hasBakery         = hasInst('baker', 'bakery');
  const hasDruid          = hasInst('druid', 'grove', 'elder grove', 'sacred grove'); // J33: Warden's Lodge is defence, not druid (the owner, 2026-10-01)
  const hasDivine         = hasInst('cathedral', 'monastery', 'great cathedral', 'parish church');
  const hasArcane         = hasInst('mage', 'wizard', 'arcane', 'spellcasting');

  // ── THE FOOD SOURCES (FOOD-3) — the five resource+institution pairings the balance reads,
  // LARGEST CONTRIBUTION FIRST (the order of their bonuses below: grain .25, livestock .10, fish
  // .09, mill .08; game, the small-place hunt, last). A place whose pairings all miss lists none.
  const foodSources = /** @type {Array<'grain'|'livestock'|'fish'|'mill'|'game'>} */ ([
    ['grain', (hasSubsistence || hasFarmland) && hasRes('grain_fields', 'fertile_floodplain')],
    ['livestock', hasPastoral && hasRes('grazing_land')],
    ['fish', fishSource],
    ['mill', hasMill && hasRes('river_mills')],
    ['game', hasRes('hunting_grounds') && (hasHunting || ['thorp', 'hamlet', 'village'].includes(tier))],
  ].filter(([, fired]) => fired).map(([name]) => name));
  // Preserved fish, meat and game count beside grain in the stores: a quarter month for each
  // such source, three quarters at most (FOOD-3, the one diversity term in the stores).
  const preservedSources = foodSources.filter(source => source === 'livestock' || source === 'fish' || source === 'game').length;

  // ── Physics-based caloric calculation ────────────────────────────────────
  // Use the same constants as buildFactionList for consistency
  // ONE terrain table: geographyData's (FOOD-2). The private copy this file kept read plains
  // 1.0 where geography reads 1.5, riverside 0.9 where it reads 1.3.
  const terrainAgri    = TERRAIN_DATA[/** @type {keyof typeof TERRAIN_DATA} */ (terrain)]?.agricultureCapacity ?? 1;
  let agriMod = 0;
  if ((hasSubsistence || hasFarmland) && hasRes('grain_fields','fertile_floodplain')) agriMod += 0.25;
  if (hasFarmland && hasRes('fertile_floodplain'))  agriMod += 0.10;
  if (hasPastoral  && hasRes('grazing_land'))        agriMod += 0.10;
  if (fishSource)                                    agriMod += 0.09;
  if (hasMill      && hasRes('river_mills'))         agriMod += 0.08;
  agriMod = Math.min(agriMod, 0.5);

  // Custom content enters food physics exactly once, here, in the writer of
  // economicState.foodSecurity. The viability model is only a view of this
  // record, and the world-pulse stockpile advances its persisted deficit and
  // surplus. Applying the tally in either downstream consumer would double
  // count or create a second food truth.
  const customFoodImpact = customDeps.foodImpactTally(
    institutions || [],
    materializedCustomResources,
    tier,
  );
  const customProducerCapacityBonus = Math.min(
    customFoodImpact.producers * CUSTOM_PRODUCER_CAPACITY_PER_ITEM,
    CUSTOM_PRODUCER_CAPACITY_CAP,
  );
  const customConsumerNeedBonus = Math.min(
    customFoodImpact.consumers * CUSTOM_CONSUMER_NEED_PER_ITEM,
    CUSTOM_CONSUMER_NEED_CAP,
  );
  agriMod += customProducerCapacityBonus;
  const effectiveAgri = Math.min(terrainAgri + agriMod, 2.0);


  // THE LAND'S ORDINARY HARVEST, as a share of the place's ordinary need: what its own fields grow on
  // the part of its need it feeds itself (the hinterland's share is grown by the countryside around it),
  // over the need the custom consumers raise. The writer's production with no stress and an average year.
  const hinterlandShare = hinterlandShareOf(tier);
  const grownShareOfNeed = ((1 - hinterlandShare) * grownShareOf(effectiveAgri)) / (1 + customConsumerNeedBonus);

  return {
    instNames, hasInst, hasRes,
    hasSubsistence, hasFarmland, hasMill, hasGranary, hasCityGranary, hasStateGranary,
    hasPastoral, hasHunting, hasMarket, hasDruid, hasDivine, hasArcane,
    fishSource, foodSources, preservedSources,
    terrain, terrainAgri, effectiveAgri,
    customFoodImpact, customProducerCapacityBonus, customConsumerNeedBonus,
    hinterlandShare, grownShareOfNeed,
  };
}
