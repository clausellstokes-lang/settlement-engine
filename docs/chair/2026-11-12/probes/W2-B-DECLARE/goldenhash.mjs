// Hash the generator golden master's 525 configurations in TREE exactly as its test does; write {key: hash}.
import { createHash } from 'node:crypto'; import fs from 'node:fs';
const T = process.env.TREE;
const { goldenCorpus, keyOf } = await import(`${T}/tests/helpers/goldenMasterCorpus.js`);
const { generateSettlementPipeline } = await import(`${T}/src/generators/generateSettlementPipeline.js`);
const out = {};
for (const config of goldenCorpus()) { const { _seed, ...cfg } = config; const s = generateSettlementPipeline(cfg, null, { seed: _seed, customContent: {} }); out[keyOf(config)] = createHash('sha256').update(JSON.stringify(s)).digest('hex'); }
fs.writeFileSync(process.argv[2], JSON.stringify(out));
console.log(Object.keys(out).length);
