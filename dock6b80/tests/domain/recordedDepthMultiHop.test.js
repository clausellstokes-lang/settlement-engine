/**
 * recordedDepthMultiHop.test.js — E-J: RECORDED PROVENANCE GOES MULTI-HOP.
 *
 * The wave→immediate-parent cause-edge seam (`withWaveCauseEdges`, provenanceKernel.js).
 * A derived regional WAVE receipt (waveDepth ≥ 1) carries `sourceImpactId` = the id of the
 * impact it propagated from; deriveRegionalImpacts mints a wave and its source impact TOGETHER,
 * so the parent's recorded receipt key is this advance's own `wizard_news.<tick>.<transition>.
 * <parentImpactId>`. `withWaveCauseEdges` resolves that transiently (off the live queued-impact
 * record — no persisted field, no migration) and attaches it as an ADDITIVE `causedBy`, so the
 * recorded ledger forms genuine ≥2-hop chains (wave → its source → root) instead of only
 * child → root.
 *
 * LAZY & ADDITIVE & DARK (pinned here at the unit level):
 *   · The whole seam lives in the LAZY recorder — the news-derivation path is untouched, so the
 *     eager first-paint closure is unchanged (proven separately by the build closure ratchet).
 *   · The wave entry's existing `sourceEventId` (root edge) and every other field are preserved;
 *     only `causedBy` is added, on a SHALLOW COPY — input entries are never mutated.
 *   · No queued impacts (or none with a sourceImpactId) ⇒ the SAME array reference is returned.
 *
 * The end-to-end depth (arc-soak `deepChains` ≥ 1, measured 6) is pinned in
 * tests/simulation/emergentArcSoak.test.js; this file pins the seam deterministically.
 */
import { describe, expect, test } from 'vitest';
import {
  ensureRegionalGraph,
  deriveRegionalImpacts,
  queueRegionalImpacts,
  deriveWizardNewsEntriesFromGraphChange,
} from '../../src/domain/region/index.js';
import { withWaveCauseEdges } from '../../src/domain/worldPulse/provenanceKernel.js';

const NOW = '2026-01-01T00:00:00.000Z';
const GRAIN = 'Bulk grain and foodstuffs';
const TICK = 7;

/** A 2-hop grain chain a→b→c: an export loss at a shocks b (depth 0) and waves to c (depth 1). */
function twoHopBatch() {
  const graph = ensureRegionalGraph({
    channels: [
      { id: 'ch.a.b', type: 'trade_dependency', from: 'a', to: 'b', goods: [{ id: 'grain', label: GRAIN }], strength: 0.8, status: 'confirmed' },
      { id: 'ch.b.c', type: 'trade_dependency', from: 'b', to: 'c', goods: [{ id: 'grain', label: GRAIN }], strength: 0.8, status: 'confirmed' },
    ],
  }, { now: NOW });
  const localDelta = {
    id: 'localdelta.a.1', sourceSettlementId: 'a', sourceSettlementName: 'Ashford',
    changes: [{ kind: 'export_lost', magnitude: 0.95, good: { id: 'grain', label: GRAIN, criticality: 'high' } }],
  };
  const impacts = deriveRegionalImpacts(localDelta, graph, { maxDepth: 2, waveDecay: 0.6, now: NOW });
  const before = ensureRegionalGraph({ channels: graph.channels }, { now: NOW });
  const after = queueRegionalImpacts(before, impacts, { now: NOW });
  const newsEntries = deriveWizardNewsEntriesFromGraphChange(before, after, { tick: TICK, createdAt: NOW });
  return { before, after, impacts, newsEntries };
}

describe('E-J recorded provenance depth — wave receipts name their immediate parent', () => {
  test('the fixture forms a genuine 2-hop wave chain (d1.sourceImpactId === d0.id)', () => {
    const { impacts } = twoHopBatch();
    const d0 = impacts.find((i) => (i.waveDepth || 0) === 0);
    const d1 = impacts.find((i) => (i.waveDepth || 0) === 1);
    expect(d0).toBeTruthy();
    expect(d1).toBeTruthy();
    expect(d1.sourceImpactId).toBe(d0.id);
  });

  test('withWaveCauseEdges: the wave entry gains causedBy === the parent receipt key', () => {
    const { after, newsEntries } = twoHopBatch();
    // Base news entries carry NO causedBy (the seam is entirely recorder-side).
    for (const e of newsEntries) expect(Object.prototype.hasOwnProperty.call(e, 'causedBy')).toBe(false);

    const enriched = withWaveCauseEdges(newsEntries, after.queuedImpacts);
    const waveEntry = enriched.find((e) => e.id.includes('.queued.regional_wave.'));
    const parentEntry = enriched.find((e) => !e.id.includes('.regional_wave.') && e.impactIds?.[0]);
    expect(waveEntry).toBeTruthy();
    expect(parentEntry).toBeTruthy();
    expect(waveEntry.causedBy).toBe(parentEntry.id);
    expect(waveEntry.causedBy).toMatch(/^wizard_news\.7\.queued\.regional_impact\./);
    // ADDITIVE: the root edge (sourceEventId) and every other field survive untouched.
    const original = newsEntries.find((e) => e.id === waveEntry.id);
    for (const k of Object.keys(original)) expect(waveEntry[k]).toEqual(original[k]);
  });

  test('PURE: inputs are never mutated (enriched entries are shallow copies)', () => {
    const { after, newsEntries } = twoHopBatch();
    withWaveCauseEdges(newsEntries, after.queuedImpacts);
    for (const e of newsEntries) expect(Object.prototype.hasOwnProperty.call(e, 'causedBy')).toBe(false);
  });

  test('DARK: no queued impacts (or none with a sourceImpactId) ⇒ same array reference, no edges', () => {
    const { newsEntries } = twoHopBatch();
    expect(withWaveCauseEdges(newsEntries, undefined)).toBe(newsEntries);
    expect(withWaveCauseEdges(newsEntries, [])).toBe(newsEntries);
    // queued impacts present but NONE carry sourceImpactId (a root-only advance) ⇒ untouched.
    const rootOnly = [{ id: 'regional_impact.x', sourceImpactId: null }];
    expect(withWaveCauseEdges(newsEntries, rootOnly)).toBe(newsEntries);
  });

  test('DETERMINISM: identical inputs record the identical causedBy edge', () => {
    const a = twoHopBatch();
    const b = twoHopBatch();
    const ea = withWaveCauseEdges(a.newsEntries, a.after.queuedImpacts);
    const eb = withWaveCauseEdges(b.newsEntries, b.after.queuedImpacts);
    expect(JSON.stringify(ea)).toBe(JSON.stringify(eb));
  });
});
