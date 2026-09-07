/**
 * tests/store/editProseQueueSpine.test.js — R-2: authored prose through the
 * ONE staged-change spine.
 *
 * EDITABLE_FIELDS registered 25 prose paths and exactly one had a lever. This
 * file pins the queue wiring for the 16 lifecycle-sound paths (faction.desc,
 * institution.desc, the 14 settlement-root paths): admission and its typed
 * refusals, the commit round-trip through the registered applyUserEditAction
 * writer, durable persistence, snapshot undo, freshness staleness, and REGEN
 * survival executed through the real store regen paths over real pipeline
 * data (fixtures hid every faction-key instance; never again).
 *
 * It also pins the DEFERRALS as documented decisions:
 *   - the queue refuses npc / hook / historicalEvent / currentTension prose
 *     (npc: two-writer facet/reassign seams + the personality object-shape
 *     corruption; hook: phantom settlement.hooks array; history entries:
 *     regenSection('history') rerolls them away with no identity to preserve
 *     by — owner-parked), and
 *   - the history-entry destruction itself, so the breaker stays visible as
 *     a documented fact rather than a re-findable surprise.
 */

import { describe, test, expect, beforeEach, vi } from 'vitest';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

vi.mock('../../src/lib/saves.js', () => ({
  saves: { update: vi.fn(() => Promise.resolve()), isConfigured: false },
}));

import { saves } from '../../src/lib/saves.js';
import { createSettlementSlice } from '../../src/store/settlementSlice.js';
import { COMMITTABLE_EDIT_KINDS } from '../../src/domain/pendingEdits.js';
import { EDITABLE_FIELDS } from '../../src/domain/userEdits.js';
import { QUEUE_WIRED_PROSE_PATHS } from '../../src/store/settlementPendingEdits.js';
import { previewCascade } from '../../src/domain/pendingEditsPreview.js';

const stubSlice = () => ({
  auth: { user: null, tier: 'free', loading: false },
  config: { settType: 'town', culture: 'germanic', terrain: 'grassland', tradeRouteAccess: 'road' },
  institutionToggles: {}, categoryToggles: {}, goodsToggles: {}, servicesToggles: {},
  customContent: {}, importedNeighbour: null, campaigns: [], campaignsLoaded: true,
  setCampaignRegionalGraph: () => {},
  isTierAllowed: () => true, canSave: () => true, maxSaves: () => 50, setPurchaseModalOpen: () => {},
});

function makeStore() {
  return create(immer((...a) => ({ ...stubSlice(...a), ...createSettlementSlice(...a) })));
}

const SAVE_ID = 'save-prose';

/** Boot the real slice over real pipeline data and hydrate it as a library save. */
async function makeAuthoringStore(seed = 'lane-b-prose-spine') {
  const store = makeStore();
  const generated = await store.getState().generateSettlement(seed);
  expect(generated).toBeTruthy();
  store.setState(s => {
    s.phase = 'draft';
    s.activeSaveId = SAVE_ID;
    s.savedSettlements = [{
      id: SAVE_ID,
      name: s.settlement.name,
      settlement: s.settlement,
      campaignState: { phase: 'draft', eventLog: [] },
      timestamp: '2026-01-01T00:00:00.000Z',
    }];
  });
  return store;
}

async function queueAndCommit(store, payload) {
  const intent = await store.getState().queueEdit('edit-prose', payload);
  expect(intent, `queueEdit admitted ${payload.entityKind}.${payload.path}`).toBeTruthy();
  const result = await store.getState().commitPendingEdits({ intentIds: [intent.id] });
  return { intent, result };
}

beforeEach(() => { saves.update.mockClear(); });

// ── The wired-subset ratchet ─────────────────────────────────────────────────

