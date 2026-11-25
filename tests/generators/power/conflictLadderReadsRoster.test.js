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
// BAR3-CLOSE-SWEEP-A (2026-11-15): the levy line where the seat's relation row with the merchant power is settled (the
// powers branch's c0d013098, its declared cure C27440: `factionDynamics.js :: boycottReadsRelation`); r2r-town-4's Town
// Mayor stands `subordinate`, `stable` to the Merchant Guilds, and the line naming the market still prints where it stands
const LEVIES_SETTLED = 'has been debating market levies for three months. The merchants have argued against every one of them, and nothing has been settled yet.';
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
      ['r2r-town-4', LEVIES_SETTLED], ['r2r-town-0', MURDERED], ['r2r-town-10', OUTBUYING], ['r2r-town-16', COURTS],
    ], ([seed, line]) => {
      const s = born(seed);
      expect(line === COURTS ? court(s) : market(s), `${seed}: the thing stands`).toBe(true);
      expect(conflict(s), seed).toContain(line);
    }), 'each twin keeps the line its market or court bears out');
  }, 240_000);
});

// WORDS-2 E3, the tenth chair's RULING G9 (2) (the owner's "Don't invent drama capitalize on what's already there if it's
// there"): the cascade's last fall-through keeps the grazing quarrel only where the record holds grazing (a grazing house on
// the live roster, the running pastoral chain, or a grass, pasture, meadow, steppe, grazing or herds ground nearby:
// `powerSiblings.js :: noGrazingQuarrelOf`); a calm place without it stores no quarrel. Red first by name on 0ec96f13d8: V
// dp-thorp-10, -104, -105 stored the quarrel with none of the three. The control keeps it: C dp-hamlet-0 (a grazing house).
describe('E3 · the grazing quarrel only where the place grazes; a calm place stores none', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });
  const V = (/** @type {string} */ seed) => generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: seed.split('-')[1], _randomizePriorities: true }), null, { seed, customContent: {} });
  const C = (/** @type {string} */ seed) => generateSettlementPipeline(birthConfig({ settType: seed.split('-')[1] }), null, { seed, customContent: {} });
  const QUARREL = /grazing rights and water access|^A dispute over (?:rights on|water access)/;
  it('V dp-thorp-10, -104, -105: no grazing in the record, and no quarrel stored', () => {
    for (const seed of ['dp-thorp-10', 'dp-thorp-104', 'dp-thorp-105']) {
      const s = V(seed);
      expect(s.powerStructure?.governingFaction ?? s.powerStructure?.government, `${seed}: a seat stands`).toBeTruthy();
      expect(QUARREL.test(String(s.powerStructure?.recentConflict ?? '')), `${seed}: ${s.powerStructure?.recentConflict}`).toBe(false);
    }
  }, 120_000);
  it('the control: C dp-hamlet-0 holds a grazing house and keeps the quarrel', () => {
    const s = C('dp-hamlet-0');
    expect(String(s.powerStructure?.recentConflict ?? '')).toMatch(/grazing rights and water access/);
  }, 120_000);
});
