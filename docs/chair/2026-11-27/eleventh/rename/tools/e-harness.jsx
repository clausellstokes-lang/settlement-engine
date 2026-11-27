// (E) one tree's owner pages over a plan: born, stamped, the page's town id set for the scratch tree's re-keyed sites
// (globalThis.__TOWN_ID: the current tree never reads it), every tab walked + the non-DOM surfaces, picks logged.
import { ownerPage } from './rename-harness.jsx';
import { generateSettlementPipeline } from 'TREE/src/generators/generateSettlementPipeline.js';
import { withPublicProse } from 'TREE/src/domain/display/publicProse.js';
import { composePublicProse } from 'TREE/src/components/new/publicProseCompose.js';
import { birthConfig, loadGenerationLawPayloads } from 'TREE/src/domain/density/densityCreateBoundary.js';
import { appendFileSync } from 'node:fs';
export async function run(plan, out) {
  await loadGenerationLawPayloads();
  for (const row of plan) {
    let line;
    try {
      const born = generateSettlementPipeline(birthConfig(row.config), null, { seed: row.seed, customContent: {} });
      globalThis.__TOWN_ID = born.id;
      const t = withPublicProse(born, composePublicProse(born));
      const P = await ownerPage(t);
      line = { seed: row.seed, size: row.size, id: born.id, name: born.name, views: P.views, picks: P.picks };
    } catch (e) { line = { seed: row.seed, error: String(e?.stack || e).slice(0, 1500) }; }
    globalThis.__TOWN_ID = undefined;
    appendFileSync(out, `${JSON.stringify(line)}\n`);
    console.log(row.seed);
  }
}
