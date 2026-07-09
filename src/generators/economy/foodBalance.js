/**
 * economy/foodBalance.js — food-balance analysis and food-supply / trade-disruption plot hooks for economic viability.
 */

import { customDeps as _customDeps } from '../../lib/dependencyEngine.js';
import { SEVERITY } from '../../data/constants.js';
import { FOOD_IMPORT_RATES } from '../../data/foodImportRates.js';
import { getTradeRouteFeatures } from '../helpers.js';


// ECONOMIC_CONSTANTS
const ECONOMIC_CONSTANTS = {
  PER_CAPITA_NEED: 2,
  FARMER_PRODUCTION: 6,
  AGRICULTURAL_WORKFORCE: 0.4,
  STORAGE_BUFFER: 1.3,
};


// deriveFoodBalanceAnalysis
export const deriveFoodBalanceAnalysis = (population, terrain, institutions, config) => {
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
    stressNotes.push('Plague: agricultural workforce decimated by illness — fields understaffed.');
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
      impact: 'Export opportunity — could generate significant trade income.',
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
      description: `Settlement of ${population.toLocaleString()} lacks a granary — cannot buffer harvests or maintain strategic food reserves.`,
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


// deriveSupplyRiskAnalysis
export const deriveSupplyRiskAnalysis = (population, terrain, institutions, config, foodBalance) => {
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