describe('QUEUE_WIRED_PROSE_PATHS stays in lockstep with EDITABLE_FIELDS', () => {
  test('every wired path is registered, and the wired kinds cover their registry exactly', () => {
    // For the three queue-wired kinds the wired set EQUALS the registry: a new
    // registered path for these kinds must force an explicit wiring decision
    // here instead of silently staying lever-less.
    for (const kind of ['faction', 'institution', 'settlement']) {
      expect([...QUEUE_WIRED_PROSE_PATHS[kind]].sort())
        .toEqual([...EDITABLE_FIELDS[kind]].sort());
    }
  });

  test('the non-queue complement is exactly 9 paths: the 8 documented hazards plus the card-served npc secret', () => {
    const wiredKinds = new Set(Object.keys(QUEUE_WIRED_PROSE_PATHS));
    const deferred = [];
    for (const [kind, paths] of Object.entries(EDITABLE_FIELDS)) {
      if (wiredKinds.has(kind)) continue;
      for (const path of paths) deferred.push(`${kind}.${path}`);
    }
    expect(deferred.sort()).toEqual([
      'currentTension.description',       // history reroll destroys entries (owner-parked)
      'historicalEvent.description',      // same breaker
      'historicalEvent.summary',          // same breaker
      'hook.description',                 // phantom settlement.hooks array
      'hook.stakes',                      // phantom settlement.hooks array
      'npc.goal.short',                   // edit-npc goal facet bypasses _userEdits
      'npc.personality',                  // object shape + temperament-facet spread corruption
      'npc.role',                         // reassign-npc overwrites with no record sync
      'npc.secret.what',                  // already served by the inline card path
    ].sort());
  });

  test('edit-prose is a committable kind', () => {
    expect(COMMITTABLE_EDIT_KINDS).toContain('edit-prose');
  });
});

// ── Admission + typed refusals ───────────────────────────────────────────────

describe('edit-prose admission', () => {
  let store;
  beforeEach(async () => { store = await makeAuthoringStore(); });

  test('deferred entity kinds are refused at the queue (npc / hook / history entries)', async () => {
    for (const payload of [
      { entityKind: 'npc', entityIndex: 0, path: 'goal.short', value: 'Authored.' },
      { entityKind: 'npc', entityIndex: 0, path: 'personality', value: 'Authored.' },
      { entityKind: 'hook', entityIndex: 0, path: 'description', value: 'Authored.' },
      { entityKind: 'historicalEvent', entityIndex: 0, path: 'description', value: 'Authored.' },
      { entityKind: 'currentTension', entityIndex: 0, path: 'description', value: 'Authored.' },
    ]) {
      expect(await store.getState().queueEdit('edit-prose', payload)).toBeNull();
    }
    expect(store.getState().pendingEditsQueue || []).toEqual([]);
  });

  test('unregistered paths, empty values, oversize values, and bad targets are refused', async () => {
    const queue = (payload) => store.getState().queueEdit('edit-prose', payload);
    expect(await queue({ entityKind: 'faction', entityIndex: 0, path: 'power', value: 'x' })).toBeNull();
    expect(await queue({ entityKind: 'settlement', entityIndex: -1, path: 'arrivalScene', value: '   ' })).toBeNull();
    expect(await queue({ entityKind: 'settlement', entityIndex: -1, path: 'arrivalScene', value: 'y'.repeat(4001) })).toBeNull();
    expect(await queue({ entityKind: 'faction', entityIndex: 99, path: 'desc', value: 'No such faction.' })).toBeNull();
    expect(await queue({ entityKind: 'faction', path: 'desc', value: 'Index required.' })).toBeNull();
  });

  test('a value identical to the current text is refused as no-effect', async () => {
    const current = store.getState().settlement.powerStructure.factions[0].desc;
    expect(await store.getState().queueEdit('edit-prose', {
      entityKind: 'faction', entityIndex: 0, path: 'desc', value: current,
    })).toBeNull();
  });

  test('an admitted intent carries the authoring policy envelope', async () => {
    const intent = await store.getState().queueEdit('edit-prose', {
      entityKind: 'faction', entityIndex: 0, path: 'desc', value: 'Hand-written faction charter.',
    });
    expect(intent.kindClass).toBe('authoring');
    expect(intent.executionPolicy).toBe('immediate');
    expect(intent.applyAdapterId).toBe('settlement.edit-prose');
    expect(intent.undoPolicy).toBe('snapshot');
    expect(intent.targetRef).toMatchObject({ type: 'faction', id: '0' });
    // The cascade preview projection accepts the intent without throwing.
    const preview = previewCascade(store.getState().settlement, [intent]);
    expect(preview).toBeTruthy();
  });
});

