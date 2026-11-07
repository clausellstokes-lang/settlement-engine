/**
 * power/relationshipArchetypes.js — select the relationship archetype (a
 * STRESS_ECONOMIC_EFFECTS entry) between two factions from their category
 * pair, power gap, personalities and active stress flags.
 */
import { random as _rng } from '../../kernel/rngContext.js';
import { fnv1a32 } from '../../kernel/proseHash.js';
import { STRESS_ECONOMIC_EFFECTS } from '../../data/npcData.js';
import { drawDeclared } from '../../domain/facts/drawDeclared.js';

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

/** Two stand-in names no generated NPC carries, for reading which lines name both parties. */
const PARTY_A = { name: 'Party-A-of-the-tie' };
const PARTY_B = { name: 'Party-B-of-the-tie' };
/** @type {WeakMap<object, number[]>} */
const bothNamedCache = new WeakMap();
/** The indices of an archetype's tension lines that name BOTH parties (pure; cached per archetype). */
const bothNamedTensions = (archetype) => {
  let indices = bothNamedCache.get(archetype);
  if (!indices) {
    indices = [];
    for (let index = 0; index < archetype.tension.size; index++) {
      const line = archetype.tension(PARTY_A, PARTY_B, index);
      if (line.includes(PARTY_A.name) && line.includes(PARTY_B.name)) indices.push(index);
    }
    bothNamedCache.set(archetype, indices);
  }
  return indices;
};

/** @type {WeakMap<object, ReadonlyArray<Readonly<{ id: number, needs: string[], excludes: string[], crisis: string[] }>>>} */
const pairPoolCache = new WeakMap();
/**
 * An archetype's tie indices as one declared pool: index i declares what its desc row
 * (`desc.lines[i % n]`) and its tension row (`tension.lines[i % m]`) declare, together (pure;
 * cached per archetype; frozen, so `drawDeclared` caches whether it declares at all). No tie row
 * declares a crisis (CENSUS-4c's ledger), so the union is a plain union.
 * @param {any} archetype
 */
const tiePairPool = (archetype) => {
  let pool = pairPoolCache.get(archetype);
  if (!pool) {
    const descLines = archetype.desc?.lines ?? [];
    const tensionLines = archetype.tension?.lines ?? [];
    /** @param {ReadonlyArray<any>} lines @param {number} i @param {'needs'|'excludes'|'crisis'} f @returns {string[]} */
    const field = (lines, i, f) => {
      const row = lines.length ? lines[i % lines.length] : null;
      return row && typeof row === 'object' && Array.isArray(row[f]) ? row[f] : [];
    };
    pool = Object.freeze(Array.from({ length: archetype.tension.size }, (_, id) => Object.freeze({
      id,
      needs: [...field(descLines, id, 'needs'), ...field(tensionLines, id, 'needs')],
      excludes: [...field(descLines, id, 'excludes'), ...field(tensionLines, id, 'excludes')],
      crisis: [...field(descLines, id, 'crisis'), ...field(tensionLines, id, 'crisis')],
    })));
    pairPoolCache.set(archetype, pool);
  }
  return pool;
};

/**
 * GS-1 (ODQ §934.101): THE TIE-PROSE DRAW, WITHOUT REPLACEMENT PER SETTLEMENT. One draw per
 * `generateRelationships` call (one town). The first tie of an archetype opens at a draw-free
 * fnv offset keyed on its own directed pair; each further tie of that archetype in the town takes
 * the next variant, so no description or tension line repeats on the page until the archetype's
 * whole pool is spent. Past that point the draw cycles through the lines that name BOTH parties
 * (when the pool has any), so an overflow tie can share a template with an earlier one but never
 * print the same sentence. ZERO rng draws: the relationship roll stream is untouched. The
 * returned `proseVariant` is stored on the tie because the line now depends on the rest of the
 * town, so a re-render under new names
 * (generateSettlementPipeline.js :: refreshRelationshipProjections) reuses it instead of re-hashing.
 * F1 (rung 1B): `force` is the place's force words (`defenseFacts.js :: forceWordsOf`), so a tie line
 * names the watch or the militia where no garrison stands; omitted, the lines keep the garrison's words.
 * CENSUS-1f (Appendix B site 19, H): the drawn index is RESOLVED through `drawDeclared` against
 * CENSUS-4c's in-place declarations (`npcData.js :: pairProse`'s `lines`). One index picks the desc
 * AND the tension line, so the index's declaration is the union of both rows' (`tiePairPool`). The
 * draw above is unchanged; a refused index moves to the hash argmax over the admitted indices (keyed
 * on the directed pair, so two ties of one archetype do not collapse onto one line). `facts` is the
 * birth's facts at the draw (R-V / R-Z: the roster and the government only; CENSUS-4c measured all
 * 30 declared rows settled there, 0 of 585 births differ); absent, a declared index is refused
 * (fail-closed, R-N).
 * @param {Readonly<{ body: string, members: string, member: string }>} [force]
 * @param {object | (() => object) | null} [facts]
 * @returns {(archetype: any, npc: {name?: string}, partner: {name?: string}) =>
 *   {archetypeKey: string | undefined, proseVariant: number, description: string, tension: string}}
 */
export const createTieProseDraw = (force, facts = null) => {
  /** @type {Map<unknown, {base: number, used: number}>} */
  const draws = new Map();
  return (archetype, npc, partner) => {
    const archetypeKey = Object.entries(STRESS_ECONOMIC_EFFECTS).find(([, value]) => value === archetype)?.[0];
    let draw = draws.get(archetype);
    if (!draw) {
      draw = { base: fnv1a32(`${npc?.name ?? ''}>${partner?.name ?? ''}::${archetypeKey ?? archetype?.label}`), used: 0 };
      draws.set(archetype, draw);
    }
    const size = archetype.tension.size;
    const named = bothNamedTensions(archetype);
    const drawnVariant = draw.used < size || named.length === 0
      ? (draw.base + draw.used) % size
      : named[(draw.base + draw.used - size) % named.length];
    draw.used += 1;
    const pool = tiePairPool(archetype);
    const resolved = drawDeclared(pool, {
      draw: (p) => p[drawnVariant], facts, key: `${npc?.name ?? ''}>${partner?.name ?? ''}::${archetypeKey ?? archetype?.label}`,
      poolId: `npcData:STRESS_ECONOMIC_EFFECTS.${archetypeKey ?? archetype?.label}`, surface: 'relationships', drawKind: 'H',
    });
    const proseVariant = resolved.line ? resolved.line.id : drawnVariant;
    return {
      archetypeKey,
      proseVariant,
      description: archetype.desc(npc, partner, proseVariant, force),
      tension: archetype.tension(npc, partner, proseVariant, force),
    };
  };
};
