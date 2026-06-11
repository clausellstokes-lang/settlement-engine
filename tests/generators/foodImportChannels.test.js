/**
 * tests/generators/foodImportChannels.test.js — one channel ladder, three
 * consumers.
 *
 * FOOD_IMPORT_RATES (data/foodImportRates.js) is the single source of truth
 * for the magical-transport / minor-route food import channels, shared by
 * economicGenerator, foodGenerator, and the tick-time stockpile
 * (domain/worldPulse/foodStockpile). Pins:
 *   • the table values themselves — drift between the three models is the
 *     bug this table exists to kill;
 *   • economicGenerator attribution: importChannel names the carrying
 *     channel and importCoverage moves at the table's rate, across the
 *     teleport / besieged-airship / open-sky-airship / minor-routes /
 *     no-arcane-maintainer rosters;
 *   • magicFoodOffset attribution rides on top of (not instead of) the
 *     channel coverage.
 */

import { describe, expect, test } from 'vitest';
import { FOOD_IMPORT_RATES } from '../../src/data/foodImportRates.js';
import { generateEconomicViability } from '../../src/generators/economicGenerator.js';

const MARKET = { name: 'District market' };
const CIRCLE = { name: 'Teleportation circle' };
const AIRSHIP = { name: 'Airship docking (high magic)' };
const WIZARD = { name: 'Hedge wizard' };

// Mountain city with no resources: a deep structural food deficit, so every
// channel has a gap to cover. priorityMagic 0 keeps magic FOOD offsets out
// of the rate math (transport infrastructure works regardless).
const mkSettlement = ({ institutions = [], stressTypes = [], tradeRouteAccess = 'isolated', priorityMagic = 0 } = {}) => ({
  name: 'Cragport',
  tier: 'city',
  population: 12000,
  config: {
    tradeRouteAccess,
    terrainType: 'mountain',
    magicExists: true,
    priorityMagic,
    priorityReligion: 0,
    stressTypes,
  },
  institutions,
  economicState: {},
});

const foodBalance = (opts) =>
  generateEconomicViability(mkSettlement(opts), 'mountain', []).metrics.foodBalance;

describe('the shared channel ladder', () => {
  test('pins the table both generators and the stockpile read', () => {
    expect(FOOD_IMPORT_RATES).toEqual({
      teleport: 0.3,
      airship: 0.3,
      airshipBesieged: 0.15,
      minorRoutes: 0.08,
      minorRoutesVillage: 0.05,
    });
    expect(Object.isFrozen(FOOD_IMPORT_RATES)).toBe(true);
  });
});

describe('economicGenerator attribution: importChannel + coverage rate', () => {
  test('teleportation circle: named channel at the teleport rate', () => {
    const fb = foodBalance({ institutions: [MARKET, CIRCLE, WIZARD] });
    expect(fb.importChannel).toBe('teleportation circle');
    expect(fb.importCoverage / fb.rawDeficit).toBeCloseTo(FOOD_IMPORT_RATES.teleport, 2);
  });

  test('besieged airship dock: impaired channel at the besieged rate', () => {
    const fb = foodBalance({
      institutions: [MARKET, AIRSHIP, WIZARD],
      tradeRouteAccess: 'road',
      stressTypes: ['under_siege'],
    });
    expect(fb.importChannel).toBe('airship runs (impaired by siege)');
    expect(fb.importCoverage / fb.rawDeficit).toBeCloseTo(FOOD_IMPORT_RATES.airshipBesieged, 2);
  });

  test('open-sky airship: full magical rate', () => {
    const fb = foodBalance({ institutions: [MARKET, AIRSHIP, WIZARD] });
    expect(fb.importChannel).toBe('airship traffic');
    expect(fb.importCoverage / fb.rawDeficit).toBeCloseTo(FOOD_IMPORT_RATES.airship, 2);
  });

  test('minor routes: the isolated-city trickle', () => {
    const fb = foodBalance({ institutions: [MARKET] });
    expect(fb.importChannel).toBe('minor routes and sanctioned caravans');
    expect(fb.importCoverage / fb.rawDeficit).toBeCloseTo(FOOD_IMPORT_RATES.minorRoutes, 2);
  });

  test('no arcane maintainer: the circle runs at half throughput', () => {
    const fb = foodBalance({ institutions: [MARKET, CIRCLE] }); // no wizard on the roster
    expect(fb.importChannel).toBe('teleportation circle');
    expect(fb.importCoverage / fb.rawDeficit).toBeCloseTo(FOOD_IMPORT_RATES.teleport * 0.5, 2);
  });

  test('a siege severs the minor routes entirely', () => {
    const fb = foodBalance({ institutions: [MARKET], tradeRouteAccess: 'road', stressTypes: ['under_siege'] });
    expect(fb.importChannel).toBeUndefined();
    expect(fb.importCoverage).toBeUndefined();
  });
});

describe('magicFoodOffset attribution', () => {
  test('druidic cultivation closes part of the post-import gap, and says so', () => {
    const fb = foodBalance({ institutions: [MARKET, { name: 'Druid circle' }], priorityMagic: 30 });
    expect(fb.magicFoodNote).toBe('Druidic cultivation provides partial food supplement');
    // The offset rides on the remaining gap AFTER channel coverage (×0.65).
    const remaining = fb.rawDeficit - fb.importCoverage;
    expect(fb.magicFoodOffset / remaining).toBeCloseTo(0.65, 2);
  });
});
