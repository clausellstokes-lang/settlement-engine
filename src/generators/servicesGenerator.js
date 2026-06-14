import { random as _rng } from './rngContext.js';
// `priorityToCategory` was being referenced at lines 302, 303, 377, 399
// without being imported — a latent ReferenceError waiting on the right
// code path. Caught by ESLint no-undef once we wired the lint gate.
// Originally defined and exported from economicGenerator.js:959.
import { priorityToCategory } from './economicGenerator.js';
import {
  getInstFlags,
  getPriorities,
  getStressFlags,
  getTradeRouteFeatures,
  priorityToMultiplier,
  hasTeleportationInfra,
} from './helpers.js';
import { ARCANE_INST_KW as _ARCANE_SVC_KW } from '../domain/magicFilter.js';
import { generateSafetyProfile } from './safetyProfile.js';
import { INSTITUTION_SERVICES } from '../data/tradeGoodsData.js';

/**
 * servicesGenerator.js
 * Available services generation — DEFINITIVE FILE, replace whole not parts.
 */

// ─── Inlined cross-module helpers (cycle-free) ─────────────

// getTierConstraints
// Rewrites generic authority/provider phrases in a narrative string (`text`)
// so they name the bodies that actually exist in this settlement, inferred
// from its institution/stress flags, settlement tier, and an optional
// explicit government label.
//   text         — narrative string to rewrite
//   flags        — array of flag strings (institution/stress markers)
//   tier         — settlement tier ('thorp' | 'hamlet' | ... | 'metropolis')
//   governmentOverride — explicit governing-body label, if any
const _getTierConstraints = (text, flags, tier, governmentOverride) => {
  const hasFlag = (keyword) => flags.some((flag) => flag.includes(keyword)),
    isSmallSettlement = ['thorp', 'hamlet', 'village'].includes(tier),
    garrisonLabel = hasFlag('garrison')
      ? 'the garrison'
      : hasFlag('barracks')
        ? 'the barracks guard'
        : hasFlag('professional guard')
          ? 'the professional guard'
          : hasFlag('city watch') || hasFlag('town watch')
            ? 'the watch'
            : hasFlag('militia')
              ? 'the militia'
              : hasFlag('mercenary')
                ? 'the mercenary company'
                : isSmallSettlement
                  ? 'the able-bodied'
                  : 'the guard',
    governmentLabel =
      governmentOverride ||
      (isSmallSettlement
        ? tier === 'thorp'
          ? 'the household heads'
          : 'the village elders'
        : tier === 'town'
          ? 'the town council'
          : tier === 'city'
            ? 'the city council'
            : tier === 'metropolis'
              ? 'the grand council'
              : 'the council'),
    merchantsLabel =
      hasFlag('merchant') || hasFlag('guild') || hasFlag('market')
        ? 'the merchants'
        : isSmallSettlement
          ? 'the wealthiest household'
          : 'the traders',
    healersLabel = hasFlag('hospital')
      ? 'the hospital staff'
      : hasFlag('monastery') || hasFlag('friary')
        ? 'the monastery brothers'
        : hasFlag('healer')
          ? 'the healers'
          : hasFlag('church') || hasFlag('cathedral') || hasFlag('parish')
            ? 'the clergy'
            : isSmallSettlement
              ? 'the local herbalist'
              : 'the healers',
    watchLabel =
      hasFlag('city watch') || hasFlag('town watch')
        ? 'the watch'
        : hasFlag('garrison') || hasFlag('guard')
          ? 'the guard'
          : hasFlag('militia')
            ? 'the militia'
            : isSmallSettlement
              ? 'the neighbours'
              : 'the guard';
  return text
    .replace(/\bthe garrison commander\b/gi, garrisonLabel.replace(/^the /, 'the ') + "'s commander")
    .replace(/\bthe garrison\b/gi, garrisonLabel)
    .replace(/\bthe public watch\b/gi, watchLabel)
    .replace(/\bthe watch\b/gi, watchLabel)
    .replace(/\bthe council\b/gi, governmentLabel)
    .replace(/\ba council\b/gi, governmentLabel)
    .replace(/\bcouncil meetings\b/gi, governmentLabel.replace(/^the /, '') + ' meetings')
    .replace(/\binside the council\b/gi, 'inside ' + governmentLabel)
    .replace(/\bthe grain merchants\b/gi, merchantsLabel)
    .replace(/\bgrain merchants\b/gi, merchantsLabel)
    .replace(/\btwo healers\b/gi, 'two ' + healersLabel.replace(/^the /, ''))
    .replace(/\bthe healers\b/gi, healersLabel)
    .replace(
      /\bthe mages' quarter\b/gi,
      hasFlag('wizard') || hasFlag('mage') || hasFlag('alchemist') ? "the mages' quarter" : 'the arcane practitioners'
    );
};

// ─── Private helpers ──────────────────────────────────────────────────────────
import { LOCALE_SERVICE_OVERRIDES } from '../data/servicesData.js';

