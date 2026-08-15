/**
 * wizardNewsHeadlineFallback.test.js — finding-11 regression pin.
 *
 * A regional-graph node that exists without a name must NEVER render its raw
 * internal id inside diegetic headline/summary copy. The resolution order is
 * names.get → carried …SettlementName → a neutral in-world phrase — the raw id
 * is never a fallback, and nodeNameMap no longer maps a nameless node to its id.
 */
import { describe, it, expect } from 'vitest';
import { createWizardNewsEntryFromImpact } from '../../src/domain/region/wizardNews.js';

const impact = {
  id: 'imp1', kind: 'trade_dependency', status: 'ready',
  sourceSettlementId: 'src-node', targetSettlementId: 'tgt-node',
  channelId: 'ch1', channelType: 'trade_dependency',
};

describe('wizardNews headline/summary — no raw id leaks (finding-11)', () => {
  it('a nameless target/source node yields a neutral phrase, never the raw id', () => {
    const graph = { nodes: [{ id: 'src-node' }, { id: 'tgt-node' }], edges: [], channels: [] };
    const entry = createWizardNewsEntryFromImpact(impact, { graph, tick: 1, transition: 'ready' });
    expect(entry).toBeTruthy();
    expect(entry.headline).not.toMatch(/tgt-node|src-node/);
    expect(entry.summary).not.toMatch(/tgt-node|src-node/);
    // the neutral phrase stands in for the missing name — and it speaks the
    // world's register, not the software's (C2 bar 4).
    expect(entry.headline).toMatch(/a far settlement/i);
    expect(entry.headline).not.toContain('Unknown settlement');
  });

  it('a NAMED node still resolves to its name (control — no regression)', () => {
    const graph = { nodes: [{ id: 'tgt-node', name: 'Rivermouth' }, { id: 'src-node', name: 'Oldford' }], edges: [], channels: [] };
    const entry = createWizardNewsEntryFromImpact(impact, { graph, tick: 1, transition: 'ready' });
    expect(entry.headline).toContain('Rivermouth');
    expect(entry.headline).not.toMatch(/tgt-node|src-node/);
  });
});
