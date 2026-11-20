/**
 * TAIL-POWERS-2 · P4's occupation half (the chair's ruling P4 of 2026-11-14, vetoable by the owner): "governs <town>"
 * under an occupation takes a twin true in that state.
 *
 * Under an occupation (stressFactions.js marks the governing row `occupied` and raises the Occupation Authority, whose
 * card reads "all significant decisions require approval or reversal"), the seat's own line said it governs: "A duke or
 * duchess governs the metropolis by royal appointment" (READ-ALL 02559), "A formal consortium ... holds civic
 * authority" (02606), "The elders of the hamlet decide things together, and no lord stands over them"; and the
 * governance account said "The Ducal Governorship governs Nokhoihan." Measured at the base (census-3, the 720): the
 * seat line and "governs <town>" in all 28 occupied towns; "The Occupation Authority takes its orders no longer" (READ-ALL
 * 00382: the occupier never took the hall's orders) in 9.
 * The cures: the seat's line is its twin (power/governingStressVignettes.js :: occupiedSeatLine, read by
 * rulingStructure.js); the account's three seat draws keep their slot and say the seat "answers to the occupiers of
 * <town>" (domain/display/governanceAccount.js); a rival occupier is named on the account's "at odds with it" line.
 * Births as the census's 720 (each pair red at the base); KEEP: the same lines where no occupation stands.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { generateSettlementPipeline } from '../../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../../src/store/configSlice.js';
import { governanceAccountOf } from '../../../src/domain/display/governanceAccount.js';
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
const TWIN = /keeps the seat, but under the occupation nothing it decides stands without the occupiers' approval\./;

describe("TAIL-POWERS-2 · P4: under an occupation the seat does not govern; it answers to the occupiers", () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });
  /** seed -> [the seat line that must NOT print, the account's "governs" sentence that must NOT print] */
  const CURED = /** @type {Record<string, [string, string]>} */ ({
    'r2s-occupied-metropolis-2': ['A duke or duchess governs the metropolis by royal appointment', 'The Ducal Governorship governs Nokhoihan.'],
    'r2s-occupied-metropolis-0': ["A formal consortium of the metropolis's most powerful guild masters holds civic authority", 'Chrissopetra is governed by the Grand Guild Consortium.'],
    'r2s-occupied-hamlet-2': ['no lord stands over them', 'The Free Elder Council governs Dunkelstift.'],
    'r2s-occupied-thorp-0': ['Settlement governed by heads of household', 'The Household Council governs Warmstadt.'],
    'r2r-thorp-24': ['Settlement governed by heads of household', 'The Household Council governs Sanctaminus.'],
  });
  for (const [seed, [seatLine, governs]] of Object.entries(CURED)) {
    it(`${seed}: the seat's twin prints instead of "${seatLine}"; the account says the seat answers to the occupiers`, () => {
      const s = born(seed);
      const gov = s.powerStructure.factions.find((/** @type {any} */ f) => f.isGoverning);
      expect(gov.modifiers, seed).toContain('occupied');
      expectAbsentWithAnchor(gov.desc, seatLine, "keeps the seat, but under the occupation nothing it decides stands without the occupiers' approval.", seed);
      expect(gov.desc, seed).toMatch(TWIN);
      const account = governanceAccountOf(s)?.text || '';
      expectAbsentWithAnchor(account, governs, `answers to the occupiers of ${s.name}.`, seed);
      expect(account, seed).toContain(`answers to the occupiers of ${s.name}.`);
    }, 120_000);
  }
  // the occupier is no power that "takes its orders no longer": it is named on the "at odds with it" line instead
  for (const seed of ['r2s-occupied-thorp-1', 'r2s-occupied-city-0']) {
    it(`${seed}: the Occupation Authority is at odds with the hall, not one that no longer takes its orders`, () => {
      const account = governanceAccountOf(born(seed))?.text || '';
      for (const refused of ['Occupation Authority no longer takes its orders', 'Occupation Authority takes its orders no longer']) expectAbsentWithAnchor(account, refused, 'Occupation Authority', seed);
      expect(account, seed).toMatch(/Occupation Authority[^.]* (?:is|are) at odds with it\.|The hall is at odds with [^.]*the Occupation Authority/);
    }, 120_000);
  }
  // KEEP: where no occupation stands, the seat's own line and "governs <town>" print as before
  it('r2r-metropolis-15 (no occupation): "A duke or duchess governs" and "governs Nandamala." still print', () => {
    const s = born('r2r-metropolis-15');
    const gov = s.powerStructure.factions.find((/** @type {any} */ f) => f.isGoverning);
    expect(gov.desc).toContain('A duke or duchess governs the metropolis by royal appointment');
    expect(governanceAccountOf(s)?.text || '').toContain('The Ducal Governorship governs Nandamala.');
  }, 120_000);
  it('r2r-city-44 (no occupation): a power that broke with the hall still "takes its orders no longer"', () => {
    expect(governanceAccountOf(born('r2r-city-44'))?.text || '').toMatch(/takes its orders no longer\.|no longer takes its orders\./);
  }, 120_000);
});