// getServiceTierInfo
const getServiceTierInfo = (serviceName, institutionName, settlement = {}, institutions = []) => {
    getPriorities(settlement);
    const svc = (serviceName || '').toLowerCase(),
      inst = (institutionName || '').toLowerCase(),
      flags = getInstFlags(settlement, institutions);
    return svc.includes('patrol') ||
      svc.includes('escort') ||
      svc.includes('garrison') ||
      svc.includes('military') ||
      svc.includes('guard') ||
      svc.includes('training yard') ||
      svc.includes('company contract') ||
      svc.includes('specialist warrior') ||
      svc.includes('hired muscle') ||
      svc.includes('siege') ||
      svc.includes('scouting') ||
      inst.includes('garrison') ||
      inst.includes('mercenary')
      ? priorityToMultiplier(flags.militaryEffective)
      : svc.includes('religious') ||
          svc.includes('sanctuary') ||
          svc.includes('poor relief') ||
          svc.includes('prayer') ||
          svc.includes('ritual') ||
          svc.includes('spiritual') ||
          svc.includes('hospitality (pilgrim') ||
          svc.includes('safe passage letters') ||
          inst.includes('church') ||
          inst.includes('temple') ||
          inst.includes('cathedral') ||
          inst.includes('monastery') ||
          inst.includes('parish')
        ? priorityToMultiplier(flags.religionInfluence)
        : svc.includes('spell') ||
            svc.includes('magic') ||
            svc.includes('scroll') ||
            svc.includes('enchant') ||
            svc.includes('arcane') ||
            svc.includes('planar') ||
            svc.includes('identification') ||
            svc.includes('curse') ||
            svc.includes('divination') ||
            svc.includes('magical') ||
            svc.includes('cantrip') ||
            svc.includes('prophetic') ||
            svc.includes('dream') ||
            svc.includes('memory retrieval') ||
            inst.includes('wizard') ||
            inst.includes('mage') ||
            inst.includes('alchemist') ||
            inst.includes('enchant') ||
            inst.includes('hedge')
          ? priorityToMultiplier(flags.magicInfluence)
          : svc.includes('gambling') ||
              svc.includes('fence') ||
              svc.includes('unofficial') ||
              svc.includes('black market') ||
              svc.includes('smuggl') ||
              inst.includes('thieves') ||
              inst.includes('criminal') ||
              inst.includes('underground')
            ? priorityToMultiplier(flags.criminalEffective)
            : svc.includes('price') ||
                svc.includes('trade') ||
                svc.includes('market') ||
                svc.includes('guild') ||
                svc.includes('money') ||
                svc.includes('loan') ||
                svc.includes('deposit') ||
                svc.includes('credit') ||
                svc.includes('insurance') ||
                svc.includes('wealth') ||
                svc.includes('financing') ||
                svc.includes('banking') ||
                svc.includes('currency') ||
                svc.includes('apprenticeship') ||
                svc.includes('certification') ||
                svc.includes('arbitration') ||
                svc.includes('quality control') ||
                svc.includes('regulation') ||
                inst.includes('bank') ||
                inst.includes('guild') ||
                inst.includes('market') ||
                inst.includes('merchant')
              ? priorityToMultiplier(flags.economyOutput)
              : 1;
  },
  // Derive a settlement's displayed wealth-tier label from its base wealth
  // level, economy strength, settlement size, and active stress conditions.
  //   wealthLevel  — base wealth descriptor ('Poor' | 'Moderate' | ...)
  //   settlement   — settlement object (stress types, tier)
  //   institutions — institution array (for institution flags)
  _Sv = (wealthLevel, settlement = {}, institutions = []) => {
    var stressTypesTmp;
    const flags = getInstFlags(settlement, institutions),
      economyOutput = flags.economyOutput,
      stressTypes =
        (stressTypesTmp = settlement.stressTypes) != null && stressTypesTmp.length
          ? settlement.stressTypes
          : settlement.stressType
            ? [settlement.stressType]
            : [],
      primaryStress = stressTypes[0] || null,
      wealthLadder = ['Struggling', 'Poor', 'Moderate', 'Comfortable', 'Prosperous', 'Wealthy'],
      baseTierByWealth = { Poor: 1, Moderate: 2, Prosperous: 4, Wealthy: 5 };
    let tierIndex = baseTierByWealth[wealthLevel] !== void 0 ? baseTierByWealth[wealthLevel] : 2;
    economyOutput >= 80
      ? (tierIndex = Math.min(5, tierIndex + 1))
      : economyOutput >= 65
        ? (tierIndex = Math.min(5, tierIndex))
        : economyOutput < 20
          ? (tierIndex = Math.max(0, tierIndex - 2))
          : economyOutput < 32 && (tierIndex = Math.max(0, tierIndex - 1));
    const smallSettlementFloor = { thorp: 1, hamlet: 1, village: 1 }[settlement.settType || settlement.tier || ''] || 0;
    if (smallSettlementFloor > 0) tierIndex = Math.max(smallSettlementFloor, tierIndex);
    if (flags.criminalEffective >= 65) tierIndex = Math.max(0, tierIndex - 1);
    const effectiveStress = stressTypes.length ? stressTypes : primaryStress ? [primaryStress] : [];
    if (effectiveStress.includes('under_siege')) tierIndex = Math.max(0, Math.min(tierIndex, 0));
    if (effectiveStress.includes('famine')) tierIndex = Math.max(0, Math.min(tierIndex, 0));
    if (effectiveStress.includes('occupied')) tierIndex = Math.max(0, Math.min(tierIndex, 1));
    if (effectiveStress.includes('indebted')) tierIndex = Math.max(0, tierIndex - 1);
    if (effectiveStress.includes('politically_fractured')) tierIndex = Math.max(0, tierIndex - 1);
    if (effectiveStress.includes('plague_onset')) tierIndex = Math.max(0, tierIndex - 1);
    if (effectiveStress.includes('recently_betrayed')) tierIndex = Math.max(0, tierIndex - 1);
    if (effectiveStress.includes('monster_pressure')) tierIndex = Math.max(0, tierIndex - 1);
    if (effectiveStress.includes('insurgency')) tierIndex = Math.max(0, tierIndex - 1);
    if (effectiveStress.includes('wartime')) tierIndex = Math.max(0, tierIndex - 1);
    if (effectiveStress.includes('mass_migration')) tierIndex = Math.max(0, tierIndex - 1);
    if (effectiveStress.includes('religious_conversion')) tierIndex = Math.max(0, tierIndex - 1);
    return wealthLadder[Math.min(5, Math.max(0, tierIndex))];
  },
  // Build weighted danger-theme scores for the safety narrative, then amplify
  // them according to the settlement's active stress conditions.
  //   settlement   — settlement object (monster threat, stress types)
  //   institutions — institution array (for flags)
  _generateSafetyNarrative2 = (settlement = {}, institutions = []) => {
    var stressTypesTmp;
    const flags = getInstFlags(settlement, institutions),
      stressFlags = getStressFlags(settlement, institutions),
      monsterThreat = settlement.monsterThreat || 'frontier',
      threatMultiplier = monsterThreat === 'plagued' ? 1.6 : monsterThreat === 'heartland' ? 0.6 : 1,
      stressTypes =
        (stressTypesTmp = settlement.stressTypes) != null && stressTypesTmp.length
          ? settlement.stressTypes
          : settlement.stressType
            ? [settlement.stressType]
            : [],
      primaryStress = stressTypes[0] || null,
      themeWeights = {
        economic: 1.3 * priorityToMultiplier(flags.economyOutput),
        political: 1.2 * (0.5 + 0.5 * priorityToMultiplier(Math.max(flags.militaryEffective, flags.criminalEffective))),
        disaster:
          1 * (0.6 + 0.4 * priorityToMultiplier(flags.militaryEffective)) * (stressFlags.stateCrime ? 1.4 : 1) * threatMultiplier,
        religious: 1 * priorityToMultiplier(flags.religionInfluence) * (stressFlags.crusaderSynthesis ? 1.5 : 1),
        magical: 0.8 * priorityToMultiplier(flags.magicInfluence) * (stressFlags.heresySuppression ? 0.4 : 1),
        occupation_infiltration: 0.7,
        exile_return: 0.6,
        demographic: 0.6,
      },
      stressModifiers = {
        under_siege: { disaster: 2.5, political: 1.5 },
        famine: { disaster: 2, economic: 1.8 },
        occupied: { occupation_infiltration: 3, political: 2 },
        politically_fractured: { political: 2.5, exile_return: 1.5 },
        indebted: { economic: 2.5, political: 1.3 },
        recently_betrayed: { political: 2.5, occupation_infiltration: 1.8 },
        infiltrated: { occupation_infiltration: 3, political: 1.5 },
        plague_onset: { disaster: 2.5, religious: 1.5 },
        succession_void: { political: 3, exile_return: 2 },
        monster_pressure: { disaster: 2, political: 1.3 },
      };
    (stressTypes.length ? stressTypes : primaryStress ? [primaryStress] : []).forEach((stress) => {
      const modifiers = stressModifiers[stress] || {};
      Object.entries(modifiers).forEach(([theme, factor]) => {
        themeWeights[theme] !== void 0 && (themeWeights[theme] *= factor);
      });
    });
    return themeWeights;
  },
  // Build weighted control-domain scores (who holds power) for the settlement,
  // amplified by the single primary stress condition if any.
  //   settlement   — settlement object (monster threat, stress types)
  //   institutions — institution array (for flags)
  _jv = (settlement = {}, institutions = []) => {
    var stressTypesTmp;
    const flags = getInstFlags(settlement, institutions),
      stressFlags = getStressFlags(settlement, institutions),
      monsterThreat = settlement.monsterThreat || 'frontier',
      threatMultiplier = monsterThreat === 'plagued' ? 1.4 : monsterThreat === 'heartland' ? 0.75 : 1,
      primaryStress =
        ((stressTypesTmp = settlement.stressTypes) != null && stressTypesTmp.length
          ? settlement.stressTypes
          : settlement.stressType
            ? [settlement.stressType]
            : [])[0] || null,
      domainWeights = {
        government: 1,
        religious: priorityToMultiplier(flags.religionInfluence) * (stressFlags.crusaderSynthesis ? 1.3 : 1),
        military: priorityToMultiplier(flags.militaryEffective) * (stressFlags.crusaderSynthesis ? 1.3 : 1) * threatMultiplier,
        economy: priorityToMultiplier(flags.economyOutput) * (stressFlags.theocraticEconomy ? 0.5 : 1),
        criminal: priorityToMultiplier(flags.criminalEffective) * (stressFlags.stateCrime ? 0.4 : 1),
        magic: priorityToMultiplier(flags.magicInfluence) * (stressFlags.heresySuppression ? 0.25 : 1),
        other: 1,
      };
    if (primaryStress) {
      const modifiers =
        {
          under_siege: { military: 2.5, government: 1.5, criminal: 0.5 },
          famine: { religious: 1.8, economy: 1.5, other: 1.5 },
          occupied: { government: 1.5, military: 0.4, criminal: 1.6 },
          politically_fractured: { government: 2, criminal: 1.4, economy: 0.8 },
          indebted: { economy: 1.8, government: 1.3, criminal: 1.2 },
          recently_betrayed: { military: 1.5, criminal: 1.5, government: 1.3 },
          infiltrated: { criminal: 2, government: 1.2, magic: 1.2 },
          plague_onset: { religious: 2.5, other: 1.8, military: 0.7 },
          succession_void: { government: 2.5, military: 1.5, criminal: 1.3 },
          monster_pressure: { military: 2, other: 1.3, economy: 0.8 },
        }[primaryStress] || {};
      Object.entries(modifiers).forEach(([domain, factor]) => {
        domainWeights[domain] !== void 0 && (domainWeights[domain] *= factor);
      });
    }
    return domainWeights;
  },
  // Produce a prose description of the settlement's economy, prioritising any
  // overriding stress condition, then isolation, then baseline economy/crime.
  //   settlement   — settlement object (trade route access, stress, tier)
  //   _s           — unused (kept for call-site arity)
  //   institutions — institution array (for flags)
  _Av = (settlement = {}, _s = 'town', institutions = []) => {
    var stressTypesTmp;
    const flags = getInstFlags(settlement, institutions),
      stressFlags = getStressFlags(settlement, institutions),
      economyCategory = priorityToCategory(flags.economyOutput),
      criminalCategory = priorityToCategory(flags.criminalEffective),
      tradeRouteAccess = (settlement == null ? void 0 : settlement.tradeRouteAccess) || 'road',
      isIsolated = tradeRouteAccess === 'isolated',
      stressTypes =
        (stressTypesTmp = settlement == null ? void 0 : settlement.stressTypes) != null && stressTypesTmp.length
          ? settlement.stressTypes
          : settlement != null && settlement.stressType
            ? [settlement.stressType]
            : [],
      primaryStress = stressTypes.length
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
          ].find((stress) => stressTypes.includes(stress)) || stressTypes[0]
        : null;
    if (primaryStress === 'under_siege')
      return 'All normal economic activity is suspended. Markets are closed, merchant caravans have stopped arriving, and whatever currency existed is being redirected toward survival. The only economic question is the arithmetic of remaining supplies.';
    if (primaryStress === 'famine')
      return 'The economy is structured around food scarcity. Those with grain have power. Those without are making increasingly desperate decisions. Normal market activity continues in a technical sense — prices are simply at levels that exclude most of the population.';
    if (primaryStress === 'occupied')
      return `Revenue flows outward to the occupying authority via ${tradeRouteAccess === 'port' ? 'maritime levies' : 'road tolls and seizure powers'} and compulsory assessment. Local commerce continues under supervision. The officially stated economic situation differs from the experienced one.`;
    if (primaryStress === 'indebted')
      return "Debt service obligations consume a meaningful share of revenue before any local investment is possible. The creditor's representative has effective veto power over fiscal decisions. Economic activity continues but its fruits are partly spoken for before they are earned.";
    if (primaryStress === 'plague_onset')
      return "Market activity is reduced by fear and quarantine measures. Supply chains for common goods are disrupted. The economic situation would be manageable if SEVERITY weren't compounded by the medical crisis — as SEVERITY is, each problem is making the other worse.";
    if (primaryStress === 'politically_fractured')
      return 'Economic activity requires navigating factional lines that did not exist a year ago. Some merchants have aligned with specific factions. Cross-faction trade continues but SEVERITY is slower and more expensive than SEVERITY should be.';
    if (isIsolated) {
      const hasTradeRouteFeatures = getTradeRouteFeatures(
          (settlement == null ? void 0 : settlement.tier) || (settlement == null ? void 0 : settlement.settType) || 'village'
        ),
        hasTeleport = hasTeleportationInfra(institutions, settlement);
      return hasTradeRouteFeatures && !hasTeleport
        ? 'This settlement is too large to survive in true isolation. Without trade routes, specialist goods cannot be sourced, surpluses cannot be sold, and population density cannot be sustained. The economy is structurally broken.'
        : hasTradeRouteFeatures && hasTeleport
          ? 'Trade flows through magical channels — teleportation circles and planar contacts replace roads. The economy functions but depends entirely on maintaining that arcane infrastructure.'
          : stressFlags.stateCrime
            ? 'Internal production is suppressed by institutional extraction — what little surplus exists flows upward rather than into communal welfare.'
            : economyCategory === 'very_high' || economyCategory === 'high'
              ? 'Despite isolation, internal production is well-organised — skilled crafts, efficient agriculture, and communal resource management keep the settlement self-sufficient.'
              : economyCategory === 'low' || economyCategory === 'very_low'
                ? 'The settlement struggles to sustain itself without outside trade. Resources are tightly rationed and growth is impossible.'
                : 'The settlement meets its own needs without external trade, though surpluses are modest and specialist goods are unavailable.';
    }
    return stressFlags.theocraticEconomy
      ? 'The church controls most economic activity — land, markets, and trade flow through religious institutions. Commerce is present but the church sets the terms.'
      : stressFlags.merchantCriminalBlur
        ? 'Commerce is vigorous and the distinction between legitimate trade and criminal enterprise is largely academic. The wealthiest operators play both sides.'
        : stressFlags.stateCrime
          ? 'The official economy appears functional. The reality is that institutional extraction — confiscations, forced sales, and selective taxation — suppresses productive activity.'
          : economyCategory === 'very_high'
            ? 'Commerce is the lifeblood of this settlement — markets are active at all hours and guild influence reaches every trade.'
            : economyCategory === 'high'
              ? 'Trade is vigorous and the guilds are well-organized, generating steady civic revenue.'
              : economyCategory === 'low'
                ? 'Commerce is sluggish; markets meet infrequently and many crafts are in decline.'
                : economyCategory === 'very_low'
                  ? 'The economy is barely functional — barter replaces coin and few outsiders bother to trade here.'
                  : criminalCategory === 'high' || criminalCategory === 'very_high'
                    ? 'Official commerce is moderate but a thriving shadow economy undercuts legitimate trade.'
                    : 'Trade proceeds at an ordinary pace for a settlement of this size.';
  },
  // Narrate a food deficit percentage (`deficitPct`) in light of trade access
  // and economy strength. Returns null when there is no deficit.
  //   deficitPct   — deficit as a percentage of daily need
  //   settlement   — settlement object (trade route access)
  //   institutions — institution array (for flags)
  _generateTradeScore = (deficitPct, settlement = {}, institutions = []) => {
    const economyCategory = priorityToCategory(getInstFlags(settlement, institutions).economyOutput),
      isIsolated = ((settlement == null ? void 0 : settlement.tradeRouteAccess) || 'road') === 'isolated';
    return deficitPct <= 0
      ? null
      : isIsolated
        ? hasTeleportationInfra(institutions, settlement)
          ? `Food deficit of ${Math.round(deficitPct)}% persists even with magical supply lines — teleportation imports are reliable but extraordinarily expensive, rationed to necessities rather than plenty, and dependent on the circle's own upkeep. Any disruption to the magical infrastructure means immediate food crisis.`
          : deficitPct > 40
            ? `Food deficit of ${Math.round(deficitPct)}% far outstrips the trickle of sanctioned caravans and minor routes that reach this isolated settlement. Starvation or mass emigration is the long-term outcome without change.`
            : `Food deficit of ${Math.round(deficitPct)}% with no major trade route — local production carries the burden, topped up only by expensive, irregular caravans on minor routes. A poor harvest means genuine hunger.`
        : economyCategory === 'very_high' || economyCategory === 'high'
          ? `Food deficit of ${Math.round(deficitPct)}% is covered through active grain imports — merchant networks ensure supply chain resilience.`
          : economyCategory === 'low'
            ? `Food deficit of ${Math.round(deficitPct)}% is a genuine vulnerability — limited trade capacity means shortages are only one poor harvest away.`
            : economyCategory === 'very_low'
              ? `Food deficit of ${Math.round(deficitPct)}% is a chronic crisis — without meaningful trade, famine is a recurring threat.`
              : null;
  },
  // Narrate a settlement's food balance (deficit, surplus, or rough balance),
  // factoring trade access and economy strength for the deficit case.
  //   foodBalance  — { dailyNeed, deficit, surplus }
  //   settlement   — settlement object (trade route access)
  //   institutions — institution array (for flags)
  _Rv = (foodBalance, settlement = {}, institutions = []) => {
    if (!foodBalance) return null;
    const { dailyNeed, deficit, surplus } = foodBalance;
    if (dailyNeed === void 0 || isNaN(dailyNeed)) return null;
    const economyCategory = priorityToCategory(getInstFlags(settlement, institutions).economyOutput);
    if (deficit > 0) {
      const pct = Math.round((deficit / dailyNeed) * 100);
      return ((settlement == null ? void 0 : settlement.tradeRouteAccess) || 'road') === 'isolated'
        ? hasTeleportationInfra(institutions, settlement)
          ? `Food deficit of ${pct}% managed through magical supply chains — teleportation imports fill the gap at great cost. Magical infrastructure failure means immediate famine.`
          : `Food deficit of ${pct}% with no trade access — the settlement cannot import what SEVERITY lacks. This is a structural survival problem.`
        : economyCategory === 'very_high' || economyCategory === 'high'
          ? `Food deficit of ${pct}% is actively managed through trade — merchant networks provide reliable grain imports, but the cost is a permanent economic drag.`
          : economyCategory === 'low' || economyCategory === 'very_low'
            ? `Food deficit of ${pct}% is a genuine crisis — without strong trade infrastructure, the settlement teeters on the edge of seasonal famine.`
            : `Food deficit of ${pct}% requires consistent grain imports. Any disruption to supply becomes a survival threat.`;
    }
    if (surplus > 0) {
      const pct = Math.round((surplus / dailyNeed) * 100);
      return pct > 50
        ? `Agricultural surplus of ${pct}% above daily needs — this settlement is a net grain exporter and could weather a poor harvest.`
        : `Modest food surplus of ${pct}% — sufficient buffer against a bad harvest, with some grain available for trade.`;
    }
    return 'Food production is in rough balance with population needs — no significant surplus or deficit.';
  };

