/**
 * domain/region/deriveRegionalState.js
 *
 * Read-only regional projection of a settlement. This is the adapter between
 * the local simulator's rich but local output and campaign-level propagation.
 */

import { deriveAllActiveConditions } from '../activeConditions.js';
import { deriveCausalState, compareCausalState } from '../causalState.js';
import { deriveAllSupplyChainStates } from '../supplyChainState.js';
import { normalizeGood, normalizeGoodsList } from './goodsCatalog.js';
import { TIER_ORDER } from '../../data/constants.js';

const UNHEALTHY_CHAIN_STATUSES = new Set(['strained', 'scarce', 'blocked', 'captured', 'substituted', 'collapsing']);

/** @param {any} input */
export function settlementFromSave(input) {
  if (!input) return null;
  return input.settlement || input;
}

/**
 * @param {any} input
 * @param {any} settlement
 */
function saveIdOf(input, settlement) {
  return input?.id || settlement?.id || null;
}

/** @param {any} items */
function uniqueById(items) {
  const out = [];
  const seen = new Set();
  for (const item of items || []) {
    if (!item?.id || seen.has(item.id)) continue;
    seen.add(item.id);
    out.push(item);
  }
  return out;
}

/** @param {any} settlement */
function economicOf(settlement) {
  return settlement?.economicState || settlement?.economy || {};
}

/**
 * @param {any} settlement
 * @param {any} save
 */
function configOf(settlement, save) {
  return settlement?.config || save?.config || {};
}

/** @param {any} settlement */
function routeCutSignals(settlement) {
  const config = settlement?.config || {};
  const cutRoutes = Array.isArray(config._cutRoutes) ? config._cutRoutes : [];
  const conditions = deriveAllActiveConditions(settlement);
  const conditionCuts = conditions.filter(/** @param {any} c */ c =>
    c.archetype === 'trade_route_cut' || c.archetype === 'regional_route_disruption'
  );
  return { cutRoutes, conditionCuts };
}

/**
 * @param {any} settlement
 * @param {any} save
 */
function tradeRouteState(settlement, save) {
  const cfg = configOf(settlement, save);
  const access = cfg.tradeRouteAccess || economicOf(settlement).tradeAccess || settlement?.tradeRouteAccess || 'none';
  const { cutRoutes, conditionCuts } = routeCutSignals(settlement);
  const cut = cutRoutes.length > 0 || conditionCuts.length > 0;
  const isolated = access === 'isolated' || access === 'none';
  return {
    access,
    open: !cut && !isolated,
    cut,
    cutRoutes,
    conditionCuts,
  };
}

/** @param {any} settlement */
function exportLabels(settlement) {
  const econ = economicOf(settlement);
  return [
    ...(econ.primaryExports || []),
    ...(econ.exports || []),
    ...(econ.transit || []),
  ];
}

/** @param {any} settlement */
function importLabels(settlement) {
  const econ = economicOf(settlement);
  return [
    ...(econ.primaryImports || []),
    ...(econ.imports || []),
    ...(econ.necessityImports || []),
  ];
}

/** @param {any} settlement */
function localProductionLabels(settlement) {
  const econ = economicOf(settlement);
  return [
    ...(econ.localProduction || []),
    ...((settlement?.config?.nearbyResources || []).map(/** @param {any} r */ r => ({ id: r, label: r }))),
  ];
}

/** @param {any} settlement */
function resourceDepletionState(settlement) {
  const state = settlement?.config?.nearbyResourcesState || {};
  const depleted = [];
  for (const [label, status] of Object.entries(state)) {
    if (status === 'depleted') {
      const good = normalizeGood(label);
      if (good) depleted.push(good);
    }
  }
  return uniqueById(depleted);
}

/**
 * Derive a compact, stable regional read model from a settlement or save.
 *
 * Projection diet: the former `services`, `unhealthyChains`,
 * `activeConditions`, `causal`, and `systemState` fields had ZERO consumers
 * (deriveLocalDelta diffs `activeChains` directly and diffCausal re-derives
 * causal state from the raw settlements; discovery reads exports/imports/
 * route; graph nodes read id/name/tier; world-pulse readers consume
 * buildWorldSnapshot items, not this projection) — and they were embedded
 * twice per event-log record. Dropped; re-add only with a real reader.
 *
 * @param {any} input
 */
export function deriveRegionalState(input) {
  const settlement = settlementFromSave(input);
  if (!settlement) {
    return {
      id: null,
      name: null,
      tier: null,
      population: 0,
      exports: [],
      imports: [],
      localProduction: [],
      activeChains: [],
      route: { access: 'none', open: false, cut: false, cutRoutes: [], conditionCuts: [] },
      depletedGoods: [],
    };
  }

  return {
    id: saveIdOf(input, settlement),
    settlementId: settlement.id || saveIdOf(input, settlement),
    name: settlement.name || input?.name || null,
    tier: settlement.tier || input?.tier || null,
    population: Math.max(0, Math.round(Number(settlement.population) || 0)),
    exports: normalizeGoodsList(exportLabels(settlement)),
    imports: normalizeGoodsList(importLabels(settlement)),
    localProduction: normalizeGoodsList(localProductionLabels(settlement)),
    activeChains: deriveAllSupplyChainStates(settlement),
    route: tradeRouteState(settlement, input),
    depletedGoods: resourceDepletionState(settlement),
  };
}

