// node whole.mjs <tree> <which> <shard> <nshards> <out.ndjson.gz> — every birth's whole record, gzipped, one line each,
// with the coup label (read, not stored) beside it; shards are in the corpus's job order, so two trees' shards pair line
// by line (wholediff.mjs).
import path from 'node:path'; import fs from 'node:fs'; import zlib from 'node:zlib';
import { jobsFor } from './corpus.mjs';
const tree = path.resolve(process.argv[2]); const imp = (p) => import(path.join(tree, p));
const [which, shard, nshards, out] = [process.argv[3], +process.argv[4], +process.argv[5], process.argv[6]];
const { generateSettlementPipeline } = await imp('src/generators/generateSettlementPipeline.js');
const { loadGenerationLawPayloads } = await imp('src/domain/density/densityCreateBoundary.js');
const { coupContenders, coupRiskLabel } = await imp('src/domain/rulingPowerCoup.js');
await loadGenerationLawPayloads();
const gz = zlib.createGzip({ level: 4 }); const ws = fs.createWriteStream(out); gz.pipe(ws);
for (const j of (await jobsFor(imp, which)).filter((_, i) => i % nshards === shard)) {
  const s = generateSettlementPipeline(j.cfg, null, { seed: j.seed, customContent: {} });
  let coup = null; try { const c = coupRiskLabel(coupContenders(s)); coup = typeof c === 'string' ? c : c?.label ?? null; } catch { coup = 'ERR'; }
  const line = JSON.stringify({ key: j.key, c: j.c, tier: j.tier, stress: j.stress, coup, rec: s }) + '\n';
  if (!gz.write(line)) await new Promise((r) => gz.once('drain', r));
}
gz.end(); await new Promise((r) => ws.on('finish', r));