// SERVICE_TIER_CHANCE — base probability modifier per settlement tier

const _UPGRADE_CHAINS = {
  thorp: {
    basic: [
      { name: 'Salt', category: 'food_processed', defaultEnabled: !0, desc: 'Food preservation' },
      { name: 'Metal tools', category: 'manufactured', defaultEnabled: !0, desc: 'Simple implements' },
      { name: 'Cloth', category: 'manufactured', defaultEnabled: !0, desc: 'Basic textiles' },
    ],
  },
  hamlet: {
    basic: [
      { name: 'Metal goods', category: 'manufactured', defaultEnabled: !0, desc: 'Tools, nails, horseshoes' },
      { name: 'Salt', category: 'food_processed', defaultEnabled: !0, desc: 'Food preservation' },
      { name: 'Quality cloth', category: 'manufactured', defaultEnabled: !0, desc: 'Better textiles' },
    ],
  },
  village: {
    basic: [
      { name: 'Metal goods', category: 'manufactured', defaultEnabled: !0, desc: 'Tools, nails, horseshoes' },
      { name: 'Quality cloth and clothing', category: 'manufactured', defaultEnabled: !0, desc: 'Finished garments' },
      { name: 'Salt for preservation', category: 'food_processed', defaultEnabled: !0, desc: 'Essential preservative' },
      { name: 'Specialized tools', category: 'manufactured', defaultEnabled: !0, desc: 'Advanced implements' },
    ],
    fromHigher: [
      { name: 'Legal services', category: 'services', defaultEnabled: !0, desc: 'Contracts, court access' },
      { name: 'Advanced medical care', category: 'services', defaultEnabled: !0, desc: 'Skilled physicians' },
      { name: 'Manufactured goods', category: 'manufactured', defaultEnabled: !0, desc: 'Wide variety of crafts' },
    ],
  },
  town: {
    fromCityOrMetropolis: [
      { name: 'Luxury textiles', category: 'luxury', defaultEnabled: !0, desc: 'Fine cloth, silk' },
      { name: 'Spices and exotic dyes', category: 'luxury', defaultEnabled: !0, desc: 'Imported rarities' },
      { name: 'Banking services', category: 'services', defaultEnabled: !0, desc: 'Letters of credit' },
      { name: 'Advanced legal expertise', category: 'services', defaultEnabled: !0, desc: 'Specialized law' },
      { name: 'Rare materials', category: 'luxury', defaultEnabled: !0, desc: 'Exotic goods' },
    ],
    fromHinterland: [
      { name: 'Food surplus', category: 'agricultural', defaultEnabled: !0, desc: 'Agricultural hinterland' },
      { name: 'Raw wool and hides', category: 'raw_materials', defaultEnabled: !0, desc: 'For processing' },
      { name: 'Timber', category: 'raw_materials', defaultEnabled: !0, desc: 'Construction material' },
    ],
  },
  city: {
    fromMetropolis: [
      { name: 'International banking', category: 'services', defaultEnabled: !0, desc: 'Global connections' },
      { name: 'Highest luxury goods', category: 'luxury', defaultEnabled: !0, desc: 'Rarities and masterworks' },
      { name: 'Political legitimacy', category: 'services', defaultEnabled: !0, desc: 'Royal/imperial connections' },
    ],
    fromHinterland: [
      { name: 'Bulk food', category: 'agricultural', defaultEnabled: !0, desc: 'Massive agricultural needs' },
      { name: 'Raw materials', category: 'raw_materials', defaultEnabled: !0, desc: 'Ore, timber, wool' },
      { name: 'Basic goods for resale', category: 'manufactured', defaultEnabled: !0, desc: 'Market redistribution' },
    ],
  },
  metropolis: {
    basic: [
      { name: 'Massive food requirements', category: 'agricultural', defaultEnabled: !0, desc: 'Regional network' },
      { name: 'Raw materials', category: 'raw_materials', defaultEnabled: !0, desc: 'Entire regional supply' },
      { name: 'Luxury imports', category: 'luxury', defaultEnabled: !0, desc: 'From distant lands' },
    ],
  },
};

// isSaltPreserved

export const SERVICE_TIER_DATA = {
  thorp: {
    Eggs: { category: 'agricultural', baseChance: 0.9, defaultEnabled: !0, desc: 'Fresh eggs from household chickens' },
    'Small game': {
      category: 'agricultural',
      baseChance: 0.6,
      defaultEnabled: !0,
      desc: 'Rabbits, fowl from local hunting',
    },
    'Foraged goods': {
      category: 'agricultural',
      baseChance: 0.7,
      defaultEnabled: !0,
      desc: 'Mushrooms, berries, herbs',
    },
  },
  hamlet: {
    'Grain surplus': {
      category: 'agricultural',
      baseChance: 0.8,
      defaultEnabled: !0,
      desc: 'Wheat, barley, oats beyond subsistence needs',
    },
    'Raw wool': { category: 'raw_materials', baseChance: 0.7, defaultEnabled: !0, desc: 'Unprocessed wool from sheep' },
    'Dairy products': { category: 'food_processed', baseChance: 0.6, defaultEnabled: !0, desc: 'Cheese, butter, milk' },
    Livestock: { category: 'agricultural', baseChance: 0.5, defaultEnabled: !0, desc: 'Cattle, sheep, pigs for sale' },
    'Honey and beeswax': {
      category: 'food_processed',
      baseChance: 0.4,
      defaultEnabled: !0,
      desc: 'Local beekeeping products',
    },
  },
  village: {
    'Agricultural surplus': {
      category: 'agricultural',
      baseChance: 0.9,
      defaultEnabled: !0,
      desc: 'Grain, wheat, barley in quantity',
    },
    'Raw wool and hides': {
      category: 'raw_materials',
      baseChance: 0.8,
      defaultEnabled: !0,
      desc: 'Bulk unprocessed animal products',
    },
    Livestock: {
      category: 'agricultural',
      baseChance: 0.7,
      defaultEnabled: !0,
      desc: 'Cattle, sheep, pigs in regular supply',
    },
    'Eggs and dairy': {
      category: 'food_processed',
      baseChance: 0.8,
      defaultEnabled: !0,
      desc: 'Regular production for market',
    },
    'Honey and beeswax': {
      category: 'food_processed',
      baseChance: 0.5,
      defaultEnabled: !0,
      desc: 'Established beekeeping',
    },
    'Milled flour': {
      category: 'food_processed',
      baseChance: 0.9,
      requiredInstitution: 'Mill',
      defaultEnabled: !0,
      desc: 'Ground grain for bread-making',
    },
    'Basic metalwork': {
      category: 'manufactured',
      baseChance: 0.6,
      requiredInstitution: 'Blacksmith',
      defaultEnabled: !0,
      desc: 'Horseshoes, nails, simple tools',
    },
  },
  town: {
    'Guild-manufactured goods': {
      category: 'manufactured',
      baseChance: 0.9,
      requiredInstitution: 'Craft guilds (5-15)',
      defaultEnabled: !0,
      desc: 'Cloth, leather goods, metalwork',
    },
    'Processed textiles': {
      category: 'manufactured',
      baseChance: 0.8,
      requiredInstitution: 'Weavers/Textile workers',
      defaultEnabled: !0,
      desc: 'Woven cloth, finished fabrics',
    },
    'Quality tools and weapons': {
      category: 'manufactured',
      baseChance: 0.7,
      requiredInstitution: 'Blacksmiths (3-10)',
      defaultEnabled: !0,
      desc: 'Well-crafted implements and basic arms',
    },
    'Baked goods': {
      category: 'food_processed',
      baseChance: 0.8,
      requiredInstitution: 'Bakers (5-15)',
      defaultEnabled: !0,
      desc: 'Bread, pastries for market',
    },
    'Preserved foods': {
      category: 'food_processed',
      baseChance: 0.6,
      defaultEnabled: !0,
      desc: 'Salted meats, pickled vegetables',
    },
    'Barrels and containers': {
      category: 'manufactured',
      baseChance: 0.5,
      requiredInstitution: 'Craft guilds (5-15)',
      defaultEnabled: !0,
      desc: 'Wooden casks for storage/transport',
    },
    'Leather goods': {
      category: 'manufactured',
      baseChance: 0.7,
      requiredInstitution: 'Tanners',
      defaultEnabled: !0,
      desc: 'Tanned hides, leather products',
    },
    'Pottery and ceramics': {
      category: 'manufactured',
      baseChance: 0.6,
      requiredInstitution: 'Craft guilds (5-15)',
      defaultEnabled: !0,
      desc: 'Household vessels and tiles',
    },
    'Rope and cordage': {
      category: 'manufactured',
      baseChance: 0.5,
      requiredInstitution: 'Craft guilds (5-15)',
      defaultEnabled: !0,
      desc: 'Essential for shipping and construction',
    },
  },
  city: {
    'Luxury manufactured goods': {
      category: 'luxury',
      baseChance: 0.8,
      defaultEnabled: !0,
      desc: 'High-quality crafted items',
    },
    'Fine metalwork and jewelry': {
      category: 'luxury',
      baseChance: 0.7,
      requiredInstitution: 'Specialized metalworkers',
      defaultEnabled: !0,
      desc: 'Precious metal goods, gemstone work',
    },
    'Legal services': {
      category: 'services',
      baseChance: 0.9,
      requiredInstitution: 'Multiple courthouses',
      defaultEnabled: !0,
      desc: 'Contracts, court access, legal expertise',
    },
    'Financial services': {
      category: 'services',
      baseChance: 0.7,
      requiredInstitution: 'Banking houses',
      defaultEnabled: !0,
      desc: 'Letters of credit, money changing',
    },
    'Specialized guild crafts': {
      category: 'manufactured',
      baseChance: 0.9,
      requiredInstitution: 'Craft guilds (30-80)',
      defaultEnabled: !0,
      desc: '50+ specializations available',
    },
    'Books and manuscripts': {
      category: 'luxury',
      baseChance: 0.6,
      requiredInstitution: 'Craft guilds (30-80)',
      defaultEnabled: !0,
      desc: 'Hand-copied texts, illuminated works',
    },
    'Advanced weapons and armor': {
      category: 'manufactured',
      baseChance: 0.6,
      requiredInstitution: 'Specialized metalworkers',
      defaultEnabled: !0,
      desc: 'Professional military equipment',
    },
    'Fine textiles': {
      category: 'luxury',
      baseChance: 0.7,
      requiredInstitution: 'Craft guilds (30-80)',
      defaultEnabled: !0,
      desc: 'Silk, velvet, high-quality woolens',
    },
    'Dyed cloth': {
      category: 'manufactured',
      baseChance: 0.8,
      requiredInstitution: 'Craft guilds (30-80)',
      defaultEnabled: !0,
      desc: 'Colored fabrics, specialty dyes',
    },
    Glassware: {
      category: 'manufactured',
      baseChance: 0.5,
      requiredInstitution: 'Glassmakers',
      defaultEnabled: !0,
      desc: 'Windows, vessels, decorative glass',
    },
  },
  metropolis: {
    'International banking services': {
      category: 'services',
      baseChance: 0.9,
      requiredInstitution: 'Banking district',
      defaultEnabled: !0,
      desc: 'Letters of credit, international finance',
    },
    'Extreme luxury goods': {
      category: 'luxury',
      baseChance: 0.8,
      defaultEnabled: !0,
      desc: 'Rare items, masterwork crafts',
    },
    'High art and culture': {
      category: 'services',
      baseChance: 0.7,
      defaultEnabled: !0,
      desc: 'Theater, music, commissioned art',
    },
    'Educational services': {
      category: 'services',
      baseChance: 0.8,
      requiredInstitution: 'University',
      defaultEnabled: !0,
      desc: 'University degrees, advanced training',
    },
    'Political influence': {
      category: 'services',
      baseChance: 0.9,
      defaultEnabled: !0,
      desc: 'Access to power, legal frameworks',
    },
    'Rare spices and dyes': {
      category: 'luxury',
      baseChance: 0.7,
      defaultEnabled: !0,
      desc: 'Imported exotic materials',
    },
    'Master-crafted weapons': {
      category: 'luxury',
      baseChance: 0.6,
      requiredInstitution: 'Specialist craftsmen quarters',
      defaultEnabled: !0,
      desc: 'Legendary quality arms and armor',
    },
    'Architectural services': {
      category: 'services',
      baseChance: 0.7,
      requiredInstitution: 'Craft guilds (100-150+)',
      defaultEnabled: !0,
      desc: 'Cathedral design, fortress planning',
    },
    'Printing services': {
      category: 'services',
      baseChance: 0.5,
      defaultEnabled: !0,
      desc: 'Mass-produced texts (if technology exists)',
    },
  },
};

