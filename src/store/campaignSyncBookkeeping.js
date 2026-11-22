/**
 * Import-light owner/session signature bookkeeping.
 *
 * Sign-out must clear the lazy campaign-sync signature even when the campaign
 * runtime has never loaded. Keep the operation synchronous to its caller and
 * swallow transport/chunk failures: the signature is only an optimization and
 * cannot authorize the replacement session.
 */
const loadProductionTools = () => import('../lib/campaignSync.js');

export function createCampaignSyncBookkeeping(loadTools = loadProductionTools) {
  let toolsPromise = null;
  const loadCampaignSyncTools = () => {
    if (!toolsPromise) {
      toolsPromise = Promise.resolve().then(loadTools).catch(error => {
        toolsPromise = null;
        throw error;
      });
    }
    return toolsPromise;
  };
  const clearCampaignSyncBookkeeping = () => {
    loadCampaignSyncTools()
      .then(({ clearCampaignSync }) => clearCampaignSync())
      .catch(() => {
        // A stale signature cannot certify the replacement session. Failure to
        // load this optimization must never reject the synchronous auth action.
      });
  };
  return Object.freeze({ clearCampaignSyncBookkeeping, loadCampaignSyncTools });
}

const campaignSyncBookkeeping = createCampaignSyncBookkeeping();

export const clearCampaignSyncBookkeeping = (
  () => campaignSyncBookkeeping.clearCampaignSyncBookkeeping()
);

export const loadCampaignSyncTools = () => campaignSyncBookkeeping.loadCampaignSyncTools();
