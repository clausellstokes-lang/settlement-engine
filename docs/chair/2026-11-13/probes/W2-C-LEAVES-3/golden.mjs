// Field diff over the golden master's 525 configurations: births each config in tree T, writes key -> JSON.
import fs from 'node:fs'; import zlib from 'node:zlib';
const T=process.env.TREE; const OUT=process.env.OUT;
const { generateSettlementPipeline } = await import(T+'/src/generators/generateSettlementPipeline.js');
const { goldenCorpus, keyOf } = await import(T+'/tests/helpers/goldenMasterCorpus.js');
const rows = typeof goldenCorpus === "function" ? goldenCorpus() : goldenCorpus; const out=zlib.createGzip(); out.pipe(fs.createWriteStream(OUT));
let n=0; for (const c of rows) { const { _seed, ...cfg } = c; const s = generateSettlementPipeline(cfg, null, { seed: _seed, customContent: {} }); out.write(JSON.stringify({ seed: keyOf(c), s }) + '\n'); n++; }
out.end(); console.log('golden configs', n);
