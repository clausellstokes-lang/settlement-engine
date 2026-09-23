// src/domain/edit/tracePartition.js — PURE. No branch on ambient state, no import from
// src/generators, src/store or src/lib; one import, ./recordRegister.js, so the HELD class is
// READ FROM ITS PRODUCER and never re-typed here (EM-R0a's law).
//
// THE PARTITION (design §22 ruling 8, as §22.1 correction 4 amends it). `simulationTrace` is a
// generation receipt partitioned BY STEP: a step whose entries are ABOUT a held key re-emits
// nothing that counts and its RECORDED entries are carried; every other step's entries are the
// re-derivation's own. With no held key the function returns the re-derivation's own array by
// identity, so plain generation and every golden fixture are untouched.
//
// WHY A STEP'S RUN AND NOT A LEAF. Measured over the 63-row structured sample at the base:
// every entry carries its step (4,810 of 4,810), every step's entries form ONE contiguous run
// (63 of 63 rows), and the deterministic clock IS the entry's position (ts equals index, 4,810
// of 4,810). A run is therefore the smallest unit that can be substituted without inventing an
// order, and the output's clock is re-stamped to the output position.

import { RECORD_CLASSES } from './recordRegister.js';

/** @typedef {{ step?: string, targetType?: string, targetId?: string, result?: string, ts?: number }} TraceLike */

/** The registered pipeline steps, in the runner's topological order, measured at the base. A
 *  domain module may not import the runner, so the order is DECLARED here and the acceptance
 *  arm holds it equal to `getStepOrder()`, which a test may import from both sides. */
export const TRACE_STEP_ORDER = Object.freeze([
  'resolveConfig', 'buildGenerationContext', 'resolveResources', 'resolveStress',
  'resolveNeighbour', 'assembleInstitutions', 'subsumptionPass', 'cascadePass',
  'isolationPass', 'stressConfirmPass', 'generateEconomy', 'generatePower',
  'neighbourFactions', 'factionCorrelationPass', 'coherenceRepairPass',
  'economyReconcilePass', 'powerEconomyReconcilePass', 'structuralValidationPass',
  'generatePopulation', 'corruptionPass', 'generateNarratives', 'assembleSettlement',
]);

/** THE SUBJECT REGISTER: which RECORD KEY an entry is about, keyed `step::targetType`. Total in
 *  both directions at the base: every one of the 47 `recordTrace(` call sites under
 *  src/generators spells a pair in this table, and every entry the corpus emits resolves here.
 *  @type {Readonly<Record<string, string>>} */
export const TRACE_SUBJECTS = Object.freeze({
  'assembleInstitutions::institution': 'institutions',
  'subsumptionPass::institution': 'institutions',
  'cascadePass::institution': 'institutions',
  'isolationPass::institution': 'institutions',
  'factionCorrelationPass::institution': 'institutions',
  'coherenceRepairPass::institution': 'institutions',
  'generatePopulation::npc': 'npcs',
  'generatePopulation::faction': 'factions',
  'corruptionPass::npc': 'npcs',
  'generatePower::faction': 'powerStructure',
  'neighbourFactions::faction': 'powerStructure',
  'isolationPass::condition': 'isolationSupport',
  'isolationPass::stressor': 'stress',
  'coherenceRepairPass::condition': 'isolationSupport',
  'resolveConfig::condition': 'config',
  'resolveConfig::threat': 'config',
  'resolveNeighbour::condition': 'neighborRelationship',
  'resolveResources::resource': 'config',
  'resolveStress::stressor': 'stress',
  'stressConfirmPass::stressor': 'stress',
  'generateEconomy::supply_chain': 'economicState',
  'economyReconcilePass::supply_chain': 'economicState',
  'generateNarratives::history': 'history',
  'generateNarratives::resource': 'resourceAnalysis',
});

/** THE TWO MIXED STEPS, declared with what a whole-run carry freezes. A run is the substitution
 *  unit, so a step that also emits entries about a READING freezes those entries while it is
 *  carried. Measured over the corpus: isolationPass emits 7 such entries in 63 rows,
 *  coherenceRepairPass none there. EM-R7 re-measures both over the edit corpus.
 *  @type {Readonly<Record<string, readonly string[]>>} */
