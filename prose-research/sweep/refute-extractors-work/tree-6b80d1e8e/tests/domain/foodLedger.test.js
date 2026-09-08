/**
 * tests/domain/foodLedger.test.js — P3.0 foundation.
 *
 * The conserved food ledger is the single read-point for the food quantities
 * foodGenerator produces. Pin: it reads the real fields off economicState.foodSecurity,
 * defaults safely when absent, and flags presence.
 */

import { describe, it, expect } from 'vitest';
import { foodLedger } from '../../src/domain/foodLedger.js';
import { deriveSystemState } from '../../src/domain/state/deriveSystemState.js';
import { deriveCausalState } from '../../src/domain/causalState.js';
import { deriveCapacityProfile } from '../../src/domain/capacityModel.js';

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

// ── P3.1: food deficit now moves the substrate (was a dead deficitMonths read) ──
describe('P3.1 — food deficit moves resilience + causal food_security', () => {
  const town = (foodSecurity) => ({
    name: 'T', tier: 'town', population: 2000,
    config: { tradeRouteAccess: 'road', monsterThreat: 'safe' },
    economicState: { prosperity: 'Modest', foodSecurity },
    powerStructure: { factions: [] }, activeConditions: [],
  });
  const DEFICIT = { deficitPct: 50, surplusPct: 0, foodRatio: 0.5, storageMonths: 1 };
  const SURPLUS = { deficitPct: 0, surplusPct: 50, foodRatio: 1.5, storageMonths: 6 };

  it('a deep-deficit town has lower resilience than a surplus town', () => {
    expect(deriveSystemState(town(DEFICIT)).resilience.value)
      .toBeLessThan(deriveSystemState(town(SURPLUS)).resilience.value);
  });

  it('a deep-deficit town has lower causal food_security than a surplus town', () => {
    expect(deriveCausalState(town(DEFICIT)).scores.food_security)
      .toBeLessThan(deriveCausalState(town(SURPLUS)).scores.food_security);
  });

  // P3.2: the capacity model's food lens now agrees with the ledger direction —
  // no more "two food models disagreeing".
  it('a deep-deficit town has lower capacityModel food capacity than a surplus town', () => {
    const deficit = deriveCapacityProfile('food_production', town(DEFICIT));
    const surplus = deriveCapacityProfile('food_production', town(SURPLUS));
    expect(deficit.ratio).toBeLessThan(surplus.ratio);
  });

  it('food capacity worsens monotonically across the deficit bands (P3.2 boundaries)', () => {
    const ratio = (fs) => deriveCapacityProfile('food_production', town(fs)).ratio;
    const severe    = ratio({ deficitPct: 41 }); // -22 supply (>40 band)
    const importDep = ratio({ deficitPct: 16 }); // -12 (>15 band)
    const pressured = ratio({ deficitPct: 6 });  //  -5 (>5 band)
    const surplus   = ratio({ surplusPct: 40 }); //  +8 (>=40 band)
    expect(severe).toBeLessThan(importDep);
    expect(importDep).toBeLessThan(pressured);
    expect(pressured).toBeLessThan(surplus);
  });
});
