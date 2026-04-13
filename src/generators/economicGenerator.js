/**
 * economicGenerator.js
 * Economic state and viability generation
 */

import { random as _rng } from './rngContext.js';
import {chance, getInstFlags, getPriorities, getStressFlags, getTradeRouteFeatures, hasTeleportationInfra, priorityToMultiplier} from './helpers.js';
import {generateSafetyProfile} from './safetyProfile.js';
import {HISTORY_EVENTS} from '../data/historyData.js';
import {TRADE_DEPENDENCY_NEEDS, INSTITUTION_FINISHED_GOODS_DEMAND} from '../data/economicData.js';
export { HISTORY_EVENTS } from '../data/historyData.js';

import {SEVERITY, TIER_ORDER} from '../data/constants.js';
import {generateFoodSecurity} from './foodGenerator.js';
import {TERRAIN_DATA} from '../data/geographyData.js';
import {INDUSTRY_WATER_NEEDS, RESOURCE_DATA} from '../data/resourceData.js';
import {SUPPLY_CHAIN_NEEDS} from '../data/supplyChainData.js';
import {GOODS_MODIFIERS_BY_TIER, COMMODITY_CATEGORY_MAP, GOODS_CATEGORIES} from '../data/tradeGoodsData.js';
import {evaluateWaterDependency} from './helpers.js';
import {SERVICE_TIER_DATA} from './servicesGenerator.js';
// ─── Economic helper functions ──────────────────────────────
import {computeActiveChains, deriveExportsFromChains, deriveImportsFromChains, deriveLocalProductionFromChains, deriveInstitutionalServices, deriveServiceExports} from './computeActiveChains.js';

// ECONOMIC_CONSTANTS
const ECONOMIC_CONSTANTS={PER_CAPITA_NEED:2,FARMER_PRODUCTION:6,AGRICULTURAL_WORKFORCE:.4,STORAGE_BUFFER:1.3};

// WATER_ROUTES
const WATER_ROUTES=["coastal","riverside"];

// buildConflict
const buildConflict = (isViable, issues, warnings, plotHooks) => {
  const criticalCount   = issues.filter(i => i.severity === SEVERITY.CRITICAL).length;
  const implausibleCount= issues.filter(i => i.severity === SEVERITY.IMPLAUSIBLE).length;
  const dependencyCount = [...issues, ...warnings].filter(i => i.severity === SEVERITY.DEPENDENCY).length;
  if (criticalCount    > 0) return `✗ NOT VIABLE: ${criticalCount} critical issue${criticalCount > 1 ? 's' : ''} prevent settlement survival.`;
  if (implausibleCount > 3) return ` IMPLAUSIBLE: ${implausibleCount} historical inconsistencies break believability.`;
  if (dependencyCount  > 0) return `✓ VIABLE: Settlement can survive but has ${dependencyCount} trade dependenc${dependencyCount > 1 ? 'ies' : 'y'}. ${plotHooks.length} plot hooks available.`;
  return '✓ VIABLE: Settlement is economically self-sufficient and historically plausible.';
};

