/**
 * domain/state tests — derivation + comparison invariants.
 *
 * The point isn't to lock the exact derivation values forever. The point
 * is to assert the *direction* of causality: a famine settlement scores
 * worse on resilience than a prosperous one, more conflicts → higher
 * volatility, more depleted resources → higher resource pressure. That
 * way we can refine the derivation formulas later without breaking
 * tests, but if the *direction* ever flips, CI fires immediately.
 */

import { describe, test, expect } from 'vitest';
import { deriveSystemState } from '../../src/domain/state/deriveSystemState.js';
import { compareSystemState } from '../../src/domain/state/compareSystemState.js';
import { bandFor, severityFor, clamp01 } from '../../src/domain/state/bands.js';

describe('bands', () => {
  test('thresholds are stable', () => {
    expect(bandFor(0)).toBe('Critical');
    expect(bandFor(24)).toBe('Critical');
    expect(bandFor(25)).toBe('Vulnerable');
    expect(bandFor(49)).toBe('Vulnerable');
    expect(bandFor(50)).toBe('Strained');
    expect(bandFor(74)).toBe('Strained');
    expect(bandFor(75)).toBe('Stable');
    expect(bandFor(100)).toBe('Stable');
  });

  test('clamp01 keeps values in range and handles non-numbers', () => {
    expect(clamp01(150)).toBe(100);
    expect(clamp01(-50)).toBe(0);
    expect(clamp01(NaN)).toBe(50);
    expect(clamp01(undefined)).toBe(50);
    expect(clamp01(42)).toBe(42);
  });

  test('severity classifier picks reasonable cutoffs', () => {
    expect(severityFor(20)).toBe('major');
    expect(severityFor(-15)).toBe('major');
    expect(severityFor(8)).toBe('moderate');
    expect(severityFor(-7)).toBe('moderate');
    expect(severityFor(3)).toBe('minor');
    expect(severityFor(-1)).toBe('minor');
  });
});

