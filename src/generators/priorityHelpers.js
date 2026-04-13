/**
 * priorityHelpers.js
 * Settlement priority scoring: getPriorities, getInstFlags, getStressFlags.
 * Extracted from helpers.js to keep it focused.
 */

import {clamp} from './helpers.js';

export const getPriorities = (config = {}) => ({
  economy:  config.priorityEconomy  ?? 50,
  military: config.priorityMilitary ?? 50,
  religion: config.priorityReligion ?? 50,
  magic:    config.priorityMagic    ?? 50,
  criminal: config.priorityCriminal ?? 50,
});

// ─── Institution classification ──────────────────────────────────────────────

/** True if any element of nameList contains any of the keywords. */
const hasAny = (nameList, keywords) =>
  keywords.some(k => nameList.some(n => n.includes(k)));

/**
 * Classify a settlement's institution list into boolean presence flags.
 * All comparisons are lowercase; call this once and pass the result around.
 *
 * @param {Array<{name:string}>} institutions
 * @returns {Object} Boolean presence flags
 */
const getInstitutionNames = (institutions = []) => {
  const names = institutions.map(i => (i.name || '').toLowerCase());
  return {
    hasMilitaryInst:  hasAny(names, ['garrison','barracks','guard','watch','citadel','walls','militia','mercenary','navy','charter hall']),
    hasGarrison:      hasAny(names, ['garrison','barracks','professional guard','professional city watch','multiple garrison']),
    hasMilitia:       hasAny(names, ['citizen militia','militia']),
    hasWatch:         hasAny(names, ['town watch','city watch','professional city watch']),
    hasMercenary:     hasAny(names, ['mercenary company','mercenary quarter','hired muscle','hireling hall','free company hall','veteran\'s lodge']),
    hasFreeCompany:   hasAny(names, ['free company hall']),
    hasCharterHall:   hasAny(names, ["adventurers' charter hall","adventurers' guild hall","multiple adventurers'","adventurers' guild","hireling hall"]),
    hasWalls:         hasAny(names, ['walls','citadel','gates (if walled)','inner citadel','massive walls','palisade','earthwork']),
    hasGates:         hasAny(names, ['gates','town walls','city walls','massive walls','palisade']),
    hasPrison:        hasAny(names, ['prison','stocks','large prison','massive prison']),
    hasCourtSystem:   hasAny(names, ['courthouse','court buildings','democratic assembly','city hall','town hall']),
    hasMarket:        hasAny(names, ['market','bazaar','fair','trade center','exchange']),
    hasGuild:         hasAny(names, ['guild','guild consortium','guild governance']),
    hasMerchantGuild: hasAny(names, ['merchant guild','merchant oligarchy']),
    hasBank:          hasAny(names, ['bank','money changer','counting','stock exchange']),
    hasWarehouse:     hasAny(names, ['warehouse']),
    hasPort:          hasAny(names, ['port','dock','major port','navy']),
    hasNavy:          hasAny(names, ['navy','major port']),
    hasGranary:       hasAny(names, ['granar']),
    hasHospital:      hasAny(names, ['hospital','monastery','healer','friary']),
    hasChurch:        hasAny(names, ['church','cathedral','temple','monastery','friary','shrine','priest','abbey']),
    hasCathedral:     hasAny(names, ['cathedral','great cathedral']),
    hasMonastery:     hasAny(names, ['monastery','friary','major monasteries']),
    hasMagicInst:     hasAny(names, ['wizard','mage','alchemist','enchant','arcane','academy of magic','scroll scribe','spellcasting','hedge wizard']),
    hasMagesGuild:    hasAny(names, ["mages' guild",'mages district','enchanting quarter']),
    hasWizardTower:   hasAny(names, ["wizard's tower",'multiple wizard towers']),
    hasAlchemist:     hasAny(names, ['alchemist shop','alchemist quarter']),
    hasCriminalInst:  hasAny(names, ["thieves' guild",'black market','smuggling','assassins','street gang','front business','gambling den','underground city','multiple criminal']),
    hasThievesGuild:  hasAny(names, ["thieves' guild chapter","thieves' guild (powerful)"]),
    hasBlackMarket:   hasAny(names, ['black market','black market bazaar']),
    hasSmuggling:     hasAny(names, ['smuggling network','smuggling operation']),
    hasGangInfra:     hasAny(names, ['street gang','multiple criminal factions','front business']),
    names,
  };
};

