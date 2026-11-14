/**
 * economy/prosperity.js — prosperity model, economic-situation narrative, prosperity labelling, complexity classification, and priority-to-category mapping.
 */

import { random as _rng } from '../../kernel/rngContext.js';
import { getInstFlags, getStressFlags, getTradeRouteFeatures, hasTeleportationInfra } from '../helpers.js';
import { generateFoodSecurity } from '../foodGenerator.js';
import { FOOD_SECURITY_CUTS } from '../../data/bandLadders.js';
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
import { resolveSibling } from '../../domain/facts/drawDeclared.js';
import { factsOf } from '../../domain/facts/factsOf.js';
import { PROSPERITY_RANK } from '../../domain/prosperityRank.js';


// Public compatibility name retained for every generator caller. The vocabulary
// now lives in a dependency-free domain leaf so presentation can read the exact
// same bands without importing the economy generator and its transitive graph.
export const priorityToCategory = priorityBand;


// deriveEconomicSituationDesc — `prosperityLabel` (COHERENCE-AGREE-3, F11) is the computed label the
// record prints beside the line; where the economy slider's trade line contradicts it, the label wins.
export const deriveEconomicSituationDesc = (
  config = {},
  _tier = 'town',
  institutions = [],
  foodSecurity = null,
  prosperityLabel = null,
) => resolveSibling(situationDescOf(config, _tier, institutions, foodSecurity, prosperityLabel), PROSPERITY_LINE_SIBLINGS, {
  facts: () => factsOf({ institutions }), poolId: 'prosperity:PROSPERITY_LINE_SIBLINGS', surface: 'economics', drawKind: 'T',
});

/**
 * THE TRADE LINE AND THE PROSPERITY LABEL, ONE ANSWER (COHERENCE-AGREE-3, REVIEW-AGREE F11). The trade
 * lines below are chosen by a band of the economy slider; the label beside them is computed. Where the
 * slider's line says the opposite of the label ("Commerce is sluggish" beside "Prosperous"), the line is
 * re-keyed to the label's own band: a label of Comfortable or better takes no slow-trade line, a label of
 * Poor or worse no busy-trade line. The label's meaning is the ladder's (domain/prosperityRank.js ::
 * PROSPERITY_RANK); this reads its rank and adds no meaning of its own.
 */
const SLOW_TRADE = Object.freeze(['low', 'very_low']);
const BUSY_TRADE = Object.freeze(['high', 'very_high']);
/** The band of the trade line a label's rank speaks for. @param {number} rank */
const tradeBandOfRank = (rank) => (rank >= PROSPERITY_RANK.Wealthy ? 'very_high' : rank >= PROSPERITY_RANK.Prosperous ? 'high' : rank >= PROSPERITY_RANK.Moderate ? 'medium' : rank >= PROSPERITY_RANK.Poor ? 'low' : 'very_low');
/**
 * Does a trade line's band contradict the prosperity label? @param {string} band @param {unknown} label
 * @returns {boolean}
 */
export const tradeBandContradictsLabel = (band, label) => {
  const rank = PROSPERITY_RANK[/** @type {keyof typeof PROSPERITY_RANK} */ (String(label || ''))];
  if (typeof rank !== 'number') return false;
  return (SLOW_TRADE.includes(band) && rank >= PROSPERITY_RANK.Comfortable) || (BUSY_TRADE.includes(band) && rank <= PROSPERITY_RANK.Poor);
};
/**
 * The trade lines by the band each is chosen for, read by the coherence receipt's agreement arm
 * (generationCoherence.js) with `tradeBandContradictsLabel`, so the arm and this writer give one answer.
 * Matched by opening words, so a market line's declared twin is read as its original.
 * @type {ReadonlyArray<readonly [RegExp, string]>}
 */
export const TRADE_LINE_BANDS = Object.freeze([
  [/^Trade is what this settlement lives on\./, 'very_high'],
  [/^Trade is brisk, the guilds are well run/, 'high'],
  [/^Commerce is sluggish;/, 'low'],
  [/^Little coin changes hands here/, 'very_low'],
  [/^Cut off as it is, the settlement runs itself well/, 'high'],
  [/^With no outside trade, the settlement struggles/, 'low'],
]);

/** @param {string} econCat @param {unknown} label @returns {string} the band the trade line is chosen by */
const tradeBandFor = (econCat, label) => (tradeBandContradictsLabel(econCat, label)
  ? tradeBandOfRank(Number(PROSPERITY_RANK[/** @type {keyof typeof PROSPERITY_RANK} */ (String(label))]))
  : econCat);

