// ⛔ HAZARD (measured 2026-09-19 by RECON-G): this module does process.chdir(TREE) AT IMPORT — a harness that writes to a RELATIVE path writes INTO THE READ TREE other lanes read. Write every output through an ABSOLUTE path under your own scratch dir, and re-check the read tree's git status is empty when you finish.
/**
 * instrument.mjs — the RECON lane's counting-stream instrument (M1).
 *
 * A counting root PRNG: every `fork` (recursively, at any depth) returns a counting proxy
 * that records, per STEP (the top-level fork label the runner uses), raw `random()` calls,
 * other method calls, and the sub-fork labels used.
 *
 * The AMBIENT channel lands here by construction: the runner calls `setActiveRng(stepRng)`
 * with the object THIS returns, so every `kernel/rngContext.js` helper funnels through the
 * proxy's `random()`.
 *
 * Idiom copied from tests/generators/pipelinePinnedMode.test.js (`countingStream`,
 * `instrumentedRoot`, `withAmbientCounter`), extended to (a) every step, not just
 * generatePopulation, and (b) recursive sub-forks.
 */
export const TREE = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/923472dc-319b-4b73-9e42-fa911739df78/scratchpad/read-tip-a41a0e109';

process.chdir(TREE);

const { createPRNG } = await import(`${TREE}/src/kernel/prng.js`);
const { runPipeline, getStepMeta, getStepOrder } = await import(`${TREE}/src/generators/pipeline.js`);
const { generateSettlementPipeline } = await import(`${TREE}/src/generators/generateSettlementPipeline.js`);
const { withCustomContent } = await import(`${TREE}/src/lib/dependencyEngine.js`);
const { resolveConfigWithUserContentTunables } = await import(`${TREE}/src/domain/content/userContentTunables.js`);
const rngContext = await import(`${TREE}/src/kernel/rngContext.js`);

export { createPRNG, runPipeline, getStepMeta, getStepOrder, generateSettlementPipeline, withCustomContent, resolveConfigWithUserContentTunables, rngContext };

function newRecord() {
  return { random: 0, other: 0, draws: 0, forkLabels: [], methods: {}, maxDepth: 0 };
}

/** Wrap ONE stream object so every method call is counted into `rec`; forks wrap recursively. */
function wrapStream(base, rec, depth) {
  if (depth > rec.maxDepth) rec.maxDepth = depth;
  const proxy = {};
  for (const key of Object.keys(base)) {
    const value = base[key];
    if (typeof value !== 'function') { proxy[key] = value; continue; }
    if (key === 'fork') {
      proxy[key] = (label) => {
        rec.forkLabels.push(String(label));
        return wrapStream(value(label), rec, depth + 1);
      };
    } else if (key === 'random') {
      proxy[key] = (...args) => { rec.random += 1; rec.draws += 1; return value(...args); };
    } else {
      proxy[key] = (...args) => {
        rec.other += 1; rec.draws += 1;
        rec.methods[key] = (rec.methods[key] || 0) + 1;
        return value(...args);
      };
    }
  }
  return proxy;
}

/**
 * A root PRNG whose per-step forks are counting proxies.
 * @param {string} seed
 * @param {{perturbStep?: string|null}} [opts] — when `perturbStep` is a step name, the root's
 *   fork for THAT step returns `base.fork(name + '::perturbed')`; every other step forks
 *   normally, so the perturbed step's INPUTS are identical and only its own stream moved.
 */
export function instrumentedRoot(seed, opts = {}) {
  const perturbStep = opts.perturbStep ?? null;
  const base = createPRNG(seed);
  const perStep = new Map();
  const rootRec = newRecord();
  const root = {};
  for (const key of Object.keys(base)) {
    const value = base[key];
    if (typeof value !== 'function') { root[key] = value; continue; }
    if (key === 'fork') continue;
    root[key] = (...args) => { rootRec.draws += 1; rootRec.other += 1; return value(...args); };
  }
  root.fork = (label) => {
    const rec = newRecord();
    perStep.set(String(label), rec);
    const child = (perturbStep !== null && String(label) === perturbStep)
      ? base.fork(`${label}::perturbed`)
      : base.fork(label);
    return wrapStream(child, rec, 0);
  };
  return { root, perStep, rootRec };
}

/** The initial context `generateSettlementPipeline` builds, so a direct runner call is honest. */
export function initialContextFor(row) {
  const { _seed, ...cfg } = row;
  return {
    config: resolveConfigWithUserContentTunables({ ...cfg }, {}),
    importedNeighbour: null,
    _seed,
    _traceClock: 0,
  };
}

/** Run the REAL registered pipeline headlessly over a corpus row. */
export function runHeadless(row, rng, options = {}) {
  return withCustomContent({}, () => runPipeline(initialContextFor(row), rng, options));
}

export function ser(v) {
  try { return JSON.stringify(v); } catch { return String(v); }
}
