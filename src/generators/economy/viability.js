/**
 * economy/viability.js — resource-chain, water, and structural/priority viability checks, plus the viability assembler and its summary + severity sort.
 */

import { SEVERITY, TIER_ORDER, popToTier, tierAtLeast } from '../../data/constants.js';
import { institutionalCatalog } from '../../data/institutionalCatalog.js';
import { SUPPLY_CHAIN_NEEDS } from '../../data/goods/chains.js';
import { INDUSTRY_WATER_NEEDS } from '../../data/goods/chains.js';
import { TERRAIN_DATA } from '../../data/geographyData.js';
import { getPriorities, getTradeRouteFeatures, hasTeleportationInfra, evaluateWaterDependency } from '../helpers.js';
import { priorityToCategory } from './prosperity.js';
import { deriveFoodBalanceAnalysis, deriveSupplyRiskAnalysis } from './foodBalance.js';
import { formatCount } from '../../domain/formatNumber.js';
import { buildViabilitySummary } from '../../domain/viabilitySummary.js';
// A PRINT goes through the label seam, a match never does (domain/display/institutionDisplayName.js):
// the sentences below name institutions to a reader, and a city's 'Bakers (5-15)' is its bakers.
import { institutionDisplayName } from '../../domain/display/institutionDisplayName.js';
import { deriveIsolationSupport } from '../isolationSupport.js';
import {
  isMaterializedCustomContent,
  nativeSemanticName,
  nativeSemanticNames,
} from '../../domain/content/customContentSemanticAuthority.js';
import { isTradeRouteDisconnected } from '../../domain/tradeRouteSemantics.js';
import { waterOf } from '../../domain/facts/water.js'; import { factsOf } from '../../domain/facts/factsOf.js'; // CENSUS-1f: one line
import { hasMarketInstitution } from '../../domain/facts/market.js';
import { defenseTraditionNamesOf } from '../../domain/institutions/defenseInstitutionBuckets.js';

const SUPPLY_CHAIN_GROUPS = /** @type {Array<{ chains: Array<any> }>} */ (Object.values(SUPPLY_CHAIN_NEEDS));


// Food-deficit import coverage channel ladder: FOOD_IMPORT_RATES (imported
// from data/foodImportRates.js) — single source of truth shared with
// foodGenerator and the tick-time stockpile (domain/worldPulse/foodStockpile).



// Tier-plausible institution availability — the SAME model assembleInstitutions
// uses: a settlement of tier T draws only from institutionalCatalog[T] (every tier
// block is complete since the urban-band registry, so no section is merged in), and
// an entry whose own minTier sits above T is skipped. Viability suggestions may only name institutions the
// settlement could actually generate at its tier — a thorp's grain gap reads
// "Mill", never a hundred-item catalog dump with slave markets in it.
const tierCatalogNameCache = new Map();

