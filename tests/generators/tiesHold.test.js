/**
 * tests/generators/tiesHold.test.js — TIES-HOLD (GOALS-4 builder 11; the chair's ruling of 2026-11-20 21:30 UTC):
 * WITHIN ONE PLACE, NO TIE PRINTS A TENSION OR A DESCRIPTION WHOSE TEMPLATE (NAMES MASKED) ANOTHER TIE OF THAT PLACE HAS
 * ALREADY PRINTED, while the archetype's pool or its reserve still holds a line not yet taken that the tie may print.
 *
 * Where today's resolved line is taken, the tie draw (`power/relationshipArchetypes.js :: createTieProseDraw`) walks the
 * archetype's pool in its keyed order from the drawn index, then the reserve, and takes the first line not yet taken that
 * the trust clause (the same declared trust, or none) and the line's own declarations allow; only where every such line
 * is taken does it print the least printed one. No draw is added or removed.
 *
 * A template is an archetype's line index (one index picks the description AND the tension; no two lines of the eighteen
 * archetypes or the handler table render one template, so the index is the template, names masked by construction). The
 * test is conservative: a repeat is a fault where an index unprinted before it was admitted for the tie's own pair by
 * its declarations (the facts `drawTies` hands, read as `narrativeQualityCorpus.test.js` reads them) AND declares no trust
 * (a no-trust line may stand in for any trust); a repeat of a line whose every alternative is refused, taken or of
 * another declared trust is the law's last rung, the least printed line.
 *
 * The corpus is `narrativeQualityCorpus.test.js`'s: twelve cities and twelve metropolises through `generateNPCs` and
 * `drawTies`, and its one overflow town (the twelve metropolis casts as one), whose ties spend every pool and reserve.
 *
 * @enforced-by npx vitest run tests/generators/tiesHold.test.js
 */
import { describe, expect, it } from 'vitest';
import { STRESS_ECONOMIC_EFFECTS, tieIndexOf } from '../../src/data/npcData.js';
import { declarationAdmits, declarationOf } from '../../src/domain/facts/factVocabulary.js';
import { birthFactsOf } from '../../src/domain/facts/factsOf.js';
import { generateNPCs } from '../../src/generators/npcGenerator.js';
import { drawTies } from '../../src/generators/people/ties.js';
import { createPRNG } from '../../src/kernel/prng.js';
import { clearActiveRng, setActiveRng } from '../../src/kernel/rngContext.js';

/** @template T @param {string} seed @param {() => T} work @returns {T} */
const withSeed = (seed, work) => {
  setActiveRng(createPRNG(seed));
  try { return work(); } finally { clearActiveRng(); }
};

const INSTITUTIONS = [
  { name: 'Town watch', category: 'Defense', tags: ['defense'] },
  { name: 'Parish church', category: 'Religious', tags: ['religious', 'church'] },
  { name: 'Merchant guilds (3-8)', category: 'Economy', tags: ['guild', 'trade'] },
];

/** `narrativeQualityCorpus.test.js`'s corpus: 12 cities, 12 metropolises, and the overflow town of the metropolis casts. */
const buildCorpus = () => {
  /** @type {Array<{ seed: string, tier?: string, npcs: any[], relationships: any[] }>} */
  const corpus = [];
  for (const tier of ['city', 'metropolis']) {
    for (let index = 0; index < 12; index++) {
      const seed = `tie-prose-draw-${tier}-${index}`;
      corpus.push(withSeed(seed, () => {
        const powerStructure = { factions: [{ faction: 'the town council', category: 'government', isGoverning: true }] };
        const npcs = generateNPCs(
          { tier, institutions: INSTITUTIONS, powerStructure, economicState: { primaryExports: ['Grain sales'], prosperity: 'Modest' } },
          'germanic',
          { stressTypes: ['politically_fractured'], priorityMilitary: 60, priorityEconomy: 60 },
        );
        return { seed, tier, npcs, relationships: drawTies(npcs, { config: {}, institutions: INSTITUTIONS, tier, government: null }, createPRNG(`${seed}::ties`)) };
      }));
    }
  }
  const surnames = ['Ash', 'Bree', 'Cole', 'Dun', 'Eld', 'Fenn', 'Gale', 'Holt', 'Ive', 'Jarl', 'Kell', 'Lorn'];
  const cast = corpus.filter((row) => row.seed.includes('metropolis'))
    .flatMap((row, r) => row.npcs.map((npc) => ({ ...npc, id: `${npc.id}_m${r}`, name: `${npc.name} of ${surnames[r]}` })));
  corpus.push({ seed: 'tie-prose-draw-overflow', npcs: cast, relationships: drawTies(cast, { config: {}, institutions: INSTITUTIONS }, createPRNG('tie-prose-draw-overflow::ties')) });
  return corpus;
};

