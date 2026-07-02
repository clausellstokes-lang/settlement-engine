/**
 * economicGenerator.js
 * Economic state and viability generation
 */

import { random as _rng } from './rngContext.js';
import { customDeps as _customDeps } from '../lib/dependencyEngine.js';
import {
  getInstFlags,
  getPriorities,
  getStressFlags,
  getTradeRouteFeatures,
  hasTeleportationInfra,
  priorityToMultiplier,
} from './helpers.js';
import { generateSafetyProfile } from './safetyProfile.js';
import { HISTORY_EVENTS } from '../data/historyData.js';
import { TRADE_DEPENDENCY_NEEDS, INSTITUTION_FINISHED_GOODS_DEMAND } from '../data/economicData.js';
export { HISTORY_EVENTS } from '../data/historyData.js';

import { SEVERITY, TIER_ORDER } from '../data/constants.js';
import { institutionalCatalog } from '../data/institutionalCatalog.js';
import { FOOD_IMPORT_RATES } from '../data/foodImportRates.js';
import { generateFoodSecurity } from './foodGenerator.js';
import { TERRAIN_DATA } from '../data/geographyData.js';
import { INDUSTRY_WATER_NEEDS, RESOURCE_DATA } from '../data/resourceData.js';
import { SUPPLY_CHAIN_NEEDS } from '../data/supplyChainData.js';
import { GOODS_MODIFIERS_BY_TIER, COMMODITY_CATEGORY_MAP, GOODS_CATEGORIES } from '../data/tradeGoodsData.js';
import { evaluateWaterDependency } from './helpers.js';
import { subsumeTradeGoods, reconcileTradeLists } from '../domain/region/goodsCatalog.js';
import { tradeRouteTier } from '../domain/tradeRouteSemantics.js';
// ─── Economic helper functions ──────────────────────────────
import {
  computeActiveChains,
  deriveExportsFromChains,
  deriveImportsFromChains,
  deriveLocalProductionFromChains,
  deriveInstitutionalServices,
  deriveServiceExports,
  institutionMatchesKeyword,
} from './computeActiveChains.js';

const SUPPLY_CHAIN_GROUPS = /** @type {Array<{ chains: Array<any> }>} */ (Object.values(SUPPLY_CHAIN_NEEDS));

// ECONOMIC_CONSTANTS
const ECONOMIC_CONSTANTS = {
  PER_CAPITA_NEED: 2,
  FARMER_PRODUCTION: 6,
  AGRICULTURAL_WORKFORCE: 0.4,
  STORAGE_BUFFER: 1.3,
};

// Food-deficit import coverage channel ladder: FOOD_IMPORT_RATES (imported
// from data/foodImportRates.js) — single source of truth shared with
// foodGenerator and the tick-time stockpile (domain/worldPulse/foodStockpile).

// WATER_ROUTES
const WATER_ROUTES = ['coastal', 'riverside'];

// Tier-plausible institution availability — the SAME model assembleInstitutions
// uses: a settlement of tier T draws only from institutionalCatalog[T]
// (metropolis merges the city section in), and an entry whose own minTier sits
// above T is skipped. Viability suggestions may only name institutions the
// settlement could actually generate at its tier — a thorp's grain gap reads
// "Mill", never a hundred-item catalog dump with slave markets in it.
const tierCatalogNameCache = new Map();
const catalogNamesAvailableAtTier = (tier) => {
  const t = TIER_ORDER.includes(tier) ? tier : 'village';
  if (tierCatalogNameCache.has(t)) return tierCatalogNameCache.get(t);
  const sections = t === 'metropolis'
    ? [institutionalCatalog.city || {}, institutionalCatalog.metropolis || {}]
    : [institutionalCatalog[t] || {}];
  const tierIdx = TIER_ORDER.indexOf(t);
  const names = sections.flatMap((section) =>
    Object.values(section).flatMap((group) =>
      Object.entries(group)
        .filter(([, spec]) => tierIdx >= TIER_ORDER.indexOf(spec?.minTier || 'thorp'))
        .map(([name]) => name.toLowerCase())
    )
  );
  tierCatalogNameCache.set(t, names);
  return names;
};

// Same fuzzy matcher the chain-activation gate uses (computeActiveChains): an
// institution name matches a processor pattern when it CONTAINS the pattern
// lowercased and truncated to 12 chars.
const matchesProcessor = (instName, processor) => {
  const pattern = String(processor || '').toLowerCase().slice(0, 12);
  return pattern.length > 0 && String(instName || '').toLowerCase().includes(pattern);
};

const processorAvailableAtTier = (processor, tier) =>
  catalogNamesAvailableAtTier(tier).some((n) => matchesProcessor(n, processor));

// Cap chain suggestions at a readable count: top 3 by relevance (the matching
// chains' own processor ordering — canonical processors lead each chain list).
const MAX_CHAIN_SUGGESTIONS = 3;

// buildViabilitySummary
const buildViabilitySummary = (isViable, issues, warnings, plotHooks) => {
  const criticalCount = issues.filter((i) => i.severity === SEVERITY.CRITICAL).length;
  const implausibleCount = issues.filter((i) => i.severity === SEVERITY.IMPLAUSIBLE).length;
  const dependencyCount = [...issues, ...warnings].filter((i) => i.severity === SEVERITY.DEPENDENCY).length;
  if (criticalCount > 0)
    return `✗ NOT VIABLE: ${criticalCount} critical issue${criticalCount > 1 ? 's' : ''} prevent settlement survival.`;
  if (implausibleCount > 3) return ` IMPLAUSIBLE: ${implausibleCount} historical inconsistencies break believability.`;
  if (dependencyCount > 0)
    return `✓ VIABLE: Settlement can survive but has ${dependencyCount} trade dependenc${dependencyCount > 1 ? 'ies' : 'y'}. ${plotHooks.length} plot hooks available.`;
  return '✓ VIABLE: Settlement is economically self-sufficient and historically plausible.';
};

// assessResourceChains
const assessResourceChains = (institutions, terrain, nearbyResources, config = {}) => {
  const issues = [];
  const warnings = [];
  const suggestions = [];

  const tier = config?.tier || config?.settType || 'village';

  nearbyResources.forEach((resource) => {
    // Find chains associated with this resource using SUPPLY_CHAIN_NEEDS.
    // A null chain.resource must NEVER match: `includes(''.slice(0, 8))` is
    // `includes('')` — true for every string — which used to pull every
    // resource-less chain (organised crime, the slave trade, …) into EVERY
    // resource's suggestion union (~100 "missing" institutions for a thorp).
    const matchingChains = SUPPLY_CHAIN_GROUPS
      .flatMap((need) => need.chains)
      .filter(
        (c) =>
          c.processingInstitutions.length > 0 &&
          c.resource &&
          (c.resource.toLowerCase().includes(resource.toLowerCase().slice(0, 8)) ||
            resource.toLowerCase().includes(c.resource.toLowerCase().slice(0, 8)))
      );
    if (matchingChains.length === 0) return;
    const allProcessors = [...new Set(matchingChains.flatMap((c) => c.processingInstitutions))];
    // Suggestions name only TIER-PLAUSIBLE processors (see
    // catalogNamesAvailableAtTier above), capped at a readable count.
    const reachable = allProcessors.filter((name) => processorAvailableAtTier(name, tier));

    // Presence via the SAME matcher the activation gate uses — an institution
    // the gate counts as a live processor must never be suggested as missing.
    const processingInsts = institutions.filter((i) =>
      allProcessors.some((name) => matchesProcessor(i.name, name))
    );

    if (processingInsts.length === 0 && reachable.length > 0) {
      suggestions.push({
        category: 'Resource Chain',
        title: `Opportunity: process ${resource}`,
        description: `${resource} is available locally. Add ${reachable.slice(0, MAX_CHAIN_SUGGESTIONS).join(' or ')} to unlock higher-value exports.`,
      });
    } else if (processingInsts.length > 0) {
      const missing = reachable
        .filter((name) => !institutions.some((i) => matchesProcessor(i.name, name)))
        .slice(0, MAX_CHAIN_SUGGESTIONS);
      if (missing.length === 0) return; // complete for its tier — no junk gap
      const outputs = [...new Set(matchingChains.flatMap((c) => c.outputs || []))].slice(0, 4);
      suggestions.push({
        category: 'Resource Chain',
        title: `Incomplete chain: ${resource}`,
        description: `Processing ${resource} but missing ${missing.join(', ')} for the full chain.`,
        impact: `Exports intermediate goods instead of final products (${outputs.map((o) => o.label || o).join(', ') || 'finished goods'}). Lower profit margins.`,
        suggestedFixes: [`Add ${missing.join(' and ')} to complete the production chain`],
      });
    }
  });

  // Institution-as-producer map: if the settlement has an institution that IS the
  // production source for a resource, that counts as local infrastructure —
  // even if the terrain resource isn't explicitly listed in nearbyResources.
  // Principle: trade access (non-isolated) = valid infrastructure for any import.
  // For isolated settlements: only flag if there's genuinely NO local institution
  // that could plausibly cover the need.
  const RESOURCE_LOCAL_PRODUCERS = {
    // Grain / agriculture — any farming institution covers grain needs
    'Grain fields': ['farm', 'farmland', 'subsistence', 'grain', 'agriculture', 'mill', 'common graz'],
    'Fertile Floodplain': ['farm', 'farmland', 'subsistence', 'grain', 'agriculture', 'mill'],
    'Oasis and Water Rights': ['farm', 'farmland', 'subsistence', 'agriculture', 'well', 'water'],
    'Date Palms and Orchards': ['farm', 'farmland', 'subsistence', 'agriculture', 'orchard'],
    // Livestock / grazing — any animal husbandry institution
    'Grazing land': ['shepherd', 'grazing', 'dairy', 'livestock', 'cattle', 'common graz', 'stable', 'farmer'],
    'Alpine Pastures': ['shepherd', 'grazing', 'dairy', 'livestock', 'cattle', 'common graz'],
    // Fishing — any water access institution
    'Fishing grounds': ['fisher', 'fish market', 'fish', 'dock', 'port', 'river', 'barge', 'cooper', 'barrel'],
    'River fisheries': ['fisher', 'fish', 'river', 'barge', 'ferry', 'dock', 'port', 'landing', 'cooper', 'barrel'],
    Marshlands: ['fisher', 'fish', 'river', 'barge', 'marsh', 'chan', 'dock', 'cooper'],
    // Timber / woodland
    'Managed woodland': ['woodcutter', 'sawmill', 'carpenter', 'forest', 'lumber'],
    'Coastal Timber': ['shipyard', 'sawmill', 'carpenter', 'woodcutter', 'lumber'],
    'Mountain Timber': ['woodcutter', 'sawmill', 'charcoal'],
    // Mineral / earth resources
    'Iron ore deposits': ['mine', 'smith', 'smelter', 'metal', 'blacksmith', 'iron'],
    'Stone quarry': ['quarry', 'stone', 'brick', 'mine'],
    'Clay deposits': ['potter', 'brick', 'clay', 'tile', 'quarry'],
    'Coal or peat deposits': ['charcoal', 'peat', 'mine', 'coal', 'fuel'],
    'Fine Glass Sand': ['glass', 'sand', 'beach', 'quarry'],
    // Precious / exotic
    'Precious metal veins': ['mine', 'assay', 'mint', 'jewel', 'smith'],
    'Deep Natural Harbour': ['port', 'dock', 'harbour', 'harbor', 'shipyard'],
    // Mill infrastructure
    'Mill Sites': ['mill', 'farmland', 'farm', 'water', 'stream'],
    // Wild resources — any settlement with outdoors access
    'Foraging areas': ['druid', 'elder grove', 'apothecary', 'healer', 'warden', 'hedge', 'forest'],
    'Hunting grounds': ['hunter', 'warden', 'wildfowl', 'tanner', 'trapper', 'lodge'],
    'Wild foraging areas': ['druid', 'elder grove', 'apothecary', 'healer', 'warden'],
    // Salt
    'Salt flats': ['salt works', 'salt', 'brine', 'mine'],
  };

  const instNames = institutions.map((i) => (i.name || '').toLowerCase());

  institutions.forEach((inst) => {
    SUPPLY_CHAIN_GROUPS
      .flatMap((need) => need.chains)
      .filter(
        (chain) =>
          chain.processingInstitutions.length > 0 &&
          // Lowercase both sides to match the rest of the function's convention
          // (instNames / matchesProcessor) — a raw `inst.name.includes(name)`
          // missed processors whose casing differed from the catalog.
          chain.processingInstitutions.some((name) =>
            (inst.name || '').toLowerCase().includes(String(name || '').toLowerCase())
          )
      )
      .forEach((chain) => {
        const resource = chain.resource || '';
        const isIsolated = config?.tradeRouteAccess === 'isolated';

        // Check terrain-based resource presence
        const hasTerrainResource = nearbyResources.some(
          (r) =>
            resource.toLowerCase().includes(r.toLowerCase().slice(0, 6)) ||
            r.toLowerCase().includes(resource.toLowerCase().slice(0, 6))
        );

        // Check if the settlement has an institution that IS the production source.
        // Imports on any trade route also count as valid infrastructure.
        const localProducerKws = RESOURCE_LOCAL_PRODUCERS[resource] || [];
        const hasProducingInstitution = localProducerKws.some((kw) => instNames.some((n) => n.includes(kw)));
        // Teleportation infrastructure counts as trade access — magical supply chains replace roads
        const hasMagicTrade = isIsolated && hasTeleportationInfra(institutions, config);
        const hasTradeAccess = !isIsolated || hasMagicTrade; // trade route OR magic = imports available

        const hasInfrastructure = hasTerrainResource || hasProducingInstitution || hasTradeAccess;

        // Only flag if there is genuinely NO infrastructure covering this need.
        // Trade access and local production institutions both count as infrastructure.
        if (!hasInfrastructure) {
          issues.push({
            severity: SEVERITY.IMPLAUSIBLE,
            category: 'Resource Access',
            title: `${inst.name}: no viable resource supply`,
            description: `${inst.name} requires ${resource} to function but the settlement has no local production, no nearby deposits, and no trade access to import it.`,
            impact: 'Institution cannot function without a supply source.',
            suggestedFixes: [
              `Add a trade route so ${resource} can be imported`,
              `Or add a resource-producing institution locally`,
            ],
          });
        }
      });
  });

  return { issues, warnings, suggestions };
};

// deriveFoodSecurityHooks
const deriveFoodSecurityHooks = (population, terrain, institutions, config, foodBalance) => {
  const issues = [];
  const warnings = [];
  const hooks = [];
  const route = config?.tradeRouteAccess || 'isolated';
  const hasDeficit = foodBalance.deficit > 0;

  if (hasDeficit) {
    if (route === 'isolated' || route === 'road') {
      hooks.push({
        category: 'Survival Crisis',
        hook: ' PLOT HOOK: Settlement is starving. Desperate villagers might turn to banditry, or a merchant offers to supply food... at a terrible price (debt servitude? dark pact?).',
        severity: 'critical',
      });
    } else if (route !== 'isolated') {
      hooks.push({
        category: 'Trade Monopoly',
        hook: ' PLOT HOOK: A single merchant guild controls grain imports. They raise prices 300%. Do locals rebel? Seek alternative suppliers? What price are they willing to pay?',
        severity: 'high',
      });
      if (route === 'river')
        hooks.push({
          category: 'River Control',
          hook: ' PLOT HOOK: Upstream settlement builds dam or diverts river. Threatens water access AND grain shipments. Diplomacy or war?',
          severity: 'high',
        });
      if (route === 'port')
        hooks.push({
          category: 'Naval Blockade',
          hook: ` PLOT HOOK: Enemy fleet or pirates blockade the port. Settlement has ${Math.round((foodBalance.dailyProduction / foodBalance.dailyNeed) * 30)} days of reserves. Hire ships to break blockade? Negotiate? Starve?`,
          severity: 'high',
        });
      if (route === 'road' && hasDeficit)
        hooks.push({
          category: 'Bandit Raids',
          hook: ' PLOT HOOK: Bandits target food caravans. Settlement offers bounty for clearing the trade road. But are the "bandits" actually desperate refugees from elsewhere?',
          severity: 'medium',
        });
    }
  }

  // Viability trade issues flagged by economic state. The terrain's mustImport list
  // (TERRAIN_DATA, e.g. coastal grain/timber) is the live source here — config never
  // carries mustImport. Needles must be lowercase to match the lowercased name, and
  // the grain branch excludes sawmills ('sawmill'.includes('mill') is true).
  const mustImport = terrain?.mustImport || config?.mustImport;
  if (mustImport) {
    mustImport.forEach((resource) => {
      const hasProcessor = institutions.some((i) => {
        const n = (i.name || '').toLowerCase();
        return (
          (resource.toLowerCase().includes('grain') && n.includes('mill') && !n.includes('sawmill')) ||
          (resource.toLowerCase().includes('timber') && n.includes('sawmill')) ||
          (resource.toLowerCase().includes('metal') && (n.includes('smith') || n.includes('smelter')))
        );
      });
      if (hasProcessor) {
        warnings.push({
          severity: SEVERITY.DEPENDENCY,
          category: 'Resource Import',
          title: `Imports ${resource}`,
          description: `Settlement must import ${resource} to support local industries.`,
          impact: 'Creates trade dependency and vulnerability.',
          suggestedFixes: [`Establish stable trade relationship with ${resource} supplier`],
        });
        if (resource.toLowerCase().includes('timber'))
          hooks.push({
            category: 'Resource Conflict',
            hook: " PLOT HOOK: Timber supplier forest is threatened by blight/fire/monsters. Settlement's construction and shipbuilding industries face collapse. Secure new supplier or solve crisis?",
            severity: 'medium',
          });
        if (resource.toLowerCase().includes('metal') || resource.toLowerCase().includes('iron'))
          hooks.push({
            category: 'Strategic Resource',
            hook: ' PLOT HOOK: War breaks out. Metal suppliers prioritize military contracts. Blacksmiths cannot get iron for tools/repairs. Economy suffers, population discontent grows.',
            severity: 'medium',
          });
      }
    });
  }

  return { issues, warnings, plotHooks: hooks };
};

