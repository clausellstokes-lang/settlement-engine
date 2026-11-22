// The chair's read of the three rebuilt Daily Life lines on a VISITOR-like pool (priorities randomized), two a size.
const L = process.argv[2];
const { generateSettlementPipeline } = await import(`${L}/src/generators/generateSettlementPipeline.js`);
const { birthConfig, loadGenerationLawPayloads } = await import(`${L}/src/domain/density/densityCreateBoundary.js`);
const { DEFAULT_CONFIG } = await import(`${L}/src/store/configSlice.js`);
const { deriveDailyLifeSlot } = await import(`${L}/src/domain/dailyLife.js`);
await loadGenerationLawPayloads();
for (const size of ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis']) for (const i of [11, 12, 13, 14]) {
  const seed = `chair8-visitor-${size}-${i}`;
  const rec = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size, _randomizePriorities: true }), null, { seed, customContent: {} });
  console.log(`\n== ${seed} · ${rec.name} · threat: ${rec.config?.monsterThreat ?? '?'} · tensions: ${(rec.history?.currentTensions ?? []).map((t) => t.type).join(',') || 'none'}`);
  for (const key of ['dawn_work', 'gathering_places', 'child_warnings']) console.log(`  ${key.padEnd(17)} ${deriveDailyLifeSlot(key, rec)?.text || '(empty)'}`);
}
