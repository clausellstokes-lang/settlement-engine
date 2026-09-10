import { describe, expect, test } from 'vitest';

import {
  warExhaustionStandings,
  settlementWarExhaustion,
  warExhaustionBand,
} from '../../src/domain/display/warStatus.js';

// ─────────────────────────────────────────────────────────────────────────────
// P0.1 — war-weariness read-side (the Z2a scar surfaced for the dossier/realm).
// Pure, rng-free, no worldState mutation; [] when the ledger is dormant/absent.
// ─────────────────────────────────────────────────────────────────────────────

describe('warExhaustionBand — mirrors the engine condition floor (0.20)', () => {
  test('0 / no scar reads rested', () => {
    expect(warExhaustionBand(0)).toBe('rested');
    expect(warExhaustionBand(undefined)).toBe('rested');
  });
  test('below the 0.20 floor is the recovering tail (near peace)', () => {
    expect(warExhaustionBand(0.05)).toBe('near peace');
    expect(warExhaustionBand(0.19)).toBe('near peace');
  });
  test('at/above the floor is war-weary, deep scars are exhausted', () => {
    expect(warExhaustionBand(0.20)).toBe('war-weary');
    expect(warExhaustionBand(0.5)).toBe('war-weary');
    expect(warExhaustionBand(0.6)).toBe('exhausted');
    expect(warExhaustionBand(1)).toBe('exhausted');
  });
  test('clamps out-of-range input', () => {
    expect(warExhaustionBand(5)).toBe('exhausted');
    expect(warExhaustionBand(-1)).toBe('rested');
  });
});

describe('warExhaustionStandings — dormant → []', () => {
  test('absent ledger returns []', () => {
    expect(warExhaustionStandings({})).toEqual([]);
    expect(warExhaustionStandings(undefined)).toEqual([]);
    expect(warExhaustionStandings({ warExhaustion: {} })).toEqual([]);
  });
  test('a zeroed scar is not war-weariness (omitted)', () => {
    expect(warExhaustionStandings({ warExhaustion: { a: 0 } })).toEqual([]);
  });
  test('does not throw on garbage input', () => {
    expect(() => warExhaustionStandings(null)).not.toThrow();
    expect(() => warExhaustionStandings({ warExhaustion: 7 })).not.toThrow();
  });
});

describe('warExhaustionStandings — populated → sorted bands', () => {
  test('codepoint-sorts by id and bands each scar', () => {
    const worldState = { warExhaustion: { zeta: 0.7, alpha: 0.3, mu: 0.1 } };
    const out = warExhaustionStandings(worldState);
    expect(out.map(e => e.id)).toEqual(['alpha', 'mu', 'zeta']);
    expect(out).toEqual([
      { id: 'alpha', warExhaustion: 0.3, band: 'war-weary' },
      { id: 'mu', warExhaustion: 0.1, band: 'near peace' },
      { id: 'zeta', warExhaustion: 0.7, band: 'exhausted' },
    ]);
  });

  test('does not mutate the worldState ledger', () => {
    const ledger = { a: 0.5, b: 0 };
    const worldState = { warExhaustion: ledger };
    warExhaustionStandings(worldState);
    expect(ledger).toEqual({ a: 0.5, b: 0 });
    expect(Object.keys(worldState)).toEqual(['warExhaustion']);
  });

  test('a snapshot filters out ids the world no longer knows', () => {
    const worldState = { warExhaustion: { a: 0.5, ghost: 0.5 } };
    const snapshot = { byId: new Map([['a', {}]]) };
    expect(warExhaustionStandings(worldState, snapshot).map(e => e.id)).toEqual(['a']);
    // settlements[] shape works too
    const snap2 = { settlements: [{ id: 'a' }] };
    expect(warExhaustionStandings(worldState, snap2).map(e => e.id)).toEqual(['a']);
  });

  test('no snapshot ⇒ no filtering', () => {
    const worldState = { warExhaustion: { a: 0.5, b: 0.5 } };
    expect(warExhaustionStandings(worldState).map(e => e.id)).toEqual(['a', 'b']);
  });
});

describe('settlementWarExhaustion — per-settlement reader', () => {
  test('0 when absent / dormant', () => {
    expect(settlementWarExhaustion({ settlementId: 'a', worldState: {} })).toBe(0);
    expect(settlementWarExhaustion({ settlementId: 'a', worldState: { warExhaustion: {} } })).toBe(0);
    expect(settlementWarExhaustion({})).toBe(0);
  });
  test('reads + clamps the live scar', () => {
    const worldState = { warExhaustion: { a: 0.42, b: 5 } };
    expect(settlementWarExhaustion({ settlementId: 'a', worldState })).toBe(0.42);
    expect(settlementWarExhaustion({ settlementId: 'b', worldState })).toBe(1);
  });
});
