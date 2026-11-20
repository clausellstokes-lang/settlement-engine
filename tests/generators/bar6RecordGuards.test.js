/**
 * tests/generators/bar6RecordGuards.test.js — BAR6-RECORD (BRIEF-BAR6 B2 and L4, 2026-11-16): THE GUARD OF THE RECORD'S
 * OWN LISTS. Each arm is a fact made once and read by both surfaces; each cured line is shown gone on the read's own towns
 * (REVIEW-WIDE-6's standing rows) and a true sibling of it is kept, so the arm cannot go vacuous.
 *
 * (c) 9d.isolated: AN ISOLATED ROUTE WITH A MINOR ROUTE IS A POOR ROAD, NOT NO TRADE (`facts/tradeReach.js ::
 *     minorRoutesReach`). C193977, C194173, C194531 (bar0-town-occupied-rand-38) and the 150's other two towns: the trade
 *     dependency says the poor road and the Outlook's line says "supplied only irregularly"; a hamlet off every road
 *     (r2r-hamlet-34) keeps "No trade access: running on existing stockpiles only."
 * (a) 6c-arms: WHAT A HOUSE CAN MAKE (`computeActiveChains.js :: fineArmsMadeHere`). C86447, C86484 (bar0-hamlet-calm-rand-36,
 *     a part-time smith) and bar0-hamlet-calm-rand-30, bar0-village-calm-rand-37 (a lone village Blacksmith): no fine arms
 *     on the chain card, the made list or the exports; Blacksmiths (3-10) (r2r-town-58) keep them. THE POSITIVE CONTROL:
 *     the auditor's record detector (`law6cRecord`) on a constructed hamlet exporting fine arms by a part-time smith.
 * (b) 6c's pair lines: raw sand leaves only where a glasshouse works the sand (C88481, C204663; r2r-metropolis-19 keeps it
 *     beside its Glassmakers); charcoal only where a charcoal burner stands (C171330; r2r-hamlet-56 keeps it); the mountain
 *     timber's planks only beside a sawmill; the half-way leaf denies the hides' leatherwork on the Livestock card and the
 *     timber's charcoal on the Mountain Timber card (`facts/halfWayGoods.js :: halfWayGoodsDenied`).
 * The census (corpus and dumps over the 150, the 720 and the fresh 300, the auditors' runners) is the measure: the
 * hand-back's table "THE RULES".
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { law6cRecord } from '../helpers/pageLaws/law6.mjs';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { minorRoutesReach } from '../../src/domain/facts/tradeReach.js';
import { POOR_ROAD_SUPPLY_LINE } from '../../src/generators/economy/economicState.js';
import { halfWayGoodsDenied } from '../../src/domain/facts/halfWayGoods.js';

const SIZE = '(thorp|hamlet|village|town|city|metropolis)';
const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
/** The census's own configuration (CENSUS-3 seedcfg.mjs: its r2r- and bar0- arms). @param {string} seed */
const cfgFor = (seed) => {
  let m = seed.match(new RegExp(`^r2r-${SIZE}-\\d+$`));
  if (m) return birthConfig({ ...DEFAULT_CONFIG, ...dials, settType: m[1] });
  m = /** @type {RegExpMatchArray} */ (seed.match(new RegExp(`^bar0-${SIZE}-([a-z_+]+)-([a-z_]+)-\\d+$`)));
  const st = m[2] === 'calm' ? [] : m[2].split('+'); const route = m[3] === 'rand' ? {} : { tradeRouteAccess: m[3] };
  return birthConfig({ ...DEFAULT_CONFIG, ...route, settType: m[1], selectedStressesRandom: false, selectedStresses: st, _randomizePriorities: true });
};
beforeAll(async () => { await loadGenerationLawPayloads(); });
/** @type {Map<string, any>} */
const births = new Map();
/** @param {string} seed @returns {any} */
const born = (seed) => {
  if (!births.has(seed)) births.set(seed, generateSettlementPipeline(cfgFor(seed), null, { seed, customContent: {} }));
  return births.get(seed);
};
const FINE = /^(Advanced weapons and armor|Master-crafted weapons)$/;
/** Every list a town's fine arms could print from. @param {any} s @returns {string[]} */
const armsOf = (s) => [
  ...(s.economicState.primaryExports || []), ...(s.economicState.localProduction || []),
  ...(s.economicState.activeChains || []).flatMap((c) => c.outputs || []),
].filter((x) => FINE.test(String(x)));
/** The Outlook's isolated line of a town, if any. @param {any} s */
const isolatedLine = (s) => (s.economicViability?.issues || []).map((i) => String(i.description || '')).find((d) => /\(isolated trade\)/.test(d)) || '';

