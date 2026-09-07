/**
 * tests/components/gatheredDocketModel.test.js — THE HELD DOCKET's read model
 * (realm directive 7 / J-D7, wave F).
 *
 * The gathered adjudication screen and the Herald's one-line pointer both read
 * through src/components/map/gatheredDocket.js, so this file pins the properties
 * the two surfaces inherit from it:
 *
 *   1. ONE TRUTH — the docket IS `worldState.proposals` filtered to pending. No
 *      second container, so a dismissed matter cannot be dropped by dismissal.
 *   2. OLDEST FIRST — tick, then createdAt, then id; and the SAME order the
 *      engine's full-auto held queue uses, proven by running both over one fixture.
 *      A drift between the two would make the manual desk and the engine rule a
 *      backlog in different orders with no test noticing.
 *   3. HELD IS EARNED, NOT GUESSED — a row counts as held only against a supplied
 *      pre-advance clock; with none, no row claims to be backlog.
 *   4. THE POINTER CANNOT LIE — its count is the count of the rows the screen
 *      lists, and its sentence is in world words.
 */

import { describe, expect, test } from 'vitest';

import {
  gatheredDecisionRows,
  heldDocketPromise,
  judgmentPointerSentence,
  pendingDecisionCount,
  pendingDecisionRows,
} from '../../src/components/map/gatheredDocket.js';
import { heldProposalIds } from '../../src/domain/worldPulse/autoAdjudication.js';

/** A minimal proposal row of the exact shape applyWorldPulse mints. */
function row(id, { status = 'pending', tick = 0, createdAt = '2026-01-01T00:00:00.000Z' } = {}) {
  return {
    id,
    status,
    tick,
    createdAt,
    updatedAt: createdAt,
    headline: `Matter ${id}`,
    summary: `What ${id} concerns`,
    severity: 0.8,
    reasons: [],
    outcome: { id: `${id}:outcome`, candidateType: 'relationship_label_change' },
  };
}

const campaignWith = (proposals, tick = 9) => ({
  id: 'camp-1',
  worldState: { tick, canonizedAt: '2026-01-01T00:00:00.000Z', proposals },
});

describe('the held docket is a view over ONE durable truth', () => {
  test('the docket is exactly the pending rows of worldState.proposals', () => {
    const campaign = campaignWith([
      row('a', { status: 'applied', tick: 1 }),
      row('b', { tick: 2 }),
      row('c', { status: 'dismissed', tick: 3 }),
      row('d', { tick: 4 }),
      row('e', { status: 'expired', tick: 5 }),
    ]);
    expect(pendingDecisionRows(campaign).map(p => p.id)).toEqual(['b', 'd']);
    expect(pendingDecisionCount(campaign)).toBe(2);
  });

  test('a campaign with no world, no proposals, or a garbage docket reads as empty', () => {
    for (const subject of [null, undefined, {}, { worldState: {} }, { worldState: { proposals: 'nope' } }]) {
      expect(pendingDecisionCount(subject)).toBe(0);
      expect(gatheredDecisionRows(subject)).toEqual([]);
    }
  });

  test('reading the docket never mutates the stored array', () => {
    const proposals = [row('z', { tick: 9 }), row('a', { tick: 1 })];
    const campaign = campaignWith(proposals);
    const before = proposals.map(p => p.id);
    pendingDecisionRows(campaign);
    gatheredDecisionRows(campaign, { sinceTick: 5 });
    expect(proposals.map(p => p.id)).toEqual(before);
  });
});

