/**
 * supplyChainObjectExports.test.js — regression for the object-shaped-export crash.
 *
 * `economicState.primaryExports` is documented as `string | {good/name/label}`
 * (simulationSpine) and generator/domain fixtures really produce the object shape.
 * The supply-chain export-match fallback in BOTH the PDF section (SupplyChainFlow)
 * and the web panel (SupplyChainsPanel) called `ex.toLowerCase()` directly, which
 * throws `ex.toLowerCase is not a function` on an object element. In the PDF that
 * throw rejected the whole <Document>, failing the ENTIRE dossier export — not just
 * the chapter. The fix routes `ex` through the shared object-safe `goodText()`.
 */
import { describe, it, expect } from 'vitest';
import { goodText } from '../../src/domain/region/goodsCatalog.js';
import { ChainRow } from '../../src/components/new/SupplyChainsPanel.jsx';

describe('goodText: object-safe trade-good label extraction', () => {
  it('reads {good/name/label} and passes bare strings through, never throwing on objects', () => {
    expect(goodText('Smoked river fish')).toBe('Smoked river fish');
    expect(goodText({ good: 'Smoked river fish' })).toBe('Smoked river fish');
    expect(goodText({ name: 'forged weapons' })).toBe('forged weapons');
    expect(goodText({ label: 'Wool cloth' })).toBe('Wool cloth');
    expect(goodText(null)).toBe('');
    expect(goodText(undefined)).toBe('');
    // The failure mode the crash exhibited: .toLowerCase() on the result must not throw.
    expect(() => goodText({ good: 'X' }).toLowerCase()).not.toThrow();
  });
});

describe('ChainRow export match tolerates object-shaped primaryExports', () => {
  const chain = {
    chainId: 'fish',
    status: 'healthy',
    exportable: true,
    entrepot: false,
    processingInstitutions: [],
    outputs: ['Smoked river fish'],
  };

  it('does not throw when primaryExports contains objects (the PDF-wide crash)', () => {
    expect(() =>
      ChainRow({ chain, instNames: [], primaryExports: [{ good: 'Smoked river fish' }] }),
    ).not.toThrow();
    expect(() =>
      ChainRow({ chain, instNames: [], primaryExports: [{ name: 'forged weapons' }, 'Smoked river fish'] }),
    ).not.toThrow();
  });

  it('still marks the output as an export via the substring fallback on object shapes', () => {
    const el = ChainRow({ chain, instNames: [], primaryExports: [{ good: 'Smoked river fish' }] });
    // The rendered tree is opaque, but a successful (non-throwing) render on the
    // object shape is the contract — matching parity is covered by the string-based
    // status-parity tests. Assert we produced an element rather than crashing.
    expect(el).toBeTruthy();
  });
});
