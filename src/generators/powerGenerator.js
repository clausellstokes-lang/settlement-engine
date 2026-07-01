/**
 * powerGenerator.js
 * Power structure, factions, and conflict generation
 */

import { random as _rng } from './rngContext.js';
import { priorityToCategory } from './economicGenerator.js';
import {
  getInstFlags,
  getPriorities,
  getStressFlags,
  pick,
  pickRandom2,
  priorityToMultiplier,
  randInt,
  random01,
} from './helpers.js';
import { FACTION_DESCRIPTORS } from '../data/powerData.js';
import {
  computePublicLegitimacy,
  computeFactionRelationships,
  computeCriminalCaptureState,
  applyLegitimacyMultipliers,
} from './factionDynamics.js';
import { STRESS_ECONOMIC_EFFECTS } from '../data/npcData.js';

// RELATIONSHIP_TYPES
const _RELATIONSHIP_TYPES = {
  ally: {
    name: 'Ally',
    description: 'Mutual support and cooperation',
    strength: ['weak', 'moderate', 'strong'],
  },
  rival: {
    name: 'Rival',
    description: 'Competitive opposition, not outright enmity',
    strength: ['professional', 'personal', 'bitter'],
  },
  enemy: {
    name: 'Enemy',
    description: 'Active hostility and opposition',
    strength: ['mild', 'serious', 'mortal'],
  },
  family: {
    name: 'Family',
    description: 'Blood or marriage relation',
    strength: ['distant', 'close', 'inseparable'],
  },
  patron_client: {
    name: 'Patron/Client',
    description: 'One provides support, other provides service',
    strength: ['nominal', 'significant', 'total dependence'],
  },
  lover: {
    name: 'Lover',
    description: 'Romantic or sexual relationship',
    strength: ['casual', 'serious', 'passionate'],
  },
  mentor_student: {
    name: 'Mentor/Student',
    description: 'Teaching and learning relationship',
    strength: ['formal', 'devoted', 'lifelong'],
  },
  debtor_creditor: {
    name: 'Debtor/Creditor',
    description: 'One owes the other money or favour',
    strength: ['minor', 'substantial', 'crushing'],
  },
  political: {
    name: 'Political Alliance',
    description: 'Cooperation for mutual political benefit',
    strength: ['convenience', 'stable', 'unbreakable'],
  },
  respect: {
    name: 'Mutual Respect',
    description: 'Professional regard despite differences',
    strength: ['grudging', 'genuine', 'deep'],
  },
};

// generateSuccessionNarrative

// generateRelationshipNarrative

// ─── Inlined cross-module helpers (cycle-free) ─────────────

// getTierConstraints — rewrite generic faction phrasing in `text` to match
// the settlement's actual institutions and tier.
//   text                  — narrative string to rewrite
//   instNames             — lowercased institution names present
//   tier                  — settlement tier
//   governingBodyOverride — explicit governing-body label, else derived from tier
const getTierConstraints = (text, instNames, tier, governingBodyOverride) => {
  const hasInst = (keyword) => instNames.some((name) => name.includes(keyword)),
    isSmall = ['thorp', 'hamlet', 'village'].includes(tier),
    guardLabel = hasInst('garrison')
      ? 'the garrison'
      : hasInst('barracks')
        ? 'the barracks guard'
        : hasInst('professional guard')
          ? 'the professional guard'
          : hasInst('city watch') || hasInst('town watch')
            ? 'the watch'
            : hasInst('militia')
              ? 'the militia'
              : hasInst('mercenary')
                ? 'the mercenary company'
                : isSmall
                  ? 'the able-bodied'
                  : 'the guard',
    councilLabel =
      governingBodyOverride ||
      (isSmall
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
    merchantLabel =
      hasInst('merchant') || hasInst('guild') || hasInst('market')
        ? 'the merchants'
        : isSmall
          ? 'the wealthiest household'
          : 'the traders',
    healerLabel = hasInst('hospital')
      ? 'the hospital staff'
      : hasInst('monastery') || hasInst('friary')
        ? 'the monastery brothers'
        : hasInst('healer')
          ? 'the healers'
          : hasInst('church') || hasInst('cathedral') || hasInst('parish')
            ? 'the clergy'
            : isSmall
              ? 'the local herbalist'
              : 'the healers',
    watchLabel =
      hasInst('city watch') || hasInst('town watch')
        ? 'the watch'
        : hasInst('garrison') || hasInst('guard')
          ? 'the guard'
          : hasInst('militia')
            ? 'the militia'
            : isSmall
              ? 'the neighbours'
              : 'the guard';
  return text
    .replace(/\bthe garrison commander\b/gi, guardLabel.replace(/^the /, 'the ') + "'s commander")
    .replace(/\bthe garrison\b/gi, guardLabel)
    .replace(/\bthe public watch\b/gi, watchLabel)
    .replace(/\bthe watch\b/gi, watchLabel)
    .replace(/\bthe council\b/gi, councilLabel)
    .replace(/\ba council\b/gi, councilLabel)
    .replace(/\bcouncil meetings\b/gi, councilLabel.replace(/^the /, '') + ' meetings')
    .replace(/\binside the council\b/gi, 'inside ' + councilLabel)
    .replace(/\bthe grain merchants\b/gi, merchantLabel)
    .replace(/\bgrain merchants\b/gi, merchantLabel)
    .replace(/\btwo healers\b/gi, 'two ' + healerLabel.replace(/^the /, ''))
    .replace(/\bthe healers\b/gi, healerLabel)
    .replace(
      /\bthe mages' quarter\b/gi,
      hasInst('wizard') || hasInst('mage') || hasInst('alchemist') ? "the mages' quarter" : 'the arcane practitioners'
    );
};

// ─── Private helpers (auto-extracted) ────────────────────

// computeRelTension
// generateEconomicScore — build up to 3 plot hooks for a conflict between two
// factions, given the institution flags and stress flags.
//   factionA, factionB — the two opposing factions
//   conflict           — the conflict-issue object (unused here)
//   instFlags          — institution flags (gov faction name, criminal score)
//   stressFlags        — active stress flags
const generateEconomicScore = (factionA, factionB, conflict, instFlags, stressFlags) => {
  const govFacName = (instFlags == null ? void 0 : instFlags._govFacName) || '',
    isFeudal =
      govFacName.includes('Feudal') ||
      govFacName.includes('Steward') ||
      govFacName.includes('Manor') ||
      govFacName.includes('Noble') ||
      govFacName.includes('Lord'),
    isChurch =
      govFacName.includes('Church') ||
      govFacName.includes('Theocrat') ||
      govFacName.includes('Clergy') ||
      govFacName.includes('Bishop'),
    arbitrationVenue = isFeudal
      ? "the lord's next court hearing"
      : isChurch
        ? 'the next chapter assembly'
        : 'the next council session',
    hooks = [
      `A neutral figure is being pressured by both ${factionA.name} and ${factionB.name} to take a side before ${arbitrationVenue}.`,
      'Evidence has surfaced suggesting a third party is deliberately escalating the tension between the two factions.',
    ];
  if (stressFlags.merchantCriminalBlur)
    hooks.push(
      'The dispute is complicated by the fact that key members of both factions share business interests that neither wants exposed during arbitration.'
    );
  if (stressFlags.stateCrime)
    hooks.push(
      "One faction has been using official authority to harass the other's members. The harassment is technically legal."
    );
  if (instFlags.criminalEffective > 55)
    hooks.push(
      'Someone is offering to resolve the conflict "permanently" for a price. Both factions have received the offer. Neither has refused yet.'
    );
  return hooks.slice(0, 3);
};

// random01

// STRESS_FLAVOR
const STRESS_FLAVOR = {
  under_siege: ['debtor_creditor', 'enemy', 'patron_client'],
  famine: ['debtor_creditor', 'patron_client', 'political'],
  occupied: ['ally', 'debtor_creditor', 'enemy'],
  politically_fractured: ['enemy', 'rival', 'political'],
  indebted: ['debtor_creditor', 'patron_client'],
  recently_betrayed: ['ally', 'patron_client', 'enemy'],
  infiltrated: ['ally', 'patron_client'],
  plague_onset: ['patron_client', 'debtor_creditor'],
  succession_void: ['rival', 'enemy', 'political'],
  monster_pressure: ['patron_client', 'debtor_creditor'],
};

// STRESS_RUMORS — each renders a rumour phrasing from a relationship object
const STRESS_RUMORS = [
  (rel) => {
    var detail;
    return `${rel.npc1Name} and ${rel.npc2Name} are connected by something neither discusses openly. ${((detail = rel.description.split('—')[1]) == null ? void 0 : detail.trim()) || rel.tension}`;
  },
  (rel) =>
    `${rel.npc1Name}'s relationship with ${rel.npc2Name} is more complicated than their public roles suggest. ${rel.tension}`,
  (rel) => {
    var typeName;
    return `There is a ${((typeName = rel.typeName) == null ? void 0 : typeName.toLowerCase()) || 'significant'} between ${rel.npc1Name} and ${rel.npc2Name}. ${rel.tension}`;
  },
  (rel) => rel.tension,
];

// pickFactionName (local) — pick the most common member category among `members`
const pickFactionName = (members) => {
  var topEntry;
  const categoryCounts = {};
  members.forEach((member) => {
    categoryCounts[member.category] = (categoryCounts[member.category] || 0) + 1;
  });
  return (
    ((topEntry = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0]) == null ? void 0 : topEntry[0]) ||
    'other'
  );
};

export const computeRelTension = (factionA, factionB, stressFlags, instFlags) => {
  const categoryPair = [factionA.category, factionB.category].sort().join('_'),
    powerDiff = factionA.power - factionB.power;
  if (stressFlags.merchantCriminalBlur && categoryPair.includes('economy') && categoryPair.includes('criminal'))
    return _rng() < 0.6 ? STRESS_ECONOMIC_EFFECTS.econ_crim_blur : STRESS_ECONOMIC_EFFECTS.econ_crim_exploitation;
  if (stressFlags.stateCrime && categoryPair.includes('military') && categoryPair.includes('criminal'))
    return STRESS_ECONOMIC_EFFECTS.mil_crim_corruption;
  if (!stressFlags.stateCrime && categoryPair.includes('military') && categoryPair.includes('criminal'))
    return instFlags.militaryEffective > instFlags.criminalEffective
      ? STRESS_ECONOMIC_EFFECTS.mil_crim_suppression
      : STRESS_ECONOMIC_EFFECTS.mil_crim_corruption;
  if (stressFlags.merchantArmy && categoryPair.includes('economy') && categoryPair.includes('military'))
    return STRESS_ECONOMIC_EFFECTS.econ_mil_contract;
  if (stressFlags.crusaderSynthesis && categoryPair.includes('religious') && categoryPair.includes('military'))
    return STRESS_ECONOMIC_EFFECTS.rel_mil_crusader;
  if (stressFlags.religiousFraud && categoryPair.includes('religious') && categoryPair.includes('criminal'))
    return STRESS_ECONOMIC_EFFECTS.rel_crim_fraud;
  if (stressFlags.arcaneBlackMarket && categoryPair.includes('magic') && categoryPair.includes('criminal'))
    return STRESS_ECONOMIC_EFFECTS.mag_crim_market;
  if (categoryPair.includes('government') && categoryPair.includes('economy') && instFlags.economyOutput > 65)
    return STRESS_ECONOMIC_EFFECTS.gov_econ_dependence;
  if (categoryPair.includes('government') && categoryPair.includes('military')) {
    const roll = _rng();
    return roll < 0.35
      ? STRESS_ECONOMIC_EFFECTS.gov_mil_friction
      : roll < 0.6
        ? STRESS_ECONOMIC_EFFECTS.wary_alliance
        : roll < 0.8
          ? STRESS_ECONOMIC_EFFECTS.genuine_respect
          : STRESS_ECONOMIC_EFFECTS.peer_rivalry;
  }
  if (Math.abs(powerDiff) >= 4)
    return _rng() < 0.5 ? STRESS_ECONOMIC_EFFECTS.mentor_legacy : STRESS_ECONOMIC_EFFECTS.old_debt;
  const getPersonality = (faction) => {
      const personality = faction.personality;
      return personality
        ? Array.isArray(personality)
          ? personality.join(' ')
          : [personality.dominant, personality.flaw, personality.modifier].filter(Boolean).join(' ')
        : '';
    },
    personalityA = getPersonality(factionA),
    personalityB = getPersonality(factionB),
    bothArrogant = personalityA.includes('arrogant') && personalityB.includes('arrogant'),
    bothGreedy = personalityA.includes('greedy') && personalityB.includes('greedy'),
    eitherPragmatic = personalityA.includes('pragmatic') || personalityB.includes('pragmatic');
  if (bothArrogant || bothGreedy || (factionA.category === factionB.category && _rng() < 0.2))
    return STRESS_ECONOMIC_EFFECTS.peer_rivalry;
  if (eitherPragmatic) return STRESS_ECONOMIC_EFFECTS.mutual_leverage;
  const weightedArchetypes = [
      {
        archetype: STRESS_ECONOMIC_EFFECTS.wary_alliance,
        weight: 2,
      },
      {
        archetype: STRESS_ECONOMIC_EFFECTS.mutual_leverage,
        weight: 1.8,
      },
      {
        archetype: STRESS_ECONOMIC_EFFECTS.genuine_respect,
        weight: 1.5,
      },
      {
        archetype: STRESS_ECONOMIC_EFFECTS.peer_rivalry,
        weight: 1.5,
      },
      {
        archetype: STRESS_ECONOMIC_EFFECTS.old_debt,
        weight: 1.2,
      },
      {
        archetype: STRESS_ECONOMIC_EFFECTS.bitter_history,
        weight: 0.8 * (instFlags.criminalEffective / 50),
      },
      {
        archetype: STRESS_ECONOMIC_EFFECTS.family_complication,
        weight: 0.7,
      },
      {
        archetype: STRESS_ECONOMIC_EFFECTS.mentor_legacy,
        weight: 0.8,
      },
    ],
    totalWeight = weightedArchetypes.reduce((sum, entry) => sum + entry.weight, 0);
  let roll = _rng() * totalWeight;
  for (const { archetype, weight } of weightedArchetypes) {
    roll -= weight;
    if (roll <= 0) return archetype;
  }
  return STRESS_ECONOMIC_EFFECTS.wary_alliance;
};

