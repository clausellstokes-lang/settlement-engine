/**
 * tests/domain/chronicleTimeline.test.js — the Realm Chronicle scrollback
 * read-model. Pins domain-readmodels-1: powerTransfer.losers (display NAMES,
 * minted by warDeployment via settlementNameFor) must NOT be folded into
 * affectedSettlementIds — only targetSaveId + populationDeltas keys are genuine
 * save ids (matching worldSnapshotPublic.collectAffectedIds, its public sibling).
 */

import { describe, it, expect } from 'vitest';

import { chronicleTimeline, hasTimeline } from '../../src/domain/display/chronicleTimeline.js';

describe('chronicleTimeline — affectedSettlementIds carries only real save ids', () => {
  it('does NOT fold powerTransfer.losers (display names) into affectedSettlementIds', () => {
    const pulseHistory = [{
      tick: 4,
      selectedOutcomes: [{
        id: 'o1',
        headline: 'The siege of Greymarch falls',
        summary: 'Larkfen is conquered.',
        targetSaveId: 'save-uuid-1',
        populationDeltas: { 'save-uuid-2': -40 },
        powerTransfer: { losers: ['Greymarch', 'Larkfen'] }, // DISPLAY NAMES, not ids
      }],
    }];
    const [entry] = chronicleTimeline({ pulseHistory });
    // Only the two genuine save ids — the loser NAMES never enter.
    expect(entry.affectedSettlementIds).toEqual(['save-uuid-1', 'save-uuid-2']);
    expect(entry.affectedSettlementIds).not.toContain('Greymarch');
    expect(entry.affectedSettlementIds).not.toContain('Larkfen');
    // The headline itself still carries the outcome (names live there, correctly).
    expect(entry.headlines[0].settlementIds).toEqual(['save-uuid-1', 'save-uuid-2']);
  });

  it('impactDigest settlement ids still contribute; ordering is codepoint-stable', () => {
    const pulseHistory = [{
      tick: 2,
      selectedOutcomes: [{ id: 'o', targetSaveId: 'b' }],
      impactDigest: [{ settlementIds: ['a', 'c'] }],
    }];
    const [entry] = chronicleTimeline({ pulseHistory });
    expect(entry.affectedSettlementIds).toEqual(['a', 'b', 'c']);
  });

  it('is inert on an empty/absent campaign', () => {
    expect(chronicleTimeline({})).toEqual([]);
    expect(hasTimeline({})).toBe(false);
    expect(hasTimeline({ pulseHistory: [{ tick: 1 }] })).toBe(true);
  });
});
