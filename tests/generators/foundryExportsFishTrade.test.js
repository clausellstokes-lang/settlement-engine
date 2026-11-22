/**
 * tests/generators/foundryExportsFishTrade.test.js — F11 unit 3 (docs/SOAK_10000_RUNG2_2026-11-04.md
 * §2 kind 1, coh:food-words 21).
 *
 * FOUNDRY-EXPORTS (13): the journal's Exports row (src/foundry/journalPages.js) prints the same goods
 * the Economics tab and the PDF print, but escaped for Foundry markdown ("Healing waters
 * \(bottled\)", "Pilgrimage &amp; religious tourism"). F3's goods-list licence
 * (domain/coherence/foodWordsFindings.js :: isGoodsList) matched the goods raw, so the escaped row
 * was read as a sentence about the table while the screen's identical list was read as goods. The
 * licence now reads the row with the journal's escaping undone: one reading on three surfaces.
 *
 * FISHMONGER (8): with no fish source (foodGenerator.js :: fishSource) and no fish among the
 * imports, the Fishmonger's "…from the net to the table." takes its cart twin
 * (src/data/fishTradeTwinLines.js, after the draw); the food words license the line where fish is
 * imported.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { birth, ensureLaws } from '../../scripts/audit/soak-review/corpus.mjs';
import { foodWordsFindings } from '../../src/domain/coherence/foodWordsFindings.js';
import { buildViewModel } from '../../src/pdf/lib/viewModel.js';
import { buildFoundryModuleFiles } from '../../src/foundry/moduleBuilder.js';
import { fishTradeTwinSentences, recordHoldsFish } from '../../src/data/fishTradeTwinLines.js';

/** @param {any} s */
const journalText = (s) => buildFoundryModuleFiles({ settlement: s, vm: buildViewModel({ settlement: s, phase: 'canon' }), variant: 'canon_dossier', faithUnlocked: true })
  .pages.map((/** @type {any} */ p) => String(p.markdown ?? p.text?.markdown ?? p.text?.content ?? '')).join('\n');

beforeAll(async () => { await ensureLaws(); }, 120_000);

describe('F11 · the Foundry Exports row reads as the screen reads', () => {
  for (const i of [9764, 2277, 6525]) {
    it(`soak1k-${i}: the journal's Exports row is goods, not a sentence about the table`, () => {
      const s = birth(i).settlement;
      const row = journalText(s).split('\n').find((line) => line.startsWith('- **Exports:**'));
      expect(row).toMatch(/\\\(|&amp;/); // the journal escapes the goods
      expect(foodWordsFindings(s, row || '')).toEqual([]);
    });
  }
  it('a row with one word that is not a good is still read', () => {
    const s = birth(9764).settlement;
    expect(foodWordsFindings(s, '- **Exports:** Desert grain, Meals and drink, and the table\'s bread').length).toBeGreaterThan(0);
  });
});

describe('F11 · a fishmonger with no fish is the cart\'s trade', () => {
  it('soak1k-1652: no fish source, no fish bought in, so the Fishmonger carries fish from the cart', () => {
    const s = birth(1652).settlement;
    expect(recordHoldsFish(s.economicState)).toBe(false);
    const desc = s.institutions.find((/** @type {any} */ x) => x.name === 'Fishmonger')?.desc;
    expect(desc).toContain('The trade that carries fish from the cart to the table.');
    expect(foodWordsFindings(s, desc)).toEqual([]);
  });
  it('the line is kept to the byte where the place holds fish', () => {
    const line = 'Buys the catch. The trade that carries fish from the net to the table. Inland, dried.';
    expect(fishTradeTwinSentences(line, true)).toBe(line);
    expect(fishTradeTwinSentences(line, false)).toBe('Buys the catch. The trade that carries fish from the cart to the table. Inland, dried.');
  });
  it('fish among the imports holds the line, and the food words license it', () => {
    const fishmonger = { name: 'Fishmonger', desc: 'Buys the catch. The trade that carries fish from the net to the table.' };
    const economicState = { primaryImports: ['Salted fish'], foodSecurity: { foodRecord: { band: 'pressured', foodSources: [], storageMonths: 2 } } };
    expect(recordHoldsFish(economicState)).toBe(true);
    expect(foodWordsFindings({ institutions: [fishmonger], economicState }, 'The trade that carries fish from the net to the table.')).toEqual([]);
    expect(foodWordsFindings({ institutions: [fishmonger], economicState: { ...economicState, primaryImports: [] } }, 'The trade that carries fish from the net to the table.')).toHaveLength(1);
  });
});
