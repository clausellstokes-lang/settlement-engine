/**
 * tests/domain/foodLedger.test.js — P3.0 foundation.
 *
 * The conserved food ledger is the single read-point for the food quantities
 * foodGenerator produces. Pin: it reads the real fields off economicState.foodSecurity,
 * defaults safely when absent, and flags presence.
 */

import { describe, it, expect } from 'vitest';
import { foodLedger } from '../../src/domain/foodLedger.js';

describe('foodLedger', () => {
  it('reads the canonical quantities off economicState.foodSecurity', () => {
    const s = {
      economicState: {
        foodSecurity: {
          dailyNeed: 4000, dailyProduction: 3200, foodRatio: 0.8,
          deficitPct: 22, surplusPct: 0, storageMonths: 3,
          importDependency: 0.35, magicSupplement: 0, resilienceScore: 41,
        },
      },
    };
    const led = foodLedger(s);
    expect(led.present).toBe(true);
    expect(led.dailyNeed).toBe(4000);
    expect(led.foodRatio).toBeCloseTo(0.8, 5);
    expect(led.deficitPct).toBe(22);
    expect(led.storageMonths).toBe(3);
    expect(led.importDependency).toBeCloseTo(0.35, 5);
  });

  it('falls back to a top-level foodSecurity', () => {
    expect(foodLedger({ foodSecurity: { deficitPct: 50 } }).deficitPct).toBe(50);
  });

  it('returns neutral defaults (present:false) for an un-generated settlement', () => {
    const led = foodLedger({});
    expect(led.present).toBe(false);
    expect(led.foodRatio).toBe(1);
    expect(led.deficitPct).toBe(0);
    expect(led.resilienceScore).toBe(50);
    expect(foodLedger(null).present).toBe(false);
  });

  it('coerces non-numeric fields to safe defaults', () => {
    const led = foodLedger({ economicState: { foodSecurity: { deficitPct: 'lots', foodRatio: null } } });
    expect(led.deficitPct).toBe(0);
    expect(led.foodRatio).toBe(1);
    expect(led.present).toBe(true);
  });
});