// assessFoodViability
const assessFoodViability = (population, terrain, institutions, config) => {
  const issues = [];
  const warnings = [];
  const plotHooks = [];
  const dailyNeed = population * ECONOMIC_CONSTANTS.PER_CAPITA_NEED;
  const agriCap = terrain ? terrain.agricultureCapacity : 1;
  const stresses = config?.stressTypes || [];
  const resources = config?.nearbyResources || [];
  const instNames = (institutions || []).map((i) => (i.name || '').toLowerCase());
  const hasResource = (keys) => resources.some((r) => keys.some((k) => r.includes(k)));
  const hasInstitution = (keys) => instNames.some((n) => keys.some((k) => n.includes(k)));

  // Agriculture modifier from resource+institution combinations
  let agriMod = 0;
  if (
    hasResource(['grain_fields', 'fertile_floodplain']) &&
    hasInstitution(['farm', 'granary', 'mill', 'subsistence', 'grain'])
  )
    agriMod += 0.25;
  if (hasResource(['fertile_floodplain']) && hasInstitution(['farm', 'granary', 'subsistence'])) agriMod += 0.1;
  if (
    hasResource(['grazing_land', 'fertile_floodplain']) &&
    hasInstitution(['graz', 'livestock', 'butcher', 'common graz', 'pasture'])
  )
    agriMod += 0.1;
  if (
    hasResource(['hunting_grounds']) &&
    (hasInstitution(['hunt']) || ['thorp', 'hamlet', 'village'].includes(config?.tier || config?.settType || ''))
  )
    agriMod += 0.06;
  if (hasResource(['river_fish', 'fishing_grounds']) && hasInstitution(['fish', 'dock', 'port', 'harbor']))
    agriMod += 0.09;
  if (hasResource(['river_mills']) && hasInstitution(['mill'])) agriMod += 0.08;
  agriMod = Math.min(agriMod, 0.5);

  // ── Magic food production enhancement ──────────────────────────────────────
  // High magic settlements can use arcane/druidic/divine means to supplement
  // food production. Only applies at town+ tier (smaller settlements lack the
  // institutional base to sustain magical agriculture at scale).
  // Requires: magic priority > 75, magic-capable institution present.
  const magPriority = config?.priorityMagic ?? 0;
  const isMagicHighTier = magPriority > 75 && ['town', 'city', 'metropolis'].includes(config?.settType || '');
  if (isMagicHighTier) {
    const hasMagicFarm = hasInstitution([
      'druid',
      'grove',
      'nature shrine',
      'wizard',
      'arcane',
      'hedge wizard',
      'alchemist',
    ]);
    if (hasMagicFarm) {
      // Boost agriMod for magical food production — represents: grow spells,
      // summoned water, magically accelerated crops, divinely-blessed fields.
      agriMod = Math.min(agriMod + 0.3, 0.8); // higher cap for magic
    }
  }
  // ───────────────────────────────────────────────────────────────────────────
  // §14 — custom food-impacting content present here shifts the food balance the
  // way a real farm/granary would: each custom PRODUCER lifts agricultural
  // output; each custom CONSUMER raises demand. Covers all four types — custom
  // institutions + resources by their own presence, services by their provider
  // institution, trade goods by their required institution. A no-op leaving
  // agriMod/need untouched when the user has no present custom food items, so
  // existing generations stay byte-identical.
  const { producers: customFoodProducers, consumers: customFoodConsumers } =
    _customDeps.foodImpactTally((institutions || []).map((i) => i.name), config?.nearbyResourcesCustom);
  if (customFoodProducers > 0) agriMod += Math.min(customFoodProducers * 0.15, 0.6);
  const effectiveAgri = Math.min(agriCap + agriMod, 2);

  // Stress modifiers
  let productionMult = 1;
  let consumptionMult = 1;
  let routeOverride = null;
  const stressNotes = [];
  if (stresses.includes('famine')) {
    productionMult *= 0.35;
    stressNotes.push('Famine: crop failure has reduced local food production to 35% of normal capacity.');
  }
  if (stresses.includes('under_siege')) {
    productionMult *= 0.6;
    routeOverride = 'isolated';
    stressNotes.push('Siege: external supply lines severed and outlying farmland abandoned or razed.');
  }
  if (stresses.includes('plague_onset')) {
    productionMult *= 0.75;
    stressNotes.push('Plague: agricultural workforce decimated by illness. Fields are understaffed.');
  }
  if (stresses.includes('occupied')) {
    consumptionMult *= 1.2;
    stressNotes.push('Occupation: occupying forces consume approximately 20% of food supply beyond normal needs.');
  }

  const dailyProduction =
    (Math.floor(population * ECONOMIC_CONSTANTS.AGRICULTURAL_WORKFORCE) *
      ECONOMIC_CONSTANTS.FARMER_PRODUCTION *
      effectiveAgri *
      productionMult) /
    ECONOMIC_CONSTANTS.STORAGE_BUFFER;
  const adjustedNeed = dailyNeed * consumptionMult
    + (customFoodConsumers > 0 ? dailyNeed * Math.min(customFoodConsumers * 0.1, 0.5) : 0);
  const effectiveRoute = routeOverride || config?.tradeRouteAccess || 'isolated';
  const surplus = dailyProduction - adjustedNeed;
  const rawDeficit = Math.abs(Math.min(surplus, 0));
  const _rawDeficitPct = adjustedNeed > 0 ? (rawDeficit / adjustedNeed) * 100 : 0;

  // Import coverage: trade routes, magical transport, and minor-route
  // channels each cover part of the deficit. Magical transport is capped and
  // expensive — a teleportation circle moves what is rationed and necessary,
  // never bulk plenty (sub-road rate), and it has its own supply chain:
  // without an arcane maintainer institution its throughput halves. Airships
  // can run a blockade where caravans cannot, but against sustained
  // countermeasures they land a fraction of what open routes carry.
  const _magicOn = config?.magicExists !== false;
  const _siegeIsolation = routeOverride === 'isolated';
  const _hasTeleportCircle = _magicOn && instNames.some(
    (n) => n.includes('teleportation') || n.includes('planar') || n.includes('extradimensional')
  );
  const _hasAirshipDock = _magicOn && instNames.some((n) => n.includes('airship'));
  const _hasArcaneMaintainer = instNames.some(
    (n) => ['wizard', 'mage', 'alchemist', 'academy', 'arcane'].some((k) => n.includes(k))
  );
  const _maintainerMult = _hasArcaneMaintainer ? 1 : 0.5;
  const _magicTradeRate = _hasTeleportCircle
    ? FOOD_IMPORT_RATES.teleport
    : _hasAirshipDock
      ? (_siegeIsolation ? FOOD_IMPORT_RATES.airshipBesieged : FOOD_IMPORT_RATES.airship)
      : 0;
  // Even isolated settlements receive expensive, irregular, politically
  // controlled imports — minor routes, sanctioned caravans, pilgrimage
  // traffic, protected convoys. Nothing major, and a siege severs them.
  const _tierForTrade = config?.tier || config?.settType || 'village';
  const _minorRouteRate = _siegeIsolation
    ? 0
    : ['town', 'city', 'metropolis'].includes(_tierForTrade)
      ? FOOD_IMPORT_RATES.minorRoutes
      : _tierForTrade === 'village'
        ? FOOD_IMPORT_RATES.minorRoutesVillage
        : 0;
  const importCoverageRate = effectiveRoute !== 'isolated'
    ? (effectiveRoute === 'port'
      ? 0.7
      : effectiveRoute === 'crossroads'
        ? 0.6
        : effectiveRoute === 'river'
          ? 0.5
          : effectiveRoute === 'road'
            ? 0.35
            : 0)
    : Math.max(_magicTradeRate * _maintainerMult, _minorRouteRate);
  const canImportFood = importCoverageRate > 0 && rawDeficit > 0;
  const importCoverage = canImportFood ? Math.round(rawDeficit * importCoverageRate) : 0;
  const importChannel = !canImportFood
    ? null
    : effectiveRoute !== 'isolated'
      ? `${effectiveRoute} trade`
      : _magicTradeRate * _maintainerMult >= _minorRouteRate
        ? (_hasTeleportCircle ? 'teleportation circle' : _siegeIsolation ? 'airship runs (impaired by siege)' : 'airship traffic')
        : 'minor routes and sanctioned caravans';

  // Magic food offset: druid/divine/arcane can supplement food production
  // Only applies when magic is active and relevant institutions exist
  const magicOn = config?.magicExists !== false;
  let magicFoodOffset = 0;
  let magicFoodNote = '';
  if (magicOn && rawDeficit > importCoverage) {
    const magPri = config?.priorityMagic ?? 0;
    const relPri = config?.priorityReligion ?? 0;
    const hasDruid =
      magPri >= 30 &&
      instNames.some((n) =>
        ['druid circle', 'grove shrine', 'elder grove', "warden's lodge", 'sacred grove'].some((k) => n.includes(k))
      );
    const hasDivine =
      relPri >= 55 &&
      instNames.some((n) =>
        ['cathedral', 'monastery', 'great cathedral', 'parish church', 'friary'].some((k) => n.includes(k))
      );
    const hasArcane =
      magPri >= 50 && instNames.some((n) => ['wizard', 'mages', 'arcane', 'spellcasting'].some((k) => n.includes(k)));
    const remaining = rawDeficit - importCoverage;
    if (hasDruid) {
      magicFoodOffset = Math.max(magicFoodOffset, Math.round(remaining * 0.65));
      magicFoodNote = 'Druidic cultivation provides partial food supplement';
    } else if (hasDivine) {
      magicFoodOffset = Math.max(magicFoodOffset, Math.round(remaining * 0.4));
      magicFoodNote = 'Divine provision supplements food shortfall';
    } else if (hasArcane) {
      magicFoodOffset = Math.max(magicFoodOffset, Math.round(remaining * 0.3));
      magicFoodNote = 'Arcane Plant Growth provides minor food supplement';
    }
  }

  const deficit = Math.max(0, rawDeficit - importCoverage - magicFoodOffset);
  const deficitPercent = adjustedNeed > 0 ? (deficit / adjustedNeed) * 100 : 0;

  if (surplus < 0) {
    if (deficitPercent > 50) {
      if (effectiveRoute === 'isolated') {
        // Food security deficit is already surfaced via prosperity level + situational description
        // in the Economics tab. No need to duplicate it here as a viability concern.
      } else if (effectiveRoute === 'road') {
        issues.push({
          severity: SEVERITY.DEPENDENCY,
          category: 'Food Production',
          title: 'Heavy Food Import Dependency',
          description: `Settlement requires ~${Math.round(deficit)} lbs of grain/day via road trade (${Math.round(deficitPercent)}% of needs). Vulnerable to supply disruption.`,
          impact: 'A trade disruption or bad harvest becomes a famine within weeks.',
          suggestedFixes: [
            'Add granary or grain storage for reserves',
            'Establish multiple supply routes',
            'Develop local food production',
          ],
        });
      } else {
        issues.push({
          severity: SEVERITY.DEPENDENCY,
          category: 'Food Production',
          title: 'Severe Food Import Dependency',
          description: `Settlement requires ~${Math.round(deficit)} lbs of grain per day via ${effectiveRoute} trade.`,
          impact: 'Vulnerable to trade disruption, famine risk.',
          suggestedFixes: [
            'Stockpile grain reserves for 3-6 months',
            'Diversify trade partners',
            'Develop alternative food sources (fish, livestock)',
          ],
        });
        plotHooks.push({
          category: 'Trade Disruption',
          hook: ` PLOT HOOK: The ${effectiveRoute} trade route is cut off (bandits/war/natural disaster). Settlement has only ${Math.round((dailyProduction / adjustedNeed) * 30)} days of food remaining. Famine threatens within weeks.`,
          severity: 'high',
        });
      }
    } else if (deficitPercent > 20) {
      warnings.push({
        severity: SEVERITY.DEPENDENCY,
        category: 'Food Production',
        title: 'Food Import Requirement',
        description: `Settlement imports ~${Math.round(deficit)} lbs of grain/day (${Math.round(deficitPercent)}% of needs) via ${effectiveRoute}.`,
        impact: 'Creates trade dependency but manageable.',
        suggestedFixes: ['Increase local food production', 'Maintain strategic grain reserves'],
      });
      plotHooks.push({
        category: 'Trade Politics',
        hook: ' PLOT HOOK: Price of grain spikes due to poor harvest elsewhere. Can settlement afford imports? Do merchants exploit the situation?',
        severity: 'medium',
      });
    }
  } else if (surplus > adjustedNeed * 0.5) {
    warnings.push({
      severity: SEVERITY.INEFFICIENCY,
      category: 'Food Production',
      title: 'Agricultural Surplus',
      description: `Settlement produces ${Math.round((surplus / adjustedNeed) * 100)}% more food than needed.`,
      impact: 'Export opportunity. Could generate significant trade income.',
      suggestedFixes: [
        'Add merchants to export surplus grain',
        'Add granary for long-term storage',
        'Develop food processing industries (brewing, baking)',
      ],
    });
  }

  // Granary check for large settlements
  const hasGranary = instNames.some(
    (n) => n.includes('granar') || n.includes('grain store') || n.includes('grain silo')
  );
  if (getTradeRouteFeatures(config?.tier || config?.settType || 'village') && !hasGranary) {
    warnings.push({
      severity: SEVERITY.CRITICAL,
      category: 'Food Storage',
      title: 'No Grain Storage Facility',
      description: `Settlement of ${population.toLocaleString('en-US')} lacks a granary. It cannot buffer harvests or maintain strategic food reserves.`,
      impact: 'Vulnerable to seasonal shortages and siege starvation without grain reserves.',
      suggestedFixes: ['Add Town granary, City granaries, or State granary complex'],
    });
  }

  // Mill check for towns
  const hasMill = instNames.some((n) => n.includes('mill') || n === 'miller');
  if (population > 1000 && !hasMill && population < 5000) {
    warnings.push({
      severity: SEVERITY.CRITICAL,
      category: 'Food Processing',
      title: 'No Milling Facility',
      description: `Settlement of ${population} people processes grain without a mill.`,
      impact: 'Inefficient food processing, implausible for this population size.',
      suggestedFixes: ['Add Mill (water-powered or windmill) or Mills (2-5)'],
    });
  }

  // Stress food impact notes
  if (stressNotes.length > 0) {
    const isCritical = stresses.includes('famine') || stresses.includes('under_siege');
    stressNotes.forEach((note) => {
      issues.push({
        type: 'stress_consequence',
        category: 'Food Supply',
        severity: isCritical ? 'critical' : 'implausible',
        title: 'Stress: Food Production Degraded',
        message: note,
        description: note,
        priorityNote: 'Active stress condition is directly reducing food availability.',
      });
    });
  }

  return {
    issues,
    warnings,
    plotHooks,
    foodBalance: {
      dailyNeed: Math.round(adjustedNeed),
      dailyProduction: Math.round(dailyProduction),
      deficit: Math.round(deficit),
      deficitPercent: Math.round(deficitPercent),
      surplus: Math.round(Math.max(surplus, 0)),
      agricultureModifier: agriCap,
      stressModifier: productionMult < 1 ? productionMult : undefined,
      importCoverage: importCoverage > 0 ? Math.round(importCoverage) : undefined,
      rawDeficit: rawDeficit > deficit ? Math.round(rawDeficit) : undefined,
      // Attribution: which channel carries the imports, and how much of the
      // gap magic closes. Without these the dossier shows a deficit smaller
      // than needed-minus-produced with no visible explanation.
      importChannel: importChannel || undefined,
      magicFoodOffset: magicFoodOffset > 0 ? Math.round(magicFoodOffset) : undefined,
      // Surface the magic-source note alongside its offset so callers
      // can attribute the food contribution (Druidic / Divine / Arcane).
      // Conditional inclusion keeps the field shape unchanged when no
      // magic offset applies.
      magicFoodNote: magicFoodNote || undefined,
    },
  };
};

