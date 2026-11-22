// CENSUS-2 births: every seed of SEEDS (env, one per line), born in TREE (env) exactly as the census and the readers
// born them (seedcfg.mjs), written to OUT/corpus.ndjson.gz. Exits non-zero on any error (a census of a partial corpus
// is not a census).
import fs from 'node:fs'; import zlib from 'node:zlib';
import { makeCfgFor } from './seedcfg.mjs';
const R = process.env.TREE + '/src'; const OUT = process.env.OUT;
const { generateSettlementPipeline } = await import(R + '/generators/generateSettlementPipeline.js');
const { birthConfig, loadGenerationLawPayloads } = await import(R + '/domain/density/densityCreateBoundary.js');
const { DEFAULT_CONFIG } = await import(R + '/store/configSlice.js');
await loadGenerationLawPayloads();
const cfgFor = makeCfgFor(birthConfig, DEFAULT_CONFIG);
const seeds = fs.readFileSync(process.env.SEEDS, 'utf8').trim().split('\n').filter(Boolean);
const out = zlib.createGzip(); const done = new Promise((r) => out.pipe(fs.createWriteStream(OUT + '/corpus.ndjson.gz')).on('finish', r));
let n = 0, err = 0;
for (const seed of seeds) { try { const s = generateSettlementPipeline(cfgFor(seed), null, { seed, customContent: {} }); out.write(JSON.stringify({ seed, s }) + '\n'); n++; } catch (e) { err++; console.error(seed, e.message); } }
out.end(); await done; console.log('births', n, 'errors', err);
process.exit(err || n !== seeds.length ? 1 : 0);
