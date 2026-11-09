/**
 * npcGenerator.js
 * NPC_ROLES, relationship, and settlement name generation
 */

import { getInstFlags, getStressFlags, pick, priorityToMultiplier, randInt } from './helpers.js';
import { deriveTradeCommodity } from './tradeCommodity.js';
import {
  factionPoolCategory,
  isCommerceGuild,
  roleToCategory,
  roleTakesMerchantStress,
} from './roleCategory.js';
import { nativeSemanticName } from '../domain/content/customContentSemanticAuthority.js';
import { getUpgradeOpportunities, mandatedRoleCandidate } from './economicGenerator.js';
import { random as _rng, pick as ctxPick, getActiveRng } from '../kernel/rngContext.js';
import { drawUnique } from './hookVariety.js';
import { themeOfText } from '../domain/hookThemes.js';
import { disambiguateNPCDisplayNames } from './npcDisplayNames.js';
import { resolveGenerationWorldLaw } from './generationContext.js';
import { legacyMassRange } from '../domain/density/densityLaw.js'; import { defenceRoleGate } from '../domain/defense/defenseFacts.js'; import { crimeSignalOf, withoutCriminalGuild } from '../domain/crimeSignal.js'; // R6 (and F4 unit 3): one line, so no cited line moves
import { generateFactionLeaderSecret } from './npc/factionLeaderSecret.js'; import { drawDeclared, lineText, resolveSibling } from '../domain/facts/drawDeclared.js'; import { birthFactsOf, factsOf } from '../domain/facts/factsOf.js'; // F5, F10, CENSUS-1c, CENSUS-4f: one line, so no cited line moves
import { CRAFTS_ROLES, NOBLE_ROLES } from './npc/factionRoleCatalog.js'; import { titleLinesFor } from './people/poolMap.js'; // ITEM 15 (ALLEGIANCE-CAR4), one line so no cited line moves
import { resolveGeneratedNpcTitle } from './npc/generatedNpcTitle.js';
import { deriveThorpSecondRole } from './npc/thorpSecondRole.js'; // CENSUS-4 R9's guildTitleName and R3's tieArchetype left this line at MERGE-CAR (R9 superseded by the census titles and the honorific pools, R-P9; R3 read at people/ties.js); one line, so no cited line moves

import { NAMING_DATA } from '../data/namingData.js';
import { TRAIT_PRESENCE_DISTRIBUTION } from '../data/npcData.js';

import { pickRandom2 } from './helpers.js';
import { STRESS_INSTITUTION_EFFECTS } from '../data/stressInstitutionEffects.js';
import { secretsHeldByFoodRecord } from '../domain/foodSurplus.js'; import { fillSentenceSlots } from './narrativeProse.js'; import { waterAccessKind } from '../domain/tradeRouteSemantics.js'; import { otherNpcOf } from '../domain/facts/otherNpc.js'; // F11 / CENSUS-1 / CENSUS-4b: one line, so no cited line moves
import {
  MANNERISMS,
  SPEECH_PATTERNS,
  NPC_PERSONALITY_TRAITS,
  NPC_AGE_DATA,
  NPC_PLOT_HOOKS,
  NPC_BUILDS,
  NPC_FEATURES,
  NPC_WANTS,
  NPC_FACTION_LOYALTY,
  NPC_PLOT_HOOKS_DATA,
  NPC_PRESENTATION_MODES, NPC_HOOK_SIBLINGS,
} from '../data/npcData.js';

// pickFromArray — uses seeded PRNG when available
const pickFromArray = r => ctxPick(r);

// ─── NPC_ROLES sub-generators ────────────────────────────────

// generateNPCPowerLevel — the NPC's POWER, on the 1-10 scale the card and the PDF print.
//
// ⚠ THIS WAS CALLED `generateNPCGoal` AND RETURNED NO GOAL. It returns `{ level, power }`,
// which `generateSingleNPC` assigns to `influence` and `power`. The name that now sits on it
// is the one it always described; the name it USED to wear has moved to the function that
// actually generates the goal, twenty lines down (§759, the misleading-vocabulary risk: "each
// new consumer that trusts a function name in that file risks wiring the wrong field").
const generateNPCPowerLevel = role => {
  const HIGH_POWER = [
    'mayor',
    'lord',
    'governor',
    'bishop',
    'archmage',
    'guild_master',
    'captain',
    'commander',
    'crime lord',
  ];
  const MID_POWER = ['council_member', 'priest', 'wealthy_merchant', 'wizard', 'knight', 'magister', 'sergeant'];
  const r = role.toLowerCase();
  if (HIGH_POWER.some(kw => r.includes(kw))) return { level: 'high', power: 8 + Math.floor(_rng() * 3) };
  if (MID_POWER.some(kw => r.includes(kw))) return { level: 'moderate', power: 4 + Math.floor(_rng() * 4) };
  return { level: 'low', power: 1 + Math.floor(_rng() * 3) };
};

// generateSingleNPC
// `hookRegistry` — the settlement-scoped anti-repetition registry, created once
// per generateNPCs() call and threaded to every NPC. `.titles` is the family Set
// that stops two NPCs emitting the same loyalty STRING (wave E batch E2);
// `.themes` is HK-3's second Set, which stops them telling the same BEAT in two
// different strings. title1 and title2 are drawn against the SAME registry
// (title2 is therefore always distinct from title1 without the old guard needing
// to prove it). ONE object rather than two positional Sets on purpose: the two
// Sets travel together or not at all, so no call site can thread half a
// registry. NOTE (corrected 2026-08-03): the draw sites reach it via `reg?.`,
// so a call site that forgets to thread it degrades SILENTLY to naive picks —
// it does not throw. The real guards are the pipeline-level roll-budget and
// theme-repeat pins, which red on exactly that regression.
export const generateSingleNPC = ( // exported for people/representatives.js (the people car): every face takes today's record body
  role,
  namingTier,
  category,
  culture,
  tier,
  config = {},
  institutions = [],
  hookRegistry,
  generationContext = null, options = {}, // options.hook === false: the birth seam draws the card's one hook itself; options.title: the face's title (item 15)
) => {
  const gender = _rng() > 0.5 ? 'male' : 'female';
  const fullName = pickFirst(culture, gender, true, tier);
  const worldLaw = resolveGenerationWorldLaw(generationContext, config);
  const culturalTitle = pickCulturalTitle(culture, namingTier || culture);
  const title = resolveGeneratedNpcTitle({
    role,
    culturalTitle,
    category,
    worldLaw,
  });
  const religion = generateReligionType(hookRegistry);
  const appearance = generateNPCAppearance(category, birthFactsOf({ institutions, config, tier, powerStructure: { government: config._government } }, worldLaw)); // CENSUS-1i unit 6: the goal draw's facts (R-V), handed to the wants
  // ALLEGIANCE-CAR4 (the design §2, A9): the goal is no longer drawn at birth — the families bind ranks, ties, the
  // allegiance and rivals that do not exist here; people/goals.js :: dealGoals deals every card's goal at the seam's end.
  // institutions drives generateFactionLeader's secret-type weighting (criminal/
  // magic/religion presence). Without it the weighting was stuck in "absent" mode.
  // REVIEW-INTAKE-4: both draws refuse a text the roster already holds (hookRegistry.goals /
  // .secrets), falling through their pool in seed order with no further roll; a pool with every
  // row held leaves this figure without one rather than repeating it.
  // ITEM 15 (ALLEGIANCE-CAR4, the design §6.5, J-16): a face whose title the title table writes (people/poolMap.js ::
  // titleLinesFor, the 147 fallback titles) draws its secret from its title's own lines, an unheld one (REVIEW-INTAKE-4);
  // every other face — and a titled face whose three are all held — draws by its role and category, as before.
  const titled = titleLinesFor(options.title);
  const titleSecrets = titled ? titled.secrets.filter((row) => !hookRegistry?.secrets?.has(String(row.secret).trim())) : [];
  const secret = titleSecrets.length ? pickFromArray(titleSecrets) : generateFactionLeaderSecret(
    config,
    institutions,
    worldLaw, role, // CENSUS-1i R-AX: the holder's role keys both rolls (the type and the row)
    hookRegistry?.secrets, // REVIEW-INTAKE-4 (MERGE-R2: composed with the holder's keyed rows)
  );
  if (secret?.secret) hookRegistry?.secrets?.add(String(secret.secret).trim()); // REVIEW-INTAKE-4; MERGE-R2: the drawn text (the held key) beside the text the figure carries
  // ONE PLOT HOOK PER PERSON (the owner, 2026-11-07: "one plot hook per NPC rather than multiple";
  // PEOPLE-3 HOOKS): the second hook (a coin-flip, μ 0.5 per card) is RETIRED. A representative's
  // hook is drawn by its birth seam on its own keyed fork, keyed by the face's title through the
  // pool map (people/representatives.js :: drawCardHooks), so that seam asks for none here.
  const plotHooks = options.hook === false ? [] : [drawPersonHook(category, config, hookRegistry, { worldLaw, institutions, tier })];
  const powerLevel = generateNPCPowerLevel(role);
  return {
    id: null,
    name: fullName,
    gender,
    role,
    title,
    category,
    personality: {
      dominant: religion.dominant,
      flaw: religion.flaw,
      modifier: religion.modifier,
      tell: religion.tell,
      speech: religion.speech,
    },
    physical: {
      age: appearance.age,
      build: appearance.build,
      feature: appearance.feature,
      clothes: appearance.clothes,
    },
    goal: null, // A9 deals it (people/goals.js :: dealGoals)
    secret: secret ? { what: secret.secret, stakes: secret.stakes } : null,
    plotHooks,
    influence: powerLevel.level,
    power: powerLevel.power,
    presentation: titled && titled.presentations.length ? { ...pickFromArray(titled.presentations) } : pickTitle(category, birthFactsOf({ institutions, config, tier }, worldLaw)), // ITEM 15: the title's own first impression
  };
};

