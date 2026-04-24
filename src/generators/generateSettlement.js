/**
 * generateSettlement.js
 * Main settlement generation entry point.
 * Orchestrates all sub-generators into a complete settlement object.
 *
 * This is the de-minified equivalent of ie() from the original bundle.
 * All generator functions have been extracted to their own modules.
 */

import {TIER_ORDER, POPULATION_RANGES, getMagicLevel, chance, pick, randInt, popToTier, TOWN_PLUS_TIERS} from '../data/constants.js';
import {extractNeighbourProfile, getNeighbourEconomicBias, getNeighbourGovernmentBias, getNeighbourFactionBias, getMirrorFactionLabel, getOpposeFactionLabel} from './neighbourGenerator.js';
import {applyTeleportationInfrastructure, applySubsistenceMode, stripArcaneInstitutions} from './isolationGenerator.js';
import {institutionalCatalog} from '../data/institutionalCatalog.js';
import {applyCascadeInstitutions} from './cascadeGenerator.js';
import {TERRAIN_DATA} from '../data/geographyData.js';
import {RESOURCE_DATA} from '../data/resourceData.js';

import {generateStress} from './stressGenerator.js';
import {generateEconomicState} from './economicGenerator.js';
import {generateEconomicViability} from './economicGenerator.js';
import {generateSpatialLayout} from './spatialGenerator.js';
import {generateAvailableServices} from './servicesGenerator.js';
import {generatePowerStructure} from './powerGenerator.js';
import {deriveFactionBoosts, applyFactionInstitutionBoosts} from './factionCorrelation.js';
import {computeDemandImports} from './demandProfile.js';
import {generateFactions, generateConflicts} from './powerGenerator.js';
import {generateSettlementReason} from './narrativeGenerator.js';
import {generatePressureSentence, generateArrivalScene, generateCoherence} from './narrativeGenerator.js';
import {generateNPCs, generateRelationships, generateSettlementName} from './npcGenerator.js';
import {generateResourceAnalysis} from './resourceGenerator.js';
import {generateHistory} from './historyGenerator.js';
import {deriveLegacyAnnotations} from './legacyGenerator.js';

import {checkStructuralValidity, getBaseChance} from './structuralValidator.js';
import {getTerrainType, getCompatibleResources, getDefaultResources} from './terrainHelpers.js';
import {generateDefenseProfile} from './defenseGenerator.js';

// ─── generateDefenseProfile ───────────────────────────────────────────────────
// Re-exported from powerGenerator since it uses the same institution data
// NOTE: The original bundle has this inline in the main hook. Extracted here.
// generateDefenseProfile is imported above from defenseGenerator.js

// ─── Institution resource multipliers ────────────────────────────────────────
/**
 * Calculate terrain/resource modifier for an institution's base chance.
 * If the settlement has nearby iron, smiths get a 1.5x boost, etc.
 */
function getResourceMultiplier(instTags, instName, nearbyResources, institutionModifiers, tier) {
  let multiplier = 1;
  const name = instName.toLowerCase();

  // ── Terrain-based institution modifiers (from TERRAIN_DATA) ──────────────────
  for (const mod of institutionModifiers) {
    if (
      (mod.tags && instTags && mod.tags.some(t => instTags.includes(t))) ||
      (mod.name && name.includes(mod.name.toLowerCase()))
    ) {
      multiplier *= mod.modifier;
    }
  }

  // ── Resource-based institution boosts (from RESOURCE_DATA.instBoosts) ─────────
  // Each resource defines which institution keywords it boosts and by how much.
  // We read these directly rather than maintaining a parallel hand-coded list.
  // Tier scaling: resources create stronger economic pressure at larger settlements
  // because they have more capital to invest in exploitation infrastructure.
  const TIER_SCALE = { thorp: 0.6, hamlet: 0.75, village: 0.9, town: 1.0, city: 1.15, metropolis: 1.3 };
  const tierScale = TIER_SCALE[tier] || 1.0;

  const res = nearbyResources || [];
  res.forEach(resourceKey => {
    const rd = RESOURCE_DATA[resourceKey];
    if (!rd?.instBoosts) return;
    Object.entries(rd.instBoosts).forEach(([boostKey, boostVal]) => {
      // Match institution name against boost key
      // boostKey is a short keyword (e.g. 'smith', 'mine', 'fishm', 'sawmill')
      // We check if the institution name contains the keyword
      if (!name.includes(boostKey)) return;

      // Apply with tier scaling. The boost value is the "town-scale" baseline.
      // At thorp scale, iron deposits create 60% of the pressure to build a smith.
      // At city scale, the same deposits create 115% pressure — more capital, more ROI.
      const scaledBoost = 1 + (boostVal - 1) * tierScale;
      multiplier *= scaledBoost;
    });
  });

  // ── Special extraction institution boosts ────────────────────────────────────
  // instBoosts in RESOURCE_DATA use short abbreviations that may not match full
  // institution names. Supplement with exact-match boosts for critical extractors.
  const EXTRACTION_BOOSTS = {
    // Resource key → { institution name fragment: additional multiplier }
    // These complement instBoosts for the extraction-gate institutions we care most about.
    'iron_deposits':       { 'mine (open cast)': 2.5, 'mine': 2.0 },
    'stone_quarry':        { 'stone quarry': 2.5, 'stonemason': 1.8 },
    'coal_deposits':       { 'peat cutter': 2.0, 'charcoal burner': 1.8 },
    'precious_metals':     { 'mine (open cast)': 2.2, 'mint': 2.5 },
    'gemstone_deposits':   { 'mine (open cast)': 2.0 },
    'fishing_grounds':     { "fisher's landing": 2.0, 'fish market': 1.8, 'fishmonger': 1.8 },
    'river_fish':          { "fisher's landing": 1.8, 'fish market': 1.6, 'fishmonger': 1.5 },
    'managed_forest':      { "woodcutter's camp": 2.0, 'charcoal burner': 1.8 },
    'hunting_grounds':     { "hunter's lodge": 2.5 },
    'deep_harbour':        { 'docks/port': 2.0, 'harbour master': 1.8 },
    'ancient_ruins':       { "adventurers' charter": 1.8, "adventurers' guild": 1.6 },
    'hot_springs':         { 'healer (divine': 1.8 },
    'mountain_timber':     { "woodcutter's camp": 1.8, 'charcoal burner': 1.6 },
  };
  res.forEach(resourceKey => {
    const exactBoosts = EXTRACTION_BOOSTS[resourceKey];
    if (!exactBoosts) return;
    Object.entries(exactBoosts).forEach(([fragment, boost]) => {
      if (name.includes(fragment)) {
        const scaledBoost = 1 + (boost - 1) * tierScale;
        multiplier *= scaledBoost;
      }
    });
  });

  return Math.min(multiplier, 5); // raised cap slightly for high-value resource combinations
}

