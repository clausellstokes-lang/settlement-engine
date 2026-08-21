/**
 * economy/prosperity.js — prosperity model, economic-situation narrative, prosperity labelling, complexity classification, and priority-to-category mapping.
 */

import { random as _rng } from '../../kernel/rngContext.js';
import { getInstFlags, getStressFlags, getTradeRouteFeatures, hasTeleportationInfra } from '../helpers.js';
import { generateFoodSecurity } from '../foodGenerator.js';
import { priorityBand } from '../../domain/priorityBands.js';
import {
  isMaterializedCustomContent,
} from '../../domain/content/customContentSemanticAuthority.js';
import { institutionMatchesRegex } from '../../domain/institutionClassify.js';
import {
  hasTradeRouteConnection,
  isTradeRouteDisconnected,
} from '../../domain/tradeRouteSemantics.js';
import { resolveGenerationWorldLaw } from '../generationContext.js';


// Public compatibility name retained for every generator caller. The vocabulary
// now lives in a dependency-free domain leaf so presentation can read the exact
// same bands without importing the economy generator and its transitive graph.
export const priorityToCategory = priorityBand;


// deriveEconomicSituationDesc
export const deriveEconomicSituationDesc = (
  config = {},
  _tier = 'town',
  institutions = [],
  foodSecurity = null,
) => {
  const flags = getInstFlags(config, institutions);
  const stress = getStressFlags(config, institutions);
  const econCat = priorityToCategory(flags.economyOutput);
  const crimeCat = priorityToCategory(flags.criminalEffective);
  const route = config?.tradeRouteAccess || 'road';
  const worldLaw = resolveGenerationWorldLaw(null, config);
  const isolated = isTradeRouteDisconnected(route);
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
    return 'The economy is structured around food scarcity. Those with grain have power. Those without are making increasingly desperate decisions. Normal market activity continues in a technical sense — prices are simply at levels that exclude most of the population.';
  if (primaryStress === 'occupied') {
    const extractionChannel = worldLaw.supportsMaritime()
      ? 'maritime levies'
      : worldLaw.supportsRiverTrade()
        ? 'river tolls and cargo seizures'
        : 'road tolls and seizure powers';
    return `Revenue flows outward to the occupying authority via ${extractionChannel} and compulsory assessment. Local commerce continues under supervision. The officially stated economic situation differs from the experienced one.`;
  }
  if (primaryStress === 'indebted')
    return "Debt service obligations consume a meaningful share of revenue before any local investment is possible. The creditor's representative has effective veto power over fiscal decisions. Economic activity continues but its fruits are partly spoken for before they are earned.";
  if (primaryStress === 'plague_onset')
    return "Market activity is reduced by fear and quarantine measures. Supply chains for common goods are disrupted. The economic situation would be manageable if it weren't compounded by the medical crisis — as it is, each problem is making the other worse.";
  if (primaryStress === 'politically_fractured')
    return 'Economic activity requires navigating factional lines that did not exist a year ago. Some merchants have aligned with specific factions. Cross-faction trade continues but it is slower and more expensive than it should be.';

  const foodDeficitPct = Number(foodSecurity?.deficitPct) || 0;
  if (foodDeficitPct > 25) {
    return `Local food production leaves ${Math.round(foodDeficitPct)}% of daily need uncovered. Rationing and outside supply are economic necessities; commercial strength in other sectors cannot cover that gap.`;
  }

  if (isolated) {
    const isTownPlus = getTradeRouteFeatures(config?.tier || config?.settType || 'village');
    const hasMagicTrade = hasTeleportationInfra(institutions, config);
    if (isTownPlus && !hasMagicTrade)
      return 'This settlement is too large to survive in true isolation. Without trade routes, specialist goods cannot be sourced, surpluses cannot be sold, and population density cannot be sustained. The economy is structurally broken.';
    if (isTownPlus && hasMagicTrade)
      return 'Trade flows through magical channels — teleportation circles and planar contacts replace roads. The economy functions but depends entirely on maintaining that arcane infrastructure.';
    if (stress.stateCrime)
      return 'Internal production is suppressed by institutional extraction — what little surplus exists flows upward rather than into communal welfare.';
    if (econCat === 'very_high' || econCat === 'high')
      return 'Despite isolation, internal production is well-organised — skilled crafts, efficient agriculture, and communal resource management keep the settlement self-sufficient.';
    if (econCat === 'low' || econCat === 'very_low')
      return 'The settlement struggles to sustain itself without outside trade. Resources are tightly rationed and growth is impossible.';
    return 'The settlement meets its own needs without external trade, though surpluses are modest and specialist goods are unavailable.';
  }

  if (stress.theocraticEconomy)
    return 'The church controls most economic activity — land, markets, and trade flow through religious institutions. Commerce is present but the church sets the terms.';
  if (stress.merchantCriminalBlur)
    return 'Commerce is vigorous and the distinction between legitimate trade and criminal enterprise is largely academic. The wealthiest operators play both sides.';
  if (stress.stateCrime)
    return 'The official economy appears functional. The reality is that institutional extraction — confiscations, forced sales, and selective taxation — suppresses productive activity.';
  if (econCat === 'very_high')
    return 'Commerce is the lifeblood of this settlement — markets are active at all hours and guild influence reaches every trade.';
  if (econCat === 'high')
    return 'Trade is vigorous and the guilds are well-organized, generating steady civic revenue.';
  if (econCat === 'low') return 'Commerce is sluggish; markets meet infrequently and many crafts are in decline.';
  if (econCat === 'very_low')
    return 'The economy is barely functional — barter replaces coin and few outsiders bother to trade here.';
  if (crimeCat === 'high' || crimeCat === 'very_high')
    return 'Official commerce is moderate but a thriving shadow economy undercuts legitimate trade.';
  return 'Trade proceeds at an ordinary pace for a settlement of this size.';
};


