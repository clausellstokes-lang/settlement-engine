// RUN (from the repository root): node docs/chair/2026-11-20/content/page/build/OUTPUT/reads.probe.mjs "$PWD" 50 census > reads.probe.out.txt
// PAGE-1 OUTPUT: the reader (src/domain/display/outputInWords.js) over the chair's 300 (hxd-<size>-<i>) and the census's 720
// (censusPlan('r2') through configOf): how many it reads, the share's words, and every line it prints with its count.
const L = process.argv[2];
const N = Number(process.argv[3] || 50);
const { generateSettlementPipeline } = await import(`${L}/src/generators/generateSettlementPipeline.js`);
const { birthConfig, loadGenerationLawPayloads } = await import(`${L}/src/domain/density/densityCreateBoundary.js`);
const { DEFAULT_CONFIG } = await import(`${L}/src/store/configSlice.js`);
const { SIZES, censusPlan, configOf } = await import(`${L}/tests/components/pageCensusWalk.shared.mjs`);
const { outputReading, outputInWords } = await import(`${L}/src/domain/display/outputInWords.js`);
await loadGenerationLawPayloads();
const tally = (a) => { const m = new Map(); for (const k of a) m.set(k, (m.get(k) || 0) + 1); return [...m].sort((x, y) => y[1] - x[1]); };
const rows = [];
for (const size of SIZES) for (let i = 0; i < N; i++) {
  const seed = `hxd-${size}-${i}`;
  const t = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed, customContent: {} });
  rows.push({ c: 'hxd', size, t });
}
if (process.argv[4] === 'census') for (const row of censusPlan('r2')) {
  const t = generateSettlementPipeline(configOf(row, DEFAULT_CONFIG, birthConfig), null, { seed: row.seed, customContent: {} });
  rows.push({ c: 'census', size: row.size, t });
}
for (const corpus of ['hxd', 'census']) {
  const rs = rows.filter((r) => r.c === corpus); if (!rs.length) continue;
  const rd = rs.map((r) => outputReading(r.t));
  console.log(`${corpus}: ${rs.length}; said ${rd.filter(Boolean).length}; null ${rd.filter((x) => !x).length}`);
  console.log('  share words', JSON.stringify(tally(rd.map((x) => x?.words))));
  console.log('  lines', JSON.stringify(tally(rs.map((r) => outputInWords(r.t)))));
  console.log('  share range', Math.min(...rd.filter(Boolean).map((x) => x.share)).toFixed(2), Math.max(...rd.filter(Boolean).map((x) => x.share)).toFixed(2));
}