// ── Commit round-trip, persistence, undo ─────────────────────────────────────

describe('edit-prose commit round-trip (one per wired entity kind)', () => {
  let store;
  beforeEach(async () => { store = await makeAuthoringStore(); });

  test('faction.desc: commit applies through applyUserEditAction, records authorship, persists', async () => {
    const before = store.getState().settlement.powerStructure.factions[0].desc;
    const { result } = await queueAndCommit(store, {
      entityKind: 'faction', entityIndex: 0, path: 'desc', value: 'They answer to no crown.',
    });
    expect(result.status).toBe('applied');
    const faction = store.getState().settlement.powerStructure.factions[0];
    expect(faction.desc).toBe('They answer to no crown.');
    expect(faction._authored).toBe(true);
    expect(faction._userEdits.desc.originalValue).toBe(before);
    // The queue is drained and the receipt is on record.
    expect(store.getState().pendingEditsQueue).toEqual([]);
    const receipt = store.getState().pendingEditReceipts.at(-1);
    expect(receipt).toMatchObject({ kind: 'edit-prose', status: 'applied' });
    // Durable half: the writer's own persist ran against the hydrated save.
    expect(saves.update).toHaveBeenCalled();
    const persisted = store.getState().savedSettlements[0].settlement
      .powerStructure.factions[0];
    expect(persisted.desc).toBe('They answer to no crown.');
  });

  test('institution.desc: commit applies and records authorship', async () => {
    const { result } = await queueAndCommit(store, {
      entityKind: 'institution', entityIndex: 0, path: 'desc', value: 'Rebuilt after the fire of 402.',
    });
    expect(result.status).toBe('applied');
    const inst = store.getState().settlement.institutions[0];
    expect(inst.desc).toBe('Rebuilt after the fire of 402.');
    expect(inst._userEdits.desc).toBeTruthy();
  });

  test('settlement root: arrival scene, founding reason, and first-survey safety all commit', async () => {
    for (const [path, value] of [
      ['arrivalScene', 'You smell the tanneries before you see the walls.'],
      ['history.founding.reason', 'A toll bridge nobody remembers authorizing.'],
      ['economicState.safetyProfile.safetyDesc', 'Safe by daylight; the docks after dark are another town.'],
    ]) {
      const { result } = await queueAndCommit(store, {
        entityKind: 'settlement', entityIndex: -1, path, value,
      });
      expect(result.status, `${path} applied`).toBe('applied');
    }
    const s = store.getState().settlement;
    expect(s.arrivalScene).toBe('You smell the tanneries before you see the walls.');
    expect(s.history.founding.reason).toBe('A toll bridge nobody remembers authorizing.');
    expect(s.economicState.safetyProfile.safetyDesc)
      .toBe('Safe by daylight; the docks after dark are another town.');
    expect(Object.keys(s._userEdits).sort()).toEqual([
      'arrivalScene',
      'economicState.safetyProfile.safetyDesc',
      'history.founding.reason',
    ]);
  });

  test('the batch undo token genuinely restores the pre-edit text', async () => {
    const before = store.getState().settlement.arrivalScene;
    const { result } = await queueAndCommit(store, {
      entityKind: 'settlement', entityIndex: -1, path: 'arrivalScene', value: 'Authored arrival.',
    });
    expect(result.undoToken).toMatchObject({ kind: 'snapshot', saveId: SAVE_ID });
    expect(store.getState().settlement.arrivalScene).toBe('Authored arrival.');
    const reverted = store.getState().revertToSnapshot({
      saveId: result.undoToken.saveId,
      snapshotId: result.undoToken.snapshotId,
    });
    expect(reverted).toBeTruthy();
    expect(store.getState().settlement.arrivalScene).toBe(before);
  });

  test('a stale review is refused, then re-review re-arms it (freshness spine)', async () => {
    const intent = await store.getState().queueEdit('edit-prose', {
      entityKind: 'faction', entityIndex: 0, path: 'desc', value: 'Written before the world moved.',
    });
    expect(intent).toBeTruthy();
    // Any settlement mutation invalidates the conservative source fingerprint.
    store.setState(s => { s.settlement.population = (s.settlement.population || 0) + 1; });
    const staleResult = await store.getState().commitPendingEdits({ intentIds: [intent.id] });
    expect(staleResult.ok).toBe(false);
    expect(staleResult.failed[0]).toMatchObject({ status: 'stale', reason: 'source_changed' });
    expect(store.getState().settlement.powerStructure.factions[0].desc)
      .not.toBe('Written before the world moved.');
    // Review again against the current world, then commit for real.
    const refresh = await store.getState().refreshPendingEdits({ intentIds: [intent.id] });
    expect(refresh.ok).toBe(true);
    const committed = await store.getState().commitPendingEdits({ intentIds: [intent.id] });
    expect(committed.status).toBe('applied');
    expect(store.getState().settlement.powerStructure.factions[0].desc)
      .toBe('Written before the world moved.');
  });
});