// generatePowerDynamics
const generatePowerDynamics = (population, institutions, economicState, config = {}) => {
  const issues = [];
  const warnings = [];
  const suggestions = [];
  const pri = getPriorities(config);
  const instNames = institutions.map((i) => (i.name || '').toLowerCase());
  const hasInst = (...kws) => kws.some((kw) => instNames.some((n) => n.includes(kw)));

  // City+ without markets
  const hasMarket = hasInst('market', 'merchant', 'district');
  if (population > 5000 && !hasMarket) {
    warnings.push({
      severity: SEVERITY.CRITICAL,
      category: 'Economic Structure',
      title: 'No Trade Infrastructure',
      description: `Population of ${population.toLocaleString('en-US')} without any markets or trade institutions.`,
      impact: 'Economy cannot support this population.',
      suggestedFixes: ["Add Market Square, Merchants' Quarter, or Trade Guild"],
    });
  }

  // Insufficient craft industries for size
  const craftCount = instNames.filter(
    (n) => n.includes('guild') || n.includes('craft') || n.includes('workshop')
  ).length;
  if (population > 5000 && craftCount < 2) {
    const water = evaluateWaterDependency(config, institutions);
    if (water.strength === 'strong') {
      suggestions.push({
        category: 'Economic Diversity',
        title: 'Trade-dependent craft economy',
        description: `Craft guilds operate on imported materials, sustained by strong ${config?.tradeRouteAccess} trade. Vulnerable to supply disruption.`,
      });
    } else {
      warnings.push({
        severity: water.strength === 'moderate' ? SEVERITY.INEFFICIENCY : SEVERITY.IMPLAUSIBLE,
        category: 'Economic Diversity',
        title: 'Insufficient Craft Industries',
        description: `Population of ${population.toLocaleString('en-US')} with only ${craftCount} craft institution${craftCount !== 1 ? 's' : ''}. ${water.note}`,
        impact: water.buffered
          ? 'Craft economy depends on trade imports.'
          : 'Lacks diversity to employ the population.',
        suggestedFixes: water.buffered
          ? ['Develop local resource base to reduce trade dependency']
          : [
              'Add craft guilds: smiths, weavers, tanners, etc.',
              'Improve trade access and economy for trade-sustained crafts',
            ],
      });
    }
  }

  // Isolation viability check
  const route = config?.tradeRouteAccess || economicState?.tradeAccess || 'road';
  if (route === 'isolated') {
    const tierLabel = config?.tier || 'village';
    const isTownPlus = getTradeRouteFeatures(tierLabel);
    const hasMagic = hasTeleportationInfra(institutions || [], config);
    if (isTownPlus && !hasMagic) {
      warnings.push({
        severity: SEVERITY.DEPENDENCY,
        category: 'Economic Isolation',
        title: 'Structural Isolation: Economic Impact',
        description: `A ${tierLabel} in isolation cannot source specialist goods, process surpluses, or pay for skilled labour. Economy is permanently stunted regardless of slider values.`,
        impact: 'Income sources, trade goods, and services are all compromised. Prosperity capped at Poor.',
        suggestedFixes: ['Add a trade route', 'Add teleportation infrastructure (high magic)'],
      });
    } else if (isTownPlus && hasMagic) {
      warnings.push({
        severity: SEVERITY.DEPENDENCY,
        category: 'Economic Isolation',
        title: 'Magically-Sustained Isolation',
        description: `${tierLabel.charAt(0).toUpperCase() + tierLabel.slice(1)} sustains itself in isolation via magical infrastructure. Trade flows through teleportation or planar channels rather than roads.`,
        impact:
          'Entirely dependent on magical infrastructure. If magic fails or is disrupted, the settlement collapses without physical trade routes to fall back on.',
        suggestedFixes: [
          'Maintain magical infrastructure at all costs',
          'Consider adding a physical trade route as redundancy',
        ],
      });
    }
  }

  // Military priority checks
  if (getTradeRouteFeatures(config?.tier || 'village') && priorityToCategory(pri.military) === 'very_high') {
    const hasDefense = instNames.some((n) => n.includes('wall') || n.includes('fortif') || n.includes('palisade'));
    const hasMilInst = instNames.some((n) => n.includes('garrison') || n.includes('guard') || n.includes('barracks'));
    if (!hasDefense && !hasMilInst) {
      warnings.push({
        severity: SEVERITY.INEFFICIENCY,
        category: 'Military Priorities',
        title: 'High Military Priority Without Defences',
        description: 'Military slider is high but the settlement has no walls, garrison, or barracks.',
        impact: 'Military investment without physical infrastructure produces limited security.',
        suggestedFixes: ['Add Town Walls or Garrison'],
        priorityNote: `Military priority is ${pri.military}. Defence institutions are expected.`,
      });
    }
  }

  // Religion priority checks
  if (priorityToCategory(pri.religion) === 'very_high') {
    const hasChurch = instNames.some(
      (n) =>
        n.includes('church') ||
        n.includes('cathedral') ||
        n.includes('temple') ||
        n.includes('monastery') ||
        n.includes('shrine') ||
        n.includes('chapel')
    );
    if (!hasChurch) {
      warnings.push({
        severity: SEVERITY.INEFFICIENCY,
        category: 'Religious Priorities',
        title: 'High Religious Priority Without Clergy',
        description: 'Religion slider is high but no religious institution is present.',
        impact: 'Religious fervour without institutional anchoring produces instability.',
        suggestedFixes: ['Add Parish Church, Temple, or Monastery'],
        priorityNote: `Religion priority is ${pri.religion}. A religious centre is expected.`,
      });
    }
  }

  // Magic priority checks
  if (getTradeRouteFeatures(config?.tier || 'village') && priorityToCategory(pri.magic) === 'very_high') {
    const hasMagicInst = instNames.some(
      (n) =>
        n.includes('wizard') ||
        n.includes('mage') ||
        n.includes('alchemist') ||
        n.includes('arcane') ||
        n.includes('enchant')
    );
    if (!hasMagicInst) {
      warnings.push({
        severity: SEVERITY.INEFFICIENCY,
        category: 'Magical Priorities',
        title: 'High Magic Priority Without Arcane Institutions',
        description: 'Magic slider is high but no arcane institution is present.',
        impact: 'Magical potential is unrealised. Adventurers will find no magical services.',
        suggestedFixes: ["Add Hedge Wizard, Alchemist Shop, or Wizard's Tower"],
        priorityNote: `Magic priority is ${pri.magic}. An arcane institution is expected.`,
      });
    }
  }

  // Criminal priority checks
  if (getTradeRouteFeatures(config?.tier || 'village') && priorityToCategory(pri.criminal) === 'very_high') {
    const hasCrimInst = instNames.some(
      (n) => n.includes('thieves') || n.includes('criminal') || n.includes('black market') || n.includes('smuggl')
    );
    const hasGuardInst = instNames.some((n) => n.includes('garrison') || n.includes('guard') || n.includes('watch'));
    if (!hasCrimInst && !hasGuardInst) {
      warnings.push({
        severity: SEVERITY.DEPENDENCY,
        category: 'Criminal Activity',
        title: 'High Crime Priority: No Criminal or Guard Institutions',
        description: 'Criminal slider is high but neither criminal organisations nor guard infrastructure are present.',
        impact: 'High crime without institutions creates ungoverned chaos rather than structured underworld.',
        suggestedFixes: ["Add Organized Crime, Black Market, or City Watch"],
        priorityNote: `Criminal priority is ${pri.criminal}. Some underworld structure is expected.`,
      });
    }
  }

  // Banking without economy
  if (
    priorityToCategory(pri.economy) === 'very_low' &&
    instNames.some((n) => n.includes('bank') || n.includes('money'))
  ) {
    warnings.push({
      severity: SEVERITY.INEFFICIENCY,
      category: 'Economic Contradiction',
      title: 'Banking Without Economic Focus',
      description: 'Banking institutions exist but the economy priority is very low.',
      impact: 'Banks cannot operate without a merchant class to serve.',
      suggestedFixes: ['Raise Economy priority or remove Banking institutions'],
      priorityNote: `Economy priority is only ${pri.economy}.`,
    });
  }

  return { issues, warnings, suggestions };
};

// assessWaterDependencies
const assessWaterDependencies = (institutions, terrain, config) => {
  const issues = [];
  const warnings = [];
  const suggestions = [];
  const route = config?.tradeRouteAccess || 'unknown';
  const hasWater = terrain ? WATER_ROUTES.includes(terrain.name.toLowerCase()) : route === 'river' || route === 'port';

  institutions.forEach((inst) => {
    const waterNeed = Object.entries(INDUSTRY_WATER_NEEDS).find(
      ([key]) =>
        inst.name.toLowerCase().includes(key.toLowerCase()) ||
        key.toLowerCase().includes(inst.name.toLowerCase().split(' ')[0])
    )?.[1];

    if (waterNeed?.required) {
      const hasAlternative = waterNeed.alternatives.some((alt) => institutions.some((i) => i.name.includes(alt)));
      if (!hasWater && !hasAlternative) {
        const alternatives = waterNeed.alternatives.map((alt) => `Add ${alt}`);
        warnings.push({
          severity: SEVERITY.DEPENDENCY,
          category: 'Water Dependency',
          title: `${inst.name}: requires water access`,
          description: `${inst.name} requires ${waterNeed.description || 'water access'} but settlement has no river or port.`,
          impact: 'Severely reduced productivity without water access.',
          suggestedFixes: alternatives.length ? alternatives : ['Establish a river or port trade route'],
        });
      }
    }
  });

  return { issues, warnings, suggestions };
};

// getInstitutionEconomicBonus
const getInstitutionEconomicBonus = (nearbyResources = [], institutions = []) => {
  const instNames = institutions.map((i) => (i.name || '').toLowerCase());
  const commodities = new Set();
  getCommoditiesForResources(nearbyResources).forEach((commodity) => {
    const mapped = COMMODITY_CATEGORY_MAP[commodity];
    if (mapped) commodities.add(mapped);
    commodities.add(commodity.toLowerCase());
  });
  // Institution-driven commodity bonus keywords
  if (instNames.some((n) => n.includes('mill') || n.includes('baker'))) commodities.add('flour');
  if (instNames.some((n) => n.includes('smith') || n.includes('metalwork'))) commodities.add('ironwork');
  if (instNames.some((n) => n.includes('tanner') || n.includes('leather'))) commodities.add('leather');
  if (instNames.some((n) => n.includes('weaver') || n.includes('textile'))) commodities.add('cloth');
  if (instNames.some((n) => n.includes('butcher'))) commodities.add('meat');
  if (instNames.some((n) => n.includes('carpenter') || n.includes('sawmill'))) commodities.add('lumber');
  if (instNames.some((n) => n.includes('dock') || n.includes('port') || n.includes('fishmonger')))
    commodities.add('salt');
  return [...commodities];
};

// getCommoditiesForResources
const getCommoditiesForResources = (resources = []) => {
  const commodities = new Set();
  resources.forEach((resource) => {
    const resourceData = RESOURCE_DATA[resource];
    resourceData && resourceData.commodities.forEach((commodity) => commodities.add(commodity));
  });
  return [...commodities];
};

// getInstitutionServices
const getInstitutionServices = (tier, route, localProduction, institutions = [], nearbyResources = []) => {
  // Isolated settlements cannot import anything — they are self-contained by definition.
  // Return empty to avoid showing imports that contradict the "no external trade" description.
  if (route === 'isolated') return [];

  const instNames = institutions.map((i) => (i.name || '').toLowerCase());
  const needed = [];
  const isPort = route === 'port';
  const isRiver = route === 'river';
  const hasSalt = nearbyResources.some(
    (r) => r.includes('salt_flat') || r.includes('salt_deposit') || r.includes('salt_mine')
  );
  if (!localProduction.includes('salt') && !isPort && !isRiver && !hasSalt) needed.push('Salt');
  if (
    !localProduction.includes('iron') &&
    !instNames.some((n) => n.includes('smith') || n.includes('metalwork')) &&
    ['city', 'metropolis'].includes(tier)
  )
    needed.push('Iron');
  if (
    !localProduction.includes('grain') &&
    (isPort || ['city', 'metropolis'].includes(tier)) &&
    !instNames.some((n) => n.includes('farm') || n.includes('granar'))
  )
    needed.push('Grain');
  if (
    !localProduction.includes('timber') &&
    ['city', 'metropolis'].includes(tier) &&
    !instNames.some((n) => n.includes('carpenter') || n.includes('sawmill'))
  )
    needed.push('Timber');
  return needed;
};

// getTradeModifiers
const getTradeModifiers = (route, institutions = []) => {
  const instNames = institutions.map((inst) => (inst.name || '').toLowerCase());
  return (
    route === 'crossroads' ||
    (route === 'port' && instNames.some((name) => name.includes('international trade') || name.includes('warehouse district')))
  );
};

// isSaltPreserved
export const isSaltPreserved = (goodName) =>
  SALT_PRESERVATIVES.some((keyword) => (goodName || '').toLowerCase().includes(keyword));
const hasEconomicKeyword = isSaltPreserved;

// SALT_PRESERVATIVES
const SALT_PRESERVATIVES = ['preserv', 'salted', 'pickled', 'cured', 'smoked', 'brined', 'salt fish', 'salt meat'];

// UPGRADE_CHAINS

export const priorityToCategory = (priority = 50) => {
  const value = priority ?? 50;
  return value <= 15 ? 'very_low' : value <= 35 ? 'low' : value <= 65 ? 'medium' : value <= 85 ? 'high' : 'very_high';
};

