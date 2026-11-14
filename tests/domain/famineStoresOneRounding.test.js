/**
 * Rung 2D, unit 1 (the chair's ruling on rung 2C's STOP, `docs/SOAK_10000_RUNG2C_2026-11-04.md`
 * §2): ONE ROUNDING. The famine's held-granary flag (`foodBalance.js :: deriveFoodRecord`,
 * `foodRecord.storesHeld`) and the printed stores line (`tonightSheet.js :: foodStoresWords`)
 * read the SAME whole-month figure — the line's `Math.round` — so a famine place holding
 * 5.5–5.9 months prints "six months" AND is held, and the line never shows an open granary
 * beside a six-month figure.
 *
 * Red first on `soak1k-1582` (city, famine; record: granary, 5.6 months, storesHeld false): it
 * printed "Stores: a granary, six months of grain." and `coh:famine-stores` fired. `soak1k-1846`
 * (5.6) and `-2962` (5.8) are the rung's next two seeds; `soak1k-3605` (12.1, held before and
 * after) is the control.
 * RE-KEYED BY IDENTITY (COHERENCE-AGREE, the chair's food-sources ruling of 2026-11-11): worked land now
 * counts as a food source, and a preserved source adds its quarter month to the stores, so `-1846` reads
 * 6.8 and `-3605` 13; the same members are `soak1k-2452` (city, famine, granary, 5.6) and `soak1k-1589`
 * (12.1, held), found by scanning the soak corpus for the condition.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { birth, ensureLaws } from '../../scripts/audit/soak-review/corpus.mjs';
import { famineStoresFindings } from '../../src/domain/coherence/crisisFactFindings.js';
import { deriveFoodRecord, FAMINE_HELD_STORE_MONTHS } from '../../src/generators/economy/foodBalance.js';
import { foodStoresWords } from '../../src/domain/summary/tonightSheet.js';
import { HELD_STORES_WORDS } from '../../src/domain/defense/defenseFacts.js';
import { foodEnduranceLine } from '../../src/domain/display/defenseDisplay.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';

/** @type {Record<number, any>} */
const born = {};
beforeAll(async () => {
  await ensureLaws();
  for (const i of [1582, 2452, 2962, 1589]) born[i] = birth(i).settlement;
}, 240_000);

/** @param {number} storageMonths @param {boolean} stressFamine */
const recordAt = (storageMonths, stressFamine = true) => deriveFoodRecord({
  dailyNeed: 100, dailyProduction: 35, deficitPct: 65, surplusPct: 0, stressFamine, storageMonths, hasGranary: true,
});

  // RE-KEYED BY IDENTITY (R2-CODE-B-3 item 2a, the chair's ruling: the words contain the figure, "about" from a month up):
  // the same records, the same held/open reading and the same rounding; the span now says "about".
describe('rung 2D · the held granary and the stores line read one rounding', () => {
  // LANDING-R2 seat E: one parameterless test over the three seeds, every seed run and collected.
  it('soak1k-1582, -2452, -2962: a famine granary printed as six months is held, and the page says so', () => {
    const failures = collectSeedFailures([1582, 2452, 2962], (i) => {
      const s = born[i];
      const record = s.economicState.foodSecurity.foodRecord;
      expect(record, `soak1k-${i}`).toMatchObject({ band: 'famine', hasGranary: true });
      expect(record.storageMonths, `soak1k-${i}`).toBeGreaterThanOrEqual(5.5);
      expect(record.storageMonths, `soak1k-${i}`).toBeLessThan(FAMINE_HELD_STORE_MONTHS);
      expect(record.storesHeld, `soak1k-${i}`).toBe(true);
      const words = foodStoresWords(record);
      expect(words, `soak1k-${i}`).toBe(`Stores: a granary of about six months that ${HELD_STORES_WORDS}.`);
      expect(famineStoresFindings(s, words), `soak1k-${i}`).toHaveLength(0);
      expect(foodEnduranceLine(s)?.sentence, `soak1k-${i}`).toContain(HELD_STORES_WORDS);
    });
    expectNoSeedFailures(failures, 'every six-month famine granary reads as held');
  });

  it('soak1k-1589 (the control): twelve months, held before and after', () => {
    const record = born[1589].economicState.foodSecurity.foodRecord;
    expect(record).toMatchObject({ band: 'famine', hasGranary: true, storesHeld: true });
    expect(foodStoresWords(record)).toBe(`Stores: a granary of about twelve months that ${HELD_STORES_WORDS}.`);
  });

  it('the boundary is the printed figure: 5.49 prints five and is open, 5.5 prints six and is held', () => {
    expect(recordAt(5.49).storesHeld).toBe(false);
    expect(foodStoresWords(recordAt(5.49))).toBe('Stores: a granary, about five months of grain.');
    expect(recordAt(5.5).storesHeld).toBe(true);
    expect(foodStoresWords(recordAt(5.5))).toBe(`Stores: a granary of about six months that ${HELD_STORES_WORDS}.`);
    expect(recordAt(6).storesHeld).toBe(true);
    expect('storesHeld' in recordAt(12, false)).toBe(false);
  });
});