// ─── Teleportation infrastructure ───────────────────────────────────────────

/**
 * True if the settlement has a teleportation/planar institution AND magic
 * priority is high enough (≥ 66) to actually maintain it.
 *
 * @param {Array<{name:string}>} institutions
 * @param {Object} config
 */

// ─── Effective magic presence ────────────────────────────────────────────────

/**
 * computeEffectiveMagicPresence
 *
 * Single source of truth for magic level across Daily Life, Defense, and Power.
 * Three inputs interact:
 *   1. World slider (priorityMagic) — ambient baseline + ceiling
 *   2. Institution presence — weighted by sophistication tier
 *   3. Nearby magical resources — land-level amplifier
 *
 * Returns { score (0–100), band ('none'|'low'|'moderate'|'high'), label, primarySources }
 */
export const computeEffectiveMagicPresence = (institutions = [], config = {}) => {
  if (config.magicExists === false || (config.priorityMagic ?? 50) === 0) {
    return { score: 0, band: 'none', label: 'No Magic', primarySources: [] };
  }

  const slider = config.priorityMagic ?? 50;

  // ── 1. World slider contribution (0–55) ────────────────────────────────────
  const sliderContrib = slider * 0.55;

  // ── 2. Institution contribution (0–40) ────────────────────────────────────
  // Weighted by sophistication tier — what matters is depth, not headcount.
  const INST_WEIGHTS = {
    folk:         { weight:  5, keywords: ["hedge wizard","traveling hedge wizard","healer (divine","warden's lodge","druid circle","wayside shrine"] },
    practitioner: { weight: 10, keywords: ["alchemist shop","scroll scribe","apothecary","village scribe"] },
    institutional:{ weight: 18, keywords: ["wizard's tower","mages' guild","alchemist quarter","elder grove council"] },
    advanced:     { weight: 28, keywords: ["enchanter's shop","academy of magic","mages' district","teleportation circle","airship docking","great library"] },
    exotic:       { weight: 35, keywords: ["golem workforce","undead labor","dream parlors","planar traders","planar embassy","message network","dragon resident"] },
  };

  // Also treat entire Magic/Exotic category institutions with minimum practitioner weight
  const instNames = institutions.map(i => (i.name || '').toLowerCase());
  const instCategories = institutions.map(i => (i.category || '').toLowerCase());

  let rawInstScore = 0;
  const instSources = [];

  for (const [tier, { keywords, weight }] of Object.entries(INST_WEIGHTS)) {
    for (const kw of keywords) {
      if (instNames.some(n => n.includes(kw))) {
        rawInstScore += weight;
        instSources.push({ name: kw, tier, weight });
      }
    }
  }

  // Any Magic/Exotic category institution not already caught by keywords gets folk weight
  const hasMagicCat = instCategories.some(c => c === 'magic' || c === 'exotic');
  if (hasMagicCat && rawInstScore === 0) rawInstScore += 5;

  // Normalize institution score to 0–40 cap
  // Assumes a ~full mages-district city has raw score ~100
  const instContrib = Math.min(40, rawInstScore * 0.4);

  // ── 3. Resource bonus (0–22) ──────────────────────────────────────────────
  const resources = config.nearbyResources || [];
  let resourceBonus = 0;
  const resourceSources = [];

  if (resources.includes('magical_node'))   { resourceBonus += 15; resourceSources.push('ley line node'); }
  if (resources.includes('ancient_grove'))  { resourceBonus +=  5; resourceSources.push('ancient grove'); }
  if (resources.includes('ancient_ruins'))  { resourceBonus +=  3; resourceSources.push('ancient ruins'); }
  if (resources.includes('foraging_areas')) { resourceBonus +=  2; resourceSources.push('foraging areas'); }

  // ── 4. Combine with ceiling ───────────────────────────────────────────────
  // Local density can exceed world baseline by at most +30 (anomalous hub)
  // but cannot go above 100 or exceed slider+30
  const rawScore = sliderContrib + instContrib + resourceBonus;
  const ceiling  = Math.min(100, slider + 30);
  const score    = Math.round(Math.min(rawScore, ceiling));

  // ── 5. Band and label ────────────────────────────────────────────────────
  const band  = score === 0 ? 'none'
              : score < 25  ? 'low'
              : score < 55  ? 'moderate'
              :               'high';

  const label = band === 'none'     ? 'No Magic'
              : band === 'low'      ? 'Low Magic'
              : band === 'moderate' ? 'Moderate Magic'
              :                      'High Magic';

  const primarySources = [
    ...instSources.slice(0, 3).map(s => s.name),
    ...resourceSources,
  ];

  return { score, band, label, primarySources };
};

