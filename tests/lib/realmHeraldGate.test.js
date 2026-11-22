/**
 * tests/lib/realmHeraldGate.test.js — the Herald's "has this realm advanced" read
 * (owner order 2026-09-17: "The herald should only appear after the first advanced
 * time on the map").
 *
 * The predicate is derived from the persisted world clock, so it is pinned against
 * the real world-state constructors rather than hand-made shapes alone: a fresh
 * world, a hydrated keyless world, a hydrated advanced world, and a legacy
 * months-only save (which normalizes to tick 0 with weeks already elapsed).
 */

import { describe, test, expect } from 'vitest';
import { realmHasAdvanced } from '../../src/lib/realmHeraldGate.js';
import { createDefaultWorldState, ensureWorldState } from '../../src/domain/worldPulse/worldState.js';

describe('realmHasAdvanced', () => {
  test('no campaign, no world, or a world that is not an object has never advanced', () => {
    expect(realmHasAdvanced(null)).toBe(false);
    expect(realmHasAdvanced(undefined)).toBe(false);
    expect(realmHasAdvanced({ id: 'c1' })).toBe(false);
    expect(realmHasAdvanced({ id: 'c1', worldState: null })).toBe(false);
    expect(realmHasAdvanced({ id: 'c1', worldState: 'tick 4' })).toBe(false);
    expect(realmHasAdvanced({ id: 'c1', worldState: {} })).toBe(false);
  });

  test('a fresh world and a hydrated keyless world are at tick 0 and have never advanced', () => {
    expect(realmHasAdvanced({ id: 'c1', worldState: createDefaultWorldState({ id: 'c1' }) })).toBe(false);
    expect(realmHasAdvanced({ id: 'c1', worldState: ensureWorldState({}, { id: 'c1' }) })).toBe(false);
  });

  test('a world whose clock has moved has advanced, raw or hydrated', () => {
    expect(realmHasAdvanced({ id: 'c1', worldState: { tick: 1 } })).toBe(true);
    expect(realmHasAdvanced({ id: 'c1', worldState: ensureWorldState({ tick: 2 }, { id: 'c1' }) })).toBe(true);
  });

  test('a legacy months-only save counts its elapsed calendar, raw and hydrated', () => {
    const raw = { calendar: { elapsedMonths: 2 } };
    expect(realmHasAdvanced({ id: 'c1', worldState: raw })).toBe(true);
    const hydrated = ensureWorldState(raw, { id: 'c1' });
    expect(Number(hydrated.tick) || 0).toBe(0);
    expect(realmHasAdvanced({ id: 'c1', worldState: hydrated })).toBe(true);
    expect(realmHasAdvanced({ id: 'c1', worldState: { tick: 0, calendar: { elapsedWeeks: 3 } } })).toBe(true);
  });

  test('non-numeric, negative and zero clock readings never count as an advance', () => {
    expect(realmHasAdvanced({ id: 'c1', worldState: { tick: Number.NaN } })).toBe(false);
    expect(realmHasAdvanced({ id: 'c1', worldState: { tick: -3 } })).toBe(false);
    expect(realmHasAdvanced({ id: 'c1', worldState: { tick: 'soon', calendar: { elapsedWeeks: 0, elapsedMonths: 0 } } })).toBe(false);
    expect(realmHasAdvanced({ id: 'c1', worldState: { tick: 0, calendar: 'spring' } })).toBe(false);
  });
});
