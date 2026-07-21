/**
 * causeWalk.test.js — VISION V-4 THE CAUSE-WALK.
 *
 * The backward provenance walk resolves over a lit DAG, degrades gracefully at
 * roots and when the ledger is dark, and NEVER leaks a covert cause to a viewer
 * who does not see DM secrets (the secrets seam).
 *
 * The lit DAG mirrors tests/domain/chronicleRecordedEdges.test.js: A (a decree) →
 * B → C, DISJOINT entity keys, so ONLY recorded edges link them.
 */
import { describe, it, expect } from 'vitest';
import { buildRecordedEdges, recordedAncestors } from '../../src/domain/display/chronicleGraph.js';
import {
  buildCauseWalk, receiptIsCovert, NO_DEEPER_MEMORY, LEDGER_DARK_LINE, REDACTED_HOP,
} from '../../src/domain/display/causeWalk.js';
import { compactOutcomeForHistory } from '../../src/domain/worldPulse/pulseHelpers.js';

const baseOutcomes = [
  { id: 'A', applyMode: 'proposal', proposalPayload: { kind: 'realm_verb_order' }, targetSaveId: 'sA', headline: 'Your decree', severity: 0.6 },
  { id: 'B', type: 'condition', targetSaveId: 'sB', headline: 'B happened', severity: 0.5 },
  { id: 'C', type: 'condition', targetSaveId: 'sC', headline: 'C happened', severity: 0.4 },
];
const provenance = { B: { parents: ['A'], type: 'condition', tick: 300 }, C: { parents: ['B'], type: 'condition', tick: 300 } };
const worldOf = (outcomes = baseOutcomes) => ({
  pulseHistory: [{ tick: 300, selectedOutcomes: outcomes, impactDigest: [] }],
  spatialLedgers: { provenance },
});

describe('V-4 — recordedAncestors (the backward primitive)', () => {
  const edges = buildRecordedEdges(provenance);
  it('walks parent edges backward, transitively, deterministically', () => {
    expect(recordedAncestors('C', edges)).toEqual(['A', 'B']); // sorted
    expect(recordedAncestors('B', edges)).toEqual(['A']);
    expect(recordedAncestors('A', edges)).toEqual([]); // a root has no ancestors
  });
  it('is cycle-safe', () => {
    const cyc = buildRecordedEdges({ X: { parents: ['Y'] }, Y: { parents: ['X'] } });
    expect(() => recordedAncestors('X', cyc)).not.toThrow();
    expect(recordedAncestors('X', cyc)).toEqual(['Y']);
  });
});

describe('V-4 — backward resolution over a lit DAG', () => {
  it('traces C back through B to the decree A, nearest first, with receipts', () => {
    const walk = buildCauseWalk({ worldState: worldOf(), rootId: 'C', seesSecrets: true });
    expect(walk.atRoot).toBe(false);
    expect(walk.ledgerDark).toBe(false);
    expect(walk.chain.map((h) => h.id)).toEqual(['B', 'A']);
    expect(walk.chain.map((h) => h.depth)).toEqual([1, 2]);
    expect(walk.chain[0].headline).toBe('B happened');
    expect(walk.chain[1].headline).toBe('Your decree');
    expect(walk.graceLine).toBe('');
  });

  it('a ROOT cause traces to the graceful "no deeper memory" line', () => {
    const walk = buildCauseWalk({ worldState: worldOf(), rootId: 'A', seesSecrets: true });
    expect(walk.atRoot).toBe(true);
    expect(walk.chain).toEqual([]);
    expect(walk.graceLine).toBe(NO_DEEPER_MEMORY);
  });
});

