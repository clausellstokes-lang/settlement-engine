/**
 * harness.mjs — the TIER-1 instrument, which needs NO module mock at all.
 *
 * `runPipeline(initialContext, rng, options)` takes the root PRNG as an ARGUMENT, and
 * `pipeline.js:229` calls `setActiveRng(stepRng)` with the object the root's `fork` returned,
 * so a test-side counting proxy over the root sees every channel a step's own stream carries —
 * including the ambient `kernel/rngContext.js` channel and every `.fork(` receiver spelling.
 *
 * SHAPE COPIED FROM: tests/generators/pipelinePinnedMode.test.js (`countingStream`,
 * `instrumentedRoot`, `runHeadless`), extended to every step and to recursive sub-forks.
 */
export const TREE = process.env.EMP2_TREE;

process.chdir(TREE);

const { createPRNG } = await import(`${TREE}/src/kernel/prng.js`);
const { runPipeline, getStepMeta, getStepOrder } = await import(`${TREE}/src/generators/pipeline.js`);
const { generateSettlementPipeline } = await import(`${TREE}/src/generators/generateSettlementPipeline.js`);
const { withCustomContent } = await import(`${TREE}/src/lib/dependencyEngine.js`);
const { resolveConfigWithUserContentTunables } = await import(`${TREE}/src/domain/content/userContentTunables.js`);

export { createPRNG, runPipeline, getStepMeta, getStepOrder, generateSettlementPipeline, withCustomContent };

const newRecord = () => ({ random: 0, other: 0, draws: 0, forkLabels: [], methods: {}, maxDepth: 0 });

function wrapStream(base, rec, depth) {
  if (depth > rec.maxDepth) rec.maxDepth = depth;
  const proxy = {};
  for (const key of Object.keys(base)) {
    const value = base[key];
    if (typeof value !== 'function') { proxy[key] = value; continue; }
    if (key === 'fork') {
      proxy[key] = (label) => { rec.forkLabels.push(String(label)); return wrapStream(value(label), rec, depth + 1); };
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

export function instrumentedRoot(seed, opts = {}) {
  const perturbStep = opts.perturbStep ?? null;
  const base = createPRNG(seed);
  const perStep = new Map();
  const root = {};
  for (const key of Object.keys(base)) {
    const value = base[key];
    if (typeof value !== 'function') { root[key] = value; continue; }
    if (key === 'fork') continue;
    root[key] = (...args) => value(...args);
  }
  root.fork = (label) => {
    const rec = newRecord();
    perStep.set(String(label), rec);
    const child = (perturbStep !== null && String(label) === perturbStep)
      ? base.fork(`${label}::perturbed`)
      : base.fork(label);
    return wrapStream(child, rec, 0);
  };
  return { root, perStep };
}

export function initialContextFor(row) {
  const { _seed, ...cfg } = row;
  return {
    config: resolveConfigWithUserContentTunables({ ...cfg }, {}),
    importedNeighbour: null,
    _seed,
    _traceClock: 0,
  };
}

export function runHeadless(row, rng, options = {}) {
  return withCustomContent({}, () => runPipeline(initialContextFor(row), rng, options));
}
