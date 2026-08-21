/**
 * foodGenerator.js
 * Computes a structured foodSecurity object from settlement inputs.
 *
 * Inputs:  tier, institutions, config (includes _population, tradeRouteAccess,
 *          terrainType, nearbyResources, priorityMagic, magicExists, stressTypes,
 *          monsterThreat, priorityEconomy)
 *
 * Output:  foodSecurity object with label, ratio, source chains, storage,
 *          import dependency, magic supplement, prosperity modifier.
 *
 * This feeds into:
 *   - Prosperity calculation (floor/cap/bonus via prosperityMod)
 *   - Viability warnings (deficit/dependency flags)
 *   - Defense Disasters & Famine score (storageMonths × diversityScore)
 *   - Economics tab UI
 */

import { getActiveRng } from '../kernel/rngContext.js';
import { FOOD_IMPORT_RATES } from '../data/foodImportRates.js';
import { customDeps } from '../lib/dependencyEngine.js';
import {
  nativeSemanticNames,
} from '../domain/content/customContentSemanticAuthority.js';
import { availableNativeResourceKeys } from '../domain/resourceSemantics.js';
import {
  hasTradeRouteConnection,
  isTradeRouteDisconnected,
  SEASONAL_ROUTE_FOOD_IMPORT_RATE,
} from '../domain/tradeRouteSemantics.js';

// ── Constants (match buildFactionList in economicGenerator) ────────────────
const PER_CAPITA_NEED        = 2;    // lbs/day per person
const FARMER_PRODUCTION      = 6;    // lbs/day per farming worker
const AGRICULTURAL_WORKFORCE = 0.4;  // fraction of population that farms

// ── Terrain agriculture capacities (matches TERRAIN_DATA) ─────────────────
const TERRAIN_AGRI = {
  plains: 1.0, coastal: 0.7, riverside: 0.9, forest: 0.5,
  hills: 0.6, desert: 0.3, mountain: 0.4,
};

// Registered custom food effects are deliberately small and bounded. These
// constants live beside the canonical food writer so generation, prosperity,
// viability, and world-pulse stockpiles can never apply different versions of
// the author's declaration.
const CUSTOM_PRODUCER_CAPACITY_PER_ITEM = 0.15;
const CUSTOM_PRODUCER_CAPACITY_CAP = 0.6;
const CUSTOM_CONSUMER_NEED_PER_ITEM = 0.1;
const CUSTOM_CONSUMER_NEED_CAP = 0.5;

