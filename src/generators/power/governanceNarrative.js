/**
 * power/governanceNarrative.js — the governance presentation layer.
 *
 * This module translates already-resolved settlement facts into two pieces of
 * player-facing prose: a stability label and a recent-conflict vignette. It
 * does not decide faction power or activate stressors; those are upstream
 * simulation concerns.
 *
 * Ordering is part of the contract here. A synthesis can supersede ordinary
 * metrics, a primary stressor can supersede the baseline vignette, and the
 * institution rewriter intentionally applies substitutions in sequence. Keep
 * those precedence rules explicit when adding new narrative cases.
 */

import { resolveGenerationWorldLaw } from '../generationContext.js'; import { migrationDirectionOfConfig } from '../../domain/migrationDirection.js'; import { resolveSibling } from '../../domain/facts/drawDeclared.js'; import { factsOf } from '../../domain/facts/factsOf.js'; import { BASELINE_CONFLICT_SIBLINGS } from '../../data/powerSiblings.js'; export { BASELINE_CONFLICT_SIBLINGS }; import { buildInsurgencyNarrative, buildMigrationNarrative, buildReligiousConversionNarrative, buildWartimeNarrative } from './governingStressVignettes.js'; import { migrationDirectionOf } from '../../domain/crisis/migrationDirection.js'; // F10, CENSUS-1c, CENSUS-5c (R-AB: the table moved to data/powerSiblings.js, re-exported): one line, so no cited line moves — LANDING-R2 (ODQ §934.105): the four governing-faction stress vignettes moved verbatim to power/governingStressVignettes.js, imported on this line, so no cited line moves — W3 POW (WAVE-RULINGS item 8): the label reads the entry's direction through F13's reader, imported on this line

const SMALL_SETTLEMENT_TIERS = new Set(['thorp', 'hamlet', 'village']);

const ADVERSARIAL_RELATIONSHIP_TYPES = new Set([
  'Hostile rival',
  'hostile_rival',
  // Canonical short tokens from canonicalRelationship.js.
  'hostile',
  'rival',
  'cold_war',
  // Legacy display spellings remain accepted for imported settlements.
  'Cold war',
  'tense',
]);

const PRIMARY_STRESS_PRECEDENCE = [
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
];

// Every STABILITY_BANDS word but `Stable` — the labels that already express
// pressure, so the plagued annotation rides them instead of replacing them. ⛔ ONE ALTERNATION,
// NOT AN ARRAY OF FIFTEEN `.includes` PROBES: the two forms match identically (an unanchored
// substring test either way, the sole reader is annotateMonsterThreat, and the constant is
// module-private), and the array cost the GENERATION WORKER bytes it does not have — its
// ceiling is 1,404,493 B and never rises. Measured, not assumed; see the receipts in
// docs/FIRST_CONTACT_BACKLOG.md under DOSSIER AND REALM POLISH, part 4.
const MONSTER_THREAT_ANNOTATION_MARKERS = /tense|unstable|fragile|rigid|vulnerable|enforced|desperate|anxious|volatile|shaken|suppressed|fractured|critical|strained|ordered/i;

const FORMAL_AUTHORITY_LABELS = new Set([
  'Elected Reeve',
  'Feudal Appointee',
  'Feudal Stewardship',
  'Noble Governorship',
  'Royal Authority',
  'Household Council',
]);

const includesInstitution = (institutionNames, keyword) =>
  institutionNames.some(name => name.includes(keyword));

const includesAnyInstitution = (institutionNames, keywords) =>
  keywords.some(keyword => includesInstitution(institutionNames, keyword));

const preserveSentenceCase = (matched, replacement) => (
  /^[A-Z]/.test(matched) && replacement
    ? replacement[0].toUpperCase() + replacement.slice(1)
    : replacement
);

const deriveGuardLabel = (institutionNames, isSmallSettlement) => {
  if (includesInstitution(institutionNames, 'garrison')) return 'the garrison';
  if (includesInstitution(institutionNames, 'barracks')) return 'the barracks guard';
  if (includesInstitution(institutionNames, 'professional guard')) return 'the professional guard';
  if (
    includesInstitution(institutionNames, 'city watch') ||
    includesInstitution(institutionNames, 'town watch')
  ) {
    return 'the watch';
  }
  if (includesInstitution(institutionNames, 'militia')) return 'the militia';
  if (includesInstitution(institutionNames, 'mercenary')) return 'the mercenary company';
  return isSmallSettlement ? 'the able-bodied' : 'the guard';
};

