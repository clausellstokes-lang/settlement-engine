const L = process.argv[2];
const { generateSettlementPipeline } = await import(`${L}/src/generators/generateSettlementPipeline.js`);
const { birthConfig, loadGenerationLawPayloads } = await import(`${L}/src/domain/density/densityCreateBoundary.js`);
const { DEFAULT_CONFIG } = await import(`${L}/src/store/configSlice.js`);
const { deriveDailyLifeSlot } = await import(`${L}/src/domain/dailyLife.js`);
await loadGenerationLawPayloads();
for (const size of ['thorp', 'hamlet']) {
  const rec = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed: `hxd-${size}-3`, customContent: {} });
  const c = deriveDailyLifeSlot('child_warnings', rec);
  console.log(size, rec.name, '| threat', rec.config?.monsterThreat, '| tensions:', JSON.stringify((rec.history?.currentTensions ?? []).map((t) => ({ type: t.type, sev: t.severity ?? t.intensity ?? null }))));
  console.log('   child:', c.text);
  console.log('   references:', JSON.stringify(c.references ?? null).slice(0, 500));
  console.log('   keys of slot:', Object.keys(c).join(','));
}
