/**
 * tests/joins/chainNamesOnlyProcessors.test.js — THE CHAIN TABLE NAMES ONLY PROCESSORS
 * (lane REVIEW-INTAKE-2 unit 4, chair ruling R4, 2026-11-06).
 *
 * `RESOURCE_CHAINS[*].processingInstitutions` is read by the gap writer
 * (`resourceGenerator.js :: evaluateInstitutionChain`): every listed house present on the
 * roster of a place where the chain is not active wrote "X exists but lacks access to Y". A
 * house that does not PROCESS the input (a mine extracts ore, a granary stores grain, a market
 * square sells salt, a bathhouse bathes, a stable yard shelters beasts) wrote that line about an
 * input it never needed. Each struck pair is pinned here, and a real generation proves the line
 * is gone.
 */
import { describe, it, expect } from 'vitest';
import { RESOURCE_CHAINS } from '../../src/data/resourceChains.js';
import { generateResourceAnalysis } from '../../src/generators/resourceGenerator.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

const STRUCK = Object.freeze([
  ['grain', 'Town granary'],
  ['ironOre', 'Mine'], ['copperOre', 'Mine'], ['preciousMetals', 'Mine'], ['gemstones', 'Mine'],
  ['desertSalt', 'Market square'],
  ['camelCaravan', 'Stable yard'],
  ['oasisDate', 'Market'], ['oasisDate', 'Granary'], ['oasisDate', 'Merchant'],
  ['mineralHot', 'Public bathhouse'],
]);

describe('the chain table names only processors of its input', () => {
  // MERGE-R2 (the each-family park ceiling, ratcheted to 108 on the rung-2 side, holds at the union): the rows loop in
  // the body of one parameterless test, so this file no longer parks on `each` (the walker's own cure).
  it('every struck chain does not name the house that does not process it', () => {
    for (const [chainKey, house] of STRUCK) {
      expect(RESOURCE_CHAINS[chainKey], chainKey).toBeTruthy();
      const processors = RESOURCE_CHAINS[chainKey].processingInstitutions;
      // A chain left with NO processor (oasisDate: every listed house was a seller or a store) is pinned
      // exactly empty — a positive pin, not a negative. Otherwise the struck house is absent from a list
      // anchored by a processor the chain still names, so a vanished list cannot pass.
      if (processors.length === 0) expect(processors, `${chainKey} names no processor at all`).toEqual([]);
      else expectAbsentWithAnchor(processors, house, processors[0], `${chainKey} names only processors`);
    }
  });

  it('a market square, a granary, a mine and a bathhouse write no "lacks access" line', () => {
    const institutions = ['Market square', 'Town granary', 'Mine', 'Public bathhouse', 'Stable yard']
      .map((name) => ({ name, category: 'Economy', tags: [] }));
    const analysis = generateResourceAnalysis('plains', [], [], institutions, {});
    const lines = (analysis.gaps || []).map((g) => g.impact).filter((t) => /exists but lacks access to/.test(t));
    expect(lines).toEqual([]);
  });
});
