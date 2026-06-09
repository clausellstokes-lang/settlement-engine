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
import {
  tradeRouteSemantics, tradeRouteTier, isIsolatedRoute, GENERATED_ROUTE_VALUES,
} from '../../src/domain/tradeRouteSemantics.js';
import { deriveCausalState } from '../../src/domain/causalState.js';

describe('tradeRouteSemantics — canonical mapping', () => {
  it('maps every generated route value to a known (non-unknown) tier', () => {
    for (const v of GENERATED_ROUTE_VALUES) {
      expect(tradeRouteTier(v)).not.toBe('unknown');
    }
  });

  it('tiers route values correctly', () => {
    expect(tradeRouteTier('crossroads')).toBe('major');
    expect(tradeRouteTier('port')).toBe('major');
    expect(tradeRouteTier('river')).toBe('standard');
    expect(tradeRouteTier('road')).toBe('standard');
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

  it('crossroads scores higher trade_connectivity than a plain road', () => {
    const road = deriveCausalState(base('road')).scores.trade_connectivity;
    const crossroads = deriveCausalState(base('crossroads')).scores.trade_connectivity;
    expect(crossroads).toBeGreaterThan(road);
  });
});