// ── Regen survival — the actual store regen paths ────────────────────────────

describe('committed prose survives the real regen paths', () => {
  test("regenSection('npcs') replaces the roster but not authored faction/institution/root prose", async () => {
    const store = await makeAuthoringStore('lane-b-regen-npcs');
    await queueAndCommit(store, {
      entityKind: 'faction', entityIndex: 0, path: 'desc', value: 'Authored charter.',
    });
    await queueAndCommit(store, {
      entityKind: 'institution', entityIndex: 0, path: 'desc', value: 'Authored institution note.',
    });
    await queueAndCommit(store, {
      entityKind: 'settlement', entityIndex: -1, path: 'arrivalScene', value: 'Authored arrival.',
    });

    await store.getState().regenSection('npcs');

    const s = store.getState().settlement;
    expect(s.powerStructure.factions[0].desc).toBe('Authored charter.');
    expect(s.powerStructure.factions[0]._userEdits.desc).toBeTruthy();
    expect(s.institutions[0].desc).toBe('Authored institution note.');
    expect(s.arrivalScene).toBe('Authored arrival.');
    expect(s._userEdits.arrivalScene).toBeTruthy();
  });

  test("regenSection('history') restores authored root history prose — and, as documented, NOT authored entries", async () => {
    const store = await makeAuthoringStore('lane-b-regen-history');
    await queueAndCommit(store, {
      entityKind: 'settlement', entityIndex: -1, path: 'history.founding.reason', value: 'Authored founding reason.',
    });
    await queueAndCommit(store, {
      entityKind: 'settlement', entityIndex: -1, path: 'history.historicalCharacter', value: 'Authored character paragraph.',
    });

    // The documented deferral, exercised: currentTension.description is
    // registered and the DIRECT writer accepts it, but a history reroll
    // destroys the entry — which is exactly why the queue refuses to wire it.
    expect(store.getState().settlement.history.currentTensions.length).toBeGreaterThan(0);
    store.getState().applyUserEditAction('currentTension', 0, 'description', 'Authored tension.');
    expect(store.getState().settlement.history.currentTensions[0].description).toBe('Authored tension.');

    await store.getState().regenSection('history');

    const s = store.getState().settlement;
    expect(s.history.founding.reason).toBe('Authored founding reason.');
    expect(s.history.historicalCharacter).toBe('Authored character paragraph.');
    // The breaker, pinned as a fact: the authored entry did not survive.
    const survivingTension = (s.history.currentTensions || [])
      .find(t => t?.description === 'Authored tension.');
    expect(survivingTension, 'documented deferral: authored entries reroll away').toBeUndefined();
  });
});
