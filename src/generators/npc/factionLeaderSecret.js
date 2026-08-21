/**
 * Pick the private pressure carried by a generated faction leader.
 *
 * Secret selection used to be policy-blind: every NPC weighted the magical
 * bucket even when magic was impossible, and a later prose pick could therefore
 * contradict the settlement's institutions. Keeping this concern outside the
 * already-large NPC orchestrator makes the rule explicit without hiding its
 * load-bearing RNG sequence.
 */

import { NPC_CRIMINAL_SECRETS } from '../../data/npcData.js';
import { pick as pickFromArray, random as rng } from '../../kernel/rngContext.js';
import { resolveGenerationWorldLaw } from '../generationContext.js';
import { institutionCategoryFlags } from '../roleCategory.js';

const STRESS_SECRET_BOOSTS = Object.freeze({
  under_siege: { military: 3, political: 2, personal: 1.5, criminal: 0.5 },
  famine: { economic_betrayal: 3, criminal: 2, personal: 2, political: 1.5 },
  occupied: { political: 3, military: 2.5, identity: 2.5, historical: 1.8, criminal: 1.5 },
  politically_fractured: { political: 3, criminal: 2, family: 1.8, historical: 1.5 },
  indebted: { economic_betrayal: 3, criminal: 2, political: 1.8, personal: 1.5 },
  recently_betrayed: { political: 3, military: 2.5, criminal: 2, historical: 2, identity: 1.5 },
  infiltrated: { political: 2.5, military: 2.5, criminal: 2.5, identity: 2 },
  plague_onset: { personal: 2.5, religious: 2, criminal: 2, economic_betrayal: 1.5 },
  succession_void: { political: 3, family: 2.5, criminal: 1.8, historical: 1.5 },
  monster_pressure: { military: 2.5, personal: 2, historical: 1.5, magical: 1.3 },
  insurgency: { political: 3, military: 2, criminal: 2, identity: 1.8 },
  mass_migration: { identity: 2.5, personal: 2, criminal: 1.8, historical: 1.5 },
  wartime: { military: 3, political: 2, economic_betrayal: 1.8, personal: 1.5 },
  religious_conversion: { religious: 3, political: 2, historical: 1.8, family: 1.5 },
  slave_revolt: { political: 2.5, military: 2.5, criminal: 2, identity: 2 },
});

const SAFE_SECRET_FALLBACK = Object.freeze({
  secret: 'Has quietly concealed a costly personal failure from their allies',
  stakes: 'Exposure would damage the trust on which their present authority depends',
});

/**
 * The enabled-world path deliberately retains the historic two draws: one for
 * the weighted bucket and one for the final prose variant. Removing an
 * ineligible bucket changes probabilities, but never introduces an extra draw.
 *
 * @param {Record<string, unknown>} config
 * @param {Array<Record<string, unknown>>} institutions
 * @param {unknown} generationContext
 */
export function generateFactionLeaderSecret(
  config = {},
  institutions = [],
  generationContext = null,
) {
  const worldLaw = resolveGenerationWorldLaw(generationContext, config);
  const pri = {
    economy: Number(config.priorityEconomy ?? 50),
    military: Number(config.priorityMilitary ?? 50),
    religion: Number(config.priorityReligion ?? 50),
    magic: Number(config.priorityMagic ?? 50),
    criminal: Number(config.priorityCriminal ?? 50),
  };
  const { hasCriminal, hasMagic, hasReligion } =
    institutionCategoryFlags(institutions);
  const weights = {
    criminal: (hasCriminal ? 1.4 : 0.8) * (1 + pri.criminal / 100),
    personal: 1.5,
    political: 1 + pri.military / 100,
    magical: (hasMagic ? 1.3 : 0.6) * (1 + pri.magic / 100),
    religious: (hasReligion ? 1.3 : 0.6) * (1 + pri.religion / 100),
    family: 1.2,
    historical: 0.8,
    military: pri.military > 50 ? 1.2 : 0.6,
    economic_betrayal: pri.economy > 50 ? 1.1 : 0.7,
    identity: 0.9,
  };
  if (!worldLaw.magicFunctions()) delete weights.magical;

  const stresses = Array.isArray(config.stressTypes) && config.stressTypes.length
    ? config.stressTypes
    : (config.stressType ? [config.stressType] : []);
  for (const stress of stresses) {
    const boosts = STRESS_SECRET_BOOSTS[String(stress)] || {};
    for (const [key, multiplier] of Object.entries(boosts)) {
      if (weights[key] !== undefined) weights[key] *= multiplier;
    }
  }

  const secretTypes = Object.keys(weights);
  const total = secretTypes.reduce((sum, type) => sum + weights[type], 0);
  let roll = rng() * total;
  let chosenType = secretTypes[0];
  for (const type of secretTypes) {
    roll -= weights[type];
    if (roll <= 0) {
      chosenType = type;
      break;
    }
  }

  const preferredPool = (
    NPC_CRIMINAL_SECRETS[chosenType]
    || NPC_CRIMINAL_SECRETS.personal
    || []
  ).filter(worldLaw.allowsSecret);
  const fallbackPool = (
    NPC_CRIMINAL_SECRETS.personal
    || []
  ).filter(worldLaw.allowsSecret);
  const eligiblePool = preferredPool.length ? preferredPool : fallbackPool;
  return eligiblePool.length
    ? pickFromArray(eligiblePool)
    : SAFE_SECRET_FALLBACK;
}
