/**
 * power/relationshipArchetypes.js — select the relationship archetype (a
 * STRESS_ECONOMIC_EFFECTS entry) between two factions from their category
 * pair, power gap, personalities and active stress flags.
 */
import { random as _rng } from '../../kernel/rngContext.js';
import { STRESS_ECONOMIC_EFFECTS } from '../../data/npcData.js';

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
