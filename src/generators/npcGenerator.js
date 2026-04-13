/**
 * npcGenerator.js
 * NPC_ROLES, relationship, and settlement name generation
 */

import {chance, getInstFlags, getStressFlags, pick, priorityToMultiplier, randInt} from './helpers.js';
import {getUpgradeOpportunities} from './economicGenerator.js';
import { random as _rng, pick as ctxPick, chance as ctxChance, randInt as ctxRandInt } from './rngContext.js';

import {NAMING_DATA} from '../data/namingData.js';
import {NPC_ROLES, STRESS_ECONOMIC_EFFECTS} from '../data/npcData.js';

import {computeRelTension} from './powerGenerator.js';
import {pickRandom} from './helpers.js';
import {pickRandom2} from './helpers.js';
import {STRESS_INSTITUTION_EFFECTS} from './helpers.js';
import {MANNERISMS, SPEECH_PATTERNS, NPC_RELIGION_DATA, NPC_AGE_DATA, NPC_PLOT_HOOKS, NPC_BUILDS, NPC_FEATURES, NPC_WANTS, NPC_FACTION_GOALS, NPC_CRIMINAL_SECRETS, FACTION_CONFLICT_TYPES, NPC_FACTION_LOYALTY, NPC_SECRETS, NPC_PLOT_HOOKS_DATA, NPC_PRESENTATION_MODES} from '../data/npcData.js';

// pickFromArray — uses seeded PRNG when available
const pickFromArray=r=>ctxPick(r);

// ─── NPC_ROLES sub-generators ────────────────────────────────

// generateNPCGoal
const generateNPCGoal = (role) => {
  const HIGH_POWER = ['mayor','lord','governor','bishop','archmage','guild_master','captain','commander','crime lord'];
  const MID_POWER  = ['council_member','priest','wealthy_merchant','wizard','knight','magister','sergeant'];
  const r = role.toLowerCase();
  if (HIGH_POWER.some(kw => r.includes(kw))) return { level: 'high',     power: 8 + Math.floor(_rng() * 3) };
  if (MID_POWER.some(kw  => r.includes(kw))) return { level: 'moderate', power: 4 + Math.floor(_rng() * 4) };
  return                                             { level: 'low',      power: 1 + Math.floor(_rng() * 3) };
};

// generateSingleNPC
const generateSingleNPC = (role, namingTier, category, culture, tier, config = {}) => {
  const gender      = _rng() > 0.5 ? 'male' : 'female';
  const fullName    = pickFirst(culture, gender, true, tier);
  const lastName    = pickLast(culture, culture);
  const religion    = generateReligionType();
  const appearance  = generateNPCAppearance(category);
  const goal        = generateNPCRelType(role, category, config);
  const secret      = generateFactionLeader(category, config);
  const title1      = generateCharacterTitle(category, config);
  const title2      = _rng() > 0.5 ? generateCharacterTitle(category, config) : null;
  const plotHooks   = title2 && title2 !== title1 ? [title1, title2] : [title1];
  const powerLevel  = generateNPCGoal(role);
  return {
    id:       null,
    name:     fullName,
    gender,
    role,
    title:    lastName,
    category,
    personality: { dominant: religion.dominant, flaw: religion.flaw, modifier: religion.modifier, tell: religion.tell, speech: religion.speech },
    physical:    { age: appearance.age, build: appearance.build, feature: appearance.feature, clothes: appearance.clothes },
    goal:        { short: goal.short, long: goal.long },
    secret:      { what: secret.secret, stakes: secret.stakes },
    plotHooks,
    influence:   powerLevel.level,
    power:       powerLevel.power,
    presentation: pickTitle(category),
  };
};

// computeNPCWeights
const computeNPCWeights = (config = {}, institutions = []) => {
  const flags  = getInstFlags(config, institutions);
  const stress = getStressFlags(config, institutions);
  const threat = config.monsterThreat || 'frontier';
  const threatMult = threat === 'plagued' ? 1.4 : threat === 'heartland' ? 0.75 : 1;
  const stresses    = (config.stressTypes?.length) ? config.stressTypes : config.stressType ? [config.stressType] : [];
  const primaryStress = stresses[0] || null;

  const weights = {
    government: 1,
    religious:  priorityToMultiplier(flags.religionInfluence) * (stress.crusaderSynthesis ? 1.3 : 1),
    military:   priorityToMultiplier(flags.militaryEffective) * (stress.crusaderSynthesis ? 1.3 : 1) * threatMult,
    economy:    priorityToMultiplier(flags.economyOutput)     * (stress.theocraticEconomy ? 0.5 : 1),
    criminal:   priorityToMultiplier(flags.criminalEffective) * (stress.stateCrime ? 0.4 : 1),
    magic:      priorityToMultiplier(flags.magicInfluence)    * (stress.heresySuppression ? 0.25 : 1),
    other:      1,
  };

  if (primaryStress) {
    const STRESS_BOOSTS = {
      under_siege:          { military: 2.5, government: 1.5, criminal: 0.5 },
      famine:               { religious: 1.8, economy: 1.5, other: 1.5 },
      occupied:             { government: 1.5, military: 0.4, criminal: 1.6 },
      politically_fractured:{ government: 2, criminal: 1.4, economy: 0.8 },
      indebted:             { economy: 1.8, government: 1.3, criminal: 1.2 },
      recently_betrayed:    { military: 1.5, criminal: 1.5, government: 1.3 },
      infiltrated:          { criminal: 2, government: 1.2, magic: 1.2 },
      plague_onset:         { religious: 2.5, other: 1.8, military: 0.7 },
      succession_void:      { government: 2.5, military: 1.5, criminal: 1.3 },
      monster_pressure:     { military: 2, other: 1.3, economy: 0.8 },
    };
    const boosts = STRESS_BOOSTS[primaryStress] || {};
    Object.entries(boosts).forEach(([cat, mult]) => {
      if (weights[cat] !== undefined) weights[cat] *= mult;
    });
  }

  return weights;
};

// getNPCCountRange
const getNPCCountRange = r=>({thorp:{min:2,max:3},hamlet:{min:3,max:5},village:{min:4,max:7},town:{min:6,max:10},city:{min:10,max:15},metropolis:{min:15,max:20}})[r]||{min:6,max:10};

// formatNPCForDisplay
const formatNPCForDisplay = (r,s,o,d)=>{const l=generateCrimeLevel(r,s,o,d),m=l||r.secret;let h=r.presentation;if(m&&random01(.4)){const w=getStressHistory(m);w&&(h=w)}const g={...r,presentation:h};return l&&(g.secret=l),g};

// mergeNPCLists

// ─── NPC name helpers (pickFirst, pickLast, filterByGuild) ───

const pickFirst = (culture = 'germanic', gender = 'male', withSurname = true, tier = 'town') => {
  const data      = NAMING_DATA[culture] || NAMING_DATA.germanic;
  const namePool  = gender === 'female' ? data.femaleNames : data.maleNames;
  const firstName = namePool[Math.floor(_rng() * namePool.length)];
  if (!withSurname) return firstName;
  const ratio       = { thorp: 0.12, hamlet: 0.2, village: 0.35, town: 0.6, city: 0.8, metropolis: 1 }[tier] || 0.6;
  const surnameCount = Math.max(3, Math.round(data.surnames.length * ratio));
  const surnames    = data.surnames.slice(0, surnameCount);
  return `${firstName} ${surnames[Math.floor(_rng() * surnames.length)]}`;
};

const pickLast=(r="germanic",s="mayor")=>{var o;return((o=(NAMING_DATA[r]||NAMING_DATA.germanic).titles)==null?void 0:o[s])||s};