// genSuccessionNarr — build a list of narrative sentences from a settlement
// context object `ctx`, each gated on a tension/state condition.
export const genSuccessionNarr = (ctx) => {
  var issueMessage, stabilityUnstable, stabilityFractured, stabilityVolatile;
  const narratives = [];
  if (ctx.topTension === 'succession_crisis')
    narratives.push(
      `${ctx.name}'s ruler is ageing and the succession is contested; ${ctx.topFaction || 'the dominant faction'} has already positioned for the transition.`
    );
  if (ctx.topTension === 'corruption_scandal')
    narratives.push(
      `Evidence of corruption in ${ctx.govFaction || 'the council'} has surfaced; ${ctx.topNPCName ? ctx.topNPCName + ', the ' + ctx.topNPCRole + ',' : 'the most senior official'} is part of the answer and part of the problem.`
    );
  if (ctx.topTension === 'outside_debt')
    narratives.push(
      `${ctx.name}'s debt obligations are becoming visible in its decisions; the creditor hasn't moved yet, but the calculation of when to move is being made.`
    );
  if (ctx.topTension === 'infiltration_fear')
    narratives.push(
      `Rumours of enemy agents in ${ctx.name} have made the settlement paranoid in ways that are being exploited by at least one of the factions paranoia is supposed to protect against.`
    );
  if (!ctx.isViable && ctx.viabilityIssues?.length > 0)
    narratives.push(
      `${ctx.name} has a structural problem it hasn't solved: ${((issueMessage = ctx.viabilityIssues[0].message) == null ? void 0 : issueMessage.toLowerCase()) || 'an economic vulnerability'}. It will eventually force a decision.`
    );
  if (ctx.hasNeighborConflict && ctx.neighbor)
    narratives.push(
      `The relationship with ${ctx.neighbor} has deteriorated to the point where ${ctx.name}'s ${ctx.topNPCRole || 'leadership'} is making decisions with one eye on what conflict would cost.`
    );
  if (ctx.prosperity === 'Wealthy' || ctx.prosperity === 'Thriving')
    narratives.push(
      `${ctx.name} is prosperous enough that the real conflicts are about who controls the surplus: ${ctx.topFaction || 'the dominant faction'} has the most and wants more.`
    );
  if (ctx.prosperity === 'Poor')
    narratives.push(
      `${ctx.name} is poor enough that every resource decision is a political one; ${ctx.govFaction || 'the council'} and ${ctx.topFaction || 'the merchant class'} disagree about who bears the cost.`
    );
  if (ctx.commodity && ctx.isCrossroads)
    narratives.push(
      `${ctx.name} sits where trade roads cross; its ${ctx.commodity} trade moves through it in both directions, and whoever controls the tariff controls the settlement's revenue, a fact not lost on ${ctx.topFaction || 'the guilds'}.`
    );
  if (ctx.commodity && ctx.isPort)
    narratives.push(
      `${ctx.name}'s port handles more ${ctx.commodity} than the official records show; the gap between what arrives and what is taxed is understood by ${ctx.topFaction || 'the merchant class'} and the guard alike.`
    );
  if (
    ((stabilityUnstable = ctx.stability) != null && stabilityUnstable.includes('Unstable')) ||
    ((stabilityFractured = ctx.stability) != null && stabilityFractured.includes('Fractured')) ||
    ((stabilityVolatile = ctx.stability) != null && stabilityVolatile.includes('Volatile'))
  )
    narratives.push(
      `${ctx.name} looks stable from the outside; the relationship between ${ctx.topFaction || 'the dominant faction'} and ${ctx.govFaction || 'the council'} is more contested than it appears.`
    );
  if (ctx.topTension === 'economic_disparity')
    narratives.push(
      `The wealth gap in ${ctx.name} has become a fact of daily life: ${ctx.topFaction || 'the merchant class'} controls the surplus and ${ctx.govFaction || 'the council'} cannot or will not force redistribution. Resentment is structural now, not episodic.`
    );
  if (ctx.topTension === 'religious_tension')
    narratives.push(
      `Two versions of faith are competing in ${ctx.name}; both claim legitimacy and both have the ear of someone powerful. ${ctx.govFaction || 'The council'} has avoided taking sides so far, which means both factions resent it equally.`
    );
  if (ctx.topTension === 'guild_conflict')
    narratives.push(
      `The guild dispute in ${ctx.name} is not about craft standards. It is about who controls access to the market. ${ctx.topFaction || 'The dominant guild'} has held the advantage long enough that the challengers have stopped playing by guild rules.`
    );
  if (ctx.topTension === 'external_threat' && ctx.neighbor)
    narratives.push(
      `${ctx.name} is watching ${ctx.neighbor} and does not like what it sees. ${ctx.govFaction || 'The council'} and ${ctx.milForce || 'the garrison'} disagree about what to do about it, and that disagreement is now public.`
    );
  if (ctx.topTension === 'external_threat' && !ctx.neighbor)
    narratives.push(
      `The threat approaching ${ctx.name} is not yet visible to most residents. ${ctx.topNPCName || 'The most senior figure'} knows the intelligence and has not shared it. The decision about when to share it (and how) is the real crisis.`
    );
  if (ctx.topTension === 'resource_scarcity' && ctx.commodity)
    narratives.push(
      `${ctx.name}'s ${ctx.commodity} supply is tighter than the official position acknowledges. ${ctx.topFaction || 'The merchant class'} knows the real numbers. ${ctx.govFaction || 'The council'} has been told a different version.`
    );
  if (ctx.topTension === 'resource_scarcity' && !ctx.commodity)
    narratives.push(
      `Something essential in ${ctx.name} is running short: food, water, or coin. The shortage is being managed through allocation decisions that are, functionally, political decisions. ${ctx.govFaction || 'The council'} controls the allocation.`
    );
  if (ctx.topTension === 'crime_wave')
    narratives.push(
      `${ctx.name}'s criminal problem has grown past the point ${ctx.milForce || 'the guard'} can contain through normal enforcement. The question is whether ${ctx.govFaction || 'the council'} brings in more force, negotiates, or finds a scapegoat. Someone powerful benefits from each option.`
    );
  if (ctx.topTension === 'magical_controversy')
    narratives.push(
      `Magic in ${ctx.name} has done something recently that people cannot agree on how to interpret. ${ctx.govFaction || 'The council'} is being pressured to regulate, by people who disagree about what regulation means.`
    );
  if (ctx.topTension === 'generational_divide')
    narratives.push(
      `In ${ctx.name} the older residents and the younger ones are not arguing about the same things. The older generation thinks the argument is about values; the younger thinks it is about access. Both are right.`
    );
  if (ctx.topTension === 'occupation_legacy')
    narratives.push(
      `${ctx.name} carries the memory of an occupation that officially ended. Collaborators and resisters still share the same streets, the same market, the same ${ctx.govFaction || 'council'}. The official position is that this is resolved.`
    );
  if (ctx.topTension === 'disputed_land')
    narratives.push(
      `A land dispute in ${ctx.name} that was dormant is now active. Someone filed a claim, or found a document, or simply started pressing. ${ctx.govFaction || 'The council'} has delayed ruling because there is no outcome that does not cost them something.`
    );
  if (ctx.topTension === 'population_friction')
    narratives.push(
      `${ctx.name} is absorbing people it did not plan for, or losing people it expected to keep. Either way, the settlement's social assumptions no longer match its actual composition, and ${ctx.govFaction || 'the council'} is governing for the settlement that used to exist.`
    );
  if (ctx.topTension === 'leadership_vacuum')
    narratives.push(
      `${ctx.name} has not had a strong authority since ${ctx.topNPCName || 'the last leader'} left or died. The pretense of normal governance is maintained. Every decision of consequence is being deferred or made informally by ${ctx.topFaction || 'the faction with the most to gain'}.`
    );
  narratives.push(
    `The most important thing happening in ${ctx.name} right now is happening below the surface: ${ctx.topNPCName ? ctx.topNPCName + ', the ' + ctx.topNPCRole + ',' : 'the most senior figure'} knows it and isn't discussing it.`
  );
  return narratives;
};

// genRelNarrative — pick the most salient relationship and render a rumour for it
export const genRelNarrative = (input) => {
  var firstStress, topScored;
  const { relationships = [], stress, config: _config = {} } = input;
  if (!relationships.length || random01(0.4)) return null;
  const primaryStressType =
      ((firstStress = (stress ? (Array.isArray(stress) ? stress : [stress]) : [])[0]) == null
        ? void 0
        : firstStress.type) || null,
    flavorTypes = primaryStressType ? STRESS_FLAVOR[primaryStressType] || [] : [],
    scored = relationships.map((rel) => {
      let score = _rng() * 0.5;
      if (flavorTypes.includes(rel.type)) score += 2;
      if (rel.flagDriven) score += 1;
      if (rel.tension && rel.tension.length > 30) score += 0.5;
      return {
        r: rel,
        score,
      };
    });
  scored.sort((a, b) => b.score - a.score);
  const topRel = (topScored = scored[0]) == null ? void 0 : topScored.r;
  if (!topRel) return null;
  const phrasing = pickRandom2(STRESS_RUMORS)(topRel);
  return {
    npc1: topRel.npc1Name,
    npc2: topRel.npc2Name,
    type: topRel.typeName,
    phrasing,
    full: topRel.description,
    tension: topRel.tension,
  };
};

// ─────────────────────────────────────────────────────────

// generatePowerStructure

// ─────────────────────────────────────────────────────────

// generatePowerStructure

// inferFactionCategory — map faction name → category for economy correlation
const FACTION_CATEGORY_KEYWORDS = {
  military: [
    'Military',
    'Guard',
    'War Council',
    'Garrison',
    'Mercenary',
    'Occupation',
    'Resistance',
    'Monster Hunter',
    'Adventurer',
    'Charter',
    'Watch',
    'Knight',
    'Soldier',
    'Huscarl',
    'Huskarl',
    'Hird',
  ],
  religious: [
    'Religious',
    'Faith',
    'Church',
    'Temple',
    'Congregation',
    'Shrine',
    'Clergy',
    'Conversion',
    'Old Faith',
    'Ecclesiastical',
    'Diocese',
    'Bishop',
    'Patriarch',
    'Holy',
    'Theocrat',
    'Priestly',
    'Devout',
    'Friar',
    'Monastery',
    'Cathedral',
  ],
  criminal: [
    'Thiev',
    'Criminal',
    'Organized Crime',
    'Smuggl',
    'Underground',
    'Cartel',
    'Corrupt',
    'Bandit',
    'Assassin',
    'Shadow',
    'Hidden Hand',
    'Black Circle',
    'Underworld',
  ],
  magic: ['Arcane', 'Mage', 'Wizard', 'Sorcerer', 'Alchemist', 'Occult', 'Hedge', 'Enchant', 'Tower', 'Spellcast'],
  economy: [
    'Merchant',
    'Craft',
    'Guild',
    'Trade',
    'Market',
    'Banking',
    'Grain',
    'Farmer',
    'Cloth',
    'Commerce',
    'Factor',
    'Artisan',
    'Ledger',
    'Compact',
    'Consortium',
    'Bloc',
    'Oligarch',
  ],
  government: [
    'Council',
    'Authority',
    'Administration',
    'Governor',
    'Steward',
    'Assembly',
    'Senate',
    'Civic',
    'Municipal',
    'Electoral',
    'Democratic',
    'Alderman',
    'Magistrate',
    'Court',
    'Chancery',
  ],
  noble: [
    'Noble',
    'Aristocrat',
    'Lord',
    'Lady',
    'Manor',
    'Landed',
    'Gentry',
    'Feudal',
    'Ducal',
    'Royal',
    'House',
    'Estate',
    'Heritage',
  ],
};

const inferFactionCategory = (factionName) => {
  for (const [cat, keywords] of Object.entries(FACTION_CATEGORY_KEYWORDS)) {
    if (keywords.some((kw) => factionName.includes(kw))) return cat;
  }
  return 'other'; // changed: 'other' not 'government' — prevents governing dump
};

// renormalizeFactionPower — rescale every faction's `power` to integer
// percentage points summing to exactly 100, using largest-remainder rounding
// so the rounded points always total 100 (never 99 or 101). Mutates in place
// and preserves rank order. Reused by the neighbourFactions step, which injects
// raw-scale powers into the already-percentage-normalized roster and must
// restore the power-share invariant. No-op for an empty/zero-power roster.
const renormalizeFactionPower = (factions) => {
  if (!factions || !factions.length) return factions;
  const total = factions.reduce((sum, f) => sum + (f.power || 0), 0);
  if (total <= 0) return factions;
  // Floor each share, track remainders, then distribute the leftover points to
  // the largest remainders (ties broken by current order) so the sum is 100.
  const shares = factions.map((f, i) => {
    const exact = ((f.power || 0) / total) * 100;
    const floor = Math.floor(exact);
    return { i, floor, remainder: exact - floor };
  });
  let allotted = shares.reduce((sum, s) => sum + s.floor, 0);
  let leftover = 100 - allotted;
  shares
    .slice()
    .sort((a, b) => b.remainder - a.remainder || a.i - b.i)
    .forEach((s) => {
      if (leftover > 0) {
        s.floor += 1;
        leftover -= 1;
      }
    });
  shares.forEach((s) => {
    factions[s.i].power = s.floor;
  });
  return factions;
};

export { renormalizeFactionPower };