describe('OLDEST FIRST, and the same order the engine rules in', () => {
  const scrambled = [
    row('late', { tick: 7, createdAt: '2026-03-01T00:00:00.000Z' }),
    row('early-b', { tick: 2, createdAt: '2026-01-02T00:00:00.000Z' }),
    row('early-a', { tick: 2, createdAt: '2026-01-01T00:00:00.000Z' }),
    row('middle', { tick: 5, createdAt: '2026-02-01T00:00:00.000Z' }),
  ];

  test('rows sort by tick, then recorded stamp, then id', () => {
    expect(pendingDecisionRows(campaignWith(scrambled)).map(p => p.id))
      .toEqual(['early-a', 'early-b', 'middle', 'late']);
  });

  test('the order survives a JSON round trip (the persisted keys carry it)', () => {
    const reloaded = JSON.parse(JSON.stringify(campaignWith(scrambled)));
    expect(pendingDecisionRows(reloaded).map(p => p.id))
      .toEqual(['early-a', 'early-b', 'middle', 'late']);
  });

  test('the ENGINE rules the same backlog in the same order (no desk/engine drift)', () => {
    // THE CROSS-CHECK. Two independent implementations sort this backlog: the
    // manual desk (here) and the engine's full-auto held queue. If they ever
    // disagree, a DM who flips the toggle mid-docket gets a different order than
    // the screen showed them, and nothing else in the estate would notice.
    const deskOrder = pendingDecisionRows(campaignWith(scrambled)).map(p => p.id);
    const engineOrder = heldProposalIds({ proposals: scrambled }, new Set());
    expect(engineOrder).toEqual(deskOrder);
    // Non-vacuous: both really did sort (the fixture is supplied scrambled).
    expect(deskOrder).not.toEqual(scrambled.map(p => p.id));
  });

  test('the engine held queue excludes the rows THIS advance minted (they lead on their own)', () => {
    const minted = new Set(['middle']);
    const held = heldProposalIds({ proposals: scrambled }, minted);
    // The toEqual below fixes the queue's exact membership, so a queue that drifted
    // empty or re-shaped reds THERE rather than passing the exclusion that follows.
    expect(held).toEqual(['early-a', 'early-b', 'late']);
    // anchored: the toEqual immediately above pins the queue's exact membership.
    expect(held).not.toContain('middle');
  });

  test('non-pending rows are never in the engine held queue', () => {
    const mixed = [row('done', { status: 'applied', tick: 1 }), row('waiting', { tick: 3 })];
    // anchored: the equality above/below fixes the queue's exact contents, so this
    // cannot pass by the queue having drifted to empty.
    expect(heldProposalIds({ proposals: mixed }, new Set())).toEqual(['waiting']);
  });
});

describe('HELD is earned against a supplied clock, never guessed', () => {
  const proposals = [row('old', { tick: 2 }), row('fresh', { tick: 8 })];

  test('with the pre-advance clock, only rows raised at or before it are held', () => {
    const rows = gatheredDecisionRows(campaignWith(proposals), { sinceTick: 4 });
    expect(rows.map(r => [r.id, r.held])).toEqual([['old', true], ['fresh', false]]);
  });

  test('with NO clock supplied, no row claims to be backlog', () => {
    const rows = gatheredDecisionRows(campaignWith(proposals));
    expect(rows.every(r => r.held === false)).toBe(true);
    // ...and the rows are still all there, so the line above is about the CLAIM,
    // not about an empty list.
    expect(rows.map(r => r.id)).toEqual(['old', 'fresh']);
  });

  test('every row carries the in-world date it was raised', () => {
    const rows = gatheredDecisionRows(campaignWith(proposals), { sinceTick: 4 });
    expect(rows.map(r => r.raisedLabel)).toEqual(['the spring of year 1', 'the spring of year 1']);
  });
});

describe('the pointer states the number the screen shows', () => {
  test('the count is the row count, at every size', () => {
    for (const n of [0, 1, 2, 5, 13]) {
      const campaign = campaignWith(Array.from({ length: n }, (_, i) => row(`p${i}`, { tick: i })));
      expect(pendingDecisionCount(campaign)).toBe(gatheredDecisionRows(campaign).length);
      expect(judgmentPointerSentence(pendingDecisionCount(campaign)))
        .toContain(n === 0 ? 'No matter' : n === 1 ? 'One matter' : n === 13 ? '13 matters' : 'matters');
    }
  });

  test('the sentences are in world words, singular and plural', () => {
    expect(judgmentPointerSentence(1)).toBe('One matter awaits the realm’s judgment.');
    expect(judgmentPointerSentence(3)).toBe('Three matters await the realm’s judgment.');
    expect(judgmentPointerSentence(0)).toBe('No matter awaits the realm’s judgment.');
  });

  test('the exit promise names what stays on the docket', () => {
    expect(heldDocketPromise(0)).toBe('Every matter is settled.');
    expect(heldDocketPromise(1)).toContain('One matter stays on the docket');
    expect(heldDocketPromise(3)).toContain('Three matters stay on the docket');
    expect(heldDocketPromise(3)).toContain('return when time next moves');
  });
});
