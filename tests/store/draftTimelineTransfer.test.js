/**
 * draftTimelineTransfer.test.js — the draft-timeline hand-off pin (store durability
 * pair, item 2).
 *
 * THE DEFECT THIS CLOSES: an unsaved session records its checkpoints into the
 * `draftVersionHistory` sibling (recordSnapshot with no saveId). Saving to the
 * library minted the new row with `versionHistory: []` and nothing ever moved the
 * draft timeline onto it, so the identity reset dropped every snapshot a DM took
 * while building the town — the act of KEEPING a settlement destroyed its history.
 *
 * The cure lives in the store action all four create chokepoints already call
 * (setActiveSaveId -> bindActiveSaveId), not in each component, so a fifth
 * chokepoint inherits it. These pins therefore drive the STORE action, and the
 * survival case round-trips the persisted rows through JSON before reading them
 * back — an in-memory-only assertion cannot tell a real durable write from an
 * object the store happens to still be holding by reference.
 */
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

/** In-memory stand-in for the local saves backend: mints rows and merges partials. */
const rows = [];
let nextId = 1;
vi.mock('../../src/lib/saves.js', () => ({
  saves: {
    isConfigured: false,
    // Mirrors lib/saves.js: a fresh row is minted with an EMPTY timeline.
    save: vi.fn(async (entry) => {
      const id = `s-${nextId++}`;
      rows.push({ ...entry, id, versionHistory: [] });
      return id;
    }),
    update: vi.fn(async (id, partial) => {
      const row = rows.find(r => String(r.id) === String(id));
      if (row) Object.assign(row, partial);
    }),
  },
}));

// ⛔ THE DISCARDED-PROMISE SEAM. `vi.hoisted` because a `vi.mock` factory is
// hoisted above every import, so a plain top-level const would be in its TDZ.
// Both overrides default to OFF: every other arm in this file runs the real
// persist path and the real reporter.
const seam = vi.hoisted(() => ({ persistRejectsWith: null, reported: [] }));
vi.mock('../../src/store/campaignSliceShared.js', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    persistSaveUpdate: (...args) => (seam.persistRejectsWith
      ? Promise.reject(seam.persistRejectsWith)
      : actual.persistSaveUpdate(...args)),
  };
});
vi.mock('../../src/lib/errorReporter.js', async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, reportError: (error, context) => { seam.reported.push({ error, context }); } };
});

import { saves } from '../../src/lib/saves.js';
import { createSettlementSlice } from '../../src/store/settlementSlice.js';

const stubSlice = () => ({
  auth: { user: { id: 'u1' }, tier: 'wanderer', loading: false },
  config: { settType: 'town' },
  canSave: () => true,
  maxSaves: () => 3,
});

function makeStore() {
  return create(immer((...a) => ({ ...stubSlice(...a), ...createSettlementSlice(...a) })));
}

/** The create chokepoint's two steps, in the order the components run them. */
async function saveToLibrary(store) {
  const settlement = store.getState().settlement;
  const saveId = await saves.save({ name: settlement.name, tier: settlement.tier, settlement });
  await store.getState().setActiveSaveId(saveId);
  return saveId;
}

/** A reload: the rows as they came back off the wire, then a cache hydration. */
function reload(store) {
  const fromStorage = JSON.parse(JSON.stringify(rows));
  store.getState().setSavedSettlements(fromStorage);
  return fromStorage;
}

let store;
beforeEach(() => {
  rows.length = 0;
  nextId = 1;
  seam.persistRejectsWith = null;
  seam.reported.length = 0;
  vi.clearAllMocks();
  store = makeStore();
  store.setState({
    settlement: { name: 'Hightower\'s Reach', population: 4200, tier: 'town' },
  });
});