describe('V-4 — absent-flag grace (a world with no provenance ledger)', () => {
  it('reads ledgerDark with the honest dark line, no chain', () => {
    const dark = { pulseHistory: [{ tick: 300, selectedOutcomes: baseOutcomes, impactDigest: [] }] }; // no spatialLedgers
    const walk = buildCauseWalk({ worldState: dark, rootId: 'C', seesSecrets: true });
    expect(walk.ledgerDark).toBe(true);
    expect(walk.chain).toEqual([]);
    expect(walk.graceLine).toBe(LEDGER_DARK_LINE);
  });
});

describe('V-4 — the secrets seam (no covert leak)', () => {
  const covertB = [
    baseOutcomes[0],
    { ...baseOutcomes[1], metadata: { covert: true } }, // B is a covert cause
    baseOutcomes[2],
  ];

  it('receiptIsCovert detects nested covert markers', () => {
    expect(receiptIsCovert({ metadata: { covert: true } })).toBe(true);
    expect(receiptIsCovert({ stressor: { covert: true } })).toBe(true);
    expect(receiptIsCovert({ covert: true })).toBe(true);
    expect(receiptIsCovert({ headline: 'plain' })).toBe(false);
  });

  it('SS2-F11: a covert marker SURVIVES compactOutcomeForHistory (durable receipt stays redactable)', () => {
    // The DURABLE pulseHistory receipt is compactOutcomeForHistory(outcome). It previously dropped
    // top-level `covert` and rebuilt `stressor` WITHOUT its covert field, so receiptIsCovert read
    // false on the compacted receipt and causeWalk leaked a covert coup/corruption headline to a
    // non-DM viewer for either idiom (only metadata.covert survived, masking the gap in tests).
    const topLevel = compactOutcomeForHistory({ id: 'X', type: 'condition', headline: 'a coup', covert: true });
    expect(receiptIsCovert(topLevel)).toBe(true);
    const viaStressor = compactOutcomeForHistory({ id: 'Y', headline: 'rot', stressor: { id: 's', type: 'unrest', label: 'u', severity: 0.5, covert: true } });
    expect(receiptIsCovert(viaStressor)).toBe(true);
    // A non-covert outcome compacts WITHOUT a covert field (byte-identical to before the guard).
    const plain = compactOutcomeForHistory({ id: 'Z', type: 'condition', headline: 'open' });
    expect('covert' in plain).toBe(false);
    expect(receiptIsCovert(plain)).toBe(false);
  });

  it('REDACTS a covert hop for a non-DM viewer — no headline, no settlements leak', () => {
    const walk = buildCauseWalk({ worldState: worldOf(covertB), rootId: 'C', seesSecrets: false });
    const bHop = walk.chain.find((h) => h.id === 'B');
    expect(bHop).toBeTruthy();
    expect(bHop.redacted).toBe(true);
    expect(bHop.headline).toBe(REDACTED_HOP);
    expect(bHop.settlementIds).toEqual([]);
    // The covert content NEVER appears anywhere in the serialized walk.
    const blob = JSON.stringify(walk);
    expect(blob).not.toContain('B happened');
    expect(blob).not.toContain('sB');
    // The SHAPE of causality still shows (A is still reached past the redacted B).
    expect(walk.chain.map((h) => h.id)).toEqual(['B', 'A']);
  });

  it('a DM viewer sees the covert hop in full', () => {
    const walk = buildCauseWalk({ worldState: worldOf(covertB), rootId: 'C', seesSecrets: true });
    const bHop = walk.chain.find((h) => h.id === 'B');
    expect(bHop.redacted).toBe(false);
    expect(bHop.headline).toBe('B happened');
    expect(bHop.settlementIds).toContain('sB');
  });

  it('GATES entirely when the START receipt is covert and the viewer is not a DM', () => {
    const walk = buildCauseWalk({ worldState: worldOf(covertB), rootId: 'B', seesSecrets: false });
    expect(walk.gated).toBe(true);
    expect(walk.chain).toEqual([]);
    expect(walk.root.headline).toBe(REDACTED_HOP);
    expect(JSON.stringify(walk)).not.toContain('B happened');
  });
});