describe('deriveSystemState', () => {
  test('empty settlement returns shape without throwing', () => {
    const s = deriveSystemState({});
    expect(s).toHaveProperty('resilience');
    expect(s).toHaveProperty('volatility');
    expect(s).toHaveProperty('externalThreat');
    expect(s).toHaveProperty('resourcePressure');
    for (const dim of Object.values(s)) {
      expect(typeof dim.value).toBe('number');
      expect(['Stable', 'Strained', 'Vulnerable', 'Critical']).toContain(dim.band);
      expect(Array.isArray(dim.drivers)).toBe(true);
      expect(Array.isArray(dim.risks)).toBe(true);
    }
  });

  test('null settlement is safe', () => {
    const s = deriveSystemState(null);
    expect(s.resilience.value).toBeGreaterThanOrEqual(0);
  });

  test('prosperous settlement has higher resilience than struggling one', () => {
    const wealthy = deriveSystemState({
      economicState: { prosperity: 'Wealthy', exports: ['a', 'b', 'c', 'd', 'e'] },
    });
    const struggling = deriveSystemState({
      economicState: { prosperity: 'Struggling', exports: [] },
    });
    expect(wealthy.resilience.value).toBeGreaterThan(struggling.resilience.value);
  });

  test('food deficit lowers resilience', () => {
    const fed = deriveSystemState({
      economicState: { foodSecurity: { surplusPct: 50 } },
    });
    const starving = deriveSystemState({
      economicState: { foodSecurity: { deficitPct: 30 } },
    });
    expect(fed.resilience.value).toBeGreaterThan(starving.resilience.value);
  });

  test('many factions + active conflicts raise volatility', () => {
    const calm = deriveSystemState({
      powerStructure: { factions: [{}, {}], conflicts: [] },
    });
    const stormy = deriveSystemState({
      powerStructure: {
        factions: [{}, {}, {}, {}, {}, {}],
        conflicts: [{ a: 'x' }, { a: 'y' }, { a: 'z' }],
      },
    });
    expect(stormy.volatility.value).toBeGreaterThan(calm.volatility.value);
  });

  // P3.3b Stage 2a: the legitimacy branch read publicLegitimacy as a bare number,
  // but the generator emits { score, label, ... } — so low legitimacy never raised
  // volatility. Now reads .score; a doubted ruling order destabilises again.
  test('low public legitimacy raises volatility; strong legitimacy lowers it', () => {
    const shaky = deriveSystemState({ powerStructure: { publicLegitimacy: { score: 20 } } });
    const solid = deriveSystemState({ powerStructure: { publicLegitimacy: { score: 85 } } });
    expect(shaky.volatility.value).toBeGreaterThan(solid.volatility.value);
    expect(shaky.volatility.risks.some(r => /legitimacy/i.test(r))).toBe(true);
  });

  test('legacy bare-number legitimacy still works (backward compatible)', () => {
    const shaky = deriveSystemState({ powerStructure: { publicLegitimacy: 20 } });
    const solid = deriveSystemState({ powerStructure: { publicLegitimacy: 85 } });
    expect(shaky.volatility.value).toBeGreaterThan(solid.volatility.value);
  });

  test('plagued region raises external threat over safe region', () => {
    const safe = deriveSystemState({ config: { monsterThreat: 'civilized' } });
    const plagued = deriveSystemState({ config: { monsterThreat: 'plagued' } });
    expect(plagued.externalThreat.value).toBeGreaterThan(safe.externalThreat.value);
  });

  test('hostile neighbours raise external threat', () => {
    const isolated = deriveSystemState({ neighbourNetwork: [] });
    const surrounded = deriveSystemState({
      neighbourNetwork: [
        { relationshipType: 'hostile' },
        { relationshipType: 'hostile' },
        { relationshipType: 'cold_war' },
      ],
    });
    expect(surrounded.externalThreat.value).toBeGreaterThan(isolated.externalThreat.value);
  });

  test('depleted resources raise resource pressure', () => {
    const flush = deriveSystemState({
      config: { nearbyResourcesState: { iron: 'allow', timber: 'allow' } },
    });
    const tapped = deriveSystemState({
      config: { nearbyResourcesState: { iron: 'depleted', timber: 'depleted', salt: 'depleted' } },
    });
    expect(tapped.resourcePressure.value).toBeGreaterThan(flush.resourcePressure.value);
  });
});

describe('compareSystemState', () => {
  function s(values) {
    const out = {};
    for (const [k, v] of Object.entries(values)) {
      out[k] = { value: v, band: bandFor(v), drivers: [], risks: [] };
    }
    return out;
  }

  test('no change → empty deltas', () => {
    const before = s({ resilience: 60, volatility: 40, externalThreat: 30, resourcePressure: 50 });
    expect(compareSystemState(before, before)).toEqual([]);
  });

  test('returns one delta per changed dimension', () => {
    const before = s({ resilience: 60, volatility: 40, externalThreat: 30, resourcePressure: 50 });
    const after  = s({ resilience: 45, volatility: 55, externalThreat: 30, resourcePressure: 50 });
    const deltas = compareSystemState(before, after);
    expect(deltas).toHaveLength(2);
    expect(deltas.map(d => d.key).sort()).toEqual(['resilience', 'volatility']);
  });

  test('sorts by absolute change descending', () => {
    const before = s({ resilience: 60, volatility: 40, externalThreat: 30, resourcePressure: 50 });
    const after  = s({ resilience: 58, volatility: 60, externalThreat: 30, resourcePressure: 50 });
    const deltas = compareSystemState(before, after);
    expect(deltas[0].key).toBe('volatility'); // change of 20
    expect(deltas[1].key).toBe('resilience'); // change of -2
  });

  test('explanation calls out band crossings', () => {
    const before = s({ resilience: 80, volatility: 40, externalThreat: 30, resourcePressure: 50 });
    const after  = s({ resilience: 60, volatility: 40, externalThreat: 30, resourcePressure: 50 });
    const [delta] = compareSystemState(before, after);
    expect(delta.explanation).toContain('Stable');
    expect(delta.explanation).toContain('Strained');
  });
});
