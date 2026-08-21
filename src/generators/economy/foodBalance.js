/**
 * economy/foodBalance.js — food-balance analysis and food-supply / trade-disruption plot hooks for economic viability.
 */

import { SEVERITY, tierAtLeast } from '../../data/constants.js';
import { FOOD_IMPORT_RATES } from '../../data/foodImportRates.js';
import {
  getTradeRouteFeatures,
  hasTeleportationInfra,
} from '../helpers.js';
import { formatCount } from '../../domain/formatNumber.js';
import {
  isMaterializedCustomContent,
  nativeSemanticName,
  nativeSemanticNames,
} from '../../domain/content/customContentSemanticAuthority.js';
import { availableNativeResourceKeys } from '../../domain/resourceSemantics.js';
import { resolveTerrain } from '../../domain/resolveTerrain.js';
import {
  hasTradeRouteConnection,
  isTradeRouteDisconnected,
  SEASONAL_ROUTE_FOOD_IMPORT_RATE,
} from '../../domain/tradeRouteSemantics.js';


// ECONOMIC_CONSTANTS
const ECONOMIC_CONSTANTS = {
  PER_CAPITA_NEED: 2,
  FARMER_PRODUCTION: 6,
  AGRICULTURAL_WORKFORCE: 0.4,
  STORAGE_BUFFER: 1.3,
};


