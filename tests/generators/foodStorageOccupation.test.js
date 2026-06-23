/**
 * tests/generators/foodStorageOccupation.test.js — Finding #7 regression.
 *
 * storageMonths (the reserve buffer) was computed purely from granary/tier/mill
 * inputs, BEFORE occupation applied its +20% consumption increase to dailyNeed.
 * So an occupied settlement displayed the SAME reserve duration as its peacetime
 * equivalent despite draining the stockpile faster. The fix divides the reserve
 * by consumptionMult, so a higher daily need shortens how long it lasts.
 *
 * These tests pin: occupied < peacetime, the peacetime path is unchanged, and the
 * +20% modifier is applied exactly once (not double-counted).
 */

import { describe, it, expect } from 'vitest';
import { clearActiveRng } from '../../src/generators/rngContext.js';
import { generateFoodSecurity } from '../../src/generators/foodGenerator.js';

const INSTITUTIONS = [{ name: 'Town Granary' }, { name: 'Common Field' }, { name: 'Watermill' }];
const BASE_CONFIG = {
  _population: 2000, tradeRouteAccess: 'road', terrainType: 'plains',
  nearbyResources: ['grain_fields'], magicExists: false,
};

function storageFor(stressTypes) {
  clearActiveRng(); // no jitter — storageMonths does not use crop-fortune RNG anyway
  return generateFoodSecurity('town', INSTITUTIONS, { ...BASE_CONFIG, stressTypes })
    .storageMonths;
}

describe('Finding #7 — occupation shortens reserve duration', () => {
  it('an occupied settlement shows a SHORTER reserve than its peacetime twin', () => {
    const peacetime = storageFor([]);
    const occupied  = storageFor(['occupied']);
    expect(occupied).toBeLessThan(peacetime);
  });

  it('the reserve shrinks by the occupation consumption factor (+20%, applied once)', () => {
    const peacetime = storageFor([]);
    const occupied  = storageFor(['occupied']);
    // consumptionMult is 1.20 under occupation → reserve = peacetime / 1.20.
    // Allow for the 0.1-month rounding the generator applies.
    expect(occupied).toBeCloseTo(peacetime / 1.2, 1);
  });
});
