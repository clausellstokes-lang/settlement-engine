/**
 * tests/domain/facts/storesMonths.test.js — CENSUS-1 wave 0, fact 2: THE STORES-MONTHS HOME.
 *
 * RED-FIRST on a pulsed save where the two homes drifted: generosity's food delta (one of the
 * five post-birth writers) moved `foodSecurity.storageMonths` and left
 * `foodRecord.storageMonths` at its birth figure, so the Defense facts and the food ledger read
 * the live months while the endurance line and the food-words check read the birth ones. The
 * arms below were red at the base through the public readers alone.
 *
 * @enforced-by npx vitest run tests/domain/facts/storesMonths.test.js
 */
import { describe, expect, it } from 'vitest';
import { applyFoodDeltasToUpdates } from '../../../src/domain/worldPulse/generosityUpdates.js';
import { defenseFactsOf, foodEnduranceOf } from '../../../src/domain/defense/defenseFacts.js';
import { foodLedger } from '../../../src/domain/foodLedger.js';

const born = () => ({
  tier: 'town',
  institutions: [{ name: 'Town granary', category: 'Economy' }],
  economicState: { foodSecurity: { storageMonths: 4, foodRecord: { storageMonths: 4, grownPct: 60, hasGranary: true, band: 'secure' } } },
});

describe('the stores-months home (CENSUS-1 fact 2)', () => {
  it('RED-FIRST: after a pulse food delta every reader reads the same months', () => {
    const updates = [{ id: 's1', settlement: born() }];
    const [after] = applyFoodDeltasToUpdates(updates, new Map([['s1', 0]]), new Map([['s1', -1.5]]));
    const s = after.settlement;
    expect(defenseFactsOf(s).storedFoodMonths).toBe(2.5);
    expect(foodLedger(s).storageMonths).toBe(2.5);
    expect(foodEnduranceOf(s)?.storedMonths).toBe(2.5);
    expect(s.economicState.foodSecurity.foodRecord.storageMonths).toBe(2.5);
  });

  it('the one reader prefers the live mirror on a save written before the one writer', async () => {
    const { storesMonthsOf } = await import('../../../src/domain/facts/storesMonths.js');
    const drifted = { economicState: { foodSecurity: { storageMonths: 1.2, foodRecord: { storageMonths: 6 } } } };
    expect(storesMonthsOf(drifted)).toBe(1.2);
    expect(storesMonthsOf({ economicState: { foodSecurity: { foodRecord: { storageMonths: 3 } } } })).toBe(3);
    expect(storesMonthsOf({ foodSecurity: { storageMonths: 2 } })).toBe(2);
    expect(storesMonthsOf({})).toBe(null);
  });

  it('the one writer sets both homes and adds no food record where none stood', async () => {
    const { withStoresMonths } = await import('../../../src/domain/facts/storesMonths.js');
    const fs = { storageMonths: 4, dailyNeed: 10, foodRecord: { storageMonths: 4, band: 'secure' } };
    const next = withStoresMonths(fs, 3);
    expect(next).toEqual({ storageMonths: 3, dailyNeed: 10, foodRecord: { storageMonths: 3, band: 'secure' } });
    expect(Object.keys(next)).toEqual(Object.keys(fs));
    expect(fs.foodRecord.storageMonths).toBe(4);
    expect(withStoresMonths({ storageMonths: 1 }, 2)).toEqual({ storageMonths: 2 });
  });
});
