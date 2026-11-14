/**
 * tests/generators/foundingRowsRead.test.js — R2-CODE-A-5, the chair's rulings of 2026-11-13 22:42 UTC (the History
 * tab's "Origin:" row, #488 #594 #845 and the increment's ww-890 ww-915; the founder line, #571 #916).
 *
 * `narrativeGenerator.js :: genArrivalDetail` drew the Origin row from TERRAIN_NARRATIVE_HOOKS and its commodity
 * hooks, and the founder from FOUNDERS_BY_TIER, with no disqualifier read from the record. RULED: the draw reads the
 * record (`narrative/foundingRowAdmits.js`); a refused row resolves draw-free to the next admitted one.
 *   A1 every admit names a row its pool holds (no dead key);
 *   A2 the readers' towns, born as the app births them: the false row gone, the row in its place admitted;
 *   A3 the guard towns: the cured rows do not print where the record makes them false, and still print where it
 *      makes them true (the rule refuses only what it must);
 *   A4 a caller with no roster in reach keeps the drawn row.
 *   A5 (R2-CODE-A-9; the page census's P7a rise at 67d9acc59, banked 125, now 133): a REFUSED row never resolves
 *      onto a row that names a founder of its own (the record keeps one founder, the "Founded by:" row): the
 *      towns the resolution carried onto "a famous navigator retired here" print no second founder; a row DRAWN
 *      as one still prints (the resolution refuses only what it must); where every admitted row of the pool names
 *      a founder, the Origin row is not written (silence is not a false sentence).
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { TERRAIN_NARRATIVE_HOOKS } from '../../src/data/narrativeData.js';
import { genArrivalDetail } from '../../src/generators/narrativeGenerator.js';
import { FOUNDER_ADMITS, FOUNDING_REASON_ADMITS, NAMES_A_FOUNDER, admittedRow, foundingStateOf } from '../../src/generators/narrative/foundingRowAdmits.js';
import { setActiveRng, clearActiveRng } from '../../src/kernel/rngContext.js';
import { createPRNG } from '../../src/kernel/prng.js';
import { readFileSync } from 'node:fs';

/** The census's dials (its r2r births) and the readers' rr2s/rww shapes (the app's own). */
const CENSUS_DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
const born = (/** @type {string} */ seed) => {
  const r2r = /^r2r-(\w+)-\d+$/.exec(seed);
  const rr2s = /^rr2s-(\w+)-([a-z_+]+)-(rand|[a-z_]+)-\d+$/.exec(seed);
  const rww = /^rww-(\w+)-([a-z_+]+)-\d+$/.exec(seed);
  const stresses = (/** @type {string} */ w) => (w === 'calm' ? [] : w.split('+'));
  const shape = r2r ? { ...CENSUS_DIALS, settType: r2r[1] }
    : rr2s ? { settType: rr2s[1], selectedStressesRandom: false, selectedStresses: stresses(rr2s[2]), _randomizePriorities: true, ...(rr2s[3] === 'rand' ? {} : { tradeRouteAccess: rr2s[3] }) }
      : { settType: rww?.[1], selectedStressesRandom: false, selectedStresses: stresses(String(rww?.[2])), _randomizePriorities: true };
  return /** @type {any} */ (generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...shape }), null, { seed, customContent: {} }));
};
const stateOf = (/** @type {any} */ s) => foundingStateOf(s.config, { _institutions: s.institutions }, null);

