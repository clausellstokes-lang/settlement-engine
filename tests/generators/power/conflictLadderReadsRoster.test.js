/**
 * conflictLadderReadsRoster.test.js — POWERS-13 (the bar's HIGH row #291, and its MEDIUM twin #292): A LINE OF THE
 * BASELINE CONFLICT LADDER THAT NAMES A MARKET, A COURT OR THE MERCHANTS READS THE ROSTER
 * (`generators/power/governanceNarrative.js :: deriveBaselineConflict`).
 *
 * The bar's town bar0-village-calm-rand-1 printed "Elder Council has been debating market levies for three months.
 * The merchants have stopped attending the sessions." in a village with no market (its only "civic" house an
 * adventurers' charter hall). Every line of the ladder that names a market, a court, a guild, a temple or a force was
 * read on the census's 720 at 3909655c3 (probe ladder.mjs): four were false somewhere — the levies line (2 towns
 * with no market), "Several merchants have been found murdered" (2, no market), "The merchant class is outbuying
 * noble landholdings" and its noble-market sibling (3, no market), "authority over civilian courts" (5, no court).
 * After the cure each prints only where its market or court stands (0 false on the 720); the rest read true.
 * Every expected word is a literal.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { collectSeedFailures, expectNoSeedFailures } from '../../helpers/seedFailures.js';
import { expectAbsentWithAnchor } from '../../helpers/anchoredNegatives.js';
import { generateSettlementPipeline } from '../../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../../src/store/configSlice.js';
import { factsOf } from '../../../src/domain/facts/factsOf.js';

const DIALS = Object.freeze({
  tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat',
  nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true,
  magicExists: true, contentProfile: 'grounded',
});
/** The census's calm shape r2r-<size>-<i>; the bar's bar0-<size>-calm-rand-<i> (its probes' app shape). @param {string} seed */
function born(seed) {
  const bar = seed.match(/^bar0-(\w+)-calm-rand-\d+$/);
  const cfg = bar
    ? { ...DEFAULT_CONFIG, settType: bar[1], selectedStressesRandom: false, selectedStresses: [], _randomizePriorities: true }
    : { ...DEFAULT_CONFIG, ...DIALS, settType: /** @type {RegExpMatchArray} */ (seed.match(/^r2r-(\w+)-\d+$/))[1] };
  return generateSettlementPipeline(birthConfig(cfg), null, { seed, customContent: {} });
}
/** @param {any} s */
const conflict = (s) => String(s.powerStructure?.recentConflict || '');
/** @param {any} s */
const market = (s) => Boolean(factsOf(s).market);
/** @param {any} s */
const court = (s) => Boolean(s.economicState?.compound?.inst?.hasCourtSystem);
const LEVIES = 'has been debating market levies for three months. The merchants have stopped attending the sessions.';
const MURDERED = 'Several merchants have been found murdered this season';
const OUTBUYING = 'The merchant class is outbuying noble landholdings.';
const COURTS = 'pushing for expanded authority over civilian courts';

describe('POWERS-13 #291 · the conflict ladder names a market or a court only where it stands', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });
  it('the guard towns: each line is gone where its market or court is not, and says what the ladder says next', () => {
    expectNoSeedFailures(collectSeedFailures([
      ['bar0-village-calm-rand-1', LEVIES, 'A dispute over grazing rights and water access has run for two seasons'],
      ['r2r-village-4', LEVIES, 'A dispute over grazing rights and water access has run for two seasons'],
      ['r2r-hamlet-56', MURDERED, 'Someone has been stealing from the communal stores.'],
      ['r2r-hamlet-14', OUTBUYING, 'A dispute over grazing rights and water access has run for two seasons'],
      ['r2r-village-8', COURTS, "The strongest armed household has started making decisions on everyone's behalf without asking."],
    ], ([seed, gone, now]) => {
      const s = born(seed);
      if (gone === COURTS) expect(court(s), `${seed}: the town lacks a court`).toBe(false);
      else expect(market(s), `${seed}: the town lacks a market`).toBe(false);
      expectAbsentWithAnchor(conflict(s), gone, now, `${seed}: the ladder's next line, not the line naming what it lacks`);
    }), 'each guard town prints the ladder\'s next line, not the line naming what it lacks');
  }, 240_000);
  it('the twins: each line keeps its place where its market or court stands', () => {
    expectNoSeedFailures(collectSeedFailures([
      ['r2r-town-4', LEVIES], ['r2r-town-0', MURDERED], ['r2r-town-10', OUTBUYING], ['r2r-town-16', COURTS],
    ], ([seed, line]) => {
      const s = born(seed);
      expect(line === COURTS ? court(s) : market(s), `${seed}: the thing stands`).toBe(true);
      expect(conflict(s), seed).toContain(line);
    }), 'each twin keeps the line its market or court bears out');
  }, 240_000);
});