const SERVICE_TIER_CHANCE = { thorp: 0.25, hamlet: 0.35, village: 0.5, town: 0.65, city: 0.8, metropolis: 0.95 };

// Custom-content dependency surface — institution.produces declarations
import { customDeps as _customDeps } from '../lib/dependencyEngine.js';

/**
 * Build a synthetic services array from a custom institution's `produces`
 * refIds. Each produced trade-good NAME becomes a service entry with a
 * tier-scaled probability roll. Returns [] if the institution is not a
 * custom one or has no `produces` declarations.
 */
function _customProducedServices(institutionName, tier, opts = {}) {
  const produced = _customDeps.servicesProducedBy(institutionName);
  if (!produced.length) return [];
  const tierChance = SERVICE_TIER_CHANCE[tier] || 0.5;
  const out = [];
  for (const goodName of produced) {
    const overrideKey = `${institutionName}_service_${goodName}`;
    const allow = opts[overrideKey];
    const enabled = allow !== undefined ? allow : true;
    if (!enabled) continue;
    // Custom-declared production fires more reliably than a random match.
    if (_rng() < Math.max(0.6, tierChance)) {
      out.push({
        name: goodName,
        desc: `${institutionName} produces ${goodName}`,
        p: 0.7,
        institution: institutionName,
        svcKey: institutionName,
        custom: true,
      });
    }
  }
  return out;
}

