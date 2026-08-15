/**
 * Pins the shared first-export → commodity scan (src/generators/tradeCommodity.js).
 *
 * Four sites used to run drifted copies of this scan (historyGenerator, two
 * inline IIFEs in narrativeGenerator, a raw first-word split in npcGenerator),
 * so the same settlement got different commodity words in different prose
 * blocks. The golden-master corpus cannot guard this — its configs only ever
 * produce six first-export labels, none of which distinguish the drifted
 * copies in serialized output — so the scan's semantics are pinned here
 * directly.
 */

import { describe, test, expect } from 'vitest';
import { deriveTradeCommodity } from '../../src/generators/tradeCommodity.js';

const es = label => ({ primaryExports: [label] });

describe('deriveTradeCommodity — shared keyword scan', () => {
  test('maps synonym keywords to canonical labels (union of the old drifted lists)', () => {
    expect(deriveTradeCommodity(es('Wheat surplus'))).toBe('grain');
    expect(deriveTradeCommodity(es('Herbal remedies'))).toBe('medicinal herbs');
    expect(deriveTradeCommodity(es('Milled lumber'))).toBe('timber');
    expect(deriveTradeCommodity(es('Smoked seafood'))).toBe('fish');
    expect(deriveTradeCommodity(es('Processed textiles'))).toBe('wool');
    expect(deriveTradeCommodity(es('Basic metalwork'))).toBe('iron');
    expect(deriveTradeCommodity(es('Guild-manufactured goods'))).toBe('crafts');
    expect(deriveTradeCommodity(es('Ale (barrel)'))).toBe('ale');
    // Canonical label is the plural 'spices' (historyGenerator's pick), not
    // narrativeGenerator's old 'spice'.
    expect(deriveTradeCommodity(es('Rare spices and dyes'))).toBe('spices');
  });

  test('scan order is load-bearing for multi-keyword labels', () => {
    // fish before salt: a salt-fish town is a fishing town, not a salt town
    expect(deriveTradeCommodity(es('Salted fish'))).toBe('fish');
    // iron (via metal) before gems (via jewel)
    expect(deriveTradeCommodity(es('Fine metalwork and jewelry'))).toBe('iron');
  });

  test('strict mode (default): unmatched exports return the fallback, never a raw first word', () => {
    // History prose interpolates "The supply of ${commodity}…" — a first-word
    // guess would produce "the supply of financial".
    expect(deriveTradeCommodity(es('Financial services'))).toBe(null);
    expect(deriveTradeCommodity(es('Financial services'), { fallback: 'key goods' })).toBe('key goods');
  });

  test('firstWordFallback mode: unmatched exports fall back to the lowercased first word', () => {
    expect(deriveTradeCommodity(es('Furs and pelts'), { firstWordFallback: true })).toBe('furs');
    // the final default only fires when there is no usable export at all
    expect(deriveTradeCommodity(es('Furs and pelts'), { firstWordFallback: true, fallback: 'trade goods' })).toBe('furs');
  });

  test('missing/empty exports hit the per-context default in both modes', () => {
    expect(deriveTradeCommodity(null)).toBe(null);
    expect(deriveTradeCommodity({ primaryExports: [] }, { firstWordFallback: true })).toBe(null);
    expect(deriveTradeCommodity({ primaryExports: [''] }, { firstWordFallback: true, fallback: 'trade goods' })).toBe('trade goods');
    expect(deriveTradeCommodity(undefined, { firstWordFallback: true, fallback: 'trade goods' })).toBe('trade goods');
  });
});
