/**
 * @vitest-environment jsdom
 *
 * settlementsPanelDelete.test.jsx — single-settlement delete cleans exactly the
 * survivors that genuinely reference the deleted save.
 *
 * Two findings are locked here, both in SettlementsPanel.deleteConfirmed:
 *
 *   1) Over-broad `wasLinked` predicate. The old gate scanned the DELETED save's
 *      network (`deletedNet.some(n => n.id === s.id || n.linkId)`). It skipped a
 *      survivor that references the deleted save when the link was one-directional
 *      (the deleted save's own network didn't list the survivor), and it flagged
 *      unrelated survivors whenever the deleted save happened to hold any linkId.
 *      The fix tests each SURVIVOR's own network against the deleted id/name.
 *
 *   2) O(n^2) modifiedIds diff. The changed-row diff recomputed
 *      `saves.filter(x => x.id !== id)` once per survivor. It's now hoisted to a
 *      single `survivors` array the map is index-aligned to.
 *
 * The test drives the real UI seam: render three saves (A links to B one-way;
 * C is unrelated), open B's delete confirm, click through, and assert the
 * persisted batch cleaned A (and only A) and deleted B.
 */

import { describe, test, expect, afterEach, beforeEach, vi } from 'vitest';
import { render, screen, cleanup, fireEvent, act, waitFor } from '@testing-library/react';

afterEach(cleanup);

// A references B one-directionally: A lists B in its neighbourNetwork, but B's
// own network is EMPTY. The pre-fix predicate (scanning B's network) would miss
// A entirely, leaving a dangling link to the deleted save. C is unrelated.
const saveA = {
  id: 'A', name: 'Aldergrove', tier: 'town', timestamp: 1700000000000,
  campaignState: { phase: 'draft' },
  settlement: {
    name: 'Aldergrove',
    neighbourNetwork: [{ id: 'B', name: 'Brackwater', linkId: 'link-ab' }],
    interSettlementRelationships: [{ partnerSettlement: 'Brackwater', kind: 'trade' }],
  },
};
const saveB = {
  id: 'B', name: 'Brackwater', tier: 'town', timestamp: 1700000000000,
  campaignState: { phase: 'draft' },
  settlement: { name: 'Brackwater', neighbourNetwork: [], interSettlementRelationships: [] },
};
const saveC = {
  id: 'C', name: 'Cindervale', tier: 'town', timestamp: 1700000000000,
  campaignState: { phase: 'draft' },
  // C holds a linkId to some OTHER town — the old `|| n.linkId` branch would
  // have flagged C as linked-to-B and re-scanned it needlessly. It must stay
  // untouched: not cleaned, not in modifiedIds.
  settlement: {
    name: 'Cindervale',
    neighbourNetwork: [{ id: 'Z', name: 'Zephyr', linkId: 'link-cz' }],
    interSettlementRelationships: [{ partnerSettlement: 'Zephyr', kind: 'trade' }],
  },
};

vi.mock('../../src/lib/saves.js', () => ({
  saves: {
    list: vi.fn(() => Promise.resolve([
      structuredClone(saveA), structuredClone(saveB), structuredClone(saveC),
    ])),
    mutateBatch: vi.fn(() => Promise.resolve()),
    save: vi.fn(() => Promise.resolve()),
    reactivateFreeSettlement: vi.fn(() => Promise.resolve({ ok: true })),
  },
}));

vi.mock('../../src/lib/analytics.js', () => ({
  track: vi.fn(),
  Funnel: { track: vi.fn() },
  EVENTS: new Proxy({}, { get: (_t, k) => String(k) }),
}));

