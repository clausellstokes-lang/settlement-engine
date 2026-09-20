/**
 * prng-loader.mjs — a Node ESM `load` hook that wraps `createPRNG` IN MEMORY.
 *
 * ⛔ THE TREE ON DISK IS NEVER TOUCHED. The hook appends a reassignment of the module-scope
 * `createPRNG` binding (an `export function` binding is mutable and its export is live), so
 * EVERY minted stream is observed — including a stream minted from a seed STRING that was
 * copied off a fork (`createPRNG(intent.rngSeed)`), which a fork-proxy instrument cannot see.
 *
 * Attribution is BY SEED PREFIX: the runner mints `${root}::${step}` per step and `fork`
 * renders `${seed}::${label}`, so a stream's seed names the step whose subtree it descends
 * from, however it was minted.
 */
export async function load(url, context, nextLoad) {
  const result = await nextLoad(url, context);
  if (url.endsWith('/src/kernel/proseHash.js')) {
    const src = result.source.toString();
    return {
      ...result,
      format: result.format,
      shortCircuit: true,
      source: `${src}
{
  const __origPick = pickVariant;
  // eslint-disable-next-line no-func-assign
  pickVariant = function (pool, seed) {
    const c = globalThis.__PROSEHASH_CENSUS__;
    if (c) c.push({ seed: seed === undefined ? '\\u0000undefined' : String(seed), poolLen: Array.isArray(pool) ? pool.length : -1 });
    return __origPick(pool, seed);
  };
}
`,
    };
  }
  if (!url.endsWith('/src/kernel/prng.js')) return result;
  const source = result.source.toString();
  const patched = `${source}
// ── RECON LANE, LOADER-INJECTED ──────────────────────────────────────────────
{
  const __orig = createPRNG;
  // eslint-disable-next-line no-func-assign
  createPRNG = function (seed) {
    const inner = __orig(seed);
    const census = globalThis.__PRNG_CENSUS__;
    if (!census) return inner;
    const rec = census.mint(String(seed));
    const out = {};
    for (const k of Object.keys(inner)) {
      const v = inner[k];
      if (typeof v !== 'function') { out[k] = v; continue; }
      if (k === 'fork') {
        out[k] = (label) => { rec.forkLabels.push(String(label)); return inner.fork(label); };
        continue;
      }
      out[k] = (...args) => {
        rec.calls += 1;
        rec.methods[k] = (rec.methods[k] || 0) + 1;
        return v(...args);
      };
    }
    return out;
  };
}
`;
  return { ...result, source: patched, shortCircuit: true, format: result.format };
}
