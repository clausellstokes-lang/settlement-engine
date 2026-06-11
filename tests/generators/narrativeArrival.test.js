/**
 * Arrival-scene grounding — regression for the cross-wired arrival tables
 * (Wave 6 #1, GENERATION_COHERENCE_AUDIT high).
 *
 * ARRIVAL_SCENES is keyed by SCENE (market/river/smoke/guild/ordinary) but was
 * indexed by the raw trade ROUTE — only 'river' ever hit; every other
 * settlement opened on the bare '… comes into view.' fallback. ARRIVAL_ADDONS
 * is keyed by ROUTE but was indexed by economicState.tradeCommodity — a field
 * nothing writes on economicState — so addons never fired at all.
 * generateArrivalScene now routes through ROUTE_TO_SCENE and indexes the
 * addons by route.
 *
 * Also pins generateSiegeCapability: currentTensions is an ARRAY of tension
 * objects; interpolating it raw printed '[object Object]' and the
 * `|| fallback` never fired because an empty array is truthy.
 */

import { describe, test, expect } from 'vitest';
import {
  generateArrivalScene,
  generateSiegeCapability,
  ROUTE_TO_SCENE,
} from '../../src/generators/narrativeGenerator.js';
import { ARRIVAL_SCENES, ARRIVAL_ADDONS } from '../../src/data/narrativeData.js';

// The full route vocabulary the config UI / resolveConfig can produce.
const ROUTES = ['road', 'river', 'port', 'crossroads', 'isolated', 'mountain_pass'];

const settlementFor = (route) => ({
  name: 'Testford',
  tier: 'town',
  config: { tradeRouteAccess: route, culture: 'germanic', priorityMagic: 0 },
  institutions: [],
  stress: null,
});

// Render every template of a pool so the assertion is independent of which
// one the (unseeded) picker chose.
const renderPool = (pool, name, tier) =>
  (pool || []).map(t => (typeof t === 'function' ? t(name, tier) : t));

describe('arrival scene resolves for every route value (no bare fallback)', () => {
  test.each(ROUTES)('route %s opens on a real scene from its mapped pool', (route) => {
    const scene = generateArrivalScene(settlementFor(route));
    expect(typeof scene).toBe('string');

    const sceneKey = ROUTE_TO_SCENE[route] || 'ordinary';
    const candidates = renderPool(ARRIVAL_SCENES[sceneKey], 'Testford', 'town');
    expect(candidates.length).toBeGreaterThan(0);
    expect(
      candidates.some(c => scene.startsWith(c)),
      `route '${route}' must open on an ARRIVAL_SCENES['${sceneKey}'] template, got: ${scene}`,
    ).toBe(true);
    expect(scene.startsWith('Testford comes into view.')).toBe(false);
  });

  test('unknown / legacy route values fall to the ordinary pool, not the bare line', () => {
    const scene = generateArrivalScene(settlementFor('caravanserai'));
    const candidates = renderPool(ARRIVAL_SCENES.ordinary, 'Testford', 'town');
    expect(candidates.some(c => scene.startsWith(c))).toBe(true);
  });

  test('stress vignettes still win over the route scene', () => {
    const s = { ...settlementFor('river'), stress: [{ type: 'famine' }] };
    const scene = generateArrivalScene(s);
    const riverOpenings = renderPool(ARRIVAL_SCENES.river, 'Testford', 'town');
    expect(riverOpenings.some(c => scene.startsWith(c))).toBe(false);
  });
});

describe('arrival addons fire keyed by route (tradeCommodity was never written)', () => {
  test.each(Object.keys(ARRIVAL_ADDONS))('route %s appends one of its addon templates', (route) => {
    const scene = generateArrivalScene(settlementFor(route));
    const addons = renderPool(ARRIVAL_ADDONS[route], 'Testford', 'town');
    expect(addons.length).toBeGreaterThan(0);
    expect(
      addons.some(a => scene.includes(a)),
      `route '${route}' must carry one of its ARRIVAL_ADDONS, got: ${scene}`,
    ).toBe(true);
  });

  test('a route with no addon pool (mountain_pass) stays addon-free without crashing', () => {
    expect(ARRIVAL_ADDONS.mountain_pass).toBeUndefined();
    expect(() => generateArrivalScene(settlementFor('mountain_pass'))).not.toThrow();
  });
});

describe('generateSiegeCapability joins the tensions array honestly', () => {
  const recentEvents = [{ name: 'Sack of the Granary', type: 'political', yearsAgo: 5 }];

  test('uses the primary tension prose, never [object Object]', () => {
    const out = generateSiegeCapability(recentEvents, [
      { type: 'resource_scarcity', description: 'The supply of grain is under pressure' },
      { type: 'external_threat', description: 'Raiders probe the outlying farms' },
    ], 100);
    expect(out).toBe(
      'The Sack of the Granary is still present in living memory — The supply of grain is under pressure.',
    );
    expect(out).not.toContain('[object Object]');
  });

  test('an EMPTY tensions array reaches the fallback clause (arrays are truthy)', () => {
    const out = generateSiegeCapability(recentEvents, [], 100);
    expect(out).toBe(
      'The Sack of the Granary is still present in living memory — its effects shape current decisions.',
    );
  });

  test('plain-string tensions (legacy) pass through the join', () => {
    const out = generateSiegeCapability(recentEvents, ['old debts to the crown'], 100);
    expect(out).toContain('— old debts to the crown.');
  });

  test('no recent events → array pass-through (caller nulls non-strings)', () => {
    const tensions = [{ type: 'resource_scarcity' }];
    expect(generateSiegeCapability([], tensions, 100)).toBe(tensions);
  });
});
