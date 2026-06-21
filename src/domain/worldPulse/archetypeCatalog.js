/**
 * domain/worldPulse/archetypeCatalog.js — the single import surface for condition
 * archetype ids plus the declarative war-layer groupings.
 *
 * The canonical catalog lives in activeConditions.js (CONDITION_ARCHETYPE_TEMPLATES,
 * surfaced via supportedConditionArchetypes). This module re-exports it AND names
 * the war-layer archetype groups so every consumer (warDeployment, populationDynamics
 * war sets, surfacing) imports ONE source of truth instead of re-typing the strings.
 * A typo in a group below is caught by archetypeRegistryConsistency.test (each group
 * must be ⊆ the catalog) — a build failure, not a silent no-op.
 */

import { supportedConditionArchetypes } from '../activeConditions.js';

export { supportedConditionArchetypes };

// The AGGRESSOR's home conditions stamped by a deployment. Every other war
// archetype models the victim; these model the cost of waging war. war_exhaustion
// is the NON-REVERTING scar — the lasting economic wound a long war leaves,
// distinct from the per-tick reverting war_drain. reinforcement_cost is the
// reverting per-tick bleed of feeding fresh manpower/coin/grain to a deployed army.
export const WAR_HOME_CONDITIONS = Object.freeze(['war_drain', 'army_deployed', 'war_exhaustion', 'reinforcement_cost']);

// Recovery conditions after a siege/occupation ends.
export const WAR_RECOVERY_CONDITIONS = Object.freeze(['occupation_lifted', 'siege_lifted']);

// Conditions borne by the settlement on the receiving end of war/subjugation.
export const WAR_VICTIM_CONDITIONS = Object.freeze(['war_pressure', 'vassal_extraction', 'rebellion']);

// The cost of marching relief to a besieged ally.
export const RELIEF_CONDITIONS = Object.freeze(['relief_burden', 'alliance_burden']);

// Every war-layer archetype, in one frozen list (validated against the catalog).
export const WAR_LAYER_ARCHETYPES = Object.freeze([
  ...WAR_HOME_CONDITIONS,
  ...WAR_RECOVERY_CONDITIONS,
  ...WAR_VICTIM_CONDITIONS,
  ...RELIEF_CONDITIONS,
]);

/**
 * @param {string} archetype
 * @returns {boolean}
 */
export function isWarLayerArchetype(archetype) {
  return WAR_LAYER_ARCHETYPES.includes(archetype);
}
