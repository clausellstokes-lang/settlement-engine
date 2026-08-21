/** Install campaign persistence/session reporters before the cold runtime loads. */
import {
  campaignCacheOwner,
  initCampaignSessionReader,
  initPersistFailureReporter,
} from './campaignSliceShared.js';
import { getStatus, initOutboxStatusReporter } from './outbox.js';

export const CAMPAIGN_REPORTING_LEASE = Symbol.for(
  'settlementforge.campaignReportingLease',
);

const SYNC_FAILURE_MESSAGE = 'Some changes could not be saved to the cloud. '
  + 'They are applied locally but may not persist — check your connection, then reload to confirm.';

/** Clear owner-scoped warning/status together at an account boundary. */
export function clearCampaignOwnerReporting(state, nextOwnerId) {
  state.campaignSyncError = null;
  state.outboxStatus = getStatus(nextOwnerId);
}

export function initCampaignEntryReporting(set, get, initializers = {}) {
  const existing = get?.()?.[CAMPAIGN_REPORTING_LEASE];
  if (existing?.sessionReader && typeof existing?.dispose === 'function') {
    return existing;
  }
  const initSession = initializers.initCampaignSessionReader || initCampaignSessionReader;
  const initFailure = initializers.initPersistFailureReporter || initPersistFailureReporter;
  const initStatus = initializers.initOutboxStatusReporter || initOutboxStatusReporter;

  const sessionReader = initSession(get) || get;
  const failureReporter = (_error, op) => {
    if (op?.ownerId && campaignCacheOwner(get()) !== String(op.ownerId)) return;
    set(state => { state.campaignSyncError = SYNC_FAILURE_MESSAGE; });
  };
  const statusReporter = (status, ownerId) => {
    const statusOwner = ownerId == null ? 'anon' : String(ownerId);
    if (campaignCacheOwner(get()) !== statusOwner) return;
    set(state => { state.outboxStatus = status; });
  };
  const disposeFailure = initFailure(get, failureReporter);
  const disposeStatus = initStatus(get, statusReporter);
  let disposed = false;
  return Object.freeze({
    sessionReader,
    failureReporter,
    statusReporter,
    dispose: () => {
      if (disposed) return;
      disposed = true;
      if (typeof disposeFailure === 'function') disposeFailure();
      if (typeof disposeStatus === 'function') disposeStatus();
    },
  });
}
