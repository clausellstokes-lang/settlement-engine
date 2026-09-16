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
import { beforeEach, describe, expect, test, vi } from 'vitest';
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
});