// computeEconomicViability
const computeEconomicViability = (config = {}, _tier = 'town', institutions = []) => {
  const flags = getInstFlags(config, institutions);
  const stress = getStressFlags(config, institutions);
  const econCat = priorityToCategory(flags.economyOutput);
  const crimeCat = priorityToCategory(flags.criminalEffective);
  const route = config?.tradeRouteAccess || 'road';
  const isolated = route === 'isolated';
  const stresses = config.stressTypes?.length ? config.stressTypes : config.stressType ? [config.stressType] : [];
  const primaryStress = stresses.length
    ? [
        'under_siege',
        'occupied',
        'famine',
        'plague_onset',
        'politically_fractured',
        'recently_betrayed',
        'succession_void',
        'indebted',
        'infiltrated',
        'monster_pressure',
        'insurgency',
        'mass_migration',
        'wartime',
        'religious_conversion',
        'slave_revolt',
      ].find((s) => stresses.includes(s)) || stresses[0]
    : null;

  if (primaryStress === 'under_siege')
    return 'All normal economic activity is suspended. Markets are closed, merchant caravans have stopped arriving, and whatever currency existed is being redirected toward survival. The only economic question is the arithmetic of remaining supplies.';
  if (primaryStress === 'famine')
    return 'The economy is structured around food scarcity. Those with grain have power. Those without are making increasingly desperate decisions. Normal market activity continues in a technical sense. Prices are simply at levels that exclude most of the population.';
  if (primaryStress === 'occupied')
    return `Revenue flows outward to the occupying authority via ${route === 'port' ? 'maritime levies' : 'road tolls and seizure powers'} and compulsory assessment. Local commerce continues under supervision. The officially stated economic situation differs from the experienced one.`;
  if (primaryStress === 'indebted')
    return "Debt service obligations consume a meaningful share of revenue before any local investment is possible. The creditor's representative has effective veto power over fiscal decisions. Economic activity continues but its fruits are partly spoken for before they are earned.";
  if (primaryStress === 'plague_onset')
    return "Market activity is reduced by fear and quarantine measures. Supply chains for common goods are disrupted. The economic situation would be manageable if it weren't compounded by the medical crisis. As it is, each problem is making the other worse.";
  if (primaryStress === 'politically_fractured')
    return 'Economic activity requires navigating factional lines that did not exist a year ago. Some merchants have aligned with specific factions. Cross-faction trade continues but it is slower and more expensive than it should be.';

  if (isolated) {
    const isTownPlus = getTradeRouteFeatures(config?.tier || config?.settType || 'village');
    const hasMagicTrade = hasTeleportationInfra(institutions, config);
    if (isTownPlus && !hasMagicTrade)
      return 'This settlement is too large to survive in true isolation. Without trade routes, specialist goods cannot be sourced, surpluses cannot be sold, and population density cannot be sustained. The economy is structurally broken.';
    if (isTownPlus && hasMagicTrade)
      return 'Trade flows through magical channels: teleportation circles and planar contacts replace roads. The economy functions but depends entirely on maintaining that arcane infrastructure.';
    if (stress.stateCrime)
      return 'Internal production is suppressed by institutional extraction. What little surplus exists flows upward rather than into communal welfare.';
    if (econCat === 'very_high' || econCat === 'high')
      return 'Despite isolation, internal production is well-organised: skilled crafts, efficient agriculture, and communal resource management keep the settlement self-sufficient.';
    if (econCat === 'low' || econCat === 'very_low')
      return 'The settlement struggles to sustain itself without outside trade. Resources are tightly rationed and growth is impossible.';
    return 'The settlement meets its own needs without external trade, though surpluses are modest and specialist goods are unavailable.';
  }

  if (stress.theocraticEconomy)
    return 'The church controls most economic activity: land, markets, and trade flow through religious institutions. Commerce is present but the church sets the terms.';
  if (stress.merchantCriminalBlur)
    return 'Commerce is vigorous and the distinction between legitimate trade and criminal enterprise is largely academic. The wealthiest operators play both sides.';
  if (stress.stateCrime)
    return 'The official economy appears functional. The reality is that institutional extraction (confiscations, forced sales, and selective taxation) suppresses productive activity.';
  if (econCat === 'very_high')
    return 'Commerce is the lifeblood of this settlement. Markets are active at all hours and guild influence reaches every trade.';
  if (econCat === 'high')
    return 'Trade is vigorous and the guilds are well-organized, generating steady civic revenue.';
  if (econCat === 'low') return 'Commerce is sluggish; markets meet infrequently and many crafts are in decline.';
  if (econCat === 'very_low')
    return 'The economy is barely functional. Barter replaces coin and few outsiders bother to trade here.';
  if (crimeCat === 'high' || crimeCat === 'very_high')
    return 'Official commerce is moderate but a thriving shadow economy undercuts legitimate trade.';
  return 'Trade proceeds at an ordinary pace for a settlement of this size.';
};

// generateEconomicNarrative
const generateEconomicNarrative = (prosperity, config = {}, institutions = []) => {
  const flags = getInstFlags(config, institutions);
  const econOut = flags.economyOutput;
  const stresses = config.stressTypes?.length ? config.stressTypes : config.stressType ? [config.stressType] : [];
  const LABELS = ['Struggling', 'Poor', 'Moderate', 'Comfortable', 'Prosperous', 'Wealthy'];
  const BASE = { Subsistence: 0, Poor: 1, Moderate: 2, Comfortable: 3, Prosperous: 4, Wealthy: 5 };
  let idx = BASE[prosperity] !== undefined ? BASE[prosperity] : 2;
  // Subsistence settlements never rise above Poor: 40% Struggling, 60% Poor.
  // The second _rng() roll is retained (its branches both resolve to Poor)
  // ONLY to preserve the seeded RNG consumption order — removing it would
  // shift every downstream draw and break same-seed determinism.
  if (prosperity === 'Subsistence') {
    idx = _rng() < 0.4 ? 0 : (_rng(), 1); // 40% Struggling, 60% Poor (capped at Poor)
  }
  // Economy output adjustments — calibrated for truly random sliders (5-95 uniform)
  // Low econOut = low commercial investment, not necessarily crisis
  if (econOut >= 70)
    idx = Math.min(5, idx + 1); // high economy → bonus
  else if (econOut < 15) idx = Math.max(0, idx - 1); // very low economy → -1 (was -2)
  // Note: removed the 15-32 range penalty — a moderate-low economy is still functional
  // Small settlement floors:
  // - Isolated thorp/hamlet: cap at Poor (subsistence mode, valid to be Poor)
  // - Connected thorp/hamlet (road/river/etc): floor at Poor — they're struggling but not destitute
  // Derive tier from config — settType may be 'random' in random mode, so check config.tier too
  const _tier = config.tier || config.settType || '';
  const isSmallTier = _tier === 'thorp' || _tier === 'hamlet';
  const isIsolatedSmall = isSmallTier && config.tradeRouteAccess === 'isolated';
  const isConnectedSmall = isSmallTier && config.tradeRouteAccess !== 'isolated';
  if (isIsolatedSmall) idx = Math.max(0, Math.min(idx, 1)); // cap at Poor for isolated subsistence
  if (isConnectedSmall) idx = Math.max(1, idx); // floor at Poor — connected small settlement can't be Struggling
  // High crime drags down perceived prosperity
  if (flags.criminalEffective >= 65) idx = Math.max(0, idx - 1);
  // Stress penalties
  const active = stresses.length ? stresses : [];
  if (active.includes('under_siege')) idx = Math.max(0, Math.min(idx, 0));
  if (active.includes('famine')) idx = Math.max(0, Math.min(idx, 0));
  if (active.includes('occupied')) idx = Math.max(0, Math.min(idx, 1));
  if (active.includes('indebted')) idx = Math.max(0, idx - 1);
  if (active.includes('politically_fractured')) idx = Math.max(0, idx - 1);
  if (active.includes('plague_onset')) idx = Math.max(0, idx - 1);
  if (active.includes('recently_betrayed')) idx = Math.max(0, idx - 1);
  if (active.includes('monster_pressure')) idx = Math.max(0, idx - 1);
  if (active.includes('insurgency')) idx = Math.max(0, idx - 1);
  if (active.includes('wartime')) idx = Math.max(0, idx - 1);
  if (active.includes('mass_migration')) idx = Math.max(0, idx - 1);
  if (active.includes('religious_conversion')) idx = Math.max(0, idx - 1);
  return LABELS[Math.min(5, Math.max(0, idx))];
};

// generateTradeIncomeStreams
const getTradeRouteBonus = getTradeModifiers;

const generateTradeIncomeStreams = (tier, institutions = [], route = 'road', goodsToggles = {}, config = {}) => {
  const localProduction = getInstitutionEconomicBonus(config.nearbyResources || [], institutions);
  const necessityImports = getInstitutionServices(
    tier,
    route,
    localProduction,
    institutions,
    config.nearbyResources || []
  );
  const isEntrepot = getTradeRouteBonus(route, institutions);
  const hasSaltLocal = necessityImports.some((i) => i.toLowerCase() === 'salt');
  const exports = getGoodsModifiers(tier, institutions, goodsToggles)
    .filter((item) => !necessityImports.includes(item.name))
    .filter((item) => {
      const name = typeof item === 'string' ? item : item?.name || '';
      return !(hasSaltLocal && !isEntrepot && hasEconomicKeyword(name));
    });
  // Tier-connectivity: is this settlement plugged into a higher-tier trading
  // partner? True when a bound imported neighbour outranks it, or when it sits
  // on a major-artery route (crossroads/port) that by construction reaches
  // higher-tier hubs. This is the real isFromHigher signal that selects the
  // fromHigher/fromCityOrMetropolis/fromMetropolis upgrade-import pools.
  const _neighbourTierIdx = TIER_ORDER.indexOf(config._importedNeighbor?.tier ?? '');
  const isFromHigher = _neighbourTierIdx > TIER_ORDER.indexOf(tier) || tradeRouteTier(route) === 'major';
  const imports = getUpgradeChain(tier, route, isFromHigher, goodsToggles);
  const bonuses = [];
  if (isEntrepot && route === 'crossroads' && !['thorp', 'hamlet'].includes(tier))
    bonuses.push({
      source: 'Entrepôt Trade',
      percentage: tier === 'metropolis' ? 25 : tier === 'city' ? 20 : 18,
      desc: 'Transit duties, warehouse fees, and re-export premiums from goods passing through the crossroads position.',
    });
  if (route === 'port' && institutions.some((i) => i.name.toLowerCase().includes('international trade')))
    bonuses.push({
      source: 'International Commerce',
      percentage: 25,
      desc: 'Revenue from international trade: licensing fees, currency exchange, and commodity brokerage.',
    });
  return {
    exports,
    imports,
    isEntrepot,
    transit: isEntrepot ? imports.filter((i) => !necessityImports.includes(i)).slice(0, 4) : [],
    incomeBonuses: bonuses,
    localProduction,
    necessityImports,
  };
};

// getGoodsModifiers
const getGoodsModifiers = (tier, institutions = [], goodsToggles = {}) => {
  const tierData = GOODS_MODIFIERS_BY_TIER[tier] || {};
  const exports = [];
  Object.entries(tierData).forEach(([goodName, spec]) => {
    const toggleKey = `${tier}_export_${goodName}`;
    // Custom-content extension: resolve `requiredInstitution` refIds
    const reqInst = spec.requiredInstitution
      ? _customDeps.resolveInstitutionRequirement(spec.requiredInstitution)
      : '';
    (goodsToggles[toggleKey] !== void 0 ? goodsToggles[toggleKey] : spec.on) &&
      ((reqInst &&
        !institutions.some((inst) => inst.name === reqInst || inst.name.includes(reqInst))) ||
        (_rng() < spec.p && exports.push(goodName)));
  });
  return exports;
};

// UPGRADE_GOODS_BY_TIER — goods available as upgrades per tier
const UPGRADE_GOODS_BY_TIER = {
  thorp: {
    basic: [
      {
        name: 'Salt',
        category: GOODS_CATEGORIES.FOOD_PROCESSED,
        on: !0,
        desc: 'Food preservation',
      },
      {
        name: 'Metal tools',
        category: GOODS_CATEGORIES.MANUFACTURED,
        on: !0,
        desc: 'Simple implements',
      },
      {
        name: 'Cloth',
        category: GOODS_CATEGORIES.MANUFACTURED,
        on: !0,
        desc: 'Basic textiles',
      },
    ],
  },
  hamlet: {
    basic: [
      {
        name: 'Metal goods',
        category: GOODS_CATEGORIES.MANUFACTURED,
        on: !0,
        desc: 'Tools, nails, horseshoes',
      },
      {
        name: 'Salt',
        category: GOODS_CATEGORIES.FOOD_PROCESSED,
        on: !0,
        desc: 'Food preservation',
      },
      {
        name: 'Quality cloth',
        category: GOODS_CATEGORIES.MANUFACTURED,
        on: !0,
        desc: 'Better textiles',
      },
    ],
  },
  village: {
    basic: [
      {
        name: 'Metal goods',
        category: GOODS_CATEGORIES.MANUFACTURED,
        on: !0,
        desc: 'Tools, nails, horseshoes',
      },
      {
        name: 'Quality cloth and clothing',
        category: GOODS_CATEGORIES.MANUFACTURED,
        on: !0,
        desc: 'Finished garments',
      },
      {
        name: 'Salt for preservation',
        category: GOODS_CATEGORIES.FOOD_PROCESSED,
        on: !0,
        desc: 'Essential preservative',
      },
      {
        name: 'Specialized tools',
        category: GOODS_CATEGORIES.MANUFACTURED,
        on: !0,
        desc: 'Advanced implements',
      },
    ],
    fromHigher: [
      {
        name: 'Legal services',
        category: GOODS_CATEGORIES.SERVICES,
        on: !0,
        desc: 'Contracts, court access',
      },
      {
        name: 'Advanced medical care',
        category: GOODS_CATEGORIES.SERVICES,
        on: !0,
        desc: 'Skilled physicians',
      },
      {
        name: 'Manufactured goods',
        category: GOODS_CATEGORIES.MANUFACTURED,
        on: !0,
        desc: 'Wide variety of crafts',
      },
    ],
  },
  town: {
    fromCityOrMetropolis: [
      {
        name: 'Luxury textiles',
        category: GOODS_CATEGORIES.LUXURY,
        on: !0,
        desc: 'Fine cloth, silk',
      },
      {
        name: 'Spices and exotic dyes',
        category: GOODS_CATEGORIES.LUXURY,
        on: !0,
        desc: 'Imported rarities',
      },
      {
        name: 'Banking services',
        category: GOODS_CATEGORIES.SERVICES,
        on: !0,
        desc: 'Letters of credit',
      },
      {
        name: 'Advanced legal expertise',
        category: GOODS_CATEGORIES.SERVICES,
        on: !0,
        desc: 'Specialized law',
      },
      {
        name: 'Rare materials',
        category: GOODS_CATEGORIES.LUXURY,
        on: !0,
        desc: 'Exotic goods',
      },
    ],
    fromHinterland: [
      {
        name: 'Food surplus',
        category: GOODS_CATEGORIES.AGRICULTURAL,
        on: !0,
        desc: 'Agricultural hinterland',
      },
      {
        name: 'Raw wool and hides',
        category: GOODS_CATEGORIES.RAW_MATERIALS,
        on: !0,
        desc: 'For processing',
      },
      {
        name: 'Timber',
        category: GOODS_CATEGORIES.RAW_MATERIALS,
        on: !0,
        desc: 'Construction material',
      },
    ],
  },
  city: {
    fromMetropolis: [
      {
        name: 'International banking',
        category: GOODS_CATEGORIES.SERVICES,
        on: !0,
        desc: 'Global connections',
      },
      {
        name: 'Highest luxury goods',
        category: GOODS_CATEGORIES.LUXURY,
        on: !0,
        desc: 'Rarities and masterworks',
      },
      {
        name: 'Political legitimacy',
        category: GOODS_CATEGORIES.SERVICES,
        on: !0,
        desc: 'Royal/imperial connections',
      },
    ],
    fromHinterland: [
      {
        name: 'Bulk food',
        category: GOODS_CATEGORIES.AGRICULTURAL,
        on: !0,
        desc: 'Massive agricultural needs',
      },
      {
        name: 'Raw materials',
        category: GOODS_CATEGORIES.RAW_MATERIALS,
        on: !0,
        desc: 'Ore, timber, wool',
      },
      {
        name: 'Basic goods for resale',
        category: GOODS_CATEGORIES.MANUFACTURED,
        on: !0,
        desc: 'Market redistribution',
      },
    ],
  },
  metropolis: {
    basic: [
      {
        name: 'Massive food requirements',
        category: GOODS_CATEGORIES.AGRICULTURAL,
        on: !0,
        desc: 'Regional network',
      },
      {
        name: 'Raw materials',
        category: GOODS_CATEGORIES.RAW_MATERIALS,
        on: !0,
        desc: 'Entire regional supply',
      },
      {
        name: 'Luxury imports',
        category: GOODS_CATEGORIES.LUXURY,
        on: !0,
        desc: 'From distant lands',
      },
    ],
  },
};

// getUpgradeChain — exported for the focused unit tests (tier-connectivity pool
// selection); production callers go through generateTradeIncomeStreams.
export const getUpgradeChain = (tier, route, isFromHigher = false, goodsToggles = {}) => {
  // Isolated settlements have no trade access — no upgrade goods come in from outside
  if (route === 'isolated') return [];
  const tierData = UPGRADE_GOODS_BY_TIER[tier] || {};
  const result = [];
  // Pool selection is driven by tier-CONNECTIVITY (isFromHigher: the settlement
  // is connected to a higher-tier trading partner), NOT by the route category.
  // `route` here is a route type (road/river/crossroads/port/isolated) and can
  // never equal a tier name — the old `route === 'city' || route === 'metropolis'`
  // guards made the fromCityOrMetropolis/fromMetropolis pools unreachable, so
  // fromHinterland always shadowed them for town/city. The higher-tier pools are
  // tested BEFORE fromHinterland so a real higher-tier connection selects them.
  let source = 'basic';
  if (isFromHigher && tierData.fromHigher) source = 'fromHigher';
  else if (isFromHigher && tierData.fromCityOrMetropolis) source = 'fromCityOrMetropolis';
  else if (isFromHigher && tierData.fromMetropolis) source = 'fromMetropolis';
  else if (tierData.fromHinterland) source = 'fromHinterland';
  (tierData[source] || []).forEach((item) => {
    const toggleKey = `${tier}_import_${item.name}`;
    const isService =
      item.category === 'services' ||
      item.category === 'SERVICES' ||
      (item.category?.key || item.category) === 'services';
    if (!isService && (goodsToggles[toggleKey] !== undefined ? goodsToggles[toggleKey] : item.on))
      result.push(item.name);
  });
  return result;
};

