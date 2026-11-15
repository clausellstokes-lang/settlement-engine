/**
 * tests/generators/tailNarrativeRows.test.js — TAIL-NARRATIVE (READ-ALL 2026-11-14, the group NARRATIVE's worklist), one
 * collected guard a batch. Each row is a census town (born exactly as the census borns it) and a sentence the reader
 * flagged there, read false against that town's own record; each KEEP row is a true sibling that must still print.
 *
 * BATCH 1 — `narrativeText.js` (PRESSURE_SENTENCES, POLITICAL_FLAVOR, famineFoodIsPower) and the pressure detail's
 * roster flags (`narrativeGenerator.js :: genPressureDetail`: hasWarehouse, hasCivicHall, hasForce, millExports).
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { PRESSURE_SENTENCES, POLITICAL_FLAVOR } from '../../src/generators/narrativeText.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';

const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
/** The census's own configuration for its two seed families (CENSUS-3 seedcfg.mjs, r2r- and r2s-). @param {string} seed */
const cfgFor = (seed) => {
  let m = seed.match(/^r2r-(thorp|hamlet|village|town|city|metropolis)-\d+$/);
  if (m) return birthConfig({ ...DEFAULT_CONFIG, ...dials, settType: m[1] });
  m = /** @type {RegExpMatchArray} */ (seed.match(/^r2s-(\w+)-(thorp|hamlet|village|town|city|metropolis)-\d+$/));
  return birthConfig({ ...DEFAULT_CONFIG, ...dials, selectedStresses: [m[1]], selectedStressesRandom: false, settType: m[2] });
};
/** @type {Map<string, any>} */
const births = new Map();
/** @param {string} seed @returns {any} */
const born = (seed) => {
  if (!births.has(seed)) births.set(seed, generateSettlementPipeline(cfgFor(seed), null, { seed, customContent: {} }));
  return births.get(seed);
};
/** @param {any} s @param {'pressure'|'history'} where @returns {string} */
const read = (s, where) => String(where === 'pressure' ? s.pressureSentence : s.history?.historicalCharacter);

