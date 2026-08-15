/**
 * pendingEditTransaction.test.js — G-1 queue truthfulness.
 *
 * These pins cover the contract the old all-or-nothing-looking loop did not have:
 * complete admission, stable targets, freshness, exact ownership, retained
 * per-item failure, receipts, and same-intent idempotency.
 */

import { beforeEach, describe, expect, test, vi } from 'vitest';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

vi.mock('../../src/lib/saves.js', () => ({
  saves: { update: vi.fn(() => Promise.resolve()), isConfigured: false },
}));

import { createSettlementSlice } from '../../src/store/settlementSlice.js';
import { buildTableEffect, validateTableEvent } from '../../src/domain/tableLedger.js';
import { previewCascade } from '../../src/domain/pendingEditsPreview.js';
import {
  pendingEditOwnerScope,
  selectPendingEditOwnerScope,
} from '../../src/domain/pendingEditIntents.js';

const stubSlice = () => ({
  auth: { user: null, tier: 'free', loading: false },
  config: { settType: 'town' },
  institutionToggles: {},
  categoryToggles: {},
  goodsToggles: {},
  servicesToggles: {},
  customContent: {},
  importedNeighbour: null,
  campaigns: [],
  campaignsLoaded: true,
  isTierAllowed: () => true,
  canSave: () => true,
  maxSaves: () => 50,
  setPurchaseModalOpen: () => {},
});

const makeStore = () => create(immer((...args) => ({
  ...stubSlice(...args),
  ...createSettlementSlice(...args),
})));

function settlement() {
  return {
    id: 'town.gullbridge',
    name: 'Gullbridge',
    tier: 'town',
    population: 900,
    npcs: [
      {
        id: 'npc.ada',
        name: 'Ada',
        role: 'Guildmaster',
        personality: { dominant: 'honest' },
        goal: { short: 'profit_from_change' },
      },
      {
        id: 'npc.bram',
        name: 'Bram',
        role: 'Scout',
        whereabouts: { state: 'traveling', placeId: 'town.east' },
      },
    ],
    stressors: [],
    institutions: [],
    powerStructure: { factions: [], conflicts: [] },
    history: { historicalEvents: [], currentTensions: [] },
  };
}

function load(store, phase = 'draft') {
  store.setState((state) => {
    state.settlement = settlement();
    state.phase = phase;
    state.systemState = {};
    state.eventLog = [];
    state.activeSaveId = null;
  });
}

function tableObligation() {
  const validated = validateTableEvent({
    kind: 'obligation',
    magnitude: 'moderate',
    targets: { ref: 'debt', label: 'A debt' },
    flavor: 'The town promised repayment.',
  });
  expect(validated.ok).toBe(true);
  return {
    record: validated.record,
    directive: buildTableEffect(validated.record),
  };
}

