/**
 * fieldsBoughtIn.test.js — B1(ii), THE FURROWS (CLOSE-7 BATCH; the tenth chair's RULING-R24 R24-B1(ii), CHAIN-1 phase 4).
 * Where the record says the grain is bought in (the atom `grain imported`, the fact Daily Life's A12 "The grain is bought in,
 * not grown here" reads) and the place has no farmland (the atom `institution: farmland`, `facts/institutions.js`), the
 * `field` element weighs nothing in `traditions/genesis.js :: deriveFoundingTraditions`: no founding tradition blesses
 * fields the place does not have.
 *
 * RED FIRST (the cut 9d8c944a3): C dp-city-0 and V dp-metropolis-77 each hold a `field` tradition beside grain bought in and no
 * farmland (READ-24's hit list, `close-7/read24/b1ii-hits.tsv`, and the battery's row B1furrow on the cut).
 */
import { beforeAll, describe, expect, test } from 'vitest';
import { generateSettlementPipeline } from '../../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../../src/store/configSlice.js';
import { deriveFoundingTraditions } from '../../../src/domain/traditions/genesis.js';
import { factsOf } from '../../../src/domain/facts/factsOf.js';
import { atomHolds } from '../../../src/domain/facts/factVocabulary.js';

/** the census's birth (close-7/read24/make-plan.mjs) @param {string} seed */
const census = (seed) => generateSettlementPipeline(birthConfig({ settType: String(seed.split('-')[1]) }), null, { seed, customContent: {} });
/** the visitor's birth (close-7/read24/make-visitor-plan.mjs) @param {string} seed */
const visitor = (seed) => generateSettlementPipeline(
  birthConfig({ ...DEFAULT_CONFIG, settType: String(seed.split('-')[1]), _randomizePriorities: true }), null, { seed, customContent: {} });

/** @type {Record<string, any>} */ const born = {};
beforeAll(async () => {
  await loadGenerationLawPayloads();
  born['C dp-city-0'] = census('dp-city-0');
  born['V dp-metropolis-77'] = visitor('dp-metropolis-77');
}, 120000);

describe('B1(ii): no tradition blesses the fields where the grain is bought in and no farmland stands', () => {
  for (const name of ['C dp-city-0', 'V dp-metropolis-77']) {
    test(`${name}: grain bought in, no farmland, and no founding tradition of the fields`, () => {
      const s = born[name];
      const facts = factsOf(s);
      expect([atomHolds('grain imported', facts), atomHolds('institution: farmland', facts)], 'the premise: the record buys its grain in and holds no farmland')
        .toEqual([true, false]);
      expect(deriveFoundingTraditions(s).filter((t) => t.coreMotif.element === 'field').map((t) => t.name)).toEqual([]);
    });
  }
});