/** @param {any} items */
function byId(items) {
  return new Map((items || []).map(/** @param {any} item */ item => [item.id, item]));
}

/**
 * @param {any} kind
 * @param {any} beforeGoods
 * @param {any} afterGoods
 * @param {any} source
 */
function diffGoods(kind, beforeGoods, afterGoods, source) {
  const out = [];
  const before = byId(beforeGoods);
  const after = byId(afterGoods);

  for (const [id, good] of before) {
    if (!after.has(id)) {
      out.push({
        kind: `${kind}_lost`,
        good,
        magnitude: good.criticality ?? 0.35,
        source,
      });
    }
  }
  for (const [id, good] of after) {
    if (!before.has(id)) {
      out.push({
        kind: `${kind}_gained`,
        good,
        magnitude: Math.max(0.15, (good.criticality ?? 0.35) * 0.5),
        source,
      });
    }
  }
  return out;
}

/**
 * @param {any} beforeState
 * @param {any} afterState
 */
function diffChains(beforeState, afterState) {
  const out = [];
  const before = byId(beforeState.activeChains);
  const after = byId(afterState.activeChains);
  for (const [id, afterChain] of after) {
    const beforeChain = before.get(id);
    if (!beforeChain) continue;
    const wasHealthy = !UNHEALTHY_CHAIN_STATUSES.has(beforeChain.status);
    const nowUnhealthy = UNHEALTHY_CHAIN_STATUSES.has(afterChain.status);
    if (wasHealthy && nowUnhealthy) {
      out.push({
        kind: 'chain_degraded',
        chain: afterChain,
        magnitude: severityForChainStatus(afterChain.status),
        source: 'supply_chain',
      });
    }
  }
  return out;
}

/** @param {any} status */
function severityForChainStatus(status) {
  switch (status) {
    case 'collapsing': return 0.95;
    case 'blocked': return 0.85;
    case 'captured': return 0.7;
    case 'scarce': return 0.65;
    case 'strained': return 0.45;
    case 'substituted': return 0.35;
    default: return 0.25;
  }
}

/**
 * @param {any} beforeState
 * @param {any} afterState
 * @param {any} event
 */
function diffRoute(beforeState, afterState, event) {
  if (event?.type === 'CUT_TRADE_ROUTE') {
    return [{
      kind: 'route_cut',
      routeAccess: afterState.route.access,
      magnitude: 0.75,
      source: 'event',
    }];
  }
  if (beforeState.route.open && !afterState.route.open) {
    return [{
      kind: 'route_cut',
      routeAccess: afterState.route.access,
      magnitude: 0.65,
      source: 'route',
    }];
  }
  if (!beforeState.route.open && afterState.route.open) {
    return [{
      kind: 'route_restored',
      routeAccess: afterState.route.access,
      magnitude: 0.45,
      source: 'route',
    }];
  }
  return [];
}

/** @param {any} tier */
function tierRank(tier) {
  const index = TIER_ORDER.indexOf(tier);
  return index >= 0 ? index : -1;
}

/**
 * @param {any} beforeState
 * @param {any} afterState
 */
function diffTier(beforeState, afterState) {
  if (!beforeState.tier || !afterState.tier || beforeState.tier === afterState.tier) return [];
  const beforeRank = tierRank(beforeState.tier);
  const afterRank = tierRank(afterState.tier);
  const distance = beforeRank >= 0 && afterRank >= 0 ? Math.max(1, Math.abs(afterRank - beforeRank)) : 1;
  return [{
    kind: afterRank > beforeRank ? 'tier_promotion' : 'tier_demotion',
    fromTier: beforeState.tier,
    toTier: afterState.tier,
    magnitude: Math.min(1, 0.45 + distance * 0.18),
    source: 'settlement_tier',
  }];
}

/**
 * @param {any} beforePopulation
 * @param {any} afterPopulation
 * @param {any} event
 */
function populationKind(beforePopulation, afterPopulation, event) {
  const candidateType = String(event?.payload?.candidateType || event?.payload?.outcomeType || '').toLowerCase();
  if (/migration|emigration|refugee/.test(candidateType) || event?.type === 'REFUGEE_WAVE') return 'migration_wave';
  return afterPopulation > beforePopulation ? 'population_growth' : 'population_loss';
}

/**
 * @param {any} beforeState
 * @param {any} afterState
 * @param {any} event
 */
