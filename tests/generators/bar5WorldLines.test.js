/**
 * tests/generators/bar5WorldLines.test.js — BAR5-WORLD (BRIEF-BAR5 L4, 2026-11-16): THE GUARD OF LAW 4's FOUNDING AND OF
 * LAW 5's DAILY-LIFE CELLS.
 *
 * (a) THE FOUNDING IS TOLD ONCE, BY THE HISTORY. The detector (`tests/helpers/pageLaws/law4.mjs :: law4n`, arm
 *     `4n-founding`) fires where the Overview's origin row says the town was founded roadside and the History's founding
 *     record (`history.founding.reason`) names no road. THE POSITIVE CONTROL is the read's real row (the sixty's
 *     bar0-village-famine-rand-23, red at the base 600b7683a: "Founded roadside, …" over "Origin: · grew because the local
 *     soil …"), constructed, so the detector cannot go blind. THE ZERO: the towns it fired in at the base now print the
 *     same row (the same pick: no draw moved) saying where the place stands, not how it was founded; and no row of the
 *     road arm founds the town (`settlementOriginProse.js :: ORIGIN_POOLS.road`).
 * (b) LAW 5's DAILY-LIFE CELLS (`dailyLifeLogic.js :: TERRAIN_CONTEXT.desert`, `ROUTE_CONTEXT` road, crossroads, river,
 *     port, mountain pass): each declares the ledger's atoms and the siege that stops the road, and resolves through the
 *     one rule: a besieged town's cell reads null (the field prints on no page: ledger DAILY_LIFE_CONTEXT), a calm road
 *     town with an inn keeps its line.
 * (c) LAW 5's daily-life slots (`domain/dailyLife.js`): a town under a famine or a siege is not told its bread is plentiful
 *     (r2s-famine-hamlet-2, r2s-famine-town-1, r2s-famine-metropolis-3 at the base); the surplus band takes its twin.
 * (d) THE CHAIR'S RULING WS1: the arabic foodways line ("… local produce and caravan-borne staples", `cultureProfiles.js`)
 *     takes its twin under a siege where it prints (`foodwaysPrintSiblings.js`): the read row of r2s-under_siege-metropolis-2
 *     and r2r-thorp-58 (besieged; red at the base); r2r-thorp-9 (calm) keeps it.
 * The census (corpus and dumps over the sixty, the 720 and the fresh 300) is the measure: the hand-back's table.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { LAW4 } from '../helpers/pageLaws/law4.mjs';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { ORIGIN_POOLS } from '../../src/generators/narrative/settlementOriginProse.js';
import { extractSettlementContext } from '../../src/components/new/dailyLifeLogic.js';
import { deriveDailyLife } from '../../src/domain/dailyLife.js';
import { FOOD_CULTURE } from '../../src/data/dailyLife/foodCulture.js';
import { foodwaysLineOf } from '../../src/domain/foodways.js';

const SIZE = '(thorp|hamlet|village|town|city|metropolis)';
const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'random' };
/** The census's own configuration (CENSUS-3 seedcfg.mjs: its r2r-, r2s- and bar0- arms). @param {string} seed */
const cfgFor = (seed) => {
  let m = seed.match(new RegExp(`^r2r-${SIZE}-\\d+$`));
  if (m) return birthConfig({ ...DEFAULT_CONFIG, ...dials, settType: m[1] });
  m = seed.match(new RegExp(`^bar0-${SIZE}-([a-z_+]+)-([a-z_]+)-\\d+$`));
  if (m) {
    const st = m[2] === 'calm' ? [] : m[2].split('+'); const route = m[3] === 'rand' ? {} : { tradeRouteAccess: m[3] };
    return birthConfig({ ...DEFAULT_CONFIG, ...route, settType: m[1], selectedStressesRandom: false, selectedStresses: st, _randomizePriorities: true });
  }
  m = /** @type {RegExpMatchArray} */ (seed.match(new RegExp(`^r2s-(\\w+)-${SIZE}-\\d+$`)));
  return birthConfig({ ...DEFAULT_CONFIG, ...dials, selectedStresses: [m[1]], selectedStressesRandom: false, settType: m[2] });
};
/** @type {Map<string, any>} */
const births = new Map();
/** @param {string} seed @returns {any} */
const born = (seed) => {
  if (!births.has(seed)) births.set(seed, generateSettlementPipeline(cfgFor(seed), null, { seed, customContent: {} }));
  return births.get(seed);
};
/** The origin row the Overview prints (the record's `settlementReason`, its first sentence). @param {any} s */
const originOf = (s) => String((Array.isArray(s.settlementReason) ? s.settlementReason[0] : s.settlementReason) || '');

const ROADSIDE = 'It stands roadside, where the day is measured in traffic: what arrives before noon, what leaves before dusk, and what stops for the night.';
/** The towns the founding detector fired in at the base (600b7683a; the audit's runner over PAGE-COPY renders). */
const FOUNDING_FIRED_AT_BASE = Object.freeze([
  'bar0-metropolis-calm-rand-25', 'bar0-village-famine-rand-23', 'bar0-village-famine-rand-25',
]);

