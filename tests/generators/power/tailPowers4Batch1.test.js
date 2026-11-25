/**
 * TAIL-POWERS-4 · batch 1 (READ-ALL rows B02464, B02757 with the monster rung's "stretched thin", 21621, 20987, 00170).
 * The baseline conflict ladder and the slave revolt's vignette (power/governanceNarrative.js; the sibling table
 * BASELINE_CONFLICT_SIBLINGS, data/powerSiblings.js, lent by P26) said what the smaller place or the record does not hold:
 * - "the families on each side" of the grazing quarrel in a thorp (6 to 30 souls): the twin "those on each side of it";
 * - "The merchant class is outbuying noble landholdings. Three estates have changed hands" in a hamlet or a village: the
 *   twin "A merchant has bought land the old landholding family once held";
 * - "A monster incursion last season destroyed outlying farms. The <force> is stretched thin" where no raid is on the
 *   record and the order is Safe ("The militia is present and responsive"): reworded to claim the monster threat only;
 * - "some streets are contested" in a thorp: "parts of the settlement are contested", every size.
 * A DECLARED MOVE: powerStructure.recentConflict (and its reader pressureSentence); nothing else.
 * Births as the census's 720 (each pair red at the base); KEEP: each original where the place bears it.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { generateSettlementPipeline } from '../../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../../src/store/configSlice.js';
import { expectAbsentWithAnchor } from '../../helpers/anchoredNegatives.js';

const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
/** the census's 720 shape @param {string} seed */
function born(seed) {
  const calm = seed.match(/^r2r-(\w+)-\d+$/);
  const forced = seed.match(/^r2s-(\w+)-(thorp|hamlet|village|town|city|metropolis)-\d+$/);
  const cfg = calm ? { ...DEFAULT_CONFIG, ...DIALS, settType: calm[1] }
    : { ...DEFAULT_CONFIG, ...DIALS, settType: forced?.[2], selectedStresses: [forced?.[1]], selectedStressesRandom: false };
  return generateSettlementPipeline(birthConfig(cfg), null, { seed, customContent: {} });
}

describe('TAIL-POWERS-4 · batch 1: a conflict line claims what the place bears', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });

  /** seed -> [the text that must NOT be written, the text written instead] */
  const CURED = /** @type {Record<string, [string, string]>} */ ({
    'r2r-thorp-7': ['the families on each side', 'and those on each side of it no longer speak to one another'],
    'r2r-thorp-4': ['the families on each side', 'and those on each side of it no longer speak to one another'],
    'r2r-hamlet-11': ['Three estates have changed hands', 'A merchant has bought land the old landholding family once held'],
    'r2r-village-45': ['Three estates have changed hands', 'A merchant has bought land the old landholding family once held'],
    'r2r-hamlet-26': ['is stretched thin', 'Monsters prowl near the outlying farms'],
    'r2s-infiltrated-village-3': ['A monster incursion last season destroyed outlying farms', 'Monsters prowl near the outlying farms'],
    'r2s-slave_revolt-thorp-0': ['some streets are contested', 'parts of the settlement are contested'],
    'r2s-slave_revolt-hamlet-1': ['some streets are contested', 'parts of the settlement are contested'],
  });
  for (const [seed, [was, now]] of Object.entries(CURED)) {
    it(`${seed}: the conflict reads "${now}", not "${was}"`, () => {
      const rc = String(born(seed).powerStructure.recentConflict || '');
      expectAbsentWithAnchor(rc, was, now, seed);
      expect(rc, seed).toContain(now);
    }, 120_000);
  }

  /** KEEP: each original where the place bears it. seed -> the line that still prints */
  const KEEP = /** @type {Record<string, string>} */ ({
    // RULING G13 (WORDS-2 E3): the stock grazing line prints only where herding leads the food; r2r-hamlet-8 (a hamlet of 57
    // on fish) now prints the shore's quarrel, so the KEEP is read where herding leads, a hamlet of 73.
    'r2r-hamlet-22': 'and the families on each side no longer speak to one another', // a hamlet of 73, herding leads
    'r2r-hamlet-8': 'A dispute over rights on the shore and access to water', // a hamlet of 57 on the shore, fish leads
    'r2r-metropolis-17': 'The merchant class is outbuying noble landholdings. Three estates have changed hands', // a metropolis
    'r2r-town-10': 'The merchant class is outbuying noble landholdings.', // a town
  });
  for (const [seed, keep] of Object.entries(KEEP)) {
    it(`KEEP ${seed}: "${keep}" still prints where the place bears it`, () => {
      expect(String(born(seed).powerStructure.recentConflict || ''), seed).toContain(keep);
    }, 120_000);
  }
});
