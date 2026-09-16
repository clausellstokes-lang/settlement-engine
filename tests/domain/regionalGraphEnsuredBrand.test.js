/**
 * tests/domain/regionalGraphEnsuredBrand.test.js — performance-scale-7 pin.
 *
 * ensureRegionalGraphOnce short-circuits a redundant re-normalization of an already-
 * ensured graph (the wizard-news graph-change diff re-ensured the whole graph ×2 per
 * changed outcome + once per changed impact). The brand is non-enumerable, so it is
 * invisible to JSON / spread / clone — a modified or rehydrated graph safely falls
 * back to a full ensure.
 */
import { describe, expect, it } from 'vitest';
import { ensureRegionalGraph, ensureRegionalGraphOnce } from '../../src/domain/region/graph.js';
import { deriveWizardNewsEntriesFromGraphChange } from '../../src/domain/region/wizardNews.js';

const NOW = '2026-01-01T00:00:00.000Z';
const baseGraph = () => ensureRegionalGraph({
  channels: [{ type: 'trade_dependency', from: 'a', to: 'b', status: 'confirmed' }],
  queuedImpacts: [{ id: 'imp-1', status: 'queued', severity: 0.5, confidence: 0.5 }],
}, { now: NOW });

describe('performance-scale-7 — ensureRegionalGraphOnce', () => {
  it('returns the SAME object for an already-ensured (branded) graph', () => {
    const g = baseGraph();
    expect(ensureRegionalGraphOnce(g)).toBe(g);
  });

  it('re-normalizes an UNBRANDED graph (spread strips the brand ⇒ full ensure)', () => {
    const g = baseGraph();
    const spread = { ...g }; // spread drops the non-enumerable brand
    const ensured = ensureRegionalGraphOnce(spread);
    expect(ensured).not.toBe(spread); // fell through to a full ensure
    // …and the result is byte-equal to a direct ensure (idempotent).
    expect(JSON.stringify(ensured)).toBe(JSON.stringify(g));
  });

  it('re-normalizes a rehydrated (JSON round-trip) graph', () => {
    const g = baseGraph();
    const rehydrated = JSON.parse(JSON.stringify(g));
    expect(ensureRegionalGraphOnce(rehydrated)).not.toBe(rehydrated);
  });

  it('the brand is invisible to JSON.stringify (byte-identity preserved)', () => {
    const g = baseGraph();
    // No symbol/hidden keys leak into the serialized bytes.
    const parsed = JSON.parse(JSON.stringify(g));
    expect(Object.keys(parsed).sort()).toEqual(['channels', 'edges', 'eventLog', 'nodes', 'queuedImpacts', 'schemaVersion', 'updatedAt']);
  });

  it('the graph-change diff yields identical entries whether inputs are pre-ensured or raw', () => {
    const before = baseGraph();
    // Transition the impact to resolved on the "after" graph.
    const after = ensureRegionalGraph({ ...before, queuedImpacts: [{ ...before.queuedImpacts[0], status: 'resolved' }] }, { now: NOW });
    // Pre-ensured inputs (Once short-circuits) vs raw JSON inputs (full ensure) must
    // produce byte-identical Wizard News.
    const viaEnsured = deriveWizardNewsEntriesFromGraphChange(before, after, { tick: 1, createdAt: NOW });
    const rawBefore = JSON.parse(JSON.stringify(before));
    const rawAfter = JSON.parse(JSON.stringify(after));
    const viaRaw = deriveWizardNewsEntriesFromGraphChange(rawBefore, rawAfter, { tick: 1, createdAt: NOW });
    expect(JSON.stringify(viaEnsured)).toBe(JSON.stringify(viaRaw));
    expect(viaEnsured.length).toBeGreaterThan(0);
  });
});