describe('BAR5-WORLD (a): the founding is told once, by the History', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });

  it('the detector fires on the read row, constructed (the positive control)', () => {
    const reason = 'grew because the local soil produces something that cannot easily be grown elsewhere';
    const tabs = {
      'Summary/Overview': ['Settlement Origin▲', 'Founded roadside, where the day is measured in traffic: what arrives before noon, what leaves before dusk, and what stops for the night.'],
      'World/History': [`Origin: · ${reason}`],
    };
    const found = LAW4.law4n({ record: { history: { founding: { reason } } }, tabs, town: 'bar0-village-famine-rand-23' }).filter((i) => i.law === '4n-founding');
    expect(found.map((i) => [i.tab, i.against.line])).toEqual([['Summary/Overview', `Origin: · ${reason}`]]);
  });

  it('no row of the road arm founds the town; the row says where it stands', () => {
    expect(ORIGIN_POOLS.road[2]).toBe(ROADSIDE);
    expect(ORIGIN_POOLS.road.filter((r) => /^Founded\b/.test(r))).toEqual([]);
  });

  it('the towns it fired in at the base print the same row, telling no founding (every town)', () => {
    expectNoSeedFailures(collectSeedFailures(FOUNDING_FIRED_AT_BASE, (seed) => {
      const s = born(seed);
      expect(originOf(s), `${seed}: the same pick, reworded`).toBe(ROADSIDE);
      const tabs = { 'Summary/Overview': [originOf(s)], 'World/History': [`Origin: · ${s.history?.founding?.reason}`] };
      expect(LAW4.law4n({ record: s, tabs, town: seed }).filter((i) => i.law === '4n-founding').map((i) => i.line)).toEqual([]);
    }), 'the founding told once');
  });
});

describe('BAR5-WORLD (b): the daily-life cells that speak of the outside declare the siege', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });

  it('a calm road town with an inn keeps its line; a besieged road town reads null (every town)', () => {
    const cases = /** @type {Array<[string, string|null]>} */ ([
      ['bar0-hamlet-calm-rand-23', 'A main road means a steady trickle of travellers, merchants, and news.'],
      ['bar0-hamlet-under_siege-rand-25', null],
      ['bar0-hamlet-under_siege-rand-26', null],
    ]);
    expectNoSeedFailures(collectSeedFailures(cases, ([seed, starts]) => {
      const s = born(seed);
      expect(s.config?.tradeRouteAccess, `${seed}: a road town`).toBe('road');
      const ctx = extractSettlementContext(s);
      if (starts === null) expect(ctx.routeCtx, `${seed}: the siege refuses the road's traffic`).toBeNull();
      else expect(String(ctx.routeCtx).startsWith(starts), `${seed}: ${ctx.routeCtx}`).toBe(true);
    }), 'the route cell under a siege');
  });
});

describe('BAR5-WORLD (c): a town in want is not told its bread is plentiful', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });

  // DAILY-3 B3 E2 (LINES-2 § 1 as the chair ruled), the pin re-read: the surplus band under a famine or a siege now
  // takes its own pool, `FOOD_CULTURE['surplus.wanting']` (W0 "The stores still hold: …" and four siblings, by the keyed
  // pick), so these towns print W1, W4 and W2 where W0 alone printed. The meaning kept: a town in want is told what it
  // still has, never that its bread is plentiful.
  it('the famine towns of the surplus band print the stores that still hold (every town; red at the base)', () => {
    const wanting = FOOD_CULTURE['surplus.wanting'].map((l) => l.text);
    expect(wanting.length).toBeGreaterThan(0);
    expectNoSeedFailures(collectSeedFailures(['r2s-famine-hamlet-2', 'r2s-famine-town-1', 'r2s-famine-metropolis-3'], (seed) => {
      const text = String(deriveDailyLife(born(seed)).slots.food_culture?.text);
      expect(wanting, `${seed}: what prints instead: "${text}"`).toContain(text);
      expect(/plentiful|plenty/i.test(text), `${seed}: told its bread is plentiful: "${text}"`).toBe(false);
    }), 'the surplus band under a famine');
  });
});

describe('BAR5-WORLD (d): no caravan brings staples to a besieged town (WS1)', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });
  const ORIGINAL = 'Water access and preservation skill determine the balance between local produce and caravan-borne staples.';
  const TWIN = 'Water access and preservation skill decide how long local produce must last while no caravan can come.';

  it('the besieged towns print the twin; a calm town keeps the line (every town; red at the base)', () => {
    const cases = /** @type {Array<[string, string]>} */ ([['r2s-under_siege-metropolis-2', TWIN], ['r2r-thorp-58', TWIN], ['r2r-thorp-9', ORIGINAL]]);
    expectNoSeedFailures(collectSeedFailures(cases, ([seed, want]) => {
      const line = String(foodwaysLineOf(born(seed)));
      expect(line.includes(want), `${seed}: ${line}`).toBe(true);
    }), 'the caravan staples under a siege');
  });
});