describe('BAR6-RECORD (c): an isolated route with a minor route is a poor road (9d.isolated)', () => {
  it('the leaf: a village or larger off the roads keeps a minor route; a hamlet, a siege or a road does not take this fact', () => {
    expect([
      minorRoutesReach({ route: 'isolated', tier: 'village' }), minorRoutesReach({ route: 'isolated', tier: 'metropolis' }),
      minorRoutesReach({ route: 'isolated', tier: 'hamlet' }), minorRoutesReach({ route: 'isolated', tier: 'town', siege: true }),
      minorRoutesReach({ route: 'road', tier: 'town' }),
    ]).toEqual([true, true, false, false, false]);
  });
  it('the read towns say the poor road on the Services row and the Outlook; a hamlet off every road keeps the stockpile line', () => {
    const failures = collectSeedFailures(['bar0-town-occupied-rand-38', 'bar0-village-calm-rand-27', 'bar0-village-famine-rand-40'], (seed) => {
      const s = born(seed);
      const impacts = (s.economicState.tradeDependencies || []).map((d) => d.impact);
      expect(impacts).toContain(POOR_ROAD_SUPPLY_LINE);
      expect(impacts.includes('No trade access: running on existing stockpiles only.')).toBe(false);
      expect(isolatedLine(s)).toMatch(/supplied only irregularly over a poor road \(isolated trade\)/);
    });
    expectNoSeedFailures(failures, 'the poor road where a minor route reaches');
    const keep = born('r2r-hamlet-34');
    expect(keep.economicState.tradeDependencies.map((/** @type {any} */ d) => d.impact)).toContain('No trade access: running on existing stockpiles only.');
  });
});

describe('BAR6-RECORD (a): what a house can make (6c-arms)', () => {
  it('a part-time smith or a lone village blacksmith makes no fine arms on any list; Blacksmiths (3-10) do', () => {
    const failures = collectSeedFailures(['bar0-hamlet-calm-rand-36', 'bar0-hamlet-calm-rand-30', 'bar0-village-calm-rand-37'], (seed) => {
      const s = born(seed);
      expect(armsOf(s)).toEqual([]);
      expect(s.economicState.primaryExports).toContain('Quality tools and weapons'); // the smith's own work still leaves
    });
    expectNoSeedFailures(failures, 'no fine arms beside a small smith');
    expect(armsOf(born('r2r-town-58'))).toContain('Advanced weapons and armor');
  });
  it('THE POSITIVE CONTROL: the record detector fires on a hamlet exporting fine arms by a part-time smith', () => {
    const record = { tier: 'hamlet', population: 24, economicState: { primaryExports: ['Advanced weapons and armor'] }, institutions: [{ name: 'Resident smith (part-time)' }] };
    expect(law6cRecord(record, 'constructed').map((x) => x.rule)).toEqual(['6c-rec']);
  });
});

describe('BAR6-RECORD (b): the pair lines are one fact each (6c-unsold, 6c-halfway)', () => {
  it('raw sand leaves only beside a glasshouse; charcoal only beside a charcoal burner', () => {
    /** The good each read town exported with no house to work it (C88481, C204663, C171330; the 150's town-occupied-rand-37). */
    const UNWORKED = /** @type {Record<string, string>} */ ({ 'bar0-hamlet-calm-rand-40': 'Raw sand', 'bar0-village-calm-rand-33': 'Raw sand', 'bar0-town-calm-rand-37': 'Charcoal', 'bar0-town-occupied-rand-37': 'Pine planks' });
    const failures = collectSeedFailures(Object.keys(UNWORKED), (seed) => {
      const ex = born(seed).economicState.primaryExports.map((/** @type {string} */ x) => x.replace(/ \(taxed by occupation\)$/, ''));
      expect(ex.includes(UNWORKED[seed])).toBe(false);
      expect(ex.length).toBeGreaterThan(0);
    });
    expectNoSeedFailures(failures, 'no finished or raw good leaves that no house here works');
    expect(born('r2r-metropolis-19').economicState.primaryExports).toContain('Raw sand');
    expect(born('r2r-hamlet-56').economicState.primaryExports).toContain('Charcoal');
  });
  it('the half-way leaf denies the hides\' leatherwork on the Livestock card and the timber\'s charcoal on the Mountain Timber card', () => {
    const gap = (/** @type {string} */ chain, /** @type {string[]} */ missing) => ({ resourceAnalysis: { gaps: [{ chain, missing, impact: 'Cannot produce final goods, limited to intermediate products' }] } });
    expect([...halfWayGoodsDenied(gap('animal hides', ["Leatherworkers' guild"]), { chainId: 'livestock' })]).toContain('Leather goods');
    expect([...halfWayGoodsDenied(gap('mountain_timber', ['Charcoal burner']), { chainId: 'mountain_timber_harvest' })]).toEqual(['Charcoal']);
    expect([...halfWayGoodsDenied(gap('timber', ['Sawmill']), { chainId: 'timber' })]).toContain('Milled lumber');
  });
});