const deriveCouncilLabel = (tier, governingBodyOverride) => {
  if (governingBodyOverride) return governingBodyOverride;
  if (SMALL_SETTLEMENT_TIERS.has(tier)) {
    return tier === 'thorp' ? 'the household heads' : 'the village elders';
  }
  if (tier === 'town') return 'the town council';
  if (tier === 'city') return 'the city council';
  if (tier === 'metropolis') return 'the grand council';
  return 'the council';
};

const deriveMerchantLabel = (institutionNames, isSmallSettlement) => {
  if (includesAnyInstitution(institutionNames, ['merchant', 'guild', 'market'])) {
    return 'the merchants';
  }
  return isSmallSettlement ? 'the wealthiest household' : 'the traders';
};

const deriveHealerLabel = (institutionNames, isSmallSettlement) => {
  if (includesInstitution(institutionNames, 'hospital')) return 'the hospital staff';
  if (
    includesInstitution(institutionNames, 'monastery') ||
    includesInstitution(institutionNames, 'friary')
  ) {
    return 'the monastery brothers';
  }
  if (includesInstitution(institutionNames, 'healer')) return 'the healers';
  if (includesAnyInstitution(institutionNames, ['church', 'cathedral', 'parish'])) {
    return 'the clergy';
  }
  return isSmallSettlement ? 'the local herbalist' : 'the healers';
};

const deriveWatchLabel = (institutionNames, isSmallSettlement) => {
  if (
    includesInstitution(institutionNames, 'city watch') ||
    includesInstitution(institutionNames, 'town watch')
  ) {
    return 'the watch';
  }
  if (
    includesInstitution(institutionNames, 'garrison') ||
    includesInstitution(institutionNames, 'guard')
  ) {
    return 'the guard';
  }
  if (includesInstitution(institutionNames, 'militia')) return 'the militia';
  return isSmallSettlement ? 'the neighbours' : 'the guard';
};

/**
 * Rewrites generic narrative nouns to match the settlement's actual
 * institutions and scale.
 *
 * The replacement order is load-bearing. For example, "the garrison
 * commander" must be handled before "the garrison", and later replacements
 * are allowed to see text introduced by earlier ones.
 */
const rewriteFactionPhrasing = (
  text,
  institutionNames,
  tier,
  governingBodyOverride,
  magicWorks,
) => {
  const isSmallSettlement = SMALL_SETTLEMENT_TIERS.has(tier);
  const guardLabel = deriveGuardLabel(institutionNames, isSmallSettlement);
  const councilLabel = deriveCouncilLabel(tier, governingBodyOverride);
  const merchantLabel = deriveMerchantLabel(institutionNames, isSmallSettlement);
  const healerLabel = deriveHealerLabel(institutionNames, isSmallSettlement);
  const watchLabel = deriveWatchLabel(institutionNames, isSmallSettlement);
  const hasArcaneInstitution = magicWorks && includesAnyInstitution(
    institutionNames,
    ['wizard', 'mage', 'alchemist'],
  );

  return text
    .replace(
      /\bthe garrison commander\b/gi,
      match => preserveSentenceCase(match, `${guardLabel}'s commander`),
    )
    .replace(
      /\bthe garrison\b/gi,
      match => preserveSentenceCase(match, guardLabel),
    )
    .replace(
      /\bthe public watch\b/gi,
      match => preserveSentenceCase(match, watchLabel),
    )
    .replace(
      /\bthe watch\b/gi,
      match => preserveSentenceCase(match, watchLabel),
    )
    .replace(
      /\bthe council\b/gi,
      match => preserveSentenceCase(match, councilLabel),
    )
    .replace(
      /\ba council\b/gi,
      match => preserveSentenceCase(match, councilLabel),
    )
    .replace(
      /\bcouncil meetings\b/gi,
      match => preserveSentenceCase(
        match,
        `${councilLabel.replace(/^the /, '')} meetings`,
      ),
    )
    .replace(/\binside the council\b/gi, `inside ${councilLabel}`)
    .replace(
      /\bthe grain merchants\b/gi,
      match => preserveSentenceCase(match, merchantLabel),
    )
    .replace(
      /\bgrain merchants\b/gi,
      match => preserveSentenceCase(match, merchantLabel),
    )
    .replace(
      /\btwo healers\b/gi,
      match => preserveSentenceCase(
        match,
        `two ${healerLabel.replace(/^the /, '')}`,
      ),
    )
    .replace(
      /\bthe healers\b/gi,
      match => preserveSentenceCase(match, healerLabel),
    )
    .replace(
      /\bthe mages' quarter\b/gi,
      match => preserveSentenceCase(
        match,
        hasArcaneInstitution
          ? "the mages' quarter"
          : 'the arcane practitioners',
      ),
    );
};

