const L = process.argv[2];
const { generateSettlementPipeline } = await import(`${L}/src/generators/generateSettlementPipeline.js`);
const { birthConfig, loadGenerationLawPayloads } = await import(`${L}/src/domain/density/densityCreateBoundary.js`);
const { DEFAULT_CONFIG } = await import(`${L}/src/store/configSlice.js`);
await loadGenerationLawPayloads();
const count = {}; const six = [];
for (const size of ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis']) for (let i = 0; i < 12; i++) {
  const rec = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed: `hxd-${size}-${i}`, customContent: {} });
  const t = rec.config?.monsterThreat; count[t] = (count[t] || 0) + 1; if (i === 3) six.push(`${size}:${t}`);
}
console.log('resolved monsterThreat over 72 births (12 a size, the lane\'s recipe):', JSON.stringify(count));
console.log('the six of the before-and-after:', six.join('  '));
console.log('DEFAULT_CONFIG.monsterThreat =', DEFAULT_CONFIG.monsterThreat);
