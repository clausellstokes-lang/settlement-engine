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
import { FOOD_IMPORT_RATES, SIEGE_PRODUCTION_KEPT } from '../data/foodImportRates.js';
import { FOOD_SECURITY_CUTS, foodSecurityBandOf, foodSecurityFlagsOf } from '../data/bandLadders.js';
import { deriveFoodRecord, grownShareOf, hasImportProcessor, hinterlandShareOf } from './economy/foodBalance.js';
import { TERRAIN_DATA } from '../data/geographyData.js';
import { CULTURE_PROFILES } from '../data/cultureProfiles.js';
import { composeFoodwaysLine } from '../domain/foodways.js';
import { POPULATION_RANGES } from '../data/constants.js';
import { customDeps } from '../lib/dependencyEngine.js';
import {
  nativeSemanticNames,
} from '../domain/content/customContentSemanticAuthority.js';
import { availableNativeResourceKeys } from '../domain/resourceSemantics.js';
import {
  hasTradeRouteConnection,
  isTradeRouteDisconnected,
  SEASONAL_ROUTE_FOOD_IMPORT_RATE,
  waterAccessKind,
} from '../domain/tradeRouteSemantics.js';

// ── THE BASE NUMBERS (FOOD-2, chair ruling 2, 2026-11-03; fix shape E) ──────────────
// Per capita and per tier, so the arithmetic holds under any headcount scale. Every place
// is no longer one farm with four in ten in the fields: a household on ordinary land grows
// about its own need, the land moves that share (gently: a place is sized to what its land
// feeds), and towns and larger draw a NORMAL share of their need from a hinterland, which is
// supply, not a gap. The hidden "/1.3 storage buffer" on production is gone: what a place
// stores is its storageMonths, the stores term, and nothing else.
// The shares themselves live beside the record: foodBalance.js :: grownShareOf, hinterlandShareOf.
const PER_CAPITA_NEED   = 2;   // lbs/day per person

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
  const hasOrchard        = hasInst('orchard', 'kitchen garden', 'herb garden');
  const hasMarket         = hasInst('market', 'marketplace', 'daily market', 'district market');
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
                    // 2026-11-04 (T2, the soak 1000 dry run §4, adopted by the chair): a village with no
                    // granary stored 1.0 month to a hamlet's 1.5 (village median 1.3 vs hamlet 1.5 over
                    // 1,000 places; 0 of 167 villages had a granary), so a village now takes the
                    // thorp/hamlet value.
                    : (['thorp','hamlet','village'].includes(tier) ? 1.5 : 1.0);
  // Mill extends storage — flour lasts longer than grain
  const storageMonths = Math.round(((hasMill ? baseStorage * 1.25 : baseStorage) + Math.min(3, preservedSources) / 4) * 10) / 10;

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
  const tierImportNeed = hinterlandShareOf(tier); // the hinterland share, one table (FOOD-2)
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

  // Stress modifiers
  const stressFamine  = stresses.includes('famine');
  const stressSiege   = stresses.includes('under_siege');
  const stressPlague  = stresses.includes('plague_onset');
  const stressOccupied= stresses.includes('occupied');
  let productionMult  = 1;
  let consumptionMult = 1;
  let effectiveRoute  = route;
  // FOOD-3: the famine fails ONE source — the largest, chosen with zero draws — as deep as that
  // source's share of the harvest: a single-source place (or one with none) still loses 65%,
  // two sources lose a half, three a third. The record names it (failedSource).
  const failedSource = stressFamine ? (foodSources[0] ?? null) : null;
  const famineKeeps = foodSources.length >= 2 ? 1 - 1 / foodSources.length : 7 / 20;
  if (stressFamine)   { productionMult  *= famineKeeps; }
  if (stressSiege)    { productionMult  *= SIEGE_PRODUCTION_KEPT; effectiveRoute = 'isolated'; }
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
  // What the place grows itself: the share of its own need its fields cover, on the part of
  // its need it feeds itself. The hinterland's share (none for a hamlet, half for a
  // metropolis) is grown by the countryside around it and arrives as ordinary supply below.
  const hinterlandShare = hinterlandShareOf(tier);
  const dailyProduction = baseDailyNeed * (1 - hinterlandShare) * grownShareOf(effectiveAgri)
                          * productionMult * cropFortune;
  const rawSurplus      = dailyProduction - dailyNeed;
  const rawDeficit      = Math.max(0, -rawSurplus);
  // The hinterland's carts: the same harvest (season and stresses alike), cut off by a siege.
  const hinterlandSupply = stressSiege ? 0
    : Math.min(rawDeficit, baseDailyNeed * hinterlandShare * productionMult * cropFortune);
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
  // Ordinary supply: the hinterland first, then the trade channel carries its share of what
  // remains. Both are imports to the dossier ("+ N imported"); the record keeps them apart.
  const channelGap      = rawDeficit - hinterlandSupply;
  const importCoverage  = hinterlandSupply + (channelGap > 0 ? channelGap * importCoverageRate : 0);

  // Magic food offset
  let magicOffset = 0;
  const remaining = rawDeficit - importCoverage;
  if (magicActive && remaining > 0) {
    if (hasDruid  && priorityMagic >= 30) magicOffset = Math.max(magicOffset, remaining * 0.65);
    else if (hasDivine && config.priorityReligion >= 55) magicOffset = Math.max(magicOffset, remaining * 0.40);
    else if (hasArcane && priorityMagic >= 50)          magicOffset = Math.max(magicOffset, remaining * 0.30);
  }

  const deficit       = Math.max(0, rawDeficit - importCoverage - magicOffset);
  // ⛔ THE SHARE IS THE SHARE OF THE POUNDS PUBLISHED (LANDING-7 lane H, STOP-1, 2026-11-06). The
  // card publishes `deficit` and `dailyNeed` as integer pounds, so its per cent is what THOSE pounds
  // are of THAT need, never the unrounded gap's share carried beside them: carried, a gap of a third
  // of a pound on a 32 lb thorp published 0 lb beside 1% (17 golden thorps), the sign broken at the
  // single writer itself, and no view of it could hold both laws. The band, the flags, the
  // prosperity modifier and the food record all read this one figure. No floor.
  const deficitPct    = Math.round(dailyNeed) > 0 ? Math.round(deficit) / Math.round(dailyNeed) * 100 : 0;
  const surplusPct    = dailyNeed > 0 ? Math.max(0, rawSurplus / dailyNeed * 100) : 0;

  // Normalized food ratio — 1.0 = exactly adequate
  const localRatio    = dailyProduction / Math.max(1, dailyNeed);
  const importedRatio = importCoverage / Math.max(1, dailyNeed);
  const magicRatio    = magicOffset / Math.max(1, dailyNeed);
  const foodRatio     = Math.min(2.0, localRatio + importedRatio + magicRatio);

  // ── Food security label ───────────────────────────────────────────────────
  const { label, color, bg } = foodSecurityBandOf(stressFamine, deficitPct, surplusPct);

  // ── Prosperity modifier ───────────────────────────────────────────────────
  // Food security floors or caps prosperity before other modifiers apply
  // Magic-trade isolated settlements can import food at extraordinary cost — soften caps to penalties
  // Terrain-structural deficits: mountain/desert settlements import food by economic design.
  // A mountain mining town or desert caravan hub with road trade access is NOT in crisis
  // just because it can't grow grain locally. Treat as structural dependency, not crisis cap.
  const _terrainStructural = (terrain === 'mountain' || terrain === 'desert' || terrain === 'hills')
    && hasTradeRouteConnection(effectiveRoute);
  const hasAnyGranary = hasGranary || hasCityGranary || hasStateGranary;
  const prosperityMod = foodProsperityModOf({
    stressFamine, deficitPct, surplusPct, activeChainsCount,
    terrainStructural: _terrainStructural, magicMitigated: hasMagicTradeImport, hasGranary: hasAnyGranary,
  });

  // ── Descriptive narrative ─────────────────────────────────────────────────
  const diversityNote = activeChainsCount >= 4 ? 'highly diversified diet'
                      : activeChainsCount === 3 ? 'three food source types'
                      : activeChainsCount === 2 ? 'two food source types'
                      : activeChainsCount === 1 ? 'single food source'
                      : 'no established food chains';

  const storageNote = storageMonths >= 8 ? `${storageMonths} months strategic reserve`
                    : storageMonths >= 4 ? `${storageMonths} months buffer`
                    : storageMonths >= 2 ? 'seasonal buffer only'
                    : 'minimal storage: vulnerable to disruption';

  const magicNote = magicSupplement > 0.2 ? 'Significant magical food supplement'
                  : magicSupplement > 0.1 ? 'Modest magical food supplement'
                  : magicSupplement > 0 ? 'Trace magical food contribution'
                  : null;

  const importNote = importPct >= 40 ? `${importPct}% import-dependent: trade disruption = immediate crisis`
                   : importPct >= 20 ? `${importPct}% imported: meaningful external dependency`
                   : importPct >= 5  ? `${importPct}% supplemented by imports`
                   : null;

  // ── THE FOOD RECORD (FOOD-1): derived once, here, from the numbers just published ──
  const foodRecord = deriveFoodRecord({
    dailyNeed: Math.round(dailyNeed), dailyProduction: Math.round(dailyProduction),
    importCoverage, magicOffset, deficitPct, surplusPct, stressFamine, storageMonths,
    hasGranary: hasAnyGranary,
    foodSources,
    failedSource,
    famineCutPct: stressFamine ? Math.round((1 - famineKeeps) * 100) : 0,
    foodwaysLine: composeFoodwaysLine({
      sources: foodSources,
      cultureLines: CULTURE_PROFILES[/** @type {keyof typeof CULTURE_PROFILES} */ (config.cultureProfileKey)]?.foodways || null,
      identity: `${tier}|${population}|${terrain}|${route}|${config.cultureProfileKey || ''}`,
    }),
  });

  return {
    label, color, bg,

    // Core metrics
    foodRatio:       Math.round(foodRatio * 100) / 100,
    deficitPct:      Math.round(deficitPct),
    surplusPct:      Math.round(surplusPct),
    dailyNeed:       Math.round(dailyNeed),
    dailyProduction: Math.round(dailyProduction),

    // ── The gap and how it is carried, in lb/day ──────────────────────────────
    // The viability foodBalance (generators/economy/foodBalance.js) is a VIEW of
    // this record, and it used to RECONSTRUCT this split from the rounded
    // deficitPct plus a rate ladder of its own. Two spellings of one split drift,
    // and this one had drifted on two axes: that ladder never took the low-agri
    // terrain boost applied at the importCoverageRate above, and its import gate
    // asked whether the VIEW'S OWN superseded local model saw a gap — so on a
    // connected route whose local model read a surplus, the whole covered portion
    // was credited to magic and the import channel vanished from the dossier.
    // The writer publishes its own split instead of being guessed at.
    rawDeficit:      Math.round(rawDeficit),
    importCoverage:  Math.round(importCoverage),
    magicOffset:     Math.round(magicOffset),
    deficit:         Math.round(deficit),
    // The multiplier dailyProduction was actually computed with: terrain capacity
    // + the resource/institution bonus + any registered custom producers, capped
    // at 2.0. NOT geographyData's agricultureCapacity, which the view reported
    // beside a production figure that number does not explain (TERRAIN_AGRI above
    // and TERRAIN_DATA.agricultureCapacity are different tables — plains 1.0 vs
    // 1.5, riverside 0.9 vs 1.3, hills 0.6 vs 0.9).
    effectiveAgriculture: effectiveAgri,

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
    ...foodSecurityFlagsOf(stressFamine, deficitPct, surplusPct),
    hasFamine:        stressFamine,
    hasSiege:         stressSiege,

    // Prosperity modifier to apply before base calculation
    prosperityMod,

    // The one answer every food sentence reads (foodBalance.js :: deriveFoodRecord).
    foodRecord,

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

/**
 * THE PROSPERITY MODIFIER FOOD IMPOSES, cut at the band's own points (FOOD-1: one set of
 * cut-offs; this ladder was a private 8 / 20 / 40).
 * @param {{ stressFamine: boolean, deficitPct: number, surplusPct: number, activeChainsCount: number,
 *   terrainStructural: boolean, magicMitigated: boolean, hasGranary: boolean }} f
 * @returns {{ type: 'cap'|'penalty'|'bonus', value: number, reason: string } | null}
 */
export function foodProsperityModOf(f) {
  if (f.stressFamine) {
    return { type: 'cap', value: 0, reason: 'Active famine: food production collapsed, prosperity cannot exceed Struggling' };
  }
  if (f.deficitPct > FOOD_SECURITY_CUTS.deficit) {
    // Mountain/desert: severe deficit is normal — penalty not hard cap, imports cover it
    if (f.terrainStructural) return { type: 'penalty', value: -1, reason: 'Terrain requires significant food imports: structural dependency, not crisis' };
    if (f.magicMitigated) return { type: 'cap', value: 2, reason: 'Severe food deficit mitigated by magical imports: prosperity capped at Moderate' };
    return { type: 'cap', value: 1, reason: 'Severe structural food deficit caps prosperity at Poor' };
  }
  if (f.deficitPct > FOOD_SECURITY_CUTS.importDependent) {
    // Structural import is priced into the economy for these terrains: no modifier.
    if (f.terrainStructural) return null;
    if (f.magicMitigated) return { type: 'penalty', value: -1, reason: 'Food imports via magical infrastructure are reliable but costly' };
    return { type: 'cap', value: 1, reason: 'Food deficit caps prosperity at Poor' };
  }
  if (f.deficitPct > FOOD_SECURITY_CUTS.pressured) {
    return { type: 'penalty', value: -1, reason: 'Food pressure reduces prosperity by one level' };
  }
  if (f.surplusPct > FOOD_SECURITY_CUTS.surplus && f.activeChainsCount >= 3 && f.hasGranary) {
    return { type: 'bonus', value: 0.4, reason: 'Agricultural surplus with reserves provides modest prosperity bonus' };
  }
  return null;
}

/** The middle of the tier's band in the one population table (constants.js :: POPULATION_RANGES). */
function tierDefaultPop(tier) {
  const range = POPULATION_RANGES[/** @type {keyof typeof POPULATION_RANGES} */ (tier)];
  return range ? Math.round((range.min + range.max) / 2) : POPULATION_RANGES.village.min;
}