/**
 * Synthesis flags are authored conclusions and therefore outrank numerical
 * indicators. Only when no synthesis applies do the ordinary institutional
 * metrics determine the baseline public-order label.
 */
const deriveBaselineStability = ({
  stressFlags,
  institutionFlags,
  neighbourRelationship,
}) => {
  if (stressFlags.stateCrime) return 'Enforced Order (authoritarian)';
  if (stressFlags.crimeIsGovt) return 'Unstable — criminal governance';
  if (stressFlags.crusaderSynthesis) return 'Rigid (militant theocracy)';
  if (stressFlags.merchantArmy) return institutionFlags.inst?.hasCourtSystem ? 'Fragile (private security above the public law)' : 'Fragile (private security, no public law)'; // COHERENCE-PRESUME (the chair's ruling of 2026-11-12): never deny the law a hall or court keeps

  if (
    institutionFlags.criminalEffective > 75 &&
    institutionFlags.militaryEffective < institutionFlags.criminalEffective - 8
  ) {
    return 'Unstable (pervasive organized crime)';
  }
  if (
    institutionFlags.militaryEffective > 70 &&
    institutionFlags.economyOutput < 32
  ) {
    return 'Tense (militarised, chronically underfunded)';
  }
  if (stressFlags.theocraticEconomy) return 'Stable (theocratic governance)';
  if (ADVERSARIAL_RELATIONSHIP_TYPES.has(neighbourRelationship?.relationshipType)) {
    return 'Tense (external threat)';
  }
  if (
    institutionFlags.economyOutput > 68 &&
    institutionFlags.militaryEffective < 30
  ) {
    return 'Vulnerable (prosperous but underdefended)';
  }
  if (institutionFlags.militaryEffective > 68) {
    return 'Ordered (strong military presence)';
  }
  return 'Stable';
};

/**
 * Active settlement stressors override the baseline in a fixed public-severity order, the six
 * arms at the tail included. NO STRESSOR FALLS THROUGH TO THE BARE BASELINE: all fifteen draw
 * an ACTIVE CRISIS card, so a fall-through read `Stable` beside a crisis.
 */
