/**
 * @vitest-environment jsdom
 *
 * traditionsSection.test.jsx — THE TRADITIONS wave (T-5). The PDF Traditions register
 * (chapter 07B) is MIRROR-ONLY and self-gating: a settlement with no `traditions` mirror
 * (a draft, or any export while the layer is dark) renders NOTHING (byte-identical); a lit
 * settlement prints each observance's name, motif, window, owner, outcome, and provenance.
 *
 * PDF components are plain hook-free functions returning element trees, so we execute them
 * and collect the text leaves — never PDF bytes (react-pdf render is non-deterministic).
 */
import { describe, it, expect } from 'vitest';
import { Traditions } from '../../src/pdf/sections/Traditions.jsx';
import { describeTraditionWindow } from '../../src/domain/traditions/genesis.js';

function collectText(node, out = []) {
  if (node == null || typeof node === 'boolean') return out;
  if (typeof node === 'string' || typeof node === 'number') { out.push(String(node)); return out; }
  if (Array.isArray(node)) { for (const n of node) collectText(n, out); return out; }
  if (typeof node === 'object') {
    if (typeof node.type === 'function') return collectText(node.type(node.props), out);
    return collectText(node.props?.children, out);
  }
  return out;
}

const MIRROR = [{
  id: 'tradition.ashford.0', name: 'The Founders’ Feast', coreMotif: { element: 'founding', act: 'feast' },
  window: { startWeekOfYear: 30, weeks: 1 }, scaleBand: 4, ownerKey: 'seat', ownerKind: 'seat',
  ownerLabel: 'The Council', deityRef: null, expression: { trappings: [], epithet: '' },
  mutationLog: [{ year: 40, kind: 'scale-up', cause: 'the town outgrew the old scale' }],
  lastHeldYear: 40, lastOutcome: 'triumph', suppressedBy: null, adoptedFrom: null,
}];

describe('PDF Traditions section (07B) — mirror-only, self-gating', () => {
  it('renders NOTHING for a settlement with no traditions mirror (byte-identical off-state)', () => {
    expect(Traditions({ settlement: {} })).toBeNull();
    expect(Traditions({ settlement: { traditions: [] } })).toBeNull();
    expect(Traditions({ settlement: null })).toBeNull();
  });

  it('prints the register — name, motif, window, owner, outcome, provenance — when the mirror is present', () => {
    const texts = collectText(Traditions({ settlement: { name: 'Ashford', traditions: MIRROR } }));
    const joined = texts.join(' | ');
    expect(joined).toContain('The Founders’ Feast');
    expect(joined).toContain(describeTraditionWindow(MIRROR[0].window)); // "Harvest, the fourth week"
    expect(joined).toContain('The Council'); // owner
    expect(joined).toContain('a triumph');   // last outcome label
    expect(joined).toContain('the town outgrew the old scale'); // provenance line
    expect(joined).toContain('Founding'); // the motif element, humanized (no dingbat glyph in the PDF)
  });
});