const storeState = {
  updateConfig: vi.fn(),
  clearLoadedFromSave: vi.fn(),
  generateSettlement: vi.fn(),
  setPurchaseModalOpen: vi.fn(),
  applyCosmeticRename: vi.fn(),
  setSavedSettlements: vi.fn((rows) => {
    storeState.savedSettlements = rows;
    storeState.savedSettlementsLoaded = true;
    return true;
  }),
  clearSavedSettlements: vi.fn((ownerId) => {
    storeState.savedSettlements = [];
    storeState.savedSettlementsLoaded = false;
    storeState.savedSettlementsOwnerId = ownerId ?? null;
    storeState.savedSettlementsHydrationGeneration += 1;
  }),
  notePersistedSave: vi.fn(),
  canonizeSavedSettlement: vi.fn(),
  queueChange: vi.fn(),
  maxSaves: () => 3,
  canSave: () => true,
  isElevated: () => false,
  auth: { tier: 'free', user: { id: 'u1' } },
  savedSettlements: [],
  savedSettlementsLoaded: false,
  savedSettlementsOwnerId: 'u1',
  savedSettlementsHydrationGeneration: 0,
  selectedSettlementId: null,
  clearSelectedSettlementId: vi.fn(),
  campaigns: [],
  createCampaign: vi.fn(),
  renameCampaign: vi.fn(),
  deleteCampaign: vi.fn(),
  toggleCampaignCollapsed: vi.fn(),
  addToCampaign: vi.fn(),
  removeFromCampaign: vi.fn(),
  removeSavedSettlement: vi.fn(() => ({ ok: true })),
  withSettlementDeletionLock: vi.fn((_ids, operation) =>
    operation({ mutationToken: 'test-delete-lock', campaignIds: [] })),
  getCampaignMembershipBlock: vi.fn(() => null),
  getSettlementDeletionBlock: vi.fn(() => null),
  getCampaignMutationBlock: vi.fn(() => null),
  campaignMutationLocks: [],
  advanceInFlight: [],
  setActiveCampaign: vi.fn(),
  advanceCampaignWorld: vi.fn(),
  requestMapWorkspace: vi.fn(),
  discoverCampaignRegionalChannels: vi.fn(),
  setRegionalChannelStatus: vi.fn(),
  applyQueuedRegionalImpact: vi.fn(),
  ignoreQueuedRegionalImpact: vi.fn(),
  resolveRegionalImpact: vi.fn(),
  advanceCampaignRegionalImpacts: vi.fn(),
  applyAllQueuedRegionalImpacts: vi.fn(),
  ignoreAllQueuedRegionalImpacts: vi.fn(),
};

vi.mock('../../src/store/index.js', () => {
  function useStore(selector) { return selector(storeState); }
  useStore.subscribe = () => () => {};
  useStore.getState = () => storeState;
  return { useStore };
});

