/**
 * tests/generators/tieDrawDeclared.test.js — CENSUS-1f unit 1, Appendix B site 19 (H): the tie
 * draw (`power/relationshipArchetypes.js :: createTieProseDraw`) resolves its drawn index through
 * `drawDeclared` against CENSUS-4c's in-place declarations on `STRESS_ECONOMIC_EFFECTS` (one
 * index picks the desc AND the tension line, so a refusal of either refuses the pair). The draw
 * itself is unchanged (zero rng; the same fnv offset and cycle); only a refused index moves, to
 * the hash argmax over the admitted indices.
 *
 * @enforced-by npx vitest run tests/generators/tieDrawDeclared.test.js
 */
import { describe, expect, it } from 'vitest';
import { STRESS_ECONOMIC_EFFECTS } from '../../src/data/npcData.js';
import { createTieProseDraw } from '../../src/generators/power/relationshipArchetypes.js';
import { factsOf } from '../../src/domain/facts/factsOf.js';
import { declarationOf, declarationAdmits } from '../../src/domain/facts/factVocabulary.js';
import { CALM_FACTS_ADMIT_ALL } from '../helpers/calmFactsDouble.js';

const A = { name: 'Aldo Vance' };
const B = { name: 'Bera Holt' };
/** A place with no market, no watch, no guild, no temple, ruled by a lord. */
/** R-N's one calm double, with the two answers a tie row reads that it leaves open (a council; a guild). */
const ADMIT_ALL = { ...CALM_FACTS_ADMIT_ALL, rulerKind: 'council', guild: true };
const BARE = factsOf({ institutions: [], powerStructure: { government: 'Feudal lordship' }, tier: 'village', config: {} });

/** @param {any} archetype @param {number} i */
const pairRefused = (archetype, i, facts) => ['desc', 'tension'].some((f) => {
  const lines = archetype[f].lines;
  return !declarationAdmits(declarationOf(lines[i % lines.length]), facts).admitted;
});

/** Every index of the archetype's pool, drawn once each (the draw cycles without replacement). */
const drawAll = (archetype, facts) => {
  const draw = createTieProseDraw(undefined, facts);
  return Array.from({ length: archetype.tension.size }, () => draw(archetype, A, B).proseVariant);
};

const DECLARING = Object.entries(STRESS_ECONOMIC_EFFECTS)
  .filter(([, a]) => Array.from({ length: a.tension.size }, (_, i) => i).some((i) => pairRefused(a, i, BARE)));

describe('the tie draw resolves through drawDeclared (CENSUS-1f, site 19)', () => {
  it('at least one archetype carries an index the bare place refuses (the arm is live)', () => {
    expect(DECLARING.length).toBeGreaterThan(0);
  });

  it('no drawn index is one the record refuses', () => {
    for (const [, archetype] of DECLARING) {
      for (const i of drawAll(archetype, BARE)) expect(pairRefused(archetype, i, BARE)).toBe(false);
    }
  });

  it('a place that admits every line draws exactly the old cycle (byte witness)', () => {
    for (const archetype of Object.values(STRESS_ECONOMIC_EFFECTS)) {
      const size = archetype.tension.size;
      const draw = createTieProseDraw(undefined, ADMIT_ALL);
      const got = Array.from({ length: size }, () => draw(archetype, A, B).proseVariant);
      expect([...got].sort((x, y) => x - y)).toEqual(Array.from({ length: size }, (_, i) => i));
    }
  });

  it('the printed prose is the resolved index\'s prose', () => {
    const [, archetype] = DECLARING[0];
    const draw = createTieProseDraw(undefined, BARE);
    for (let n = 0; n < archetype.tension.size; n++) {
      const t = draw(archetype, A, B);
      expect(t.tension).toBe(archetype.tension(A, B, t.proseVariant));
      expect(t.description).toBe(archetype.desc(A, B, t.proseVariant));
    }
  });
});
