const L = process.argv[2];
const { generateSettlementPipeline } = await import(`${L}/src/generators/generateSettlementPipeline.js`);
const { birthConfig, loadGenerationLawPayloads } = await import(`${L}/src/domain/density/densityCreateBoundary.js`);
const { DEFAULT_CONFIG } = await import(`${L}/src/store/configSlice.js`);
const { defenceOf } = await import(`${L}/src/domain/facts/defence.js`);
const { liveInstitutions } = await import(`${L}/src/domain/institutions/institutionRoster.js`);
await loadGenerationLawPayloads();
for (const size of ['thorp', 'hamlet', 'village', 'town', 'metropolis']) {
  const rec = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed: `hxd-${size}-3`, customContent: {} });
  const d = defenceOf(rec);
  const names = liveInstitutions(rec).map((i) => i.name);
  console.log(size, rec.name, '| defence:', JSON.stringify(d).slice(0, 420));
  console.log('   houses:', names.filter((n) => /wall|gate|watch|guard|garrison|militia|palisade|baker|smith|forge|market|trade|quarter/i.test(n)).join('; ') || '(none of: wall gate watch guard garrison militia palisade baker smith market trade)');
}