describe('pending-edit transaction spine', () => {
  let store;

  beforeEach(() => {
    store = makeStore();
    load(store);
  });

  test('resolves a legacy index once, then retains only the NPC stable id', async () => {
    const intent = await store.getState().queueEdit('edit-npc', {
      npcIndex: 1,
      facetKind: 'goal',
      value: 'restore_order',
    });

    expect(intent).not.toBeNull();
    expect(intent.payload).toEqual({
      npcId: 'npc.bram',
      facetKind: 'goal',
      value: 'restore_order',
    });
    expect(intent.payload).not.toHaveProperty('npcIndex');
    expect(intent.targetRef).toMatchObject({ type: 'npc', id: 'npc.bram' });
    expect(intent.ownerRef).toMatchObject({ scope: 'draft', id: 'draft:town.gullbridge' });
    expect(intent.sourceFingerprint).toMatch(/^pef:/);
    expect(intent).toMatchObject({
      kindClass: 'authoring',
      scope: 'save',
      executionPolicy: 'immediate',
      deliveryPolicy: 'direct',
      previewPolicy: 'cascade',
      applyAdapterId: 'npc.edit-facet',
      recoveryPolicy: 'review-and-retry',
      undoPolicy: 'snapshot',
      affectedSaveIds: [],
      availability: { status: 'available', reason: null },
    });
    expect(intent.preconditions).toEqual([{
      targetRef: intent.targetRef,
      baseRevision: intent.baseRevision,
      sourceFingerprint: intent.sourceFingerprint,
    }]);
  });

  test('detaches and canonicalizes nested table payloads at admission', async () => {
    const input = tableObligation();
    input.directive.event.payload.unrecognizedMechanicalField = 99;
    const intent = await store.getState().queueEdit('table-event', input);

    expect(intent).not.toBeNull();
    expect(intent.payload.directive.event.payload).not.toHaveProperty(
      'unrecognizedMechanicalField',
    );
    expect(Object.isFrozen(intent.payload.directive.event.payload)).toBe(true);

    input.record.flavor = 'Changed after review.';
    input.directive.event.payload.severity = 1;
    expect(intent.payload.record.flavor).toBe('The town promised repayment.');
    expect(intent.payload.directive.event.payload.severity).toBe(0.5);
  });

  test('refuses incomplete payloads and unavailable targets before queue entry', async () => {
    const invalid = [
      ['rename-npc', { npcId: 'npc.ada' }],
      ['rename-settlement', { newName: '  ' }],
      ['edit-npc', { npcId: 'npc.ada', facetKind: 'hairColor', value: 'blue' }],
      ['edit-npc', {
        npcId: 'npc.ada',
        facetKind: 'goal',
        value: 'arbitrary_internal_token',
      }],
      ['reassign-npc', { npcId: 'npc.ada', target: {} }],
      ['stasis-npc', { npcId: 'npc.ada', reason: 'vacation' }],
      ['return-npc', { npcId: 'npc.ada' }],
      ['ransom-npc', { npcId: 'npc.ada' }],
      ['rescue-npc', { npcId: 'npc.ada' }],
      ['champion-npc', { npcId: 'npc.ada' }],
      ['recall-npc', { npcId: 'npc.ada' }],
      ['table-event', {}],
      ['table-event', (() => {
        const payload = tableObligation();
        payload.directive.event.payload.severity = 0.8;
        return payload;
      })()],
    ];

    for (const [kind, payload] of invalid) {
      expect(await store.getState().queueEdit(kind, payload), kind).toBeNull();
    }
    expect(store.getState().pendingEditsQueue).toEqual([]);
  });

  test('save switching hides prior work, recovers it on return, and drops ownerless legacy work', async () => {
    const saveA = {
      id: 'save-a',
      settlement: settlement(),
      campaignState: { phase: 'draft', eventLog: [] },
      timestamp: '2026-07-24T10:00:00.000Z',
    };
    const saveB = {
      id: 'save-b',
      settlement: {
        ...settlement(),
        id: 'town.emberfall',
        name: 'Emberfall',
      },
      campaignState: { phase: 'draft', eventLog: [] },
      timestamp: '2026-07-24T11:00:00.000Z',
    };
    store.setState((state) => {
      state.savedSettlements = [saveA, saveB];
    });
    store.getState().hydrateFromSave(saveA);
    const owned = await store.getState().queueEdit('rename-npc', {
      npcId: 'npc.ada',
      newName: 'Adela',
    });
    store.setState((state) => {
      state.pendingEditsQueue.push({
        id: 'legacy-ownerless',
        kind: 'rename-settlement',
        payload: { newName: 'Legacy' },
        reverted: false,
      });
    });

    store.getState().hydrateFromSave(saveB);
    const scopeB = pendingEditOwnerScope(store.getState());
    expect(selectPendingEditOwnerScope(
      store.getState().pendingEditsQueue,
      scopeB.ownerKey,
    )).toEqual([]);
    expect(store.getState().pendingEditsQueue.map((intent) => intent.id))
      .toEqual([owned.id]);
    const queueOnB = JSON.stringify(store.getState().pendingEditsQueue);
    const receiptsOnB = JSON.stringify(store.getState().pendingEditReceipts);
    expect((await store.getState().commitPendingEdits({ intentIds: [owned.id] })).status)
      .toBe('empty');
    expect((await store.getState().refreshPendingEdits({ intentIds: [owned.id] })).status)
      .toBe('empty');
    expect(await store.getState().revertPendingEdits({ intentIds: [owned.id] }))
      .toEqual({ ok: false, discarded: [] });
    expect(store.getState().revertSingleEdit(owned.id)).toBe(false);
    expect(JSON.stringify(store.getState().pendingEditsQueue)).toBe(queueOnB);
    expect(JSON.stringify(store.getState().pendingEditReceipts)).toBe(receiptsOnB);

    store.getState().hydrateFromSave(saveA);
    const scopeA = pendingEditOwnerScope(store.getState());
    expect(selectPendingEditOwnerScope(
      store.getState().pendingEditsQueue,
      scopeA.ownerKey,
    ).map((intent) => intent.id)).toEqual([owned.id]);
  });

  test('an owner switch during the lazy action boundary cancels admission and commit', async () => {
    const saveA = {
      id: 'save-a',
      settlement: settlement(),
      campaignState: { phase: 'draft', eventLog: [] },
      timestamp: '2026-07-24T10:00:00.000Z',
    };
    const saveB = {
      id: 'save-b',
      settlement: {
        ...settlement(),
        id: 'town.emberfall',
        name: 'Emberfall',
      },
      campaignState: { phase: 'draft', eventLog: [] },
      timestamp: '2026-07-24T11:00:00.000Z',
    };
    store.setState((state) => {
      state.savedSettlements = [saveA, saveB];
    });
    store.getState().hydrateFromSave(saveA);

    const admission = store.getState().queueEdit('rename-npc', {
      npcId: 'npc.ada',
      newName: 'Adela',
    });
    store.getState().hydrateFromSave(saveB);
    expect(await admission).toBeNull();
    expect(store.getState().pendingEditsQueue).toEqual([]);

    store.getState().hydrateFromSave(saveA);
    const intent = await store.getState().queueEdit('rename-npc', {
      npcId: 'npc.ada',
      newName: 'Adela',
    });
    const commit = store.getState().commitPendingEdits({
      intentIds: [intent.id],
    });
    store.getState().hydrateFromSave(saveB);

    expect(await commit).toMatchObject({
      ok: false,
      status: 'owner-changed',
      applied: [],
    });
    expect(store.getState().settlement.name).toBe('Emberfall');
    expect(store.getState().settlement.npcs[0].name).toBe('Ada');
    expect(store.getState().pendingEditsQueue.map((entry) => entry.id))
      .toEqual([intent.id]);
  });

  test('commit and discard affect only the exact ids the caller names', async () => {
    const rename = await store.getState().queueEdit('rename-npc', {
      npcId: 'npc.ada',
      newName: 'Adela',
    });
    const stasis = await store.getState().queueEdit('stasis-npc', {
      npcId: 'npc.bram',
      reason: 'journey',
    });

    const committed = await store.getState().commitPendingEdits({ intentIds: [rename.id] });
    expect(committed).toMatchObject({ ok: true, status: 'applied', applied: [rename.id] });
    expect(store.getState().settlement.npcs[0].name).toBe('Adela');
    expect(store.getState().settlement.npcs[1].stasis).toBeUndefined();
    expect(store.getState().pendingEditsQueue.map((intent) => intent.id)).toEqual([stasis.id]);

    const discarded = await store.getState().revertPendingEdits({ intentIds: [stasis.id] });
    expect(discarded).toEqual({ ok: true, discarded: [stasis.id] });
    expect(store.getState().pendingEditsQueue).toEqual([]);
  });

  test('a changed source blocks apply and retains the stale intent with a receipt', async () => {
    const intent = await store.getState().queueEdit('rename-npc', {
      npcId: 'npc.ada',
      newName: 'Adela',
    });
    store.setState((state) => {
      state.settlement.population += 1;
    });

    const result = await store.getState().commitPendingEdits({ intentIds: [intent.id] });
    expect(result).toMatchObject({
      ok: false,
      status: 'failed',
      failed: [{ intentId: intent.id, status: 'stale', reason: 'source_changed' }],
    });
    expect(store.getState().settlement.npcs[0].name).toBe('Ada');
    expect(store.getState().pendingEditsQueue[0]).toMatchObject({
      id: intent.id,
      status: 'stale',
      failureReason: 'source_changed',
    });
    expect(store.getState().pendingEditReceipts.at(-1)).toMatchObject({
      intentId: intent.id,
      status: 'stale',
      reason: 'source_changed',
    });
  });

  test('mixed success and refusal are separately receipted; failure remains retryable', async () => {
    const rename = await store.getState().queueEdit('rename-npc', {
      npcId: 'npc.ada',
      newName: 'Adela',
    });
    const table = await store.getState().queueEdit('table-event', tableObligation());
    store.setState((state) => {
      state.applyEvent = () => ({ ok: false, veto: { code: 'blocked_at_table' } });
    });

    const first = await store.getState().commitPendingEdits({
      intentIds: [rename.id, table.id],
    });
    expect(first.status).toBe('partial');
    expect(first.applied).toEqual([rename.id]);
    expect(first.failed).toEqual([{
      intentId: table.id,
      status: 'failed',
      reason: 'blocked_at_table',
    }]);
    expect(store.getState().settlement.npcs[0].name).toBe('Adela');
    expect(store.getState().pendingEditsQueue).toHaveLength(1);
    expect(store.getState().pendingEditsQueue[0]).toMatchObject({
      id: table.id,
      status: 'failed',
      failureReason: 'blocked_at_table',
    });

    store.setState((state) => {
      state.applyEvent = () => ({ ok: true, receipts: [] });
    });
    const retry = await store.getState().commitPendingEdits({ intentIds: [table.id] });
    expect(retry).toMatchObject({ ok: true, status: 'applied', applied: [table.id] });
    expect(store.getState().pendingEditsQueue).toEqual([]);
  });

  test.each([
    ['table then NPC', 'table'],
    ['NPC then table', 'npc'],
  ])('%s exact commits rebase disjoint retained work', async (_label, firstKind) => {
    const npc = await store.getState().queueEdit('rename-npc', {
      npcId: 'npc.ada',
      newName: 'Adela',
    });
    const table = await store.getState().queueEdit('table-event', tableObligation());
    const first = firstKind === 'table' ? table : npc;
    const second = firstKind === 'table' ? npc : table;

    expect((await store.getState().commitPendingEdits({ intentIds: [first.id] })).ok).toBe(true);
    expect(await store.getState().commitPendingEdits({ intentIds: [second.id] }))
      .toMatchObject({ ok: true, status: 'applied', applied: [second.id] });
    expect(store.getState().pendingEditsQueue).toEqual([]);
  });

  test('same-target work becomes stale, then explicit review refreshes preview and commit', async () => {
    const rename = await store.getState().queueEdit('rename-npc', {
      npcId: 'npc.ada',
      newName: 'Adela',
    });
    const goal = await store.getState().queueEdit('edit-npc', {
      npcId: 'npc.ada',
      facetKind: 'goal',
      value: 'restore_order',
    });
    expect((await store.getState().commitPendingEdits({ intentIds: [rename.id] })).ok).toBe(true);
    expect(await store.getState().commitPendingEdits({ intentIds: [goal.id] }))
      .toMatchObject({
        ok: false,
        failed: [{ intentId: goal.id, status: 'stale', reason: 'source_changed' }],
      });

    expect(await store.getState().refreshPendingEdits({ intentIds: [goal.id] }))
      .toMatchObject({ ok: true, status: 'refreshed', refreshed: [goal.id] });
    const reviewed = store.getState().pendingEditsQueue[0];
    expect(reviewed).toMatchObject({
      id: goal.id,
      status: 'staged',
      failureReason: null,
      availability: { status: 'available', reason: null },
    });
    expect(previewCascade(store.getState().settlement, [reviewed]))
      .toBeTruthy();
    expect(await store.getState().commitPendingEdits({ intentIds: [goal.id] }))
      .toMatchObject({ ok: true, status: 'applied', applied: [goal.id] });
  });

  test('review refuses and retains an intent whose stable target disappeared', async () => {
    const intent = await store.getState().queueEdit('rename-npc', {
      npcId: 'npc.ada',
      newName: 'Adela',
    });
    store.setState((state) => {
      state.settlement.npcs = state.settlement.npcs.filter((npc) => npc.id !== 'npc.ada');
    });
    await store.getState().commitPendingEdits({ intentIds: [intent.id] });

    expect(await store.getState().refreshPendingEdits({ intentIds: [intent.id] }))
      .toMatchObject({
        ok: false,
        status: 'failed',
        failed: [{ intentId: intent.id, reason: 'npc_target_missing' }],
      });
    expect(store.getState().pendingEditsQueue[0]).toMatchObject({
      id: intent.id,
      status: 'failed',
      failureReason: 'npc_target_missing',
    });
  });

  test.each([
    ['realm_advancing', { advanceInFlight: ['camp-1'] }],
    ['advance_paused', { paused: true }],
  ])('admission and commit race retain work while %s', async (reason, mode) => {
    store.setState((state) => {
      state.activeSaveId = 'save-a';
      state.savedSettlements = [{
        id: 'save-a',
        settlement: state.settlement,
        timestamp: '2026-07-24T10:00:00.000Z',
      }];
      state.campaigns = [{
        id: 'camp-1',
        settlementIds: ['save-a'],
        worldState: mode.paused ? { pausedAdvance: { remaining: 1 } } : {},
      }];
      state.advanceInFlight = mode.advanceInFlight || [];
    });
    expect(await store.getState().queueEdit('rename-npc', {
      npcId: 'npc.ada',
      newName: 'Blocked',
    })).toBeNull();

    store.setState((state) => {
      state.advanceInFlight = [];
      delete state.campaigns[0].worldState.pausedAdvance;
    });
    const intent = await store.getState().queueEdit('rename-npc', {
      npcId: 'npc.ada',
      newName: 'Adela',
    });
    store.setState((state) => {
      if (reason === 'realm_advancing') state.advanceInFlight = ['camp-1'];
      else state.campaigns[0].worldState.pausedAdvance = { remaining: 1 };
    });
    expect(await store.getState().commitPendingEdits({ intentIds: [intent.id] }))
      .toMatchObject({
        ok: false,
        status: 'failed',
        failed: [{ intentId: intent.id, status: 'failed', reason }],
      });
    expect(store.getState().pendingEditsQueue[0]).toMatchObject({
      id: intent.id,
      status: 'failed',
      failureReason: reason,
    });
  });

  test('resubmitting an already-applied intent returns its receipt without reapplying', async () => {
    const intent = await store.getState().queueEdit('rename-npc', {
      npcId: 'npc.ada',
      newName: 'Adela',
    });
    const first = await store.getState().commitPendingEdits({ intentIds: [intent.id] });
    expect(first.ok).toBe(true);

    // If the writer ran again this second value would be observable.
    store.setState((state) => {
      state.settlement.npcs[0].name = 'A later name';
    });
    const replay = await store.getState().commitPendingEdits({ intentIds: [intent.id] });
    expect(replay).toMatchObject({
      ok: true,
      status: 'already-applied',
      applied: [intent.id],
    });
    expect(store.getState().settlement.npcs[0].name).toBe('A later name');
  });

  test('settlement identity reset clears both staged intents and session receipts', async () => {
    const intent = await store.getState().queueEdit('rename-npc', {
      npcId: 'npc.ada',
      newName: 'Adela',
    });
    await store.getState().commitPendingEdits({ intentIds: [intent.id] });
    expect(store.getState().pendingEditReceipts).toHaveLength(1);

    store.getState().setSettlement({
      id: 'town.other',
      name: 'Other',
      tier: 'town',
      npcs: [],
    });
    expect(store.getState().pendingEditsQueue).toEqual([]);
    expect(store.getState().pendingEditReceipts).toEqual([]);
  });
});