export function generateFoodSecurity(tier, institutions, config) {
  // Native catalog names remain a compatibility vocabulary for old saves.
  // Current custom names are presentation-only and must not impersonate a
  // granary, mill, market, magical transit node, or religious food anchor.
  // Their registered `foodImpact` declarations enter once through the tally
  // below instead.
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
  const route         = config.tradeRouteAccess || 'road';
  const hasPhysicalTradeRoute = hasTradeRouteConnection(route);
  const terrain       = config.terrainType || 'plains';
  const _threat        = config.monsterThreat || 'heartland';
  const stresses      = config.stressTypes || (config.stressType ? [config.stressType] : []);
  const priorityMagic = config.priorityMagic ?? 0;
  const magicExists   = config.magicExists !== false;
  const population    = config._population || tierDefaultPop(tier);

  const hasInst  = (...keys) => instNames.some(n => keys.some(k => n.includes(k)));
  const hasRes = (...keys) => nativeResources.some(
    resource => keys.some(key => String(resource).includes(key)),
  );

  // ── Institution flags ─────────────────────────────────────────────────────
  const hasSubsistence    = hasInst('subsistence', 'common field', 'household farm', 'farming community');
  const hasFarmland       = hasInst('farmland', 'grain field', 'managed farmland');
  const hasMill           = hasInst('mill', 'miller', 'windmill', 'watermill');
  const hasGranary        = hasInst('town granary', 'village granary', 'granary');
  const hasCityGranary    = hasInst('city granari');
  const hasStateGranary   = hasInst('state granary');
  const hasFishing        = hasInst('fish', 'fishing') || hasRes('fishing_grounds', 'river_fish');
  const hasPastoral       = hasInst('pastoral', 'grazing', 'livestock', 'shepherd', 'common graz');
  const hasHunting        = hasInst('hunting', 'managed forest', 'woodcutter');
  const hasOrchard        = hasInst('orchard', 'kitchen garden', 'herb garden');
  const hasMarket         = hasInst('market', 'marketplace', 'daily market', 'district market');
  const _hasBakery         = hasInst('baker', 'bakery');
  const hasDruid          = hasInst('druid', 'grove', 'elder grove', 'sacred grove', 'warden');
  const hasDivine         = hasInst('cathedral', 'monastery', 'great cathedral', 'parish church');
  const hasArcane         = hasInst('mage', 'wizard', 'arcane', 'spellcasting');

  // ── Magical transport check (used in chains AND importCoverageRate) ────────
  // Circles and airships are NOT interchangeable: a teleportation circle is
  // point-to-point and a blockade cannot touch it; an airship must fly over
  // the besieger and lands a fraction of its open-sky throughput.
  const hasTeleportCircle = instNames.some(n =>
    n.includes('teleportation') || n.includes('planar') || n.includes('extradimensional')
  );
  const hasAirshipDock = instNames.some(n => n.includes('airship'));
  const hasTeleport = hasTeleportCircle || hasAirshipDock;

  // ── Source chain diversity ────────────────────────────────────────────────
  // Each independent chain is a fallback when others fail.
  const chains = {
    'Grain & agriculture': hasSubsistence || hasFarmland || hasRes('grain_fields', 'fertile_floodplain') || hasInst('granary', 'grain', 'mill', 'bakery', 'brewery', 'distillery'),
    'Pastoral & livestock': hasPastoral || hasRes('grazing_land') || hasInst('butcher', 'livestock', 'slaughter', 'dairy', 'cheese', 'tanner', 'tannery'),
    'Fishing & water':      hasFishing,
    'Hunting & foraging':   hasHunting || hasOrchard || hasRes('hunting_grounds', 'foraging_areas'),
    'Trade & imports':      (hasPhysicalTradeRoute || hasTeleport) && hasMarket,
  };
  const activeChains      = Object.entries(chains).filter(([,v])=>v).map(([k])=>k);
  const activeChainsCount = activeChains.length;
  const diversityScore    = Math.min(1, activeChainsCount / 3); // 0–1 normalized

  // ── Storage buffer (months of food security) ──────────────────────────────
  const baseStorage = hasStateGranary ? (tier === 'metropolis' ? 12 : 8)
                    : hasCityGranary  ? (tier === 'city' ? 7 : 5)
                    : hasGranary      ? (tier === 'town' ? 5 : tier === 'village' ? 3.5 : 2.5)
                    : (['thorp','hamlet'].includes(tier) ? 1.5 : 1.0);
  // Mill extends storage — flour lasts longer than grain
  const storageMonths = Math.round((hasMill ? baseStorage * 1.25 : baseStorage) * 10) / 10;

  // ── Import dependency ─────────────────────────────────────────────────────
  // How much of caloric needs can the settlement import, and does it need to?
  // Isolated settlements still receive a trickle through minor routes and
  // sanctioned caravans (0.05); magical transport raises the ceiling to its
  // capped, expensive rate. This nonzero dependency is what lets a siege
  // bite an isolated settlement's granary at tick time (foodStockpile).
  const _isolatedImportCapacity =
    hasTeleport && magicExists
      ? FOOD_IMPORT_RATES.teleport
      : 0.05;
  const _noRouteImportCapacity =
    hasTeleport && magicExists
      ? FOOD_IMPORT_RATES.teleport
      : 0;
  const importCapacity = {
    isolated: _isolatedImportCapacity,
    none: _noRouteImportCapacity,
    road: 0.20,
    river: 0.28,
    crossroads: 0.42,
    port: 0.58,
  }[route] ?? 0;
  const tierImportNeed = { thorp:0, hamlet:0, village:0.05, town:0.20, city:0.38, metropolis:0.52 }[tier] ?? 0;
  const importDependency = Math.min(importCapacity, tierImportNeed + (hasMarket ? 0.04 : 0));
  const importPct        = Math.round(importDependency * 100);

  // ── Magic food supplement ─────────────────────────────────────────────────
  // Tier-scaled: negligible at thorp/hamlet, meaningful at town+, significant at metro
  const magicActive    = magicExists && priorityMagic > 25;
  const magicTierScale = { thorp:0, hamlet:0, village:0.12, town:0.28, city:0.52, metropolis:0.78 }[tier] ?? 0;
  const magicInstMult  = hasDruid ? 1.5 : hasDivine ? 1.1 : hasArcane ? 0.8 : 0.4;
  const magicSupplement = magicActive
    ? Math.min(0.35, Math.max(0, (priorityMagic - 25) / 75) * magicTierScale * magicInstMult)
    : 0;
  // magicSupplement: 0 → 0.35 fraction of food pressure relieved by magic

  // ── Physics-based caloric calculation ────────────────────────────────────
  // Use the same constants as buildFactionList for consistency
  const terrainAgri    = TERRAIN_AGRI[terrain] ?? 1.0;
  let agriMod = 0;
  if ((hasSubsistence || hasFarmland) && hasRes('grain_fields','fertile_floodplain')) agriMod += 0.25;
  if (hasFarmland && hasRes('fertile_floodplain'))  agriMod += 0.10;
  if (hasPastoral  && hasRes('grazing_land'))        agriMod += 0.10;
  if (hasFishing   && hasRes('fishing_grounds','river_fish')) agriMod += 0.09;
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

  // Stress modifiers
  const stressFamine  = stresses.includes('famine');
  const stressSiege   = stresses.includes('under_siege');
  const stressPlague  = stresses.includes('plague_onset');
  const stressOccupied= stresses.includes('occupied');
  let productionMult  = 1;
  let consumptionMult = 1;
  let effectiveRoute  = route;
  if (stressFamine)   { productionMult  *= 0.35; }
  if (stressSiege)    { productionMult  *= 0.60; effectiveRoute = 'isolated'; }
  if (stressPlague)   { productionMult  *= 0.75; }
  if (stressOccupied) { consumptionMult *= 1.20; }
  // [generators-domain-1] second-wave stress types whose viabilityNote implies a food
  // impact: wartime conscription thins the agricultural workforce; a slave_revolt disrupts
  // labour-dependent production; mass_migration stresses the food balance (immigration →
  // more mouths). Defense scores stay coupled to these types via the priorityHelpers
  // effective-score multipliers, so there is deliberately NO inline defense penalty (it
  // would double-count). Golden-shifting (G2).
  if (stresses.includes('wartime'))        { productionMult  *= 0.85; }
  if (stresses.includes('slave_revolt'))   { productionMult  *= 0.80; }
  if (stresses.includes('mass_migration')) { consumptionMult *= 1.15; }

  const baseDailyNeed = population * PER_CAPITA_NEED;
  const dailyNeed = (
    baseDailyNeed * consumptionMult
    + baseDailyNeed * customConsumerNeedBonus
  );
  // Seeded crop-fortune variance (±8%): the SAME config yields a slightly
  // different harvest per seed — good years vs lean years — so re-rolling a
  // settlement varies its food resilience instead of producing an identical
  // number. Forked into an ISOLATED sub-stream so it never perturbs other
  // economy consumers' RNG; deterministic per seed; a flat 1.0 (no jitter) when
  // no seeded RNG is active (non-pipeline callers stay deterministic).
  const _cropRng = getActiveRng()?.fork?.('food.cropFortune') || null;
  const cropFortune = _cropRng ? 1 + (_cropRng.random() * 2 - 1) * 0.08 : 1;
  const dailyProduction = Math.floor(population * AGRICULTURAL_WORKFORCE) * FARMER_PRODUCTION
                          * effectiveAgri * productionMult * cropFortune / 1.3; // /1.3 = STORAGE_BUFFER constant
  const rawSurplus      = dailyProduction - dailyNeed;
  const rawDeficit      = Math.max(0, -rawSurplus);
  // Magic trade bypass: isolated settlements with magical transport get import
  // coverage below road level (0.35) — real but expensive, rationed to what is
  // necessary. The channel has its own supply chain: without an arcane
  // maintainer on the roster, throughput halves. Under siege a teleportation
  // circle is untouchable (blockades cannot interdict point-to-point transit);
  // an airship-only settlement runs the blockade at half its magical rate; and
  // the minor-route trickle (sanctioned caravans, pilgrimage traffic, protected
  // convoys) that every isolated town+ otherwise receives is severed entirely.
  // Rates come from the shared channel ladder (data/foodImportRates.js).
  const disconnectedRoute = isTradeRouteDisconnected(effectiveRoute);
  const hasMagicTradeImport =
    disconnectedRoute
    && hasTeleport
    && config.magicExists !== false;
  const _hasArcaneMaintainer = hasArcane || hasInst('alchemist', 'academy');
  const _maintainerMult = _hasArcaneMaintainer ? 1 : 0.5;
  const _magicTradeRate = !hasMagicTradeImport ? 0
    : hasTeleportCircle ? FOOD_IMPORT_RATES.teleport
    : (stressSiege ? FOOD_IMPORT_RATES.airshipBesieged : FOOD_IMPORT_RATES.airship); // airship-only: impaired blockade-running under siege
  const _minorRouteRate = (route === 'isolated' && !stressSiege)
    ? (['town','city','metropolis'].includes(tier) ? FOOD_IMPORT_RATES.minorRoutes
      : tier === 'village' ? FOOD_IMPORT_RATES.minorRoutesVillage : 0)
    : 0;
  // Terrain-aware import coverage: mountain/desert settlements structurally
  // depend on food imports — they import more efficiently (specialized trade infrastructure)
  const _isLowAgriTerrain = ['mountain','desert','hills'].includes(config.terrainType || '');
  const _terrainImportBoost =
    _isLowAgriTerrain && hasTradeRouteConnection(effectiveRoute)
      ? 0.15
      : 0;
  // The mountain_pass rung is the annualized seasonal rate and takes no terrain
  // boost: for a pass town the binding constraint is the winter closure, not
  // the efficiency of its trade infrastructure, and the pass IS that
  // infrastructure. Below road, above the isolated trickle.
  const importCoverageRate = disconnectedRoute
                           ? Math.max(_magicTradeRate * _maintainerMult, _minorRouteRate)
                           : effectiveRoute === 'port'       ? 0.70
                           : effectiveRoute === 'crossroads' ? 0.60
                           : effectiveRoute === 'river'      ? 0.50
                           : effectiveRoute === 'road'
                             ? (0.35 + _terrainImportBoost)
                             : effectiveRoute === 'mountain_pass'
                               ? SEASONAL_ROUTE_FOOD_IMPORT_RATE
                               : 0;
  const importCoverage  = rawDeficit > 0 ? Math.min(rawDeficit, rawDeficit * importCoverageRate) : 0;

  // Magic food offset
  let magicOffset = 0;
  const remaining = rawDeficit - importCoverage;
  if (magicActive && remaining > 0) {
    if (hasDruid  && priorityMagic >= 30) magicOffset = Math.max(magicOffset, remaining * 0.65);
    else if (hasDivine && config.priorityReligion >= 55) magicOffset = Math.max(magicOffset, remaining * 0.40);
    else if (hasArcane && priorityMagic >= 50)          magicOffset = Math.max(magicOffset, remaining * 0.30);
  }

  const deficit       = Math.max(0, rawDeficit - importCoverage - magicOffset);
  const deficitPct    = dailyNeed > 0 ? deficit / dailyNeed * 100 : 0;
  const surplusPct    = dailyNeed > 0 ? Math.max(0, rawSurplus / dailyNeed * 100) : 0;

  // Normalized food ratio — 1.0 = exactly adequate
  const localRatio    = dailyProduction / Math.max(1, dailyNeed);
  const importedRatio = importCoverage / Math.max(1, dailyNeed);
  const magicRatio    = magicOffset / Math.max(1, dailyNeed);
  const foodRatio     = Math.min(2.0, localRatio + importedRatio + magicRatio);

  // ── Food security label ───────────────────────────────────────────────────
  let label, color, bg;
  if (stressFamine) {
    label = 'Deficit — Active Famine';
    color = '#8b1a1a'; bg = '#fdf4f4';
  } else if (deficitPct > 40) {
    label = 'Deficit';
    color = '#8b1a1a'; bg = '#fdf4f4';
  } else if (deficitPct > 15) {
    label = 'Import-Dependent';
    color = '#8a3010'; bg = '#fdf0e8';
  } else if (deficitPct > 5) {
    label = 'Pressured';
    color = '#7a5010'; bg = '#faf8e8';
  } else if (surplusPct > 40) {
    label = 'Surplus';
    color = '#1a5a28'; bg = '#f0faf4';
  } else {
    label = 'Secure';
    color = '#2a6a38'; bg = '#f4fbf6';
  }

  // ── Prosperity modifier ───────────────────────────────────────────────────
  // Food security floors or caps prosperity before other modifiers apply
  let prosperityMod = null;
  // Magic-trade isolated settlements can import food at extraordinary cost — soften caps to penalties
  const _magicFoodMitigated = hasMagicTradeImport;
  // Terrain-structural deficits: mountain/desert settlements import food by economic design.
  // A mountain mining town or desert caravan hub with road trade access is NOT in crisis
  // just because it can't grow grain locally. Treat as structural dependency, not crisis cap.
  const _terrainStructural = (terrain === 'mountain' || terrain === 'desert' || terrain === 'hills')
    && hasTradeRouteConnection(effectiveRoute);

  if (stressFamine) {
    prosperityMod = { type: 'cap', value: 0, reason: 'Active famine: food production collapsed, prosperity cannot exceed Struggling' };
  } else if (deficitPct > 40) {
    if (_terrainStructural) {
      // Mountain/desert: severe deficit is normal — penalty not hard cap, imports cover it
      prosperityMod = { type: 'penalty', value: -1, reason: 'Terrain requires significant food imports — structural dependency, not crisis' };
    } else if (_magicFoodMitigated) {
      prosperityMod = { type: 'cap', value: 2, reason: 'Severe food deficit mitigated by magical imports — prosperity capped at Moderate' };
    } else {
      prosperityMod = { type: 'cap', value: 1, reason: 'Severe structural food deficit caps prosperity at Poor' };
    }
  } else if (deficitPct > 20) {
    if (_terrainStructural) {
      // Minor penalty only — importing food is normal for these terrains
      prosperityMod = null; // no modifier — structural import is priced into economy
    } else if (_magicFoodMitigated) {
      prosperityMod = { type: 'penalty', value: -1, reason: 'Food imports via magical infrastructure are reliable but costly' };
    } else {
      prosperityMod = { type: 'cap', value: 1, reason: 'Food deficit caps prosperity at Poor' };
    }
  } else if (deficitPct > 8) {
    prosperityMod = { type: 'penalty', value: -1, reason: 'Food pressure reduces prosperity by one level' };
  } else if (surplusPct > 40 && activeChainsCount >= 3 && (hasGranary || hasCityGranary || hasStateGranary)) {
    prosperityMod = { type: 'bonus', value: 0.4, reason: 'Agricultural surplus with reserves provides modest prosperity bonus' };
  }

  // ── Descriptive narrative ─────────────────────────────────────────────────
  const diversityNote = activeChainsCount >= 4 ? 'highly diversified diet'
                      : activeChainsCount === 3 ? 'three food source types'
                      : activeChainsCount === 2 ? 'two food source types'
                      : activeChainsCount === 1 ? 'single food source'
                      : 'no established food chains';

  const storageNote = storageMonths >= 8 ? `${storageMonths} months strategic reserve`
                    : storageMonths >= 4 ? `${storageMonths} months buffer`
                    : storageMonths >= 2 ? 'seasonal buffer only'
                    : 'minimal storage — vulnerable to disruption';

  const magicNote = magicSupplement > 0.2 ? 'Significant magical food supplement'
                  : magicSupplement > 0.1 ? 'Modest magical food supplement'
                  : magicSupplement > 0 ? 'Trace magical food contribution'
                  : null;

  const importNote = importPct >= 40 ? `${importPct}% import-dependent — trade disruption = immediate crisis`
                   : importPct >= 20 ? `${importPct}% imported — meaningful external dependency`
                   : importPct >= 5  ? `${importPct}% supplemented by imports`
                   : null;

  return {
    label, color, bg,

    // Core metrics
    foodRatio:       Math.round(foodRatio * 100) / 100,
    deficitPct:      Math.round(deficitPct),
    surplusPct:      Math.round(surplusPct),
    dailyNeed:       Math.round(dailyNeed),
    dailyProduction: Math.round(dailyProduction),

    // Source chains
    chains,
    activeChains,
    activeChainsCount,
    diversityNote,

    // Storage
    storageMonths,
    storageNote,

    // Import dependency
    importPct,
    importDependency,
    importNote,
    // Which magical channel (if any) carries isolated/besieged imports —
    // 'teleport' is blockade-proof, 'airship' runs blockades impaired.
    magicTradeChannel: hasMagicTradeImport ? (hasTeleportCircle ? 'teleport' : 'airship') : null,

    // Magic
    magicSupplement: Math.round(magicSupplement * 100),  // as % of pressure
    magicNote,

    // Stress flags
    isDeficit:        deficitPct > 20 || stressFamine,
    isPressured:      deficitPct > 5 && deficitPct <= 20,
    isSecure:         deficitPct <= 5 && surplusPct <= 40,
    isSurplus:        surplusPct > 40,
    hasFamine:        stressFamine,
    hasSiege:         stressSiege,

    // Prosperity modifier to apply before base calculation
    prosperityMod,

    // For defense Disasters & Famine score
    resilienceScore: Math.round(
      (storageMonths / 12 * 35)          // storage weight
      + (diversityScore * 30)             // diversity weight
      + (importDependency < 0.2 ? 15 : importDependency < 0.4 ? 8 : 0) // low dependency bonus
      + (deficitPct < 5 ? 20 : deficitPct < 20 ? 10 : 0)               // adequacy bonus
    ),

    // Explain the bounded authored contribution without changing the shape of
    // vanilla settlements. Counts identify what activated; the two normalized
    // values expose the exact modifier the canonical writer applied.
    ...(customFoodImpact.producers > 0 || customFoodImpact.consumers > 0 ? {
      customFoodImpact: {
        producers: customFoodImpact.producers,
        consumers: customFoodImpact.consumers,
        agricultureCapacityBonus: customProducerCapacityBonus,
        dailyNeedBonusPct: Math.round(customConsumerNeedBonus * 100),
      },
    } : {}),
  };
}

function tierDefaultPop(tier) {
  return { thorp:40, hamlet:200, village:600, town:3000, city:12000, metropolis:40000 }[tier] ?? 500;
}
