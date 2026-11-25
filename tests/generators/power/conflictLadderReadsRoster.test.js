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

// WORDS-2 E3, the tenth chair's RULING G9 (2) and its STOP (the owner's "Don't invent drama capitalize on what's already there
// if it's there"): the cascade's last fall-through keeps each quarrel only where the record holds what it names
// (`powerSiblings.js :: noGrazingQuarrelOf`): the grazing quarrel where it holds grazing; BAR8-K-POWERS's marsh, shore or water
// twin, word for word, where it holds that; a calm place holding none stores none. The oracle here is the test's own reading
// of the record, not the leaf. Red first by name on 0ec96f13d8: V dp-thorp-10, -104, -105, -110, -113 stored the grazing
// quarrel with no grazing in the record. Controls that keep their grounded quarrel: V dp-thorp-17 (the shore), dp-thorp-111
// (water), C dp-hamlet-0 (a grazing house).
describe('E3 · each fall-through quarrel only where the record holds what it names', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });
  const V = (/** @type {string} */ seed) => generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: seed.split('-')[1], _randomizePriorities: true }), null, { seed, customContent: {} });
  const C = (/** @type {string} */ seed) => generateSettlementPipeline(birthConfig({ settType: seed.split('-')[1] }), null, { seed, customContent: {} });
  /** @param {string} line */
  const kindOf = (line) => (/grazing rights and water access/.test(line) ? 'grazing'
    : /^A dispute over rights on the marsh/.test(line) ? 'marsh'
      : /^A dispute over rights on the shore/.test(line) ? 'shore'
        : /^A dispute over water access/.test(line) ? 'water' : '');
  /** What the record holds, read by this test's own words. @param {any} s */
  const holds = (s) => {
    const grounds = (s?.config?.nearbyResources || []).map(String);
    const names = (s?.institutions || []).map((/** @type {any} */ i) => String(i?.name || ''));
    return {
      grazing: s?.economicState?.foodSecurity?.chains?.['Pastoral & livestock'] === true
        || names.some((n) => /grazing|pasture|herd|shepherd|livestock|cattle|sheep|goat|ranch|dairy|stockyard|horse|stable|drover/i.test(n))
        || grounds.some((g) => /grass|pasture|meadow|steppe|grazing|herds?\b/i.test(g)),
      marsh: grounds.some((g) => /marsh/i.test(g)),
      shore: grounds.some((g) => /harbour|coast|shore|beach/i.test(g)),
      water: grounds.some((g) => /marsh|harbour|coast|shore|beach|fish|river|oasis|spring|floodplain|lake/i.test(g))
        || ['riverside', 'coastal'].includes(s?.config?.terrainType) || ['river', 'port'].includes(s?.config?.tradeRouteAccess),
    };
  };
  it('V dp-thorp-10, -104, -105, -110, -113: no grazing in the record, no grazing quarrel; any quarrel names what it holds', () => {
    /** @type {Record<string, string>} */
    const got = {};
    for (const seed of ['dp-thorp-10', 'dp-thorp-104', 'dp-thorp-105', 'dp-thorp-110', 'dp-thorp-113']) {
      const s = V(seed);
      const k = kindOf(String(s.powerStructure?.recentConflict ?? ''));
      const h = /** @type {Record<string, boolean>} */ (holds(s));
      expect(h.grazing, `${seed}: the record holds no grazing`).toBe(false);
      if (k) expect(h[k], `${seed}: "${k}" quarrel, held ${JSON.stringify(h)}`).toBe(true);
      got[seed] = k;
    }
    expect(got).toEqual({ 'dp-thorp-10': '', 'dp-thorp-104': 'water', 'dp-thorp-105': '', 'dp-thorp-110': 'marsh', 'dp-thorp-113': 'marsh' });
  }, 180_000);
  it('the controls keep their grounded quarrel: V dp-thorp-17 the shore, dp-thorp-111 water, C dp-hamlet-0 grazing', () => {
    expect(kindOf(String(V('dp-thorp-17').powerStructure?.recentConflict ?? ''))).toBe('shore');
    expect(kindOf(String(V('dp-thorp-111').powerStructure?.recentConflict ?? ''))).toBe('water');
    expect(kindOf(String(C('dp-hamlet-0').powerStructure?.recentConflict ?? ''))).toBe('grazing');
  }, 180_000);
});