// normalizeAndAnnotateFactions — renormalise faction powers to percentages,
// sort governing-first then by descending power, and append inter-faction
// rivalry/relationship colour to each faction's description in place.
const normalizeAndAnnotateFactions = (factions) => {
  const dt = factions.reduce((N, ye) => N + ye.power, 0);
  (factions.forEach((N) => {
    N.power = Math.round((N.power / dt) * 100);
  }),
    factions.sort((N, ye) => (N.isGoverning ? -1 : ye.isGoverning ? 1 : ye.power - N.power)),
    (function () {
      var N = factions.map(function (qt) {
          return qt.faction;
        }),
        ye = function (qt) {
          return N.some(function (Ct) {
            return Ct.toLowerCase().includes(qt.toLowerCase());
          });
        },
        he = factions[0] ? factions[0].faction : null;
      factions[1] && factions[1].faction;
      var De = factions[0] ? factions[0].power : 0,
        Mi = factions[1] ? factions[1].power : 0,
        cr = De - Mi,
        bt = ye('Merchant'),
        tr = ye('Craft Guild'),
        ft = ye('Thieves') || ye('Organized Crime') || ye('Criminal'),
        Fr = ye('Military') || ye('Guard'),
        la =
          ye('Manor Household') || ye('Landed Gentry') || ye('Noble Famil') || ye('Great Famil') || ye('Noble House'),
        Rn = ye('Feudal Stewardship') || ye('Feudal Appointee'),
        vr = ye('Religious Authorities'),
        ei = ye('Arcane Orders');
      factions.forEach(function (qt, Ct) {
        var at = qt.power,
          Mt = qt.faction,
          wt = Mt.toLowerCase(),
          Gr = Ct > 0 ? factions[Ct - 1] : null,
          ti = Ct < factions.length - 1 ? factions[Ct + 1] : null,
          _r = Gr ? Gr.power - at : 0,
          _e = ti ? at - ti.power : 99,
          ve = '';
        if (
          (Ct === 1 &&
            !qt.isGoverning &&
            (cr <= 6
              ? (ve = he
                  ? 'The gap between them and ' +
                    (he && he.toLowerCase().includes('council') ? 'the governing council' : he) +
                    ' is narrow. A single shift in patronage, scandal, or armed muscle could swap their positions.'
                  : 'The dominant order is genuinely contested; a single shift in circumstance could reorder everything.')
              : cr <= 14
                ? (ve = he
                    ? 'They operate in the shadow of ' +
                      (he && he.toLowerCase().includes('council') ? 'the governing council' : he) +
                      ' but not comfortably. They are watching for leverage, not deferring.'
                    : 'Close enough to the top to resist, far enough behind to be cautious.')
                : (ve = he
                    ? 'Behind ' +
                      (he && he.toLowerCase().includes('council') ? 'the governing council' : he) +
                      ' by enough margin that direct challenge is not viable. They route their influence through procedure, not confrontation.'
                    : 'The hierarchy is settled for now; their energy goes into consolidating second place, not chasing first.')),
          Ct === 2 &&
            (_r <= 5 && _e <= 5
              ? (ve =
                  'Genuinely three-way territory. No faction has decisively broken from the pack; every council vote is negotiated.')
              : _r <= 10
                ? (ve =
                    'Close enough to the two above that their support is worth buying; they play ' +
                    (Gr ? Gr.faction : 'the second faction') +
                    ' and ' +
                    (factions[0] ? factions[0].faction : 'the top faction') +
                    ' against each other when they can.')
                : (ve =
                    'A reliable third presence: too significant to exclude from negotiations, not strong enough to set their own terms.')),
          Ct === factions.length - 1 &&
            at < 7 &&
            _r >= 5 &&
            (ve =
              'Their leverage is narrow and issue-specific; on broader questions they follow whoever is willing to deal with them that week.'),
          bt && tr)
        ) {
          if (wt.includes('merchant')) {
            var Se = factions.find(function (Ue) {
              return Ue.faction.includes('Craft Guild');
            });
            if (Se) {
              var me =
                Se.power > at
                  ? 'The craft guilds currently outweigh them in raw political numbers, an uncomfortable inversion the merchants are working to correct.'
                  : Se.power > at - 8
                    ? 'The craft guilds are close behind, contesting every pricing and quality-standard decision they try to push through council.'
                    : 'The craft guilds are present but outpaced; merchants set prices, craft masters object, and merchants win more often than not.';
              ve = ve ? ve + ' ' + me : me;
            }
          }
          if (wt.includes('craft guild')) {
            var He = factions.find(function (Ue) {
              return Ue.faction.includes('Merchant');
            });
            if (He) {
              var be =
                He.power > at + 8
                  ? 'The merchants consistently outvote them on pricing and labour standards. Craft masters have learned to attach riders to deals rather than fight directly.'
                  : He.power > at
                    ? 'Running close behind the merchant guilds in a sustained dispute over who sets the terms for finished goods.'
                    : 'Ahead of the merchant guilds in current influence, an unusual position they intend to hold.';
              ve = ve ? ve + ' ' + be : be;
            }
          }
        }
        if (ft && Fr) {
          if (wt.includes('thieves') || wt.includes('organized crime') || wt.includes('criminal')) {
            var Zt = factions.find(function (Ue) {
              return Ue.faction.toLowerCase().includes('military') || Ue.faction.toLowerCase().includes('guard');
            });
            if (Zt) {
              var Xt =
                Zt.power > at + 10
                  ? 'The garrison outweighs them institutionally. They survive by corrupting the lower ranks and making enforcement selectively unprofitable.'
                  : Zt.power < at - 10
                    ? 'They currently outflank the military in real leverage; there are officers on payroll and commanders who know better than to ask questions.'
                    : 'Running roughly even with the military in actual influence. The garrison can arrest individuals, the guild can make the investigation expensive.';
              ve = ve ? ve + ' ' + Xt : Xt;
            }
          }
          if (wt.includes('military') || wt.includes('guard')) {
            var Xe = factions.find(function (Ue) {
              var nm = Ue.faction.toLowerCase();
              return nm.includes('thieves') || nm.includes('organized crime') || nm.includes('criminal');
            });
            if (Xe) {
              var et =
                Xe.power > at + 10
                  ? 'The guild has more real leverage than they do. Selective enforcement is the only tool that still works, and everyone knows it.'
                  : Xe.power < at - 10
                    ? 'They outmatch the guild institutionally, which keeps the criminal operation suppressed rather than eliminated. There is a difference.'
                    : 'Running a slow institutional war with the guild: arrests happen, networks rebuild, deals are struck and quietly violated.';
              ve = ve ? ve + ' ' + et : et;
            }
          }
        }
        if (bt && ft && wt.includes('merchant')) {
          var Rt = factions.find(function (Ue) {
            var nm = Ue.faction.toLowerCase();
            return nm.includes('thieves') || nm.includes('organized crime') || nm.includes('criminal');
          });
          if (Rt && Rt.power > 10) {
            var Ri =
              Rt.power > at
                ? 'The criminal network has more operational reach than the merchant guilds right now. Some merchants are paying protection; others have become silent partners.'
                : "They tolerate the guild's cut because fighting it costs more than paying it; the arrangement is not advertised.";
            ve = ve ? ve + ' ' + Ri : Ri;
          }
        }
        if (
          la &&
          bt &&
          (wt.includes('manor') ||
            wt.includes('landed gentry') ||
            wt.includes('noble famil') ||
            wt.includes('great famil') ||
            wt.includes('noble house'))
        ) {
          var ca = factions.find(function (Ue) {
            return Ue.faction.includes('Merchant');
          });
          if (ca) {
            var qs =
              ca.power > at + 12
                ? 'The merchant guilds now hold more functional leverage. The noble families retain title, hereditary land, and social precedence, but the money has moved.'
                : ca.power > at
                  ? 'The merchants are closing the gap; the noble families are using every legal and social mechanism to slow a transition that looks increasingly inevitable.'
                  : 'Still ahead of merchant interests in real influence, for now. They know the gap is narrowing and are arranging marriages accordingly.';
            ve = ve ? ve + ' ' + qs : qs;
          }
        }
        if (Rn && la && (wt.includes('manor household') || wt.includes('landed gentry'))) {
          var Pa = factions.find(function (Ue) {
            return (
              (Ue.faction.includes('Feudal Stewardship') || Ue.faction.includes('Feudal Appointee')) &&
              Ue.faction !== qt.faction
            );
          });
          if (Pa) {
            var da = Math.floor(at * 7 + Pa.power * 3) % 3,
              _i =
                Pa.power > at + 10
                  ? da === 0
                    ? "The steward administers in the lord's name. The household is the source of that authority, not a rival to it, but the practical question of who signs what has become genuinely complicated."
                    : 'The steward holds the day-to-day authority; the household provides the legitimacy. In practice the line between them blurs whenever a petitioner finds one more receptive than the other.'
                  : Pa.power < at - 10
                    ? da === 0
                      ? 'They hold more direct influence than the steward appointed to govern in their name, which raises questions about why the steward exists at all.'
                      : 'The steward nominally governs but defers here more than the arrangement was designed to allow.'
                    : da === 0
                      ? 'Overlapping claims with the steward create an ambiguity that everyone exploits: petitioners approach whichever authority is more likely to give the answer they want.'
                      : da === 1
                        ? 'The steward and the household have developed a working arrangement, but its terms are renegotiated whenever something important is at stake.'
                        : 'Which one actually governs depends on the day and the question; both would say themselves.';
            ve = ve ? ve + ' ' + _i : _i;
          }
        }
        if (vr && ei) {
          if (wt.includes('religious')) {
            var qa = factions.find(function (Ue) {
              return Ue.faction.toLowerCase().includes('arcane');
            });
            if (qa) {
              var ri =
                qa.power > at
                  ? 'The arcane orders currently hold more practical influence, which the clergy finds spiritually troubling and politically unacceptable.'
                  : "The arcane orders are present but operate in the clergy's shadow. Questions of what is sanctioned magic and what is heresy remain deliberately unresolved.";
              ve = ve ? ve + ' ' + ri : ri;
            }
          }
          if (wt.includes('arcane')) {
            var ii = factions.find(function (Ue) {
              return Ue.faction.toLowerCase().includes('religious');
            });
            if (ii) {
              var Li =
                ii.power > at
                  ? 'The clergy hold more civic influence. The arcane orders operate by navigating rather than challenging religious authority.'
                  : 'Ahead of the religious authorities in current influence, which they hold carefully: too much visible power invites accusations that they prefer to avoid.';
              ve = ve ? ve + ' ' + Li : Li;
            }
          }
        }
        if (vr && ft && wt.includes('religious')) {
          var Dr = factions.find(function (Ue) {
            var nm = Ue.faction.toLowerCase();
            return nm.includes('thieves') || nm.includes('organized crime') || nm.includes('criminal');
          });
          if (Dr && Dr.power > 10) {
            var Tt =
              Dr.power > at
                ? "The criminal network currently outweighs them. The clergy's moral authority is loud and largely unheeded."
                : 'They denounce the guild from the pulpit; the guild funds two charitable institutions and makes the denunciations look selective.';
            ve = ve ? ve + ' ' + Tt : Tt;
          }
        }
        if (Fr && vr && (wt.includes('military') || wt.includes('guard'))) {
          var _n = factions.find(function (Ue) {
            return Ue.faction.toLowerCase().includes('religious');
          });
          if (_n && Math.abs(_n.power - at) < 10) {
            var Ln =
              'They and the religious authorities operate parallel systems of social control: the garrison handles bodies, the clergy handles minds, and both would prefer the other operated at lower volume.';
            ve = ve ? ve + ' ' + Ln : Ln;
          }
        }
        ve && (qt.desc = qt.desc ? qt.desc + ' ' + ve : ve);
      });
    })());
};

