// (F) the stored sentences that hold the town's name: births a plan and writes, per birth, every string leaf of the record
// that holds the name (path, text). Births only; no render.
import { generateSettlementPipeline } from 'TREE/src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from 'TREE/src/domain/density/densityCreateBoundary.js';
import { appendFileSync } from 'node:fs';
export async function run(plan, out) {
  await loadGenerationLawPayloads();
  for (const row of plan) {
    const t = generateSettlementPipeline(birthConfig(row.config), null, { seed: row.seed, customContent: {} });
    const nm = t.name; const re = new RegExp(`\\b${nm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`);
    const leaves = [];
    const walk = (v, p) => { if (typeof v === 'string') { if (p !== 'name' && re.test(v)) leaves.push([p, v]); } else if (Array.isArray(v)) v.forEach((x, i) => walk(x, `${p}[${i}]`)); else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) walk(x, p ? `${p}.${k}` : k); };
    walk(t, '');
    appendFileSync(out, `${JSON.stringify({ seed: row.seed, name: nm, leaves })}\n`);
  }
  console.log('done');
}
