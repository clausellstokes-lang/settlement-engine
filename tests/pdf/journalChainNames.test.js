/**
 * tests/pdf/journalChainNames.test.js — UPKEEP-14 (the chair's ruling (j), 2026-11-14; the leaves lane's reader's
 * HIGH, carried: "- **Chain** *(impaired)*", 23,653 lines over 1,824 births, every town).
 *
 * THE SLICE READS THE NAME THE RECORD HOLDS. `viewModelBodySlices.js :: economicsSlice` named every supply chain
 * `c.name || c.chainName || 'Chain'`, and the record's chains carry `label`, so the Foundry journal's "Supply
 * chains" list printed "Chain" for each. The slice now reads the record's label as the page prints it
 * (`chainPrintName`, the leaf every chain-name print site reads), and a chain with no name is not printed.
 * Guarded on three born towns (a thorp, a besieged city, a town) and on a hand-made record (the nameless chain).
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { birth, ensureLaws } from '../../scripts/audit/soak-review/corpus.mjs';
import { buildViewModel } from '../../src/pdf/lib/viewModel.js';
import { economicsSlice } from '../../src/pdf/lib/viewModelBodySlices.js';
import { buildFoundryModuleFiles } from '../../src/foundry/moduleBuilder.js';
import { chainPrintName } from '../../src/domain/display/chainPrintName.js';
import { esc } from '../../src/foundry/journalPages.js';

/** @param {any} s */
const journalText = (s) => buildFoundryModuleFiles({ settlement: s, vm: buildViewModel({ settlement: s, phase: 'canon' }), variant: 'canon_dossier', faithUnlocked: true })
  .pages.map((/** @type {any} */ p) => String(p.markdown ?? p.text?.markdown ?? p.text?.content ?? '')).join('\n');

/** The journal's chain rows: the lines of its "## Supply chains" list. @param {string} text */
const chainRows = (text) => {
  const lines = text.split('\n');
  const at = lines.indexOf('## Supply chains');
  if (at < 0) return [];
  const rows = [];
  for (const line of lines.slice(at + 1)) { if (!line.startsWith('- **')) break; rows.push(line); }
  return rows;
};

beforeAll(async () => { await ensureLaws(); }, 120_000);

describe('(j) the Foundry journal names each supply chain by its record', () => {
  for (const i of [9764, 2277, 6525]) {
    it(`soak1k-${i}: every chain row is the record's printed name, in the record's order; none is "Chain"`, () => {
      const s = /** @type {any} */ (birth(i).settlement);
      const chains = s.economicState.activeChains;
      expect(chains.length, 'anti-vacuity: the town holds chains').toBeGreaterThan(0);
      const rows = chainRows(journalText(s));
      expect(rows.map((r) => /^- \*\*(.+?)\*\* \*\(/.exec(r)?.[1])).toEqual(chains.map((/** @type {any} */ c) => esc(chainPrintName(c, s).label)));
      expect(rows.filter((r) => r.startsWith('- **Chain** *('))).toEqual([]);
    });
  }
  it('a chain with no name is not printed, and the named one keeps its own', () => {
    const e = economicsSlice(/** @type {any} */ ({ economicState: { activeChains: [{ chainId: 'x', status: 'impaired' }, { chainId: 'fishing', label: 'Fishing & Seafood', status: 'vulnerable' }] } }));
    expect(e.chains.map((c) => c.name)).toEqual(['Fishing & Seafood']);
  });
});
