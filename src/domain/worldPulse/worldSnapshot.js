import { deriveCausalState } from '../causalState.js';
import { deriveSystemState } from '../state/deriveSystemState.js';
import { ensureRegionalGraph } from '../region/index.js';
import { deriveAllActiveConditions } from '../activeConditions.js';
import { isCanonSave } from '../campaign/canon.js';
import { ensureWorldState } from './worldState.js';

/** @param {any} save */
function saveSettlement(save) {
  return save?.settlement || save;
}

/** @param {any} save */
function saveId(save) {
  return String(save?.id || save?.settlement?.id || save?.settlementId || save?.name || 'unknown');
}

/**
 * Per-settlement derivation cache, keyed on the settlement object IDENTITY.
 *
 * advanceCampaignWorld rebuilds the snapshot up to ~9x per tick, and each
 * rebuild re-derives the O(N) per-settlement objects (causal / system /
 * activeConditions). Those three derivations depend SOLELY on the settlement
 * object — none of them read the regional graph or worldState — so a WeakMap
 * keyed on the settlement reference yields correct cache HITS for unchanged
 * settlements across a tick's repeated rebuilds and correct MISSES when a
 * settlement actually changed (copy-on-write ⇒ a changed settlement is a NEW
 * object reference). The WeakMap also lets entries be GC'd once a settlement
 * object is no longer referenced, so the cache never leaks across ticks.
 *
 * Only purely settlement-determined derivations live here; anything that also
 * depends on the graph/worldState (the snapshot's id/name/save wrapping) is
 * recomputed every rebuild and never cached.
 *
 * @type {WeakMap<object, { causal: any, system: any, activeConditions: any }>}
 */
const derivationCache = new WeakMap();

/**
 * Derive the settlement-only objects, memoized on the settlement identity.
 * Preserves the original error-handling exactly: causal/system are derived
 * together (a throw in either falls back to deriveCausalState(null)/system=null),
 * while activeConditions is derived independently.
 *
 * @param {import('../settlement.schema.js').SimSettlement} settlement
 * @returns {{ causal: any, system: any, activeConditions: any }}
 */
function deriveSettlementState(settlement) {
  if (settlement && typeof settlement === 'object') {
    const cached = derivationCache.get(settlement);
    if (cached) return cached;
  }
  let causal;
  let system;
  try {
    causal = deriveCausalState(settlement);
    system = deriveSystemState(settlement);
  } catch (error) {
    causal = deriveCausalState(null);
    system = null;
  }
  const derived = { causal, system, activeConditions: deriveAllActiveConditions(settlement) };
  if (settlement && typeof settlement === 'object') {
    derivationCache.set(settlement, derived);
  }
  return derived;
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
    // causal / system / activeConditions depend SOLELY on the settlement
    // object, so they are memoized on its identity (see deriveSettlementState).
    const { causal, system, activeConditions } = deriveSettlementState(settlement);
    return {
      id,
      save,
      name,
      settlement,
      activeConditions,
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
