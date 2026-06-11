/**
 * tests/generators/isolatedTrade.test.js — isolated settlements trade, just
 * badly; sieges respect the laws of magical transport.
 *
 * Pins the channel ladder both food models share:
 *   • an isolated town+ gets a small minor-routes import coverage (sanctioned
 *     caravans, pilgrimage traffic, protected convoys) — never 0%;
 *   • a teleportation circle raises coverage to its capped, expensive rate
 *     (0.30 — deliberately below the 0.35 of a real road);
 *   • the channel has its own supply chain: no arcane maintainer → halved;
 *   • a siege severs minor routes, leaves a circle untouched, and impairs an
 *     airship-only settlement to half its magical rate;
 *   • planar traders / planar embassy require a teleportation circle on the
 *     roster (generation-time cull).
 */

import { describe, expect, test } from 'vitest';
import { generateFoodSecurity } from '../../src/generators/foodGenerator.js';
import { cullPlanarWithoutCircle } from '../../src/generators/isolationGenerator.js';
import { subsumeTradeGoods, reconcileTradeLists } from '../../src/domain/region/goodsCatalog.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';

const ISOLATED_CONFIG = {
  tradeRouteAccess: 'isolated',
  terrainType: 'forest',
  magicExists: true,
  priorityMagic: 60,
  priorityReligion: 30,
  _population: 30000,
};

const MARKET = { name: 'District market' };
const CIRCLE = { name: 'Teleportation circle' };
const AIRSHIP = { name: 'Airship docking (high magic)' };
const WIZARD = { name: 'Hedge wizard' };

describe('minor routes: isolated settlements still import, expensively', () => {
  test('an isolated city with no magical transport keeps a small nonzero import channel', () => {
    const fs = generateFoodSecurity('city', [MARKET], ISOLATED_CONFIG);
    // importDependency drives the dossier note and the tick-time blockade
    // coupling — 0 meant sieges could never touch an isolated granary.
    expect(fs.importDependency).toBeGreaterThan(0);
    expect(fs.importDependency).toBeLessThanOrEqual(0.05);
  });

  test('a thorp gets no minor-route channel — true subsistence', () => {
    const fs = generateFoodSecurity('thorp', [], { ...ISOLATED_CONFIG, _population: 40 });
    expect(fs.importDependency).toBe(0);
  });
});

describe('magical transport: capped, expensive, and supplied by its own chain', () => {
  test('a teleportation circle with a maintainer covers more of the deficit than minor routes alone', () => {
    const withCircle = generateFoodSecurity('city', [MARKET, CIRCLE, WIZARD], ISOLATED_CONFIG);
    const withoutCircle = generateFoodSecurity('city', [MARKET], ISOLATED_CONFIG);
    expect(withCircle.deficitPct).toBeLessThan(withoutCircle.deficitPct);
    expect(withCircle.magicTradeChannel).toBe('teleport');
    expect(withCircle.importDependency).toBeCloseTo(0.3, 5);
  });

  test('no arcane maintainer → the circle runs at half throughput', () => {
    const maintained = generateFoodSecurity('city', [MARKET, CIRCLE, WIZARD], ISOLATED_CONFIG);
    const unmaintained = generateFoodSecurity('city', [MARKET, CIRCLE], ISOLATED_CONFIG);
    expect(unmaintained.deficitPct).toBeGreaterThan(maintained.deficitPct);
  });
});

describe('siege vs the channels', () => {
  const besieged = (institutions) => generateFoodSecurity(
    'city', institutions, { ...ISOLATED_CONFIG, tradeRouteAccess: 'road', stressTypes: ['under_siege'] }
  );

  test('a siege severs minor routes: no circle, no airship → zero coverage', () => {
    const fs = besieged([MARKET]);
    expect(fs.magicTradeChannel).toBeNull();
    // effectiveRoute is forced to isolated and the minor-route floor is
    // siege-gated, so coverage must be zero: the granary carries the city.
    const fsOpen = generateFoodSecurity('city', [MARKET], { ...ISOLATED_CONFIG, tradeRouteAccess: 'road' });
    expect(fs.deficitPct).toBeGreaterThan(fsOpen.deficitPct);
  });

  test('a circle ignores the siege; an airship-only city lands half the circle rate', () => {
    const circle = besieged([MARKET, CIRCLE, WIZARD]);
    const airship = besieged([MARKET, AIRSHIP, WIZARD]);
    const nothing = besieged([MARKET]);
    expect(circle.deficitPct).toBeLessThan(airship.deficitPct);
    expect(airship.deficitPct).toBeLessThan(nothing.deficitPct);
    expect(airship.magicTradeChannel).toBe('airship');
  });
});