const applyStressStability = (baselineStability, hasStress, migrationDirection = 'arrivals') => {
  if (hasStress('under_siege')) {
    return 'Critical (under siege)';
  }
  if (hasStress('occupied')) {
    return 'Suppressed (under occupation: resistance simmers)';
  }
  if (hasStress('politically_fractured')) {
    return 'Fractured — no stable governing authority';
  }
  if (hasStress('recently_betrayed')) {
    return 'Shaken — nobody trusts those in charge';
  }
  if (hasStress('famine')) {
    return 'Desperate — hunger is eroding order';
  }
  if (hasStress('plague_onset')) {
    return 'Anxious — people fear the sickness more than they heed orders';
  }
  if (hasStress('succession_void')) {
    return 'Volatile — power is available to whoever moves first';
  }
  if (hasStress('indebted')) {
    return baselineStability.includes('Unstable')
      ? baselineStability
      : 'Strained — the creditors have a say in every decision';
  }
  if (
    hasStress('monster_pressure') &&
    !baselineStability.toLowerCase().includes('tense')
  ) {
    return 'Tense (monster pressure from surrounding region)';
  }
  // ⛔ THE SIX NO-FALL-THROUGH ARMS (owner order 2026-09-17, "fix the remaining contradictions"; the argument, the measurement and the JUDGMENT on these words are in docs/FIRST_CONTACT_BACKLOG.md under DOSSIER AND REALM POLISH, part 3 (C) and part 4). Before them a town under one of these six read the baseline `Stable` beside its own ACTIVE CRISIS banner. Band words are the producer's own vocabulary; the order is PRIMARY_STRESS_PRECEDENCE's, so `infiltrated` is LAST and every public crisis beside it still names itself.
  if (hasStress('insurgency')) return 'Unstable (insurgency contests authority)';
  if (hasStress('mass_migration')) return migrationDirection === 'departures' ? 'Strained (people leaving)' : 'Strained (people arriving)';
  if (hasStress('wartime')) return 'Tense (requisition and conscription)';
  if (hasStress('religious_conversion')) return 'Tense (the creed is contested)';
  if (hasStress('slave_revolt')) return 'Unstable (revolt not contained)';
  if (hasStress('infiltrated')) return baselineStability.startsWith('Stable') ? 'Vulnerable (decisions shaped from outside)' : baselineStability;
  return baselineStability;
};

/**
 * "Plagued" is the canonical high-monster-threat token. Threat annotates an
 * already expressive instability label, but supplies a standalone label when
 * the settlement would otherwise read as simply stable.
 */
const annotateMonsterThreat = (stability, monsterThreat) => {
  if (monsterThreat !== 'plagued') return stability;
  const alreadyExpressesPressure = MONSTER_THREAT_ANNOTATION_MARKERS.test(stability);
  return alreadyExpressesPressure
    ? `${stability}; monsters on the roads`
    : 'Tense — regional monster threat';
};

// ⛔ THE ARCANE SIGNAL ASKS THE WORLD LAW FIRST (GS-4, ODQ §934.101): a mundane 'Alchemist shop' (licence `none`)
// raised the hedge-wizard line in 11 of 250 no-magic towns, each convicted by the coherence receipt and shipped.
const deriveInstitutionSignals = (institutionNames, magicWorks) => ({
  hasMilitaryInstitution: includesAnyInstitution(
    institutionNames,
    ['garrison', 'barracks', 'militia', 'watch', 'guard', 'mercenary'],
  ),
  hasUrbanCommerceInstitution: includesAnyInstitution(
    institutionNames,
    ['guild', 'market district', 'merchant house', 'trading company'],
  ),
  hasArcaneInstitution: magicWorks && includesAnyInstitution(
    institutionNames,
    ['mage', 'wizard', 'arcane', 'alchemist'],
  ),
  hasCivicInstitution: includesAnyInstitution(
    institutionNames,
    ['council', 'court', 'magistrate', 'hall', 'charter', 'guild hall'],
  ),
  hasMarketInstitution: includesAnyInstitution(
    institutionNames,
    ['market', 'merchant', 'guild', 'trading'],
  ),
  hasReligiousInstitution: includesAnyInstitution(
    institutionNames,
    ['church', 'cathedral', 'monastery', 'temple', 'parish', 'shrine'],
  ),
});

/**
 * Selects the ordinary recent dispute before an active primary stressor gets
 * its final opportunity to replace it. Like stability, this is an authored
 * precedence ladder rather than a score: the first matching condition wins.
 */
