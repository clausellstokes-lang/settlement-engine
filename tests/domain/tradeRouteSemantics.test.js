/**
 * tests/domain/tradeRouteSemantics.test.js — P1.1 invariant.
 *
 * The bug: generation emits road/river/crossroads/port/isolated, but the causal
 * substrate + capacity model branched on the legacy major/minor/standard/none
 * vocabulary, so river/crossroads/port scored NEUTRAL. This pins the canonical
 * module + the end-to-end effect: every emittable route value must produce a
 * distinct, non-neutral signal in BOTH causalState trade_connectivity AND the
 * capacity model — and connected routes must beat isolated ones.
 */

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import {
  tradeRouteSemantics,
  tradeRouteTier,
  hasTradeRouteConnection,
  isIsolatedRoute,
  isTradeRouteDisconnected,
  GENERATED_ROUTE_VALUES,
  SELECTABLE_ROUTE_VALUES,
  SEASONAL_ROUTE_FOOD_IMPORT_RATE,
} from '../../src/domain/tradeRouteSemantics.js';
import { FOOD_IMPORT_RATES } from '../../src/data/foodImportRates.js';
import { deriveCausalState } from '../../src/domain/causalState.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

/** The trade-route <option> values the user can actually pick, read from the
 *  panel's own source. Anchored on the `config.tradeRouteAccess` binding so the
 *  scan cannot silently pick up a different <Sel>. */
function panelRouteOptions() {
  const src = readFileSync(join(ROOT, 'src/components/ConfigurationPanel.jsx'), 'utf8');
  const block = src.match(/value=\{config\.tradeRouteAccess\}[\s\S]*?<\/Sel>/);
  expect(block, 'the tradeRouteAccess <Sel> block is no longer findable in ConfigurationPanel.jsx').toBeTruthy();
  return [...block[0].matchAll(/<option value="([^"]+)"/g)].map((m) => m[1]);
}

