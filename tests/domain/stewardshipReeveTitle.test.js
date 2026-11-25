/**
 * tests/domain/stewardshipReeveTitle.test.js — BIRTH-1, unit D8 (intake 6; the tenth chair's ruling G10 of 2026-11-25, option A):
 * A FEUDAL STEWARDSHIP's HOLDER IS THE LORD's REEVE, NOT "THE REEVE".
 *
 * A thorp's government house "Lord's reeve" seats the Feudal Stewardship (`rulingStructure.js` governanceLabelMap); its face said
 * "the reeve", so the seat line read "Isamu Liu, the reeve, holds its seat." beside a stewardship, as if two officers. The face
 * now says whose officer he is: "the lord's reeve". The seat's name is not changed (R24m: a renamed power re-deals every
 * name-keyed draw). The tables that take MEANING from a title read the new title as the old one (`data/people/titleReadAs.js`),
 * so the card keeps its name pool and its secret and presentation lines (the honorific registry holds the new title's own row,
 * the reeve's honorific): only the title's
 * words move (measured over C and V: 12 and 18 thorps, every differing leaf the title alone).
 *
 *   (a) RED FIRST, BY NAME (measured at 0ec96f13d, `gen/birth-1/d8/`): the governance paragraph of C dp-thorp-21, -29, -39 and
 *       V dp-thorp-15, -21, -30 names its holder "the reeve"; after, "the lord's reeve", and never ", the reeve," beside the
 *       Feudal Stewardship.
 *   (b) THE TITLE READS AS THE REEVE's: its pool row, its lines, its honorific and its styled form are the reeve's.
 * The check over EVERY birth of C and V is the census `gen/birth-1/tools/measure-d8.mjs` (the seat line of every Feudal
 * Stewardship) and `leafcheck.mjs` (only the title moves).
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { governanceAccountOf } from '../../src/domain/display/governanceAccount.js';
import { poolFor, titleLinesFor } from '../../src/generators/people/poolMap.js';
import { honorificOfTitle, styledTitleOf } from '../../src/data/faceHonorifics.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';

/** @param {string} seed @param {'C'|'V'} corpus */
function birth(seed, corpus) {
  const settType = seed.split('-')[1];
  const config = corpus === 'C' ? { settType } : { ...DEFAULT_CONFIG, settType, _randomizePriorities: true };
  return generateSettlementPipeline(birthConfig(config), null, { seed, customContent: {} });
}

const PLACES = /** @type {const} */ ([['C', 'dp-thorp-21'], ['C', 'dp-thorp-29'], ['C', 'dp-thorp-39'], ['V', 'dp-thorp-15'], ['V', 'dp-thorp-21'], ['V', 'dp-thorp-30']]);

beforeAll(async () => { await loadGenerationLawPayloads(); }, 120000);

describe('D8 (a): a Feudal Stewardship thorp\'s holder is the lord\'s reeve', () => {
  for (const [corpus, seed] of PLACES) {
    it(`${corpus} ${seed}`, () => {
      const town = /** @type {any} */ (birth(seed, corpus));
      expect(town.powerStructure.governingName).toBe('Feudal Stewardship');
      expect((town.institutions || []).map((/** @type {any} */ i) => i?.name)).toContain("Lord's reeve");
      const text = String(governanceAccountOf(town)?.text ?? '');
      expect(text).toMatch(/the lord's reeve/);
      expect(/, the reeve[,.]/.test(text), `the seat line: ${text}`).toBe(false);
    }, 60000);
  }
});

describe('D8 (b): the new title reads as the reeve\'s in every table keyed on titles', () => {
  it('its pool row, its secret and presentation lines, its honorific and its styled form are the reeve\'s', () => {
    expect(poolFor("the lord's reeve", 'Government')).toEqual(poolFor('the reeve', 'Government'));
    expect(titleLinesFor("the lord's reeve")).toEqual(titleLinesFor('the reeve'));
    expect(titleLinesFor('the reeve'), 'the reeve has lines of its own').not.toBeNull();
    const failures = collectSeedFailures(['a', 'b', 'c'].flatMap((seed) => ['male', 'female'].map((gender) => ({ seed, gender }))), ({ seed, gender }) => {
      expect(honorificOfTitle("the lord's reeve", gender, seed)).toBe(honorificOfTitle('the reeve', gender, seed));
    });
    expectNoSeedFailures(failures, 'the lord\'s reeve takes the reeve\'s honorific on every seed and gender');
    expect(styledTitleOf("the lord's reeve", 'female')).toBe("the lord's reeve");
  });
});
