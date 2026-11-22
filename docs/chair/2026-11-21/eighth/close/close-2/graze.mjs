// usage: node graze.mjs <tree> <label>: births through birthConfig on <tree>; the baseline pressure sentence's share at thorp/hamlet/village, 150 a size
// (CLOSE-2, stop 1; DEFAULT_CONFIG at the size, seeds visitor-<size>-i: an APPROXIMATION of the visitor plan)
const [T, MODE] = process.argv.slice(2);
const { generateSettlementPipeline } = await import(`${T}/src/generators/generateSettlementPipeline.js`);
const { birthConfig, loadGenerationLawPayloads } = await import(`${T}/src/domain/density/densityCreateBoundary.js`);
const { DEFAULT_CONFIG } = await import(`${T}/src/store/configSlice.js`);
await loadGenerationLawPayloads();
for (const size of ['thorp', 'hamlet', 'village']) {
  const counts = {};
  for (let i = 0; i < 150; i++) {
    const cfg = { ...DEFAULT_CONFIG, settType: size };
    const s = generateSettlementPipeline(birthConfig(cfg), null, { seed: `visitor-${size}-${i}`, customContent: {} });
    const rc = String(s.powerStructure?.recentConflict || '').trim();
    counts[rc] = (counts[rc] || 0) + 1;
  }
  const top = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 3);
  console.log(`${MODE} ${size}: ` + top.map(([k, n]) => `${n}/150 "${k.slice(0, 70)}"`).join(' ; '));
}
