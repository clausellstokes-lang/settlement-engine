/**
 * supplyChainFlowStatusParity.test.js — pins the PDF SupplyChainFlow STATUS
 * table against the engine-emitted status set.
 *
 * The engine emits 'entrepot' (computeActiveChains.js) and 'magically_sustained'
 * (chainMagicSubstitution.js) as HEALTHY chain statuses. SupplyChainFlow's local
 * getStatus falls back to STATUS.vulnerable (amber) for any status not in its
 * table — so a missing entry silently renders a healthy chain as "Vulnerable"
 * in the exported PDF. This is the same fallthrough bug fixed on the web side
 * (SupplyChainsPanel.jsx). This test locks the PDF table so it can't regress.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const read = (p) => readFileSync(resolve(process.cwd(), p), 'utf-8');

describe('PDF SupplyChainFlow STATUS covers the engine healthy statuses', () => {
  const src = read('src/pdf/sections/SupplyChainFlow.jsx');

  // Isolate the STATUS table literal so a stray mention elsewhere can't pass this.
  const table = src.slice(src.indexOf('const STATUS = {'), src.indexOf('const getStatus'));

  it('includes an entrepot entry (healthy transit status — not the amber fallback)', () => {
    expect(table, "SupplyChainFlow STATUS must key 'entrepot' or entrepot chains render as 'Vulnerable' in the PDF")
      .toMatch(/\bentrepot\s*:/);
  });

  it('includes a magically_sustained entry (healthy substituted status — not the amber fallback)', () => {
    expect(table, "SupplyChainFlow STATUS must key 'magically_sustained' or magic-sustained chains render as 'Vulnerable' in the PDF")
      .toMatch(/\bmagically_sustained\s*:/);
  });
});
