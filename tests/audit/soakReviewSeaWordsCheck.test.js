/**
 * THE BATTERY'S A-11 CHECK LICENSES THE DESIGNED INLAND FISH TRADE (chair ruling 4a/4c,
 * 2026-11-04): preserved, salted, dried, smoked or pickled fish, and the bare "Fish" item of a
 * goods list where the record itself imports fish (resourceAnalysis.imports.critical).
 */
import { describe, expect, it } from 'vitest';
import { seaWordSentence, sentencesOf } from '../../scripts/audit/soak-review/checks.mjs';

const IMPORTS_FISH = { resourceAnalysis: { imports: { critical: ['clay', 'fish'] } } };

describe('A-11 sea words, the instrument', () => {
  it('an inland town with the salted-fish row: 0 findings', () => {
    expect(seaWordSentence(sentencesOf('Preserved fish\nSalted fish\nSmoked, dried, and salt-preserved fish for storage and inland trade.'), {})).toBeUndefined();
  });
  it('an imported "Fish" in a goods list is licensed only where the record imports fish', () => {
    const list = sentencesOf('Animal hides Clay Fish Livestock Metals Mountain timber Salt');
    expect(seaWordSentence(list, IMPORTS_FISH)).toBeUndefined();
    expect(seaWordSentence(list, {})).toBe('Animal hides Clay Fish Livestock Metals Mountain timber Salt');
  });
  it('still finds the harbour, the catch and the ships', () => {
    for (const line of ['Built around the agora and the harbour.', 'Racks of drying fish line the way in.', 'Timber → lumber → planks → furniture → ships']) {
      expect(seaWordSentence([line], IMPORTS_FISH)).toBe(line);
    }
  });
});
