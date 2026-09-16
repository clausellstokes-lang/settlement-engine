/**
 * aiDataOutboxConvergence.test.js — the ai_data lane pin (store durability pair, item 1).
 *
 * THE DEFECT THIS CLOSES: aiSlice's nine narrative writes (generation, progression,
 * chronicle, dossier notes, pin, unpin, cosmetic rename, revert) called
 * savesService.update DIRECTLY and swallowed the error in a local catch, while every
 * OTHER writer of the same save row (applyEvent, recordSnapshot, the pin remap) went
 * through the durable outbox. Two consequences, both invisible in a green suite:
 *   (a) two ai_data writes for one save could RACE — a stale in-flight write could
 *       land after a fresher one, reverting prose the user had already replaced; and
 *   (b) an offline write was simply LOST — no park, no retry, no mirror.
 *
 * The cure routes every aiSlice ai_data write through persistSaveUpdate, so the
 * `ai_data` column gets the same column-keyed supersede + retry + durable mirror as
 * `data` and `campaign_state`. These pins drive the REAL store actions (never
 * persistSaveUpdate directly): a pin that called the shared helper itself would prove
 * the helper works, which outboxColumnGate.test.js already proves, and would stay
 * green if aiSlice regressed to a direct write.
 */
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

let updateBehavior = () => Promise.resolve();
const savesUpdate = vi.fn((...args) => updateBehavior(...args));
vi.mock('../../src/lib/saves.js', () => ({
  saves: { update: (...a) => savesUpdate(...a), isConfigured: true },
}));

import {
  OP_KIND_BARRIER,
  activateOutboxOwner,
  peekOps,
  peekPayloads,
  resetOutbox,
  setOutboxClock,
  setOutboxScheduler,
} from '../../src/store/outbox.js';
import { createAiSlice } from '../../src/store/aiSlice.js';

const SAVE_ID = 'save.ai';
const OWNER = 'owner-ai';

function installLocalStorage() {
  const data = new Map();
  globalThis.localStorage = {
    getItem: k => (data.has(String(k)) ? data.get(String(k)) : null),
    setItem: (k, v) => { data.set(String(k), String(v)); },
    removeItem: k => { data.delete(String(k)); },
    clear: () => { data.clear(); },
  };
}

/** Live (non-barrier) ops the outbox still holds. */
const liveOps = () => peekOps().filter(o => o.kind !== OP_KIND_BARRIER);

const stubSlice = (set) => ({
  settlement: null,
  savedSettlements: [],
  activeSaveId: SAVE_ID,
  creditBalance: 100,
  isElevated: () => false,
  isPremium: () => false,
  setPurchaseModalOpen: () => {},
  updateSavedSettlement: (id, partial) =>
    set(state => {
      const idx = state.savedSettlements.findIndex(s => s.id === id);
      if (idx >= 0) Object.assign(state.savedSettlements[idx], partial);
    }),
});

function makeStore() {
  const store = create(immer((...a) => ({ ...stubSlice(...a), ...createAiSlice(...a) })));
  store.setState(s => {
    s.savedSettlements = [{ id: SAVE_ID, name: 'Gatewatch', aiData: {} }];
  });
  return store;
}

beforeEach(() => {
  installLocalStorage();
  setOutboxClock(() => 2_000_000);
  setOutboxScheduler(null);
  resetOutbox();
  activateOutboxOwner(OWNER);
  savesUpdate.mockClear();
  updateBehavior = () => Promise.resolve();
});

describe('aiSlice ai_data writes ride the durable outbox lane', () => {
  test('two racing ai_data writes supersede: exactly ONE durable op survives, carrying the NEWER column set', async () => {
    updateBehavior = () => Promise.reject(new Error('offline')); // keep both ops queued to inspect
    const store = makeStore();

    await store.getState().pinNpc(SAVE_ID, 'npc_1');
    await store.getState().pinNpc(SAVE_ID, 'npc_2');

    const ops = liveOps();
    // Pre-cure this was 2 unmanaged direct writes and ZERO ops; the older one could
    // land last and drop npc_2's pin.
    expect(ops).toHaveLength(1);
    expect(ops[0].kind).toBe('ai_data');
    expect(ops[0].saveId).toBe(SAVE_ID);
    // The surviving payload is the SECOND write's, not the first's.
    expect(peekPayloads()[`${SAVE_ID}:ai_data`].aiData.pinnedNpcs).toEqual(['npc_1', 'npc_2']);
  });

  test('an ai_data write that fails its first attempt PARKS in the durable mirror instead of vanishing', async () => {
    updateBehavior = () => Promise.reject(new Error('offline'));
    const store = makeStore();

    await store.getState().pinNpc(SAVE_ID, 'npc_1');

    // Queued for retry (not dropped), and mirrored to localStorage so the write
    // survives a tab close — the half a local catch could never provide.
    expect(liveOps()[0].status).toBe('queued');
    const mirroredOps = JSON.parse(localStorage.getItem(`sf_outbox_v2:${OWNER}`));
    expect(mirroredOps.ops.map(o => o.kind)).toEqual(['ai_data']);
    const mirroredPayloads = JSON.parse(localStorage.getItem(`sf_outbox_payloads_v2:${OWNER}`));
    expect(mirroredPayloads.payloads[`${SAVE_ID}:ai_data`].aiData.pinnedNpcs).toEqual(['npc_1']);
    // The optimistic local mirror still holds the pin, so the view and the queued
    // durable write agree.
    expect(store.getState().savedSettlements[0].aiData.pinnedNpcs).toEqual(['npc_1']);
  });

  test('the ai_data write reaches the saves boundary carrying the outbox owner fence', async () => {
    const store = makeStore();

    await store.getState().pinNpc(SAVE_ID, 'npc_1');

    expect(savesUpdate).toHaveBeenCalledTimes(1);
    expect(savesUpdate.mock.calls[0][0]).toBe(SAVE_ID);
    expect(savesUpdate.mock.calls[0][1].aiData.pinnedNpcs).toEqual(['npc_1']);
    // aiSlice's old direct call passed no options at all, so an ai_data write could
    // commit under whatever account auth had rotated to.
    expect(savesUpdate.mock.calls[0][2]).toEqual({ expectedOwnerId: OWNER });
    // Success prunes the op: nothing is left queued.
    expect(liveOps()).toHaveLength(0);
  });

  test('a DIFFERENT ai_data writer (dossier notes) shares the one lane and supersedes a queued pin write', async () => {
    updateBehavior = () => Promise.reject(new Error('offline'));
    const store = makeStore();

    await store.getState().pinNpc(SAVE_ID, 'npc_1');
    // The op this write must supersede has to EXIST, or the supersede claim below is
    // vacuous — a pin writer that regressed to a direct write would leave nothing
    // queued and the rest of this case would still pass.
    expect(liveOps().map(o => o.kind)).toEqual(['ai_data']);

    await expect(store.getState().updateDossierNotes(SAVE_ID, { dmNotes: 'The gate holds.' }))
      .rejects.toThrow(/queued for retry/);

    // One column set, one op: the notes write covers the pin write's columns, so the
    // stale pin op cannot land after it.
    const ops = liveOps();
    expect(ops).toHaveLength(1);
    expect(ops[0].kind).toBe('ai_data');
    const payload = peekPayloads()[`${SAVE_ID}:ai_data`].aiData;
    expect(payload.dossierNotes.dmNotes).toBe('The gate holds.');
    // The pin the earlier write made is carried FORWARD by the newer blob (it reads
    // the already-updated local mirror), so superseding loses nothing.
    expect(payload.pinnedNpcs).toEqual(['npc_1']);
  });
});
