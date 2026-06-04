/**
 * domain/regenerationDelta.js - Structured diff between two settlements.
 *
 * Tier 5.1 of the roadmap. After a user change + rerun, the UI needs
 * to show what changed at every layer: substrate variables, capacity
 * supply/demand, daily-life prose, which entities were preserved /
 * added / removed. Phase 32 composes the existing comparators from
 * Phases 17, 18, 21, 22, 23 plus an entity-catalog set diff.
 *
 *   deriveRegenerationDelta(before, after) -> {
 *     directEffects:       SystemStateDelta[]      Phase 7
 *     rippleEffects:       CausalStateDelta[]      Phase 17
 *     capacityShifts:      CapacityDelta[]         Phase 21
 *     dailyLifeShifts:     DailyLifeDelta[]        Phase 22
 *     preservedCanon:      Reference[]
 *     brokenDependencies:  string[]
 *     newEntities:         Reference[]
 *     removedEntities:     Reference[]
 *     newOpportunities:    Reference[]   newEntities of type 'hook'
 *     newRisks:            Reference[]   newEntities of type 'threat' | 'condition' | 'clock'
 *     summary:             string[]
 *   }
 *
 * Pure read-only. The two settlements are never mutated.
 */

import { deriveSystemState } from './state/deriveSystemState.js';
import { compareSystemState } from './state/compareSystemState.js';
import { deriveCausalState, compareCausalState } from './causalState.js';
import { deriveAllCapacities, compareCapacityStates } from './capacityModel.js';
import { deriveDailyLife, compareDailyLife } from './dailyLife.js';
import { entityCatalog } from './explanation.js';

// ── Catalog diff ─────────────────────────────────────────────────────────

function catalogIndex(settlement) {
  const cat = entityCatalog(settlement);
  const byId = new Map();
  for (const e of cat) byId.set(e.id, e);
  return byId;
}

function diffEntityCatalogs(before, after) {
  const beforeMap = catalogIndex(before);
  const afterMap  = catalogIndex(after);

  const preserved = [];
  const added = [];
  const removed = [];

  for (const [id, entry] of afterMap) {
    if (beforeMap.has(id)) preserved.push(entry);
    else                   added.push(entry);
  }
  for (const [id, entry] of beforeMap) {
    if (!afterMap.has(id)) removed.push(entry);
  }
  return { preserved, added, removed };
}

// ── Composer ─────────────────────────────────────────────────────────────

/**
 * Diff two settlement snapshots into a structured regeneration delta.
 *
 * @param {Object} before
 * @param {Object} after
 * @returns {Object}
 */
export function deriveRegenerationDelta(before, after) {
  if (!before || !after) {
    return {
      directEffects: [],
      rippleEffects: [],
      capacityShifts: [],
      dailyLifeShifts: [],
      preservedCanon: [],
      brokenDependencies: [],
      newEntities: [],
      removedEntities: [],
      newOpportunities: [],
      newRisks: [],
      summary: [],
    };
  }

  // Layer 1: substrate diffs (already built helpers).
  const directEffects  = compareSystemState(deriveSystemState(before), deriveSystemState(after));
  const rippleEffects  = compareCausalState(deriveCausalState(before), deriveCausalState(after));
  const capacityShifts = compareCapacityStates(deriveAllCapacities(before), deriveAllCapacities(after));
  const dailyLifeShifts = compareDailyLife(deriveDailyLife(before), deriveDailyLife(after));

  // Layer 2: entity catalog diff.
  const { preserved, added, removed } = diffEntityCatalogs(before, after);

  // A "broken dependency" in Phase 32's lean form is a removed entity id
  // that a remaining (preserved) entity's references[] points to.
  // We don't run full reference walk here (would require explaining
  // every preserved entity, expensive); instead we just surface the
  // removed ids - consumers that need full link analysis can call
  // Phase 19 explainEntity on each.
  const brokenDependencies = removed.map(e => e.id);

  // Risk-vs-opportunity split on added entities.
  const newOpportunities = added.filter(e => e.type === 'hook');
  const newRisks = added.filter(e =>
    e.type === 'threat' || e.type === 'condition' || e.type === 'clock'
  );

  // Summary lines.
  const summary = [];
  if (directEffects.length === 0
   && rippleEffects.length === 0
   && capacityShifts.length === 0
   && dailyLifeShifts.length === 0
   && added.length === 0
   && removed.length === 0) {
    summary.push('No structural changes detected between the two snapshots.');
  } else {
    if (directEffects.length)  summary.push(`${directEffects.length} system-state shift(s).`);
    if (rippleEffects.length)  summary.push(`${rippleEffects.length} substrate variable change(s).`);
    if (capacityShifts.length) summary.push(`${capacityShifts.length} capacity shift(s).`);
    if (dailyLifeShifts.length) summary.push(`${dailyLifeShifts.length} daily-life slot(s) rewritten.`);
    if (added.length)   summary.push(`${added.length} new entity(s).`);
    if (removed.length) summary.push(`${removed.length} entity(s) removed.`);
    for (const d of directEffects)  summary.push(d.explanation);
    for (const d of rippleEffects)  summary.push(d.explanation);
    for (const d of capacityShifts) summary.push(d.explanation);
  }

  return {
    directEffects,
    rippleEffects,
    capacityShifts,
    dailyLifeShifts,
    preservedCanon: preserved,
    brokenDependencies,
    newEntities: added,
    removedEntities: removed,
    newOpportunities,
    newRisks,
    summary,
  };
}

// ── Diagnostic helpers ───────────────────────────────────────────────────

/** Total count of structural changes across all layers. */
export function regenerationDeltaSize(delta) {
  if (!delta) return 0;
  return (delta.directEffects?.length    || 0)
       + (delta.rippleEffects?.length    || 0)
       + (delta.capacityShifts?.length   || 0)
       + (delta.dailyLifeShifts?.length  || 0)
       + (delta.newEntities?.length      || 0)
       + (delta.removedEntities?.length  || 0);
}

/** Group new entities by type. Useful for "what's new" UI sections. */
export function newEntitiesByType(delta) {
  const out = {};
  for (const e of delta?.newEntities || []) {
    if (!out[e.type]) out[e.type] = [];
    out[e.type].push(e);
  }
  return out;
}