// computeNPCWeights
const computeNPCWeights = (config = {}, institutions = []) => {
  const flags = getInstFlags(config, institutions);
  const stress = getStressFlags(config, institutions);
  const threat = config.monsterThreat || 'frontier';
  const threatMult = threat === 'plagued' ? 1.4 : threat === 'heartland' ? 0.75 : 1;
  const stresses = config.stressTypes?.length ? config.stressTypes : config.stressType ? [config.stressType] : [];
  const primaryStress = stresses[0] || null;

  const weights = {
    government: 1,
    religious: priorityToMultiplier(flags.religionInfluence) * (stress.crusaderSynthesis ? 1.3 : 1),
    military: priorityToMultiplier(flags.militaryEffective) * (stress.crusaderSynthesis ? 1.3 : 1) * threatMult,
    economy: priorityToMultiplier(flags.economyOutput) * (stress.theocraticEconomy ? 0.5 : 1),
    criminal: priorityToMultiplier(flags.criminalEffective) * (stress.stateCrime ? 0.4 : 1),
    magic: priorityToMultiplier(flags.magicInfluence) * (stress.heresySuppression ? 0.25 : 1),
    other: 1,
  };

  if (primaryStress) {
    const STRESS_BOOSTS = {
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
      insurgency: { government: 2, military: 1.4, criminal: 1.6 },
      mass_migration: { economy: 1.6, other: 1.8, criminal: 1.3 },
      wartime: { military: 2.5, government: 1.5, economy: 1.2 },
      religious_conversion: { religious: 2.5, government: 1.3, other: 1.3 },
      slave_revolt: { military: 2, criminal: 1.5, government: 1.4 },
    };
    const boosts = STRESS_BOOSTS[primaryStress] || {};
    Object.entries(boosts).forEach(([cat, mult]) => {
      if (weights[cat] !== undefined) weights[cat] *= mult;
    });
  }

  return weights;
};

// getNPCCountRange — the v1 named-NPC mass band. The TABLE now lives in
// density/densityLaw.js as LEGACY_MASS_RANGE, so both generation laws' mass
// bands have one home, each labelled by its version. Values unchanged; the
// unknown-tier fallback is still the town row.
const getNPCCountRange = legacyMassRange;

// mergeNPCLists

// ─── NPC name helpers (pickFirst, pickCulturalTitle, filterByGuild) ───

const CULTURE_KEYS = Object.keys(NAMING_DATA).filter(key =>
  Array.isArray(NAMING_DATA[key]?.maleNames) &&
  Array.isArray(NAMING_DATA[key]?.femaleNames) &&
  Array.isArray(NAMING_DATA[key]?.surnames)
);

const resolveNameCulture = culture => {
  if (culture === 'mixed') {
    return CULTURE_KEYS[Math.floor(_rng() * CULTURE_KEYS.length)] || 'germanic';
  }
  return NAMING_DATA[culture] ? culture : 'germanic';
};

// Exported for one more caller: the crisis cast step's temporary person
// (src/generators/steps/resolveCrisisCast.js), named the way every roster NPC is.
export const pickFirst = (culture = 'germanic', gender = 'male', withSurname = true, tier = 'town') => {
  const firstCulture = resolveNameCulture(culture);
  const surnameCulture = culture === 'mixed' ? resolveNameCulture(culture) : firstCulture;
  const data = NAMING_DATA[firstCulture] || NAMING_DATA.germanic;
  const surnameData = NAMING_DATA[surnameCulture] || data;
  const namePool = gender === 'female' ? data.femaleNames : data.maleNames;
  const firstName = namePool[Math.floor(_rng() * namePool.length)];
  if (!withSurname) return firstName;
  const ratio = { thorp: 0.12, hamlet: 0.2, village: 0.35, town: 0.6, city: 0.8, metropolis: 1 }[tier] || 0.6;
  const surnameCount = Math.max(3, Math.round(surnameData.surnames.length * ratio));
  const surnames = surnameData.surnames.slice(0, surnameCount);
  return `${firstName} ${surnames[Math.floor(_rng() * surnames.length)]}`;
};

/** The CULTURAL TITLE for a role, off `NAMING_DATA[culture].titles`.
 *
 * ⚠ THIS WAS CALLED `pickLast`, the symmetric partner of `pickFirst` — and `pickFirst` really
 * does pick a given name, so the pairing read as "given name / surname" to every new reader.
 * It has never returned a surname: it returns a role's title, and falls back to humanizing the
 * role key. Renamed rather than left as a trap for the next consumer (§759). */
const pickCulturalTitle = (r = 'germanic', s = 'mayor') => {
  const culture = resolveNameCulture(r);
  const titles = (NAMING_DATA[culture] || NAMING_DATA.germanic).titles;
  const title = titles?.[s];
  if (title) return title;
  // Backstop: many role keys (elder, owner, noble, steward, knight, guild_master…)
  // have no entry in the per-culture titles map. Humanize the key rather than leaking
  // the raw lowercase lookup key into the UI ("elder" → "Elder").
  return s.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
};

