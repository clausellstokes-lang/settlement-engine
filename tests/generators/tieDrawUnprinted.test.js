/**
 * tests/generators/tieDrawUnprinted.test.js — R2-CODE-A-14: WITHOUT REPLACEMENT HOLDS THROUGH THE RESOLUTION.
 * GS-1 (ODQ §934.101) draws an archetype's tie lines without replacement in a town; CENSUS-1f resolves a refused
 * index to the hash argmax over the admitted ones (`power/relationshipArchetypes.js :: createTieProseDraw`). The
 * argmax did not know which indices the town had already printed, so two ties of one archetype could print one
 * sentence (809 such repeats in 263 of the reader's 3,048 births at 560d1687c, 214 of them `wary_alliance`). Now,
 * in the head of the cycle, a refused index resolves to an admitted index no earlier tie printed: draw-free.
 *
 * @enforced-by npx vitest run tests/generators/tieDrawUnprinted.test.js
 */
import { describe, expect, it } from 'vitest';
import { STRESS_ECONOMIC_EFFECTS } from '../../src/data/npcData.js';
import { createTieProseDraw } from '../../src/generators/power/relationshipArchetypes.js';
import { factsOf } from '../../src/domain/facts/factsOf.js';
import { declarationOf, declarationAdmits } from '../../src/domain/facts/factVocabulary.js';
import { CALM_FACTS_ADMIT_ALL } from '../helpers/calmFactsDouble.js';

/** A place ruled by a lord, with nothing on its roster: the tie rows' `ruler` and roster refusals fire. */
const BARE = factsOf({ institutions: [], powerStructure: { government: 'Feudal lordship' }, tier: 'village', config: {} });
const ADMIT_ALL = { ...CALM_FACTS_ADMIT_ALL, rulerKind: 'council', guild: true };

/** @param {any} archetype @param {number} i @param {any} facts */
const admitted = (archetype, i, facts) => ['desc', 'tension'].every((f) => {
  const lines = archetype[f].lines;
  return declarationAdmits(declarationOf(lines[i % lines.length]), facts).admitted;
});
const PAIRS = Array.from({ length: 12 }, (_, k) => [{ name: `Aldo 0-${k}` }, { name: `Bera 0-${k}` }]);

/** The first `size` ties of one archetype in one town, each a different pair. @param {any} archetype @param {any} facts */
const townOf = (archetype, facts) => {
  const draw = createTieProseDraw(undefined, facts);
  return Array.from({ length: archetype.tension.size }, (_, k) => draw(archetype, ...PAIRS[k % PAIRS.length]).proseVariant);
};

describe('a refused tie index resolves to one the town has not printed', () => {
  it('in the head of the cycle no index prints twice while an admitted unprinted index remains', () => {
    const offenders = [];
    for (const [key, archetype] of Object.entries(STRESS_ECONOMIC_EFFECTS)) {
      const open = Array.from({ length: archetype.tension.size }, (_, i) => i).filter((i) => admitted(archetype, i, BARE));
      const got = townOf(archetype, BARE);
      got.forEach((v, t) => {
        const before = new Set(got.slice(0, t));
        if (before.has(v) && open.some((i) => !before.has(i))) offenders.push(`${key}: tie ${t} repeats ${v} (${got.join(',')}; admitted ${open.join(',')})`);
      });
    }
    expect(offenders).toEqual([]);
  });
  it('every printed index is admitted (the resolution never trades a repeat for a false line)', () => {
    for (const archetype of Object.values(STRESS_ECONOMIC_EFFECTS)) {
      for (const i of townOf(archetype, BARE)) expect(admitted(archetype, i, BARE)).toBe(true);
    }
  });
  it('KEEP: a place that admits every line prints exactly the old cycle (draw-free)', () => {
    for (const archetype of Object.values(STRESS_ECONOMIC_EFFECTS)) {
      const got = townOf(archetype, ADMIT_ALL);
      expect([...got].sort((x, y) => x - y)).toEqual(Array.from({ length: archetype.tension.size }, (_, i) => i));
    }
  });
});
