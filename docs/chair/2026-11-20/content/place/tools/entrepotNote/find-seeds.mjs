// PLACE-1 MEASURE, entrepotNote, section 0 step 1: which r2 calm rows (town, city) hold activeChains[].entrepotNote,
// and of those how many chains meet EconomicsTab's print gate (chain.entrepot && chain.entrepotNote && !chain.dependency).
// Usage (repo root): node docs/chair/2026-11-20/content/place/tools/entrepotNote/find-seeds.mjs <repo> > <dir>/out/find-seeds.txt
const [, , L] = process.argv;
const { generateSettlementPipeline } = await import(`${L}/src/generators/generateSettlementPipeline.js`);
const { birthConfig, loadGenerationLawPayloads } = await import(`${L}/src/domain/density/densityCreateBoundary.js`);
const { DEFAULT_CONFIG } = await import(`${L}/src/store/configSlice.js`);
const { configOf, censusPlan } = await import(`${L}/tests/components/pageCensusWalk.shared.mjs`);
await loadGenerationLawPayloads();
const plan = censusPlan('r2').filter((r) => !r.crisis && (r.size === 'town' || r.size === 'city')).filter((r) => Number(r.seed.split('-').pop()) < 6);
for (const row of plan) {
  const t = generateSettlementPipeline(configOf(row, DEFAULT_CONFIG, birthConfig), null, { seed: row.seed, customContent: {} });
  const ch = t.economicState?.activeChains || [];
  const held = ch.filter((c) => c.entrepotNote);
  const gate = held.filter((c) => c.entrepot && !c.dependency);
  console.log(`${row.seed}: chains ${ch.length}, hold note ${held.length}, pass print gate ${gate.length} [${gate.map((c) => c.chainId || c.id).join(',')}]`);
}
