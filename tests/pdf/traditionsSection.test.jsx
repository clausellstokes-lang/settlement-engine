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
import { describeTraditionWindow, deriveFoundingTraditions } from '../../src/domain/traditions/genesis.js';
import { describeTradition } from '../../src/domain/traditions/traditionDescription.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

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

  it('consolidated (chair rulings 2026-10-30): element-only chip, no placeholder dashes, no footer', () => {
    const anchor = 'The Founders’ Feast';
    const joined = collectText(Traditions({ settlement: { name: 'Ashford', traditions: MIRROR } })).join(' | ');
    // The act already ends the name, so the chip prints the element alone.
    expectAbsentWithAnchor(joined, 'Feast | ·', anchor, 'the act half of the chip');
    expectAbsentWithAnchor(joined, 'Founding · Feast', anchor, 'the act half of the chip');
    expectAbsentWithAnchor(joined, 'carry its identity forward', anchor, 'the footer');
    // A mirror row with no owner and no outcome prints no "Owner: –" placeholder.
    const bare = [{ ...MIRROR[0], ownerKey: null, ownerLabel: null, lastOutcome: null }];
    const bareText = collectText(Traditions({ settlement: { name: 'Ashford', traditions: bare } })).join(' | ');
    expectAbsentWithAnchor(bareText, 'Owner:', anchor, 'owner placeholder');
    expectAbsentWithAnchor(bareText, 'Last held:', anchor, 'outcome placeholder');
  });
});

describe('PDF Traditions section (07B) — the description under each tradition (TRAD-4 unit 5 item 6; CTR4)', () => {
  it('a born town with a lit mirror prints each rite\'s description, composed by the one leaf for the owner (describeTradition), no wording of its own', () => {
    const born = generateSettlementPipeline(
      { settType: 'town', culture: 'germanic', terrainOverride: 'auto', tradeRouteAccess: 'random_trade', monsterThreat: 'civilized' },
      null, { seed: 'trad4-u5-pdf', customContent: {} },
    );
    // the mirror the traditions mover projects at a lit preset: the town's founding set (genesis), on the town
    const settlement = { ...born, traditions: deriveFoundingTraditions(born) };
    expect(settlement.traditions.length).toBeGreaterThan(0);
    const texts = collectText(Traditions({ settlement }));
    let described = 0;
    for (const rec of settlement.traditions) {
      const d = describeTradition(rec, settlement, { audience: 'owner' });
      if (!d) continue;
      described += 1;
      expect(texts, rec.name).toContain(d.text);
    }
    expect(described).toBeGreaterThan(0);
  });

  it('a mirror row the leaf composes nothing for (a DM\'s custom tradition) prints no description line and no placeholder', () => {
    const custom = [{ ...MIRROR[0], id: 'custom:abc' }];
    const texts = collectText(Traditions({ settlement: { name: 'Ashford', traditions: custom } }));
    expect(describeTradition(custom[0], { name: 'Ashford', traditions: custom }, { audience: 'owner' })).toBeNull();
    // anchored: the register row itself still prints (its name), only the description is absent
    expect(texts).toContain('The Founders’ Feast');
    expect(texts.filter((x) => /\b(undefined|null)\b|\[object Object\]/.test(x))).toEqual([]);
  });
});