const filterByGuild = (institutions, culture, tier, config = {}) => {
  const guildInsts = institutions.filter(i => {
    const n = (i.name || '').toLowerCase();
    return (i.tags?.includes('guild') || n.includes('guild')) && !n.includes('thieves');
  });
  if (!guildInsts.length) return null;
  const guild     = pick(guildInsts);
  const guildName = guild.name.replace(/\s*\(.*?\)/, '').replace(/s'?\s*guild$/i, "s'");
  const npc       = generateSingleNPC('Guild Master', culture, 'economy', culture, tier, config);
  npc.title       = `${pickLast(culture, 'guild_master')} of ${guildName}`;
  npc.institution = guild.name;
  return npc;
};

// ─── NPC helpers ────────────────────────────────────────────

// NPC_TITLE_DATA

// generateReligionType
const generateReligionType = ()=>({dominant:pickFromArray(NPC_RELIGION_DATA.positive),flaw:pickFromArray(NPC_RELIGION_DATA.negative),modifier:pickFromArray(NPC_RELIGION_DATA.neutral),tell:pickFromArray(MANNERISMS),speech:pickFromArray(SPEECH_PATTERNS)});

// generateNPCAppearance
const generateNPCAppearance = (r="other")=>({age:pickFromArray(NPC_AGE_DATA[pickFromArray(["young","middle","mature","elder"])]),build:pickFromArray(NPC_BUILDS),feature:pickFromArray(NPC_FEATURES),clothes:pickFromArray(NPC_WANTS[r]||NPC_WANTS.other)});

// generateNPCRelType
const generateNPCRelType = (role, category = 'other', config = {}) => {
  const stressType    = config.stressType || null;
  const commodity     = config.tradeCommodity || config._tradeCommodity || null;
  const topFaction    = config._dominantFaction || null;
  const stresses      = (config.stressTypes?.length) ? config.stressTypes : stressType ? [stressType] : [];

  // Stress-specific NPC goals (templates that get substituted)
  const STRESS_GOALS = {
    under_siege: [
      { short: `Secure enough ${commodity || 'food'} reserves to outlast the blockade`, long: 'Survive this — everything else can wait', driven_by: 'protection' },
      { short: 'Decide whether to negotiate terms or hold out for relief', long: 'Keep the settlement intact whatever the cost to themselves', driven_by: 'protection' },
      { short: 'Identify the person inside the walls who is communicating with the besiegers', long: 'End this siege in a way the settlement can recover from', driven_by: 'military' },
    ],
    famine: [
      { short: `Control the ${commodity || 'grain'} supply before a competing faction corners it`, long: "Be the person who kept people fed — or profit from the fact that others weren't", driven_by: 'wealth' },
      { short: 'Find out where the hoarded reserves are before the council does', long: 'Come out of this with more than they went in with', driven_by: 'wealth' },
      { short: 'Distribute what little exists fairly enough to prevent a riot', long: 'Build the kind of trust that only a crisis can create', driven_by: 'protection' },
    ],
    occupied: [
      { short: 'Navigate the occupation without losing position or principles — ideally both', long: 'Be remembered as someone who preserved what could be preserved', driven_by: 'personal' },
      { short: "Pass information to the resistance without being identified as a collaborator's informant", long: 'Outlast the occupation and be on the right side when it ends', driven_by: 'political' },
      { short: "Satisfy the occupiers' demands while protecting the people they're demanding from", long: 'Find the line between pragmatism and betrayal — and stay on the right side of it', driven_by: 'protection' },
    ],
    indebted: [
      { short: `Renegotiate the debt terms before the ${topFaction || 'creditor'} sends another representative`, long: "Find an exit from this obligation that doesn't require giving up more than it cost to fix", driven_by: 'wealth' },
      { short: 'Identify which members of the council have already made private terms with the creditor', long: 'Repudiate the debt on grounds that would survive legal challenge', driven_by: 'political' },
    ],
    recently_betrayed: [
      { short: 'Identify who the betrayer was before they do further damage', long: 'Restore enough trust that the settlement can function again', driven_by: 'justice' },
      { short: 'Find out what was sold and whether the damage is recoverable', long: 'Build a system that makes the next betrayal harder', driven_by: 'protection' },
    ],
    plague_onset: [
      { short: 'Identify the source of the outbreak before it becomes uncontrollable', long: 'Keep the settlement functioning through what might be a very bad few months', driven_by: 'protection' },
      { short: 'Enforce quarantine measures against people who have reasons to resist them', long: "Get through this without the settlement losing faith in its institutions", driven_by: 'protection' },
    ],
    succession_void: [
      { short: `Position themselves before ${topFaction || 'a rival faction'} moves first`, long: 'Secure authority through the right means — not just the fastest', driven_by: 'power' },
      { short: 'Find a candidate they can support who owes them something for the support', long: 'End the uncertainty on terms they can live with', driven_by: 'political' },
    ],
    monster_pressure: [
      { short: 'Organise a response to the attacks without the garrison they were supposed to have', long: 'Make this settlement safe enough that people stop leaving', driven_by: 'protection' },
      { short: 'Identify whether the attacks are opportunistic or directed', long: 'Be the person who solved the problem rather than the person who reported it', driven_by: 'military' },
    ],
  };

  // 40% chance to use a stress-specific goal
  const stressGoals = stresses.flatMap(s => STRESS_GOALS[s] || []);
  if (stressGoals.length > 0 && _rng() < 0.4) return pickFromArray(stressGoals);

  // Use role-specific goal from NPC_FACTION_GOALS
  const roleGoals = NPC_FACTION_GOALS[role];
  if (roleGoals && roleGoals.length > 0) {
    const goal = pickFromArray(roleGoals);
    // Substitute commodity/faction tokens
    if (commodity || topFaction) {
      const substitute = (text) => text
        .replace(/\{commodity\}/g, commodity || 'key goods')
        .replace(/\{faction\}/g, topFaction || 'the dominant faction')
        .replace(/grain/g, commodity === 'grain' ? 'grain' : commodity || 'grain');
      return { ...goal, short: substitute(goal.short), long: substitute(goal.long) };
    }
    return goal;
  }

  // Fallback to category secrets
  return pickFromArray(NPC_SECRETS[category] || NPC_SECRETS.other);
};

// generateFactionLeader
const generateFactionLeader = (category = 'other', config = {}, institutions = []) => {
  const pri   = { economy: config.priorityEconomy ?? 50, military: config.priorityMilitary ?? 50, religion: config.priorityReligion ?? 50, magic: config.priorityMagic ?? 50, criminal: config.priorityCriminal ?? 50 };
  const names = (institutions || []).map(i => (i.name || '').toLowerCase());
  const hasCriminal = names.some(n => n.includes('thieves') || n.includes('black market') || n.includes('smuggl'));
  const hasMagic    = names.some(n => n.includes('wizard') || n.includes('mage') || n.includes('alchemist'));
  const hasReligion = names.some(n => n.includes('church') || n.includes('cathedral') || n.includes('monastery'));
  const stresses    = (config.stressTypes?.length) ? config.stressTypes : config.stressType ? [config.stressType] : [];

  // Secret type weights driven by institution presence and priorities
  const weights = {
    criminal:          (hasCriminal ? 1.4 : 0.8) * (1 + pri.criminal / 100),
    personal:          1.5,
    political:         1 + pri.military / 100,
    magical:           (hasMagic    ? 1.3 : 0.6) * (1 + pri.magic    / 100),
    religious:         (hasReligion ? 1.3 : 0.6) * (1 + pri.religion / 100),
    family:            1.2,
    historical:        0.8,
    military:          pri.military > 50 ? 1.2 : 0.6,
    economic_betrayal: pri.economy  > 50 ? 1.1 : 0.7,
    identity:          0.9,
  };

  // Stress-specific weight boosts
  if (stresses.length > 0) {
    const STRESS_SECRET_BOOSTS = {
      under_siege:          { military: 3, political: 2, personal: 1.5, criminal: 0.5 },
      famine:               { economic_betrayal: 3, criminal: 2, personal: 2, political: 1.5 },
      occupied:             { political: 3, military: 2.5, identity: 2.5, historical: 1.8, criminal: 1.5 },
      politically_fractured:{ political: 3, criminal: 2, family: 1.8, historical: 1.5 },
      indebted:             { economic_betrayal: 3, criminal: 2, political: 1.8, personal: 1.5 },
      recently_betrayed:    { political: 3, military: 2.5, criminal: 2, historical: 2, identity: 1.5 },
      infiltrated:          { political: 2.5, military: 2.5, criminal: 2.5, identity: 2 },
      plague_onset:         { personal: 2.5, religious: 2, criminal: 2, economic_betrayal: 1.5 },
      succession_void:      { political: 3, family: 2.5, criminal: 1.8, historical: 1.5 },
      monster_pressure:     { military: 2.5, personal: 2, historical: 1.5, magical: 1.3 },
    };
    stresses.forEach(stress => {
      const boosts = STRESS_SECRET_BOOSTS[stress] || {};
      Object.entries(boosts).forEach(([key, mult]) => {
        if (weights[key] !== undefined) weights[key] *= mult;
      });
    });
  }

  // Weighted random secret type selection
  const secretTypes = Object.keys(weights);
  const total       = secretTypes.reduce((sum, k) => sum + weights[k], 0);
  let roll          = _rng() * total;
  let chosenType    = secretTypes[0];
  for (const type of secretTypes) {
    roll -= weights[type];
    if (roll <= 0) { chosenType = type; break; }
  }

  return pickFromArray(NPC_CRIMINAL_SECRETS[chosenType] || NPC_CRIMINAL_SECRETS.personal);
};

// generateCharacterTitle
const generateCharacterTitle = (category = 'other', config = {}) => {
  const stresses = (config.stressTypes?.length) ? config.stressTypes : config.stressType ? [config.stressType] : [];
  const tier     = config.tier || config.settType;

  // Small settlements: high chance of generic community loyalty description
  if (['thorp','hamlet'].includes(tier) && _rng() < 0.45) {
    return pickFromArray(NPC_FACTION_LOYALTY.small_settlement || NPC_FACTION_LOYALTY.other);
  }

  // Stress-driven category bias
  if (stresses.length > 0 && _rng() < 0.4) {
    const STRESS_TO_CATEGORY = {
      under_siege: 'military', famine: 'economy', occupied: 'government',
      politically_fractured: 'government', indebted: 'economy', recently_betrayed: 'military',
      infiltrated: 'criminal', plague_onset: 'religious', succession_void: 'government',
      monster_pressure: 'military',
    };
    const biasedCategories = [...new Set(stresses.map(s => STRESS_TO_CATEGORY[s]).filter(Boolean))];
    if (biasedCategories.length > 0) {
      const biasedCat = pickFromArray(biasedCategories);
      if (NPC_FACTION_LOYALTY[biasedCat]) return pickFromArray(NPC_FACTION_LOYALTY[biasedCat]);
    }
  }

  return pickFromArray(NPC_FACTION_LOYALTY[category] || NPC_FACTION_LOYALTY.other);
};

// pickTitle
const pickTitle = r=>{const s=pick(NPC_PLOT_HOOKS[r]||NPC_PLOT_HOOKS.other);return{impression:s.impression,disposition:s.disposition,behaviour:NPC_PLOT_HOOKS_DATA[s.disposition]||NPC_PLOT_HOOKS_DATA.transactional}};

// generateFactionGoal
const generateFactionGoal = (npcA, npcB, stressFlags) => {
  let score = 0.28;
  const cats = [npcA.category, npcB.category];

  // Same category factions have natural rivalry
  if (npcA.category === npcB.category) score += 0.30;

  // Known conflict type pairs
  if (FACTION_CONFLICT_TYPES[npcA.category]?.includes(npcB.category)) score += 0.22;

  // Power differential: similar power → more likely to interact
  const powerGap = Math.abs(npcA.power - npcB.power);
  if (powerGap <= 1) score += 0.18;
  else if (powerGap <= 3) score += 0.10;

  // Stress flag boosts for specific category pairs
  if (stressFlags.merchantCriminalBlur && cats.includes('economy') && cats.includes('criminal')) score += 0.25;
  if (stressFlags.crusaderSynthesis    && cats.includes('military') && cats.includes('religious')) score += 0.30;
  if (stressFlags.arcaneBlackMarket    && cats.includes('magic')    && cats.includes('criminal')) score += 0.25;

  return Math.min(score, 0.95);
};

// NPC_BUILDS

// NPC_FEATURES

// NPC_WANTS

// NPC_FACTION_GOALS

// NPC_CRIMINAL_SECRETS

// FACTION_CONFLICT_TYPES

// NPC_FACTION_LOYALTY

// NPC_SECRETS

// NPC_PLOT_HOOKS_DATA

// pickFactionName
// random01
const random01=r=>_rng()<r,replaceTokens=(r,s)=>r.replace(/\{(\w+)\}/g,(o,d)=>s[d]||o);

// generateCrimeLevel
// NPC_PRESENTATION_MODES

export const generateCrimeLevel = (npc, npcIndex, summary, allNpcs) => {
  const { stressType, commodity, govFaction, topFaction } = summary;

  // 25% chance: NPC knows something compromising about another NPC
  if (random01(0.25) && allNpcs.length > 1) {
    const otherNpc = pickRandom2(allNpcs.filter((_, idx) => idx !== npcIndex));
    return pickRandom2([
      { what: `Knows something about ${otherNpc.name} that ${otherNpc.name} believes no one else knows — and has been deciding for months whether to use it`, stakes: `${otherNpc.name} would move against them immediately if they suspected` },
      { what: `Was present when ${otherNpc.name} did something they've never accounted for publicly. Neither has acknowledged the other was there`, stakes: "The situation they're both ignoring is becoming relevant again" },
      { what: `Owes ${otherNpc.name} a debt from before either of them held their current position — one that ${otherNpc.name} has never formally called in`, stakes: "The silence feels like patience rather than forgiveness" },
      { what: `Has been reading ${otherNpc.name}'s correspondence through an intermediary. Nothing damaging yet. But they keep looking`, stakes: "The intermediary has recently started asking for more money" },
    ]);
  }

  // 45% chance: stress-driven institutional secret
  const activeStresses = summary.stressTypes || (stressType ? [stressType] : []);
  const stressEffects  = activeStresses.flatMap(s => STRESS_INSTITUTION_EFFECTS[s] || []);
  if (stressEffects.length > 0 && random01(0.45)) {
    const effect   = pickRandom2(stressEffects);
    const otherNpc = allNpcs.filter((_, idx) => idx !== npcIndex)[0];
    return {
      what:   replaceTokens(effect.secret, { faction: topFaction, commodity, npc: otherNpc?.name || 'someone' }),
      stakes: replaceTokens(effect.stakes, { faction: govFaction, commodity, npc: otherNpc?.name || 'someone' }),
    };
  }

  return null;
};

// getStressHistory
export const getStressHistory = (secret) => {
  if (!secret?.what) return null;
  const what = secret.what.toLowerCase();

  // Spy/informant/traitor behaviour patterns → calm, trustworthy surface
  const isDangerous = what.includes('negotiating')    || what.includes('selling information') ||
    what.includes('selling patrol')    || what.includes('feeding information') ||
    what.includes('feeding')           || what.includes('betrayer')            ||
    what.includes('infiltrator')       || what.includes('patrol routes')       ||
    what.includes('occupation authority') || what.includes('without the council') ||
    (what.includes('resistance') && what.includes('identified')) ||
    what.includes('passed information')|| what.includes('cell')                ||
    what.includes('surrendered')       || what.includes('names to avoid')      ||
    what.includes('legitimise')        || what.includes('names to')            ||
    what.includes('abandon')           || what.includes('leave before')        ||
    what.includes('personal arrangements');

  // Hidden corruption/profit patterns → professional, busy surface
  const isCompromised = what.includes('privately')       || what.includes('private arrangement') ||
    what.includes('side payment')    || what.includes('embezzl')              ||
    what.includes('hidden cache')    || what.includes('suppress')             ||
    what.includes('false report')    || what.includes('false harvest')        ||
    what.includes('covert route')    || what.includes('private source')       ||
    what.includes('documentation proving') || what.includes('private terms')  ||
    (what.includes('secret') && what.includes('cache')) || what.includes('hoarding');

  // Information-holder patterns → ordinary, unremarkable surface
  const isSignificant = what.includes('documentation') || what.includes('evidence') ||
    what.includes('knows')           || what.includes('original')             ||
    what.includes('clause');

  if (isDangerous)  return pickRandom2(NPC_PRESENTATION_MODES.dangerous_presents_safe);
  if (isCompromised) return pickRandom2(NPC_PRESENTATION_MODES.compromised_presents_professional);
  if (isSignificant && random01(0.5)) return pickRandom2(NPC_PRESENTATION_MODES.significant_presents_ordinary);
  return null;
};

// computeRelTension (local)
const generateFactionConflict = (npcA, npcB, stressFlags, instFlags) => {
  const cats      = [npcA.category, npcB.category].sort().join('_');
  const powerGap  = npcA.power - npcB.power;

  // Stress-flag driven relationship archetypes (checked in priority order)
  if (stressFlags.merchantCriminalBlur && cats.includes('economy') && cats.includes('criminal'))
    return _rng() < 0.6 ? STRESS_ECONOMIC_EFFECTS.econ_crim_blur : STRESS_ECONOMIC_EFFECTS.econ_crim_exploitation;

  if (stressFlags.stateCrime  && cats.includes('military')  && cats.includes('criminal'))
    return STRESS_ECONOMIC_EFFECTS.mil_crim_corruption;

  if (!stressFlags.stateCrime && cats.includes('military')  && cats.includes('criminal'))
    return instFlags.militaryEffective > instFlags.criminalEffective
      ? STRESS_ECONOMIC_EFFECTS.mil_crim_suppression
      : STRESS_ECONOMIC_EFFECTS.mil_crim_corruption;

  if (stressFlags.merchantArmy     && cats.includes('economy')   && cats.includes('military'))  return STRESS_ECONOMIC_EFFECTS.econ_mil_contract;
  if (stressFlags.crusaderSynthesis && cats.includes('religious') && cats.includes('military'))  return STRESS_ECONOMIC_EFFECTS.rel_mil_crusader;
  if (stressFlags.religiousFraud    && cats.includes('religious') && cats.includes('criminal'))  return STRESS_ECONOMIC_EFFECTS.rel_crim_fraud;
  if (stressFlags.arcaneBlackMarket && cats.includes('magic')     && cats.includes('criminal'))  return STRESS_ECONOMIC_EFFECTS.mag_crim_market;

  if (cats.includes('government') && cats.includes('economy') && instFlags.economyOutput > 65)
    return STRESS_ECONOMIC_EFFECTS.gov_econ_dependence;

  if (cats.includes('government') && cats.includes('military'))
    return _rng() < 0.5 ? STRESS_ECONOMIC_EFFECTS.gov_mil_friction : STRESS_ECONOMIC_EFFECTS.peer_rivalry;

  // Large power differential → mentorship or old debt dynamic
  if (Math.abs(powerGap) >= 4)
    return _rng() < 0.5 ? STRESS_ECONOMIC_EFFECTS.mentor_legacy : STRESS_ECONOMIC_EFFECTS.old_debt;

  // Personality-driven archetypes
  const getPersonalityStr = (npc) => {
    const p = npc.personality;
    if (!p) return '';
    return Array.isArray(p) ? p.join(' ') : [p.dominant, p.flaw, p.modifier].filter(Boolean).join(' ');
  };
  const persA = getPersonalityStr(npcA);
  const persB = getPersonalityStr(npcB);

  if ((persA.includes('arrogant') && persB.includes('arrogant')) ||
      (persA.includes('greedy')   && persB.includes('greedy'))   ||
      (npcA.category === npcB.category && _rng() < 0.4))
    return STRESS_ECONOMIC_EFFECTS.peer_rivalry;

  if (persA.includes('pragmatic') || persB.includes('pragmatic'))
    return STRESS_ECONOMIC_EFFECTS.mutual_leverage;

  // Weighted random fallback
  const WEIGHTED_ARCHETYPES = [
    { archetype: STRESS_ECONOMIC_EFFECTS.wary_alliance,       weight: 2.0 },
    { archetype: STRESS_ECONOMIC_EFFECTS.mutual_leverage,     weight: 1.8 },
    { archetype: STRESS_ECONOMIC_EFFECTS.genuine_respect,     weight: 1.5 },
    { archetype: STRESS_ECONOMIC_EFFECTS.peer_rivalry,        weight: 1.5 },
    { archetype: STRESS_ECONOMIC_EFFECTS.old_debt,            weight: 1.2 },
    { archetype: STRESS_ECONOMIC_EFFECTS.bitter_history,      weight: 0.8 * (instFlags.criminalEffective / 50) },
    { archetype: STRESS_ECONOMIC_EFFECTS.family_complication, weight: 0.7 },
    { archetype: STRESS_ECONOMIC_EFFECTS.mentor_legacy,       weight: 0.8 },
  ];
  const total = WEIGHTED_ARCHETYPES.reduce((sum, a) => sum + a.weight, 0);
  let roll = _rng() * total;
  for (const { archetype, weight } of WEIGHTED_ARCHETYPES) {
    roll -= weight;
    if (roll <= 0) return archetype;
  }
  return STRESS_ECONOMIC_EFFECTS.wary_alliance;
};

const pickFactionName=r=>{var o;const s={};return r.forEach(d=>{s[d.category]=(s[d.category]||0)+1}),((o=Object.entries(s).sort((d,l)=>l[1]-d[1])[0])==null?void 0:o[0])||"other"};

export const mergeNPCLists = (npcs, factions, institutions, tier, config) => {
  if (!npcs || !factions || npcs.length === 0 || factions.length === 0) return npcs;

  const instNames = (institutions || []).map(i => (i.name || '').toLowerCase());
  const hasInst   = (kw) => instNames.some(n => n.includes(kw));

  // Find key faction references — category-first so generic names like "Religious Authorities" still match
  const govFaction   = factions.find(f => f.isGoverning) || factions[0];
  const crimeFaction = factions.find(f => f.category === 'criminal'  || f.faction?.toLowerCase().includes('thieve') || f.faction?.toLowerCase().includes('criminal') || f.faction?.toLowerCase().includes('smuggl') || f.faction?.toLowerCase().includes('underworld'));
  const milFaction   = factions.find(f => f.category === 'military'  || f.faction?.toLowerCase().includes('garrison') || f.faction?.toLowerCase().includes('guard') || f.faction?.toLowerCase().includes('military') || f.faction?.toLowerCase().includes('watch') || f.faction?.toLowerCase().includes('militia'));
  const relFaction   = factions.find(f => f.category === 'religious' || f.faction?.toLowerCase().includes('church') || f.faction?.toLowerCase().includes('temple') || f.faction?.toLowerCase().includes('clergy') || f.faction?.toLowerCase().includes('faith') || f.faction?.toLowerCase().includes('priest') || f.faction?.toLowerCase().includes('order') || f.faction?.toLowerCase().includes('holy') || f.faction?.toLowerCase().includes('diocese'));
  const nobleFaction = factions.find(f => f.category === 'noble'     || f.faction?.toLowerCase().includes('noble') || f.faction?.toLowerCase().includes('lord') || f.faction?.toLowerCase().includes('aristocrat') || f.faction?.toLowerCase().includes('gentry') || f.faction?.toLowerCase().includes('manor'));
  const craftsFaction= factions.find(f => f.category === 'crafts'    || (f.faction?.toLowerCase().includes('craft') && !f.faction?.toLowerCase().includes('merchant')));

  // Role keyword → faction mapping (first match wins)
  // Find magic faction for direct wizard/mage role mapping
  const magicFaction = factions.find(f =>
    f.category === 'magic' ||
    f.faction?.toLowerCase().includes('mage') ||
    f.faction?.toLowerCase().includes('arcane') ||
    f.faction?.toLowerCase().includes('wizard') ||
    f.faction?.toLowerCase().includes('academy')
  );
  const econFaction  = factions.find(f =>
    f.category === 'economy' ||
    f.faction?.toLowerCase().includes('merchant') ||
    f.faction?.toLowerCase().includes('guild') ||
    f.faction?.toLowerCase().includes('trade')
  );

  const ROLE_FACTION_MAP = [
    // Civic / government
    ['elder', govFaction], ['mayor', govFaction], ['reeve', govFaction],
    ['steward', govFaction], ['magistrate', govFaction], ['council', govFaction],
    ['lord', govFaction], ['governor', govFaction], ['chancellor', govFaction],
    ['judge', govFaction], ['sheriff', govFaction], ['official', govFaction],
    // Military / enforcement
    ['captain', milFaction], ['commander', milFaction], ['constable', milFaction],
    ['warden', milFaction], ['marshal', milFaction], ['quartermaster', milFaction],
    ['garrison', milFaction], ['knight', milFaction], ['sergeant', milFaction],
    // Religious
    ['priest', relFaction], ['cleric', relFaction], ['bishop', relFaction],
    ['abbot', relFaction], ['monk', relFaction], ['friar', relFaction],
    ['inquisitor', relFaction], ['prelate', relFaction], ['healer', relFaction],
    ['archivist', relFaction], ['chaplain', relFaction], ['deacon', relFaction],
    // Magic / arcane
    ['wizard', magicFaction], ['mage', magicFaction], ['archmage', magicFaction],
    ['alchemist', magicFaction], ['enchant', magicFaction], ['druid', magicFaction],
    ['sage', magicFaction], ['scholar', magicFaction], ['sorcerer', magicFaction],
    ['hedge wizard', magicFaction], ['guild archmage', magicFaction],
    // Economy / commerce
    ['merchant', econFaction], ['guild master', econFaction], ['factor', econFaction],
    ['overseer', econFaction], ['moneylender', econFaction], ['banker', econFaction],
    ['tradesman', econFaction], ['broker', econFaction], ['harbour master', econFaction],
    // Criminal
    ['thief', crimeFaction], ['smuggler', crimeFaction], ['fence', crimeFaction],
    ['crime lord', crimeFaction], ['assassin', crimeFaction], ['bandit', crimeFaction],
    ['racketeer', crimeFaction], ['corrupt official', crimeFaction],
    // Noble
    ['baron', nobleFaction], ['baroness', nobleFaction], ['duke', nobleFaction],
    ['duchess', nobleFaction], ['lord', nobleFaction], ['lady', nobleFaction],
    ['manor', nobleFaction], ['noble heir', nobleFaction], ['knight', nobleFaction],
    ['dame', nobleFaction], ['chamberlain', nobleFaction], ['land agent', nobleFaction],
    // Crafts
    ['master blacksmith', craftsFaction], ['master carpenter', craftsFaction],
    ['master weaver', craftsFaction], ['master tanner', craftsFaction],
    ['head brewer', craftsFaction], ['guild warden', craftsFaction],
    ['master potter', craftsFaction], ['master glassblower', craftsFaction],
    ['craft guild', craftsFaction], ['journeyman overseer', craftsFaction],
  ].filter(([,f]) => f != null); // drop entries where no matching faction exists

  const stressType = config?.stressType || null;

  // ── Power-proportional target slots ──────────────────────────────────────
  // Each faction gets a target NPC count proportional to its power score.
  // The fallback assignment weights by *remaining capacity* (target - current),
  // so the NPC distribution converges toward the faction power distribution.
  const totalPower = factions.reduce((s, f) => s + (f.power || 1), 0);
  const factionTarget = new Map();
  factions.forEach(f => {
    const proportional = (f.power || 1) / totalPower * npcs.length;
    factionTarget.set(f.faction, Math.max(1, Math.round(proportional)));
  });

  // Track how many NPCs have actually been assigned to each faction
  const factionAssignCount = new Map(factions.map(f => [f.faction, 0]));

  // Category compatibility — gates which faction types each NPC category can join
  const CATEGORY_COMPAT = {
    government: ['government', 'noble', 'military', 'economy'],
    military:   ['military', 'government', 'noble'],
    economy:    ['economy', 'crafts', 'government', 'criminal'],
    crafts:     ['economy', 'crafts', 'government'],
    religious:  ['religious', 'magic', 'government'],
    magic:      ['magic', 'religious', 'economy'],
    criminal:   ['criminal', 'economy'],
    noble:      ['noble', 'government', 'military'],
    other:      null, // generalists — no restriction
  };

  return npcs.map((npc, idx) => {
    const enriched = { ...npc };
    const roleLower = (npc.role || '').toLowerCase();

    // ── Pass 1: role keyword → direct faction lock ────────────────────────
    let assignedFaction = null;
    for (const [keyword, faction] of ROLE_FACTION_MAP) {
      if (faction && roleLower.includes(keyword)) { assignedFaction = faction; break; }
    }

    // ── Pass 2: capacity-weighted, category-compatible fallback ───────────
    // Weight by remaining capacity (target - current) so assignment naturally
    // converges to the faction power distribution.
    if (!assignedFaction && factions.length > 0) {
      const cat    = (npc.category || 'other').toLowerCase();
      const compat = CATEGORY_COMPAT[cat]; // null = unrestricted

      // remaining(f) = how many more NPCs this faction wants, floored at 0
      const remaining = f =>
        Math.max(0, (factionTarget.get(f.faction) || 1) - (factionAssignCount.get(f.faction) || 0));

      // Build pool: compatible factions that still have remaining capacity
      // 'other' category NPCs (generalists) can fill any underrepresented faction
      // to help the overall distribution match the power proportions.
      let pool = factions.filter(f => {
        if (remaining(f) <= 0) return false;
        if (!compat) return true; // 'other' NPCs → any faction
        return compat.includes(f.category || 'other');
      });

      // Fallback cascade: relax capacity → relax compatibility → anything
      if (!pool.length) pool = factions.filter(f => !compat || compat.includes(f.category || 'other'));
      if (!pool.length) pool = factions.filter(f => remaining(f) > 0); // any with capacity left
      if (!pool.length) pool = [...factions]; // absolute fallback

      // Sample proportional to remaining capacity (converges to power distribution)
      const totalCap = pool.reduce((s, f) => s + Math.max(1, remaining(f)), 0);
      let roll = _rng() * totalCap;
      for (const f of pool) {
        roll -= Math.max(1, remaining(f));
        if (roll <= 0) { assignedFaction = f; break; }
      }
      if (!assignedFaction) assignedFaction = pool[0];
    }

    if (assignedFaction) {
      enriched.factionAffiliation = assignedFaction.faction;
      factionAssignCount.set(assignedFaction.faction, (factionAssignCount.get(assignedFaction.faction) || 0) + 1);
    }

    // Stress-modified goals
    if (stressType && enriched.goal) {
      const isGov       = roleLower.includes('mayor') || roleLower.includes('elder') || roleLower.includes('reeve') || roleLower.includes('steward') || roleLower.includes('governor') || roleLower.includes('council');
      const isMil       = roleLower.includes('captain') || roleLower.includes('commander') || roleLower.includes('constable') || roleLower.includes('warden') || roleLower.includes('marshal');
      const isRel       = roleLower.includes('priest') || roleLower.includes('cleric') || roleLower.includes('bishop') || roleLower.includes('abbot') || roleLower.includes('friar') || roleLower.includes('monk');
      const isMerchant  = roleLower.includes('merchant') || roleLower.includes('guild') || roleLower.includes('factor') || roleLower.includes('overseer');

      const STRESS_GOAL_OVERRIDES = {
        wartime: {
          gov: { short: 'Satisfy the crown requisition order without stripping the settlement to the bone', note: "The war has made every civic decision a military calculation. The crown's needs and the settlement's needs are not the same calculation." },
          mil: { short: 'Keep unit cohesion as conscription pulls away experienced soldiers and replaces them with frightened substitutes', note: "Every experienced soldier conscripted into the field army is a hole in local security that a substitute won't fill the same way." },
          merchant: { short: 'Secure a war contract before a rival does — or find a way to profit from the disruption instead of suffering it' },
        },
        insurgency: {
          gov: { short: 'Maintain the appearance of legitimate authority while the substance of it is actively contested', note: "Every public appearance is a performance of control. The private meetings are about whether there is still enough control to perform." },
          mil: { short: 'Determine which members of the watch are loyal to the institution and which are loyal to whoever is paying them', note: "An insurgency that has lasted this long has had time to make investments in the security apparatus." },
          rel: { short: 'Avoid being forced to publicly declare support for either the governing faction or the insurgency — and run out of reasons before the pressure does' },
        },
        mass_migration: {
          gov: { short: 'Manage the influx without the old residents concluding the governing authority has chosen the newcomers over them', note: "The governing faction is caught between two constituencies that want incompatible things, and both know it." },
          merchant: { short: 'Either profit from the demographic change or find a way to be insulated from it — either answer requires moving faster than the uncertainty' },
          mil: { short: 'Establish which residents are registered, which are transient, and which are neither — before one of the third category becomes a problem' },
        },
        religious_conversion: {
          rel: { short: "Preserve the institution's position through the transition without either abandoning the congregation or openly defying the new authority", note: "The institution has survived political upheaval before by being indispensable. Whether it can repeat that calculation here is the open question." },
          gov: { short: 'Delay a public declaration on the religious question for as long as the political cost of delay is lower than the cost of choosing a side' },
        },
        slave_revolt: {
          gov: { short: 'End the revolt without either full suppression or formal negotiation — both options set precedents the governing faction cannot afford', note: "The revolt's continued existence is itself a delegitimisation. Every day it continues is evidence that the authority is not in control." },
          mil: { short: 'Contain the revolt geographically without deploying force that will create martyrs and widen the conflict', note: 'The orders are to restore order. The orders do not specify what order is supposed to look like when this is over.' },
          merchant: { short: 'Recover the economic loss from the market suspension — or redirect capital away from a labour system that may not survive this in its current form' },
        },
      };

      const stressOverrides = STRESS_GOAL_OVERRIDES[stressType];
      if (stressOverrides) {
        const override = isGov ? stressOverrides.gov : isMil ? stressOverrides.mil : isRel ? stressOverrides.rel : isMerchant ? stressOverrides.merchant : null;
        if (override) {
          enriched.goal = { short: override.short, long: enriched.goal.long || override.short };
          if (override.note) enriched.stressNote = override.note;
        }
      }
    }

    // Detect criminal affiliation from secret text
    if (npc.secret && typeof npc.secret === 'object') {
      const secretText = ((npc.secret.what || '') + ' ' + (npc.secret.stakes || '')).toLowerCase();
      const isCriminalSecret =
        secretText.includes('brib')   || secretText.includes('embezzl')        || secretText.includes('skim') ||
        secretText.includes('forg')   || secretText.includes('blackmail')       || secretText.includes('extort') ||
        secretText.includes('smuggl') || secretText.includes('fence')           || secretText.includes('stolen') ||
        secretText.includes('protection money') || secretText.includes('criminal') || secretText.includes('thieves') ||
        secretText.includes('illicit')|| secretText.includes('corrupt')         ||
        (secretText.includes('paying') && (secretText.includes('gang') || secretText.includes('guild') || secretText.includes('crew')));
      const notAlreadyCrime  = assignedFaction && assignedFaction !== crimeFaction;
      const roleIsNotCrime   = !roleLower.includes('fence') && !roleLower.includes('smuggl') && !roleLower.includes('thief') && !roleLower.includes('assassin') && !roleLower.includes('criminal');
      if (isCriminalSecret && notAlreadyCrime && roleIsNotCrime) {
        enriched.secondaryAffiliation = crimeFaction ? crimeFaction.faction : secretText.includes('thieves') ? "Thieves' Guild" : 'criminal network';
      }
    }

    // First NPC inherits governing faction goal context
    if (idx === 0 && govFaction && npc.goal) {
      const govDesc = govFaction.desc || '';
      if (govDesc.toLowerCase().includes('constrain') || govDesc.toLowerCase().includes('challeng') || govDesc.toLowerCase().includes('compet')) {
        enriched.factionGoal = `Maintain ${govFaction.faction}'s position against current pressure`;
      }
    }

    // Sanitise criminal guild references if no criminal infrastructure
    if (npc.secret && typeof npc.secret === 'object') {
      const secretText = (npc.secret.what || '') + ' ' + (npc.secret.stakes || '');
      const mentionsCriminalGuild = secretText.toLowerCase().includes('thieves') || (secretText.toLowerCase().includes('guild') && secretText.toLowerCase().includes('criminal'));
      if (mentionsCriminalGuild && !hasInst('thieves') && !hasInst('criminal') && !crimeFaction) {
        enriched.secret = {
          what:   (npc.secret.what || '').replace(/thieves guild/gi, 'a powerful outside interest').replace(/criminal guild/gi, 'a powerful outside interest'),
          stakes: npc.secret.stakes,
        };
      }
    }

    return enriched;
  });
};

// sortNPCsByPriority
const sortNPCsByPriority = function(historicalEvents, currentTensions, tier) {
  if (!historicalEvents || historicalEvents.length === 0) return currentTensions;

  // Sort history by recency (most recent first)
  const sortedHistory = historicalEvents.slice().sort((a, b) => b.yearsAgo - a.yearsAgo);

  // Events that logically precede or follow others (avoid showing "cause" without "effect")
  const NARRATIVE_SEQUENCES = {
    'Bank Collapse':       ['Resource Boom', 'Trade Route Opened', 'The Monopoly'],
    'Debt Collapse':       ['Resource Boom', 'Trade Route Opened'],
    'The Famine':          ['Resource Boom'],
    'Trade Route Closed':  ['Trade Route Opened'],
    'The Great Exile':     ['The Return', 'The Great Migration'],
    'Demographic Collapse':['The Great Migration', 'The Return'],
    'Occupation':          ['Independence Gained', 'The Rebellion'],
    'Betrayal':            ['Infiltration Revealed'],
    'Succession Crisis':   ['Founding Charter Granted', 'Independence Gained'],
    'Heresy Purge':        ['Religious Schism', 'False Prophet'],
    'Temple Sacked':       ['Cathedral Consecrated', "Saint's Miracle"],
  };

  // Find events that have their narrative consequence present (suppress the cause)
  const suppressedEvents = new Set();
  for (let i = 0; i < sortedHistory.length; i++) {
    const followups = NARRATIVE_SEQUENCES[sortedHistory[i].name] || [];
    const hasFollowup = followups.length > 0 &&
      sortedHistory.slice(i + 1).some(e => followups.indexOf(e.name) >= 0);
    if (hasFollowup) suppressedEvents.add(sortedHistory[i].name);
  }

  // Filter tensions: suppress if their linked history event is too old or suppressed
  const MAX_RELEVANT_YEARS = 150;
  const filtered = (currentTensions || []).filter(tension => {
    const linkedEvent = historicalEvents.find(e => e.type === tension.type);
    if (!linkedEvent) return true; // no linked event, keep the tension
    if (suppressedEvents.has(linkedEvent.name)) return false;
    if (linkedEvent.yearsAgo > MAX_RELEVANT_YEARS && linkedEvent.severity !== 'catastrophic' && !linkedEvent.anchored) return false;
    return true;
  });

  // If filtering removed everything, return the single most relevant tension
  if (filtered.length === 0 && (currentTensions || []).length > 0) {
    return [(currentTensions || []).slice().sort((a, b) => {
      const ea = historicalEvents.find(e => e.type === a.type);
      const eb = historicalEvents.find(e => e.type === b.type);
      return (ea ? ea.yearsAgo : 999) - (eb ? eb.yearsAgo : 999);
    })[0]];
  }

  return filtered;
};

// ─── Inlined cross-module helpers (cycle-free) ─────────────

// ─── NPC name helpers ─────────────────────

// ─────────────────────────────────────────────────────────

// generateNPCs

// ─────────────────────────────────────────────────────────

// generateNPCs
export const generateNPCs = (settlement, culture = 'germanic', config = {}) => {
  const { tier, institutions } = settlement;
  const weights     = { ...computeNPCWeights(config, institutions), tradeRouteAccess: config?.tradeRouteAccess || 'road' };
  const { min, max } = getNPCCountRange(tier);
  const targetCount = randInt(min, max);
  const npcs        = [];
  const candidates  = getUpgradeOpportunities(institutions, tier, weights);

  // ── Inject faction-gated NPC roles ────────────────────────────────────────
  // Noble and crafts roles only appear when those faction types exist in the
  // power structure. getUpgradeOpportunities can't see the power structure,
  // so we inject them here if they're not already in the candidate pool.
  const powerFactionCats = new Set(
    (settlement.powerStructure?.factions || []).map(f => f.category).filter(Boolean)
  );
  const tierIdx = ['thorp','hamlet','village','town','city','metropolis'].indexOf(tier);
  const tierOk  = (minTier) => tierIdx >= ['thorp','hamlet','village','town','city','metropolis'].indexOf(minTier);

  const NOBLE_ROLES = [
    { role: 'Lord/Lady of the Manor', title: 'noble',   priority: 8, minTier: 'village',    category: 'noble', goalCategories: ['power','wealth'] },
    { role: 'Baron/Baroness',         title: 'noble',   priority: 9, minTier: 'town',       category: 'noble', goalCategories: ['power','wealth'] },
    { role: 'Court Advisor',          title: 'advisor', priority: 7, minTier: 'town',       category: 'noble', goalCategories: ['power','knowledge'] },
    { role: 'House Steward',          title: 'steward', priority: 6, minTier: 'village',    category: 'noble', goalCategories: ['wealth','personal'] },
    { role: 'Noble Heir',             title: 'noble',   priority: 5, minTier: 'hamlet',     category: 'noble', goalCategories: ['personal','power'] },
    { role: 'Land Agent',             title: 'agent',   priority: 5, minTier: 'village',    category: 'noble', goalCategories: ['wealth','personal'] },
    { role: 'Knight/Dame',            title: 'knight',  priority: 7, minTier: 'village',    category: 'noble', goalCategories: ['protection','personal'] },
    { role: 'Duke/Duchess',           title: 'noble',   priority:10, minTier: 'metropolis', category: 'noble', goalCategories: ['power','wealth'] },
    { role: 'Royal Chamberlain',      title: 'noble',   priority: 8, minTier: 'city',       category: 'noble', goalCategories: ['power','personal'] },
  ];
  const CRAFTS_ROLES = [
    { role: 'Master Blacksmith',          title: 'master',   priority: 7, minTier: 'hamlet',  category: 'crafts', goalCategories: ['wealth','personal'] },
    { role: 'Master Carpenter',           title: 'master',   priority: 6, minTier: 'hamlet',  category: 'crafts', goalCategories: ['wealth','personal'] },
    { role: 'Master Weaver',              title: 'master',   priority: 6, minTier: 'village', category: 'crafts', goalCategories: ['wealth','personal'] },
    { role: 'Master Tanner',              title: 'master',   priority: 5, minTier: 'village', category: 'crafts', goalCategories: ['wealth','personal'] },
    { role: 'Head Brewer',                title: 'guild',    priority: 5, minTier: 'hamlet',  category: 'crafts', goalCategories: ['wealth','personal'] },
    { role: 'Guild Warden',               title: 'guild',    priority: 7, minTier: 'town',    category: 'crafts', goalCategories: ['power','wealth'], requiresGuild: true },
    { role: 'Journeyman Overseer',        title: 'overseer', priority: 5, minTier: 'town',    category: 'crafts', goalCategories: ['wealth','personal'] },
    { role: 'Craft Guild Representative', title: 'guild',    priority: 6, minTier: 'city',    category: 'crafts', goalCategories: ['power','wealth'], requiresGuild: true },
    { role: 'Master Potter',              title: 'master',   priority: 4, minTier: 'village', category: 'crafts', goalCategories: ['wealth','personal'] },
    { role: 'Master Glassblower',         title: 'master',   priority: 5, minTier: 'town',    category: 'crafts', goalCategories: ['wealth','personal'] },
  ];

  if (powerFactionCats.has('noble')) {
    const existingRoles = new Set(candidates.map(c => c.role));
    NOBLE_ROLES.filter(r => tierOk(r.minTier) && !existingRoles.has(r.role))
      .forEach(r => candidates.push({ ...r, effectivePriority: r.priority }));
  }
  if (powerFactionCats.has('crafts') || powerFactionCats.has('economy')) {
    // Inject crafts-specific roles when a crafts OR economy faction exists (Craft Guilds have category=economy)
    const existingRoles = new Set(candidates.map(c => c.role));
    const hasGuild = institutions.some(i => i.tags?.includes('guild') || (i.name||'').toLowerCase().includes('guild'));
    const waterRoute = ['port','river','coastal'].includes(config?.tradeRouteAccess);
    const hasPort  = waterRoute || institutions.some(i =>
      i.tags?.includes('port') ||
      (i.name||'').toLowerCase().includes('port') ||
      (i.name||'').toLowerCase().includes('harbour') ||
      (i.name||'').toLowerCase().includes('harbor')
    );
    CRAFTS_ROLES
      .filter(r => tierOk(r.minTier) && !existingRoles.has(r.role))
      .filter(r => !r.requiresGuild || hasGuild)
      .filter(r => !r.requiresPort  || hasPort)
      .forEach(r => candidates.push({ ...r, effectivePriority: r.priority }));
  }

  const stresses    = (config.stressTypes?.length) ? config.stressTypes : config.stressType ? [config.stressType] : [];
  const primaryStress = stresses[0] || null;

  // Tier-appropriate mandatory roles
  // Derive terrain-appropriate second role for thorps
  const thorpSecondRole = (() => {
    const route = config.tradeRouteAccess || 'road';
    const terrain = config.terrainType || 'plains';
    const insts = (settlement.institutions || []).map(i => (i.name||'').toLowerCase());
    if (insts.some(n => n.includes('fishing'))) return 'Fisher';
    if (insts.some(n => n.includes('woodcutter'))) return 'Woodcutter';
    if (insts.some(n => n.includes('shepherd'))) return 'Shepherd';
    if (route === 'port' || terrain === 'coastal') return 'Fisher';
    if (terrain === 'forest' || route === 'isolated') return 'Woodcutter';
    if (terrain === 'plains' || terrain === 'hills') return 'Shepherd';
    if (route === 'river' || terrain === 'riverside') return 'Fisher';
    return 'Miller';
  })();

  const TIER_MANDATORY_ROLES = {
    thorp:      ['Elder', thorpSecondRole],
    hamlet:     ['Elder', 'Parish Priest'],
    village:    ['Mayor', 'Guard Captain'],
    town:       ['Mayor', 'Guard Captain', 'High Priest'],
    city:       ['Mayor', 'Guard Captain', 'High Priest', 'Wealthiest Merchant'],
    metropolis: ['Governor', 'City Watch Chief', 'High Priest', 'Guild Archmage', 'Wealthiest Merchant'],
  };

  // Stress-driven additional mandatory roles
  const STRESS_MANDATORY_ROLES = {
    under_siege:          ['Garrison Commander', 'Guard Captain'],
    famine:               ['Healer', 'Merchant Guild Master'],
    occupied:             ['Corrupt Official'],
    politically_fractured:['Council Member', 'Council Member'],
    indebted:             ['Moneylender'],
    recently_betrayed:    ['Chief Magistrate'],
    infiltrated:          [],
    plague_onset:         ['Healer', 'Parish Priest'],
    succession_void:      ['Council Member', 'Chief Magistrate'],
    monster_pressure:     ['Garrison Commander', 'Retired Adventurer'],
  };

  const tierRoles   = TIER_MANDATORY_ROLES[tier] || [];
  const stressRoles = (primaryStress && STRESS_MANDATORY_ROLES[primaryStress]) || [];
  const mandatoryRoles = [...new Set([...tierRoles, ...stressRoles])];

  // Build config context for NPC generation
  const npcConfig = {
    ...config,
    _tradeCommodity:   settlement.economicState?.primaryExports?.[0]?.split(' ')?.[0]?.toLowerCase() || null,
    _dominantFaction:  settlement.powerStructure?.factions?.[0]?.faction || null,
    _prosperity:       settlement.economicState?.prosperity || null,
  };

  // Generate mandatory role NPCs first
  mandatoryRoles.forEach(role => {
    const candidate = candidates.find(c => c.role === role);
    if (candidate && npcs.length < targetCount) {
      npcs.push(generateSingleNPC(candidate.role, candidate.title, candidate.category, culture, tier, npcConfig));
    }
  });

  // Add a guild-master NPC if we have room
  if (npcs.length < targetCount) {
    const guildNPC = filterByGuild(institutions, culture, tier, npcConfig);
    if (guildNPC) npcs.push(guildNPC);
  }

  // Fill remaining slots with weighted-random candidates
  const usedRoles    = new Set(npcs.map(n => n.role));
  const remainingCandidates = candidates.filter(c => !usedRoles.has(c.role));

  while (npcs.length < targetCount && remainingCandidates.length > 0) {
    const totalWeight = remainingCandidates.reduce((sum, c) => sum + (c.effectivePriority ?? c.priority), 0);
    let roll = _rng() * totalWeight;
    let chosen = null;

    for (const candidate of remainingCandidates) {
      roll -= (candidate.effectivePriority ?? candidate.priority);
      if (roll <= 0) { chosen = candidate; break; }
    }
    if (!chosen) chosen = remainingCandidates[0];

    npcs.push(generateSingleNPC(chosen.role, chosen.title, chosen.category, culture, tier, npcConfig));
    usedRoles.add(chosen.role);
    remainingCandidates.splice(remainingCandidates.indexOf(chosen), 1);
  }

  // Assign sequential IDs
  npcs.forEach((npc, idx) => { npc.id = `npc_${idx + 1}`; });
  return npcs;
};

// generateRelationships
export const generateRelationships = (npcs, config = {}, institutions = []) => {
  // Relationship type definitions (for the strength labels)
  const RELATIONSHIP_STRENGTHS = {
    ally:           ['weak', 'moderate', 'strong'],
    rival:          ['professional', 'personal', 'bitter'],
    enemy:          ['mild', 'serious', 'mortal'],
    family:         ['distant', 'close', 'inseparable'],
    patron_client:  ['nominal', 'significant', 'total dependence'],
    lover:          ['casual', 'serious', 'passionate'],
    mentor_student: ['formal', 'devoted', 'lifelong'],
    debtor_creditor:['minor', 'substantial', 'crushing'],
    political:      ['convenience', 'stable', 'unbreakable'],
    respect:        ['grudging', 'genuine', 'deep'],
  };

  if (!npcs || npcs.length < 2) return [];

  const instFlags  = getInstFlags(config, institutions);
  const stressFlags = getStressFlags(config, institutions);
  const relationships = [];
  const seen          = new Set();

  npcs.forEach(npc => {
    const maxRelationships = randInt(2, 3);
    let count = 0;

    // Sort potential partners by relationship score (most likely first)
    const candidates = npcs
      .filter(other => other.id !== npc.id)
      .map(other => ({ npc: other, score: generateFactionGoal(npc, other, stressFlags) }))
      .sort((a, b) => b.score - a.score);

    for (const { npc: partner, score } of candidates) {
      if (count >= maxRelationships) break;

      // Deduplicate by pair (regardless of direction)
      const pairKey = [npc.id, partner.id].sort().join('::');
      if (seen.has(pairKey)) continue;
      if (_rng() >= score && count > 0) continue;

      const archetype = computeRelTension(npc, partner, stressFlags, instFlags);
      const strengths = RELATIONSHIP_STRENGTHS[archetype.type] || RELATIONSHIP_STRENGTHS.respect;
      const strength  = pick(strengths);

      // Find the archetype key from STRESS_ECONOMIC_EFFECTS for UI rendering
      const archetypeKey = Object.entries(STRESS_ECONOMIC_EFFECTS).find(([, v]) => v === archetype)?.[0];

      relationships.push({
        type:         archetype.type,
        typeName:     archetype.label,
        description:  archetype.desc(npc, partner),
        tension:      archetype.tension(npc, partner),
        strength,
        npc1Id:       npc.id,
        npc2Id:       partner.id,
        npc1Name:     npc.name,
        npc2Name:     partner.name,
        npc1Role:     npc.role,
        npc2Role:     partner.role,
        archetypeKey,
        flagDriven: stressFlags.anyActive && (
          archetype === STRESS_ECONOMIC_EFFECTS.econ_crim_blur    ||
          archetype === STRESS_ECONOMIC_EFFECTS.mil_crim_corruption ||
          archetype === STRESS_ECONOMIC_EFFECTS.rel_crim_fraud    ||
          archetype === STRESS_ECONOMIC_EFFECTS.mag_crim_market   ||
          archetype === STRESS_ECONOMIC_EFFECTS.rel_mil_crusader  ||
          archetype === STRESS_ECONOMIC_EFFECTS.econ_mil_contract
        ),
      });

      seen.add(pairKey);
      count++;
    }
  });

  return relationships;
};

// generateSettlementName
export const generateSettlementName=(r="germanic")=>{const s=NAMING_DATA[r]||NAMING_DATA.germanic;return`${s.settlementPrefixes[Math.floor(_rng()*s.settlementPrefixes.length)]}${s.settlementSuffixes[Math.floor(_rng()*s.settlementSuffixes.length)]}`};