// HISTORY_EVENTS
export const getUpgradeOpportunities = (institutions, tier, config = {}) => {
  const tierIndex = TIER_ORDER.indexOf(tier);
  const result = [];
  Object.entries(HISTORY_EVENTS).forEach(([category, roles]) => {
    roles.forEach((role) => {
      if (tierIndex < TIER_ORDER.indexOf(role.minTier)) return;
      if (role.requiresGuild && !institutions.some((i) => i.tags?.includes('guild'))) return;
      // Keyword gate: at least one institution name must contain one of the keywords
      if (
        role.requiresInstKeyword &&
        !institutions.some((i) => role.requiresInstKeyword.some((kw) => (i.name || '').toLowerCase().includes(kw)))
      )
        return;
      if (role.requiresPort) {
        const waterRoute = ['port', 'river', 'coastal'].includes(config?.tradeRouteAccess);
        const hasWaterInst = institutions.some(
          (i) =>
            i.tags?.includes('port') ||
            // id-first (rename-proof) for stamped institutions; byte-identical to the
            // former name.includes(kw) since institutionMatchesKeyword's id-set is
            // built from that exact predicate (unstamped custom insts fall back to it).
            institutionMatchesKeyword(i, 'port') ||
            institutionMatchesKeyword(i, 'harbour') ||
            institutionMatchesKeyword(i, 'harbor') ||
            (institutionMatchesKeyword(i, 'dock') && waterRoute)
        );
        if (!waterRoute && !hasWaterInst) return;
      }
      if (
        category === 'other' ||
        // Dual-axis match (see src/data/categoryVocabulary.js): a faction role
        // matches an institution by EITHER its semantic priorityCategory OR its
        // grouping (category). Both clauses are load-bearing — e.g. the
        // 'religious' role is carried by the grouping while 'military' is carried
        // by priorityCategory — so neither can be dropped without silently
        // losing matches. categoryGovernance.test.js pins that every role stays
        // matchable through one of the two axes.
        institutions.some((i) => i.priorityCategory === category || i.category?.toLowerCase() === category)
      )
        result.push({ ...role, category });
    });
  });
  result.forEach((role) => {
    role.effectivePriority = role.priority * (config?.[role.category] ?? 1);
  });
  return result.sort((a, b) => b.effectivePriority - a.effectivePriority);
};

// ─────────────────────────────────────────────────────────

// ── Finished goods demand-gap computation ────────────────────────────────────
// Computes the gap between what military/religious/maritime/luxury/alchemical
// institutions consume and what local supply chains produce.
// Pushes import labels when demand exceeds supply; export bonus when surplus.
// Builds on top of TRADE_DEPENDENCY_NEEDS (raw resources) without replacing it.
function computeFinishedGoodsDemand(tier, tradeRoute, institutions, nearbyResources, chainExports, chainImports) {
  // Uses the imported canonical TIER_ORDER (constants.js) — no local copy.
  const tierIdx = TIER_ORDER.indexOf(tier);
  const instNames = (institutions || []).map((i) => (i.name || '').toLowerCase());
  const resKeys = nearbyResources || [];

  const hasRes = (key) => resKeys.some((r) => r === key || r.includes(key));
  const alreadyImporting = (label) => chainImports.some((i) => i.toLowerCase().includes(label.toLowerCase()));
  const alreadyExporting = (label) => chainExports.some((e) => e.toLowerCase().includes(label.toLowerCase()));

  const presentInst = new Set(instNames);

  // Longest-match-wins per institution: each present institution name contributes
  // ONLY the value of the single longest keyword it contains, so overlapping
  // substring keys (e.g. 'parish church' ⊂ 'parish churches (2-5)', or
  // 'specialized metal' ⊂ 'specialized metalworkers') no longer double-count a
  // single institution. Different institutions still sum additively.
  const sumLongestMatch = (entries) => {
    let total = 0;
    for (const name of instNames) {
      let best = null;
      for (const [keyword, value] of entries) {
        const kw = keyword.toLowerCase();
        if (name.includes(kw) && (best === null || kw.length > best.kw.length)) best = { kw, value };
      }
      if (best) total += best.value;
    }
    return total;
  };

  for (const [category, cfg] of Object.entries(INSTITUTION_FINISHED_GOODS_DEMAND)) {
    // Tier gate
    const minTierIdx = TIER_ORDER.indexOf(cfg.minTier || 'thorp');
    if (tierIdx < minTierIdx) continue;

    // Route gate (maritime only fires on water routes)
    if (cfg.routeRequired && !cfg.routeRequired.includes(tradeRoute)) continue;

    // ── Compute total demand from present consumer institutions ────────────
    const totalDemand = sumLongestMatch(
      Object.entries(cfg.consumers).map(([keyword, { demand }]) => [keyword, demand])
    );

    // §14 — local supply the user's PRESENT custom content contributes to this
    // demand category (a good/institution declaring `satisfies: <category>`).
    // Shrinks the import gap (e.g. an institution needing arms buys local
    // Dragonbone Greatswords); named goods export once local demand is covered.
    // Empty + inert when the user has no satisfying custom content, so existing
    // generations stay byte-identical.
    const customSupply = _customDeps.finishedGoodsSupply?.(category, presentInst) || { supply: 0, goods: [] };

    if (totalDemand === 0 && customSupply.goods.length === 0) continue; // nothing to resolve

    // ── Compute local supply from present supplier institutions/resources ──
    let totalSupply = customSupply.supply;
    // Resource-key suppliers (e.g. 'managed_forest', 'magical_node') match the
    // separate nearbyResources namespace and sum directly.
    const instSupplierEntries = [];
    for (const [keyword, { supply }] of Object.entries(cfg.suppliers)) {
      if (keyword.includes('_')) {
        if (hasRes(keyword)) totalSupply += supply;
      } else {
        instSupplierEntries.push([keyword, supply]);
      }
    }
    // Institution-key suppliers use longest-match-wins so overlapping variants
    // (e.g. 'specialized metal' ⊂ 'specialized metalworkers') don't double-count.
    totalSupply += sumLongestMatch(instSupplierEntries);

    const gap = totalDemand - totalSupply;

    // ── Import: demand exceeds local supply ───────────────────────────────
    if (gap > 0 && cfg.importLabels?.length) {
      // Scale label to gap magnitude
      const labelIdx = gap <= 2 ? 0 : gap <= 4 ? 1 : 2;
      const label = cfg.importLabels[Math.min(labelIdx, cfg.importLabels.length - 1)];
      if (label && !alreadyImporting(label.split(' ')[0])) {
        chainImports.push(label);
      }
    }

    // §14 — local custom production meets/exceeds demand → export the surplus
    // specialty goods (e.g. Dragonbone Greatswords) by name.
    if (gap <= 0 && customSupply.goods.length) {
      for (const g of customSupply.goods) {
        if (!alreadyExporting(g)) chainExports.push(g);
      }
    }

    // ── Export bonus: supply substantially exceeds demand ─────────────────
    if (gap < -2 && cfg.exportBonus && !alreadyExporting(cfg.exportBonus)) {
      chainExports.push(cfg.exportBonus);
    }
  }
}

// ── generateEconomicState sub-stages ─────────────────────────────────────────
// The helpers below are the decomposed stages of `generateEconomicState`. They
// preserve the original evaluation order, RNG draw order, and array-mutation
// side effects exactly — each is a verbatim lift of the corresponding block,
// taking the locals it reads as parameters and mutating the same arrays.

// Stage 1: civic income sources — taxes, levies, and institutional fees keyed off
// tier, present institutions, trade-route state, and priority/stress flags.
// Pushes every applicable source into `incomeBuild` in original order. The
// trade-state flags are computed mid-stage (after the agricultural-rents push,
// before market taxes) so they are derived here and returned for the caller.
function buildCivicIncomeSources(
  incomeBuild,
  { tier, institutions, tradeRoute, config, hasInst, ecoPriorities, ecoInstFlags, ecoStressFlags }
) {
  ['thorp', 'hamlet', 'village'].includes(tier)
    ? incomeBuild.push({
        source: 'Agricultural Rents',
        percentage: 65,
        desc: 'Payments in kind or coin from tenant farmers; the primary revenue at this scale.',
      })
    : tier === 'town' &&
      !hasInst('market square', 'weekly market', 'daily market') &&
      incomeBuild.push({
        source: 'Agricultural Rents',
        percentage: 30,
        desc: 'Rural hinterland rents remain significant without large market infrastructure.',
      });
  // Trade-state flags for an isolated settlement (no external trade route):
  //   isIsolated   — tradeRoute is 'isolated'
  //   magicalTrade — isolated BUT has teleportation infrastructure, so a magical
  //                  trade channel substitutes for physical routes
  //   trueIsolated — isolated with NO magical channel (gates out market/guild/toll income)
  //   magicalTradeMultiplier — magical trade runs at 40% of physical-route volume
  const isIsolated = tradeRoute === 'isolated';
  const magicalTrade = isIsolated && hasTeleportationInfra(institutions, config);
  const trueIsolated = isIsolated && !magicalTrade;
  const magicalTradeMultiplier = magicalTrade ? 0.4 : 1;
  // Subsistence gate: isolated thorp/hamlet/village produce for themselves only
  const SUBSISTENCE_TIERS_ECO = ['thorp', 'hamlet', 'village'];
  const isSubsistenceOnly = isIsolated && SUBSISTENCE_TIERS_ECO.includes(tier) && !magicalTrade;
  // Market taxes — at most one source, by the largest market present (the source
  // label + percentage scale ×magicalTradeMultiplier when trade is magical).
  if (!trueIsolated && hasInst('district market', 'multiple market')) {
    incomeBuild.push({
      source: magicalTrade ? 'Magical Trade Revenue' : 'Market Taxes',
      percentage: Math.round(45 * magicalTradeMultiplier),
      desc: 'District-level duties on specialized goods; primary civic revenue at metropolis scale.',
    });
  } else if (!trueIsolated && hasInst('daily market')) {
    incomeBuild.push({
      source: magicalTrade ? 'Magical Trade Revenue' : 'Market Taxes',
      percentage: Math.round(35 * magicalTradeMultiplier),
      desc: magicalTrade
        ? 'Trade flowing through teleportation channels generates modest fees and arcane duties.'
        : 'Daily market tolls, stall fees, and weights-and-measures inspections.',
    });
  } else if (!trueIsolated && hasInst('market square', 'weekly market', 'annual fair')) {
    incomeBuild.push({
      source: magicalTrade ? 'Magical Trade Revenue' : 'Market Taxes',
      percentage: Math.round(22 * magicalTradeMultiplier),
      desc: magicalTrade
        ? 'Magical trade conduits generate modest fees and arcane duties on transported goods.'
        : 'Market day stall fees and toll collection on goods entering the market.',
    });
  }

  // Guild revenue — licensing for chartered guilds, else basic fees.
  if (!trueIsolated && hasInst('craft guilds (100', 'merchant guilds (50')) {
    incomeBuild.push({
      source: 'Guild Licensing',
      percentage: 28,
      desc: 'Charter fees, quality inspection levies, and licensing of all trades and crafts.',
    });
  } else if (!trueIsolated && hasInst('guild')) {
    incomeBuild.push({
      source: 'Guild Fees',
      percentage: 18,
      desc: 'Annual licensing fees and fines levied by guild oversight.',
    });
  }

  // Port/river duties. Port Duties keys on port institutions the catalog actually
  // generates: 'Docks/port facilities', "Harbour master's office", 'Shipyard'.
  // 'docks/port' (not bare 'dock') so 'Airship docking' never reads as a harbour;
  // 'shipyard' must not match 'River boatyard'.
  if (hasInst('docks/port', 'harbour master', 'shipyard') && tradeRoute === 'port') {
    incomeBuild.push({
      source: 'Port Duties',
      percentage: 35,
      desc: 'Import and export taxes, anchorage fees, and customs inspection on all cargo.',
    });
  } else if (hasInst('docks/port', 'port facilit') && tradeRoute === 'river') {
    incomeBuild.push({
      source: 'River Tolls',
      percentage: 20,
      desc: 'Tolls on river traffic, dock fees, and ferry rights.',
    });
  }

  // Banking revenue.
  if (hasInst('banking district', 'stock exchange')) {
    incomeBuild.push({
      source: 'Financial Services',
      percentage: 22,
      desc: 'Civic taxes on banking operations, letters of credit, and financial transaction fees.',
    });
  } else if (hasInst('banking house', 'money changer')) {
    incomeBuild.push({
      source: 'Banking Fees',
      percentage: 14,
      desc: 'Interest income, currency exchange commissions, and safe deposit charges.',
    });
  }

  // Property rents — civic-owned buildings, for tiers with trade-route features.
  if (getTradeRouteFeatures(tier)) {
    const propertyRentPct = tier === 'metropolis' ? 18 : tier === 'city' ? 14 : 10;
    incomeBuild.push({
      source: 'Property Rents',
      percentage: propertyRentPct,
      desc: 'Ground rents on civic-owned buildings, stalls, and residential plots within the walls.',
    });
  }
  // Court fees — any judicial institution.
  if (hasInst('courthouse', 'multiple court', 'city hall')) {
    incomeBuild.push({
      source: 'Court Fees & Fines',
      percentage: 10,
      desc: 'Filing fees, fines levied on offenders, and fees for notarial and legal certification services.',
    });
  }

  // Road/bridge tolls — by trade-route position.
  if (!trueIsolated && tradeRoute === 'crossroads') {
    incomeBuild.push({
      source: 'Toll Revenue',
      percentage: 20,
      desc: 'Passage tolls on all roads and bridges serving the crossroads position.',
    });
  } else if (!trueIsolated && tradeRoute === 'road' && hasInst('gate', 'town wall', 'city wall')) {
    incomeBuild.push({
      source: 'Gate Tolls',
      percentage: 10,
      desc: 'Entry and exit tolls collected at the town gates from merchants and travellers.',
    });
  }

  // Garrison levy — a military-priority settlement with a garrison; an extractive
  // (state-crime) regime confiscates rather than taxes.
  if (hasInst('garrison', 'multiple garrison', 'professional guard') && ecoPriorities.military > 55) {
    incomeBuild.push(
      ecoStressFlags.stateCrime
        ? {
            source: 'Military Extraction',
            percentage: 20,
            desc: 'Forced contributions and confiscations collected by the garrison, not formally a tax.',
          }
        : {
            source: 'Military Levy',
            percentage: 12,
            desc: 'Emergency and standing levies on the population to fund garrison upkeep.',
          }
    );
  }
  const hasReligiousInstitution = institutions.some((inst) => {
    const instName = (inst.name || '').toLowerCase();
    return (
      (instName.includes('parish church') ||
        instName.includes('cathedral') ||
        instName.includes('monastery') ||
        instName.includes('friary') ||
        instName.includes('temple') ||
        instName.includes('graveyard')) &&
      !instName.startsWith('access to')
    );
  });
  // Church income — a theocratic economy adds church rents on top of tithes.
  if (ecoInstFlags.religionInfluence > 55 && hasReligiousInstitution) {
    if (ecoStressFlags.theocraticEconomy) {
      incomeBuild.push({
        source: 'Church Tithes & Rents',
        percentage: Math.round(ecoInstFlags.religionInfluence / 4),
        desc: 'Mandatory tithes plus rent income from church-owned land dominating the local economy.',
      });
    } else {
      incomeBuild.push({
        source: 'Church Tithes',
        percentage: Math.round(ecoInstFlags.religionInfluence / 5),
        desc: 'Tithes, offerings, and fees for burial and sacramental services collected by resident clergy.',
      });
    }
  }
  // Pilgrim trade — a strongly religious settlement on a travelled route.
  if (
    ecoInstFlags.religionInfluence > 68 &&
    hasReligiousInstitution &&
    (tradeRoute === 'crossroads' || tradeRoute === 'road')
  ) {
    incomeBuild.push({
      source: 'Pilgrim Trade',
      percentage: Math.round(ecoInstFlags.religionInfluence / 9),
      desc: 'Offerings, hospitality fees, relic sales, and incidental commerce from visiting pilgrims.',
    });
  }

  // ── Three-tier magic economy ──────────────────────────────────────────────
  // Tier thresholds scale with settlement size — small settlements need higher
  // magic density to support commercial arcane activity
  const magPri = ecoInstFlags.magicInfluence; // priorityMagic value (0-100)
  const hasAlch = hasInst('alchemist', 'herbalist', 'apothecary', 'hedge wizard');
  const hasSpell = hasInst('wizard', 'mage', 'spellcasting', 'arcane');
  const hasMagesGuild = hasInst(
    "mages' guild",
    "mages' district",
    'arcane academy',
    'academy of magic',
    "wizard's tower",
    'magical academy'
  );
  // Uses the imported canonical TIER_ORDER (constants.js) — no local copy.
  const tierIdx = TIER_ORDER.indexOf(tier);

  if (magPri > 0) {
    // LOW: apothecary / hedge magic — alchemists, herbalists, hedge wizards
    // Available from village+ when any alchemical institution present
    if (magPri >= 15 && hasAlch && tierIdx >= 2) {
      const pct = Math.round(Math.max(4, magPri / 14));
      incomeBuild.push({
        source: magPri < 35 ? 'Herbalist & Apothecary' : 'Apothecary & Alchemy',
        percentage: pct,
        desc:
          magPri < 35
            ? 'Herbal remedies, minor alchemical preparations, and potion sales. The local alchemist supplements conventional trade.'
            : 'A thriving alchemical trade in reagents, preparations, and curative potions draws customers from surrounding settlements.',
      });
    }

    // MEDIUM: commercial spellcasting — identification, divination, minor enchanting
    // Available from town+ when spellcasting institutions present
    if (magPri >= 35 && hasSpell && tierIdx >= 3) {
      const pct = Math.round(Math.max(6, magPri / 10));
      incomeBuild.push({
        source: 'Spellcasting Services',
        percentage: pct,
        desc:
          magPri < 60
            ? 'Fees for identification, minor enchanting, and divination. Adventurers and merchants both pay well for reliable magical services.'
            : 'A busy market for spell services: identification, augury, message sending, and contract-grade enchanting brings steady coin.',
      });
    }

    // HIGH: arcane industry — enchanting contracts, research, magical item market
    // Available from city+ when mages' guild or academy present
    if (magPri >= 65 && hasMagesGuild && tierIdx >= 4) {
      const pct = Math.round(Math.max(10, magPri / 7));
      incomeBuild.push({
        source: ecoStressFlags.magicFillsVoid ? 'Arcane Economy' : 'Arcane Industry',
        percentage: pct,
        desc: ecoStressFlags.magicFillsVoid
          ? 'Magic has absorbed functions normally provided by conventional trade, government, and religion. Arcane licences, guild dues, and service fees constitute the primary revenue base.'
          : "Enchanting contracts, magical research commissions, and the licensing of spellcasting practitioners. The mages' guild contributes meaningfully to civic revenue.",
      });
      // Bonus: enchanting multiplier boosts metalwork/crafts income when present
      // (represented as a cross-chain enhancement note in the existing income entries)
      if (magPri >= 75 && (hasInst('armourer') || hasInst('weaponsmith') || hasInst('jewel'))) {
        incomeBuild.push({
          source: 'Enchanted Goods Premium',
          percentage: Math.round(magPri / 18),
          desc: 'Weapons, armour, and jewellery command a premium once enchanted. The local arcanists increase the margin on craft exports.',
        });
      }
    }
  }
  return { isSubsistenceOnly };
}