/** @param {any} config @param {string} _tier @param {any[]} institutions @param {any} foodSecurity @param {unknown} [prosperityLabel] @returns {string} */
const situationDescOf = (config, _tier, institutions, foodSecurity, prosperityLabel = null) => {
  const flags = getInstFlags(config, institutions);
  const stress = getStressFlags(config, institutions);
  const econCat = priorityToCategory(flags.economyOutput);
  const tradeCat = tradeBandFor(econCat, prosperityLabel);
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
    return 'The market is shut and the caravans have stopped coming. What coin there is goes on staying alive, and the only question anyone asks is how long the stores will last.';
  if (primaryStress === 'famine')
    return 'Food is short, and those with grain hold the power. The market still opens, but most people cannot afford what is on the stalls, and those without grain are growing desperate.';
  if (primaryStress === 'occupied') {
    const extractionChannel = worldLaw.supportsMaritime()
      ? 'maritime levies'
      : worldLaw.supportsRiverTrade()
        ? 'river tolls and cargo seizures'
        : 'road tolls and seizure powers';
    return `The occupiers take their share through ${extractionChannel}, with forced assessments on top. Local trade goes on under their eye, and things are worse than the official word admits.`;
  }
  if (primaryStress === 'indebted')
    return "Much of what the settlement takes in goes on its debts before anything can be spent at home, and the creditor's agent can block any spending. People still work and trade, but part of what they earn is owed before they earn it.";
  if (primaryStress === 'plague_onset')
    return "Fear of the sickness and the quarantine have emptied the market, and everyday goods are hard to come by. Either trouble alone could be borne; together each makes the other worse.";
  if (primaryStress === 'politically_fractured')
    return 'Trading now means picking a way between rival powers that did not exist a year ago. Some merchants have taken sides. Trade between the sides goes on, but it is slower and dearer than it should be.';

  // The gap is the food record's (FOOD-1): what remains AFTER imports and magic, cut where
  // the band cuts it (a private 25 before), and said as what it is.
  const foodGapPct = Number(foodSecurity?.foodRecord?.gapPct ?? foodSecurity?.deficitPct) || 0;
  if (foodGapPct > FOOD_SECURITY_CUTS.importDependent) {
    return `Even with what is brought in, people here go short of ${foodGapPct > FOOD_SECURITY_CUTS.deficit ? 'much of' : 'part of'} the food they need each day. The settlement has to ration and buy from outside, and no other trade it has can make that up.`;
  }

  if (isolated) {
    const isTownPlus = getTradeRouteFeatures(config?.tier || config?.settType || 'village');
    const hasMagicTrade = hasTeleportationInfra(institutions, config);
    if (isTownPlus && !hasMagicTrade)
      return 'The settlement is too big to live cut off. With no trade routes it cannot buy what it does not make or sell what it has spare, and it cannot keep this many people fed.';
    if (isTownPlus && hasMagicTrade)
      return 'Goods come and go by magic: teleportation circles and planar contacts do the work of roads. Trade works, but only as long as the circles do.';
    if (stress.stateCrime)
      return 'Those in power take so much that little gets made, and what little is left over goes to them.';
    if (tradeCat === 'very_high' || tradeCat === 'high')
      return 'Cut off as it is, the settlement runs itself well: skilled crafts, well-worked fields and shared stores keep it fed and supplied.';
    if (tradeCat === 'low' || tradeCat === 'very_low')
      return 'With no outside trade, the settlement struggles to feed and supply itself. Everything is rationed, and there is nothing to spare for growing.';
    return 'The settlement feeds and supplies itself without outside trade, but it has little to spare and cannot get what it does not make.';
  }

  if (stress.theocraticEconomy)
    return 'The church controls most economic activity. Land, markets, and trade flow through religious institutions. Commerce is present but the church sets the terms.';
  if (stress.merchantCriminalBlur)
    return 'Trade is brisk, and it is hard to say where honest business ends and crime begins. The richest traders work both sides.';
  if (stress.stateCrime)
    return "On paper the settlement's trade looks healthy. In fact, seizures, forced sales and unfair taxes keep people from making or selling much.";
  if (tradeCat === 'very_high')
    return 'Trade is what this settlement lives on. The markets are busy at all hours, and the guilds have a hand in every craft.';
  if (tradeCat === 'high')
    return "Trade is brisk, the guilds are well run, and the settlement's coffers fill steadily.";
  if (tradeCat === 'low') return 'Commerce is sluggish; markets meet infrequently and many crafts are in decline.';
  if (tradeCat === 'very_low')
    return 'Little coin changes hands here; people barter, and few outsiders bother to come and trade.';
  if (crimeCat === 'high' || crimeCat === 'very_high')
    return 'Honest trade gets by, but a busy black market undercuts it.';
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
export const computeBaseProsperity = (tier, tradeRoute, institutions, config, _instNames, incomeNormalized, foodSecurity = null) => {
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
  // FOOD-EXPORTS: economicState writes the food record before its export writers and hands it in.
  const _foodSec = foodSecurity || generateFoodSecurity(tier, institutions, { ...config, tradeRouteAccess: tradeRoute });
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
// FOOD-1: the surplus words ("Subsistence with surplus", "Agricultural surplus…", "…minor surplus")
// are a food claim, so they read the food record and appear only when the place grows more than
// it eats. Without a record (an old caller) the export count still decides, as before.
/**
 * @param {string} tier @param {number} incomeSourceCount @param {number} exportCount
 * @param {boolean} hasMarketInst @param {{ growsMoreThanEats?: boolean } | null} [foodRecord]
 * @returns {string}
 */
export const deriveEconomicComplexity = (tier, incomeSourceCount, exportCount, hasMarketInst, foodRecord = null) => {
  const label = complexityByExports(tier, incomeSourceCount, exportCount, hasMarketInst);
  if (!foodRecord || foodRecord.growsMoreThanEats || !/surplus/i.test(label)) return label;
  // The small-place ladder's own no-surplus rung (no exports to sell, nothing over).
  return complexityByExports('hamlet', incomeSourceCount, 0, false);
};

/** @param {string} tier @param {number} incomeSourceCount @param {number} exportCount @param {boolean} hasMarketInst */
const complexityByExports = (tier, incomeSourceCount, exportCount, hasMarketInst) =>
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

/**
 * DECLARED SIBLINGS (COHERENCE-AGREE, 2026-11-12). The economic situation's lines that name the
 * town's market need the market home's atom (`domain/facts/market.js`); each twin says the same
 * thing for a town with no market. Measured on 360 births (seeds agree-<tier>-<i>) before the
 * change: "markets meet infrequently" printed in 7 towns with no market, "The market still opens"
 * in 2, the rest in none. Keyed by the printed text; resolved through `resolveSibling` above.
 * `alsoNeeds` declares what BOTH the line and its twin name besides the market (COHERENCE-AGREE-4): the
 * theocratic pair names the church, so each needs the sacred house — true wherever it prints, since its
 * branch (`priorityHelpers.js :: theocraticEconomy`) fires only beside a cathedral or a monastery.
 * @param {string} text @param {string} twin @param {ReadonlyArray<string>} [alsoNeeds]
 */
const marketSet = (text, twin, alsoNeeds = []) => Object.freeze([
  Object.freeze({ text, needs: Object.freeze(['market', ...alsoNeeds]) }),
  Object.freeze(alsoNeeds.length
    ? { text: twin, twinOf: text, needs: Object.freeze([...alsoNeeds]), excludes: Object.freeze(['market']) }
    : { text: twin, twinOf: text, excludes: Object.freeze(['market']) }),
]);
export const PROSPERITY_LINE_SIBLINGS = Object.freeze({
  'The market is shut and the caravans have stopped coming. What coin there is goes on staying alive, and the only question anyone asks is how long the stores will last.': marketSet(
    'The market is shut and the caravans have stopped coming. What coin there is goes on staying alive, and the only question anyone asks is how long the stores will last.',
    'The caravans have stopped coming and nothing is bought or sold. What coin there is goes on staying alive, and the only question anyone asks is how long the stores will last.'),
  'Food is short, and those with grain hold the power. The market still opens, but most people cannot afford what is on the stalls, and those without grain are growing desperate.': marketSet(
    'Food is short, and those with grain hold the power. The market still opens, but most people cannot afford what is on the stalls, and those without grain are growing desperate.',
    'Food is short, and those with grain hold the power. What food is sold costs more than most people can pay, and those without grain are growing desperate.'),
  'Fear of the sickness and the quarantine have emptied the market, and everyday goods are hard to come by. Either trouble alone could be borne; together each makes the other worse.': marketSet(
    'Fear of the sickness and the quarantine have emptied the market, and everyday goods are hard to come by. Either trouble alone could be borne; together each makes the other worse.',
    'Fear of the sickness and the quarantine keep people from trading, and everyday goods are hard to come by. Either trouble alone could be borne; together each makes the other worse.'),
  'The church controls most economic activity. Land, markets, and trade flow through religious institutions. Commerce is present but the church sets the terms.': marketSet(
    'The church controls most economic activity. Land, markets, and trade flow through religious institutions. Commerce is present but the church sets the terms.',
    'The church controls most economic activity. Land and trade flow through religious institutions. Commerce is present but the church sets the terms.',
    ['sacredHouse']),
  'Trade is what this settlement lives on. The markets are busy at all hours, and the guilds have a hand in every craft.': marketSet(
    'Trade is what this settlement lives on. The markets are busy at all hours, and the guilds have a hand in every craft.',
    'Trade is what this settlement lives on. Goods change hands at all hours, and the guilds have a hand in every craft.'),
  'Commerce is sluggish; markets meet infrequently and many crafts are in decline.': marketSet(
    'Commerce is sluggish; markets meet infrequently and many crafts are in decline.',
    'Commerce is sluggish; little is bought or sold and many crafts are in decline.'),
});
