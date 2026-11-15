// ORDER-MEASURE-1 · C2a's stream check: the re-run on createPRNG(seed).fork('generateNarratives') reproduces step 20 exactly when the roster is the same
// CFG=<CENSUS-3>/seedcfg.mjs node c2a-stream.mjs <c2a tree> <seed...>
const { makeCfgFor } = await import(process.env.CFG);
const R = process.argv[2] + '/src';
const { generateSettlementPipeline } = await import(R + '/generators/generateSettlementPipeline.js');
const { narrativesOf } = await import(R + '/generators/steps/generateNarratives.js');
const { createPRNG } = await import(R + '/kernel/prng.js'); const { setActiveRng, clearActiveRng } = await import(R + '/kernel/rngContext.js');
const { birthConfig, loadGenerationLawPayloads } = await import(R + '/domain/density/densityCreateBoundary.js');
const { DEFAULT_CONFIG } = await import(R + '/store/configSlice.js'); await loadGenerationLawPayloads();
let same = 0, diff = 0;
for (const seed of process.argv.slice(3)) {
  let snap = null, re = null;
  generateSettlementPipeline(makeCfgFor(birthConfig, DEFAULT_CONFIG)(seed), null, { seed, customContent: {}, onStep: (name, ctx) => {
    if (name !== 'generateNarratives') return; snap = JSON.stringify(ctx.history);
    const prev = setActiveRng(createPRNG(ctx._seed).fork('generateNarratives')); try { re = JSON.stringify(narrativesOf({ ...ctx, simulationTrace: [] }).history); } finally { clearActiveRng(prev); } } });
  if (snap === re) same++; else diff++;
}
console.log('same', same, 'differ', diff);