describe('planar institutions require a teleportation circle', () => {
  test('cull removes planar traders/embassy when no circle exists', () => {
    const roster = [
      { name: 'Planar traders' },
      { name: 'Planar embassy' },
      { name: "Mages' guild" },
    ];
    const removed = cullPlanarWithoutCircle(roster);
    expect(removed.sort()).toEqual(['Planar embassy', 'Planar traders']);
    expect(roster.map(i => i.name)).toEqual(["Mages' guild"]);
  });

  test('a circle on the roster spares them; DM-forced entries always survive', () => {
    const withCircle = [{ name: 'Planar traders' }, { name: 'Teleportation circle' }];
    expect(cullPlanarWithoutCircle(withCircle)).toEqual([]);
    const forced = [{ name: 'Planar embassy', source: 'forced' }];
    expect(cullPlanarWithoutCircle(forced)).toEqual([]);
    expect(forced).toHaveLength(1);
  });

  test('generated metropolises never list planar institutions without a circle', () => {
    for (const seed of [3, 11, 27, 42, 64]) {
      const s = generateSettlementPipeline(
        { settType: 'metropolis', priorityMagic: 80 }, null, { seed, customContent: {} }
      );
      const names = (s.institutions || []).map(i => i.name.toLowerCase());
      const hasPlanar = names.some(n => n.includes('planar trader') || n.includes('planar embassy'));
      const hasCircle = names.some(n => n.includes('teleportation circle'));
      if (hasPlanar) expect(hasCircle).toBe(true);
    }
  });
});

describe('trade-goods subsumption', () => {
  test('generic and specific grain labels collapse to one entry', () => {
    const out = subsumeTradeGoods(['Bulk grain and foodstuffs', 'Grain', 'Grain and malt']);
    expect(out).toEqual(['Grain']);
  });

  test('annotated labels survive over generic ones — the annotation explains the import', () => {
    const out = subsumeTradeGoods(['Bulk grain and foodstuffs', 'Bulk grain (local fields depleted)']);
    expect(out).toEqual(['Bulk grain (local fields depleted)']);
  });

  test('distinct services never merge even when they share a catalog id', () => {
    const out = subsumeTradeGoods(['Spellcasting (1st-3rd level)', 'Magical identification']);
    expect(out).toHaveLength(2);
  });

  test('opaque (custom) labels are never renamed or merged', () => {
    const out = subsumeTradeGoods(['Grain', 'Bulk grain and foodstuffs'], {
      opaque: new Set(['bulk grain and foodstuffs']),
    });
    expect(out).toEqual(['Grain', 'Bulk grain and foodstuffs']);
  });

  test('reconcileTradeLists drops exports the settlement also imports, sparing transit', () => {
    const out = reconcileTradeLists(
      ['Grain surplus', 'Furs and pelts (transit)', 'Glassware'],
      ['Bulk grain and foodstuffs']
    );
    expect(out).toEqual(['Furs and pelts (transit)', 'Glassware']);
  });

  test('generated settlements carry no duplicate canonical goods in imports or exports', () => {
    for (const seed of [5, 17, 23]) {
      const s = generateSettlementPipeline(
        { settType: 'metropolis' }, null, { seed, customContent: {} }
      );
      for (const list of [s.economicState?.primaryImports || [], s.economicState?.primaryExports || []]) {
        const after = subsumeTradeGoods(list);
        expect(after).toEqual(list); // already canonical — re-applying is a no-op
      }
    }
  });
});