// ─── Institution upgrade deduplication table ─────────────────────────────────
const UPGRADE_CHAINS = [
  ["Parish church","Parish churches (2-5)"],["Parish church","Parish churches (10-30)"],
  ["Parish churches (2-5)","Parish churches (10-30)"],["Wayside shrine","Parish church"],
  ["Water source","Multiple water sources"],["Citizen militia","Town watch"],
  ["Citizen militia","Professional city watch"],["Town watch","Professional city watch"],
  ["Palisade or earthworks","Town walls"],["Town walls","City walls and gates"],
  ["Barracks","Garrison"],["Street gang","Multiple criminal factions"],
  ["Gambling den","Gambling halls"],["Gambling halls","Gambling district"],
  ["Gambling den","Gambling district"],["Traveling performers","Theaters"],
  ["Theaters","Multiple theaters"],["Traveling performers","Multiple theaters"],
  ["River boatyard","Shipyard"],["Hedge wizard","Wizard's tower"],
  ["Traveling hedge wizard","Hedge wizard"],["Alchemist shop","Alchemist quarter"],
  ["Wizard's tower","Mages' guild"],["Town granary","City granaries"],
  ["Town hall","City hall"],["Blacksmith","Blacksmiths (3-10)"],
  ["Carpenter","Carpenters (5-15)"],["Docks/port facilities","Warehouse district"],
  ["Carriers' hiring hall","Carriers' guild"],["Carriers' guild","Caravan masters' exchange"],
  ["Carriers' hiring hall","Caravan masters' exchange"],["Small prison/stocks","Large prison"],
  ["Courthouse","Multiple courthouses"],["Craft guilds (5-15)","Craft guilds (30-80)"],
  ["Merchant guilds (3-8)","Merchant guilds (15-40)"],
  ["Adventurers' charter hall","Multiple adventurers' guilds"],
  ["Bowyers & fletchers (guild)","Dungeon delving supply district"],
  ["Apothecary","Apothecary (established)"],["Apothecary (established)","Apothecary district"],
  ["Apothecary","Apothecary district"],["Cartographer's workshop","Cartographer's guild"],
  ["Bowyer & fletcher","Bowyers & fletchers (guild)"],["Small hospital","Major hospital"],
  ["Slave market","Slave market district"],
];

// ─── Main generation function ─────────────────────────────────────────────────
/**
 * Generate a complete settlement from config.
 *
 * @param {Object} config - Generation configuration
 * @param {string} [config.settType] - Tier or 'random'/'custom'
 * @param {number} [config.population] - Population (for 'custom' type)
 * @param {string} [config.tradeRouteAccess] - Trade route or 'random_trade'
 * @param {string} [config.culture] - Culture or 'random_culture'
 * @param {string} [config.monsterThreat] - 'heartland'/'frontier'/'plagued' or 'random_threat'
 * @param {number} [config.priorityEconomy] - 0-100
 * @param {number} [config.priorityMilitary] - 0-100
 * @param {number} [config.priorityMagic] - 0-100
 * @param {number} [config.priorityReligion] - 0-100
 * @param {number} [config.priorityCriminal] - 0-100
 * @param {boolean} [config.nearbyResourcesRandom] - Whether to randomize resources
 * @param {Array}  [config.nearbyResources] - Explicit resource list
 * @param {Array}  [config.selectedStresses] - Forced stress types
 * @param {boolean} [config.selectedStressesRandom] - Pool vs forced mode
 * @param {string} [config.customName] - Override settlement name
 * @param {Object} [config._institutionToggles] - Per-institution allow/require/exclude
 * @param {Object} [config._categoryToggles] - Per-category enable/disable
 * @param {Object} [config._goodsToggles] - Goods overrides
 * @param {Object} [config._servicesToggles] - Service overrides
 * @param {Object} [importedNeighbor] - Previously generated settlement to link as neighbor
 * @returns {Object} Complete settlement data object
 */
// Merge two catalog tier objects — metropolis categories inherit from city + add their own
function mergeCatalogs(base, override) {
  const merged = {};
  // Copy all base (city) categories
  Object.entries(base).forEach(([cat, insts]) => {
    merged[cat] = { ...insts };
  });
  // Merge in override (metropolis) categories
  Object.entries(override).forEach(([cat, insts]) => {
    if (merged[cat]) {
      // Category exists in city — merge institutions, override wins on conflict
      merged[cat] = { ...merged[cat], ...insts };
    } else {
      // New category only in metropolis
      merged[cat] = { ...insts };
    }
  });
  return merged;
}

