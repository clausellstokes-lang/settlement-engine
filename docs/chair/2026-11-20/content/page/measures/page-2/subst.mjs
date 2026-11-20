const [, , L] = process.argv;
const { generateSettlementPipeline } = await import(`${L}/src/generators/generateSettlementPipeline.js`);
const { birthConfig, loadGenerationLawPayloads } = await import(`${L}/src/domain/density/densityCreateBoundary.js`);
const { DEFAULT_CONFIG } = await import(`${L}/src/store/configSlice.js`);
await loadGenerationLawPayloads();
const c = { wm: 0, wmBad: 0, wmEx: [], pb: 0, pbMerchClass: 0, cn: 0, cnNone: 0, cnTowns: 0 };
for (const size of ['thorp','hamlet','village','town','city','metropolis']) for (let i = 0; i < 50; i++) {
  const t = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed: `hxd-${size}-${i}`, customContent: {} });
  const cat = new Map((t.powerStructure?.factions || []).map((f) => [f.faction, f.category]));
  for (const x of t.history?.currentTensions || []) {
    if (x.type === 'economic_disparity') { c.wm++; const s = x.factions?.[0]; if (!cat.has(s) || cat.get(s) !== 'economy') { c.wmBad++; c.wmEx.push(`${size}: ${s} (${cat.get(s) ?? 'not a power'})`); } }
    if (x.type === 'succession_crisis') { c.pb++; const s = x.factions?.[2]; if (s === 'the merchant class' || (cat.has(s) && cat.get(s) !== 'economy' && false)) c.pbMerchClass++; }
    if (x.type === 'crime_wave') { c.cn++; if (x.factions?.[2] === 'the criminal network') { c.cnNone++; const cr = [...cat].filter(([, k]) => k === 'criminal').map(([n]) => n); if (cr.length) { c.cnTowns++; c.wmEx.push('crime: ' + cr.join('/')); } } }
  } }
console.log(JSON.stringify(c, null, 1));
