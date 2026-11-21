// The chair's own read of Daily Life on six places, one a size (2026-11-21). Usage: node six.mjs <tree root> <index>
// Births by the lane's own recipe (measures/B2/measure.b2.mjs): birthConfig(DEFAULT_CONFIG + size), seed hxd-<size>-<i>.
const L = process.argv[2]; const I = process.argv[3] ?? '3';
const { generateSettlementPipeline } = await import(`${L}/src/generators/generateSettlementPipeline.js`);
const { birthConfig, loadGenerationLawPayloads } = await import(`${L}/src/domain/density/densityCreateBoundary.js`);
const { DEFAULT_CONFIG } = await import(`${L}/src/store/configSlice.js`);
const { deriveDailyLifeSlot, DAILY_LIFE_SLOTS } = await import(`${L}/src/domain/dailyLife.js`);
await loadGenerationLawPayloads();
for (const size of ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis']) {
  const seed = `hxd-${size}-${I}`;
  const rec = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed, customContent: {} });
  const stress = (rec.config?.stressTypes ?? []).join(',') || rec.config?.stressType || 'none';
  console.log(`\n== ${seed} · ${rec.name} · ${size} · stress: ${stress}`);
  for (const key of DAILY_LIFE_SLOTS) {
    let t; try { t = deriveDailyLifeSlot(key, rec)?.text; } catch (e) { t = `!! ${e.message}`; }
    console.log(`  ${key.padEnd(21)} ${t ? t : '(empty)'}`);
  }
}
