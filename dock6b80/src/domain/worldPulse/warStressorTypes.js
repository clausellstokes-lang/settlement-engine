/**
 * domain/worldPulse/warStressorTypes.js — the WAR-type stressor vocabulary,
 * isolated in a dependency-free leaf module.
 *
 * These are the stressor types that read as an external war footing (a siege,
 * an ongoing wartime, a foreign occupation, a betrayal). stressorDynamics
 * re-exports this for its world-pulse war logic, and domain/events/mutate
 * imports it directly to detect a war stressor's optional instigating neighbour
 * (#1: siege/occupation instigator → hostile) WITHOUT pulling the heavy
 * stressorDynamics module (and its regional-graph dependency chain) into the
 * event-mutation load graph — importing it there created a cycle that left a
 * partially-initialized condition-promotion module.
 */
export const WAR_STRESSOR_TYPES = Object.freeze(['siege', 'wartime', 'occupation', 'betrayal']);

// #3 — INFILTRATION-type stressors. Kept DELIBERATELY OUT of WAR_STRESSOR_TYPES so
// an authored infiltration does NOT trigger the cross-settlement war-deployment path
// (#2): espionage sours a relationship, it does not march an army. Like the war
// stressors it accepts an optional instigating neighbour, but the souring is LIGHTER
// and DM-configurable (rival / cold_war / hostile, default rival) rather than the war
// stressors' flat hostile.
export const INFILTRATION_STRESSOR_TYPES = Object.freeze(['infiltrated']);

// The relationships an infiltration may sour an instigator to, ordered along the
// adversarial axis (neutral < rival < cold_war < hostile). Used to validate the
// authored pick and to gate the no-downgrade rule in applyStressor.
export const INFILTRATION_TARGET_RELATIONSHIPS = Object.freeze(['rival', 'cold_war', 'hostile']);
