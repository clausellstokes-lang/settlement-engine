/**
 * enrich-loader.mjs — a Node ESM `load` hook that wraps `assembleSettlement`'s ENRICHMENT
 * functions IN MEMORY, so each stage's effect on the settlement object can be attributed.
 *
 * ⛔ THE TREE ON DISK IS NEVER TOUCHED. Two transformations, both textual and in memory:
 *   1. `export const NAME = ` → `export let NAME = ` for the arrow-function exports, so the
 *      binding becomes reassignable (an `export function` binding already is).
 *   2. an appended block that reassigns each named binding to a recording wrapper.
 * The wrapper records, per call: a deep clone of arg0 BEFORE, the return value, and a deep
 * clone of arg0 AFTER — which is what separates an in-place mutation from a returned patch.
 *
 * It also carries prng-loader's `createPRNG` census wrapper so one `--import` covers both.
 */

const TARGETS = new Map([
  ['/src/generators/narrativeGenerator.js', ['generatePressureSentence', 'generateArrivalScene', 'generateCoherence', 'enrichNpcCoherence', 'relinkFactionMembers']],
  ['/src/generators/factionRoles.js', ['ensureFactionStructuralNpcs']],
  ['/src/domain/normalizeSettlement.js', ['normalizeSettlement']],
  ['/src/domain/conditionPromotion.js', ['promoteStressorsToConditions', 'reapplyEventConditions']],
  ['/src/generators/power/economyReconciliation.js', ['reconcilePowerStructure', 'refreshPowerGenerationTraces']],
  ['/src/generators/density/applyDensityLaw.js', ['resizePoliticalRoster', 'disperseNamedRoster']],
  ['/src/generators/defenseGenerator.js', ['generateDefenseProfile']],
  ['/src/generators/generationCoherence.js', ['buildGenerationCoherenceReceipt']],
  ['/src/generators/stressNarrative.js', ['renderStressSummary']],
  ['/src/generators/npcGenerator.js', ['generateSettlementName']],
]);

function wrapperBlock(names) {
  const parts = names.map(n => `
{
  const __o_${n} = ${n};
  // eslint-disable-next-line no-func-assign
  ${n} = function (...args) {
    const ov = globalThis.__FN_OVERRIDE__;
    if (ov && typeof ov['${n}'] === 'function') return ov['${n}'](args, __o_${n});
    const c = globalThis.__ENRICH_CENSUS__;
    if (!c || !c.on) return __o_${n}.apply(this, args);
    const before = c.snap(args[0]);
    const ret = __o_${n}.apply(this, args);
    c.push({ fn: '${n}', before, after: c.snap(args[0]), ret: c.snap(ret), retIsArg0: ret === args[0] });
    return ret;
  };
}`);
  return parts.join('\n');
}

export async function load(url, context, nextLoad) {
  const result = await nextLoad(url, context);

  if (url.endsWith('/src/kernel/prng.js')) {
    const source = result.source.toString();
    return {
      ...result,
      shortCircuit: true,
      format: result.format,
      source: `${source}
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
      if (k === 'fork') { out[k] = (label) => { rec.forkLabels.push(String(label)); return inner.fork(label); }; continue; }
      out[k] = (...args) => { rec.calls += 1; rec.methods[k] = (rec.methods[k] || 0) + 1; return v(...args); };
    }
    return out;
  };
}
`,
    };
  }

  if (url.endsWith('/src/kernel/proseHash.js')) {
    const src = result.source.toString();
    return {
      ...result,
      shortCircuit: true,
      format: result.format,
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

  for (const [suffix, names] of TARGETS) {
    if (!url.endsWith(suffix)) continue;
    let src = result.source.toString();
    for (const n of names) {
      const needle = `export const ${n} = `;
      if (src.includes(needle)) src = src.replace(needle, `export let ${n} = `);
    }
    return {
      ...result,
      shortCircuit: true,
      format: result.format,
      source: `${src}\n// ── RECON LANE, LOADER-INJECTED ENRICHMENT CENSUS ──${wrapperBlock(names)}\n`,
    };
  }

  return result;
}
