const T = process.argv[2];
const { birthConfig, loadGenerationLawPayloads } = await import(`${T}/src/domain/density/densityCreateBoundary.js`);
const { generateSettlementPipeline } = await import(`${T}/src/generators/generateSettlementPipeline.js`);
await loadGenerationLawPayloads();
const c = birthConfig({ settType: 'town' });
const s = generateSettlementPipeline(c, null, { seed: 'close-2-prove-lit', customContent: {} });
console.log(T.split('/').pop(), JSON.stringify({ seat: c._seatLawVersion, fortune: c._fortuneLawVersion, density: c._densityLawVersion, living: c._livingContentLawVersion, born: { seat: s.config?._seatLawVersion, fortune: s.config?._fortuneLawVersion } }));