const deriveBaselineConflict = ({
  stressFlags,
  institutionFlags,
  institutionSignals,
  neighbourRelationship,
  priorities,
  monsterThreat,
  hasRoyalAuthority,
  hasNoblePower,
}) => {
  const {
    hasMilitaryInstitution,
    hasUrbanCommerceInstitution,
    hasArcaneInstitution,
    hasCivicInstitution,
    hasMarketInstitution,
    hasReligiousInstitution,
  } = institutionSignals;

  if (stressFlags.stateCrime) {
    return hasMilitaryInstitution
      ? 'Several households disappeared following a tax audit. The garrison commander has not been available for comment.'
      : 'Several households stopped paying what they owe. The person collecting those payments has not been seen since.';
  }
  if (stressFlags.crimeIsGovt) {
    return hasUrbanCommerceInstitution || hasCivicInstitution
      ? 'The guild and the district council both claim authority over the new market. Violence has settled some of the disputes; more is expected.'
      : 'Two of the stronger families have been resolving disputes between themselves rather than involving the elders. The rest of the community is watching nervously.';
  }
  if (stressFlags.crusaderSynthesis) {
    return hasMilitaryInstitution
      ? 'The commander-prelate has declared a heresy investigation into a rival settlement. The garrison is mobilizing.'
      : 'The local priest has declared a neighbouring settlement heretical. Relations between the two communities have broken down entirely.';
  }
  if (stressFlags.merchantArmy) {
    return hasUrbanCommerceInstitution && hasMilitaryInstitution
      ? "A guild's private soldiers arrested a rival's factor. The public watch is refusing to intervene in what they call a 'merchant matter'."
      : "One household's hired hands roughed up a rival's farmhand over a grazing dispute. Neither side will involve the elders.";
  }
  if (stressFlags.heresySuppression) {
    if (hasArcaneInstitution) {
      return "A hedge wizard was dragged before the ecclesiastical court. The mages' quarter is very quiet at the moment.";
    }
    if (hasReligiousInstitution && hasCivicInstitution) {
      return 'The priest has summoned someone before the church court. The village is divided on whether they deserved it.';
    }
    return "The priest has been asking questions about a local family's practices. The family has become very quiet.";
  }
  if (stressFlags.merchantCriminalBlur) {
    return hasUrbanCommerceInstitution
      ? "Two guild masters are having each other's warehouses robbed. Both deny it publicly. Both are losing patience."
      : "Two households have been undercutting each other on market day for months. Last week someone's cart was damaged. No one saw anything.";
  }
  if (neighbourRelationship) return `Relations with ${neighbourRelationship.neighborName} have soured, and everyone here knows it.`;
  if (institutionFlags.criminalEffective > 65) {
    return hasMilitaryInstitution || hasCivicInstitution
      ? 'Several merchants have been found murdered this season, and people say the guard is doing nothing about it.'
      : 'Someone has been stealing from the communal stores. Everyone suspects someone. No one is saying anything.';
  }
  if (hasRoyalAuthority && hasNoblePower && priorities.military > 55) {
    if (priorities.economy < 40) {
      return 'The crown has called in military levies from the noble houses. Two houses have complied. One has not, and has not explained why.';
    }
    if (priorities.military > 70) {
      return 'A noble house has begun recruiting its own soldiers beyond its traditional levy obligation. The crown has noticed and has not yet decided what to say about it.';
    }
    return "The crown's last order took six weeks to get through the noble houses that were meant to pass it on. The crown and the nobles bargain over everything now, and each bargain comes harder.";
  }
  if (hasNoblePower && institutionFlags.economyOutput > 55) {
    return priorities.economy > 65
      ? 'The merchant class is outbuying noble landholdings. Three estates have changed hands in the last decade. The families that lost them have not forgotten.'
      : "A noble family is contesting a merchant's right to operate in their traditional market territory. The council is hearing the case and wishes it were not.";
  }
  if (institutionFlags.militaryEffective > 68) {
    if (hasMilitaryInstitution) {
      return 'The military commanders are pushing for expanded authority over civilian courts, and the council is losing ground.';
    }
    if (hasCivicInstitution) {
      return 'The village militia captain is pushing for authority over disputes that the reeve used to handle.';
    }
    return "The strongest armed household has started making decisions on everyone's behalf without asking.";
  }
  if (institutionFlags.religionInfluence > 68) {
    if (hasCivicInstitution) {
      return 'The church is demanding veto power over council appointments. The council has not yet refused publicly.';
    }
    if (hasReligiousInstitution) {
      return 'The church wants approval rights over market day activities. The village reeve disagrees.';
    }
    return 'The priest has been insisting on a say in who can marry whom and what gets planted when. Several families are unhappy.';
  }
  if (institutionFlags.economyOutput > 68) {
    if (hasUrbanCommerceInstitution) {
      return 'Two rival guilds are contesting control of the main trade route. Neither side will back down and the council is avoiding the question.';
    }
    if (hasMarketInstitution) {
      return 'The miller and the largest farming household are in dispute over prices and access.';
    }
    return 'The household that sells the most at market has been throwing its weight around in community decisions.';
  }
  if (monsterThreat === 'plagued') {
    if (hasMilitaryInstitution) {
      return 'A monster incursion last season destroyed outlying farms. The garrison is stretched thin and the council cannot agree on whether to raise a levy or hire mercenaries.';
    }
    if (hasCivicInstitution) {
      return 'Monster attacks on the outlying farms have not stopped. The village is debating whether to build proper defences or petition the nearest lord for help.';
    }
    return 'Farms nearby have been abandoned after attacks. The community cannot agree on whether to shelter in place, build defences, or leave.';
  }
  if (hasCivicInstitution || hasUrbanCommerceInstitution) {
    return 'The council has been debating market levies for three months. The merchants have stopped attending the sessions. Both sides are now acting as if the other has already lost.';
  }
  if (hasMarketInstitution) {
    return 'A dispute over field rotation and grazing rights has divided the village for most of this season.';
  }
  return 'A dispute over grazing rights and water access has run for two seasons, and the families on each side no longer speak to one another.';
};