// deriveFoodBalanceAnalysis
// `foodSecurity` (economicState.foodSecurity from generateFoodSecurity) is the
// CANONICAL food-economics model; when provided, its production/need/deficit become
// the single source of truth here so the viability foodBalance can never contradict
// the economics model on the deficit sign (generators-domain-4). Optional: a direct
// caller without it gets the legacy local model, byte-identical.
export const deriveFoodBalanceAnalysis = (population, terrain, institutions, config, foodSecurity = null) => {
  const issues = [];
  const warnings = [];
  const plotHooks = [];
  const dailyNeed = population * ECONOMIC_CONSTANTS.PER_CAPITA_NEED;
  const agriCap = terrain ? terrain.agricultureCapacity : 1;
  const stresses = config?.stressTypes || [];
  const resources = availableNativeResourceKeys(config);
  const instNames = nativeSemanticNames(institutions)
    .map(name => name.toLowerCase());
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
  // domain-5: read the RESOLVED tier, not the raw settType sentinel. settType is
  // 'random' on the default path (DEFAULT_CONFIG), so keying off it left the magic-
  // agriculture boost dead for every random-rolled town+ settlement — it only fired
  // when the user explicitly picked 'town'/'city'/'metropolis'. config.tier is the
  // resolved tier the sibling read at :154 already prefers.
  const resolvedTier = config?.tier || config?.settType || '';
  const isMagicHighTier = magPriority > 75 && ['town', 'city', 'metropolis'].includes(resolvedTier);
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
  // [generators-domain-1] second-wave stress types with a food-relevant viabilityNote.
  // (Defense stays coupled via the priorityHelpers effective-score multipliers — no inline
  // defense penalty, which would double-count.) Golden-shifting (G2). Kept byte-identical to
  // foodGenerator.js's production block.
  if (stresses.includes('wartime')) {
    productionMult *= 0.85;
    stressNotes.push('Wartime: conscription has thinned the agricultural workforce, cutting local output.');
  }
  if (stresses.includes('slave_revolt')) {
    productionMult *= 0.8;
    stressNotes.push('Slave revolt: labour-dependent production is disrupted and outlying fields lie idle.');
  }
  if (stresses.includes('mass_migration')) {
    consumptionMult *= 1.15;
    stressNotes.push('Mass migration: an influx of newcomers stresses the food balance beyond normal needs.');
  }

  const dailyProduction =
    (Math.floor(population * ECONOMIC_CONSTANTS.AGRICULTURAL_WORKFORCE) *
      ECONOMIC_CONSTANTS.FARMER_PRODUCTION *
      effectiveAgri *
      productionMult) /
    ECONOMIC_CONSTANTS.STORAGE_BUFFER;
  const adjustedNeed = dailyNeed * consumptionMult;
  const effectiveRoute = routeOverride || config?.tradeRouteAccess || 'isolated';
  const disconnectedRoute = isTradeRouteDisconnected(effectiveRoute);
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
  const importCoverageRate = !disconnectedRoute
    ? (effectiveRoute === 'port'
      ? 0.7
      : effectiveRoute === 'crossroads'
        ? 0.6
        : effectiveRoute === 'river'
          ? 0.5
          : effectiveRoute === 'road'
            ? 0.35
            // A pass is a seasonal channel: heavy caravan traffic while it is
            // open, nothing at all once winter shuts it. The annualized rung
            // sits below road and above the isolated trickle.
            : effectiveRoute === 'mountain_pass'
              ? SEASONAL_ROUTE_FOOD_IMPORT_RATE
          : 0)
    : Math.max(_magicTradeRate * _maintainerMult, _minorRouteRate);
  const canImportFood = importCoverageRate > 0 && rawDeficit > 0;
  const importCoverage = canImportFood ? Math.round(rawDeficit * importCoverageRate) : 0;
  // Channel LABEL is a pure function of route + magic infra (independent of the
  // deficit); the actual display is gated on real import coverage at return time
  // (importCoverageFinal > 0), which is byte-identical to the old `!canImportFood`
  // gate on the fallback path and correct on the canonical path.
  // The label is read by a player (dossierViewModel prints it verbatim), so the
  // config token is de-slugged: 'mountain_pass' must arrive as "mountain pass
  // trade". Byte-identical for every single-word route.
  const importChannelLabel = importCoverageRate <= 0
    ? null
    : !disconnectedRoute
      ? `${String(effectiveRoute).replace(/_/g, ' ')} trade`
      : _magicTradeRate * _maintainerMult >= _minorRouteRate
        ? (_hasTeleportCircle ? 'teleportation circle' : _siegeIsolation ? 'airship runs (impaired by siege)' : 'airship traffic')
        : 'minor routes and sanctioned caravans';

  // Magic food offset: druid/divine/arcane can supplement food production
  // Only applies when magic is active and relevant institutions exist. The caster
  // booleans are hoisted (they depend only on institutions + priorities, not on the
  // deficit) so the canonical reconcile below can reuse them.
  const magicOn = config?.magicExists !== false;
  const magPri = config?.priorityMagic ?? 0;
  const relPri = config?.priorityReligion ?? 0;
  const hasDruidFood =
    magPri >= 30 &&
    instNames.some((n) =>
      ['druid circle', 'grove shrine', 'elder grove', "warden's lodge", 'sacred grove'].some((k) => n.includes(k))
    );
  const hasDivineFood =
    relPri >= 55 &&
    instNames.some((n) =>
      ['cathedral', 'monastery', 'great cathedral', 'parish church', 'friary'].some((k) => n.includes(k))
    );
  const hasArcaneFood =
    magPri >= 50 && instNames.some((n) => ['wizard', 'mages', 'arcane', 'spellcasting'].some((k) => n.includes(k)));
  const magicFoodRate = hasDruidFood ? 0.65 : hasDivineFood ? 0.4 : hasArcaneFood ? 0.3 : 0;
  const magicFoodNoteFor = () =>
    hasDruidFood ? 'Druidic cultivation provides partial food supplement'
      : hasDivineFood ? 'Divine provision supplements food shortfall'
        : hasArcaneFood ? 'Arcane Plant Growth provides minor food supplement'
          : '';
  let magicFoodOffset = 0;
  let magicFoodNote = '';
  if (magicOn && rawDeficit > importCoverage && magicFoodRate > 0) {
    const remaining = rawDeficit - importCoverage;
    magicFoodOffset = Math.round(remaining * magicFoodRate);
    magicFoodNote = magicFoodNoteFor();
  }

  let deficit = Math.max(0, rawDeficit - importCoverage - magicFoodOffset);
  let deficitPercent = adjustedNeed > 0 ? (deficit / adjustedNeed) * 100 : 0;

  // ── CANONICAL RECONCILE (generators-domain-4: single-writer food model) ────
  // generateFoodSecurity (economicState.foodSecurity) is the SINGLE WRITER of the
  // food economics — the one model that feeds prosperity AND the tick foodStockpile.
  // The viability foodBalance is a VIEW of it and must never contradict it on the
  // deficit SIGN or magnitude. The two independently recomputed production/need/
  // deficit using a different terrain-agri source, a different magic model, and —
  // in foodSecurity only — seeded crop-fortune variance, so they could disagree
  // (one reporting surplus while the other reported deficit). When the canonical
  // foodSecurity is threaded in, its dailyProduction/dailyNeed/deficit REPLACE the
  // locally-recomputed numbers. Reads an already-computed object → draws NO rng
  // (crop-fortune was already rolled once, at economicState time). The import/magic
  // attribution is rebuilt to sum EXACTLY to the canonical gap so the dossier's
  // channel breakdown stays internally consistent. Fallback (no foodSecurity — a
  // direct unit caller) keeps the legacy local model byte-identical.
  let dailyProductionFinal = Math.round(dailyProduction);
  let dailyNeedFinal       = Math.round(adjustedNeed);
  let surplusFinal         = surplus;
  let importCoverageFinal  = importCoverage;
  let rawDeficitFinal      = rawDeficit;
  const canonical = foodSecurity
    && Number.isFinite(foodSecurity.dailyProduction)
    && Number.isFinite(foodSecurity.dailyNeed);
  if (canonical) {
    dailyProductionFinal = foodSecurity.dailyProduction;
    dailyNeedFinal       = foodSecurity.dailyNeed;
    surplusFinal         = dailyProductionFinal - dailyNeedFinal;
    rawDeficitFinal      = Math.max(0, -surplusFinal);
    // foodSecurity returns deficitPct (rounded) + dailyNeed, not a deficit-lbs
    // field; reconstruct the lbs from them. deficitPct === 0 ⇔ deficit === 0, so
    // the SIGN is preserved exactly. Clamp into [0, rawDeficit].
    const cDeficitPct = Number.isFinite(foodSecurity.deficitPct) ? foodSecurity.deficitPct : 0;
    deficit = Math.max(0, Math.min(rawDeficitFinal, Math.round((cDeficitPct / 100) * dailyNeedFinal)));
    deficitPercent = cDeficitPct;
    // Rebuild attribution so importCoverage + magicFoodOffset === rawDeficit − deficit.
    const totalCoverage = Math.max(0, rawDeficitFinal - deficit);
    const importPortion = canImportFood
      ? Math.min(totalCoverage, Math.round(rawDeficitFinal * importCoverageRate))
      : 0;
    const magicResidual = Math.max(0, totalCoverage - importPortion);
    if (magicResidual > 0 && magicOn && magicFoodRate > 0) {
      importCoverageFinal  = importPortion;
      magicFoodOffset      = magicResidual;
      magicFoodNote        = magicFoodNoteFor();
    } else {
      // No magic caster to credit: the whole covered gap is import-carried.
      importCoverageFinal  = totalCoverage;
      magicFoodOffset      = 0;
      magicFoodNote        = '';
    }
  }

  if (surplusFinal < 0) {
    if (deficitPercent > 50) {
      if (disconnectedRoute) {
        // An uncovered deficit is a survival fact, not merely an economic
        // mood. Isolated settlements have no routine import channel that can
        // make this gap disappear off-screen, so the viability verdict must
        // fail rather than claim self-sufficiency while the food ledger says
        // otherwise.
        issues.push({
          severity: SEVERITY.CRITICAL,
          category: 'Food Production',
          title: 'Uncovered Local Food Deficit',
          description: `Settlement cannot cover ~${Math.round(deficit)} lbs of food per day (${Math.round(deficitPercent)}% of needs) and has no dependable trade route.`,
          impact: 'The current population cannot survive this provisioning gap without a new support path.',
          suggestedFixes: [
            'Strengthen the local foodshed or reduce the supported population',
            'Establish seasonal access, patronage, or a dependable trade route',
            'Add reserves only as a temporary buffer, not a permanent food source',
          ],
        });
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
          hook: `The ${effectiveRoute} trade route is cut off (bandits/war/natural disaster). Settlement has only ${Math.round((dailyProductionFinal / dailyNeedFinal) * 30)} days of food remaining. Famine threatens within weeks.`,
          severity: 'high',
        });
      }
    } else if (deficitPercent > 20) {
      if (disconnectedRoute) {
        issues.push({
          severity: SEVERITY.CRITICAL,
          category: 'Food Production',
          title: 'Uncovered Local Food Deficit',
          description: `Settlement cannot cover ~${Math.round(deficit)} lbs of food per day (${Math.round(deficitPercent)}% of needs) and has no dependable trade route.`,
          impact: 'The current population is not viable without another provisioning path.',
          suggestedFixes: [
            'Strengthen the local foodshed',
            'Establish seasonal access, patronage, or a dependable trade route',
          ],
        });
      } else {
        warnings.push({
          severity: SEVERITY.DEPENDENCY,
          category: 'Food Production',
          title: 'Food Import Requirement',
          description: `Settlement imports ~${Math.round(deficit)} lbs of grain/day (${Math.round(deficitPercent)}% of needs) via ${effectiveRoute}.`,
          impact: 'Creates trade dependency but manageable.',
          suggestedFixes: ['Increase local food production', 'Maintain strategic grain reserves'],
        });
      }
      plotHooks.push({
        category: 'Trade Politics',
        hook: 'Price of grain spikes due to poor harvest elsewhere. Can settlement afford imports? Do merchants exploit the situation?',
        severity: 'medium',
      });
    }
  } else if (surplusFinal > dailyNeedFinal * 0.5) {
    warnings.push({
      severity: SEVERITY.INEFFICIENCY,
      category: 'Food Production',
      title: 'Agricultural Surplus',
      description: `Settlement produces ${Math.round((surplusFinal / dailyNeedFinal) * 100)}% more food than needed.`,
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
      description: `Settlement of ${formatCount(population)} lacks a granary — cannot buffer harvests or maintain strategic food reserves.`,
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
      dailyNeed: Math.round(dailyNeedFinal),
      dailyProduction: Math.round(dailyProductionFinal),
      deficit: Math.round(deficit),
      deficitPercent: Math.round(deficitPercent),
      surplus: Math.round(Math.max(surplusFinal, 0)),
      agricultureModifier: agriCap,
      stressModifier: productionMult < 1 ? productionMult : undefined,
      importCoverage: importCoverageFinal > 0 ? Math.round(importCoverageFinal) : undefined,
      rawDeficit: rawDeficitFinal > deficit ? Math.round(rawDeficitFinal) : undefined,
      // Attribution: which channel carries the imports, and how much of the
      // gap magic closes. Without these the dossier shows a deficit smaller
      // than needed-minus-produced with no visible explanation.
      importChannel: (importCoverageFinal > 0 && importChannelLabel) ? importChannelLabel : undefined,
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
/**
 * Does the settlement have a local processor for a must-import staple, so importing
 * the raw resource is a genuine dependency (not just a passthrough)?
 *
 * Needles are matched against the lowercased institution name; the grain branch
 * excludes sawmills ('sawmill'.includes('mill') is true). At city+ the match broadens
 * to the renamed/consolidated institutions ('City granaries', 'Specialized
 * metalworkers') the town-tier needles miss — without it, 72.5% of metropolises
 * reported ZERO deps.
 *
 * @param {Array<{ name?: string, tags?: string[] }>} institutions
 * @param {string} resource
 * @param {{ tier?: string }} config
 * @returns {boolean}
 */
export function hasImportProcessor(institutions, resource, config) {
  const bigTier = tierAtLeast(config?.tier, 'city');
  const r = resource.toLowerCase();
  return institutions.some((i) => {
    const t = i.tags || [];
    if (isMaterializedCustomContent(i)) return false;
    const n = nativeSemanticName(i).toLowerCase();
    return (
      (r.includes('grain')  && (
        (
          n.includes('mill')
          && !n.includes('sawmill')
          && !n.includes('access to external mill')
        )
        || (bigTier && n.includes('granar'))
      )) ||
      (r.includes('timber') && (n.includes('sawmill') || (bigTier && n.includes('carpenter')))) ||
      (r.includes('metal')  && (n.includes('smith') || n.includes('smelter') || (bigTier && (n.includes('metalwork') || t.includes('metalwork')))))
    );
  });
}

/**
 * Push tier-scaled baseline provisioning dependencies onto `warnings`.
 *
 * The per-capita food model lets a dense city/metropolis on fertile terrain appear
 * self-sufficient (it "grows" its own staples within its walls), reporting zero import
 * dependency — false: a real urban centre imports staple food + bulk materials from its
 * hinterland. Without this, 72.5% of metropolises reported ZERO economic dependencies
 * (tier-inverted). City+ only; mutates `warnings` in place.
 *
 * @param {Array<Object>} warnings  Warning list mutated in place.
 * @param {{ tier?: string, tradeRouteAccess?: string }} config
 * @param {{ deficitPercent?: number }} [foodBalance]
 * @param {boolean} [hasExternalSupply]
 */
export function appendProvisioningAtScaleDeps(
  warnings,
  config,
  foodBalance,
  hasExternalSupply = config?.tradeRouteAccess !== 'none',
) {
  if (!tierAtLeast(config?.tier, 'city') || !hasExternalSupply) return;

  // Skip the staple-food baseline when the food model already shows a deficit
  // (it emits a 'Food Production' DEPENDENCY that owns the grain import), or when
  // a per-resource grain import already fired. Prevents a cross-function
  // double-count under stress: a famine on fertile terrain otherwise produced
  // BOTH 'Food Import Requirement' and this baseline.
  // >= 20 (not > 20): the food model fires its warning on the UNROUNDED deficit
  // > 20, but foodBalance.deficitPercent is rounded (20.4 -> 20), so a strict
  // > 20 here let the boundary cases through and double-counted.
  const foodDeficit = (foodBalance?.deficitPercent || 0) >= 20;
  const hasGrainDep = warnings.some(w => w.severity === SEVERITY.DEPENDENCY && /grain|food/i.test(`${w.title} ${w.category || ''}`));
  if (!hasGrainDep && !foodDeficit) {
    warnings.push({
      severity: SEVERITY.DEPENDENCY,
      category: 'Provisioning at Scale',
      title: 'Imports staple food at urban scale',
      description: `A ${config.tier} cannot grow its staples within its walls; it depends on a steady grain supply from the surrounding region.`,
      impact: 'A disrupted supply line means hunger within days.',
      suggestedFixes: ['Secure and protect the regional grain-supply network'],
    });
  }
  // Bulk materials/fuel — every city/metro imports these at scale, so the headline
  // metric is never a false zero for a dense urban centre (city was still 11.7% zero on
  // grain/timber/metal-free mustImport terrains like hills before this floor).
  warnings.push({
    severity: SEVERITY.DEPENDENCY,
    category: 'Provisioning at Scale',
    title: 'Imports bulk materials and fuel',
    description: `A ${config.tier} consumes building materials and fuel faster than any local hinterland can supply.`,
    impact: 'Construction and industry stall when material convoys are interrupted.',
    suggestedFixes: ['Diversify material supply routes and hold strategic reserves'],
  });
  // Imperial-scale finished goods & luxuries — metropolis throughput only (keeps metro
  // dependency count above city).
  if (config?.tier === 'metropolis') {
    warnings.push({
      severity: SEVERITY.DEPENDENCY,
      category: 'Provisioning at Scale',
      title: 'Imports finished goods and luxuries',
      description: 'An imperial metropolis depends on a constant inflow of finished goods, textiles, and luxuries its populace and elite demand.',
      impact: 'Shortfalls drive price spikes, unrest, and loss of prestige.',
      suggestedFixes: ['Maintain long-haul trade relationships and bonded warehousing'],
    });
  }
}

export const deriveSupplyRiskAnalysis = (population, terrain, institutions, config, foodBalance) => {
  const issues = [];
  const warnings = [];
  const hooks = [];
  const route = config?.tradeRouteAccess || 'isolated';
  const hasDeficit = foodBalance.deficit > 0;

  if (hasDeficit) {
    if (route === 'isolated' || route === 'none' || route === 'road') {
      hooks.push({
        category: 'Survival Crisis',
        hook: 'Settlement is starving. Desperate villagers might turn to banditry, or a merchant offers to supply food... at a terrible price (debt servitude? dark pact?).',
        severity: 'critical',
      });
    } else if (route !== 'isolated') {
      hooks.push({
        category: 'Trade Monopoly',
        hook: 'A single merchant guild controls grain imports. They raise prices 300%. Do locals rebel? Seek alternative suppliers? What price are they willing to pay?',
        severity: 'high',
      });
      if (route === 'river')
        hooks.push({
          category: 'River Control',
          hook: 'Upstream settlement builds dam or diverts river. Threatens water access AND grain shipments. Diplomacy or war?',
          severity: 'high',
        });
      if (route === 'port' && resolveTerrain(config) === 'coastal')
        hooks.push({
          category: 'Naval Blockade',
          hook: `Enemy fleet or pirates blockade the port. Settlement has ${Math.round((foodBalance.dailyProduction / foodBalance.dailyNeed) * 30)} days of reserves. Hire ships to break blockade? Negotiate? Starve?`,
          severity: 'high',
        });
      if (route === 'road' && hasDeficit)
        hooks.push({
          category: 'Bandit Raids',
          hook: 'Bandits target food caravans. Settlement offers bounty for clearing the trade road. But are the "bandits" actually desperate refugees from elsewhere?',
          severity: 'medium',
        });
    }
  }

  // Viability trade issues flagged by economic state. The terrain's mustImport list
  // (TERRAIN_DATA, e.g. coastal grain/timber) is the live source here — config never
  // carries mustImport. Needles must be lowercase to match the lowercased name, and
  // the grain branch excludes sawmills ('sawmill'.includes('mill') is true).
  const mustImport = terrain?.mustImport || config?.mustImport;
  const hasExternalSupply =
    hasTradeRouteConnection(route)
    || (
      route === 'isolated'
      && FOOD_IMPORT_RATES.minorRoutes > 0
    )
    || hasTeleportationInfra(institutions, config);
  if (mustImport) {
    mustImport.forEach((resource) => {
      if (hasImportProcessor(institutions, resource, config)) {
        if (!hasExternalSupply) return;
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
            hook: "Timber supplier forest is threatened by blight/fire/monsters. Settlement's construction and shipbuilding industries face collapse. Secure new supplier or solve crisis?",
            severity: 'medium',
          });
        if (resource.toLowerCase().includes('metal') || resource.toLowerCase().includes('iron'))
          hooks.push({
            category: 'Strategic Resource',
            hook: 'War breaks out. Metal suppliers prioritize military contracts. Blacksmiths cannot get iron for tools/repairs. Economy suffers, population discontent grows.',
            severity: 'medium',
          });
      }
    });
  }

  // Tier-scale baseline provisioning dependency for urban centres (city+).
  // Mutates warnings in place.
  appendProvisioningAtScaleDeps(
    warnings,
    config,
    foodBalance,
    hasExternalSupply,
  );

  return { issues, warnings, plotHooks: hooks };
};
