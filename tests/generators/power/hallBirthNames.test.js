/**
 * hallBirthNames.test.js — C1, THE LABEL THAT TELLS (CLOSE-7 BATCH; the tenth chair's RULING-R24 R24-C1, R24g (2), R24m): the bought
 * hall is born under a plain name ("Council of Aldermen" at a town, "Council of Syndics" at a city, "Senate" at a metropolis), the
 * player's projection prints none of the three old forms, and the DM's line that the hall is bought is said word for word.
 *
 * RED FIRST (the tree before the cure of `governanceNarrative.js :: rewriteFactionPhrasing`): V dp-town-57's recent conflict said
 * "inside the Council of Aldermen of Aldermen": the `inside the council` rule re-matched a label that itself begins "Council".
 */
import { beforeAll, describe, expect, test } from 'vitest';
import { generateSettlementPipeline } from '../../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../../src/store/configSlice.js';
import { toPublicSafe } from '../../../src/domain/display/publicSafe.js';
import { withPublicProse } from '../../../src/domain/display/publicProse.js';

/** the visitor's birth (close-7/read24/make-visitor-plan.mjs) @param {string} seed */
const visitor = (seed) => generateSettlementPipeline(
  birthConfig({ ...DEFAULT_CONFIG, settType: String(seed.split('-')[1]), _randomizePriorities: true }), null, { seed, customContent: {} });
/** one V birth of each size that governs by the bought hall (close-7/batch/c1-births.census.jsx's carriers) */
const BORN = { 'dp-town-57': 'Council of Aldermen', 'dp-city-87': 'Council of Syndics', 'dp-metropolis-9': 'Senate' };
const OLD = ['Corrupt Council', 'Corrupt City Council', 'Shadow Senate'];
/** @type {Record<string, any>} */ const born = {};
beforeAll(async () => {
  await loadGenerationLawPayloads();
  for (const seed of Object.keys(BORN)) born[seed] = visitor(seed);
}, 120000);

describe('C1: the bought hall is born under a plain name', () => {
  for (const [seed, name] of Object.entries(BORN)) {
    test(`${seed}: governed by ${name}, criminal, its desc the bought hall's own, and no old form on the player's page`, () => {
      const s = born[seed];
      const gov = s.powerStructure.factions.find((f) => f.isGoverning);
      expect([s.powerStructure.governingName, gov.faction, gov.category]).toEqual([name, name, 'criminal']);
      expect(OLD.filter((o) => JSON.stringify(toPublicSafe(withPublicProse(s))).includes(o))).toEqual([]);
      expect(JSON.stringify(s)).toContain(name);
      expect(JSON.stringify(s)).not.toMatch(/Council of Aldermen of Aldermen|Council of Syndics of Syndics/); // anchored: the same record holds the hall's name (the line above)
    });
  }
  test('dp-town-57: the recent conflict names the hall once', () => {
    expect(born['dp-town-57'].powerStructure.recentConflict).toContain('inside the Council of Aldermen.');
  });
});
