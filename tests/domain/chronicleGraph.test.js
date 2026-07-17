/**
 * tests/domain/chronicleGraph.test.js — THE CHRONICLE causal-link primitive pins.
 *
 * Pins (design docs/DESIGN_CHRONICLE_LEGIBILITY.md §2, §7):
 *  · TAXONOMY: the leaf's self-contained DRAMA_CLASSES equals the engine's
 *    canonical DRAMA_CLASS_PRIORITY (drift caught without runtime coupling).
 *  · DETERMINISM: same record ⇒ byte-identical nodes/threads (JSON-stable).
 *  · SPAN-SCALING: the span label + altitude set scale by week count.
 *  · BOUNDED: connected components never exceed the node count.
 *  · DURABLE-SOURCING (structural): the chronicle display leaves NEVER import the
 *    capped wizardNews feed nor the wizardNews-reading grounding builder (§6).
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

import { describe, it, expect } from 'vitest';

import {
  DRAMA_CLASSES, spanLabelForWeeks, altitudesForSpan, entityKeysOf, dramaClassForNode,
  isDecreeNode, nodesFromRecord, connectedComponents, dominantClass, advanceEntries,
} from '../../src/domain/display/chronicleGraph.js';
import { DRAMA_CLASS_PRIORITY } from '../../src/domain/worldPulse/decisionTier.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SRC = resolve(__dirname, '../../src/domain/display');

describe('chronicleGraph — taxonomy pin (no runtime coupling)', () => {
  it('DRAMA_CLASSES equals the engine canonical DRAMA_CLASS_PRIORITY', () => {
    expect([...DRAMA_CLASSES]).toEqual([...DRAMA_CLASS_PRIORITY]);
  });
});

describe('chronicleGraph — span scaling (§1)', () => {
  it('labels a span by whole-week count', () => {
    expect(spanLabelForWeeks(1)).toBe('week');
    expect(spanLabelForWeeks(4)).toBe('month');
    expect(spanLabelForWeeks(13)).toBe('season');
    expect(spanLabelForWeeks(52)).toBe('year');
    expect(spanLabelForWeeks(26)).toBe('year'); // a catch-up raw week count buckets honestly
  });
  it('grows the default altitude set with the span (week ⇒ events only; year ⇒ full pyramid)', () => {
    expect(altitudesForSpan('week')).toEqual(['events']);
    expect(altitudesForSpan('month')).toEqual(['threads', 'events']);
    expect(altitudesForSpan('season')).toEqual(['chapters', 'threads', 'events']);
    expect(altitudesForSpan('year')).toEqual(['headline', 'chapters', 'threads', 'events']);
  });
});

describe('chronicleGraph — nodes + inferred causal graph (§2)', () => {
  const record = {
    tick: 52,
    selectedOutcomes: [
      { id: 'o_war', candidateType: 'stressor_birth_siege', severity: 0.8, headline: 'The siege of Ashford', stressor: { id: 's1', type: 'siege', affectedSettlementIds: ['A'] }, targetSaveId: 'A' },
      { id: 'o_famine', candidateType: 'stressor_birth_famine', severity: 0.5, headline: 'Famine grips Ashford', targetSaveId: 'A' },
      { id: 'o_far', candidateType: 'stressor_birth_market_shock', severity: 0.3, headline: 'A distant market shock', targetSaveId: 'Z' },
    ],
    impactDigest: [],
  };

  it('types nodes by drama class and collects entity keys', () => {
    const nodes = nodesFromRecord(record);
    expect(nodes.map(n => n.nodeId)).toEqual(['o_famine', 'o_far', 'o_war']); // sorted by id
    const war = nodes.find(n => n.nodeId === 'o_war');
    expect(war.dramaClass).toBe('war');
    expect(entityKeysOf(record.selectedOutcomes[0])).toContain('A');
  });

  it('links co-target nodes into one thread and isolates the distant one', () => {
    const nodes = nodesFromRecord(record);
    const comps = connectedComponents(nodes);
    // Ashford war + famine share settlement A ⇒ one component; the distant shock is its own.
    const sizes = comps.map(c => c.length).sort((a, b) => a - b);
    expect(sizes).toEqual([1, 2]);
    const big = comps.find(c => c.length === 2);
    expect(dominantClass(big)).toBe('war'); // war outranks economic_shock
  });

  it('never produces more components than nodes (bounded)', () => {
    const nodes = nodesFromRecord(record);
    expect(connectedComponents(nodes).length).toBeLessThanOrEqual(nodes.length);
  });

  it('flags applied DM decrees (applyMode:proposal / proposalPayload)', () => {
    expect(isDecreeNode({ applyMode: 'proposal' })).toBe(true);
    expect(isDecreeNode({ proposalPayload: { kind: 'relationship_label_change' } })).toBe(true);
    expect(isDecreeNode({ applyMode: 'auto' })).toBe(false);
  });
});

describe('chronicleGraph — determinism (§7)', () => {
  it('is a pure function of its input (byte-identical repeat)', () => {
    const record = {
      tick: 13,
      selectedOutcomes: [
        { id: 'b', headline: 'B', targetSaveId: 'X', reasons: ['r'] },
        { id: 'a', headline: 'A', targetSaveId: 'X' },
      ],
      impactDigest: [{ id: 'i', headline: 'I', settlementIds: ['X'] }],
    };
    const a = JSON.stringify(connectedComponents(nodesFromRecord(record)));
    const b = JSON.stringify(connectedComponents(nodesFromRecord(record)));
    expect(a).toBe(b);
  });

  it('derives per-advance spans from tick deltas (span not stored on the record)', () => {
    const ws = { pulseHistory: [{ tick: 13 }, { tick: 65 }] };
    const entries = advanceEntries(ws);
    expect(entries[0].tick).toBe(65);
    expect(entries[0].spanWeeks).toBe(52); // 65 - 13 ⇒ a year
    expect(entries[0].spanLabel).toBe('year');
    expect(entries[1].spanWeeks).toBe(13); // 13 - 0 ⇒ a season
  });
});

describe('chronicleGraph — durable sourcing (§6, structural)', () => {
  it('the chronicle display leaves never import the capped wizardNews feed nor its grounding builder', () => {
    for (const leaf of ['chronicleGraph.js', 'chronicleReadModel.js', 'decreeTracker.js']) {
      const src = readFileSync(resolve(SRC, leaf), 'utf8');
      expect(src, `${leaf} must not import region/wizardNews`).not.toMatch(/region\/wizardNews/);
      expect(src, `${leaf} must not import the wizardNews-reading chronicle grounding`).not.toMatch(/worldPulse\/chronicle\.js/);
    }
  });
});
