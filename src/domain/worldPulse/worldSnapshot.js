import { deriveCausalState } from '../causalState.js';
import { deriveSystemState } from '../state/deriveSystemState.js';
import { ensureRegionalGraph } from '../region/index.js';
import { deriveAllActiveConditions } from '../activeConditions.js';
import { isCanonSave } from '../campaign/canon.js';
import { ensureWorldState } from './worldState.js';
import { isOffStage } from '../roads/state.js';

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
    // Participation view: OFF-STAGE NPCs are excluded from the settlement the pulse reads —
    // DM-shelved (stasis) OR a roads HOSTAGE (whereabouts.state==='hostage'). THE ONE
    // chokepoint (THE ROADS §8): isOffStage widens the existing stasis filter, so every pulse
    // kernel that reads the snapshot's settlement excludes a hostage from agency/growth/
    // recruitment/blocs/ladder/councils/coups in ONE move. Presence-driven: the whereabouts
    // key exists only when the roads mover wrote it, so a dark world reduces isOffStage to
    // isInStasis exactly ⇒ byte-identical (the roads dormancy golden proves it). Dormant (same
    // reference) when none are off-stage. TRAVELLERS are never filtered (travel is narrative,
    // §1 law 5); the full roster survives on `save` for the roads mover to manage hostages.
    const _s = saveSettlement(save);
    const _npcs = /** @type {Array<Record<string, unknown>>} */ (_s?.npcs);
    const settlement = (Array.isArray(_npcs) && _npcs.some((n) => isOffStage(n)))
      ? { ..._s, npcs: _npcs.filter((n) => !isOffStage(n)) }
      : _s;
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
