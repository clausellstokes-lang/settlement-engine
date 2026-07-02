/**
 * @vitest-environment jsdom
 *
 * SettlementsPanel.savesRef.test.jsx — the flush snapshot must see external
 * store writes.
 *
 * aiSlice persists AI narrative/notes/pins straight onto the store's
 * savedSettlements rows; they reach the panel only through its
 * useStore.subscribe watcher. The change-queue flush's batch commit rebuilds
 * the rows it persists from `savesRef.current` — so that watcher MUST refresh
 * the ref alongside local state. Before the fix it only called _setSavesLocal,
 * and a flush after an aiData write persisted the STALE pre-write row,
 * clobbering the fresh narrative in the cloud.
 *
 * The test drives the real seam end-to-end: mount with one save, fire the
 * captured subscription callback with an aiData-bearing row (the aiSlice
 * write), then invoke the batch commit the panel registered and assert the
 * persisted update carries the fresh aiData.
 */

import { describe, test, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup, act } from '@testing-library/react';

afterEach(cleanup);

const initialSave = {
  id: 'save-1', name: 'Greenhollow', tier: 'town', timestamp: 1700000000000,
  campaignState: { phase: 'draft' },
  settlement: {
    name: 'Greenhollow',
    economicState: { prosperity: 'Comfortable' },
    config: { monsterThreat: 'safe', tradeRouteAccess: 'road' },
    powerStructure: { factions: [{ faction: 'Council', power: 100 }] },
  },
};

// savesService: the mount effect loads the one save; mutateBatch is the spy
// the assertion reads (it receives the rows the batch commit persists).
vi.mock('../../src/lib/saves.js', () => ({
  saves: {
    list: vi.fn(() => Promise.resolve([{ ...initialSave }])),
    mutateBatch: vi.fn(() => Promise.resolve()),
    save: vi.fn(() => Promise.resolve()),
    reactivateFreeSettlement: vi.fn(() => Promise.resolve({ ok: true })),
  },
}));

// Analytics is fire-and-forget; stub it so the mount path stays quiet.
vi.mock('../../src/lib/analytics.js', () => ({
  track: vi.fn(),
  Funnel: { track: vi.fn() },
  EVENTS: new Proxy({}, { get: (_t, k) => String(k) }),
}));

// Capture the flush seam the panel registers (via useChangeQueueCascade) so
// the test can invoke the REAL batch commit — the closure that reads
// savesRef.current and persists it.
const captured = { batchCommit: null, linkExecutor: null };
vi.mock('../../src/store/changeQueueSlice.js', () => ({
  registerLinkExecutor: (fn) => { captured.linkExecutor = fn; },
  registerBatchCommit: (fn) => { if (fn) captured.batchCommit = fn; },
  _getLinkExecutor: () => captured.linkExecutor,
  _getBatchCommit: () => captured.batchCommit,
  createChangeQueueSlice: () => ({}),
}));

// Store mock: a mutable singleton drives every selector; subscribe captures
// the panel's savedSettlements watcher so the test can replay an external
// (aiSlice-style) store write through it.
const subscription = { selector: null, callback: null };
const storeState = {
  updateConfig: vi.fn(),
  clearLoadedFromSave: vi.fn(),
  generateSettlement: vi.fn(),
  setPurchaseModalOpen: vi.fn(),
  applyCosmeticRename: vi.fn(),
  setSavedSettlements: vi.fn(),
  notePersistedSave: vi.fn(),
  canonizeSavedSettlement: vi.fn(),
  queueChange: vi.fn(),
  syncActiveNeighbourFields: vi.fn(),
  maxSaves: () => 3,
  canSave: () => true,
  isElevated: () => false,
  auth: { tier: 'free', user: { id: 'u1' } },
  savedSettlements: [],
  activeSaveId: null,
  settlement: null,
  selectedSettlementId: null,
  clearSelectedSettlementId: vi.fn(),
  campaigns: [],
  createCampaign: vi.fn(),
  renameCampaign: vi.fn(),
  deleteCampaign: vi.fn(),
  toggleCampaignCollapsed: vi.fn(),
  addToCampaign: vi.fn(),
  removeFromCampaign: vi.fn(),
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
  function useStore(selector) {
    return selector(storeState);
  }
  useStore.subscribe = (selector, callback) => {
    // The panel registers exactly one watcher (savedSettlements).
    subscription.selector = selector;
    subscription.callback = callback;
    return () => {};
  };
  useStore.getState = () => storeState;
  return { useStore };
});

describe('SettlementsPanel — savesRef stays fresh across external store writes', () => {
  test('an aiSlice aiData write reaches the flush batch commit, not the stale snapshot', async () => {
    const SettlementsPanel = (await import('../../src/components/SettlementsPanel.jsx')).default;
    const { saves: savesService } = await import('../../src/lib/saves.js');

    render(<SettlementsPanel onNavigate={() => {}} />);
    // Saves loaded → the card is on screen and savesRef holds the initial row.
    expect(await screen.findByText('Greenhollow')).toBeTruthy();
    expect(subscription.callback).toBeTypeOf('function');
    expect(captured.batchCommit).toBeTypeOf('function');

    // External store write: aiSlice persists narrative onto the store row.
    // The panel sees it only through its subscribe watcher.
    const freshRows = [{
      ...initialSave,
      aiData: { narrative: 'fresh-narrative', generatedAt: 1700000001000 },
    }];
    storeState.savedSettlements = freshRows;
    act(() => { subscription.callback(freshRows); });

    // A change-queue flush now commits. The batch commit rebuilds the row
    // from the panel's flush snapshot — it must carry the fresh aiData.
    await act(async () => {
      const ok = await captured.batchCommit(['save-1']);
      expect(ok).toBe(true);
    });

    expect(savesService.mutateBatch).toHaveBeenCalledTimes(1);
    const { updates } = savesService.mutateBatch.mock.calls[0][0];
    expect(updates).toHaveLength(1);
    expect(updates[0].id).toBe('save-1');
    // The heart of the finding: pre-fix this row was the stale pre-write
    // snapshot (no aiData) and the flush clobbered the narrative in the cloud.
    expect(updates[0].aiData?.narrative).toBe('fresh-narrative');
  });
});