// Stage 2: trade-derived and criminal income — folds the trade-income-stream
// bonuses into `incomeBuild`, then layers a merchant-army security surcharge, a
// unified criminal-economy entry (when black-market capture is significant), and
// a subsistence fallback if nothing else produced any income. Mutates
// `incomeBuild` in original order.
function appendTradeAndCriminalIncome(incomeBuild, { v, ecoStressFlags, safetyProfile }) {
  // `tradeBonuses` is assigned then immediately consumed inside this expression.
  var tradeBonuses;
  ((tradeBonuses = v.incomeBonuses) == null || tradeBonuses.forEach((bonus) => incomeBuild.push(bonus)),
    ecoStressFlags.merchantArmy &&
      incomeBuild.push({
        source: 'Security Contracts',
        percentage: 12,
        desc: 'Guild-funded private security surcharges, effectively a privatised protection tax on trade.',
      }),
    safetyProfile.blackMarketCapture > 10 &&
      (() => {
        // Unified criminal economy income — uses raw bmc as weight so normalized % matches Shadow Economy section
        const bmc = safetyProfile.blackMarketCapture;
        const crimInsts = safetyProfile.criminalInstitutions || [];
        const hasGuild = crimInsts.some(
          (i) =>
            i.toLowerCase().includes('guild') ||
            i.toLowerCase().includes('thieves') ||
            i.toLowerCase().includes('organized crime')
        );
        const hasMarket = crimInsts.some(
          (i) => i.toLowerCase().includes('black market') || i.toLowerCase().includes('underground')
        );
        const hasSmuggling = crimInsts.some(
          (i) => i.toLowerCase().includes('smuggl') || i.toLowerCase().includes('front')
        );
        const label =
          hasGuild && hasMarket
            ? 'Criminal Syndicate Revenue'
            : hasGuild
              ? 'Organized Crime Revenue'
              : hasSmuggling
                ? 'Smuggling Network Revenue'
                : bmc >= 20
                  ? 'Shadow Economy (untaxed)'
                  : 'Black Market Revenue';
        const desc = `An estimated ${bmc}% of economic activity flows through unofficial channels: ${
          hasGuild
            ? 'guild-organised fencing, extortion, and black market trade'
            : hasSmuggling
              ? 'smuggling margins, contraband networks, and protection rackets'
              : 'untaxed trade, fencing, and criminal margins'
        }. This income stays in the settlement but flows to criminal actors, not the public treasury.`;
        incomeBuild.push({ source: label, percentage: bmc, desc, isCriminal: true });
      })(),
    incomeBuild.length === 0 &&
      incomeBuild.push({
        source: 'Subsistence Production',
        percentage: 100,
        desc: 'Barter and in-kind exchange; no significant monetary income. Survival is the economy.',
      }));
}

// Stage 3b: income normalization — weights each source by the economy-output
// multiplier, normalizes to percentages summing toward 100, and patches any
// rounding residual onto the largest source.
// NOTE: incomeMultiplier is applied uniformly to every entry, so it cancels
// out in the (weight / incomeTotalWeight) ratio and does NOT affect the
// normalized `percentage`. It only scales the `weight` field that ships in
// `incomeSources`; left intact to preserve that output value byte-for-byte.
function normalizeIncomeSources(incomeBuild, ecoInstFlags) {
  const incomeMultiplier = priorityToMultiplier(ecoInstFlags.economyOutput);
  const incomeWeighted = incomeBuild.map((ee) => ({ ...ee, weight: ee.percentage * incomeMultiplier }));
  const incomeTotalWeight = incomeWeighted.reduce((sum, e) => sum + e.weight, 0) || 1;
  const incomeNormalized = incomeWeighted.map((ee) => ({
    ...ee,
    percentage: Math.round((ee.weight / incomeTotalWeight) * 100),
    priorityNote: null,
  }));
  // (legacy alias block removed)
  const D = incomeNormalized.reduce((ee, E) => ee + E.percentage, 0);
  if (incomeNormalized.length > 0 && D !== 100) {
    const ee = incomeNormalized.reduce((E, _, O) => (_.percentage > incomeNormalized[E].percentage ? O : E), 0);
    incomeNormalized[ee].percentage += 100 - D;
  }
  return incomeNormalized;
}

// Stage 4a: necessity imports — starts from the trade-stream necessity list and
// adds siege/famine/plague staples that the settlement must source externally.
function buildNecessityImports(v, W) {
  let U = [...(v.necessityImports || [])];
  ((W.includes('under_siege') || W.includes('famine')) &&
    (U.includes('Grain') || U.push('Grain'), U.includes('Salt') || U.push('Salt')),
    W.includes('under_siege') && (U.includes('Iron') || U.push('Iron (weapons)')),
    W.includes('plague_onset') && (U.includes('Medicinal herbs') || U.push('Medicinal herbs')));
  return U;
}

// Stage 4b: initial export/import trade lists — derives the heuristic export
// list (`re`, siege/occupation/transit-aware), the deduped import list (`q`),
// and the entrepot/transit passthroughs (`P`, `I`); then applies goods-toggle
// force/disallow overrides to `re` and `v.localProduction`.
function buildInitialTradeLists({ v, config, tradeRoute, goodsToggles, U, W }) {
  const re = W.includes('under_siege')
      ? config.tradeRouteAccess === 'port'
        ? v.exports.slice(0, 3).map((ee) => `${ee} (naval route only)`)
        : []
      : W.includes('occupied')
        ? v.exports.slice(0, 5).map((ee) => `${ee} (taxed by occupation)`)
        : [
            ...(['crossroads', 'port', 'river'].includes(tradeRoute)
              ? (v.transit || []).map((ee) => `${ee} (transit)`)
              : []),
          ],
    ie = v.imports.slice(0, 8),
    q = [...U.map((ee) => ee).filter((ee) => !ie.some((E) => E.toLowerCase().includes(ee.toLowerCase()))), ...ie].slice(
      0,
      10
    );
  const P = v.isEntrepot;
  const I = v.transit;
  if (goodsToggles && Object.keys(goodsToggles).length > 0) {
    const ee = /_good_(.+)$/;
    Object.entries(goodsToggles).forEach(function (E) {
      const _ = E[0],
        O = E[1],
        F = _.match(ee);
      if (!F) return;
      const X = F[1];
      if (O.force)
        (re.some(function (K) {
          return K.toLowerCase().includes(X.toLowerCase());
        }) || re.push(X),
          v.localProduction &&
            !v.localProduction.some(function (K) {
              return K.toLowerCase().includes(X.toLowerCase());
            }) &&
            v.localProduction.push(X));
      else if (O.allow === !1) {
        for (let K = re.length - 1; K >= 0; K--) re[K].toLowerCase().includes(X.toLowerCase()) && re.splice(K, 1);
        if (v.localProduction)
          for (let K = v.localProduction.length - 1; K >= 0; K--)
            v.localProduction[K].toLowerCase().includes(X.toLowerCase()) && v.localProduction.splice(K, 1);
      }
    });
  }
  return { re, q, P, I };
}

// Stage 6: trade-dependency derivation — for each institution with a catalogued
// resource need that isn't satisfied locally, push a dependency record (with
// siege/isolation-aware severity and impact text) into `H`.
function deriveTradeDependencies(H, { config, institutions, tradeRoute }) {
  const nearbyResourcesArr = config.nearbyResources || [];
  const hasResource = (V) => nearbyResourcesArr.some((de) => V.some((fe) => de.includes(fe)));
  const stressArr = config.stressTypes || [];
  const intendedStressArr = config.intendedStressTypes || [];
  const isUnderStress =
    stressArr.includes('under_siege') ||
    intendedStressArr.includes('under_siege') ||
    (institutions || []).some(function (V) {
      const de = (V.name || '').toLowerCase();
      return de.includes('war council') || de.includes('siege') || de.includes('rationing');
    });
  const isIsolatedRoute = tradeRoute === 'isolated';
  // Teleportation infrastructure counts as trade access — don't treat as stockpile-only
  const _hasMagicTradeForDeps = hasTeleportationInfra(institutions || [], config);
  const isEffectivelyIsolated = isIsolatedRoute && !_hasMagicTradeForDeps;
  (institutions || []).forEach(function (V) {
    const de = V.name || '',
      fe = TRADE_DEPENDENCY_NEEDS[de];
    if (
      !fe ||
      hasResource(fe.resources) ||
      H.some(function (dt) {
        return dt.institution === de && dt.resource === fe.label;
      })
    )
      return;
    const ge = isUnderStress || isEffectivelyIsolated ? 'critical' : 'vulnerable',
      ke = isUnderStress
        ? 'Supply route severed. Operating at minimal capacity or shut down.'
        : isEffectivelyIsolated
          ? 'No trade access. Running on existing stockpiles only.'
          : _hasMagicTradeForDeps && isIsolatedRoute
            ? 'Supplied via magical trade infrastructure: teleportation imports replace road access.'
            : 'Dependent on trade routes. Siege, road closure, or blockade would impair operations.';
    H.push({
      institution: de,
      category: V.category || '',
      resource: fe.label,
      detail: fe.detail,
      severity: ge,
      impact: ke,
      affectedServices: fe.svcs || [],
    });
  });
}

// Stage 7: chain-derived trade artifacts — runs the supply-chain pipeline to
// derive chain exports/imports/local-production, layers depleted-resource imports
// and finished-goods demand gaps, then overrides the heuristic `re`/`q` lists
// (and folds in service exports). Returns the chain artifacts the caller needs
// for later stages and final assembly.
function deriveChainTradeArtifacts({ tier, tradeRoute, institutions, config, goodsToggles, H, U, re, q, stage5Trade }) {
  const depletedResources = config.nearbyResourcesDepleted || [];
  const activeChainsList = computeActiveChains(
    institutions || [],
    config.nearbyResources || [],
    tier,
    tradeRoute,
    H,
    depletedResources,
    // Effective magic dial: a dead-magic world is 0 regardless of the slider
    // (mirrors magicLedger) — gates druid/divine/arcane/alchemy substitution.
    config.magicExists === false ? 0 : (config.priorityMagic ?? 50)
  );
  const chainStresses = (config.stressTypes || []).concat(config.intendedStressTypes || []);
  const chainExports = deriveExportsFromChains(
    activeChainsList,
    config.nearbyResources || [],
    tier,
    tradeRoute,
    chainStresses,
    goodsToggles,
    depletedResources,
    institutions || []
  );
  const _hasMagicTrade = hasTeleportationInfra(institutions || [], config);
  const chainImports = deriveImportsFromChains(
    activeChainsList,
    config.nearbyResources || [],
    tier,
    tradeRoute,
    U,
    _hasMagicTrade
  );
  const chainLocalProd = deriveLocalProductionFromChains(activeChainsList, config.nearbyResources || []);
  const instServices = deriveInstitutionalServices(institutions || []);
  const serviceExports = deriveServiceExports(instServices);

  // Depleted resources at town+ scale: settlement needs to import what it can no longer
  // produce in sufficient quantity — local exhaustion triggers trade dependency
  const TIER_DEPLETED_IMPORT_THRESHOLD = ['town', 'city', 'metropolis'];
  if (depletedResources.length > 0 && TIER_DEPLETED_IMPORT_THRESHOLD.includes(tier)) {
    const DEPLETED_IMPORT_MAP = {
      grain_fields: 'Bulk grain (local fields depleted)',
      iron_deposits: 'Iron ore (local mines exhausted)',
      managed_forest: 'Timber (local forests cleared)',
      grazing_land: 'Livestock and dairy (pastures depleted)',
      river_fish: 'Salted fish (local waters over-fished)',
      fishing_grounds: 'Salted fish (fishing grounds exhausted)',
      coal_deposits: 'Coal and fuel (local seams exhausted)',
      stone_quarry: 'Dressed stone (local quarry depleted)',
      clay_pits: 'Clay and ceramics materials (pits exhausted)',
    };
    depletedResources.forEach((res) => {
      const importLabel = DEPLETED_IMPORT_MAP[res];
      if (importLabel) chainImports.push(importLabel);
    });
  }

  // ── Finished goods demand-gap imports/exports ─────────────────────────────
  // Computes supply/demand gaps for finished goods (arms, ritual supplies, etc.)
  // and pushes results into chainImports / chainExports before final assembly.
  computeFinishedGoodsDemand(tier, tradeRoute, institutions, config.nearbyResources || [], chainExports, chainImports);

  // Override heuristic arrays with chain-derived values (clean mutation — before return)
  re.length = 0;
  chainExports.forEach((e) => re.push(e));
  serviceExports.forEach((e) => {
    if (!re.includes(e)) re.push(e);
  });
  q.length = 0;
  chainImports.forEach((i) => q.push(i));
  // Re-seat Stage 5's military/slave-trade exports (and the paired enslaved-
  // labour import): the chain pipeline doesn't model them, so the override
  // above would otherwise discard legitimately-produced entries. The Stage 5
  // RNG draw has already fired by this point — nothing here touches the
  // stream. Dedup mirrors Stage 5's own keyword guards so a chain/service
  // export that already covers the ground wins.
  const _stage5Exports = stage5Trade?.pushedExports || [];
  const _stage5Imports = stage5Trade?.pushedImports || [];
  _stage5Exports.forEach((e) => {
    const eLow = e.toLowerCase();
    const isMilitaryEntry = eLow.includes('military') || eLow.includes('mercenary');
    const covered = re.some((g) => {
      const gLow = g.toLowerCase();
      return isMilitaryEntry
        ? gLow.includes('military') || gLow.includes('mercenary')
        : gLow.includes('slave');
    });
    if (!covered) re.push(e);
  });
  _stage5Imports.forEach((i) => {
    if (!q.some((g) => g.toLowerCase().includes('slave'))) q.push(i);
  });

  return { activeChainsList, chainLocalProd, instServices };
}

