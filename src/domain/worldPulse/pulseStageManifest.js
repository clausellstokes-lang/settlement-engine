/**
 * Declarative topology of the composed one-week pulse.
 *
 * `pulseKernel.js` remains the execution authority. This manifest records the
 * causal phases that must remain ordered while the coordinator is extracted
 * incrementally. It is not a plugin registry: reordering a simulation by array
 * edit would make behavior too easy to change accidentally.
 *
 * A phase may move behind a function/module boundary only when its inputs and
 * outputs are explicit and the composed determinism/soak receipts remain
 * unchanged.
 */

export const PULSE_STAGE_MANIFEST_VERSION = 1;

export const PULSE_STAGE_TOPOLOGY = Object.freeze([
  Object.freeze({
    id: 'bootstrap',
    after: Object.freeze([]),
    owns: Object.freeze(['simulation rules', 'tick', 'calendar', 'rng', 'initial snapshot']),
    purpose: 'Normalize the incoming world and mint deterministic pulse identity.',
  }),
  Object.freeze({
    id: 'actor_memory',
    after: Object.freeze(['bootstrap']),
    owns: Object.freeze(['relationship states', 'npc states', 'faction states', 'political memory']),
    purpose: 'Age and update slow actor state before conditions and movers read it.',
  }),
  Object.freeze({
    id: 'condition_aging',
    after: Object.freeze(['actor_memory']),
    owns: Object.freeze(['stressor transitions', 'residual outcomes', 'graduations']),
    purpose: 'Advance existing pressures and convert resolved conditions into consequences.',
  }),
  Object.freeze({
    id: 'settlement_clock',
    after: Object.freeze(['condition_aging']),
    owns: Object.freeze(['local settlement copies', 'food and seasons', 'tick-state streaks']),
    purpose: 'Advance every member settlement without mutating persisted inputs.',
  }),
  Object.freeze({
    id: 'mover_planes',
    after: Object.freeze(['settlement_clock']),
    owns: Object.freeze(['war', 'trade', 'religion', 'spatial', 'institution', 'lifecycle planes']),
    purpose: 'Compose gated domain planes over the post-time realm.',
  }),
  Object.freeze({
    id: 'candidate_selection',
    after: Object.freeze(['mover_planes']),
    owns: Object.freeze(['candidate set', 'tempo budget', 'roll explanations']),
    purpose: 'Select deterministic and stochastic changes under the tempo budget.',
  }),
  Object.freeze({
    id: 'permission_and_apply',
    after: Object.freeze(['candidate_selection']),
    owns: Object.freeze(['major/minor partition', 'dismissal filter', 'proposals', 'applied outcomes']),
    purpose: 'Apply only outcomes authorized for the current advance mode.',
  }),
  Object.freeze({
    id: 'consequence_fold',
    after: Object.freeze(['permission_and_apply']),
    owns: Object.freeze(['memory ratchets', 'news', 'secondary ledgers', 'settlement projections']),
    purpose: 'Fold landed outcomes through dependent consequence and explanation planes.',
  }),
  Object.freeze({
    id: 'finalize_receipt',
    after: Object.freeze(['consequence_fold']),
    owns: Object.freeze(['pulse history', 'provenance', 'residue assertion', 'return envelope']),
    purpose: 'Commit the immutable pulse receipt and expose the next-state envelope.',
  }),
]);
