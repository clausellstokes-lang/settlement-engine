// W2-B-DECLARE second seat — the fixture's towns (the cold list, REVIEW-W2B-COLD-LIST.json) born in TREE as the reviewer
// bore them: birthConfig({ ...DEFAULT_CONFIG, ...town.config }) → generateSettlementPipeline(config, null, { seed }).
// TREE=<tree> OUT=<dir> node fixtureBirths.mjs <cold-list.json>   → OUT/corpus.ndjson.gz, OUT/seeds.txt, OUT/fixture.configs.json
import fs from 'node:fs'; import zlib from 'node:zlib';
const R = process.env.TREE + '/src'; const OUT = process.env.OUT;
const { generateSettlementPipeline } = await import(R + '/generators/generateSettlementPipeline.js');
const { birthConfig, loadGenerationLawPayloads } = await import(R + '/domain/density/densityCreateBoundary.js');
const { DEFAULT_CONFIG } = await import(R + '/store/configSlice.js');
await loadGenerationLawPayloads();
const cold = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const towns = new Map(); for (const l of cold.lines) towns.set(l.town.seed, l.town.config);
const out = zlib.createGzip(); const done = new Promise((r) => out.pipe(fs.createWriteStream(OUT + '/corpus.ndjson.gz')).on('finish', r));
for (const [seed, config] of towns) out.write(JSON.stringify({ seed, s: generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...config }), null, { seed }) }) + '\n');
out.end(); await done;
fs.writeFileSync(OUT + '/seeds.txt', [...towns.keys()].join('\n') + '\n');
fs.writeFileSync(OUT + '/fixture.configs.json', JSON.stringify(Object.fromEntries(towns)));
console.log('fixture births', towns.size);