describe('tradeRouteSemantics — canonical mapping', () => {
  it('maps every selectable route value to a known (non-unknown) tier', () => {
    // The superset: GENERATED_ROUTE_VALUES is what the pools roll, and the panel
    // can offer more than the pools roll. Walking the narrower list is exactly how
    // mountain_pass scored neutral for its whole life.
    expect(SELECTABLE_ROUTE_VALUES).toEqual(expect.arrayContaining([...GENERATED_ROUTE_VALUES]));
    for (const v of SELECTABLE_ROUTE_VALUES) {
      expect(tradeRouteTier(v), v).not.toBe('unknown');
    }
  });

  it('the drift list IS the ConfigurationPanel vocabulary (both directions)', () => {
    const options = panelRouteOptions();
    // Liveness anchors: the scan found a populated list containing a route we know
    // ships, so an emptied/renamed panel cannot pass this as a vacuous agreement.
    expect(options.length).toBeGreaterThanOrEqual(6);
    expect(options).toContain('road');
    // 'random_trade' is a roll SENTINEL, not a route: resolveConfig consumes it and
    // always substitutes a pool pick, so it never reaches the semantics module.
    const resolveSrc = readFileSync(join(ROOT, 'src/generators/steps/resolveConfig.js'), 'utf8');
    expect(resolveSrc).toContain("config.tradeRouteAccess === 'random_trade'");
    const routes = options.filter((v) => !v.startsWith('random_'));
    expect([...routes].sort()).toEqual([...SELECTABLE_ROUTE_VALUES].sort());
    for (const v of routes) expect(tradeRouteTier(v), `panel option ${v}`).not.toBe('unknown');
  });

  it('tiers route values correctly', () => {
    expect(tradeRouteTier('crossroads')).toBe('major');
    expect(tradeRouteTier('port')).toBe('major');
    expect(tradeRouteTier('river')).toBe('standard');
    expect(tradeRouteTier('road')).toBe('standard');
    expect(tradeRouteTier('mountain_pass')).toBe('seasonal');
    expect(tradeRouteTier('isolated')).toBe('isolated');
    // Legacy vocab still resolves.
    expect(tradeRouteTier('major')).toBe('major');
    expect(tradeRouteTier('standard')).toBe('standard');
    expect(tradeRouteTier('none')).toBe('isolated');
    // Unknown / missing → neutral.
    expect(tradeRouteTier('teleport_circle')).toBe('unknown');
    expect(tradeRouteTier(undefined)).toBe('unknown');
  });

  it('connected routes contribute positive connectivity/transport; isolated is negative', () => {
    for (const v of ['road', 'river', 'crossroads', 'port']) {
      const sem = tradeRouteSemantics(v);
      expect(sem.connectivity, `${v} connectivity`).toBeGreaterThan(0);
      expect(sem.transport, `${v} transport`).toBeGreaterThan(0);
      expect(sem.isolated).toBe(false);
    }
    const iso = tradeRouteSemantics('isolated');
    expect(iso.connectivity).toBeLessThan(0);
    expect(iso.transport).toBeLessThan(0);
    expect(iso.isolated).toBe(true);
    expect(isIsolatedRoute('isolated')).toBe(true);
    expect(isIsolatedRoute('road')).toBe(false);
  });

  it('scores a mountain pass between standard and isolated, and connected', () => {
    const pass = tradeRouteSemantics('mountain_pass');
    const road = tradeRouteSemantics('road');
    const river = tradeRouteSemantics('river');
    const iso = tradeRouteSemantics('isolated');

    // The ruling's contract: a real connection, modest, never a road's equal.
    expect(hasTradeRouteConnection('mountain_pass')).toBe(true);
    expect(isTradeRouteDisconnected('mountain_pass')).toBe(false);
    expect(pass.isolated).toBe(false);

    expect(pass.connectivity).toBeGreaterThan(0);
    expect(pass.transport).toBeGreaterThan(0);
    expect(pass.connectivity).toBeLessThan(road.connectivity);
    expect(pass.connectivity).toBeLessThan(river.connectivity);
    expect(pass.transport).toBeLessThan(road.transport);
    expect(pass.transport).toBeLessThan(river.transport);
    expect(pass.connectivity).toBeGreaterThan(iso.connectivity);
    expect(pass.transport).toBeGreaterThan(iso.transport);
  });

  it('rungs the seasonal food-import rate below road and above the isolated trickle', () => {
    // 0.35 is the road rung both food ladders carry (foodBalance, foodGenerator);
    // minorRoutes is what an isolated town still receives. The pass sits between,
    // which is the whole reason it needed its own tier rather than a fall-through.
    expect(SEASONAL_ROUTE_FOOD_IMPORT_RATE).toBeLessThan(0.35);
    expect(SEASONAL_ROUTE_FOOD_IMPORT_RATE).toBeGreaterThan(FOOD_IMPORT_RATES.minorRoutes);
    expect(SEASONAL_ROUTE_FOOD_IMPORT_RATE).toBeGreaterThan(FOOD_IMPORT_RATES.minorRoutesVillage);
  });

  it('exposes one fail-closed connection predicate for import consumers', () => {
    for (const route of ['road', 'river', 'crossroads', 'port', 'major', 'minor', 'standard']) {
      expect(hasTradeRouteConnection(route), route).toBe(true);
      expect(isTradeRouteDisconnected(route), route).toBe(false);
    }
    for (const route of ['isolated', 'none']) {
      expect(hasTradeRouteConnection(route), route).toBe(false);
      expect(isTradeRouteDisconnected(route), route).toBe(true);
    }

    // An unrecognized route must not silently create physical import capacity.
    expect(hasTradeRouteConnection('teleport_circle')).toBe(false);
    expect(hasTradeRouteConnection(undefined)).toBe(false);
    expect(isTradeRouteDisconnected('teleport_circle')).toBe(false);
  });

  it('major-tier routes outrank standard-tier on connectivity', () => {
    expect(tradeRouteSemantics('crossroads').connectivity)
      .toBeGreaterThan(tradeRouteSemantics('road').connectivity);
    expect(tradeRouteSemantics('port').connectivity)
      .toBeGreaterThan(tradeRouteSemantics('river').connectivity);
  });
});

describe('causalState reflects the canonical trade vocabulary (P1.1 end-to-end)', () => {
  const base = (route) => ({
    name: 'T', tier: 'town', population: 1500,
    config: { tradeRouteAccess: route, monsterThreat: 'safe' },
    economicState: { prosperity: 'Modest' },
    powerStructure: { factions: [] },
    activeConditions: [],
  });

  it('river/crossroads/port are no longer scored as isolated/neutral', () => {
    const iso = deriveCausalState(base('isolated')).scores.trade_connectivity;
    for (const v of ['road', 'river', 'crossroads', 'port']) {
      const score = deriveCausalState(base(v)).scores.trade_connectivity;
      expect(score, `${v} > isolated`).toBeGreaterThan(iso);
    }
  });

  it('a mountain pass lands strictly between isolated and road end to end', () => {
    const iso = deriveCausalState(base('isolated')).scores.trade_connectivity;
    const pass = deriveCausalState(base('mountain_pass')).scores.trade_connectivity;
    const road = deriveCausalState(base('road')).scores.trade_connectivity;
    expect(pass).toBeGreaterThan(iso);
    expect(pass).toBeLessThan(road);
  });

  it('crossroads scores higher trade_connectivity than a plain road', () => {
    const road = deriveCausalState(base('road')).scores.trade_connectivity;
    const crossroads = deriveCausalState(base('crossroads')).scores.trade_connectivity;
    expect(crossroads).toBeGreaterThan(road);
  });
});