function diffPopulation(beforeState, afterState, event) {
  const beforePopulation = Math.max(0, Number(beforeState.population) || 0);
  const afterPopulation = Math.max(0, Number(afterState.population) || 0);
  const delta = Math.round(afterPopulation - beforePopulation);
  if (!delta) return [];
  const threshold = Math.max(10, Math.round(Math.max(1, beforePopulation) * 0.01));
  if (Math.abs(delta) < threshold) return [];
  return [{
    kind: populationKind(beforePopulation, afterPopulation, event),
    before: beforePopulation,
    after: afterPopulation,
    delta,
    magnitude: Math.min(1, Math.abs(delta) / Math.max(1, beforePopulation * 0.12)),
    source: 'population',
  }];
}

/**
 * @param {any} beforeSettlement
 * @param {any} afterSettlement
 */
function diffCausal(beforeSettlement, afterSettlement) {
  try {
    const before = deriveCausalState(beforeSettlement);
    const after = deriveCausalState(afterSettlement);
    return compareCausalState(before, after)
      .filter(d => Math.abs(d.change || 0) >= 8)
      .map(d => ({
        kind: 'causal_shift',
        variable: d.variable,
        before: d.before,
        after: d.after,
        change: d.change,
        magnitude: Math.min(1, Math.abs(d.change || 0) / 35),
        source: 'causal_state',
      }));
  } catch {
    return [];
  }
}

/**
 * @param {any} event
 * @param {number} [fallback]
 */
function eventMagnitude(event, fallback = 0.55) {
  const severity = event?.payload?.severity;
  if (typeof severity === 'number' && Number.isFinite(severity)) {
    return Math.max(0.1, Math.min(1, severity));
  }
  const size = String(event?.payload?.size || '').toLowerCase();
  if (size === 'massive' || size === 'large') return 0.8;
  if (size === 'small') return 0.35;
  return fallback;
}

/** @param {any} event */
function eventRegionalChanges(event) {
  if (!event?.type) return [];
  switch (event.type) {
    case 'KILL_LEADER':
      return [{
        kind: 'authority_shock',
        magnitude: eventMagnitude(event, 0.7),
        source: 'event',
        variable: 'political_authority',
      }];
    case 'EXPOSE_CORRUPTION':
      return [{
        kind: 'legitimacy_shock',
        magnitude: eventMagnitude(event, 0.65),
        source: 'event',
        variable: 'public_legitimacy',
      }];
    case 'RAID_OR_MONSTER_ATTACK':
      return [{
        kind: 'security_shock',
        magnitude: eventMagnitude(event, 0.65),
        source: 'event',
        variable: 'defense_readiness',
      }];
    case 'REFUGEE_WAVE':
      return [{
        kind: 'migration_wave',
        magnitude: eventMagnitude(event, 0.55),
        source: 'event',
        variable: 'migration_pressure',
      }];
    case 'PLAGUE':
      return [{
        kind: 'health_shock',
        magnitude: eventMagnitude(event, 0.6),
        source: 'event',
        variable: 'healing_capacity',
      }];
    default:
      return [];
  }
}

/**
 * Derive the regional significance of a local before/after settlement change.
 *
 * @param {any} beforeInput
 * @param {any} afterInput
 * @param {any} [cause]
 */
export function deriveLocalDelta(beforeInput, afterInput, cause = {}) {
  const beforeSettlement = settlementFromSave(beforeInput);
  const afterSettlement = settlementFromSave(afterInput);
  const beforeState = deriveRegionalState(beforeInput);
  const afterState = deriveRegionalState(afterInput);

  const changes = [
    ...diffGoods('export', beforeState.exports, afterState.exports, 'exports'),
    ...diffGoods('import', beforeState.imports, afterState.imports, 'imports'),
    ...diffGoods('local_production', beforeState.localProduction, afterState.localProduction, 'local_production'),
    ...diffGoods('depleted_good', beforeState.depletedGoods, afterState.depletedGoods, 'depletion'),
    ...diffTier(beforeState, afterState),
    ...diffPopulation(beforeState, afterState, cause.event),
    ...diffChains(beforeState, afterState),
    ...diffRoute(beforeState, afterState, cause.event),
    ...diffCausal(beforeSettlement, afterSettlement),
    ...eventRegionalChanges(cause.event),
  ];

  const sourceSettlementId = afterState.id || beforeState.id;
  const causeId = cause.event?.id || cause.event?.type || cause.reason || 'manual';
  // The former `hasRegionalSignal`
  // boolean was write-only — every consumer thresholds `changes` magnitudes
  // itself. Removed as a dead write; tombstoned in fieldManifest.js so it
  // cannot quietly return without a reader.
  return {
    id: `local_delta.${sourceSettlementId || 'unknown'}.${String(causeId).replace(/[^a-zA-Z0-9_.-]+/g, '_')}`,
    sourceSettlementId,
    sourceSettlementName: afterState.name || beforeState.name || null,
    cause,
    before: beforeState,
    after: afterState,
    changes,
  };
}