export function generateSettlement(config = {}, importedNeighbor = null) {
  // No-magic mode: enforce priorityMagic=0 without reassigning const config
  const priorityMagicEffective = config.magicExists === false ? 0 : (config.priorityMagic ?? 50);

  const institutionToggles = config._institutionToggles || {};
  const categoryToggles    = config._categoryToggles    || {};
  const goodsToggles       = config._goodsToggles       || {};
  const servicesToggles    = config._servicesToggles    || {};

  const isCategoryEnabled = (cat) => {
    const tier = config.settType || 'all';
    // Support both :: (new) and _ (legacy) key formats
    return categoryToggles[`${tier}::${cat}`] !== false
        && categoryToggles[`${tier}_${cat}`]  !== false;
  };

  // ── Resolve tier, population, trade route ──────────────────────────────────
  const tier = config.settType === 'custom'  ? popToTier(config.population)
             : config.settType === 'random'  ? pick(TIER_ORDER)
             : (config.settType || 'village');

  const popRange   = POPULATION_RANGES[tier];
  const population = config.settType === 'custom'
    ? config.population
    : randInt(popRange.min, popRange.max);

  const _noMagic   = config.magicExists === false || (config.priorityMagic || 0) === 0;
  const _townPlus  = TOWN_PLUS_TIERS.includes(tier);

  // ── Random terrain selection ──────────────────────────────────────────────
  // When no terrainOverride set and trade route is random, pick terrain independently.
  // Terrain then constrains compatible trade routes rather than route dictating terrain.
  // Weights reflect intuitive medieval frequency.
  const _randomTerrain = !config.terrainOverride || config.terrainOverride === 'auto';
  const _doRandomTerrain = _randomTerrain && config.tradeRouteAccess === 'random_trade';
  const TERRAIN_WEIGHTS = [
    ['plains',   22], ['hills',    18], ['forest',   13],
    ['riverside',16], ['coastal',  16], ['mountain',  9], ['desert',  6],
  ];
  let _resolvedTerrain = null;
  if (_doRandomTerrain) {
    const totalW = TERRAIN_WEIGHTS.reduce((s,[,w])=>s+w, 0);
    let roll = Math.random() * totalW;
    for (const [t, w] of TERRAIN_WEIGHTS) { roll -= w; if (roll <= 0) { _resolvedTerrain = t; break; } }
    if (!_resolvedTerrain) _resolvedTerrain = 'plains';
  }

  // Terrain-to-compatible-route mapping
  // Terrain → compatible route pools (weighted)
  // Target: isolated ~10%, road ~28%, river ~18%, crossroads ~18%, port ~18%
  const TERRAIN_ROUTE_POOLS = {
    plains:   ['crossroads','crossroads','road','road','river'],    // open land: crossroads dominant
    hills:    ['road','road','crossroads','road','isolated'],       // mostly road connected
    forest:   ['road','isolated','isolated','road','river'],        // half connected, half isolated
    riverside:['river','river','river','road','crossroads'],        // river-dominant
    coastal:  ['port','port','port','port','river'],                // port strongly dominant
    mountain: ['road','road','road','isolated','isolated'],         // roads and isolation equal
    desert:   ['crossroads','road','road','isolated','road'],       // caravan routes
  };

  // Never assign isolated to town+ with no magic — violates historical plausibility
  const _routePool = (config.tradeRouteAccess === 'random_trade')
    ? (() => {
        if (_resolvedTerrain) {
          // Use terrain-derived route pool
          let pool = (TERRAIN_ROUTE_POOLS[_resolvedTerrain] || ['road','road','road','crossroads']);
          // coastal/riverside must not get isolated for town+ with no magic
          if (_noMagic && _townPlus) pool = pool.filter(r => r !== 'isolated');
          if (pool.length === 0) pool = ['road'];
          return pool;
        }
        // No terrain: fallback to generic pool
        return _noMagic && _townPlus
          ? ['road','road','road','river','crossroads','port']
          : ['road','road','road','river','crossroads','port','isolated'];
      })()
    : null;
  const rawRoute = _routePool
    ? pick(_routePool)
    : (config.tradeRouteAccess || 'road');

  // Isolated settlements with trade-route features get road fallback
  // Hard override: isolated + town+ + no magic is blocked
  const tradeRoute = (rawRoute === 'isolated' && _townPlus && _noMagic) ? 'road' : rawRoute;

  // ── Derived config ─────────────────────────────────────────────────────────
  const magicLevel   = getMagicLevel(priorityMagicEffective);
  const monsterThreat = config.monsterThreat === 'random_threat'
    ? pick(["heartland","heartland","frontier","frontier","frontier","plagued"]) // ~33/50/17
    : (config.monsterThreat || 'frontier');
  const threat = monsterThreat === 'low' ? 'heartland' : monsterThreat === 'high' ? 'plagued'
               : monsterThreat === 'medium' ? 'frontier' : monsterThreat;

  const culture = (config.culture === 'random_culture' || !config.culture)
    ? pick(["germanic","latin","celtic","arabic","norse","slavic","east_asian","mesoamerican","south_asian","steppe","greek"])
    : config.culture;

  // ── Nearby resources ───────────────────────────────────────────────────────
  // Tier-weighted depletion probabilities for 'allow' state resources
  // Higher-order settlements have been exploiting resources longer → more likely depleted
  const DEPLETION_PROB = {
    thorp: 0.05, hamlet: 0.10, village: 0.20,
    town: 0.35, city: 0.55, metropolis: 0.70,
  };
  const depletionProb = DEPLETION_PROB[tier] ?? 0.25;

  let nearbyResources;
  let nearbyResourcesDepleted = config.nearbyResourcesDepleted || [];

  if (config.nearbyResourcesRandom !== false) {
    // Random mode: terrain-primary when terrain override set, route-primary otherwise
    const terrainOverride = _resolvedTerrain
      || (config.terrainOverride && config.terrainOverride !== 'auto' ? config.terrainOverride : null);
    const compatible = getCompatibleResources(tradeRoute, terrainOverride)
      .filter(r => r.compatible).map(r => r.key);
    // Terrain-specific resources get priority slots when terrain is set
    const terrainSpecific = compatible.filter(k => RESOURCE_DATA[k]?.terrain === terrainOverride);
    const universal      = compatible.filter(k => !RESOURCE_DATA[k]?.terrain);
    const byCategory = {};
    universal.forEach(k => {
      const cat = (RESOURCE_DATA[k]?.category) || 'land';
      (byCategory[cat] = byCategory[cat] || []).push(k);
    });
    const selected = new Set();
    // First: always include 1-2 terrain-specific resources if available
    const shuffledTerrain = terrainSpecific.sort(() => Math.random() - 0.5);
    const terrainSlots = Math.min(shuffledTerrain.length, terrainOverride ? 2 : 0);
    shuffledTerrain.slice(0, terrainSlots).forEach(k => selected.add(k));
    // Rarity filter: ancient_ruins and magical_node are rare discoveries (~15% each)
    // Declared here so it's available to both the category fill and the main fill below
    const RARE_RESOURCES = { 'ancient_ruins': 0.15, 'magical_node': 0.15 };

    // Then: one per category from universal resources (apply rarity filter here too)
    Object.values(byCategory).forEach(arr => {
      if (arr.length === 0) return;
      // Filter out rare resources from category pools (they go through fill step only)
      const nonRare = arr.filter(k => !(RARE_RESOURCES[k] !== undefined));
      const pool = nonRare.length > 0 ? nonRare : arr; // fallback to all if category is all-rare
      selected.add(pool[Math.floor(Math.random() * pool.length)]);
    });
    // Tier-based resource count variance
    const RESOURCE_COUNT_RANGE = {
      thorp: [1,3], hamlet: [2,4], village: [3,5],
      town: [4,6], city: [5,7], metropolis: [6,8],
    };
    const [rcMin, rcMax] = RESOURCE_COUNT_RANGE[tier] || [3,6];
    const targetCount = rcMin + Math.floor(Math.random() * (rcMax - rcMin + 1));

    // Fill to targetCount total, applying rarity filter
    [...universal].sort(() => Math.random() - 0.5).forEach(k => {
      if (selected.size >= targetCount) return;
      const rarity = RARE_RESOURCES[k];
      if (rarity !== undefined && Math.random() > rarity) return; // skip rare resource
      selected.add(k);
    });
    nearbyResources = [...selected];
    // Suppress magical resources in no-magic worlds
    if (config.magicExists === false) {
      nearbyResources = nearbyResources.filter(r => r !== 'magical_node');
    }
    // Apply tier-weighted random depletion
    nearbyResourcesDepleted = nearbyResources.filter(() => Math.random() < depletionProb);
  } else {
    // Manual mode: interpret nearbyResourcesState for each resource
    const resourceState = config.nearbyResourcesState || {};
    const allCompatible = getCompatibleResources(tradeRoute).filter(r => r.compatible).map(r => r.key);
    const legacyList = config.nearbyResources ?? getDefaultResources(tradeRoute);

    // Resolve from state map if present, else fall back to legacy list
    if (Object.keys(resourceState).length > 0) {
      // Only include resources that have an explicit state set (allow/abundant/depleted)
      // Resources not in state map are absent (user didn't add them)
      nearbyResources = allCompatible.filter(k => {
        const st = resourceState[k];
        return st === 'allow' || st === 'abundant' || st === 'depleted';
      });
      // For 'allow' state resources, apply tier-weighted depletion
      const forceAbundant = new Set(allCompatible.filter(k => resourceState[k] === 'abundant'));
      const forceDepleted  = new Set(allCompatible.filter(k => resourceState[k] === 'depleted'));
      const allowState     = nearbyResources.filter(k => !forceAbundant.has(k) && !forceDepleted.has(k));
      nearbyResourcesDepleted = [
        ...forceDepleted,
        ...allowState.filter(() => Math.random() < depletionProb),
      ];
    } else {
      // Legacy: plain list
      nearbyResources = legacyList;
    }
  }

  // Embattled settlements with low military get a floor
  const militaryFloor = threat === 'plagued' && (config.priorityMilitary ?? 50) < 25 ? 25 : null;

  const resolvedConfig = {
    // Priority defaults — must be set before getBaseChance is called
    // to avoid NaN from undefined/50 in priority multipliers
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
    terrainType: getTerrainType(tradeRoute, _resolvedTerrain || config.terrainOverride || null),
    terrainOverride: _resolvedTerrain || config.terrainOverride || null,
    nearbyResources,
    nearbyResourcesDepleted,
    ...(militaryFloor ? { priorityMilitary: militaryFloor } : {}),
  };

  // ── Stress ─────────────────────────────────────────────────────────────────
  const stress     = generateStress({ name: '', tier, institutions: [] }, resolvedConfig);
  const stressTypes = stress
    ? (Array.isArray(stress) ? stress.map(s => s.type) : [stress.type]).filter(Boolean)
    : [];

  const effectiveConfig = {
    ...resolvedConfig,
    stressType: stressTypes[0] || resolvedConfig.stressType || null,
    stressTypes: stressTypes.length ? stressTypes
               : resolvedConfig.stressType ? [resolvedConfig.stressType]
               : resolvedConfig.stressTypes || [],
    intendedStressTypes: [
      ...(config.stressTypes || []),
      ...(config.stressType ? [config.stressType] : [])
    ].filter(Boolean),
    _population: population,   // threaded for food security calculation
  };

  // ── Neighbour profile extraction ───────────────────────────────────────────
  // Pull structured relationship data from the imported neighbour settlement.
  // relationshipType comes from config (set by UI before generation).
  const _rawNeighbour = config._importedNeighbor || importedNeighbor || null;
  const neighbourProfile = _rawNeighbour
    ? extractNeighbourProfile(_rawNeighbour, config._neighbourRelType || config.neighbourRelType || 'neutral')
    : null;
  const neighbourEconBias = getNeighbourEconomicBias(neighbourProfile);
  const neighbourGovBias  = getNeighbourGovernmentBias(neighbourProfile);
  const neighbourFacBias  = getNeighbourFactionBias(neighbourProfile);

  // ── Institution assembly ───────────────────────────────────────────────────
  // metropolis inherits city institutions PLUS its own metro-scale additions
  // (a metropolis has everything a city has, plus city-scale institutions become metropolis-scale)
  const catalogForTier = tier === 'metropolis'
    ? mergeCatalogs(institutionalCatalog['city'] || {}, institutionalCatalog['metropolis'] || {})
    : institutionalCatalog[tier] || {};

  const institutions  = [];
  const exclusiveGroups = {};
  const tierIndex     = TIER_ORDER.indexOf(tier);
  const terrainType   = getTerrainType(tradeRoute, effectiveConfig.terrainOverride || null);
  const instModifiers = (TERRAIN_DATA[terrainType] || {}).institutionModifiers || [];

  Object.entries(catalogForTier).forEach(([category, categoryInsts]) => {
    Object.entries(categoryInsts).forEach(([name, inst]) => {
      // Tier gate
      if (inst.minTier && tierIndex < TIER_ORDER.indexOf(inst.minTier)) return;

      const toggle = institutionToggles[`${tier}::${category}::${name}`]
                  || institutionToggles[`${tier}_${category}_${name}`]
                  || institutionToggles[`all::${category}::${name}`]
                  || institutionToggles[`all_${category}_${name}`]
                  || { allow: true, require: false };

      const catEnabled = isCategoryEnabled(category);
      const forceExclude = inst.required && toggle.forceExclude === true;

      // Required or explicitly forced
      if ((inst.required && !forceExclude) || (catEnabled && (toggle.require ?? false))) {
        // Exclusive group: required inst evicts any existing non-required member
        if (inst.exclusiveGroup && exclusiveGroups[inst.exclusiveGroup]) {
          const existingName = exclusiveGroups[inst.exclusiveGroup];
          const existingIdx  = institutions.findIndex(i => i.name === existingName);
          if (existingIdx >= 0 && institutions[existingIdx].source !== 'required') {
            // Evict the non-required member — required always wins
            institutions.splice(existingIdx, 1);
          } else if (existingIdx >= 0) {
            return; // can't bump another required inst
          }
        }
        // Forced inst (toggle.require) also bumps an existing non-required one
        if (toggle.require && !inst.required && inst.exclusiveGroup && exclusiveGroups[inst.exclusiveGroup]) {
          const existingName = exclusiveGroups[inst.exclusiveGroup];
          const existingIdx  = institutions.findIndex(i => i.name === existingName);
          if (existingIdx >= 0 && institutions[existingIdx].source !== 'required') {
            institutions.splice(existingIdx, 1);
          } else if (existingIdx >= 0) {
            return; // can't bump a required inst
          }
        }
        if (inst.exclusiveGroup) exclusiveGroups[inst.exclusiveGroup] = name;
        institutions.push({ category, name, ...inst, source: inst.required ? 'required' : 'forced' });

      } else if (!forceExclude && catEnabled && (toggle.allow ?? true)) {
        // Probabilistic
        if (inst.exclusiveGroup && exclusiveGroups[inst.exclusiveGroup]) return;
        if (inst.exclusionConditions?.some(ex => institutions.some(i => i.name === ex))) return;
        // Route gate: skip if institution requires specific trade routes.
        // terrainAccess provides an OR condition: coastal terrain satisfies water institutions
        // even when trade route is road. A coastal fishing hamlet is coastal regardless of
        // how it trades with the outside world.
        if (inst.tradeRouteRequired) {
          const routeOk = inst.tradeRouteRequired.includes(tradeRoute);
          const terrainOk = inst.terrainAccess && inst.terrainAccess.includes(terrainType);
          if (!routeOk && !terrainOk) return;
        }
        // Forbidden route gate: skip if this trade route is explicitly excluded
        if (inst.forbiddenTradeRoutes && inst.forbiddenTradeRoutes.includes(tradeRoute)) return;
        // Terrain gate: skip if institution requires specific terrain
        if (inst.terrainRequired && !inst.terrainRequired.includes(terrainType)) return;

        const baseChance = getBaseChance(
          inst.baseChance, category, name, effectiveConfig, neighbourProfile || importedNeighbor, goodsToggles
        );
        const resourceMult = getResourceMultiplier(inst.tags || [], name, nearbyResources, instModifiers, tier);

        if (chance(baseChance * resourceMult)) {
          if (inst.exclusiveGroup) exclusiveGroups[inst.exclusiveGroup] = name;
          institutions.push({ category, name, ...inst, source: 'generated' });
        }
      }
    });
  });

  // Forced-required from toggles (institutions not in catalog that have require=true)
  Object.entries(institutionToggles).forEach(([key, toggle]) => {
    if (!toggle?.require) return;
    const parts = key.split('_');
    if (parts.length < 3) return;
    const instName = parts.slice(2).join('_');
    if (institutions.some(i => i.name === instName)) return;
    // Find it in the catalog
    for (const [cat, catInsts] of Object.entries(catalogForTier)) {
      if (catInsts[instName]) {
        const inst = catInsts[instName];
        if (inst.exclusiveGroup) {
          if (exclusiveGroups[inst.exclusiveGroup]) {
            const existIdx = institutions.findIndex(i => i.name === exclusiveGroups[inst.exclusiveGroup]);
            if (existIdx >= 0 && institutions[existIdx].source !== 'required') institutions.splice(existIdx, 1);
            else if (existIdx >= 0) return;
          }
          exclusiveGroups[inst.exclusiveGroup] = instName;
        }
        institutions.push({ category: cat, name: instName, ...inst, source: 'forced' });
        break;
      }
    }
  });

  // ── Out-of-tier forced institutions ─────────────────────────────────────────
  // When a DM forces an institution from another tier (via OutOfTierSection),
  // include it even though it's not in catalogForTier.
  // The toggle key uses tier::category::name format (same as in-tier).
  const fullCatalogAllTiers = (() => {
    const all = {};
    ['thorp','hamlet','village','town','city'].forEach(t => {
      const tc = (institutionalCatalog[t] || {});
      Object.entries(tc).forEach(([cat, insts]) => {
        if (!all[cat]) all[cat] = {};
        Object.entries(insts).forEach(([name, def]) => {
          if (!all[cat][name]) all[cat][name] = { ...def, nativeTier: t };
        });
      });
    });
    return all;
  })();

  Object.entries(institutionToggles).forEach(([key, toggle]) => {
    if (!toggle?.require) return;
    // Parse {tier}::{category}::{name} format
    const parts = key.split('::');
    if (parts.length < 3) return;
    const [, category, instName] = parts;
    if (institutions.some(i => i.name === instName)) return; // already added
    // Look up in full catalog (any tier)
    const catInsts = fullCatalogAllTiers[category];
    if (!catInsts || !catInsts[instName]) return;
    const inst = catInsts[instName];
    // Check if it's actually out-of-tier (in-tier ones were handled in main loop)
    const isInTier = !!((catalogForTier[category] || {})[instName]);
    if (isInTier) return; // already handled
    // Include despite tier mismatch — flag as forced out-of-tier for validator
    if (inst.exclusiveGroup && exclusiveGroups[inst.exclusiveGroup]) {
      const existIdx = institutions.findIndex(i => i.name === exclusiveGroups[inst.exclusiveGroup]);
      // Don't bump required institutions — flag the conflict but still include
      if (existIdx >= 0 && institutions[existIdx].source === 'required') {
        // Both co-exist — validator will flag exclusivity conflict
      } else if (existIdx >= 0) {
        institutions.splice(existIdx, 1);
      }
    }
    if (inst.exclusiveGroup) exclusiveGroups[inst.exclusiveGroup] = instName;
    institutions.push({
      category,
      name: instName,
      ...inst,
      source: 'forced',
      outOfTier: true,
      nativeTier: inst.nativeTier || 'unknown',
    });
  });

  // Dedup upgrade chains — remove the lesser when the greater is present
  const presentNames = new Set(institutions.map(i => i.name));
  UPGRADE_CHAINS.forEach(([lesser, greater]) => {
    if (presentNames.has(lesser) && presentNames.has(greater)) {
      const idx = institutions.findIndex(i => i.name === lesser && i.source !== 'required');
      if (idx >= 0) { institutions.splice(idx, 1); presentNames.delete(lesser); }
    }
  });

  // Apply toggle exclusions
  for (let i = institutions.length - 1; i >= 0; i--) {
    const inst   = institutions[i];
    const toggle = institutionToggles[`${tier}::${inst.category}::${inst.name}`]
                || institutionToggles[`${tier}_${inst.category}_${inst.name}`]
                || institutionToggles[`all::${inst.category}::${inst.name}`]
                || institutionToggles[`all_${inst.category}_${inst.name}`];
    if (!toggle) continue;
    if (toggle.forceExclude === true || (toggle.allow === false && !inst.required && !toggle.require && inst.source !== 'forced')) {
      institutions.splice(i, 1);
    }
  }

  // ── Sub-generators ────────────────────────────────────────────────────────
  // Note: _magicTradeOnly is set by applyTeleportationInfrastructure which runs AFTER this,
  // but we know any isolated town+ always gets teleportation forced in, so we can pre-derive.
  const _preDerivedMagicTrade = TOWN_PLUS_TIERS.includes(tier) && tradeRoute === 'isolated'
    && effectiveConfig.magicExists !== false;
  const structural    = checkStructuralValidity(institutions, {
    tier, tradeRouteAccess: tradeRoute, magicLevel, monsterThreat: threat,
    priorityMilitary: effectiveConfig.priorityMilitary,
    priorityMagic:    effectiveConfig.priorityMagic,
    nearbyResources:  effectiveConfig.nearbyResources,
    _magicTradeOnly:  effectiveConfig._magicTradeOnly || _preDerivedMagicTrade,
  });

  // ── Subsumption pass: remove lesser institutions when greater ones are present ──
  // Runs after institution generation, before all downstream systems see the list.
  const SUBSUMPTION_RULES = [
    // Greater institution → list of lesser institutions it subsumes
    { greater: 'banking district',            lesser: ['banking house', 'money changer', 'money changers'] },
    { greater: 'banking houses',              lesser: ['money changers', 'money changer'] },
    { greater: 'mages\' guild',               lesser: ['wizard\'s tower', 'alchemist shop'] },
    { greater: 'mages district',              lesser: ['wizard\'s tower', 'mages\' guild', 'alchemist shop', 'alchemist quarter'] },
    { greater: 'academy of magic',            lesser: ['wizard\'s tower', 'mages\' guild'] },
    { greater: 'multiple adventurers\' guild', lesser: ['adventurers\' charter hall', 'hireling hall', 'adventurers\' guild chapter'] },
    { greater: 'adventurers\' guild',          lesser: ['adventurers\' charter hall', 'hireling hall'] },
    { greater: 'cathedral',                   lesser: ['parish church', 'priest (resident)', 'wayside shrine'] },
    { greater: 'major hospital',              lesser: ['small hospital'] },
    { greater: 'professional city watch',     lesser: ['town watch', 'citizen militia'] },
    { greater: 'multiple courthouses',        lesser: ['courthouse'] },
    { greater: 'major port',                  lesser: ['docks/port facilities', 'river boatyard', 'river ferry'] },
    { greater: 'university',                  lesser: ['academy of magic'] },
    { greater: 'craft guilds (30-80)',         lesser: ['craft guilds (5-15)'] },
    { greater: 'craft guilds (100-150+)',      lesser: ['craft guilds (30-80)', 'craft guilds (5-15)'] },
    { greater: 'merchant guilds (15-40)',      lesser: ['merchant guilds (3-8)'] },
    { greater: 'merchant guilds (50-100+)',    lesser: ['merchant guilds (15-40)', 'merchant guilds (3-8)'] },
    { greater: 'thieves\' guild chapter',      lesser: ['fence (word of mouth)', 'local fence', 'bandit affiliate'] },
    { greater: 'black market',                lesser: ['fence (word of mouth)', 'local fence'] },

    // ── New institution subsumptions ─────────────────────────────────────────
    // Brewing tier: brewery (commercial) > brewer (artisan) > maltster (input)
    { greater: 'brewery',                     lesser: ['brewer'] },

    // Leather/textile finishing tier
    { greater: 'tanner (established)',        lesser: ['tannery'] },
    { greater: "cobbler's guild",             lesser: ['cobbler'] },
    { greater: "tailor's guild",              lesser: ['tailor'] },

    // Metalwork/coinage tier
    { greater: 'mint (official)',             lesser: ['mint', 'assay office'] },
    { greater: 'smelter',                     lesser: ['charcoal burner'] },  // charcoal burner feeds smelter — coexist but smelter implies charcoal supply

    // Animal/transport tier
    { greater: 'stable district',             lesser: ['stable master', 'stable yard'] },

    // Fishing/food tier
    { greater: 'fish market',                 lesser: ['fishmonger'] },
    { greater: "furrier's district",          lesser: ['tannery'] },

    // Crime tier — new additions
    { greater: "assassins' guild",            lesser: ['contract killer', 'hired blades'] },
    { greater: "thieves' guild (powerful)",   lesser: ["thieves' guild chapter", 'black market bazaar', 'contract killer'] },

    // Economic scale subsumptions for new crafts
    { greater: 'auction house',              lesser: ['slave market'] },
    { greater: "harbour master's office",    lesser: ['docks/port facilities'] },
    { greater: 'gladiatorial school',        lesser: ['pit fights'] },

    // Scholar/scribe tier
    { greater: 'printing house',             lesser: ['village scribe'] },
    { greater: 'great library',              lesser: ['village scribe', 'printing house'] },

    // Pawn/credit tier
    { greater: 'banking houses',             lesser: ['pawnbroker'] },
    { greater: 'banking district',           lesser: ['pawnbroker', 'banking houses'] },
    { greater: 'major hospital',              lesser: ['almshouse'] },
    { greater: 'hospital network',             lesser: ['almshouse', 'foundling home'] },

    // ── Caravan trade tier subsumptions ──────────────────────────────────────
    { greater: "caravan masters' exchange",    lesser: ["caravaneer's post", 'waystation', 'pack animal trader'] },
    { greater: "caravaneer's post",            lesser: ['waystation', 'pack animal trader'] },
    { greater: 'international trade center',  lesser: ["caravan masters' exchange", "caravaneer's post"] },

    // ── Mining tier subsumptions ──────────────────────────────────────────────
    { greater: 'stone quarry',                lesser: ['stone quarry (hamlet)'] }, // self-tier fine
    { greater: 'smelter',                     lesser: ['mine (open cast)'] }, // smelter implies mine access

    // ── Jeweller / luxury ────────────────────────────────────────────────────
    { greater: 'luxury goods quarter',        lesser: ['jeweller'] },
    { greater: 'specialized metalworkers',    lesser: ['jeweller'] },

    // ── Dairy / pastoral tier ────────────────────────────────────────────────
    { greater: "butchers (3-8)",              lesser: ['dairy farmer', 'shepherd'] },
    { greater: 'craft guilds (5-15)',         lesser: ['dairy farmer'] },

    // ── Salt works tier ──────────────────────────────────────────────────────
    { greater: 'merchant guilds (3-8)',       lesser: ['salt works'] },

    // ── Vintner tier ─────────────────────────────────────────────────────────
    { greater: 'brewery',                     lesser: ['vintner'] },
    { greater: 'merchant guilds (3-8)',       lesser: ['vintner'] },
  ];
  (function applySubsumption() {
    const names = institutions.map(i => i.name.toLowerCase());
    const toRemove = new Set();
    SUBSUMPTION_RULES.forEach(({ greater, lesser }) => {
      const hasGreater = names.some(n => n.includes(greater.toLowerCase()));
      if (!hasGreater) return;
      lesser.forEach(l => {
        institutions.forEach((inst, idx) => {
          if (inst.name.toLowerCase().includes(l.toLowerCase())) toRemove.add(idx);
        });
      });
    });
    // Remove in reverse order to preserve indices
    [...toRemove].sort((a,b) => b-a).forEach(idx => institutions.splice(idx, 1));
  })();

  // ── Cascade pass: boost chain-adjacent institutions ─────────────────────────
  // Runs after subsumption. Gives neighbouring-chain institutions a second chance
  // weighted by supply/demand logic. Does not guarantee appearances — just weights.
  const cascadeAdditions = applyCascadeInstitutions(institutions, tier);
  if (cascadeAdditions.length > 0) {
    institutions.push(...cascadeAdditions);

  // ── Airship override: if airship docking exists, maritime institutions are permitted ──
  // Airship settlements need port-like infrastructure regardless of trade route.
  // Run AFTER cascades so the airship institution is definitely in the list.
  const hasAirship = institutions.some(i =>
    (i.name || '').toLowerCase().includes('airship')
  );
  if (hasAirship && tradeRoute !== 'port' && tradeRoute !== 'river') {
    const MARITIME_INSTS = [
      { category: 'Economy', name: 'Docks/port facilities',
        desc: 'Airship-era dock facilities handling both aerial and surface freight.',
        tags: ['port','trade'], priorityCategory: 'economy', baseChance: 0.75 },
      { category: 'Economy', name: "Harbour master's office",
        desc: 'Regulates port and airship traffic, assigns berths, collects anchorage fees.',
        tags: ['law_enforcement','port'], priorityCategory: 'military', baseChance: 0.65 },
    ];
    const existingNames = new Set(institutions.map(i => i.name));
    MARITIME_INSTS.forEach(inst => {
      if (!existingNames.has(inst.name) && chance(inst.baseChance)) {
        institutions.push({ ...inst, source: 'generated' });
      }
    });
  }

    // Re-run subsumption on the expanded list (cascade may add lesser institutions
    // that are now superseded by existing greater ones)
    SUBSUMPTION_RULES.forEach(({ greater, lesser }) => {
      const names = institutions.map(i => i.name.toLowerCase());
      const hasGreater = names.some(n => n.includes(greater.toLowerCase()));
      if (!hasGreater) return;
      const toRemove = [];
      institutions.forEach((inst, idx) => {
        if (lesser.some(l => inst.name.toLowerCase().includes(l.toLowerCase())))
          toRemove.push(idx);
      });
      [...toRemove].sort((a,b) => b-a).forEach(idx => institutions.splice(idx, 1));
    });
  }

  // Teleportation/airship injection — see isolationGenerator.js
  applyTeleportationInfrastructure(institutions, tier, tradeRoute, effectiveConfig, catalogForTier, TOWN_PLUS_TIERS, chance);

    // Subsistence mode stripping — see isolationGenerator.js
  applySubsistenceMode(institutions, tier, tradeRoute, effectiveConfig, chance);

    // Thread neighbour economic bias into effectiveConfig for generateEconomicState
  if (neighbourEconBias && Object.keys(neighbourEconBias).length > 0) {
    effectiveConfig._neighbourEconBias = neighbourEconBias;
    effectiveConfig._neighbourEconMode = neighbourProfile?.dynamics?.economyMode || 'independent';
  }
  const economicState    = generateEconomicState(tier, institutions, tradeRoute, goodsToggles, effectiveConfig);

  const spatialLayout    = generateSpatialLayout(tier, institutions, tradeRoute, terrainType);
  const availableServices = generateAvailableServices(tier, institutions, servicesToggles, { ...effectiveConfig, _tradeRoute: tradeRoute });
  const powerStructure   = generatePowerStructure(tier, economicState, null, { ...effectiveConfig, _neighbourGovBias: neighbourGovBias, _neighbourFacBias: neighbourFacBias }, institutions);

  // ── Neighbour faction cross-contamination ─────────────────────────────────
  // Inject mirror factions (neighbour's dominant types present as agents/guests)
  // and oppose factions (counter-movements) based on relationship dynamics.
  if (neighbourFacBias && powerStructure?.factions?.length) {
    const existingTypes = new Set(
      powerStructure.factions.map(f => (f.category || f.type || '').toLowerCase())
    );
    const { mirrorFactions, opposeFactions, mirrorWeight, opposeWeight } = neighbourFacBias;
    const relType = neighbourProfile?.relationshipType || 'neutral';

    // Mirror factions: neighbour's dominant faction type has agents/presence here
    for (const fType of mirrorFactions) {
      if (!existingTypes.has(fType) && Math.random() < mirrorWeight) {
        const mirrorLabel = getMirrorFactionLabel(fType, relType, neighbourProfile?.name);
        if (mirrorLabel) {
          powerStructure.factions.push({
            faction:       mirrorLabel,
            category:      fType,
            power:         Math.round(10 + Math.random() * 20),
            desc:          `${mirrorLabel} — presence from ${neighbourProfile.name} (${neighbourProfile.relationshipType.replace(/_/g,' ')}).`,
            source:        'neighbour_mirror',
            neighbourName: neighbourProfile.name,
            isGoverning:   false,
          });
          existingTypes.add(fType);
        }
      }
    }
    // Oppose factions: counter-movements formed in reaction to neighbour
    for (const fType of opposeFactions) {
      if (!existingTypes.has(fType) && Math.random() < opposeWeight) {
        const opposeLabel = getOpposeFactionLabel(fType, relType, neighbourProfile?.name);
        if (opposeLabel) {
          powerStructure.factions.push({
            faction:       opposeLabel,
            category:      fType,
            power:         Math.round(8 + Math.random() * 18),
            desc:          `${opposeLabel} — formed in reaction to ${neighbourProfile.name}'s influence.`,
            source:        'neighbour_opposition',
            neighbourName: neighbourProfile.name,
            isGoverning:   false,
          });
        }
      }
    }
  }

  // ── Item 17: Faction × culture demand profile ─────────────────────────────
  // Faction purchasing power + culture shapes what goods a settlement imports.
  // Active supply chains suppress imports already produced locally.
  // Isolated settlements cannot receive external goods — skip entirely.
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
  // ───────────────────────────────────────────────────────────────────────────

  // ── Item 16: Power-economy correlation ─────────────────────────────────────
  // Dominant factions boost probability of related institution categories.
  // This creates the bidirectional loop: config→institutions→powerStructure→boosts→more institutions.
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
  // ───────────────────────────────────────────────────────────────────────────

  // Arcane institution safety-net — see isolationGenerator.js
  stripArcaneInstitutions(institutions, effectiveConfig);

    const settlementReason = generateSettlementReason(tier, tradeRoute, null, effectiveConfig);
  const npcs             = generateNPCs({ tier, institutions }, culture, effectiveConfig);
  const relationships    = generateRelationships(npcs, effectiveConfig, institutions);
  const factions         = generateFactions(npcs, relationships);

  // ── Link NPC faction groups → power factions ────────────────────────────────
  // Each NPC group has a dominantCategory. We match using a priority-cascade:
  //   1. Direct category match (highest-power faction with same category)
  //   2. Attraction profile match (each power faction type attracts certain NPC group types)
  //   3. Power-weighted scatter for genuinely ambiguous 'other' groups
  //
  // Attraction profiles: ordered list of NPC group categories each faction type draws
  const FACTION_ATTRACTION = {
    government: ['government', 'other'],
    military:   ['military', 'government', 'other'],
    economy:    ['economy', 'crafts', 'government', 'other'],
    religious:  ['religious', 'magic', 'other'],
    criminal:   ['criminal', 'other'],
    magic:      ['magic', 'religious', 'other'],
    crafts:     ['crafts', 'economy', 'other'],
    noble:      ['government', 'military', 'other'],
  };

  const pfList = powerStructure?.factions || [];
  const topPowerFaction = [...pfList].sort((a,b) => (b.power||0)-(a.power||0))[0];
  const governingPF = pfList.find(f => f.isGoverning) || topPowerFaction;

  // Build category → best power faction map (direct match)
  const powerFactionsByCategory = pfList.reduce((acc, pf) => {
    const cat = pf.category || 'other';
    if (!acc[cat] || pf.power > acc[cat].power) acc[cat] = pf;
    return acc;
  }, {});

  // For each power faction, build its ordered attraction list as actual faction refs
  const pfAttractionMap = pfList.map(pf => {
    const profile = FACTION_ATTRACTION[pf.category || 'government'] || ['other'];
    return { pf, profile };
  });

  // Total power for weighted scatter
  const totalPower = pfList.reduce((s,f) => s + (f.power||0), 0) || 1;

  // Tracker: count how many NPC groups each power faction already has
  const pfLoadCount = new Map(pfList.map(f => [f.faction, 0]));

  factions.forEach(fg => {
    const cat = fg.dominantCategory || 'other';

    // 1. Direct category match
    const direct = powerFactionsByCategory[cat];
    if (direct) {
      fg.powerFactionName  = direct.faction;
      fg.powerFactionPower = direct.power;
      fg.powerFactionCat   = direct.category;
      pfLoadCount.set(direct.faction, (pfLoadCount.get(direct.faction)||0) + 1);
      return;
    }

    // 2. Attraction profile: find the highest-priority faction that wants this group type
    let bestMatch = null, bestPriority = 999;
    for (const { pf, profile } of pfAttractionMap) {
      const priority = profile.indexOf(cat);
      if (priority !== -1 && priority < bestPriority) {
        bestPriority = priority;
        bestMatch = pf;
      }
    }
    if (bestMatch && bestPriority < 2) {
      // Only use attraction if it's a meaningful match (not just 'other' catchall)
      fg.powerFactionName  = bestMatch.faction;
      fg.powerFactionPower = bestMatch.power;
      fg.powerFactionCat   = bestMatch.category;
      pfLoadCount.set(bestMatch.faction, (pfLoadCount.get(bestMatch.faction)||0) + 1);
      return;
    }

    // 3. Power-weighted scatter for ambiguous 'other' groups
    // Find the least-loaded faction proportionally (avoids all-to-governing dump)
    const roll = Math.random() * totalPower;
    let cumulative = 0;
    let scattered = governingPF;
    for (const pf of pfList) {
      cumulative += pf.power || 0;
      if (roll <= cumulative) { scattered = pf; break; }
    }
    fg.powerFactionName     = scattered.faction;
    fg.powerFactionPower    = scattered.power;
    fg.powerFactionCat      = scattered.category;
    fg.powerFactionFallback = true;
    pfLoadCount.set(scattered.faction, (pfLoadCount.get(scattered.faction)||0) + 1);
  });

  const conflicts        = generateConflicts(factions, relationships, effectiveConfig, institutions);
  const terrainT         = getTerrainType(tradeRoute, effectiveConfig.terrainOverride || null);
  const allowedResources = TERRAIN_DATA[terrainT]?.allowedResources?.slice(0, 7) || [];
  const resourceAnalysis = generateResourceAnalysis(terrainT, allowedResources, [], institutions, effectiveConfig);
  const economicViability = generateEconomicViability(
    { tier, population, institutions, economicState, config: { ...effectiveConfig } },
    terrainT, allowedResources
  );
  const history = generateHistory(tier, effectiveConfig, institutions, economicViability, economicState, powerStructure);

  // Derive legacy annotations: meaningful history → present structural connections
  // Only fires if events are temporally plausible for the current state
  const legacyAnnotations = deriveLegacyAnnotations(history, {
    powerStructure, economicState, tier, institutions,
  });
  if (legacyAnnotations.length > 0) {
    history.legacyAnnotations = legacyAnnotations;
  }

  // ── Assemble settlement object ────────────────────────────────────────────
  const settlement = {
    name: (effectiveConfig.customName?.trim()) || generateSettlementName(culture),
    tier,
    population,
    institutions,
    structuralViolations: structural.violations,
    structuralSuggestions: structural.suggestions,
    neighborRelationship: neighbourProfile || (_rawNeighbour ? {
      name: _rawNeighbour.name,
      tier: _rawNeighbour.tier,
      relationshipType: config._neighbourRelType || 'neutral',
      npcs:    _rawNeighbour.npcs    || [],
      factions: _rawNeighbour.factions || [],
    } : null),

    economicState,
    spatialLayout,
    availableServices,
    powerStructure,
    settlementReason,
    npcs,
    relationships,
    factions,
    conflicts,
    resourceAnalysis,
    economicViability,
    history,
    stress,
    config: { ...effectiveConfig },
  };

  // Narrative overlays
  settlement.pressureSentence = generatePressureSentence(settlement);
  settlement.arrivalScene     = generateArrivalScene(settlement);
  settlement.defenseProfile   = generateDefenseProfile(settlement);

  // Patch publicLegitimacy with the real defense readiness label now that it's computed
  if (settlement.powerStructure?.publicLegitimacy && settlement.defenseProfile?.readiness?.label) {
    const realDefLabel  = settlement.defenseProfile.readiness.label;
    const DEFENSE_CONTRIB = { 'Undefended':-10, 'Vulnerable':-5, 'Defensible':0, 'Well-Defended':7, 'Fortress':10 };
    const provLeg       = settlement.powerStructure.publicLegitimacy;
    const provDefContrib= DEFENSE_CONTRIB[provLeg.breakdown?.defense != null ? null : 'Defensible'] ?? 0;
    const realDefContrib= DEFENSE_CONTRIB[realDefLabel] ?? 0;
    const delta         = realDefContrib - (provLeg.breakdown?.defense ?? 0);
    if (delta !== 0) {
      const newScore = Math.max(0, Math.min(100, provLeg.score + delta));
      provLeg.score  = newScore;
      provLeg.breakdown.defense = realDefContrib;
      // Re-derive label and multipliers from updated score
      if      (newScore >= 75) { provLeg.label = 'Endorsed';         provLeg.color = '#1a5a28'; provLeg.govMultiplier = 1.30; provLeg.crimMultiplier = 0.75; }
      else if (newScore >= 60) { provLeg.label = 'Approved';         provLeg.color = '#4a7a2a'; provLeg.govMultiplier = 1.15; provLeg.crimMultiplier = 0.90; }
      else if (newScore >= 45) { provLeg.label = 'Tolerated';        provLeg.color = '#a0762a'; provLeg.govMultiplier = 1.00; provLeg.crimMultiplier = 1.00; }
      else if (newScore >= 30) { provLeg.label = 'Contested';        provLeg.color = '#8a4010'; provLeg.govMultiplier = 0.80; provLeg.crimMultiplier = 1.15; }
      else                     { provLeg.label = 'Legitimacy Crisis';provLeg.color = '#8b1a1a'; provLeg.govMultiplier = 0.60; provLeg.crimMultiplier = 1.30; }
      provLeg.isEndorsed         = newScore >= 75;
      provLeg.isApproved         = newScore >= 60;
      provLeg.isTolerated        = newScore >= 45 && newScore < 60;
      provLeg.isContested        = newScore >= 30 && newScore < 45;
      provLeg.isLegitimacyCrisis = newScore < 30;
      provLeg.governanceFractured= newScore < 30;
    }
  }

  const coherenceUpdates = generateCoherence(settlement);
  Object.assign(settlement, coherenceUpdates);

  return settlement;
}