// applyStressFactionEffects — mutate `factions` in place to reflect the
// active stress types: rebalance existing faction powers and push the
// crisis-specific factions (war council, occupation authority, etc.).
const applyStressFactionEffects = (factions, hasStress, powerStructure, hasNobility, config, institutions) => {
  // --- under_siege: militarise, weaken commerce, add a War Council ---
  if (hasStress('under_siege')) {
    factions.forEach((faction) => {
      const name = faction.faction.toLowerCase();
      if (name.includes('military') || name.includes('guard')) {
        faction.power = Math.round(faction.power * 2);
      }
      if (faction.isGoverning) {
        faction.power = Math.round(faction.power * 1.5);
      }
      if (name.includes('merchant') || name.includes('guild')) {
        faction.power = Math.round(faction.power * 0.5);
      }
    });
    factions.push({
      faction: 'War Council',
      power: 25,
      desc: 'Emergency committee with authority over rationing, conscription, and defence spending; not accountable to normal governance.',
    });
  }

  // --- occupied: suppress governance/military/civilians, add occupier + resistance ---
  if (hasStress('occupied')) {
    factions.forEach((faction) => {
      const name = faction.faction.toLowerCase();
      if (faction.isGoverning) {
        faction.modifiers = [...(faction.modifiers || []), 'occupied'];
        faction.power = Math.round(faction.power * 0.6);
      }
      if (name.includes('military') || name.includes('guard')) {
        faction.power = Math.round(faction.power * 0.3);
      }
      if (
        !faction.isGoverning &&
        faction.faction !== 'Occupation Authority' &&
        faction.faction !== 'Resistance Network' &&
        !name.includes('military') &&
        !name.includes('guard')
      ) {
        faction.power = Math.round(faction.power * 0.82);
      }
      if (faction.faction === 'Noble Families' || faction.faction === 'Noble Houses' || faction.faction === 'Landed Gentry') {
        faction.power = Math.round(faction.power * 0.7);
        faction.desc =
          (faction.desc || '') +
          ' Under occupation, several noble families have made private accommodations with the new authority. Others have not, and are watched.';
      }
    });
    factions.push({
      faction: 'Occupation Authority',
      power: 20,
      desc: 'External administrative body; all significant decisions require approval or reversal. Locally hated. Their actual power depends on how many soldiers they have here, which varies.',
    });
    factions.push({
      faction: 'Resistance Network',
      power: 8,
      desc: 'Distributed cells operating through existing social structures; no formal hierarchy. Currently cautious.',
    });
  }

  // --- politically_fractured: weaken governance, strengthen nobles, add two rival blocs ---
  if (hasStress('politically_fractured')) {
    factions.forEach((faction) => {
      if (faction.isGoverning) {
        faction.power = Math.round(faction.power * 0.4);
        faction.modifiers = [...(faction.modifiers || []), 'contested'];
      }
      if (faction.faction === 'Noble Families' || faction.faction === 'Noble Houses' || faction.faction === 'Landed Gentry') {
        faction.power = Math.round(faction.power * 1.4);
      }
    });
    const isRoyal = powerStructure && powerStructure.includes('Royal Authority');
    factions.push({
      faction: isRoyal ? 'Loyalist Noble Bloc' : 'Rival Faction B',
      power: 20,
      desc: isRoyal
        ? 'Noble houses backing the current crown line; their support is conditional on continued royal favour and land grants.'
        : 'Claims legitimate authority through different means; controls a distinct district or institution.',
    });
    factions.push({
      faction: isRoyal ? 'Reform Noble Bloc' : 'Third Bloc (Neutrals)',
      power: 15,
      desc: isRoyal
        ? 'Noble houses that want a renegotiation of feudal obligations; not openly rebellious, but not cooperative.'
        : 'Would support stability if a price can be agreed. Currently being courted by both sides.',
    });
  }

  // --- indebted: add a creditor faction, strengthen merchants and crown-debt nobles ---
  if (hasStress('indebted')) {
    const crownCreditors = powerStructure && powerStructure.includes('Royal Authority') && hasNobility;
    factions.push({
      faction: crownCreditors ? 'Crown Creditors (Noble Coalition)' : "Creditor's Representative",
      power: crownCreditors ? 22 : 18,
      desc: crownCreditors
        ? "A coalition of noble houses that hold the crown's debt. They are owed money, military obligations, and political appointments. They are in no hurry to be repaid."
        : 'Resident agent of the external creditor; formally an observer, in practice a veto on fiscal decisions.',
    });
    factions.forEach((faction) => {
      const name = faction.faction.toLowerCase();
      if (name.includes('merchant') || name.includes('guild')) {
        faction.power = Math.round(faction.power * 1.3);
      }
      if (
        powerStructure &&
        powerStructure.includes('Royal Authority') &&
        (faction.faction === 'Noble Families' || faction.faction === 'Noble Houses')
      ) {
        faction.power = Math.round(faction.power * 1.5);
        faction.desc = (faction.desc || '') + ' Several of these houses hold crown debt and are positioning accordingly.';
      }
    });
  }

  // --- recently_betrayed: add an investigation faction, weaken governance ---
  if (hasStress('recently_betrayed')) {
    factions.push({
      faction: 'Investigation Faction',
      power: 12,
      desc: 'Informal coalition demanding answers; politically inconvenient to governance; growing.',
    });
    factions.forEach((faction) => {
      if (faction.isGoverning) {
        faction.power = Math.round(faction.power * 0.7);
      }
    });
  }

  // --- infiltrated: add a hidden external faction ---
  if (hasStress('infiltrated')) {
    factions.push({
      faction: 'Unknown Faction (hidden)',
      power: 15,
      desc: 'An external interest with embedded assets in at least two factions. Its presence is not known to the settlement.',
    });
  }

  // --- succession_void: weaken governance, empower nobles, add two claimant blocs ---
  if (hasStress('succession_void')) {
    factions.forEach((faction) => {
      if (faction.isGoverning) {
        faction.power = Math.round(faction.power * 0.5);
        faction.modifiers = [...(faction.modifiers || []), 'vacant'];
      }
      if (
        faction.faction === 'Noble Families' ||
        faction.faction === 'Noble Houses' ||
        faction.faction === 'Landed Gentry' ||
        faction.faction === 'Manor Household'
      ) {
        faction.power = Math.round(faction.power * 1.8);
        faction.desc =
          (faction.desc || '') +
          ' The succession crisis has transformed latent noble power into active leverage. Every claimant needs their backing.';
      }
    });
    const isRoyal = powerStructure && powerStructure.includes('Royal Authority');
    factions.push({
      faction: isRoyal ? 'Noble Claimant (Senior Line)' : 'Claimant Bloc A',
      power: isRoyal ? 22 : 18,
      desc: isRoyal
        ? 'A noble house with a plausible hereditary claim; controls several key military levies. Legally strongest. Not universally liked.'
        : 'Hereditary or institutional claim; has legal arguments; lacks popular support.',
    });
    factions.push({
      faction: isRoyal ? 'Noble Claimant (Reform Faction)' : 'Claimant Bloc B',
      power: isRoyal ? 17 : 15,
      desc: isRoyal
        ? 'A rival noble house backed by popular sentiment and merchant capital; weaker bloodline claim but stronger coalition. Moving fast.'
        : 'Popular support; questionable legitimacy; moving fast.',
    });
  }
  // --- famine: add Grain Holders, strengthen religious factions ---
  if (hasStress('famine')) {
    factions.push({
      faction: 'Grain Holders',
      power: 20,
      desc: 'Whoever controls the remaining food reserves holds more real power than any formal authority.',
    });
    factions.forEach((faction) => {
      if (faction.faction.toLowerCase().includes('religious')) {
        faction.power = Math.round(faction.power * 1.4);
      }
    });
  }

  // --- plague_onset: add Quarantine Council, boost clergy, weaken commerce ---
  if (hasStress('plague_onset')) {
    factions.push({
      faction: 'Quarantine Council',
      power: 15,
      desc: 'Healers, clerics, and pragmatists with emergency health powers. Unpopular. Probably right.',
    });
    factions.forEach((faction) => {
      const name = faction.faction.toLowerCase();
      if (name.includes('religious')) {
        faction.power = Math.round(faction.power * 1.5);
      }
      if (name.includes('merchant') || name.includes('trade')) {
        faction.power = Math.round(faction.power * 0.7);
      }
    });
  }

  // --- monster_pressure: strengthen the armed factions, add adventurers ---
  if (hasStress('monster_pressure')) {
    factions.forEach((faction) => {
      const name = faction.faction.toLowerCase();
      if (name.includes('military') || name.includes('guard')) {
        faction.power = Math.round(faction.power * 1.6);
      }
    });
    factions.push({
      faction: 'Monster Hunters / Adventurers',
      power: 10,
      desc: 'Outside professionals brought in or passing through; temporarily powerful because they are useful.',
    });
  }
  // --- insurgency: weaken governance, empower crime/clergy, add a reform bloc.
  // The bloc is a popular movement when crime out-muscles a weak economy,
  // otherwise an elite opposition. ---
  if (hasStress('insurgency')) {
    const instFlags = typeof getInstFlags == 'function' ? getInstFlags(config || {}, institutions || []) : {};
    const crimeDominant =
      (instFlags.criminalEffective || 0) > (instFlags.militaryEffective || 0) && (instFlags.economyOutput || 50) < 48;
    factions.forEach((faction) => {
      const name = faction.faction.toLowerCase();
      if (faction.isGoverning) {
        faction.power = Math.round(faction.power * 0.72);
        faction.modifiers = [...(faction.modifiers || []), 'contested legitimacy'];
      }
      if (
        faction.category === 'criminal' ||
        name.includes('thieves') ||
        name.includes('organized crime') ||
        name.includes('criminal')
      ) {
        faction.power = Math.round(faction.power * 1.3);
      }
      if (name.includes('religious') || name.includes('church')) {
        faction.power = Math.round(faction.power * 1.15);
        faction.desc =
          (faction.desc || '') + ' Currently under pressure from both sides to publicly endorse the legitimate authority.';
      }
    });
    const blocName = crimeDominant
      ? powerStructure && powerStructure.includes('Royal Authority')
        ? "Commons' Reform Assembly"
        : powerStructure && powerStructure.includes('Merchant')
          ? "Journeymen's League"
          : "People's Council"
      : powerStructure && powerStructure.includes('Royal Authority')
        ? 'Loyalist Noble Opposition'
        : powerStructure && powerStructure.includes('Feudal')
          ? "Reform Stewards' Coalition"
          : 'Reformist Faction';
    factions.push({
      faction: blocName,
      power: crimeDominant ? 18 : 22,
      desc: crimeDominant
        ? "Organised common-population movement challenging the governing authority's legitimacy. Growing quickly. No unified leadership yet, which makes negotiation impossible."
        : 'Elite faction that has concluded the current governing arrangement is no longer viable. Pursuing institutional change through strategic non-cooperation, coalition-building, and selective pressure.',
    });
  }
  // --- mass_migration: a healthy economy attracts newcomers; a weak one
  // sheds population through an organised departure committee. ---
  if (hasStress('mass_migration')) {
    const economyOutput =
      (typeof getInstFlags == 'function' ? getInstFlags(config || {}, institutions || []) : {}).economyOutput || 50;
    if (economyOutput >= 50) {
      // Immigration: newcomers organise, charities gain standing, guilds feel threatened.
      factions.push({
        faction: "Newcomers' Settlement",
        power: 12,
        desc: 'The incoming population has begun self-organising: informal leadership, mutual aid networks, collective negotiation with landlords and employers. Not yet a formal political force, but cohesive enough to matter.',
      });
      factions.forEach((faction) => {
        const name = faction.faction.toLowerCase();
        if (name.includes('religious') || name.includes('church') || name.includes('monastery')) {
          faction.power = Math.round(faction.power * 1.3);
          faction.desc =
            (faction.desc || '') +
            " The institution's charitable work among new arrivals has dramatically expanded its community standing.";
        }
        if (name.includes('craft') || name.includes('guild')) {
          faction.power = Math.round(faction.power * 0.85);
          faction.desc =
            (faction.desc || '') +
            ' The arrival of skilled workers outside guild structures is an existential concern being discussed at every chapter meeting.';
        }
      });
    } else {
      // Emigration: a departure committee forms and governance is weakened.
      factions.push({
        faction: 'Departure Committee',
        power: 8,
        desc: "Informal group coordinating group departures, selling assets, and managing the logistics of relocation. Their existence is a public statement about the settlement's prospects.",
      });
      factions.forEach((faction) => {
        if (faction.isGoverning) {
          faction.power = Math.round(faction.power * 0.85);
          faction.desc =
            (faction.desc || '') + ' Managing the emigration crisis while maintaining the appearance that it is not a crisis.';
        }
      });
    }
  }
  // --- wartime: elevate the armed factions, split commerce by how the war is
  // going, add a War Council, and a Peace Faction only when the war goes badly. ---
  if (hasStress('wartime')) {
    const instFlags = typeof getInstFlags == 'function' ? getInstFlags(config || {}, institutions || []) : {};
    const warGoingWell = (instFlags.militaryEffective || 50) >= 55 && (instFlags.economyOutput || 50) >= 45;
    factions.forEach((faction) => {
      const name = faction.faction.toLowerCase();
      if (name.includes('military') || name.includes('guard') || name.includes('garrison')) {
        faction.power = Math.round(faction.power * 1.5);
        faction.desc =
          (faction.desc || '') +
          ' Wartime has transformed this faction from a civic institution into a primary power centre. Crown authority flows through military channels now.';
      }
      if (name.includes('merchant') || name.includes('guild')) {
        if (warGoingWell) {
          faction.power = Math.round(faction.power * 1.2);
          faction.desc =
            (faction.desc || '') +
            ' War contracts have made the well-connected wealthy. The faction is divided between those profiting and those whose trade routes are severed.';
        } else {
          faction.power = Math.round(faction.power * 0.8);
          faction.desc =
            (faction.desc || '') +
            ' Trade disruption and requisition are hurting the bottom line. The faction is lobbying for compensation and receiving promises.';
        }
      }
      if (name.includes('religious') || name.includes('church')) {
        faction.power = Math.round(faction.power * 1.2);
        faction.desc =
          (faction.desc || '') +
          " The pastoral burden of wartime (soldiers praying before departure, families grieving) has made the institution indispensable in a way it wasn't before.";
      }
    });
    factions.push({
      faction: 'War Council',
      power: warGoingWell ? 20 : 25,
      desc: warGoingWell
        ? "Crown-appointed emergency body coordinating supply, conscription, and military contracting. Currently functioning smoothly. The war is going well enough that its authority isn't contested."
        : 'Crown-appointed emergency body with powers over requisition, conscription, and price controls. Unpopular. Accused of favouritism in contract awards. Probably correct on the military decisions.',
    });
    if (!warGoingWell) {
      factions.push({
        faction: 'Peace Faction',
        power: 10,
        desc: 'Merchants, clergy, and common voices arguing that the cost of continued war exceeds any achievable gain. Not traitors but pragmatists. Growing.',
      });
    }
  }
  // --- religious_conversion: weaken the old faith, add one of three conversion
  // outcomes. The variant is derived from the governing faction's name when one
  // exists, otherwise drawn from the rng (this is the ONLY rng draw here, and it
  // must stay gated behind the no-governing-faction branch for determinism). ---
  if (hasStress('religious_conversion')) {
    const governingName =
      (factions.find((faction) => faction.isGoverning) || {}).faction || null;
    const conversionVariant = governingName ? governingName.length % 3 : Math.floor(_rng() * 3);
    factions.forEach((faction) => {
      const name = faction.faction.toLowerCase();
      if (name.includes('religious') || name.includes('church') || name.includes('clergy') || name.includes('temple')) {
        faction.power = Math.round(faction.power * (conversionVariant === 2 ? 0.5 : 0.7));
        faction.modifiers = [...(faction.modifiers || []), 'contested legitimacy'];
        faction.desc =
          (faction.desc || '') +
          (conversionVariant === 0
            ? ' Losing congregation to the new faith faster than leadership acknowledges publicly.'
            : conversionVariant === 1
              ? ' One of two competing factions claiming the legitimate succession. Legal standing of their records is contested.'
              : ' Formally compliant with the conversion order. Actual compliance among the congregation is harder to assess.');
      }
      if (faction.isGoverning) {
        faction.power = Math.round(faction.power * 0.88);
        faction.desc =
          (faction.desc || '') +
          ' Under pressure from both religious factions to make a formal declaration of support. Has so far avoided doing so.';
      }
      if (
        faction.category === 'criminal' ||
        name.includes('thieves') ||
        name.includes('organized crime') ||
        name.includes('criminal')
      ) {
        faction.power = Math.round(faction.power * 1.25);
      }
    });
    if (conversionVariant === 0) {
      factions.push({
        faction: 'New Faith Community',
        power: 14,
        desc: 'Growing movement without formal institutions: meeting in homes, sharing resources, organising mutual aid. Politically naive but numerically significant and increasingly confident.',
      });
    } else if (conversionVariant === 1) {
      factions.push({
        faction: 'Reform Congregation',
        power: 16,
        desc: 'The breakaway faction in the religious schism. Claims doctrinal legitimacy and holds parallel services. Legal standing of its records and sacraments is disputed by the established institution.',
      });
    } else {
      factions.push({
        faction: 'Conversion Enforcement Office',
        power: 18,
        desc: 'External or crown-appointed body with authority to verify compliance with the conversion order. Uses informants. Its definition of compliance is stricter than the governing faction anticipated.',
      });
      factions.push({
        faction: 'Underground Old Faith',
        power: 7,
        desc: "Not officially a faction. Officially it doesn't exist. In practice it is the most cohesive social network in the settlement. Its membership overlaps with several other factions in ways nobody discusses.",
      });
    }
  }
  // --- slave_revolt: weaken governance/commerce, deploy the military, boost
  // clergy, and add organised revolt + abolitionist factions ---
  if (hasStress('slave_revolt')) {
    factions.forEach((faction) => {
      const name = faction.faction.toLowerCase();
      if (faction.isGoverning) {
        faction.power = Math.round(faction.power * 0.65);
        faction.modifiers = [...(faction.modifiers || []), 'authority contested'];
        faction.desc =
          (faction.desc || '') +
          ' Managing an active slave revolt. The public posture is control, the private reality is containment at best.';
      }
      if (name.includes('military') || name.includes('guard') || name.includes('garrison')) {
        faction.power = Math.round(faction.power * 1.5);
        faction.desc =
          (faction.desc || '') +
          ' Fully deployed for containment. Soldiers are being asked to do things that will complicate their relationship with the civilian population.';
      }
      if (name.includes('merchant') || name.includes('guild')) {
        faction.power = Math.round(faction.power * 0.85);
        faction.desc =
          (faction.desc || '') +
          ' The revolt has disrupted labour supply and market operations. The faction is divided between those demanding immediate suppression and those quietly calculating whether a negotiated settlement might be cheaper.';
      }
      if (name.includes('religious') || name.includes('church')) {
        faction.power = Math.round(faction.power * 1.2);
        faction.desc =
          (faction.desc || '') +
          ' Under pressure from both sides to publicly declare the revolt either just or sacrilegious. Has so far avoided a direct statement.';
      }
    });
    factions.push({
      faction: 'Revolt Leadership',
      power: 18,
      desc: 'Organised leadership of the enslaved population: distributed, resilient, and holding territory. Has demands. Has not yet committed to whether those demands are negotiable.',
    });
    factions.push({
      faction: 'Abolitionist Network',
      power: 7,
      desc: 'Free citizens, clergy, and outside agitators who have been supporting the revolt covertly: shelter, information, supplies. Their involvement is not yet public.',
    });
  }
};

// deriveStability — collapse the crisis/stress/economy signals into a single
// public stability label (e.g. "Tense (external threat)").
const deriveStability = (stressFlags, instFlags, tradeRoute, hasStress, monsterThreat) => {
    let stability;
    (stressFlags.stateCrime
      ? (stability = 'Enforced Order (authoritarian)')
      : stressFlags.crimeIsGovt
        ? (stability = 'Unstable (criminal governance)')
        : stressFlags.crusaderSynthesis
          ? (stability = 'Rigid (militant theocracy)')
          : stressFlags.merchantArmy
            ? (stability = 'Fragile (private security, no public law)')
            : instFlags.criminalEffective > 75 && instFlags.militaryEffective < instFlags.criminalEffective - 8
              ? (stability = 'Unstable (pervasive organized crime)')
              : instFlags.militaryEffective > 70 && instFlags.economyOutput < 32
                ? (stability = 'Tense (militarised, chronically underfunded)')
                : stressFlags.theocraticEconomy
                  ? (stability = 'Stable (theocratic governance)')
                  : (tradeRoute == null ? void 0 : tradeRoute.relationshipType) === 'Hostile rival' ||
                      (tradeRoute == null ? void 0 : tradeRoute.relationshipType) === 'hostile_rival' ||
                      (tradeRoute == null ? void 0 : tradeRoute.relationshipType) === 'cold_war' ||
                      (tradeRoute == null ? void 0 : tradeRoute.relationshipType) === 'Cold war' ||
                      (tradeRoute == null ? void 0 : tradeRoute.relationshipType) === 'tense'
                    ? (stability = 'Tense (external threat)')
                    : instFlags.economyOutput > 68 && instFlags.militaryEffective < 30
                      ? (stability = 'Vulnerable (prosperous but underdefended)')
                      : instFlags.militaryEffective > 68
                        ? (stability = 'Ordered (strong military presence)')
                        : (stability = 'Stable'),
      hasStress('under_siege')
        ? (stability = 'Critical (active siege, survival priority)')
        : hasStress('occupied')
          ? (stability = 'Suppressed (under occupation, resistance simmers)')
          : hasStress('politically_fractured')
            ? (stability = 'Fractured (no stable governing authority)')
            : hasStress('recently_betrayed')
              ? (stability = 'Shaken (institutional trust collapsed)')
              : hasStress('famine')
                ? (stability = 'Desperate (hunger is eroding order)')
                : hasStress('plague_onset')
                  ? (stability = 'Anxious (disease is overriding normal authority)')
                  : hasStress('succession_void')
                    ? (stability = 'Volatile (power is available to whoever moves first)')
                    : hasStress('infiltrated')
                      // Intentional no-op: 'infiltrated' stressor doesn't override
                      // the public-tone label set by prior cases. Wrapped as an
                      // explicit identity to keep the ternary chain consistent.
                      // eslint-disable-next-line no-self-assign
                      ? (stability = stability)
                      : hasStress('indebted')
                        ? stability.includes('Unstable') || (stability = 'Strained (debt obligations constrain every decision)')
                        : hasStress('monster_pressure') &&
                          (stability.toLowerCase().includes('tense') ||
                            (stability = 'Tense (monster pressure from surrounding region)')),
      // Canonical threat vocabulary is heartland/frontier/plagued — the old
      // 'embattled'/'high' literals were never emitted, so a plagued settlement
      // never received its monster-threat governance annotation.
      monsterThreat === 'plagued' &&
        (stability = [
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
        ].some((N) => stability.toLowerCase().includes(N))
          ? stability + '; monster threat active'
          : 'Tense (regional monster threat)'));
  return stability;
};

