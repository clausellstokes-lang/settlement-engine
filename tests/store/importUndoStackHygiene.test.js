/**
 * importUndoStackHygiene.test.js — Wave R-3 lane A (R-1 deferral).
 *
 * A structured import rewrites campaign content (exclusive-rehome membership,
 * pending-event prune) but filtered NEITHER session undo stack, so pulse and
 * proposal snapshots captured BEFORE the import could restore a pre-import
 * world — resurrecting the old membership the command just replaced. Both
 * projection writers (server-atomic and local-recoverable-saga) now drop both
 * stacks' entries for exactly the campaigns the import changed, the
 * campaign-delete sweep pattern. Unaffected campaigns keep their snapshots,
 * and the advance-depth counter is deliberately untouched (the campaigns
 * still exist; their logical advance history is unchanged).
 */
import { beforeEach, describe, expect, test, vi } from 'vitest';

const dependencies = vi.hoisted(() => ({
  backend: 'server',
  commit: vi.fn(),
  campaignCache: vi.fn(),
  campaignUpsert: vi.fn(),
  savesMutateBatch: vi.fn(),
}));

vi.mock('../../src/lib/importReconciliationCommandPersistence.js', () => ({
  IMPORT_COMMAND_BACKEND: Object.freeze({
    LOCAL_ONLY: 'local-only',
    OFFLINE: 'offline',
    SERVER: 'server',
  }),
  importReconciliationCommandBackend: () => dependencies.backend,
  commitImportReconciliationCommand: (...args) => dependencies.commit(...args),
}));

vi.mock('../../src/lib/campaigns.js', () => ({
  campaigns: {
    cache: (...args) => dependencies.campaignCache(...args),
    upsert: (...args) => dependencies.campaignUpsert(...args),
  },
  admitSupabaseCampaignRows: rows => ({
    entries: rows,
    diagnostics: { rejected: 0 },
  }),
}));

vi.mock('../../src/lib/saves.js', () => ({
  saves: {
    mutateBatch: (...args) => dependencies.savesMutateBatch(...args),
  },
  admitSupabaseSavedSettlementRows: async rows => ({
    entries: rows,
    diagnostics: { rejected: 0 },
  }),
}));

import { runImportReconciliationCommandTransaction } from '../../src/store/importReconciliationCommandTransaction.js';

const OWNER = '11111111-1111-4111-8111-111111111111';
const TARGET = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
const OLD_CAMPAIGN = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
const UNRELATED_CAMPAIGN = 'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee';
const SAVE = 'cccccccc-cccc-4ccc-8ccc-cccccccccccc';
const CHECKSUM = 'sf-import-v1:source';

function stateFixture() {
  return {
    auth: { user: { id: OWNER } },
    campaignSessionGeneration: 7,
    savedSettlementsOwnerId: OWNER,
    savedSettlementsHydrationGeneration: 11,
    campaigns: [
      {
        id: TARGET,
        name: 'Target',
        settlementIds: [],
        worldState: { pendingEvents: [] },
        accessState: 'active',
      },
      {
        id: OLD_CAMPAIGN,
        name: 'Old',
        settlementIds: [SAVE],
        worldState: { pendingEvents: [] },
        accessState: 'active',
      },
      {
        id: UNRELATED_CAMPAIGN,
        name: 'Unrelated',
        settlementIds: [],
        worldState: { pendingEvents: [] },
        accessState: 'active',
      },
    ],
    savedSettlements: [{
      id: SAVE,
      name: 'Existing',
      settlement: { name: 'Existing' },
      accessState: 'active',
    }],
    pulseUndoStack: [
      { campaignId: TARGET, kind: 'advance' },
      { campaignId: OLD_CAMPAIGN, kind: 'advance' },
      { campaignId: UNRELATED_CAMPAIGN, kind: 'advance' },
    ],
    proposalUndoStack: [
      { campaignId: OLD_CAMPAIGN, kind: 'proposal', proposalId: 'p1' },
      { campaignId: UNRELATED_CAMPAIGN, kind: 'proposal', proposalId: 'p2' },
    ],
    advanceSeqByCampaign: { [OLD_CAMPAIGN]: 3, [UNRELATED_CAMPAIGN]: 1 },
  };
}

