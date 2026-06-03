import { deriveCausalState } from '../causalState.js';
import { deriveSystemState } from '../state/deriveSystemState.js';
import { ensureRegionalGraph } from '../region/index.js';
import { deriveAllActiveConditions } from '../activeConditions.js';
import { isCanonSave } from '../campaign/canon.js';
import { ensureWorldState } from './worldState.js';

function saveSettlement(save) {
  return save?.settlement || save;
}

function saveId(save) {
  return String(save?.id || save?.settlement?.id || save?.settlementId || save?.name || 'unknown');
}

/**
 * @param {Object} [args]
 * @param {any} [args.campaign]
 * @param {any[]} [args.saves]
 * @param {any} [args.worldState]
 * @param {any} [args.regionalGraph]
 */
export function buildWorldSnapshot({ campaign, saves = [], worldState = null, regionalGraph = null } = {}) {
  const ids = new Set((campaign?.settlementIds || []).map(String));
  const graph = ensureRegionalGraph(regionalGraph || campaign?.regionalGraph || {});
  const state = ensureWorldState(worldState || campaign?.worldState, campaign);
  const canonSaves = (saves || [])
    .filter(save => ids.has(saveId(save)))
    .filter(isCanonSave);

  const settlements = canonSaves.map(save => {
    const settlement = saveSettlement(save);
    const id = saveId(save);
    const name = settlement?.name || save?.name || id;
    let causal;
    let system;
    try {
      causal = deriveCausalState(settlement);
      system = deriveSystemState(settlement);
    } catch (error) {
      causal = deriveCausalState(null);
      system = null;
    }
    return {
      id,
      save,
      name,
      settlement,
      activeConditions: deriveAllActiveConditions(settlement),
      causal,
      system,
    };
  });

  const byId = new Map(settlements.map(item => [String(item.id), item]));
  return {
    campaign,
    worldState: state,
    regionalGraph: graph,
    settlements,
    byId,
    relationships: graph.edges || [],
    channels: graph.channels || [],
    queuedImpacts: graph.queuedImpacts || [],
  };
}