// deriveRecentConflict — choose the single "recent conflict" vignette that best
// fits the active stress flags, institution presence, and economic posture.
const deriveRecentConflict = (stressFlags, instFlags, priorities, tradeRoute, config, instPresence) => {
  let conflict;
  const {
    hasMilitaryInst,
    hasMerchantHouse,
    hasArcaneInst,
    hasCivicHall,
    hasMarketTrade,
    hasReligiousInst,
    isRoyalAuthority,
    hasNobleBloc,
  } = instPresence;
    stressFlags.stateCrime
      ? (conflict = hasMilitaryInst
          ? 'Several households disappeared following a tax audit. The garrison commander has not been available for comment.'
          : 'Several households stopped paying what they owe. The person collecting those payments has not been seen since.')
      : stressFlags.crimeIsGovt
        ? (conflict =
            hasMerchantHouse || hasCivicHall
              ? 'The guild and the district council both claim authority over the new market. Violence has settled some of the disputes; more is expected.'
              : 'Two of the stronger families have been resolving disputes between themselves rather than involving the elders. The rest of the community is watching nervously.')
        : stressFlags.crusaderSynthesis
          ? (conflict = hasMilitaryInst
              ? 'The commander-prelate has declared a heresy investigation into a rival settlement. The garrison is mobilizing.'
              : 'The local priest has declared a neighbouring settlement heretical. Relations between the two communities have broken down entirely.')
          : stressFlags.merchantArmy
            ? (conflict =
                hasMerchantHouse && hasMilitaryInst
                  ? "A guild's private soldiers arrested a rival's factor. The public watch is refusing to intervene in what they call a 'merchant matter'."
                  : "One household's hired hands roughed up a rival's farmhand over a grazing dispute. Neither side will involve the elders.")
            : stressFlags.heresySuppression
              ? (conflict = hasArcaneInst
                  ? "A hedge wizard was dragged before the ecclesiastical court. The mages' quarter is very quiet at the moment."
                  : hasReligiousInst && hasCivicHall
                    ? 'The priest has summoned someone before the church court. The village is divided on whether they deserved it.'
                    : "The priest has been asking questions about a local family's practices. The family has become very quiet.")
              : stressFlags.merchantCriminalBlur
                ? (conflict = hasMerchantHouse
                    ? "Two guild masters are having each other's warehouses robbed. Both deny it publicly. Both are losing patience."
                    : "Two households have been undercutting each other on market day for months. Last week someone's cart was damaged. No one saw anything.")
                : tradeRoute
                  ? (conflict = `Ongoing tensions with ${tradeRoute.neighborName}`)
                  : instFlags.criminalEffective > 65
                    ? (conflict =
                        hasMilitaryInst || hasCivicHall
                          ? 'Crime rates are rising; several merchants have been found murdered, and the guard is being accused of inaction.'
                          : 'Someone has been stealing from the communal stores. Everyone suspects someone. No one is saying anything.')
                    : isRoyalAuthority && hasNobleBloc && priorities.military > 55
                      ? (conflict =
                          priorities.economy < 40
                            ? 'The crown has called in military levies from the noble houses. Two houses have complied. One has not, and has not explained why.'
                            : priorities.military > 70
                              ? 'A noble house has begun recruiting its own soldiers beyond its traditional levy obligation. The crown has noticed and has not yet decided what to say about it.'
                              : "The crown's relationship with the noble houses is transactional and increasingly strained. The last royal directive was delayed six weeks while passing through noble intermediaries.")
                      : hasNobleBloc && instFlags.economyOutput > 55
                        ? (conflict =
                            priorities.economy > 65
                              ? 'The merchant class is outbuying noble landholdings. Three estates have changed hands in the last decade. The families that lost them have not forgotten.'
                              : "A noble family is contesting a merchant's right to operate in their traditional market territory. The council is hearing the case and wishes it were not.")
                        : instFlags.militaryEffective > 68
                          ? (conflict = hasMilitaryInst
                              ? 'The military commanders are pushing for expanded authority over civilian courts, and the council is losing ground.'
                              : hasCivicHall
                                ? 'The village militia captain is pushing for authority over disputes that the reeve used to handle.'
                                : "The strongest armed household has started making decisions on everyone's behalf without asking.")
                          : instFlags.religionInfluence > 68
                            ? (conflict = hasCivicHall
                                ? 'The church is demanding veto power over council appointments. The council has not yet refused publicly.'
                                : hasReligiousInst
                                  ? 'The church wants approval rights over market day activities. The village reeve disagrees.'
                                  : 'The priest has been insisting on a say in who can marry whom and what gets planted when. Several families are unhappy.')
                            : instFlags.economyOutput > 68
                              ? (conflict = hasMerchantHouse
                                  ? 'Two rival guilds are contesting control of the main trade route. Neither side will back down and the council is avoiding the question.'
                                  : hasMarketTrade
                                    ? 'The miller and the largest farming household are in dispute over prices and access.'
                                    : 'The household that sells the most at market has been throwing its weight around in community decisions.')
                              : (config == null ? void 0 : config.monsterThreat) === 'plagued'
                                ? (conflict = hasMilitaryInst
                                    ? 'A monster incursion last season destroyed outlying farms. The garrison is stretched thin and the council cannot agree on whether to raise a levy or hire mercenaries.'
                                    : hasCivicHall
                                      ? 'Monster attacks on the outlying farms have not stopped. The village is debating whether to build proper defences or petition the nearest lord for help.'
                                      : 'Farms nearby have been abandoned after attacks. The community cannot agree on whether to shelter in place, build defences, or leave.')
                                : (conflict =
                                    hasCivicHall || hasMerchantHouse
                                      ? 'The council has been debating market levies for three months. The merchants have stopped attending the sessions. Both sides are now acting as if the other has already lost.'
                                      : hasMarketTrade
                                        ? 'A dispute over field rotation and grazing rights has divided the village for most of this season.'
                                        : 'A dispute over grazing rights and water access has been running for two seasons. It has stopped being about grazing rights and water access.');
  return conflict;
};

// buildStressNarratives — the per-stress-type "current crisis" vignette map,
// keyed by stress id; values bake in institution presence and governing name.
const buildStressNarratives = (ctx) => {
  const {
    instNames,
    instFlags,
    hasMilitaryInst,
    hasCivicHall,
    hasMarketTrade,
    hasMerchantHouse,
    isRoyalAuthority,
    hasNobleBloc,
    governingName,
    militaryLabel,
    recentConflict,
  } = ctx;
  return {
      under_siege:
        'The settlement is under active siege. Every resource decision is a military decision. The debate is no longer about policy. It is about survival.',
      famine:
        hasMilitaryInst || hasCivicHall || hasMarketTrade
          ? 'Food shortages have sharpened every tension in the settlement. Those with stocks are not advertising the fact. Those without are watching those with.'
          : 'The last harvest failed badly. What remains is being rationed by whoever holds the stores. Neighbours who shared meals last winter are watching each other carefully.',
      occupied:
        'An occupying officer arrested a local elder for "seditious speech". ' +
        governingName +
        ' filed a formal protest. The protest was returned unread.',
      politically_fractured:
        hasCivicHall || hasMilitaryInst || hasMerchantHouse
          ? 'Two of the three factions are no longer attending joint council meetings. Decisions are being made unilaterally and contradicted by rivals within days.'
          : 'The community is split. Two households are not speaking to each other or to anyone who sides with the other. Everything requiring collective decision has stopped.',
      indebted:
        isRoyalAuthority && hasNobleBloc
          ? "The crown's debt to the noble houses has become structural. Three major policy decisions this year were reversed after private meetings with creditor lords. No one publicly acknowledges the connection."
          : "The creditor's representative blocked the infrastructure repair budget. Publicly they cited fiscal responsibility. Privately they cited a clause in the debt agreement.",
      recently_betrayed:
        isRoyalAuthority && hasNobleBloc
          ? 'A noble house passed intelligence to a rival power. The crown knows. The house denies it. The crown cannot yet afford to act. It needs their levies.'
          : hasCivicHall
            ? (function () {
                var N = [
                    'Elected Reeve',
                    'Feudal Appointee',
                    'Feudal Stewardship',
                    'Noble Governorship',
                    'Royal Authority',
                    'Household Council',
                  ],
                  ye = N.includes(governingName) ? 'within the office of the ' : 'inside ',
                  he = N.includes(governingName) ? governingName.toLowerCase() : governingName;
                return (
                  'The investigation into the betrayal has been obstructed twice. The obstruction came from ' +
                  ye +
                  he +
                  '. No one will say who.'
                );
              })()
            : 'Someone talked. Information that should have stayed inside the settlement reached an outside party. No one has admitted it. Everyone suspects someone.',
      infiltrated: recentConflict,
      plague_onset:
        'The quarantine has been imposed on the affected district. Compliance is partial. Two people who attempted to enforce it were assaulted.',
      succession_void: isRoyalAuthority
        ? hasNobleBloc
          ? 'Two noble houses are contesting the succession. Both have legal arguments. Both have soldiers. The settlement is watching which house the other noble families back, because that is what will decide it.'
          : 'The throne is vacant and the council of succession has deadlocked. Every faction that benefits from the current stalemate is quietly prolonging it.'
        : hasCivicHall
          ? 'Two candidates for the vacant position each held separate public assemblies on the same day. Both claimed the other was illegal.'
          : 'The elder who kept the peace is gone. No one has stepped forward to take that role. Small disputes that would have been settled quickly are now sitting open.',
      monster_pressure: hasMilitaryInst
        ? 'A farmstead three miles out was destroyed last night. The farmer and his family are unaccounted for. ' +
          militaryLabel +
          ' is not going out to look.'
        : 'A farmstead a short walk from here was destroyed last night. The family is gone. No one is going to look for them.',
      insurgency: (function () {
        return (instFlags.criminalEffective || 0) > (instFlags.militaryEffective || 0) &&
          (instFlags.economyOutput || 50) < 48
          ? "The commons no longer accept the authority's account of events. Inflammatory pamphlets are being distributed. Two guild masters refused to attend the last civic assembly. The governing faction has intelligence about cells meeting at night, but hasn't moved, because moving publicly would confirm what it officially denies."
          : 'The challenge to the governing faction is institutional, not popular. Key officials are slow-walking orders. Revenue is being collected but held rather than forwarded. ' +
              governingName +
              ' is conducting meetings with people who should not be meeting privately. The governing faction has noticed and is considering whether to act before the coalition is complete.';
      })(),
      wartime: (function () {
        return (instFlags.militaryEffective || 50) >= 55 && (instFlags.economyOutput || 50) >= 45
          ? 'The war is present here as money and absence. The garrison has doubled in size and is well-supplied. The crown is paying for this one. Contracts for grain, leather, and ironwork are flowing to anyone with the capacity to fill them. The men who left to fight have not returned, which is a grief that runs beneath the commerce. ' +
              governingName +
              ' is navigating the difference between what it can extract for the war effort and what the settlement can actually spare.'
          : 'The war is present here as scarcity and fear. Conscription has taken workers, not soldiers. The farms and workshops feel their absence. Supply caravans pass through on crown requisition and local needs come second. Prices have risen and will rise further. A crown officer arrived last week and left with a list of what will be requisitioned next month. The governing faction signed the order. There was no alternative that anyone could see.';
      })(),
      religious_conversion: (function () {
        const N = governingName ? governingName.length % 3 : 0;
        return N === 0
          ? 'The new faith does not yet have a building. It has kitchens, meeting rooms in private homes, and a preacher who travels a circuit. The old institution has the building, the records, the accumulated donations, and a congregation that is quietly redistributing itself. Neither party is ready to force a confrontation. Both are watching the numbers.'
          : N === 1
            ? 'The schism is now formal. Two priests, two congregations, two sets of records (births, deaths, marriages) that may or may not be recognised depending on which authority the other party acknowledges. ' +
              (governingName || 'The governing authority') +
              ' has not declared which succession is legitimate, which means every legal document dependent on religious sanction is in a grey zone.'
            : 'The conversion order came from ' +
              (governingName || 'outside authority') +
              ' and was formally acknowledged within the week. The speed of the formal compliance was remarkable. The depth of the actual compliance is a different question. The old faith does not hold services openly. It is not clear it has stopped holding them.';
      })(),
      mass_migration: (function () {
        return (instFlags.economyOutput || 50) >= 50
          ? 'The settlement is receiving more people than its infrastructure was built for. New arrivals come faster than housing, food, and employment can absorb them. The old residents and the new ones are not yet the same community. ' +
              governingName +
              ' is being asked to do something about it and cannot agree what that something is.'
          : 'Three families left this week. Two more last week. The departure is quiet and orderly, which makes it worse. The people leaving have thought it through. What remains is those who cannot leave, those who choose to stay, and institutions running on fewer people than they were designed for.';
      })(),
      slave_revolt: (function () {
        return (
          'The revolt began at ' +
          (instNames.some(function (he) {
            return he.includes('slave market');
          })
            ? 'the slave market'
            : "the settlement's labour system") +
          " and has not been contained. The security response has been slow, partly because no one in authority wanted to admit publicly how organised the resistance was. Buildings controlled by the revolt's leadership are marked. Movement in and out of certain districts is contested. The governing faction's official position is that this is being handled. Its private position involves considerably more urgency."
        );
      })(),
    };
};