/** The trust an index declares (its desc row's, else its tension row's). @param {any} archetype @param {number} i */
const trustOf = (archetype, i) => [archetype.desc.lines, archetype.tension.lines]
  .map((l) => l[i % l.length]).map((r) => (r && typeof r === 'object' ? r.trust : undefined)).find((t) => t !== undefined);

/** Every repeat of a template that an unprinted, admitted, no-trust index could have spared. */
const offendersOf = (/** @type {ReturnType<typeof buildCorpus>} */ corpus) => {
  const out = [];
  let repeats = 0;
  for (const { seed, tier, npcs, relationships } of corpus) {
    const facts = birthFactsOf({ institutions: INSTITUTIONS, config: {}, tier, powerStructure: { government: null } });
    const byId = new Map(npcs.map((npc) => [npc.id, npc]));
    /** @type {Map<string, number[]>} */
    const printed = new Map();
    for (const rel of relationships) {
      const archetype = /** @type {any} */ (STRESS_ECONOMIC_EFFECTS)[rel.archetypeKey];
      if (!archetype) continue;
      const index = tieIndexOf(rel.proseVariant);
      const before = printed.get(rel.archetypeKey) ?? [];
      if (before.includes(index)) {
        repeats++;
        const pair = [byId.get(rel.from), byId.get(rel.to)];
        const spare = Array.from({ length: archetype.tension.size }, (_, i) => i).filter((i) => !before.includes(i)
          && trustOf(archetype, i) === undefined
          && ['desc', 'tension'].every((f) => declarationAdmits(declarationOf(archetype[f].lines[i]), facts, { ctx: { pair } }).admitted));
        if (spare.length) out.push(`${seed}: ${rel.archetypeKey} prints #${index} again while #${spare.join(', #')} stood unprinted`);
      }
      printed.set(rel.archetypeKey, [...before, index]);
    }
  }
  return { offenders: out, repeats };
};

describe('TIES-HOLD: no tie template twice in a place while a line is free (GOALS-4 builder 11)', () => {
  const corpus = buildCorpus();

  it('the corpus is live: it holds ties, and the overflow town spends a pool and its reserve', () => {
    expect(corpus.reduce((n, row) => n + row.relationships.length, 0)).toBeGreaterThan(500);
    const overflow = corpus[corpus.length - 1].relationships;
    const ml = overflow.filter((rel) => rel.archetypeKey === 'mutual_leverage');
    expect(ml.length, 'the overflow town holds more mutual_leverage ties than its whole pool').toBeGreaterThan(STRESS_ECONOMIC_EFFECTS.mutual_leverage.tension.size);
  });

  it('no tie prints a template a tie of its place printed while an admitted, no-trust line stood unprinted', () => {
    const { offenders, repeats } = offendersOf(corpus);
    expect(offenders).toEqual([]);
    // anchored: the arm reads repeats at all (the overflow town must repeat once every line is spent)
    expect(repeats, 'the corpus holds the law\'s last rung (a repeat once every line is taken)').toBeGreaterThan(0);
  });
});
