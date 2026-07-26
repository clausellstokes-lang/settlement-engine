/**
 * economy/viability.js — resource-chain, water, and structural/priority viability checks, plus the viability assembler and its summary + severity sort.
 */

import { SEVERITY, TIER_ORDER } from '../../data/constants.js';
import { institutionalCatalog } from '../../data/institutionalCatalog.js';
import { SUPPLY_CHAIN_NEEDS } from '../../data/supplyChainData.js';
import { INDUSTRY_WATER_NEEDS } from '../../data/resourceChains.js';
import { TERRAIN_DATA } from '../../data/geographyData.js';
import { getPriorities, getTradeRouteFeatures, hasTeleportationInfra, evaluateWaterDependency } from '../helpers.js';
import { priorityToCategory } from './prosperity.js';
import { deriveFoodBalanceAnalysis, deriveSupplyRiskAnalysis } from './foodBalance.js';
import { formatCount } from '../../domain/formatNumber.js';
import { deriveIsolationSupport } from '../isolationSupport.js';
import {
  isMaterializedCustomContent,
  nativeSemanticName,
  nativeSemanticNames,
} from '../../domain/content/customContentSemanticAuthority.js';
import { isTradeRouteDisconnected } from '../../domain/tradeRouteSemantics.js';

const SUPPLY_CHAIN_GROUPS = /** @type {Array<{ chains: Array<any> }>} */ (Object.values(SUPPLY_CHAIN_NEEDS));


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
const buildViabilitySummary = (isViable, issues, warnings, plotHooks, foodBalance) => {
  const criticalCount = issues.filter((i) => i.severity === SEVERITY.CRITICAL).length;
  const implausibleCount = issues.filter((i) => i.severity === SEVERITY.IMPLAUSIBLE).length;
  const dependencyCount = [...issues, ...warnings].filter((i) => i.severity === SEVERITY.DEPENDENCY).length;
  const dailyNeed = Number(foodBalance?.dailyNeed) || 0;
  const uncoveredDeficit = Math.max(0, Number(foodBalance?.deficit) || 0);
  const rawDeficit = Math.max(uncoveredDeficit, Number(foodBalance?.rawDeficit) || 0);
  const deficitPercent = dailyNeed > 0
    ? Math.round((uncoveredDeficit / dailyNeed) * 100)
    : Math.max(0, Math.round(Number(foodBalance?.deficitPercent) || 0));
  const rawDeficitPercent = dailyNeed > 0
    ? Math.round((rawDeficit / dailyNeed) * 100)
    : deficitPercent;
  if (criticalCount > 0) {
    const issueLabel = criticalCount === 1 ? 'issue' : 'issues';
    const verb = criticalCount === 1 ? 'prevents' : 'prevent';
    return `✗ NOT VIABLE: ${criticalCount} critical ${issueLabel} ${verb} settlement survival.`;
  }
  if (implausibleCount > 3) return ` IMPLAUSIBLE: ${implausibleCount} historical inconsistencies break believability.`;
  if (dependencyCount > 0)
    return `✓ VIABLE: Settlement can survive but has ${dependencyCount} operational dependenc${dependencyCount > 1 ? 'ies' : 'y'} that require active management. ${plotHooks.length} plot hooks available.`;
  if (uncoveredDeficit > 0)
    return `△ VIABLE WITH PROVISIONING STRAIN: ${deficitPercent}% of daily food need remains uncovered.`;
  if (rawDeficit > 0)
    return `✓ VIABLE WITH PROVISIONING SUPPORT: imports, reserves, or extraordinary supply cover ${rawDeficitPercent}% of daily food need.`;
  return '✓ VIABLE: Settlement is economically self-sufficient and historically plausible.';
};


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
        description: `${resource} is available locally. Add ${reachable.slice(0, MAX_CHAIN_SUGGESTIONS).join(' or ')} to unlock higher-value exports.`,
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
        description: `Processing ${resource} but missing ${missing.join(', ')} for the full chain.`,
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
const deriveWaterDependencyAnalysis = (institutions, terrain, config) => {
  const issues = [];
  const warnings = [];
  const suggestions = [];
  const route = config?.tradeRouteAccess || 'unknown';
  const hasWater = terrain ? WATER_ROUTES.includes(terrain.name.toLowerCase()) : route === 'river' || route === 'port';

  institutions.forEach((inst) => {
    if (isMaterializedCustomContent(inst)) return;
    // This record is access to somebody else's mill, not a local water-powered
    // industry. Its water source belongs at the remote site; evaluating it as
    // an on-site mill invented a local river dependency.
    if (/^access to external mill\b/i.test(nativeSemanticName(inst))) return;
    const waterNeed = Object.entries(INDUSTRY_WATER_NEEDS).find(
      ([key]) =>
        inst.name.toLowerCase().includes(key.toLowerCase()) ||
        key.toLowerCase().includes(inst.name.toLowerCase().split(' ')[0])
    )?.[1];

    if (waterNeed?.required) {
      const hasAlternative = waterNeed.alternatives.some(
        alternative => institutions.some(institution => (
          nativeSemanticName(institution).includes(alternative)
        )),
      );
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


// generatePowerDynamics
const generatePowerDynamics = (population, institutions, economicState, config = {}) => {
  const issues = [];
  const warnings = [];
  const suggestions = [];
  const pri = getPriorities(config);
  const instNames = nativeSemanticNames(institutions)
    .map(name => name.toLowerCase());
  const hasInst = (...kws) => kws.some((kw) => instNames.some((n) => n.includes(kw)));

  // City+ without markets
  const hasMarket = hasInst('market', 'merchant', 'district');
  if (population > 5000 && !hasMarket) {
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
  if (population > 5000 && craftCount < 2) {
    const water = evaluateWaterDependency(config, institutions);
    if (water.strength === 'strong') {
      suggestions.push({
        category: 'Economic Diversity',
        title: 'Trade-dependent craft economy',
        description: `Craft guilds operate on imported materials — sustained by strong ${config?.tradeRouteAccess} trade. Vulnerable to supply disruption.`,
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
              'Add craft guilds — smiths, weavers, tanners, etc.',
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
        description: `This ${tierLabel} has ${support.capacity}/${support.requiredCapacity} support capacity. Its ${supportPaths || 'local support'} does not yet cover the full cost of isolation.`,
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
        description: `${tierLabel.charAt(0).toUpperCase() + tierLabel.slice(1)} closes its isolation-support gap through magical transit (${support.capacity}/${support.requiredCapacity} capacity).`,
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
        title: 'Locally Sustained Isolation',
        description: `${tierLabel.charAt(0).toUpperCase() + tierLabel.slice(1)} remains viable through ${supportPaths || 'its local support base'} (${support.capacity}/${support.requiredCapacity} capacity).`,
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
        title: 'High Military Priority Without Defences',
        description: 'Military slider is high but the settlement has no walls, garrison, or barracks.',
        impact: 'Military investment without physical infrastructure produces limited security.',
        suggestedFixes: ['Add Town Walls or Garrison'],
        priorityNote: `Military priority is ${pri.military} — defence institutions are expected.`,
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
        priorityNote: `Religion priority is ${pri.religion} — a religious centre is expected.`,
      });
    }
  }

  // Magic priority checks. Small tiers may be unable to support an academy or
  // tower, but a very-high player dial must still leave an explicit receipt
  // instead of disappearing behind tier gates.
  if (priorityToCategory(pri.magic) === 'very_high') {
    const hasMagicInst = instNames.some(
      (n) =>
        n.includes('wizard') ||
        n.includes('mage') ||
        n.includes('alchemist') ||
        n.includes('arcane') ||
        n.includes('enchant')
    );
    if (!hasMagicInst) {
      const smallSettlement = !getTradeRouteFeatures(config?.tier || 'village');
      warnings.push({
        severity: SEVERITY.INEFFICIENCY,
        category: 'Magical Priorities',
        title: smallSettlement
          ? 'High Magic Priority — Informal Practice'
          : 'High Magic Priority Without Arcane Institutions',
        description: smallSettlement
          ? `Magic priority is high, but ${config?.tier || 'village'} scale limits formal arcane infrastructure. Practice is local, itinerant, or domestic rather than institutional.`
          : 'Magic priority is high but no arcane institution is present.',
        impact: smallSettlement
          ? 'The setting choice is present, but reliable commercial magical services remain scarce.'
          : 'Magical potential is unrealised — adventurers will find no magical services.',
        suggestedFixes: smallSettlement
          ? ['Add a tier-plausible hedge practitioner or alchemical workshop']
          : ["Add Hedge Wizard, Alchemist Shop, or Wizard's Tower"],
        priorityNote: `Magic priority is ${pri.magic}; ${
          smallSettlement
            ? 'settlement scale constrains its institutional expression'
            : 'an arcane institution is expected'
        }.`,
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
        title: 'High Crime Priority — No Criminal or Guard Institutions',
        description: 'Criminal slider is high but neither criminal organisations nor guard infrastructure are present.',
        impact: 'High crime without institutions creates ungoverned chaos rather than structured underworld.',
        suggestedFixes: ["Add Thieves' Guild, Black Market, or City Watch"],
        priorityNote: `Criminal priority is ${pri.criminal} — some underworld structure is expected.`,
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
  const waterAnalysis = deriveWaterDependencyAnalysis(insts, terrain, cfg);
  issues.push(...waterAnalysis.issues);
  warnings.push(...waterAnalysis.warnings);
  suggestions.push(...(waterAnalysis.suggestions || []));

  // Food balance plot hooks
  const stabilityAnalysis = deriveSupplyRiskAnalysis(population, terrain, insts, cfg, foodAnalysis.foodBalance);
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
          .join(', ')}). Standard for this trade route — vulnerability if supply is disrupted.`,
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
    // The summary sees ALL warnings, including dependency warnings that are
    // presented in their own collection below. Otherwise a food-import
    // dependency can be correctly itemized and then contradicted one line
    // later by an "economically self-sufficient" headline.
    summary: buildViabilitySummary(
      isViable,
      issues,
      warnings,
      plotHooks,
      foodAnalysis.foodBalance,
    ),
    metrics: {
      foodBalance: foodAnalysis.foodBalance,
      tradeAccess: cfg?.tradeRouteAccess || 'unknown',
      criticalIssueCount: criticalIssues.length,
      dependencyCount: dependencyWarnings.length,
      warningCount: structuralWarnings.length,
    },
  };
};
