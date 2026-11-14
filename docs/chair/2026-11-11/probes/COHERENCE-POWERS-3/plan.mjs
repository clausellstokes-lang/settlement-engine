// node plan.mjs <probe tree> <which> <shard> <n> <out.jsonl> — per birth: every resize plan and fold, the final roster, the card count
import path from 'node:path'; import fs from 'node:fs';
import { jobsFor } from './corpus.mjs';
const tree = path.resolve(process.argv[2]); const imp = (p) => import(path.join(tree, p));
const [which, shard, n, out] = [process.argv[3], +process.argv[4], +process.argv[5], process.argv[6]];
const { generateSettlementPipeline } = await imp('src/generators/generateSettlementPipeline.js');
const { loadGenerationLawPayloads } = await imp('src/domain/density/densityCreateBoundary.js');
await loadGenerationLawPayloads();
const fd = fs.openSync(out, 'w');
for (const j of (await jobsFor(imp, which)).filter((_, i) => i % n === shard)) {
  globalThis.__probe = {};
  const s = generateSettlementPipeline(j.cfg, null, { seed: j.seed, customContent: {} });
  fs.writeSync(fd, JSON.stringify({ key: j.key, tier: j.tier, stress: j.stress, cards: (s.npcs || []).length, plans: globalThis.__probe.plans || [], folds: globalThis.__probe.folds || [], pushed: globalThis.__probe.pushed || [],
    roster: (s.powerStructure?.factions || []).map((f) => [f.faction, f.power]) }) + '\n');
}
fs.closeSync(fd);
