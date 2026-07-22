/**
 * commitPendingEditsTotality.walker.test.js — ITEM 1 totality guard (owner order
 * 2026-07-22: "autoresolve should resolve every pending change whatsoever").
 *
 * The pending-edit queue is the one pending-change surface with a per-kind dispatch
 * chokepoint (commitPendingEdits). It clears ALL-OR-NOTHING on commit, so a
 * committable kind that reaches the dispatcher's default arm WITHOUT a live handler
 * (applyNpcOp's `else { return; }`) is SILENTLY DROPPED while the commit reports
 * success. queueEdit already refuses non-committable kinds at the enqueue seam, but
 * nothing structurally proved that every kind admitted THERE has a live arm HERE.
 *
 * This walker (the E-B registration-manifest pattern) binds to COMMITTABLE_EDIT_KINDS
 * — the union that DEFINES the committable vocabulary — and fails if any kind lacks a
 * dispatch arm in the commit path. E-A plant (dev-verified): adding a fake kind to
 * COMMITTABLE_EDIT_KINDS with no arm reds this test; wiring an arm greens it.
 *
 * The dispatch path spans two files:
 *   • settlementSlice.commitPendingEdits — the switch (rename-npc / rename-settlement
 *     explicit; every other committable kind routes through the default arm).
 *   • settlementRenameHelpers — applyEditOp → applyTableEvent (table-event) /
 *     applyNpcOp (the eight typed NPC-lifecycle + party-hand + siding + recall ops).
 */

import { describe, expect, test } from 'vitest';
import { readFileSync } from 'node:fs';

import { COMMITTABLE_EDIT_KINDS } from '../../src/domain/pendingEdits.js';

const read = (rel) => readFileSync(new URL(`../../${rel}`, import.meta.url), 'utf8');

// The union of the commit-dispatch source: the slice switch + the delegated router.
const DISPATCH_SOURCE = [
  read('src/store/settlementSlice.js'),
  read('src/store/settlementRenameHelpers.js'),
].join('\n');

describe('commitPendingEdits is TOTAL over COMMITTABLE_EDIT_KINDS (no silent drop)', () => {
  test('the vocabulary is non-empty (anti-vacuity)', () => {
    expect(COMMITTABLE_EDIT_KINDS.length).toBeGreaterThanOrEqual(11);
  });

  test('every committable kind has a live dispatch arm in the commit path', () => {
    const missing = COMMITTABLE_EDIT_KINDS.filter(kind => {
      // A live arm names the kind literally: `case 'kind'` in the slice switch, or
      // `k === 'kind'` / `kind === 'kind'` in applyNpcOp / applyEditOp.
      const armed = DISPATCH_SOURCE.includes(`'${kind}'`);
      return !armed;
    });
    expect(missing, `committable kinds with NO commit dispatch arm (silent-drop risk): ${missing.join(', ')}`).toEqual([]);
  });

  test('the default arm is delegated (no committable kind relies on an un-armed fall-through)', () => {
    // commitPendingEdits routes its default to applyEditOp — the single delegated
    // router — so a committable kind never lands on a bare no-op. Pin the wiring.
    const slice = read('src/store/settlementSlice.js');
    expect(slice.includes('applyEditOp(get, set, edit)')).toBe(true);
    const helpers = read('src/store/settlementRenameHelpers.js');
    expect(helpers.includes("edit?.kind === 'table-event'")).toBe(true);
    expect(helpers.includes('return applyNpcOp(get, set, edit)')).toBe(true);
  });
});