// Stage 8: neighbour economic bias — reshape the export list `re` per the
// configured relationship mode (suppress caps variety, complement removes
// competing goods, dependent ensures a patron-needed good, compete is a no-op).
function applyNeighbourEconBias(re, { config, isSubsistenceIsolated }) {
  // ── Neighbour economic bias post-processing ──────────────────────────────
  // Apply competition/complementarity effects based on relationship type.
  // 'compete' mode: boost chance of same exports as neighbour (we fight for same market)
  // 'complement' mode: de-emphasise goods the neighbour already exports (we specialize elsewhere)
  // 'suppress' mode: hostile trade embargo reduces export variety
  // 'dependent' mode: prioritize goods the neighbour needs (patron/client)
  const _econBias = config._neighbourEconBias || {};
  const _econMode = config._neighbourEconMode || 'independent';
  if (Object.keys(_econBias).length > 0 && !isSubsistenceIsolated) {
    // Apply weights: filter or reorder exports based on bias
    if (_econMode === 'suppress') {
      // Hostile embargo: the cap-to-4 runs AFTER Stage 9 subsumption (see the caller),
      // so it limits DISTINCT export goods, not raw pre-dedup entries. Capping raw
      // entries HERE could drop a distinct good (position 5+) while keeping a
      // near-duplicate ("Grain" + "Bulk grain and foodstuffs") that later collapses —
      // yielding a smaller, differently-composed embargo set than "top 4 goods".
    } else if (_econMode === 'complement') {
      // Trade partner/allied: remove exports that compete with neighbour's exports
      const biasKeys = Object.keys(_econBias);
      for (let _bi = re.length - 1; _bi >= 0; _bi--) {
        const good = re[_bi].toLowerCase();
        for (const bk of biasKeys) {
          if (_econBias[bk] < 0.8 && good.includes(bk.toLowerCase())) {
            re.splice(_bi, 1);
            break;
          }
        }
      }
    } else if (_econMode === 'compete') {
      // Rival/cold war: no removal — rivals compete in same space (handled at inst level)
    } else if (_econMode === 'dependent') {
      // Patron/client: ensure we export something the patron needs
      for (const [bk, weight] of Object.entries(_econBias)) {
        if (weight > 1.3 && !re.some((g) => g.toLowerCase().includes(bk.toLowerCase()))) {
          // Add patron-needed good if we don't already export it
          if (re.length < 8) re.push(bk.charAt(0).toUpperCase() + bk.slice(1));
        }
      }
    }
  }
}

// Stage 9: trade-goods subsumption — collapse the import, export, and local-
// production lists each to one entry per canonical good, then drop exports the
// settlement simultaneously imports (transit re-exports excepted). Mutates the
// `re`/`q` arrays and `v.localProduction` in place.
function subsumeAllTradeGoods({ re, q, v }) {
  // ── Trade-goods subsumption ──────────────────────────────────────────────
  // Several label vocabularies feed re/q (chain outputs, tier structural
  // imports, necessity imports, depleted-resource labels, demand-gap labels)
  // and dedupe only on exact strings — so "Grain" and "Bulk grain and
  // foodstuffs" coexist. Collapse each list to one entry per canonical good,
  // then drop exports the settlement simultaneously imports (transit
  // re-exports excepted). Runs after every writer above; economyReconcilePass
  // re-applies it after later passes append imports (factionCorrelationPass's
  // applySubsumption is INSTITUTION subsumption, not this).
  const _subImports = subsumeTradeGoods(q);
  q.length = 0;
  _subImports.forEach((g) => q.push(g));
  const _subExports = reconcileTradeLists(subsumeTradeGoods(re), q);
  re.length = 0;
  _subExports.forEach((g) => re.push(g));
  if (v.localProduction) {
    const _subLocal = subsumeTradeGoods(v.localProduction);
    v.localProduction.length = 0;
    _subLocal.forEach((g) => v.localProduction.push(g));
  }
}

// Stage 10: base prosperity model — combines route/tier/economy/magic/threat/
// military/defensibility/institutional-depth/income-diversity signals into a base
// prosperity index, applies the food-security floor/cap/bonus and the clean-
// subsistence floor, and resolves the prosperity label (forcing 'Subsistence' for
// isolated thorp/hamlet). Returns the food-security profile and the label.
function computeBaseProsperity({ tier, institutions, tradeRoute, config, instNames, incomeNormalized }) {
  // ── Base prosperity model ───────────────────────────────────────────────
  // Inputs: route (channel), tier (capacity), economy slider (investment),
  //         magic (tier-scaled production), threat (drag), military (dual effect),
  //         defensibility (security premium on trade routes)
  const _PLABELS = ['Subsistence', 'Poor', 'Moderate', 'Comfortable', 'Prosperous', 'Wealthy'];

  // 1. Route base — how much commerce can flow at all
  const _routeBase =
    tradeRoute === 'crossroads' || tradeRoute === 'port'
      ? 3 // Comfortable
      : tradeRoute === 'isolated'
        ? ['thorp', 'hamlet'].includes(tier)
          ? 0
          : hasTeleportationInfra(institutions, config) && config.magicExists !== false
            ? 2
            : 1
        : 2; // road/river → Moderate

  // 2. Tier development bonus — division of labour, institutional multiplication
  const _tierBonus = { thorp: 0, hamlet: 0, village: 0, town: 1, city: 1, metropolis: 2 }[tier] || 0;

  // 3. Economy slider — institutional investment in commerce (±1.25 range)
  const _priEcon = config.priorityEconomy ?? 50;
  const _ecoBonus = (_priEcon - 50) / 40;

  // 4. Magic bonus — tier-scaled productive output (only meaningful at town+, only when active)
  const _priMagic = config.priorityMagic ?? 0;
  const _magicActive = config.magicExists !== false && _priMagic > 25;
  const _magicTierScale = { thorp: 0, hamlet: 0, village: 0.3, town: 0.6, city: 1.0, metropolis: 1.4 }[tier] || 0;
  const _magicBonus = _magicActive ? Math.max(0, (_priMagic - 25) / 75) * _magicTierScale : 0;

  // 5. Threat penalty — disrupted trade, insecure fields, rerouted merchants
  const _monsterThreat = config.monsterThreat || 'frontier';
  const _threatPenalty = _monsterThreat === 'plagued' ? -1 : _monsterThreat === 'frontier' ? -0.5 : 0;

  // 6. Military effects — heavy spending diverts capital; but security enables trade
  const _priMil = config.priorityMilitary ?? 50;
  const _milDrain = _priMil > 75 ? -0.3 : 0; // garrison costs crowd out investment
  const _hasWalls = instNames.some(
    (n) =>
      n.toLowerCase().includes('wall') || n.toLowerCase().includes('palisade') || n.toLowerCase().includes('citadel')
  );
  const _hasGarrison = instNames.some(
    (n) => n.toLowerCase().includes('garrison') || n.toLowerCase().includes('barracks')
  );
  const _defPremium = _hasWalls && _hasGarrison && (tradeRoute === 'crossroads' || tradeRoute === 'port') ? 0.3 : 0;

  // Food security modifier — computed here so it can cap/floor base prosperity
  const _foodSec = generateFoodSecurity(tier, institutions, { ...config, tradeRouteAccess: tradeRoute });
  const _foodMod = _foodSec.prosperityMod;

  // 7. Institutional depth — count of Economy+Crafts institutions weighted vs tier expectation
  // A city with 12 economy institutions is richer than one with 4, regardless of slider.
  // Expectations calibrated to actual generator output averages per tier.
  const _econInstCount = institutions.filter((i) => i.category === 'Economy' || i.category === 'Crafts').length;
  const _tierExpectedEco = { thorp: 3, hamlet: 8, village: 13, town: 22, city: 13, metropolis: 14 }[tier] || 8;
  // Bonus: +1 if well above expectation, -1 if well below. Bounded ±1 to avoid dominating.
  const _depthBonus = _econInstCount >= _tierExpectedEco * 1.3 ? 1 : _econInstCount >= _tierExpectedEco * 0.75 ? 0 : -1;

  // 8. Income diversity bonus — many distinct income sources = genuinely complex economy
  const _incomeCount = incomeNormalized?.length || 0;
  const _diversityBonus = _incomeCount >= 7 ? 0.5 : _incomeCount >= 5 ? 0.25 : 0;

  // Combine — cap at Prosperous (4); Wealthy only through narrative modifier (strong econOut)
  let _baseIdx = Math.min(
    4,
    Math.max(
      0,
      Math.round(
        _routeBase +
          _tierBonus +
          _ecoBonus +
          _magicBonus +
          _threatPenalty +
          _milDrain +
          _defPremium +
          _depthBonus +
          _diversityBonus
      )
    )
  );
  // Apply food security floor/cap/bonus to base index BEFORE narrative modifiers
  if (_foodMod) {
    if (_foodMod.type === 'cap') _baseIdx = Math.min(_baseIdx, _foodMod.value);
    if (_foodMod.type === 'penalty') _baseIdx = Math.max(0, _baseIdx + _foodMod.value);
    if (_foodMod.type === 'bonus') _baseIdx = Math.min(4, _baseIdx + Math.round(_foodMod.value));
  }
  // Thorp/hamlet prosperity floor: subsistence communities with required institutions
  // functioning normally should never label below Poor — they're not in crisis, they're
  // just small. Struggling is reserved for active stress/famine on top of structural poverty.
  const _hasRequiredEco = institutions.some((i) => {
    const n = (i.name || '').toLowerCase();
    return [
      'subsistence farming',
      'access to external mill',
      'farmland',
      'town granary',
      'weekly market',
      'city granari',
      'market square',
      'district markets',
      'state granary',
      'inns and taverns (district)',
    ].some((k) => n.includes(k));
  });
  if (
    ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'].includes(tier) &&
    _hasRequiredEco &&
    !(config.stressTypes || []).length
  ) {
    _baseIdx = Math.max(_baseIdx, 1); // floor at Poor for clean subsistence settlements
  }

  let Z = _PLABELS[_baseIdx];
  tradeRoute === 'isolated' && ['thorp', 'hamlet'].includes(tier) && (Z = 'Subsistence');
  return { foodSec: _foodSec, prosperityLabel: Z };
}