const selectPrimaryStress = (stressTypes, fallbackStressType) => {
  if (!stressTypes.length) return fallbackStressType;
  return (
    PRIMARY_STRESS_PRECEDENCE.find(stressType =>
      stressTypes.includes(stressType)
    ) || stressTypes[0]
  );
};

const deriveDefenseGroupLabel = (institutionNames, tier) => {
  if (includesInstitution(institutionNames, 'garrison')) return 'The garrison';
  if (includesInstitution(institutionNames, 'militia')) return 'The militia';
  if (includesInstitution(institutionNames, 'watch')) return 'The watch';
  if (includesInstitution(institutionNames, 'mercenary')) {
    return 'The mercenary company';
  }
  return SMALL_SETTLEMENT_TIERS.has(tier) ? 'The community' : 'The guard';
};

const buildBetrayalNarrative = ({
  hasRoyalAuthority,
  hasNoblePower,
  hasCivicInstitution,
  governingFactionName,
}) => {
  if (hasRoyalAuthority && hasNoblePower) {
    return 'A noble house passed intelligence to a rival power. The crown knows. The house denies it. The crown cannot yet afford to act. It needs their levies.';
  }
  if (!hasCivicInstitution) {
    return 'Someone talked. Information that should have stayed inside the settlement reached an outside party. No one has admitted it. Everyone suspects someone.';
  }

  // The null rendering is legacy output, not an attractive fallback. Preserve
  // it until the upstream governing-faction contract can guarantee a name.
  const isFormalAuthority = FORMAL_AUTHORITY_LABELS.has(governingFactionName);
  const location = isFormalAuthority ? 'within the office of the ' : 'inside ';
  const authority = isFormalAuthority
    ? governingFactionName.toLowerCase()
    : governingFactionName;
  return (
    'The investigation into the betrayal has been obstructed twice. ' +
    `The obstruction came from ${location}${authority}. No one will say who.`
  );
};

const buildSlaveRevoltNarrative = (institutionNames) => {
  const revoltOrigin = includesInstitution(institutionNames, 'slave market')
    ? 'at the slave market'
    : 'among the bonded labourers';
  return (
    `The revolt began ${revoltOrigin} and has not been put down. ` +
    'Those in charge were slow to act, because nobody wanted to admit how organised the rebels were. ' +
    "The rebels' buildings are marked, and some streets are contested. " +
    'In public, those in charge say it is being handled; in private, they are scrambling.'
  );
};

