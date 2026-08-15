/** Eager campaign state and stable delegates; implementation lives in campaignRuntime. */
import { getStatus as outboxStatus } from './outbox.js';
import { clearCampaignSyncBookkeeping } from './campaignSyncBookkeeping.js';
import {
  CAMPAIGN_REPORTING_LEASE,
  clearCampaignOwnerReporting,
  initCampaignEntryReporting,
} from './campaignEntryReporting.js';
import {
  CAMPAIGN_SESSION_READER,
  campaignCacheOwner,
  retryOutboxPersist,
} from './campaignSliceShared.js';
import {
  campaignActionDelegate,
  campaignLoadDelegate,
  readyCampaignAction,
} from './campaignEntryDelegates.js';

export const CAMPAIGN_CORE_ACTIONS = Object.freeze([
  'retryOutbox',
  'isCampaignMutationLocked',
  'getCampaignMutationBlock',
  'getCampaignMembershipBlock',
  'getSettlementDeletionBlock',
  'withSettlementDeletionLock',
  'executeImportReconciliationDraft',
  'pinLegacyCampaignContentBindings',
  'createCampaign',
  'createImportedCampaign',
  'previewCampaignContentBindingMigration',
  'previewCampaignContentBindingRollback',
  'applyCampaignContentBindingMigration',
  'importGalleryMap',
  'importGalleryMapWithCampaign',
  'importGallerySettlement',
  'renameCampaign',
  'deleteCampaign',
  'toggleCampaignCollapsed',
  'addToCampaign',
  'removeFromCampaign',
  'saveCampaignMap',
  'clearCampaignMap',
  'updateSavedCampaign',
  'getCampaignWizardNews',
  'importTableEvents',
  'appendCampaignChronicle',
  'markCampaignLettersRead',
  'setActiveCampaign',
  'getCampaignMapState',
  'getCampaignForSettlement',
  'isSettlementClockBound',
  'queueSettlementEvent',
  'cancelQueuedEvent',
  'updateQueuedEvent',
]);

function clearTransientCampaignWork(state) {
  state.campaignMutationLocks = [];
  state.advanceInFlight = [];
  state.pulseUndoStack = [];
  state.proposalUndoStack = [];
  state.advanceSeqByCampaign = {};
}

export const createCampaignSlice = (
  set,
  get,
  clearSyncBookkeeping = clearCampaignSyncBookkeeping,
  initReporting = initCampaignEntryReporting,
  retryPersist = retryOutboxPersist,
) => {
  const reporting = /** @type {{ sessionReader?: Function }} */ (
    initReporting(set, get) || {}
  );
  const actions = Object.fromEntries(
    CAMPAIGN_CORE_ACTIONS
      .filter(name => name !== 'retryOutbox')
      .map(name => [name, campaignActionDelegate(get, name)]),
  );
  return {
    [CAMPAIGN_REPORTING_LEASE]: reporting,
    [CAMPAIGN_SESSION_READER]: reporting.sessionReader || get,
    campaigns: [],
    // Admission failures leave this false so every route/retry can try again.
    campaignsLoaded: false,
    campaignLoadError: null,
    campaignSessionGeneration: 0,
    activeCampaignId: null,
    campaignSyncError: null,
    campaignMutationLocks: [],
    outboxStatus: outboxStatus(campaignCacheOwner(get())),
    clearCampaignSyncError: () => set(state => {
      state.campaignSyncError = null;
      state.campaignLoadError = null;
    }),
    retryOutbox: () => {
      set(state => { state.campaignSyncError = null; });
      return retryPersist();
    },
    loadCampaigns: campaignLoadDelegate(set, get),
    clearCampaigns: (options = {}) => {
      const ready = readyCampaignAction(get, 'clearCampaigns');
      if (ready) return ready(options);
      return set(state => {
        state.campaigns = [];
        state.campaignsLoaded = false;
        state.campaignLoadError = null;
        if (options?.ownerBoundary === true) clearCampaignOwnerReporting(state, options.nextOwnerId);
        state.activeCampaignId = null;
        state.campaignSessionGeneration = (
          (Number(state.campaignSessionGeneration) || 0) + 1
        );
        clearTransientCampaignWork(state);
        clearSyncBookkeeping();
      });
    },
    invalidateCampaignSession: () => {
      const ready = readyCampaignAction(get, 'invalidateCampaignSession');
      if (ready) return ready();
      return set(state => {
        state.campaignSessionGeneration = (
          (Number(state.campaignSessionGeneration) || 0) + 1
        );
        clearTransientCampaignWork(state);
      });
    },
    ...actions,
  };
};
