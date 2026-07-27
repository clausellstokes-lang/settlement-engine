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

const MONSTER_THREAT_ANNOTATION_MARKERS = [
  'tense',
  'unstable',
  'fragile',
  'rigid',
  'vulnerable',
  'enforced',
  'desperate',
  'anxious',
  'volatile',
  'shaken',
  'suppressed',
  'fractured',
  'critical',
  'strained',
  'ordered',
];

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
) => {
  const isSmallSettlement = SMALL_SETTLEMENT_TIERS.has(tier);
  const guardLabel = deriveGuardLabel(institutionNames, isSmallSettlement);
  const councilLabel = deriveCouncilLabel(tier, governingBodyOverride);
  const merchantLabel = deriveMerchantLabel(institutionNames, isSmallSettlement);
  const healerLabel = deriveHealerLabel(institutionNames, isSmallSettlement);
  const watchLabel = deriveWatchLabel(institutionNames, isSmallSettlement);
  const hasArcaneInstitution = includesAnyInstitution(
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
  if (stressFlags.merchantArmy) return 'Fragile (private security, no public law)';

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
 * Active settlement stressors override the baseline in a fixed public-severity
 * order. `infiltrated` is intentionally an identity case: infiltration changes
 * the vignette but is not necessarily publicly visible enough to relabel order.
 */
const applyStressStability = (baselineStability, hasStress) => {
  if (hasStress('under_siege')) {
    return 'Critical (active siege — survival priority)';
  }
  if (hasStress('occupied')) {
    return 'Suppressed (under occupation — resistance simmers)';
  }
  if (hasStress('politically_fractured')) {
    return 'Fractured — no stable governing authority';
  }
  if (hasStress('recently_betrayed')) {
    return 'Shaken — institutional trust collapsed';
  }
  if (hasStress('famine')) {
    return 'Desperate — hunger is eroding order';
  }
  if (hasStress('plague_onset')) {
    return 'Anxious — disease is overriding normal authority';
  }
  if (hasStress('succession_void')) {
    return 'Volatile — power is available to whoever moves first';
  }
  if (hasStress('infiltrated')) return baselineStability;
  if (hasStress('indebted')) {
    return baselineStability.includes('Unstable')
      ? baselineStability
      : 'Strained — debt obligations constrain every decision';
  }
  if (
    hasStress('monster_pressure') &&
    !baselineStability.toLowerCase().includes('tense')
  ) {
    return 'Tense (monster pressure from surrounding region)';
  }
  return baselineStability;
};

/**
 * "Plagued" is the canonical high-monster-threat token. Threat annotates an
 * already expressive instability label, but supplies a standalone label when
 * the settlement would otherwise read as simply stable.
 */
const annotateMonsterThreat = (stability, monsterThreat) => {
  if (monsterThreat !== 'plagued') return stability;
  const normalizedStability = stability.toLowerCase();
  const alreadyExpressesPressure = MONSTER_THREAT_ANNOTATION_MARKERS.some(
    marker => normalizedStability.includes(marker),
  );
  return alreadyExpressesPressure
    ? `${stability}; monster threat active`
    : 'Tense — regional monster threat';
};

const deriveInstitutionSignals = (institutionNames) => ({
  hasMilitaryInstitution: includesAnyInstitution(
    institutionNames,
    ['garrison', 'barracks', 'militia', 'watch', 'guard', 'mercenary'],
  ),
  hasUrbanCommerceInstitution: includesAnyInstitution(
    institutionNames,
    ['guild', 'market district', 'merchant house', 'trading company'],
  ),
  hasArcaneInstitution: includesAnyInstitution(
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
  if (neighbourRelationship) return `Ongoing tensions with ${neighbourRelationship.neighborName}`;
  if (institutionFlags.criminalEffective > 65) {
    return hasMilitaryInstitution || hasCivicInstitution
      ? 'Crime rates are rising; several merchants have been found murdered, and the guard is being accused of inaction.'
      : 'Someone has been stealing from the communal stores. Everyone suspects someone. No one is saying anything.';
  }
  if (hasRoyalAuthority && hasNoblePower && priorities.military > 55) {
    if (priorities.economy < 40) {
      return 'The crown has called in military levies from the noble houses. Two houses have complied. One has not, and has not explained why.';
    }
    if (priorities.military > 70) {
      return 'A noble house has begun recruiting its own soldiers beyond its traditional levy obligation. The crown has noticed and has not yet decided what to say about it.';
    }
    return "The crown's relationship with the noble houses is transactional and increasingly strained. The last royal directive was delayed six weeks while passing through noble intermediaries.";
  }
  if (hasNoblePower && institutionFlags.economyOutput > 55) {
    return priorities.economy > 65
      ? 'The merchant class is outbuying noble landholdings. Three estates have changed hands in the last decade. The families that lost them have not forgotten.'
      : "A noble family is contesting a merchant's right to operate in their traditional market territory. The council is hearing the case and wishes it were not.";
  }
  if (institutionFlags.militaryEffective > 68) {
    if (hasMilitaryInstitution) {
      return 'The military commanders are pushing for expanded authority over civilian courts — and the council is losing ground.';
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
  return 'A dispute over grazing rights and water access has been running for two seasons. It has stopped being about grazing rights and water access.';
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
    return 'A noble house passed intelligence to a rival power. The crown knows. The house denies it. The crown cannot yet afford to act — it needs their levies.';
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

const buildInsurgencyNarrative = (
  institutionFlags,
  governingFactionName,
) => {
  const insurgencyOutmusclesAuthority =
    (institutionFlags.criminalEffective || 0) >
      (institutionFlags.militaryEffective || 0) &&
    (institutionFlags.economyOutput || 50) < 48;

  if (insurgencyOutmusclesAuthority) {
    return "The commons no longer accept the authority's account of events. Inflammatory pamphlets are being distributed. Two guild masters refused to attend the last civic assembly. The governing faction has intelligence about cells meeting at night — but hasn't moved, because moving publicly would confirm what it officially denies.";
  }
  return (
    'The challenge to the governing faction is institutional, not popular. ' +
    'Key officials are slow-walking orders. Revenue is being collected but held rather than forwarded. ' +
    `${governingFactionName} is conducting meetings with people who should not be meeting privately. ` +
    'The governing faction has noticed and is considering whether to act before the coalition is complete.'
  );
};

const buildWartimeNarrative = (institutionFlags, governingFactionName) => {
  const isWellSupplied =
    (institutionFlags.militaryEffective || 50) >= 55 &&
    (institutionFlags.economyOutput || 50) >= 45;

  if (isWellSupplied) {
    return (
      'The war is present here as money and absence. The garrison has doubled in size and is well-supplied — the crown is paying for this one. ' +
      'Contracts for grain, leather, and ironwork are flowing to anyone with the capacity to fill them. ' +
      'The men who left to fight have not returned, which is a grief that runs beneath the commerce. ' +
      `${governingFactionName} is navigating the difference between what it can extract for the war effort and what the settlement can actually spare.`
    );
  }
  return 'The war is present here as scarcity and fear. Conscription has taken workers, not soldiers — the farms and workshops feel their absence. Supply caravans pass through on crown requisition and local needs come second. Prices have risen and will rise further. A crown officer arrived last week and left with a list of what will be requisitioned next month. The governing faction signed the order. There was no alternative that anyone could see.';
};

const buildReligiousConversionNarrative = (governingFactionName) => {
  // The governing label has historically selected the stable prose variant.
  // Keep that deterministic selector until a seeded narrative selector owns it.
  const variant = governingFactionName ? governingFactionName.length % 3 : 0;
  if (variant === 0) {
    return 'The new faith does not yet have a building. It has kitchens, meeting rooms in private homes, and a preacher who travels a circuit. The old institution has the building, the records, the accumulated donations, and a congregation that is quietly redistributing itself. Neither party is ready to force a confrontation. Both are watching the numbers.';
  }
  if (variant === 1) {
    return (
      'The schism is now formal. Two priests, two congregations, two sets of records — births, deaths, marriages — that may or may not be recognised depending on which authority the other party acknowledges. ' +
      `${governingFactionName || 'The governing authority'} has not declared which succession is legitimate, ` +
      'which means every legal document dependent on religious sanction is in a grey zone.'
    );
  }
  return (
    `The conversion order came from ${governingFactionName || 'outside authority'} ` +
    'and was formally acknowledged within the week. The speed of the formal compliance was remarkable. ' +
    'The depth of the actual compliance is a different question. The old faith does not hold services openly. ' +
    'It is not clear it has stopped holding them.'
  );
};

const buildMigrationNarrative = (institutionFlags, governingFactionName) => {
  if ((institutionFlags.economyOutput || 50) >= 50) {
    return (
      'The settlement is receiving more people than its infrastructure was built for. ' +
      'New arrivals come faster than housing, food, and employment can absorb them. ' +
      'The old residents and the new ones are not yet the same community. ' +
      `${governingFactionName} is being asked to do something about it and cannot agree what that something is.`
    );
  }
  return 'Three families left this week. Two more last week. The departure is quiet and orderly — which makes it worse. The people leaving have thought it through. What remains is those who cannot leave, those who choose to stay, and institutions running on fewer people than they were designed for.';
};

const buildSlaveRevoltNarrative = (institutionNames) => {
  const revoltOrigin = includesInstitution(institutionNames, 'slave market')
    ? 'the slave market'
    : "the settlement's labour system";
  return (
    `The revolt began at ${revoltOrigin} and has not been contained. ` +
    'The security response has been slow, partly because no one in authority wanted to admit publicly how organised the resistance was. ' +
    "Buildings controlled by the revolt's leadership are marked. Movement in and out of certain districts is contested. " +
    "The governing faction's official position is that this is being handled. Its private position involves considerably more urgency."
  );
};

const buildStressNarratives = ({
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
      'The settlement is under active siege. Every resource decision is a military decision. The debate is no longer about policy — it is about survival.',
    famine:
      hasMilitaryInstitution || hasCivicInstitution || hasMarketInstitution
        ? 'Food shortages have sharpened every tension in the settlement. Those with stocks are not advertising the fact. Those without are watching those with.'
        : 'The last harvest failed badly. What remains is being rationed by whoever holds the stores. Neighbours who shared meals last winter are watching each other carefully.',
    occupied:
      `An occupying officer arrested a local elder for "seditious speech". ${governingFactionName}` +
      ' filed a formal protest. The protest was returned unread.',
    politically_fractured:
      hasCivicInstitution ||
      hasMilitaryInstitution ||
      hasUrbanCommerceInstitution
        ? 'Two of the three factions are no longer attending joint council meetings. Decisions are being made unilaterally and contradicted by rivals within days.'
        : 'The community is split. Two households are not speaking to each other or to anyone who sides with the other. Everything requiring collective decision has stopped.',
    indebted:
      hasRoyalAuthority && hasNoblePower
        ? "The crown's debt to the noble houses has become structural. Three major policy decisions this year were reversed after private meetings with creditor lords. No one publicly acknowledges the connection."
        : "The creditor's representative blocked the infrastructure repair budget. Publicly they cited fiscal responsibility. Privately they cited a clause in the debt agreement.",
    recently_betrayed: buildBetrayalNarrative({
      hasRoyalAuthority,
      hasNoblePower,
      hasCivicInstitution,
      governingFactionName,
    }),
    infiltrated: baselineConflict,
    plague_onset:
      'The quarantine has been imposed on the affected district. Compliance is partial. Two people who attempted to enforce it were assaulted.',
    succession_void: hasRoyalAuthority
      ? hasNoblePower
        ? 'Two noble houses are contesting the succession. Both have legal arguments. Both have soldiers. The settlement is watching which house the other noble families back, because that is what will decide it.'
        : 'The throne is vacant and the council of succession has deadlocked. Every faction that benefits from the current stalemate is quietly prolonging it.'
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
    ),
    religious_conversion:
      buildReligiousConversionNarrative(governingFactionName),
    mass_migration: buildMigrationNarrative(
      institutionFlags,
      governingFactionName,
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
  fallbackStressType,
}) => {
  const hasStress = stressType => stressTypes.includes(stressType);
  const monsterThreat = config?.monsterThreat || 'frontier';

  const baselineStability = deriveBaselineStability({
    stressFlags,
    institutionFlags,
    neighbourRelationship,
  });
  const stressStability = applyStressStability(
    baselineStability,
    hasStress,
  );
  const stability = annotateMonsterThreat(stressStability, monsterThreat);

  const institutionSignals = deriveInstitutionSignals(institutionNames);
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

  let recentConflict = deriveBaselineConflict({
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
    baselineConflict: recentConflict,
    institutionFlags,
    institutionNames,
    institutionSignals,
    governingFactionName,
    defenseGroupLabel,
    hasRoyalAuthority,
    hasNoblePower,
  });

  if (recentConflict) {
    recentConflict = rewriteFactionPhrasing(
      recentConflict,
      institutionNames,
      tier,
      governingFactionName,
    );
  }
  if (primaryStress && stressNarratives[primaryStress]) {
    recentConflict = rewriteFactionPhrasing(
      stressNarratives[primaryStress],
      institutionNames,
      tier,
      governingFactionName,
    );
  }

  return { stability, recentConflict };
};