const buildStressNarratives = ({
  migrationEntry = null,
  baselineConflict,
  institutionFlags,
  institutionNames,
  institutionSignals,
  governingFactionName,
  defenseGroupLabel,
  hasRoyalAuthority,
  hasNoblePower,
}) => {
  const {
    hasMilitaryInstitution,
    hasUrbanCommerceInstitution,
    hasCivicInstitution,
    hasMarketInstitution,
  } = institutionSignals;

  return {
    under_siege:
      'The settlement is under siege. Its stores and every able pair of hands now go to the defence, and nothing else is discussed.',
    famine:
      hasMilitaryInstitution || hasCivicInstitution || hasMarketInstitution
        ? 'Food is short, and every quarrel in the settlement has grown sharper for it. Those with stocks are not advertising the fact. Those without are watching those with.'
        : 'The last harvest failed badly. What remains is being rationed by whoever holds the stores. Neighbours who shared meals last winter are watching each other carefully.',
    occupied:
      `An occupying officer arrested a local elder for "seditious speech". ${governingFactionName}` +
      ' filed a formal protest. The protest was returned unread.',
    // OWNER-WORDS-DOSSIER item 3b (2026-11-09): the word "faction" is retired from the page; "power".
    politically_fractured:
      hasCivicInstitution ||
      hasMilitaryInstitution ||
      hasUrbanCommerceInstitution
        ? 'Two powers have stopped coming to council meetings. Each makes its own decisions now, and the others overturn them within days.'
        : 'The community is split. Two households are not speaking to each other or to anyone who sides with the other. Everything requiring collective decision has stopped.',
    indebted:
      hasRoyalAuthority && hasNoblePower
        ? "The crown owes the noble houses more than it can repay. Three of its decisions this year were reversed after private meetings with the lords it owes, and nobody admits the connection."
        : "The creditor's agent has blocked the money for repairs. In public they talk of prudence; in private they point to a clause in the loan.",
    recently_betrayed: buildBetrayalNarrative({
      hasRoyalAuthority,
      hasNoblePower,
      hasCivicInstitution,
      governingFactionName,
    }),
    infiltrated: baselineConflict,
    plague_onset:
      'The sick have been shut away under quarantine. Many ignore it, and two people who tried to enforce it were beaten.',
    succession_void: hasRoyalAuthority
      ? hasNoblePower
        ? 'Two noble houses are contesting the succession. Both have legal arguments. Both have soldiers. The settlement is watching which house the other noble families back, because that is what will decide it.'
        : 'The throne is vacant and the council of succession has deadlocked. Every power that benefits from the current stalemate is quietly prolonging it.'
      : hasCivicInstitution
        ? 'Two candidates for the vacant position each held separate public assemblies on the same day. Both claimed the other was illegal.'
        : 'The elder who kept the peace is gone. No one has stepped forward to take that role. Small disputes that would have been settled quickly are now sitting open.',
    monster_pressure: hasMilitaryInstitution
      ? 'A farmstead three miles out was destroyed last night. The farmer and his family are unaccounted for. ' +
        `${defenseGroupLabel} is not going out to look.`
      : 'A farmstead a short walk from here was destroyed last night. The family is gone. No one is going to look for them.',
    insurgency: buildInsurgencyNarrative(
      institutionFlags,
      governingFactionName,
    ),
    wartime: buildWartimeNarrative(
      institutionFlags,
      governingFactionName,
      institutionNames, // COHERENCE-POWERS-7: the roster's names, for the independent polity's crown
    ),
    religious_conversion:
      buildReligiousConversionNarrative(governingFactionName),
    mass_migration: buildMigrationNarrative(
      institutionFlags,
      governingFactionName,
      migrationEntry,
    ),
    slave_revolt: buildSlaveRevoltNarrative(institutionNames),
  };
};

/**
 * Derives the public stability label and current governance vignette.
 *
 * Both governing-faction inputs are intentional. `governingFaction` is the
 * resolved configuration label used by authority rules, while the governing
 * entry inside `factions` is the normalized display label interpolated into
 * prose. They ordinarily agree, but they have distinct upstream provenance.
 */
