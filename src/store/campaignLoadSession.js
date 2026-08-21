/** Strict persisted-row admission plus cache/cloud campaign reconciliation. */
import { campaigns as campaignService } from '../lib/campaigns.js';
import {
  campaignCacheOwner,
  captureCampaignSession,
  isCurrentCampaignSession,
  loadCampaignSyncTools,
  localWrite,
  syncCampaignSnapshot,
} from './campaignSliceShared.js';

export const CAMPAIGN_ADMISSION_ERROR_CODE = 'campaign_admission_unavailable';
export const CAMPAIGN_ADMISSION_ERROR_MESSAGE = 'Campaign data could not be safely loaded. Retry to validate it again before continuing.';

const loadCampaignHydration = () => import('./campaignHydration.js');

function callAsPromise(operation) {
  try {
    return Promise.resolve(operation());
  } catch (error) {
    return Promise.reject(error);
  }
}

function campaignAdmissionError(error) {
  if (error?.code === CAMPAIGN_ADMISSION_ERROR_CODE) return error;
  return Object.assign(
    new Error(CAMPAIGN_ADMISSION_ERROR_MESSAGE, { cause: error }),
    { code: CAMPAIGN_ADMISSION_ERROR_CODE },
  );
}

export async function runCampaignLoad({
  set,
  get,
  migrateCampaign,
  loadHydration = loadCampaignHydration,
  service = campaignService,
  loadSyncTools = loadCampaignSyncTools,
}) {
  const session = captureCampaignSession(get());
  const ownerId = session?.ownerId || campaignCacheOwner(get());
  const customContentReady = ownerId === 'anon' || get().customContentSyncedAt != null;
  const inferredCustomContent = customContentReady ? (get().customContent || {}) : undefined;

  // Start configured I/O before the cold validation chunk resolves, but settle
  // each rejection immediately. Remote transport degradation and unavailable
  // admission machinery intentionally remain different outcomes.
  const remoteRowsLoad = service.isConfigured
    ? callAsPromise(() => service.list()).then(
      remote => ({ remote, error: null }),
      error => ({ remote: null, error }),
    )
    : null;
  const syncToolsLoad = service.isConfigured
    ? callAsPromise(loadSyncTools).then(
      tools => ({ tools, error: null }),
      error => ({ tools: null, error: campaignAdmissionError(error) }),
    )
    : null;
  let cached = get().campaigns;

  try {
    const { hydratePersistedCampaignRows } = await Promise.resolve()
      .then(loadHydration)
      .catch(error => { throw campaignAdmissionError(error); });
    if (!isCurrentCampaignSession(get(), session)) return get().campaigns;
    const hydrateRows = rows => {
      try {
        return hydratePersistedCampaignRows(rows, inferredCustomContent, migrateCampaign);
      } catch (error) {
        throw campaignAdmissionError(error);
      }
    };

    cached = hydrateRows(service.loadCached(ownerId));
    set(state => {
      state.campaigns = cached;
      state.campaignsLoaded = !service.isConfigured;
      state.campaignLoadError = null;
    });
    if (!service.isConfigured) return cached;

    const [remoteResult, toolsResult] = await Promise.all([remoteRowsLoad, syncToolsLoad]);
    // A remote outage is degradable only when the strict-admission machinery is
    // itself available. If both fail, the admission failure must win: otherwise
    // an unavailable validator is mislabeled as an ordinary network fallback.
    if (toolsResult.error) throw toolsResult.error;
    const {
      mergeCampaignLists,
      primeCampaignSync,
      reconcileTombstones,
    } = toolsResult.tools || {};
    if (
      typeof mergeCampaignLists !== 'function'
      || typeof primeCampaignSync !== 'function'
      || typeof reconcileTombstones !== 'function'
    ) {
      throw campaignAdmissionError(new Error('Campaign sync admission tools are incomplete'));
    }
    if (remoteResult.error) {
      if (!isCurrentCampaignSession(get(), session)) return get().campaigns;
      console.warn('[campaignSlice] campaign cloud load failed', remoteResult.error);
      set(state => {
        state.campaignsLoaded = true;
        state.campaignLoadError = null;
      });
      return cached;
    }
    if (!isCurrentCampaignSession(get(), session)) return get().campaigns;

    const migratedRemote = hydrateRows(remoteResult.remote);
    primeCampaignSync(migratedRemote, ownerId, session.generation);
    const tombstones = service.loadTombstones(ownerId);
    // Merge against the live list: a campaign created while list() was pending
    // exists only there and must not be dropped by a stale cache snapshot.
    const merged = mergeCampaignLists(get().campaigns, migratedRemote, { tombstones });
    const prunedTombstones = reconcileTombstones(tombstones, migratedRemote);
    if (prunedTombstones.length !== tombstones.length) {
      service.writeTombstones(prunedTombstones, ownerId);
    }
    set(state => {
      state.campaigns = merged;
      state.campaignsLoaded = true;
      state.campaignLoadError = null;
    });
    localWrite(merged, ownerId);
    syncCampaignSnapshot(
      merged,
      null,
      session,
      () => isCurrentCampaignSession(get(), session),
    ).catch(error => {
      console.warn('[campaignSlice] campaign cloud backfill failed', error);
    });
    return merged;
  } catch (error) {
    if (!isCurrentCampaignSession(get(), session)) return get().campaigns;
    const admissionError = campaignAdmissionError(error);
    console.warn('[campaignSlice] campaign admission failed', admissionError);
    set(state => {
      state.campaignsLoaded = false;
      state.campaignLoadError = {
        code: CAMPAIGN_ADMISSION_ERROR_CODE,
        message: CAMPAIGN_ADMISSION_ERROR_MESSAGE,
      };
    });
    throw admissionError;
  }
}
