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
