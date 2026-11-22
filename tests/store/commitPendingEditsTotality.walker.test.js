/**
 * commitPendingEditsTotality.walker.test.js — ITEM 1 totality guard (owner order
 * 2026-07-22: "autoresolve should resolve every pending change whatsoever").
 *
 * The pending-edit queue is the one pending-change surface with a per-kind dispatch
 * chokepoint. Every admitted item must reach a writer and return a typed outcome;
 * otherwise a vocabulary addition can look committable while doing no domain work.
 *
 * This walker (the E-B registration-manifest pattern) binds to COMMITTABLE_EDIT_KINDS
 * — the union that DEFINES the committable vocabulary — and fails if any kind lacks a
 * dispatch arm in the commit path. E-A plant (dev-verified): adding a fake kind to
 * COMMITTABLE_EDIT_KINDS with no arm reds this test; wiring an arm greens it.
 *
 * The dispatch path spans four files:
 *   • settlementSlice.commitPendingEdits — the thin public store action.
 *   • settlementPendingEditActions — the lazy, owner-stable facade.
 *   • settlementPendingEdits.applyOne — explicit rename handling plus delegation.
 *   • settlementPendingEditWriters — applyEditOp → applyTableEvent (table-event) /
 *     applyNpcOp (the eight typed NPC-lifecycle + party-hand + siding + recall ops).
 */

import { describe, expect, test } from 'vitest';
import { readFileSync } from 'node:fs';

import { COMMITTABLE_EDIT_KINDS } from '../../src/domain/pendingEdits.js';

const read = (rel) => readFileSync(new URL(`../../${rel}`, import.meta.url), 'utf8');

// The union of the transaction coordinator and its delegated domain router.
const DISPATCH_SOURCE = [
  read('src/store/settlementPendingEdits.js'),
  read('src/store/settlementPendingEditWriters.js'),
].join('\n');

describe('commitPendingEdits is TOTAL over COMMITTABLE_EDIT_KINDS (no silent drop)', () => {
  test('the vocabulary is non-empty (anti-vacuity)', () => {
    expect(COMMITTABLE_EDIT_KINDS.length).toBeGreaterThanOrEqual(11);
  });

  test('every committable kind has a live dispatch arm in the commit path', () => {
    const missing = COMMITTABLE_EDIT_KINDS.filter(kind => {
      // A live arm names the kind literally in applyOne, applyEditOp, or applyNpcOp.
      const armed = DISPATCH_SOURCE.includes(`'${kind}'`);
      return !armed;
    });
    expect(missing, `committable kinds with NO commit dispatch arm (silent-drop risk): ${missing.join(', ')}`).toEqual([]);
  });

  test('the default arm is delegated (no committable kind relies on an un-armed fall-through)', () => {
    // Pin every seam from the public action through the lazy owner guard and
    // transaction coordinator to the single domain router. This prevents a
    // facade refactor from bypassing preflight/receipts or reintroducing a bare
    // fall-through while preserving the first-paint lazy boundary.
    const slice = read('src/store/settlementSlice.js');
    expect(slice.includes('commitPendingEditsAction(set, get, selection)')).toBe(true);
    const facade = read('src/store/settlementPendingEditActions.js');
    expect(facade.includes("import('./settlementPendingEdits.js')")).toBe(true);
    expect(facade.includes('commitPendingEditScope(get, set, selection)')).toBe(true);
    expect(facade.includes('commitPendingEditScope(get, set, exactSelection)')).toBe(true);
    const coordinator = read('src/store/settlementPendingEdits.js');
    expect(coordinator.includes('applyEditOp(get, set, intent)')).toBe(true);
    expect(coordinator.includes("intent.kind === 'rename-npc'")).toBe(true);
    expect(coordinator.includes("intent.kind === 'rename-settlement'")).toBe(true);
    const helpers = read('src/store/settlementPendingEditWriters.js');
    expect(helpers.includes("edit?.kind === 'table-event'")).toBe(true);
    expect(helpers.includes('return applyNpcOp(get, set, edit)')).toBe(true);
  });
});
