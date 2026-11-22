const tree = process.argv[2];
const { generateSettlementPipeline } = await import(`${tree}/src/generators/generateSettlementPipeline.js`);
const { goldenCorpus, keyOf } = await import(`${tree}/tests/helpers/goldenMasterCorpus.js`);
const rows = goldenCorpus();
const { _seed, ...cfg } = rows[0];
const s = generateSettlementPipeline(cfg, null, { seed: _seed, customContent: {} });
console.log(keyOf(rows[0]), Object.keys(s).join(','));
console.log(JSON.stringify({name:s.name, settType:s.settType, tier:s.tier, population:s.population, prosperity:s.economicState?.prosperity, ps:Object.keys(s.powerStructure||{}), f0:s.powerStructure?.factions?.[0], stress:s.stress}).slice(0,3000));
