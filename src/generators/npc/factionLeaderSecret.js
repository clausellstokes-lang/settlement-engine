/**
 * Pick the private pressure carried by a generated faction leader.
 *
 * Secret selection used to be policy-blind: every NPC weighted the magical
 * bucket even when magic was impossible, and a later prose pick could therefore
 * contradict the settlement's institutions. Keeping this concern outside the
 * already-large NPC orchestrator makes the rule explicit without hiding its
 * load-bearing RNG sequence.
 */

import { criminalSecretsForHolder } from '../../data/npcData.js';
import { classOfRole } from '../../domain/roles/roleClass.js';
import { random as rng } from '../../kernel/rngContext.js';
import { drawRefusingHeldThrough } from '../hookVariety.js';
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
 * BOTH ROLLS READ THE HOLDER (CENSUS-1i unit 3; the chair's R-AX, refined at
 * 09:3x). The religious and military secrets presume the holder's role, so the
 * rows are keyed by it (CENSUS-4g, `npcData.js :: NPC_CRIMINAL_SECRETS_BY_HOLDER`)
 * and the picker reads the holder's role class (`classOfRole`, the fact's own
 * reader, R-AP). The TYPE roll is drawn over the full weights exactly as before;
 * if the rolled type has no admitted row for this holder while the type does
 * hold admitted rows for some holder (the key, not the world, emptied it), the
 * SAME roll is re-mapped inside its band over the types that do — no further
 * roll, so only that refused draw moves, and the result is distributed as if
 * the empty type had never been weighted. The ROW draw reads
 * `criminalSecretsForHolder(type, class)`, the historic order with the rows of
 * another role left out, so a matching holder's pool is the flat pool itself.
 * The personal fallback stays the last resort for a pool the world empties for
 * every holder. No role (`holderRole` absent) reads the flat view, unchanged.
 *
 * @param {Record<string, unknown>} config
 * @param {Array<Record<string, unknown>>} institutions
 * @param {unknown} generationContext
 * @param {string} [holderRole] the holder's role (keys both rolls)
 * @param {Set<string>} [heldSecrets] - the secrets the roster already carries (REVIEW-INTAKE-4):
 *   the final draw refuses them and falls through the pool in seed order, then (on the same roll)
 *   through the personal bucket, then the safe line; every one held answers `null`, a figure
 *   without a secret rather than a repeated one. MERGE-R2: composed with CENSUS-1i's holder-keyed
 *   rows (the chain is the holder's rows; the one roll is `pick`'s own index).
 */
export function generateFactionLeaderSecret(
  config = {},
  institutions = [],
  generationContext = null,
  holderRole = undefined,
  heldSecrets = null,
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

  const holderClass = typeof holderRole === 'string' && holderRole ? classOfRole(holderRole) : null;
  /** @param {string} type @param {string|null} cls */
  const rowsFor = (type, cls) => (criminalSecretsForHolder(type, cls) || criminalSecretsForHolder('personal', cls) || []).filter(worldLaw.allowsSecret);
  /** A type the holder's KEY empties (it holds admitted rows for some holder, none for this one). @param {string} type */
  const keyEmptied = (type) => holderClass !== null && rowsFor(type, holderClass).length === 0 && rowsFor(type, null).length > 0;

  const secretTypes = Object.keys(weights);
  const total = secretTypes.reduce((sum, type) => sum + weights[type], 0);
  let roll = rng() * total;
  let chosenType = secretTypes[0];
  for (const type of secretTypes) {
    const before = roll;
    roll -= weights[type];
    if (roll <= 0) {
      chosenType = type;
      if (keyEmptied(type)) {
        // R-AX: re-map the same roll inside the refused band over the admitted types (no roll).
        const admitted = secretTypes.filter((t) => !keyEmptied(t));
        let x = (before / weights[type]) * admitted.reduce((sum, t) => sum + weights[t], 0);
        chosenType = admitted[0];
        for (const t of admitted) {
          x -= weights[t];
          if (x <= 0) { chosenType = t; break; }
        }
      }
      break;
    }
  }

  const preferredPool = rowsFor(chosenType, holderClass);
  const fallbackPool = rowsFor('personal', holderClass);
  const eligiblePool = preferredPool.length ? preferredPool : fallbackPool;
  if (!eligiblePool.length) return heldSecrets?.has(SAFE_SECRET_FALLBACK.secret) ? null : SAFE_SECRET_FALLBACK;
  // The chosen bucket first, then (on the same roll) the personal bucket, the pool's own fallback.
  const chain = preferredPool.length ? [preferredPool, fallbackPool] : [fallbackPool];
  const drawn = drawRefusingHeldThrough(chain, heldSecrets, (row) => row.secret);
  if (drawn) return drawn;
  return heldSecrets?.has(SAFE_SECRET_FALLBACK.secret) ? null : SAFE_SECRET_FALLBACK;
}