// computeFactionPowers
const computeFactionPowers = (institutions, terrain, nearbyResources, config = {}) => {
  const issues      = [];
  const warnings    = [];
  const suggestions = [];

  nearbyResources.forEach(resource => {
    // Find chains associated with this resource using SUPPLY_CHAIN_NEEDS
    const matchingChains = Object.values(SUPPLY_CHAIN_NEEDS).flatMap(need => need.chains)
      .filter(c => c.processingInstitutions.length > 0 &&
        (c.resource?.toLowerCase().includes(resource.toLowerCase().slice(0,8)) ||
         resource.toLowerCase().includes((c.resource||'').toLowerCase().slice(0,8))));
    if (matchingChains.length === 0) return;
    const chain = { processingInstitutions: matchingChains.flatMap(c => c.processingInstitutions) };

    const processingInsts = institutions.filter(i =>
      chain.processingInstitutions.some(name => i.name.includes(name)));

    if (processingInsts.length === 0) {
      suggestions.push({ category: 'Resource Chain', title: `Opportunity: process ${resource}`, description: `${resource} is available locally. Add ${chain.processingInstitutions.join(' or ')} to unlock higher-value exports.` });
    } else if (processingInsts.length < chain.processingInstitutions.length) {
      const missing = (chain.processingInstitutions||[]).filter(name => !institutions.some(i => i.name.includes(name)));
      suggestions.push({ category: 'Resource Chain', title: `Incomplete chain: ${resource}`, description: `Processing ${resource} but missing ${(missing||[]).join(', ')} for the full chain.`, impact: `Exports intermediate goods instead of final products (${(chain.outputs||[]).map(o=>o.label||o).join(', ') || 'finished goods'}). Lower profit margins.`, suggestedFixes: [`Add ${missing.join(' and ')} to complete the production chain`] });
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
    'Grain fields':           ['farm', 'farmland', 'subsistence', 'grain', 'agriculture', 'mill', 'common graz'],
    'Fertile Floodplain':     ['farm', 'farmland', 'subsistence', 'grain', 'agriculture', 'mill'],
    'Oasis and Water Rights': ['farm', 'farmland', 'subsistence', 'agriculture', 'well', 'water'],
    'Date Palms and Orchards':['farm', 'farmland', 'subsistence', 'agriculture', 'orchard'],
    // Livestock / grazing — any animal husbandry institution
    'Grazing land':           ['shepherd', 'grazing', 'dairy', 'livestock', 'cattle', 'common graz', 'stable', 'farmer'],
    'Alpine Pastures':        ['shepherd', 'grazing', 'dairy', 'livestock', 'cattle', 'common graz'],
    // Fishing — any water access institution
    'Fishing grounds':        ['fisher', 'fish market', 'fish', 'dock', 'port', 'river', 'barge', 'cooper', 'barrel'],
    'River fisheries':        ['fisher', 'fish', 'river', 'barge', 'ferry', 'dock', 'port', 'landing', 'cooper', 'barrel'],
    'Marshlands':             ['fisher', 'fish', 'river', 'barge', 'marsh', 'chan', 'dock', 'cooper'],
    // Timber / woodland
    'Managed woodland':       ['woodcutter', 'sawmill', 'carpenter', 'forest', 'lumber'],
    'Coastal Timber':         ['shipyard', 'sawmill', 'carpenter', 'woodcutter', 'lumber'],
    'Mountain Timber':        ['woodcutter', 'sawmill', 'charcoal'],
    // Mineral / earth resources
    'Iron ore deposits':      ['mine', 'smith', 'smelter', 'metal', 'blacksmith', 'iron'],
    'Stone quarry':           ['quarry', 'stone', 'brick', 'mine'],
    'Clay deposits':          ['potter', 'brick', 'clay', 'tile', 'quarry'],
    'Coal or peat deposits':  ['charcoal', 'peat', 'mine', 'coal', 'fuel'],
    'Fine Glass Sand':        ['glass', 'sand', 'beach', 'quarry'],
    // Precious / exotic
    'Precious metal veins':   ['mine', 'assay', 'mint', 'jewel', 'smith'],
    'Deep Natural Harbour':   ['port', 'dock', 'harbour', 'harbor', 'shipyard'],
    // Mill infrastructure
    'Mill Sites':             ['mill', 'farmland', 'farm', 'water', 'stream'],
    // Wild resources — any settlement with outdoors access
    'Foraging areas':         ['druid', 'elder grove', 'apothecary', 'healer', 'warden', 'hedge', 'forest'],
    'Hunting grounds':        ['hunter', 'warden', 'wildfowl', 'tanner', 'trapper', 'lodge'],
    'Wild foraging areas':    ['druid', 'elder grove', 'apothecary', 'healer', 'warden'],
    // Salt
    'Salt flats':             ['salt works', 'salt', 'brine', 'mine'],
  };

  const instNames = institutions.map(i => (i.name||'').toLowerCase());

  institutions.forEach(inst => {
    Object.values(SUPPLY_CHAIN_NEEDS).flatMap(need => need.chains)
      .filter(chain => chain.processingInstitutions.length > 0 &&
        chain.processingInstitutions.some(name => inst.name.includes(name)))
      .forEach(chain => {
        const resource = chain.resource || '';
        const isIsolated = config?.tradeRouteAccess === 'isolated';

        // Check terrain-based resource presence
        const hasTerrainResource = nearbyResources.some(r =>
          resource.toLowerCase().includes(r.toLowerCase().slice(0,6)) ||
          r.toLowerCase().includes(resource.toLowerCase().slice(0,6))
        );

        // Check if the settlement has an institution that IS the production source.
        // Imports on any trade route also count as valid infrastructure.
        const localProducerKws = RESOURCE_LOCAL_PRODUCERS[resource] || [];
        const hasProducingInstitution = localProducerKws.some(kw => instNames.some(n => n.includes(kw)));
        // Teleportation infrastructure counts as trade access — magical supply chains replace roads
        const hasMagicTrade = isIsolated && hasTeleportationInfra(institutions, config);
        const hasTradeAccess = !isIsolated || hasMagicTrade; // trade route OR magic = imports available

        const hasInfrastructure = hasTerrainResource || hasProducingInstitution || hasTradeAccess;

        // Only flag if there is genuinely NO infrastructure covering this need.
        // Trade access and local production institutions both count as infrastructure.
        if (!hasInfrastructure) {
          issues.push({ severity: SEVERITY.IMPLAUSIBLE, category: 'Resource Access', title: `${inst.name} — no viable resource supply`, description: `${inst.name} requires ${resource} to function but the settlement has no local production, no nearby deposits, and no trade access to import it.`, impact: 'Institution cannot function without a supply source.', suggestedFixes: [`Add a trade route so ${resource} can be imported`, `Or add a resource-producing institution locally`] });
        }
      });
  });

  return { issues, warnings, suggestions };
};

// generateStabilityScore
const generateStabilityScore = (population, terrain, institutions, config, foodBalance) => {
  const issues   = [];
  const warnings = [];
  const hooks    = [];
  const route    = config?.tradeRouteAccess || 'isolated';
  const hasDeficit = foodBalance.deficit > 0;

  if (hasDeficit) {
    if (route === 'isolated' || route === 'road') {
      hooks.push({ category: 'Survival Crisis', hook: ' PLOT HOOK: Settlement is starving. Desperate villagers might turn to banditry, or a merchant offers to supply food... at a terrible price (debt servitude? dark pact?).', severity: 'critical' });
    } else if (route !== 'isolated') {
      hooks.push({ category: 'Trade Monopoly', hook: ' PLOT HOOK: A single merchant guild controls grain imports. They raise prices 300%. Do locals rebel? Seek alternative suppliers? What price are they willing to pay?', severity: 'high' });
      if (route === 'river') hooks.push({ category: 'River Control', hook: ' PLOT HOOK: Upstream settlement builds dam or diverts river. Threatens water access AND grain shipments. Diplomacy or war?', severity: 'high' });
      if (route === 'port')  hooks.push({ category: 'Naval Blockade', hook: ` PLOT HOOK: Enemy fleet or pirates blockade the port. Settlement has ${Math.round(foodBalance.dailyProduction / foodBalance.dailyNeed * 30)} days of reserves. Hire ships to break blockade? Negotiate? Starve?`, severity: 'high' });
      if (route === 'road' && hasDeficit) hooks.push({ category: 'Bandit Raids', hook: ' PLOT HOOK: Bandits target food caravans. Settlement offers bounty for clearing the trade road. But are the "bandits" actually desperate refugees from elsewhere?', severity: 'medium' });
    }
  }

  // Viability trade issues flagged by economic state
  if (config?.mustImport) {
    config.mustImport.forEach(resource => {
      const hasProcessor = institutions.some(i => {
        const n = (i.name || '').toLowerCase();
        return (resource.toLowerCase().includes('grain') && n.includes('Mill')) ||
               (resource.toLowerCase().includes('timber') && n.includes('Sawmill')) ||
               (resource.toLowerCase().includes('metal') && (n.includes('Smith') || n.includes('Smelter')));
      });
      if (hasProcessor) {
        warnings.push({ severity: SEVERITY.DEPENDENCY, category: 'Resource Import', title: `Imports ${resource}`, description: `Settlement must import ${resource} to support local industries.`, impact: 'Creates trade dependency and vulnerability.', suggestedFixes: [`Establish stable trade relationship with ${resource} supplier`] });
        if (resource.toLowerCase().includes('timber')) hooks.push({ category: 'Resource Conflict', hook: ' PLOT HOOK: Timber supplier forest is threatened by blight/fire/monsters. Settlement\'s construction and shipbuilding industries face collapse. Secure new supplier or solve crisis?', severity: 'medium' });
        if (resource.toLowerCase().includes('metal') || resource.toLowerCase().includes('iron')) hooks.push({ category: 'Strategic Resource', hook: ' PLOT HOOK: War breaks out. Metal suppliers prioritize military contracts. Blacksmiths cannot get iron for tools/repairs. Economy suffers, population discontent grows.', severity: 'medium' });
      }
    });
  }

  return { issues, warnings, plotHooks: hooks };
};

// buildFactionList
const buildFactionList = (population, terrain, institutions, config) => {
  const issues     = [];
  const warnings   = [];
  const plotHooks  = [];
  const dailyNeed  = population * ECONOMIC_CONSTANTS.PER_CAPITA_NEED;
  const agriCap    = terrain ? terrain.agricultureCapacity : 1;
  const stresses   = config?.stressTypes || [];
  const resources  = config?.nearbyResources || [];
  const instNames  = (institutions || []).map(i => (i.name || '').toLowerCase());
  const hasResource  = (keys)  => resources.some(r => keys.some(k => r.includes(k)));
  const hasInstitution=(keys)  => instNames.some(n => keys.some(k => n.includes(k)));

  // Agriculture modifier from resource+institution combinations
  let agriMod = 0;
  if (hasResource(['grain_fields','fertile_floodplain']) && hasInstitution(['farm','granary','mill','subsistence','grain'])) agriMod += 0.25;
  if (hasResource(['fertile_floodplain'])                && hasInstitution(['farm','granary','subsistence']))               agriMod += 0.10;
  if (hasResource(['grazing_land','fertile_floodplain']) && hasInstitution(['graz','livestock','butcher','common graz','pasture'])) agriMod += 0.10;
  if (hasResource(['hunting_grounds']) && (hasInstitution(['hunt']) || ['thorp','hamlet','village'].includes(config?.tier || config?.settType || ''))) agriMod += 0.06;
  if (hasResource(['river_fish','fishing_grounds']) && hasInstitution(['fish','dock','port','harbor'])) agriMod += 0.09;
  if (hasResource(['river_mills']) && hasInstitution(['mill']))  agriMod += 0.08;
  agriMod = Math.min(agriMod, 0.5);

  // ── Magic food production enhancement ──────────────────────────────────────
  // High magic settlements can use arcane/druidic/divine means to supplement
  // food production. Only applies at town+ tier (smaller settlements lack the
  // institutional base to sustain magical agriculture at scale).
  // Requires: magic priority > 75, magic-capable institution present.
  const magPriority = config?.priorityMagic ?? 0;
  const isMagicHighTier = magPriority > 75 && ['town','city','metropolis'].includes(config?.settType||'');
  if (isMagicHighTier) {
    const hasMagicFarm = hasInstitution(['druid','grove','nature shrine','wizard','arcane','hedge wizard','alchemist']);
    if (hasMagicFarm) {
      // Boost agriMod for magical food production — represents: grow spells,
      // summoned water, magically accelerated crops, divinely-blessed fields.
      agriMod = Math.min(agriMod + 0.3, 0.8);  // higher cap for magic
    }
  }
  // ───────────────────────────────────────────────────────────────────────────
  const effectiveAgri = Math.min(agriCap + agriMod, 2);

  // Stress modifiers
  let productionMult = 1;
  let consumptionMult = 1;
  let routeOverride = null;
  const stressNotes = [];
  if (stresses.includes('famine'))      { productionMult  *= 0.35; stressNotes.push('Famine: crop failure has reduced local food production to 35% of normal capacity.'); }
  if (stresses.includes('under_siege')) { productionMult  *= 0.60; routeOverride = 'isolated'; stressNotes.push('Siege: external supply lines severed and outlying farmland abandoned or razed.'); }
  if (stresses.includes('plague_onset')){ productionMult  *= 0.75; stressNotes.push('Plague: agricultural workforce decimated by illness — fields understaffed.'); }
  if (stresses.includes('occupied'))    { consumptionMult *= 1.20; stressNotes.push('Occupation: occupying forces consume approximately 20% of food supply beyond normal needs.'); }

  const dailyProduction = Math.floor(population * ECONOMIC_CONSTANTS.AGRICULTURAL_WORKFORCE) * ECONOMIC_CONSTANTS.FARMER_PRODUCTION * effectiveAgri * productionMult / ECONOMIC_CONSTANTS.STORAGE_BUFFER;
  const adjustedNeed    = dailyNeed * consumptionMult;
  const effectiveRoute  = routeOverride || config?.tradeRouteAccess || 'isolated';
  const surplus         = dailyProduction - adjustedNeed;
  const rawDeficit      = Math.abs(Math.min(surplus, 0));
  const rawDeficitPct   = adjustedNeed > 0 ? rawDeficit / adjustedNeed * 100 : 0;

  // Import coverage: if trade route is active and food imports exist, imports cover part of deficit
  // effectiveRoute already declared above (uses routeOverride if present)
  const canImportFood   = effectiveRoute !== 'isolated' && rawDeficit > 0;
  const foodImportTerms = ['grain','food','fish','livestock','dairy','bread','meat','provision','flour'];
  const hasNecessityFood = canImportFood && (config?.nearbyResources || []).length >= 0 &&
    foodImportTerms.some(t => instNames.some(n => n.includes('granary') || n.includes('market') || n.includes('inn')));
  // Trade route food coverage: port/crossroads can cover more deficit than road
  const importCoverageRate = !canImportFood ? 0
    : effectiveRoute === 'port'        ? 0.70
    : effectiveRoute === 'crossroads'  ? 0.60
    : effectiveRoute === 'river'       ? 0.50
    : effectiveRoute === 'road'        ? 0.35
    : 0;
  const importCoverage  = Math.round(rawDeficit * importCoverageRate);

  // Magic food offset: druid/divine/arcane can supplement food production
  // Only applies when magic is active and relevant institutions exist
  const magicOn = config?.magicExists !== false;
  let magicFoodOffset = 0;
  let magicFoodNote   = '';
  if (magicOn && rawDeficit > importCoverage) {
    const magPri   = config?.priorityMagic ?? 0;
    const relPri   = config?.priorityReligion ?? 0;
    const hasDruid  = magPri >= 30 && instNames.some(n =>
      ['druid circle','grove shrine','elder grove',"warden's lodge",'sacred grove'].some(k=>n.includes(k)));
    const hasDivine = relPri >= 55 && instNames.some(n =>
      ['cathedral','monastery','great cathedral','parish church','friary'].some(k=>n.includes(k)));
    const hasArcane = magPri >= 50 && instNames.some(n =>
      ['wizard','mages','arcane','spellcasting'].some(k=>n.includes(k)));
    const remaining = rawDeficit - importCoverage;
    if (hasDruid) {
      magicFoodOffset  = Math.max(magicFoodOffset, Math.round(remaining * 0.65));
      magicFoodNote    = 'Druidic cultivation provides partial food supplement';
    } else if (hasDivine) {
      magicFoodOffset  = Math.max(magicFoodOffset, Math.round(remaining * 0.40));
      magicFoodNote    = 'Divine provision supplements food shortfall';
    } else if (hasArcane) {
      magicFoodOffset  = Math.max(magicFoodOffset, Math.round(remaining * 0.30));
      magicFoodNote    = 'Arcane Plant Growth provides minor food supplement';
    }
  }

  const deficit         = Math.max(0, rawDeficit - importCoverage - magicFoodOffset);
  const deficitPercent  = adjustedNeed > 0 ? deficit / adjustedNeed * 100 : 0;

  if (surplus < 0) {
    if (deficitPercent > 50) {
      if (effectiveRoute === 'isolated') {
        // Food security deficit is already surfaced via prosperity level + situational description
      // in the Economics tab. No need to duplicate it here as a viability concern.
      } else if (effectiveRoute === 'road') {
        issues.push({ severity: SEVERITY.DEPENDENCY, category: 'Food Production', title: 'Heavy Food Import Dependency', description: `Settlement requires ~${Math.round(deficit)} lbs of grain/day via road trade (${Math.round(deficitPercent)}% of needs). Vulnerable to supply disruption.`, impact: 'A trade disruption or bad harvest becomes a famine within weeks.', suggestedFixes: ['Add granary or grain storage for reserves', 'Establish multiple supply routes', 'Develop local food production'] });
      } else {
        issues.push({ severity: SEVERITY.DEPENDENCY, category: 'Food Production', title: 'Severe Food Import Dependency', description: `Settlement requires ~${Math.round(deficit)} lbs of grain per day via ${effectiveRoute} trade.`, impact: 'Vulnerable to trade disruption, famine risk.', suggestedFixes: ['Stockpile grain reserves for 3-6 months', 'Diversify trade partners', 'Develop alternative food sources (fish, livestock)'] });
        plotHooks.push({ category: 'Trade Disruption', hook: ` PLOT HOOK: The ${effectiveRoute} trade route is cut off (bandits/war/natural disaster). Settlement has only ${Math.round(dailyProduction / adjustedNeed * 30)} days of food remaining. Famine threatens within weeks.`, severity: 'high' });
      }
    } else if (deficitPercent > 20) {
      warnings.push({ severity: SEVERITY.DEPENDENCY, category: 'Food Production', title: 'Food Import Requirement', description: `Settlement imports ~${Math.round(deficit)} lbs of grain/day (${Math.round(deficitPercent)}% of needs) via ${effectiveRoute}.`, impact: 'Creates trade dependency but manageable.', suggestedFixes: ['Increase local food production', 'Maintain strategic grain reserves'] });
      plotHooks.push({ category: 'Trade Politics', hook: ' PLOT HOOK: Price of grain spikes due to poor harvest elsewhere. Can settlement afford imports? Do merchants exploit the situation?', severity: 'medium' });
    }
  } else if (surplus > adjustedNeed * 0.5) {
    warnings.push({ severity: SEVERITY.INEFFICIENCY, category: 'Food Production', title: 'Agricultural Surplus', description: `Settlement produces ${Math.round(surplus / adjustedNeed * 100)}% more food than needed.`, impact: 'Export opportunity — could generate significant trade income.', suggestedFixes: ['Add merchants to export surplus grain', 'Add granary for long-term storage', 'Develop food processing industries (brewing, baking)'] });
  }

  // Granary check for large settlements
  const hasGranary = instNames.some(n => n.includes('granar') || n.includes('grain store') || n.includes('grain silo'));
  if (getTradeRouteFeatures(config?.tier || config?.settType || 'village') && !hasGranary) {
    warnings.push({ severity: SEVERITY.CRITICAL, category: 'Food Storage', title: 'No Grain Storage Facility', description: `Settlement of ${population.toLocaleString()} lacks a granary — cannot buffer harvests or maintain strategic food reserves.`, impact: 'Vulnerable to seasonal shortages and siege starvation without grain reserves.', suggestedFixes: ['Add Town granary, City granaries, or State granary complex'] });
  }

  // Mill check for towns
  const hasMill = instNames.some(n => n.includes('mill') || n === 'miller');
  if (population > 1000 && !hasMill && population < 5000) {
    warnings.push({ severity: SEVERITY.CRITICAL, category: 'Food Processing', title: 'No Milling Facility', description: `Settlement of ${population} people processes grain without a mill.`, impact: 'Inefficient food processing, implausible for this population size.', suggestedFixes: ['Add Mill (water-powered or windmill) or Mills (2-5)'] });
  }

  // Stress food impact notes
  if (stressNotes.length > 0) {
    const isCritical = stresses.includes('famine') || stresses.includes('under_siege');
    stressNotes.forEach(note => {
      issues.push({ type: 'stress_consequence', category: 'Food Supply', severity: isCritical ? 'critical' : 'implausible', title: 'Stress: Food Production Degraded', message: note, description: note, priorityNote: 'Active stress condition is directly reducing food availability.' });
    });
  }

  return {
    issues, warnings, plotHooks,
    foodBalance: { dailyNeed: Math.round(adjustedNeed), dailyProduction: Math.round(dailyProduction), deficit: Math.round(deficit), deficitPercent: Math.round(deficitPercent), surplus: Math.round(Math.max(surplus, 0)), agricultureModifier: agriCap, stressModifier: productionMult < 1 ? productionMult : undefined, importCoverage: importCoverage > 0 ? Math.round(importCoverage) : undefined, rawDeficit: rawDeficit > deficit ? Math.round(rawDeficit) : undefined },
  };
};

// generateTradeScore
const generateTradeScore = (deficitPercent, config = {}, institutions = []) => {
  const econCategory = priorityToCategory(getInstFlags(config, institutions).economyOutput);
  const isIsolated   = (config?.tradeRouteAccess || 'road') === 'isolated';
  if (deficitPercent <= 0) return null;
  if (isIsolated) {
    if (hasTeleportationInfra(institutions, config))
      return `Food deficit of ${Math.round(deficitPercent)}% is covered through magical supply chains — teleportation imports are reliable but extraordinarily expensive. Any disruption to the magical infrastructure means immediate food crisis.`;
    if (deficitPercent > 40)
      return `Food deficit of ${Math.round(deficitPercent)}% with no external trade — this settlement cannot feed itself and has no mechanism to import what it lacks. Starvation or mass emigration is the long-term outcome without change.`;
    return `Food deficit of ${Math.round(deficitPercent)}% with no external trade route — entirely dependent on local production. A poor harvest means genuine hunger.`;
  }
  if (econCategory === 'very_high' || econCategory === 'high')
    return `Food deficit of ${Math.round(deficitPercent)}% is covered through active grain imports — merchant networks ensure supply chain resilience.`;
  if (econCategory === 'low')
    return `Food deficit of ${Math.round(deficitPercent)}% is a genuine vulnerability — limited trade capacity means shortages are only one poor harvest away.`;
  if (econCategory === 'very_low')
    return `Food deficit of ${Math.round(deficitPercent)}% is a chronic crisis — without meaningful trade, famine is a recurring threat.`;
  return null;
};

// generatePowerDynamics
const generatePowerDynamics = (population, institutions, economicState, config = {}) => {
  const issues     = [];
  const warnings   = [];
  const suggestions= [];
  const pri        = getPriorities(config);
  const instNames  = institutions.map(i => (i.name || '').toLowerCase());
  const hasInst    = (...kws) => kws.some(kw => instNames.some(n => n.includes(kw)));

  // City+ without markets
  const hasMarket = hasInst('market','merchant','district');
  if (population > 5000 && !hasMarket) {
    warnings.push({ severity: SEVERITY.CRITICAL, category: 'Economic Structure', title: 'No Trade Infrastructure', description: `Population of ${population.toLocaleString()} without any markets or trade institutions.`, impact: 'Economy cannot support this population.', suggestedFixes: ["Add Market Square, Merchants' Quarter, or Trade Guild"] });
  }

  // Insufficient craft industries for size
  const craftCount = instNames.filter(n => n.includes('guild') || n.includes('craft') || n.includes('workshop')).length;
  if (population > 5000 && craftCount < 2) {
    const water = evaluateWaterDependency(config, institutions);
    if (water.strength === 'strong') {
      suggestions.push({ category: 'Economic Diversity', title: 'Trade-dependent craft economy', description: `Craft guilds operate on imported materials — sustained by strong ${config?.tradeRouteAccess} trade. Vulnerable to supply disruption.` });
    } else {
      warnings.push({ severity: water.strength === 'moderate' ? SEVERITY.INEFFICIENCY : SEVERITY.IMPLAUSIBLE, category: 'Economic Diversity', title: 'Insufficient Craft Industries', description: `Population of ${population.toLocaleString()} with only ${craftCount} craft institution${craftCount !== 1 ? 's' : ''}. ${water.note}`, impact: water.buffered ? 'Craft economy depends on trade imports.' : 'Lacks diversity to employ the population.', suggestedFixes: water.buffered ? ['Develop local resource base to reduce trade dependency'] : ['Add craft guilds — smiths, weavers, tanners, etc.', 'Improve trade access and economy for trade-sustained crafts'] });
    }
  }

  // Isolation viability check
  const route = (config?.tradeRouteAccess || economicState?.tradeAccess || 'road');
  if (route === 'isolated') {
    const tierLabel = (config?.tier || 'village');
    const isTownPlus = getTradeRouteFeatures(tierLabel);
    const hasMagic   = hasTeleportationInfra(institutions || [], config);
    if (isTownPlus && !hasMagic) {
      warnings.push({ severity: SEVERITY.DEPENDENCY, category: 'Economic Isolation', title: 'Structural Isolation — Economic Impact', description: `A ${tierLabel} in isolation cannot source specialist goods, process surpluses, or pay for skilled labour. Economy is permanently stunted regardless of slider values.`, impact: 'Income sources, trade goods, and services are all compromised. Prosperity capped at Poor.', suggestedFixes: ['Add a trade route', 'Add teleportation infrastructure (high magic)'] });
    } else if (isTownPlus && hasMagic) {
      warnings.push({ severity: SEVERITY.DEPENDENCY, category: 'Economic Isolation', title: 'Magically-Sustained Isolation', description: `${tierLabel.charAt(0).toUpperCase() + tierLabel.slice(1)} sustains itself in isolation via magical infrastructure. Trade flows through teleportation or planar channels rather than roads.`, impact: 'Entirely dependent on magical infrastructure. If magic fails or is disrupted, the settlement collapses without physical trade routes to fall back on.', suggestedFixes: ['Maintain magical infrastructure at all costs', 'Consider adding a physical trade route as redundancy'] });
    }
  }

  // Military priority checks
  if (getTradeRouteFeatures(config?.tier || 'village') && priorityToCategory(pri.military) === 'very_high') {
    const hasDefense = instNames.some(n => n.includes('wall') || n.includes('fortif') || n.includes('palisade'));
    const hasMilInst = instNames.some(n => n.includes('garrison') || n.includes('guard') || n.includes('barracks'));
    if (!hasDefense && !hasMilInst) {
      warnings.push({ severity: SEVERITY.INEFFICIENCY, category: 'Military Priorities', title: 'High Military Priority Without Defences', description: 'Military slider is high but the settlement has no walls, garrison, or barracks.', impact: 'Military investment without physical infrastructure produces limited security.', suggestedFixes: ['Add Town Walls or Garrison'], priorityNote: `Military priority is ${pri.military} — defence institutions are expected.` });
    }
  }

  // Religion priority checks
  if (priorityToCategory(pri.religion) === 'very_high') {
    const hasChurch = instNames.some(n => n.includes('church') || n.includes('cathedral') || n.includes('temple') || n.includes('monastery') || n.includes('shrine') || n.includes('chapel'));
    if (!hasChurch) {
      warnings.push({ severity: SEVERITY.INEFFICIENCY, category: 'Religious Priorities', title: 'High Religious Priority Without Clergy', description: 'Religion slider is high but no religious institution is present.', impact: 'Religious fervour without institutional anchoring produces instability.', suggestedFixes: ['Add Parish Church, Temple, or Monastery'], priorityNote: `Religion priority is ${pri.religion} — a religious centre is expected.` });
    }
  }

  // Magic priority checks
  if (getTradeRouteFeatures(config?.tier || 'village') && priorityToCategory(pri.magic) === 'very_high') {
    const hasMagicInst = instNames.some(n => n.includes('wizard') || n.includes('mage') || n.includes('alchemist') || n.includes('arcane') || n.includes('enchant'));
    if (!hasMagicInst) {
      warnings.push({ severity: SEVERITY.INEFFICIENCY, category: 'Magical Priorities', title: 'High Magic Priority Without Arcane Institutions', description: 'Magic slider is high but no arcane institution is present.', impact: 'Magical potential is unrealised — adventurers will find no magical services.', suggestedFixes: ['Add Hedge Wizard, Alchemist Shop, or Wizard\'s Tower'], priorityNote: `Magic priority is ${pri.magic} — an arcane institution is expected.` });
    }
  }

  // Criminal priority checks
  if (getTradeRouteFeatures(config?.tier || 'village') && priorityToCategory(pri.criminal) === 'very_high') {
    const hasCrimInst  = instNames.some(n => n.includes('thieves') || n.includes('criminal') || n.includes('black market') || n.includes('smuggl'));
    const hasGuardInst = instNames.some(n => n.includes('garrison') || n.includes('guard') || n.includes('watch'));
    if (!hasCrimInst && !hasGuardInst) {
      warnings.push({ severity: SEVERITY.DEPENDENCY, category: 'Criminal Activity', title: 'High Crime Priority — No Criminal or Guard Institutions', description: 'Criminal slider is high but neither criminal organisations nor guard infrastructure are present.', impact: 'High crime without institutions creates ungoverned chaos rather than structured underworld.', suggestedFixes: ["Add Thieves' Guild, Black Market, or City Watch"], priorityNote: `Criminal priority is ${pri.criminal} — some underworld structure is expected.` });
    }
  }

  // Banking without economy
  if (priorityToCategory(pri.economy) === 'very_low' && instNames.some(n => n.includes('bank') || n.includes('money'))) {
    warnings.push({ severity: SEVERITY.INEFFICIENCY, category: 'Economic Contradiction', title: 'Banking Without Economic Focus', description: 'Banking institutions exist but the economy priority is very low.', impact: 'Banks cannot operate without a merchant class to serve.', suggestedFixes: ['Raise Economy priority or remove Banking institutions'], priorityNote: `Economy priority is only ${pri.economy}.` });
  }

  return { issues, warnings, suggestions };
};

// buildPowerNarrative
const buildPowerNarrative = (institutions, terrain, config) => {
  const issues      = [];
  const warnings    = [];
  const suggestions = [];
  const route       = config?.tradeRouteAccess || 'unknown';
  const hasWater    = terrain ? WATER_ROUTES.includes(terrain.name.toLowerCase()) : route === 'river' || route === 'port';

  institutions.forEach(inst => {
    const waterNeed = Object.entries(INDUSTRY_WATER_NEEDS).find(([key]) =>
      inst.name.toLowerCase().includes(key.toLowerCase()) ||
      key.toLowerCase().includes(inst.name.toLowerCase().split(' ')[0])
    )?.[1];

    if (waterNeed?.required) {
      const hasAlternative = waterNeed.alternatives.some(alt => institutions.some(i => i.name.includes(alt)));
      if (!hasWater && !hasAlternative) {
        const alternatives = waterNeed.alternatives.map(alt => `Add ${alt}`);
        warnings.push({ severity: SEVERITY.DEPENDENCY, category: 'Water Dependency', title: `${inst.name}: requires water access`, description: `${inst.name} requires ${waterNeed.description || 'water access'} but settlement has no river or port.`, impact: 'Severely reduced productivity without water access.', suggestedFixes: alternatives.length ? alternatives : ['Establish a river or port trade route'] });
      }
    }
  });

  return { issues, warnings, suggestions };
};

// getInstitutionEconomicBonus
const getInstitutionEconomicBonus = (nearbyResources = [], institutions = []) => {
  const instNames = institutions.map(i => (i.name || '').toLowerCase());
  const commodities = new Set();
  getCommoditiesForResources(nearbyResources).forEach(commodity => {
    const mapped = COMMODITY_CATEGORY_MAP[commodity];
    if (mapped) commodities.add(mapped);
    commodities.add(commodity.toLowerCase());
  });
  // Institution-driven commodity bonus keywords
  if (instNames.some(n => n.includes('mill')    || n.includes('baker')))       commodities.add('flour');
  if (instNames.some(n => n.includes('smith')   || n.includes('metalwork')))   commodities.add('ironwork');
  if (instNames.some(n => n.includes('tanner')  || n.includes('leather')))     commodities.add('leather');
  if (instNames.some(n => n.includes('weaver')  || n.includes('textile')))     commodities.add('cloth');
  if (instNames.some(n => n.includes('butcher')))                              commodities.add('meat');
  if (instNames.some(n => n.includes('carpenter') || n.includes('sawmill')))   commodities.add('lumber');
  if (instNames.some(n => n.includes('dock') || n.includes('port') || n.includes('fishmonger'))) commodities.add('salt');
  return [...commodities];
};

// getCommoditiesForResources
const getCommoditiesForResources = (r=[])=>{const s=new Set;return r.forEach(o=>{const d=RESOURCE_DATA[o];d&&d.commodities.forEach(l=>s.add(l))}),[...s]};

// computeIncomeStreams
const computeIncomeStreams = (tier, institutions = [], route = 'road', goodsToggles = {}, config = {}) => {
  const localProduction   = getInstitutionEconomicBonus(config.nearbyResources || [], institutions);
  const necessityImports  = getInstitutionServices(tier, route, localProduction, institutions, config.nearbyResources || []);
  const isEntrepot        = getTradeModifiers(route, institutions);
  const hasSaltLocal      = necessityImports.some(i => i.toLowerCase() === 'salt');
  const exports           = getHistoryModifiers(tier, institutions, goodsToggles)
    .filter(item => !necessityImports.includes(item.name))
    .filter(item => {
      const name = typeof item === 'string' ? item : (item?.name || '');
      return !(hasSaltLocal && !isEntrepot && isSaltPreserved(name));
    });
  const imports    = getUpgradeChain(tier, route, goodsToggles);
  const bonuses    = [];
  if (isEntrepot && route === 'crossroads' && !['thorp','hamlet'].includes(tier))
    bonuses.push({ source: 'Entrepôt Trade', percentage: tier === 'metropolis' ? 25 : tier === 'city' ? 20 : 18, desc: 'Transit duties, warehouse fees, and re-export premiums from goods passing through the crossroads position.' });
  if (route === 'port' && institutions.some(i => i.name.toLowerCase().includes('international trade')))
    bonuses.push({ source: 'International Commerce', percentage: 25, desc: 'Revenue from international trade: licensing fees, currency exchange, and commodity brokerage.' });
  return { exports, imports, isEntrepot, transit: isEntrepot ? imports.filter(i => !necessityImports.includes(i)).slice(0, 4) : [], incomeBonuses: bonuses, localProduction, necessityImports };
};

// getInstitutionServices
const getInstitutionServices = (tier, route, localProduction, institutions = [], nearbyResources = []) => {
  // Isolated settlements cannot import anything — they are self-contained by definition.
  // Return empty to avoid showing imports that contradict the "no external trade" description.
  if (route === 'isolated') return [];

  const instNames = institutions.map(i => (i.name || '').toLowerCase());
  const needed    = [];
  const isPort    = route === 'port';
  const isRiver   = route === 'river';
  const hasSalt   = nearbyResources.some(r => r.includes('salt_flat') || r.includes('salt_deposit') || r.includes('salt_mine'));
  if (!localProduction.includes('salt')   && !isPort && !isRiver && !hasSalt)                                                   needed.push('Salt');
  if (!localProduction.includes('iron')   && !instNames.some(n => n.includes('smith') || n.includes('metalwork')) && ['city','metropolis'].includes(tier)) needed.push('Iron');
  if (!localProduction.includes('grain')  && (isPort || ['city','metropolis'].includes(tier)) && !instNames.some(n => n.includes('farm') || n.includes('granar'))) needed.push('Grain');
  if (!localProduction.includes('timber') && ['city','metropolis'].includes(tier) && !instNames.some(n => n.includes('carpenter') || n.includes('sawmill'))) needed.push('Timber');
  return needed;
};

// getTradeModifiers
const getTradeModifiers = (r,s=[])=>{const o=s.map(d=>(d.name||"").toLowerCase());return r==="crossroads"||r==="port"&&o.some(d=>d.includes("international trade")||d.includes("warehouse district"))};

// getHistoryModifiers
const getHistoryModifiers = (r,s=[],o={})=>{const d=SERVICE_TIER_DATA[r]||{},l=[];return Object.entries(d).forEach(([m,h])=>{const g=`${r}_export_${m}`;(o[g]!==void 0?o[g]:h.on)&&(h.requiredInstitution&&!s.some(w=>w.name===h.requiredInstitution||w.name.includes(h.requiredInstitution))||_rng()<h.p&&l.push(m))}),l};

// isSaltPreserved
export const isSaltPreserved = r=>SALT_PRESERVATIVES.some(s=>(r||"").toLowerCase().includes(s));
const hasEconomicKeyword = isSaltPreserved;

// SALT_PRESERVATIVES
const SALT_PRESERVATIVES = ["preserv","salted","pickled","cured","smoked","brined","salt fish","salt meat"];

// UPGRADE_CHAINS

export const priorityToCategory = (r=50)=>{const s=r??50;return s<=15?"very_low":s<=35?"low":s<=65?"medium":s<=85?"high":"very_high"};

// computeEconomicViability
const computeEconomicViability = (config = {}, tier = 'town', institutions = []) => {
  const flags    = getInstFlags(config, institutions);
  const stress   = getStressFlags(config, institutions);
  const econCat  = priorityToCategory(flags.economyOutput);
  const crimeCat = priorityToCategory(flags.criminalEffective);
  const route    = config?.tradeRouteAccess || 'road';
  const isolated = route === 'isolated';
  const stresses = (config.stressTypes?.length) ? config.stressTypes : config.stressType ? [config.stressType] : [];
  const primaryStress = stresses.length
    ? ['under_siege','occupied','famine','plague_onset','politically_fractured','recently_betrayed','succession_void','indebted','infiltrated','monster_pressure','insurgency','mass_migration','wartime','religious_conversion','slave_revolt'].find(s => stresses.includes(s)) || stresses[0]
    : null;

  if (primaryStress === 'under_siege') return 'All normal economic activity is suspended. Markets are closed, merchant caravans have stopped arriving, and whatever currency existed is being redirected toward survival. The only economic question is the arithmetic of remaining supplies.';
  if (primaryStress === 'famine')      return 'The economy is structured around food scarcity. Those with grain have power. Those without are making increasingly desperate decisions. Normal market activity continues in a technical sense — prices are simply at levels that exclude most of the population.';
  if (primaryStress === 'occupied')    return `Revenue flows outward to the occupying authority via ${route === 'port' ? 'maritime levies' : 'road tolls and seizure powers'} and compulsory assessment. Local commerce continues under supervision. The officially stated economic situation differs from the experienced one.`;
  if (primaryStress === 'indebted')    return 'Debt service obligations consume a meaningful share of revenue before any local investment is possible. The creditor\'s representative has effective veto power over fiscal decisions. Economic activity continues but its fruits are partly spoken for before they are earned.';
  if (primaryStress === 'plague_onset')return 'Market activity is reduced by fear and quarantine measures. Supply chains for common goods are disrupted. The economic situation would be manageable if it weren\'t compounded by the medical crisis — as it is, each problem is making the other worse.';
  if (primaryStress === 'politically_fractured') return 'Economic activity requires navigating factional lines that did not exist a year ago. Some merchants have aligned with specific factions. Cross-faction trade continues but it is slower and more expensive than it should be.';

  if (isolated) {
    const isTownPlus = getTradeRouteFeatures(config?.tier || config?.settType || 'village');
    const hasMagicTrade = hasTeleportationInfra(institutions, config);
    if (isTownPlus && !hasMagicTrade) return 'This settlement is too large to survive in true isolation. Without trade routes, specialist goods cannot be sourced, surpluses cannot be sold, and population density cannot be sustained. The economy is structurally broken.';
    if (isTownPlus && hasMagicTrade)  return 'Trade flows through magical channels — teleportation circles and planar contacts replace roads. The economy functions but depends entirely on maintaining that arcane infrastructure.';
    if (stress.stateCrime)            return 'Internal production is suppressed by institutional extraction — what little surplus exists flows upward rather than into communal welfare.';
    if (econCat === 'very_high' || econCat === 'high') return 'Despite isolation, internal production is well-organised — skilled crafts, efficient agriculture, and communal resource management keep the settlement self-sufficient.';
    if (econCat === 'low' || econCat === 'very_low') return 'The settlement struggles to sustain itself without outside trade. Resources are tightly rationed and growth is impossible.';
    return 'The settlement meets its own needs without external trade, though surpluses are modest and specialist goods are unavailable.';
  }

  if (stress.theocraticEconomy)    return 'The church controls most economic activity — land, markets, and trade flow through religious institutions. Commerce is present but the church sets the terms.';
  if (stress.merchantCriminalBlur) return 'Commerce is vigorous and the distinction between legitimate trade and criminal enterprise is largely academic. The wealthiest operators play both sides.';
  if (stress.stateCrime)           return 'The official economy appears functional. The reality is that institutional extraction — confiscations, forced sales, and selective taxation — suppresses productive activity.';
  if (econCat === 'very_high')     return 'Commerce is the lifeblood of this settlement — markets are active at all hours and guild influence reaches every trade.';
  if (econCat === 'high')          return 'Trade is vigorous and the guilds are well-organized, generating steady civic revenue.';
  if (econCat === 'low')           return 'Commerce is sluggish; markets meet infrequently and many crafts are in decline.';
  if (econCat === 'very_low')      return 'The economy is barely functional — barter replaces coin and few outsiders bother to trade here.';
  if (crimeCat === 'high' || crimeCat === 'very_high') return 'Official commerce is moderate but a thriving shadow economy undercuts legitimate trade.';
  return 'Trade proceeds at an ordinary pace for a settlement of this size.';
};

// generateEconomicNarrative
const generateEconomicNarrative = (prosperity, config = {}, institutions = []) => {
  const flags   = getInstFlags(config, institutions);
  const econOut = flags.economyOutput;
  const stresses = (config.stressTypes?.length) ? config.stressTypes : config.stressType ? [config.stressType] : [];
  const LABELS  = ['Struggling','Poor','Moderate','Comfortable','Prosperous','Wealthy'];
  const BASE    = { Subsistence: 0, Poor: 1, Moderate: 2, Comfortable: 3, Prosperous: 4, Wealthy: 5 };
  let idx = BASE[prosperity] !== undefined ? BASE[prosperity] : 2;
  // Subsistence isolated settlements can still struggle further — 35% chance of Struggling
  if (prosperity === 'Subsistence') {
    idx = _rng() < 0.40 ? 0 : (_rng() < 0.50 ? 0 : 1); // 40% Struggling, ~30% Poor, ~30% luckier
    idx = Math.max(0, Math.min(1, idx)); // cap at Poor — subsistence can never be Moderate+
  }
  // Economy output adjustments — calibrated for truly random sliders (5-95 uniform)
  // Low econOut = low commercial investment, not necessarily crisis
  if (econOut >= 70)     idx = Math.min(5, idx + 1);  // high economy → bonus
  else if (econOut < 15) idx = Math.max(0, idx - 1);  // very low economy → -1 (was -2)
  // Note: removed the 15-32 range penalty — a moderate-low economy is still functional
  // Small settlement floors:
  // - Isolated thorp/hamlet: cap at Poor (subsistence mode, valid to be Poor)
  // - Connected thorp/hamlet (road/river/etc): floor at Poor — they're struggling but not destitute
  // Derive tier from config — settType may be 'random' in random mode, so check config.tier too
  const _tier = config.tier || config.settType || '';
  const isSmallTier = _tier === 'thorp' || _tier === 'hamlet';
  const isIsolatedSmall = isSmallTier && (config.tradeRouteAccess === 'isolated');
  const isConnectedSmall = isSmallTier && (config.tradeRouteAccess !== 'isolated');
  if (isIsolatedSmall)  idx = Math.max(0, Math.min(idx, 1)); // cap at Poor for isolated subsistence
  if (isConnectedSmall) idx = Math.max(1, idx);               // floor at Poor — connected small settlement can't be Struggling
  // High crime drags down perceived prosperity
  if (flags.criminalEffective >= 65) idx = Math.max(0, idx - 1);
  // Stress penalties
  const active = stresses.length ? stresses : [];
  if (active.includes('under_siege'))         idx = Math.max(0, Math.min(idx, 0));
  if (active.includes('famine'))              idx = Math.max(0, Math.min(idx, 0));
  if (active.includes('occupied'))            idx = Math.max(0, Math.min(idx, 1));
  if (active.includes('indebted'))            idx = Math.max(0, idx - 1);
  if (active.includes('politically_fractured'))idx = Math.max(0, idx - 1);
  if (active.includes('plague_onset'))        idx = Math.max(0, idx - 1);
  if (active.includes('recently_betrayed'))   idx = Math.max(0, idx - 1);
  if (active.includes('monster_pressure'))    idx = Math.max(0, idx - 1);
  if (active.includes('insurgency'))          idx = Math.max(0, idx - 1);
  if (active.includes('wartime'))             idx = Math.max(0, idx - 1);
  if (active.includes('mass_migration'))      idx = Math.max(0, idx - 1);
  if (active.includes('religious_conversion'))idx = Math.max(0, idx - 1);
  return LABELS[Math.min(5, Math.max(0, idx))];
};

// generateTradeIncomeStreams
const getTradeRouteBonus = getTradeModifiers;

const generateTradeIncomeStreams = (tier, institutions = [], route = 'road', goodsToggles = {}, config = {}) => {
  const localProduction  = getInstitutionEconomicBonus(config.nearbyResources || [], institutions);
  const necessityImports = getInstitutionServices(tier, route, localProduction, institutions, config.nearbyResources || []);
  const isEntrepot       = getTradeRouteBonus(route, institutions);
  const hasSaltLocal     = necessityImports.some(i => i.toLowerCase() === 'salt');
  const exports          = getGoodsModifiers(tier, institutions, goodsToggles)
    .filter(item => !necessityImports.includes(item.name))
    .filter(item => {
      const name = typeof item === 'string' ? item : (item?.name || '');
      return !(hasSaltLocal && !isEntrepot && hasEconomicKeyword(name));
    });
  const imports  = getUpgradeChain(tier, route, goodsToggles);
  const bonuses  = [];
  if (isEntrepot && route === 'crossroads' && !['thorp','hamlet'].includes(tier))
    bonuses.push({ source: 'Entrepôt Trade', percentage: tier === 'metropolis' ? 25 : tier === 'city' ? 20 : 18, desc: 'Transit duties, warehouse fees, and re-export premiums from goods passing through the crossroads position.' });
  if (route === 'port' && institutions.some(i => i.name.toLowerCase().includes('international trade')))
    bonuses.push({ source: 'International Commerce', percentage: 25, desc: 'Revenue from international trade: licensing fees, currency exchange, and commodity brokerage.' });
  return { exports, imports, isEntrepot, transit: isEntrepot ? imports.filter(i => !necessityImports.includes(i)).slice(0, 4) : [], incomeBonuses: bonuses, localProduction, necessityImports };
};

// getGoodsModifiers
const getGoodsModifiers = (r,s=[],o={})=>{const d=GOODS_MODIFIERS_BY_TIER[r]||{},l=[];return Object.entries(d).forEach(([m,h])=>{const g=`${r}_export_${m}`;(o[g]!==void 0?o[g]:h.on)&&(h.requiredInstitution&&!s.some(w=>w.name===h.requiredInstitution||w.name.includes(h.requiredInstitution))||_rng()<h.p&&l.push(m))}),l};

// UPGRADE_GOODS_BY_TIER — goods available as upgrades per tier
const UPGRADE_GOODS_BY_TIER = {
  thorp: {
    basic: [
      {
        name: "Salt",
        category: GOODS_CATEGORIES.FOOD_PROCESSED,
        on: !0,
        desc: "Food preservation"
      },
      {
        name: "Metal tools",
        category: GOODS_CATEGORIES.MANUFACTURED,
        on: !0,
        desc: "Simple implements"
      },
      {
        name: "Cloth",
        category: GOODS_CATEGORIES.MANUFACTURED,
        on: !0,
        desc: "Basic textiles"
      }
    ]
  },
  hamlet: {
    basic: [
      {
        name: "Metal goods",
        category: GOODS_CATEGORIES.MANUFACTURED,
        on: !0,
        desc: "Tools, nails, horseshoes"
      },
      {
        name: "Salt",
        category: GOODS_CATEGORIES.FOOD_PROCESSED,
        on: !0,
        desc: "Food preservation"
      },
      {
        name: "Quality cloth",
        category: GOODS_CATEGORIES.MANUFACTURED,
        on: !0,
        desc: "Better textiles"
      }
    ]
  },
  village: {
    basic: [
      {
        name: "Metal goods",
        category: GOODS_CATEGORIES.MANUFACTURED,
        on: !0,
        desc: "Tools, nails, horseshoes"
      },
      {
        name: "Quality cloth and clothing",
        category: GOODS_CATEGORIES.MANUFACTURED,
        on: !0,
        desc: "Finished garments"
      },
      {
        name: "Salt for preservation",
        category: GOODS_CATEGORIES.FOOD_PROCESSED,
        on: !0,
        desc: "Essential preservative"
      },
      {
        name: "Specialized tools",
        category: GOODS_CATEGORIES.MANUFACTURED,
        on: !0,
        desc: "Advanced implements"
      }
    ],
    fromHigher: [
      {
        name: "Legal services",
        category: GOODS_CATEGORIES.SERVICES,
        on: !0,
        desc: "Contracts, court access"
      },
      {
        name: "Advanced medical care",
        category: GOODS_CATEGORIES.SERVICES,
        on: !0,
        desc: "Skilled physicians"
      },
      {
        name: "Manufactured goods",
        category: GOODS_CATEGORIES.MANUFACTURED,
        on: !0,
        desc: "Wide variety of crafts"
      }
    ]
  },
  town: {
    fromCityOrMetropolis: [
      {
        name: "Luxury textiles",
        category: GOODS_CATEGORIES.LUXURY,
        on: !0,
        desc: "Fine cloth, silk"
      },
      {
        name: "Spices and exotic dyes",
        category: GOODS_CATEGORIES.LUXURY,
        on: !0,
        desc: "Imported rarities"
      },
      {
        name: "Banking services",
        category: GOODS_CATEGORIES.SERVICES,
        on: !0,
        desc: "Letters of credit"
      },
      {
        name: "Advanced legal expertise",
        category: GOODS_CATEGORIES.SERVICES,
        on: !0,
        desc: "Specialized law"
      },
      {
        name: "Rare materials",
        category: GOODS_CATEGORIES.LUXURY,
        on: !0,
        desc: "Exotic goods"
      }
    ],
    fromHinterland: [
      {
        name: "Food surplus",
        category: GOODS_CATEGORIES.AGRICULTURAL,
        on: !0,
        desc: "Agricultural hinterland"
      },
      {
        name: "Raw wool and hides",
        category: GOODS_CATEGORIES.RAW_MATERIALS,
        on: !0,
        desc: "For processing"
      },
      {
        name: "Timber",
        category: GOODS_CATEGORIES.RAW_MATERIALS,
        on: !0,
        desc: "Construction material"
      }
    ]
  },
  city: {
    fromMetropolis: [
      {
        name: "International banking",
        category: GOODS_CATEGORIES.SERVICES,
        on: !0,
        desc: "Global connections"
      },
      {
        name: "Highest luxury goods",
        category: GOODS_CATEGORIES.LUXURY,
        on: !0,
        desc: "Rarities and masterworks"
      },
      {
        name: "Political legitimacy",
        category: GOODS_CATEGORIES.SERVICES,
        on: !0,
        desc: "Royal/imperial connections"
      }
    ],
    fromHinterland: [
      {
        name: "Bulk food",
        category: GOODS_CATEGORIES.AGRICULTURAL,
        on: !0,
        desc: "Massive agricultural needs"
      },
      {
        name: "Raw materials",
        category: GOODS_CATEGORIES.RAW_MATERIALS,
        on: !0,
        desc: "Ore, timber, wool"
      },
      {
        name: "Basic goods for resale",
        category: GOODS_CATEGORIES.MANUFACTURED,
        on: !0,
        desc: "Market redistribution"
      }
    ]
  },
  metropolis: {
    basic: [
      {
        name: "Massive food requirements",
        category: GOODS_CATEGORIES.AGRICULTURAL,
        on: !0,
        desc: "Regional network"
      },
      {
        name: "Raw materials",
        category: GOODS_CATEGORIES.RAW_MATERIALS,
        on: !0,
        desc: "Entire regional supply"
      },
      {
        name: "Luxury imports",
        category: GOODS_CATEGORIES.LUXURY,
        on: !0,
        desc: "From distant lands"
      }
    ]
  }
};

// getUpgradeChain
const getUpgradeChain = (tier, route, isFromHigher = false, goodsToggles = {}) => {
  // Isolated settlements have no trade access — no upgrade goods come in from outside
  if (route === 'isolated') return [];
  const tierData = UPGRADE_GOODS_BY_TIER[tier] || {};
  const result   = [];
  let source     = 'basic';
  if      (isFromHigher && tierData.fromHigher)                                    source = 'fromHigher';
  else if ((route === 'city' || route === 'metropolis') && tierData.fromCityOrMetropolis) source = 'fromCityOrMetropolis';
  else if (tierData.fromHinterland)                                                source = 'fromHinterland';
  else if (tierData.fromMetropolis && route === 'metropolis')                      source = 'fromMetropolis';
  (tierData[source] || []).forEach(item => {
    const toggleKey = `${tier}_import_${item.name}`;
    const isService = item.category === 'services' || item.category === 'SERVICES' || (item.category?.key || item.category) === 'services';
    if (!isService && (goodsToggles[toggleKey] !== undefined ? goodsToggles[toggleKey] : item.on))
      result.push(item.name);
  });
  return result;
};

// HISTORY_EVENTS
export const getUpgradeOpportunities = (institutions, tier, config = {}) => {
  const tierIndex = TIER_ORDER.indexOf(tier);
  const result    = [];
  Object.entries(HISTORY_EVENTS).forEach(([category, roles]) => {
    roles.forEach(role => {
      if (tierIndex < TIER_ORDER.indexOf(role.minTier)) return;
      if (role.requiresGuild && !institutions.some(i => i.tags?.includes('guild'))) return;
      // Keyword gate: at least one institution name must contain one of the keywords
      if (role.requiresInstKeyword && !institutions.some(i =>
          role.requiresInstKeyword.some(kw => (i.name||'').toLowerCase().includes(kw))
      )) return;
      if (role.requiresPort) {
        const waterRoute = ['port','river','coastal'].includes(config?.tradeRouteAccess);
        const hasWaterInst = institutions.some(i =>
          i.tags?.includes('port') ||
          (i.name||'').toLowerCase().includes('port') ||
          (i.name||'').toLowerCase().includes('harbour') ||
          (i.name||'').toLowerCase().includes('harbor') ||
          ((i.name||'').toLowerCase().includes('dock') && waterRoute)
        );
        if (!waterRoute && !hasWaterInst) return;
      }
      if (category === 'other' || institutions.some(i => i.priorityCategory === category || i.category?.toLowerCase() === category))
        result.push({ ...role, category });
    });
  });
  result.forEach(role => { role.effectivePriority = role.priority * (config?.[role.category] ?? 1); });
  return result.sort((a, safetyProfile) => safetyProfile.effectivePriority - a.effectivePriority);
};

// ─── Private helpers (auto-extracted) ────────────────────

// getUpgradeOpps
const getUpgradeOpps = (institutions, tier, config = {}) => {
  const tierIndex = TIER_ORDER.indexOf(tier);
  const result    = [];
  Object.entries(HISTORY_EVENTS).forEach(([category, roles]) => {
    roles.forEach(role => {
      if (tierIndex < TIER_ORDER.indexOf(role.minTier)) return;
      if (role.requiresGuild && !institutions.some(i => i.tags?.includes('guild'))) return;
      // Keyword gate: at least one institution name must contain one of the keywords
      if (role.requiresInstKeyword && !institutions.some(i =>
          role.requiresInstKeyword.some(kw => (i.name||'').toLowerCase().includes(kw))
      )) return;
      if (role.requiresPort) {
        const waterRoute = ['port','river','coastal'].includes(config?.tradeRouteAccess);
        const hasWaterInst = institutions.some(i =>
          i.tags?.includes('port') ||
          (i.name||'').toLowerCase().includes('port') ||
          (i.name||'').toLowerCase().includes('harbour') ||
          (i.name||'').toLowerCase().includes('harbor') ||
          ((i.name||'').toLowerCase().includes('dock') && waterRoute)
        );
        if (!waterRoute && !hasWaterInst) return;
      }
      if (category === 'other' || institutions.some(i => i.priorityCategory === category || i.category?.toLowerCase() === category))
        result.push({ ...role, category });
    });
  });
  result.forEach(role => { role.effectivePriority = role.priority * (config?.[role.category] ?? 1); });
  return result.sort((a, safetyProfile) => safetyProfile.effectivePriority - a.effectivePriority);
};

// ─────────────────────────────────────────────────────────

// generateEconomicState

// ─────────────────────────────────────────────────────────

// generateEconomicState

  // ── Stage 2: Income sources (k = incomeSources array) ─────────────────────

// ── Finished goods demand-gap computation ────────────────────────────────────
// Computes the gap between what military/religious/maritime/luxury/alchemical
// institutions consume and what local supply chains produce.
// Pushes import labels when demand exceeds supply; export bonus when surplus.
// Builds on top of TRADE_DEPENDENCY_NEEDS (raw resources) without replacing it.
function computeFinishedGoodsDemand(
  tier, tradeRoute, institutions, nearbyResources, chainExports, chainImports
) {
  const TIER_ORDER = ['thorp','hamlet','village','town','city','metropolis'];
  const tierIdx = TIER_ORDER.indexOf(tier);
  const instNames = (institutions || []).map(i => (i.name || '').toLowerCase());
  const resKeys   = (nearbyResources || []);

  const hasInst = (keyword) => instNames.some(n => n.includes(keyword.toLowerCase()));
  const hasRes  = (key)     => resKeys.some(r => r === key || r.includes(key));
  const alreadyImporting = (label) =>
    chainImports.some(i => i.toLowerCase().includes(label.toLowerCase()));
  const alreadyExporting = (label) =>
    chainExports.some(e => e.toLowerCase().includes(label.toLowerCase()));

  for (const [category, cfg] of Object.entries(INSTITUTION_FINISHED_GOODS_DEMAND)) {
    // Tier gate
    const minTierIdx = TIER_ORDER.indexOf(cfg.minTier || 'thorp');
    if (tierIdx < minTierIdx) continue;

    // Route gate (maritime only fires on water routes)
    if (cfg.routeRequired && !cfg.routeRequired.includes(tradeRoute)) continue;

    // ── Compute total demand from present consumer institutions ────────────
    let totalDemand = 0;
    for (const [keyword, { demand }] of Object.entries(cfg.consumers)) {
      if (hasInst(keyword)) totalDemand += demand;
    }
    if (totalDemand === 0) continue;  // no consuming institutions present

    // ── Compute local supply from present supplier institutions/resources ──
    let totalSupply = 0;
    for (const [keyword, { supply }] of Object.entries(cfg.suppliers)) {
      // Some suppliers are resource keys (e.g. 'managed_forest', 'magical_node')
      if (keyword.includes('_')) {
        if (hasRes(keyword)) totalSupply += supply;
      } else {
        if (hasInst(keyword)) totalSupply += supply;
      }
    }

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

    // ── Export bonus: supply substantially exceeds demand ─────────────────
    if (gap < -2 && cfg.exportBonus && !alreadyExporting(cfg.exportBonus)) {
      chainExports.push(cfg.exportBonus);
    }
  }
}

export const generateEconomicState = (tier, institutions, tradeRoute, goodsToggles = {}, config = {}) => {
  // Parameter aliases (original minified names)
  
  var ne;const instNames=institutions.map(ee=>ee.name),
  hasInst=(...ee)=>ee.some(E=>instNames.some(_=>_.toLowerCase().includes(E))),
  ecoPriorities=getPriorities(config),
  ecoInstFlags=getInstFlags(config, institutions),
  ecoStressFlags=getStressFlags(config, institutions),
  safetyProfile=generateSafetyProfile(config,
  tier,
  institutions),
  incomeBuild=[
  ];[
    "thorp",
    "hamlet",
    "village"
  ].includes(tier)?incomeBuild.push({
    source: "Agricultural Rents",
    percentage: 65,
    desc: "Payments in kind or coin from tenant farmers; the primary revenue at this scale."
  }): tier==="town"&&!hasInst("market square",
  "weekly market",
  "daily market")&&incomeBuild.push({
    source: "Agricultural Rents",
    percentage: 30,
    desc: "Rural hinterland rents remain significant without large market infrastructure."
  });
  const f=tradeRoute==="isolated";
  const C=f&&hasTeleportationInfra(institutions, config);
  const T=f&&!C;
  const M=C?.4: 1;
  // Subsistence gate: isolated thorp/hamlet/village produce for themselves only
  const SUBSISTENCE_TIERS_ECO = ['thorp', 'hamlet', 'village'];
  const isSubsistenceOnly = f && SUBSISTENCE_TIERS_ECO.includes(tier) && !C;
  if(!T&&hasInst("district market",
  "multiple market")?incomeBuild.push({
    source: C?"Magical Trade Revenue": "Market Taxes",
    percentage: Math.round(45*M),
    desc: "District-level duties on specialized goods; primary civic revenue at metropolis scale."
  }): !T&&hasInst("daily market")?incomeBuild.push({
    source: C?"Magical Trade Revenue": "Market Taxes",
    percentage: Math.round(35*M),
    desc: C?"Trade flowing through teleportation channels generates modest fees and arcane duties.": "Daily market tolls, stall fees, and weights-and-measures inspections."
  }): !T&&hasInst("market square",
  "weekly market",
  "annual fair")&&incomeBuild.push({
    source: C?"Magical Trade Revenue": "Market Taxes",
    percentage: Math.round(22*M),
    desc: C?"Magical trade conduits generate modest fees and arcane duties on transported goods.": "Market day stall fees and toll collection on goods entering the market."
  }),
  !T&&hasInst("craft guilds (100",
  "merchant guilds (50")?incomeBuild.push({
    source: "Guild Licensing",
    percentage: 28,
    desc: "Charter fees, quality inspection levies, and licensing of all trades and crafts."
  }): !T&&hasInst("guild")&&incomeBuild.push({
    source: "Guild Fees",
    percentage: 18,
    desc: "Annual licensing fees and fines levied by guild oversight."
  }),
  hasInst("major port")&&tradeRoute==="port"?incomeBuild.push({
    source: "Port Duties",
    percentage: 35,
    desc: "Import and export taxes, anchorage fees, and customs inspection on all cargo."
  }): hasInst("dock",
  "port facilit")&&tradeRoute==="river"&&incomeBuild.push({
    source: "River Tolls",
    percentage: 20,
    desc: "Tolls on river traffic, dock fees, and ferry rights."
  }),
  hasInst("banking district",
  "stock exchange")?incomeBuild.push({
    source: "Financial Services",
    percentage: 22,
    desc: "Civic taxes on banking operations, letters of credit, and financial transaction fees."
  }): hasInst("banking house",
  "money changer")&&incomeBuild.push({
    source: "Banking Fees",
    percentage: 14,
    desc: "Interest income, currency exchange commissions, and safe deposit charges."
  }),
  getTradeRouteFeatures(tier)){
    const ee=tier==="metropolis"||tier==="metropolis"?18: tier==="city"?14: 10;incomeBuild.push({
      source: "Property Rents",
      percentage: ee,
      desc: "Ground rents on civic-owned buildings, stalls, and residential plots within the walls."
    })
  }if(hasInst("courthouse",
  "multiple court",
  "city hall")&&incomeBuild.push({
    source: "Court Fees & Fines",
    percentage: 10,
    desc: "Filing fees, fines levied on offenders, and fees for notarial and legal certification services."
  }),
  !T&&tradeRoute==="crossroads"?incomeBuild.push({
    source: "Toll Revenue",
    percentage: 20,
    desc: "Passage tolls on all roads and bridges serving the crossroads position."
  }): !T&&tradeRoute==="road"&&hasInst("gate",
  "town wall",
  "city wall")&&incomeBuild.push({
    source: "Gate Tolls",
    percentage: 10,
    desc: "Entry and exit tolls collected at the town gates from merchants and travellers."
  }),
  hasInst("garrison",
  "multiple garrison",
  "professional guard")&&ecoPriorities.military>55){
    const ee=ecoStressFlags.stateCrime?{
      source: "Military Extraction",
      percentage: 20,
      desc: "Forced contributions and confiscations collected by the garrison — not formally a tax."
    }: {
      source: "Military Levy",
      percentage: 12,
      desc: "Emergency and standing levies on the population to fund garrison upkeep."
    };incomeBuild.push(ee)
  }const A=institutions.some(function(ee){
    var E=(ee.name||"").toLowerCase();return(E.includes("parish church")||E.includes("cathedral")||E.includes("monastery")||E.includes("friary")||E.includes("temple")||E.includes("graveyard"))&&!E.startsWith("access to")
  });ecoInstFlags.religionInfluence>55&&A&&(ecoStressFlags.theocraticEconomy?incomeBuild.push({
    source: "Church Tithes & Rents",
    percentage: Math.round(ecoInstFlags.religionInfluence/4),
    desc: "Mandatory tithes plus rent income from church-owned land dominating the local economy."
  }): incomeBuild.push({
    source: "Church Tithes",
    percentage: Math.round(ecoInstFlags.religionInfluence/5),
    desc: "Tithes, offerings, and fees for burial and sacramental services collected by resident clergy."
  }),
  ecoInstFlags.religionInfluence>68&&A&&(tradeRoute==="crossroads"||tradeRoute==="road")&&incomeBuild.push({
    source: "Pilgrim Trade",
    percentage: Math.round(ecoInstFlags.religionInfluence/9),
    desc: "Offerings, hospitality fees, relic sales, and incidental commerce from visiting pilgrims."
  }));// ── Three-tier magic economy ──────────────────────────────────────────────
  // Tier thresholds scale with settlement size — small settlements need higher
  // magic density to support commercial arcane activity
  const magPri  = ecoInstFlags.magicInfluence; // priorityMagic value (0-100)
  const hasAlch = hasInst("alchemist", "herbalist", "apothecary", "hedge wizard");
  const hasSpell = hasInst("wizard", "mage", "spellcasting", "arcane");
  const hasMagesGuild = hasInst("mages' guild", "mages' district", "arcane academy", "academy of magic", "wizard's tower", "magical academy");
  const TIER_ORDER_LOCAL = ['thorp','hamlet','village','town','city','metropolis'];
  const tierIdx = TIER_ORDER_LOCAL.indexOf(tier);

  if (magPri > 0) {
    // LOW: apothecary / hedge magic — alchemists, herbalists, hedge wizards
    // Available from village+ when any alchemical institution present
    if (magPri >= 15 && hasAlch && tierIdx >= 2) {
      const pct = Math.round(Math.max(4, magPri / 14));
      incomeBuild.push({
        source: magPri < 35 ? "Herbalist & Apothecary" : "Apothecary & Alchemy",
        percentage: pct,
        desc: magPri < 35
          ? "Herbal remedies, minor alchemical preparations, and potion sales. The local alchemist supplements conventional trade."
          : "A thriving alchemical trade in reagents, preparations, and curative potions draws customers from surrounding settlements.",
      });
    }

    // MEDIUM: commercial spellcasting — identification, divination, minor enchanting
    // Available from town+ when spellcasting institutions present
    if (magPri >= 35 && hasSpell && tierIdx >= 3) {
      const pct = Math.round(Math.max(6, magPri / 10));
      incomeBuild.push({
        source: "Spellcasting Services",
        percentage: pct,
        desc: magPri < 60
          ? "Fees for identification, minor enchanting, and divination. Adventurers and merchants both pay well for reliable magical services."
          : "A busy market for spell services — identification, augury, message sending, and contract-grade enchanting brings steady coin.",
      });
    }

    // HIGH: arcane industry — enchanting contracts, research, magical item market
    // Available from city+ when mages' guild or academy present
    if (magPri >= 65 && hasMagesGuild && tierIdx >= 4) {
      const pct = Math.round(Math.max(10, magPri / 7));
      incomeBuild.push({
        source: ecoStressFlags.magicFillsVoid ? "Arcane Economy" : "Arcane Industry",
        percentage: pct,
        desc: ecoStressFlags.magicFillsVoid
          ? "Magic has absorbed functions normally provided by conventional trade, government, and religion. Arcane licences, guild dues, and service fees constitute the primary revenue base."
          : "Enchanting contracts, magical research commissions, and the licensing of spellcasting practitioners. The mages' guild contributes meaningfully to civic revenue.",
      });
      // Bonus: enchanting multiplier boosts metalwork/crafts income when present
      // (represented as a cross-chain enhancement note in the existing income entries)
      if (magPri >= 75 && (hasInst("armourer") || hasInst("weaponsmith") || hasInst("jewel"))) {
        incomeBuild.push({
          source: "Enchanted Goods Premium",
          percentage: Math.round(magPri / 18),
          desc: "Weapons, armour, and jewellery command a premium once enchanted. The local arcanists increase the margin on craft exports.",
        });
      }
    }
  }const v=generateTradeIncomeStreams(tier, institutions, tradeRoute, goodsToggles, { ...config });(ne=v.incomeBonuses)==null||ne.forEach(ee=>incomeBuild.push(ee)),
  ecoStressFlags.merchantArmy&&incomeBuild.push({
    source: "Security Contracts",
    percentage: 12,
    desc: "Guild-funded private security surcharges — effectively a privatised protection tax on trade."
  }),
  safetyProfile.blackMarketCapture>10&&(()=>{
    // Unified criminal economy income — uses raw bmc as weight so normalized % matches Shadow Economy section
    const bmc = safetyProfile.blackMarketCapture;
    const crimInsts = safetyProfile.criminalInstitutions || [];
    const hasGuild    = crimInsts.some(i => i.toLowerCase().includes('guild') || i.toLowerCase().includes('thieves'));
    const hasMarket   = crimInsts.some(i => i.toLowerCase().includes('black market') || i.toLowerCase().includes('underground'));
    const hasSmuggling= crimInsts.some(i => i.toLowerCase().includes('smuggl') || i.toLowerCase().includes('front'));
    const label = hasGuild && hasMarket  ? 'Criminal Syndicate Revenue'
                : hasGuild               ? "Thieves' Guild Revenue"
                : hasSmuggling           ? 'Smuggling Network Revenue'
                : bmc >= 20              ? 'Shadow Economy (untaxed)'
                : 'Black Market Revenue';
    const desc = `An estimated ${bmc}% of economic activity flows through unofficial channels — ${
      hasGuild    ? 'guild-organised fencing, extortion, and black market trade' :
      hasSmuggling? 'smuggling margins, contraband networks, and protection rackets' :
                    'untaxed trade, fencing, and criminal margins'
    }. This income stays in the settlement but flows to criminal actors, not the public treasury.`;
    incomeBuild.push({ source: label, percentage: bmc, desc, isCriminal: true });
  })(),
  incomeBuild.length===0&&incomeBuild.push({
    source: "Subsistence Production",
    percentage: 100,
    desc: "Barter and in-kind exchange; no significant monetary income. Survival is the economy."
  });if(!isSubsistenceOnly){
    // Resource trade income — only when trade routes exist
    const ee=(v.localProduction||[
    ]).map(function(K){
      return(typeof K=="string"?K: K.name||"").toLowerCase()
    }),
    E=(v.exports||[
    ]).map(function(K){
      return(typeof K=="object"?K.product||K.chain||"": K||"").toLowerCase()
    }),
    _=function(K){
      return institutions.some(function(V){
        return(V.name||"").toLowerCase().includes(K)
      })
    },
    O=function(K){
      return incomeBuild.some(function(V){
        return(V.source||"").toLowerCase().includes(K.toLowerCase())
      })
    },
    F=config.nearbyResources||[
    ],
    X=function(){
      var K=[
      ].slice.call(arguments);return F.some(function(V){
        return K.some(function(de){
          return V.includes(de)
        })
      })
    };if((ee.some(function(K){
      return K.includes("grain")||K.includes("wheat")||K.includes("rye")||K.includes("barley")
    })||E.some(function(K){
      return K.includes("grain")||K.includes("cereal")
    }))&&!O("grain")&&!O("agricultural")&&incomeBuild.push({
      source: "Grain Sales",
      percentage: Math.max(6,
      Math.round(ecoInstFlags.economyOutput/9)),
      desc: X("grain_field",
      "fertile_flood")?"Surplus from local harvest sold to nearby settlements and passing merchants — steady income tied to the growing season.": "Grain purchased from farming regions and resold or processed locally; margin depends on stable supply routes."
    }),
    (ee.some(function(K){
      return K.includes("wool")||K.includes("fleece")||K.includes("cloth")||K.includes("textile")
    })||E.some(function(K){
      return K.includes("wool")||K.includes("textile")||K.includes("cloth")
    }))&&(_("weav")||_("fuller")||_("cloth"))&&!O("wool")&&!O("textile")&&incomeBuild.push({
      source: "Wool & Textile Trade",
      percentage: Math.max(8,
      Math.round(ecoInstFlags.economyOutput/7)),
      desc: X("grazing_land")?"Local flocks provide raw wool; weavers and fullers convert SEVERITY to cloth sold across the region.": "Wool bought from pastoral regions and processed locally — value-add trade dependent on consistent supply."
    }),
    (X("iron_deposit","coal_deposit","precious_metal")||(
      (ee.some(function(K){return K.includes("iron")||K.includes("ore");})||
       E.some(function(K){return K.includes("iron")||K.includes("ore");}))&&_("smith")
    ))&&!O("iron")&&!O("metal")&&incomeBuild.push({
      source: "Iron & Metalwork",
      percentage: Math.max(8,
      Math.round(ecoInstFlags.economyOutput/7)),
      desc: X("iron_deposit",
      "coal_deposit",
      "precious_metal")?"Local ore feeds the smithy directly — metalwork income is not trade-route dependent.": "Iron imported from mining regions and worked locally; this income stream is vulnerable to supply disruption."
    }),
    X("managed_forest","forest_access","timber_rights")&&!O("timber")&&!O("lumber")&&incomeBuild.push({
      source: "Timber Trade",
      percentage: Math.max(7,
      Math.round(ecoInstFlags.economyOutput/8)),
      desc: X("managed_forest",
      "shipbuilding_timber",
      "hunting_ground")?"Local forest provides sustainable timber revenue; managed felling and sawmilling keep production consistent.": "Timber sourced from more distant forests and resold or processed locally — trade route dependent."
    }),
    (ee.some(function(K){
      return K.includes("fish")||K.includes("herring")||K.includes("cod")||K.includes("salt")
    })||E.some(function(K){
      return K.includes("fish")||K.includes("herring")
    }))&&!O("fish")&&!O("maritime")&&incomeBuild.push({
      source: "Fish & Maritime Produce",
      percentage: Math.max(8,
      Math.round(ecoInstFlags.economyOutput/8)),
      desc: "Catch landed and sold fresh or preserved; salt fish are a major regional export commodity."
    }),
    (ee.some(function(K){
      return K.includes("stone")||K.includes("granite")||K.includes("marble")||K.includes("limestone")
    })||E.some(function(K){
      return K.includes("stone")||K.includes("quarry")
    }))&&!O("stone")&&!O("quarry")&&incomeBuild.push({
      source: "Stone Quarrying",
      percentage: Math.max(6,
      Math.round(ecoInstFlags.economyOutput/10)),
      desc: X("stone_quarry",
      "gemstone")?"Local quarry provides dressed stone to regional builders — reliable income with low transport overhead.": "Stone masons work imported material; the quarrying income notation reflects processing margin only."
    }),
    goodsToggles&&Object.keys(goodsToggles).length>0){
      const K=/_good_(.+)$/;Object.entries(goodsToggles).forEach(function(V){
        const de=V[
          0
        ].match(K);if(!de||!V[
          1
        ].force)return;const fe=de[
          1
        ];!O(fe)&&!incomeBuild.some(function(ge){
          return(ge.source||"").toLowerCase().includes(fe.toLowerCase())
        })&&incomeBuild.push({
          source: fe+" Trade",
          percentage: Math.max(5,
          Math.round(ecoInstFlags.economyOutput/12)),
          desc: "Revenue from locally produced "+fe.toLowerCase()+" sold to merchants and neighboring settlements."
        })
      })
    }
  }// ── Stage 3: Income normalization ───────────────────────────────────────────
  const incomeMultiplier    = priorityToMultiplier(ecoInstFlags.economyOutput);
  const incomeWeighted      = incomeBuild.map(ee => ({ ...ee, weight: ee.percentage * incomeMultiplier }));
  const incomeTotalWeight   = incomeWeighted.reduce((sum, e) => sum + e.weight, 0) || 1;
  const incomeNormalized    = incomeWeighted.map(ee => ({
    ...ee,
    percentage: Math.round(ee.weight / incomeTotalWeight * 100),
    priorityNote: null
  }));
  // (legacy alias block removed)
  const D=incomeNormalized.reduce((ee,E)=>ee+E.percentage,0);if(incomeNormalized.length>0&&D!==100){
    const ee=incomeNormalized.reduce((E,
    _,
    O)=>_.percentage>incomeNormalized[
      E
    ].percentage?O: E,
    0);incomeNormalized[
      ee
    ].percentage+=100-D
  }const W=config.stressTypes||[
  ];let U=[
    ...v.necessityImports||[
    ]
  ];(W.includes("under_siege")||W.includes("famine"))&&(U.includes("Grain")||U.push("Grain"),
  U.includes("Salt")||U.push("Salt")),
  W.includes("under_siege")&&(U.includes("Iron")||U.push("Iron (weapons)")),
  W.includes("plague_onset")&&(U.includes("Medicinal herbs")||U.push("Medicinal herbs"));const re=W.includes("under_siege")?config.tradeRouteAccess==="port"?v.exports.slice(0,
  3).map(ee=>`${ee} (naval route only)`): [
  ]: W.includes("occupied")?v.exports.slice(0,
  5).map(ee=>`${ee} (taxed by occupation)`): [
    ...(['crossroads','port','river'].includes(tradeRoute))?(v.transit||[
    ]).map(ee=>`${ee} (transit)`):[
    ]
  ],
  ie=v.imports.slice(0,
  8),
  q=[
    ...U.map(ee=>ee).filter(ee=>!ie.some(E=>E.toLowerCase().includes(ee.toLowerCase()))),
    ...ie
  ].slice(0,
  10);
  const P=v.isEntrepot;
  const I=v.transit;if(goodsToggles&&Object.keys(goodsToggles).length>0){
    const ee=/_good_(.+)$/;Object.entries(goodsToggles).forEach(function(E){
      const _=E[
        0
      ],
      O=E[
        1
      ],
      F=_.match(ee);if(!F)return;const X=F[
        1
      ];if(O.force)re.some(function(K){
        return K.toLowerCase().includes(X.toLowerCase())
      })||re.push(X),
      v.localProduction&&!v.localProduction.some(function(K){
        return K.toLowerCase().includes(X.toLowerCase())
      })&&v.localProduction.push(X);else if(O.allow===!1){
        for(let K=re.length-1;K>=0;K--)re[
          K
        ].toLowerCase().includes(X.toLowerCase())&&re.splice(K,
        1);if(v.localProduction)for(let K=v.localProduction.length-1;K>=0;K--)v.localProduction[
          K
        ].toLowerCase().includes(X.toLowerCase())&&v.localProduction.splice(K,
        1)
      }
    })
  }const H=[
  ];{
    const E=[
      "thorp",
      "hamlet",
      "village",
      "town",
      "city",
      "metropolis"
    ].indexOf(tier),
    _=(institutions||[
    ]).map(function(fe){
      return(fe.name||"").toLowerCase()
    }),
    O=function(fe){
      return _.some(function(ge){
        return ge.includes(fe)
      })
    },
    F=config.stressTypes||[
    ],
    X=ecoInstFlags.militaryEffective||0,
    K=ecoInstFlags.criminalEffective||0,
    V=ecoInstFlags.economyOutput||0;if(E>=2&&X>=60&&(O("mercenary")||O("garrison")||O("barracks")||O("professional guard"))){
      const fe=X>=80?"Military services — standing army leasing, siege engineering, garrison contracts": O("mercenary")?"Mercenary services — trained companies available for hire": "Military services — garrison contracts and armed escort";re.some(function(ge){
        return ge.toLowerCase().includes("military")||ge.toLowerCase().includes("mercenary")
      })||re.push(fe)
    }const de=E>=4?.3: E===3?.1: 0;if(de>0&&!re.some(function(fe){
      return fe.toLowerCase().includes("slave")
    })){
      const fe=(K>55?.15: 0)+(F.includes("occupied")?.1: 0),
      ge=Math.min(de+fe,
      .55);if(_rng()<ge){
        const ke=V>55&&O("market"),
        dt=F.includes("occupied")||K>65,
        Gt=ke&&dt?"Slave trade — transit market for human trafficking; imported labour and exported captives": ke?"Slave labour — purchased workforce for agricultural estates, mines, and domestic service": dt?"Captive trade — war captives and debtors sold through established trafficking networks": "Slave trade — human trafficking and forced labour; legally tolerated or actively regulated";re.push(Gt),
        ke&&!q.some(function(Me){
          return Me.toLowerCase().includes("slave")
        })&&q.push("Enslaved labour — purchased from regional trafficking networks")
      }
    }
  }
  const nearbyResourcesArr=config.nearbyResources||[];
  const hasResource=(V)=>nearbyResourcesArr.some(de=>V.some(fe=>de.includes(fe)));
  const stressArr=config.stressTypes||[];
  const intendedStressArr=config.intendedStressTypes||[];
  const isUnderStress=stressArr.includes("under_siege")||intendedStressArr.includes("under_siege")||(institutions||[]).some(function(V){
    const de=(V.name||"").toLowerCase();return de.includes("war council")||de.includes("siege")||de.includes("rationing");
  });
  const isIsolatedRoute=tradeRoute==="isolated";
  // Teleportation infrastructure counts as trade access — don't treat as stockpile-only
  const _hasMagicTradeForDeps = hasTeleportationInfra(institutions || [], config);
  const isEffectivelyIsolated = isIsolatedRoute && !_hasMagicTradeForDeps;
  (institutions||[
    ]).forEach(function(V){
      const de=V.name||"",
      fe=TRADE_DEPENDENCY_NEEDS[
        de
      ];if(!fe||hasResource(fe.resources)||H.some(function(dt){
        return dt.institution===de&&dt.resource===fe.label
      }))return;const ge=isUnderStress||isEffectivelyIsolated?"critical": "vulnerable",
      ke=isUnderStress?"Supply route severed — operating at minimal capacity or shut down.": isEffectivelyIsolated?"No trade access — running on existing stockpiles only.": _hasMagicTradeForDeps&&isIsolatedRoute?"Supplied via magical trade infrastructure — teleportation imports replace road access.": "Dependent on trade routes. Siege, road closure, or blockade would impair operations.";H.push({
        institution: de,
        category: V.category||"",
        resource: fe.label,
        detail: fe.detail,
        severity: ge,
        impact: ke,
        affectedServices: fe.svcs||[
        ]
      })
    })  // ── Stage 4: Chain derivation — compute before return object ─────────────────
  const depletedResources = config.nearbyResourcesDepleted || [];
  const activeChainsList  = computeActiveChains(institutions || [], (config.nearbyResources || []), tier, tradeRoute, H, depletedResources, config.priorityMagic ?? 50);
  const chainStresses     = (config.stressTypes || []).concat(config.intendedStressTypes || []);
  const chainExports      = deriveExportsFromChains(activeChainsList, config.nearbyResources || [], tier, tradeRoute, chainStresses, goodsToggles, depletedResources, institutions || []);
  const _hasMagicTrade    = hasTeleportationInfra(institutions || [], config);
  const chainImports      = deriveImportsFromChains(activeChainsList, config.nearbyResources || [], tier, tradeRoute, U, _hasMagicTrade);
  const chainLocalProd    = deriveLocalProductionFromChains(activeChainsList, config.nearbyResources || []);
  const instServices      = deriveInstitutionalServices(institutions || []);
  const serviceExports    = deriveServiceExports(instServices);

  // Depleted resources at town+ scale: settlement needs to import what it can no longer
  // produce in sufficient quantity — local exhaustion triggers trade dependency
  const TIER_DEPLETED_IMPORT_THRESHOLD = ['town','city','metropolis'];
  if (depletedResources.length > 0 && TIER_DEPLETED_IMPORT_THRESHOLD.includes(tier)) {
    const DEPLETED_IMPORT_MAP = {
      grain_fields:    'Bulk grain (local fields depleted)',
      iron_deposits:   'Iron ore (local mines exhausted)',
      managed_forest:  'Timber (local forests cleared)',
      grazing_land:    'Livestock and dairy (pastures depleted)',
      river_fish:      'Salted fish (local waters over-fished)',
      fishing_grounds: 'Salted fish (fishing grounds exhausted)',
      coal_deposits:   'Coal and fuel (local seams exhausted)',
      stone_quarry:    'Dressed stone (local quarry depleted)',
      clay_pits:       'Clay and ceramics materials (pits exhausted)',
    };
    depletedResources.forEach(res => {
      const importLabel = DEPLETED_IMPORT_MAP[res];
      if (importLabel) chainImports.push(importLabel);
    });
  }

  // ── Finished goods demand-gap imports/exports ─────────────────────────────
  // Computes supply/demand gaps for finished goods (arms, ritual supplies, etc.)
  // and pushes results into chainImports / chainExports before final assembly.
  computeFinishedGoodsDemand(
    tier, tradeRoute, institutions, config.nearbyResources || [],
    chainExports, chainImports
  );

  // Override heuristic arrays with chain-derived values (clean mutation — before return)
  re.length = 0;
  chainExports.forEach(e => re.push(e));
  serviceExports.forEach(e => { if (!re.includes(e)) re.push(e); });
  q.length = 0;
  chainImports.forEach(i => q.push(i));

  // ── Isolated thorp/hamlet: subsistence economy — no imports or exports ────
  // These settlements have no trade route and cannot participate in external trade.
  // Their economy is purely self-contained subsistence. Clear all trade goods.
  const _isSubsistenceIsolated = ['thorp','hamlet'].includes(tier) && tradeRoute === 'isolated';
  if (_isSubsistenceIsolated) {
    re.length = 0;  // no exports
    q.length  = 0;  // no imports
    // Also clear active chains that require trade — keep only subsistence-relevant ones
    activeChainsList.forEach((ch, idx) => {
      // Keep food security chains, remove trade/manufacturing/entrepot chains
      if (ch.entrepot || ch.needKey === 'trade_entrepot') {
        ch.status = 'unexploited';
      }
    });
  }
  if (v.localProduction) {
    v.localProduction.length = 0;
    chainLocalProd.forEach(p => v.localProduction.push(p));
  }
  const activeChains = activeChainsList;

// ── Neighbour economic bias post-processing ──────────────────────────────
  // Apply competition/complementarity effects based on relationship type.
  // 'compete' mode: boost chance of same exports as neighbour (we fight for same market)
  // 'complement' mode: de-emphasise goods the neighbour already exports (we specialize elsewhere)
  // 'suppress' mode: hostile trade embargo reduces export variety
  // 'dependent' mode: prioritize goods the neighbour needs (patron/client)
  const _econBias = config._neighbourEconBias || {};
  const _econMode = config._neighbourEconMode || 'independent';
  if (Object.keys(_econBias).length > 0 && !_isSubsistenceIsolated) {
    // Apply weights: filter or reorder exports based on bias
    if (_econMode === 'suppress') {
      // Hostile: cap exports to a max of 4 items (trade embargo simulation)
      if (re.length > 4) re.splice(4);
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
        if (weight > 1.3 && !re.some(g => g.toLowerCase().includes(bk.toLowerCase()))) {
          // Add patron-needed good if we don't already export it
          if (re.length < 8) re.push(bk.charAt(0).toUpperCase() + bk.slice(1));
        }
      }
    }
  }

  // Sort income sources by percentage desc, then alphabetically — must be LAST
  incomeNormalized.sort((a, b) => b.percentage - a.percentage || a.source.localeCompare(b.source));
  // ── Base prosperity model ───────────────────────────────────────────────
  // Inputs: route (channel), tier (capacity), economy slider (investment),
  //         magic (tier-scaled production), threat (drag), military (dual effect),
  //         defensibility (security premium on trade routes)
  const _PLABELS = ["Subsistence","Poor","Moderate","Comfortable","Prosperous","Wealthy"];

  // 1. Route base — how much commerce can flow at all
  const _routeBase = (tradeRoute==="crossroads"||tradeRoute==="port") ? 3  // Comfortable
                   : tradeRoute==="isolated" ? (
                       ["thorp","hamlet"].includes(tier) ? 0
                       : hasTeleportationInfra(institutions, config) && config.magicExists !== false ? 2
                       : 1
                     )
                   : 2; // road/river → Moderate

  // 2. Tier development bonus — division of labour, institutional multiplication
  const _tierBonus = {thorp:0, hamlet:0, village:0, town:1, city:1, metropolis:2}[tier] || 0;

  // 3. Economy slider — institutional investment in commerce (±1.25 range)
  const _priEcon = config.priorityEconomy ?? 50;
  const _ecoBonus = (_priEcon - 50) / 40;

  // 4. Magic bonus — tier-scaled productive output (only meaningful at town+, only when active)
  const _priMagic = config.priorityMagic ?? 0;
  const _magicActive = config.magicExists !== false && _priMagic > 25;
  const _magicTierScale = {thorp:0, hamlet:0, village:0.3, town:0.6, city:1.0, metropolis:1.4}[tier] || 0;
  const _magicBonus = _magicActive ? Math.max(0, (_priMagic - 25) / 75) * _magicTierScale : 0;

  // 5. Threat penalty — disrupted trade, insecure fields, rerouted merchants
  const _monsterThreat = config.monsterThreat || "frontier";
  const _threatPenalty = _monsterThreat === "plagued" ? -1
                        : _monsterThreat === "frontier" ? -0.5 : 0;

  // 6. Military effects — heavy spending diverts capital; but security enables trade
  const _priMil = config.priorityMilitary ?? 50;
  const _milDrain = _priMil > 75 ? -0.3 : 0;  // garrison costs crowd out investment
  const _hasWalls    = instNames.some(n => n.toLowerCase().includes("wall") || n.toLowerCase().includes("palisade") || n.toLowerCase().includes("citadel"));
  const _hasGarrison = instNames.some(n => n.toLowerCase().includes("garrison") || n.toLowerCase().includes("barracks"));
  const _defPremium  = (_hasWalls && _hasGarrison && (tradeRoute==="crossroads"||tradeRoute==="port")) ? 0.3 : 0;

  // Food security modifier — computed here so it can cap/floor base prosperity
  const _foodSec = generateFoodSecurity(tier, institutions, { ...config, tradeRouteAccess: tradeRoute });
  const _foodMod = _foodSec.prosperityMod;

  // 7. Institutional depth — count of Economy+Crafts institutions weighted vs tier expectation
  // A city with 12 economy institutions is richer than one with 4, regardless of slider.
  // Expectations calibrated to actual generator output averages per tier.
  const _econInstCount   = institutions.filter(i => i.category === 'Economy' || i.category === 'Crafts').length;
  const _tierExpectedEco = { thorp:3, hamlet:8, village:13, town:22, city:13, metropolis:14 }[tier] || 8;
  // Bonus: +1 if well above expectation, -1 if well below. Bounded ±1 to avoid dominating.
  const _depthBonus = _econInstCount >= _tierExpectedEco * 1.30 ? 1
                    : _econInstCount >= _tierExpectedEco * 0.75 ? 0
                    : -1;

  // 8. Income diversity bonus — many distinct income sources = genuinely complex economy
  const _incomeCount = incomeNormalized?.length || 0;
  const _diversityBonus = _incomeCount >= 7 ? 0.5 : _incomeCount >= 5 ? 0.25 : 0;

  // Combine — cap at Prosperous (4); Wealthy only through narrative modifier (strong econOut)
  let _baseIdx = Math.min(4, Math.max(0,
    Math.round(_routeBase + _tierBonus + _ecoBonus + _magicBonus + _threatPenalty + _milDrain + _defPremium + _depthBonus + _diversityBonus)
  ));
  // Apply food security floor/cap/bonus to base index BEFORE narrative modifiers
  if (_foodMod) {
    if (_foodMod.type === 'cap')     _baseIdx = Math.min(_baseIdx, _foodMod.value);
    if (_foodMod.type === 'penalty') _baseIdx = Math.max(0, _baseIdx + _foodMod.value);
    if (_foodMod.type === 'bonus')   _baseIdx = Math.min(4, _baseIdx + Math.round(_foodMod.value));
  }
  // Thorp/hamlet prosperity floor: subsistence communities with required institutions
  // functioning normally should never label below Poor — they're not in crisis, they're
  // just small. Struggling is reserved for active stress/famine on top of structural poverty.
  const _hasRequiredEco = institutions.some(i => {
    const n = (i.name||'').toLowerCase();
    return ['subsistence farming','access to external mill','farmland',
            'town granary','weekly market','city granari','market square',
            'district markets','state granary','inns and taverns (district)'].some(k => n.includes(k));
  });
  if (['thorp','hamlet','village','town','city','metropolis'].includes(tier) && _hasRequiredEco && !(config.stressTypes||[]).length) {
    _baseIdx = Math.max(_baseIdx, 1); // floor at Poor for clean subsistence settlements
  }

  let Z = _PLABELS[_baseIdx];
  return (tradeRoute==="isolated" && ["thorp","hamlet"].includes(tier)) && (Z="Subsistence"),
  {
    tier: tier,
    prosperity: generateEconomicNarrative(Z, config, institutions),
    situationDesc: computeEconomicViability(config, tier,
    institutions),
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
    economicComplexity: function(){
      var ee=incomeNormalized.length,
      E=re.length,
      _=hasInst("market",
      "trading",
      "merchant",
      "guild");return tier==="metropolis"||tier==="city"?ee>=9?"Highly diversified — multiple major revenue streams": ee>=6?"Diversified — broad institutional economic base": "Concentrated — fewer revenue streams than scale suggests": tier==="town"?_&&ee>=6?"Diversified market economy": ee>=4?"Specialized production and trade": "Limited — narrow economic base for this scale": tier==="village"?_?"Mixed subsistence and market": E>=4?"Agricultural surplus with trade links": "Subsistence with minor surplus": E>=3?"Subsistence with surplus": "Subsistence — survival economy"
    }()
  }
};

// generateEconomicViability
export 
// sortBySeverity
const sortBySeverity = r=>{const s={[SEVERITY.CRITICAL]:0,[SEVERITY.IMPLAUSIBLE]:1,[SEVERITY.DEPENDENCY]:2,[SEVERITY.INEFFICIENCY]:3};return r.sort((o,d)=>s[o.severity]-s[d.severity])};
export const generateEconomicViability = (settlement, terrainType = null, nearbyResources = []) => {
  const issues      = [];
  const warnings    = [];
  const suggestions = [];
  const plotHooks   = [];

  const { population, institutions: insts, config, economicState } = settlement;
  const tier   = settlement.tier || config?.tier || config?.settType || 'village';
  const cfg    = { ...config || {}, tier };
  const terrain = terrainType ? TERRAIN_DATA[terrainType] : null;

  // Food/supply viability
  const foodAnalysis = buildFactionList(population, terrain, insts, cfg);
  issues.push(...foodAnalysis.issues);
  warnings.push(...foodAnalysis.warnings);
  plotHooks.push(...foodAnalysis.plotHooks);

  // Resource chain analysis
  if (terrain && nearbyResources.length > 0) {
    const resourceAnalysis = computeFactionPowers(insts, terrain, nearbyResources, cfg);
    issues.push(...resourceAnalysis.issues);
    warnings.push(...resourceAnalysis.warnings);
    suggestions.push(...(resourceAnalysis.suggestions || []));
  }

  // Water/infrastructure dependencies
  const waterAnalysis = buildPowerNarrative(insts, terrain, cfg);
  issues.push(...waterAnalysis.issues);
  warnings.push(...waterAnalysis.warnings);
  suggestions.push(...(waterAnalysis.suggestions || []));

  // Food balance plot hooks
  const stabilityAnalysis = generateStabilityScore(population, terrain, insts, cfg, foodAnalysis.foodBalance);
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
    const isSieged = stresses.includes('under_siege') || (insts || []).some(i => (i.name || '').toLowerCase().includes('war council') || (i.name || '').toLowerCase().includes('rationing'));
    const critical = tradeDeps.filter(d => d.severity === 'critical');
    const vulnerable = tradeDeps.filter(d => d.severity === 'vulnerable');
    const hasMagicTradeInst = hasTeleportationInfra(insts || [], cfg);
    if (critical.length > 0 && !hasMagicTradeInst) // magic trade = not really on stockpiles
      issues.push({ severity: 'warning', type: isSieged ? 'stress_consequence' : 'isolation_dependency', title: isSieged ? 'Siege: Supply Chain Disruption' : 'Isolated: Stockpile Dependency', description: (isSieged ? `${critical.length} institution${critical.length > 1 ? 's' : ''} critically impaired by siege: ` : `${critical.length} institution${critical.length > 1 ? 's' : ''} operating on stockpiles only (isolated trade): `) + critical.map(d => d.institution).join(', ') + '.' });
    if (vulnerable.length >= 3)
      warnings.push({ severity: 'note', title: 'Trade Dependencies', description: `${vulnerable.length} institution${vulnerable.length > 1 ? 's' : ''} depend on imported materials (${vulnerable.slice(0, 3).map(d => d.resource).join(', ')}). Standard for this trade route — vulnerability if supply is disrupted.` });
  }

  const criticalIssues = issues.filter(i => i.severity === SEVERITY.CRITICAL);
  const isViable = criticalIssues.length === 0;

  // Split warnings: dependency notes (normal supply chain) vs real structural issues
  const dependencyWarnings = warnings.filter(w => w.severity === SEVERITY.DEPENDENCY);
  const structuralWarnings = warnings.filter(w => w.severity !== SEVERITY.DEPENDENCY);

  return {
    viable:       isViable,
    issues:       sortBySeverity(issues),
    warnings:     sortBySeverity(structuralWarnings),   // real problems only
    dependencies: sortBySeverity(dependencyWarnings),   // supply chain notes (informational)
    suggestions,
    plotHooks,
    summary: buildConflict(isViable, issues, structuralWarnings, plotHooks),
    metrics: { foodBalance: foodAnalysis.foodBalance, tradeAccess: cfg?.tradeRouteAccess || 'unknown', criticalIssueCount: criticalIssues.length, dependencyCount: dependencyWarnings.length, warningCount: structuralWarnings.length },
  };
};