export const hasTeleportationInfra = (institutions = [], config = {}) => {
  // _magicTradeOnly flag is set by isolationGenerator after injection, or pre-derived
  // by generateSettlement before the structural validator runs — trust it explicitly.
  if (config?._magicTradeOnly === true) return true;
  // Check actual institution presence
  const hasInstitution = institutions.some(inst => {
    const n = (inst?.name || '').toLowerCase();
    return n.includes('teleportation') || n.includes('planar') || n.includes('extradimensional') || n.includes('airship');
  });
  return hasInstitution;
};

// ─── Trade / water dependency evaluation ────────────────────────────────────

/**
 * Determine whether a settlement's craft industries are buffered against
 * lacking local water or raw materials by trade access and economic strength.
 *
 * Previously in sharedConstants.js (now deleted).
 *
 * @param {Object} config       - Settlement config
 * @param {Array}  institutions - Settlement institution objects
 * @returns {{ buffered: boolean, strength: string, note: string }}
 */
export const evaluateWaterDependency = (config = {}, institutions = []) => {
  const tradeRoute = config?.tradeRouteAccess || 'road';
  const economy    = config?.priorityEconomy   ?? 50;
  const criminal   = config?.priorityCriminal  ?? 50;
  const magic      = config?.priorityMagic     ?? 50;

  // Economy is penalised by crime and boosted slightly by magic presence
  const crimeEffect      = Math.max(0.58, 1 - (Math.max(2, criminal * 0.55) - 30) / 310);
  const magicBonus       = 1 + (magic - 50) / 290;
  const effectiveEconomy = Math.min(100, economy * crimeEffect * magicBonus);

  if (tradeRoute === 'isolated') {
    return hasTeleportationInfra(institutions, config)
      ? { buffered: true,  strength: 'moderate',
          note: 'Magical trade infrastructure (teleportation) enables limited craft imports despite isolation.' }
      : { buffered: false, strength: 'none',
          note: 'No trade pipeline — isolated settlement cannot import raw materials.' };
  }

  if (effectiveEconomy < 40) {
    return { buffered: false, strength: 'none',
      note: `Economy too weak (≈${Math.round(effectiveEconomy)}/100) to sustain craft imports at scale.` };
  }
  if ((tradeRoute === 'port' || tradeRoute === 'crossroads') && effectiveEconomy >= 55) {
    const label = tradeRoute === 'port' ? 'Port' : 'Crossroads';
    return { buffered: true, strength: 'strong',
      note: `${label} trade at strong economy (≈${Math.round(effectiveEconomy)}/100) sustains craft via imported materials.` };
  }
  if ((tradeRoute === 'river' || tradeRoute === 'road') && effectiveEconomy >= 65) {
    return { buffered: true, strength: 'moderate',
      note: `${tradeRoute} trade at solid economy (≈${Math.round(effectiveEconomy)}/100) sustains craft via consistent imports.` };
  }
  return { buffered: false, strength: 'none',
    note: `Trade route (${tradeRoute}) and economy (≈${Math.round(effectiveEconomy)}/100) insufficient to sustain craft without local resources.` };
};

// ─── Core influence scoring ──────────────────────────────────────────────────

