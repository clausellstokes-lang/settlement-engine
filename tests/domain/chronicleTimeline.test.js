/**
 * tests/domain/chronicleTimeline.test.js — UX Phase 5 chronicle-timeline selector.
 *
 * Pins the pure merge of chronicles[] + pulseHistory[] into a tick-indexed,
 * newest-first timeline with per-tick affected node ids, plus the compareCausalState
 * pass-through and the dormancy gate.
 */
import { describe, test, expect } from 'vitest';

import {
  chronicleTimeline,
  hasTimeline,
  tickCausalDiff,
} from '../../src/domain/display/chronicleTimeline.js';

describe('chronicleTimeline — merge + ordering', () => {
  test('empty for a fresh campaign (dormancy gate)', () => {
    expect(chronicleTimeline({})).toEqual([]);
    expect(hasTimeline({})).toBe(false);
    expect(hasTimeline({ chronicles: [], pulseHistory: [] })).toBe(false);
  });

  test('merges prose + pulse records, newest tick first', () => {
    const timeline = chronicleTimeline({
      chronicles: [{ id: 'c7', tick: 7, prose: 'Bram fell.' }],
      pulseHistory: [
        { tick: 5, selectedOutcomes: [{ id: 'o5', headline: 'March', targetSaveId: 'a' }] },
        { tick: 7, selectedOutcomes: [{ id: 'o7', headline: 'Fall', targetSaveId: 'b' }], impactDigest: [{ settlementIds: ['c'] }] },
      ],
    });
    expect(timeline.map(t => t.tick)).toEqual([7, 5]); // newest first
    const t7 = timeline[0];
    expect(t7.chronicles).toHaveLength(1);
    expect(t7.headlines[0].headline).toBe('Fall');
    // Affected nodes: the outcome target (b) + the impact-digest settlement (c).
    expect(t7.affectedSettlementIds).toEqual(['b', 'c']);
    expect(hasTimeline({ chronicles: [{ tick: 7, prose: 'x' }] })).toBe(true);
  });

  test('collects power-transfer losers + population deltas as affected nodes', () => {
    const timeline = chronicleTimeline({
      pulseHistory: [{
        tick: 2,
        selectedOutcomes: [{
          id: 'o', headline: 'Coup', targetSaveId: 'a',
          populationDeltas: { d: -50 },
          powerTransfer: { losers: ['e'] },
        }],
      }],
    });
    expect(timeline[0].affectedSettlementIds).toEqual(['a', 'd', 'e']);
  });
});

describe('tickCausalDiff — compareCausalState pass-through', () => {
  test('returns [] when a snapshot is missing', () => {
    expect(tickCausalDiff(null, { scores: {} })).toEqual([]);
    expect(tickCausalDiff({ scores: {} }, null)).toEqual([]);
  });

  test('surfaces a per-variable change with an explanation', () => {
    const diff = tickCausalDiff(
      { scores: { social_trust: 0.6 }, bands: { social_trust: 'stable' } },
      { scores: { social_trust: 0.3 }, bands: { social_trust: 'strained' } },
    );
    expect(diff).toHaveLength(1);
    expect(diff[0].variable).toBe('social_trust');
    expect(diff[0].change).toBeCloseTo(-0.3);
    expect(typeof diff[0].explanation).toBe('string');
  });
});
