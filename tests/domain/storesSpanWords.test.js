/**
 * R2-CODE-B item 3 — THE SPAN OF THE STORES IN WORDS, ONE HOME, TRUE AT DAYS, WEEKS AND MONTHS (the
 * cold list REVIEW-W2A-3, f385d487b: MEDIUM #149 "No granary; a few weeks in the larder.", #856 #872
 * "Stores: a granary, a few weeks of grain." where the record holds `storageMonths` 0.1, about three
 * days; Plot Hooks of the same town: "The town has 3 days of reserves.").
 *
 * Home: tonightSheet.js :: storesSpanWords, read by foodStoresWords (the Tonight sheet and the
 * Economics tab's stores row), read back by crisisFactFindings.js :: famineStoresFindings.
 */
import { describe, expect, test } from 'vitest';
import { foodStoresWords, storesSpanWords } from '../../src/domain/summary/tonightSheet.js';
import { famineStoresFindings } from '../../src/domain/coherence/crisisFactFindings.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';

const DAYS_PER_MONTH = 365.25 / 12;
const WORD = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'];
/** The days a span in words claims, as a [low, high] band. @param {string} span */
function claimedDays(span) {
  if (span === 'less than a day') return [0, 1];
  const m = span.match(/^(?:about )?(a|\w+) (day|week|month)s?$/);
  if (!m) return [NaN, NaN];
  const n = m[1] === 'a' ? 1 : WORD.indexOf(m[1]) >= 0 ? WORD.indexOf(m[1]) : Number(m[1]);
  const unit = m[2] === 'day' ? 1 : m[2] === 'week' ? 7 : DAYS_PER_MONTH;
  return [(n - 0.5) * unit, (n + 0.5) * unit];
}

describe('the stores span says the record\'s time in store', () => {
  test('the table of stores lines', () => {
    const TABLE = [
    [{ storageMonths: 0.1, hasGranary: false }, 'No granary; about three days in the larder.'],
    [{ storageMonths: 0.1, hasGranary: true, storesHeld: false }, 'Stores: a granary, about three days of grain.'],
    [{ storageMonths: 0.5, hasGranary: true }, 'Stores: a granary, about two weeks of grain.'],
    [{ storageMonths: 1.2, hasGranary: true }, 'Stores: a granary, about a month of grain.'],
    [{ storageMonths: 2.4, hasGranary: true, storesHeld: false }, 'Stores: a granary, about two and a half months of grain.'], // R2-CODE-B-3 item 2a: the words contain the figure
    ];
    for (const [record, line] of TABLE) expect(foodStoresWords(record), JSON.stringify(record)).toBe(line);
  });

  test('every span from a day to a month reads within half a unit of the record', () => {
    const wrong = [];
    for (let days = 1; days < 30; days += 0.25) {
      const span = storesSpanWords(days / DAYS_PER_MONTH);
      const [lo, hi] = claimedDays(span);
      if (!(days >= lo - 1e-9 && days <= hi + 1e-9)) wrong.push(`${days} days: "${span}"`);
    }
    expect(wrong).toEqual([]);
  });

  test('the famine finding reads the new forms back (none is six months)', () => {
    const s = { economicState: { foodSecurity: { foodRecord: { band: 'famine', storageMonths: 0.1 } } } };
    expect(famineStoresFindings(s, 'Stores: a granary, about three days of grain.')).toEqual([]);
    const held = { economicState: { foodSecurity: { foodRecord: { band: 'famine', storageMonths: 9 } } } };
    expect(famineStoresFindings(held, 'Stores: a granary, nine months of grain.')).toHaveLength(1);
  });

  test('famine thorps and hamlets: no stores line says weeks over days in store', () => {
    const wrong = [];
    let short = 0;
    for (let i = 0; i < 16; i++) {
      const s = generateSettlementPipeline({ settType: i % 2 ? 'thorp' : 'hamlet', stressTypes: ['famine'] }, null, { seed: `r2b-stores-${i}`, customContent: {} });
      const record = s.economicState.foodSecurity.foodRecord;
      const line = foodStoresWords(record);
      if (Number(record.storageMonths) * DAYS_PER_MONTH > 10) continue;
      short += 1;
      if (/week/.test(line)) wrong.push(`r2b-stores-${i}: ${record.storageMonths} months: ${line}`);
    }
    expect(short, 'no generated famine town held ten days or less').toBeGreaterThan(0);
    expect(wrong).toEqual([]);
  });
});