describe('draft timelines transfer at the save-to-library transition', () => {
  test('a draft snapshot survives save + reload inside the SAVE\'s timeline, and the draft sibling is emptied', async () => {
    const snap = store.getState().recordSnapshot({ kind: 'manual', label: 'Before the fire' });
    expect(store.getState().draftVersionHistory).toHaveLength(1);

    const saveId = await saveToLibrary(store);

    // The draft sibling is cleared in the same commit that stamped the id — no
    // second, unreachable history left behind.
    expect(store.getState().draftVersionHistory).toEqual([]);
    expect(store.getState().activeSaveId).toBe(saveId);

    const hydrated = reload(store);
    const saved = hydrated.find(r => r.id === saveId);
    expect(saved.versionHistory).toHaveLength(1);
    expect(saved.versionHistory[0].id).toBe(snap.after.snapshotId);
    expect(saved.versionHistory[0].label).toBe('Before the fire');
    // The snapshot carries its CONTENT across, not just its label.
    expect(saved.versionHistory[0].settlement.name).toBe('Hightower\'s Reach');
    // And the reloaded cache row is what the Versions tab reads.
    expect(store.getState().savedSettlements[0].versionHistory).toHaveLength(1);
  });

  test('every draft snapshot transfers, in order', async () => {
    store.getState().recordSnapshot({ kind: 'manual', label: 'One' });
    store.getState().recordSnapshot({ kind: 'auto-commit', label: 'Two' });
    store.getState().recordSnapshot({ kind: 'manual', label: 'Three' });

    const saveId = await saveToLibrary(store);
    const saved = reload(store).find(r => r.id === saveId);

    expect(saved.versionHistory.map(s => s.label)).toEqual(['One', 'Two', 'Three']);
  });

  test('with no draft snapshots the stamp writes NOTHING (the timeline hand-off stays dormant)', async () => {
    const saveId = await saveToLibrary(store);

    // No draft timeline, no write at all — the hand-off does not touch the row.
    expect(saves.update).not.toHaveBeenCalled();
    expect(reload(store).find(r => r.id === saveId).versionHistory).toEqual([]);
  });

  test('re-stamping between two EXISTING saves never pours one row\'s history into another', async () => {
    store.getState().recordSnapshot({ kind: 'manual', label: 'Draft checkpoint' });
    const firstId = await saveToLibrary(store);
    expect(reload(store).find(r => r.id === firstId).versionHistory).toHaveLength(1);

    // Force a non-empty draft sibling while a save is already active — the state a
    // bare "is there a draft timeline?" guard would mis-read. (recordSnapshot cannot
    // produce it any more: with activeSaveId bound it targets the SAVED timeline.)
    store.setState(s => {
      s.draftVersionHistory = [{ id: 'snap-stray', ts: 1, kind: 'manual', label: 'Stray', settlement: { name: 'Elsewhere' } }];
    });
    const secondId = await saveToLibrary(store);

    const after = reload(store);
    expect(after.find(r => r.id === secondId).versionHistory).toEqual([]);
    // The first row's timeline is untouched: still ONE snapshot, still its own.
    const first = after.find(r => r.id === firstId);
    expect(first.versionHistory).toHaveLength(1);
    expect(first.versionHistory[0].label).toBe('Draft checkpoint');
    // And the stray draft entry is still sitting in the draft sibling — refused,
    // not silently relocated.
    expect(store.getState().draftVersionHistory).toHaveLength(1);
  });

  // ── ⛔ THE DISCARDED PROMISE, CURED AT THE DOOR (2026-09-18) ────────────────
  // Every caller of setActiveSaveId discards its return value: the three
  // components call it for its STORE effect, and the post-signup SAVE_SETTLEMENT
  // handler wraps it in a try/catch that — like every try/catch around a call
  // that returns a promise — catches synchronous throws only. `persistSaveUpdate`
  // really can reject: in an unconfigured build it returns `outboxRunner(...)`
  // raw, without the `.catch` its cloud branch carries. Four call sites shared
  // that shape, so the cure belongs to the door, and these arms pin the door.
  test('a rejected timeline transfer reaches the reporter and never escapes as an unhandled rejection', async () => {
    const unhandled = [];
    const onUnhandled = (reason) => { unhandled.push(reason); };
    process.on('unhandledRejection', onUnhandled);
    try {
      seam.persistRejectsWith = new Error('the outbox runner threw');
      store.getState().recordSnapshot({ kind: 'manual', label: 'Before the fire' });
      // anchored: the transfer really is armed — without a draft timeline the door
      // returns undefined and there would be no promise to reject in the first place.
      expect(store.getState().draftVersionHistory).toHaveLength(1);

      const saveId = await saveToLibrary(store);
      // Let a genuinely unhandled rejection reach the process listener: node
      // reports one on a later turn of the loop, not on the tick that made it.
      await new Promise((resolve) => setImmediate(resolve));
      await new Promise((resolve) => setImmediate(resolve));

      expect(unhandled).toEqual([]);
      expect(seam.reported).toHaveLength(1);
      expect(seam.reported[0].error.message).toBe('the outbox runner threw');
      expect(seam.reported[0].context.kind).toBe('bindActiveSaveId.draftTimelineTransfer');
      // THE STORE EFFECT STILL LANDED. A durable write that failed must not undo
      // the binding the user can see: the id is stamped and the draft sibling was
      // cleared in the same commit, exactly as on the happy path.
      expect(store.getState().activeSaveId).toBe(saveId);
      expect(store.getState().draftVersionHistory).toEqual([]);
    } finally {
      process.off('unhandledRejection', onUnhandled);
    }
  });

  test('the door resolves false rather than rejecting, so a caller that DOES await it is safe', async () => {
    seam.persistRejectsWith = new Error('the outbox runner threw');
    store.getState().recordSnapshot({ kind: 'manual', label: 'Before the fire' });
    // The action returns the door's promise; awaiting it must not throw.
    await expect(store.getState().setActiveSaveId('s-await')).resolves.toBe(false);
    // anchored: the same call with NO draft timeline returns undefined, which is
    // the other half of the door's contract and proves this one really transferred.
    seam.persistRejectsWith = null;
    expect(store.getState().setActiveSaveId('s-await-2')).toBeUndefined();
  });
});
