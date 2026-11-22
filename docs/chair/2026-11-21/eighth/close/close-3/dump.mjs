import { writeFileSync } from 'node:fs';
const R = process.env.TREE + '/src/';
const { generateSettlementPipeline } = await import(R + 'generators/generateSettlementPipeline.js');
const { birthConfig, loadGenerationLawPayloads } = await import(R + 'domain/density/densityCreateBoundary.js');
await loadGenerationLawPayloads();
const out = {};
for (const seed of process.argv.slice(3)) { const settType = seed.split('-')[1]; out[seed] = generateSettlementPipeline(birthConfig({ settType }), null, { seed, customContent: {} }); }
writeFileSync(process.argv[2], JSON.stringify(out));
