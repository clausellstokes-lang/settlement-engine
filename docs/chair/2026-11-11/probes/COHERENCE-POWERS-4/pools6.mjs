// node pools6.mjs <tree> <which> <shard> <nshards> <out.json> — the six pools the repetition guard reads with no row: every
// draw the presumption ledger notes (refused draws not counted, the guard's own rule), per corpus: draws, towns, lines.
import path from 'node:path'; import fs from 'node:fs';
import { jobsFor } from './corpus.mjs';
const tree = path.resolve(process.argv[2]); const imp = (p) => import(path.join(tree, p));
const [which, shard, nshards, out] = [process.argv[3], +process.argv[4], +process.argv[5], process.argv[6]];
const { generateSettlementPipeline } = await imp('src/generators/generateSettlementPipeline.js');
const { loadGenerationLawPayloads } = await imp('src/domain/density/densityCreateBoundary.js');
const { withPresumptionLedger } = await imp('src/domain/facts/presumptionLedger.js');
await loadGenerationLawPayloads();
const SIX = ['magic__contested__dominant', 'magic__corruption__dominant', 'magic__economic_stress__dominant', 'magic__governance_fractured__dominant',
  'magic__stable__dominant', 'other__corruption__dominant'].map((p) => `NPC_STRUCTURE.${p}`);
const t = {};
for (const j of (await jobsFor(imp, which)).filter((_, i) => i % nshards === shard)) {
  const { ledger } = withPresumptionLedger(() => generateSettlementPipeline(j.cfg, null, { seed: j.seed, customContent: {} }));
  const c = j.c === 'G' ? 'R' : j.c; const seen = new Set();
  for (const e of ledger) {
    if (e.resolvedBy === 'none' || !SIX.includes(e.pool)) continue;
    const k = `${e.pool}|${c}`; t[k] ||= { draws: 0, towns: 0, lines: {} }; t[k].draws++; t[k].lines[e.lineId] = (t[k].lines[e.lineId] || 0) + 1;
    if (!seen.has(k)) { seen.add(k); t[k].towns++; }
  }
}
fs.writeFileSync(out, JSON.stringify(t));
