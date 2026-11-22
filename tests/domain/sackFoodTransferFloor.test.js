/**
 * sackFoodTransferFloor.test.js — the sack/levy granary transfer never OVER-drains
 * the source.
 *
 * Regression pin for the medium-severity finding: `lostMonths` (the actual debit
 * applied to the conquered/levied granary) was `round1(takeFraction * cMonths)`, which
 * can round the taken share UP past `takeFraction` of the true stores — over-debiting
 * the source by up to ~0.05 months every tick, and the F2 levy reuses this each tick.
 * The gain was already floored; the fix floors the debit too, so the transfer is a pure
 * SINK under both rounding directions (source never over-drained, victor never over-fed).
 */
import { describe, expect, test } from 'vitest';

import { computeSackFoodTransfer } from '../../src/domain/worldPulse/foodStockpile.js';

describe('computeSackFoodTransfer — floored debit', () => {
  test('lostMonths is floored to 1 decimal and never exceeds the intended fraction', () => {
    // 0.5 * 8.3 = 4.15 → floor to 4.1 (the old round1 rounded UP to 4.2, over-draining).
    const t = computeSackFoodTransfer({
      conqueredStorageMonths: 8.3,
      conqueredPopulation: 1000,
      victorStorageMonths: 0,
      victorPopulation: 1000,
      victorCapMonths: 12,
      takeFraction: 0.5,
      captureFraction: 0.6,
    });
    expect(t).toBeTruthy();
    expect(t.lostMonths).toBe(4.1);
    expect(t.lostMonths).toBeLessThanOrEqual(0.5 * 8.3);
  });

  test('never mints absolute food (gained × victorPop ≤ lost × conqueredPop) and never over-drains', () => {
    const cases = [
      { conqueredStorageMonths: 8.3, conqueredPopulation: 1000, victorPopulation: 1000 },
      { conqueredStorageMonths: 5.7, conqueredPopulation: 800, victorPopulation: 1200 },
      { conqueredStorageMonths: 11.9, conqueredPopulation: 2500, victorPopulation: 600 },
      { conqueredStorageMonths: 3.1, conqueredPopulation: 450, victorPopulation: 450 },
    ];
    for (const c of cases) {
      const t = computeSackFoodTransfer({
        ...c,
        victorStorageMonths: 0,
        victorCapMonths: 24,
        takeFraction: 0.5,
        captureFraction: 0.6,
      });
      if (!t) continue;
      // Debit never exceeds the intended fraction of the true granary.
      expect(t.lostMonths).toBeLessThanOrEqual(0.5 * c.conqueredStorageMonths + 1e-9);
      // Absolute food is a sink, never minted.
      expect(t.gainedMonths * c.victorPopulation).toBeLessThanOrEqual(t.lostMonths * c.conqueredPopulation + 1e-9);
    }
  });
});
