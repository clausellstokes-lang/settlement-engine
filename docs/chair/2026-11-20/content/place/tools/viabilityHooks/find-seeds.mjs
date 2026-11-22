// PLACE-1 MEASURE, viabilityHooks, section 0 step 1: which r2 rows hold economicViability.plotHooks[] (adapted from
// ../entrepotNote/find-seeds.mjs). Usage (repo root):
//   node docs/chair/2026-11-20/content/place/tools/viabilityHooks/find-seeds.mjs <repo> > docs/chair/2026-11-20/content/place/tools/viabilityHooks/out/find-seeds.txt
const [, , L] = process.argv;
const { generateSettlementPipeline } = await import(`${L}/src/generators/generateSettlementPipeline.js`);
const { birthConfig, loadGenerationLawPayloads } = await import(`${L}/src/domain/density/densityCreateBoundary.js`);
const { DEFAULT_CONFIG } = await import(`${L}/src/store/configSlice.js`);
const { configOf, censusPlan } = await import(`${L}/tests/components/pageCensusWalk.shared.mjs`);
await loadGenerationLawPayloads();
const plan = censusPlan('r2').filter((r) => Number(r.seed.split('-').pop()) < 8);
for (const row of plan) {
  const t = generateSettlementPipeline(configOf(row, DEFAULT_CONFIG, birthConfig), null, { seed: row.seed, customContent: {} });
  const hooks = t.economicViability?.plotHooks || [];
  if (!hooks.length) continue;
  console.log(`${row.seed} (${row.size}${row.crisis ? `, crisis ${row.crisis}` : ''}): ${hooks.length} hook(s)`);
  for (const h of hooks) console.log(`   [${h.category} / ${h.severity}] ${String(h.hook).slice(0, 110)}`);
}