// getServicesForInstitution
// Key resolution precedence: a dedicated INSTITUTION_SERVICES entry (exact
// name, case-insensitive) always wins; LOCALE_SERVICE_OVERRIDES only redirects
// institutions with NO dedicated entry; the token-overlap fuzzy match is the
// last resort. All paths share one roll block so toggle objects (allow/force),
// guaranteed p>=1 services, and requiredTradeRoute gates apply uniformly
// regardless of how the key was resolved.
const getServicesForInstitution = (r, s, o = {}) => {
  const d = Object.keys(INSTITUTION_SERVICES),
    l = LOCALE_SERVICE_OVERRIDES[r.toLowerCase()];
  // Custom-content extension: any services declared via `produces` augment
  // (or, for unknown custom institutions, replace) the prebuilt service set.
  const _customServices = _customProducedServices(r, s, o);
  const _exactKey = d.find((k) => k.toLowerCase() === r.toLowerCase());
  let w = _exactKey || (l && INSTITUTION_SERVICES[l] ? l : null);
  if (!w) {
    const m = r
      .toLowerCase()
      .split(/[\s'(),/-]+/)
      .filter((C) => C.length > 2);
    let h = null,
      g = 0;
    for (const C of d) {
      const T = C.toLowerCase()
        .split(/[\s'(),/-]+/)
        .filter((v) => v.length > 2);
      let M = 0;
      for (const v of T)
        for (const j of m)
          j === v ? (M += 2) : ((v.length > 3 && j.startsWith(v)) || (j.length > 4 && v.startsWith(j))) && (M += 1);
      const A = M / (T.length * 2),
        S = h
          ? h
              .toLowerCase()
              .split(/[\s'(),/-]+/)
              .filter((v) => v.length > 2).length
          : 1,
        y = g / (S * 2);
      (M > g || (M === g && M > 0 && A > y)) && ((g = M), (h = C));
    }
    w = g > 0 ? h : null;
  }
  if (!w) {
    // No prebuilt service mapping, but custom institution may declare its own.
    return _customServices;
  }
  const p = INSTITUTION_SERVICES[w],
    b = SERVICE_TIER_CHANCE[s] || 0.5,
    k = [],
    f = Object.entries(p).sort((C, T) => T[1].p - C[1].p);
  if (
    (f.forEach(([C, T]) => {
      const M = `${r}_service_${C}`,
        A = `${w}_service_${C}`,
        S = o[M] ?? o[A],
        y = S !== void 0 ? S : T.on,
        v = typeof y == 'object' ? (y.allow ?? !0) : y,
        j = typeof y == 'object' ? (y.force ?? !1) : !1;
      if (!v && !j) return;
      const z = T.p * b;
      (j || T.p >= 1 || _rng() < z) &&
        (!T.requiredTradeRoute || (o._tradeRoute || '').includes(T.requiredTradeRoute)) &&
        k.push({
          name: C,
          ...T,
          institution: r,
          svcKey: w,
          forced: j,
        });
    }),
    k.length === 0)
  ) {
    const C = f.find(([T, M]) => {
      const A = `${r}_service_${T}`,
        S = `${w}_service_${T}`;
      return o[A] ?? o[S] ?? M.on;
    });
    C &&
      k.push({
        name: C[0],
        ...C[1],
        institution: r,
        svcKey: w,
      });
  }
  // Augment matched results with custom-declared produced services
  for (const cs of _customServices) {
    if (!k.some(x => x.name === cs.name)) k.push(cs);
  }
  return k;
};

const CATEGORY_COLORS = {
  agricultural: {
    generateNeighborRelationship: '#f0faf2',
    text: '#1a5a28',
    label: 'Agricultural',
  },
  raw_materials: {
    generateNeighborRelationship: '#faf4e8',
    text: '#7a5010',
    label: 'Raw Material',
  },
  manufactured: {
    generateNeighborRelationship: '#f0f4ff',
    text: '#1a2a8a',
    label: 'Manufactured',
  },
  luxury: {
    generateNeighborRelationship: '#faf0ff',
    text: '#6a1a8a',
    label: 'Luxury',
  },
  services: {
    generateNeighborRelationship: '#f0f8ff',
    text: '#1a5a8a',
    label: 'Service',
  },
  food_processed: {
    generateNeighborRelationship: '#fff4e8',
    text: '#8a4010',
    label: 'Processed',
  },
};

// getCategoryDisplay
const _getCategoryDisplay = (r) =>
  CATEGORY_COLORS[String(r || '').toLowerCase()] || {
    generateNeighborRelationship: '#f7f0e4',
    text: '#6b5340',
    label: '',
  };

// ─── Export ───────────────────────────────────────────────────────────────────

// ── Institution-level default category fallback ──────────────────────────────
// When a service name is not in SERVICE_CATEGORY_MAP, this provides the
// institution's inherent domain as the category default.
const INSTITUTION_DEFAULT_CATEGORY = {
  'Contract killer': 'criminal',
  "Assassins' guild": 'criminal',
  "Thieves' guild chapter": 'criminal',
  "Thieves' guild (powerful)": 'criminal',
  'Multiple criminal factions': 'criminal',
  'Black market': 'criminal',
  'Black market bazaar': 'criminal',
  'Street gang': 'criminal',
  'Smuggling operation': 'criminal',
  'Smuggling network': 'criminal',
  'Smuggling waypoint': 'criminal',
  'Bandit affiliate': 'criminal',
  'Front businesses': 'criminal',
  'Kidnapping ring': 'criminal',
  'Human trafficking network': 'criminal',
  'Underground city': 'criminal',
  'Local fence': 'criminal',
  'Fence (word of mouth)': 'criminal',
  'Outlaw shelter': 'criminal',
  'Free company hall': 'employment',
  'Mercenary quarter': 'employment',
  'Hired blades': 'employment',
  'Gladiatorial school': 'employment',
  'Beast trainers': 'employment',
  'Citizen militia': 'employment',
  'Town watch': 'employment',
  'Professional city watch': 'employment',
  Garrison: 'employment',
  Barracks: 'employment',
  'Multiple garrisons': 'employment',
  "Warden's Lodge": 'employment',
  Workhouse: 'employment',
  "Hunter's lodge": 'employment',
  Wildfowler: 'employment',
  "Adventurers' charter hall": 'employment',
  'Hireling hall': 'employment',
  "Multiple adventurers' guilds": 'employment',
  'Dungeon delving supply district': 'employment',
  "Veteran's lodge": 'employment',
  "Caravaneer's post": 'employment',
  "Caravan masters' exchange": 'employment',
  "Carriers' guild": 'employment',
  "Carriers' hiring hall": 'employment',
  'Post relay station': 'employment',
  'Gambling den': 'entertainment',
  'Gambling halls': 'entertainment',
  'Gambling district': 'entertainment',
  'Fighting pits': 'entertainment',
  'Colosseum/arena': 'entertainment',
  Theaters: 'entertainment',
  'Multiple theaters': 'entertainment',
  'Opera house': 'entertainment',
  'Bardic college': 'entertainment',
  Brothel: 'entertainment',
  'Brothel (red light district)': 'entertainment',
  'Red light district': 'entertainment',
  'Traveling performers': 'entertainment',
  'Charlatan fortune tellers': 'entertainment',
  'Dream parlors (high magic)': 'entertainment',
  'Village musician': 'entertainment',
  Blacksmith: 'equipment',
  'Blacksmiths (3-10)': 'equipment',
  'Resident smith (part-time)': 'equipment',
  Carpenter: 'equipment',
  'Carpenter (part-time)': 'equipment',
  'Carpenters (5-15)': 'equipment',
  Thatcher: 'equipment',
  Cooper: 'equipment',
  'Bowyer & fletcher': 'equipment',
  'Bowyers & fletchers (guild)': 'equipment',
  Sawmill: 'equipment',
  Tannery: 'equipment',
  Tanners: 'equipment',
  'Tanner (established)': 'equipment',
  Fuller: 'equipment',
  Dyer: 'equipment',
  Potter: 'equipment',
  Brickmaker: 'equipment',
  Chandler: 'equipment',
  Glassblower: 'equipment',
  Glassmakers: 'equipment',
  Ropemaker: 'equipment',
  Woodcarver: 'equipment',
  Smelter: 'equipment',
  'Specialized metalworkers': 'equipment',
  'Luxury goods quarter': 'equipment',
  'Craft guilds (5-15)': 'equipment',
  'Craft guilds (30-80)': 'equipment',
  'Craft guilds (100-150+)': 'equipment',
  'Weavers/Textile workers': 'equipment',
  Cobbler: 'equipment',
  "Cobbler's guild": 'equipment',
  Tailor: 'equipment',
  "Tailor's guild": 'equipment',
  Jeweller: 'equipment',
  "Furrier's district": 'equipment',
  'Salt works': 'equipment',
  Beekeeper: 'equipment',
  'Dairy farmer': 'equipment',
  Maltster: 'equipment',
  'Mine (open cast)': 'equipment',
  'Stone quarry': 'equipment',
  'Charcoal burner': 'equipment',
  'Peat cutter': 'equipment',
  Shepherd: 'equipment',
  'Shepherd collective': 'equipment',
  Fishmonger: 'equipment',
  'Fish market': 'equipment',
  'Fishing community': 'equipment',
  "Fisher's landing": 'equipment',
  'Pack animal trader': 'transport',
  'Stable master': 'equipment',
  'Stable district': 'equipment',
  'Stable yard': 'equipment',
  'Golem workforce': 'equipment',
  'Undead labor': 'equipment',
  Shipyard: 'equipment',
  'River boatyard': 'equipment',
  Vintner: 'equipment',
  Brewer: 'food',
  Brewery: 'food',
  'Bakers (5-15)': 'food',
  'Butchers (3-8)': 'food',
  Alehouse: 'food',
  'Ale house': 'food',
  'Taverns (5-20)': 'food',
  'Inn (multiple)': 'lodging',
  "Travelers' inn": 'lodging',
  'Wayside inn': 'lodging',
  'Coaching inn': 'lodging',
  'Inns and taverns (district)': 'lodging',
  Waystation: 'lodging',
  'Housing (180-1000 structures)': 'lodging',
  'Housing (1000-5000 structures)': 'lodging',
  'Dwellings (4-16)': 'lodging',
  'Dwellings (17-80)': 'lodging',
  'Dwellings (80-180)': 'lodging',
  'Small hospital': 'healing',
  'Major hospital': 'healing',
  'Hospital network': 'healing',
  'Monastery or friary': 'healing',
  'Multiple monasteries': 'healing',
  'Major monasteries (5-10)': 'healing',
  Almshouse: 'healing',
  'Foundling home': 'healing',
  Midwife: 'healing',
  Apothecary: 'healing',
  'Apothecary (established)': 'healing',
  'Apothecary district': 'healing',
  'Healer (divine, 1st level)': 'healing',
  Graveyard: 'healing',
  'Public bathhouse': 'healing',
  'Parish church': 'healing',
  'Parish churches (2-5)': 'healing',
  'Parish churches (10-30)': 'healing',
  'Parish churches (50-100+)': 'healing',
  'Wayside shrine': 'healing',
  'Access to parish church': 'healing',
  'Cathedral (10,000+ only)': 'healing',
  'Great cathedral': 'healing',
  'Priest (resident)': 'healing',
  'Village scribe': 'information',
  'Town crier': 'information',
  'Printing house': 'information',
  "Cartographer's workshop": 'information',
  "Cartographer's guild": 'information',
  'Great library': 'information',
  "Sage's quarter": 'information',
  'Message network (high magic)': 'information',
  'Planar embassy': 'information',
  'Mayor and council': 'legal',
  'Town hall': 'legal',
  'City hall': 'legal',
  Courthouse: 'legal',
  'Multiple courthouses': 'legal',
  'Multiple court buildings': 'legal',
  'Palace/government complex': 'legal',
  'Royal seat': 'legal',
  "Lord's reeve": 'legal',
  "Lord's steward": 'legal',
  "Lord's appointee": 'legal',
  'Head-of-household consensus': 'legal',
  'Informal elder consensus': 'legal',
  'Village reeve': 'legal',
  'Guild governance': 'legal',
  'Guild consortium': 'legal',
  'Merchant oligarchy': 'legal',
  'City-state government': 'legal',
  'Democratic assembly': 'legal',
  'Noble governor': 'legal',
  'Small prison/stocks': 'legal',
  'Large prison': 'legal',
  'Massive prison': 'legal',
  'Assay office': 'legal',
  'Customs house': 'legal',
  'Auction house': 'legal',
  'Merchant warehouses': 'legal',
  'Warehouse district': 'legal',
  'Town granary': 'legal',
  'City granaries': 'legal',
  'State granary complex': 'legal',
  'Money changers': 'legal',
  'Banking houses': 'legal',
  'Banking district': 'legal',
  Pawnbroker: 'legal',
  'Annual fair': 'legal',
  'Major annual fairs': 'legal',
  Mint: 'legal',
  'Mint (official)': 'legal',
  'Merchant guilds (3-8)': 'legal',
  'Merchant guilds (15-40)': 'legal',
  'Merchant guilds (50-100+)': 'legal',
  'Market square': 'legal',
  'Multiple market squares': 'legal',
  'Weekly market': 'legal',
  'Daily markets': 'legal',
  'District markets (5-10)': 'legal',
  'Periodic market': 'legal',
  'International trade center': 'legal',
  "Harbour master's office": 'transport',
  'Docks/port facilities': 'transport',
  'Barge and river transport company': 'transport',
  'River ferry': 'transport',
  'Toll bridge': 'transport',
  "Wizard's tower": 'magic',
  "Mages' guild": 'magic',
  "Mages' district": 'magic',
  'Alchemist shop': 'magic',
  'Alchemist quarter': 'magic',
  "Enchanter's shop": 'magic',
  'Scroll scribe': 'magic',
  'Teleportation circle': 'magic',
  'Airship docking (high magic)': 'magic',
  'Traveling hedge wizard': 'magic',
  'Hedge wizard': 'magic',
  'Druid Circle': 'magic',
  'Elder Grove Council': 'magic',
  'Planar traders': 'magic',
  'Academy of magic': 'magic',
};
// ── Explicit service→category lookup (auto-generated from comprehensive audit) ──
const SERVICE_CATEGORY_MAP = {
  'Arcane services (illicit)': 'criminal',
  'Contraband transport': 'criminal',
  'Discreet meeting venues': 'criminal',
  'Fence (word of mouth)': 'criminal',
  'Hired muscle': 'criminal',
  'No law, bring coin': 'criminal',
  'Protection (informal)': 'criminal',
  'Legitimate facade': 'criminal',
  'Administrative orders': 'employment',
  'Apprenticeship and training': 'employment',
  'Apprenticeship programs': 'employment',
  'Armed escort': 'employment',
  'Armed patrol': 'employment',
  'Bodyguard hire': 'employment',
  'Caravan escort (armed)': 'employment',
  'Combat training': 'employment',
  'Contract board': 'employment',
  'Debt enforcement': 'employment',
  // Garrison wall/gate patrol — legitimate defence work like 'Armed patrol'/
  // 'Watch rotation'; must never sit behind the criminal crime-scaled gate.
  'Defence services': 'employment',
  'Dungeon clearance': 'employment',
  'Emergency muster': 'employment',
  'Garrison contract': 'employment',
  'Guard hire (caravan)': 'employment',
  'Gated entry': 'employment',
  'Hiring hall': 'employment',
  'Horse training': 'employment',
  'Hunting guide hire': 'employment',
  'Livestock management': 'employment',
  'Animal training': 'employment',
  'Member support': 'employment',
  'Mercenary hire': 'employment',
  'Metalworking training': 'employment',
  'Night watch': 'employment',
  'Night watch hire': 'employment',
  'Party matching': 'employment',
  'Patrol and watch': 'employment',
  'Siege specialists': 'employment',
  'Tax collection': 'employment',
  'Textile labour': 'employment',
  'Training services': 'employment',
  Trapping: 'employment',
  'Vagrancy enforcement': 'employment',
  'Watch rotation': 'employment',
  'Wilderness scouting': 'employment',
  Bookmaking: 'entertainment',
  'Bookmaking on all events': 'entertainment',
  Entertainment: 'entertainment',
  'Exhibition bouts': 'entertainment',
  'Fortune telling': 'entertainment',
  'Games of chance': 'entertainment',
  'Games of chance (all kinds)': 'entertainment',
  'Gladiatorial combat': 'entertainment',
  'High-stakes gambling': 'entertainment',
  'Magical entertainment': 'entertainment',
  'Music and song': 'entertainment',
  'Musical education': 'entertainment',
  Performances: 'entertainment',
  'Performances (events)': 'entertainment',
  'Public games': 'entertainment',
  'Seasonal rituals': 'entertainment',
  'Ale (barrel)': 'equipment',
  'Ale (jug)': 'equipment',
  'Armour repair': 'equipment',
  'Armour warding': 'equipment',
  'Automated labour': 'equipment',
  Beeswax: 'equipment',
  'Beeswax candles': 'equipment',
  'Boot repair': 'equipment',
  Butter: 'equipment',
  'Carved goods': 'equipment',
  Charcoal: 'equipment',
  Coal: 'equipment',
  'Cordage (specialty)': 'equipment',
  'Creature components': 'equipment',
  'Custom commission': 'equipment',
  'Custom commissions': 'equipment',
  'Donkey purchase': 'equipment',
  'Draft horse purchase': 'equipment',
  'Dressed stone': 'equipment',
  'Dyed cloth': 'equipment',
  'Equipment hire': 'equipment',
  'Equipment purchase': 'equipment',
  'Exotic creatures for sale': 'equipment',
  Farriery: 'equipment',
  'Fine metalwork': 'equipment',
  'Fired brick': 'equipment',
  'Firewood (seasoned)': 'equipment',
  'Fresh fish': 'equipment',
  'Fulled cloth': 'equipment',
  'Fur garments': 'equipment',
  'Furs and pelts': 'equipment',
  'Game meat': 'equipment',
  'Garment repair': 'equipment',
  'Gem purchase': 'equipment',
  'Glass vessels': 'equipment',
  Honey: 'equipment',
  'Horse purchase': 'equipment',
  Horseshoeing: 'equipment',
  'Iron ore': 'equipment',
  'Iron refining': 'equipment',
  'Lumber milling': 'equipment',
  'Malted barley': 'equipment',
  'Manufactured goods (bulk)': 'equipment',
  'Mule purchase': 'equipment',
  'Peat fuel': 'equipment',
  'Pottery and ceramics': 'equipment',
  'Processed textiles': 'equipment',
  'Quality furs': 'equipment',
  'Quality leather': 'equipment',
  'Quality weapons and armour': 'equipment',
  'Quarried stone': 'equipment',
  Rawhide: 'equipment',
  'Religious carvings': 'equipment',
  'Roof tiles': 'equipment',
  Rope: 'equipment',
  'Rope (standard)': 'equipment',
  'Saddlery leather': 'equipment',
  'Salt for preservation': 'equipment',
  'Salted fish': 'equipment',
  'Sea salt': 'equipment',
  'Ship chandlery': 'equipment',
  'Ship repair': 'equipment',
  'Shoes (standard)': 'equipment',
  'Smoke and flash powder': 'equipment',
  Soap: 'equipment',
  'Soft cheese': 'equipment',
  'Tallow candles': 'equipment',
  'Tanned leather': 'equipment',
  'Tool repair': 'equipment',
  'Trade goods for export': 'equipment',
  'Weapon creation': 'equipment',
  'Wild game sales': 'equipment',
  'Window glass': 'equipment',
  'Wool shearing': 'equipment',
  'Working clothes': 'equipment',
  'Grain milling': 'food',
  'Meals and drink': 'food',
  Alms: 'healing',
  'Basic wound care': 'healing',
  'Barber services': 'healing',
  Bathing: 'healing',
  'Birth assistance': 'healing',
  'Charitable giving': 'healing',
  'Child placement': 'healing',
  'Healing herbs': 'healing',
  'Herbal remedies': 'healing',
  'Medical care (basic)': 'healing',
  'Medical training': 'healing',
  'Medical treatment': 'healing',
  'Pilgrim shelter': 'healing',
  'Poor relief': 'healing',
  Quarantine: 'healing',
  'Religious services': 'healing',
  Sanctuary: 'healing',
  Surgery: 'healing',
  'Advanced education': 'information',
  'Copying services': 'information',
  'Document copying': 'information',
  'Druidic consultation': 'information',
  'Education (basic)': 'information',
  'Fish prices (market rate)': 'information',
  'Historical research': 'information',
  'Information exchange': 'information',
  'Investigation services': 'information',
  'Letter writing': 'information',
  'Long-distance messages': 'information',
  'Message delivery': 'information',
  'Message relay': 'information',
  'Monster bounties': 'information',
  'Monster exhibitions': 'information',
  'Monster threat assessment': 'information',
  'News and information': 'information',
  'Price discovery': 'information',
  'Public announcements': 'information',
  'Rare texts': 'information',
  'Reading aloud': 'information',
  'Record keeping': 'information',
  'Research access': 'information',
  'Research facilities': 'information',
  'Route intelligence': 'information',
  'Rumour and news': 'information',
  'Scholarly community': 'information',
  'Diplomatic access': 'information',
  'Anonymous deposit': 'legal',
  Appraisal: 'legal',
  'Assay (informal)': 'legal',
  'Auction services': 'legal',
  'Bonded storage': 'legal',
  'Civil disputes': 'legal',
  'Coin exchange': 'legal',
  'Contract negotiation': 'legal',
  'Criminal trials': 'legal',
  'Customs brokerage': 'legal',
  'Customs clearance': 'legal',
  'Deposit accounts': 'legal',
  'Estate sales': 'legal',
  'Gem appraisal': 'legal',
  'Goods purchase': 'legal',
  'Goods storage': 'legal',
  'Import/export permits': 'legal',
  'Institutional lending': 'legal',
  'International finance': 'legal',
  'International shipping': 'legal',
  'Investment banking': 'legal',
  'Jewellery appraisal': 'legal',
  'Letters of credit': 'legal',
  Loans: 'legal',
  'Loans (secured)': 'legal',
  'Maritime clearance': 'legal',
  'Metal purity testing': 'legal',
  'Money changing': 'legal',
  'Nature arbitration': 'legal',
  'Notary services': 'legal',
  'Prisoner holding': 'legal',
  'Quality control': 'legal',
  'Quality standards': 'legal',
  'Trade facilitation': 'legal',
  'Trade regulation': 'legal',
  'Warehousing (bonded)': 'legal',
  'Basic provisions': 'lodging',
  'Food and drink (all grades)': 'lodging',
  Lodging: 'lodging',
  'Lodging (all grades)': 'lodging',
  'Alchemical products': 'magic',
  'Alchemical reagents': 'magic',
  'Arcane research': 'magic',
  'Arcane scribing': 'magic',
  'Cantrips and minor magic': 'magic',
  'Curse removal (claimed)': 'magic',
  'Enchanting services': 'magic',
  'Extraplanar goods': 'magic',
  'Magical identification': 'magic',
  'Magical item market': 'magic',
  'Magical references': 'magic',
  'Magical training': 'magic',
  'Nature magic services': 'magic',
  'Planar services': 'magic',
  'Potions and elixirs': 'magic',
  'Spellcasting (1st-3rd level)': 'magic',
  'Spellcasting services (1st-6th)': 'magic',
  'Utility enchantments': 'magic',
  'Weapon enchantment': 'magic',
  'Wilderness guidance': 'magic',
  'Animal hire (daily)': 'transport',
  'Berth assignment': 'transport',
  'Cargo assembly': 'transport',
  'Cargo handling': 'transport',
  'Cargo shipping': 'transport',
  'Caravan assembly': 'transport',
  'Horse stabling': 'transport',
  'Mount hire (daily)': 'transport',
  'Overnight stabling': 'transport',
  'Pack animal hire': 'transport',
  'Passenger transport': 'transport',
  'Passenger vessel': 'transport',
  Pilotage: 'transport',
  'Post horse hire': 'transport',
  'River crossing': 'transport',
  Stabling: 'transport',
  'Stabling (long-term)': 'transport',
  'Vessel hire': 'transport',
  // Magical/large-scale transit is transport first and foremost. Without
  // these, the heuristic classifier filed them under magic (teleport/planar
  // keywords, airship-dock institution default) or legal ('cargo loading'),
  // so a metropolis with a Teleportation circle or airship dock still showed
  // "Transportation" under NOTABLE ABSENCES. No-magic worlds are unaffected:
  // these providers are filtered at the institution level (ARCANE_INST_KW).
  'Long-distance teleportation': 'transport',
  'Planar transit': 'transport',
  'Airship berths': 'transport',
  'Passenger boarding': 'transport',
  'Cargo loading': 'transport',
};

// Criminal-institution vocabulary — shared by the crime-scaled service gate
// and the synthetic informal-crime fallback so the two stay in sync.
const _CRIMINAL_INST_KW = [
  'thieves',
  'black market',
  'smuggl',
  'street gang',
  'front business',
  'assassin',
  'gambling den',
  'underground',
  'red light',
  'criminal faction',
];
// The crime-scaled gate models ILLICIT supply tracking criminal presence.
// It only applies to services offered by criminal institutions: a legitimate
// provider's services (garrison patrols, a tavern back room) must not vanish
// because the settlement is lawful — the institution already exists.
const _isCriminalProvider = (inst) => {
  if ((inst.category || '').toLowerCase() === 'criminal') return true;
  const n = (inst.name || '').toLowerCase();
  return _CRIMINAL_INST_KW.some((kw) => n.includes(kw));
};

// generateAvailableServices
export const generateAvailableServices = (r, s, o = {}, d = {}) => {
    const l = {
        lodging: [],
        food: [],
        equipment: [],
        magic: [],
        information: [],
        healing: [],
        transport: [],
        legal: [],
        employment: [],
        entertainment: [],
        criminal: [],
      },
      m = getInstFlags(d, s).criminalEffective,
      h = (A, S) => {
        const y = A.toLowerCase(),
          v = S.toLowerCase();
        // Explicit lookup first — covers all 260 known services unambiguously
        const _mapped = SERVICE_CATEGORY_MAP[A];
        if (_mapped) return _mapped;
        return y === 'lodging' ||
          y.includes('lodging') ||
          y.includes('accommodation') ||
          y.includes('all grades') ||
          y.includes('rooms for') ||
          y.includes('common room') ||
          y.includes('private suite')
          ? 'lodging'
          : (v.includes('inn') || v.includes('tavern')) &&
              (y.includes('meals') || y.includes('drink') || y.includes('ale') || y.includes('food and'))
            ? 'food'
            : v.includes('inn') || v.includes('tavern') || v.includes('hospitality')
              ? y.includes('entertainment') ||
                y.includes('performance') ||
                y.includes('games') ||
                y.includes('companionship') ||
                y.includes('music')
                ? 'entertainment'
                : y.includes('hiring hall')
                  ? 'employment'
                  : 'lodging'
              : y.includes('grain mill') ||
                  y.includes('milling') ||
                  y.includes('flour') ||
                  y.includes('bread') ||
                  y.includes('meals') ||
                  y.includes('food') ||
                  y.includes('drink') ||
                  y.includes(' ale') ||
                  y === 'ale' ||
                  y.includes('ale and') ||
                  y.includes('dining')
                ? 'food'
                : y.includes('fence') ||
                    y.includes('contraband') ||
                    y.includes('stolen') ||
                    y.includes('smuggl') ||
                    y.includes('forgery') ||
                    y.includes('black market') ||
                    y.includes('protection racket') ||
                    y.includes('safe house') ||
                    y.includes('burglary') ||
                    y.includes('contract killing') ||
                    y.includes('intimidation') ||
                    y.includes('money launder') ||
                    y.includes('hidden market') ||
                    y.includes('unregistered lodging') ||
                    y.includes('discretion') ||
                    y.includes('guild membership') ||
                    y.includes('untaxed') ||
                    y.includes('restricted goods') ||
                    y.includes('arcane underground') ||
                    y.includes('competitive pricing') ||
                    y.includes('mercenary alignment') ||
                    y.includes('unlicensed tables') ||
                    y.includes('loans (at interest)') ||
                    v.includes('thieves') ||
                    v.includes('assassin') ||
                    v.includes('black market') ||
                    v.includes('smuggling') ||
                    v.includes('criminal') ||
                    v.includes('underground city') ||
                    v.includes('front business')
                  ? 'criminal'
                  : (y.includes('weapon') && !y.includes('weapon enchant')) ||
                      y.includes('armour') ||
                      y.includes('armor') ||
                      y.includes('horseshoe') ||
                      y.includes('tool repair') ||
                      y.includes('equipment') ||
                      (y.includes('siege') && !y.includes('siege specialist')) ||
                      y.includes('engraving') ||
                      y.includes('inscription') ||
                      y.includes('jewellery') ||
                      y.includes('jewelry') ||
                      y.includes('precious metal') ||
                      y.includes('repair and') ||
                      y.includes('commissions') ||
                      y.includes('craftsmen') ||
                      y.includes('bespoke') ||
                      y.includes('quality goods') ||
                      y.includes('master-quality') ||
                      y.includes('processed textile') ||
                      y.includes('dyed cloth') ||
                      y.includes('woven cloth') ||
                      y.includes('finished fabric')
                    ? 'equipment'
                    : y.includes('spell') ||
                        y.includes('magic') ||
                        y.includes('potion') ||
                        y.includes('enchant') ||
                        y.includes('scroll') ||
                        y.includes('alch') ||
                        y.includes('planar') ||
                        y.includes('arcane') ||
                        y.includes('weapon enchant') ||
                        y.includes('identification') ||
                        y.includes('teleport') ||
                        y.includes('dispel') ||
                        y.includes('remove curse') ||
                        y.includes('curse removal') ||
                        y.includes('ward') ||
                        y.includes('warding')
                      ? 'magic'
                      : y.includes('medical') ||
                          y.includes('healing') ||
                          y === 'cure' ||
                          y.startsWith('cure ') ||
                          y.includes(' cure') ||
                          y.includes('cured') ||
                          y.includes('curing') ||
                          y.includes('antitoxin') ||
                          y.includes('antidote') ||
                          (y.includes('tonic') && !y.includes('tectonic')) ||
                          y.includes('salve') ||
                          y.includes('surgery') ||
                          y.includes('quarantine') ||
                          y.includes('restoration') ||
                          y.includes('physician') ||
                          y.includes('sick') ||
                          y.includes('wounded') ||
                          y.includes('religious service') ||
                          y.includes('last rites') ||
                          y.includes('medical care') ||
                          y.includes('treatment') ||
                          y.includes('child placement') ||
                          y.includes('foundling') ||
                          y === 'sanctuary' ||
                          y.includes('last rites')
                        ? 'healing'
                        : y.includes('performance') ||
                            y.includes('entertainment') ||
                            y.includes('gladiatorial') ||
                            y.includes('games of chance') ||
                            y.includes('licensed tables') ||
                            y.includes('unlicensed tables') ||
                            y.includes('companionship') ||
                            y.includes('theatrical') ||
                            y.includes('music') ||
                            y.includes('bard') ||
                            y.includes('enter as combatant') ||
                            y.includes('private performance') ||
                            y.includes('public performance') ||
                            y.includes('high-stakes gambling') ||
                            y.includes('high stakes gambling') ||
                            y.includes('public games')
                          ? 'entertainment'
                          : [
                                'horse rental',
                                'cart rental',
                                'ship passage',
                                'passage (',
                                'teleportation to',
                                'coach',
                                'ferry',
                                'mounted',
                                'carriage',
                                'short passage',
                                'deep-water passage',
                                'convoy authorization',
                                'cargo shipping',
                                'naval escort',
                                'scheduled freight',
                                'freight run',
                                'freight haulage',
                                'freight contract',
                                'convoy assembly',
                                'convoy escort',
                                'armed escort contracting',
                                'route intelligence',
                                'route information',
                                'road intelligence',
                                'bonded freight',
                                'cargo staging',
                                'pack animal rental',
                                'carter hire',
                                'passenger river passage',
                                'river pilot',
                                'charter barge',
                                'towpath',
                                'upriver',
                                'downriver',
                                'river crossing',
                                'river craft',
                                'scheduled coach',
                                'coach departure',
                                'coach hire',
                                'private coach',
                                'passenger lodging',
                                'stabling',
                                'navigation consultation',
                                'coastal chart',
                                'sea route',
                                'commercial dispute resolution',
                              ].some((j) => y.includes(j)) ||
                              v.includes('carrier') ||
                              v.includes('caravan') ||
                              v.includes('barge') ||
                              v.includes('coaching') ||
                              v.includes('ferry') ||
                              v.includes('boatyard') ||
                              v.includes('transport')
                            ? 'transport'
                            : y.includes('cargo handling') ||
                                y.includes('cargo loading') ||
                                y.includes('bonded storage') ||
                                y.includes('staging and distribution') ||
                                y.includes('goods storage') ||
                                y.includes('warehouse') ||
                                y.includes('vault') ||
                                y.includes('secure storage') ||
                                y.includes('deposit') ||
                                y.includes('letters of credit') ||
                                y.includes('insurance') ||
                                y.includes('wealth management') ||
                                y.includes('trade financing') ||
                                y.includes('currency exchange') ||
                                y.includes('money changing')
                              ? 'legal'
                              : y.includes('planar') || y.includes('extraplanar') || y.includes('draconic')
                                ? 'magic'
                                : y.includes('monster component') ||
                                    y.includes('monster intelligence') ||
                                    y.includes('commission hunting') ||
                                    y.includes('processing and preserv') ||
                                    y.includes('guard animals') ||
                                    y.includes('companion training') ||
                                    y.includes('messenger beast') ||
                                    y.includes('reagent sourcing') ||
                                    y.includes('labour hire') ||
                                    y.includes('golem') ||
                                    y.includes('undead') ||
                                    y.includes('night watch') ||
                                    y.includes('corpse processing') ||
                                    y.includes('precision fabrication') ||
                                    y.includes('guard deployment') ||
                                    y.includes('apprenticeship program') ||
                                    y.includes('metalworking training') ||
                                    y.includes('hiring hall') ||
                                    (y.includes('hire') &&
                                      (y.includes('guard') ||
                                        y.includes('muscle') ||
                                        y.includes('worker') ||
                                        y.includes('servant')))
                                  ? 'employment'
                                  : y.includes('healing (1st') ||
                                      y.includes('utility magic') ||
                                      y.includes('greater restoration') ||
                                      y.includes('true resurrection') ||
                                      y.includes('restoration')
                                    ? 'healing'
                                    : y.includes('contract board') ||
                                        y.includes('rumour board') ||
                                        y.includes('rumor board') ||
                                        y.includes('monster intelligence') ||
                                        y.includes('emergency muster') ||
                                        y.includes('bounty board') ||
                                        y.includes('delve contract')
                                      ? 'employment'
                                      : y.includes('legal') ||
                                          y.includes('civil dispute') ||
                                          y.includes('notary') ||
                                          y.includes('contract') ||
                                          y.includes('trial') ||
                                          y.includes('property') ||
                                          y.includes('wealth management') ||
                                          y.includes('trade financ') ||
                                          y.includes('insurance') ||
                                          y.includes('vaulting') ||
                                          y.includes('letters of credit') ||
                                          y.includes('currency exchange') ||
                                          y.includes('money changing') ||
                                          y.includes('loans') ||
                                          y.includes('deposit') ||
                                          y.includes('arbitration') ||
                                          y.includes('certification') ||
                                          y.includes('genealog') ||
                                          y.includes('degree') ||
                                          y.includes('credential')
                                        ? 'legal'
                                        : y.includes('quest') ||
                                            y.includes('bounty') ||
                                            y.includes('hired muscle') ||
                                            y.includes('company contract') ||
                                            y.includes('mercenary') ||
                                            y.includes('guard for hire') ||
                                            y.includes('hiring hall') ||
                                            y.includes('party match') ||
                                            y.includes('siege specialist') ||
                                            y.includes('employment') ||
                                            y.includes('specialist warrior') ||
                                            y.includes('training service') ||
                                            y.includes('party registration') ||
                                            y.includes('patrol and escort') ||
                                            y.includes('escort') ||
                                            y.includes('threat reporting') ||
                                            y.includes('training yard') ||
                                            y.includes('military intelligence') ||
                                            y.includes('guard deployment') ||
                                            y.includes('guard animal') ||
                                            y.includes('guard hire') ||
                                            y.includes('convoy escort') ||
                                            y.includes('naval escort') ||
                                            y.includes('commission hunting') ||
                                            y.includes('labour hire') ||
                                            y.includes('companion training') ||
                                            y.includes('messenger beast') ||
                                            y.includes('contract board') ||
                                            y.includes('emergency muster') ||
                                            y.includes('monster bounty') ||
                                            y.includes('monster contract') ||
                                            y.includes('hired swords') ||
                                            y.includes('party registration') ||
                                            y.includes('rumour board') ||
                                            y.includes('rumor board') ||
                                            y.includes('monster intelligence') ||
                                            y.includes('bounty board') ||
                                            y.includes('delve contract') ||
                                            y.includes('charter contract')
                                          ? 'employment'
                                          : y.includes('research') ||
                                              y.includes('information') ||
                                              y.includes('rumour') ||
                                              y.includes('gossip') ||
                                              y.includes('record') ||
                                              y.includes('news') ||
                                              y.includes('history') ||
                                              y.includes('lore') ||
                                              y.includes('consultation') ||
                                              y.includes('intelligence') ||
                                              y.includes('monster') ||
                                              y.includes('library') ||
                                              (y.includes('text') && !y.includes('textile')) ||
                                              y.includes('scribal') ||
                                              y.includes('copying') ||
                                              y.includes('translation') ||
                                              y.includes('authentication') ||
                                              y.includes('rare text') ||
                                              y.includes('poor relief') ||
                                              y.includes('charity') ||
                                              y.includes('education') ||
                                              y.includes('news and') ||
                                              y.includes('price') ||
                                              (y.includes('apprenticeship') &&
                                                !y.includes('apprenticeship and training'))
                                            ? 'information'
                                            : y.includes('apprenticeship and training')
                                              ? 'employment'
                                              : y.includes('sanctuary') || y.includes('pilgrim') || y.includes('alms')
                                                ? 'healing'
                                                : y.includes('patrol and watch') ||
                                                    y.includes('vagrancy') ||
                                                    y.includes('textile labour') ||
                                                    y.includes('member support')
                                                  ? 'employment'
                                                  : y.includes('trade regulation') ||
                                                      y.includes('quality control') ||
                                                      y.includes('quality standard') ||
                                                      y.includes('trade facilit') ||
                                                      y.includes('guild certif') ||
                                                      y.includes('prisoner hold') ||
                                                      y.includes('auction service')
                                                    ? 'legal'
                                                    : y.includes('discreet meeting')
                                                      ? 'criminal'
                                                      : v.includes('bank') || v.includes('banking')
                                                        ? 'legal'
                                                        : v.includes('church') ||
                                                            v.includes('temple') ||
                                                            v.includes('parish') ||
                                                            v.includes('cathedral') ||
                                                            v.includes('monastery') ||
                                                            v.includes('healer')
                                                          ? 'healing'
                                                          : v.includes('court')
                                                            ? 'legal'
                                                            : v.includes('university') ||
                                                                v.includes('academy') ||
                                                                v.includes('library')
                                                              ? 'information'
                                                              : (v.includes('inn') ||
                                                                    v.includes('tavern') ||
                                                                    v.includes('hospitality')) &&
                                                                  !y.includes('hiring hall')
                                                                ? 'lodging'
                                                                : y.includes('hiring hall')
                                                                  ? 'employment'
                                                                  : v.includes('smith') ||
                                                                      v.includes('craft') ||
                                                                      v.includes('guild')
                                                                    ? 'equipment'
                                                                    : y.includes('estate sale')
                                                                      ? 'legal'
                                                                      : y.includes('bookmaking') ||
                                                                          y.includes('public game')
                                                                        ? 'entertainment'
                                                                        : y.includes('investigation service') ||
                                                                            y.includes('message relay')
                                                                          ? 'information'
                                                                          : y.includes('textile labour') ||
                                                                              y.includes(
                                                                                'apprenticeship and training'
                                                                              ) ||
                                                                              y.includes('siege specialist')
                                                                            ? 'employment'
                                                                            : y.includes('processed textile') ||
                                                                                y.includes('trade goods for export')
                                                                              ? 'equipment'
                                                                              : y.includes('party match') ||
                                                                                  y.includes('referral')
                                                                                ? 'employment'
                                                                                : y.includes('textile') ||
                                                                                    y.includes('fabric') ||
                                                                                    y.includes('cloth') ||
                                                                                    y.includes('garment') ||
                                                                                    y.includes('fur ') ||
                                                                                    y.includes('hide') ||
                                                                                    y.includes('leather') ||
                                                                                    y.includes('tanning') ||
                                                                                    y.includes('metalwork') ||
                                                                                    y.includes('pottery') ||
                                                                                    y.includes('ceramic') ||
                                                                                    y.includes('glasswork') ||
                                                                                    y.includes('woodwork') ||
                                                                                    y.includes('carpentry') ||
                                                                                    y.includes('furniture') ||
                                                                                    y.includes('chandler') ||
                                                                                    y.includes('candle') ||
                                                                                    y.includes('ropemaking') ||
                                                                                    y.includes('cooperage') ||
                                                                                    y.includes('barrel') ||
                                                                                    y.includes('processed') ||
                                                                                    y.includes('manufactured') ||
                                                                                    y.includes('crafted') ||
                                                                                    y.includes('forged') ||
                                                                                    y.includes('commissioned') ||
                                                                                    y.includes('bespoke') ||
                                                                                    y.includes('powder') ||
                                                                                    y.includes('flash') ||
                                                                                    y.includes('smoke')
                                                                                  ? 'equipment'
                                                                                  : y.includes(
                                                                                        'high-stakes gambling'
                                                                                      ) ||
                                                                                      y.includes('high stakes gambling')
                                                                                    ? 'entertainment'
                                                                                    : y.includes('weapon enchant') ||
                                                                                        y.includes('magical weapon')
                                                                                      ? 'magic'
                                                                                      : INSTITUTION_DEFAULT_CATEGORY[
                                                                                          S
                                                                                        ] || 'equipment';
      },
      g = new Set(),
      w = Object.assign({}, o, {
        _tradeRoute: d._tradeRoute || '',
      });
    // Filter out magic/supernatural institutions when magic doesn't exist in this world
    const _noMagicSvcs = d.magicExists === false || (d.priorityMagic || 50) === 0;
    const _filteredInsts = _noMagicSvcs
      ? s.filter((A) => {
          const n = (A.name || '').toLowerCase();
          const cat = (A.category || '').toLowerCase();
          if (cat === 'magic' || cat === 'exotic') return false;
          return !_ARCANE_SVC_KW.some((kw) => n.includes(kw));
        })
      : s;
    _filteredInsts.forEach((A) => {
      getServicesForInstitution(A.name, r, w).forEach((S) => {
        const y = S.name;
        if (g.has(y)) return;
        g.add(y);
        const v = getServiceTierInfo(S.name, A.name, d, s),
          j = h(S.name, A.name); // Skip magic-category services in no-magic worlds
        if (j === 'magic' && _noMagicSvcs) return;
        // Same short-circuit order as the old `a || b || push` chain so the
        // seeded _rng() call sequence (and thus generation output) is stable.
        if (
          !(j === 'criminal' && _isCriminalProvider(A) && _rng() > Math.min(1, (m / 100) * 1.5)) &&
          !((S.p || 1) < 1 && v < 1 && _rng() > v) &&
          l[j]
        ) {
          l[j].push({
            name: S.name,
            desc: S.desc,
            institution: A.name,
          });
          // Cross-list, don't move: inn/tavern food lines ('Food and drink
          // (all grades)', 'Basic provisions') belong on the lodging page,
          // but the settlement genuinely HAS food — without a `food` entry,
          // deriveNotableAbsences flagged "Food & Drink" as a notable absence
          // while the lodging list advertised food two lines up.
          if (j === 'lodging' && /food|drink|provision|meal/i.test(S.name)) {
            l.food.push({
              name: S.name,
              desc: S.desc,
              institution: A.name,
            });
          }
        }
      });
    });
    const p = s.some((A) => {
        const S = (A.name || '').toLowerCase();
        return _CRIMINAL_INST_KW.some((kw) => S.includes(kw));
      }),
      b = getInstFlags(d, s).militaryEffective / Math.max(8, m);
    !p &&
      (m >= 38 || b < 1.2) &&
      l.criminal.length === 0 &&
      !['thorp', 'hamlet', 'village'].includes(d.settType || d.tier || 'village') &&
      (b < 0.6
        ? l.criminal.push(
            {
              name: 'No law, bring coin',
              desc: 'There is no official recourse here. Disputes end with whoever can apply more violence or pay more for SEVERITY.',
              institution: '(lawless)',
            },
            {
              name: 'Protection (informal)',
              desc: 'Pay a local strongman, a neighbor, or a gang for some measure of safety. No contracts, no guarantees.',
              institution: '(informal)',
            }
          )
        : l.criminal.push(
            {
              name: 'Fence (word of mouth)',
              desc: 'Ask around at the right tavern. Someone moves goods without questions.',
              institution: '(covert)',
            },
            {
              name: 'Hired muscle',
              desc: 'Informal, no contract. Violence available for coin to those who know where to ask.',
              institution: '(covert)',
            }
          ),
      !p &&
        m >= 55 &&
        b < 0.5 &&
        l.criminal.length === 0 &&
        ['village'].includes(d.settType || d.tier || '') &&
        (b < 0.4
          ? l.criminal.push(
              {
                name: 'No law, bring coin',
                desc: 'There is no official recourse here. Disputes end with whoever can apply more violence or pay more for SEVERITY.',
                institution: '(lawless)',
              },
              {
                name: 'Protection (informal)',
                desc: 'Pay a local strongman, a neighbor, or a gang for some measure of safety. No contracts, no guarantees.',
                institution: '(informal)',
              }
            )
          : l.criminal.push(
              {
                name: 'Fence (word of mouth)',
                desc: 'Ask around at the right tavern. Someone moves goods without questions.',
                institution: '(covert)',
              },
              {
                name: 'Hired muscle',
                desc: 'Informal, no contract. Violence available for coin to those who know where to ask.',
                institution: '(covert)',
              }
            )),
      m >= 55 &&
        l.criminal.push({
          name: 'Contraband',
          desc: 'Untaxed or restricted goods available through back-channel contacts.',
          institution: '(covert)',
        }));
    const k = getStressFlags(d, s);
    (k.stateCrime &&
      [
        {
          name: 'Bribe a guard',
          desc: 'Payments to officials are the cost of operating here. Rates are understood if not advertised.',
        },
        {
          name: 'Disappear quietly',
          desc: 'Those who know the right people can arrange to vanish from the official register — for a price.',
        },
        {
          name: 'Intelligence on officials',
          desc: 'Knowing who can be bought, who is watched, and who reports to whom is worth coin.',
        },
      ].forEach((A) => {
        l.criminal.some((S) => S.name === A.name) ||
          l.criminal.push({
            ...A,
            institution: '(state apparatus)',
          });
      }),
      k.crimeIsGovt &&
        [
          {
            name: 'Dispute resolution (guild)',
            desc: 'The guild adjudicates conflicts. Their judgment is final; resistance is inadvisable.',
          },
          {
            name: 'Extortion (structured)',
            desc: 'The rate is posted. Everyone pays. It is not officially called extortion.',
          },
          {
            name: 'Contraband licensing',
            desc: 'The organization decides what flows through here. Operators without authorization are removed.',
          },
        ].forEach((A) => {
          l.criminal.some((S) => S.name === A.name) ||
            l.criminal.push({
              ...A,
              institution: '(criminal governance)',
            });
        }),
      k.arcaneBlackMarket &&
        [
          {
            name: 'Forbidden components',
            desc: 'Rare and restricted magical ingredients available to those who do not ask where they come from.',
          },
          {
            name: 'Unlicensed enchantment',
            desc: 'Practitioners working outside guild oversight — cheaper, less traceable, and legally inadvisable.',
          },
          {
            name: 'Magical forgery',
            desc: 'Identification papers, writs, and seals with genuine magical authentication — fraudulently applied.',
          },
        ].forEach((A) => {
          l.criminal.some((S) => S.name === A.name) ||
            l.criminal.push({
              ...A,
              institution: '(arcane underground)',
            });
        }),
      k.religiousFraud &&
        [
          {
            name: 'Relics (dubious provenance)',
            desc: 'Sacred objects with impeccable documentation. The documentation was written last week.',
          },
          {
            name: 'Indulgences and dispensations',
            desc: 'Formal church forgiveness, delivered by clergy with flexible interpretations of canon.',
          },
          {
            name: 'False prophecy',
            desc: 'Readings, visions, and omens from practitioners who know what the client wants to hear.',
          },
        ].forEach((A) => {
          l.criminal.some((S) => S.name === A.name) ||
            l.criminal.push({
              ...A,
              institution: '(religious fraud)',
            });
        }),
      k.merchantCriminalBlur &&
        [
          {
            name: 'Unofficial arbitration',
            desc: 'Commercial disputes resolved outside the courts — faster, cheaper, and more reliably enforced.',
          },
          {
            name: 'Gray market goods',
            desc: 'Legitimately produced goods moving through channels that avoid inspection, duty, or guild oversight.',
          },
          {
            name: 'Front company formation',
            desc: 'Establish a legitimate face for operations that benefit from appearing above board.',
          },
        ].forEach((A) => {
          l.criminal.some((S) => S.name === A.name) ||
            l.criminal.push({
              ...A,
              institution: '(commercial crime)',
            });
        }));
    const f = generateSafetyProfile(d, r, s),
      C = getInstFlags(d, s);
    (getPriorities(d), C.inst, C.criminalEffective);
    const T = new Set((f.crimeTypes || []).map((A) => A.type)),
      M = (A, S, y) => {
        g.has(A) ||
          (g.add(A),
          l.criminal.some((v) => v.name === A) ||
            l.criminal.push({
              name: A,
              desc: S,
              institution: y,
            }));
      };
    return (
      T.has('Survival crime') &&
        M(
          'Fence (word of mouth)',
          'No questions asked — stolen goods move through back channels for a fraction of value.',
          '(covert)'
        ),
      T.has('Street gang activity') &&
        (M(
          'Protection racket',
          'Pay or have your premises damaged. The gangs are territorial and consistent.',
          '(street gang)'
        ),
        M(
          'Muscle for hire',
          'Rough up a target, intimidate a debtor, move a problem — informal, no contract.',
          '(street gang)'
        )),
      T.has('Smuggling') &&
        M(
          'Contraband transport',
          'Goods move past checkpoints. The routes exist; the operators know the schedules.',
          '(smuggling)'
        ),
      T.has('Magical crime') &&
        M(
          'Arcane services (illicit)',
          'Magical practitioners outside guild oversight — identity work, scrying, targeted effects. Available if you know where to ask.',
          '(arcane underground)'
        ),
      T.has('Lawlessness') &&
        (M(
          'No law, bring coin',
          'There is no official recourse here. Disputes end with whoever can apply more violence or pay more for SEVERITY.',
          '(lawless)'
        ),
        M(
          'Protection (informal)',
          'Pay a local strongman, a neighbor, or a gang for some measure of safety. No contracts, no guarantees.',
          '(informal)'
        )),
      T.has('Organized guild crime') &&
        M('Fence (stolen goods)', 'Move recovered goods, no questions — expect 30-50% of value.', '(thieves guild)'),
      T.has('Background crime') &&
        M(
          'Fence (word of mouth)',
          'Ask around at the right tavern. Someone moves goods without questions.',
          '(covert)'
        ),
      Object.keys(l).forEach(function (A) {
        l[A].sort(function (S, y) {
          return S.name.localeCompare(y.name);
        });
      }),
      l
    );
  };