// ─── Regen helpers ────────────────────────────────────────────────────────────
export function regenNPCs(settlement, config) {
  const { tier, institutions = [] } = settlement;
  const culture = config.culture || 'germanic';
  const npcs         = generateNPCs({ tier, institutions }, culture, config);
  const relationships = generateRelationships(npcs, config, institutions);
  const factions     = generateFactions(npcs, relationships);
  // Re-link faction groups to power factions from existing settlement
  const existingPF = settlement.powerStructure?.factions || [];
  const pfByCategory = existingPF.reduce((acc, pf) => {
    const cat = pf.category || 'other';
    if (!acc[cat] || pf.power > acc[cat].power) acc[cat] = pf;
    return acc;
  }, {});
  factions.forEach(fg => {
    const cat = fg.dominantCategory || 'other';
    const matched = pfByCategory[cat];
    if (matched) { fg.powerFactionName = matched.faction; fg.powerFactionPower = matched.power; fg.powerFactionCat = matched.category; }
  });
  const conflicts    = generateConflicts(factions, relationships, config, institutions);
  return { npcs, relationships, factions, conflicts };
}

export function regenHistory(settlement, config) {
  return generateHistory(
    settlement.tier, config, settlement.institutions || [],
    settlement.economicViability, settlement.economicState, settlement.powerStructure
  );
}

export function getRandomSliders() {
  const r = () => Math.round(Math.random() * 90) + 5;
  // Truly random — no constraint on spread. Every combination is valid.
  return {
    priorityEconomy:  r(), priorityMilitary: r(),
    priorityMagic:    r(), priorityReligion:  r(),
    priorityCriminal: r(),
  };
}
// Test hook — injected for smoke testing
if (typeof globalThis !== 'undefined') { globalThis.__runGeneration__ = generateSettlement; }
