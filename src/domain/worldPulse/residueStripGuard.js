/**
 * residueStripGuard.js — a READ-ONLY, test-gated self-check that the pause path actually
 * stripped every deferred major's out-of-band residue (G, the closest safe reinforcement
 * toward a by-construction chokepoint).
 *
 * The RESIDUE_STRIP_SITES registry catches a strip that DRIFTS from the code; the
 * equivalence + sweep tests catch a leak under a tested scenario. This closes the
 * remaining gap for the KNOWN residue stores: on EVERY paused tick that runs under the
 * test suite, after all strips have run, it verifies that no deferred major left residue
 * in its store — GENERICALLY, keyed only off candidateType + targetSaveId. So a paused
 * tick in ANY test (not just the dedicated residue tests) self-verifies the invariant,
 * and a forgotten strip in an existing residue type trips the moment any test defers its
 * major — no bespoke assertion required.
 *
 * SAFETY / why this is not the risky kernel restructure:
 *   • It NEVER mutates state (pure read) → byte-neutral to the simulation output.
 *   • It runs ONLY under NODE_ENV==='test' (never in the browser, never in production,
 *     never in the soak's default run) → a mistaken check can only surface as a TEST
 *     failure, never a silent determinism corruption. A too-loose check is vacuous, a
 *     too-strict check reds a test — neither can ship a bug.
 *
 * It does NOT make banking-without-a-strip IMPOSSIBLE (that needs the deferred kernel
 * control-flow restructure). It makes a forgotten strip in the known stores LOUD.
 */

// The candidateTypes this guard checks — one per @residue-strip site. Exported so
// residueStripRegistry.test.js can assert it stays in lockstep with RESIDUE_STRIP_SITES
// (a new residue-banking layer must add BOTH a registry entry AND a guard check here).
export const GUARDED_RESIDUE_TYPES = Object.freeze([
  'war_mobilization', 'strategy_deploy', 'conquest', 'occupation_vassalized',
]);

/** True only in a Node test run (vitest sets NODE_ENV=test). Browser / prod / soak = off. */
function guardEnabled() {
  try {
    const p = /** @type {any} */ (globalThis).process;
    return !!(p && p.env && p.env.NODE_ENV === 'test');
  } catch {
    return false;
  }
}

/**
 * Per-candidateType residue checks, keyed off the suppressed major's targetSaveId — one
 * per @residue-strip site, mirroring what each strip removes. Returns a leak description
 * or null. A candidateType absent from this map is simply unchecked (the guard is a lower
 * bound: it never false-alarms, it only fails to notice an unmapped new store).
 * @param {any} worldState @param {any[]} channels
 */
function residueCheckers(worldState, channels) {
  const posture = worldState?.warPosture || {};
  const deployments = worldState?.deployments || {};
  const occupations = worldState?.occupations || {};
  const hasChannelFrom = (/** @type {string} */ type, /** @type {string} */ from) =>
    channels.some(c => c?.type === type && String(c?.from) === from);
  return {
    war_mobilization: (/** @type {string} */ target) => {
      if (posture[target] !== undefined) return `warPosture[${target}] survived`;
      if (hasChannelFrom('information_flow', target)) return `information_flow channel from ${target} survived`;
      return null;
    },
    strategy_deploy: (/** @type {string} */ target) => {
      if (deployments[target] !== undefined) return `deployments[${target}] survived`;
      if (hasChannelFrom('war_front', target)) return `war_front channel from ${target} survived`;
      return null;
    },
    conquest: (/** @type {string} */ target) =>
      (occupations[target] !== undefined ? `occupations[${target}] survived` : null),
    occupation_vassalized: (/** @type {string} */ target) =>
      (occupations[target]?.stage === 'vassalized' ? `occupations[${target}] left at the vassalized rung` : null),
  };
}

/**
 * Collect residue leaks for a paused tick (pure). Exported for direct unit testing.
 * @param {any} worldState @param {any} regionalGraph @param {any[]} deferredMajors
 * @returns {string[]}
 */
export function findResidueLeaks(worldState, regionalGraph, deferredMajors) {
  const channels = regionalGraph?.channels || [];
  const check = /** @type {Record<string, (t: string) => (string|null)>} */ (residueCheckers(worldState, channels));
  const leaks = [];
  for (const major of deferredMajors || []) {
    const fn = check[major?.candidateType];
    if (!fn || major?.targetSaveId == null) continue;
    const leak = fn(String(major.targetSaveId));
    if (leak) leaks.push(`${major.candidateType}(${major.id}): ${leak}`);
  }
  return leaks;
}

/**
 * Test-only assertion: throws if a paused tick left out-of-band residue. No-op everywhere
 * but a Node test run, and always read-only → byte-neutral to the simulation.
 * @param {any} worldState @param {any} regionalGraph @param {any[]} deferredMajors
 */
export function assertNoResidueLeak(worldState, regionalGraph, deferredMajors) {
  if (!guardEnabled()) return;
  const leaks = findResidueLeaks(worldState, regionalGraph, deferredMajors);
  if (leaks.length) {
    throw new Error(
      '[residue-strip] a PAUSED major left out-of-band residue — a strip was forgotten or drifted:\n  ' +
      leaks.join('\n  ') +
      '\nEvery residue-banking layer must strip on the pause path; see RESIDUE_STRIP_SITES in pulseKernel.js.',
    );
  }
}