/**
 * Compute effective influence scores for the five power domains.
 *
 * Accounts for priority sliders, institution presence, active stress conditions,
 * monster threat level, and neighbor relationship type. These 0–100 scores are
 * consumed by nearly every downstream generator.
 *
 * @param {Object} config        - Settlement config (priorities, stress, threat, neighbor, …)
 * @param {Array}  institutions  - Settlement institution objects
 * @returns {{
 *   criminalEffective: number,
 *   militaryEffective: number,
 *   economyOutput:     number,
 *   religionInfluence: number,
 *   magicInfluence:    number,
 *   raw:  Object,   // raw priority values {economy, military, religion, magic, criminal}
 *   inst: Object,   // institution presence flags from getInstitutionNames
 * }}
 */
export const getInstFlags = (config = {}, institutions = []) => {
  const pri  = getPriorities(config);
  const inst = getInstitutionNames(institutions);

  // ── Monster threat multiplier (affects military score) ───────────────────
  const threat     = config.monsterThreat || 'frontier';
  const threatMult = threat === 'plagued' ? 1.35 : threat === 'heartland' ? 0.75 : 1.0;

  // ── Active stress types ──────────────────────────────────────────────────
  const stresses  = config.stressTypes?.length
    ? config.stressTypes
    : config.stressType ? [config.stressType] : [];
  const s = (type) => stresses.includes(type);  // shorthand: "is stress active?"

  // ── Stress → economy suppression multipliers ─────────────────────────────
  // Most crises reduce economic output; occupation nearly halts it.
  const economyStressMult =
    (s('under_siege')          ? 0.45 : 1) *
    (s('famine')               ? 0.60 : 1) *
    (s('occupied')             ? 0.70 : 1) *
    (s('plague_onset')         ? 0.75 : 1) *
    (s('indebted')             ? 0.85 : 1) *
    (s('politically_fractured')? 0.85 : 1) *
    (s('insurgency')           ? 0.88 : 1) *
    (s('mass_migration')       ? 0.90 : 1) *
    (s('wartime')              ? 0.88 : 1) *
    (s('religious_conversion') ? 0.92 : 1) *
    (s('slave_revolt')         ? 0.72 : 1);

  // ── Stress → crime amplification multipliers ─────────────────────────────
  // Most crises drive crime up; occupation suppresses visible crime (it's underground).
  const crimeStressMult =
    (s('famine')               ? 1.35 : 1) *
    (s('under_siege')          ? 1.25 : 1) *
    (s('plague_onset')         ? 1.20 : 1) *
    (s('occupied')             ? 0.60 : 1) *
    (s('recently_betrayed')    ? 1.15 : 1) *
    (s('indebted')             ? 1.20 : 1) *
    (s('insurgency')           ? 1.25 : 1) *
    (s('mass_migration')       ? 1.18 : 1) *
    (s('wartime')              ? 1.20 : 1) *
    (s('religious_conversion') ? 1.22 : 1) *
    (s('slave_revolt')         ? 1.30 : 1);

  // ── Stress → military capability multipliers ──────────────────────────────
  // Occupation transfers command; succession void creates confusion; wartime boosts readiness.
  const militaryStressMult =
    (s('occupied')             ? 0.40 : 1) *
    (s('under_siege')          ? 0.85 : 1) *
    (s('succession_void')      ? 0.75 : 1) *
    (s('recently_betrayed')    ? 0.80 : 1) *
    (s('insurgency')           ? 0.82 : 1) *
    (s('mass_migration')       ? 0.95 : 1) *
    (s('wartime')              ? 1.35 : 1) *
    (s('religious_conversion') ? 0.95 : 1) *
    (s('slave_revolt')         ? 1.25 : 1);

  // ── Stress → religion influence multipliers ───────────────────────────────
  // Plague and siege drive religious fervour; occupation and debt suppress it.
  const religionStressMult =
    (s('plague_onset')         ? 1.40 : 1) *
    (s('under_siege')          ? 1.20 : 1) *
    (s('succession_void')      ? 1.25 : 1) *
    (s('famine')               ? 1.10 : 1) *
    (s('occupied')             ? 0.65 : 1) *
    (s('indebted')             ? 0.90 : 1) *
    (s('wartime')              ? 1.15 : 1) *
    (s('religious_conversion') ? 1.35 : 1) *
    (s('slave_revolt')         ? 1.10 : 1);

  // ── Criminal effective score (0–100) ─────────────────────────────────────
  // High military suppresses crime; high economy/low religion can amplify it.
  // Minimum 2 — some crime always exists.
  const militarySuppressCrime = Math.max(0.12, 1 - (pri.military - 50) / 170);
  const economyModCrime       = 1 + (pri.economy - 50) / 240;
  const religionSuppressCrime = Math.max(0.72, 1 - (pri.religion - 50) / 290);
  const criminalInstMult      = inst.hasCriminalInst ? 1.0 : 0.55;

  const criminalEffective = Math.max(2, clamp(
    pri.criminal      *
    militarySuppressCrime *
    economyModCrime   *
    religionSuppressCrime *
    criminalInstMult  *
    crimeStressMult
  ));

  // ── Military effective score (0–100) ─────────────────────────────────────
  // Garrison quality scales with economic investment; high crime degrades effectiveness.
  const garrisonBase = inst.hasGarrison
    ? Math.max(0.55, 0.80 + pri.economy / 210)
    : Math.max(0.35, 0.55 + pri.economy / 250);

  const crimeDegradeMilitary = Math.min(1, Math.max(0.42, 1 - (criminalEffective - 50) / 170));
  const militaryInstMult     = inst.hasMilitaryInst ? 1.0 : 0.4;

  const neighborType = (config.neighborRelationship?.relationshipType || '').toLowerCase();
  const neighborMilMult =
    (neighborType.includes('hostile') || neighborType.includes('rival')) ? 1.20 :
     neighborType.includes('cold_war')      ? 1.18 :
     neighborType.includes('tense')         ? 1.10 :
     neighborType.includes('allied')        ? 0.92 :
     neighborType.includes('trade_partner') ? 0.96 : 1.0;

  const militaryEffective = clamp(
    pri.military         *
    garrisonBase         *
    crimeDegradeMilitary *
    militaryInstMult     *
    threatMult           *
    militaryStressMult   *
    neighborMilMult
  );

  // ── Economy output score (0–100) ─────────────────────────────────────────
  const crimeDegradeEconomy = Math.max(0.58, 1 - (criminalEffective - 30) / 310);
  const magicBoostEconomy   = 1 + (pri.magic - 50) / 290;
  const marketInstMult      = inst.hasMarket ? 1.0 : 0.75;

  const neighborEconMult =
    (neighborType.includes('hostile') || neighborType.includes('rival')) ? 0.88 :
     neighborType.includes('cold_war')      ? 0.93 :
     neighborType.includes('tense')         ? 0.97 :
     neighborType.includes('trade_partner') ? 1.08 :
     neighborType.includes('allied')        ? 1.05 : 1.0;

  const economyOutput = clamp(
    pri.economy         *
    crimeDegradeEconomy *
    magicBoostEconomy   *
    marketInstMult      *
    economyStressMult   *
    neighborEconMult
  );

  // ── Religion influence score (0–100) ─────────────────────────────────────
  const crimeDegradeReligion = Math.min(1, Math.max(0.68, 1 - (criminalEffective - 40) / 370));
  const economyModReligion   = Math.min(1, Math.max(0.82, 1 - (pri.economy - 65) / 340));
  const churchInstMult       = inst.hasChurch ? 1.0 : 0.5;

  const religionInfluence = clamp(
    pri.religion        *
    crimeDegradeReligion *
    economyModReligion  *
    churchInstMult      *
    religionStressMult
  );

  // ── Magic influence score (0–100) ────────────────────────────────────────
  // Now driven by computeEffectiveMagicPresence — single source of truth.
  // Economic prosperity and crime still modulate the institutional score.
  const _effectiveMagic   = computeEffectiveMagicPresence(institutions, config);
  const economyBaseMagic  = Math.max(0.52, 0.72 + pri.economy / 240);
  const crimeDegradeMagic = Math.max(0.38, 1 - Math.max(0, criminalEffective - 55) / 175);
  // Apply economic and crime modifiers to effective score (not raw slider)
  const magicInfluence = clamp(
    _effectiveMagic.score * economyBaseMagic * crimeDegradeMagic
  );

  return {
    criminalEffective,
    militaryEffective,
    economyOutput,
    religionInfluence,
    magicInfluence,
    raw:  pri,
    inst,
  };
};

