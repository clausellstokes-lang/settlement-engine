/**
 * presumeCorpusSeeds.test.js — COHERENCE-PRESUME's red-first proofs, one per cure (the charter
 * `docs/chair/2026-11-11/CHARTERS-COHERENCE-2026-11-11.md` §1). Each case names a line that printed
 * in a corpus town lacking the thing it names, at the lane's base (99bcc6944), and the seed that
 * printed it. The case births that seed with the browser's configuration and asserts the line no
 * longer prints there while the thing is absent (the walker's own arm-2 reading). Each case was red
 * before its cure. The corpus-wide proof is tests/lint/presumedThings.walker.test.js.
 */
import { describe, expect, test } from 'vitest';

import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { factsOf } from '../../src/domain/facts/factsOf.js';
import { liveInstitutionNames } from '../../src/domain/facts/institutions.js';
import { corpusConfig, printedAbsent } from '../lint/presumedThings.shared.mjs';

/** [the line's fragment, the thing, the corpus seed that printed it absent at the base] */
const CASES = [
  ['outfits town militias', 'militia', 'presume-town-103'],
  ['outfit the militias', 'militia', 'presume-town-0'],
  ['Sells surplus at the weekly market', 'market', 'presume-village-22'],
  ['Supplies the market with ducks', 'market', 'presume-village-32'],
  ['from the docks and the builders', 'docks', 'presume-city-12'],
  ['how many are in the garrison', 'garrison', 'presume-town-18'],
  ['take your business to a money-changer', 'bank', 'presume-city-18'],
  ['Emergency granary reserves', 'granary', 'presume-village-13'],
  ['every purse in the market', 'market', 'presume-village-51'],
  ['The garrison commander is a political actor', 'garrison', 'presume-town-111'],
  ['knows the watch rota', 'watch', 'presume-village-48'],
  ['A money changer sits', 'bank', 'presume-town-111'],
  ['a counting house, its brass', 'bank', 'presume-city-41'],
  ['merchant stalls, money changers', 'bank', 'presume-town-0'],
  ['at the market cross', 'market', 'presume-village-12'],
  ['The Watch Captain', 'watch', 'presume-village-0'],
  ['preferential market positions', 'market', 'presume-village-52'],
  ['the market quarter', 'market', 'presume-village-24'],
  ['Temple granaries blessed', 'granary', 'presume-village-19'],
];

/** @param {string} seed */
const birth = (seed) => {
  const tier = seed.split('-')[1];
  const record = generateSettlementPipeline({ ...corpusConfig(tier) }, null, { seed, customContent: {} });
  return printedAbsent(record, factsOf(record), liveInstitutionNames(record));
};

describe('COHERENCE-PRESUME: a cured line no longer prints where its thing is absent', () => {
  // one parameterless test over the rows (the sovereignty census parks a file that calls `each`)
  test('every case\'s seed prints its line only where the thing stands', () => {
    const still = CASES.flatMap(([fragment, thing, seed]) => birth(seed)
      .filter((h) => h.thing === thing && h.sentence.includes(fragment))
      .map((h) => `${seed} :: ${thing} :: ${h.path} :: ${h.sentence.slice(0, 120)}`));
    expect(still).toEqual([]);
  }, 600_000);
});
