// node text.mjs <probe tree> <which> <shard> <n> <out.jsonl> — F2: every string leaf of the record that names a power
// the town had before the resize and the final roster does not hold; and the rank lines that count powers
import path from 'node:path'; import fs from 'node:fs';
import { jobsFor } from './corpus.mjs';
const tree = path.resolve(process.argv[2]); const imp = (p) => import(path.join(tree, p));
const [which, shard, n, out] = [process.argv[3], +process.argv[4], +process.argv[5], process.argv[6]];
const { generateSettlementPipeline } = await imp('src/generators/generateSettlementPipeline.js');
const { loadGenerationLawPayloads } = await imp('src/domain/density/densityCreateBoundary.js');
await loadGenerationLawPayloads();
const RANK = /(Two|Three|Four|Five|Six) powers|the (two|three|four) above|no one leads|Close enough to/;
const fd = fs.openSync(out, 'w');
for (const j of (await jobsFor(imp, which)).filter((_, i) => i % n === shard)) {
  globalThis.__probe = {};
  const s = generateSettlementPipeline(j.cfg, null, { seed: j.seed, customContent: {} });
  const final = new Set((s.powerStructure?.factions || []).map((f) => f.faction));
  const before = new Set((globalThis.__probe.plans || []).flatMap((p) => p.roster || []).concat((globalThis.__probe.pushed || []).flatMap((p) => p.names)));
  const gone = [...before].filter((x) => x && !final.has(x));
  const hits = []; const ranks = [];
  const walk = (v, p) => {
    if (typeof v === 'string') {
      for (const g of gone) if (v.includes(g)) hits.push([p.replace(/\[\d+\]/g, '[]'), g, v.slice(0, 160)]);
      if (RANK.test(v) && /powerStructure\.factions\[\]\.desc/.test(p.replace(/\[\d+\]/g, '[]'))) ranks.push([p, v.match(RANK)[0], final.size]);
    } else if (v && typeof v === 'object') for (const k of Object.keys(v)) walk(v[k], `${p}${Array.isArray(v) ? `[${k}]` : `.${k}`}`);
  };
  walk(s, '');
  fs.writeSync(fd, JSON.stringify({ key: j.key, tier: j.tier, gone, hits, ranks }) + '\n');
}
fs.closeSync(fd);