const filterByGuild = (
  institutions,
  culture,
  tier,
  config = {},
  hookRegistry,
  generationContext = null,
) => {
  const guildInsts = institutions.filter(isCommerceGuild);
  if (!guildInsts.length) return null;
  const guild = pick(guildInsts);
  const guildName = guild.name.replace(/\s*\(.*?\)/, '').replace(/s'?\s*guild$/i, "s'"); // MERGE-CAR: CENSUS-4 R9 (guildTitleName) retired — superseded by the census titles and the honorific pools (R-P9; the chair's SC-2 ruling); this legacy path has no generator caller
  const npc = generateSingleNPC(
    'Guild Master',
    culture,
    'economy',
    culture,
    tier,
    config,
    institutions,
    hookRegistry,
    generationContext,
  );
  npc.title = `${pickCulturalTitle(culture, 'guild_master')} of ${guildName}`;
  npc.institution = guild.name;
  return npc;
};

// ─── NPC helpers ────────────────────────────────────────────

// NPC_TITLE_DATA

// generateReligionType
// Draws BOTH raw trait candidates first (preserving rng draw order, so the
// existing downstream stream is unperturbed when a trait is kept), then a SINGLE
// seeded roll decides which of {dominant=temperament, flaw} survive — making the
// two corruption-relevant slots INDEPENDENTLY optional per
// TRAIT_PRESENCE_DISTRIBUTION. A surviving trait keeps its drawn candidate; a
// dropped one becomes null (absent). Consumers tolerate absence: npcCorruptibleFlaw
// returns null with no flaw, and the personality string builders use .filter(Boolean).
// Exported for the corruption-trait-gate distribution tests.
export const generateReligionType = (reg) => {
  const dominantCand = pickFromArray(NPC_PERSONALITY_TRAITS.positive);
  const flawCand = pickFromArray(NPC_PERSONALITY_TRAITS.negative);
  const modifier = pickFromArray(NPC_PERSONALITY_TRAITS.neutral);
  // CS-A1 (gen-1a): no-replacement within a settlement. `reg?.` is the established
  // idiom at this site (see the hookRegistry comment): a caller that threads no
  // registry — the corruption-trait-gate suite is the only one — degrades to the
  // pre-cure plain seeded pick rather than throwing, and the PINS are the guard.
  const tell = drawUnique(MANNERISMS, reg?.tells);
  const speech = drawUnique(SPEECH_PATTERNS, reg?.speech);

  // ONE seeded roll AFTER both pickFromArray calls — walk the cumulative bands of
  // TRAIT_PRESENCE_DISTRIBUTION to pick a presence bucket. Drawing the roll last
  // means kept-trait NPCs leave the downstream rng position unchanged relative
  // to draw ORDER (one extra draw total per NPC, same for every bucket).
  const d = TRAIT_PRESENCE_DISTRIBUTION;
  const r = _rng();
  let dominant;
  let flaw;
  if (r < d.both) {
    dominant = dominantCand;
    flaw = flawCand;
  } else if (r < d.both + d.flawOnly) {
    dominant = null;
    flaw = flawCand;
  } else if (r < d.both + d.flawOnly + d.temperamentOnly) {
    dominant = dominantCand;
    flaw = null;
  } else {
    dominant = null;
    flaw = null;
  }

  return { dominant, flaw, modifier, tell, speech };
};

// generateNPCAppearance
const generateNPCAppearance = (r = 'other', facts = null) => ({
  age: pickFromArray(NPC_AGE_DATA[pickFromArray(['young', 'middle', 'mature', 'elder'])]),
  build: pickFromArray(NPC_BUILDS),
  feature: pickFromArray(NPC_FEATURES),
  clothes: lineText(drawDeclared(NPC_WANTS[r] || NPC_WANTS.other, { draw: pickFromArray, facts, key: `${getActiveRng()?.seed ?? ''}::npcData:NPC_WANTS`, poolId: 'npcData:NPC_WANTS', surface: 'npcs', drawKind: 'R', keepRefused: true }).line), // CENSUS-1i unit 6: CENSUS-4f's three declaring wants enforced (one roll over the FULL pool, then resolve; R-C)
});

// THE CRISIS FAMILY'S LINES (ALLEGIANCE-CAR4, the allegiance design §6.1: today's overrides and the siege goal, KEPT
// verbatim; people/goals.js :: dealGoals draws them at the seam's end, A9, through resolveDeclared). Moved here, unchanged,
// from the retired role-goal draw (`generateNPCGoal`) and `mergeNPCLists`'s stress block.

/** The siege goal's three rows (`STRESS_GOALS.under_siege`), the trade commodity filled. @param {string | null} commodity */
export const SIEGE_GOALS = (commodity) => {
  const STRESS_GOALS = {
    under_siege: [
      {
        short: `Secure enough ${commodity || 'food'} reserves to outlast the blockade`,
        long: 'Survive this: everything else can wait',
        driven_by: 'protection',
      },
      {
        short: 'Decide whether to negotiate terms or hold out for relief',
        long: 'Keep the settlement intact whatever the cost to themselves',
        driven_by: 'protection',
      },
      {
        short: 'Identify the person inside the walls who is communicating with the besiegers',
        long: 'End this siege in a way the settlement can recover from',
        driven_by: 'military',
      },
    ],
  };
  return STRESS_GOALS.under_siege;
};

/**
 * The stress override's role bucket (gov > mil > rel > merchant), by the shared role→category map; the
 * merchant bucket reads roleTakesMerchantStress (the guild and overseer crafts roles). Draw-free.
 * @param {string} role @returns {'gov' | 'mil' | 'rel' | 'merchant' | null}
 */
export const stressBucketOf = (role) => {
  const roleLower = String(role || '').toLowerCase();
  const roleCat = roleToCategory(roleLower);
  if (roleCat === 'government') return 'gov';
  if (roleCat === 'military') return 'mil';
  if (roleCat === 'religious') return 'rel';
  return roleTakesMerchantStress(roleLower) ? 'merchant' : null;
};

/** The stress-specific goal overrides by stress type and role bucket. */
export const STRESS_GOAL_OVERRIDES = {
  wartime: {
    gov: {
      short: 'Satisfy the crown requisition order without stripping the settlement to the bone',
      note: "Since the war began, every decision here comes back to the army, and the crown's requisition order asks for what the settlement itself needs to live.",
    },
    mil: {
      short:
        'Keep unit cohesion as conscription pulls away experienced soldiers and replaces them with frightened substitutes',
      note: "Each experienced soldier sent to the field army is replaced by a frightened substitute who does not yet know the work.",
    },
    merchant: {
      short:
        'Secure a war contract before a rival does, or find a way to profit from the disruption instead of suffering it',
    },
  },
  insurgency: {
    gov: {
      short: 'Maintain the appearance of legitimate authority while the substance of it is actively contested',
      note: 'Every public appearance is a performance of control. The private meetings are about whether there is still enough control to perform.',
    },
    mil: {
      needs: ['watch'], short:
        'Determine which members of the watch are loyal to the institution and which are loyal to whoever is paying them',
      note: 'An insurgency that has lasted this long has had time to make investments in the security apparatus.',
    },
    rel: {
      short:
        'Avoid being forced to publicly declare support for either the governing faction or the insurgency, and run out of reasons before the pressure does',
    },
  },
  mass_migration: {
    gov: {
      needs: ['migration: influx'], short:
        'Manage the influx without the old residents concluding the governing authority has chosen the newcomers over them',
      note: 'The governing faction is caught between two constituencies that want incompatible things, and both know it.',
    },
    merchant: {
      short:
        'Either profit from the demographic change or find a way to be insulated from it. Either answer requires moving faster than the uncertainty',
    },
    mil: {
      short:
        'Establish which residents are registered, which are transient, and which are neither: before one of the third category becomes a problem',
    },
  },
  religious_conversion: {
    rel: {
      short:
        "Preserve the institution's position through the transition without either abandoning the congregation or openly defying the new authority",
      note: 'The institution has survived political upheaval before by being indispensable. Whether it can repeat that calculation here is the open question.',
    },
    gov: {
      short:
        'Delay a public declaration on the religious question for as long as the political cost of delay is lower than the cost of choosing a side',
    },
  },
  slave_revolt: {
    gov: {
      short:
        'End the revolt without either full suppression or formal negotiation: both options set precedents the governing faction cannot afford',
      note: "The revolt's continued existence is itself a delegitimisation. Every day it continues is evidence that the authority is not in control.",
    },
    mil: {
      short:
        'Contain the revolt geographically without deploying force that will create martyrs and widen the conflict',
      note: 'The orders are to restore order. The orders do not specify what order is supposed to look like when this is over.',
    },
    merchant: {
      needs: ['market'], short:
        'Recover the economic loss from the market suspension, or redirect capital away from a labour system that may not survive this in its current form',
    },
  },
};

// drawLoyalty — the ONE spelling of a themed loyalty draw (wave HK-3).
// `.titles` is the family registry (wave E batch E2); `.themes` is HK-3's beat
// registry and `themeOfText` its closed-vocabulary classifier, so a settlement
// prefers a template whose BEAT it has not told yet before it settles for one
// whose beat it has. Both registries are settlement-scoped and transient — the
// draw NEVER persists a theme, which is why HK-2's projection layer and this one
// can disagree about nothing. drawUnique spends exactly one roll in every arm
// (HK-LAW-6), so the surrounding stream is unmoved; only WHICH template a given
// roll lands on changes, and that is HK-3's disclosed same-seed shift.
const drawLoyalty = (pool, reg, facts = null) => drawDeclared(pool, { key: `${getActiveRng()?.seed ?? ''}::npcData:NPC_FACTION_LOYALTY`, /* R-AT (CENSUS-1h): the registry resolution's key carries the settlement's identity, the active stream's seed (no roll) */ draw: (p) => drawUnique(p, reg?.titles, (x) => lineText(x), reg?.themes, (x) => themeOfText(lineText(x))), registry: { used: reg?.titles, keyFn: (x) => lineText(x), themes: reg?.themes, themeOfFn: (x) => themeOfText(lineText(x)) }, facts, poolId: 'npcData:NPC_FACTION_LOYALTY', surface: 'npcs', drawKind: 'R' }).text; // CENSUS-1c unit 2: one drawUnique over the full pool (one roll, HK-LAW-6), then resolve; CENSUS-3e: stores the TEXT (a declared row is `{ text, needs }`), and a refused row resolves to a FRESH admitted template (drawDeclared's `registry` option, R-AJ: CENSUS-3e's resolver lifted), so no hook is lost

// generatePlotHook — ONE plot hook, the person's one (`drawPersonHook`; the second draw that
// made a pair was retired by PEOPLE-3 HOOKS, 2026-11-07).
//
// ⚠ THIS WAS CALLED `generateCharacterTitle` AND RETURNS NO TITLE. The NPC's title comes from
// `pickTitle(category)` and `pickCulturalTitle`; this draws from NPC_FACTION_LOYALTY, which is
// hook material. A consumer that trusted the old name would have wired a paragraph of faction
// loyalty into a name field.
// `hookRegistry` is the settlement-scoped anti-repetition draw registry threaded
// from generateNPCs. Each authored loyalty string is its own family, so the
// string itself is the family id, and the final pool draw goes through
// drawLoyalty instead of a naive pick. Each branch still consumes the SAME
// number of RNG rolls it always did (drawUnique spends one roll, exactly like
// the pick it replaces), so title2 / power / downstream draws are unmoved.
const generatePlotHook = (category = 'other', config = {}, hookRegistry, facts = null) => {
  const stresses = config.stressTypes?.length ? config.stressTypes : config.stressType ? [config.stressType] : [];
  const tier = config.tier || config.settType;

  // Small settlements: high chance of generic community loyalty description
  if (['thorp', 'hamlet'].includes(tier) && _rng() < 0.45) return drawLoyalty(NPC_FACTION_LOYALTY.small_settlement || NPC_FACTION_LOYALTY.other, hookRegistry, facts);

  // Stress-driven category bias
  if (stresses.length > 0 && _rng() < 0.4) {
    const STRESS_TO_CATEGORY = {
      under_siege: 'military',
      famine: 'economy',
      occupied: 'government',
      politically_fractured: 'government',
      indebted: 'economy',
      recently_betrayed: 'military',
      infiltrated: 'criminal',
      plague_onset: 'religious',
      succession_void: 'government',
      monster_pressure: 'military',
      insurgency: 'government',
      mass_migration: 'economy',
      wartime: 'military',
      religious_conversion: 'religious',
      slave_revolt: 'military',
    };
    const biasedCategories = [...new Set(stresses.map(s => STRESS_TO_CATEGORY[s]).filter(Boolean))];
    if (biasedCategories.length > 0) {
      const biasedCat = pickFromArray(biasedCategories);
      if (NPC_FACTION_LOYALTY[biasedCat]) return drawLoyalty(NPC_FACTION_LOYALTY[biasedCat], hookRegistry, facts);
    }
  }

  return drawLoyalty(NPC_FACTION_LOYALTY[category] || NPC_FACTION_LOYALTY.other, hookRegistry, facts);
};

/** THE PERSON HOOK — one line of the NPC hook pool under `hookPool` (people/poolMap.js :: hookPoolFor),
 * refusing a held text, the wet line resolved through its declared sibling set (CENSUS-1c: the F5 inland
 * twin dissolved into `NPC_HOOK_SIBLINGS`) with the birth's facts; on the ambient stream (the card's fork).
 * MERGE-CAR: the people car's one hook per person (PEOPLE-3) composed with the rung-2 landing's declared
 * draw (the facts the census gives the loyalty pool, the sibling resolution the twin table became).
 * @param {string} hookPool @param {Record<string, any>} config @param {any} hookRegistry
 * @param {{ worldLaw?: { portKind?: 'none'|'maritime'|'river' | null } | null, institutions?: unknown[], tier?: string }} [place]
 * @returns {string} */
export const drawPersonHook = (hookPool, config = {}, hookRegistry, place = {}) => {
  const { worldLaw = null, institutions = [], tier } = place || {};
  return /** @type {string} */ (resolveSibling(generatePlotHook(hookPool, config, hookRegistry, birthFactsOf({ institutions, config, tier }, worldLaw)), NPC_HOOK_SIBLINGS, { facts: () => factsOf({ institutions }, { waterKind: worldLaw?.portKind }), poolId: 'npcData:NPC_HOOK_SIBLINGS', surface: 'npcs', drawKind: 'T' }));
};

// pickTitle
const pickTitle = (r, facts = null) => {
  const s = drawDeclared(NPC_PLOT_HOOKS[r] || NPC_PLOT_HOOKS.other, { draw: pick, facts, key: `${getActiveRng()?.seed ?? ''}::npcData:NPC_PLOT_HOOKS`, poolId: 'npcData:NPC_PLOT_HOOKS', surface: 'npcs', drawKind: 'R' }).line || {}; // CENSUS-1c unit 2
  return {
    impression: s.impression,
    disposition: s.disposition,
    behaviour: NPC_PLOT_HOOKS_DATA[s.disposition] || NPC_PLOT_HOOKS_DATA.transactional,
  };
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
const random01 = r => _rng() < r;
// replaceTokens retired by F11: generateCrimeLevel fills its slots with narrativeProse.js :: fillSentenceSlots

// generateCrimeLevel
// NPC_PRESENTATION_MODES

// REVIEW-INTAKE-4: `held` is the secrets the rest of the roster carries; both draws refuse a text
// it holds and fall through their pool in seed order; every row held answers null (the figure
// keeps its own secret).
export const generateCrimeLevel = (npc, npcIndex, summary, allNpcs, held = null) => {
  const { stressType, commodity, govFaction, topFaction } = summary;

  // 25% chance: NPC knows something compromising about another NPC
  if (random01(0.25) && allNpcs.length > 1) {
    const otherNpc = pickRandom2(allNpcs.filter((_, idx) => idx !== npcIndex));
    return drawDeclared([
      {
        what: `Knows something about ${otherNpc.name} that ${otherNpc.name} believes no one else knows, and has been deciding for months whether to use it`,
        stakes: `${otherNpc.name} would move against them immediately if they suspected`,
      },
      {
        what: `Was present when ${otherNpc.name} did something they've never accounted for publicly. Neither has acknowledged the other was there`,
        stakes: "The situation they're both ignoring is becoming relevant again",
      },
      {
        what: `Owes ${otherNpc.name} a debt from before either of them held their current position: one that ${otherNpc.name} has never formally called in`,
        stakes: 'The silence feels like patience, and it is not forgiveness',
      },
      {
        what: `Has been reading ${otherNpc.name}'s correspondence through an intermediary. Nothing damaging yet. But they keep looking`,
        stakes: 'The intermediary has recently started asking for more money',
      },
    ], { draw: pickRandom2, facts: () => factsOf({ npcs: allNpcs }), ctx: { npc: npcIndex }, key: `${getActiveRng()?.seed ?? ''}::npcGenerator:CRIME_KNOWLEDGE`, poolId: 'npcGenerator:CRIME_KNOWLEDGE', surface: 'npcs', drawKind: 'R', held, heldKey: (s) => s.what }).line; // MERGE-R2: REVIEW-INTAKE-4's held secrets refused before the draw
  }

  // 45% chance: stress-driven institutional secret
  // F3 FOOD-WORDS: a secret that says people are starving only where the food record goes hungry
  // WIRING-W0 (R-W7 e): a secret tagged with a migration direction is drawn only where the record declares that direction
  const stressEffects = secretsHeldByFoodRecord((summary.stressTypes || (stressType ? [stressType] : [])).flatMap(s => STRESS_INSTITUTION_EFFECTS[s] || []).filter(e => !e.direction || e.direction === (summary.migrationDirection || 'arrivals')), summary.foodRecord);
  if (stressEffects.length > 0 && random01(0.45)) {
    const otherNpc = otherNpcOf({ npcs: allNpcs }, npcIndex); // CENSUS-1 fact 14: the other-NPC home's selection — MERGE-R2: read before the draw, so the held key reads the text the figure would carry
    const effect = drawDeclared(stressEffects, { draw: pickRandom2, facts: summary.facts ?? (() => factsOf({ npcs: allNpcs, stress: (summary.stressTypes || (stressType ? [stressType] : [])).map((type) => ({ type, ...(type === 'mass_migration' && summary.migrationDirection ? { direction: summary.migrationDirection } : {}) })), economicState: { foodSecurity: { foodRecord: summary.foodRecord } } })), ctx: { npc: npcIndex }, key: `${getActiveRng()?.seed ?? ''}::stressInstitutionEffects:STRESS_INSTITUTION_EFFECTS`, poolId: 'stressInstitutionEffects:STRESS_INSTITUTION_EFFECTS', surface: 'npcs', drawKind: 'R', held, heldKey: (e) => fillSentenceSlots(e.secret, { faction: topFaction, commodity, npc: otherNpc?.name }, { npc: 'someone' }) }).line; // CENSUS-1c + CENSUS-4: ⚠ the 0.45 roll stays on the food-filtered pool's emptiness (§2.2); the whole record's facts when the summary carries them (narrativeGenerator :: enrichNpcCoherence), else the partial record // MERGE-R2: REVIEW-INTAKE-4's held refusal; W0's direction on the partial record's migration entry
    if (effect) return {
      what: fillSentenceSlots(effect.secret, { faction: topFaction, commodity, npc: otherNpc?.name }, { npc: 'someone' }), // F11: a fallback that opens a sentence is sentence-cased
      stakes: fillSentenceSlots(effect.stakes, { faction: govFaction, commodity, npc: otherNpc?.name }, { npc: 'someone' }),
    };
  }

  return null;
};

// getStressHistory
export const getStressHistory = secret => {
  if (!secret?.what) return null;
  const what = secret.what.toLowerCase();

  // Spy/informant/traitor behaviour patterns → calm, trustworthy surface
  const isDangerous =
    what.includes('negotiating') ||
    what.includes('selling information') ||
    what.includes('selling patrol') ||
    what.includes('feeding information') ||
    what.includes('feeding') ||
    what.includes('betrayer') ||
    what.includes('infiltrator') ||
    what.includes('patrol routes') ||
    what.includes('occupation authority') ||
    what.includes('without the council') ||
    (what.includes('resistance') && what.includes('identified')) ||
    what.includes('passed information') ||
    what.includes('cell') ||
    what.includes('surrendered') ||
    what.includes('names to avoid') ||
    what.includes('legitimise') ||
    what.includes('names to') ||
    what.includes('abandon') ||
    what.includes('leave before') ||
    what.includes('personal arrangements');

  // Hidden corruption/profit patterns → professional, busy surface
  const isCompromised =
    what.includes('privately') ||
    what.includes('private arrangement') ||
    what.includes('side payment') ||
    what.includes('embezzl') ||
    what.includes('hidden cache') ||
    what.includes('suppress') ||
    what.includes('false report') ||
    what.includes('false harvest') ||
    what.includes('covert route') ||
    what.includes('private source') ||
    what.includes('documentation proving') ||
    what.includes('private terms') ||
    (what.includes('secret') && what.includes('cache')) ||
    what.includes('hoarding');

  // Information-holder patterns → ordinary, unremarkable surface
  const isSignificant =
    what.includes('documentation') ||
    what.includes('evidence') ||
    what.includes('knows') ||
    what.includes('original') ||
    what.includes('clause');

  if (isDangerous) return pickRandom2(NPC_PRESENTATION_MODES.dangerous_presents_safe);
  if (isCompromised) return pickRandom2(NPC_PRESENTATION_MODES.compromised_presents_professional);
  if (isSignificant && random01(0.5)) return pickRandom2(NPC_PRESENTATION_MODES.significant_presents_ordinary);
  return null;
};

// The live faction-pair archetype selector is power/relationshipArchetypes.js :: computeRelTension.

const _pickFactionName = r => {
  var o;
  const s = {};
  return (
    r.forEach(d => {
      s[d.category] = (s[d.category] || 0) + 1;
    }),
    ((o = Object.entries(s).sort((d, l) => l[1] - d[1])[0]) == null ? void 0 : o[0]) || 'other'
  );
};

export const mergeNPCLists = (npcs, factions, institutions, _tier, _config) => {
  if (!npcs || !factions || npcs.length === 0 || factions.length === 0) return npcs;


  // Find key faction references — category-first so generic names like "Religious Authorities" still match
  const govFaction = factions.find(f => f.isGoverning) || factions[0];
  const crimeFaction = factions.find(
    f =>
      f.category === 'criminal' ||
      f.faction?.toLowerCase().includes('thieve') ||
      f.faction?.toLowerCase().includes('criminal') ||
      f.faction?.toLowerCase().includes('smuggl') ||
      f.faction?.toLowerCase().includes('underworld'),
  );
  // ⛔ NO NETWORK IS NAMED WHERE NONE EXISTS (lane RUNG1B-F4 unit 3, 2026-11-04;
  // docs/F4_CRIME_SIGNAL_2026-11-04.md). This tail runs after the density law's trim, on the FINAL
  // roster and estate, so it reads the crime signal's one home (`domain/crimeSignal.js`): with no
  // criminal faction and no criminal house, no NPC is filed under a "criminal network" or a
  // "Thieves' Guild" (471 and 17 NPCs in 1,000 soak places), and a secret or goal naming a
  // thieves' guild takes the pool's own "a powerful outside interest". No draw.
  const noCrime = !crimeFaction && !crimeSignalOf({ seats: factions, estate: institutions }).present;
  const milFaction = factions.find(
    f =>
      f.category === 'military' ||
      f.faction?.toLowerCase().includes('garrison') ||
      f.faction?.toLowerCase().includes('guard') ||
      f.faction?.toLowerCase().includes('military') ||
      f.faction?.toLowerCase().includes('watch') ||
      f.faction?.toLowerCase().includes('militia'),
  );
  const relFaction = factions.find(
    f =>
      f.category === 'religious' ||
      f.faction?.toLowerCase().includes('church') ||
      f.faction?.toLowerCase().includes('temple') ||
      f.faction?.toLowerCase().includes('clergy') ||
      f.faction?.toLowerCase().includes('faith') ||
      f.faction?.toLowerCase().includes('priest') ||
      f.faction?.toLowerCase().includes('order') ||
      f.faction?.toLowerCase().includes('holy') ||
      f.faction?.toLowerCase().includes('diocese'),
  );
  const nobleFaction = factions.find(
    f =>
      f.category === 'noble' ||
      f.faction?.toLowerCase().includes('noble') ||
      f.faction?.toLowerCase().includes('lord') ||
      f.faction?.toLowerCase().includes('aristocrat') ||
      f.faction?.toLowerCase().includes('gentry') ||
      f.faction?.toLowerCase().includes('manor'),
  );
  const craftsFaction = factions.find(
    f =>
      f.category === 'crafts' ||
      (f.faction?.toLowerCase().includes('craft') && !f.faction?.toLowerCase().includes('merchant')),
  );

  // Role keyword → faction mapping (first match wins)
  // Find magic faction for direct wizard/mage role mapping
  const magicFaction = factions.find(
    f =>
      f.category === 'magic' ||
      f.faction?.toLowerCase().includes('mage') ||
      f.faction?.toLowerCase().includes('arcane') ||
      f.faction?.toLowerCase().includes('wizard') ||
      f.faction?.toLowerCase().includes('academy'),
  );
  const econFaction = factions.find(
    f =>
      f.category === 'economy' ||
      f.faction?.toLowerCase().includes('merchant') ||
      f.faction?.toLowerCase().includes('guild') ||
      f.faction?.toLowerCase().includes('trade'),
  );

  const ROLE_FACTION_MAP = [
    // Civic / government
    ['elder', govFaction],
    ['mayor', govFaction],
    ['reeve', govFaction],
    ['steward', govFaction],
    ['magistrate', govFaction],
    ['council', govFaction],
    ['lord', govFaction],
    ['governor', govFaction],
    ['chancellor', govFaction],
    ['judge', govFaction],
    ['sheriff', govFaction],
    ['official', govFaction],
    // Military / enforcement
    ['captain', milFaction],
    ['commander', milFaction],
    ['constable', milFaction],
    ['warden', milFaction],
    ['marshal', milFaction],
    ['quartermaster', milFaction],
    ['garrison', milFaction],
    ['knight', milFaction],
    ['sergeant', milFaction],
    // Religious
    ['priest', relFaction],
    ['cleric', relFaction],
    ['bishop', relFaction],
    ['abbot', relFaction],
    ['monk', relFaction],
    ['friar', relFaction],
    ['inquisitor', relFaction],
    ['prelate', relFaction],
    ['healer', relFaction],
    ['archivist', relFaction],
    ['chaplain', relFaction],
    ['deacon', relFaction],
    // Magic / arcane
    ['wizard', magicFaction],
    ['mage', magicFaction],
    ['archmage', magicFaction],
    ['alchemist', magicFaction],
    ['enchant', magicFaction],
    ['druid', magicFaction],
    ['sage', magicFaction],
    ['scholar', magicFaction],
    ['sorcerer', magicFaction],
    ['hedge wizard', magicFaction],
    ['guild archmage', magicFaction],
    // Economy / commerce
    ['merchant', econFaction],
    ['guild master', econFaction],
    ['factor', econFaction],
    ['overseer', econFaction],
    ['moneylender', econFaction],
    ['banker', econFaction],
    ['tradesman', econFaction],
    ['broker', econFaction],
    ['harbour master', econFaction],
    // Criminal
    ['thief', crimeFaction],
    ['smuggler', crimeFaction],
    ['fence', crimeFaction],
    ['crime lord', crimeFaction],
    ['assassin', crimeFaction],
    ['bandit', crimeFaction],
    ['racketeer', crimeFaction],
    ['corrupt official', crimeFaction],
    // Noble
    ['baron', nobleFaction],
    ['baroness', nobleFaction],
    ['duke', nobleFaction],
    ['duchess', nobleFaction],
    ['lord', nobleFaction],
    ['lady', nobleFaction],
    ['manor', nobleFaction],
    ['noble heir', nobleFaction],
    ['knight', nobleFaction],
    ['dame', nobleFaction],
    ['chamberlain', nobleFaction],
    ['land agent', nobleFaction],
    // Crafts
    ['master blacksmith', craftsFaction],
    ['master carpenter', craftsFaction],
    ['master weaver', craftsFaction],
    ['master tanner', craftsFaction],
    ['head brewer', craftsFaction],
    ['guild warden', craftsFaction],
    ['master potter', craftsFaction],
    ['master glassblower', craftsFaction],
    ['craft guild', craftsFaction],
    ['journeyman overseer', craftsFaction],
  ]
    .filter(([, f]) => f != null) // drop entries where no matching faction exists
    // Match most-specific keyword first: the map is grouped by faction for
    // readability, but a plain first-match loop let generic substrings shadow
    // specific roles — 'lord' (gov) caught 'lord of the manor' and 'crime lord',
    // 'official' caught 'corrupt official', 'council' caught 'Shadow Council Leader'.
    // Sorting by keyword length descending makes the longest match win.
    .sort((a, b) => b[0].length - a[0].length);

  // ── Power-proportional target slots ──────────────────────────────────────
  // Each faction gets a target NPC count proportional to its power score.
  // The fallback assignment weights by *remaining capacity* (target - current),
  // so the NPC distribution converges toward the faction power distribution.
  const totalPower = factions.reduce((s, f) => s + (f.power || 1), 0);
  const factionTarget = new Map();
  factions.forEach(f => {
    const proportional = ((f.power || 1) / totalPower) * npcs.length;
    factionTarget.set(f.faction, Math.max(1, Math.round(proportional)));
  });

  // Track how many NPCs have actually been assigned to each faction
  const factionAssignCount = new Map(factions.map(f => [f.faction, 0]));

  // Category compatibility — gates which faction types each NPC category can join
  const CATEGORY_COMPAT = {
    government: ['government', 'noble', 'military', 'economy'],
    military: ['military', 'government', 'noble'],
    economy: ['economy', 'crafts', 'government', 'criminal'],
    crafts: ['economy', 'crafts', 'government'],
    religious: ['religious', 'magic', 'government'],
    magic: ['magic', 'religious', 'economy'],
    criminal: ['criminal', 'economy'],
    noble: ['noble', 'government', 'military'],
    other: null, // generalists — no restriction
  };

  return npcs.map((npc, idx) => {
    const enriched = { ...npc };
    const roleLower = (npc.role || '').toLowerCase();

    // ── Pass 1: role keyword → direct faction lock ────────────────────────
    let assignedFaction = null;
    for (const [keyword, faction] of ROLE_FACTION_MAP) {
      if (faction && roleLower.includes(keyword)) {
        assignedFaction = faction;
        break;
      }
    }

    // ── Pass 2: capacity-weighted, category-compatible fallback ───────────
    // Weight by remaining capacity (target - current) so assignment naturally
    // converges to the faction power distribution.
    if (!assignedFaction && factions.length > 0) {
      // ⚠ NOT `npc.category` DIRECTLY. The catalog's generalist bucket stamps
      // 'other', CATEGORY_COMPAT reads 'other' as "any faction at all", and that is
      // how a Mercenary-for-Hire came out filed under the Religious Authorities.
      // factionPoolCategory falls back to the ROLE when the bucket declines to
      // classify; see roleCategory.js for why the cure is not a wider keyword map.
      // It narrows the pool only — the single `_rng()` roll below is unmoved.
      const compat = CATEGORY_COMPAT[factionPoolCategory(npc, roleLower)]; // null/absent = unrestricted

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
        if (roll <= 0) {
          assignedFaction = f;
          break;
        }
      }
      if (!assignedFaction) assignedFaction = pool[0];
    }

    // PEOPLE-LAND (M-2, the shim out): the keyword cascade no longer writes `factionAffiliation`; a
    // card's powers are its `memberships` (people/castPowers.js). The draw and the capacity count stay,
    // so the stream after them does not move.
    if (assignedFaction) {
      factionAssignCount.set(assignedFaction.faction, (factionAssignCount.get(assignedFaction.faction) || 0) + 1);
    }

    // Detect criminal affiliation from secret text
    if (npc.secret && typeof npc.secret === 'object') {
      const secretText = ((npc.secret.what || '') + ' ' + (npc.secret.stakes || '')).toLowerCase();
      const isCriminalSecret =
        secretText.includes('brib') ||
        secretText.includes('embezzl') ||
        secretText.includes('skim') ||
        secretText.includes('forg') ||
        secretText.includes('blackmail') ||
        secretText.includes('extort') ||
        secretText.includes('smuggl') ||
        secretText.includes('fence') ||
        secretText.includes('stolen') ||
        secretText.includes('protection money') ||
        secretText.includes('criminal') ||
        secretText.includes('thieves') ||
        secretText.includes('illicit') ||
        secretText.includes('corrupt') ||
        (secretText.includes('paying') &&
          (secretText.includes('gang') || secretText.includes('guild') || secretText.includes('crew')));
      const notAlreadyCrime = assignedFaction && assignedFaction !== crimeFaction;
      const roleIsNotCrime =
        !roleLower.includes('fence') &&
        !roleLower.includes('smuggl') &&
        !roleLower.includes('thief') &&
        !roleLower.includes('assassin') &&
        !roleLower.includes('criminal');
      // PEOPLE-LAND (M-2): `secondaryAffiliation` is no longer written (a criminal secret's house
      // rides on the corruption pass's `corruptTies`); the test above stays a pure read.
      void (isCriminalSecret && notAlreadyCrime && roleIsNotCrime && !noCrime);
    }

    // First NPC inherits governing faction goal context
    if (idx === 0 && govFaction && npc.goal) {
      const govDesc = govFaction.desc || '';
      if (
        govDesc.toLowerCase().includes('constrain') ||
        govDesc.toLowerCase().includes('challeng') ||
        govDesc.toLowerCase().includes('compet')
      ) {
        // PEOPLE-LAND (M-2): `factionGoal` is no longer written; the goal itself carries the pressure.
      }
    }

    // Sanitise criminal guild references if no criminal infrastructure
    if (npc.secret && typeof npc.secret === 'object') {
      const secretText = (npc.secret.what || '') + ' ' + (npc.secret.stakes || '');
      const mentionsCriminalGuild =
        secretText.toLowerCase().includes('thieves') ||
        (secretText.toLowerCase().includes('guild') && secretText.toLowerCase().includes('criminal'));
      // F4 unit 3: the guard reads the crime signal (it implies the old institution-name test), and
      // the pattern reads "the thieves' guild" too: the pool spells it with the apostrophe, which
      // `/thieves guild/` never matched, so the secret printed unsanitised in 17 soak places.
      if (mentionsCriminalGuild && noCrime) {
        enriched.secret = {
          what: withoutCriminalGuild(npc.secret.what || ''),
          stakes: npc.secret.stakes,
        };
      }
    }

    return enriched;
  });
};

// sortNPCsByPriority
const _sortNPCsByPriority = function (historicalEvents, currentTensions, _tier) {
  if (!historicalEvents || historicalEvents.length === 0) return currentTensions;

  // Sort history by recency (most recent first)
  const sortedHistory = historicalEvents.slice().sort((a, b) => b.yearsAgo - a.yearsAgo);

  // Events that logically precede or follow others (avoid showing "cause" without "effect")
  const NARRATIVE_SEQUENCES = {
    'Bank Collapse': ['Resource Boom', 'Trade Route Opened', 'The Monopoly'],
    'Debt Collapse': ['Resource Boom', 'Trade Route Opened'],
    'The Famine': ['Resource Boom'],
    'Trade Route Closed': ['Trade Route Opened'],
    'The Great Exile': ['The Return', 'The Great Migration'],
    'Demographic Collapse': ['The Great Migration', 'The Return'],
    Occupation: ['Independence Gained', 'The Rebellion'],
    Betrayal: ['Infiltration Revealed'],
    'Succession Crisis': ['Founding Charter Granted', 'Independence Gained'],
    'Heresy Purge': ['Religious Schism', 'False Prophet'],
    'Temple Sacked': ['Cathedral Consecrated', "Saint's Miracle"],
  };

  // Find events that have their narrative consequence present (suppress the cause)
  const suppressedEvents = new Set();
  for (let i = 0; i < sortedHistory.length; i++) {
    const followups = NARRATIVE_SEQUENCES[sortedHistory[i].name] || [];
    const hasFollowup = followups.length > 0 && sortedHistory.slice(i + 1).some(e => followups.indexOf(e.name) >= 0);
    if (hasFollowup) suppressedEvents.add(sortedHistory[i].name);
  }

  // Filter tensions: suppress if their linked history event is too old or suppressed
  const MAX_RELEVANT_YEARS = 150;
  const filtered = (currentTensions || []).filter(tension => {
    const linkedEvent = historicalEvents.find(e => e.type === tension.type);
    if (!linkedEvent) return true; // no linked event, keep the tension
    if (suppressedEvents.has(linkedEvent.name)) return false;
    if (linkedEvent.yearsAgo > MAX_RELEVANT_YEARS && linkedEvent.severity !== 'catastrophic' && !linkedEvent.anchored)
      return false;
    return true;
  });

  // If filtering removed everything, return the single most relevant tension
  if (filtered.length === 0 && (currentTensions || []).length > 0) {
    return [
      (currentTensions || []).slice().sort((a, b) => {
        const ea = historicalEvents.find(e => e.type === a.type);
        const eb = historicalEvents.find(e => e.type === b.type);
        return (ea ? ea.yearsAgo : 999) - (eb ? eb.yearsAgo : 999);
      })[0],
    ];
  }

  return filtered;
};

// ─── Inlined cross-module helpers (cycle-free) ─────────────

// ─── NPC name helpers ─────────────────────

// ─────────────────────────────────────────────────────────

// generateNPCs

// ─────────────────────────────────────────────────────────

// generateNPCs
export const generateNPCs = (
  settlement,
  culture = 'germanic',
  config = {},
  generationContext = null,
  massTarget = null,
) => {
  const { tier, institutions } = settlement;
  const worldLaw = resolveGenerationWorldLaw(generationContext, config);
  const weights = { ...computeNPCWeights(config, institutions), tradeRouteAccess: config?.tradeRouteAccess || 'road' };
  const { min, max } = getNPCCountRange(tier);
  // ⛔ THE ROLL IS UNCONDITIONAL. `massTarget` (ODQ §810's tier-gated mass band,
  // supplied only under the Register VII density law) overrides the RESULT, never
  // the draw — so a v1 world's stream position here, and everything downstream of
  // it, is character-for-character what it always was. `getNPCCountRange`'s table
  // IS the v1 mass band and stays the authority for every pre-law world.
  const rolledCount = Math.max(randInt(min, max), Number(config?._minNpcCount) || 0);
  const targetCount = Number(massTarget) > 0 ? Math.round(Number(massTarget)) : rolledCount;
  const npcs = [];
  // Settlement-scoped anti-repetition draw registry: shared across EVERY NPC in
  // this population, so the same loyalty STRING is never emitted twice (`titles`,
  // wave E batch E2) and the same BEAT is not retold in a different string while
  // an untold one is still available (`themes`, wave HK-3). This is the machinery
  // behind the hook repeat-rate and theme-repeat envelopes; see hookVariety.js.
  // `tells` and `speech` join it for cs-a/CS-A1 (gen-1a): MANNERISMS and
  // SPEECH_PATTERNS are 30 authored entries each and were drawn WITH replacement
  // across ~18 NPCs in a metropolis, so 120/240 settlements repeated a tell and
  // 128/240 a speech pattern. drawUnique spends exactly one seeded roll in every
  // arm (HK-LAW-6), so routing these two draws through it is roll-for-roll
  // neutral — measured 0 of 32 seeds shifting their total roll count.
  // `goals` and `secrets` join it for REVIEW-INTAKE-4: a figure's goal or secret is never a text
  // another figure of this roster already carries (drawRefusingHeld; no extra roll).
  const hookRegistry = { titles: new Set(), themes: new Set(), tells: new Set(), speech: new Set(), goals: new Set(), secrets: new Set() };
  // R6 (soak 1000 rung 1, kind 4): a Guard Captain captains a standing force on the place's own
  // record, not the tier's (domain/defense/defenseFacts.js :: defenceRoleGate).
  const candidates = getUpgradeOpportunities(institutions, tier, weights)
    .filter(worldLaw.allowsRole).filter(defenceRoleGate({ institutions }));

  // ── Inject faction-gated NPC roles ────────────────────────────────────────
  // Noble and crafts roles only appear when those faction types exist in the
  // power structure. getUpgradeOpportunities can't see the power structure,
  // so we inject them here if they're not already in the candidate pool.
  const powerFactionCats = new Set((settlement.powerStructure?.factions || []).map(f => f.category).filter(Boolean));
  const tierIdx = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'].indexOf(tier);
  const tierOk = minTier => tierIdx >= ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'].indexOf(minTier);

  if (powerFactionCats.has('noble')) {
    const existingRoles = new Set(candidates.map(c => c.role));
    NOBLE_ROLES
      .filter(role => worldLaw.allowsRole(role))
      .filter(role => tierOk(role.minTier) && !existingRoles.has(role.role))
      .forEach(role => candidates.push({
        ...role,
        effectivePriority: role.priority,
      }));
  }
  if (powerFactionCats.has('crafts') || powerFactionCats.has('economy')) {
    // Inject crafts-specific roles when a crafts OR economy faction exists (Craft Guilds have category=economy)
    const existingRoles = new Set(candidates.map(c => c.role));
    const hasGuild = institutions.some(isCommerceGuild);
    const waterRoute = typeof config?.tradeRouteAccess === 'string' && waterAccessKind('', config.tradeRouteAccess) !== 'none'; // CENSUS-1 fact 4: the water home's rule ('coastal' is a terrain, never a route)
    const hasPort =
      waterRoute ||
      institutions.some(
        i =>
          /\b(?:port|harbou?r)\b/.test(nativeSemanticName(i).toLowerCase()), // F5 unit 6: word-bounded — the substring read "Teleportation circle" as a port
      );
    CRAFTS_ROLES
      .filter(role => worldLaw.allowsRole(role))
      .filter(r => tierOk(r.minTier) && !existingRoles.has(r.role))
      .filter(r => !r.requiresGuild || hasGuild)
      .filter(r => !r.requiresPort || hasPort)
      .forEach(r => candidates.push({ ...r, effectivePriority: r.priority }));
  }

  const stresses = config.stressTypes?.length ? config.stressTypes : config.stressType ? [config.stressType] : [];
  const primaryStress = stresses[0] || null;

  // Tier-appropriate mandatory roles.
  const thorpSecondRole = deriveThorpSecondRole(settlement, config);

  const TIER_MANDATORY_ROLES = {
    thorp: ['Elder', thorpSecondRole],
    hamlet: ['Elder', 'Priest'],
    village: ['Mayor', 'Guard Captain'],
    town: ['Mayor', 'Guard Captain', 'High Priest'],
    city: ['Mayor', 'Guard Captain', 'High Priest', 'Wealthiest Merchant'],
    metropolis: ['Governor', 'City Watch Chief', 'High Priest', 'Guild Archmage', 'Wealthiest Merchant'],
  };

  // Stress-driven additional mandatory roles
  const STRESS_MANDATORY_ROLES = {
    under_siege: ['Garrison Commander', 'Guard Captain'],
    famine: ['Healer', 'Guild Master'],
    occupied: ['Corrupt Official'],
    politically_fractured: ['Council Member', 'Council Member'],
    indebted: ['Moneylender'],
    recently_betrayed: ['Chief Magistrate'],
    infiltrated: [],
    plague_onset: ['Healer', 'Priest'],
    succession_void: ['Council Member', 'Chief Magistrate'],
    monster_pressure: ['Garrison Commander', 'Retired Adventurer'],
    insurgency: ['Chief Magistrate', 'Corrupt Official'],
    mass_migration: ['Guild Master', 'Healer'],
    wartime: ['Garrison Commander', 'Guild Master'],
    religious_conversion: ['Priest', 'Council Member'],
    slave_revolt: ['Garrison Commander', 'Guard Captain'],
  };

  const tierRoles = TIER_MANDATORY_ROLES[tier] || [];
  const stressRoles = (primaryStress && STRESS_MANDATORY_ROLES[primaryStress]) || [];
  // Dedup tier roles, and drop stress roles already supplied by the tier (e.g.
  // under_siege's 'Guard Captain' when the tier already mandates one), but PRESERVE
  // intentional duplicates within a stress list — politically_fractured deliberately
  // wants two rival 'Council Member's, which a flat Set used to collapse to one.
  const tierRolesU = [...new Set(tierRoles)];
  const tierRoleSet = new Set(tierRolesU);
  const stressContribution = stressRoles.filter(r => !tierRoleSet.has(r));
  const mandatoryRoles = [...tierRolesU, ...stressContribution]
    .filter(worldLaw.allowsRole).filter(defenceRoleGate({ institutions })); // R6, as the pool above

  // Build config context for NPC generation
  const npcConfig = {
    ...config,
    _tradeCommodity: deriveTradeCommodity(settlement.economicState, { firstWordFallback: true }),
    _dominantFaction: settlement.powerStructure?.factions?.[0]?.faction || null, _government: settlement.powerStructure?.government ?? null, // CENSUS-4d (R-V): the goal draw reads the ruler kind it already has (birthFactsOf); the government ONLY — a guild faction is not settled at the draw
    _prosperity: settlement.economicState?.prosperity || null,
  };

  // THE SEAT IS MANDATED (soak 1000 row 20, soak1k-694; the seat read is
  // domain/dossier/seatHolder.js :: TIER_HEAD, a mirror of this table's first roles). The
  // candidate pool offers a 'government' role only where a government-shelf institution
  // stands, and since the 2026-09-30 reshelving the City hall is on infrastructure, so a city
  // with no government row minted no Mayor and its council sat unseated. The tier's head is
  // minted from its own row (mandatedRoleCandidate) when the pool dropped it; every other
  // settlement's pool already holds it, so no other draw moves.
  // Generate mandatory role NPCs first
  mandatoryRoles.forEach(role => {
    const candidate = candidates.find(c => c.role === role) || (role === tierRolesU[0] ? mandatedRoleCandidate(role) : undefined);
    if (candidate && npcs.length < targetCount) {
      npcs.push(generateSingleNPC(
        candidate.role,
        candidate.title,
        candidate.category,
        culture,
        tier,
        npcConfig,
        institutions,
        hookRegistry,
        worldLaw,
      ));
    }
  });

  // Add a guild-master NPC if we have room
  if (npcs.length < targetCount) {
    const guildNPC = filterByGuild(
      institutions,
      culture,
      tier,
      npcConfig,
      hookRegistry,
      worldLaw,
    );
    if (guildNPC) npcs.push(guildNPC);
  }

  // Fill remaining slots with weighted-random candidates
  const usedRoles = new Set(npcs.map(n => n.role));
  const remainingCandidates = candidates.filter(c => !usedRoles.has(c.role));

  while (npcs.length < targetCount && remainingCandidates.length > 0) {
    const totalWeight = remainingCandidates.reduce((sum, c) => sum + (c.effectivePriority ?? c.priority), 0);
    let roll = _rng() * totalWeight;
    let chosen = null;

    for (const candidate of remainingCandidates) {
      roll -= candidate.effectivePriority ?? candidate.priority;
      if (roll <= 0) {
        chosen = candidate;
        break;
      }
    }
    if (!chosen) chosen = remainingCandidates[0];

    npcs.push(generateSingleNPC(
      chosen.role,
      chosen.title,
      chosen.category,
      culture,
      tier,
      npcConfig,
      institutions,
      hookRegistry,
      worldLaw,
    ));
    usedRoles.add(chosen.role);
    remainingCandidates.splice(remainingCandidates.indexOf(chosen), 1);
  }

  // Assign sequential IDs
  npcs.forEach((npc, idx) => {
    npc.id = `npc_${idx + 1}`;
  });

  // Resolve the display layer before relationships copy names out of the NPC
  // records. This is draw-free, so it preserves all downstream RNG ordering.
  return disambiguateNPCDisplayNames(npcs);
};

// generateRelationships — RETIRED (the people car, PEOPLE-4 TIES, 2026-11-07; R-P7): the pair
// saturation (every NPC in two or three undirected ties) gave way to ONE outgoing tie per card,
// drawn at the coherence seam by people/ties.js :: drawTies. The rung-2 landing's two additions to the
// retired writer are carried there (MERGE-CAR): CENSUS-4 R3's tie rule (npc/tieKind.js :: tieArchetype)
// and CENSUS-1f's declared facts (the tier and the government) into createTieProseDraw.

// generateSettlementName
export const generateSettlementName = (r = 'germanic') => {
  const prefixData = NAMING_DATA[resolveNameCulture(r)] || NAMING_DATA.germanic; const suffixData = NAMING_DATA[r === 'mixed' ? resolveNameCulture(r) : resolveNameCulture(r)] || prefixData; // LANDING-R2: one line, so the merged file meets rung 1's banked ceiling (1287)
  return `${prefixData.settlementPrefixes[Math.floor(_rng() * prefixData.settlementPrefixes.length)]}${suffixData.settlementSuffixes[Math.floor(_rng() * suffixData.settlementSuffixes.length)]}`;
};

/**
 * DECLARED SIBLINGS (CENSUS-1c unit 1; the twin tables dissolved, `docs/DESIGN_POOL_CENSUS.md`
 * §3.1): the siege goal (`STRESS_GOALS.under_siege`), the wartime military override and its note (`STRESS_GOAL_OVERRIDES.wartime.mil`). The original stays where it is spelled above; the twin stands beside it here with
 * the complementary atom, and the site resolves a drawn key through `resolveSibling`. Retired from
 * `data/defenceTwinLines.js` (F10 unit 4), every twin to the byte.
 */
export const NPC_GOAL_SIBLINGS = Object.freeze({ 'Identify the person inside the walls who is communicating with the besiegers': Object.freeze([ Object.freeze({ text: 'Identify the person inside the walls who is communicating with the besiegers', needs: Object.freeze(['walls']) }), Object.freeze({ text: 'Identify the person inside the settlement who is communicating with the besiegers', twinOf: 'Identify the person inside the walls who is communicating with the besiegers', excludes: Object.freeze(['walls']) }), ]), 'Keep unit cohesion as conscription pulls away experienced soldiers and replaces them with frightened substitutes': Object.freeze([ Object.freeze({ text: 'Keep unit cohesion as conscription pulls away experienced soldiers and replaces them with frightened substitutes', needs: Object.freeze(['soldiers']) }), Object.freeze({ text: 'Keep the defenders together as the call-up pulls away experienced hands and replaces them with frightened substitutes', twinOf: 'Keep unit cohesion as conscription pulls away experienced soldiers and replaces them with frightened substitutes', excludes: Object.freeze(['soldiers']) }), ]), 'Each experienced soldier sent to the field army is replaced by a frightened substitute who does not yet know the work.': Object.freeze([ Object.freeze({ text: 'Each experienced soldier sent to the field army is replaced by a frightened substitute who does not yet know the work.', needs: Object.freeze(['soldiers']) }), Object.freeze({ text: 'Each experienced hand called up into the field army is replaced by a frightened substitute who does not yet know the work.', twinOf: 'Each experienced soldier sent to the field army is replaced by a frightened substitute who does not yet know the work.', excludes: Object.freeze(['soldiers']) }), ]), });
