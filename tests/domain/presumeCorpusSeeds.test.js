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
];

/** @param {string} seed */
const birth = (seed) => {
  const tier = seed.split('-')[1];
  const record = generateSettlementPipeline({ ...corpusConfig(tier) }, null, { seed, customContent: {} });
  return printedAbsent(record, factsOf(record), liveInstitutionNames(record));
};

describe('COHERENCE-PRESUME: a cured line no longer prints where its thing is absent', () => {
  test.each(CASES)('%s (%s) at %s', (fragment, thing, seed) => {
    const listed = birth(seed).filter((h) => h.thing === thing && h.sentence.includes(fragment));
    expect(listed).toEqual([]);
  }, 60_000);
});