export const MIXED_TRACE_STEPS = Object.freeze({
  isolationPass: Object.freeze(['isolationSupport', 'stress']),
  coherenceRepairPass: Object.freeze(['isolationSupport']),
});

/** @type {readonly string[]} */
const HELD_RECORD_KEYS = Object.freeze(
  Object.entries(RECORD_CLASSES).filter(([, cls]) => cls === 'HELD').map(([key]) => key),
);

/** @param {Set<string>|readonly string[]|null|undefined} value @returns {Set<string>} */
function asSet(value) {
  if (value instanceof Set) return value;
  return new Set(Array.isArray(value) ? value : []);
}

/** The record key an entry is about, or null when the pair is undeclared.
 *  @param {TraceLike|null|undefined} entry @returns {string|null} */
export function traceSubjectKey(entry) {
  if (!entry || typeof entry !== 'object') return null;
  const pair = `${entry.step}::${entry.targetType}`;
  return Object.prototype.hasOwnProperty.call(TRACE_SUBJECTS, pair) ? TRACE_SUBJECTS[pair] : null;
}

/** The steps whose recorded entries are CARRIED, given the keys the caller declares held. The
 *  caller's set is filtered through the class register, so a key the partial-pin rule forced
 *  into the bag without being HELD can never freeze a reading's account.
 *  @param {Set<string>|readonly string[]|null|undefined} heldKeys @returns {Set<string>} */
export function carriedTraceSteps(heldKeys) {
  const declared = asSet(heldKeys);
  const held = new Set(HELD_RECORD_KEYS.filter(key => declared.has(key)));
  const steps = new Set();
  for (const pair of Object.keys(TRACE_SUBJECTS)) {
    if (held.has(TRACE_SUBJECTS[pair])) steps.add(pair.slice(0, pair.indexOf('::')));
  }
  return steps;
}

/** @param {readonly TraceLike[]|null|undefined} entries @returns {Map<string, TraceLike[]>} */
function groupByStep(entries) {
  /** @type {Map<string, TraceLike[]>} */
  const groups = new Map();
  for (const entry of Array.isArray(entries) ? entries : []) {
    const step = entry && typeof entry.step === 'string' ? entry.step : '';
    const run = groups.get(step);
    if (run) run.push(entry); else groups.set(step, [entry]);
  }
  return groups;
}

/**
 * The partitioned trace for one re-derivation.
 * @param {readonly TraceLike[]|null|undefined} recordedTrace the record's own simulationTrace
 * @param {readonly TraceLike[]|null|undefined} derivedTrace the re-derivation's simulationTrace
 * @param {Set<string>|readonly string[]|null|undefined} heldKeys the keys declared held
 * @returns {readonly TraceLike[]} the derived array itself when nothing is held, else a new one
 */
export function partitionTrace(recordedTrace, derivedTrace, heldKeys) {
  const derived = Array.isArray(derivedTrace) ? derivedTrace : [];
  const carried = carriedTraceSteps(heldKeys);
  if (carried.size === 0) return derived;
  const recordedGroups = groupByStep(recordedTrace);
  const derivedGroups = groupByStep(derived);
  /** @type {TraceLike[]} */
  const out = [];
  for (const step of TRACE_STEP_ORDER) {
    const take = carried.has(step);
    const run = take ? recordedGroups.get(step) : derivedGroups.get(step);
    if (!run) continue;
    for (const entry of run) out.push(take ? structuredClone(entry) : entry);
  }
  const known = new Set(TRACE_STEP_ORDER);
  for (const [step, run] of recordedGroups) {
    if (known.has(step)) continue;
    for (const entry of run) out.push(structuredClone(entry));
  }
  for (const [step, run] of derivedGroups) {
    if (known.has(step) || recordedGroups.has(step)) continue;
    for (const entry of run) out.push(entry);
  }
  return out.map((entry, index) => ({ ...entry, ts: index }));
}
