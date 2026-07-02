/**
 * @vitest-environment jsdom
 *
 * tests/pdf/economicsTradeGlyphTofu.test.js — no-tofu guard for the
 * Economics & Trade chapter.
 *
 * The bundled Lora/Nunito subsets embed NO arrow or dingbat glyphs — U+2726 (✦),
 * U+2190 (←) and U+2192 (→) all render as visible tofu boxes in the paid PDF.
 * (Empirically verified against public/fonts/*.ttf: all 8 faces miss them.)
 * The chapter previously used ✦ as the custom-item marker and ←/→ in the
 * "trade with neighbours" rows + legend.
 *
 * The fix swaps to font-covered equivalents: ✦ → "*", and the directional
 * arrows → the guillemets «/» (U+00AB/U+00BB, present in every embedded face,
 * same convention SupplyChainFlow already uses ">" and "·"). U+00B7 ("·") is
 * kept — it IS present in all faces.
 *
 * These tests assert the rendered text of the chapter carries none of the
 * tofu codepoints, while the directional legend + custom markers survive in a
 * covered form.
 */
import { describe, test, expect } from 'vitest';
import { EconomicsTrade } from '../../src/pdf/sections/EconomicsTrade.jsx';

// Collect every string leaf from a react-pdf element tree, expanding
// function-component elements (mirrors the Timeline ligature test's walker).
function collectText(node, out = []) {
  if (node == null || node === false || node === true) return out;
  if (typeof node === 'string') { out.push(node); return out; }
  if (typeof node === 'number') { out.push(String(node)); return out; }
  if (Array.isArray(node)) { for (const c of node) collectText(c, out); return out; }
  if (typeof node?.type === 'function') {
    collectText(node.type({ ...node.props }), out);
    return out;
  }
  const children = node?.props?.children;
  if (children != null) collectText(children, out);
  return out;
}

const vm = {
  entityIndex: null,
  economics: {
    prosperity: 'thriving',
    economicComplexity: 'complex',
    economyOutput: 1200,
    tradeAccess: 'open',
    // Custom-labelled export + import → each renders the custom marker glyph.
    primaryExports: ['silver', 'saltfish'],
    primaryImports: ['timber'],
    localProduction: ['bread'],
    customTradeLabels: { exports: ['saltfish'], imports: ['timber'] },
    customCategoryExports: { saltfish: ['cod', 'herring'] },
    customCategoryImports: { timber: ['oak'] },
    // Trade-with-neighbours rows exercise the directional arrows + legend.
    tradeLinks: [
      { partner: 'Ravensmoor', direction: 'import', good: 'iron' },
      { partner: 'Ravensmoor', direction: 'export', good: 'silver' },
    ],
    // A custom supply chain renders the custom marker glyph too.
    customChains: [
      { name: 'Saltfish Curing', resource: 'cod', processingInstitutions: ['Curing House'], outputs: ['saltfish'] },
    ],
    shadowEconomy: {},
  },
};

// Codepoints that are absent from every embedded Lora/Nunito face and thus
// print as tofu boxes in the PDF.
const TOFU = ['✦', '←', '→', '↔', '↯', '⚠', '▸'];

describe('EconomicsTrade — no tofu glyphs reach the rendered PDF text', () => {
  const text = collectText(EconomicsTrade({ settlement: {}, narrativeMode: false, vm })).join('');

  test('none of the un-embedded arrow/dingbat codepoints appear', () => {
    for (const ch of TOFU) {
      expect(text.includes(ch)).toBe(false);
    }
  });

  test('the custom-item marker renders as a covered "*"', () => {
    // saltfish is custom-labelled → its bullet carries the marker.
    expect(text).toContain('*');
    // and the ✦ it replaced is gone.
    expect(text).not.toContain('✦');
  });

  test('the trade-direction legend uses covered guillemets, not arrows', () => {
    expect(text).toContain('« imported from'); // « imported from
    expect(text).toContain('» exported to');   // » exported to
    expect(text).not.toContain('←');
    expect(text).not.toContain('→');
  });

  test('the retained middle dot "·" is covered and preserved', () => {
    expect(text).toContain('·'); // U+00B7 present in every face
  });
});