function harness(initial = stateFixture()) {
  let state = initial;
  return {
    get: () => state,
    set: (recipe) => { recipe(state); },
    read: () => state,
  };
}

function attachCommand() {
  return {
    commandId: 'cmd:import-reconciliation:attach',
    kind: 'import.campaign.attach-existing',
    targets: { campaignId: TARGET, saveId: SAVE },
    expected: {
      sourceFingerprint: CHECKSUM,
      membershipCampaignIds: [OLD_CAMPAIGN],
    },
    correlation: { importSessionId: 'irs:source:target' },
    params: { membershipPolicy: 'exclusive-rehome' },
    requestedAt: '2026-07-27T12:00:00.000Z',
  };
}

function remoteApplied() {
  return {
    status: 'applied',
    replayed: false,
    fingerprint: 'f'.repeat(64),
    saveRow: null,
    campaignRows: [
      { id: TARGET, name: 'Target', settlementIds: [SAVE], accessState: 'active' },
      { id: OLD_CAMPAIGN, name: 'Old', settlementIds: [], accessState: 'active' },
    ],
    receipt: { membershipPolicy: 'exclusive-rehome', campaignId: TARGET, saveId: SAVE },
  };
}

beforeEach(() => {
  dependencies.backend = 'server';
  dependencies.commit.mockReset();
  dependencies.campaignCache.mockReset();
  dependencies.campaignUpsert.mockReset();
  dependencies.savesMutateBatch.mockReset();
  dependencies.campaignUpsert.mockResolvedValue(undefined);
  dependencies.savesMutateBatch.mockResolvedValue(undefined);
});

describe('import projection sweeps stale undo snapshots (both backends)', () => {
  test('server-atomic: rewritten campaigns lose their pulse + proposal snapshots', async () => {
    dependencies.commit.mockResolvedValue(remoteApplied());
    const store = harness();
    const result = await runImportReconciliationCommandTransaction({
      set: store.set,
      get: store.get,
      command: attachCommand(),
    });
    expect(result).toMatchObject({ ok: true, status: 'applied' });

    const state = store.read();
    expect(state.pulseUndoStack).toEqual([
      { campaignId: UNRELATED_CAMPAIGN, kind: 'advance' },
    ]);
    expect(state.proposalUndoStack).toEqual([
      { campaignId: UNRELATED_CAMPAIGN, kind: 'proposal', proposalId: 'p2' },
    ]);
    // The campaigns still exist: their advance-depth counters stay.
    expect(state.advanceSeqByCampaign).toEqual({
      [OLD_CAMPAIGN]: 3, [UNRELATED_CAMPAIGN]: 1,
    });
  });

  test('local-recoverable-saga: the same sweep on the local projection writer', async () => {
    dependencies.backend = 'local-only';
    const store = harness();
    const result = await runImportReconciliationCommandTransaction({
      set: store.set,
      get: store.get,
      command: attachCommand(),
    });
    expect(result).toMatchObject({
      ok: true,
      status: 'applied',
      result: { mode: 'local-recoverable-saga', projection: 'applied' },
    });

    const state = store.read();
    expect(state.pulseUndoStack).toEqual([
      { campaignId: UNRELATED_CAMPAIGN, kind: 'advance' },
    ]);
    expect(state.proposalUndoStack).toEqual([
      { campaignId: UNRELATED_CAMPAIGN, kind: 'proposal', proposalId: 'p2' },
    ]);
    expect(state.advanceSeqByCampaign).toEqual({
      [OLD_CAMPAIGN]: 3, [UNRELATED_CAMPAIGN]: 1,
    });
  });

  test('a refused command never touches the stacks', async () => {
    dependencies.commit.mockResolvedValue({ status: 'stale', reason: 'membership_changed' });
    const store = harness();
    const before = structuredClone({
      pulse: store.read().pulseUndoStack,
      proposal: store.read().proposalUndoStack,
    });
    const result = await runImportReconciliationCommandTransaction({
      set: store.set,
      get: store.get,
      command: attachCommand(),
    });
    expect(result.ok).toBe(false);
    expect(store.read().pulseUndoStack).toEqual(before.pulse);
    expect(store.read().proposalUndoStack).toEqual(before.proposal);
  });
});
