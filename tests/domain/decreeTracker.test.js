/**
 * tests/domain/decreeTracker.test.js — THE DECREE TRACKER pins (design §5 + §5b).
 *
 * Pins:
 *  · COMPLETENESS: every applied decree appears EXACTLY ONCE — as a singleton, in
 *    one cluster, or as a null (incl. the honest-null case, never dropped).
 *  · HONEST NULL: a decree with no downstream effect is a reported finding.
 *  · §5b MANDATORY: a constructed two-decree conflict fixture renders as ONE
 *    cluster naming the conflict — never as two independent entries.
 *  · LANDING: realm-verb ids yield "week k of N"; other decrees degrade honestly.
 *  · DETERMINISM: same record ⇒ byte-identical decree section.
 */

import { describe, it, expect } from 'vitest';

import { decreesForAdvance, landingWeek, reversalSignal } from '../../src/domain/display/decreeTracker.js';
import { advanceEntries } from '../../src/domain/display/chronicleGraph.js';

/** Wrap a record into a single-advance entry (52-week span from 0). */
const entryFor = (record) => advanceEntries({ pulseHistory: [record] })[0];

describe('decreeTracker — completeness (every decree once)', () => {
  it('an advance with no decrees returns an always-present empty section', () => {
    const section = decreesForAdvance(entryFor({ tick: 4, selectedOutcomes: [{ id: 'o1', headline: 'a quiet week' }], impactDigest: [] }));
    expect(section).toEqual({ total: 0, singletons: [], clusters: [], nulls: [], findings: [] });
  });

  it('partitions every decree into exactly one of singleton / cluster / null', () => {
    const record = {
      tick: 52,
      selectedOutcomes: [
        // A held singleton: a decree with a downstream (non-reversing) effect.
        { id: 'realm_verb.grant_charter.gov1.10.abcd', applyMode: 'proposal', headline: 'You granted a charter', targetSaveId: 'A' },
        { id: 'o_effect', headline: 'The charter town swells', populationDeltas: { A: 200 }, targetSaveId: 'A' },
        // An honest null: a decree touching an entity nothing else does.
        { id: 'realm_verb.rename.gov1.20.ef01', applyMode: 'proposal', headline: 'You renamed a hamlet', targetSaveId: 'LONELY' },
      ],
      impactDigest: [],
    };
    const section = decreesForAdvance(entryFor(record));
    const seen = [
      ...section.singletons.map(d => d.decreeId),
      ...section.clusters.flatMap(c => c.decrees.map(d => d.decreeId)),
      ...section.nulls.map(d => d.decreeId),
    ].sort();
    // Both decrees present, each exactly once.
    expect(seen).toEqual(['realm_verb.grant_charter.gov1.10.abcd', 'realm_verb.rename.gov1.20.ef01']);
    expect(section.total).toBe(2);
    // The lonely rename is an honest null with its finding.
    const nullOne = section.nulls.find(d => d.decreeId.includes('rename'));
    expect(nullOne).toBeTruthy();
    expect(nullOne.honestNull).toBe(true);
    expect(section.findings.some(f => f.decreeId === nullOne.decreeId && /no measurable downstream/.test(f.text))).toBe(true);
  });
});

describe('decreeTracker — §5b entanglement consolidation (MANDATORY conflict pin)', () => {
  it('two conflicting decrees render as ONE cluster naming the conflict, never two independent entries', () => {
    // Your granary order raises settlement A; your embargo then reverses A's tier.
    const record = {
      tick: 52,
      selectedOutcomes: [
        { id: 'realm_verb.granary_order.gov1.5.aaaa', applyMode: 'proposal', headline: 'You ordered the granaries filled', targetSaveId: 'A', tierChange: { from: 2, to: 3 } },
        { id: 'realm_verb.embargo.gov1.30.bbbb', applyMode: 'proposal', headline: 'You embargoed A', targetSaveId: 'A', tierChange: { from: 3, to: 2 } },
      ],
      impactDigest: [],
    };
    const section = decreesForAdvance(entryFor(record));
    // ONE cluster, no singletons — the two decrees are consolidated.
    expect(section.clusters).toHaveLength(1);
    expect(section.singletons).toHaveLength(0);
    const cluster = section.clusters[0];
    expect(cluster.relation).toBe('conflicting');
    expect(cluster.selfConflict).toBe(true);
    expect(cluster.decrees).toHaveLength(2);
    expect(cluster.conflictText).toMatch(/undone by your/);
    // The self-conflict is a reported finding.
    expect(section.findings.some(f => f.clusterId === cluster.clusterId)).toBe(true);
  });

  it('a chained pair (one decree in the other cone) consolidates without a false conflict', () => {
    const record = {
      tick: 52,
      selectedOutcomes: [
        { id: 'realm_verb.found_fort.gov1.5.cccc', applyMode: 'proposal', headline: 'You founded a fort at A', targetSaveId: 'A' },
        { id: 'realm_verb.garrison.gov1.30.dddd', applyMode: 'proposal', headline: 'You garrisoned A', targetSaveId: 'A' },
      ],
      impactDigest: [{ id: 'i_grow', headline: 'A grows behind its walls', settlementIds: ['A'] }],
    };
    const section = decreesForAdvance(entryFor(record));
    expect(section.clusters).toHaveLength(1);
    expect(section.clusters[0].selfConflict).toBe(false);
    expect(['chained', 'synergistic', 'shared']).toContain(section.clusters[0].relation);
    // The shared descendant (i_grow) is attributed once.
    expect(section.clusters[0].sharedDescendants).toEqual(['i_grow']);
  });
});

describe('decreeTracker — landing week', () => {
  it('recovers week k of N from a realm-verb outcome id', () => {
    const entry = { prevTick: 0, tick: 52, spanWeeks: 52 };
    const l = landingWeek({ id: 'realm_verb.embargo.gov1.30.bbbb' }, entry);
    expect(l.week).toBe(30);
    expect(l.label).toBe('week 30 of 52');
  });
  it('degrades honestly for a decree with no tick in its id', () => {
    const entry = { prevTick: 0, tick: 52, spanWeeks: 52 };
    const l = landingWeek({ id: 'o_generic' }, entry);
    expect(l.week).toBeNull();
    expect(l.label).toBe('during the span');
  });
});

describe('decreeTracker — reversal signal + determinism', () => {
  it('detects an opposite relationship push as a reversal', () => {
    const a = { relationshipKey: 'A::B', proposalPayload: { toType: 'ally' } };
    const b = { relationshipKey: 'A::B', proposalPayload: { toType: 'hostile' } };
    expect(reversalSignal(a, b)).toBeTruthy();
    expect(reversalSignal(a, a)).toBeNull();
  });
  it('is byte-identical on repeat', () => {
    const record = {
      tick: 52,
      selectedOutcomes: [
        { id: 'realm_verb.a.gov1.5.aaaa', applyMode: 'proposal', headline: 'A', targetSaveId: 'X', tierChange: { from: 1, to: 2 } },
        { id: 'realm_verb.b.gov1.30.bbbb', applyMode: 'proposal', headline: 'B', targetSaveId: 'X', tierChange: { from: 2, to: 1 } },
      ],
      impactDigest: [],
    };
    const one = JSON.stringify(decreesForAdvance(entryFor(record)));
    const two = JSON.stringify(decreesForAdvance(entryFor(record)));
    expect(one).toBe(two);
  });
});
