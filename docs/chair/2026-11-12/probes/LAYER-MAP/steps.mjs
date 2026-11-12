// LAYER-MAP steps.mjs — the pipeline's own declared data-flow (getStepMeta) as layers.
// Run: TREE=<tree> node steps.mjs   (prints JSON to stdout)
const R=(process.env.TREE||process.cwd())+'/src';
await import(R+'/generators/generateSettlementPipeline.js');
const { getStepMeta, getStepOrder } = await import(R+'/generators/pipeline.js');
const meta=getStepMeta(); const order=getStepOrder();
console.log(JSON.stringify({order, meta:meta.map(m=>({name:m.name,phase:m.phase,deps:m.deps,reads:m.reads,provides:m.provides,mutates:m.mutates,readsVersion:m.readsVersion}))},null,1));
