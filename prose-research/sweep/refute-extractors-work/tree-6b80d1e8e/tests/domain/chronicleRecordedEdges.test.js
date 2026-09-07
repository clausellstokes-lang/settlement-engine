/**
 * chronicleRecordedEdges.test.js — THE CHRONICLE UPGRADE pins.
 *
 * The chronicle reads RECORDED provenance edges where the ledger carries them and
 * labels recorded-vs-inferred honestly; an absent/empty ledger reproduces the prior
 * entity-key inference byte-for-byte (dormancy-neutral read).
 */
import { describe, it, expect } from 'vitest';
import { decreesForAdvance } from '../../src/domain/display/decreeTracker.js';
import { chronicleForAdvance } from '../../src/domain/display/chronicleReadModel.js';
import { connectedComponents, nodesFromRecord, buildRecordedEdges } from '../../src/domain/display/chronicleGraph.js';

// A(decree) → B → C with DISJOINT entity keys (sA/sB/sC) — only recorded edges link them.
const record = {
  tick: 300,
  selectedOutcomes: [
    { id: 'A', applyMode: 'proposal', proposalPayload: { kind: 'realm_verb_order' }, targetSaveId: 'sA', headline: 'Your decree', severity: 0.6 },
    { id: 'B', type: 'condition', targetSaveId: 'sB', headline: 'B happened', severity: 0.5 },
    { id: 'C', type: 'condition', targetSaveId: 'sC', headline: 'C happened', severity: 0.4 },
  ],
  impactDigest: [],
};
const entry = { tick: 300, prevTick: 299, spanWeeks: 1, spanLabel: 'week', record };
const ledger = { B: { parents: ['A'], type: 'condition', tick: 300 }, C: { parents: ['B'], type: 'condition', tick: 300 } };

describe('chronicle recorded edges — decree cone', () => {
  it('WITHOUT the ledger, the decree cone is inferred and (here, disjoint keys) empty', () => {
    const section = decreesForAdvance(entry);
    // A is the only decree; with no shared keys it has no inferred downstream ⇒ honest null.
    const a = [...section.singletons, ...section.nulls].find(d => d.decreeId === 'A');
    expect(a).toBeTruthy();
    expect(a.coneInferred).toBe(true);
    expect(a.standingInferred).toBe(true);
    expect(a.coneSize).toBe(0);
    expect(a.honestNull).toBe(true);
  });

  it('WITH the ledger, the decree cone is EXACTLY {B, C} and labelled recorded', () => {
    const section = decreesForAdvance(entry, ledger);
    const a = [...section.singletons, ...section.nulls].find(d => d.decreeId === 'A');
    expect(a).toBeTruthy();
    expect(a.cone).toEqual(['B', 'C']);
    expect(a.coneSize).toBe(2);
    expect(a.coneInferred).toBe(false);
    expect(a.standingInferred).toBe(false);
    expect(a.honestNull).toBe(false);
    expect(a.standing).toBe('held');
  });
});

describe('chronicle recorded edges — thread stitching', () => {
  it('recorded edges union a disjoint-key chain into ONE thread', () => {
    const nodes = nodesFromRecord(record);
    // Inference alone: 3 singleton components (disjoint keys).
    expect(connectedComponents(nodes, buildRecordedEdges(null)).length).toBe(3);
    // With recorded edges: A,B,C collapse into ONE thread.
    expect(connectedComponents(nodes, buildRecordedEdges(ledger)).length).toBe(1);
  });
});

describe('chronicle recorded edges — dormancy-neutral read', () => {
  it('an absent ledger and an empty ledger yield the identical chronicle', () => {
    const noArg = chronicleForAdvance(entry);
    const emptyLedger = chronicleForAdvance(entry, {});
    expect(JSON.stringify(emptyLedger)).toBe(JSON.stringify(noArg));
    // And the inferred labels persist (no recorded edges present).
    expect(noArg.threads.length).toBe(3);
  });
});
