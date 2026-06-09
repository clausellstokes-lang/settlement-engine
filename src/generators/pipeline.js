/**
 * pipeline.js — Settlement generation pipeline runner.
 *
 * Replaces the monolithic generateSettlement() with a sequence of named,
 * dependency-tracked steps that accumulate into a shared context object.
 *
 * Design goals:
 *   1. Each step is a pure-ish function: (ctx, rng) => patch
 *   2. Steps declare what they read (deps) and write (provides)
 *   3. The runner topologically sorts steps by dependency
 *   4. Each step gets a forked PRNG keyed to its name (deterministic isolation)
 *   5. Edits re-run the whole pipeline with the same seed (deterministic); a
 *      step-level partial-rerun engine was retired as a dead/buggy landmine.
 *
 * Strangler Fig: the old generateSettlement() runs as a single "legacy" step
 * initially. We extract phases one at a time, replacing the legacy step's
 * scope until it's empty and can be deleted.
 */

import { setActiveRng, clearActiveRng } from './rngContext.js';

// ── Step registry ────────────────────────────────────────────────────────────

const _steps = new Map();

/**
 * Register a pipeline step.
 *
 * @param {string}   name     — Unique step name (e.g. 'resolveTier')
 * @param {Object}   meta     — Step metadata
 * @param {string[]} meta.deps     — Names of steps this one reads from
 * @param {string[]} meta.provides — Context keys this step writes
 * @param {string}   [meta.phase]  - Logical phase grouping (for UI/debugging)
 * @param {Function} fn       — (ctx, rng) => Object  (patch to merge into ctx)
 */
export function registerStep(name, meta, fn) {
  if (_steps.has(name)) {
    throw new Error(`Pipeline step "${name}" already registered`);
  }
  _steps.set(name, { name, ...meta, fn });
}

/**
 * Return the ordered list of step names after topological sort.
 * Throws on cycles.
 */
export function getStepOrder() {
  const order = [];
  const visited = new Set();
  const visiting = new Set();

  function visit(name) {
    if (visited.has(name)) return;
    if (visiting.has(name)) {
      throw new Error(`Circular dependency in pipeline at step "${name}"`);
    }
    visiting.add(name);
    const step = _steps.get(name);
    if (!step) throw new Error(`Unknown pipeline step "${name}"`);
    for (const dep of step.deps || []) {
      // Only visit deps that are registered steps (context keys can come from initial seed)
      if (_steps.has(dep)) visit(dep);
    }
    visiting.delete(name);
    visited.add(name);
    order.push(name);
  }

  for (const name of _steps.keys()) visit(name);
  return order;
}

// ── Pipeline runner ──────────────────────────────────────────────────────────

/**
 * Run the full pipeline. Edits re-run the WHOLE pipeline with the same seed
 * (see settlementSlice.applyChange) — deterministic and correct. A step-level
 * partial-rerun engine used to live here (getAffectedSteps/rerunAffected) but it
 * was dead, untested, and buggy (it keyed on step names while callers think in
 * data keys, and its context merge clobbered the very overrides it was given), so
 * it was retired. The "reactive" need is already met two ways: derived state
 * (deriveSystemState / deriveCausalState / capacities / conditions) is recomputed
 * fresh on every read, and structural edits do a full same-seed regen. If true
 * step-level partial reruns are ever needed, build them on an explicit per-step
 * `reads`/`provides` data-dependency graph — not the old step-name model.
 *
 * @param {Object} initialContext — Seed context (config, toggles, importedNeighbour, etc.)
 * @param {Object} rng           — Root PRNG instance from createPRNG()
 * @param {Object} [options]
 * @param {Function} [options.onStep]  - Called after each step: (name, ctx, patch) => void
 * @returns {Object} Final accumulated context
 */
export function runPipeline(initialContext, rng, options = {}) {
  const { onStep } = options;
  const stepOrder = getStepOrder();

  // Accumulating context
  const ctx = { ...initialContext };

  for (const name of stepOrder) {
    const step = _steps.get(name);
    // Fork a PRNG for this step so it's deterministic regardless of step order changes
    const stepRng = rng.fork(name);
    // Set the global PRNG context so sub-generators (chance/pick/randInt)
    // automatically use the seeded PRNG instead of Math.random()
    setActiveRng(stepRng);
    try {
      const patch = step.fn(ctx, stepRng);
      if (patch && typeof patch === 'object') {
        Object.assign(ctx, patch);
      }
      if (onStep) onStep(name, ctx, patch);
    } finally {
      clearActiveRng();
    }
  }

  return ctx;
}

// ── Introspection ────────────────────────────────────────────────────────────

/** Get metadata for all registered steps (for debugging / UI). */
export function getStepMeta() {
  const result = [];
  for (const [name, step] of _steps) {
    result.push({
      name,
      deps: step.deps || [],
      provides: step.provides || [],
      phase: step.phase || 'unknown',
    });
  }
  return result;
}

/** Clear all registered steps (for testing). */
export function clearSteps() {
  _steps.clear();
}