describe('B1 the narrative text rows read the town (TAIL-NARRATIVE batch 1)', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });

  /** [id, seed, where, must not print, what prints instead] */
  const CURED = /** @type {Array<[string, string, 'pressure'|'history', RegExp, RegExp]>} */ ([
    ['00053', 'r2s-under_siege-town-2', 'history', /nobody expects it/, /^The Siege /],
    ['B00096', 'r2r-thorp-9', 'history', /^"?Little has happened here/, /^"?Apart from the Uprising, little has happened/],
    ['20438', 'r2r-hamlet-36', 'pressure', /built for quieter years/, /^Three farmsteads/],
    ['20439', 'r2s-monster_pressure-hamlet-3', 'pressure', /built for quieter years/, /^Three farmsteads/],
    ['00338', 'r2s-politically_fractured-thorp-1', 'pressure', /Three powers in/, /^The powers of Mayanek are each waiting for the other to slip/],
    ['00172', 'r2s-monster_pressure-thorp-1', 'pressure', /Three farmsteads/, /^The bounty /],
    ['B00101', 'r2r-hamlet-8', 'history', /Nothing has ever forced/, /^"?It came through the Purge/],
    ['01333', 'r2r-hamlet-33', 'pressure', /paints its civic buildings/, /still keeps up its appearances/],
    ['00138', 'r2r-thorp-46', 'history', /made its name in trade/, /^"?It has come through the Iron Dispute/],
    ['11487', 'r2r-thorp-22', 'pressure', /sends to enforce/, /has no one to send who would be obeyed/],
    ['20366', 'r2s-indebted-thorp-3', 'pressure', /a warehouse here/, /\(a field here, a right of way there\)/],
    ['07115', 'r2s-insurgency-thorp-2', 'pressure', /power leader/, /whoever first offers something better/],
    ['01722', 'r2s-politically_fractured-thorp-2', 'pressure', /all three powers/, /the only person every power here will still speak to/],
    ['00010', 'r2r-thorp-59', 'history', /practitioners who work here/, /is still discussed here, carefully\./],
    ['20149', 'r2s-insurgency-thorp-3', 'pressure', /its own officials/, /comes from inside: dues held back/],
    ['11478', 'r2s-slave_revolt-thorp-1', 'pressure', /timber that made it/, /without destroying what made it worth holding/],
    ['00708', 'r2s-monster_pressure-village-3', 'pressure', /a mill standing idle/, /\(fields left unworked, a mill kept turning for its buyers\)/],
    ['01079', 'r2s-wartime-city-1', 'pressure', /is prospering on the right side/, /^Jalalserai is at war and, for now, on the right side of it/],
    ['03831', 'r2s-indebted-metropolis-0', 'pressure', /a distinction that has not gone unnoticed/, /took the loans and is now repaying them/],
    ['B17142', 'r2s-famine-town-1', 'pressure', /at least three powers/, /its strongest powers are fighting over/],
    ['B04491', 'r2r-city-37', 'pressure', /nor keep them fed/, /nor find them all work/],
    ['B01841', 'r2s-politically_fractured-metropolis-2', 'pressure', /all three powers/, /the only person every power here will still speak to/],
  ]);

  it('the flagged sentence no longer prints, and its slot says what the town bears (every row)', () => {
    expectNoSeedFailures(collectSeedFailures(CURED, ([id, seed, where, gone, instead]) => {
      const text = read(born(seed), where);
      expect(text, `${id} ${seed}: what prints instead`).toMatch(instead);
      // anchored: the line above asserts the slot printed its true line
      expect(text, `${id} ${seed}: the flagged sentence`).not.toMatch(gone);
    }), 'the flagged sentence no longer prints');
  });

  /** [id, seed, where, still prints] — a true sibling of each cured shape */
  const KEEP = /** @type {Array<[string, string, 'pressure'|'history', RegExp]>} */ ([
    ['00053', 'r2r-hamlet-37', 'history', /^"?Every plan made here now allows for the Siege happening again; nobody expects it/],
    ['00014', 'r2r-town-14', 'history', /the local clergy and the civic authority/],
    ['20438', 'r2r-hamlet-10', 'pressure', /were built for quieter years than these/],
    ['00338', 'r2r-village-53', 'pressure', /^Three powers in /],
    ['00172', 'r2s-monster_pressure-hamlet-1', 'pressure', /^Three farmsteads have been abandoned/],
    ['01333', 'r2s-indebted-city-1', 'pressure', /still paints its civic buildings/],
    ['00138', 'r2r-town-38', 'history', /made its name in trade, not war/],
    ['11487', 'r2s-insurgency-hamlet-3', 'pressure', /sends to enforce either turn back or turn coat/],
    ['20366', 'r2s-indebted-metropolis-1', 'pressure', /\(a warehouse here, a toll right there\)/],
  ]);

  it('the true sibling still prints where the record bears it out (every row)', () => {
    expectNoSeedFailures(collectSeedFailures(KEEP, ([id, seed, where, kept]) => {
      expect(read(born(seed), where), `${id} ${seed} keeps its line`).toMatch(kept);
    }), 'the true sibling still prints');
  });

  it('the branches without a birth: one power in both slots, the powers counted, a quiet history beside no great event', () => {
    const indebted = PRESSURE_SENTENCES.indebted({ name: 'X', topFaction: 'Old Council', govFaction: 'New Council' });
    expect(String(indebted[1])).toContain('Old Council took the loans and New Council is repaying them');
    const fractured = (/** @type {number} */ n) => PRESSURE_SENTENCES.politically_fractured({ name: 'X', powerCount: n, topNPCName: 'A', topNPCRole: 'elder' });
    expect(String(fractured(3)[1])).toContain('Three powers in X are each waiting for one of the others to slip');
    expect(String(fractured(3)[2])).toContain('the only person all three powers will still speak to');
    expect(String(fractured(5)[1])).toContain('The powers of X are each waiting for one of the others to slip');
    const quiet = [{ name: 'The Market Fair', severity: 'minor', type: 'economic' }];
    expect(/** @type {any} */ (POLITICAL_FLAVOR.stable[8])(quiet)).toMatch(/^Little has happened here worth writing down/);
    expect(/** @type {any} */ (POLITICAL_FLAVOR.stable[7])(quiet)).toMatch(/^Nothing has ever forced this place to change much/);
  });
});

/**
 * FA — A FOUNDER AND AN ORIGIN ROW THAT CANNOT BOTH BE (the chair's ruling (N3); RECORD-MEASURE-1 class a, 154 of 720):
 * an Origin row that names the GROUP that began the place (herders, fishers, a military post, a religious settlement, a
 * fair's traders) stands only beside a founder of that kind (`foundingRowAdmits.js :: ORIGIN_AGENT_KINDS`); a refused
 * row resolves draw-free onward to a row of its pool that agrees, else no Origin row (silence, the rule's own answer).
 */
describe('B2 the Origin row\'s group agrees with the founder (TAIL-NARRATIVE FA)', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });
  /** [seed, the founder, the refused row, the row now (null: no Origin row)] */
  const CURED = /** @type {Array<[string, RegExp, RegExp, RegExp | null]>} */ ([
    ['r2r-thorp-2', /^a healer who stopped/, /customs post/, /rest stop for traveling caravans/],
    ['r2r-town-9', /^merchants recognising/, /frontier outpost/, /valuable resource deposit/],
    ['r2s-famine-town-3', /^religious authorities/, /toll collection point/, /major overland trade route/],
    ['r2s-under_siege-village-2', /^refugees fleeing war/, /two rival mining operations/, /pass could only be crossed safely/],
    ['r2s-occupied-hamlet-0', /^a household that settled first/, /defensive stronghold/, /mining camp that became permanent/],
    ['r2s-monster_pressure-metropolis-3', /^the slow accretion/, /defensive stronghold/, /mining camp that became permanent/],
    ['r2s-politically_fractured-thorp-2', /^a discharged soldier/, /herders gathered/, null],
    ['r2r-city-36', /^a merchant coalition/, /sacred grove/, null],
  ]);
  it('the row the founder cannot be is gone; the slot holds an agreeing row or none (every row)', () => {
    expectNoSeedFailures(collectSeedFailures(CURED, ([seed, founder, gone, now]) => {
      const f = born(seed).history?.founding || {};
      expect(String(f.foundedBy), `${seed}: the founder`).toMatch(founder);
      if (now) expect(String(f.reason), `${seed}: the row now`).toMatch(now);
      else expect(f.reason ?? null, `${seed}: no Origin row`).toBeNull();
      expect(String(f.reason), `${seed}: the refused row`).not.toMatch(gone); // anchored: the two lines above assert the founding printed
    }), 'the row the founder cannot be is gone');
  });
  const KEEP = /** @type {Array<[string, RegExp, RegExp]>} */ ([
    ['r2r-thorp-37', /^a pair of siblings/, /herders gathered/],
    ['r2r-town-18', /^a noble granted lands/, /naval base/],
    ['r2r-thorp-33', /^a single extended family/, /sacred grove/],
    ['r2r-village-50', /^escaped serfs/, /mining camp that became permanent/],
  ]);
  it('a group row beside a founder of its kind still prints (every row)', () => {
    expectNoSeedFailures(collectSeedFailures(KEEP, ([seed, founder, kept]) => {
      const f = born(seed).history?.founding || {};
      expect(String(f.foundedBy), `${seed}: the founder`).toMatch(founder);
      expect(String(f.reason), `${seed} keeps its row`).toMatch(kept);
    }), 'a group row beside a founder of its kind still prints');
  });
});