export const generateEconomicState = (tier, institutions, tradeRoute, goodsToggles = {}, config = {}) => {
  const instNames = institutions.map((inst) => inst.name),
    hasInst = (...needles) => needles.some((needle) => instNames.some((name) => name.toLowerCase().includes(needle))),
    ecoPriorities = getPriorities(config),
    ecoInstFlags = getInstFlags(config, institutions),
    ecoStressFlags = getStressFlags(config, institutions),
    safetyProfile = generateSafetyProfile(config, tier, institutions),
    incomeBuild = [];
  // Stage 1 — civic income sources; returns the subsistence-gate flag used below.
  const { isSubsistenceOnly } = buildCivicIncomeSources(incomeBuild, {
    tier,
    institutions,
    tradeRoute,
    config,
    hasInst,
    ecoPriorities,
    ecoInstFlags,
    ecoStressFlags,
  });
  const v = generateTradeIncomeStreams(tier, institutions, tradeRoute, goodsToggles, { ...config });
  // Stage 2 — trade-derived bonuses + criminal economy + subsistence fallback.
  appendTradeAndCriminalIncome(incomeBuild, { v, ecoStressFlags, safetyProfile });
  // Stage 3a — resource-trade income, applied only when trade routes exist.
  const appendResourceTradeIncome = () => {
    // Resource trade income — only when trade routes exist.
    // Lowercased names of locally produced goods.
    const localProductionNames = (v.localProduction || []).map(function (item) {
      return (typeof item == 'string' ? item : item.name || '').toLowerCase();
    });
    // Lowercased names of exported products / chains.
    const exportProductNames = (v.exports || []).map(function (item) {
      return (typeof item == 'object' ? item.product || item.chain || '' : item || '').toLowerCase();
    });
    // True if any institution name contains the given substring.
    const hasInstitutionMatching = function (needle) {
      return institutions.some(function (inst) {
        return (inst.name || '').toLowerCase().includes(needle);
      });
    };
    // True if an income source whose name contains the needle is already present.
    const incomeSourceExists = function (needle) {
      return incomeBuild.some(function (source) {
        return (source.source || '').toLowerCase().includes(needle.toLowerCase());
      });
    };
    const nearbyResources = config.nearbyResources || [];
    // True if any nearby-resource entry includes any of the given substrings.
    const hasNearbyResource = function (...needles) {
      return nearbyResources.some(function (resource) {
        return needles.some(function (needle) {
          return resource.includes(needle);
        });
      });
    };

    // Grain — local cereal production or grain/cereal exports, not already noted.
    const producesGrain =
      localProductionNames.some(function (name) {
        return name.includes('grain') || name.includes('wheat') || name.includes('rye') || name.includes('barley');
      }) ||
      exportProductNames.some(function (name) {
        return name.includes('grain') || name.includes('cereal');
      });
    if (producesGrain && !incomeSourceExists('grain') && !incomeSourceExists('agricultural')) {
      incomeBuild.push({
        source: 'Grain Sales',
        percentage: Math.max(6, Math.round(ecoInstFlags.economyOutput / 9)),
        desc: hasNearbyResource('grain_field', 'fertile_flood')
          ? 'Surplus from local harvest sold to nearby settlements and passing merchants. Steady income tied to the growing season.'
          : 'Grain purchased from farming regions and resold or processed locally; margin depends on stable supply routes.',
      });
    }

    // Wool & textile — cloth-related production/exports plus a textile institution.
    const producesTextiles =
      localProductionNames.some(function (name) {
        return name.includes('wool') || name.includes('fleece') || name.includes('cloth') || name.includes('textile');
      }) ||
      exportProductNames.some(function (name) {
        return name.includes('wool') || name.includes('textile') || name.includes('cloth');
      });
    const hasTextileInstitution =
      hasInstitutionMatching('weav') || hasInstitutionMatching('fuller') || hasInstitutionMatching('cloth');
    if (
      producesTextiles &&
      hasTextileInstitution &&
      !incomeSourceExists('wool') &&
      !incomeSourceExists('textile')
    ) {
      incomeBuild.push({
        source: 'Wool & Textile Trade',
        percentage: Math.max(8, Math.round(ecoInstFlags.economyOutput / 7)),
        desc: hasNearbyResource('grazing_land')
          ? 'Local flocks provide raw wool; weavers and fullers convert it to cloth sold across the region.'
          : 'Wool bought from pastoral regions and processed locally. Value-add trade dependent on consistent supply.',
      });
    }

    // Iron & metalwork — nearby ore/metal deposits, or iron production/exports
    // backed by a smithy.
    const producesIron =
      localProductionNames.some(function (name) {
        return name.includes('iron') || name.includes('ore');
      }) ||
      exportProductNames.some(function (name) {
        return name.includes('iron') || name.includes('ore');
      });
    const hasMetalSource =
      hasNearbyResource('iron_deposit', 'coal_deposit', 'precious_metal') ||
      (producesIron && hasInstitutionMatching('smith'));
    if (hasMetalSource && !incomeSourceExists('iron') && !incomeSourceExists('metal')) {
      incomeBuild.push({
        source: 'Iron & Metalwork',
        percentage: Math.max(8, Math.round(ecoInstFlags.economyOutput / 7)),
        desc: hasNearbyResource('iron_deposit', 'coal_deposit', 'precious_metal')
          ? 'Local ore feeds the smithy directly. Metalwork income is not trade-route dependent.'
          : 'Iron imported from mining regions and worked locally; this income stream is vulnerable to supply disruption.',
      });
    }

    // Timber — nearby forest/timber rights, not already noted.
    if (
      hasNearbyResource('managed_forest', 'forest_access', 'timber_rights') &&
      !incomeSourceExists('timber') &&
      !incomeSourceExists('lumber')
    ) {
      incomeBuild.push({
        source: 'Timber Trade',
        percentage: Math.max(7, Math.round(ecoInstFlags.economyOutput / 8)),
        desc: hasNearbyResource('managed_forest', 'shipbuilding_timber', 'hunting_ground')
          ? 'Local forest provides sustainable timber revenue; managed felling and sawmilling keep production consistent.'
          : 'Timber sourced from more distant forests and resold or processed locally. Trade route dependent.',
      });
    }

    // Fish & maritime — fish/salt production or fish exports, not already noted.
    const producesFish =
      localProductionNames.some(function (name) {
        return name.includes('fish') || name.includes('herring') || name.includes('cod') || name.includes('salt');
      }) ||
      exportProductNames.some(function (name) {
        return name.includes('fish') || name.includes('herring');
      });
    if (producesFish && !incomeSourceExists('fish') && !incomeSourceExists('maritime')) {
      incomeBuild.push({
        source: 'Fish & Maritime Produce',
        percentage: Math.max(8, Math.round(ecoInstFlags.economyOutput / 8)),
        desc: 'Catch landed and sold fresh or preserved; salt fish are a major regional export commodity.',
      });
    }

    // Stone — stone/quarry production or exports, not already noted.
    const producesStone =
      localProductionNames.some(function (name) {
        return name.includes('stone') || name.includes('granite') || name.includes('marble') || name.includes('limestone');
      }) ||
      exportProductNames.some(function (name) {
        return name.includes('stone') || name.includes('quarry');
      });
    if (producesStone && !incomeSourceExists('stone') && !incomeSourceExists('quarry')) {
      incomeBuild.push({
        source: 'Stone Quarrying',
        percentage: Math.max(6, Math.round(ecoInstFlags.economyOutput / 10)),
        desc: hasNearbyResource('stone_quarry', 'gemstone')
          ? 'Local quarry provides dressed stone to regional builders. Reliable income with low transport overhead.'
          : 'Stone masons work imported material; the quarrying income notation reflects processing margin only.',
      });
    }

    // Operator-forced goods toggles — add a trade line for each forced good
    // that isn't already represented.
    if (goodsToggles && Object.keys(goodsToggles).length > 0) {
      const goodKeyPattern = /_good_(.+)$/;
      Object.entries(goodsToggles).forEach(function (entry) {
        const match = entry[0].match(goodKeyPattern);
        if (!match || !entry[1].force) return;
        const goodName = match[1];
        const alreadyPresent =
          incomeSourceExists(goodName) ||
          incomeBuild.some(function (source) {
            return (source.source || '').toLowerCase().includes(goodName.toLowerCase());
          });
        if (!alreadyPresent) {
          incomeBuild.push({
            source: goodName + ' Trade',
            percentage: Math.max(5, Math.round(ecoInstFlags.economyOutput / 12)),
            desc:
              'Revenue from locally produced ' + goodName.toLowerCase() + ' sold to merchants and neighboring settlements.',
          });
        }
      });
    }
  };
  if (!isSubsistenceOnly) appendResourceTradeIncome();
  // ── Stage 3: Income normalization ───────────────────────────────────────────
  const incomeNormalized = normalizeIncomeSources(incomeBuild, ecoInstFlags);
  const W = config.stressTypes || [];
  // Stage 4 — necessity imports, then the initial export/import trade lists.
  const U = buildNecessityImports(v, W);
  const { re, q, P, I } = buildInitialTradeLists({ v, config, tradeRoute, goodsToggles, U, W });
  const H = [];
  // Stage 5 — military-services and (chance-gated) slave-trade exports; the only
  // RNG draw in this function lives here. Mutates the `re`/`q` trade lists and
  // returns what it pushed so the Stage 7 chain override (which rebuilds re/q
  // from the chain pipeline) can re-seat these entries instead of silently
  // discarding them — the chain pipeline doesn't model military services or
  // the slave trade.
  const appendMilitaryAndIllicitExports = () => {
    const pushedExports = [],
      pushedImports = [];
    const E = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'].indexOf(tier),
      _ = (institutions || []).map(function (fe) {
        return (fe.name || '').toLowerCase();
      }),
      O = function (fe) {
        return _.some(function (ge) {
          return ge.includes(fe);
        });
      },
      F = config.stressTypes || [],
      X = ecoInstFlags.militaryEffective || 0,
      K = ecoInstFlags.criminalEffective || 0,
      V = ecoInstFlags.economyOutput || 0;
    if (E >= 2 && X >= 60 && (O('mercenary') || O('garrison') || O('barracks') || O('professional guard'))) {
      const fe =
        X >= 80
          ? 'Military services: standing army leasing, siege engineering, garrison contracts'
          : O('mercenary')
            ? 'Mercenary services: trained companies available for hire'
            : 'Military services: garrison contracts and armed escort';
      re.some(function (ge) {
        return ge.toLowerCase().includes('military') || ge.toLowerCase().includes('mercenary');
      }) || (re.push(fe), pushedExports.push(fe));
    }
    const de = E >= 4 ? 0.3 : E === 3 ? 0.1 : 0;
    if (
      de > 0 &&
      !re.some(function (fe) {
        return fe.toLowerCase().includes('slave');
      })
    ) {
      const fe = (K > 55 ? 0.15 : 0) + (F.includes('occupied') ? 0.1 : 0),
        ge = Math.min(de + fe, 0.55);
      if (_rng() < ge) {
        const ke = V > 55 && O('market'),
          dt = F.includes('occupied') || K > 65,
          Gt =
            ke && dt
              ? 'Slave trade: transit market for human trafficking; imported labour and exported captives'
              : ke
                ? 'Slave labour: purchased workforce for agricultural estates, mines, and domestic service'
                : dt
                  ? 'Captive trade: war captives and debtors sold through established trafficking networks'
                  : 'Slave trade: human trafficking and forced labour; legally tolerated or actively regulated';
        const St = 'Enslaved labour: purchased from regional trafficking networks';
        (re.push(Gt),
          pushedExports.push(Gt),
          ke &&
            !q.some(function (Me) {
              return Me.toLowerCase().includes('slave');
            }) &&
            (q.push(St), pushedImports.push(St)));
      }
    }
    return { pushedExports, pushedImports };
  };
  const stage5Trade = appendMilitaryAndIllicitExports();
  // Stage 6 — trade-dependency derivation: flag each catalogued-need institution
  // whose resource is not locally available, with severity/impact keyed to siege
  // and isolation state. Pushes records into `H`.
  deriveTradeDependencies(H, { config, institutions, tradeRoute });
  // ── Stage 7: Chain derivation — compute before return object ─────────────────
  // Builds the active supply chains and their export/import/local-production
  // projections (plus depleted-resource and finished-goods demand-gap entries),
  // then overrides the heuristic `re`/`q` trade lists with the chain-derived
  // values. Returns the chain artifacts needed for assembly.
  const { activeChainsList, chainLocalProd, instServices } = deriveChainTradeArtifacts({
    tier,
    tradeRoute,
    institutions,
    config,
    goodsToggles,
    H,
    U,
    re,
    q,
    stage5Trade,
  });

  // ── Isolated thorp/hamlet: subsistence economy — no imports or exports ────
  // These settlements have no trade route and cannot participate in external trade.
  // Their economy is purely self-contained subsistence. Clear all trade goods.
  const _isSubsistenceIsolated = ['thorp', 'hamlet'].includes(tier) && tradeRoute === 'isolated';
  if (_isSubsistenceIsolated) {
    re.length = 0; // no exports
    q.length = 0; // no imports
    // Also clear active chains that require trade — keep only subsistence-relevant ones
    activeChainsList.forEach((ch, _idx) => {
      // Keep food security chains, remove trade/manufacturing/entrepot chains
      if (ch.entrepot || ch.needKey === 'trade_entrepot') {
        ch.status = 'unexploited';
      }
    });
  }
  if (v.localProduction) {
    v.localProduction.length = 0;
    chainLocalProd.forEach((p) => v.localProduction.push(p));
  }
  const activeChains = activeChainsList;

  // Stage 8 — neighbour economic bias: reshape the export list per the
  // relationship mode (suppress/complement/compete/dependent).
  applyNeighbourEconBias(re, { config, isSubsistenceIsolated: _isSubsistenceIsolated });

  // Stage 9 — trade-goods subsumption: collapse near-duplicate goods to one
  // canonical entry per list and drop self-imported exports.
  subsumeAllTradeGoods({ re, q, v });

  // Stage 9b — hostile-embargo export cap, applied AFTER subsumption so it limits
  // DISTINCT canonical export goods to 4 (moved here from applyNeighbourEconBias's
  // suppress branch, which capped raw pre-dedup entries).
  if (!_isSubsistenceIsolated
      && (config._neighbourEconMode || 'independent') === 'suppress'
      && Object.keys(config._neighbourEconBias || {}).length > 0
      && re.length > 4) {
    re.splice(4);
  }

  // Sort income sources by percentage desc, then by source — must be LAST.
  // The tiebreak is codepoint-stable, NOT localeCompare: this output feeds the
  // hashed golden master, so a locale-/ICU-dependent sort would make the SAME
  // seed emit a DIFFERENT income-source order across machines.
  incomeNormalized.sort(
    (a, b) => b.percentage - a.percentage || (a.source < b.source ? -1 : a.source > b.source ? 1 : 0)
  );
  // Stage 10 — base prosperity model; returns the food-security profile and the
  // resolved prosperity label.
  const { foodSec: _foodSec, prosperityLabel: Z } = computeBaseProsperity({
    tier,
    institutions,
    tradeRoute,
    config,
    instNames,
    incomeNormalized,
  });
  return (
    {
      tier: tier,
      prosperity: generateEconomicNarrative(Z, config, institutions),
      situationDesc: computeEconomicViability(config, tier, institutions),
      incomeSources: incomeNormalized,
      primaryExports: re,
      primaryImports: q,
      transit: I,
      isEntrepot: P,
      localProduction: v.localProduction,
      necessityImports: U,
      tradeAccess: tradeRoute,
      priorities: ecoPriorities,
      compound: ecoInstFlags,
      safetyProfile: safetyProfile,
      tradeDependencies: H,
      institutionalServices: instServices,
      activeChains: activeChains,
      foodSecurity: _foodSec,
      economicComplexity: (function () {
        var incomeSourceCount = incomeNormalized.length,
          exportCount = re.length,
          hasMarketInst = hasInst('market', 'trading', 'merchant', 'guild');
        return tier === 'metropolis' || tier === 'city'
          ? incomeSourceCount >= 9
            ? 'Highly diversified: multiple major revenue streams'
            : incomeSourceCount >= 6
              ? 'Diversified: broad institutional economic base'
              : 'Concentrated: fewer revenue streams than scale suggests'
          : tier === 'town'
            ? hasMarketInst && incomeSourceCount >= 6
              ? 'Diversified market economy'
              : incomeSourceCount >= 4
                ? 'Specialized production and trade'
                : 'Limited: narrow economic base for this scale'
            : tier === 'village'
              ? hasMarketInst
                ? 'Mixed subsistence and market'
                : exportCount >= 4
                  ? 'Agricultural surplus with trade links'
                  : 'Subsistence with minor surplus'
              : exportCount >= 3
                ? 'Subsistence with surplus'
                : 'Subsistence: survival economy';
      })(),
    }
  );
};

// generateEconomicViability
export // sortBySeverity
const sortBySeverity = (r) => {
  // generateEconomicViability also pushes raw 'warning'/'note' severities (see the
  // viability warnings/notes below), which were missing here and produced NaN
  // comparisons that left the list in an arbitrary order. Rank them explicitly and
  // default any unknown severity to the end so the comparator is always consistent.
  const s = {
    [SEVERITY.CRITICAL]: 0,
    [SEVERITY.IMPLAUSIBLE]: 1,
    [SEVERITY.DEPENDENCY]: 2,
    warning: 3,
    [SEVERITY.INEFFICIENCY]: 4,
    note: 5,
  };
  return r.sort((o, d) => (s[o.severity] ?? 9) - (s[d.severity] ?? 9));
};
export const generateEconomicViability = (settlement, terrainType = null, nearbyResources = []) => {
  const issues = [];
  const warnings = [];
  const suggestions = [];
  const plotHooks = [];

  const { population, institutions: insts, config, economicState } = settlement;
  const tier = settlement.tier || config?.tier || config?.settType || 'village';
  const cfg = { ...(config || {}), tier };
  const terrain = terrainType ? TERRAIN_DATA[terrainType] : null;

  // Food/supply viability
  const foodAnalysis = assessFoodViability(population, terrain, insts, cfg);
  issues.push(...foodAnalysis.issues);
  warnings.push(...foodAnalysis.warnings);
  plotHooks.push(...foodAnalysis.plotHooks);

  // Resource chain analysis
  if (terrain && nearbyResources.length > 0) {
    const resourceAnalysis = assessResourceChains(insts, terrain, nearbyResources, cfg);
    issues.push(...resourceAnalysis.issues);
    warnings.push(...resourceAnalysis.warnings);
    suggestions.push(...(resourceAnalysis.suggestions || []));
  }

  // Water/infrastructure dependencies
  const waterAnalysis = assessWaterDependencies(insts, terrain, cfg);
  issues.push(...waterAnalysis.issues);
  warnings.push(...waterAnalysis.warnings);
  suggestions.push(...(waterAnalysis.suggestions || []));

  // Food balance plot hooks
  const stabilityAnalysis = deriveFoodSecurityHooks(population, terrain, insts, cfg, foodAnalysis.foodBalance);
  issues.push(...stabilityAnalysis.issues);
  warnings.push(...stabilityAnalysis.warnings);
  plotHooks.push(...stabilityAnalysis.plotHooks);

  // Power dynamics checks
  const powerAnalysis = generatePowerDynamics(population, insts, economicState, cfg);
  issues.push(...powerAnalysis.issues);
  warnings.push(...powerAnalysis.warnings);
  suggestions.push(...(powerAnalysis.suggestions || []));

  // Trade dependencies
  const tradeDeps = economicState?.tradeDependencies || [];
  if (tradeDeps.length > 0) {
    const stresses = cfg.stressTypes || [];
    const isSieged =
      stresses.includes('under_siege') ||
      (insts || []).some(
        (i) =>
          (i.name || '').toLowerCase().includes('war council') || (i.name || '').toLowerCase().includes('rationing')
      );
    const critical = tradeDeps.filter((d) => d.severity === 'critical');
    const vulnerable = tradeDeps.filter((d) => d.severity === 'vulnerable');
    const hasMagicTradeInst = hasTeleportationInfra(insts || [], cfg);
    if (critical.length > 0 && !hasMagicTradeInst)
      // magic trade = not really on stockpiles
      issues.push({
        severity: 'warning',
        type: isSieged ? 'stress_consequence' : 'isolation_dependency',
        title: isSieged ? 'Siege: Supply Chain Disruption' : 'Isolated: Stockpile Dependency',
        description:
          (isSieged
            ? `${critical.length} institution${critical.length > 1 ? 's' : ''} critically impaired by siege: `
            : `${critical.length} institution${critical.length > 1 ? 's' : ''} operating on stockpiles only (isolated trade): `) +
          critical.map((d) => d.institution).join(', ') +
          '.',
      });
    if (vulnerable.length >= 3)
      warnings.push({
        severity: 'note',
        title: 'Trade Dependencies',
        description: `${vulnerable.length} institution${vulnerable.length > 1 ? 's' : ''} depend on imported materials (${vulnerable
          .slice(0, 3)
          .map((d) => d.resource)
          .join(', ')}). Standard for this trade route, with vulnerability if supply is disrupted.`,
      });
  }

  const criticalIssues = issues.filter((i) => i.severity === SEVERITY.CRITICAL);
  const isViable = criticalIssues.length === 0;

  // Split warnings: dependency notes (normal supply chain) vs real structural issues
  const dependencyWarnings = warnings.filter((w) => w.severity === SEVERITY.DEPENDENCY);
  const structuralWarnings = warnings.filter((w) => w.severity !== SEVERITY.DEPENDENCY);

  return {
    viable: isViable,
    issues: sortBySeverity(issues),
    warnings: sortBySeverity(structuralWarnings), // real problems only
    dependencies: sortBySeverity(dependencyWarnings), // supply chain notes (informational)
    suggestions,
    plotHooks,
    summary: buildViabilitySummary(isViable, issues, structuralWarnings, plotHooks),
    metrics: {
      foodBalance: foodAnalysis.foodBalance,
      tradeAccess: cfg?.tradeRouteAccess || 'unknown',
      criticalIssueCount: criticalIssues.length,
      dependencyCount: dependencyWarnings.length,
      warningCount: structuralWarnings.length,
    },
  };
};
