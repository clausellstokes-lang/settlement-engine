const [, , L, nA = '50'] = process.argv;
const { generateSettlementPipeline } = await import(`${L}/src/generators/generateSettlementPipeline.js`);
const { birthConfig, loadGenerationLawPayloads } = await import(`${L}/src/domain/density/densityCreateBoundary.js`);
const { DEFAULT_CONFIG } = await import(`${L}/src/store/configSlice.js`);
const { SIZES } = await import(`${L}/tests/components/pageCensusWalk.shared.mjs`);
await loadGenerationLawPayloads();
const by = new Map();
for (const size of SIZES) for (let i = 0; i < +nA; i++) { const t = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed: `hxd-${size}-${i}`, customContent: {} });
  for (const x of t.history?.currentTensions || []) { if (!by.has(x.type)) by.set(x.type, new Map()); const m = by.get(x.type); m.set(x.description, (m.get(x.description) || 0) + 1); } }
const rows = [...by].map(([k, m]) => [k, [...m.values()].reduce((a, c) => a + c * (c - 1) / 2, 0), Math.max(...m.values()), [...m.values()].reduce((a, b) => a + b), m.size]).sort((a, b) => b[1] - a[1]);
const tot = rows.reduce((a, r) => a + r[1], 0);
for (const r of rows) console.log(`${r[0].padEnd(22)} pairs ${String(r[1]).padStart(5)} (${(100 * r[1] / tot).toFixed(1)}%)  top ${r[2]}  n ${r[3]}  distinct ${r[4]}`);
