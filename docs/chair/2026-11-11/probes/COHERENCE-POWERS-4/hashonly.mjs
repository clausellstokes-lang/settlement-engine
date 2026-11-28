// node hashonly.mjs <tree> <which> <shard> <nshards> <out.jsonl> — the whole record's sha256 per birth (L3)
import path from 'node:path'; import fs from 'node:fs'; import { createHash } from 'node:crypto';
import { jobsFor } from './corpus.mjs';
const tree = path.resolve(process.argv[2]); const imp = (p) => import(path.join(tree, p));
const [which, shard, nshards, out] = [process.argv[3], +process.argv[4], +process.argv[5], process.argv[6]];
const { generateSettlementPipeline } = await imp('src/generators/generateSettlementPipeline.js');
const { loadGenerationLawPayloads } = await imp('src/domain/density/densityCreateBoundary.js');
await loadGenerationLawPayloads();
const fd = fs.openSync(out, 'w');
for (const j of (await jobsFor(imp, which)).filter((_, i) => i % nshards === shard)) {
  const s = generateSettlementPipeline(j.cfg, null, { seed: j.seed, customContent: {} });
  fs.writeSync(fd, JSON.stringify({ key: j.key, c: j.c, hash: createHash('sha256').update(JSON.stringify(s)).digest('hex') }) + '\n');
}
fs.closeSync(fd);