// deriveProsperityLabel
export const deriveProsperityLabel = (prosperity, config = {}, institutions = []) => {
  const flags = getInstFlags(config, institutions);
  const econOut = flags.economyOutput;
  const stresses = config.stressTypes?.length ? config.stressTypes : config.stressType ? [config.stressType] : [];
  const LABELS = ['Struggling', 'Poor', 'Moderate', 'Comfortable', 'Prosperous', 'Wealthy'];
  const BASE = { Subsistence: 0, Poor: 1, Moderate: 2, Comfortable: 3, Prosperous: 4, Wealthy: 5 };
  let idx = BASE[prosperity] !== undefined ? BASE[prosperity] : 2;
  // Subsistence isolated settlements can still struggle further — 35% chance of Struggling
  if (prosperity === 'Subsistence') {
    idx = _rng() < 0.4 ? 0 : _rng() < 0.5 ? 1 : 2; // 40% Struggling, 30% Poor, 30% luckier
    idx = Math.max(0, Math.min(1, idx)); // cap at Poor — subsistence can never be Moderate+
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
  const isIsolatedSmall =
    isSmallTier && isTradeRouteDisconnected(config.tradeRouteAccess);
  const isConnectedSmall =
    isSmallTier && hasTradeRouteConnection(config.tradeRouteAccess);
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
  // [generators-domain-1] slave_revolt was the one second-wave type with no direct
  // prosperity row — active armed conflict with the market's commercial operations
  // suspended is at least as prosperity-suppressing as the siblings above. Golden-shifting (G2).
  if (active.includes('slave_revolt')) idx = Math.max(0, idx - 1);
  return LABELS[Math.min(5, Math.max(0, idx))];
};

// computeBaseProsperity — base prosperity index + food-security modifier (extracted from generateEconomicState)
export const computeBaseProsperity = (tier, tradeRoute, institutions, config, _instNames, incomeNormalized) => {
  // ── Base prosperity model ───────────────────────────────────────────────
  // Inputs: route (channel), tier (capacity), economy slider (investment),
  //         magic (tier-scaled production), threat (drag), military (dual effect),
  //         defensibility (security premium on trade routes)
  const _PLABELS = ['Subsistence', 'Poor', 'Moderate', 'Comfortable', 'Prosperous', 'Wealthy'];

  // 1. Route base — how much commerce can flow at all
  const _routeBase =
    tradeRoute === 'crossroads' || tradeRoute === 'port'
      ? 3 // Comfortable
      : isTradeRouteDisconnected(tradeRoute)
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
  const _hasWalls = institutions.some(institution => (
    institutionMatchesRegex(institution, /wall|palisade|citadel/i)
  ));
  const _hasGarrison = institutions.some(institution => (
    institutionMatchesRegex(institution, /garrison|barracks/i)
  ));
  const _defPremium = _hasWalls && _hasGarrison && (tradeRoute === 'crossroads' || tradeRoute === 'port') ? 0.3 : 0;

  // Food security modifier — computed here so it can cap/floor base prosperity
  const _foodSec = generateFoodSecurity(tier, institutions, { ...config, tradeRouteAccess: tradeRoute });
  const _foodMod = _foodSec.prosperityMod;

  // 7. Institutional depth — count of Economy+Crafts institutions weighted vs tier expectation
  // A city with 12 economy institutions is richer than one with 4, regardless of slider.
  // Expectations calibrated to actual generator output averages per tier.
  const _econInstCount = institutions.filter(i => (
    !isMaterializedCustomContent(i)
    && (i.category === 'Economy' || i.category === 'Crafts')
  )).length;
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
  const _hasRequiredEco = institutions.some(institution => (
    institutionMatchesRegex(
      institution,
      /subsistence farming|access to external mill|farmland|town granary|weekly market|city granari|market square|district markets|state granary|inns and taverns \(district\)/i,
    )
  ));
  if (
    ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'].includes(tier) &&
    _hasRequiredEco &&
    !(config.stressTypes || []).length
  ) {
    _baseIdx = Math.max(_baseIdx, 1); // floor at Poor for clean subsistence settlements
  }

  let Z = _PLABELS[_baseIdx];
  if (
    isTradeRouteDisconnected(tradeRoute)
    && ['thorp', 'hamlet'].includes(tier)
  ) {
    Z = 'Subsistence';
  }
  return { label: Z, foodSecurity: _foodSec };
};

// deriveEconomicComplexity — one-line complexity classification (extracted from generateEconomicState)
export const deriveEconomicComplexity = (tier, incomeSourceCount, exportCount, hasMarketInst) =>
  tier === 'metropolis' || tier === 'city'
          ? incomeSourceCount >= 9
            ? 'Highly diversified — multiple major revenue streams'
            : incomeSourceCount >= 6
              ? 'Diversified — broad institutional economic base'
              : 'Concentrated — fewer revenue streams than scale suggests'
          : tier === 'town'
            ? hasMarketInst && incomeSourceCount >= 6
              ? 'Diversified market economy'
              : incomeSourceCount >= 4
                ? 'Specialized production and trade'
                : 'Limited — narrow economic base for this scale'
            : tier === 'village'
              ? hasMarketInst
                ? 'Mixed subsistence and market'
                : exportCount >= 4
                  ? 'Agricultural surplus with trade links'
                  : 'Subsistence with minor surplus'
              : exportCount >= 3
                ? 'Subsistence with surplus'
                : 'Subsistence — survival economy';
