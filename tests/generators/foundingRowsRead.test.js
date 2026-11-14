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
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { TERRAIN_NARRATIVE_HOOKS } from '../../src/data/narrativeData.js';
import { genArrivalDetail } from '../../src/generators/narrativeGenerator.js';
import { FOUNDER_ADMITS, FOUNDING_REASON_ADMITS, admittedRow, foundingStateOf } from '../../src/generators/narrative/foundingRowAdmits.js';
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

  it.each([
    ['rr2s-town-under_siege-rand-1', /the local soil produces something/], // #488: no crop of its own
    ['rr2s-town-plague_onset-rand-1', /salt deposit/], // #594: no salt near
    ['rr2s-city-famine-rand-1', /sacred grove/], // #845: no grove near
    ['rww-thorp-plague_onset-1', /mill rights/], // ww-890: no mill of its own
    ['rww-hamlet-mass_migration-1', /riverside mill settlement/], // ww-915: no mill of its own
  ])('A2: %s — the false Origin row is gone and the row in its place is admitted', (seed, gone) => {
    const s = born(seed);
    expect(s.history.founding.reason).not.toMatch(gone);
    const test = FOUNDING_REASON_ADMITS[s.history.founding.reason];
    expect(!test || test(stateOf(s))).toBe(true);
  });

  it.each(['rww-hamlet-famine-1', 'rww-hamlet-succession_void-1', 'rww-hamlet-mass_migration-1'])('A2: %s — the founder is no miller who found customers', (seed) => {
    expect(born(seed).history.founding.foundedBy).toBe('a household that settled first and found others following it in');
  });

  it.each([
    // guard towns: the record makes the row false, so it does not print
    ['r2r-thorp-59', /coastal trading port/], // a river route on the coast: not a port by its route
    ['r2r-hamlet-4', /maritime hub/], // a port hamlet: no hub
    ['r2r-thorp-8', /agricultural market center/], // a thorp with no market
    ['r2r-thorp-29', /logging operation/], // sacred wood sold, no timber near
    ['r2r-hamlet-6', /riverside mill settlement/], // no mill of its own
  ])('A3: guard town %s — the row does not print', (seed, gone) => {
    expect(born(seed).history.founding.reason).not.toMatch(gone);
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
});