const catalogNamesAvailableAtTier = (tier) => {
  const t = TIER_ORDER.includes(tier) ? tier : 'village';
  if (tierCatalogNameCache.has(t)) return tierCatalogNameCache.get(t);
  const sections = [institutionalCatalog[t] || {}];
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


/** The isolation note that says a town remains viable (UPKEEP-9: left out where that is not true). */
const LOCALLY_SUSTAINED = 'Locally Sustained Isolation';
/** The hedge wizards a small place's catalogue may hold, the one magic house a hamlet or a village can take. */
const SMALL_HEDGE_HOUSES = Object.freeze(['Traveling hedge wizard', 'Hedge wizard']);

// Cap chain suggestions at a readable count: top 3 by relevance (the matching
// chains' own processor ordering — canonical processors lead each chain list).
const MAX_CHAIN_SUGGESTIONS = 3;


// buildViabilitySummary MOVED to src/domain/viabilitySummary.js (LANDING-6, record 28), so the hook
// filter re-derives the same sentence after it drops a false hook.


// deriveResourceChainAnalysis
const deriveResourceChainAnalysis = (institutions, terrain, nearbyResources, config = {}) => {
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
      allProcessors.some((name) => (
        matchesProcessor(nativeSemanticName(i), name)
      ))
    );

    if (processingInsts.length === 0 && reachable.length > 0) {
      suggestions.push({
        category: 'Resource Chain',
        title: `Opportunity: process ${resource}`,
        description: `${resource} is available locally. Add ${reachable.slice(0, MAX_CHAIN_SUGGESTIONS).map(institutionDisplayName).join(' or ')} to unlock higher-value exports.`,
      });
    } else if (processingInsts.length > 0) {
      const missing = reachable
        .filter((name) => !institutions.some((i) => (
          matchesProcessor(nativeSemanticName(i), name)
        )))
        .slice(0, MAX_CHAIN_SUGGESTIONS);
      if (missing.length === 0) return; // complete for its tier — no junk gap
      const outputs = [...new Set(matchingChains.flatMap((c) => c.outputs || []))].slice(0, 4);
      suggestions.push({
        category: 'Resource Chain',
        title: `Incomplete chain: ${resource}`,
        description: `Processing ${resource} but missing ${missing.map(institutionDisplayName).join(', ')} for the full chain.`,
        impact: `Exports intermediate goods instead of final products (${outputs.map((o) => o.label || o).join(', ') || 'finished goods'}). Lower profit margins.`,
        suggestedFixes: [`Add ${missing.join(' and ')} to complete the production chain`],
      });
    }
  });

  // Processing catalogs describe optional opportunities, not hard operating
  // dependencies. A parish church can participate in a hot-springs pilgrimage
  // chain when one exists; it does not require hot springs merely to function.
  // Likewise, a quarry listed beside an iron mine in a heterogeneous mining
  // chain does not consume iron ore. Actual operating dependencies are already
  // carried by `economicState.tradeDependencies`; elevating every dormant
  // optional chain into an IMPLAUSIBLE institution failure produced hundreds
  // of false diagnoses. Keep the useful active-resource suggestions above and
  // leave hard requirements to explicit dependency metadata.

  return { issues, warnings, suggestions };
};


// deriveWaterDependencyAnalysis
//
// ⚠ WATER IS READ FROM THE RECORD (lane REVIEW-INTAKE unit 3, 2026-11-06). A place has water
// when ANY of these holds: (i) the record carries a water row (WATER_ROW_NAMES, by native
// name), (ii) its terrain is riverside or coastal, (iii) it trades by river or port. It used to
// read the terrain alone (the route only when no terrain was given) and never the record's own
// rows, so 1,569 warnings in 476 of the 1,000 soak settlements sat beside a water row. Only a
// PROCESS-water industry (resourceChains.js :: INDUSTRY_WATER_NEEDS, matched by exact name) can
// lack a supply; a mill's MOTIVE power is the DM's to picture and raises nothing.
// MERGE-R2 (the chair's ruling 3): (i) is the record read, the source; (ii) and (iii) are CENSUS-1b
// unit A (c)'s water home (`facts/water.js :: waterOf`, over `waterAccessKind`: coastal or riverside
// terrain, a river or port route — the same three tests), so a port route on hills is not dry.
const WATER_ROW_NAMES = new Set(['Water source', 'Multiple water sources', 'Aqueduct or water system', 'Advanced water infrastructure']);
const PROCESS_WATER_BY_NAME = new Map(
  Object.values(INDUSTRY_WATER_NEEDS).flatMap((need) => (need.names || []).map((name) => [name, need])),
);
const deriveWaterDependencyAnalysis = (institutions, terrainType, config) => {
  const issues = [];
  const warnings = [];
  const suggestions = [];
  const native = (institutions || []).filter((inst) => !isMaterializedCustomContent(inst));
  const hasWater = native.some((inst) => WATER_ROW_NAMES.has(nativeSemanticName(inst)))
    || waterOf({ config: { terrainType: terrainType ?? config?.terrainType ?? null, tradeRouteAccess: config?.tradeRouteAccess ?? null } }).navigable;
  if (hasWater) return { issues, warnings, suggestions };

  native.forEach((inst) => {
    const waterNeed = PROCESS_WATER_BY_NAME.get(nativeSemanticName(inst));
    if (!waterNeed?.required) return;
    const name = institutionDisplayName(inst.name);
    warnings.push({
      severity: SEVERITY.DEPENDENCY,
      category: 'Water Dependency',
      title: `${name}: no water supply`,
      description: `${name} has no water supply: ${waterNeed.reason.charAt(0).toLowerCase()}${waterNeed.reason.slice(1)}, and the settlement has no water source, no river or coast, and no river or port route.`,
      impact: 'Severely reduced productivity without water access.',
      suggestedFixes: waterNeed.alternatives.map((alt) => `Add ${alt}`),
    });
  });

  return { issues, warnings, suggestions };
};