// resolvePowerStructure — turn the detected governance form + dominant priority
// axis into the concrete power-structure label, structure modifier, and the
// small-settlement governance descriptor.
const resolvePowerStructure = (governanceForm, dominantAxis, dominantPriority, tier) => {
    let powerStructure,
      structureModifier = null;
    if (governanceForm) {
      const N =
          dominantPriority > 65
            ? {
                military: 'military-dominated',
                religion: 'theocratic-aligned',
                economy: 'commerce-driven',
                criminal: 'corruption-riddled',
                magic: 'arcane-advised',
              }[dominantAxis]
            : null,
        ye =
          [
            'Royal Authority',
            'Noble Governorship',
            'Feudal Stewardship',
            'Feudal Appointee',
            'Household Council',
            'Elder Council',
            'Elected Reeve',
          ].includes(governanceForm) ||
          (governanceForm === 'Merchant oligarchy' && dominantAxis === 'economy') ||
          (governanceForm === 'Merchant Guild Council' && dominantAxis === 'economy') ||
          (governanceForm === 'Guild Council' && dominantAxis === 'economy') ||
          (governanceForm === 'Democratic assembly' && dominantAxis === 'religion');
      if (governanceForm && (governanceForm === 'Town Council' || governanceForm === 'City Council' || governanceForm === 'Grand Council')) {
        const he = N
          ? {
              military:
                governanceForm === 'Grand Council'
                  ? 'Grand Military Council'
                  : governanceForm === 'City Council'
                    ? 'Military City Council'
                    : 'Military Council',
              religion:
                governanceForm === 'Grand Council'
                  ? 'High Theocratic Council'
                  : governanceForm === 'City Council'
                    ? 'Ecclesiastical Council'
                    : 'Church Council',
              economy:
                governanceForm === 'Grand Council'
                  ? 'Grand Merchant Senate'
                  : governanceForm === 'City Council'
                    ? 'Merchant City Council'
                    : 'Merchant Council',
              criminal:
                governanceForm === 'Grand Council'
                  ? 'Shadow Senate'
                  : governanceForm === 'City Council'
                    ? 'Corrupt City Council'
                    : dominantPriority > 72
                      ? 'Corrupt Council'
                      : 'Town Council',
              magic: governanceForm === 'Grand Council' ? 'Arcane Senate' : 'Arcane Council',
            }[dominantAxis]
          : null;
        powerStructure = (governanceForm === 'Town Council' || governanceForm === 'City Council' || governanceForm === 'Grand Council') && he ? he : governanceForm;
      } else powerStructure = governanceForm;
      structureModifier = N && !ye ? N : null;
    } else
      ['thorp', 'hamlet', 'village'].includes(tier)
        ? (powerStructure =
            (dominantPriority > 65 &&
              {
                military: "Headman's Authority",
                religion: 'Priestly Guidance',
                economy: 'Household Council',
                criminal: 'Elder Council',
                magic: 'Elder Council',
              }[dominantAxis]) ||
            'Elder Council')
        : tier === 'town'
          ? (powerStructure =
              dominantPriority > 65
                ? {
                    military: 'Military Council',
                    religion: 'Church Council',
                    economy: 'Merchant Council',
                    criminal: 'Corrupt Council',
                    magic: 'Arcane Council',
                  }[dominantAxis] || 'Town Council'
                : (dominantPriority > 55 &&
                    {
                      military: 'Military Council',
                      religion: 'Church Council',
                      economy: 'Merchant Council',
                      criminal: 'Corrupt Council',
                      magic: 'Arcane Council',
                    }[dominantAxis]) ||
                  'Town Mayor')
          : (powerStructure =
              tier === 'metropolis'
                ? dominantPriority > 65
                  ? {
                      military: 'Grand Military Council',
                      religion: 'High Theocratic Council',
                      economy: 'Grand Merchant Senate',
                      criminal: 'Shadow Senate',
                      magic: 'Arcane Senate',
                    }[dominantAxis] || 'Grand Council'
                  : (dominantPriority > 55 &&
                      {
                        military: 'Grand Council',
                        religion: 'Grand Council',
                        economy: 'Grand Council',
                        criminal: 'Grand Council',
                        magic: 'Grand Council',
                      }[dominantAxis]) ||
                    'Grand Council'
                : (tier === 'city' || tier === 'metropolis'
                      ? dominantPriority > 65
                        ? {
                            military: 'Military City Council',
                            religion: 'Ecclesiastical Council',
                            economy: 'Merchant City Council',
                            criminal: 'Corrupt City Council',
                            magic: 'Arcane Council',
                          }[dominantAxis] || 'City Council'
                        : (dominantPriority > 50 &&
                            {
                              military: 'City Council',
                              religion: 'City Council',
                              economy: 'City Council',
                              criminal: 'City Council',
                              magic: 'City Council',
                            }[dominantAxis]) ||
                          'City Council'
                      : dominantPriority > 65
                        ? {
                            military: 'Military Council',
                            religion: 'Church Council',
                            economy: 'Merchant Council',
                            criminal: 'Town Council',
                            magic: 'Arcane Council',
                          }[dominantAxis] || 'Town Council'
                        : (dominantPriority > 55 &&
                            {
                              military: 'Military Council',
                              religion: 'Church Council',
                              economy: 'Merchant Council',
                              criminal: 'Town Council',
                              magic: 'Arcane Council',
                            }[dominantAxis]) ||
                          'Town Council'));
    let governanceDescriptor = null;
    governanceForm ||
      (['thorp', 'hamlet', 'village'].includes(tier) && dominantPriority > 65
        ? (governanceDescriptor =
            {
              military: 'defended',
              religion: 'church-guided',
              economy: 'merchant-led',
              criminal: 'compromised',
              magic: 'mage-advised',
            }[dominantAxis] || null)
        : tier === 'town' &&
          dominantPriority > 55 &&
          dominantPriority <= 65 &&
          (governanceDescriptor =
            {
              military: 'garrison-backed',
              religion: 'church-guided',
              economy: 'commerce-driven',
              criminal: 'corruption-riddled',
              magic: 'arcane-advised',
            }[dominantAxis] || null));
  return { powerStructure, structureModifier, governanceDescriptor };
};

// pushBaseFactions — append the governing faction plus the standing power blocs
// (merchants, nobility, military, clergy, craft guilds, organised crime, arcane
// orders) that exist independently of any active stress. Mutates `factions`.
const pushBaseFactions = (factions, ctx) => {
  const {
    powerStructure,
    resolvedModifier,
    seatBase,
    priorityBonus,
    governingDescription,
    economyPower,
    militaryPower,
    religionPower,
    criminalPower,
    craftGuildPower,
    magicPower,
    tier,
    institutions,
    config,
    economicState,
    priorities,
    instFlags,
    nobleInfluence,
    hasNobility,
    instNamesLower,
    baseSeats,
  } = ctx;
    if (
      (factions.push({
        faction: powerStructure,
        modifier: resolvedModifier || null,
        power: seatBase + priorityBonus,
        desc: governingDescription,
        isGoverning: !0,
      }),
      economyPower > 5 &&
        !(tier === 'thorp' && economyPower < 12) &&
        (!['thorp', 'hamlet', 'village'].includes(tier) ||
          (institutions || []).some(function (N) {
            var ye = (N.name || '').toLowerCase();
            return ye.includes('market') || N.category === 'Economy';
          })))
    ) {
      const N =
          powerStructure &&
          (powerStructure.includes('Merchant oligarchy') || powerStructure.includes('Merchant Guild Council') || powerStructure.includes('Merchant Council')),
        he = Math.round(economyPower * (N ? 1.25 : 1)),
        De = ((config == null ? void 0 : config.tradeRouteAccess) || 'road') === 'port',
        Mi = ((config == null ? void 0 : config.tradeRouteAccess) || 'road') === 'crossroads',
        cr =
          N && he >= 12
            ? 'The ruling class and the merchant class are the same people; commercial decisions are political decisions and civic access is purchased.'
            : he >= 26
              ? De
                ? 'International merchant houses controlling port licences and import flows; their political leverage is structural, not merely financial.'
                : Mi
                  ? 'Dominant commercial class at a trade nexus; they set prices, control warehousing, and fund the council.'
                  : 'Dominant commercial class; their capital and networks give them leverage even formal institutions must respect.'
              : he >= 18
                ? De
                  ? 'Maritime traders and factor houses controlling import and export flows; prosperous, well-connected, and aware of both.'
                  : Mi
                    ? "Market merchants who profit from the settlement's position; buy from one direction, sell to another, lobby for both."
                    : 'Established merchant community; fund civic works and expect council access in return.'
                : he >= 10
                  ? 'Merchants with local reach; a consistent civic presence without yet being the dominant commercial voice.'
                  : 'A small trader community present at market days; politically active in minor disputes, limited in broader leverage.',
        bt =
          (economicState == null ? void 0 : economicState.prosperity) === 'Wealthy' ||
          (economicState == null ? void 0 : economicState.prosperity) === 'Thriving'
            ? 'Merchant Guilds (dominant)'
            : 'Merchant Guilds',
        tr = he,
        ft = (seatBase || baseSeats) + (priorityBonus || 0),
        Fr = bt.includes('dominant') ? Math.round(ft * 0.88) : 9999;
      factions.push({
        faction: bt,
        power: Math.min(tr, Fr),
        desc: cr,
      });
    }
    if (nobleInfluence > (tier === 'town' && !hasNobility ? 10 : 5)) {
      const N =
          powerStructure &&
          (powerStructure.includes('Feudal') ||
            powerStructure.includes('Noble') ||
            powerStructure.includes('Royal Authority') ||
            powerStructure.includes('Household Council')),
        ye =
          powerStructure &&
          (powerStructure.includes('Merchant oligarchy') ||
            powerStructure.includes('Democratic assembly') ||
            powerStructure.includes('Guild Council') ||
            powerStructure.includes('Merchant Guild Council')),
        he =
          tier === 'hamlet' || tier === 'village'
            ? 'Manor Household'
            : tier === 'town'
              ? 'Landed Gentry'
              : tier === 'metropolis'
                ? 'Noble Houses'
                : 'Noble Families',
        De =
          hasNobility && N
            ? priorityToCategory(priorities.military) === 'very_high'
              ? 'Hereditary landowners who are the governing authority here; military levies, land rents, and judicial rights all flow through noble title. Their word is law within their demesne.'
              : nobleInfluence > 20
                ? 'Hereditary landowners whose land rights and military obligations are structurally embedded in governance here; the council works alongside them, not over them.'
                : nobleInfluence > 10
                  ? 'Hereditary landowners with genuine but not dominant feudal claims; they shape decisions at the margins more than they command them.'
                  : 'Noble families with residual feudal claims; the formal obligations are real, but other factions set the practical agenda day to day.'
            : ye
              ? priorityToCategory(priorities.economy) === 'very_high'
                ? 'Old landed families being systematically displaced by merchant wealth; they retain hereditary title but little real leverage. A dangerous combination of pride and declining power.'
                : 'Landed families increasingly outpaced by merchant capital; they compete for council seats, marriage alliances, and royal appointments to maintain relevance.'
              : tier === 'hamlet' || tier === 'village'
                ? "The local lord's household; land rights and feudal obligation give them a formal claim to authority, though other factions hold more practical influence day to day."
                : hasNobility && powerStructure && powerStructure.includes('Royal Authority')
                  ? nobleInfluence > 25
                    ? "The great noble houses are the crown's military and fiscal foundation, and they know it. Royal policy is negotiated with them as much as decreed over them."
                    : nobleInfluence > 15
                      ? 'Hereditary landowners whose cooperation the crown depends on for levies, taxes, and regional order. Not powerful enough to dictate, but essential enough to court.'
                      : 'Noble families nominally loyal to the crown, but watching which way the political wind is blowing before committing resources.'
                  : priorityToCategory(priorities.military) === 'very_high'
                    ? "Militarised noble families whose landholdings double as fortified estates; they provide the settlement's heavy cavalry and expect political weight in return."
                    : nobleInfluence > 20
                      ? 'Landed noble families whose hereditary rights, land rents, and marriage networks give them structural influence the elected council cannot easily override.'
                      : nobleInfluence > 10
                        ? tier === 'metropolis'
                          ? 'Hereditary great families with land grants, court appointments, and dynastic marriage networks; structurally embedded in governance even when not formally in power.'
                          : tier === 'city'
                            ? 'Noble families with hereditary land rights and traditional privileges; active in civic politics and competitive with merchant capital.'
                            : 'Gentry families with local landholdings; active in civic politics but outpaced by merchant capital in raw financial leverage'
                        : 'Minor landed families with limited political reach; present in civic life but rarely decisive.';
      factions.push({
        faction: he,
        power: nobleInfluence,
        desc: De,
      });
    }
    if (militaryPower > 5 && (tier !== 'thorp' || priorities.military > 60)) {
      const N =
          priorityToCategory(priorities.military) === 'very_high'
            ? militaryPower > 25
              ? ['city', 'metropolis'].includes(tier)
                ? 'Standing army with genuine political weight; command appointments are patronage, and the council knows it.'
                : "Significant military force for this scale; the commander's opinion on civic matters carries institutional weight."
              : 'Significant military presence; officers hold political influence disproportionate to formal civic rank.'
            : priorityToCategory(priorities.military) === 'low'
              ? ['hamlet', 'village', 'thorp'].includes(tier)
                ? 'Part-time militia with limited organisation; authority is moral rather than institutional.'
                : 'Undermanned and underfunded; unable to enforce law consistently and aware of it.'
              : ['thorp', 'hamlet', 'village'].includes(tier)
                ? "Armed patrol and informal militia; the settlement's primary recourse when disputes turn physical."
                : tier === 'town'
                  ? 'Town watch and militia; enforce ordinances, manage disorder, and report to the council.'
                  : militaryPower > 18
                    ? 'Well-funded garrison and city watch; a reliable instrument of civic order with growing institutional confidence.'
                    : 'Garrison and city watch; law enforcement and external defence, stretched between multiple responsibilities.',
        he =
          powerStructure && (powerStructure.toLowerCase().includes('military council') || powerStructure.toLowerCase().includes('martial'))
            ? N +
              ' Operationally distinct from the command council. These are the soldiers and watchmen, not the officers who govern.'
            : N,
        De = powerStructure && powerStructure.includes('Merchant oligarchy') ? Math.round(economyPower * 0.85) : 9999;
      factions.push({
        faction: 'Military/Guard',
        power: Math.min(militaryPower, De),
        desc: he,
      });
    }
    const hasReligiousInstitution = instNamesLower.some(
        (N) =>
          !N.startsWith('access to') &&
          (N.includes('parish church') ||
            N.includes('cathedral') ||
            N.includes('monastery') ||
            N.includes('friary') ||
            N.includes('temple') ||
            N.includes('shrine') ||
            N.includes('priest (resident)') ||
            N.includes('graveyard'))
      ),
      religionEligible = ['village', 'town', 'city', 'metropolis'].includes(tier) || hasReligiousInstitution;
    if (religionPower > 5 && religionEligible) {
      const ye =
        priorities.criminal > 70 && priorities.religion < 35 && instFlags.criminalEffective > 60
          ? 'Clergy operate here but the church holds little civic authority; organised crime has crowded out most formal moral influence.'
          : powerStructure && powerStructure.includes('Theocratic Council')
            ? 'Religious law governs directly; clergy are administrators as much as priests, and doctrine shapes civic ordinance.'
            : powerStructure && powerStructure.includes('Church Council')
              ? 'Church authority is the formal source of governing legitimacy here; clergy hold both spiritual and temporal jurisdiction.'
              : religionPower > 24
                ? instNamesLower.some((he) => he.includes('cathedral') || he.includes('monastery'))
                  ? 'Church institutions hold direct temporal power; tithes, land, and courts are all ecclesiastical.'
                  : "Church holds substantial temporal power; tithes fund civic works and the clergy's opinion on appointments carries decisive weight."
                : religionPower > 17
                  ? ['city', 'metropolis'].includes(tier)
                    ? 'Major church institutions hold structural influence: land grants, hospital networks, and moral authority give them leverage across multiple civic domains.'
                    : ['hamlet', 'village'].includes(tier)
                      ? 'The parish priest is the most educated person for miles; moral authority and practical influence are inseparable at this scale.'
                      : 'Church institutions are well-embedded in civic life; their opinion on appointments, taxation, and law is sought and usually influential.'
                  : religionPower > 10
                    ? ['hamlet', 'village', 'thorp'].includes(tier)
                      ? 'The local clergy serve a real pastoral role; their moral authority has limited political reach but is genuinely respected.'
                      : 'Clergy and church institutions exercise meaningful civic influence through moral authority, land ownership, and popular trust.'
                    : 'Clergy are present but operate at the margins of civic life; their moral authority is real but their political leverage is limited.';
      factions.push({
        faction: 'Religious Authorities',
        power: religionPower,
        desc: ye,
      });
    }
    if (
      (craftGuildPower > 5 &&
        priorities.economy > 22 &&
        factions.push({
          faction: 'Craft Guilds',
          power: craftGuildPower,
          desc:
            craftGuildPower > 16
              ? ['city', 'metropolis'].includes(tier)
                ? 'Well-organised craft guilds with established trade monopolies; a persistent civic voice that merchant houses must negotiate with, not ignore.'
                : 'Craft masters controlling production standards and apprenticeships; present in every civic dispute over prices and supply.'
              : craftGuildPower > 10
                ? 'Craft guilds regulating production and apprenticeships; a reliable secondary presence in civic life.'
                : 'Artisan guilds maintaining standards in a thin economy; not politically weak by choice, but by circumstance.',
        }),
      criminalPower > 5)
    ) {
      const N =
        criminalPower > 22
          ? 'Underworld effectively controls vice, smuggling, and key officials; the nominal government tolerates this because it cannot currently change it.'
          : criminalPower > 16
            ? 'Criminal organisations have captured significant influence; corruption is systemic, not exceptional.'
            : criminalPower > 10
              ? 'Organised criminal network controls the black market and several informal revenue streams; present in council discussions through intermediaries.'
              : ['hamlet', 'village', 'thorp'].includes(tier)
                ? 'A local protection operation tolerated because the alternative is open conflict with people who know the terrain better.'
                : 'Criminal network operating in shadows; controls illicit trade and profits from the gap between law and enforcement.';
      factions.push({
        faction: "Organized Crime",
        power: criminalPower,
        desc: N,
      });
    }
    const arcanePower =
      powerStructure && powerStructure.includes('Arcane Council')
        ? Math.max(magicPower, Math.max(12, Math.round(14 * priorityToMultiplier(instFlags.magicInfluence))))
        : magicPower;
    arcanePower > 5 &&
      factions.push({
        faction: 'Arcane Orders',
        power: arcanePower,
        desc:
          arcanePower > 22
            ? 'Arcane institutions hold substantial political leverage here: contracts, security, and infrastructure all depend on magical services only they provide.'
            : arcanePower > 16
              ? 'Wizard towers and mage guilds hold genuine political weight; their services are structurally irreplaceable and they know it.'
              : arcanePower > 10
                ? 'Mages and arcane practitioners hold real influence through monopoly on magical services and the latent fear their capabilities inspire.'
                : 'Magical practitioners are consulted but not formally empowered. Their influence is advisory, transactional, and quietly resented.',
      });
};