// ─── Stress flag computation ─────────────────────────────────────────────────

/**
 * Derive boolean flags for named socio-political archetypes.
 *
 * Each flag represents a structural condition (e.g. "stateCrime" = garrison
 * operating as extraction apparatus) that unlocks specific narrative text across
 * all generators. The same config always produces the same flags.
 *
 * The "fires(n)" threshold uses a deterministic hash of the five priority values
 * mod 97 so variation occurs across different settlements, not within the same one.
 *
 * @param {Object} config       - Settlement config
 * @param {Array}  institutions - Settlement institution objects
 * @returns {Object} Boolean flags + anyActive summary
 */
export const getStressFlags = (config = {}, institutions = []) => {
  const pri   = getPriorities(config);
  const flags = getInstFlags(config, institutions);
  const inst  = flags.inst;

  // Deterministic pseudo-random threshold per settlement (0–96).
  const threshold = Math.abs(
    (pri.economy  *  7 +
     pri.military * 13 +
     pri.religion * 17 +
     pri.magic    * 19 +
     pri.criminal * 23) % 97
  );
  const fires = (n) => threshold < n;

  // ── stateCrime ───────────────────────────────────────────────────────────
  // Military dominates, economy suppressed, no commercial counterweight.
  // → The garrison functions as an extraction apparatus, not a protector.
  const stateCrimeCond = pri.military >= 70 && pri.economy <= 32 &&
                         pri.criminal <= 38 && pri.religion <= 48;
  const stateCrimeInst = inst.hasGarrison && !inst.hasBank && !inst.hasMerchantGuild;
  const stateCrime     = fires(stateCrimeCond && stateCrimeInst ? 62 : 0);

  const stateCrimeIntensity = stateCrime
    ? clamp((pri.military - 70) / 30 + (32 - pri.economy) / 32 + (38 - pri.criminal) / 38, 0, 1) / 3
    : 0;

  // ── merchantArmy ─────────────────────────────────────────────────────────
  // Trade-funded private security fills the gap left by low state military.
  const merchantArmyCond = pri.economy >= 68 && pri.military <= 38;
  const merchantArmyInst = (inst.hasMerchantGuild || inst.hasBank) &&
                           (inst.hasMercenary || inst.hasGangInfra);
  const merchantArmy     = merchantArmyCond && merchantArmyInst && fires(55);

  // ── crusaderSynthesis ────────────────────────────────────────────────────
  // High military + high religion + viable economy: garrison and church are allies.
  const crusaderCond     = pri.military >= 68 && pri.religion >= 68 && pri.economy >= 32;
  const crusaderInst     = inst.hasGarrison && inst.hasChurch;
  const crusaderSynthesis = crusaderCond && crusaderInst && fires(52);

  // ── heresySuppression ────────────────────────────────────────────────────
  // Religion-magic gap is wide enough that the church actively suppresses arcane practice.
  const heresyCond      = pri.religion >= 65 && pri.magic <= 38 &&
                          (pri.religion - pri.magic) >= 28;
  const heresyInst      = inst.hasChurch && (inst.hasMilitaryInst || inst.hasCourtSystem);
  const heresyIntensity = heresyCond && heresyInst
    ? clamp((pri.religion - pri.magic - 28) / 55, 0, 1)
    : 0;
  const heresySuppression = heresyCond && heresyInst && fires(heresyIntensity * 65);

  // ── crimeIsGovt ──────────────────────────────────────────────────────────
  // Criminal network fills the authority vacuum left by weak/absent state.
  const crimeGovtCond = flags.criminalEffective >= 62 && flags.militaryEffective <= 32;
  const crimeGovtInst = inst.hasCriminalInst && !inst.hasGarrison && !inst.hasWalls;
  const crimeIsGovt   = crimeGovtCond && crimeGovtInst && fires(55);

  // ── arcaneBlackMarket ────────────────────────────────────────────────────
  // Magic and crime are both well-resourced; their overlap produces a
  // sophisticated underground market for arcane goods and services.
  const arcaneCond       = flags.magicInfluence >= 52 && flags.criminalEffective >= 58;
  const arcaneInst       = inst.hasMagicInst && inst.hasCriminalInst;
  const arcaneBlackMarket = arcaneCond && arcaneInst && fires(52);

  // ── theocraticEconomy ────────────────────────────────────────────────────
  // Religion dominates economy — tithing, religious markets, church-owned land.
  const theoCond         = pri.religion >= 70 && pri.economy <= 42 &&
                           (pri.religion - pri.economy) >= 28;
  const theoInst         = (inst.hasCathedral || inst.hasMonastery) && inst.hasMarket;
  const theocraticEconomy = theoCond && theoInst && fires(55);

  // ── magicFillsVoid ───────────────────────────────────────────────────────
  // Arcane power fills the vacuum left by absent religion and weak economy.
  const magicVoidCond  = pri.magic >= 68 && pri.religion <= 38 && pri.economy <= 42;
  const magicVoidInst  = (inst.hasMagesGuild || inst.hasWizardTower) && !inst.hasChurch;
  const magicFillsVoid = magicVoidCond && magicVoidInst && fires(48);

  // ── religiousFraud ───────────────────────────────────────────────────────
  // Elevated religion + elevated crime with both institutions present:
  // the church's moral authority is being exploited for profit.
  const fraudCond     = pri.religion >= 60 && flags.criminalEffective >= 48;
  const fraudInst     = inst.hasChurch && inst.hasCriminalInst;
  const religiousFraud = fraudCond && fraudInst && fires(45);

  // ── secularBrutalism ─────────────────────────────────────────────────────
  // High military with no religious counterweight: rule by force, no moral framework.
  const secularCond      = pri.military >= 70 && pri.religion <= 28 && pri.economy >= 32;
  const secularInst      = inst.hasGarrison && !inst.hasChurch;
  const secularBrutalism = secularCond && secularInst && fires(50);

  // ── merchantCriminalBlur ─────────────────────────────────────────────────
  // Prosperous economy + strong criminal network: the boundary is academic.
  const blurCond             = pri.economy >= 65 && flags.criminalEffective >= 55;
  const blurInst             = inst.hasMerchantGuild && inst.hasCriminalInst;
  const merchantCriminalBlur = blurCond && blurInst && fires(55);

  // ── magicMilitarized ────────────────────────────────────────────────────
  // Military leads magic — arcane resources are directed toward warfare.
  const magMilCond       = pri.military >= 65 && pri.magic >= 55 && pri.military > pri.magic;
  const magMilInst       = inst.hasMilitaryInst && inst.hasMagicInst;
  const magicMilitarized = magMilCond && magMilInst && fires(50);

  // ── mageTheocracy ────────────────────────────────────────────────────────
  // Magic and religion are near-peers; arcane institutions and church are entwined.
  const mageTheoCond  = pri.magic >= 68 && pri.religion >= 65 &&
                        pri.magic >= (pri.religion - 10);
  const mageTheoInst  = inst.hasMagicInst && inst.hasChurch;
  const mageTheocracy = mageTheoCond && mageTheoInst && fires(45);

  return {
    stateCrime,
    stateCrimeIntensity,
    merchantArmy,
    crusaderSynthesis,
    heresySuppression,
    heresyIntensity,
    crimeIsGovt,
    arcaneBlackMarket,
    theocraticEconomy,
    magicFillsVoid,
    religiousFraud,
    secularBrutalism,
    merchantCriminalBlur,
    magicMilitarized,
    mageTheocracy,
    anyActive:
      stateCrime || merchantArmy || crusaderSynthesis || heresySuppression ||
      crimeIsGovt || arcaneBlackMarket || theocraticEconomy || magicFillsVoid ||
      religiousFraud || secularBrutalism || merchantCriminalBlur ||
      magicMilitarized || mageTheocracy,
  };
};

// ─── NPC secret tables ───────────────────────────────────────────────────────
// Kept here because this data is tightly coupled to stress types and shared
// between npcGenerator.js and defenseGenerator.js.