// generatePowerDynamics
const generatePowerDynamics = (population, institutions, economicState, config = {}, sizeTier = null) => {
  const issues = [];
  const warnings = [];
  const suggestions = [];
  const pri = getPriorities(config);
  const instNames = nativeSemanticNames(institutions)
    .map(name => name.toLowerCase());

  // City+ without markets
  // COHERENCE-AGREE-3 (REVIEW-AGREE F9): the market is the market home's answer (facts/market.js), not a third name list.
  const hasMarket = hasMarketInstitution(institutions), cityScale = isCityScale(sizeTier, population);
  if (cityScale && !hasMarket) {
    warnings.push({
      severity: SEVERITY.CRITICAL,
      category: 'Economic Structure',
      title: 'No Trade Infrastructure',
      description: `Population of ${formatCount(population)} without any markets or trade institutions.`,
      impact: 'Economy cannot support this population.',
      suggestedFixes: ["Add Market Square, Merchants' Quarter, or Trade Guild"],
    });
  }

  // Insufficient craft industries for size
  const craftCount = instNames.filter(
    (n) => n.includes('guild') || n.includes('craft') || n.includes('workshop')
  ).length;
  if (cityScale && craftCount < 2) {
    const water = evaluateWaterDependency(config, institutions);
    if (water.strength === 'strong') {
      suggestions.push({
        category: 'Economic Diversity',
        title: 'Trade-dependent craft economy',
        description: `Craft guilds operate on imported materials: sustained by strong ${config?.tradeRouteAccess} trade. Vulnerable to supply disruption.`,
      });
    } else {
      warnings.push({
        severity: water.strength === 'moderate' ? SEVERITY.INEFFICIENCY : SEVERITY.IMPLAUSIBLE,
        category: 'Economic Diversity',
        title: 'Insufficient Craft Industries',
        description: `Population of ${formatCount(population)} with only ${craftCount} craft institution${craftCount !== 1 ? 's' : ''}. ${water.note}`,
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
  if (isTradeRouteDisconnected(route)) {
    const tierLabel = config?.tier || 'village';
    const isTownPlus = getTradeRouteFeatures(tierLabel);
    const support = config?._isolationSupport || deriveIsolationSupport({
      tier: tierLabel,
      tradeRoute: route,
      institutions,
      config,
    });
    const supportPaths = (support.paths || [])
      .map(path => path.type.replace(/_/g, ' '))
      .join(', ');

    if (isTownPlus && support.deficit > 0) {
      warnings.push({
        severity: SEVERITY.DEPENDENCY,
        category: 'Economic Isolation',
        title: 'Isolation Support Gap',
        // UPKEEP-9 (#ww-522): the page shows no capacity figures (the machinery's sum), only what the paths do.
        description: `This ${tierLabel}'s ${supportPaths || 'local support'} does not yet cover the full cost of isolation.`,
        impact: 'Specialist goods and bad-season reserves remain vulnerable until the gap is closed.',
        suggestedFixes: [
          'Strengthen the local foodshed, reserves, seasonal access, or patronage',
          'Add a physical trade route',
          ...(
            config?.magicExists !== false
            && Number(config?.priorityMagic ?? 50) >= 66
              ? ['Add magical transit as a last-resort substitution']
              : []
          ),
        ],
      });
    } else if (isTownPlus && support.magicDependent) {
      warnings.push({
        severity: SEVERITY.DEPENDENCY,
        category: 'Economic Isolation',
        title: 'Magically-Sustained Isolation',
        description: `${tierLabel.charAt(0).toUpperCase() + tierLabel.slice(1)} closes its isolation-support gap through magical transit.`,
        impact:
          'Its mundane support paths are insufficient. Disrupted magic would reopen the gap without a physical route or stronger local base.',
        suggestedFixes: [
          'Maintain magical infrastructure at all costs',
          'Add a physical route or stronger local support as redundancy',
        ],
      });
    } else if (isTownPlus) {
      warnings.push({
        severity: 'note',
        category: 'Economic Isolation',
        title: LOCALLY_SUSTAINED,
        description: `${tierLabel.charAt(0).toUpperCase() + tierLabel.slice(1)} remains viable through ${supportPaths || 'its local support base'}.`,
        impact: 'The settlement is isolated, not inexplicably disconnected from the means of survival.',
        suggestedFixes: ['Protect the support paths that make isolation viable'],
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
        // UPKEEP-9 (#576): the slider and its figure are machinery; the page says what the town is set on.
        title: 'Set on Arms Without Defences',
        description: `The ${config?.tier || 'settlement'} is set on arms, but it has no walls, garrison, or barracks.`,
        impact: 'Military investment without physical infrastructure produces limited security.',
        suggestedFixes: ['Add Town Walls or Garrison'],
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
        title: 'Strong Faith Without Clergy',
        description: 'Faith runs strong here, but no house of worship stands.',
        impact: 'Religious fervour without institutional anchoring produces instability.',
        suggestedFixes: ['Add a house of worship, a temple or a monastery'],
      });
    }
  }

  // Magic priority checks. Small tiers may be unable to support an academy or
  // tower, but a very-high player dial must still leave an explicit receipt
  // instead of disappearing behind tier gates.
  if (priorityToCategory(pri.magic) === 'very_high') {
    // UPKEEP-9: "no arcane house stands" reads the roster through the defence traditions' home (its casters: a
    // scroll scribe and an academy of magic among them; its teleportation circle), and the alchemist as before:
    // the five name tests missed a Teleportation circle in 10 of 13 towns that printed the line.
    const magicHouses = defenseTraditionNamesOf(institutions);
    const hasMagicInst = magicHouses.arcane || magicHouses.teleport || instNames.some((n) => n.includes('alchemist'));
    if (!hasMagicInst) {
      const smallSettlement = !getTradeRouteFeatures(config?.tier || 'village');
      // UPKEEP-9 (the hedge suggestion): a small place is offered only the hedge wizard its own tier's catalogue
      // holds (a hamlet's travelling one, a village's own); a thorp's catalogue holds none, so it is offered nothing.
      const hedge = SMALL_HEDGE_HOUSES.filter((name) => catalogNamesAvailableAtTier(config?.tier || 'village').includes(name.toLowerCase()));
      warnings.push({
        severity: SEVERITY.INEFFICIENCY,
        category: 'Magical Priorities',
        title: smallSettlement
          ? 'Strong Magic: Informal Practice'
          : 'Strong Magic Without Arcane Houses',
        description: smallSettlement
          ? `Magic runs strong here, but a ${config?.tier || 'village'} is too small for formal arcane houses. Practice is local, itinerant, or domestic rather than institutional.`
          : 'Magic runs strong here, but no arcane house stands.',
        impact: smallSettlement
          ? 'The setting choice is present, but reliable commercial magical services remain scarce.'
          : 'Magical potential is unrealised. Adventurers will find no magical services.',
        suggestedFixes: smallSettlement
          ? (hedge.length > 0 ? [`Add ${hedge.map(institutionDisplayName).join(' or ')}`] : [])
          : ["Add Hedge Wizard, Alchemist Shop, or Wizard's Tower"],
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
        title: 'Given to Crime: No Criminal or Guard Houses',
        description: 'The place is given to crime, but neither criminal organisations nor guard houses stand here.',
        impact: 'High crime without institutions creates ungoverned chaos rather than structured underworld.',
        suggestedFixes: ["Add Thieves' Guild, Black Market, or City Watch"],
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
      // UPKEEP-9 (#823 #824 #825): no slider and no figure; and the impact no longer denies the merchants it may hold.
      description: `Banks stand here, but the ${config?.tier || 'settlement'} does little trade.`,
      impact: 'Its banks find little business to do.',
      suggestedFixes: [`Give the ${config?.tier || 'settlement'} more trade, or remove the banks`],
    });
  }

  return { issues, warnings, suggestions };
};


// sortBySeverity
export const sortBySeverity = (r) => {
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

/**
 * THE WAR FACT'S ONE HOME AT THE HOOK SITE (COHERENCE-AGREE-3, REVIEW-AGREE F4). The hook site's partial
 * record carried no crisis container, so `warStateOf` (domain/facts/warState.js) read every town at peace
 * and the war line could never print. The birth's crises are the stress types it resolved (resolveStress);
 * handed over as the container the final record carries, the site reads the war from the same home and
 * the same reader the coherence receipt reads (measured on 1,426 births: the site and the final record agree
 * on every one). @param {{ stressTypes?: unknown }} cfg
 */
const birthStressorsOf = (cfg) => (Array.isArray(cfg?.stressTypes) ? cfg.stressTypes.filter((type) => typeof type === 'string').map((type) => ({ type })) : []);

export const generateEconomicViability = (settlement, terrainType = null, nearbyResources = []) => {
  const issues = [];
  const warnings = [];
  const suggestions = [];
  const plotHooks = [];

  const { population, institutions: insts, config, economicState } = settlement;
  const tier = settlement.tier || config?.tier || config?.settType || 'village';
  const cfg = { ...(config || {}), tier };
  const terrain = terrainType ? TERRAIN_DATA[terrainType] : null;

  // Food/supply viability. Thread the canonical economicState.foodSecurity so the
  // viability foodBalance is a VIEW of the single-writer food model, not a second
  // independent derivation that can disagree on the deficit sign (generators-domain-4).
  const foodAnalysis = deriveFoodBalanceAnalysis(population, terrain, insts, cfg, economicState?.foodSecurity || null);
  issues.push(...foodAnalysis.issues);
  warnings.push(...foodAnalysis.warnings);
  plotHooks.push(...foodAnalysis.plotHooks);

  // Resource chain analysis
  if (terrain && nearbyResources.length > 0) {
    const resourceAnalysis = deriveResourceChainAnalysis(insts, terrain, nearbyResources, cfg);
    issues.push(...resourceAnalysis.issues);
    warnings.push(...resourceAnalysis.warnings);
    suggestions.push(...(resourceAnalysis.suggestions || []));
  }

  // Water/infrastructure dependencies
  const waterAnalysis = deriveWaterDependencyAnalysis(insts, terrainType, cfg);
  issues.push(...waterAnalysis.issues);
  warnings.push(...waterAnalysis.warnings);
  suggestions.push(...(waterAnalysis.suggestions || []));

  // Food balance plot hooks
  const stabilityAnalysis = deriveSupplyRiskAnalysis(population, terrain, insts, cfg, foodAnalysis.foodBalance, () => factsOf({ institutions: insts, config: cfg, tier, economicState, stressors: birthStressorsOf(cfg) })); // CENSUS-1f: the outlook hooks resolve (the fields at hand only, R-Z)
  issues.push(...stabilityAnalysis.issues);
  warnings.push(...stabilityAnalysis.warnings);
  plotHooks.push(...stabilityAnalysis.plotHooks);

  // Power dynamics checks
  const powerAnalysis = generatePowerDynamics(population, insts, economicState, cfg, settlement.tier || config?.tier || null);
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
          nativeSemanticName(i).toLowerCase().includes('war council')
          || nativeSemanticName(i).toLowerCase().includes('rationing')
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
          critical.map((d) => institutionDisplayName(d.institution)).join(', ') +
          '.',
      });
    if (vulnerable.length >= 3)
      warnings.push({
        severity: 'note',
        title: 'Trade Dependencies',
        description: `${vulnerable.length} institution${vulnerable.length > 1 ? 's' : ''} depend on imported materials (${vulnerable
          .slice(0, 3)
          .map((d) => d.resource)
          .join(', ')}). Standard for this trade route: vulnerability if supply is disrupted.`,
      });
  }

  const criticalIssues = issues.filter((i) => i.severity === SEVERITY.CRITICAL);
  const isViable = criticalIssues.length === 0;
  // UPKEEP-9 (#ww-522): "remains viable through ... seasonal access" is not written beside a town that is not viable,
  // nor under a siege that has cut the roads its support paths need: silence, not a false sentence.
  if (!isViable || (cfg.stressTypes || []).includes('under_siege')) {
    for (let i = warnings.length - 1; i >= 0; i -= 1) if (warnings[i].title === LOCALLY_SUSTAINED) warnings.splice(i, 1);
  }

  // Split warnings: dependency notes (normal supply chain) vs real structural issues.
  // ONE dependency array, computed once and read by all three of its consumers below —
  // the published list, the sentence that counts it and the metric that reports it. A
  // second spelling here is what let the headline and the list disagree (FIX-G1 above).
  const dependencies = sortBySeverity(warnings.filter((w) => w.severity === SEVERITY.DEPENDENCY));
  const structuralWarnings = warnings.filter((w) => w.severity !== SEVERITY.DEPENDENCY);

  return {
    viable: isViable,
    issues: sortBySeverity(issues),
    warnings: sortBySeverity(structuralWarnings), // real problems only
    dependencies, // supply chain notes (informational)
    suggestions,
    plotHooks,
    // The summary sees the dependency warnings that are presented in their own
    // collection above. Otherwise a food-import dependency can be correctly
    // itemized and then contradicted one line later by an "economically
    // self-sufficient" headline.
    summary: buildViabilitySummary(
      isViable,
      issues,
      dependencies,
      plotHooks,
      foodAnalysis.foodBalance,
    ),
    metrics: {
      foodBalance: foodAnalysis.foodBalance,
      tradeAccess: cfg?.tradeRouteAccess || 'unknown',
      criticalIssueCount: criticalIssues.length,
      dependencyCount: dependencies.length,
      warningCount: structuralWarnings.length,
    },
  };
};

// IS THERE A REAL MARKET HERE? — moved whole to the market home (CENSUS-1 wave 0, fact 5), which
// reads the LIVE roster; re-exported under its SIZE-lane name for this module's importers. (Rung 1's
// LANDING-2 moved the same function to src/domain/marketInstitution.js for the domain -> generators
// boundary; at the rung-2 merge the census's home serves both intents and that copy is retired.)
export { hasMarketInstitution };

/**
 * IS THIS A CITY-SCALE PLACE? The two structural cuts below ("no trade infrastructure",
 * "insufficient craft industries") used to read a fixed 5,000-person cut, the old bands'
 * town/city edge spelled as a literal. They read the TIER now, so when the scale program
 * moves the bands the cuts move with them (X-46 moved them; the stamp's city cut is 2,250). A
 * place with no known tier falls back to its population's tier (`popToTier`), and a place with
 * neither is not city-scale. At that ruling's bands the readings agreed (tests/generators/smallPlaceMarket.test.js). The
 * assembler passes the settlement's OWN tier, never its 'village' default.
 *
 * (The prose wiring census's holder citations into this file name their writes by SYMBOL since
 * REVIEW-INTAKE-3 R8 (rule 32), so a line inserted above no longer drifts them.)
 * @param {unknown} tier
 * @param {unknown} population
 * @returns {boolean}
 */
export function isCityScale(tier, population) {
  const rung = typeof tier === 'string' && TIER_ORDER.includes(tier)
    ? tier
    : (typeof population === 'number' && Number.isFinite(population) ? popToTier(population) : null);
  return rung !== null && tierAtLeast(rung, 'city');
}
