// BIRTH-AUDIT: the 525 reference configurations (tests/helpers/goldenMasterCorpus.js), born exactly as the golden master
// births them (as docs/chair/2026-11-16/bar6/AUDIT/ref525-F.mjs does), written as a corpus { seed: <key>, s } a line.
//   TREE=<root> OUT=<dir> node docs/chair/2026-11-17/birth/probes/birthsRef.mjs   (BIRTH_RULE=<rules> for a prototype tree)
import fs from 'node:fs'; import zlib from 'node:zlib'; import path from 'node:path';
const TREE = path.resolve(process.env.TREE || '.');
const { generateSettlementPipeline } = await import(TREE + '/src/generators/generateSettlementPipeline.js');
const { loadGenerationLawPayloads } = await import(TREE + '/src/domain/density/densityCreateBoundary.js');
const { goldenCorpus, keyOf } = await import(TREE + '/tests/helpers/goldenMasterCorpus.js');
await loadGenerationLawPayloads();
const out = zlib.createGzip(); const done = new Promise((r) => out.pipe(fs.createWriteStream(process.env.OUT + '/corpus.ndjson.gz')).on('finish', r));
let n = 0, err = 0;
for (const row of goldenCorpus()) { const key = keyOf(row); const { _seed, ...cfg } = row;
  try { const s = generateSettlementPipeline(cfg, null, { seed: _seed, customContent: {} }); out.write(JSON.stringify({ seed: key, s }) + '\n'); n++; } catch (e) { err++; console.error(key, e.message); } }
out.end(); await done; console.log('ref births', n, 'errors', err); process.exit(err ? 1 : 0);
