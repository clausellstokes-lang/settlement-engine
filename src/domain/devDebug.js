/**
 * domain/devDebug.js — Dev simulation debugger payload.
 *
 * Composes every structured derivation into a single dev-mode envelope.
 * The DEV-only debugger UI / overlay consumes this; production builds
 * never need it.
 *
 *   deriveDevDebug(settlement) -> {
 *     identity,
 *     traces:        { total, byStep, byType, recent },
 *     substrate:     CausalState
 *     capacities:    CapacityState
 *     factions:      FactionProfile[]
 *     supplyChains:  SupplyChainState[]
 *     conditions:    ActiveCondition[]
 *     threats:       ThreatProfile[]
 *     hooks:         StructuredHook[]
 *     clocks:        EscalationClock[]
 *     districts:     DistrictProfile[]
 *     contradictions: Contradiction[]
 *     entityCatalog
 *     canonBreakdown
 *   }
 *
 * Pure read-only. No mutation. No side effects.
 */

import { getTraces, tracesFor } from './trace.js';
import { deriveCausalState } from './causalState.js';
import { deriveAllCapacities } from './capacityModel.js';
import { deriveAllFactionProfiles } from './factionProfile.js';
import { deriveAllSupplyChainStates } from './supplyChainState.js';
import { deriveAllActiveConditions } from './activeConditions.js';
import { deriveAllThreatProfiles } from './threatProfile.js';
import { deriveAllStructuredHooks, deriveEscalationClocks } from './hookEscalation.js';
import { deriveAllDistricts } from './districtProfile.js';
import { detectContradictions } from './contradictions.js';
import { entityCatalog } from './explanation.js';
import { canonBreakdown } from './canonStatus.js';

/** @param {import('./settlement.schema.js').SimSettlement} settlement */
function tracesByStepCounts(settlement) {
  const traces = getTraces(settlement);
  /** @type {Record<string, number>} */
  const out = {};
  for (const t of traces) {
    if (!t?.step) continue;
    out[t.step] = (out[t.step] || 0) + 1;
  }
  return out;
}

/** @param {import('./settlement.schema.js').SimSettlement} settlement */
function tracesByTypeCounts(settlement) {
  const traces = getTraces(settlement);
  /** @type {Record<string, number>} */
  const out = {};
  for (const t of traces) {
    if (!t?.targetType) continue;
    out[t.targetType] = (out[t.targetType] || 0) + 1;
  }
  return out;
}

/**
 * Build the full dev-debug envelope.
 *
 * @param {import('./settlement.schema.js').SimSettlement} settlement
 * @returns {Object}
 */
export function deriveDevDebug(settlement) {
  if (!settlement) {
    return {
      identity: null,
      traces: { total: 0, byStep: {}, byType: {}, recent: [] },
      substrate: null,
      capacities: null,
      factions: [],
      supplyChains: [],
      conditions: [],
      threats: [],
      hooks: [],
      clocks: [],
      districts: [],
      contradictions: [],
      entityCatalog: [],
      canonBreakdown: null,
    };
  }

  const traces = getTraces(settlement);
  return {
    identity: {
      id: settlement.id || null,
      name: settlement.name || null,
      tier: settlement.tier || null,
      seed: settlement._seed || null,
      schemaVersion: settlement.schemaVersion ?? null,
      simulationVersion: settlement.simulationVersion ?? null,
    },
    traces: {
      total: traces.length,
      byStep: tracesByStepCounts(settlement),
      byType: tracesByTypeCounts(settlement),
      recent: traces.slice(-10),
    },
    substrate:      deriveCausalState(settlement),
    capacities:     deriveAllCapacities(settlement),
    factions:       deriveAllFactionProfiles(settlement),
    supplyChains:   deriveAllSupplyChainStates(settlement),
    conditions:     deriveAllActiveConditions(settlement),
    threats:        deriveAllThreatProfiles(settlement),
    hooks:          deriveAllStructuredHooks(settlement),
    clocks:         deriveEscalationClocks(settlement),
    districts:      deriveAllDistricts(settlement),
    contradictions: detectContradictions(settlement),
    entityCatalog:  entityCatalog(settlement),
    canonBreakdown: canonBreakdown(settlement),
  };
}

// ── Diagnostic helpers ───────────────────────────────────────────────────

/** Just the counts — useful for dev dashboard tiles.
 *  @param {import('./settlement.schema.js').SimSettlement} settlement */
export function devDebugCounts(settlement) {
  const d = /** @type {any} */ (deriveDevDebug(settlement));
  return {
    traces:        d.traces.total,
    factions:      d.factions.length,
    supplyChains:  d.supplyChains.length,
    conditions:    d.conditions.length,
    threats:       d.threats.length,
    hooks:         d.hooks.length,
    clocks:        d.clocks.length,
    districts:     d.districts.length,
    contradictions: d.contradictions.length,
    entities:      d.entityCatalog.length,
  };
}

/** Return only the traces that affect a specific entity id.
 *  @param {import('./settlement.schema.js').SimSettlement} settlement @param {any} entityId */
export function tracesForEntity(settlement, entityId) {
  // tracesFor filters getTraces by targetId regardless of targetType; the old
  // tracesByType(settlement, 'entity') filter matched a targetType no trace
  // ever carries, so this always returned [].
  return tracesFor(settlement, entityId);
}
