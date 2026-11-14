/**
 * ROUND THREE (the chair's ruling on the increment's #472, #668 and #769; ROUND-3-CUT-INCREMENT at fe6d5b741): THE WORDS
 * CONTAIN THE FIGURE. "No granary; two months in household stores." printed where the food record holds 1.5 months
 * (rpf-thorp-under_siege-13, rpf-thorp-succession_void-13, rpf-thorp-occupied-13): `storesSpanWords` rounded 1.5 up to two
 * and said it without "about". The span's words come from the stores' one home (`tonightSheet.js :: storesSpanWords`,
 * read by the Tonight sheet, the Crisis page, the Economics tab, the PDF and the journal), and a band's word is true of
 * every figure in the band: from a month up, the span is said to the nearest half month below three months and to the
 * nearest month above, always with "about".
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { DAYS_PER_MONTH, composeTonightSheet, foodStoresWords, storesSpanWords } from '../../src/domain/summary/tonightSheet.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';

const READERS = ['rpf-thorp-under_siege-13', 'rpf-thorp-succession_void-13', 'rpf-thorp-occupied-13'];
/** @param {string} seed */
function cfgFor(seed) {
  const m = /** @type {RegExpMatchArray} */ (seed.match(/^rpf-(\w+)-([a-z_+]+)-(\d+)$/));
  return birthConfig({ ...DEFAULT_CONFIG, settType: m[1], selectedStressesRandom: false, selectedStresses: m[2] === 'calm' ? [] : m[2].split('+'), _randomizePriorities: true });
}
/** @type {Record<string, any>} */
const born = {};
beforeAll(async () => {
  await loadGenerationLawPayloads();
  for (const seed of READERS) born[seed] = generateSettlementPipeline(cfgFor(seed), null, { seed, customContent: {} });
}, 300_000);

const WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'];
/** The months a span's words say, read back (the reader's arithmetic, not the writer's). @param {string} span */
function monthsSaid(span) {
  if (span === 'about a month') return 1;
  if (span === 'about a month and a half') return 1.5;
  const m = span.match(/^about (\S+)( and a half)? months$/);
  if (m) return (WORDS.indexOf(m[1]) >= 0 ? WORDS.indexOf(m[1]) : Number(m[1])) + (m[2] ? 0.5 : 0);
  const w = span.match(/^about (\S+) (weeks|days)$/);
  if (w) return (w[1] === 'a' ? 1 : WORDS.indexOf(w[1])) * (w[2] === 'weeks' ? 7 : 1) / DAYS_PER_MONTH;
  return NaN;
}

describe('ROUND THREE · the stores\' span in words contains the figure', () => {
  it('the readers\' three thorps: 1.5 months reads "about a month and a half", never "two months"', () => {
    expectNoSeedFailures(collectSeedFailures(READERS, (seed) => {
      const record = born[seed].economicState.foodSecurity.foodRecord;
      expect(record.storageMonths, seed).toBe(1.5);
      const food = composeTonightSheet(born[seed]).facts.find((f) => f.id === 'food');
      expect(food?.text, seed).toContain('No granary; about a month and a half in household stores.');
      // anchored: the same text holds the stores line, asserted present on the line just above
      expect(food?.text, seed).not.toMatch(/two months/);
    }), 'the readers\' thorps read "about a month and a half"');
  });

  it('every span from a month to two years is said within a quarter of its figure below three months, half a month above', () => {
    for (let tenths = 10; tenths <= 240; tenths += 1) {
      const months = tenths / 10;
      const said = monthsSaid(storesSpanWords(months));
      expect(Math.abs(said - months), `${months} -> ${storesSpanWords(months)}`).toBeLessThanOrEqual(months < 3 ? 0.25 : 0.5);
      expect(storesSpanWords(months), `${months}`).toMatch(/^about /);
    }
  });

  it('the stores sentence keeps its three forms (granary held, granary, household stores) around the span', () => {
    expect(foodStoresWords({ storageMonths: 1.5, hasGranary: false })).toBe('No granary; about a month and a half in household stores.');
    expect(foodStoresWords({ storageMonths: 2.1, hasGranary: true })).toBe('Stores: a granary, about two months of grain.');
    expect(foodStoresWords({ storageMonths: 0.1, hasGranary: false })).toBe('No granary; about three days in the larder.');
  });
});
