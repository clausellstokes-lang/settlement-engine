// ORDER-MEASURE-1 · the golden corpus (tests/helpers/goldenMasterCorpus.js, its 525 rows) hashed in a tree, exactly as
// generatorGoldenMaster.test.js :: hashFor births them: node goldencmp.mjs <tree> <out.json>. Two trees' files compared
// key by key say whether a candidate moves the golden itself, apart from whatever drift the base already carries.
import fs from 'node:fs'; import crypto from 'node:crypto';
const T = process.argv[2];
const { goldenCorpus, keyOf } = await import(T + '/tests/helpers/goldenMasterCorpus.js');
const { generateSettlementPipeline } = await import(T + '/src/generators/generateSettlementPipeline.js');
const out = {};
for (const config of goldenCorpus()) { const { _seed, ...cfg } = config; const s = generateSettlementPipeline(cfg, null, { seed: _seed, customContent: {} }); out[keyOf(config)] = crypto.createHash('sha256').update(JSON.stringify(s)).digest('hex'); }
fs.writeFileSync(process.argv[3], JSON.stringify(out)); console.log('hashed', Object.keys(out).length);
