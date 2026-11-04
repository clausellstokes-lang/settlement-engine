/**
 * Lane DEFENSE-2 (2026-11-03): the generated defence record stores the ONE magic reliance reading.
 *
 * `defenseProfile.magicDependency` (and its mirror `defenseProfile.scores.magicDependency`) was
 * raised by `defenseGenerator.js :: computeDefenseScores` only in a siege, famine or plague, so it
 * disagreed with lane MAGIC's reliance reading (`src/domain/magicReliance.js`) on most places that
 * rely on magic. It now stores `reading in {relied-upon, integral}`, read at assembly.
 *
 * The seeds are born the way the app births a place: `birthConfig({ ...DEFAULT_CONFIG, ... })`
 * after `loadGenerationLawPayloads()`.
 */
import { beforeAll, describe, expect, it } from 'vitest';

import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { deriveMagicReliance } from '../../src/domain/magicReliance.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';

/** @param {string} tier @param {string} seed @param {object} [over] */
const born = (tier, seed, over = {}) =>
  generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: tier, ...over }), null, { seed });

/** @param {any} s */
const reliesOnMagic = (s) => ['relied-upon', 'integral'].includes(deriveMagicReliance(s).reading);

beforeAll(async () => {
  await loadGenerationLawPayloads();
});

describe('the generated defence record carries the reliance reading', () => {
  /** @type {Array<{seed: string, s: any}>} */
  const corpus = [];
  beforeAll(() => {
    for (const tier of ['village', 'town', 'city']) {
      for (const pm of [30, 66, 85]) {
        for (let i = 0; i < 3; i++) {
          const seed = `d2-magic-${tier}-${pm}-${i}`;
          corpus.push({ seed, s: born(tier, seed, { magicExists: true, priorityMagic: pm }) });
        }
      }
    }
  });

  it('defenseProfile.magicDependency is true exactly where the reading is relied-upon or integral', () => {
    const wrong = corpus
      .filter(({ s }) => s.defenseProfile.magicDependency !== reliesOnMagic(s))
      .map(({ seed, s }) => `${seed}: reading ${deriveMagicReliance(s).reading}, flag ${s.defenseProfile.magicDependency}`);
    expect(wrong, 'places whose stored flag disagrees with the reading').toEqual([]);
    expect(corpus.filter(({ s }) => reliesOnMagic(s)).length, 'non-vacuous: some places rely').toBeGreaterThan(0);
    expect(corpus.filter(({ s }) => !reliesOnMagic(s)).length, 'non-vacuous: some do not').toBeGreaterThan(0);
  });

  it('the scores mirror the profile (V-DEFENSE-MAGICDEP)', () => {
    const failures = collectSeedFailures(corpus, ({ seed, s }) => {
      expect(s.defenseProfile.scores.magicDependency, `${seed} scores mirror`).toBe(s.defenseProfile.magicDependency);
    });
    expectNoSeedFailures(failures, 'the scores mirror the profile on every seed');
  });
});
