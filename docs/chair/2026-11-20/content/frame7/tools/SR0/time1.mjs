const R = process.argv[2];
const { generateSettlementPipeline } = await import(R + 'src/generators/generateSettlementPipeline.js');
let t=Date.now(); generateSettlementPipeline({ settType: 'town' }, null, { seed: 'hxd-town-0', customContent: {} }); console.log('first', Date.now()-t);
t=Date.now(); for (const sz of ['thorp','metropolis']) generateSettlementPipeline({ settType: sz }, null, { seed: `hxd-${sz}-1`, customContent: {} }); console.log('two', Date.now()-t);