export const buildGovernanceLabels = ({
  factions,
  config,
  stressFlags,
  instFlags: institutionFlags,
  neighbourRelationship,
  instNames: institutionNames,
  priorities,
  tier,
  governingFaction: configuredGoverningFaction,
  hasNobleInstitution,
  stressTypes,
  stressEntries = [],
  fallbackStressType,
  worldLaw = null, // absent, it resolves from config exactly as generatePowerStructure builds its own
}) => {
  const magicWorks = resolveGenerationWorldLaw(worldLaw, config).magicFunctions();
  const hasStress = stressType => stressTypes.includes(stressType);
  const monsterThreat = config?.monsterThreat || 'frontier';
  const migrationEntry = (stressEntries || []).find((e) => e?.type === 'mass_migration') ?? { type: 'mass_migration', direction: migrationDirectionOfConfig(config) || 'arrivals' }; const migrationDirection = migrationDirectionOf(migrationEntry) === 'exodus' ? 'departures' : 'arrivals'; // WAVE-RULINGS item 8 (W3 POW): the stability label reads stress[].direction — the entry's own, else its config projection — the one field the vignette reads; both sets, arrivals and departures

  const baselineStability = deriveBaselineStability({
    stressFlags,
    institutionFlags,
    neighbourRelationship,
  });
  const stressStability = applyStressStability(
    baselineStability,
    hasStress, migrationDirection,
  );
  const stability = annotateMonsterThreat(stressStability, monsterThreat);

  const institutionSignals = deriveInstitutionSignals(institutionNames, magicWorks);
  const hasRoyalAuthority =
    configuredGoverningFaction &&
    configuredGoverningFaction.includes('Royal Authority');
  const hasNoblePower =
    hasNobleInstitution ||
    factions.some(faction =>
      [
        'Noble Families',
        'Noble Houses',
        'Landed Gentry',
        'Manor Household',
      ].includes(faction.faction)
    );
  const governingFactionName =
    factions.find(faction => faction.isGoverning)?.faction || null;

  const baselineConflict = deriveBaselineConflict({
    stressFlags,
    institutionFlags,
    institutionSignals,
    neighbourRelationship,
    priorities,
    monsterThreat: config?.monsterThreat,
    hasRoyalAuthority,
    hasNoblePower,
  });

  const primaryStress = selectPrimaryStress(
    stressTypes,
    fallbackStressType,
  );
  const defenseGroupLabel = deriveDefenseGroupLabel(
    institutionNames,
    tier,
  );
  const stressNarratives = buildStressNarratives({
    // MERGE-R2 (the chair's ruling 1): the vignette reads W0's one field — the entry's own, else its
    // config projection (stressConfirmPass) — through F13's reader; no second derivation.
    migrationEntry,
    baselineConflict: null, // set below, once resolved where it prints
    institutionFlags,
    institutionNames,
    institutionSignals,
    governingFactionName,
    defenseGroupLabel,
    hasRoyalAuthority,
    hasNoblePower,
  });

  // F10, CENSUS-1c: a soldiers line its declared sibling where no garrison or hired company stands
  // (BASELINE_CONFLICT_SIBLINGS, data/powerSiblings.js). R-D1 unit 2 (R-AU at the site): the set is
  // resolved ONLY where the baseline prints — no primary-stress narrative, or the `infiltrated` one
  // that carries it. A narrative that overrides it draws nothing from the set and writes no note
  // (rung 2E soak1k-5589: three notes of a line the siege narrative overwrote). No roll either way.
  const baselineOverridden = Boolean(
    primaryStress && primaryStress !== 'infiltrated' && stressNarratives[primaryStress],
  );
  let recentConflict = baselineOverridden
    ? baselineConflict
    : resolveSibling(baselineConflict, BASELINE_CONFLICT_SIBLINGS, { facts: () => factsOf({ institutions: (institutionNames || []).map((name) => ({ name })) }), poolId: 'governanceNarrative:BASELINE_CONFLICT_SIBLINGS', surface: 'power', drawKind: 'T' });
  stressNarratives.infiltrated = recentConflict;

  if (recentConflict) {
    recentConflict = rewriteFactionPhrasing(
      recentConflict,
      institutionNames,
      tier,
      governingFactionName,
      magicWorks,
    );
  }
  if (primaryStress && stressNarratives[primaryStress]) {
    recentConflict = rewriteFactionPhrasing(
      stressNarratives[primaryStress],
      institutionNames,
      tier,
      governingFactionName,
      magicWorks,
    );
  }

  return { stability, recentConflict };
};