describe('SettlementsPanel — single delete neighbour cleanup', () => {
  beforeEach(() => {
    storeState.auth.user = { id: 'u1' };
    storeState.savedSettlements = [];
    storeState.savedSettlementsLoaded = false;
    storeState.savedSettlementsOwnerId = 'u1';
    storeState.savedSettlementsHydrationGeneration = 0;
    storeState.removeSavedSettlement.mockClear();
    storeState.withSettlementDeletionLock.mockClear();
    storeState.setSavedSettlements.mockClear();
    storeState.clearSavedSettlements.mockClear();
  });

  test('cleans the one-directionally-linked survivor and leaves unrelated saves untouched', async () => {
    const SettlementsPanel = (await import('../../src/components/SettlementsPanel.jsx')).default;
    const { saves: savesService } = await import('../../src/lib/saves.js');
    savesService.mutateBatch.mockReset().mockResolvedValue(undefined);

    render(<SettlementsPanel onNavigate={() => {}} />);
    // Saves resolved onto the list.
    expect(await screen.findByText('Aldergrove')).toBeTruthy();

    // Open B's delete confirmation. The delete toggle carries an accessible
    // name of "Delete <name>"; clicking it reveals the confirm panel.
    const deleteToggle = await screen.findByLabelText('Delete Brackwater');
    await act(async () => { fireEvent.click(deleteToggle); });

    const confirm = await screen.findByText('Yes, delete permanently');
    await act(async () => { fireEvent.click(confirm); });

    // The delete persisted exactly one batch.
    await waitFor(() => expect(savesService.mutateBatch).toHaveBeenCalledTimes(1));
    const { updates, deletes } = savesService.mutateBatch.mock.calls[0][0];
    const session = savesService.mutateBatch.mock.calls[0][1];
    expect(session.expectedOwnerId).toBe('u1');
    expect(session.isSessionCurrent()).toBe(true);

    // B was deleted.
    expect(deletes).toEqual(['B']);

    // A is the ONLY modified survivor: its dangling link to B was stripped.
    expect(updates).toHaveLength(1);
    expect(updates[0].id).toBe('A');
    expect(updates[0].settlement.neighbourNetwork).toEqual([]);
    expect(updates[0].settlement.interSettlementRelationships).toEqual([]);

    // C — which holds a linkId to an unrelated town — must NOT appear in the
    // batch. Pre-fix the over-broad `|| n.linkId` gate re-scanned it; correctness
    // held only by luck. This pins it out of the modified set for good.
    expect(updates.some(u => u.id === 'C')).toBe(false);
    expect(storeState.removeSavedSettlement).toHaveBeenCalledWith(
      'B',
      { mutationToken: 'test-delete-lock' },
    );
  });

  test('a failed cloud batch rolls the row back and never enters the store delete chokepoint', async () => {
    const SettlementsPanel = (await import('../../src/components/SettlementsPanel.jsx')).default;
    const { saves: savesService } = await import('../../src/lib/saves.js');
    savesService.mutateBatch.mockReset().mockRejectedValue(new Error('offline'));

    render(<SettlementsPanel onNavigate={() => {}} />);
    expect(await screen.findByText('Brackwater')).toBeTruthy();
    fireEvent.click(screen.getByLabelText('Delete Brackwater'));
    fireEvent.click(await screen.findByText('Yes, delete permanently'));

    await waitFor(() => expect(screen.getByRole('alert').textContent).toMatch(/Library:/));
    expect(screen.getByText('Brackwater')).toBeTruthy();
    expect(storeState.removeSavedSettlement).not.toHaveBeenCalled();
  });

  test('operation-scoped rollback restores only the failed delete, not a concurrent success or edit', async () => {
    const { rollbackLibraryMutation } = await import('../../src/components/settlements/libraryDeleteHandlers.js');
    const previousA = { id: 'A', name: 'A before' };
    const previousB = { id: 'B', name: 'B before' };
    const editedB = { id: 'B', name: 'B edited while A was pending' };

    const rolledBack = rollbackLibraryMutation(
      [editedB],                 // B still exists, but has a newer edit
      [previousA, previousB],    // snapshot captured before deleting A
      [previousB],               // optimistic state deleted A
      ['A'],
    );
    expect(rolledBack).toEqual([previousA, editedB]);

    const afterSuccessfulBDelete = rollbackLibraryMutation(
      [],                        // B was independently deleted successfully
      [previousA, previousB],
      [previousB],
      ['A'],
    );
    expect(afterSuccessfulBDelete).toEqual([previousA]);
  });

  test('single delete normalizes numeric neighbour ids against string save ids', async () => {
    const SettlementsPanel = (await import('../../src/components/SettlementsPanel.jsx')).default;
    const { saves: savesService } = await import('../../src/lib/saves.js');
    const source = {
      ...structuredClone(saveA),
      settlement: {
        ...structuredClone(saveA.settlement),
        neighbourNetwork: [{ id: 42, name: 'Former alias', linkId: 'mixed-id-link' }],
        interSettlementRelationships: [],
      },
    };
    const target = {
      ...structuredClone(saveB),
      id: '42',
      name: 'Renamed target',
      settlement: { ...structuredClone(saveB.settlement), name: 'Renamed target' },
    };
    savesService.list.mockResolvedValueOnce([source, target]);
    savesService.mutateBatch.mockReset().mockResolvedValue(undefined);

    render(<SettlementsPanel onNavigate={() => {}} />);
    expect(await screen.findByText('Renamed target')).toBeTruthy();
    fireEvent.click(screen.getByLabelText('Delete Renamed target'));
    fireEvent.click(await screen.findByText('Yes, delete permanently'));

    await waitFor(() => expect(savesService.mutateBatch).toHaveBeenCalledTimes(1));
    expect(savesService.mutateBatch.mock.calls[0][0].updates[0].settlement.neighbourNetwork).toEqual([]);
  });

  test('a late successful A delete cannot remove or prune B after the cache session switches', async () => {
    let resolveBatch;
    const batch = new Promise(resolve => {
      resolveBatch = resolve;
    });
    const SettlementsPanel = (await import('../../src/components/SettlementsPanel.jsx')).default;
    const { saves: savesService } = await import('../../src/lib/saves.js');
    savesService.mutateBatch.mockReset().mockReturnValue(batch);

    render(<SettlementsPanel onNavigate={() => {}} />);
    expect(await screen.findByText('Brackwater')).toBeTruthy();
    fireEvent.click(screen.getByLabelText('Delete Brackwater'));
    fireEvent.click(await screen.findByText('Yes, delete permanently'));
    await waitFor(() => expect(savesService.mutateBatch).toHaveBeenCalledTimes(1));
    const session = savesService.mutateBatch.mock.calls[0][1];
    expect(session.expectedOwnerId).toBe('u1');
    expect(session.isSessionCurrent()).toBe(true);

    storeState.auth.user = { id: 'u2' };
    storeState.savedSettlementsOwnerId = 'u2';
    storeState.savedSettlementsHydrationGeneration += 1;
    storeState.savedSettlements = [{ id: 'B', name: 'B account row' }];
    expect(session.isSessionCurrent()).toBe(false);
    const writesBeforeResolve = storeState.setSavedSettlements.mock.calls.length;
    resolveBatch();
    await act(async () => {
      await batch;
      await Promise.resolve();
    });

    expect(storeState.removeSavedSettlement).not.toHaveBeenCalled();
    expect(storeState.setSavedSettlements).toHaveBeenCalledTimes(writesBeforeResolve);
    expect(storeState.savedSettlements).toEqual([{ id: 'B', name: 'B account row' }]);
  });

  test('a late failed A delete cannot roll A rows or an A error into B', async () => {
    let rejectBatch;
    const batch = new Promise((_, reject) => {
      rejectBatch = reject;
    });
    const SettlementsPanel = (await import('../../src/components/SettlementsPanel.jsx')).default;
    const { saves: savesService } = await import('../../src/lib/saves.js');
    savesService.mutateBatch.mockReset().mockReturnValue(batch);

    render(<SettlementsPanel onNavigate={() => {}} />);
    expect(await screen.findByText('Brackwater')).toBeTruthy();
    fireEvent.click(screen.getByLabelText('Delete Brackwater'));
    fireEvent.click(await screen.findByText('Yes, delete permanently'));
    await waitFor(() => expect(savesService.mutateBatch).toHaveBeenCalledTimes(1));

    storeState.auth.user = { id: 'u2' };
    storeState.savedSettlementsOwnerId = 'u2';
    storeState.savedSettlementsHydrationGeneration += 1;
    storeState.savedSettlements = [{ id: 'B', name: 'B account row' }];
    const writesBeforeReject = storeState.setSavedSettlements.mock.calls.length;
    rejectBatch(new Error('A request failed late'));
    await act(async () => {
      await batch.catch(() => {});
      await Promise.resolve();
    });

    expect(storeState.removeSavedSettlement).not.toHaveBeenCalled();
    expect(storeState.setSavedSettlements).toHaveBeenCalledTimes(writesBeforeReject);
    expect(storeState.savedSettlements).toEqual([{ id: 'B', name: 'B account row' }]);
    expect(screen.queryByRole('alert')).toBeNull();
  });
});
