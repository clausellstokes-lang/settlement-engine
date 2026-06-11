/**
 * Join harness — arrival tables key alignment (Wave 6 #1).
 *
 * Two key-format joins were repaired in generateArrivalScene:
 *
 * 1. ARRIVAL_SCENES is keyed by SCENE (market/river/smoke/guild/ordinary) but
 *    was indexed by trade ROUTE — only 'river' collided into a hit; road,
 *    crossroads, port, isolated and mountain_pass all fell to the bare
 *    '… comes into view.' fallback. The repair is the exported ROUTE_TO_SCENE
 *    mapping; this harness pins that every mapped value lands on a real,
 *    non-empty scene pool and that the 'ordinary' default exists.
 *
 * 2. ARRIVAL_ADDONS is keyed by ROUTE but was indexed by
 *    economicState.tradeCommodity — a field nothing writes on economicState
 *    (historyGenerator computes tradeCommodity into history context only).
 *    Now indexed by route; this harness pins that every addon key IS a route
 *    the config vocabulary can produce, so every pool is reachable.
 */

import { describe, test, expect } from 'vitest';
import { ROUTE_TO_SCENE } from '../../src/generators/narrativeGenerator.js';
import { ARRIVAL_SCENES, ARRIVAL_ADDONS } from '../../src/data/narrativeData.js';

// The route vocabulary: ConfigurationPanel options (minus the 'random_trade'
// sentinel, which resolveConfig resolves away) + resolveConfig pool values.
const ROUTE_VOCABULARY = ['road', 'river', 'port', 'crossroads', 'isolated', 'mountain_pass'];

describe('join: ROUTE_TO_SCENE values are real ARRIVAL_SCENES keys', () => {
  test('every mapped scene key has a non-empty template pool', () => {
    for (const [route, sceneKey] of Object.entries(ROUTE_TO_SCENE)) {
      expect(ARRIVAL_SCENES[sceneKey], `route '${route}' maps to missing scene '${sceneKey}'`).toBeDefined();
      expect(ARRIVAL_SCENES[sceneKey].length).toBeGreaterThan(0);
    }
  });

  test("the 'ordinary' default pool exists and is non-empty", () => {
    expect(Array.isArray(ARRIVAL_SCENES.ordinary)).toBe(true);
    expect(ARRIVAL_SCENES.ordinary.length).toBeGreaterThan(0);
  });

  test('every route in the config vocabulary resolves to a non-empty scene pool', () => {
    for (const route of ROUTE_VOCABULARY) {
      const sceneKey = ROUTE_TO_SCENE[route] || 'ordinary';
      expect(ARRIVAL_SCENES[sceneKey]?.length, `route '${route}' → scene '${sceneKey}'`).toBeGreaterThan(0);
    }
  });

  test('mapped routes only use the route vocabulary (no phantom keys)', () => {
    for (const route of Object.keys(ROUTE_TO_SCENE)) {
      expect(ROUTE_VOCABULARY, `ROUTE_TO_SCENE key '${route}' is not a real route`).toContain(route);
    }
  });
});

describe('join: ARRIVAL_ADDONS is keyed by reachable routes', () => {
  test('every addon key is a route the config vocabulary can produce', () => {
    for (const key of Object.keys(ARRIVAL_ADDONS)) {
      expect(ROUTE_VOCABULARY, `addon key '${key}' is unreachable by route`).toContain(key);
    }
  });

  test('every addon template renders a non-empty string for (name, tier)', () => {
    for (const [key, pool] of Object.entries(ARRIVAL_ADDONS)) {
      expect(pool.length, `addon pool '${key}'`).toBeGreaterThan(0);
      for (const template of pool) {
        const rendered = template('Testford', 'town');
        expect(typeof rendered).toBe('string');
        expect(rendered.length, `addon template under '${key}'`).toBeGreaterThan(0);
      }
    }
  });
});
