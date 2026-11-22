// PLACE-1 · viability MEASURE, SECTION 0: which census rows (`censusPlan('r2')`, the rendered corpus) hold a viability warning
// OTHER than the 'Trade Dependencies' note, so section 0 can render one and see whether such a row prints.
//   node scan-r2.mjs <repo> [first=40] > scan-r2.out.txt
const [, , L, firstArg = '40'] = process.argv;
const { generateSettlementPipeline } = await import(`${L}/src/generators/generateSettlementPipeline.js`);
const { birthConfig, loadGenerationLawPayloads } = await import(`${L}/src/domain/density/densityCreateBoundary.js`);
const { DEFAULT_CONFIG } = await import(`${L}/src/store/configSlice.js`);
const { censusPlan, configOf } = await import(`${L}/tests/components/pageCensusWalk.shared.mjs`);
const { isViabilityItem } = await import(`${L}/src/domain/display/viabilityFilter.js`);
await loadGenerationLawPayloads();
const rows = censusPlan('r2').filter((r) => r.crisis === null && ['town', 'city'].includes(r.size)).filter((r) => +r.seed.split('-').pop() < +firstArg);
const titles = new Map();
for (const row of rows) {
  const t = generateSettlementPipeline(configOf(row, DEFAULT_CONFIG, birthConfig), null, { seed: row.seed, customContent: {} });
  for (const w of t.economicViability?.warnings || []) {
    const k = `${w.title} | routed to the Outlook tab: ${isViabilityItem(w)}`;
    if (!titles.has(k)) titles.set(k, []);
    titles.get(k).push(row.seed);
  }
}
for (const [k, seeds] of titles) console.log(`${seeds.length} ${k} :: ${seeds.slice(0, 4).join(',')}`);
