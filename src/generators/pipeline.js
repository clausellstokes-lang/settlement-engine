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
 *   5. Steps can be individually re-run for the reactive update engine
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
 * @param {string}   [meta.phase]  — Logical phase grouping (for UI/debugging)
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
 * Run the full pipeline.
 *
 * @param {Object} initialContext — Seed context (config, toggles, importedNeighbour, etc.)
 * @param {Object} rng           — Root PRNG instance from createPRNG()
 * @param {Object} [options]
 * @param {Function} [options.onStep]  — Called after each step: (name, ctx, patch) => void
 * @param {string[]} [options.only]    — Run only these steps (+ their deps). For reactive re-runs.
 * @param {Object}   [options.ctx]     — Pre-populated context (for partial re-runs)
 * @returns {Object} Final accumulated context
 */
export function runPipeline(initialContext, rng, options = {}) {
  const { onStep, only, ctx: preCtx } = options;

  // Determine which steps to run
  let stepOrder = getStepOrder();

  if (only && only.length > 0) {
    // Collect the requested steps + all their transitive deps
    const needed = new Set();
    function collectDeps(name) {
      if (needed.has(name)) return;
      needed.add(name);
      const step = _steps.get(name);
      if (step) (step.deps || []).forEach(d => { if (_steps.has(d)) collectDeps(d); });
    }
    only.forEach(collectDeps);
    stepOrder = stepOrder.filter(n => needed.has(n));
  }

  // Accumulating context
  const ctx = { ...initialContext, ...(preCtx || {}) };

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

// ── Reactive helpers ─────────────────────────────────────────────────────────

/**
 * Given a set of changed context keys, return the minimal set of steps
 * that need to re-run (the changed keys' downstream dependents).
 *
 * @param {string[]} changedKeys — Context keys that changed
 * @returns {string[]} Step names to re-run (in pipeline order)
 */
export function getAffectedSteps(changedKeys) {
  const changedSet = new Set(changedKeys);
  const affected = new Set();

  // Build provides→step reverse map
  const providerMap = new Map();
  for (const [name, step] of _steps) {
    for (const key of step.provides || []) {
      providerMap.set(key, name);
    }
  }

  // For each step, check if any of its deps are in the changed set
  // or if any of its deps are provided by an affected step
  const order = getStepOrder();

  for (const name of order) {
    const step = _steps.get(name);
    const deps = step.deps || [];
    const isAffected = deps.some(d => changedSet.has(d)) ||
                       deps.some(d => {
                         const provider = providerMap.get(d);
                         return provider && affected.has(provider);
                       });
    if (isAffected) {
      affected.add(name);
      // Mark this step's outputs as changed too (cascade)
      (step.provides || []).forEach(k => changedSet.add(k));
    }
  }

  return order.filter(n => affected.has(n));
}

/**
 * Re-run only the affected steps, using an existing context as base.
 *
 * @param {Object}   existingCtx  — Full context from a previous run
 * @param {string[]} changedKeys  — Which context keys changed
 * @param {Object}   rng          — Root PRNG (same seed for determinism)
 * @param {Object}   [overrides]  — New values for the changed keys
 * @returns {Object} Updated context
 */
export function rerunAffected(existingCtx, changedKeys, rng, overrides = {}) {
  const stepsToRun = getAffectedSteps(changedKeys);
  if (stepsToRun.length === 0) return { ...existingCtx, ...overrides };

  return runPipeline(
    { ...existingCtx, ...overrides },
    rng,
    { only: stepsToRun, ctx: existingCtx }
  );
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
