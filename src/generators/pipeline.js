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
 * Migration status: COMPLETE. The Strangler Fig extraction of the old monolithic
 * generateSettlement() finished — there is no longer a "legacy" catch-all step,
 * and this step pipeline is the sole generation path. (legacyGenerator.js only
 * derives historical "legacy annotations" for the dossier — it is unrelated to
 * the retired legacy generator despite the name.)
 */

import { setActiveRng, clearActiveRng } from './rngContext.js';

// ── Pipeline data-flow contract (strict mode) ────────────────────────────────
// The topo-sort orders steps by `deps` (step names), but the REAL data flow is the
// set of ctx keys each step writes — via its returned patch AND via in-place
// mutation of shared ctx objects (e.g. a step that mutates ctx.institutions while
// declaring provides:[]). That hidden write-set is what makes a reorder unsafe.
// Strict mode makes it explicit: after each step it detects every ctx key whose
// value changed and asserts the step DECLARED it (in provides ∪ mutates ∪ scratch).
// OFF by default (zero prod/gate cost — the deep snapshot is only taken in strict
// mode); enable per-call (`runPipeline(..., { strict:true })`), via the global
// `globalThis.__PIPELINE_STRICT__`, or collect violations with `onStrictViolation`.

function _ctxHash(value) {
  try { return JSON.stringify(value); } catch { return String(value); }
}

/** Snapshot current ctx keys → value-hash, for change detection under strict mode. */
function _snapshotCtx(ctx) {
  const snap = new Map();
  for (const k of Object.keys(ctx)) snap.set(k, _ctxHash(ctx[k]));
  return snap;
}

/**
 * Return the ctx keys a step CHANGED (added or value-mutated) that it did NOT
 * declare in provides ∪ mutates ∪ scratch. An empty array means the step's
 * declared write-set is honest.
 */
// The trace ledger is a sanctioned CROSS-CUTTING write: any step may call
// recordTrace(), which appends to ctx.simulationTrace and bumps ctx._traceClock.
// Exempting these two keys globally keeps the per-step contract about real data
// flow rather than forcing every traced step to redeclare the ledger.
const _LEDGER_KEYS = new Set(['_traceClock', 'simulationTrace']);

function _undeclaredWrites(step, before, ctx) {
  const declared = new Set([...(step.provides || []), ...(step.mutates || []), ...(step.scratch || []), ..._LEDGER_KEYS]);
  const offenders = [];
  for (const k of Object.keys(ctx)) {
    const had = before.has(k);
    if (!had || before.get(k) !== _ctxHash(ctx[k])) {
      if (!declared.has(k)) offenders.push(k);
    }
  }
  return offenders;
}

// ── Step registry ────────────────────────────────────────────────────────────

const _steps = new Map();

/**
 * Register a pipeline step.
 *
 * @param {string}   name     — Unique step name (e.g. 'resolveTier')
 * @param {Object}   meta     — Step metadata
 * @param {string[]} meta.deps     — Names of steps this one reads from
 * @param {string[]} meta.provides — Context keys this step writes via its returned patch
 * @param {string[]} [meta.reads]   - Ctx keys this step CONSUMES that another step produces (data-flow contract; strict mode asserts each is present before the step runs)
 * @param {string[]} [meta.mutates] - Existing ctx keys this step mutates IN PLACE (data-flow contract)
 * @param {string[]} [meta.scratch] - Internal/flag ctx keys this step sets (declared so strict mode stays quiet)
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
 * @param {boolean}  [options.strict]  - Throw if any step writes a ctx key it didn't declare (provides/mutates/scratch)
 * @param {Function} [options.onStrictViolation] - Collect undeclared writes instead of throwing: ({step, keys}) => void
 * @returns {Object} Final accumulated context
 */
export function runPipeline(initialContext, rng, options = {}) {
  const { onStep, onStrictViolation } = options;
  const strict = options.strict
    ?? (typeof globalThis !== 'undefined' && globalThis.__PIPELINE_STRICT__)
    ?? false;
  const stepOrder = getStepOrder();

  // Accumulating context
  const ctx = { ...initialContext };

  for (const name of stepOrder) {
    const step = _steps.get(name);
    // Fork a PRNG for this step so it's deterministic regardless of step order changes
    const stepRng = rng.fork(name);
    // Strict mode: snapshot before so we can detect undeclared writes.
    const before = (strict || onStrictViolation) ? _snapshotCtx(ctx) : null;
    // Strict mode: every declared `reads` key must already be
    // present in ctx — i.e. a prior step produced it. A read of a not-yet-produced
    // key means the run order is wrong (a step is scheduled before its producer).
    if (before) {
      const missing = (step.reads || []).filter(k => !(k in ctx));
      if (missing.length) {
        if (onStrictViolation) onStrictViolation({ step: name, kind: 'read', keys: missing });
        else throw new Error(
          `Pipeline strict: step "${name}" reads ctx key(s) [${missing.join(', ')}] not yet produced — `
          + 'the run order schedules it before a producer of those keys (fix deps or the reads declaration).',
        );
      }
    }
    // Set the global PRNG context so sub-generators (chance/pick/randInt)
    // automatically use the seeded PRNG instead of Math.random()
    setActiveRng(stepRng);
    try {
      const patch = step.fn(ctx, stepRng);
      if (patch && typeof patch === 'object') {
        Object.assign(ctx, patch);
      }
      if (before) {
        const undeclared = _undeclaredWrites(step, before, ctx);
        if (undeclared.length) {
          if (onStrictViolation) onStrictViolation({ step: name, keys: undeclared });
          else throw new Error(
            `Pipeline strict: step "${name}" wrote undeclared ctx key(s) [${undeclared.join(', ')}] — `
            + 'add them to the step\'s provides/mutates/scratch so the data-flow graph stays honest.',
          );
        }
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
      reads: step.reads || [],
      mutates: step.mutates || [],
      scratch: step.scratch || [],
      phase: step.phase || 'unknown',
    });
  }
  return result;
}

/** Clear all registered steps (for testing). */
export function clearSteps() {
  _steps.clear();
}
