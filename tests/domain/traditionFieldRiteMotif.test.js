/**
 * traditionFieldRiteMotif.test.js — B1(ii)'s walk takes no motif the town already holds (the tenth chair's ruling on
 * B1II-119's finding 1). Births before the rule never showed one town two traditions of the same motif (0 of 1,800); the
 * first build's walk took the first admitted draw and so did, in four towns. The walk now takes, among its ten attempts,
 * the first draw that is admitted AND whose motif is unused (the base reroll's own test), else the first admitted.
 *
 * RED FIRST (dd583bbf7e): C dp-town-141 (hunt|contest twice), C dp-metropolis-63 (harvest|feast twice), V dp-metropolis-32
 * (charter|feast twice), V dp-metropolis-44 (forge|contest twice).
 */
import { beforeAll, describe, expect, test } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { fieldRiteRefused } from '../../src/domain/traditions/genesis.js';
import { shownTraditionsOf } from '../../src/domain/traditions/shownTraditions.js';

/** the census's birth (close-8 make-plan.mjs) @param {string} seed */
const census = (seed) => generateSettlementPipeline(birthConfig({ settType: String(seed.split('-')[1]) }), null, { seed, customContent: {} });
/** the visitor's birth (close-8 make-visitor-plan.mjs) @param {string} seed */
const visitor = (seed) => generateSettlementPipeline(
  birthConfig({ ...DEFAULT_CONFIG, settType: String(seed.split('-')[1]), _randomizePriorities: true }), null, { seed, customContent: {} });

/** @type {Record<string, any>} */ const born = {};
beforeAll(async () => {
  await loadGenerationLawPayloads();
  for (const seed of ['dp-town-141', 'dp-metropolis-63']) born[`C ${seed}`] = census(seed);
  for (const seed of ['dp-metropolis-32', 'dp-metropolis-44']) born[`V ${seed}`] = visitor(seed);
}, 240000);

describe('B1(ii): the walk never shows one town two traditions of the same motif', () => {
  for (const name of ['C dp-town-141', 'C dp-metropolis-63', 'V dp-metropolis-32', 'V dp-metropolis-44']) {
    test(`${name}: refused, and no motif twice in its shown set`, () => {
      const s = born[name];
      expect(fieldRiteRefused(s), 'the premise: the place refuses a rite of the fields, so the walk runs').toBe(true);
      const motifs = shownTraditionsOf(s).recs.map((t) => `${t.coreMotif?.element}|${t.coreMotif?.act}`);
      expect(motifs.length).toBeGreaterThan(0);
      expect(motifs.filter((m, i) => motifs.indexOf(m) !== i)).toEqual([]);
    });
  }
});