// deriveProvisionalDefenseLabel — provisional defence posture from institution
// presence (walls/garrison/militia) used only for the legitimacy score; the
// authoritative defenseProfile is computed later by generateSettlement.
const deriveProvisionalDefenseLabel = (institutions, tier) => {
  const _hasWalls = (institutions || []).some(
    (i) =>
      (i.name || '').toLowerCase().includes('wall') ||
      (i.name || '').toLowerCase().includes('palisade') ||
      (i.name || '').toLowerCase().includes('citadel')
  );
  const _hasGarrison = (institutions || []).some((i) => (i.name || '').toLowerCase().includes('garrison'));
  const _hasMilitia = (institutions || []).some(
    (i) => (i.name || '').toLowerCase().includes('militia') || (i.name || '').toLowerCase().includes('watch')
  );
  return _hasWalls && _hasGarrison
    ? 'Well-Defended'
    : _hasWalls || _hasGarrison
      ? 'Defensible'
      : _hasMilitia
        ? 'Lightly Defended'
        : ['thorp', 'hamlet'].includes(tier)
          ? 'Vulnerable'
          : 'Undefended';
};

// deriveBasePowers — seat budget and raw influence weights for each standing
// power bloc, plus the nobility presence/scale flags, derived from tier,
// priorities, and institution flags (no RNG).
const deriveBasePowers = (tier, priorities, instFlags, institutions) => {
  const baseSeats = tier === 'metropolis' ? 35 : tier === 'city' ? 33 : tier === 'town' ? 31 : 30,
      economyPower = Math.round(25 * priorityToMultiplier(instFlags.economyOutput)),
      militaryPower = Math.round(23 * priorityToMultiplier(instFlags.militaryEffective)),
      religionPower = Math.round(22 * priorityToMultiplier(instFlags.religionInfluence)),
      criminalPower =
        instFlags.criminalEffective > 42 && (tier === 'city' || tier === 'metropolis' || instFlags.criminalEffective > 58)
          ? Math.round(12 * priorityToMultiplier(instFlags.criminalEffective))
          : 0,
      craftGuildPower =
        tier !== 'thorp' && tier !== 'hamlet'
          ? Math.round(17 * priorityToMultiplier(instFlags.economyOutput * 0.75 + 10))
          : 0,
      magicPower =
        instFlags.magicInfluence > 28 && (tier === 'city' || tier === 'metropolis')
          ? Math.round(14 * priorityToMultiplier(instFlags.magicInfluence))
          : instFlags.magicInfluence > 55 &&
              tier === 'town' &&
              (institutions || []).some(function (N) {
                var ye = (N.name || '').toLowerCase();
                return ye.includes('mage') || ye.includes('wizard') || ye.includes('alchemist') || ye.includes('arcane');
              })
            ? Math.round(9 * priorityToMultiplier(instFlags.magicInfluence))
            : 0,
      hasNobility = (institutions || []).some((N) => {
        var ye = (N.name || '').toLowerCase();
        return (
          ye.includes('lord') ||
          ye.includes('noble') ||
          ye.includes('manor') ||
          ye.includes('royal seat') ||
          ye.includes('feudal')
        );
      }),
      mercantileLean = priorities.economy > 70 && !hasNobility,
      hasRoyalSeat = (institutions || []).some(function (N) {
        return (N.name || '').toLowerCase().includes('royal seat');
      }),
      nobleBaseSeats = Math.round(22 * priorityToMultiplier(instFlags.militaryEffective * 0.65 + instFlags.economyOutput * 0.1)),
      nobilityMultiplier = hasNobility ? (hasRoyalSeat ? 1.9 : 1.7) : 1,
      mercantileMultiplier = mercantileLean ? 0.55 : 1,
      townNobleMultiplier = tier === 'town' ? (hasNobility ? 1.15 : 0.85) : 1,
      nobleInfluence = tier === 'thorp' ? 0 : Math.round(tier === 'hamlet' || tier === 'village' ? nobleBaseSeats * nobilityMultiplier * mercantileMultiplier * 0.75 : nobleBaseSeats * nobilityMultiplier * mercantileMultiplier * townNobleMultiplier);
  return {
    baseSeats,
    economyPower,
    militaryPower,
    religionPower,
    criminalPower,
    craftGuildPower,
    magicPower,
    hasNobility,
    nobleInfluence,
  };
};

// deriveGoverningSeat — pick the governing description (with fall-throughs),
// the dominant-priority seat bonus, and the seat budget for the governing
// faction, plus the resolved structure modifier.
const deriveGoverningSeat = (governanceForm, powerStructure, dominantPriority, baseSeats, structureModifier, governanceDescriptor) => {
    const resolvedModifier = (typeof structureModifier < 'u' ? structureModifier : null) || governanceDescriptor,
      governanceDescriptions = {
        'Household Council':
          'Settlement governed by heads of household; decisions by informal consensus among property owners.',
        'Elder Council': 'Respected elders guide the community; authority is moral and traditional rather than formal.',
        'Elected Reeve': 'A reeve elected from the peasantry manages labour and mediates disputes under noble oversight.',
        'Feudal Stewardship':
          "A lord's steward administers the settlement; authority flows downward from the noble, not upward from residents.",
        'Feudal Appointee':
          'A lord-appointed official governs; all authority is delegated from above and revocable at will.',
        'Town Council':
          'An elected or appointed council governs; merchants, guilds, and prominent families compete for seats.',
        'City Council':
          'A full civic council governs the city; aldermen, guild representatives, and appointed officials manage taxation, law, and infrastructure at scale.',
        'Grand Council':
          'A grand council of senior officials, guild masters, and appointed magnates governs the metropolis; internal factions are constant, and real power shifts between blocs.',
        'Military City Council':
          'Military officers hold decisive influence over civilian governance; the council ratifies what the commanders decide.',
        'Ecclesiastical Council':
          'Senior clergy hold effective civic authority alongside elected aldermen; religious law shapes civil policy.',
        'Merchant City Council': 'Wealthy merchants dominate council seats; trade interests drive policy and taxation.',
        'Corrupt City Council':
          'Nominally elected, effectively purchased; council seats are openly traded among criminal and commercial interests.',
        'Ducal Governorship':
          'A duke or duchess governs the metropolis by royal appointment; the city is the administrative capital of a large territory.',
        'Grand Merchant Oligarchy':
          'The wealthiest merchant houses of the metropolis form a formal oligarchic senate; political power is inseparable from commercial dominance.',
        'Grand Guild Consortium':
          "A formal consortium of the metropolis's most powerful guild masters holds civic authority; membership in the consortium is itself a prize.",
        'Guild Authority':
          "The guilds have formalised their political control; the city's elected bodies are largely ceremonial.",
        'Military Council':
          'Military commanders and garrison officers hold decisive political weight; civic matters defer to security priorities.',
        'Church Council':
          'Religious authorities hold formal civic influence; canonical law and civil ordinance are intertwined.',
        'Merchant Council':
          'Prominent merchants dominate the council; trade and taxation policy favour commercial interests.',
        'Corrupt Council':
          'The governing body is systematically compromised; offices are sold and justice is purchasable.',
        'Arcane Council':
          'Mages and scholars hold formal civic positions; arcane expertise confers political legitimacy.',
        'Grand Merchant Senate':
          'A senate of the wealthiest merchant houses governs; political influence is measured in coin, trade concessions, and debt.',
        'Grand Military Council':
          'Military commanders and their political allies hold power; civilian governance is subordinate to the needs of the war machine.',
        'High Theocratic Council':
          'Senior clergy hold civic authority; religious law and civil law are functionally the same.',
        'Arcane Senate': 'A senate of senior mages governs; magical expertise confers political legitimacy.',
        'Shadow Senate': 'Nominal governance masks a criminal oligarchy; the real decisions happen in back rooms.',
        'Guild Council': 'The guilds collectively govern; economic power directly translates to political authority.',
        'Merchant Guild Council':
          'A consortium of guild masters holds power; policy is shaped by trade interests and inter-guild bargaining.',
        'Noble Governorship':
          'A noble governor rules by hereditary or royal appointment; the settlement has little self-governance.',
        'Merchant oligarchy':
          'Wealthy merchants hold exclusive power; political office is effectively purchased through commercial success.',
        'Democratic assembly':
          'An assembly of citizens votes on major decisions; factions lobby for influence rather than seizing control.',
        'City-State Council':
          'A city-state council governs with considerable autonomy; internal factions compete for control of policy.',
        'Royal Authority':
          'A royal seat concentrates formal authority at the apex of the realm. How much real power the monarch exercises depends on their strength, the loyalty of the nobility, and whether anyone is currently contesting that loyalty.',
      },
      ee = {
        'Military Council': 'Military commanders hold direct political authority; civic life is subordinate to defence.',
        'Theocratic Council': 'Religious leadership governs directly; doctrine shapes law and policy.',
        'Church Council': 'Clergy hold substantial political authority alongside civic governance.',
        'Merchant oligarchy':
          'Wealthy merchants hold exclusive power; office is effectively purchased through commercial success.',
        'Merchant Council': 'Merchant interests dominate the council; trade policy is the primary concern.',
        'Corrupt Oligarchy': 'Criminal networks have captured governance; official authority is a facade.',
        'Shadowed Council':
          'Criminal influence shapes decisions behind the scenes; officials are systematically compromised.',
        'Arcane Council': 'Magical practitioners govern; arcane power legitimises political authority.',
        'Mixed Council': 'Power is distributed across multiple factions without a clear dominant authority.',
        'Elder Council': 'Community elders guide decisions by consensus; authority is moral and traditional, not formal.',
        'Town Council':
          'An elected or appointed council governs; merchants, guilds, and prominent families compete for seats.',
      },
      governingDescription = governanceDescriptions[governanceForm] || ee[powerStructure] || ee['Mixed Council'],
      priorityBonus = dominantPriority > 80 ? 18 : dominantPriority > 65 ? 12 : dominantPriority > 50 ? 6 : 0,
      seatBase = [
        'Theocratic Council',
        'Military Council',
        'Arcane Council',
        'Royal Authority',
        'Merchant oligarchy',
        'Corrupt Oligarchy',
        'City-State Council',
      ].includes(powerStructure)
        ? baseSeats + 8
        : ['Feudal Stewardship', 'Feudal Appointee', 'Elder Council', 'Household Council', 'Elected Reeve'].includes(powerStructure)
          ? baseSeats - 4
          : baseSeats + 2;
  return { resolvedModifier, governingDescription, priorityBonus, seatBase };
};

// deriveInstitutionPresence — boolean presence flags for the major institution
// classes plus royal-authority / noble-bloc context, consumed by the conflict
// and stress-narrative builders.
const deriveInstitutionPresence = (instNames, powerStructure, hasNobility, factions) => {
    const hasMilitaryInst = instNames.some(function (N) {
        return (
          N.includes('garrison') ||
          N.includes('barracks') ||
          N.includes('militia') ||
          N.includes('watch') ||
          N.includes('guard') ||
          N.includes('mercenary')
        );
      }),
      hasMerchantHouse = instNames.some(function (N) {
        return (
          N.includes('guild') ||
          N.includes('market district') ||
          N.includes('merchant house') ||
          N.includes('trading company')
        );
      }),
      hasArcaneInst = instNames.some(function (N) {
        return N.includes('mage') || N.includes('wizard') || N.includes('arcane') || N.includes('alchemist');
      }),
      hasCivicHall = instNames.some(function (N) {
        return (
          N.includes('council') ||
          N.includes('court') ||
          N.includes('magistrate') ||
          N.includes('hall') ||
          N.includes('charter') ||
          N.includes('guild hall')
        );
      }),
      hasMarketTrade = instNames.some(function (N) {
        return N.includes('market') || N.includes('merchant') || N.includes('guild') || N.includes('trading');
      }),
      hasReligiousInst = instNames.some(function (N) {
        return (
          N.includes('church') ||
          N.includes('cathedral') ||
          N.includes('monastery') ||
          N.includes('temple') ||
          N.includes('parish') ||
          N.includes('shrine')
        );
      }),
      isRoyalAuthority = powerStructure && powerStructure.includes('Royal Authority'),
      hasNobleBloc =
        hasNobility ||
        factions.some(function (N) {
          return (
            N.faction === 'Noble Families' ||
            N.faction === 'Noble Houses' ||
            N.faction === 'Landed Gentry' ||
            N.faction === 'Manor Household'
          );
        });
  return {
    hasMilitaryInst,
    hasMerchantHouse,
    hasArcaneInst,
    hasCivicHall,
    hasMarketTrade,
    hasReligiousInst,
    isRoyalAuthority,
    hasNobleBloc,
  };
};

