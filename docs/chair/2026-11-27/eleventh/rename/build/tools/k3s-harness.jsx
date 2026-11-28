// K3-1 (2), THE STOP's measure: the SHARED page (a reader's, from the served record) of a town whose first power is renamed by
// the product's writer and re-saved (the stamp composed after the rename), against the shared page of the town as born.
import { sharePage, renames } from './rename-harness.jsx';
import { generateSettlementPipeline } from 'TREE/src/generators/generateSettlementPipeline.js';
import { withPublicProse } from 'TREE/src/domain/display/publicProse.js';
import { composePublicProse } from 'TREE/src/components/new/publicProseCompose.js';
import { birthConfig, loadGenerationLawPayloads } from 'TREE/src/domain/density/densityCreateBoundary.js';
import { appendFileSync } from 'node:fs';
const stamp = (t) => withPublicProse(t, composePublicProse(t));
function diffViews(a, b) { const d = {}; for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) { const A = new Set(a[k] || []); const B = new Set(b[k] || []); const gone = [...A].filter((l) => !B.has(l)); const came = [...B].filter((l) => !A.has(l)); if (gone.length || came.length) d[k] = { gone, came }; } return d; }
export async function run(plan, out) {
  await loadGenerationLawPayloads();
  for (const row of plan) {
    let line;
    try {
      const born = generateSettlementPipeline(birthConfig(row.config), null, { seed: row.seed, customContent: {} });
      const v = renames(born).F; if (!v || v.skip) { appendFileSync(out, `${JSON.stringify({ seed: row.seed, skip: true })}\n`); continue; }
      const S0 = await sharePage(stamp(born)); const S1 = await sharePage(stamp(v.rec));
      line = { seed: row.seed, name: born.name, views: S0.views, vars: { F: { old: v.old, neu: v.neu, diff: diffViews(S0.views, S1.views), kinds: [] } }, kinds: [] };
    } catch (e) { line = { seed: row.seed, error: String(e?.stack || e).slice(0, 800) }; }
    appendFileSync(out, `${JSON.stringify(line)}\n`);
  }
}