describe('the founding rows read the record', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });

  it('A1: every admit names a row its pool holds', () => {
    const rows = new Set(Object.values(TERRAIN_NARRATIVE_HOOKS).flat());
    const src = readFileSync(new URL('../../src/generators/narrativeGenerator.js', import.meta.url), 'utf8');
    for (const row of Object.keys(FOUNDING_REASON_ADMITS)) expect(rows.has(row) || src.includes(JSON.stringify(row).slice(1, -1)) || src.includes(row.replace(/'/g, "\\'")), row).toBe(true);
    for (const row of Object.keys(FOUNDER_ADMITS)) expect(src.includes(`'${row}'`), row).toBe(true);
  });

  it('A2: the false Origin row is gone and the row in its place is admitted (every row)', () => {
    expectNoSeedFailures(collectSeedFailures([
      ['rr2s-town-under_siege-rand-1', /the local soil produces something/], // #488: no crop of its own
      ['rr2s-town-plague_onset-rand-1', /salt deposit/], // #594: no salt near
      ['rr2s-village-famine-rand-29', /sacred grove/], // #845: no grove near (re-keyed by identity, R2-CODE-A-9: after the line's merge rr2s-city-famine-rand-1 holds an ancient grove, so the row is true there; this famine birth draws the row with none near)
      ['rww-thorp-plague_onset-1', /mill rights/], // ww-890: no mill of its own
      ['rww-hamlet-mass_migration-1', /riverside mill settlement/], // ww-915: no mill of its own
    ], ([seed, gone]) => {
      const s = born(seed);
      expect(s.history.founding.reason, `${seed}: the false Origin row is gone`).not.toMatch(gone);
      const test = FOUNDING_REASON_ADMITS[s.history.founding.reason];
      expect(!test || test(stateOf(s)), `${seed}: the row in its place is admitted`).toBe(true);
    }), 'A2: the false Origin row is gone and the row in its place is admitted');
  });

  it('A2: the founder is no miller who found customers (every row)', () => {
    expectNoSeedFailures(collectSeedFailures(['rww-hamlet-famine-1', 'rww-hamlet-succession_void-1', 'rww-hamlet-mass_migration-1'], (seed) => {
      expect(born(seed).history.founding.foundedBy, `${seed}: the founder is no miller who found customers`).toBe('a household that settled first and found others following it in');
    }), 'A2: the founder is no miller who found customers');
  });

  it('A3: guard town — the row does not print (every row)', () => {
    expectNoSeedFailures(collectSeedFailures([
      // guard towns: the record makes the row false, so it does not print
      ['r2r-thorp-59', /coastal trading port/], // a river route on the coast: not a port by its route
      ['r2r-hamlet-4', /maritime hub/], // a port hamlet: no hub
      ['r2r-thorp-8', /agricultural market center/], // a thorp with no market
      ['r2r-thorp-29', /logging operation/], // sacred wood sold, no timber near
      ['r2r-hamlet-6', /riverside mill settlement/], // no mill of its own
    ], ([seed, gone]) => {
      expect(born(seed).history.founding.reason, `${seed}: the row does not print`).not.toMatch(gone);
    }), 'A3: guard town — the row does not print');
  });

  it('A3: the refused rows still print where the record makes them true (a port city: the trading port row is admitted)', () => {
    const port = { facts: { route: 'port', tier: 'city', water: { kind: 'maritime' }, market: true, hasInstitution: () => true }, resources: new Set() };
    expect(FOUNDING_REASON_ADMITS['was founded as a coastal trading port'](port)).toBe(true);
    expect(FOUNDING_REASON_ADMITS['grew from a fishing village into a maritime hub'](port)).toBe(true);
    const river = { ...port, facts: { ...port.facts, route: 'river' } };
    expect(FOUNDING_REASON_ADMITS['was founded as a coastal trading port'](river)).toBe(false);
    const grove = { facts: {}, resources: new Set(['ancient_grove']) };
    expect(FOUNDING_REASON_ADMITS['developed around a sacred grove that attracted religious settlement'](grove)).toBe(true);
    expect(FOUNDING_REASON_ADMITS['developed around a sacred grove that attracted religious settlement']({ facts: {}, resources: new Set() })).toBe(false);
  });

  it('A4: a caller with no roster in reach keeps the drawn row', () => {
    expect(admittedRow(['a', 'b'], 'a', { a: () => false }, null)).toBe('a');
    setActiveRng(createPRNG('bare-1'));
    try { expect(typeof genArrivalDetail({ terrainType: 'plains', tradeRouteAccess: 'road', tier: 'hamlet' })?.reason).toBe('string'); }
    finally { clearActiveRng(); }
  });

  it('A5: the rows that name a founder are the pools\' rows of the census\'s 7a shapes, each written once', () => {
    // the shapes as pageCensusFindings.js :: FOUNDER reads them ("was founded as" is a kind of place, no founder)
    const SHAPE = /^(was founded by|was settled by|was established by|grew because a healer|grew because a famous navigator|was built around a single family)/;
    const src = readFileSync(new URL('../../src/generators/narrativeGenerator.js', import.meta.url), 'utf8');
    const commodity = [...src.matchAll(/^\s*['"]((?:was|grew|began|started|developed|attracted)[^'"\n]*?)['"],?\s*$/gm)].map((m) => m[1]);
    const rows = [...Object.values(TERRAIN_NARRATIVE_HOOKS).flat(), ...commodity];
    expect(new Set(rows.filter((r) => SHAPE.test(r)))).toEqual(new Set(NAMES_A_FOUNDER));
  });

  it('A5: a refused coastal row resolves onto no second founder (every row)', () => {
    expectNoSeedFailures(collectSeedFailures([
      'r2r-thorp-22', 'r2r-thorp-59', 'r2r-hamlet-53', 'r2r-village-21', 'r2r-village-51', 'r2r-town-3',
      'r2s-insurgency-city-0', 'r2s-religious_conversion-village-2',
    ], (seed) => {
      const plan = /^r2s-(\w+)-(\w+)-\d+$/.exec(seed);
      const s = plan
        ? /** @type {any} */ (generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...CENSUS_DIALS, settType: plan[2], selectedStresses: [plan[1]], selectedStressesRandom: false }), null, { seed, customContent: {} }))
        : born(seed);
      expect(NAMES_A_FOUNDER.has(String(s.history.founding.reason)), `${seed}: a refused coastal row resolves onto no second founder`).toBe(false);
    }), 'A5: a refused coastal row resolves onto no second founder');
  });

  it('A5: the resolution passes over a founder row, keeps one drawn, and falls silent where only such rows are admitted', () => {
    const st = /** @type {any} */ ({ facts: {}, resources: new Set() });
    const no = () => false;
    expect(admittedRow(['p', 'nav', 'q'], 'p', { p: no }, st, new Set(['nav']))).toBe('q');
    expect(admittedRow(['p', 'nav', 'q'], 'nav', { p: no }, st, new Set(['nav']))).toBe('nav');
    expect(admittedRow(['p', 'nav'], 'p', { p: no }, st, new Set(['nav']))).toBe(null);
    expect(admittedRow(['p', 'q'], 'p', { p: no, q: no }, st, new Set(['nav']))).toBe('p');
  });

  it('A5: guard town r2r-city-16 — the navigator row DRAWN as such still prints', () => {
    expect(born('r2r-city-16').history.founding.reason).toBe('grew because a famous navigator retired here and others followed');
  });
});