export const generatePowerStructure = (tier, economicState, tradeRoute, config, institutions = []) => {
  var governingFaction;
  const instNames = (institutions || []).map((N) => (N.name || '').toLowerCase()),
    priorities = getPriorities(config),
    instFlags = getInstFlags(config, institutions),
    stressFlags = getStressFlags(config, institutions),
    factions = /** @type {Array<any>} */ ([]);
  const {
    baseSeats,
    economyPower,
    militaryPower,
    religionPower,
    criminalPower,
    craftGuildPower,
    magicPower,
    hasNobility,
    nobleInfluence,
  } = deriveBasePowers(tier, priorities, instFlags, institutions);
  const instNamesLower = institutions.map((N) => (N.name || '').toLowerCase()),
    governanceLabelMap = {
      'head-of-household consensus': tier === 'hamlet' ? 'Elder Consensus' : 'Household Council',
      'informal elder consensus': tier === 'hamlet' ? 'Free Elder Council' : 'Elder Council',
      'village reeve': 'Elected Reeve',
      "lord's steward": 'Feudal Stewardship',
      "lord's appointee": 'Feudal Appointee',
      'mayor and council': tier === 'metropolis' ? 'Grand Council' : tier === 'city' ? 'City Council' : 'Town Council',
      'guild governance':
        tier === 'metropolis' ? 'Grand Guild Council' : tier === 'city' ? 'Guild Authority' : 'Guild Council',
      'guild consortium': tier === 'metropolis' ? 'Grand Guild Consortium' : 'Merchant Guild Council',
      'noble governor': tier === 'metropolis' ? 'Ducal Governorship' : 'Noble Governorship',
      'merchant oligarchy': tier === 'metropolis' ? 'Grand Merchant Oligarchy' : 'Merchant oligarchy',
      'democratic assembly': 'Democratic assembly',
      'city-state government': 'City-State Council',
      'royal seat': 'Royal Authority',
    };
  let governanceForm = null;
  for (const [N, ye] of Object.entries(governanceLabelMap))
    if (instNamesLower.some((he) => he.includes(N))) {
      governanceForm = ye;
      break;
    }
  const axisPriorities = {
      military: priorities.military,
      religion: priorities.religion,
      economy: priorities.economy,
      criminal: priorities.criminal,
      magic: priorities.magic,
    },
    dominantAxis = Object.entries(axisPriorities).reduce((N, ye) => (N[1] > ye[1] ? N : ye))[0],
    dominantPriority = axisPriorities[dominantAxis];
  const { powerStructure, structureModifier, governanceDescriptor } = resolvePowerStructure(
    governanceForm,
    dominantAxis,
    dominantPriority,
    tier
  );
  const { resolvedModifier, governingDescription, priorityBonus, seatBase } = deriveGoverningSeat(
    governanceForm,
    powerStructure,
    dominantPriority,
    baseSeats,
    structureModifier,
    governanceDescriptor
  );
  pushBaseFactions(factions, {
    powerStructure,
    resolvedModifier,
    seatBase,
    priorityBonus,
    governingDescription,
    economyPower,
    militaryPower,
    religionPower,
    criminalPower,
    craftGuildPower,
    magicPower,
    tier,
    institutions,
    config,
    economicState,
    priorities,
    instFlags,
    nobleInfluence,
    hasNobility,
    instNamesLower,
    baseSeats,
  });
  const stressType = (config == null ? void 0 : config.stressType) || null,
    stressTypes = (config == null ? void 0 : config.stressTypes) || (stressType ? [stressType] : []),
    hasStress = (N) => stressTypes.includes(N);
  applyStressFactionEffects(factions, hasStress, powerStructure, hasNobility, config, institutions);
  normalizeAndAnnotateFactions(factions);
  const Gt = (config == null ? void 0 : config.monsterThreat) || 'frontier';
  const Me = deriveStability(stressFlags, instFlags, tradeRoute, hasStress, Gt);
  let We;
  const {
    hasMilitaryInst,
    hasMerchantHouse,
    hasArcaneInst,
    hasCivicHall,
    hasMarketTrade,
    hasReligiousInst,
    isRoyalAuthority,
    hasNobleBloc,
  } = deriveInstitutionPresence(instNames, powerStructure, hasNobility, factions);
  We = deriveRecentConflict(stressFlags, instFlags, priorities, tradeRoute, config, {
    hasMilitaryInst,
    hasMerchantHouse,
    hasArcaneInst,
    hasCivicHall,
    hasMarketTrade,
    hasReligiousInst,
    isRoyalAuthority,
    hasNobleBloc,
  });
  const na = stressTypes.length
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
        ].find((N) => stressTypes.includes(N)) || stressTypes[0]
      : stressType,
    Ie = ((governingFaction = factions.find((N) => N.isGoverning)) == null ? void 0 : governingFaction.faction) || null,
    Na = instNames.some(function (N) {
      return N.includes('garrison');
    })
      ? 'The garrison'
      : instNames.some(function (N) {
            return N.includes('militia');
          })
        ? 'The militia'
        : instNames.some(function (N) {
              return N.includes('watch');
            })
          ? 'The watch'
          : instNames.some(function (N) {
                return N.includes('mercenary');
              })
            ? 'The mercenary company'
            : ['thorp', 'hamlet', 'village'].includes(tier)
              ? 'The community'
              : 'The guard';
  const sa = buildStressNarratives({
    instNames,
    instFlags,
    hasMilitaryInst,
    hasCivicHall,
    hasMarketTrade,
    hasMerchantHouse,
    isRoyalAuthority,
    hasNobleBloc,
    governingName: Ie,
    militaryLabel: Na,
    recentConflict: We,
  });
  // Tag each faction with a category for power-economy correlation
  factions.forEach((f) => {
    if (!f.category) f.category = inferFactionCategory(f.faction || '');
  });
  if (We) We = getTierConstraints(We, instNames, tier, Ie);
  if (na && sa[na]) We = getTierConstraints(sa[na], instNames, tier, Ie);
  // ── Public legitimacy & faction dynamics ────────────────────────────────
  // At this point defenseProfile isn't computed yet — we use a provisional
  // defense label derived from institution presence for the legitimacy score,
  // and the actual defenseProfile will be added by generateSettlement after.
  const _provDefLabel = deriveProvisionalDefenseLabel(institutions, tier);

  const publicLegitimacy = computePublicLegitimacy(economicState, _provDefLabel, tier);

  // Apply multipliers before relationship computation (relationships use final powers)
  applyLegitimacyMultipliers(factions, publicLegitimacy, tier);

  const safetyRatio = instFlags?.inst ? instFlags.militaryEffective / Math.max(8, instFlags.criminalEffective) : 1.0;
  const criminalCaptureState = computeCriminalCaptureState(factions, safetyRatio, instFlags.inst || {});
  // Birth seeds the play-time ladder: a settlement born at
  // equilibrium+ stamps the rung onto the GOVERNING faction entry, which
  // ensureFactionStates reads (faction.captureState) when it mints the
  // §corruption Phase 2 faction state. Without the stamp, the first pulse's
  // settlementCaptureState rollup (worst faction rung, all born 'none')
  // would silently reset the dossier's criminalCaptureState to 'none'.
  // 'adversarial' is not seeded — it asserts enforcement is WINNING, i.e.
  // no faction is on a capture arc.
  if (['equilibrium', 'corrupted', 'capture'].includes(criminalCaptureState)) {
    const govEntry = factions.find((N) => N.isGoverning);
    if (govEntry && !govEntry.captureState) govEntry.captureState = criminalCaptureState;
  }
  const stressTypesArr = config?.stressTypes || (config?.stressType ? [config.stressType] : []);
  const factionRelationships = computeFactionRelationships(
    factions,
    tier,
    {
      ...instFlags.inst,
      economyOutput: instFlags.economyOutput,
      safetyRatio,
    },
    publicLegitimacy,
    stressTypesArr
  );

  return {
    factions: factions,
    // Canonical "who governs" name. Sim consumers (factionProfile legitimacy
    // inheritance, ruling_authority governing-faction power, hook escalation,
    // simulation spine, world-event legitimacy deltas) key off this field;
    // it must always name the faction entry that carries isGoverning.
    governingName: (factions.find((N) => N.isGoverning) || {}).faction || null,
    // The government TYPE, persisted explicitly. At generation it equals
    // governingName (the governing entry's name doubles as the government
    // type); a transfer of power (domain/rulingPower.js) keeps both in step
    // while previousGovernments records what the seat used to be.
    government: (factions.find((N) => N.isGoverning) || {}).faction || null,
    stability: Me,
    recentConflict: We,
    publicLegitimacy,
    factionRelationships,
    criminalCaptureState,
  };
};

// generateFactions — group NPCs into factions by connected components of
// positive relationships (ally / political / patron_client / respect).
export const generateFactions = (npcs, relationships) => {
  if (!(npcs != null && npcs.length)) return [];
  // Undirected adjacency: npc id → set of positively-connected npc ids
  const adjacency = new Map(npcs.map((npc) => [npc.id, new Set()]));
  relationships.forEach((rel) => {
    var set1, set2;
    if (['ally', 'political', 'patron_client', 'respect'].includes(rel.type)) {
      (set1 = adjacency.get(rel.npc1Id)) == null || set1.add(rel.npc2Id);
      (set2 = adjacency.get(rel.npc2Id)) == null || set2.add(rel.npc1Id);
    }
  });
  const visited = new Set(),
    factions = [];
  npcs.forEach((npc) => {
    var neighbors;
    if (visited.has(npc.id)) return;
    const members = [],
      queue = [npc.id];
    while (queue.length) {
      const currentId = queue.shift();
      if (visited.has(currentId)) continue;
      visited.add(currentId);
      const memberNpc = npcs.find((n) => n.id === currentId);
      if (memberNpc) members.push(memberNpc);
      (neighbors = adjacency.get(currentId)) == null ||
        neighbors.forEach((neighborId) => {
          if (!visited.has(neighborId)) queue.push(neighborId);
        });
    }
    if (members.length >= 1) {
      const dominantCategory = pickFactionName(members),
        descriptors = FACTION_DESCRIPTORS[dominantCategory] || FACTION_DESCRIPTORS.other;
      (() => {
        const usedNames = new Set(factions.map((f) => f.name));
        let chosenName = pick(descriptors);
        // Retry up to 5 times to avoid duplicate faction names
        for (let attempt = 0; attempt < 5 && usedNames.has(chosenName); attempt++) {
          chosenName = pick(descriptors);
        }
        // If still duplicate after retries, append a distinguishing suffix
        if (usedNames.has(chosenName)) {
          const suffixes = ['Inner Circle', 'Bloc', 'Alliance', 'Faction', 'Assembly'];
          chosenName = chosenName + ' ' + pick(suffixes);
        }
        factions.push({ name: chosenName, members, dominantCategory });
      })();
    }
  });
  return factions.sort((a, b) => b.members.length - a.members.length);
};

// generateConflicts — produce inter-faction conflicts from rivalries/enmities.
//   factions, relationships, config, institutions
export const generateConflicts = (factions, relationships, config = {}, institutions = []) => {
  if (factions.length < 2) return [];
  const instFlags = getInstFlags(config, institutions),
    stressFlags = getStressFlags(config, institutions),
    conflicts = [],
    conflictCount = Math.min(randInt(1, 3), Math.floor(factions.length / 2)),
    issueTemplates = [
      {
        issue: 'Control of the market licensing process',
        stakes: 'Commercial supremacy',
        flag: null,
      },
      {
        issue: 'Jurisdiction over a disputed arrest',
        stakes: 'Institutional authority',
        flag: 'stateCrime',
      },
      {
        issue: 'Church land claims on guild property',
        stakes: 'Institutional power',
        flag: 'theocraticEconomy',
      },
      {
        issue: 'Arcane research permit regulations',
        stakes: 'Magical autonomy',
        flag: 'heresySuppression',
      },
      {
        issue: 'Control of the dock taxation authority',
        stakes: 'Port revenue',
        flag: null,
      },
      {
        issue: 'Military conscription of guild apprentices',
        stakes: 'Labor control',
        flag: null,
      },
      {
        issue: "Access to the criminal network's intelligence",
        stakes: 'Operational advantage',
        flag: 'merchantCriminalBlur',
      },
      {
        issue: 'Succession to a council seat',
        stakes: 'Political influence',
        flag: null,
      },
      {
        issue: 'A mercenary contract being disputed by both parties',
        stakes: 'Military contract rights',
        flag: 'merchantArmy',
      },
      {
        issue: 'Control of a key trade route checkpoint',
        stakes: 'Economic leverage',
        flag: null,
      },
    ],
    stressTypes = config.stressTypes || (config.stressType ? [config.stressType] : []);
  if (stressTypes.includes('wartime'))
    issueTemplates.push(
      {
        issue: 'Rights to a lucrative war supply contract',
        stakes: 'Economic windfall',
        flag: null,
      },
      {
        issue: 'Authority over military conscription lists',
        stakes: 'Labour and loyalty control',
        flag: null,
      },
      {
        issue: 'Control of the requisition enforcement apparatus',
        stakes: 'Political leverage',
        flag: null,
      }
    );
  if (stressTypes.includes('insurgency'))
    issueTemplates.push(
      {
        issue: 'Legitimacy of the current governing authority',
        stakes: 'Political survival',
        flag: null,
      },
      {
        issue: 'Whether to open back-channel negotiations with the insurgency',
        stakes: 'Settlement stability',
        flag: null,
      },
      {
        issue: 'Control of the intelligence on insurgent cells',
        stakes: 'Operational advantage',
        flag: null,
      }
    );
  if (stressTypes.includes('mass_migration'))
    issueTemplates.push(
      {
        issue: 'Allocation of housing and resources between established residents and newcomers',
        stakes: 'Social cohesion',
        flag: null,
      },
      {
        issue: 'Control of the documentation and registration process for new arrivals',
        stakes: 'Legal and financial leverage',
        flag: null,
      }
    );
  if (stressTypes.includes('religious_conversion'))
    issueTemplates.push(
      {
        issue: "Custody of the settlement's religious records and property",
        stakes: 'Institutional legitimacy',
        flag: null,
      },
      {
        issue: 'Whether the governing authority should formally declare a religious allegiance',
        stakes: 'Political and legal authority',
        flag: null,
      }
    );
  if (stressTypes.includes('slave_revolt'))
    issueTemplates.push(
      {
        issue: 'Whether to suppress, contain, or negotiate with the revolt leadership',
        stakes: 'Settlement order and precedent',
        flag: null,
      },
      {
        issue: 'Accountability for the conditions that produced the revolt',
        stakes: 'Political survival',
        flag: null,
      },
      {
        issue: 'Control of the escape routes and networks supporting the revolt',
        stakes: 'Security and leverage',
        flag: null,
      }
    );
  if (stressTypes.includes('occupied'))
    issueTemplates.push({
      issue: 'Degree of collaboration with the occupying authority',
      stakes: 'Survival vs dignity',
      flag: null,
    });
  if (stressTypes.includes('famine'))
    issueTemplates.push({
      issue: 'Control of the remaining grain stores',
      stakes: 'Survival',
      flag: null,
    });
  for (let i = 0; i < conflictCount && i < factions.length - 1; i++) {
    const factionA = factions[i],
      factionB = factions[i + 1],
      rivalries = relationships.filter((rel) => {
        const inA = factionA.members.some((member) => member.id === rel.npc1Id || member.id === rel.npc2Id),
          inB = factionB.members.some((member) => member.id === rel.npc1Id || member.id === rel.npc2Id);
        return inA && inB && ['rival', 'enemy'].includes(rel.type);
      });
    if (rivalries.length === 0 && _rng() < 0.4) continue;
    const applicableTemplates = issueTemplates.filter((tmpl) => !tmpl.flag || stressFlags[tmpl.flag]),
      chosen = pick(applicableTemplates.length ? applicableTemplates : issueTemplates),
      intensity = rivalries.length > 1 ? 'high' : rivalries.length === 1 ? 'moderate' : 'low';
    conflicts.push({
      parties: [factionA.name, factionB.name],
      issue: chosen.issue,
      stakes: chosen.stakes,
      intensity,
      desc: `${factionA.name} and ${factionB.name} are in ${intensity} conflict over ${chosen.issue.toLowerCase()}. The stakes are ${chosen.stakes.toLowerCase()}.`,
      plotHooks: generateEconomicScore(factionA, factionB, chosen, instFlags, stressFlags),
    });
  }
  return conflicts;
};
